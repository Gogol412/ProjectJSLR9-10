/*
1 Класс Router +
2 Хранение маршрутов по методам
(GET, POST и т.д. )+
3 Метод addRoute() - добавление
маршрутов +
4 Метод findRoute() - поиск
маршрута по URL
5 pathToRegex() - конвертация
путей в регулярки
6 getParamNames () - извлечение
имен параметров (:id → id)
7 Поддержка path параметров (/
users/:id)
8 Поддержка query строк (?
name=John)*/

class Router {
  constructor() {
    this.routes = {
      GET: [],
      POST: [],
      PUT: [],
      PATCH: [],
      DELETE: []
    };
  }

  addRoute(method, path, handler) {
    const normMethod = method.toUpperCase();
    if (!this.routes[normMethod]) {
      throw new Error(`HTTP метод ${normMethod} не поддерживается`);
    }

    const paramNames = [];
    const regexPath = path.replace(/:([a-zA-Z0-9]+)/g, (_, name) => {
      paramNames.push(name);
      return '([^/]+)';
    });

    this.routes[normMethod].push({
      path,
      handler,
      regex: new RegExp(`^${regexPath}$`),
      paramNames
    });
  }

  findRoute(method, url) {
    const normMethod = method.toUpperCase();
    const [pathname, queryString] = url.split('?');
    
    const routes = this.routes[normMethod];
    if (!routes) return null;

    for (const route of routes) {
      const match = pathname.match(route.regex);
      if (match) {
        const params = {};
        route.paramNames.forEach((name, index) => {
          params[name] = match[index + 1];
        });

        const query = this._parseQuery(queryString);

        return {
          handler: route.handler,
          params,
          query
        };
      }
    }
    return null;
  }
  _parseQuery(queryString) {
    const query = {};
    if (!queryString) return query;
    const pairs = queryString.split('&');
    for (const pair of pairs) {
      const [key, value] = pair.split('=');
      query[decodeURIComponent(key)] = decodeURIComponent(value || '');
    }
    return query;
  }
}