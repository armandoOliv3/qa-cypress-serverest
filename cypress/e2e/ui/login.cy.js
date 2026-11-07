import { MENSAGENS } from '../../support/config'

describe('Interface - Login e sessão', () => {
  let admin
  let comum

  before(() => {
    cy.criarUsuario(true).then((u) => {
      admin = u
    })
    cy.criarUsuario(false).then((u) => {
      comum = u
    })
  })

  after(() => {
    cy.excluirUsuario(admin?._id)
    cy.excluirUsuario(comum?._id)
  })

  it('administrador entra e vai para o painel de administração', () => {
    cy.loginUi(admin.email, admin.password)

    cy.location('pathname').should('eq', '/admin/home')
    cy.contains('h1', `Bem Vindo ${admin.nome}`).should('be.visible')
    cy.get('[data-testid="cadastrar-produtos"]').should('be.visible')
  })

  it('usuário comum entra e vai para a loja, sem menu de administração', () => {
    cy.loginUi(comum.email, comum.password)

    cy.location('pathname').should('eq', '/home')
    cy.contains('h1', 'Serverest Store').should('be.visible')
    cy.get('[data-testid="cadastrar-produtos"]').should('not.exist')
  })

  it('mostra erro e continua no login com senha incorreta', () => {
    cy.loginUi(comum.email, 'senhaErrada')

    cy.location('pathname').should('eq', '/login')
    cy.get('.alert').should('be.visible').and('contain', MENSAGENS.loginInvalido)
  })

  it('logout encerra a sessão e protege a página interna', () => {
    cy.loginUi(comum.email, comum.password)
    cy.location('pathname').should('eq', '/home')

    cy.get('[data-testid="logout"]').click()
    cy.location('pathname').should('eq', '/login')

    cy.visit('/home')
    cy.location('pathname').should('eq', '/login')
  })

  it('página interna sem login volta para a tela de login', () => {
    cy.visit('/home')
    cy.location('pathname').should('eq', '/login')
  })
})
