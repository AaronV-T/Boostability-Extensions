//Content page for the Launchpad Customer Lookup extension for Google Chrome. Injected into Google spreadsheets web pages.

$(document).keydown(function(e){
	if (e.which == 70 && e.ctrlKey && e.altKey) { //If ctrl+alt+f was pressed.
		var focused = document.activeElement
		var focusedText = focused.innerHTML;
		//console.log(focusedText);
		
		if (focusedText.indexOf("<br><br>") > -1) //If this is the case, a cell is selected but the cursor is not inside of it. Get the text from the top input.
			focusedText = getTopInputText();
		
		focusedText = trimBreaks(focusedText);
		
		console.log("Find customer: " + focusedText);
		if (focusedText.length > 0)
			chrome.runtime.sendMessage( { messageType: "openAccount", cid: focusedText } );
	}
	
});

function getTopInputText() {
	var cellInputs = document.getElementsByClassName("cell-input");
	return cellInputs[0].innerHTML;
}

function trimBreaks(receivedText) { //Removes <br> tags from around our desired text.
	while (receivedText.indexOf("<br>") > -1) {
		if (receivedText.indexOf("<br>") == 0)
			receivedText = receivedText.substr(4);
		else 
			receivedText = receivedText.substr(0, receivedText.indexOf("<br>"));
	}
	return receivedText;
}
