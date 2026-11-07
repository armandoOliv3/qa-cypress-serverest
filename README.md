# QA com Cypress: API e interface no ServeRest

[![Testes Cypress](https://github.com/armandoOliv3/qa-cypress-serverest/actions/workflows/cypress.yml/badge.svg)](https://github.com/armandoOliv3/qa-cypress-serverest/actions/workflows/cypress.yml)

Projeto de estudo de automação de testes com [Cypress](https://www.cypress.io/), usando o [ServeRest](https://serverest.dev), uma loja virtual pública feita para praticar testes.

O foco é o mesmo do meu dia a dia como Analista de QA: **controle de acesso por perfil**, **casos de borda** e **validação de tela e API juntas**.

## O que é testado

| Arquivo | Tipo | Cenários |
|---|---|---|
| `api/login.cy.js` | API | Login válido com token; senha incorreta; e-mail não cadastrado |
| `api/usuarios.cy.js` | API | Cadastro válido; e-mail repetido |
| `api/produtos-permissoes.cy.js` | API | Administrador cadastra e exclui; usuário comum recebe 403 ao cadastrar e ao excluir; sem token e com token adulterado recebem 401; nome de produto repetido |
| `ui/login.cy.js` | Interface | Admin vai para o painel; usuário comum vai para a loja sem menu de admin; erro com senha incorreta; logout; página interna sem login |
| `ui/acesso-admin.cy.js` | Interface + API | Usuário comum abre a tela de cadastro de produtos, mas a API bloqueia o cadastro |

Cada teste cria os próprios usuários e produtos pela API e os apaga no final, então nada depende de dados fixos.

## Achado durante os testes

Um usuário comum consegue abrir a tela `/admin/cadastrarprodutos` direto pela URL. O front-end não bloqueia a rota por perfil. A proteção existe só na API, que responde `403 Rota exclusiva para administradores`. O teste `acesso-admin.cy.js` documenta esse comportamento. Num produto real, eu registraria como bug de baixa severidade no front.

## Como rodar

Pré-requisito: [Node.js](https://nodejs.org/) 20 ou mais novo.

```bash
npm install          # instala o Cypress
npm run cy:open      # abre a interface do Cypress para rodar e acompanhar os testes
npm test             # roda todos os testes no terminal
npm run test:api     # só os testes de API
npm run test:ui      # só os testes de interface
```

Os testes também rodam sozinhos no GitHub Actions a cada push na `main` (aba **Actions** do repositório).

## Estrutura

```
cypress/
  e2e/
    api/        testes de API (cy.request)
    ui/         testes de interface
  support/
    commands.js comandos reutilizáveis: criarUsuario, loginApi, loginUi, api
    config.js   endereço da API e mensagens esperadas
    dados.js    geração de dados únicos para cada execução
```

## Próximos passos

- Testes do fluxo de carrinho (adicionar, concluir e cancelar compra)
- Login reaproveitado entre testes com `cy.session`
- Relatório HTML dos resultados
- Cenários escritos em Gherkin (BDD)

---

Feito por Armando Oliveira, Analista de QA.
