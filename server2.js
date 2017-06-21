var express    = require('express');
var path       = require('path');
var formidable = require('formidable');
var fs         = require('fs');
var unzip      = require('unzip2');
var JSZip      = require('jszip');
var jsonfile   = require('jsonfile')

var app = express();

/**
 * Unzip the file out.zip in the zip folder and write his content in the folder named data
 */
function dezip(name) {
    fs.createReadStream('zip/' + name + '.zip').pipe(unzip.Extract({ path: 'data/'+name }));
    console.log("Extracted " + 'zip/' + name + '.zip' + " in folder data/"+name+".");
}//end of function dezip

/**
* @function
* @name edit_json
* @description Add an article to articles.json
* @param name {str} - The name of the data
* @param title {str} - The title of the article
* @param apps {str} - The apps of the article
* @param content {str} - The content of the article
* @param url {str} - The url of the data visualization
*/
function edit_json(name,title,apps,content,url,tags) {

  var add_data = JSON.parse('{"title":"'+title+'","apps":"'+apps+'","name":"'+name+'","content":"'+content+'","url":"'+url+'","tags":"'+tags+'"}');

  var old_file = path.join(__dirname, 'articles/articles.json');
  var old_data = '';
  jsonfile.readFile(old_file,'utf8',function(err,obj) {
    if (err) throw err;
    else {
      old_data = obj;
      old_data.articles.push(add_data);
      jsonfile.writeFile(old_file,old_data),function(err) {
        if (err) throw err;
      }
    }//end of else
  })
}// end of function edit_json

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'views/index.html'));
});// end of app.get('/')

app.get('/views/:page', function(req, res) {
  res.sendFile(path.join(__dirname,'views', req.params.page));
}); //end of app.get('/views/:page')

app.get('/data/*', function(req,res) {

  res.set('Access-Control-Allow-Origin','*');
	res.set('Access-Control-Allow-Headers', 'Origin');

  res.sendFile(path.join(__dirname,req.path.substring(1,req.path.length)));
});

app.get('/articles', function(req, res) {

  res.set('Access-Control-Allow-Origin','*');
	res.set('Access-Control-Allow-Headers', 'Origin');

  var ch = path.join(__dirname, 'articles/articles.json');

  fs.readFile(ch, 'utf8', function(err,data) {
    if (err) throw err;
    else{
      res.send(data);
    }//end of else
  });//end of readFile
});//end of app.get(/articles)

app.post('/zip', function(req,res) {

  res.set('Access-Control-Allow-Origin','*');
	res.set('Access-Control-Allow-Headers', 'Origin');

  var form = new formidable.IncomingForm();
  var fName, fTitle, fApps, fContent, fUrl, fTags;
  var cpt = 0;

  form.multiples = false;

  form.uploadZipDir = path.join(__dirname, '/zip');
  form.uploadDataDir = path.join(__dirname, '/data');

  form.on('field', function(name, field) {
    switch (name) {
      case "name":
        fName = field;
        cpt++;
        break;
      case "title":
        fTitle = field;
        cpt++;
        break;
      case "apps":
        fApps = field;
        cpt++;
        break;
      case "content":
        fContent = field;
        cpt++;
        break;
      case "url":
        fUrl = field;
        cpt++;
        break;
      case "tags":
        fTags = field;
        cpt++;
        break;
      default:
    }// end of switch (name)
    if (cpt == 6) {
      edit_json(fName,fTitle,fApps,fContent,fUrl,fTags);
      console.log('\narticles.json edited\n');
    }//end of if (cpt == 6)
  });// end of form.on('field')

  form.on('file', function(field, file) {
    fs.rename(file.path, path.join(form.uploadZipDir, file.name),function functionName() {
      fs.createReadStream(path.join(form.uploadZipDir,file.name)).pipe(unzip.Extract({ path: path.join(form.uploadDataDir, fName) }));
    });
  });// end of form.on('file')

  form.on('error', function(err) {
    console.log('An error has occured : \n' + err);
  });// end of form.on('error')

  form.on('end', function() {
    res.end('success');
  });// end of form.on('end')

  form.parse(req);
});//end of app.post('/zip')

var server = app.listen(3000, function() {
  console.log('Server listening on port 3000');
});
