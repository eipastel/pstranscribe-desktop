import { defineConfig } from 'vitest/config'

// Config própria (não usa electron.vite.config.ts): testes unitários da lógica
// pura em src/, ambiente node. Testes do renderer (máquina de estados) declaram
// `// @vitest-environment happy-dom` no topo do arquivo.
export default defineConfig({
  test: {
    include: ['src/**/*.test.ts'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      // Gate só na lógica pura — a casca fina SO/nativo, a UI e o CSS ficam fora
      // do denominador. Abaixo dos thresholds o processo falha e derruba o CI.
      include: [
        'src/main/openai/key.ts',
        'src/main/openai/pipeline.ts',
        'src/shared/glossary.ts',
        'src/renderer/state/widget.ts'
      ],
      thresholds: { lines: 85, functions: 85, branches: 85, statements: 85 }
    }
  }
})
