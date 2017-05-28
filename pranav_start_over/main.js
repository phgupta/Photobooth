// Global variables
var dictionary = {};
var label_count = 0;

var num_images = -1; // CHECK: Change later to 0 and below code accordingly if you have time.


// Dumping function
function request_dump() {
    
    var url = "http://138.68.25.50:7821/query?op=dump";
    var oReq = new XMLHttpRequest();

    oReq.addEventListener("load", function() {
        var dataArray = JSON.parse(this.responseText);
        console.log("dataArray: ", dataArray);
    });

    oReq.open("GET", url);
    oReq.send();
}


// Uploads image
function uploadButtonPressed() {

    // XMLHttpRequest()
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


    // Add new imageContainer div
    num_images += 1;
    
    var imageContainerDiv = document.createElement("div");
    imageContainerDiv.setAttribute("class", "imageContainer");
    imageContainerDiv.setAttribute("id", num_images);

    imageContainerDiv.innerHTML = 
    '<div class="image"> <img class="theImage"> <div class="show_favorites_tags" style="display:none"> <button class="change_tag" onclick="change_tags()"> change tags </button> <button class="add_to_favs"> add to favorites </button> </div> <input class="hamburgerButton"type="image" onclick="show_favs_tags(this.parentElement.parentElement.id)" src="Assets/optionsTriangle.png" style="display:none"/> </div> <div class="labels_field"> </div> <form> <input type="text" name="label" class="label_input" placeholder="label" style="display:none"> </form> <button class="my_button" onclick="add_label("label")">Add</button> </div>'
    
    var imagesDiv = document.getElementById("images");
    imagesDiv.appendChild(imageContainerDiv);


    // Displays image to webpage
	var image = document.getElementsByClassName('theImage');
	var hamburgerButton = document.getElementsByClassName('hamburgerButton');
	var imageContainer = document.getElementsByClassName('image');
	var fr = new FileReader();

	fr.onload = function () {
		image[num_images].src = fr.result;
		image[num_images].style.width = "100%";
		image[num_images].style.height = "100%";
		image[num_images].alt = selectedFile.name;

		imageContainer[num_images].style.position = "relative";
		hamburgerButton[num_images].style.display = "inline-block";
		hamburgerButton[num_images].style.position = "absolute";
		hamburgerButton[num_images].style.bottom = "0%";
		hamburgerButton[num_images].style.right = "0%";
    };
	fr.readAsDataURL(selectedFile);
}


// Shows the menu option
function show_favs_tags(y) {

    console.log("id: ", y);

	var x = document.getElementsByClassName('show_favorites_tags');

    console.log("show_favs_tags() - num_images: ", num_images);

    if (x[num_images].style.display === 'block')
        x[num_images].style.display = 'none'; 
    
    else 
        x[num_images].style.display = 'block';
}


// Clicking "change tags" in menu option
function change_tags() {

    // Changes the background color of label box
	var labels_field = document.getElementsByClassName('labels_field');
	if(labels_field[num_images].style.backgroundColor=="rgb(194, 166, 156)")
		labels_field[num_images].style.backgroundColor="rgb(255, 255, 255)";

	else
		labels_field[num_images].style.backgroundColor="rgb(194, 166, 156)";

	
    // Toggles the add label form
	var label_form = document.getElementsByClassName('label_input');
	if (label_form[num_images].style.display === 'block')
        label_form[num_images].style.display = 'none';

    else
        label_form[num_images].style.display = 'block';
  

    // Toggles add button
	var add_button = document.getElementsByClassName('my_button');
	if (add_button[num_images].style.display === 'block')
        add_button[num_images].style.display = 'none';
    
    else
        add_button[num_images].style.display = 'block';
   
    
    // CHECK: Delete label button.
    var x_image = document.getElementsByClassName('x_image');
    var num_xes = x_image.length;
    for(var iter = 0; iter<num_xes; iter++)
    {   
		if (x_image[iter].style.display === 'none')
			x_image[iter].style.display = 'inline';
		
        else
			x_image[iter].style.display = 'none';
   }
}


// Adds label on clicking the add button
function add_label(image_name) {

	var button = document.getElementsByClassName('label_input');
	var button_value = button[num_images].value;
	
	// CHECK: image_index should probably be declared as global var
	var image_index = -1;		// index of the calling image
	for(var key in dictionary)
	{
		if(key == image_name) 
        {
	        image_index++;
			break;   
        }
	}
	
	
	var num_labels = dictionary[image_name]; 
	var labels_field = document.getElementsByClassName('labels_field');
	
    if(num_labels < 10)
    {	
        var current_content = labels_field[image_index].innerHTML;
		var new_label = "<p class=\"a_label\"> <img src=\"Assets/removeTagButton.png\" alt=\"x\" class=\"x_image\" onclick=\"delete_label()\" />" + button_value + "</p>";
		labels_field[image_index].innerHTML = current_content + new_label;
		dictionary[image_name]++;
	

        // XMLHTTPRequest()
        // Query: op=add&img=[image filename]&label=[label to add]
	    var url_gen = "http://138.68.25.50:7821/query?op=add&img=";
		var url = url_gen + image_name + "&label=" + button_value;
	    
		var oReq = new XMLHttpRequest();
		oReq.open("GET", url, true);  

		oReq.onload = function() {
			console.log(oReq.responseText);
		}
		oReq.send();
	}
	
    else 
		console.log(image_name + " has 10 labels already.");
}

function show_hide(div_id) {
    var x = document.getElementById(div_id);
    if (x.style.display === 'block') {
        x.style.display = 'none';
    } else {
        x.style.display = 'block';
    }

}
