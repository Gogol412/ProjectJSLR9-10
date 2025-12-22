const http = require('http');
const fs = require('fs');
const Request = require('./Request');
const accountsFile = './accounts.json';
const transactionsFile = './transactions.json';
const readJSON = (filePath) => JSON.parse(fs.readFileSync(filePath, 'utf-8'));
const writeJSON = (filePath, data) => fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
const server = http.createServer(async (req, res) => {
  const request = new Request(req);
  const { method, url } = request;
  if (url.startsWith('/accounts')) {
    if (method === 'GET') {
      if (url === '/accounts') {
        const accounts = readJSON(accountsFile);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(accounts));
      } 
      else if (url.startsWith('/accounts/')) {
        const id = parseInt(url.split('/')[2]);
        const accounts = readJSON(accountsFile);
        const account = accounts.find(acc => acc.id === id);
        if (account) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(account));
        } 
        else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Account not found' }));
        }
      }
    } 
    else if (method === 'POST') {
      await request.parseBody();
      const accounts = readJSON(accountsFile);
      const newAccount = { id: Date.now(), ...request.body };
      accounts.push(newAccount);
      writeJSON(accountsFile, accounts);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(newAccount));
    } 
    else if (method === 'PUT' && url.startsWith('/accounts/')) {
      const id = parseInt(url.split('/')[2]);
      await request.parseBody();
      const accounts = readJSON(accountsFile);
      const index = accounts.findIndex(acc => acc.id === id);
      if (index !== -1) {
        accounts[index] = { ...accounts[index], ...request.body };
        writeJSON(accountsFile, accounts);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(accounts[index]));
      } 
      else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Account not found' }));
      }
    } 
    else if (method === 'DELETE' && url.startsWith('/accounts/')) {
      const id = parseInt(url.split('/')[2]);
      const accounts = readJSON(accountsFile);
      const filteredAccounts = accounts.filter(acc => acc.id !== id);
      if (accounts.length !== filteredAccounts.length) {
        writeJSON(accountsFile, filteredAccounts);
        res.writeHead(204);
        res.end();
      } 
      else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Account not found' }));
      }
    }
  } 
  else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
});
server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});