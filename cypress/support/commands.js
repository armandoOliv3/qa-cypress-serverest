import { API_URL } from './config'
import { novoUsuario } from './dados'

// Cria um usuário pela API e devolve os dados dele (com o _id gerado)
Cypress.Commands.add('criarUsuario', (administrador = false) => {
  const usuario = novoUsuario(administrador)

  return cy.request('POST', `${API_URL}/usuarios`, usuario).then((resposta) => {
    expect(resposta.status).to.eq(201)
    return { ...usuario, _id: resposta.body._id }
  })
})

// Exclui um usuário pela API (usado na limpeza depois dos testes)
Cypress.Commands.add('excluirUsuario', (id) => {
  if (!id) return
  cy.request({ method: 'DELETE', url: `${API_URL}/usuarios/${id}`, failOnStatusCode: false })
})

// Faz login pela API e devolve o token ("Bearer ...")
Cypress.Commands.add('loginApi', (email, password) => {
  return cy.request('POST', `${API_URL}/login`, { email, password }).its('body.authorization')
})

// Faz login pela tela, como um usuário faria
Cypress.Commands.add('loginUi', (email, password) => {
  cy.visit('/login')
  cy.get('[data-testid="email"]').type(email)
  cy.get('[data-testid="senha"]').type(password, { log: false })
  cy.get('[data-testid="entrar"]').click()
})

// Envia uma requisição autenticada para a API sem falhar o teste em 4xx,
// para o próprio teste conferir o status e a mensagem
Cypress.Commands.add('api', (method, rota, { token, body } = {}) => {
  return cy.request({
    method,
    url: `${API_URL}${rota}`,
    headers: token ? { Authorization: token } : {},
    body,
    failOnStatusCode: false,
  })
})
