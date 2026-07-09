import { defineConfig } from 'vitest/config'

// Config própria (não usa electron.vite.config.ts): só testes unitários de
// funções puras em src/, ambiente node.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node'
  }
})
