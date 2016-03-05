var fs = require('fs');
var fileList = [];

var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use( bodyParser.json() );


fs.readdir('mp3', (err, files) => {
    if (err) throw err;
    files = files.filter( file => {
        return (file.split('.')[1] === 'mp3');
    });
    let i = 0;
    for (var file of files){
        fileList.push({
            id: i++,
            fileName: file
        });
    }
    console.log(fileList);
});


