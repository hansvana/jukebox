var express = require('express');
var bodyParser = require('body-parser');

var app = express();

app.use( bodyParser.json() );


var fileList = [];

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Content-Length, X-Requested-With');

    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
        res.sendStatus(200);
    }
    else {
        next();
    }
};
app.use(allowCrossDomain);

app.post('/fuzzySearch', function (req, res) {
    console.log(req.body);

    fileList.forEach(function(file){
       console.log(file.indexOf(req.body.txt));
    });

    var results = fileList.filter( file => {
        return ( file.indexOf(req.body.txt) !== -1 );
    });

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({results}));

});

app.post('/sendRequest', function (req, res) {
    console.log(req.body)
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ a: 1 }));
});

app.post('/setFileList', function (req, res) {
    var nFiles = req.body.length;
    console.log("Received " + nFiles + " file names")
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ type: "success", text: "Received " + nFiles + " file names" }));
});

app.listen(3000, function () {
    console.log('App listening on port 3000!');
    console.log('Waiting for file list');
});