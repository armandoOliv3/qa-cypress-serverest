import { MENSAGENS } from '../../support/config'

describe('API - Login', () => {
  let usuario

  before(() => {
    cy.criarUsuario(false).then((u) => {
      usuario = u
    })
  })

  after(() => {
    cy.excluirUsuario(usuario?._id)
  })

  it('faz login com e-mail e senha válidos e devolve o token', () => {
    cy.api('POST', '/login', { body: { email: usuario.email, password: usuario.password } }).then((resposta) => {
      expect(resposta.status).to.eq(200)
      expect(resposta.body.message).to.eq(MENSAGENS.loginSucesso)
      expect(resposta.body.authorization).to.match(/^Bearer .+/)
    })
  })

  it('recusa login com senha incorreta', () => {
    cy.api('POST', '/login', { body: { email: usuario.email, password: 'senhaErrada' } }).then((resposta) => {
      expect(resposta.status).to.eq(401)
      expect(resposta.body.message).to.eq(MENSAGENS.loginInvalido)
      expect(resposta.body).not.to.have.property('authorization')
    })
  })

  it('recusa login com e-mail não cadastrado', () => {
    cy.api('POST', '/login', { body: { email: `naoexiste.${Date.now()}@teste.com.br`, password: 'Teste@123' } }).then(
      (resposta) => {
        expect(resposta.status).to.eq(401)
        expect(resposta.body.message).to.eq(MENSAGENS.loginInvalido)
      },
    )
  })
})
