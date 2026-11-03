import { test } from 'node:test';
import assert from 'node:assert/strict';
import { seed, checkout, total, cashBalance } from '../src/app/rituals.store.ts';

test('fechar com crédito atualiza venda, estoque e saldo juntos', () => {
  const s = seed();
  const o = s.orders.find((o) => o.id === 1048);
  const amount = total(o);
  checkout(s, o.id, 'Crédito do cliente', 'Caixa');
  assert.equal(o.status, 'Fechada');
  assert.equal(s.clients[0].credit, 480 - amount);
  assert.equal(s.products[0].stock, 30);
  assert.equal(s.products[2].stock, 17);
  assert.equal(s.sales[0].total, amount);
  assert.equal(s.credits[0].amount, -amount);
  assert.equal(cashBalance(s), 356);
});
test('dinheiro entra no caixa; outros pagamentos não entram', () => {
  for (const payment of ['Dinheiro', 'Pix', 'Cartão']) {
    const s = seed();
    checkout(s, 1048, payment, 'Gerente');
    assert.equal(cashBalance(s), payment === 'Dinheiro' ? 454 : 356);
  }
});
test('falhas de estoque ou crédito não deixam atualizações parciais', () => {
  for (const failure of ['stock', 'credit']) {
    const s = seed();
    if (failure === 'stock') s.products[2].stock = 0;
    else s.clients[0].credit = 1;
    const before = JSON.stringify(s);
    assert.throws(() => checkout(s, 1048, 'Crédito do cliente', 'Gerente'));
    assert.equal(JSON.stringify(s), before);
  }
});
test('impede fechamento duplicado e fechamento de comanda vazia', () => {
  const s = seed();
  checkout(s, 1048, 'Pix', 'Caixa');
  const before = JSON.stringify(s);
  assert.throws(() => checkout(s, 1048, 'Pix', 'Caixa'));
  assert.equal(JSON.stringify(s), before);
  s.orders.find((o) => o.id === 1049).items = [];
  assert.throws(() => checkout(s, 1049, 'Pix', 'Caixa'));
});
test('atendente e caixa fechado não autorizam pagamentos', () => {
  const s = seed();
  const before = JSON.stringify(s);
  assert.throws(() => checkout(s, 1048, 'Pix', 'Atendente'));
  assert.equal(JSON.stringify(s), before);
  s.cashOpen = false;
  assert.throws(() => checkout(s, 1048, 'Pix', 'Gerente'));
});
test('saldo considera apenas movimentos da sessão atual', () => {
  const s = seed();
  s.session = 2;
  s.opening = 100;
  s.movements.push({ id: 9, session: 2, amount: -25, type: 'Sangria', note: 'Teste', date: new Date().toISOString() });
  assert.equal(cashBalance(s), 75);
});
