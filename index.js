//Подключение нужных модулей
const parabolicInterpolation = require('./ParabolicInterpolation');
const express = require('express');
const bodyParser = require('body-parser');

//Обработчик тела запроса
var urlencodedParser = bodyParser.urlencoded({ extended: false });

//Создание сервера express
var app = express();
//Выбор шаблонизатора ejs
app.set('view engine', 'ejs');
//Использование директории "./public"
app.use(express.static(__dirname + '/public'));

//Обработчик запроса get с адресом /
app.get('/', (req, res) => {
    res.render('input'); 
});

//Обработчик запроса post с адресом localhost:3000/result
app.post('/result', urlencodedParser, (req, res) => {
    console.log(req.body);
    let solution = parabolicInterpolation.interpolate(req.body);
    res.render('index', {solution: solution});
});

//Прослушивание порта 3000
app.listen(3000);