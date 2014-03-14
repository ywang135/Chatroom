/*
    miley.js
    An implementation of the MileyFeed project.
*/
var nIntervId;
function StringSet() {
    var setObj = {}, val = {};
	var length = 0;
    this.add = function(str) {
        setObj[str] = val;
		length++;
    };
    this.contains = function(str) {
        return setObj[str] === val;
    };
    this.remove = function(str) {
        delete setObj[str];
		length--;
		if(length < 0){
			alert("Not enough element!");
		}
    };
    this.values = function() {
        var values = [];
        for (var i in setObj) {
            if (setObj[i] === val) {
                values.push(i);
            }
        }
        return values;
    };
	this.size = function(){
		return length;
	}
}
var feedSet = new StringSet();
function appendingText() {
  nIntervId = setInterval(readMessage, 5000);
}
function myStopFunction()
{
	clearInterval(nIntervId);
}
function readMessage() {
	var request = new XMLHttpRequest();
	// specify the HTTP method, URL, and asynchronous flag
	request.open('POST', '/' + meta('roomName') + '/messages', true);
	// add an event handler
	request.addEventListener('load', function(e){
		if (request.status == 200) {
			// do something with the loaded content
		    var content = request.responseText;
			var data = JSON.parse(content);  
			for(var i = 0; i < data.length; i++){
				var display;
				var image = data[i].user.profile_image_url;
				if(image != "null"){
					display = '<img src = ' + image +'/><strong>' + data[i].user.name + '</strong><br>' + data[i].text;
				}
				else{
					display = '<img src = url: /"../img/no_photo.png /"/>' + image +'<strong>' + data[i].user.name + '</strong><br>' + data[i].text;
				}
				if(!feedSet.contains(data[i].id)){
					feedSet.add(data[i].id);	
					if(feedSet.size() > 50){
						myStopFunction();
						break;
					}
					var li = document.createElement('LI');
					li.innerHTML = display;
					var ul = document.getElementById('tweets');
					ul.insertBefore(li, ul.childNodes[0]);
				}
			}
		} else {
			if(request.status == 403)	{
				alert("You forgot something! Check it again! ");
			}
			// something went wrong, check the request status
			// hint: 403 means Forbidden, maybe you forgot your username?
								
		}
	}, false);
	request.send(null);
}
window.addEventListener('load', function(){
    appendingText();
}, false);

function clickmybutton(){
	document.getElementById("tweets").innerHTML ='';
	feedSet = new StringSet();
    appendingText();
}
//myclick.onclick = clickmybutton;
