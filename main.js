function uploadButtonPressed() {

	var url = "http://138.68.25.50:7821/main";

	var selectedFile = document.getElementById('fileSelector').files[0];
	var formData = new FormData(); 
	formData.append("userfile", selectedFile);

	var oReq = new XMLHttpRequest();
	oReq.open("POST", url, true);  

	oReq.onload = function() {
		console.log(oReq.responseText);
	}

	oReq.send(formData);

	/*
	var image = document.getElementById('theImage');
	var fr = new FileReader();

	fr.onload = function () {
		image.src = fr.result;
		image.style.width = "300px";
	};

	fr.readAsDataURL(selectedFile);
	*/
}
