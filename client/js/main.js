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

function main() {

  var zip;
  var building_list = [];
  var busy = true;

  var DOM_nav_topic = document.getElementById("nav_topic");
  DOM_nav_topic.value = true;
  console.log(DOM_nav_topic);
  var DOM_topics = document.getElementById("topics");

  var DOM_upload_button = document.getElementById("upload_button");

  var loader = document.getElementById("loader");

  /**
  * @function
  * @name init_listener
  * @description Initialise les écouteurs d'évènements de la page
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
  * @description Écouteur d'évènement associé au click sur la checkbox des topics
  * @listens DOM_cb_topics.click
  * @param e {event} e - l'évènement déclenché par le click
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
  * @description Écouteur d'évènement associé au glisser & déposer d'un fichier
  * @listens document.drop
  * @param e {event} e - l'évènement déclenché par le glisser & déposer
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
  * @description Écouteur d'évènement associé au clique sur le bouton de chargement d'un fichier
  * @listens DOM_upload_button.change
  * @param {event} e - l'évènement déclenché par le chargement d'un fichier
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
  * @description Vérifie le contenu du fichier ZIP, et supprime les fichiers supplémentaires
  * @param {file} file - Le fichier chargé par l'utilisateur
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
            alert("Fichier déjà importé",1500);
            return;
          }
        }
        building_list.push(building);

        zip_file.generateAsync({type:"uint8array"})    // Lecture du ZIP au format UInt8Array pour l'envoi sur le serveur Node
        .then(function success(content) {
          building.zip_uint8array = content;
          busy = false;
          upload_file(building);
        }, function error(e) {
          throw e;
        });
      }
      else{
        busy = false;
        loader.style.display = "none";
        alert("ZIP incorrect. Manque: "+file_types.toString(), 2500);
      }
    });
  }

  /**
  * @function
  * @name toolbox_listener
  * @description Écouteur d'évènements des boutons radio de la boite à outil: réagis au clique souris, et envoie une requête AJAX
  * vers le serveur pour obtenir le résultat de l'opération demandée
  * @param {EventTarget} e - La cible du clique souris
  */
  function upload_file(e){
    var building = null;

    building = building_list[0]

    if(building == null){
      alert("Aucun fichier importé", 1500);
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
  * @description Affiche un texte d'alerte au premier plan
  * @param {String} text - Le texte à afficher à l'écran
  * @param {Integer} timeout - La durée d'affichage de l'alerte
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


  function set_btest() {
    document.getElementById("btest").onclick = function(){
      var xhr = new XMLHttpRequest();

      // xhr.open('GET','http://antoinemoutou.github.io/cd1/test1_geometry_MasterJSON.json',true);

      xhr.open('GET','http://alinko33.000webhostapp.com/unimelb/test.php',true);

      xhr.setRequestHeader('Content-type','application/x-www-form-urlencoded');

      xhr.addEventListener('readystatechange', function(e) {
        if (xhr.readyState == 4 && xhr.status == 200) {
          var resp = xhr.responseText;

          document.getElementById("ptest").innerHTML = resp;
        }
      });

      xhr.send()
    }
  }




  init_listener();

  set_btest();
}

main();
