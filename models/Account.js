class Account {
  constructor({ id, accountNumber, accountHolder, balance, currency, isActive, accountType, createdAt, transactions }) {
    this.id = id;
    this.accountNumber = accountNumber;
    this.accountHolder = accountHolder;
    this.balance = balance;
    this.currency = currency;
    this.isActive = isActive;
    this.accountType = accountType;
    this.createdAt = createdAt;
    this.transactions = transactions;
  }

  static create(data) {
    const generateAccountNumber = () => {
      const prefix = "40817810";
      const random = Math.floor(1000000000 + Math.random() * 9000000000);
      return prefix + random.toString().substring(0, 10);
    };

    return new Account({
      id: Date.now(),
      accountNumber: data.accountNumber || generateAccountNumber(),
      accountHolder: data.accountHolder || 'Неизвестный клиент',
      balance: parseFloat(data.balance) || 0.0,
      currency: data.currency || 'RUB',
      isActive: Boolean(data.isActive),
      accountType: data.accountType || 'current',
      createdAt: new Date().toISOString(),
      transactions: data.transactions || []
    });
  }

  deposit(amount) {
    this.balance += amount;
    return this.balance;
  }

  withdraw(amount) {
    if (this.balance >= amount) {
      this.balance -= amount;
      return this.balance;
    }
    throw new Error('Недостаточно средств');
  }
}

module.exports = Account;