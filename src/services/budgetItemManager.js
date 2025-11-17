/**
 * Budget Item Manager
 * Gerencia itens do orçamento (add, edit, remove, calculate)
 */

export class BudgetItemManager {
  constructor() {
    this.items = [];
    this.history = [];
  }

  addItem(item) {
    const newItem = {
      id: Date.now().toString(),
      description: item.description,
      price: parseFloat(item.price) || 0,
      quantity: parseInt(item.quantity) || 1,
      type: item.type || 'service',
      createdAt: new Date()
    };
    
    this.items.push(newItem);
    this.history.push({ action: 'add', item: newItem });
    
    return newItem;
  }

  editItem(itemId, updates) {
    const index = this.items.findIndex(i => i.id === itemId);
    if (index === -1) return null;
    
    const oldItem = { ...this.items[index] };
    this.items[index] = { ...this.items[index], ...updates };
    this.history.push({ action: 'edit', old: oldItem, new: this.items[index] });
    
    return this.items[index];
  }

  removeItem(itemId) {
    const index = this.items.findIndex(i => i.id === itemId);
    if (index === -1) return null;
    
    const removed = this.items.splice(index, 1)[0];
    this.history.push({ action: 'remove', item: removed });
    
    return removed;
  }

  getTotal() {
    return this.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }

  getItems() {
    return [...this.items];
  }

  clear() {
    this.items = [];
    this.history = [];
  }

  undo() {
    if (this.history.length === 0) return null;
    
    const lastAction = this.history.pop();
    
    if (lastAction.action === 'add') {
      this.items = this.items.filter(i => i.id !== lastAction.item.id);
    } else if (lastAction.action === 'remove') {
      this.items.push(lastAction.item);
    } else if (lastAction.action === 'edit') {
      const index = this.items.findIndex(i => i.id === lastAction.new.id);
      if (index !== -1) this.items[index] = lastAction.old;
    }
    
    return lastAction;
  }
}

export default BudgetItemManager;
