//Content page for the Onsite All-In-One extension for Google Chrome. Injected into all pages.
console.log("loginCredentials.js");

/* Listen for messages */
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.messageType)
		console.log("MessageReceived: messageType = " + msg.messageType);
	else
		console.log("MessageReceived");
		
	if (msg.messageType && msg.messageType == "loginCredentials" && msg.probableType && msg.user && msg.password)
		inputLoginCredentials(msg.probableType, msg.user, msg.password);

});


function inputLoginCredentials(type, user, password) {
	//Do nothing: squarespace, wix, godaddy, 
	var unknownIdentified = false;
	password = password.trim();
	
	if (type === "wordpress" || (type === "unknown" && !unknownIdentified) ) {
		if (document.getElementById("user_login")) {
			document.getElementById("user_login").value = user;
			unknownIdentified = true;
		}
		if (document.getElementById("user_pass"))
			document.getElementById("user_pass").value = password;
	}
	
	if (type === "joomla" || (type === "unknown" && !unknownIdentified) ) {
		if (document.getElementById("mod-login-username")) {
			document.getElementById("mod-login-username").value = user;
			unknownIdentified = true;
		}
		else if (document.getElementById("modlgn_username")) {
			document.getElementById("modlgn_username").value = user;
			unknownIdentified = true;
		}
		if (document.getElementById("mod-login-password"))
			document.getElementById("mod-login-password").value = password;
		else if (document.getElementById("modlgn_passwd"))
			document.getElementById("modlgn_passwd").value = password;
	}
	
	if (type === "drupal" || (type === "unknown" && !unknownIdentified) ) {
		if (document.getElementById("edit-name")) {
			document.getElementById("edit-name").value = user;
			unknownIdentified = true;
		}
		if (document.getElementById("edit-pass"))
			document.getElementById("edit-pass").value = password;
	}
	
	if (type === "devWebsiteExperts" || (type === "unknown" && !unknownIdentified) ) {
		if (document.getElementById("email_id")) {
			document.getElementById("email_id").value = user;
			unknownIdentified = true;
		}
		if (document.getElementsByName("login_password")[0])
			document.getElementsByName("login_password")[0].value = password;
	}
	
	
	if (!unknownIdentified) {
		console.log("Unknown type not identified, trying...");
		var userInputFound = false
		var passwordInputFound = false;
		var inputElements = document.getElementsByTagName("input");
		var passwordInputIndex = 0;
		
		for (i = 0; i < inputElements.length; i++) {
			/*if (inputElements[i].outerHTML.toLowerCase().indexOf("type=\"text\"") > - 1 && inputElements[i].outerHTML.toLowerCase().indexOf("username") > - 1 && !userInputFound) {
				inputElements[i].value = user;
				userInputFound = true;
			}
			else if (inputElements[i].outerHTML.toLowerCase().indexOf("type=\"text\"") > - 1 && inputElements[i].outerHTML.toLowerCase().indexOf("email") > - 1 && !userInputFound) {
				inputElements[i].value = user;
				userInputFound = true;
			}*/

			if (inputElements[i].outerHTML.toLowerCase().indexOf("type=\"password\"") > - 1 && !passwordInputFound) {
				inputElements[i].value = password;
				passwordInputFound = true;
				passwordInputIndex = i;
			}
		}
		
		if (!userInputFound && passwordInputFound && inputElements[passwordInputIndex - 1].outerHTML.toLowerCase().indexOf("type=\"text\"") > - 1)
			inputElements[passwordInputIndex - 1].value = user;
	}
}