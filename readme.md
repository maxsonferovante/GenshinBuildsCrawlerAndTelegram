
---

## Genshin-Builds Maal-Bot

Este projeto consiste em um bot para Telegram, desenvolvido em JavaScript com o uso do Puppeteer e do PlayWright, que realiza web crawling para obter informações sobre armas disponíveis para farmar no jogo Genshin Impact.

### Funcionalidades Principais:

- **Web Crawling Automatizado:** Utiliza o Puppeteer (ou PlayWright) para navegar por páginas web, coletando dados sobre armas disponíveis para farmar.
- **Informações Detalhadas:** Extrai informações detalhadas sobre cada arma, como nome, URL e imagem.
- **Comandos Telegram:** Oferece comandos no Telegram para os usuários, como "/start", "/weapons", "/about", "/help", fornecendo informações sobre as armas e funcionalidades do bot.

### Estrutura do Projeto:

- **`WebCrawlerGenshinBuilds.js`:** Classe que realiza o web crawling, navegando nas páginas, coletando dados sobre as armas e armazenando em um objeto.
- **`DiaDaSemana.js`:** Utilitário para obter a data atual e o dia da semana.
- **`index.js`:** Arquivo principal que inicializa o bot do Telegram e define os comandos disponíveis.

### Como Contribuir:

Se deseja contribuir com este projeto, sinta-se à vontade para:

- Reportar bugs ou problemas.
- Adicionar novas funcionalidades ao bot.
- Melhorar a eficiência do web crawling.
- Aperfeiçoar a organização do código.

### Como Usar Local:

1. Clone o repositório: 
```bash
    git clone https://github.com/maxsonferovante/GenshinBuildsCrawlerAndTelegram`
```
2. Instale as dependências: 
```bash
    yarn install
```
3. Instale Playwright:
```bash
    yarn playwright install    
```
4. Configure as variáveis de ambiente no arquivo `.env`, como o token do Telegram e a URL do site do jogo.
```bash 
    TELEGRAM_TOKEN = 'TOKEN DA API DO TELEGRAM'
    URL = 'https://genshin-builds.com/pt'
    DATABASE_URL = "URL DO BANCO DE DADOS"
```
5. Execute as migrações para geração das tabelas no banco de dados:
```bash
    npx prisma migrate dev --name init 
```
6. Execute o bot: 
```bash 
    yarn run start
```

### Como Usar no Docker

1. Clone o repositório: 
```bash
    git clone https://github.com/maxsonferovante/GenshinBuildsCrawlerAndTelegram`
```
2. Certifique-se de que o Docker está instalado com o comando:
```bash
    docker --version
```
3. Execute o comando abaixo e aguarde a criação e deploy da imagem:
```bash
    docker compose up
```

### Teste do Bot em produção

[Genshin-Builds Maal-Bot](https://t.me/GenshinBuildsMaalBot)


### Contribuidores:

- [Maxson Ferovante](https://github.com/maxsonferovante)
- [Giordano Bruno]()
- ...

Sinta-se à vontade para explorar, contribuir ou abrir issues para melhorias e correções. Seja bem-vindo(a) ao Genshin-Builds Maal-Bot!

---
