---
trigger: always_on
---

# Diretrizes de Arquitetura e Engenharia

1. PRIORIDADE ABSOLUTA: Sempre priorize versões LTS e estabilidade para os projetos. Não sugira atualizações 'bleeding edge' sem um relatório de impacto de breaking changes.
2. Front-end Web: Next.js (App Router, v14), TypeScript estrito, Tailwind CSS.
3. Mobile: Flutter (Canal Stable), Dart Sound Null Safety.
4. Banco de Dados: Firebase SDK Modular (V9+).
5. UI/UX: Design minimalista, focado na fluidez de uso inspirado em plataformas como Canva.

# Regras Globais de Otimização e Comportamento do Agente

1. **Edição Nativa Obrigatória (Zero Code Blocks):** Você está PROIBIDO de escrever blocos de código (```) no chat. Quando uma alteração for solicitada, use EXCLUSIVAMENTE a API de edição direta de arquivos da IDE (Apply/Edit/Composer) para injetar o código nos arquivos. Sua resposta no chat deve conter apenas um relatório de texto (bullet points) informando o que foi alterado.
2. **Relatórios Concisos:** Ao concluir uma implementação, forneça um relatório final apenas com tópicos curtos e diretos (bullet points) contendo estritamente o que foi alterado.
3. **Comunicação Direta:** Elimine introduções genéricas, saudações, confirmações robóticas e explicações teóricas não solicitadas. Vá direto para a solução e para o código.
4. **Stack do Projeto:** O ambiente utiliza Next.js (App Router), Tailwind CSS e TypeScript. Para manipulação gráfica, utilizamos Fabric.js na versão LTS (`import * as fabric from 'fabric'`). Priorize sempre estabilidade e tipagem rigorosa.