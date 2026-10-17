# PRD — Ocean Studio (Vitrine + Área de Alunos, FiveM)

## Problema original
"quero criar um site portifolio/site pra colocar o curso de hl, roupas e carros pra fivem" — vitrine dos cursos/packs com preço e compra fechada no Discord, área de alunos com acesso setado pelo dono.

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

## Arquitetura entregue (2026-10-17)
- Backend FastAPI (server.py): auth JWT (access 60min + refresh 7d, cookies SameSite=none/secure), verificação de Origin em mutações, MongoDB (users, products, grants, settings, login_attempts), índices únicos, seed de admin + produtos placeholder.
- Frontend React (CRA): Home (hero cinético, marquee, destaque HL, carros, roupas, como funciona, sobre/Discord), /entrar, /cadastro, /perfil, /curso/:pid, /admin (tabs Produtos, Cursos, Acessos, Configurações), ErrorBoundary, ScrollToTop, sonner toasts, data-testid em toda interação.

## Verificado (2026-10-17)
- curl: 5 produtos públicos, settings, registro/login admin e aluno, grant + bloqueio de grant duplicado, /me/access, conteúdo do curso (2 módulos/5 aulas), 403 aluno→admin, 401 anônimo, 401 senha errada.
- Playwright: home desktop/mobile sem overflow, menu mobile, login aluno → perfil → player de curso funcionando, login admin → painel (produtos, cursos, acessos).

## Backlog
- P0: (nenhum — MVP completo)
- P1 (Fase 2): fotos/nomes/preços reais; galeria de HLs; depoimentos; FAQ; progresso de aulas concluídas.
- P2 (Fase 3): SEO/preview de compartilhamento; downloads de materiais; pagamento automático online.

## Próximos passos
1. Dono troca placeholders pelos produtos reais no painel (/admin) e atualiza o link do Discord em Configurações.
2. Conteúdo real das aulas via aba "Conteúdo dos Cursos" (vídeo ou texto).
