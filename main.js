function uploadButtonPressed() {

	var url = "http://138.68.25.50:7821/main";

	var selectedFile = document.getElementById('fileSelector').files[0];
	
	console.log(selectedFile.name);
	
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

function show_favs_tags(){
	var x = document.getElementsByClassName('show_favorites_tags');
	
	console.log(x[0]);
    if (x[0].style.display === 'block') {
        x[0].style.display = 'none';
    } else {
        x[0].style.display = 'block';
    }

}


function add_favs_tags() {
	
	var div_selec = document.getElementById('add_html');
	var inner = "<div class=\"show_favorites_tags\">";
	inner = inner + "<button class = \"change_tag\" onclick=\"change_tags('image_id')\">change tags</button>";
	inner = inner + "<button class = \"add_to_favs\" onclick=\"add_to_favs('image_id')\">add to favorites</button>" + "</div>";
	div_selec.innerHTML=inner;
}
