# Rituals · Bar & Wellness Club

Mock funcional em Angular, construído sobre o **Datta Able Free Angular**, com tema escuro exclusivo. Todos os dados são fictícios e ficam no `localStorage` do navegador. Não há API, autenticação real, cobrança ou envio de e-mail/SMS.

## Executar

```powershell
npm install --legacy-peer-deps
npm start
```

Abra http://127.0.0.1:4200. O projeto inclui Node 24.15 como dependência de desenvolvimento para compatibilidade com Angular 22; os scripts npm usam esse executável local. Para instalar, utilize Node 22 ou 24 e npm.

```powershell
npm run build
npm test
```

O build estático fica em `dist/browser`. Ao hospedar em outro servidor, configure fallback para `index.html`.

## O que experimentar

- **Autenticação:** login e recuperação de senha simulados. Selecione um perfil para preencher o e-mail e use a senha `rituals123`. A sessão dura nesta aba até sair; o botão de saída fica no topo do painel. A recuperação apenas mostra uma confirmação local, sem enviar mensagens.

- **Visão geral:** indicadores, vendas por hora, favoritos, comandas e alertas de estoque calculados a partir da mesma base.
- **Comandas:** abrir com cliente e local, adicionar/remover produtos e finalizar por Pix, cartão, dinheiro ou crédito. E-mail e telefones ficam vinculados ao cadastro do cliente.
- **Vendas:** histórico, filtros e exportação CSV.
- **Estoque:** cadastro, edição e reposição de produtos; baixa automática no fechamento da comanda. Quantidades são unidades de venda; ficha técnica de ingredientes fica para uma etapa futura.
- **Caixa:** abertura, suprimento, sangria e encerramento. Apenas vendas em dinheiro entram na gaveta. Comandas abertas impedem encerramento. O histórico preserva as sessões anteriores.
- **Clientes e fornecedores:** cadastro e edição de contatos.
- **Créditos:** adição manual de saldo, extrato e consumo no fechamento. A adição de crédito é um ajuste demonstrativo; não processa recebimentos nem movimenta a gaveta.
- **Funcionários:** cadastro, edição, ativação/desativação e três perfis simulados. Use o seletor no topo para alternar entre gerente, caixa e atendente.

O gerente pode restaurar a demonstração pelo menu lateral. Esta operação substitui somente os dados locais desta aplicação.

## Estrutura

- `src/app/rituals.store.ts`: entidades, dados iniciais, regras de fechamento e saldo do caixa.
- `src/app/app.component.ts` e `.html`: telas e interações do mock.
- `src/rituals.scss`: identidade visual e layouts responsivos.
- `src/app/theme/shared/components/card`: componente original Datta Able reutilizado.
- `tests/operations.test.mjs`: testes das operações integradas, consistência de dados e permissões de fechamento.

As permissões são demonstrativas e executadas no navegador. A versão integrada precisará de autenticação e autorização no servidor. Os exemplos originais do template permanecem no código como referência, sem rotas expostas no mock.

## Licença da base

Datta Able Free Angular © CodedThemes, MIT. Consulte `LICENSE` e `THIRD_PARTY_NOTICES.md`. Nenhum recurso da versão Pro foi utilizado. O pixel de rastreamento e os scripts externos promocionais do template foram removidos.
