const App = require('./framework/app');
const bodyParser = require('./framework/bodyParser');

const app = new App();

app.use(bodyParser());

require('./routes/patterns.routes')(app);

app.listen(3001, () => {
    console.log('Server started on port 3001');
    console.log('http://localhost:3001');
});