/**
* @fileOverview Script côté client pour gérer l'upload des fichiers, et l'interface utilisateur
* @author Antoine Moutou <antoinem@student.unimelb.au>
* @requires JSZip {@link https://stuk.github.io/jszip/}
*/

function Building(name){
  this.name = name;
  this.zip_uint8array;
}

Building.prototype.equalTo = function(building){
  if(building.name !== undefined && building.name == this.name){
    return true;
  }
  return false;
}

window.onload = function() {

  var zip;
  var building_list = [];
  var busy = true;

  var DOM_nav_topic = document.getElementById("nav_topic");
  DOM_nav_topic.value = true;

  var DOM_topics = document.getElementById("topics");

  var DOM_upload_button = document.getElementById("upload_button");

  var loader = document.getElementById("loader");

  var DOM_maj = document.getElementById("maj");
  DOM_maj.innerHTML = "Jun 01.2017"

  /**
  * @function
  * @name init_listener
  * @description Initialise the listener of the page
  */
  function init_listener(){
    zip = new JSZip();
    // console.log("JSZip support:"); console.log(JSZip.support);

    document.addEventListener('drop', document_drop, false);
    var e_prevent_default = function(e){ e.preventDefault(); };
    document.addEventListener('dragover', e_prevent_default, false);
    document.addEventListener('dragleave', e_prevent_default, false);

    DOM_nav_topic.addEventListener("click",cb_topics_listener, false);

    DOM_upload_button.addEventListener('change', document_select, false);

    busy = false;
  }

  /**
  * @function
  * @name cb_topics_listener
  * @description Listener of the topics
  * @listens DOM_nav_topics.click
  * @param e {event} e - The listner triggered by the click
  */
  function cb_topics_listener(e) {
    e.preventDefault();
    if (DOM_nav_topic.value){
      var dis = "flex";
      DOM_nav_topic.value = false;
    }
    else{
      var dis = "none";
      DOM_nav_topic.value = true;
    }
    DOM_topics.style.display = dis;
    console.log(DOM_nav_topic);
  }

  /**
  * @function
  * @name document_drop
  * @description Listener of the drag and drop of a file
  * @listens document.drop
  * @param e {event} e - The listner triggered by the drag and drop
  */
  function document_drop(e){
    if(busy){ return; }
    e.preventDefault();

    var file = e.dataTransfer.files[0];
    var file_name = file.name.split(".").pop();
    DOM_upload_button.value = "";
    e.dataTransfer = null;
    if(file_name == "zip"){
      handle_file(file);
    }
    else{
      alert("ZIP non reconnu", 1500);
    }
  }

  /**
  * @function
  * @name document_select
  * @description Listener of load file button
  * @listens DOM_upload_button.change
  * @param {event} e - The listner triggered by the load of a file
  */
  function document_select(e){
    if(busy){ return; }

    var file = DOM_upload_button.files[0];
    DOM_upload_button.value = "";
    e.dataTransfer = null;
    handle_file(file);
  }

  /**
  * @function
  * @name handle_file
  * @description Check the content of the zip file
  * @param {file} file - Th zip file loaded by the user
  */
  function handle_file(file){
    busy = true;
    loader.style.display = "block";

    JSZip.loadAsync(file).then(function(zip){
      var type, idx, file_types = ['json', 'kml'];

      zip.forEach(function(relativePath, zipEntry) {    // parcours le ZIP pour vérifier chaque fichier
        type = zipEntry.name.split(".").pop().toLowerCase();
        idx = file_types.indexOf(type);

        if(idx > -1){ file_types.splice(idx,1); }
      });

      if(file_types.length < 1){    // si le ZIP contient tout les fichiers nécéssaires
        zip_file = zip;
        json_file = zip.file(/.json$/i)[0];
        kml_file = zip.file(/.kml$/i)[0];
        var building = new Building(json_file.name.split(".")[0]);

        for (var i = 0; i < building_list.length; i++) {
          if(building_list[i].equalTo(building)){
            busy = false;
            loader.style.display = "none";
            alert("File already imported",1500);
            return;
          }
        }
        building_list.push(building);

        zip_file.generateAsync({type:"uint8array"})    // Lecture du ZIP au format UInt8Array pour l'envoi sur le serveur Node
        .then(function success(content) {
          building.zip_uint8array = content;
          busy = false;
          upload_file();
        }, function error(e) {
          throw e;
        });
      }
      else{
        busy = false;
        loader.style.display = "none";
        alert("Incorrect ZIP. Lack of: "+file_types.toString(), 2500);
      }
    });
  }

  /**
  * @function
  * @name upload_file
  * @description Send the zip file to the server
  */
  function upload_file(){
    var building = null;

    building = building_list[building_list.length-1];

    if(building == null){
      alert("No inported files", 1500);
      return;
    }

    if(busy){ return; }
    busy = true;
    loader.style.display = "block";

    var form = new FormData();
    form.append('name', building.name);
    form.append('zip',building.zip_uint8array);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://127.0.0.1:8080/", true);

    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        // console.log(xhr.responseText);
        if(xhr.responseText == "error"){
          alert("Loading error", 2000);
        }
        else{
          if(xhr.responseText == "data_saved"){
            alert("Data saved !", 2000)
          };
        }

        busy = false;
        loader.style.display = "none";
      }
      else if(xhr.readyState == 4 && xhr.status != 200){
        busy = false;
        loader.style.display = "none";
        alert("Servor error",2000);
      }
    };

    xhr.send(form);
  }

  /**
  * @function
  * @name alert
  * @description Display an alert text
  * @param {String} text - The text to display
  * @param {Integer} timeout - The diplay time
  */
  function alert(text,timeout=1500){
    var div = document.createElement("div");
    div.innerHTML = "<p>"+text+"</p>";
    div.classList.add("alert");

    document.body.appendChild(div);
    window.setTimeout(function(){
      div.style.opacity = "0";
      window.setTimeout(function(){
        document.body.removeChild(div);
      }, 550);
    }, timeout);
  }

  init_listener();
}
