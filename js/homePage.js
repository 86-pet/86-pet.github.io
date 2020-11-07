function readTextFile(file) {
    console.log(file);
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
      if (rawFile.readyState === 4) {
        if (rawFile.status === 200) {
          document.getElementById("iddiv1").innerHTML = rawFile.responseText;
  
        }
      }
    }
    rawFile.send(null);
  }
  