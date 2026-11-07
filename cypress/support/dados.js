// Gera dados únicos a cada execução, para os testes não dependerem de dados fixos
// nem colidirem com o que outras pessoas cadastram no ambiente público.
const sufixo = () => `${Date.now()}${Cypress._.random(1000, 9999)}`

export const novoUsuario = (administrador = false) => ({
  nome: administrador ? 'QA Admin Cypress' : 'QA Comum Cypress',
  email: `qa.${sufixo()}@teste.com.br`,
  password: 'Teste@123',
  administrador: String(administrador),
})

export const novoProduto = () => ({
  nome: `Produto QA ${sufixo()}`,
  preco: 150,
  descricao: 'Produto criado pelos testes automatizados',
  quantidade: 10,
})
