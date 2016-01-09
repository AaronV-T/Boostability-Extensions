//Content page for the Launchpad to Workblock Easy Copy extension for Google Chrome. Injected into launchpad webpages.

//console.log("lpContent.js running"); //Test the pages this content is injected into.

/* Listen for messages */
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.requestType)
		console.log("MessageReceived: requestType = " + msg.requestType);
	else
		console.log("MessageReceived");
		
	if (msg.requestType && msg.requestType == "task")  //If the message includes an id.
		taskRequest();
	else if (msg.requestType && msg.requestType == "account")  //If the message includes an id.
		accountRequest();
	else if (msg.requestType && msg.requestType == "accountCheck" && msg.cid)  //If the message includes an id.
		accountRequestCheck(msg.cid);
	else if (msg.requestType && msg.requestType == "signature")  //
		signatureRequest();
});


function accountRequest() {
	var clientServiceRep, partnerName;
		
		/*var listGroupItems = document.getElementsByClassName("list-group-item");
		
		for (i = 0; i < listGroupItems.length; i++) {
			if (listGroupItems[i].innerHTML.indexOf("Customer ID") > -1) {
				//console.log(listGroupItems[i].innerHTML + " ");
				customerID = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
				console.log("cid: " + customerID);
			}
			if (listGroupItems[i].innerHTML.indexOf("Task Id") > -1) {
				//console.log(listGroupItems[i].innerHTML + " ");
				taskID = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
				//console.log("tid: " + taskID);
			}
		}
		
		if (customerID !== undefined && taskID !== undefined) {
			chrome.runtime.sendMessage({messageType: "taskInfo", cid: customerID, tid: taskID} );
		}*/
}

function accountRequestCheck(cid) {
	var partnerName, clientServiceRep;
	var isAccountPage = false;
	
	var panelTitleItems = document.getElementsByClassName("panel-title");
	if (panelTitleItems[0] === undefined) {
		//console.log("I am not a Customer Information tab! Aborting.");
		return;
	}
	for (i = 0; i < panelTitleItems.length; i++) {
		if (panelTitleItems[i].innerHTML.indexOf("partnerName") > -1 && panelTitleItems[i].innerHTML.indexOf("Customer Information") > -1) {
			partnerName = panelTitleItems[i].getElementsByTagName("strong")[0].innerHTML;
			isAccountPage = true;
		}
	}
	
	if (!isAccountPage) {
		//console.log("I am not a Customer Information tab! Aborting.");
		return;
	}
	
	var listGroupItems = document.getElementsByClassName("list-group-item");
	for (i = 0; i < listGroupItems.length; i++) {
		if (listGroupItems[i].innerHTML.indexOf("Customer ID") > -1) {
			if (cid != listGroupItems[i].getElementsByClassName("pull-right")[1].innerHTML) {//If the marked tab isn't on the same customer that our task is on, return.
				console.log("Client ID does not match, not sending account info");
				return;
			}
		}
		else if (listGroupItems[i].innerHTML.indexOf("$root.accountManagerName()") > -1) 
			clientServiceRep = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;

	}
	
	
	/*console.log(clientServiceRep);
	console.log(partnerName);
	console.log(panelTitleItems[0].outerHTML);*/
	
	if (partnerName !== undefined && clientServiceRep !== undefined) {//If all the necessary variables are defined, send the background page a message.
		chrome.runtime.sendMessage({ messageType: "accountInfo", partner: partnerName, csr: clientServiceRep } );
		console.log("account info sent");
	}
}

function signatureRequest() {	
	var taskType, customerURL, taskID;
		
	var listGroupItems = document.getElementsByClassName("list-group-item");
	
	for (i = 0; i < listGroupItems.length; i++) { //Loop through every element in the array and check for our key phrases. If found, save the information that we need.
		if (listGroupItems[i].innerHTML.indexOf("Task Type") > -1)
			taskType = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
		else if (listGroupItems[i].innerHTML.indexOf("Customer URL") > -1)
			customerURL = listGroupItems[i].getElementsByClassName("pull-right")[0].getAttribute('href');
		else if (listGroupItems[i].innerHTML.indexOf("Task ID") > -1 || listGroupItems[i].innerHTML.indexOf("Task Id") > -1)
			taskID = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
	}
	
	if (customerURL && customerURL.charAt(customerURL.length - 1) == '/') //If the last character of the url is a '/', get rid of it.
		customerURL = customerURL.substr(0, customerURL.length - 1);
		
	if (taskType === "Onsite Content Change")
		taskID = "OCT";
	
	if (taskType !== undefined && customerURL !== undefined && taskID !== undefined) { //If all the necessary variables are defined, send the background page a message.
		chrome.runtime.sendMessage( { messageType: "signatureInfo", tType: taskType, cURL: customerURL, tid: taskID } );
		console.log("signature info sent");
	}
	else
		console.log("failed to send signature info.");
}


function taskRequest() {
	var taskType, taskDate, tempDate, taskID, customerID;
		
	var listGroupItems = document.getElementsByClassName("list-group-item");
	
	for (i = 0; i < listGroupItems.length; i++) { //Loop through every element in the array and check for our key phrases. If found, save the information that we need.
		if (listGroupItems[i].innerHTML.indexOf("Task Type") > -1)
			taskType = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
		else if (listGroupItems[i].innerHTML.indexOf("Task Date") > -1)
			tempDate = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
		else if (listGroupItems[i].innerHTML.indexOf("Task ID") > -1 || listGroupItems[i].innerHTML.indexOf("Task Id") > -1)
			taskID = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
		else if (listGroupItems[i].innerHTML.indexOf("Customer ID") > -1 || listGroupItems[i].innerHTML.indexOf("Customer Id") > -1) 
			customerID = listGroupItems[i].getElementsByClassName("pull-right")[0].innerHTML;
	}
	
	console.log(taskType + " " + tempDate + " " + taskID + " " + customerID);
	if (taskType === "Onsite Content Change")
		taskID = "Onsite Content Change";
	else if  (taskType === "Google Webmaster Tools Tag Integration")
		taskType = "Google WMT Tag Integration";
	
	
	//Put the date in a format that the google doc likes.
	if (tempDate !== undefined)
		taskDate = tempDate.charAt(6) + tempDate.charAt(7) + tempDate.charAt(8) + tempDate.charAt(9) + "-" + tempDate.charAt(0) + tempDate.charAt(1) + "-" + tempDate.charAt(3) + tempDate.charAt(4); 
	
	if (taskType !== undefined && taskDate !== undefined && taskID !== undefined && customerID !== undefined) {//If all the necessary variables are defined, send the background page a message.
		chrome.runtime.sendMessage( { messageType: "taskInfo", tType: taskType, tDate: taskDate, tid: taskID, cid: customerID } );
		console.log("task info sent");
	}
}

