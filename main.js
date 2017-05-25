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
	
    if (x[0].style.display === 'block') {
        x[0].style.display = 'none';
    } else {
        x[0].style.display = 'block';
    }

}

function change_tags(image_id)
{
	var labels_field = document.getElementsByClassName('labels_field');
	
	console.log(labels_field[0]);
	if(labels_field[0].style.backgroundColor=="rgb(194, 166, 156)"){
		console.log("Hello World");
		labels_field[0].style.backgroundColor="rgb(255, 255, 255)";
		
	}
	else
	{
		labels_field[0].style.backgroundColor="rgb(194, 166, 156)";
	}
	
	
	var label_form = document.getElementsByClassName('label_input');
	
	if (label_form[0].style.display === 'block') {
        label_form[0].style.display = 'none';
    } else {
        label_form[0].style.display = 'block';
    }

	
	var add_button = document.getElementsByClassName('my_button');
	if (add_button[0].style.display === 'block') {
        add_button[0].style.display = 'none';
    } else {
        add_button[0].style.display = 'block';
    }
}
