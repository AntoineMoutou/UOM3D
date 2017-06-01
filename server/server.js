/**
 * @fileOverview UOM3D Project
 * @author Antoine Moutou <antoinem@student.unimelb.edu.au>
 * @see <a href="https://github.com/antoinemoutou/UOM3D">https://github.com/antoinemoutou/UOM3D</a>
 *@requires http        : to create the server
 *@requires express     : to make easier the low-level language in node
 *@requires url         : to have the name of the url
 *@requires querystring : to make a dictionary with the GET arguments
 *@requires fs          : to write and read files and folders
 *@requires unzip2      : to unzip the .zip written of the file
 *@requires multer      : to manage the reception of formdata
 *@requires JSZip       : to manage the zip
*/
const http          = require('http');
const express       = require('express');
const url           = require('url');
const querystring   = require('querystring');
var app           = express();
const fs            = require('fs');
const unzip         = require('unzip2');
const multer        = require('multer');
const JSZip         = require("jszip");

/**
 * Unzip the file out.zip in the zip folder and write his content in the folder named data
 */
function dezip(name) {
    fs.createReadStream('zip/' + name + '.zip').pipe(unzip.Extract({ path: 'data/'+name }));
    console.log("Extracted " + 'zip/' + name + '.zip' + " in folder data/"+name+".");
}

var upload = multer( { limits:
  {
    fieldNameSize: 999999999,
    fieldSize: 999999999
  }});
  
/**
* Transform a string of the formdata in matrix Uint8array
* @param str {str} - The string that contains the data of the .zip
* @return {Uint8Array} - This same string in Uint format
*/
function convertBinaryStringToUint8Array(str) {
  var arr = str.split(",").map(function (val) {
	return Number(val);
  })
  return new Uint8Array(arr)
}

app.get('*',function(req,res){
	
	res.set('Access-Control-Allow-Origin','*');
	res.set('Access-Control-Allow-Headers', 'Origin');
	
	var path = req.path.substring(1,req.path.length);
	console.log(path);
	
	var content;

	fs.readFile(path,'utf8',function(err,data){
		if (err) throw err;
		
		else{
			res.send(data);
		}						
	});
});

app.post('/',upload.single('zip'), function (req, res, next) {
  
  var data      = '';
  var name      = req.body.name;

  console.log(req.body.name);

  res.setHeader('Access-Control-Allow-Origin', '*');

/**
* @function
* @name save
* @description Save function of the .zip on the server
* @param data {Uint8Array} - The content of the .zip send by the client
* @param name {name} - the name of zip/file send by the client
*/
  function save(data,name) {
      var zip = new JSZip();
      zip.loadAsync(data).then(function () {
        zip.generateNodeStream({type:'nodebuffer',streamFiles:true})
        .pipe(fs.createWriteStream('zip/' + name + '.zip'))
        .on('finish', function () {
            console.log('zip/' + name + '.zip' + " written.");
            dezip(name);
			console.log("data_saved");
            res.send("data_saved");
        });
      });
  }



  if (typeof(req.body.zip) !== 'undefined'){
      data = convertBinaryStringToUint8Array(req.body.zip);
      save(data,name);
  }
  else {
    send("error");
  }
});

app.listen(8080);
console.log("Serveur ouvert à l'adresse http://127.0.0.1:8080/");
