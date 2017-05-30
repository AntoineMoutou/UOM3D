function setHTML() {
  var height = document.getElementById("min").offsetHeight +'px';
  document.getElementById("content").style.top = height;
}

function set_dev_choice() {
  document.getElementById("cb1").onclick = function() {
    if (document.getElementById("cb1").checked){
      var height = document.getElementById("nav").offsetHeight +'px';
    }
    else{
      var height = document.getElementById("min").offsetHeight +'px';
    }
    document.getElementById("content").style.top = height;
  }
  }



function main() {

  setHTML();
  set_dev_choice();
}

main();
