function set_dev_choice() {
  document.getElementById("cb1").onclick = function() {
    if (document.getElementById("cb1").checked){
      var dis = "flex";
    }
    else{
      var dis = "none";
    }
    document.getElementById("topics").style.display = dis;
  }
  }

function main() {

  set_dev_choice();
}

main();
