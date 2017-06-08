/**
* @fileOverview Script côté client pour gérer l'upload des fichiers, et l'interface utilisateur
* @author Antoine Moutou <antoinem@student.unimelb.edu.au>
* @requires JSZip {@link https://stuk.github.io/jszip/}
*/

function Building(name,title,apps,content){
  this.name = name;
  this.zip_uint8array;
  this.title = title;
  this.apps = apps;
  this.content = content;
  this.url = "http://www.3dcitydb.org/3dcitydb-web-map/1.1/3dwebclient/index.html?title="+this.title+"&batchSize=1&latitude=-37.7952976&longitude=144.9610088&height=200&heading=0&pitch=-44.26228062802528&roll=359.933888621294&layer_0=url%3Dhttp%253A%252F%252F127.0.0.1:8080%252Fdata%252F"+this.name+"%252F"+this.name+".json%26name%3DUoM_Building%26active%3Dtrue%26spreadsheetUrl%3D%26cityobjectsJsonUrl%3D%26minLodPixels%3D%26maxLodPixels%3D%26maxSizeOfCachedTiles%3D200%26maxCountOfVisibleTiles%3D200";
}//end of function Building

Building.prototype.equalTo = function(building){
  if(building.name !== undefined && building.name == this.name){
    return true;
  }//end of if(building.name !== undefined && building.name == this.name)
  return false;
}//end of function

function import_data() {

  var zip;
  var building_list = [];
  var busy = true;

  var DOM_upload_button = document.getElementById("upload_button");
  var DOM_drag_zone = document.getElementById("drag_zone");

  var loader = document.getElementById("loader");

  /**
  * @function
  * @name init_listener
  * @description Initialise the listener of the page
  */
  function init_listener(){
    zip = new JSZip();

    DOM_drag_zone.addEventListener('drop', document_drop, false);
    var e_prevent_default = function(e){ e.preventDefault(); };
    DOM_drag_zone.addEventListener('dragover', e_prevent_default, false);
    DOM_drag_zone.addEventListener('dragleave', e_prevent_default, false);

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
    xhr.open("GET", "http://127.0.0.1:8080/articles/articles.json", true);

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
            var apps = element.apps;
            var content = element.content;

            var temp_building = new Building(name,title,apps,content);
            building_list.push(temp_building);
          }//end of function
        );//end of forEach
        }//end of else
        loader.style.display = "none";
      }//end of if(xhr.readyState == 4 && xhr.status == 200)
      else if(xhr.readyState == 4 && xhr.status != 200){
        loader.style.display = "none";
        alert("Servor error",2000);
      }//end of else if(xhr.readyState == 4 && xhr.status != 200)
    };//end of function
    xhr.send();
  }//end of function set_building_list

  /**
  * @function
  * @name document_drop
  * @description Listener of the drag and drop of a file
  * @listens document.drop
  * @param e {event} e - The listner triggered by the drag and drop
  */
  function document_drop(e){
    if(busy){ return; }//end of if(busy)
    e.preventDefault();

    var file = e.dataTransfer.files[0];
    var file_name = file.name.split(".").pop();
    DOM_upload_button.value = "";
    e.dataTransfer = null;
    if(file_name == "zip"){
      handle_file(file);
    }//end of if(file_name == "zip")
    else{
      alert("ZIP non reconnu", 1500);
    }//end of else
  }//end of function document_drop

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
    console.log(file);
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

          if (tmp_title && tmp_apps && tmp_content){

            var building = new Building(json_file.name.split(".")[0],tmp_title,tmp_apps,tmp_content);

            for (var i = 0; i < building_list.length; i++) {
              if(building_list[i].equalTo(building)){
                busy = false;
                loader.style.display = "none";
                alert("File already imported",1500);
                return;
              }//end of if(building_list[i].equalTo(building))
            }//end of for (var i = 0; i < building_list.length; i++)

            zip_file.generateAsync({type:"uint8array"})    // Lecture du ZIP au format UInt8Array pour l'envoi sur le serveur Node
            .then(
              function success(content) {
                building.zip_uint8array = content;
                busy = false;
                console.log("cool 1");
                upload_file(building);
              },//end of function success
              function error(e) {
                throw e;
              }//end of function error
            );//end of then
          }//end of if (tmp_title && tmp_apps && tmp_content)
          else {
            busy = false;
            loader.style.display = "none";
            alert("Please fill the form ".toString(), 2500);
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
  function upload_file(building){
    if(building == null){
      alert("No inported files", 1500);
      return;
    }//end of function upload_file

    if(busy){ return; }//end of if(busy)
    busy = true;
    loader.style.display = "block";

    var form = new FormData();
    console.log(form);
    console.log("test");
    form.append('name', building.name);
    console.log(form);
    form.append('zip',building.zip_uint8array);
    console.log(form);
    form.append('title',building.title);
    form.append('apps',building.apps);
    form.append('content',building.content);
    form.append('url',building.url);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:8080/", true);


    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        if(xhr.responseText == "error"){
          alert("Loading error", 2000);
        }//end of if(xhr.responseText == "error")
        else{
          if(xhr.responseText == "data_saved"){
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

  // /**
  // * @function
  // * @name alert
  // * @description Display an alert text
  // * @param {String} text - The text to display
  // * @param {Integer} timeout - The diplay time
  // */
  // function alert(text,timeout=1500){
  //   var div = document.createElement("div");
  //   div.innerHTML = "<p>"+text+"</p>";
  //   div.classList.add("alert");
  //
  //   document.body.appendChild(div);
  //   window.setTimeout(function(){
  //     div.style.opacity = "0";
  //     window.setTimeout(function(){
  //       document.body.removeChild(div);
  //     }, 550);
  //   }, timeout);
  // }//end of function alert

  set_building_list();
  init_listener();
}//end of function main
