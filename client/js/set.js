/**
* @fileOverview Script côté client pour gérer l'interface utilisateur
* @author Antoine Moutou <antoinem@student.unimelb.au>
*/

window.onload = function() {

  console.log("cool");

  var DOM_nav_topic = document.getElementById("nav_topic");
  DOM_nav_topic.value = true;

  var DOM_topics = document.getElementById("topics");

  var DOM_maj = document.getElementById("maj");
  DOM_maj.innerHTML = "Jun 01.2017";

  var DOM_title = document.getElementById("title");
  var page_name = DOM_title.children[0].innerHTML;

  /**
  * @function
  * @name set_page
  * @description Set the different elements of the page
  */
  function set_page() {
    set_header_background();
    DOM_nav_topic.addEventListener("click",cb_topics_listener, false);

    if (page_name == "UOM3D"){
      main();
    }
  }

  /**
  * @function
  * @name set_header_background
  * @description Set the background-image of the page
  */
  function set_header_background() {
    if (page_name == "UOM3D"){
      DOM_title.style.backgroundImage = 'url("img/header_img.jpg")';
    }
    else if(page_name.substring(0,6) == "Topics"){
      DOM_title.style.backgroundImage = 'url("../img/topic'+page_name.substring(7,page_name.length)+'.jpg")'
    }
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
  }

  set_page();

}
