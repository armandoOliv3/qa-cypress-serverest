const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    // Front-end de estudo do ServeRest (os testes de interface usam este endereço)
    baseUrl: 'https://front.serverest.dev',
    specPattern: 'cypress/e2e/**/*.cy.js',
    // No modo "run" (terminal e GitHub Actions), tenta de novo uma vez antes de falhar,
    // porque o ServeRest é um ambiente público e às vezes oscila.
    retries: { runMode: 1, openMode: 0 },
  },
})
