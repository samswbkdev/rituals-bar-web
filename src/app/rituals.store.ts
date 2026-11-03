export type Role = 'Gerente' | 'Caixa' | 'Atendente';
export interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  credit: number;
  tier: string;
}
export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  minimum: number;
  unit: string;
  supplierId: number;
}
export interface Supplier {
  id: number;
  name: string;
  contact: string;
  email: string;
  phone: string;
  category: string;
}
export interface Employee {
  id: number;
  name: string;
  email: string;
  role: Role;
  active: boolean;
}
export interface Order {
  id: number;
  clientId: number;
  location: string;
  opened: string;
  staff: string;
  status: 'Aberta' | 'Fechada';
  items: { productId: number; name: string; price: number; qty: number }[];
}
export interface Sale {
  id: number;
  orderId: number;
  clientId: number;
  total: number;
  payment: string;
  date: string;
}
export interface Movement {
  id: number;
  type: string;
  amount: number;
  note: string;
  date: string;
  session: number;
}
export interface CreditEntry {
  id: number;
  clientId: number;
  amount: number;
  note: string;
  date: string;
}
export interface State {
  clients: Client[];
  products: Product[];
  suppliers: Supplier[];
  employees: Employee[];
  orders: Order[];
  sales: Sale[];
  movements: Movement[];
  credits: CreditEntry[];
  cashOpen: boolean;
  session: number;
  opening: number;
  cashClosedAt: string;
}
export const money = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
export const total = (order: Order) => order.items.reduce((sum, item) => sum + item.qty * item.price, 0);
export const id = () => Math.floor(Date.now() * 1000 + Math.random() * 1000);
export function seed(): State {
  const today = (h: number, m = 0) => {
    const d = new Date();
    d.setHours(h, m, 0, 0);
    return d.toISOString();
  };
  return {
    clients: [
      { id: 1, name: 'Isabela Monteiro', email: 'isabela@example.com', phone: '(11) 99901-0101', credit: 480, tier: 'Signature' },
      { id: 2, name: 'Rafael Almeida', email: 'rafael@example.com', phone: '(11) 99902-0202', credit: 250, tier: 'Member' },
      { id: 3, name: 'Mariana Costa', email: 'mariana@example.com', phone: '(11) 99903-0303', credit: 720, tier: 'Signature' },
      { id: 4, name: 'Pedro Vasconcelos', email: 'pedro@example.com', phone: '(11) 99904-0404', credit: 0, tier: 'Guest' },
      { id: 5, name: 'Sofia Ribeiro', email: 'sofia@example.com', phone: '(11) 99905-0505', credit: 350, tier: 'Member' },
      { id: 6, name: 'Lucas Ferreira', email: 'lucas@example.com', phone: '(11) 99906-0606', credit: 160, tier: 'Member' }
    ],
    products: [
      { id: 1, name: 'Matcha iced latte', category: 'Bebidas', price: 28, stock: 32, minimum: 10, unit: 'un', supplierId: 1 },
      { id: 2, name: 'Green vitality', category: 'Sucos', price: 26, stock: 24, minimum: 8, unit: 'un', supplierId: 2 },
      { id: 3, name: 'Avocado toast', category: 'Cozinha', price: 42, stock: 18, minimum: 6, unit: 'un', supplierId: 2 },
      { id: 4, name: 'Kombucha de hibisco', category: 'Bebidas', price: 24, stock: 5, minimum: 10, unit: 'un', supplierId: 3 },
      { id: 5, name: 'Bowl de açaí orgânico', category: 'Cozinha', price: 38, stock: 16, minimum: 5, unit: 'un', supplierId: 2 },
      { id: 6, name: 'Água mineral com gás', category: 'Bebidas', price: 12, stock: 8, minimum: 12, unit: 'un', supplierId: 3 },
      { id: 7, name: 'Espresso especial', category: 'Cafés', price: 14, stock: 60, minimum: 15, unit: 'un', supplierId: 1 },
      { id: 8, name: 'Cacao protein shake', category: 'Shakes', price: 34, stock: 22, minimum: 8, unit: 'un', supplierId: 1 }
    ],
    suppliers: [
      {
        id: 1,
        name: 'Origem Natural',
        contact: 'Ana Martins',
        email: 'ana@example.com',
        phone: '(11) 3301-1000',
        category: 'Cafés e insumos'
      },
      {
        id: 2,
        name: 'Fazenda Boa Terra',
        contact: 'Carlos Lima',
        email: 'carlos@example.com',
        phone: '(11) 3302-2000',
        category: 'Orgânicos'
      },
      { id: 3, name: 'Viva Bebidas', contact: 'Beatriz Rocha', email: 'beatriz@example.com', phone: '(11) 3303-3000', category: 'Bebidas' }
    ],
    employees: [
      { id: 1, name: 'Alex Morgan', email: 'alex@example.com', role: 'Gerente', active: true },
      { id: 2, name: 'Camila Santos', email: 'camila@example.com', role: 'Caixa', active: true },
      { id: 3, name: 'Bruno Oliveira', email: 'bruno@example.com', role: 'Atendente', active: true }
    ],
    orders: [
      {
        id: 1048,
        clientId: 1,
        location: 'Lounge · 04',
        opened: today(10, 15),
        staff: 'Bruno Oliveira',
        status: 'Aberta',
        items: [
          { productId: 1, name: 'Matcha iced latte', price: 28, qty: 2 },
          { productId: 3, name: 'Avocado toast', price: 42, qty: 1 }
        ]
      },
      {
        id: 1049,
        clientId: 2,
        location: 'Piscina · 02',
        opened: today(10, 32),
        staff: 'Bruno Oliveira',
        status: 'Aberta',
        items: [
          { productId: 2, name: 'Green vitality', price: 26, qty: 1 },
          { productId: 5, name: 'Bowl de açaí orgânico', price: 38, qty: 1 }
        ]
      },
      {
        id: 1050,
        clientId: 3,
        location: 'Lounge · 01',
        opened: today(10, 48),
        staff: 'Camila Santos',
        status: 'Aberta',
        items: [
          { productId: 8, name: 'Cacao protein shake', price: 34, qty: 2 },
          { productId: 6, name: 'Água mineral com gás', price: 12, qty: 2 }
        ]
      },
      {
        id: 1051,
        clientId: 4,
        location: 'Balcão · 03',
        opened: today(11, 5),
        staff: 'Bruno Oliveira',
        status: 'Aberta',
        items: [{ productId: 7, name: 'Espresso especial', price: 14, qty: 2 }]
      },
      {
        id: 1045,
        clientId: 5,
        location: 'Jardim · 01',
        opened: today(9, 10),
        staff: 'Camila Santos',
        status: 'Fechada',
        items: [{ productId: 3, name: 'Avocado toast', price: 42, qty: 2 }]
      },
      {
        id: 1046,
        clientId: 6,
        location: 'Lounge · 02',
        opened: today(9, 30),
        staff: 'Bruno Oliveira',
        status: 'Fechada',
        items: [{ productId: 1, name: 'Matcha iced latte', price: 28, qty: 2 }]
      },
      {
        id: 1047,
        clientId: 3,
        location: 'Piscina · 01',
        opened: today(9, 45),
        staff: 'Camila Santos',
        status: 'Fechada',
        items: [{ productId: 5, name: 'Bowl de açaí orgânico', price: 38, qty: 2 }]
      }
    ],
    sales: [
      { id: 1, orderId: 1045, clientId: 5, total: 84, payment: 'Pix', date: today(9, 40) },
      { id: 2, orderId: 1046, clientId: 6, total: 56, payment: 'Dinheiro', date: today(10) },
      { id: 3, orderId: 1047, clientId: 3, total: 76, payment: 'Cartão', date: today(10, 20) }
    ],
    movements: [{ id: 1, type: 'Venda', amount: 56, note: 'Comanda #1046', date: today(10), session: 1 }],
    credits: [1, 2, 3, 5, 6].map((clientId, index) => ({
      id: clientId,
      clientId,
      amount: [480, 250, 720, 350, 160][index],
      note: 'Saldo inicial demonstrativo',
      date: today(8)
    })),
    cashOpen: true,
    session: 1,
    opening: 300,
    cashClosedAt: ''
  };
}
export function checkout(state: State, orderId: number, payment: string, role: Role): void {
  if (role === 'Atendente') throw new Error('O fechamento é permitido para caixa e gerente.');
  if (!state.cashOpen) throw new Error('Abra o caixa antes de fechar a comanda.');
  if (!['Pix', 'Cartão', 'Dinheiro', 'Crédito do cliente'].includes(payment)) throw new Error('Selecione uma forma de pagamento válida.');
  const order = state.orders.find((o) => o.id === orderId);
  if (!order || order.status !== 'Aberta' || !order.items.length) throw new Error('A comanda precisa estar aberta e ter itens.');
  const client = state.clients.find((c) => c.id === order.clientId);
  const value = total(order);
  for (const item of order.items) {
    const product = state.products.find((p) => p.id === item.productId);
    if (!product || product.stock < item.qty) throw new Error(`Estoque insuficiente para ${item.name}.`);
  }
  if (payment === 'Crédito do cliente' && (!client || client.credit < value)) throw new Error('O cliente não tem crédito suficiente.');
  const date = new Date().toISOString();
  if (payment === 'Crédito do cliente') {
    client!.credit = Math.round((client!.credit - value) * 100) / 100;
    state.credits.unshift({ id: id(), clientId: client!.id, amount: -value, note: `Comanda #${order.id}`, date });
  }
  for (const item of order.items) state.products.find((p) => p.id === item.productId)!.stock -= item.qty;
  order.status = 'Fechada';
  state.sales.unshift({ id: id(), orderId, clientId: order.clientId, total: value, payment, date });
  if (payment === 'Dinheiro')
    state.movements.unshift({ id: id(), type: 'Venda', amount: value, note: `Comanda #${order.id}`, date, session: state.session });
}
export function cashBalance(state: State): number {
  return state.opening + state.movements.filter((m) => m.session === state.session).reduce((sum, m) => sum + m.amount, 0);
}
export function loadState(): State {
  try {
    const raw = localStorage.getItem('rituals-demo-v1');
    if (raw) {
      const value = JSON.parse(raw);
      if (Array.isArray(value.clients) && Array.isArray(value.orders) && Array.isArray(value.credits)) return value;
    }
  } catch {
    /* Browser storage may be unavailable. */
  }
  return seed();
}
