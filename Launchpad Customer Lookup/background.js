//Background page for Launchpad Customer Lookup extension for Google Chrome. Runs behind all pages.

var customerID = "";
//var selectedText = "";
var lookupURL = "https://launchpad.boostability.com/#/customerservice/customersearch/";
var customerIDLength = 6;

chrome.contextMenus.create({"title": "Lookup customer: %s", "contexts":["selection"], "onclick": lookUpFromSelection}); //Create a contextMenu for highlighted text.


function lookUpFromMessage(receivedText) {
	receivedText = escapeHTML(receivedText); //Make text HTML safe.
	customerID = receivedText;
	
	if (isValidInput(customerID)) { //If the input is a number of correct length...
		chrome.tabs.onUpdated.addListener(checkStatusAndSendMessage); //Have checkStatusAndSendMessage be called every time a tab updates.
		
		chrome.tabs.create({"url": lookupURL + customerID}); //Create a new tab that loads lookupURL.
	}
	else //Else, the input is not a number and/or not of correct length.
		alert ("Input is not a valid customer number.");
}

function lookUpFromSelection(info, tab) {
	var selectedText = info.selectionText;
	selectedText = trimSelection(selectedText); //Check if there are parts of the beginning of the selection that need to be trimmed.
	selectedText = escapeHTML(selectedText); //Make text HTML safe.
	customerID = selectedText;
	
	if (isValidInput(customerID)) { //If the input is a number of correct length...
		chrome.tabs.onUpdated.addListener(checkStatusAndSendMessage); //Have checkStatusAndSendMessage be called every time a tab updates.
		
		chrome.tabs.create({"url": lookupURL + customerID}); //Create a new tab that loads lookupURL.
	}
	else //Else, the input is not a number and/or not of correct length.
		alert ("Input is not a valid customer number.");
}

function checkStatusAndSendMessage(tabId, changeInfo, tab) { //Checks tab status. If complete: Send message to the tab with selectedText.
	if (changeInfo.status == 'complete') {
		chrome.tabs.sendMessage(tabId, { messageType: "lookupCustomer", cid: customerID } ); //Send a message to the updated tab, should be heard by content.js.
		chrome.tabs.onUpdated.removeListener(checkStatusAndSendMessage);
		//How can we remove the listener if there is an error loading the page?
	}
}

function escapeHTML(text) { //Converts text to an HTML safe string by replacing dangerous characters and returns the safe string..
	text = text.replace(/&/g, "&amp;")
    text = text.replace(/</g, "&lt;")
	text = text.replace(/>/g, "&gt;")
	text = text.replace(/"/g, "&quot;")
	text = text.replace(/'/g, "&#039;");
	return text;
}

function isValidInput(text) {
	return (text.length == customerIDLength && !isNaN(text)); //Returns true if text is correct amount of characters and if it is a number.
}

function trimSelection(text) {
	if (text !== undefined && text.substring(0,2) == "Id")
		text = text.substring(3);
		
	return text;
}

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.messageType && msg.messageType == "openAccount" && msg.cid) 
		lookUpFromMessage(msg.cid);
    
});

chrome.runtime.onMessageExternal.addListener(function(msg, sender, sendResponse) {
	console.log("Message received from external extension!");

    if (msg.tabID && msg.cid) {
		setTimeout(function() {
			console.log("Sending message to look up customer: " + msg.tabID);		
			chrome.tabs.sendMessage(msg.tabID, { messageType: "lookupCustomer", cid: msg.cid } );
		}, 5000);	
		
	}
  });
