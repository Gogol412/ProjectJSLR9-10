module.exports = function bodyParser() {
    return (req, res, next) => {
        if (req.method === 'GET' || req.method === 'DELETE') {
            return next();
        }

        let body = '';

        req.on('data', (chunk) => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                req.body = body ? JSON.parse(body) : {};
                next();
            } catch (err) {
                res.status(400).json({ message: 'Invalid JSON' });
            }
        });
    };
};
