const fs = require('fs');
const path = require('path');
const Account = require('../models/Account');

const DATA_PATH = path.join(__dirname, '../data/accounts.json');

function readAccounts() {
  try {
    const data = fs.readFileSync(DATA_PATH, 'utf-8');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Ошибка чтения файла:', error);
    return [];
  }
}

function writeAccounts(data) {
  try {
    fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Ошибка записи файла:', error);
    throw error;
  }
}

module.exports = app => {

  app.get('/accounts', (req, res) => {
    try {
      const accounts = readAccounts();
      res.json(accounts);
    } catch (error) {
      res.status(500).json({
        message: 'Ошибка при получении счетов',
        error: error.message
      });
    }
  });

  app.post('/accounts', (req, res) => {
    try {
      const accounts = readAccounts();
      const account = Account.create(req.body);
      accounts.push(account);
      writeAccounts(accounts);
      res.status(201).json(account);
    } catch (error) {
      res.status(400).json({
        message: 'Ошибка при создании счета',
        error: error.message
      });
    }
  });

  app.get('/accounts/:id', (req, res) => {
    try {
      const accounts = readAccounts();
      const account = accounts.find(
        a => a.id === Number(req.params.id)
      );

      if (!account) {
        return res.status(404).json({
          message: 'Счет не найден'
        });
      }

      res.json(account);
    } catch (error) {
      res.status(500).json({
        message: 'Ошибка при получении счета',
        error: error.message
      });
    }
  });

  app.put('/accounts/:id', (req, res) => {
    try {
      const accounts = readAccounts();
      const index = accounts.findIndex(
        a => a.id === Number(req.params.id)
      );

      if (index === -1) {
        return res.status(404).json({
          message: 'Счет не найден'
        });
      }

      accounts[index] = {
        id: accounts[index].id,
        accountNumber: req.body.accountNumber,
        accountHolder: req.body.accountHolder,
        balance: parseFloat(req.body.balance),
        currency: req.body.currency,
        isActive: Boolean(req.body.isActive),
        accountType: req.body.accountType,
        createdAt: accounts[index].createdAt, // Не меняем дату создания
        transactions: req.body.transactions || []
      };

      writeAccounts(accounts);
      res.json(accounts[index]);
    } catch (error) {
      res.status(400).json({
        message: 'Ошибка при обновлении счета',
        error: error.message
      });
    }
  });

  app.patch('/accounts/:id', (req, res) => {
    try {
      const accounts = readAccounts();
      const account = accounts.find(
        a => a.id === Number(req.params.id)
      );

      if (!account) {
        return res.status(404).json({
          message: 'Счет не найден'
        });
      }

      if (req.body.accountHolder) account.accountHolder = req.body.accountHolder;
      if (req.body.balance) account.balance += parseFloat(req.body.balance); // Можно пополнять/списывать
      if (req.body.currency) account.currency = req.body.currency;
      if (typeof req.body.isActive === 'boolean') account.isActive = req.body.isActive;
      if (req.body.accountType) account.accountType = req.body.accountType;
      if (req.body.transactions) {
        account.transactions = [...new Set([...account.transactions, ...req.body.transactions])];
      }

      writeAccounts(accounts);
      res.json(account);
    } catch (error) {
      res.status(400).json({
        message: 'Ошибка при частичном обновлении счета',
        error: error.message
      });
    }
  });

  app.delete('/accounts/:id', (req, res) => {
    try {
      const accounts = readAccounts();
      const index = accounts.findIndex(
        a => a.id === Number(req.params.id)
      );

      if (index === -1) {
        return res.status(404).json({
          message: 'Счет не найден'
        });
      }

      const deleted = accounts.splice(index, 1);
      writeAccounts(accounts);

      res.json(deleted[0]);
    } catch (error) {
      res.status(500).json({
        message: 'Ошибка при удалении счета',
        error: error.message
      });
    }
  });

  app.get('/accounts/:id/balance', (req, res) => {
    try {
      const accounts = readAccounts();
      const account = accounts.find(
        a => a.id === Number(req.params.id)
      );

      if (!account) {
        return res.status(404).json({
          message: 'Счет не найден'
        });
      }

      res.json({
        id: account.id,
        accountNumber: account.accountNumber,
        balance: account.balance,
        currency: account.currency
      });
    } catch (error) {
      res.status(500).json({
        message: 'Ошибка при получении баланса',
        error: error.message
      });
    }
  });

};