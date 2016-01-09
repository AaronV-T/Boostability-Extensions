//Script injected into popup window for the Onsite All In One extension for Google Chrome

document.getElementById('openPages').addEventListener('click', openPages);
document.getElementById('closePages').addEventListener('click', closePages);
document.getElementById('copyTaskInfo').addEventListener('click', copyTaskInfo);
document.getElementById('copySignature').addEventListener('click', copySignature);
document.getElementById('markWorkblock').addEventListener('click', markWorkblock);
document.getElementById('openOptions').addEventListener('click', openOptions);


/*chrome.runtime.onMessage.addListener(function(request, sender) {
  if (request.action && request.action == "displayTags" && request.tags) {
    message.innerText = request.tags;
  }
});*/

function closePages() {
	console.log("closePages");
	//var message = document.getElementById('message'); //Get the message div on popup.html.

	chrome.runtime.sendMessage( { messageType: "closeTabs" } );
}

function copyTaskInfo() {
	chrome.tabs.query(
        { currentWindow: true, active: true },
        function (tabArray) { 
			chrome.tabs.sendMessage(tabArray[0].id, { requestType: "task" } );
		}
    );
}

function copySignature() {
	chrome.tabs.query(
        { currentWindow: true, active: true },
        function (tabArray) { 
			chrome.tabs.sendMessage(tabArray[0].id, { requestType: "signature" } );
		}
    );
}

function markWorkblock() {
	chrome.tabs.query(
        { currentWindow: true, active: true },
        function (tabArray) { 
			chrome.runtime.sendMessage( { messageType: "markWorkblockTab", tabID: tabArray[0].id } );
		}
    );
}

function openPages() {
	console.log("openPages");
	//var message = document.getElementById('message'); //Get the message div on popup.html.

	chrome.runtime.sendMessage( { messageType: "clearWBInfo" } );
	
	chrome.tabs.executeScript(null, {
		file: "getTaskInfo.js"
	}, function() {
		if (chrome.runtime.lastError) { // If there was an error injecting the script. (You can't inject into any chrome:// URL)
			console.log("Error executing script: " + chrome.runtime.lastError.message);
		}
		else {
			document.getElementById('openPages').disabled = true; //Disable the button so the user doesn't click it again.
			setTimeout(function() { //Reenable the button after 3 seconds.
				document.getElementById('openPages').disabled = false;
			}, 3000);
		}
	});
}

function openOptions() {
	chrome.runtime.openOptionsPage();
}




