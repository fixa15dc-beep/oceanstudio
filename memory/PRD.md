# PRD — Ocean Studio (Portfólio de Roupas, Carros e HL para FiveM)

## Problema original
"quero criar um site portifolio/site pra colocar o curso de hl, roupas e carros pra fivem" — evolução: o cliente aprovou a réplica EXATA do portfólio de referência https://faction-folio.lovable.app/#catalogo (2026-10-17): hero com capa real, Catálogo (Roupas/Carros/HL), galeria do Maybach S-Class com miniaturas, seção Facs publicada pelo painel e rodapé centrado. Área de alunos (cursos) segue existindo em rotas próprias.

## Personas
- Visitante: jogador/criador de conteúdo FiveM GTA RP BR que quer aprender a editar HLs ou comprar packs.
- Aluno: cria conta, compra no Discord, acessa o conteúdo liberado no próprio perfil.
- Admin (dono): único; gerencia catálogo, conteúdo dos cursos e acessos por e-mail.

## Requisitos principais (Fase 1 — MVP)
1. Vitrine com identidade Ocean Studio: navy #0A192F + branco, Playfair Display + Outfit, logo da onda em SVG (nav, rodapé, favicon), reveal linha a linha, parallax sutil, marquee lento, tudo em pt-BR.
2. Curso de HL em destaque; grids de carros e roupas com foto, nome, preço em R$ e "Comprar no Discord".
3. Conta do aluno (cadastro/login, JWT httpOnly cookies, bcrypt, brute-force lockout 5 tentativas/15min).
4. Perfil do aluno: produtos liberados; player do curso 70/30 (vídeo embed YouTube/Vimeo ou texto) com módulos e aulas.
5. Painel admin: CRUD de produtos, editor de cursos (módulos/aulas), setar/remover acesso por e-mail (cria conta com senha temporária se o e-mail for novo), link do Discord configurável.
6. Conteúdo placeholder semeado no startup (5 produtos + settings), trocável pelo admin sem código.

## Arquitetura entregue

### Iteração 3 (2026-10-17) — Logo real, uploads 2 GB, site editável, redesign minimalista
- Assets reais do cliente: `/img/logo.png` (onda circular, fundo transparente) e `/img/wordmark.png` ("Ocean"), `favicon.png`. Usados em nav, rodapé, hero, painel, login.
- Uploads em partes (`/api/admin/uploads/init|chunk|complete`, chunks de 4 MB, até 2 GB, JPG/PNG/WEBP/GIF/MP4/WEBM/MOV), salvos em `/app/backend/uploads` (gitignored), servidos por `GET /api/uploads/{name}` com suporte a HTTP Range (seek no vídeo). Registro em `db.files`; limpeza de parciais >24h no startup. NOTA: armazenamento em disco local — em produção verificar persistência do volume.
- Conteúdo do site 100% editável: `GET /api/site` (defaults em `backend/site_content.py` + overrides em `settings.key=site`), `PUT /api/admin/site`, `POST /api/admin/site/reset`. Aba "Site" no painel edita marca, menu, hero, letreiro, catálogo (blocos), carros (galeria), HL (vídeos enviados ou YouTube), facs (textos) e rodapé. Aba "Arquivos" = biblioteca de mídia (upload múltiplo, copiar link, apagar). Campos de imagem em Produtos/Facs/Aulas aceitam upload (`MediaField`/`MediaListField`).
- Redesign minimalista/editorial: Manrope + JetBrains Mono, fundo #06091A, grão sutil, hairlines, labels numeradas (01 — Catálogo), hero com reveal linha a linha + parallax, Lenis smooth scroll, framer-motion reveals, marquee lento, galeria de carros com crossfade, seção HL com player nativo, facs em lista editorial.
- Testado (testing_agent iteração 1): 17/17 backend, 100% fluxos frontend (desktop + mobile).

### Iterações anteriores
- Réplica do portfólio (2026-10-17): Home idêntica à referência — hero (capa real ocean-CAPA, wordmark "Ocean" com redemoinho, "TODOS OS DIREITOS RESEVADOS ©"), Catálogo com 3 cards reais, Carros = galeria Maybach (8 fotos + miniaturas clicáveis + selo "Preto fosco"), Facs (CRUD no painel: nome + descrição + fotos por URL; empty state idêntico), rodapé centrado. Assets do cliente baixados para /img/ (hero-capa, cat-roupas, cat-hl, maybach-1..8). Fonte Poppins; navbar: Catálogo, Carros, Facs + pílula "Painel".
- Redesign (2026-10-17): tema dark na identidade da foto de referência (bg #050B18, cards #0A1220 arredondados, botões pill, fontes Sora + Outfit), logo circular da onda recriada em SVG (nav, rodapé, hero "Ocean" e favicon), banner cinematográfico gerado no hero, seção Catálogo com cards Roupas/Carros/HL.
- Backend FastAPI (server.py): auth JWT (access 60min + refresh 7d, cookies SameSite=none/secure), verificação de Origin em mutações, MongoDB (users, products, grants, settings, login_attempts, facs), índices únicos, seed de admin + produtos placeholder.
- Frontend React (CRA): Home (hero cinético, marquee, destaque HL, carros, roupas, como funciona, sobre/Discord), /entrar, /cadastro, /perfil, /curso/:pid, /admin (tabs Produtos, Cursos, Acessos, Configurações), ErrorBoundary, ScrollToTop, sonner toasts, data-testid em toda interação.

## Verificado (2026-10-17)
- curl: 5 produtos públicos, settings, registro/login admin e aluno, grant + bloqueio de grant duplicado, /me/access, conteúdo do curso (2 módulos/5 aulas), 403 aluno→admin, 401 anônimo, 401 senha errada.
- Playwright: home desktop/mobile sem overflow, menu mobile, login aluno → perfil → player de curso funcionando, login admin → painel (produtos, cursos, acessos).

## Backlog
- P0: (nenhum)
- P1 (Fase 2): depoimentos; FAQ; progresso de aulas concluídas; edição de facs já publicadas (hoje só criar/remover).
- P2 (Fase 3): SEO/preview de compartilhamento; downloads de materiais; pagamento automático online; thumbnails automáticas para vídeos enviados.

## Próximos passos
1. Dono sobe o banner/fotos/HLs reais pela aba "Arquivos" e ajusta textos pela aba "Site".
2. Conteúdo real das aulas via aba "Conteúdo dos Cursos" (vídeo enviado ou link).
