import os
import uuid
import jwt
import bcrypt
import secrets
from datetime import datetime, timezone, timedelta
from pathlib import Path
from typing import List, Optional

from fastapi import FastAPI, APIRouter, HTTPException, Request, Response, Depends
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
from pydantic import BaseModel, Field, EmailStr
from bson import ObjectId, errors as bson_errors

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

app = FastAPI(title="Ocean Studio API")
api_router = APIRouter(prefix="/api")

JWT_ALGORITHM = "HS256"
MAX_FAILED_ATTEMPTS = 5
LOCKOUT_MINUTES = 15


def now():
    return datetime.now(timezone.utc)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def verify_password(plain: str, hashed: str) -> bool:
    try:
        return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def create_access_token(user_id: str, email: str, role: str) -> str:
    payload = {
        "sub": user_id,
        "email": email,
        "role": role,
        "type": "access",
        "exp": now() + timedelta(minutes=60),
    }
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def create_refresh_token(user_id: str) -> str:
    payload = {"sub": user_id, "type": "refresh", "exp": now() + timedelta(days=7)}
    return jwt.encode(payload, os.environ["JWT_SECRET"], algorithm=JWT_ALGORITHM)


def set_auth_cookies(response: Response, access: str, refresh: str):
    response.set_cookie("access_token", access, httponly=True, secure=True,
                        samesite="none", max_age=3600, path="/")
    response.set_cookie("refresh_token", refresh, httponly=True, secure=True,
                        samesite="none", max_age=604800, path="/")


def clear_auth_cookies(response: Response):
    response.delete_cookie("access_token", path="/")
    response.delete_cookie("refresh_token", path="/")


def check_origin(request: Request):
    origin = request.headers.get("origin")
    if not origin:
        return
    allowed = [o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip()]
    if origin not in allowed:
        raise HTTPException(status_code=403, detail="Origem não permitida")


def clean_doc(doc):
    if doc is None:
        return None
    doc = dict(doc)
    doc.pop("_id", None)
    for k, v in list(doc.items()):
        if isinstance(v, datetime):
            doc[k] = v.isoformat()
    return doc


def user_public(u) -> dict:
    return {
        "id": str(u["_id"]),
        "name": u.get("name", ""),
        "email": u.get("email", ""),
        "role": u.get("role", "student"),
        "created_at": u.get("created_at"),
    }


def normalize_email(email: str) -> str:
    return (email or "").strip().lower()


async def get_current_user(request: Request) -> dict:
    token = request.cookies.get("access_token")
    if not token:
        auth_header = request.headers.get("Authorization", "")
        if auth_header.startswith("Bearer "):
            token = auth_header[7:]
    if not token:
        raise HTTPException(status_code=401, detail="Não autenticado")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "access":
            raise HTTPException(status_code=401, detail="Token inválido")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sessão expirada")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")
    try:
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
    except (bson_errors.InvalidId, bson_errors.InvalidString):
        raise HTTPException(status_code=401, detail="Token inválido")
    if not user:
        raise HTTPException(status_code=401, detail="Usuário não encontrado")
    return user


async def require_admin(user: dict = Depends(get_current_user)) -> dict:
    if user.get("role") != "admin":
        raise HTTPException(status_code=403, detail="Acesso restrito ao administrador")
    return user


# ---------------- Models ----------------

class RegisterIn(BaseModel):
    name: str = Field(min_length=2, max_length=80)
    email: EmailStr
    password: str = Field(min_length=6, max_length=100)


class LoginIn(BaseModel):
    email: str
    password: str


class LessonIn(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    content_type: str = "text"
    video_url: Optional[str] = ""
    text: Optional[str] = ""


class ModuleIn(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    lessons: List[LessonIn] = []


class ProductIn(BaseModel):
    name: str
    description: str = ""
    price: float = 0
    category: str = "carros"
    type: str = "pack"
    image_url: str = ""
    featured: bool = False
    active: bool = True
    modules: List[ModuleIn] = []


class GrantIn(BaseModel):
    email: str
    product_id: str


class SettingsIn(BaseModel):
    discord_url: str


class FacIn(BaseModel):
    name: str
    description: str = ""
    images: List[str] = []


# ---------------- Public ----------------

@api_router.get("/")
async def root():
    return {"message": "Ocean Studio API"}


@api_router.get("/products")
async def list_products():
    docs = await db.products.find({"active": True}).sort([("featured", -1), ("created_at", 1)]).to_list(200)
    out = []
    for d in docs:
        c = clean_doc(d)
        c.pop("modules", None)
        out.append(c)
    return out


@api_router.get("/settings")
async def get_settings():
    s = await db.settings.find_one({"key": "main"})
    if not s:
        return {"discord_url": ""}
    return {"discord_url": s.get("discord_url", "")}


@api_router.get("/facs")
async def list_facs():
    docs = await db.facs.find({}).sort("created_at", -1).to_list(200)
    return [clean_doc(d) for d in docs]


# ---------------- Auth ----------------

@api_router.post("/auth/register")
async def register(body: RegisterIn, request: Request, response: Response):
    check_origin(request)
    email = normalize_email(body.email)
    existing = await db.users.find_one({"email": email})
    if existing:
        raise HTTPException(status_code=400, detail="E-mail já cadastrado")
    doc = {
        "name": body.name.strip(),
        "email": email,
        "password_hash": hash_password(body.password),
        "role": "student",
        "created_at": now(),
    }
    result = await db.users.insert_one(doc)
    user = await db.users.find_one({"_id": result.inserted_id})
    access = create_access_token(str(user["_id"]), email, "student")
    refresh = create_refresh_token(str(user["_id"]))
    set_auth_cookies(response, access, refresh)
    return user_public(user)


@api_router.post("/auth/login")
async def login(body: LoginIn, request: Request, response: Response):
    check_origin(request)
    email = normalize_email(body.email)
    ip = request.client.host if request.client else "unknown"
    identifier = f"{ip}:{email}"

    attempt = await db.login_attempts.find_one({"identifier": identifier})
    if attempt and attempt.get("locked_until") and now() < attempt["locked_until"]:
        raise HTTPException(status_code=429, detail="Muitas tentativas. Tente novamente em alguns minutos.")

    user = await db.users.find_one({"email": email})
    if not user or not verify_password(body.password, user.get("password_hash", "")):
        failed = (attempt.get("count", 0) if attempt else 0) + 1
        update = {"count": failed, "updated_at": now()}
        if failed >= MAX_FAILED_ATTEMPTS:
            update["locked_until"] = now() + timedelta(minutes=LOCKOUT_MINUTES)
            update["count"] = 0
        await db.login_attempts.update_one({"identifier": identifier}, {"$set": update}, upsert=True)
        raise HTTPException(status_code=401, detail="E-mail ou senha incorretos")

    await db.login_attempts.delete_one({"identifier": identifier})
    access = create_access_token(str(user["_id"]), user["email"], user.get("role", "student"))
    refresh = create_refresh_token(str(user["_id"]))
    set_auth_cookies(response, access, refresh)
    return user_public(user)


@api_router.post("/auth/logout")
async def logout(request: Request, response: Response):
    check_origin(request)
    clear_auth_cookies(response)
    return {"ok": True}


@api_router.get("/auth/me")
async def me(request: Request):
    user = await get_current_user(request)
    return user_public(user)


@api_router.post("/auth/refresh")
async def refresh(request: Request, response: Response):
    check_origin(request)
    token = request.cookies.get("refresh_token")
    if not token:
        raise HTTPException(status_code=401, detail="Não autenticado")
    try:
        payload = jwt.decode(token, os.environ["JWT_SECRET"], algorithms=[JWT_ALGORITHM])
        if payload.get("type") != "refresh":
            raise HTTPException(status_code=401, detail="Token inválido")
        user = await db.users.find_one({"_id": ObjectId(payload["sub"])})
        if not user:
            raise HTTPException(status_code=401, detail="Usuário não encontrado")
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Sessão expirada")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Token inválido")
    access = create_access_token(str(user["_id"]), user["email"], user.get("role", "student"))
    refresh_token = create_refresh_token(str(user["_id"]))
    set_auth_cookies(response, access, refresh_token)
    return user_public(user)


# ---------------- Student area ----------------

@api_router.get("/me/access")
async def my_access(request: Request):
    user = await get_current_user(request)
    grants = await db.grants.find({"email": user["email"]}).sort("granted_at", -1).to_list(200)
    product_ids = [g["product_id"] for g in grants]
    products = await db.products.find({"id": {"$in": product_ids}}).to_list(200)
    by_id = {p["id"]: clean_doc(p) for p in products}
    out = []
    for g in grants:
        p = by_id.get(g["product_id"])
        if not p or not p.get("active", True):
            continue
        p.pop("modules", None)
        p["granted_at"] = g.get("granted_at").isoformat() if isinstance(g.get("granted_at"), datetime) else g.get("granted_at")
        out.append(p)
    return out


@api_router.get("/me/products/{product_id}")
async def my_product(product_id: str, request: Request):
    user = await get_current_user(request)
    grant = await db.grants.find_one({"email": user["email"], "product_id": product_id})
    if not grant:
        raise HTTPException(status_code=403, detail="Você não tem acesso a este produto")
    p = await db.products.find_one({"id": product_id})
    if not p:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return clean_doc(p)


# ---------------- Admin ----------------

@api_router.get("/admin/products")
async def admin_products(_: dict = Depends(require_admin)):
    docs = await db.products.find({}).sort([("featured", -1), ("created_at", 1)]).to_list(500)
    return [clean_doc(d) for d in docs]


@api_router.post("/admin/products")
async def admin_create_product(body: ProductIn, request: Request, user: dict = Depends(require_admin)):
    check_origin(request)
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = now()
    await db.products.insert_one(doc)
    return clean_doc(await db.products.find_one({"id": doc["id"]}))


@api_router.put("/admin/products/{product_id}")
async def admin_update_product(product_id: str, body: ProductIn, request: Request, user: dict = Depends(require_admin)):
    check_origin(request)
    update = body.model_dump()
    res = await db.products.update_one({"id": product_id}, {"$set": update})
    if res.matched_count == 0:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    return clean_doc(await db.products.find_one({"id": product_id}))


@api_router.delete("/admin/products/{product_id}")
async def admin_delete_product(product_id: str, request: Request, user: dict = Depends(require_admin)):
    check_origin(request)
    await db.products.delete_one({"id": product_id})
    await db.grants.delete_many({"product_id": product_id})
    return {"ok": True}


@api_router.put("/admin/settings")
async def admin_update_settings(body: SettingsIn, request: Request, user: dict = Depends(require_admin)):
    check_origin(request)
    await db.settings.update_one({"key": "main"}, {"$set": {"discord_url": body.discord_url.strip()}}, upsert=True)
    return {"discord_url": body.discord_url.strip()}


@api_router.get("/admin/students")
async def admin_students(_: dict = Depends(require_admin)):
    students = await db.users.find({"role": "student"}).sort("created_at", -1).to_list(500)
    grants = await db.grants.find({}).to_list(1000)
    products = await db.products.find({}, {"id": 1, "name": 1}).to_list(500)
    product_names = {p["id"]: p["name"] for p in products}
    out = []
    for s in students:
        my_grants = [
            {"id": g["id"], "product_id": g["product_id"], "product_name": product_names.get(g["product_id"], "—"),
             "granted_at": g["granted_at"].isoformat() if isinstance(g.get("granted_at"), datetime) else g.get("granted_at")}
            for g in grants if g["email"] == s["email"]
        ]
        out.append({**user_public(s), "grants": my_grants})
    return out


@api_router.get("/admin/grants")
async def admin_grants(_: dict = Depends(require_admin)):
    grants = await db.grants.find({}).sort("granted_at", -1).to_list(1000)
    products = await db.products.find({}, {"id": 1, "name": 1}).to_list(500)
    product_names = {p["id"]: p["name"] for p in products}
    out = []
    for g in grants:
        out.append({
            "id": g["id"],
            "email": g["email"],
            "product_id": g["product_id"],
            "product_name": product_names.get(g["product_id"], "Produto removido"),
            "granted_at": g["granted_at"].isoformat() if isinstance(g.get("granted_at"), datetime) else g.get("granted_at"),
        })
    return out


@api_router.post("/admin/grants")
async def admin_create_grant(body: GrantIn, request: Request, user: dict = Depends(require_admin)):
    check_origin(request)
    email = normalize_email(body.email)
    if not email:
        raise HTTPException(status_code=400, detail="Informe o e-mail do cliente")
    product = await db.products.find_one({"id": body.product_id})
    if not product:
        raise HTTPException(status_code=404, detail="Produto não encontrado")
    existing_grant = await db.grants.find_one({"email": email, "product_id": body.product_id})
    if existing_grant:
        raise HTTPException(status_code=400, detail="Esse cliente já tem acesso a este produto")

    generated_password = None
    existing_user = await db.users.find_one({"email": email})
    if not existing_user:
        generated_password = secrets.token_urlsafe(9)
        await db.users.insert_one({
            "name": email.split("@")[0],
            "email": email,
            "password_hash": hash_password(generated_password),
            "role": "student",
            "created_at": now(),
        })

    grant = {
        "id": str(uuid.uuid4()),
        "email": email,
        "product_id": body.product_id,
        "granted_by": user["email"],
        "granted_at": now(),
    }
    await db.grants.insert_one(grant)
    return {
        "id": grant["id"],
        "email": email,
        "product_id": body.product_id,
        "product_name": product["name"],
        "granted_at": grant["granted_at"].isoformat(),
        "account_created": existing_user is None,
        "generated_password": generated_password,
    }


@api_router.delete("/admin/grants/{grant_id}")
async def admin_delete_grant(grant_id: str, request: Request, user: dict = Depends(require_admin)):
    check_origin(request)
    await db.grants.delete_one({"id": grant_id})
    return {"ok": True}


@api_router.post("/admin/facs")
async def admin_create_fac(body: FacIn, request: Request, user: dict = Depends(require_admin)):
    check_origin(request)
    doc = body.model_dump()
    doc["id"] = str(uuid.uuid4())
    doc["created_at"] = now()
    await db.facs.insert_one(doc)
    return clean_doc(await db.facs.find_one({"id": doc["id"]}))


@api_router.delete("/admin/facs/{fac_id}")
async def admin_delete_fac(fac_id: str, request: Request, user: dict = Depends(require_admin)):
    check_origin(request)
    await db.facs.delete_one({"id": fac_id})
    return {"ok": True}


# ---------------- Seed ----------------

async def seed_admin():
    admin_email = normalize_email(os.environ.get("ADMIN_EMAIL", "admin@example.com"))
    admin_password = os.environ.get("ADMIN_PASSWORD", "admin123")
    existing = await db.users.find_one({"email": admin_email})
    if existing is None:
        await db.users.insert_one({
            "email": admin_email,
            "password_hash": hash_password(admin_password),
            "name": "Ocean Studio",
            "role": "admin",
            "created_at": now(),
        })


def lesson(title, content_type="text", text="", video_url=""):
    return {"id": str(uuid.uuid4()), "title": title, "content_type": content_type,
            "text": text, "video_url": video_url}


async def seed_content():
    if await db.settings.count_documents({}) == 0:
        await db.settings.insert_one({"key": "main", "discord_url": "https://discord.gg/oceanstudio"})

    if await db.products.count_documents({}) > 0:
        return

    products = [
        {
            "id": str(uuid.uuid4()),
            "name": "Curso de HL",
            "description": "Aprenda a produzir highlights profissionais de FiveM GTA RP: cortes, ritmo, sincronia com a música e a identidade visual que faz o seu edit viralizar.",
            "price": 49.90,
            "category": "hl",
            "type": "curso",
            "featured": True,
            "active": True,
            "image_url": "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?crop=entropy&cs=srgb&fm=jpg&q=85",
            "created_at": now(),
            "modules": [
                {"id": str(uuid.uuid4()), "title": "Preparação e Base", "lessons": [
                    lesson("O que é um HL e por que ele viraliza", "text",
                           "Bem-vindo ao Ocean Studio! Nesta aula você vai entender o que define um highlight de FiveM: os 20 a 60 segundos que resumem a melhor parte da sua gameplay.\n\nUm HL funciona quando tem três elementos: um momento forte (a jogada), ritmo (os cortes) e impacto visual (a cor e os efeitos). Nós vamos trabalhar os três ao longo do curso."),
                    lesson("Escolhendo as clipes certas na sua gameplay", "text",
                           "Nem toda jogada vira HL. Grave sempre em alta resolução (60fps se possível) e anote os timestamps dos momentos fortes logo depois de jogar.\n\nRegra prática: se você precisa de mais de 10 segundos para a pessoa entender o que está acontecendo, o clipe está longo demais."),
                    lesson("Tour pelo editor: configuração inicial", "video", "", "https://www.youtube.com/watch?v=9bZkp7q19f0"),
                ]},
                {"id": str(uuid.uuid4()), "title": "Edição na Prática", "lessons": [
                    lesson("Ritmo, cortes e sincronia com a música", "video", "", "https://www.youtube.com/watch?v=9bZkp7q19f0"),
                    lesson("Exportação com qualidade máxima", "text",
                           "Exporte em 1080p (ou 1440p se a fonte for boa), taxa de bits alta e formato H.264 para YouTube e TikTok. Nesta aula deixamos as configurações exatas para cada plataforma."),
                ]},
            ],
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Curso de Carros",
            "description": "Passo a passo para instalar, configurar e dar aquele acabamento profissional nos carros do seu servidor FiveM.",
            "price": 39.90,
            "category": "carros",
            "type": "curso",
            "featured": False,
            "active": True,
            "image_url": "https://images.unsplash.com/photo-1673170717377-93fd50d26689?crop=entropy&cs=srgb&fm=jpg&q=85",
            "created_at": now(),
            "modules": [
                {"id": str(uuid.uuid4()), "title": "Primeiros Passos", "lessons": [
                    lesson("Instalando seu primeiro add-on", "text",
                           "Aula de exemplo — substitua pelo conteúdo real pelo painel do administrador."),
                ]},
            ],
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Pack de Carros",
            "description": "Packs de veículos otimizados para o seu servidor, com handling ajustado e texturas em alta qualidade.",
            "price": 29.90,
            "category": "carros",
            "type": "pack",
            "featured": False,
            "active": True,
            "image_url": "https://images.unsplash.com/photo-1716687504751-6788a860cbfe?crop=entropy&cs=srgb&fm=jpg&q=85",
            "created_at": now(),
            "modules": [],
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Curso de Roupas",
            "description": "Aprenda a criar e ajustar roupas exclusivas para FiveM, do modelo ao servidor, com acabamento limpo.",
            "price": 34.90,
            "category": "roupas",
            "type": "curso",
            "featured": False,
            "active": True,
            "image_url": "https://images.unsplash.com/photo-1508216310976-c518daae0cdc?crop=entropy&cs=srgb&fm=jpg&q=85",
            "created_at": now(),
            "modules": [
                {"id": str(uuid.uuid4()), "title": "Primeiros Passos", "lessons": [
                    lesson("Ferramentas e preparação do projeto", "text",
                           "Aula de exemplo — substitua pelo conteúdo real pelo painel do administrador."),
                ]},
            ],
        },
        {
            "id": str(uuid.uuid4()),
            "name": "Pack de Roupas",
            "description": "Packs de roupas exclusivas para a sua comunidade, prontos para instalar no servidor.",
            "price": 19.90,
            "category": "roupas",
            "type": "pack",
            "featured": False,
            "active": True,
            "image_url": "https://images.pexels.com/photos/18484864/pexels-photo-18484864.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=650&w=940",
            "created_at": now(),
            "modules": [],
        },
    ]
    await db.products.insert_many(products)


@app.on_event("startup")
async def startup():
    await db.users.create_index("email", unique=True)
    await db.products.create_index("id", unique=True)
    await db.grants.create_index([("email", 1), ("product_id", 1)], unique=True)
    await db.login_attempts.create_index("identifier")
    await seed_admin()
    await seed_content()


@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()


app.include_router(api_router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[o.strip() for o in os.environ.get("CORS_ORIGINS", "").split(",") if o.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
