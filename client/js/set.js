/**
* @fileOverview Script côté client pour gérer l'interface utilisateur
* @author Antoine Moutou <antoinem@student.unimelb.au>
*/

window.onload = function() {

  var DOM_nav_topic = document.getElementById("nav_topic");
  DOM_nav_topic.value = true;

  var DOM_topics = document.getElementById("topics");

  var DOM_maj = document.getElementById("maj");
  DOM_maj.innerHTML = "Jun 01.2017";

  var DOM_title = document.getElementById("title");
  var page_name = DOM_title.children[0].innerHTML;

  var DOM_section = document.querySelectorAll("section");


  /**
  * @function
  * @name set_page
  * @description Set the different elements of the page
  */
  function set_page() {
    set_header_background();
    DOM_nav_topic.addEventListener("click",cb_topics_listener, false);

    if (page_name == "Import"){
      main();
    }
    set_content();
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
    else if(page_name.substring(0,5) == "Topic"){
      DOM_title.style.backgroundImage = 'url("../img/topic'+page_name.substring(6,page_name.length)+'.jpg")'
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

  /**
  * @function
  * @name set_content
  * @description Function that permits to fill the main with articles
  */
  function set_content() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "http://127.0.0.1:8080/articles/articles.json", true);

    xhr.onreadystatechange = function(){
      if(xhr.readyState == 4 && xhr.status == 200){
        if(xhr.responseText == "undefined"){
          alert("Request error", 2000);
        }
        else{
          var response = xhr.responseText;
          var json_response = JSON.parse(response);

          if (page_name.substring(0,5)=="Topic"){
            json_response.articles.forEach(function(element){
              var title = element.title;
              var topic = element.topic;
              var content = element.content;
              var url = element.url;

              if (page_name == topic){
                var article = document.createElement("article");
                var div = document.createElement("div");
                div.classList.add("top_content");
                var h2 = document.createElement("h2");
                var a = document.createElement("a");
                var p = document.createElement("p");

                p.innerHTML = content;
                a.innerHTML = "Visualize";
                a.href = url;
                a.setAttribute("class", "master_link");
                a.setAttribute("target", "_blank");
                h2.innerHTML = title;

                div.appendChild(h2);
                div.appendChild(a);
                article.appendChild(div);
                article.appendChild(p);
                DOM_section[0].appendChild(article);
              }
            });
          }
          else if (page_name == "UOM3D") {

            var last = json_response.articles[json_response.articles.length-1];

            var title = last.title;
            var topic = last.topic;
            var content = last.content;
            var url = last.url;

            var article = document.createElement("article");
            var div = document.createElement("div");
            div.classList.add("top_content");
            var h2 = document.createElement("h2");
            var a = document.createElement("a");
            var p = document.createElement("p");

            p.innerHTML = content;
            a.innerHTML = "Visualize";
            a.href = url;
            a.setAttribute("class", "master_link");
            a.setAttribute("target", "_blank");
            h2.innerHTML = title;

            div.appendChild(h2);
            div.appendChild(a);
            article.appendChild(div);
            article.appendChild(p);
            DOM_section[0].appendChild(article);
          }

        }
      }
      else if(xhr.readyState == 4 && xhr.status != 200){
        busy = false;
        loader.style.display = "none";
        alert("Servor error",2000);
      }
    };
    xhr.send();
  }

  set_page();

}
