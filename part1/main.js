// Global variables
//var port = 7821;
var port = 6758;
var label_count = {};               // Indexed with image_index - starts at 0
var image_names = {};               // Indexed with image_index
var image_labels = {};              // Labels in each image
var num_images = -1;                // Used in dump() and uploadButton() - starts at -1
var filtered_images = [];

// Dumping function - Works
function request_dump() {
    
    var url = "http://138.68.25.50:" + port + "/query?op=dump";
    var oReq = new XMLHttpRequest();

    oReq.addEventListener("load", function() {
        var dataArray = JSON.parse(this.responseText);
        console.log("dataArray: ", dataArray);
        var addToFavsDiv = document.getElementsByClassName("add_to_favs");

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
            '<div class="image"> <img class="theImage"> <div class="show_favorites_tags" style="display:none"> <button class="change_tag" onclick="change_tags(this.parentElement.parentElement.parentElement.id)"> change tags </button> <button class="add_to_favs" onclick="favoriteImage(this.parentElement.parentElement.parentElement.id)"> add to favorites </button> </div> <input class="hamburgerButton"type="image" onclick="show_favs_tags(this.parentElement.parentElement.id)" src="Assets/optionsTriangle.png" style="display:none"/> </div> <div class="labels_field"> </div> <div id="seconds" class="seconds"><div id="bar" class="bar animating"></div></div> <input type="text" name="label" class="label_input" placeholder="label" style="display:none" onkeypress="enterpressed(event,this.parentElement.id)">  <button class="my_add_button" onclick="add_label(this.parentElement.id)">Add</button> '
            var imagesDiv = document.getElementById("images");
            imagesDiv.appendChild(imageContainerDiv);

            // Checks if image is favorited or not
            if (dataArray[i].favorite == 1)
                addToFavsDiv[i].textContent = "unfavorite"

            else
                addToFavsDiv[i].textContent = "add to favorites"


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
            image_labels[num_images] = dataArray[i].labels;
            var labels = dataArray[i].labels.split(",");


            // Showing labels of each image        
            // adding labels for one image at a time.
            var labels_field = document.getElementsByClassName('labels_field');
            for (var j = 0; j < labels.length; j++) 
            {
                if (labels[j] != "")
                {
                    // Adding the new label in the label textbox    
                    var current_content = labels_field[num_images].innerHTML;
                    var x_image_name = "x_image" + String(num_images);

 		            var new_label = "<p class=\"a_label\"> <img src=\"Assets/removeTagButton.png\" alt=\"x\" style=\"display:none\"class=\"x_image  "  + x_image_name + "\" onclick=\"delete_label(this.parentElement.textContent" + "," + j + "," + i + ")\" />" + labels[j] + "</p>";

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
    var selectedFile =  document.getElementById('fileSelector').files[0];

    if("undefined" == typeof(selectedFile)){
        alert("Choose a file first please before uploading!");
    }
    else
    {
	
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
    '<div class="image"> <img class="theImage"> <div class="show_favorites_tags" style="display:none"> <button class="change_tag" onclick="change_tags(this.parentElement.parentElement.parentElement.id)"> change tags </button> <button class="add_to_favs" onclick="favoriteImage(this.parentElement.parentElement.parentElement.id)"> add to favorites </button> </div> <input class="hamburgerButton"type="image" onclick="show_favs_tags(this.parentElement.parentElement.id)" src="Assets/optionsTriangle.png" style="display:none"/> </div> <div class="labels_field"> </div> <div id="seconds" class="seconds"><div id="bar" class="bar animating"></div></div> <input type="text" name="label" class="label_input" placeholder="label" style="display:none" onkeypress="enterpressed(event,this.parentElement.id)">  <button class="my_add_button" onclick="add_label(this.parentElement.id)">Add</button> '
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
}}


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


// Favorites/Unfavorite button
function favoriteImage(index)
{
    var addToFavsDiv = document.getElementsByClassName('add_to_favs');

    // Toggle between "add to favorites" and "unfavorite"
    if (addToFavsDiv[index].textContent == "unfavorite")
    {
        addToFavsDiv[index].textContent = "add to favorites";
        var url = "http://138.68.25.50:" + port + "/query?op=unfavorite&img=" + image_names[index];
    }

    else
    {
        addToFavsDiv[index].textContent = "unfavorite";
        var url = "http://138.68.25.50:" + port + "/query?op=favorite&img=" + image_names[index];
    }


    // Make XMLHttpRequest()
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);

    oReq.onload = function() {
        console.log(oReq.responseText);
    }
    oReq.send();
}


// Adds label on clicking the add button
function add_label(index) {

	var button = document.getElementsByClassName('label_input');
	var button_value = button[index].value;
	var num_labels = label_count[index]; 
    var labels_field = document.getElementsByClassName('labels_field');

    if(num_labels < 10)
    {
        // Updating image_labels variable
        image_labels[index] = image_labels[index] + "," + button_value;


        // Adding the new label in the label textbox    
        var current_content = labels_field[index].innerHTML;
        var x_image_name = "x_image" + String(index);

        
        // Incrementing number of labels of image and getting image name
        ++label_count[index];
        var imgName = image_names[index];

		var new_label = "<p class=\"a_label\"" + "id=" + label_count[index] + "> <img src=\"Assets/removeTagButton.png\" alt=\"x\"style=\"display:inline\"class=\"x_image "  + x_image_name + "\" onclick=\"delete_label(this.parentElement.textContent" + "," + label_count[index]  + "," + index + ",)\" />" + button_value + "</p>";
        
        labels_field[index].innerHTML = current_content + new_label;


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
function delete_label(text, label_index, image_index) {

    // CHECK WHY THIS IS HAPPENING
    // Trim white space character in the beginning of text
    text = text.substr(1);
    
    // Deletes label from screen
    
    var button = document.getElementsByClassName("label_input");
    var labels_field = document.getElementsByClassName("labels_field");
    var x_image_name = "x_image" + String(image_index);
    
    // Clearing all labels
    labels_field[image_index].innerHTML = "";
    
    // Updating labelsArray & image_labels
    var labelsArray = image_labels[image_index].split(",");
    var ind = labelsArray.indexOf(text);
    if (ind > -1)
    {
        console.log("im in here");
        labelsArray.splice(ind, 1);
        image_labels[image_index] = labelsArray.join(",");
        --label_count[image_index];
    }

    for (var i = 0; i < labelsArray.length; i++)
    {
		var new_label = "<p class=\"a_label\"" + "id=" + label_count[image_index] + "> <img src=\"Assets/removeTagButton.png\" alt=\"x\"style=\"display:inline\"class=\"x_image "  + x_image_name + "\" onclick=\"delete_label(this.parentElement.textContent" + "," + label_count[image_index]  + "," + image_index + ",)\" />" + labelsArray[i] + "</p>";
   
        labels_field[image_index].innerHTML += new_label; 
    }

 
    // XMLHTTPRequest()
    // Query: op=delete&img=[image filename]&label=[label to delete]
    var imgName = image_names[image_index];
    var url = "http://138.68.25.50:" + port + "/query?op=delete&img=" + imgName + "&label=" + text;
	    
    var oReq = new XMLHttpRequest();
	oReq.open("GET", url, true);  

	oReq.onload = function() {
		console.log(oReq.responseText);
	}
	oReq.send();
}
	

function show_hide(div_id) {
    var x = document.getElementById(div_id);
    if (x.style.display === 'block') {
        x.style.display = 'none';
    } else {
        x.style.display = 'block';
    }
}

function apply_filter() {

    // get the value of the input form
    var user_input = document.getElementById('bottom_filter');
    var input_value = user_input.value;
    
    // Send a query to server with the user inputed label,asking for all the pictures with the given label
    var url = "http://138.68.25.50:" + port + "/query?op=filter&label=" + input_value;
    var oReq = new XMLHttpRequest();
    oReq.open("GET", url, true);
    oReq.onload = function() {
		
        var new_obj = JSON.parse(oReq.responseText);
		var counter = 0;
		var images_div = document.getElementsByClassName('imageContainer');
        var is_included = 0;
         
        for (var i = 0; i <= num_images; i++)
        {
            var image_name = images_div[i].childNodes[0].childNodes[1].alt;
            for (var j = 0; j < new_obj.length; j++) 
            {
                if(image_name == new_obj[j].fileName)
                {
                    images_div[i].style.display='inline';
                    break;
                }
                    
                else
                {
                    images_div[i].style.display='none';
                    var found_it = 0;
                    for(var index = 0; index < filtered_images.length; index++)
                    {
                        if(filtered_images[index] == i)
                            found_it = 1;

                    }
                    if(found_it ==0)
                    {
                        filtered_images[counter] = i;
                        counter++;
                    }
                }
            }
        }
        console.log(filtered_images);
    }
    oReq.send();
}


function clear_filter(){
    var images_div = document.getElementsByClassName('imageContainer');

    for(var i = 0; i < filtered_images.length; i++)
    {
        images_div[filtered_images[i]].style.display='inline';
    }

}


// Makes the XMLHttpRequest for favorite images
function favoritePressed() {
    show_hide('favorite_show');

    var url = "http://138.68.25.50:" + port + "/query?op=select_all_favorite";

    // Make XMLHttpRequest()
    var oReq = new XMLHttpRequest()
    oReq.open("GET", url, true);
    oReq.onload = function() {
        console.log(oReq.responseText);

        var new_obj = JSON.parse(oReq.responseText);	
		var counter = 0;
		var images_div = document.getElementsByClassName('imageContainer');
        var is_included = 0;
         
        for (var i = 0; i <= num_images; i++)
        {
            var image_name = images_div[i].childNodes[0].childNodes[1].alt;
            for (var j = 0; j < new_obj.length; j++) 
            {
                if(image_name == new_obj[j].fileName)
                {
                    images_div[i].style.display='inline';
                    break;
                }
                    
                else
                {
                    images_div[i].style.display='none';
                    var found_it = 0;
                    for(var index = 0; index < filtered_images.length; index++)
                    {
                        if(filtered_images[index] == i)
                            found_it = 1;

                    }
                    if(found_it ==0)
                    {
                        filtered_images[counter] = i;
                        counter++;
                    }
                }
            }
        }
        console.log(filtered_images);
    }
    oReq.send();
}


// Basically calls request_dump()
function clear_favorites() {
	
    var x = document.getElementById('favorite_show');
    if (x.style.display === 'block') {
        x.style.display = 'none';
    } else {
        x.style.display = 'block';
    }

    document.getElementById('images').innerHTML = "";
    num_images = -1;
    request_dump();
}

function enterpressed(event, image_index)
{
    if(event.which == 13 || event.keyCode ==13)
    {
        add_label(image_index);
        document.getElementsByClassName('label_input')[image_index].value = "";
	}
}

function apply_filter_enter(event) {
	if(event.which == 13 || event.keyCode ==13)
	{
		apply_filter();
		document.getElementById('bottom_filter').value = "";
	}
	
}
