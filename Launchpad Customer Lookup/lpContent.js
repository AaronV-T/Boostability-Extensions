//Content page for the Launchpad Customer Lookup extension for Google Chrome. Injected into Launchpad web pages.

var inputElementIDText = "header-search";
var FOCUS_ATTEMPT_MAX = 120;
var CLICK_ATTEMPT_MAX = 30;

console.log("lpContent.js injected.");

/* Listen for messages */
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	console.log("hello");
	if (msg.messageType)
		console.log("MessageReceived: " + msg.messageType + " cid: " + msg.cid);
	else
		console.log("MessageReceived");
		
	if (msg.messageType && msg.messageType === "lookupCustomer" && msg.cid) { //If a message is sent to lookup a customer.
		var inputElement = document.getElementById(inputElementIDText);
		if (inputElement) { //If an input element was found: Set its value to the message text.
			inputElement.value = msg.cid;

			setTimeout(function() { //Try to focus the input element after 0.25 seconds.
				focusElement(inputElement, 1);
			}, 250);
		}
		else {
			alert("Error: Cannot focus input, input element not found!");
			return;
		}
		
		setTimeout(function() { //Try to find and click customer button after one second.
			searchButtonClick(msg.cid, 1);
		}, 500);	
		
		setTimeout(function() { //Try to find and click customer button after one second.
			accountButtonClick(msg.cid, 1);
		}, 1000);		
    }
	
});

/*$(document).keydown(function(e){ //Add a keydown listener on the page.
	if (e.which == 70 && e.ctrlKey && e.altKey) { //If ctrl+alt+f was pressed.
		var selectedText = getSelectionText();
		console.log(selectedText);
		
		if (selectedText !== undefined && selectedText.substring(0,2) == "Id") //If the first 2 characters are "Id", trim them.
			selectedText = selectedText.substring(3);
		
		console.log("Find customer: " + selectedText);
		if (selectedText.length > 0)
			chrome.runtime.sendMessage( { messageType: "openAccount", cid: selectedText } );
	}
	
});*/

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
        text = window.getSelection().toString();
    } else if (document.selection && document.selection.type != "Control") {
        text = document.selection.createRange().text;
    }
    return text;
}

function accountButtonClick(cid, attemptNum) {
	var buttons = document.getElementsByTagName("button");
	var customerButton;
	console.log("accountButtonClick attempt: " + attemptNum + "(" + CLICK_ATTEMPT_MAX + ")");
	if (buttons.length > 0 ){
		for (i = 0; i < buttons.length; i++) {
			if (buttons[i].innerHTML.indexOf("CustomerId") > -1 && buttons[i].innerHTML.indexOf(cid) > -1) 
				customerButton = buttons[i];
		}
	}
	
	if (customerButton !== undefined) {
		customerButton.click();
		console.log("Clicking button to go to customer account.");
	}
	else if (attemptNum < CLICK_ATTEMPT_MAX) {
		setTimeout(function() {
			accountButtonClick(cid, attemptNum + 1);
		}, 1000);
	}
	
}

function focusElement(iElement, attemptNum) {
	//console.log("focusElement attempt: " + attemptNum + "(" + FOCUS_ATTEMPT_MAX + ")");
	iElement.focus();
	if (iElement !== document.activeElement && attemptNum < FOCUS_ATTEMPT_MAX) {
		setTimeout(function() {
			focusElement(iElement, attemptNum + 1);
		}, 250);
	}	
}

function searchButtonClick(cid, attemptNum) {
	var buttons = document.getElementsByTagName("button");
	var searchButton;
	console.log("searchButtonClick attempt: " + attemptNum + "(" + CLICK_ATTEMPT_MAX + ")");
	if (buttons.length > 0 ){
		for (i = 0; i < buttons.length; i++) {
			if (buttons[i].outerHTML.indexOf("btn btn-primary") > -1 && buttons[i].innerHTML.indexOf("Search") > -1) 
				searchButton = buttons[i];
		}
	}
	
	if (searchButton !== undefined) {
		searchButton.click();
		console.log("Clicking button to go to search.");
	}
	else if (attemptNum < CLICK_ATTEMPT_MAX) {
		setTimeout(function() {
			searchButtonClick(cid, attemptNum + 1);
		}, 1000);
	}
	
}

