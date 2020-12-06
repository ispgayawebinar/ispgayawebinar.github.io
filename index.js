const api = axios.create({
  baseURL: 'https://gayawebinar.000webhostapp.com/',
  timeout: 10000,
});

var loading_element = document.getElementById("loading");
var title_element = document.getElementById("title");
var description_element = document.getElementById("description");
var date_element = document.getElementById("date");
var form_element = document.getElementById("form");
var speakers_container_element = document.getElementById("speakers_container");
var speakers_element = document.getElementById("speakers");
var not_found_element = document.getElementById("not_found");
var webinar_id = 0;

function createElement(name, role, image){
	var element = '<div class="speaker">';
	element += '<div class="profile"><img src="'+image+'"></div>';
	element += '<div class="name"><span>'+name+'</span></div>';
	element += '<div class="sub"><span>'+role+'</span></div>';
	element += '</div>';
	return element;
}

function getParams()
{
	var params = window.location.search.substring(1).split('&');
	var paramArray = {};
	for(var i=0; i<params.length; i++)
	{
		var param = params[i].split('=');
		paramArray[param[0]] = param[1];
	}

	return paramArray;
}

async function getWebinar(id){
	await api.post("get_webinar.php", "webinar_id="+id).then((res) => {
		
		loading_element.style = "display: none";
		title_element.innerText  = res.data.result.title;
		description_element.innerText  = res.data.result.description;
		date_element.innerText = res.data.result.date;

		if(res.data.speakers != undefined){
			for(var i=0;i<res.data.speakers.length;i++){
				speakers_element.innerHTML += createElement(res.data.speakers[i].name, res.data.speakers[i].role, res.data.speakers[i].image);
			}
			speakers_container_element.style = "display: block";
		}

		if(res.data.status != "ok"){
			input_send.disabled = true;
			loading_element.style = "display: none";
			not_found_element.style = "display: block";
		}

	}).catch((error) => {
		input_send.disabled = true;
		loading_element.style = "display: none";
		not_found_element.style = "display: block";
	});
}

function IsEmail (email) {
  var emailPattern =  /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/;
   return emailPattern.test(email); 
}

var input_name = document.getElementById("input_name");
var input_lastname = document.getElementById("input_lastname");
var input_email = document.getElementById("input_email");
var input_conf_email = document.getElementById("input_conf_email");
var input_send = document.getElementById("input_send");
var response = document.getElementById("response");

function enviar_de_verdade(name, lastname, email){
	input_name.value = "";
	input_lastname.value = "";
	input_email.value = "";
	input_conf_email.value = "";
	input_send.disabled = true;
	input_send.innerHTML = '<img src="assets/spinner.svg" width="40">';
	api.post("/subscribe.php", "name="+name+" "+lastname+"&email="+email+"&webinar_id="+webinar_id).then((res) => {

		if(res.data.status == "ok"){
			input_send.innerHTML = "Enviar";
			response.innerText = "Inscrição feita com sucesso!";
			input_send.disabled = false;
		}
		else{
			console.log(res.data);
		}

	}).catch((error) => {
		console.log(error);
	});
}

function sendCoisa(){
	var error = false;

	
	if(input_name.value.length == 0){
		var name_span = document.createElement("span");
		var name_div = document.createElement("div");
		
		input_name.className = "input-error";
		name_span.innerText = "Nome inválido";
		name_div.appendChild(name_span);
		name_div.className = "error";
		if(input_name.parentNode.children.length < 2){
			input_name.parentNode.appendChild(name_div);
		}
		error = true;
	}
	
	if(input_lastname.value.length == 0){
		var span = document.createElement("span");
		var div = document.createElement("div");

		input_lastname.className = "input-error";
		span.innerText = "Apelido inválido";
		div.appendChild(span);
		div.className = "error";
		if(input_lastname.parentNode.children.length < 2){
			input_lastname.parentNode.appendChild(div);
		}
		error = true;
	}
	

	if(input_email.value.length == 0){
		var email_span = document.createElement("span");
		var email_div = document.createElement("div");

		input_email.className = "input-error";
		email_span.innerText = "Email inválido";
		email_div.appendChild(email_span);
		email_div.className = "error";
		if(input_email.parentNode.children.length < 2){
			input_email.parentNode.appendChild(email_div);
		}
		error = true;
	}

	if(IsEmail(input_email.value) == false){
		var email_span = document.createElement("span");
		var email_div = document.createElement("div");

		input_email.className = "input-error";
		email_span.innerText = "Email inválido";
		email_div.appendChild(email_span);
		email_div.className = "error";
		if(input_email.parentNode.children.length < 2){
			input_email.parentNode.appendChild(email_div);
		}
		error = true;
	}


	if(error == false){
		if(input_email.value != input_conf_email.value){
			
			var cemail_span = document.createElement("span");
			var cemail_div = document.createElement("div");

			input_conf_email.className = "input-error";
			cemail_span.innerText = "E-mails são diferentes";
			cemail_div.appendChild(cemail_span);
			cemail_div.className = "error";
			if(input_conf_email.parentNode.children.length < 2){
				input_conf_email.parentNode.appendChild(cemail_div);
			}
		}
		else{
			enviar_de_verdade(input_name.value, input_lastname.value, input_email.value);
		}
	}
}

input_send.addEventListener('click', function(e){
	e.preventDefault();

	if(webinar_id != 0){
		sendCoisa();
	}	
}, false);

var params = getParams();
if(params.id != undefined && params.id != 0){
	webinar_id = params.id;
	getWebinar(params.id);	
}
else{
	input_send.disabled = true;
	loading_element.style = "display: none";
	not_found_element.style = "display: block";
	document.getElementById("form").style = "display: none;";
	document.getElementById("titlea").style = "display: none;";

}