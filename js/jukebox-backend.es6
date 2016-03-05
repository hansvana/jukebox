var fs = require('fs');
var fileList = [];

var http = require('http');
var options = {
    host: 'http://188.166.23.192:3000/',
    path:
}

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
        })
    }

    console.log(fileList);


});


