var express = require('express');
var app = express();
var exec = require('child_process').exec;
var fs = require('fs');
var Promise = require('promise');
var http = require('http');
var cors = require('cors');
var bodyParser = require('body-parser');

var url = process.argv[2];
var username = process.argv[3];
var password = process.argv[4];

app.set('port', process.env.PORT || 3001);

app.use(bodyParser.json({limit: '50mb'}))

app.use(cors());

app.use(express.static(__dirname + '/public'));


app.post('/', function (req, res) {
    var body = req.body;
    var mvdxml_url = body.mvdxml;
    var ifc_data = body.ifcdata;
    var ifc_file = new Buffer(ifc_data, 'base64').toString('binary');

    var write = Promise.denodeify(fs.writeFile);

    var p_write = write("./tmp/model.ifc", ifc_file);

    console.log(mvdxml_url)

    var p_mvdxml = new Promise(function (resolve, reject) {
        http.get(mvdxml_url, function (response) {
            resolve(response);
        }).on('error', function(err) {
            console.log("error", err.message)
            reject(err);
        });
    }).then(function(response) {
        console.log("got mvdxml")

        return new Promise(function(resolve, reject) {
            response.on("data", function(chunk) {
                resolve(write('./tmp/mvd.xml', chunk));
            });    
        });
    });

    Promise.all([p_write, p_mvdxml]).then(function() {
        var command = 'java -jar mvdxmlchecker.jar IFC2X3_TC1.exp ./tmp/model.ifc ./tmp/mvd.xml reports ' + url + '// ' + username + ' ' + password;
        console.log(command)
        exec(command, function (error, stdout, stderr) {
            var lines = stdout.split("/n");
            var regex = /Ifc[a-zA-Z0-9]* (.{22})\:/;
            var guids = lines.reduce(function(prev, cur) {
                var match = cur.match(regex);
                if (match) {
                    return prev.concat(match[1]);
                } else {
                    return prev;
                }
            }, [])
            console.log(stdout, stderr);
            res.send({response: guids});
        });        
    }, function(err) {
        res.send({error: 500})
    })
});

app.listen( app.get('port'), function() {
  console.log("✔ Express server listening on port %d in %s mode", app.get('port'), app.get('env'));
});

module.exports = app;