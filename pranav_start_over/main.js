// Global variables
var port = 7821;
var label_count = {}
var image_names = {}
var num_images = -1;

var num_labels_in_each_image = -1;

// Dumping function - Works
function request_dump() {
    
    var url = "http://138.68.25.50:" + port + "/query?op=dump";
    var oReq = new XMLHttpRequest();

    oReq.addEventListener("load", function() {
        var dataArray = JSON.parse(this.responseText);
        console.log("dataArray: ", dataArray);
        
        for (var i = 0; i < dataArray.length; i++)
        {
            num_images += 1;
   
            // Add new imageContainer div 
            var imageContainerDiv = document.createElement("div");
            imageContainerDiv.setAttribute("class", "imageContainer");
            imageContainerDiv.setAttribute("id", num_images);
    
            // Keeping track of image name and number of labels with respect to each image's id
            label_count[num_images] = 0;
            image_names[num_images] = dataArray[i].fileName;

            imageContainerDiv.innerHTML = 
            '<div class="image"> <img class="theImage"> <div class="show_favorites_tags" style="display:none"> <button class="change_tag" onclick="change_tags(this.parentElement.parentElement.parentElement.id)"> change tags </button> <button class="add_to_favs"> add to favorites </button> </div> <input class="hamburgerButton"type="image" onclick="show_favs_tags(this.parentElement.parentElement.id)" src="Assets/optionsTriangle.png" style="display:none"/> </div> <div class="labels_field"> </div> <div id="seconds" class="seconds"><div id="bar" class="bar animating"></div></div> <form> <input type="text" name="label" class="label_input" placeholder="label" style="display:none"> </form> <button class="my_add_button" onclick="add_label(this.parentElement.id)">Add</button> '
            var imagesDiv = document.getElementById("images");
            imagesDiv.appendChild(imageContainerDiv);


            // Displays image to webpage
	        var image = document.getElementsByClassName('theImage');
	        var hamburgerButton = document.getElementsByClassName('hamburgerButton');
	        var imageContainer = document.getElementsByClassName('image');
            var progressBar = document.getElementsByClassName('seconds');
        
		    image[num_images].src = "http://138.68.25.50:" + port + "/Uploads/" + dataArray[i].fileName;
		    image[num_images].style.width = "100%";
		    image[num_images].style.height = "100%";
		    image[num_images].alt = dataArray[i].fileName;

		    imageContainer[num_images].style.position = "relative";
		    hamburgerButton[num_images].style.display = "inline-block";
		    hamburgerButton[num_images].style.position = "absolute";
		    hamburgerButton[num_images].style.bottom = "0%";
		    hamburgerButton[num_images].style.right = "0%";
        
            
            // Parsing the labels
            var labels = dataArray[i].labels.split(",");


            // Showing labels of each image        
            var labels_field = document.getElementsByClassName('labels_field');
            for (var j = 0; j < labels.length; j++) 
            {
                if (labels[j] != "")
                {
                    // Adding the new label in the label textbox    
                    var current_content = labels_field[num_images].innerHTML;
                    var x_image_name = "x_image" + String(num_images);


		            var new_label = "<p class=\"a_label\">" + labels[j] + " </p>";
 		            //var new_label = "<p class=\"a_label\"> <img src=\"Assets/removeTagButton.png\" alt=\"x\" class=\"x_image "  + x_image_name + "\" onclick=\"delete_label()\" />" + labels[j] + "</p>";


		            labels_field[num_images].innerHTML = current_content + new_label;
		
                    // Incrementing number of labels of image and getting image name
                    label_count[num_images]++;
                }
            }
        }
    });

    oReq.open("GET", url);
    oReq.send();
}


// Uploads image - Works
function uploadButtonPressed() {

    // XMLHttpRequest()
	var url = "http://138.68.25.50:" + port + "/main";
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
    
    // Keeping track of image name and number of labels with respect to each image's id
    label_count[num_images] = 0;
    image_names[num_images] = selectedFile.name

    imageContainerDiv.innerHTML = 
    '<div class="image"> <img class="theImage"> <div class="show_favorites_tags" style="display:none"> <button class="change_tag" onclick="change_tags(this.parentElement.parentElement.parentElement.id)"> change tags </button> <button class="add_to_favs"> add to favorites </button> </div> <input class="hamburgerButton"type="image" onclick="show_favs_tags(this.parentElement.parentElement.id)" src="Assets/optionsTriangle.png" style="display:none"/> </div> <div class="labels_field"> </div>  <div id="seconds" class="seconds"><div id="bar" class="bar animating"></div></div>  <form> <input type="text" name="label" class="label_input" placeholder="label" style="display:none"> </form> <button class="my_add_button" onclick="add_label(this.parentElement.id)">Add</button> <div id="image">'
    var imagesDiv = document.getElementById("images");
    imagesDiv.appendChild(imageContainerDiv);


    // Displays image to webpage
	var image = document.getElementsByClassName('theImage');
	var hamburgerButton = document.getElementsByClassName('hamburgerButton');
	var imageContainer = document.getElementsByClassName('image');
    var progressBar = document.getElementsByClassName('seconds');
	var fr = new FileReader();

	fr.onload = function () {
		image[num_images].src = fr.result;
		image[num_images].style.width = "100%";
		image[num_images].style.height = "100%";
		image[num_images].alt = selectedFile.name;

        
        progressBar[num_images].style.display = "inline-block";        

		imageContainer[num_images].style.position = "relative";
		hamburgerButton[num_images].style.display = "inline-block";
		hamburgerButton[num_images].style.position = "absolute";
		hamburgerButton[num_images].style.bottom = "0%";
		hamburgerButton[num_images].style.right = "0%";

       
        
    };
	fr.readAsDataURL(selectedFile);
}


// Shows the menu option - Works
function show_favs_tags(index) {

	var x = document.getElementsByClassName('show_favorites_tags');

    if (x[index].style.display == 'block')
        x[index].style.display = 'none'; 
    
    else 
        x[index].style.display = 'block';
}


// Clicking "change tags" in menu option - Works
function change_tags(index) {

    // Changes the background color of label box
	var labels_field = document.getElementsByClassName('labels_field');
	if(labels_field[index].style.backgroundColor == "rgb(194, 166, 156)")
		labels_field[index].style.backgroundColor = "rgb(255, 255, 255)";

	else
		labels_field[index].style.backgroundColor = "rgb(194, 166, 156)";

	
    // Toggles the add label form
	var label_form = document.getElementsByClassName('label_input');
	if (label_form[index].style.display == 'block')
        label_form[index].style.display = 'none';

    else
        label_form[index].style.display = 'block';
  

    // Toggles add button
	var add_button = document.getElementsByClassName('my_add_button');
	if (add_button[index].style.display == 'block')
        add_button[index].style.display = 'none';
    
    else
        add_button[index].style.display = 'block';
   
    
    // Toggles delete button
    var x_image_name = "x_image" + String(index);
    var x_image = document.getElementsByClassName(x_image_name);
   
    for (var i = 0; i < label_count[index]; i++)
    {
        if (x_image[i].style.display == 'none')
            x_image[i].style.display = 'inline';

        else
            x_image[i].style.display = 'none';
    }
}


// Adds label on clicking the add button
function add_label(index) {

	var button = document.getElementsByClassName('label_input');
	var button_value = button[index].value;
	var num_labels = label_count[index]; 
    var labels_field = document.getElementsByClassName('labels_field');
	
    if(num_labels < 10)
    {
        // Adding the new label in the label textbox    
        var current_content = labels_field[index].innerHTML;
        var x_image_name = "x_image" + String(index);


        num_labels_in_each_image += 1;
		var new_label = "<p class=\"a_label\"" + "id=" + num_labels_in_each_image + "> <img src=\"Assets/removeTagButton.png\" alt=\"x\" class=\"x_image "  + x_image_name + "\" onclick=\"delete_label(this.parentElement.textContent" + "," + index + "," + num_labels_in_each_image + ")\" />" + button_value + "</p>";
		//var new_label = "<p class=\"a_label\"> <img src=\"Assets/removeTagButton.png\" alt=\"x\" class=\"x_image "  + x_image_name + "\" onclick=\"delete_label(this.parentElement.textContent" + "," + index + ")\" />" + button_value + "</p>";
        
        labels_field[index].innerHTML = current_content + new_label;
		

        // Incrementing number of labels of image and getting image name
        label_count[index]++;
        var imgName = image_names[index];

        // XMLHTTPRequest()
        // Query: op=add&img=[image filename]&label=[label to add]
	    var url_gen = "http://138.68.25.50:" + port + "/query?op=add&img=";
		var url = url_gen + imgName + "&label=" + button_value;
	    
		var oReq = new XMLHttpRequest();
		oReq.open("GET", url, true);  

		oReq.onload = function() {
			console.log(oReq.responseText);
		}
		oReq.send();
	}
	
    else 
		console.log("Error: Cannot exceed 10 labels.");
}


// Delets label
function delete_label(text, index, label_index) {
    console.log("text: ", text);
    console.log("index: ", index);
    console.log("label index: ", label_index);

    // Delets label from database 
    // XMLHTTPRequest()
    // Query: op=delete&img=[image filename]&label=[label to delete]
    var url_gen = "http://138.68.25.50:" + port + "/query?op=delete&img=";
    var url = url_gen + image_names[index] + "&label=" + text;

    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);

    oReq.onload = function() {
        console.log(oReq.responseText);
    }
    oReq.send();

    /*
    // Deletes label from screen
    var labels_field = document.getElementsByClassName('labels_field');
    var a_label = document.getElementsByClassName('a_label');
    console.log("labels_field: ", labels_field);
    //labels_field[index].removeChild(a_label[label_index]);
    */
}


function show_hide(div_id) {
    var x = document.getElementById(div_id);
    if (x.style.display === 'block') {
        x.style.display = 'none';
    } else {
        x.style.display = 'block';
    }
}
