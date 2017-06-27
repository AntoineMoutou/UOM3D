/**
* @fileOverview Script côté client pour gérer la recherche
* @author Antoine Moutou <antoinem@student.unimelb.edu.au>
*/

function create_not_found(key) {

  var article = document.createElement("article");
  var div = document.createElement("div");
  div.classList.add("top_content");
  var h2 = document.createElement("h2");
  var a = document.createElement("a");
  var p = document.createElement("p");

  p.innerHTML = "Please try with other key words";
  p.classList.add("bottom_content");
  a.innerHTML = "Back home";
  a.href = "../../";
  a.setAttribute("class", "master_link");
  h2.innerHTML = "Articles not found for key word(s) : " + key.join(", ");

  div.style.margin = "5px";
  div.style.display = "flex";
  div.style.flexDirection = "row";
  div.style.justifyContent = "space-between";
  div.style.alignItems = "center";
  p.style.margin = "5px";
  a.style.border = "solid 2px black";
  a.style.borderRadius = "5px";
  a.style.padding = "5px";
  a.style.textAlign = "center";
  a.style.backgroundColor = "#CCCCCC";
  a.style.color = "black";

  div.appendChild(h2);
  div.appendChild(a);
  article.appendChild(div);
  article.appendChild(p);

  return article;
}//end of function create_not_found

function search() {

  var DOM_section = document.querySelectorAll("section");

  var CheminComplet = document.location.href;
  var NomDuFichier = CheminComplet.substring(CheminComplet.lastIndexOf( "/" )+1 );

  var l_words = NomDuFichier.split("?");
  var key_words = l_words.slice(1,l_words.length).join("_").split("_");

  var xhr = new XMLHttpRequest();
  xhr.open("GET", "../articles", true);

  xhr.onreadystatechange = function(){
    if(xhr.readyState == 4 && xhr.status == 200){
      if(xhr.responseText == "undefined"){
        alert("Request error", 2000);
      }//end of if(xhr.responseText == "undefined")
      else{
        var response = xhr.responseText;
        var json_response = JSON.parse(response);

        var sel_apps = {apps1 : "statutory planning", apps2 : "strategic planning", apps3 : "smart campus", apps4 : "BIM GIS integration"};

        var selected_art = []; //list of ele

        if (key_words[0] == "index" || key_words[0] == "search") {
          var key = key_words.slice(1,key_words.length);

          json_response.articles.forEach(function(element) {

            var ele = {art : element, score : 0}; //variable that link the article at its score

            key.forEach(function(kw) {
              if (element.title.toLowerCase().split(" ").indexOf(kw) >= 0){
                ele.score += 10000;
              }//end of if (element.title.toLowerCase().split(" ").indexOf(kw) >= 0)
              if (element.content.toLowerCase().split(" ").indexOf(kw) >= 0) {
                ele.score += 1;
              }//end of if (element.content.toLowerCase().split(" ").indexOf(kw) >= 0)
              if (sel_apps[element.apps].toLowerCase().split(" ").indexOf(kw) >= 0) {
                ele.score += 100;
              }//end of if (sel_apps[element.page_name].toLowerCase().split(" ").indexOf(kw) >= 0)
              if (element.tags.indexOf(kw) >= 0) {
                ele.score += 100;
              }//end of if (element.tag.indexOf(kw) >= 0)
            })//end of forEach

            if (ele.score) {
              selected_art.push(ele);
            }//end of if (ele.score)
          })//end of forEach

          selected_art = selected_art.sort(function(a,b) {
            return a.score - b.score ;
          });//end of sort function

          selected_art = selected_art.reverse()

          if (selected_art.length == 0) { // no results
            var article = create_not_found(key);
            DOM_section[0].appendChild(article);
          }
          else{
            if (selected_art.length > 10){
              selected_art = selected_art.slice(0,10);
            }//end of if (selected_art.length > 10)
            else {
              selected_art = selected_art.slice(0,selected_art.length);
            }//end of else

            selected_art.forEach(function(ele) {
              var title = ele.art.title;
              var content = ele.art.content;
              var url = ele.art.url;
              var tags = ele.art.tags;

              var article = create_article(title,content,url,tags);
              DOM_section[0].appendChild(article);
            })//end of forEach
          }//end of else
        }//end of if (key_words[0] == "index" || key_words[0] == "search")


        else if (key_words[0].substring(0,4) == "apps") {
          var key_apps = key_words[0];
          var key = key_words.slice(1,key_words.length);

          json_response.articles.forEach(function(element) {

            var ele = {art : element, score : 0}; //variable that link the article at its score

            if (element.apps == key_apps){
              key.forEach(function(kw) {
                if (element.title.toLowerCase().split(" ").indexOf(kw) >= 0){
                  ele.score += 1000;
                }//end of if (element.title.toLowerCase().split(" ").indexOf(kw) >= 0)
                if (element.content.toLowerCase().split(" ").indexOf(kw) >= 0) {
                  ele.score += 1;
                }//end of if (element.content.toLowerCase().split(" ").indexOf(kw) >= 0)
                if (sel_apps[element.apps].toLowerCase().split(" ").indexOf(kw) >= 0) {
                  ele.score += 100;
                }//end of if (sel_apps[element.page_name].toLowerCase().split(" ").indexOf(kw) >= 0)
                if (element.tags.indexOf(kw) >= 0) {
                  ele.score += 100;
                }//end of if (element.tag.indexOf(kw) >= 0)
              })//end of forEach
              if (ele.score) {
                selected_art.push(ele);
              }//end of if (ele.score)
            }//end of if (element.apps == key_apps)
          })//end of forEach

          selected_art = selected_art.sort(function(a,b) {
            return a.score - b.score ;
          });//end of sort function

          selected_art = selected_art.reverse()

          if (selected_art.length == 0) { // no results
            var article = create_not_found(key);
            DOM_section[0].appendChild(article);
          }
          else{
            if (selected_art.length > 10){
              selected_art = selected_art.slice(0,10);
            }//end of if (selected_art.length > 10)
            else {
              selected_art = selected_art.slice(0,selected_art.length);
            }//end of else

            selected_art.forEach(function(ele) {
              var title = ele.art.title;
              var content = ele.art.content;
              var url = ele.art.url;
              var tags = ele.art.tags;

              var article = create_article(title,content,url,tags);
              DOM_section[0].appendChild(article);
            })//end of forEach
          }//end of else
        }//end of else if (key_words[0] == "apps")

      }//end of else
    }//end of if(xhr.readyState == 4 && xhr.status == 200)
    else if(xhr.readyState == 4 && xhr.status != 200){
      busy = false;
      alert("Servor error",2000);
    }//end of else if(xhr.readyState == 4 && xhr.status != 200)
  }//end of function;
  xhr.send();
}//end of function search
