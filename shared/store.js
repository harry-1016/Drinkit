// ============================================================
//  DeliveryOS — Shared Data Store (localStorage + BroadcastChannel)
//  All three apps (customer / delivery / admin) share this module.
// ============================================================

const KEYS = {
  MENU:   'dos_menu',
  ORDERS: 'dos_orders',
  USERS:  'dos_users',
  STATS:  'dos_stats',
};

const bc = typeof BroadcastChannel !== 'undefined' ? new BroadcastChannel('deliveryos') : null;

// ── Seed default data ──────────────────────────────────────
function seed() {
  if (!localStorage.getItem(KEYS.MENU)) {
    localStorage.setItem(KEYS.MENU, JSON.stringify([
      { id: 'm1', name: 'Margherita Pizza', category: 'Pizza', price: 12.99, desc: 'Classic tomato & mozzarella', emoji: '🍕', available: true, image: '' },
      { id: 'm2', name: 'BBQ Chicken Burger', category: 'Burgers', price: 9.99, desc: 'Smoky BBQ sauce, crispy chicken', emoji: '🍔', available: true, image: '' },
      { id: 'm3', name: 'Caesar Salad', category: 'Salads', price: 7.49, desc: 'Romaine, croutons, parmesan', emoji: '🥗', available: true, image: '' },
      { id: 'm4', name: 'Spaghetti Carbonara', category: 'Pasta', price: 11.49, desc: 'Creamy egg & bacon pasta', emoji: '🍝', available: true, image: '' },
      { id: 'm5', name: 'Mango Smoothie', category: 'Drinks', price: 4.99, desc: 'Fresh mango, yogurt, honey', emoji: '🥭', available: true, image: '' },
      { id: 'm6', name: 'Chocolate Lava Cake', category: 'Desserts', price: 5.99, desc: 'Warm chocolate centre', emoji: '🍫', available: true, image: '' },
    ]));
  }
  if (!localStorage.getItem(KEYS.ORDERS)) {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify([
      { id: 'u1', name: 'Alex Johnson', email: 'alex@example.com', role: 'customer', address: '42 Maple St, Springfield' },
      { id: 'u2', name: 'Sam Rivera',   email: 'sam@example.com',  role: 'driver',   vehicle: 'Honda Civic • ABC-1234' },
      { id: 'u3', name: 'Admin User',   email: 'admin@deliveryos.com', role: 'admin', password: 'admin123' },
    ]));
  }
}

// ── CRUD helpers ───────────────────────────────────────────
const Store = {
  getMenu:   () => JSON.parse(localStorage.getItem(KEYS.MENU)   || '[]'),
  getOrders: () => JSON.parse(localStorage.getItem(KEYS.ORDERS) || '[]'),
  getUsers:  () => JSON.parse(localStorage.getItem(KEYS.USERS)  || '[]'),

  saveMenu(items) {
    localStorage.setItem(KEYS.MENU, JSON.stringify(items));
    bc?.postMessage({ type: 'MENU_UPDATED' });
  },

  saveOrders(orders) {
    localStorage.setItem(KEYS.ORDERS, JSON.stringify(orders));
    bc?.postMessage({ type: 'ORDERS_UPDATED' });
  },

  // ── Order helpers ──
  createOrder(order) {
    const orders = Store.getOrders();
    const newOrder = {
      ...order,
      id: 'ord_' + Date.now(),
      status: 'pending',        // pending → accepted → preparing → out_for_delivery → delivered
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      driverId: null,
      eta: null,
    };
    orders.unshift(newOrder);
    Store.saveOrders(orders);
    return newOrder;
  },

  updateOrderStatus(orderId, status, extra = {}) {
    const orders = Store.getOrders();
    const idx = orders.findIndex(o => o.id === orderId);
    if (idx === -1) return null;
    orders[idx] = { ...orders[idx], status, ...extra, updatedAt: new Date().toISOString() };
    Store.saveOrders(orders);
    return orders[idx];
  },

  // ── Menu helpers ──
  addMenuItem(item) {
    const menu = Store.getMenu();
    const newItem = { ...item, id: 'mi_' + Date.now() };
    menu.push(newItem);
    Store.saveMenu(menu);
    return newItem;
  },

  updateMenuItem(id, updates) {
    const menu = Store.getMenu();
    const idx = menu.findIndex(m => m.id === id);
    if (idx === -1) return null;
    menu[idx] = { ...menu[idx], ...updates };
    Store.saveMenu(menu);
    return menu[idx];
  },

  deleteMenuItem(id) {
    const menu = Store.getMenu().filter(m => m.id !== id);
    Store.saveMenu(menu);
  },

  // ── Stats ──
  getStats() {
    const orders = Store.getOrders();
    const delivered = orders.filter(o => o.status === 'delivered');
    const revenue = delivered.reduce((s, o) => s + (o.total || 0), 0);
    const today = new Date().toDateString();
    const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === today);
    const statusCounts = orders.reduce((acc, o) => { acc[o.status] = (acc[o.status]||0)+1; return acc; }, {});
    const topItems = {};
    orders.forEach(o => (o.items||[]).forEach(i => { topItems[i.name] = (topItems[i.name]||0)+i.qty; }));
    const top5 = Object.entries(topItems).sort((a,b)=>b[1]-a[1]).slice(0,5);
    return { total: orders.length, delivered: delivered.length, revenue, todayOrders: todayOrders.length, statusCounts, top5 };
  },

  // ── Broadcast listener ──
  onUpdate(cb) {
    bc?.addEventListener('message', cb);
    return () => bc?.removeEventListener('message', cb);
  }
};

seed();
export default Store;
