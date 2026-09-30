const express = require('express');
const app = express();

app.use(express.json());

const accounts = [
  { id: 1, name: 'Aarav', balance: 25000 },
  { id: 2, name: 'Diya', balance: 18000 },
  { id: 3, name: 'Rahul', balance: 32000 }
];

let transactions = [];

app.get('/accounts', (req, res) => {
  res.json(accounts);
});

app.get('/accounts/:id/balance', (req, res) => {
  const account = accounts.find(a => a.id === Number(req.params.id));

  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  res.json({
    accountId: account.id,
    name: account.name,
    balance: account.balance
  });
});

app.get('/accounts/:id/transactions', (req, res) => {
  const account = accounts.find(a => a.id === Number(req.params.id));

  if (!account) {
    return res.status(404).json({ error: 'Account not found' });
  }

  res.json(transactions.filter(t =>
    t.fromAccount === account.id || t.toAccount === account.id
  ));
});

app.post('/transfer', (req, res) => {
  const { fromAccount, toAccount, amount } = req.body;

  if (!Number.isFinite(amount) || amount <= 0) {
    return res.status(400).json({ error: 'Amount must be greater than zero' });
  }

  const sender = accounts.find(a => a.id === fromAccount);
  const receiver = accounts.find(a => a.id === toAccount);

  if (!sender || !receiver) {
    return res.status(404).json({ error: 'Account not found' });
  }

  if (sender.id === receiver.id) {
    return res.status(400).json({ error: 'Cannot transfer to the same account' });
  }

  if (sender.balance < amount) {
    return res.status(400).json({ error: 'Insufficient balance' });
  }

  sender.balance -= amount;
  receiver.balance += amount;

  const transaction = {
    transactionId: transactions.length + 1,
    fromAccount,
    toAccount,
    amount,
    status: 'SUCCESS'
  };

  transactions.push(transaction);
  res.status(201).json(transaction);
});

module.exports = app;