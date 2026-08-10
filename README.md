# Site — Queiroz Barbearia

Site estático (HTML/CSS/JS puro, sem dependências ou build). Basta os arquivos, sem instalar nada.

## Estrutura

```
index.html        conteúdo e textos do site
css/style.css      cores, tipografia e layout
js/main.js         animações, horário dinâmico e lightbox da galeria
images/            fotos usadas no site
```

## Ver localmente

Dá pra abrir `index.html` direto no navegador (duplo clique). Tudo funciona porque as imagens/CSS/JS são todos arquivos locais na mesma pasta.

## Publicar (grátis)

Qualquer uma dessas opções funciona sem configuração extra, já que é só HTML/CSS/JS:

- **Netlify Drop** — netlify.com/drop, arrasta a pasta inteira e já sai no ar com link.
- **GitHub Pages** — sobe a pasta num repositório e ativa o Pages nas configurações.
- **Vercel** — importa a pasta/repositório e publica.
- Ou qualquer hospedagem que aceite arquivos estáticos (a maioria dos provedores brasileiros de hospedagem também serve).

## Onde editar o quê

- **Textos, telefone, endereço, links** → `index.html`
- **Horário de funcionamento** → `js/main.js`, objeto `HOURS` no topo do script (dias 0=domingo a 6=sábado, horários em minutos desde 00h)
- **Cores e fontes** → `css/style.css`, variáveis no bloco `:root` no topo do arquivo
- **Fotos** → substitua os arquivos em `images/` mantendo o mesmo nome, ou troque o `src` correspondente no `index.html`
