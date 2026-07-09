# components — peças de UI reutilizáveis

Componentes burros e reutilizáveis: recebem props, renderizam, emitem eventos.
**Sem lógica de negócio, sem IPC, sem store** — nada aqui chama `window.api`.
A lógica mora nas [features](../features). Se um componente precisa saber sobre
gravação, chave ou settings, ele está no lugar errado.

## Convenção

Uma pasta por componente, com o `.tsx` e seu `.css` de mesmo nome:
`Componente/Componente.tsx` + `Componente/Componente.css`.

## Inventário

| Componente          | Papel                                   |
| ------------------- | --------------------------------------- |
| `Button`            | botão base                              |
| `Input`             | campo de texto                          |
| `Toggle`            | switch on/off                           |
| `Pill`              | rótulo/badge arredondado                |
| `CheckIcon`         | ícone de check                          |
| `StatusDot`         | bolinha de status (cor por estado)      |
| `StatusLabel`       | texto de status                         |
| `Timer`             | contador de tempo (duração da gravação) |
| `Waveform`          | visualização das barras de áudio        |
