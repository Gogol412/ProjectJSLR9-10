const http = require('http');
const Router = require('./router');


class App {
    constructor() {
        this.middlewares = [];
        this.router = new Router();
    }
    use(middleware) {
        this.middlewares.push(middleware);
    }

    get(path, handler) {
        this.router.register('GET', path, handler);
    }

    post(path, handler) {
        this.router.register('POST', path, handler);
    }

    put(path, handler) {
        this.router.register('PUT', path, handler);
    }

    patch(path, handler) {
        this.router.register('PATCH', path, handler);
    }

    delete(path, handler) {
        this.router.register('DELETE', path, handler);
    }

    listen(port, callback) {
        const server = http.createServer((req, res) => {
            this.handleRequest(req, res);
        });

        server.listen(port, callback);
    }

    handleRequest(req, res) {
        res.status = function (code) {
            res.statusCode = code;
            return res;
        };

        res.send = function (data) {
            res.end(data);
        };

        res.json = function (obj) {
            res.setHeader('Content-Type', 'application/json');
            res.end(JSON.stringify(obj));
        };

        let index = 0;
        const stack = [...this.middlewares, this.router.handle.bind(this.router)];

        const next = () => {
            const layer = stack[index++];
            if (!layer) return;
            layer(req, res, next);
        };

        next();
    }
}

module.exports = App;