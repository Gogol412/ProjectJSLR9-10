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
      throw new Error(`HTTP ${normMethod} не поддерживается`);
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