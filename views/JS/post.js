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
function meta(name) {
    var tag = document.querySelector('meta[name=' + name + ']');
    if (tag != null)
        return tag.content;
    return '';
}

var roomName = meta('roomName');
function readMessage() {
	var request = new XMLHttpRequest();
	// specify the HTTP method, URL, and asynchronous flag
	request.open('GET', '/' + meta('roomName') + '/messages', true);
	// add an event handler
	request.addEventListener('load', function(e){
		if (request.status == 200) {
			// do something with the loaded content
		    var content = request.responseText;
			var data = JSON.parse(content);  
			for(var i = 0; i < data.length; i++){
                console.log("hello"+ data[i].body);
				var display = '<strong>' + data[i].nickname + ": " + data[i].time +'</strong><br><p>' + data[i].body + '</p>';
        
				if(!feedSet.contains(data[i].id)){
					feedSet.add(data[i].id);
					var li = document.createElement('LI');
					li.innerHTML = display;
					var ul = document.getElementById('topic');
                    console.log('ul: ' + ul);
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
function sendMessage(e) {
    // prevent the page from redirecting
    e.preventDefault();

    // create a FormData object from our form
    var fd = new FormData();
    fd.append('nickname', document.getElementById('nicknamefield').value);
    fd.append('message', document.getElementById('messagefield').value);
    // send it to the server
    var req = new XMLHttpRequest();
    req.open('POST', '/' + meta('roomName') + '/messages', true);
    req.send(fd);
}

window.addEventListener('load', function(){
    console.log("there!");
    appendingText();
    var messageForm = document.getElementById('messageForm');
    messageForm.addEventListener('submit', sendMessage, false);
}, false);
//myclick.onclick = clickmybutton;
