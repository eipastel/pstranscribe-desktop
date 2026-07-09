# src/shared — contratos main ↔ renderer

Tipos e constantes compartilhados pelos dois lados. Sem lógica de runtime, sem
dependências de Electron ou React: só o vocabulário comum para que main e
renderer concordem sobre o formato dos dados e os nomes dos canais IPC.

## Arquivos

- **`ipc.ts`** — os nomes dos canais IPC (constantes `*_CHANNEL`) e a interface
  **`WidgetApi`** (a superfície que o preload expõe). É a fonte da verdade do
  contrato: mudou aqui, muda no handler do main e no wrapper do preload.
- **`settings.ts`** — `Settings`, `Keybind`, `DEFAULT_SETTINGS` e flags como
  `FORMAT_LOCKED`.
- **`glossary.ts`** — tipos do glossário/conceitos (`ReviewAction`,
  `SavedConcepts`).
- **`history.ts`** — `TranscriptionRecord` e `HistoryStats` (métricas de uso,
  sem o texto transcrito, por privacidade).

Como é o contrato entre as camadas, os tipos daqui têm **JSDoc** servindo de
documentação viva — leia o próprio arquivo para o significado de cada campo.
