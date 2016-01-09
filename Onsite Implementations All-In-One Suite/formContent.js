//Content page for the Launchpad to Workblock Easy Copy extension for Google Chrome. Injected into google docs webpages.

/* Listen for messages */
chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	console.log("MessageReceived");
	if (msg.messageType && msg.messageType == "taskInfo" && msg.tType && msg.tDate && msg.tid && msg.cid) {
		document.getElementById("entry_1305263973").value = msg.cid; 
		document.getElementById("entry_1096636141").value = msg.tid;
		document.getElementById("entry_1313147484").value = msg.tType;
		document.getElementById("entry_1579312546").value = msg.tDate;
    }
	else if (msg.messageType && msg.messageType == "accountInfo" && msg.partner && msg.csr) {
		document.getElementById("entry_1921014440").value = msg.csr; 
		document.getElementById("entry_368265656").value = msg.partner;

    }
	else if (msg.messageType && msg.messageType == "signatureInfo" && msg.tType && msg.cURL && msg.tid) {
		chrome.storage.sync.get({
			name: ""
		}, function(items) {
			if (items.name) {
				var signature;
				if (msg.tid !== "OCT")
					signature = "-" + items.name + " (Task Info: " + msg.tType + " --- " + msg.cURL + " --- " + msg.tid + ")";
				else
					signature = "-" + items.name + " (Task Info: " + msg.tType + " --- " + msg.cURL + ")";
				
				var element = document.getElementsByTagName("textarea")[0];
				
				var elementValue = element.value;
				elementValue += signature;
				element.value = elementValue;
			}
		});
		
    }
	
});

