// Global variables
var dictionary = {};
var label_count = 0;

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


	// Displays image to webpage
	var image = document.getElementById('theImage');
	var hamburgerButton = document.getElementById('hamburgerButton');
	var imageContainer = document.getElementById('image');
	var fr = new FileReader();

	fr.onload = function () {
		image.src = fr.result;
		image.style.width = "100%";
		image.style.height = "100%";
		image.alt = selectedFile.name;

		imageContainer.style.position = "relative";
		hamburgerButton.style.display = "inline-block";
		hamburgerButton.style.position = "absolute";
		hamburgerButton.style.bottom = "0%";
		hamburgerButton.style.right = "0%";
	};
	fr.readAsDataURL(selectedFile);


    // Andro's code    
	var labels_field = document.getElementsByClassName('labels_field');
		if (labels_field[0].style.display === 'none') {
        labels_field[0].style.display = 'block';
    } else {
        labels_field[0].style.display = 'block';
    }
    
    
    	// add picture name to dictionary
	if(!(dictionary[selectedFile.name]))
	{
		dictionary[selectedFile.name] = 0;
	}
	
	var add_num = Object.keys(dictionary).length;
	var add_button = document.getElementsByClassName('my_button');
	
	add_button[add_num-1].onclick = function() {
			add_label(selectedFile.name);}
			
	
}


// Shows the menu option
function show_favs_tags() {

	var x = document.getElementsByClassName('show_favorites_tags');
	
    if (x[0].style.display === 'block')
        x[0].style.display = 'none'; 
    
    else 
        x[0].style.display = 'block';
}


// Clicking "change tags" in menu option
function change_tags() {

    // Changes the background color of label box
	var labels_field = document.getElementsByClassName('labels_field');
	if(labels_field[0].style.backgroundColor=="rgb(194, 166, 156)")
		labels_field[0].style.backgroundColor="rgb(255, 255, 255)";

	else
		labels_field[0].style.backgroundColor="rgb(194, 166, 156)";

	
    // Toggles the add label form
	var label_form = document.getElementsByClassName('label_input');
	if (label_form[0].style.display === 'block')
        label_form[0].style.display = 'none';

    else
        label_form[0].style.display = 'block';
  

    // Toggles add button
	var add_button = document.getElementsByClassName('my_button');
	if (add_button[0].style.display === 'block')
        add_button[0].style.display = 'none';
    
    else
        add_button[0].style.display = 'block';
   
    
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
	var button_value = button[0].value;
	
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
		var new_label = "<p class=\"a_label\"> <img src=\"Assets/removeTagButton.png\" alt=\"x\" class=\"x_image\"/>" + button_value+ "</p>";
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
