# Ocean Studio — Vitrine + Área de Alunos (Curso de HL, Roupas e Carros para FiveM)

Site limpo com a identidade visual da Ocean Studio que une vitrine e área de alunos: divulga o curso de HL (highlights de FiveM GTA RP) e os cursos/packs de carros e roupas, com preço e botão que leva ao Discord para fechar a compra. Depois da compra, o dono "seta" o acesso no perfil do cliente, que passa a ver o conteúdo do curso específico que recebeu ao logar no site.

## Para quem é

- **Visitante**: jogador e criador de conteúdo da comunidade FiveM GTA RP BR que quer aprender a editar HLs ou adquirir cursos/packs de carros e roupas.
- **Aluno (cliente)**: cria conta no site e, após comprar no Discord, acessa pelo próprio perfil apenas o curso que recebeu.
- **Dono (admin)**: gerencia o catálogo, cria o conteúdo dos cursos e seta/remove acessos dos clientes sem mexer em código.

## Recursos principais e experiência

1. **Hero cinético com a marca Ocean Studio** — logo da onda recriada em SVG (também usada como favicon), reveal linha a linha ao carregar, parallax sutil e scroll com momentum.
2. **Vitrine** — curso de HL em destaque próprio; catálogos de carros e roupas em cards com foto tratada, nome, preço em R$ e botão "Comprar no Discord"; marquee editorial lento; seção sobre/contato com chamada para o Discord.
3. **Conta de aluno** — cadastro e login próprios do cliente no site (e-mail e senha), separado do login do administrador.
4. **Área de perfil do aluno** — lista os produtos/cursos que ele tem acesso; dentro de cada curso, o conteúdo liberado organizado em módulos e aulas (aula com link de vídeo incorporado ou texto).
5. **Painel administrativo** — em uma tela o admin: gerencia produtos da vitrine e o link do Discord; cria cursos com módulos/aulas; e "seta" acesso buscando o cliente pelo e-mail e liberando ou removendo o curso/pack comprado.
6. Conteúdo de exemplo (nomes, preços, fotos e aulas placeholder) que o admin troca depois pelos reais.

## Fluxo do usuário

**Visitante**: abre a home → rola pela vitrine → clica em "Comprar no Discord" → fecha a compra no servidor do Discord.

**Aluno**: se cadastra no site → compra no Discord → o admin seta o acesso no painel → o aluno loga, vê o curso liberado no perfil e estuda o conteúdo (módulos/aulas em vídeo ou texto).

**Admin**: loga no painel → cadastra/edita produtos e preços → cria o conteúdo dos cursos → seta o acesso do cliente pelo e-mail, liberando exatamente o curso que ele comprou.

## Sensação visual (UI/UX)

"Bem limpinho", com a identidade Ocean Studio das artes enviadas: azul-marinho profundo sólido e branco, tipografia editorial de respiro largo, logo da onda como assinatura em navegação, rodapé e favicon. Layout claro e minimalista com seções navy onde a marca branca aparece; animações suaves e intencionais (reveal linha a linha, parallax, marquee lento, micro-interações em hover), tudo em português com o tom da comunidade FiveM BR.

## Fases de implementação

- **Fase 1 — MVP (agora)**: vitrine completa com a identidade Ocean Studio (logo SVG + favicon); contas de aluno e área de perfil; painel admin com gerenciamento de catálogo, cursos (módulos/aulas) e setagem de acesso por e-mail; conteúdo placeholder no lugar dos dados reais.
- **Fase 2 — depois**: fotos, nomes e preços reais; galeria de HLs e depoimentos; FAQ; progresso de aulas concluídas pelo aluno.
- **Fase 3 — depois**: SEO e preview de compartilhamento; materiais para download dentro do curso; pagamento automático online caso queira sair do fechamento manual pelo Discord.

## Premissas (decididas sem perguntar)

- "HL" = highlights de FiveM GTA RP (clipes/edits), e o curso ensina a produzir esses edits.
- O site não processa pagamento: a compra é fechada manualmente no Discord; o site só exibe preço e leva até lá.
- O aluno se cadastra sozinho no site e o admin seta o acesso pelo e-mail após confirmar a compra; o admin também pode cadastrar o cliente do zero.
- O acesso é granular: cada cliente recebe exatamente o produto comprado (curso de HL, curso de carro, curso de roupa, pack de roupas ou pack de carros).
- O conteúdo dos cursos é simples: módulos com aulas em vídeo incorporado (link) ou texto, gerenciados pelo admin.
- Identidade visual: azul-marinho profundo + branco conforme as imagens enviadas, com base clara e seções navy; a logo enviada serve de referência para a recriação em SVG.
- Preços em R$ e link do Discord como placeholders editáveis pelo painel.
- Um único administrador.
