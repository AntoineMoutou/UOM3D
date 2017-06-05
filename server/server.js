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
var app             = express();
const fs            = require('fs');
const unzip         = require('unzip2');
const multer        = require('multer');
const JSZip         = require("jszip");
const jsonfile      = require("jsonfile");

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
  var title     = req.body.title;
  var apps     = req.body.apps;
  var content   = req.body.content;
  var url       = req.body.url;

  console.log(req.body.name);

  res.set('Access-Control-Allow-Origin','*');
	res.set('Access-Control-Allow-Headers', 'Origin');

/**
* @function
* @name save
* @description Save function of the .zip on the server
* @param data {Uint8Array} - The content of the .zip send by the client
* @param name {name} - the name of zip/file send by the client
*/
  function save(data,name,title,apps,content,url) {
      var zip = new JSZip();
      zip.loadAsync(data).then(function () {
        zip.generateNodeStream({type:'nodebuffer',streamFiles:true})
        .pipe(fs.createWriteStream('zip/' + name + '.zip'))
        .on('finish', function () {
            console.log('zip/' + name + '.zip' + " written.");
            dezip(name);
            edit_json(name,title,apps,content,url);
            res.send("data_saved");
        });
      });
  }

function edit_json(name,title,apps,content,url) {
  console.log("cool",content);
  var add_data = JSON.parse('{"title":"'+title+'","apps":"'+apps+'","name":"'+name+'","content":"'+content+'","url":"'+url+'"}');

  var old_file = 'articles/articles.json';
  var old_data = '';
  jsonfile.readFile(old_file,'utf8',function(err,obj) {
    if (err) throw err;
    else {
      old_data = obj;
      old_data.articles.push(add_data);
      jsonfile.writeFile(old_file,old_data),function(err) {
        if (err) throw err;
      }
    }
  })
}

  if (typeof(req.body.zip) !== 'undefined'){
      data = convertBinaryStringToUint8Array(req.body.zip);
      save(data,name,title,apps,content,url);
  }
  else {
    send("error");
  }
});

app.listen(8080);
console.log("Server open at http://127.0.0.1:8080/");
