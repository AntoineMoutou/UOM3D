/**
* @fileOverview Script côté client pour gérer l'interface utilisateur
* @author Antoine Moutou <antoinem@student.unimelb.edu.au>
*/

/**
* @function
* @name create_article
* @description Function that return an article element filled with a title, a content, some tags and a link
* @param title {str} title - The title of the article
* @param content {str} content - The content of the article
* @param url {str} url - The url that redirect us to the visualisation page of the data
* @param tags {array} tags - The array that contains the tagsof the article
*/
function create_article(title,content,url,tags) {

    var article = document.createElement("article");
    var div = document.createElement("div");
    var div2 = document.createElement("div");
    div.classList.add("top_content");
    div2.classList.add("div-tags");
    var h2 = document.createElement("h2");
    var a = document.createElement("a");
    var p = document.createElement("p");

    p.innerHTML = content;
    p.classList.add("bottom_content");
    a.innerHTML = "Launch";
    a.href = url;
    a.setAttribute("class", "master_link");
    a.setAttribute("target", "_blank");
    h2.innerHTML = title;

    /*To print the tags in the articles*/

    /*
    tag_title = document.createElement("span");
    tag_title.innerHTML = "TAGS :";
    div2.appendChild(tag_title);

    tags.forEach(function(tag){
      var span = document.createElement("span");
      span.innerHTML = tag;
      div2.appendChild(span);
    })//end of forEach
  */

    div.appendChild(h2);
    div.appendChild(a);
    article.appendChild(div);
    article.appendChild(p);
    article.appendChild(div2);

    return article;
}//end of function create_article

window.onload = function() {

  var DOM_apps = document.getElementById("apps");

  var DOM_search = document.getElementById("search-button");
  var DOM_search_text_area = document.querySelector("#title input");

  var DOM_maj = document.getElementById("maj");
  DOM_maj.innerHTML = "Jun 08.2017";

  var DOM_title = document.getElementById("title");
  var page_name = document.getElementById("info-page").innerHTML

  var DOM_section = document.querySelectorAll("section");
  var DOM_aside = document.querySelectorAll("aside");

  /**
  * @function
  * @name set_page
  * @description Set the different elements of the page
  */
  function set_page() {

    set_header_background();

    if (page_name == "search" || page_name == "index" || page_name.substring(0,4) == "apps") {
      DOM_search.addEventListener("click",open_search, false);
      DOM_search_text_area.addEventListener("keydown",keydown, false);
    }//end of if (page_name == "search" || page_name == "index" || page_name.substring(0,4) == "apps")

    if (page_name == "import"){
      import_data();
    } //end of if (page_name == "import")

    set_content();

    if (page_name == "search") {
      search();
    }//end of else if (page_name == "search")
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
  }//end of function set_header_background

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
              var tags = element.tags;

              if (page_name == apps){
                var article = create_article(title,content,url,tags);
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
              var tags = element.tags;

              if (apps == "apps1" && b_1) {
                var article = create_article(title,content,url,tags);
                DOM_art1.appendChild(article);
                b_1 = false;
              }//end of if (apps == "apps1" && b_1)
              else if (apps == "apps2" && b_2) {
                var article = create_article(title,content,url,tags);
                DOM_art2.appendChild(article);
                b_2 = false;
              }//end of else if (apps == "apps2" && b_2)
              else if (apps == "apps3" && b_3) {
                var article = create_article(title,content,url,tags);
                DOM_art3.appendChild(article);
                b_3 = false;
              }//end of else if (apps == "apps3" && b_3)
              else if (apps == "apps4" && b_4) {
                var article = create_article(title,content,url,tags);
                DOM_art4.appendChild(article);
                b_4 = false;
              }//end of else if (apps == "apps4" && b_4)
              else if (!(b_1 ||  b_2 || b_3 || b_4)) {
                return;
              }//end of else if (!(b_1 ||  b_2 || b_3 || b_4))
            }//end of function
          );//end of forEach
          }//end of else if (page_name == "index")
          else if (page_name == "import") {
            //DOM_section[0].style.width = "60%";
            //DOM_aside[0].style.width = "40%";
            document.getElementsByClassName("box2")[0].style.width = "100%";
            document.querySelector('main').style.flexDirection = "column";
            document.querySelector('main').style.alignItems = "center";
          }//end of else if (page_name == "import")
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
  * @name open_search
  * @description Function that permits to redirect to search.html with some keywords in the url
  * @listens DOM_search.click
  * @param e {event} e - The listner triggered by the click
  */
  function open_search(e) {
    e.preventDefault();

    if (page_name == "index"){
      var filled_url = "nav/search.html";
    }//end of if (page_name == "index")
    else if (page_name == "search"){
      var filled_url = "../nav/search.html";
    }//end of else if (page_name == "search")
    else{
      var filled_url = "../nav/search.html";//"../nav/"+page_name+".html";
    }//end of else

    filled_url += "?";

    var words = document.getElementsByName("key_words")[0].value.toLowerCase();

    if (words == ""){
      alert("Type a word or more",2000);
    }//end of if (words == "")
    else {
      var key_words = words.split("_").join("").split(" ").join("_");

      filled_url = filled_url + page_name + "_" + key_words;

      window.location.href = filled_url;
    }//end of else
  }//end of function open_search

  /**
  * @function
  * @name keydown
  * @description Function that permits to redirect to open_searchfunction
  * @listens DOM_search_text_area.keydown
  * @param e {event} e - The listner triggered by the keydown
  */
  function keydown(e) {
    if(e.code == "Enter"){
      open_search(e);
    }//end of if(e.keycode ==13)
  }//end of function keydown

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
