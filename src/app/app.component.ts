import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CardComponent } from './theme/shared/components/card/card.component';
import { DialogFocusDirective } from './dialog-focus.directive';
import { cashBalance, checkout, Client, Employee, id, loadState, money, Order, Role, seed, State, total } from './rituals.store';
@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule, CardComponent, DialogFocusDirective],
  templateUrl: './app.component.html'
})
export class AppComponent {
  state: State = loadState();
  page = 'overview';
  search = '';
  status = 'Todas';
  category = 'Todos';
  paymentFilter = 'Todos';
  selectedId: number | null = null;
  modal = '';
  form: any = {};
  error = '';
  toast = '';
  mobileNav = false;
  productSearch = '';
  payment = 'Pix';
  currentEmployeeId = 1;
  authenticated = false;
  loginEmail = '';
  loginPassword = '';
  showPassword = false;
  authError = '';
  authMode: 'login' | 'recovery' = 'login';
  recoverySent = false;
  constructor() {
    try {
      const employeeId = Number(sessionStorage.getItem('rituals-demo-session'));
      if (this.state.employees.some((e) => e.id === employeeId && e.active)) {
        this.currentEmployeeId = employeeId;
        this.authenticated = true;
      }
    } catch {
      /* The demo also works without browser session storage. */
    }
  }
  selectDemo(employee: Employee) {
    this.loginEmail = employee.email;
    this.loginPassword = 'rituals123';
    this.authError = '';
  }
  login() {
    const employee = this.state.employees.find((e) => e.email.toLowerCase() === this.loginEmail.trim().toLowerCase() && e.active);
    if (!employee || this.loginPassword !== 'rituals123') {
      this.authError = 'E-mail ou senha de demonstração inválidos. Use um dos perfis abaixo.';
      return;
    }
    this.currentEmployeeId = employee.id;
    this.authenticated = true;
    this.authError = '';
    this.loginPassword = '';
    this.go('overview');
    this.saveSession();
  }
  saveSession() {
    try {
      sessionStorage.setItem('rituals-demo-session', String(this.currentEmployeeId));
    } catch {
      /* Optional persistence. */
    }
  }
  logout() {
    this.selectedId = null;
    this.modal = '';
    this.mobileNav = false;
    this.authenticated = false;
    this.loginPassword = '';
    this.loginEmail = '';
    this.authError = '';
    this.authMode = 'login';
    this.recoverySent = false;
    try {
      sessionStorage.removeItem('rituals-demo-session');
    } catch {
      /* Optional persistence. */
    }
  }
  recoverPassword() {
    this.recoverySent = true;
    this.authError = '';
  }
  toastTimer: any;
  money = money;
  total = total;
  cashBalance = cashBalance;
  today = new Date();
  nav = [
    { id: 'overview', name: 'Visão geral', icon: 'grid', group: 'PRINCIPAL' },
    { id: 'orders', name: 'Comandas', icon: 'file-text', group: '' },
    { id: 'sales', name: 'Vendas', icon: 'trending-up', group: '' },
    { id: 'cash', name: 'Caixa', icon: 'credit-card', group: '' },
    { id: 'inventory', name: 'Estoque', icon: 'box', group: 'GESTÃO' },
    { id: 'clients', name: 'Clientes', icon: 'users', group: '' },
    { id: 'credits', name: 'Créditos', icon: 'heart', group: '' },
    { id: 'suppliers', name: 'Fornecedores', icon: 'briefcase', group: '' },
    { id: 'staff', name: 'Funcionários', icon: 'shield', group: 'EQUIPE' }
  ];
  get employee(): Employee {
    return this.state.employees.find((e) => e.id === this.currentEmployeeId && e.active) || this.state.employees.find((e) => e.active)!;
  }
  get role(): Role {
    return this.employee.role;
  }
  get title() {
    return this.nav.find((n) => n.id === this.page)?.name || '';
  }
  get openOrders() {
    return this.state.orders.filter((o) => o.status === 'Aberta');
  }
  get lowStock() {
    return this.state.products.filter((p) => p.stock <= p.minimum);
  }
  get todaysSales() {
    return this.state.sales.filter((s) => new Date(s.date).toDateString() === this.today.toDateString());
  }
  get revenue() {
    return this.todaysSales.reduce((s, v) => s + v.total, 0);
  }
  get pending() {
    return this.openOrders.reduce((s, o) => s + total(o), 0);
  }
  get creditTotal() {
    return this.state.clients.reduce((s, c) => s + c.credit, 0);
  }
  get selected() {
    return this.state.orders.find((o) => o.id === this.selectedId);
  }
  get filteredOrders() {
    return this.state.orders.filter(
      (o) => (this.status === 'Todas' || o.status === this.status) && this.matches(`${o.id} ${this.client(o.clientId)?.name} ${o.location}`)
    );
  }
  get filteredClients() {
    return this.state.clients.filter((c) => this.matches(`${c.name} ${c.email} ${c.phone}`));
  }
  get filteredProducts() {
    return this.state.products.filter(
      (p) =>
        this.matches(p.name + p.category) &&
        (this.category === 'Todos' || (this.category === 'Baixo estoque' ? p.stock <= p.minimum : p.category === this.category))
    );
  }
  get filteredSales() {
    return this.state.sales.filter(
      (s) =>
        this.matches(`${s.orderId} ${this.client(s.clientId)?.name}`) &&
        (this.paymentFilter === 'Todos' || s.payment === this.paymentFilter)
    );
  }
  get catalog() {
    return this.state.products.filter((p) => p.name.toLowerCase().includes(this.productSearch.toLowerCase()));
  }
  get categories() {
    return [...new Set(this.state.products.map((p) => p.category))];
  }
  get chartBars() {
    return [0, 2, 4, 6, 8, 10, 12, 14, 16, 18, 20, 22].map((hour) => ({
      hour,
      value: this.todaysSales
        .filter((s) => new Date(s.date).getHours() >= hour && new Date(s.date).getHours() < hour + 2)
        .reduce((sum, s) => sum + s.total, 0)
    }));
  }
  get chartMax() {
    return Math.max(100, ...this.chartBars.map((b) => b.value));
  }
  get popular() {
    const counts: Record<number, number> = {};
    this.state.orders
      .filter((o) => o.status === 'Fechada')
      .forEach((o) => o.items.forEach((i) => (counts[i.productId] = (counts[i.productId] || 0) + i.qty)));
    return this.state.products
      .map((p) => ({ ...p, qty: counts[p.id] || 0 }))
      .filter((p) => p.qty > 0)
      .sort((a, b) => b.qty - a.qty)
      .slice(0, 4);
  }
  matches(value: string) {
    return value.toLowerCase().includes(this.search.toLowerCase());
  }
  client(clientId: number): Client {
    return this.state.clients.find((c) => c.id === clientId)!;
  }
  initials(name = '') {
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0])
      .join('');
  }
  time(value: string) {
    return new Date(value).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  }
  date(value: string) {
    return new Date(value).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  }
  allowed(page: string) {
    return (
      this.role === 'Gerente' ||
      (this.role === 'Caixa'
        ? ['overview', 'orders', 'sales', 'cash', 'clients', 'credits'].includes(page)
        : ['overview', 'orders', 'clients'].includes(page))
    );
  }
  go(page: string) {
    if (!this.allowed(page)) return;
    this.page = page;
    this.search = '';
    this.status = 'Todas';
    this.category = 'Todos';
    this.mobileNav = false;
  }
  switchEmployee() {
    this.saveSession();
    this.selectedId = null;
    this.modal = '';
    if (!this.allowed(this.page)) this.go('overview');
    this.notify(`Perfil demonstrativo: ${this.role}`);
  }
  persist(message = '') {
    try {
      localStorage.setItem('rituals-demo-v1', JSON.stringify(this.state));
      if (message) this.notify(message);
    } catch {
      this.notify('Alterações aplicadas nesta sessão. O navegador não permitiu salvar os dados.');
    }
  }
  notify(message: string) {
    this.toast = message;
    clearTimeout(this.toastTimer);
    this.toastTimer = setTimeout(() => (this.toast = ''), 4500);
  }
  openModal(kind: string, record?: any) {
    if (
      (['supplier', 'product', 'staff', 'restock', 'reset'].includes(kind) && this.role !== 'Gerente') ||
      (['credit', 'movement', 'cashOpen', 'cashClose'].includes(kind) && this.role === 'Atendente')
    )
      return;
    this.error = '';
    this.modal = kind;
    this.form = record
      ? { ...record }
      : kind === 'order'
        ? { clientId: this.state.clients[0]?.id, location: '', staff: this.employee.name }
        : kind === 'client'
          ? { name: '', email: '', phone: '', tier: 'Member' }
          : kind === 'product'
            ? { name: '', category: 'Bebidas', price: null, stock: 0, minimum: 5, unit: 'un', supplierId: this.state.suppliers[0]?.id }
            : kind === 'staff'
              ? { name: '', email: '', role: 'Atendente', active: true }
              : kind === 'movement'
                ? { type: 'Suprimento', amount: null, note: '' }
                : {};
    if (kind === 'credit') this.form = { clientId: record?.id || this.state.clients[0]?.id, amount: null, note: '' };
    if (kind === 'restock') this.form = { ...record, amount: null };
  }
  save() {
    this.error = '';
    const f = this.form;
    const fail = (text: string) => {
      this.error = text;
    };
    if (['client', 'supplier', 'product', 'staff'].includes(this.modal) && !f.name?.trim()) return fail('Informe o nome.');
    if (['client', 'supplier', 'staff'].includes(this.modal) && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email || ''))
      return fail('Informe um e-mail válido.');
    if (['client', 'supplier'].includes(this.modal) && (f.phone || '').replace(/\D/g, '').length < 10)
      return fail('Informe um telefone com DDD.');
    switch (this.modal) {
      case 'order': {
        if (!f.clientId || !f.location?.trim()) return fail('Selecione o cliente e informe o local.');
        const order: Order = {
          id: Math.max(1051, ...this.state.orders.map((o) => o.id)) + 1,
          clientId: Number(f.clientId),
          location: f.location.trim(),
          staff: this.employee.name,
          opened: new Date().toISOString(),
          status: 'Aberta',
          items: []
        };
        this.state.orders.unshift(order);
        this.selectedId = order.id;
        this.page = 'orders';
        this.productSearch = '';
        break;
      }
      case 'client':
        this.upsert('clients', { ...f, name: f.name.trim(), credit: f.credit || 0 });
        break;
      case 'supplier':
        this.upsert('suppliers', { ...f, name: f.name.trim() });
        break;
      case 'product':
        if (
          !f.category?.trim() ||
          !Number.isFinite(+f.price) ||
          +f.price <= 0 ||
          !Number.isInteger(+f.stock) ||
          +f.stock < 0 ||
          !Number.isInteger(+f.minimum) ||
          +f.minimum < 0
        )
          return fail('Informe categoria, preço positivo e quantidades inteiras não negativas.');
        this.upsert('products', { ...f, price: +f.price, stock: +f.stock, minimum: +f.minimum, supplierId: +f.supplierId });
        break;
      case 'staff':
        if (f.id === this.employee.id && (!f.active || f.role !== 'Gerente')) return fail('Mantenha seu próprio acesso de gerente ativo.');
        this.upsert('employees', f);
        break;
      case 'restock': {
        if (!Number.isInteger(+f.amount) || +f.amount <= 0) return fail('Informe uma quantidade inteira positiva.');
        this.state.products.find((p) => p.id === f.id)!.stock += +f.amount;
        break;
      }
      case 'credit': {
        if (!f.clientId || !Number.isFinite(+f.amount) || +f.amount <= 0 || !f.note?.trim())
          return fail('Selecione o cliente e informe valor positivo e descrição.');
        const c = this.client(+f.clientId);
        const amount = Math.round(+f.amount * 100) / 100;
        c.credit = Math.round((c.credit + amount) * 100) / 100;
        this.state.credits.unshift({ id: id(), clientId: c.id, amount, note: f.note.trim(), date: new Date().toISOString() });
        break;
      }
      case 'movement': {
        if (!this.state.cashOpen) return fail('O caixa está fechado.');
        if (!Number.isFinite(+f.amount) || +f.amount <= 0 || !f.note?.trim()) return fail('Informe valor positivo e descrição.');
        if (f.type === 'Sangria' && +f.amount > cashBalance(this.state)) return fail('O valor excede o saldo em dinheiro.');
        this.state.movements.unshift({
          id: id(),
          type: f.type,
          amount: (Math.round(+f.amount * 100) / 100) * (f.type === 'Sangria' ? -1 : 1),
          note: f.note.trim(),
          date: new Date().toISOString(),
          session: this.state.session
        });
        break;
      }
      case 'cashOpen':
        if (!Number.isFinite(+f.amount) || +f.amount < 0 || f.amount == null) return fail('Informe um saldo inicial válido.');
        this.state.cashOpen = true;
        this.state.session++;
        this.state.opening = Math.round(+f.amount * 100) / 100;
        break;
      case 'cashClose':
        if (this.openOrders.length) return fail('Feche as comandas abertas antes de encerrar o caixa.');
        this.state.cashOpen = false;
        this.state.cashClosedAt = new Date().toISOString();
        break;
      case 'reset':
        this.state = seed();
        this.currentEmployeeId = 1;
        this.selectedId = null;
        this.go('overview');
        break;
    }
    this.modal = '';
    this.persist('Alteração salva no ambiente demonstrativo.');
  }
  upsert(collection: 'clients' | 'suppliers' | 'products' | 'employees', record: any) {
    const list = this.state[collection] as any[];
    const index = list.findIndex((r) => r.id === record.id);
    if (index >= 0) list[index] = { ...record };
    else list.unshift({ ...record, id: id() });
  }
  viewOrder(order: Order) {
    this.selectedId = order.id;
    this.productSearch = '';
    this.payment = 'Pix';
    this.error = '';
  }
  addProduct(productId: number) {
    const order = this.selected;
    const p = this.state.products.find((p) => p.id === productId);
    if (!order || !p || order.status !== 'Aberta') return;
    const existing = order.items.find((i) => i.productId === productId);
    if ((existing?.qty || 0) >= p.stock) return this.notify('Quantidade maior que o estoque disponível.');
    if (existing) existing.qty++;
    else order.items.push({ productId: p.id, name: p.name, price: p.price, qty: 1 });
    this.persist();
  }
  changeQty(productId: number, delta: number) {
    const o = this.selected;
    if (!o || o.status !== 'Aberta') return;
    if (delta > 0) return this.addProduct(productId);
    const item = o.items.find((i) => i.productId === productId)!;
    item.qty--;
    o.items = o.items.filter((i) => i.qty > 0);
    this.persist();
  }
  finishOrder() {
    try {
      checkout(this.state, this.selectedId!, this.payment, this.role);
      this.persist('Comanda fechada. Venda, estoque e saldo atualizados.');
      this.selectedId = null;
    } catch (e: any) {
      this.error = e.message;
    }
  }
  exportSales() {
    const rows = [
      ['Comanda', 'Cliente', 'Data', 'Pagamento', 'Total'],
      ...this.filteredSales.map((s) => [
        String(s.orderId),
        this.client(s.clientId)?.name || '',
        new Date(s.date).toLocaleString('pt-BR'),
        s.payment,
        s.total.toFixed(2).replace('.', ',')
      ])
    ];
    const csv = '\uFEFF' + rows.map((r) => r.map((v) => '"' + String(v).replace(/"/g, '""') + '"').join(';')).join('\r\n');
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const a = document.createElement('a');
    a.href = url;
    a.download = 'rituals-vendas.csv';
    a.click();
    URL.revokeObjectURL(url);
    this.notify('Relatório exportado.');
  }
  @HostListener('document:keydown.escape') closeOverlays() {
    if (this.modal) this.modal = '';
    else this.selectedId = null;
    this.mobileNav = false;
  }
}
