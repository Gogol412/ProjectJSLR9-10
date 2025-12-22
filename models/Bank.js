class Bank {
  constructor(name, location) {
    this.name = name;
    this.location = location;
    this.accounts = [];
    this.transactions = [];
  }

  addAccount(account) {
    this.accounts.push(account);
  }

  addTransaction(transaction) {
    this.transactions.push(transaction);
  }

  getAccountById(id) {
    return this.accounts.find(account => account.id === id);
  }

  getTransactionById(id) {
    return this.transactions.find(transaction => transaction.id === id);
  }
}