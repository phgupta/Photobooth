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

	// Displays image to webpage
	var image = document.getElementById('theImage');
	var hamburgerButton = document.getElementById('hamburgerButton');
	var imageContainer = document.getElementById('imageContainer');
	var fr = new FileReader();

	fr.onload = function () {
		image.src = fr.result;
		image.style.width = "100%";
		image.style.height = "100%";

		imageContainer.style.position = "relative";
		hamburgerButton.style.display = "inline-block";
		hamburgerButton.style.position = "absolute";
		hamburgerButton.style.bottom = "0%";
		hamburgerButton.style.right = "0%";
	};

	fr.readAsDataURL(selectedFile);
}
