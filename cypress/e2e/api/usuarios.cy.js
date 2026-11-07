import { MENSAGENS } from '../../support/config'
import { novoUsuario } from '../../support/dados'

describe('API - Cadastro de usuários', () => {
  const criados = []

  after(() => {
    criados.forEach((id) => cy.excluirUsuario(id))
  })

  it('cadastra um usuário com dados válidos', () => {
    const usuario = novoUsuario(false)

    cy.api('POST', '/usuarios', { body: usuario }).then((resposta) => {
      expect(resposta.status).to.eq(201)
      expect(resposta.body.message).to.eq(MENSAGENS.cadastroSucesso)
      expect(resposta.body._id).to.be.a('string').and.not.be.empty
      criados.push(resposta.body._id)
    })
  })

  it('não permite dois usuários com o mesmo e-mail', () => {
    cy.criarUsuario(false).then((existente) => {
      criados.push(existente._id)

      cy.api('POST', '/usuarios', { body: { ...novoUsuario(false), email: existente.email } }).then((resposta) => {
        expect(resposta.status).to.eq(400)
        expect(resposta.body.message).to.eq(MENSAGENS.emailEmUso)
      })
    })
  })
})
