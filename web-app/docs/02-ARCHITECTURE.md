# Arquitetura e Padrões de Código
- **Estado Global:** Gerenciado via `EditorContext.tsx` (exporta `canvas`, `selectedObject`, etc).
- **Separação de Preocupações (Padrão Adapter):** O Fabric.js não entende o ciclo de vida do React. NUNCA coloque hooks (ex: `useState`, `useEditor`) diretamente dentro de listeners do Fabric (`canvas.on`).
- **Comunicação:** A barra lateral (Sidebar) e os botões externos se comunicam com a prancheta exclusivamente alterando o estado no Contexto ou acionando referências (`useRef`).