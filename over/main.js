


function myuploadFile() {
    var url = "http://138.68.25.50:6758";

    var selectedFile = document.getElementById('fileSelector').files[0];
    var image_name = selectedFile.name;
    var reader = new FileReader();
    
    var formData = new FormData();
    formData.append("userfile", selectedFile);
    var oReq = new XMLHttpRequest();
    oReq.open("POST", url, true);
    oReq.onload = function() {
        console.log(oReq.responseText);
    }
    oReq.send(formData);

    var images = document.getElementsByClassName('body_image');
    
    reader.onload = function() {
        var zero_image = images[0];
        zero_image.src = reader.result;
    }
    reader.readAsDataURL(document.getElementById('fileSelector').files[0]);
    console.log("Printing image tags.")
    
    var image_url = "http://138.68.25.50:6758/" + image_name; 
    var is_true = true;
    var iter = 0;
    while(is_true) {
		if(images[iter].src=="http://138.68.25.50:6758/photo/photo2.html") {
				// images[iter].src = image_url;
				is_true = false;
				images[iter].src = URL.createObjectURL(selectedFile);
		}
			iter+=1;
    }

}










var dictionary = {};

var added_images = 0;


function hhmyuploadFile() {
    var url = "http://138.68.25.50:6758";

    var selectedFile = document.getElementById('fileSelector').files[0];
    var image_name = selectedFile.name;
    var reader = new FileReader();
    
    var formData = new FormData();
    formData.append("userfile", selectedFile);
    var oReq = new XMLHttpRequest();
    oReq.open("POST", url, true);
    oReq.onload = function() {
        console.log(oReq.responseText);
    }
    oReq.send(formData);

				// adding one image to html structure
	//var container = document.getElementById('left_most_item');
	var container = document.getElementsByClassName('flex-container');
	
	var li = "<li class=\"flex-item\" >";
	var li_end  = "</li>";
		
	var new_image = li + "<img src=\"\" alt=\"" +image_name+ "\"" + " class=\"image\">" + li_end;
	var old_container = container[0].innerHTML;
	container.innerHTML = old_container + new_image;
	added_images++;
	console.log(container.innerHTML);
	
	
    var images = document.getElementsByClassName('image');

    console.log(images);
    reader.onload = function() {
        var zero_image = images[added_images-1];
        zero_image.src = reader.result;
    }
    reader.readAsDataURL(document.getElementById('fileSelector').files[0]);
    console.log("Printing image tags.")
    
    var image_url = "http://138.68.25.50:6758/" + image_name; 
    var is_true = true;
    var iter = 0;
    /*
    while(is_true) {
		if(images[iter].src=="http://138.68.25.50:6758/photo/photo2.html") {
				// images[iter].src = image_url;
				is_true = false;
				images[iter].src = URL.createObjectURL(selectedFile);
		}
			iter+=1;
    }
    */ 

}


function uploadButtonPressed() {

	var url = "http://138.68.25.50:7821/main";

	var selectedFile = document.getElementById('fileSelector').files[0];
	
	//console.log(selectedFile.name);
	
	var formData = new FormData(); 
	formData.append("userfile", selectedFile);

	
	var oReq = new XMLHttpRequest();
	oReq.open("POST", url, true);  

	oReq.onload = function() {
		console.log(oReq.responseText);
	}
	oReq.send(formData);

	
	var hamburgerButton = document.getElementById('hamburgerButton');
	var imageContainer = document.getElementById('imageContainer');
	var fr = new FileReader();

	fr.onload = function () {
		
		
			// Displays image to webpage
		var container = document.getElementsByClassName('flex-container');
		console.log(container[0]);
		var li = "<li class=\"flex-item\" >";
		var li_end  = "</li>";
		
		var new_image = "<img src=\"" +fr.result + "\" alt=\""+selectedFile.name+ "\"" + "class=\"image\">";
		console.log("New Image");
		console.log(new_image);	
	   
   
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


function show_hide(div_id) {
    var x = document.getElementById(div_id);
    if (x.style.display === 'block') {
        x.style.display = 'none';
    } else {
        x.style.display = 'block';
    }

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
	
	if(labels_field[0].style.backgroundColor=="rgb(194, 166, 156)"){
		labels_field[0].style.backgroundColor="rgb(255, 255, 255)";
	}
	else
	{
		labels_field[0].style.backgroundColor="rgb(194, 166, 156)";
	}
	
	
	var label_form = document.getElementsByClassName('my_input');
	
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
    
    var x_image = document.getElementsByClassName('tag_image');
   
   var num_xes = x_image.length;
   for(var iter = 0; iter<num_xes; iter++)
   {
	   
		if (x_image[iter].style.display === 'none') {
			x_image[iter].style.display = 'inline';
		} else {
			x_image[iter].style.display = 'none';
		}
   }
}
var label_count = 0;

function add_label(image_name) {

	var button = document.getElementsByClassName('label_input');
	var button_value = button[0].value;
	
	
	var image_index = -1;		// index of the calling image
	for(var key in dictionary)
	{
		if(key ==image_name) {
			image_index++;
			break;   }
	}
	
	
	var num_labels = dictionary[image_name]; 
	var labels_field = document.getElementsByClassName('labels_field');
	// Query: op=add&img=[image filename]&label=[label to add]
	var url_gen = "http://138.68.25.50:7821/query?op=add&img=";
	if(num_labels < 10){
		//<p class="a_label" id="label_ten" style="display: none"> <img src="Assets/removeTagButton.png" alt="x" class="x_image"/> </p>
		var current_content = labels_field[image_index].innerHTML;
		var new_label = "<p class=\"a_label\" id=\"label_ten\" style=\"display: in-line\"> <img src=\"Assets/removeTagButton.png\" alt=\"x\" class=\"x_image\"/>" + button_value+ "</p>";
		labels_field[image_index].innerHTML = current_content + new_label;
		dictionary[image_name]++;
		
		var url = url_gen + image_name + "&label=" + button_value;
		console.log("url: ", url);
		
		var oReq = new XMLHttpRequest();
		oReq.open("POST", url, true);  

		oReq.onload = function() {
			console.log(oReq.responseText);
		}
			oReq.send(formData);
		}
	else{
		console.log(image_name + " has 10 labels already.");
	}
		
	
}


function say_hello() {
	
	console.log("Hello");
}

function request_dump()
{
	var oReq = new XMLHttpRequest();
	var url = "http://138.68.25.50:7821/query?op=dump";
	
	function listener() {
		var data_back = JSON.parse(this.responseText);
		display_pics(data_back);
	}
	
	var oReq  = new XMLHttpRequest();
	oReq.addEventListener("load", listener);
	oReq.open("GET", url);
	oReq.send();
}

function display_pics(dataObject){
	
	
}
