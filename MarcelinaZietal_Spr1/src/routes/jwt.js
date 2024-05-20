const express = require('express');
const JWT = require('jwt-async');
const router = express.Router();
const userController = require('../controllers/usersController');


// router.post('/login', (req,res) => userController.login(req,res))










router.get('/algorithms', function(req, res, next) {
    console.log( JWT.getSupportedAlgorithms() );
    res.send('lista algorytmów w konsoli');
});

router.get('/header-payload', function(req, res, next) {
    var header = '{"typ":"JWT","alg":"HS256"}';
    var payload =
    '{"exp":"1489603440","name":"James Bond","admin":true,\
    "userId": "b08f86af-35da-48f2-8fab-cef3904660bd"}';
    console.log( JWT.base64urlEncode(header) );
    console.log( JWT.base64urlEncode(payload) );
    res.send('zakodowany nagłówek i ładunek w konsoli');
});

router.get('/generate-jwt', function(req, res, next) {
    var header = '{"typ":"JWT","alg":"HS256"}';
    var payload2 = {"exp":"1489603440","name":"James Bond","admin":true,
    "userId": "b08f86af-35da-48f2-8fab-cef3904660bd"};
    var jwt = new JWT(); // tworzymy instancję jwt, domyślnie jest algorytm HS256
    jwt.setSecret('secret'); // ustawiamy sekret
    jwt.sign(payload2, function (err, data) { // podpisujemy JWT
    if (err) console.log(err);
    console.log(data);
    });
    res.send('cały token wyświetlony w konsoli');
});

router.get('/verify-jwt', function(req, res, next) {
    var token=
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.\
    eyJleHAiOiIxNDg5NjAzNDQwIiwibmFtZSI6IkphbWVzIEJvbmQiLCJhZG1pbiI6dHJ1\
    ZSwidXNlcklkIjoiYjA4Zjg2YWYtMzVkYS00OGYyLThmYWItY2VmMzkwNDY2MGJkIn0.\
    kOe-_IiGdBoBzsYFziQB45VAvbiK6ATZPkLUbHxJPqw';
    var jwt = new JWT(); // tworzymy instancję jwt, domyślnie jest algorytm HS256
    jwt.setSecret('secret'); // ustawiamy sekret
    jwt.verify(token, function (err, data) { // weryfikujemy JWT
    if (err) console.log(err);
    console.log(data); // zdekodowany i zweryfikowany JWT w konsoli
    });
    res.send('zweryfikowany token wyświetlony w konsoli');
});

router.get('/verify-jwt-error', function(req, res, next) {
    var token=
    'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.\
    eyJleHAiOiIxNDg5NjAzNDQwIiwibmFtZSI6IkphbWVzIEJvbmQiLCJhZG1pbiI6dHJ2\
    ZSwidXNlcklkIjoiYjA4Zjg2YWYtMzVkYS00OGYyLThmYWItY2VmMzkwNDY2MGJkIn0.\
    kOe-_IiGdBoBzsYFziQB45VAvbiK6ATZPkLUbHxJPqw';
    var jwt = new JWT(); // tworzymy instancję jwt, domyślnie jest algorytm HS256
    jwt.setSecret('secret'); // ustawiamy sekret
    jwt.verify(token, function (err, data) { // weryfikujemy JWT
    if (err) console.log(err);
    console.log(data); // zdekodowany i zweryfikowany JWT w konsoli
    });
    res.send('zweryfikowany token wyświetlony w konsoli');
});

module.exports = router;