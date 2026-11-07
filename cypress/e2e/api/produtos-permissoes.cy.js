import { MENSAGENS } from '../../support/config'
import { novoProduto } from '../../support/dados'

// Controle de acesso (RBAC): só administradores cadastram e excluem produtos.
describe('API - Produtos: controle de acesso por perfil', () => {
  let admin
  let comum
  let tokenAdmin
  let tokenComum

  before(() => {
    cy.criarUsuario(true)
      .then((u) => {
        admin = u
        return cy.loginApi(u.email, u.password)
      })
      .then((token) => {
        tokenAdmin = token
      })

    cy.criarUsuario(false)
      .then((u) => {
        comum = u
        return cy.loginApi(u.email, u.password)
      })
      .then((token) => {
        tokenComum = token
      })
  })

  after(() => {
    cy.excluirUsuario(admin?._id)
    cy.excluirUsuario(comum?._id)
  })

  it('administrador cadastra e exclui um produto', () => {
    cy.api('POST', '/produtos', { token: tokenAdmin, body: novoProduto() }).then((cadastro) => {
      expect(cadastro.status).to.eq(201)
      expect(cadastro.body.message).to.eq(MENSAGENS.cadastroSucesso)

      cy.api('DELETE', `/produtos/${cadastro.body._id}`, { token: tokenAdmin }).then((exclusao) => {
        expect(exclusao.status).to.eq(200)
        expect(exclusao.body.message).to.eq(MENSAGENS.exclusaoSucesso)
      })
    })
  })

  it('usuário comum não consegue cadastrar produto', () => {
    cy.api('POST', '/produtos', { token: tokenComum, body: novoProduto() }).then((resposta) => {
      expect(resposta.status).to.eq(403)
      expect(resposta.body.message).to.eq(MENSAGENS.somenteAdmin)
    })
  })

  it('usuário comum não consegue excluir produto', () => {
    cy.api('POST', '/produtos', { token: tokenAdmin, body: novoProduto() }).then((cadastro) => {
      const id = cadastro.body._id

      cy.api('DELETE', `/produtos/${id}`, { token: tokenComum }).then((resposta) => {
        expect(resposta.status).to.eq(403)
        expect(resposta.body.message).to.eq(MENSAGENS.somenteAdmin)
      })

      // Limpeza: o administrador remove o produto criado
      cy.api('DELETE', `/produtos/${id}`, { token: tokenAdmin })
    })
  })

  it('recusa cadastro sem token', () => {
    cy.api('POST', '/produtos', { body: novoProduto() }).then((resposta) => {
      expect(resposta.status).to.eq(401)
      expect(resposta.body.message).to.eq(MENSAGENS.tokenInvalido)
    })
  })

  it('recusa cadastro com token adulterado', () => {
    cy.api('POST', '/produtos', { token: `${tokenAdmin}adulterado`, body: novoProduto() }).then((resposta) => {
      expect(resposta.status).to.eq(401)
      expect(resposta.body.message).to.eq(MENSAGENS.tokenInvalido)
    })
  })

  it('não permite dois produtos com o mesmo nome', () => {
    const produto = novoProduto()

    cy.api('POST', '/produtos', { token: tokenAdmin, body: produto }).then((primeiro) => {
      expect(primeiro.status).to.eq(201)

      cy.api('POST', '/produtos', { token: tokenAdmin, body: produto }).then((repetido) => {
        expect(repetido.status).to.eq(400)
        expect(repetido.body.message).to.eq(MENSAGENS.produtoRepetido)
      })

      cy.api('DELETE', `/produtos/${primeiro.body._id}`, { token: tokenAdmin })
    })
  })
})
