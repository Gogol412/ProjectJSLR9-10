const fs = require('fs');
const path = require('path');
const Transaction = require('../models/Transaction');

const DATA_PATH = path.join(__dirname, '../data/transactions.json');

function readTransactions() {
    try {
        const data = fs.readFileSync(DATA_PATH, 'utf-8');
        return data ? JSON.parse(data) : [];
    } catch (error) {
        console.error('Ошибка чтения файла транзакций:', error);
        return [];
    }
}

function writeTransactions(data) {
    try {
        fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
    } catch (error) {
        console.error('Ошибка записи файла транзакций:', error);
        throw error;
    }
}

module.exports = app => {

    app.get('/transactions', (req, res) => {
        try {
            const transactions = readTransactions();

            let filtered = [...transactions];

            if (req.query.accountId) {
                filtered = filtered.filter(t => t.accountId === Number(req.query.accountId));
            }

            if (req.query.type) {
                filtered = filtered.filter(t => t.type === req.query.type);
            }

            if (req.query.status) {
                filtered = filtered.filter(t => t.status === req.query.status);
            }

            if (req.query.isFraudulent) {
                filtered = filtered.filter(t => t.isFraudulent === (req.query.isFraudulent === 'true'));
            }

            if (req.query.startDate && req.query.endDate) {
                const start = new Date(req.query.startDate);
                const end = new Date(req.query.endDate);
                filtered = filtered.filter(t => {
                    const date = new Date(t.timestamp);
                    return date >= start && date <= end;
                });
            }

            res.json(filtered);
        } catch (error) {
            res.status(500).json({
                message: 'Ошибка при получении транзакций',
                error: error.message
            });
        }
    });

    app.post('/transactions', (req, res) => {
        try {
            const transactions = readTransactions();
            const transaction = Transaction.create(req.body);
            transactions.push(transaction);
            writeTransactions(transactions);
            res.status(201).json(transaction);
        } catch (error) {
            res.status(400).json({
                message: 'Ошибка при создании транзакции',
                error: error.message
            });
        }
    });

    app.get('/transactions/:id', (req, res) => {
        try {
            const transactions = readTransactions();
            const transaction = transactions.find(
                t => t.id === Number(req.params.id)
            );

            if (!transaction) {
                return res.status(404).json({
                    message: 'Транзакция не найдена'
                });
            }

            res.json(transaction);
        } catch (error) {
            res.status(500).json({
                message: 'Ошибка при получении транзакции',
                error: error.message
            });
        }
    });

    app.get('/transactions/account/:accountId', (req, res) => {
        try {
            const transactions = readTransactions();
            const accountTransactions = transactions.filter(
                t => t.accountId === Number(req.params.accountId)
            );

            if (accountTransactions.length === 0) {
                return res.status(404).json({
                    message: 'Транзакции для данного счета не найдены'
                });
            }

            res.json(accountTransactions);
        } catch (error) {
            res.status(500).json({
                message: 'Ошибка при получении транзакций по счету',
                error: error.message
            });
        }
    });

    app.put('/transactions/:id', (req, res) => {
        try {
            const transactions = readTransactions();
            const index = transactions.findIndex(
                t => t.id === Number(req.params.id)
            );

            if (index === -1) {
                return res.status(404).json({
                    message: 'Транзакция не найдена'
                });
            }

            transactions[index] = {
                id: transactions[index].id,
                transactionId: req.body.transactionId || transactions[index].transactionId,
                accountId: Number(req.body.accountId) || transactions[index].accountId,
                accountNumber: req.body.accountNumber || transactions[index].accountNumber,
                type: req.body.type || transactions[index].type,
                amount: parseFloat(req.body.amount) || transactions[index].amount,
                currency: req.body.currency || transactions[index].currency,
                description: req.body.description || transactions[index].description,
                status: req.body.status || transactions[index].status,
                isFraudulent: Boolean(req.body.isFraudulent),
                timestamp: transactions[index].timestamp, // Не меняем timestamp
                tags: req.body.tags || transactions[index].tags
            };

            writeTransactions(transactions);
            res.json(transactions[index]);
        } catch (error) {
            res.status(400).json({
                message: 'Ошибка при обновлении транзакции',
                error: error.message
            });
        }
    });

    app.patch('/transactions/:id', (req, res) => {
        try {
            const transactions = readTransactions();
            const transaction = transactions.find(
                t => t.id === Number(req.params.id)
            );

            if (!transaction) {
                return res.status(404).json({
                    message: 'Транзакция не найдена'
                });
            }

            if (req.body.status) {
                transaction.status = req.body.status;
                if (req.body.status === 'completed') {
                    transaction.tags = [...new Set([...transaction.tags, 'processed'])];
                }
            }

            if (typeof req.body.isFraudulent === 'boolean') {
                transaction.isFraudulent = req.body.isFraudulent;
                if (req.body.isFraudulent) {
                    transaction.tags = [...new Set([...transaction.tags, 'fraud', 'review'])];
                }
            }

            if (req.body.amount) {
                transaction.amount = parseFloat(transaction.amount) + parseFloat(req.body.amount);
                transaction.tags = [...new Set([...transaction.tags, 'adjusted'])];
            }

            if (req.body.description) {
                transaction.description += ` [ДОПОЛНЕНО: ${req.body.description}]`;
            }

            if (req.body.tags) {
                transaction.tags = [...new Set([...transaction.tags, ...req.body.tags])];
            }

            if (Object.keys(req.body).length > 0) {
                transaction.timestamp = new Date().toISOString();
            }

            writeTransactions(transactions);
            res.json(transaction);
        } catch (error) {
            res.status(400).json({
                message: 'Ошибка при частичном обновлении транзакции',
                error: error.message
            });
        }
    });

    app.delete('/transactions/:id', (req, res) => {
        try {
            const transactions = readTransactions();
            const index = transactions.findIndex(
                t => t.id === Number(req.params.id)
            );

            if (index === -1) {
                return res.status(404).json({
                    message: 'Транзакция не найдена'
                });
            }

            const deleted = transactions.splice(index, 1);
            writeTransactions(transactions);

            res.json(deleted[0]);
        } catch (error) {
            res.status(500).json({
                message: 'Ошибка при удалении транзакции',
                error: error.message
            });
        }
    });

    app.patch('/transactions/:id/mark-fraud', (req, res) => {
        try {
            const transactions = readTransactions();
            const transaction = transactions.find(
                t => t.id === Number(req.params.id)
            );

            if (!transaction) {
                return res.status(404).json({
                    message: 'Транзакция не найдена'
                });
            }

            transaction.markAsFraudulent();
            writeTransactions(transactions);

            res.json(transaction);
        } catch (error) {
            res.status(500).json({
                message: 'Ошибка при отметке транзакции',
                error: error.message
            });
        }
    });

    app.get('/transactions/stats/summary', (req, res) => {
        try {
            const transactions = readTransactions();

            const summary = {
                total: transactions.length,
                totalAmount: transactions.reduce((sum, t) => sum + parseFloat(t.amount), 0),
                byType: {},
                byStatus: {},
                byCurrency: {},
                fraudulent: transactions.filter(t => t.isFraudulent).length,
                today: transactions.filter(t => {
                    const today = new Date().toDateString();
                    return new Date(t.timestamp).toDateString() === today;
                }).length
            };

            transactions.forEach(t => {
                summary.byType[t.type] = (summary.byType[t.type] || 0) + 1;
                summary.byStatus[t.status] = (summary.byStatus[t.status] || 0) + 1;
                summary.byCurrency[t.currency] = (summary.byCurrency[t.currency] || 0) + 1;
            });

            res.json(summary);
        } catch (error) {
            res.status(500).json({
                message: 'Ошибка при получении статистики',
                error: error.message
            });
        }
    });

};