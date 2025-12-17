
/*
1. класс request *
2. парсинг тела запроса
3. поддержка json и form-data
4. работа с потоками
5. инициализация свойств: body, params, query *
6. доступ к оригинальному request *
7. парсинг заголовков *
*/
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
}
const test={
  method:'GET',
  url:'/users?id=10',
  headers:{
    'content-type':'app/json'
  },
  query:{id:'10'},
  params:{userID:'5'},
  body:{name:'Lisa'}
};
const testik= new Request(test);
console.log(testik);