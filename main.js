function uploadButtonPressed() {

	console.log("hello");

	var selectedFile = document.getElementById('fileSelector').files[0];
	var image = document.getElementById('theImage');

	var fr = new FileReader();

	fr.onload = function () {
		image.src = fr.result;
		//image.style.display = "block";
		image.style.width = "300px";
	};

	fr.readAsDataURL(selectedFile);
}