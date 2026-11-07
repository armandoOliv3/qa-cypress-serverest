import { MENSAGENS } from '../../support/config'
import { novoProduto } from '../../support/dados'

// Validação de tela e API juntas: o que a interface deixa abrir,
// a API ainda precisa bloquear.
describe('Interface + API - Usuário comum na área de administração', () => {
  let comum

  before(() => {
    cy.criarUsuario(false).then((u) => {
      comum = u
    })
  })

  after(() => {
    cy.excluirUsuario(comum?._id)
  })

  it('a tela de cadastro de produtos abre, mas a API bloqueia o cadastro', () => {
    cy.loginUi(comum.email, comum.password)
    cy.location('pathname').should('eq', '/home')

    // Achado: o front-end não bloqueia a rota de administração para o perfil comum
    cy.visit('/admin/cadastrarprodutos')
    cy.contains('h1', 'Cadastro de Produtos').should('be.visible')

    // A proteção real está na API
    cy.loginApi(comum.email, comum.password).then((token) => {
      cy.api('POST', '/produtos', { token, body: novoProduto() }).then((resposta) => {
        expect(resposta.status).to.eq(403)
        expect(resposta.body.message).to.eq(MENSAGENS.somenteAdmin)
      })
    })
  })
})
