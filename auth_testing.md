# Auth Testing Playbook — Ocean Studio

## Stack
- FastAPI + MongoDB (motor) + JWT (PyJWT) httpOnly cookies + bcrypt
- Two roles: `admin` (single, seeded from backend/.env) and `student` (self-register)

## Credentials (also in /app/memory/test_credentials.md)
- Admin: admin@oceanstudio.com / ocean-admin-2025
- Env keys: JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD in /app/backend/.env

## MongoDB verification
```
mongosh
use test_database
db.users.find({}, {password_hash: 0})
db.products.countDocuments({})   # 5 seeded placeholder products
db.grants.find()
db.settings.find()
```
Verify: admin bcrypt hash starts with `$2b$`; unique index on users.email, products.id, grants (email+product_id).

## API testing
```
API=https://roupas-carros-fivem.preview.emergentagent.com

# Public
curl -s $API/api/products | python3 -m json.tool | head -40
curl -s $API/api/settings

# Register student (cookies jar)
curl -s -c /tmp/c1.txt -X POST $API/api/auth/register -H "Content-Type: application/json" \
  -d '{"name":"Aluno Teste","email":"aluno@teste.com","password":"teste123"}'

# Login (student or admin)
curl -s -c /tmp/c2.txt -X POST $API/api/auth/login -H "Content-Type: application/json" \
  -d '{"email":"admin@oceanstudio.com","password":"ocean-admin-2025"}'

# Me
curl -s -b /tmp/c2.txt $API/api/auth/me

# Admin: grant access by email (creates student account if missing -> returns generated_password)
curl -s -b /tmp/c2.txt -X POST $API/api/admin/grants -H "Content-Type: application/json" \
  -d '{"email":"aluno@teste.com","product_id":"<product_id>"}'

# Student sees granted products
curl -s -b /tmp/c1.txt $API/api/me/access
curl -s -b /tmp/c1.txt $API/api/me/products/<product_id>   # full course with modules

# Negative: student without grant -> 403
# Admin protected: student token on /api/admin/* -> 403
```

## Frontend flows
- / → vitrine pública (hero, marquee, destaque HL, carros, roupas, sobre/discord)
- /cadastro e /entrar → conta do aluno
- /perfil → produtos liberados
- /curso/:productId → player (módulos/aulas, vídeo embed ou texto)
- /admin → painel (Produtos, Cursos, Acessos, Config) restrito ao admin
