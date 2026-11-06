# Toldos e Companhia - Node.js

Site feito com Node.js, Express, Handlebars e MySQL.

## Como rodar

1. Abrir o MySQL Workbench e criar um schema `toldos`, após isso importar o arquivo dbUCE
2. Em `db.js`, colocar o usuário e a senha do seu MySQL
3. No terminal do VSCode, dentro da pasta do projeto:

```
npm install
npm start
```

4. Acessar http://localhost:3000

## Conta do administrador

- Email: admin@toldosecia.com
- Senha: admin123

Pelo menu do admin dá para cadastrar produtos (com foto), gerenciar usuários e ver os relatórios.

## Estrutura

- `app.js` - servidor Express e rotas
- `db.js` - conexão com o MySQL (módulo interno)
- `views/` - páginas em Handlebars (`layouts/main.handlebars` tem o cabeçalho e o rodapé)
- `public/` - arquivos estáticos (css, img, js)
- `dbUCE` - banco de dados
