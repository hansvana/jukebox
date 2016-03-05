var express = require('express');
var bodyParser = require('body-parser')
var fs = require('fs');
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


fs.readdir('mp3', (err, files) => {
    if (err) throw err;
    files = files.filter( file => {
        return (file.split('.')[1] === 'mp3');
    }).map( file => {
        return file.split('.')[0];
    });
    fileList = files.slice();
    console.log("found " + fileList.length + " files.")
});

app.post('/fuzzySearch', function (req, res) {
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

app.listen(3000, function () {
    console.log('App listening on port 3000!');
});