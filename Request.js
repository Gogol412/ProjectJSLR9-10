/*
1. класс request *
2. парсинг тела запроса *
3. поддержка json и form-data *
4. работа с потоками *
5. инициализация свойств: body, params, query *
6. доступ к оригинальному request *
7. парсинг заголовков *
*/
const { Readable } = require('stream');
const formidable = require('formidable');
class Request{
  constructor(req) {
    this.orig=req;
    this.method=req.method;
    this.url=req.url;
    this.headers=req.headers;
    this.query=req.query || {};
    this.params=req.params ||{};
    this.body=req.body ||{};
  }

  async parseBody() {
    const contentType = this.headers['content-type'];

    if (contentType && contentType.includes('application/json')) {
      this.body = await this._parseJsonBody();
    } 
    else if (contentType && contentType.includes('multipart/form-data')) {
      this.body = await this._parseFormDataBody();
    } 
    else {
      this.body = {};
    }
  }
  _parseJsonBody() {
    return new Promise((resolve, reject) => {
      let data = '';
      const stream = this.orig instanceof Readable ? this.orig : Readable.from(this.orig.body);
      stream.on('data', chunk => {
        data += chunk;
      });

      stream.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } 
        catch (err) {
          reject(err);
        }
      });

      stream.on('error', err => {
        reject(err);
      });
    });
  }
  _parseFormDataBody() {
    return new Promise((resolve, reject) => {
      let data = '';
      const stream = this.orig instanceof Readable ? this.orig : Readable.from(this.orig.body);

      stream.on('data', chunk => {
        data += chunk;
      });

      stream.on('end', () => {
        resolve({ raw: data });
      });

      stream.on('error', err => {
        reject(err);
      });
    });
  }
}
const bodyParser = (req, res, next) => {
  let data = '';
  req.on('data', chunk => {
    data += chunk;
  });
  req.on('end', () => {
    try {
      req.body = JSON.parse(data);
      next();
    } catch (error) {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
  req.on('error', () => {
    res.status(500).json({ error: 'Failed to parse body' });
  });
};