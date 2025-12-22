class Transaction {
    constructor({
        id,
        transactionId,
        accountId,
        accountNumber,
        type,
        amount,
        currency,
        description,
        status,
        isFraudulent,
        timestamp,
        tags
    }) {
        this.id = id;
        this.transactionId = transactionId;
        this.accountId = accountId;
        this.accountNumber = accountNumber;
        this.type = type;
        this.amount = amount;
        this.currency = currency;
        this.description = description;
        this.status = status;
        this.isFraudulent = isFraudulent;
        this.timestamp = timestamp;
        this.tags = tags;
    }

    static create(data) {
        const generateTransactionId = () => {
            const date = new Date();
            const year = date.getFullYear();
            const month = String(date.getMonth() + 1).padStart(2, '0');
            const random = Math.floor(1000 + Math.random() * 9000);
            return `TRX-${year}-${month}-${random}`;
        };

        const generateDescription = (type) => {
            const descriptions = {
                deposit: ['Пополнение счета', 'Внесение наличных', 'Банковский перевод на счет'],
                withdrawal: ['Снятие наличных', 'Выдача наличных', 'Снятие в банкомате'],
                transfer: ['Межбанковский перевод', 'Перевод между счетами', 'Денежный перевод'],
                payment: ['Оплата услуг', 'Платеж по карте', 'Автоплатеж']
            };

            const options = descriptions[type] || ['Банковская операция'];
            return options[Math.floor(Math.random() * options.length)];
        };

        return new Transaction({
            id: Date.now(),
            transactionId: data.transactionId || generateTransactionId(),
            accountId: Number(data.accountId) || 1,
            accountNumber: data.accountNumber || '00000000000000000000',
            type: data.type || ['deposit', 'withdrawal', 'transfer', 'payment'][Math.floor(Math.random() * 4)],
            amount: parseFloat(data.amount) || (Math.random() * 10000).toFixed(2),
            currency: data.currency || ['RUB', 'USD', 'EUR'][Math.floor(Math.random() * 3)],
            description: data.description || generateDescription(data.type),
            status: data.status || ['pending', 'completed', 'failed'][Math.floor(Math.random() * 3)],
            isFraudulent: Boolean(data.isFraudulent),
            timestamp: new Date().toISOString(),
            tags: data.tags || []
        });
    }

    markAsFraudulent() {
        this.isFraudulent = true;
        this.tags = [...new Set([...this.tags, 'fraud', 'suspicious'])];
        return this;
    }

    complete() {
        this.status = 'completed';
        return this;
    }

    cancel() {
        this.status = 'cancelled';
        return this;
    }
}

module.exports = Transaction;