/**
* @fileOverview Script côté client pour gérer l'upload des fichiers, et l'interface utilisateur
* @author Antoine Moutou <antoinem@student.unimelb.edu.au>
* @requires JSZip {@link https://stuk.github.io/jszip/}
*/

function Building(name,title){
  this.name = name;
  this.title = title;
  this.apps;
  this.content;
  this.url;
}//end of function Building

Building.prototype.equalTo = function(building){
  if(building.name !== undefined && building.name == this.name){
    return true;
  }//end of if(building.name !== undefined && building.name == this.name)
  return false;
}//end of function

Building.prototype.setUrl = function() {
  var Sbase = "http://www.3dcitydb.org/3dcitydb-web-map/1.1/3dwebclient/index.html?";
  var Stitre                  = "title="                      + this.title;
  var SbatchSize              = "&batchSize="                 + "1";
  var Slatitude               = "&latitude="                  + "-37.7952976";
  var Slongitude              = "&longitude="                 + "144.9610088";
  var Sheight                 = "&height="                    + "200";
  var Sheading                = "&heading="                   + "0";
  var Spitch                  = "&pitch="                     + "-44.26228062802528";
  var Sroll                   = "&roll="                      + "359.933888621294";
  var Slayer_0                = "&layer_0=";
  var Surl                    = "url%3D"                      + "http%253A%252F%252F127.0.0.1:3000%252Fdata%252F" + this.name +"%252F"+this.name+".json";
  var Sname                   = "%26name%3D"                  + "UoM_Building";
  var Sactive                 = "%26active%3D"                + "true";
  var SspreadsheetUrl         = "%26spreadsheetUrl%3D"        + "";
  var ScityobjectsJsonUrl     = "%26cityobjectsJsonUrl%3D"    + "";
  var SminLodPixels           = "%26minLodPixels%3D"          + "";
  var SmaxLodPixels           = "%26maxLodPixels%3D"          + "";
  var SmaxSizeOfCachedTiles   = "%26maxSizeOfCachedTiles%3D"   + "200";
  var SmaxCountOfVisibleTiles = "%26maxCountOfVisibleTiles%3D" + "200";

  this.url = Sbase+Stitre+SbatchSize+Slatitude+Slongitude+Sheight+Sheading+Spitch+Sroll+Slayer_0+Surl+Sname+Sactive+SspreadsheetUrl+ScityobjectsJsonUrl+SminLodPixels+SmaxLodPixels+SmaxSizeOfCachedTiles+SmaxCountOfVisibleTiles;
}

function import_data() {

  var zip;
  var building_list = [];
  var busy = true;

  var DOM_upload_button = document.getElementById("upload_button");
  var loader = document.getElementById("loader");

  /**
  * @function
  * @name init_listener
  * @description Initialise the listener of the page
  */
  function init_listener(){

    zip = new JSZip();

    DOM_upload_button.addEventListener('change', document_select, false);

    busy = false;
  }//end of function init_listener

  /**
  * @function
  * @name set_building_list
  * @description Initialise the list of building object
  */
  function set_building_list() {

    building_list = [];

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://127.0.0.1:3000/articles", true);

    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        if(xhr.responseText == "undefined"){
          alert("Request error", 2000);
        }//end of if(xhr.responseText == "undefined")
        else{
          var response = xhr.responseText;
          var json_response = JSON.parse(response);

          json_response.articles.forEach(function(element){
            var name = element.name;
            var title = element.title;
            var temp_building = new Building(name,title);
            building_list.push(temp_building);
          }//end of function
        );//end of forEach
        }//end of else
      }//end of if(xhr.readyState == 4 && xhr.status == 200)
      else if(xhr.readyState == 4 && xhr.status != 200){
        alert("Servor error",2000);
      }//end of else if(xhr.readyState == 4 && xhr.status != 200)
    };//end of function
    xhr.send();
  }//end of function set_building_list

  /**
  * @function
  * @name document_select
  * @description Listener of load file button
  * @listens DOM_upload_button.change
  * @param {event} e - The listner triggered by the load of a file
  */
  function document_select(e){
    if(busy){ return; }//end of if(busy)
    var file = DOM_upload_button.files[0];
    var type = file.name.split(".").pop().toLowerCase()
    if (type !== "zip" ) {
      alert("Not a zip", 2000)
      return;
    }
    DOM_upload_button.value = "";
    e.dataTransfer = null;
    handle_file(file);
  }//end of function document_select

  /**
  * @function
  * @name handle_file
  * @description Check the content of the zip file
  * @param {file} file - Th zip file loaded by the user
  */
  function handle_file(file){
    busy = true;
    loader.style.display = "block";
    JSZip.loadAsync(file).then(
      function(zip){

        var type, idx, file_types = ['json', 'kml'];

        zip.forEach(function(relativePath, zipEntry) {    // parcours le ZIP pour vérifier chaque fichier
          type = zipEntry.name.split(".").pop().toLowerCase();
          idx = file_types.indexOf(type);

          if(idx > -1){
            file_types.splice(idx,1);
          }//end of if(idx > -1)
        }//end of function
        );//end of forEach

        if(file_types.length < 1){    // si le ZIP contient tout les fichiers nécéssaires
          zip_file = zip;
          json_file = zip.file(/.json$/i)[0];
          kml_file = zip.file(/.kml$/i)[0];

          var tmp_title = document.getElementById("in_title").value;
          var tmp_apps = document.getElementById("in_apps").options[document.getElementById("in_apps").selectedIndex].value;
          var tmp_content = document.getElementById("in_content").value;
          var tmp_tags = document.getElementById("in_tags").value;

          if (!(tmp_title && tmp_apps && tmp_content && tmp_tags)){
            busy = false;
            loader.style.display = "none";
            alert("Please fill the form before upload your file".toString(), 3000);
            return;
          }//end of if (!(tmp_title && tmp_apps && tmp_content && tmp_tags))
          else {
            var building = new Building(json_file.name.split(".")[0],tmp_title);

            for (var i = 0; i < building_list.length; i++) {
              if(building_list[i].equalTo(building)){
                busy = false;
                loader.style.display = "none";
                alert("File already imported",1500);
                return;
              }//end of if(building_list[i].equalTo(building))
            }//end of for (var i = 0; i < building_list.length; i++)

            building.apps = tmp_apps;
            building.content = tmp_content;
            building.tags = tmp_tags;
            building.setUrl();

            busy = false;
            upload_file(building,file);
          }//end of else
        }//end of if(file_types.length < 1)
        else{
          busy = false;
          loader.style.display = "none";
          alert("Incorrect ZIP. Lack of: "+file_types.toString(), 2500);
        }//end of else
      }// end of function
    );//end of then
  }//end of function handle_file

  /**
  * @function
  * @name upload_file
  * @description Send the zip file to the server
  */
  function upload_file(building,file){

    if(building == null){
      alert("No inported files", 1500);
      return;
    }//end of function upload_file

    if(busy){ return; }//end of if(busy)
    busy = true;
    loader.style.display = "block";
    var form = new FormData();
    form.append('name', building.name);
    form.append('title',building.title);
    form.append('apps',building.apps);
    form.append('content',building.content);
    form.append('url',building.url);
    form.append('tags',building.tags);
    form.append('file',file);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:3000/zip", true);

    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        if(xhr.responseText == "error"){
          loader.style.display = "none";
          alert("Loading error", 2000);
        }//end of if(xhr.responseText == "error")
        else{
          if(xhr.responseText == "success"){
            loader.style.display = "none";
            alert("Data saved !", 2000)
            building_list.push(building);
          }//end of if(xhr.responseText == "data_saved")
        }//end of else
        busy = false;
        loader.style.display = "none";
      }//end of if(xhr.readyState == 4 && xhr.status == 200)
      else if(xhr.readyState == 4 && xhr.status != 200){
        busy = false;
        loader.style.display = "none";
        alert("Servor error",2000);
      }//end of else if(xhr.readyState == 4 && xhr.status != 200)
    };//end of function

    xhr.send(form);
  }//end of function upload_file


  set_building_list();
  init_listener();
}//end of function import_data
