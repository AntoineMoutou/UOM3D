/**
* @fileOverview Script côté client pour gérer l'interface utilisateur
* @author Antoine Moutou <antoinem@student.unimelb.au>
*/

window.onload = function() {

  var DOM_nav_apps = document.getElementById("nav_apps");
  DOM_nav_apps.value = true;

  var DOM_apps = document.getElementById("apps");

  var DOM_maj = document.getElementById("maj");
  DOM_maj.innerHTML = "Jun 05.2017";

  var DOM_title = document.getElementById("title");
  var page_name = document.location.href
  page_name = page_name.substring(page_name.lastIndexOf("/")+1);
  page_name = page_name.substring(0,page_name.length-5)

  var DOM_section = document.querySelectorAll("section");
  console.log(DOM_section);

  /**
  * @function
  * @name set_page
  * @description Set the different elements of the page
  */
  function set_page() {

    set_header_background();

    DOM_nav_apps.addEventListener("click",apps_listener, false);

    if (page_name == "import"){
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
    if (page_name == "index"){
      DOM_title.style.backgroundImage = 'url("img/home-bg.jpg")';
    }
    else if(page_name == "3d-campus"){
      DOM_title.style.backgroundImage = 'url("../img/campus-bg.jpg")'
    }
    else if(page_name == "strategic-plan"){
      DOM_title.style.backgroundImage = 'url("../img/strategic-bg.jpg")'
    }
    else if(page_name == "urban-planning"){
      DOM_title.style.backgroundImage = 'url("../img/urban-bg.jpg")'
    }
    else if(page_name == "contact"){
      DOM_title.style.backgroundImage = 'url("../img/contact-bg.jpg")'
    }
    else if(page_name == "import"){
      DOM_title.style.backgroundImage = 'url("../img/import-bg.jpg")'
    }
    else if(page_name == "open-data-licence"){
      DOM_title.style.backgroundImage = 'url("../img/licence-bg.jpg")'
    }
    else if(page_name == "privacy"){
      DOM_title.style.backgroundImage = 'url("../img/privacy-bg.jpg")'
    }
    else if(page_name == "site-terms"){
      DOM_title.style.backgroundImage = 'url("../img/terms-bg.jpg")'
    }
    else if(page_name == "team"){
      DOM_title.style.backgroundImage = 'url("../img/team-bg.jpg")'
    }
  }

  /**
  * @function
  * @name cb_apps_listener
  * @description Listener of the apps
  * @listens DOM_nav_apps.click
  * @param e {event} e - The listner triggered by the click
  */
  function apps_listener(e) {
    e.preventDefault();
    if (DOM_nav_apps.value){
      var dis = "flex";
      DOM_nav_apps.value = false;
    }
    else{
      var dis = "none";
      DOM_nav_apps.value = true;
    }
    DOM_apps.style.display = dis;
  }

  function create_article(title,content,url) {

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

      return article;
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

          if (page_name == "urban-planning" || page_name == "3d-campus" || page_name == "strategic-plan"){
            json_response.articles.forEach(function(element){
              var title = element.title;
              var apps = element.apps;
              var content = element.content;
              var url = element.url;

              if (page_name == apps){
                var article = create_article(title,content,url);
                DOM_section[0].appendChild(article);
              }
            });
          }
          else if (page_name == "index") {
            var inv_articles = json_response.articles.reverse();
            var b_urban = true;
            var b_campus = true;
            var b_strategic = true;

            inv_articles.forEach(function(element) {
              var title = element.title;
              var apps = element.apps;
              var content = element.content;
              var url = element.url;

              if (apps == "urban-planning" && b_urban) {
                var article = create_article(title,content,url);
                DOM_section[0].appendChild(article);
                b_urban = false;
              }
              else if (apps == "3d-campus" && b_campus) {
                var article = create_article(title,content,url);

                DOM_section[1].appendChild(article);
                b_campus = false;
              }
              else if (apps == "strategic-plan" && b_strategic) {
                var article = create_article(title,content,url);
                DOM_section[2].appendChild(article);
                b_strategic = false;
              }
              else if (!(b_urban ||  b_campus || b_strategic)) {
                return;
              }
            });

          }
          // else if (page_name == "index") {
          //
          //   var last = json_response.articles[json_response.articles.length-1];
          //
          //   var title = last.title;
          //   var apps = last.apps;
          //   var content = last.content;
          //   var url = last.url;
          //
          //   var article = document.createElement("article");
          //   var div = document.createElement("div");
          //   div.classList.add("top_content");
          //   var h2 = document.createElement("h2");
          //   var a = document.createElement("a");
          //   var p = document.createElement("p");
          //
          //   p.innerHTML = content;
          //   a.innerHTML = "Visualize";
          //   a.href = url;
          //   a.setAttribute("class", "master_link");
          //   a.setAttribute("target", "_blank");
          //   h2.innerHTML = title;
          //
          //   div.appendChild(h2);
          //   div.appendChild(a);
          //   article.appendChild(div);
          //   article.appendChild(p);
          //   DOM_section[0].appendChild(article);
          // }
        }
      }
      else if(xhr.readyState == 4 && xhr.status != 200){
        busy = false;
        alert("Servor error",2000);
      }
    };
    xhr.send();
  }

  set_page();

}
