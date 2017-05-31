/**
 * @fileOverview Projet Jeu du taquin
 * @author Antoine Moutou <antoinem@student.unimelb.edu.au>
 * @see <a href="https://github.com/antoinemoutou/UOM3D">https://github.com/antoinemoutou/UOM3D</a>
 *@requires http        : pour créer le serveur
 *@requires express     : pour faciliter l'écriture bas niveau de node
 *@requires url         : Avoir le nom de l'url
 *@requires querystring : faire un dictionnaire à partir des arguments passés en GET dans l'url
 *@requires fs          : pouvoir écrire sur le disque un fichier (ici .zip et .shp)
 *@requires unzip2      : permet de déziper le .zip écrit sur le fichier
 *@requires multer      : permet de gérer la réception des formdata
 *@requires JSZip       : permet la compréhension et l'écriture de zip
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

/*
app.set(function(){
  app.use(function(req, res, next) {
    res.setHeader("Access-Control-Allow-Origin", "*");
    return next();
  });
  app.use(express.static(path.join(application_root, "StaticPages")));
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});
*/



app.get('*',function(req,res){
	
	res.set('Access-Control-Allow-Origin','*');
	res.set('Access-Control-Allow-Headers', 'Origin');
	
	/*
	console.log(req.body);
	console.log(req.hostname);
	console.log(req.baseUrl);
	console.log(req.path);
	console.log(req.hostname+req.path);
	*/
	
	var path = req.path.substring(1,req.path.length);
	console.log(path);
	
	var content;

	//fs.readFile("C:/Users/Antoine/Desktop/UoM/antoinemoutou/website/UOM3D/server/data/test1_geometry_MasterJSON/test1_geometry_MasterJSON.json",'r', function(err,fd){
	fs.readFile(path,'utf8',function(err,data){
		if (err) throw err;
		
		else{
			
			//console.log(data);
			res.send(data);
		}						
	});

	
	//content = content.substring(1,content.length-1);
	//console.log(content);
	
	
	
	//res.send(content);
});


//app.set("Access-Control-Allow-Origin","*");



/**
 * Dezip le fichier out.zip contenu dans le dossier zip et écrit son contenu dans le dossier shp
 */
function dezip(name) {
    fs.createReadStream('zip/' + name + '.zip').pipe(unzip.Extract({ path: 'data/'+name }));
    console.log("Extracted " + 'zip/' + name + '.zip' + " in folder data/"+name+".");
}



var upload = multer( { limits:
  {
    fieldNameSize: 999999999,
    fieldSize: 999999999
  }})

app.post('/',upload.single('zip'), function (req, res, next) {
  var data      = '';
  var name      = req.body.name;

  console.log(req.body.name);

  res.setHeader('Access-Control-Allow-Origin', '*');

/**
* @function
* @name save
* @description Fonction de sauvegarde du .zip sur le serveur, elle fait ensuite appel aux fonctions dezip & python_call
* @param data {Uint8Array} - Le contenu du .zip transmis par le client
* @param name {name} - le nom du zip/fichier envoyé par le client
* @param operation {string} - Le nom de l'opération demandé par le client
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
})

app.listen(8080);
console.log("Serveur ouvert à l'adresse http://127.0.0.1:8080/");
//dezip()



/**
* Transformation de chaine de caractère contenus dans le formdata en matrice Uint8array
* @param str {str} - La chaine de caractère contenant les données du .zip
* @return {Uint8Array} - Cette même chaîne de caractère en format Uint
*/
function convertBinaryStringToUint8Array(str) {
  var arr = str.split(",").map(function (val) {
  return Number(val);
  })
  return new Uint8Array(arr)
}
