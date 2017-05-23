// uploads an image within a form object.  This currently seems
// to be the easiest way to send a big binary file. 
function uploadFile() {
    var btn = document.createElement("img");
    document.body.appendChild(btn);


    var fr = new FileReader();


    // where we find the file handle
    var selectedFile = document.getElementById('fileSelector').files[0];
    var formData = new FormData(); 


    fr.onload = function () {
    btn.src = fr.result;
    };
    fr.readAsDataURL(selectedFile);
    btn.style.opacity = 0.5;
    var url = "http://138.68.25.50:6650";


    // stick the file into the form
    formData.append("userfile", selectedFile);

    // more or less a standard http request
    var oReq = new XMLHttpRequest();
    // POST requests contain data in the body
    // the "true" is the default for the third param, so 
    // it is often omitted; it means do the upload 
    // asynchornously, that is, using a callback instead
    // of blocking until the operation is completed. 
    oReq.open("POST", url, true);

    oReq.onload = function() {

   
    btn.setAttribute('src', 'http://138.68.25.50:6650/' + selectedFile.name);
     btn.style.opacity = 1.0;
   
	// the response, in case we want to look at it
	console.log(oReq.responseText);

    }





    oReq.send(formData);
   

}


