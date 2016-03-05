var express = require('express');
var bodyParser = require('body-parser')
var app = express();

app.use( bodyParser.json() );
app.use( express.static('public') );

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
    var results = fileList.filter( file => {
        return ( file.nameWithoutExtension.indexOf(req.body.txt) !== -1 );
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
    console.log("Received " + nFiles + " file names");

    var i = 0;
    for(var file of req.body){
        fileList.push({
            key: i++,
            name: file,
            nameWithoutExtension: file.split('.')[0],
        })
    }

    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify({ type: "success", text: "Received " + nFiles + " file names" }));
});

app.get('/', function (req, res) {
    res.write("<h1>File List</h1>");
    res.write("<table>");
    for (var file of fileList){
        res.write("<tr>" +
                 "<td>"+file.key+"</td>" +
                 "<td>"+file.name+"</td>" +
                 "<td>"+file.nameWithoutExtension+"</td>" +
                 "</tr>");
    }
    res.end("</table>");
});

app.listen(80, function () {
    console.log('App listening on port 80!');
});