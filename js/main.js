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

function main() {

  set_dev_choice();
  set_btest();
}

main();
