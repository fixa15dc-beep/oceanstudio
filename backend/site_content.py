"""Default content of the public site. Everything here can be overridden from the admin panel."""
import copy

DEFAULT_SITE = {
    "brand": {
        "name": "Ocean Studio",
        "logo_url": "/img/logo.png",
        "wordmark_url": "/img/wordmark.png",
    },
    "nav": [
        {"label": "Catálogo", "target": "catalogo"},
        {"label": "Carros", "target": "carros"},
        {"label": "HL", "target": "hl"},
        {"label": "Facs", "target": "facs"},
    ],
    "hero": {
        "eyebrow": "Estúdio criativo para FiveM",
        "title": "Identidade para\nsua fac.",
        "subtitle": "Roupas, carros e HL criados sob medida. Do esboço à entrega, com acabamento profissional e prontos para o seu servidor.",
        "cta_primary": "Ver catálogo",
        "cta_primary_target": "catalogo",
        "cta_secondary": "Falar no Discord",
        "bg_image": "/img/hero-capa.jpg",
        "note": "Todos os direitos reservados ©",
    },
    "marquee": {
        "enabled": True,
        "text": "Roupas · Carros · HL · Facs · Sob medida para FiveM ·",
    },
    "catalog": {
        "label": "01 — Catálogo",
        "title": "Catálogo",
        "subtitle": "Cada peça nasce do zero, seguindo a identidade da fac que a encomenda.",
        "items": [
            {"title": "Roupas", "text": "Corte, cor e acabamento desenhados para a sua fac.", "image": "/img/cat-roupas.jpg", "target": "facs"},
            {"title": "Carros", "text": "Pintura, rodas e interior no padrão da sua fac.", "image": "/img/maybach-1.webp", "target": "carros"},
            {"title": "HL", "text": "O detalhe que fecha a identidade da sua fac.", "image": "/img/cat-hl.jpg", "target": "hl"},
        ],
    },
    "cars": {
        "label": "02 — Carros",
        "title": "Maybach S-Class",
        "text": "Pintura fosca, rodas e interior desenvolvidos no padrão da fac. Projeto pronto para rodar no servidor.",
        "badge": "Preto fosco",
        "images": [
            "/img/maybach-1.webp", "/img/maybach-2.webp", "/img/maybach-3.webp", "/img/maybach-4.webp",
            "/img/maybach-5.webp", "/img/maybach-6.webp", "/img/maybach-7.jpg", "/img/maybach-8.jpg",
        ],
    },
    "hl": {
        "label": "03 — HL",
        "title": "Highlights",
        "text": "Edits curtos, ritmo preciso e identidade visual. Envie seus vídeos pelo painel e eles aparecem aqui.",
        "videos": [],
    },
    "facs": {
        "label": "04 — Facs",
        "title": "Facs",
        "text": "Projetos publicados pelo painel. Envie o nome e as fotos e a página é criada na hora.",
    },
    "footer": {
        "tagline": "Roupas, carros e HL sob medida para facs no FiveM.",
        "copyright": "Ocean Studio © Todos os direitos reservados",
    },
}


def merge_site(stored):
    """Merge stored overrides on top of the defaults, section by section."""
    out = copy.deepcopy(DEFAULT_SITE)
    if not isinstance(stored, dict):
        return out
    for section, value in stored.items():
        if section not in out:
            continue
        if isinstance(out[section], dict) and isinstance(value, dict):
            out[section].update(value)
        elif isinstance(out[section], list) and isinstance(value, list):
            out[section] = value
    return out
