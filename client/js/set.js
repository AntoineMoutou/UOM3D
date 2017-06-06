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
  var page_name = document.getElementById("info-page").innerHTML

  var DOM_section = document.querySelectorAll("section");

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
    } //end of if (page_name == "import")

    set_content();
  } //end of function set_page

  /**
  * @function
  * @name set_header_background
  * @description Set the background-image of the page
  */
  function set_header_background() {
    if (page_name == "index"){
      DOM_title.style.backgroundImage = 'url("img/index-bg.jpg")';
    }//end of if (page_name == "index")
    else if(page_name == "apps1"){
      DOM_title.style.backgroundImage = 'url("../img/apps1-bg.jpg")'
    }//end of else if(page_name == "apps1")
    else if(page_name == "apps2"){
      DOM_title.style.backgroundImage = 'url("../img/apps2-bg.jpg")'
    }//end of else if(page_name == "apps2")
    else if(page_name == "apps3"){
      DOM_title.style.backgroundImage = 'url("../img/app3-bg.jpg")'
    }//end of else if(page_name == "apps3")
    else if(page_name == "apps4"){
      DOM_title.style.backgroundImage = 'url("../img/apps4-bg.jpg")'
    }//end of else if(page_name == "apps4")
    else if(page_name == "import"){
      DOM_title.style.backgroundImage = 'url("../img/import-bg.jpg")'
    }//end of else if(page_name == "import")
    else if(page_name == "open-data-licence"){
      DOM_title.style.backgroundImage = 'url("../img/licence-bg.jpg")'
    }//end of else if(page_name == "open-data-licence")
    else if(page_name == "privacy"){
      DOM_title.style.backgroundImage = 'url("../img/privacy-bg.jpg")'
    }//end of else if(page_name == "privacy")
    else if(page_name == "site-terms"){
      DOM_title.style.backgroundImage = 'url("../img/terms-bg.jpg")'
    }//end of else if(page_name == "site-terms")
    else if(page_name == "contact"){
      DOM_title.style.backgroundImage = 'url("../img/contact-bg.jpg")'
    }//end of else if(page_name == "contact")
  }//end of function set_header_background

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
    }//end of if (DOM_nav_apps.value)
    else{
      var dis = "none";
      DOM_nav_apps.value = true;
    }//end of else
    DOM_apps.style.display = dis;
  }//end of function apps_listener

  /**
  * @function
  * @name create_article
  * @description Function that return an article element filled with a title, a content and a link
  * @param title {str} title - The title of the article
  * @param content {str} content - The content of the article
  * @param url {str} url - The url that redirect us to the visualisation page of the data
  */
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
  }//end of function create_article

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
        }//end of if(xhr.responseText == "undefined")
        else{
          var response = xhr.responseText;
          var json_response = JSON.parse(response);

          if (page_name.substring(0,4) == "apps"){

            DOM_section[0].style.width = '100%';

            json_response.articles.forEach(function(element){
              var title = element.title;
              var apps = element.apps;
              var content = element.content;
              var url = element.url;

              if (page_name == apps){
                var article = create_article(title,content,url);
                DOM_section[0].appendChild(article);
              }//end of if (page_name == apps)
            }//end of function
          );//end of forEach
          }//end of if (page_name.substring(0,4) == "apps")
          else if (page_name == "index"){

            var DOM_art1 = document.getElementById("art1");
            var DOM_art2 = document.getElementById("art2");
            var DOM_art3 = document.getElementById("art3");
            var DOM_art4 = document.getElementById("art4");

            var inv_articles = json_response.articles.reverse();
            var b_1 = true;
            var b_2 = true;
            var b_3 = true;
            var b_4 = true;

            inv_articles.forEach(function(element){
              var title = element.title;
              var apps = element.apps;
              var content = element.content;
              var url = element.url;

              if (apps == "apps1" && b_1) {
                var article = create_article(title,content,url);
                DOM_art1.appendChild(article);
                b_1 = false;
              }//end of if (apps == "apps1" && b_1)
              else if (apps == "apps2" && b_2) {
                var article = create_article(title,content,url);
                DOM_art2.appendChild(article);
                b_2 = false;
              }//end of else if (apps == "apps2" && b_2)
              else if (apps == "apps3" && b_3) {
                var article = create_article(title,content,url);
                DOM_art3.appendChild(article);
                b_3 = false;
              }//end of else if (apps == "apps3" && b_3)
              else if (apps == "apps4" && b_4) {
                var article = create_article(title,content,url);
                DOM_art4.appendChild(article);
                b_4 = false;
              }//end of else if (apps == "apps4" && b_4)
              else if (!(b_1 ||  b_2 || b_3 || b_4)) {
                return;
              }//end of else if (!(b_1 ||  b_2 || b_3 || b_4))
            }//end of function
          );//end of forEach
          }//end of else if (page_name == "index")
        }//end of else
      }//end of if(xhr.readyState == 4 && xhr.status == 200)
      else if(xhr.readyState == 4 && xhr.status != 200){
        busy = false;
        alert("Servor error",2000);
      }//end of else if(xhr.readyState == 4 && xhr.status != 200)
    }//end of function;
    xhr.send();
  }//end of function set_content

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
  }//end of function alert

  set_page();

}// end of main function
