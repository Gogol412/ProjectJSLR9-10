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
  getRoutes() {
    return this.routes;
  }
  setRoutes(value){
    this.routes=value;
  }
  addRoute(method, path,handler){
    const normMethod = method.toUpperCase();
    if(!this.routes[normMethod]){
      throw new Error(HTTP, '${normMethod} не поддерживается ');
    }
    if(typeof handler!=='function'){
      throw new Error('Handler д.б функцией')
    }
    this.routes[normMethod].push({
      path,
      handler
    });
  }
}




const router=new Router();
function homeHand(){
  console.log("Home");
}
function loginHand(){
  console.log('Login');
}
router.addRoute('get','/home',homeHand);
router.addRoute('post','/login',loginHand);
console.log(router.getRoutes());
router.getRoutes().GET[0].handler();
router.getRoutes().POST[0].handler();