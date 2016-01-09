var formTabID, accountTabID;

//chrome.contextMenus.create({"title": "Copy TASK (and account) info.", "contexts":["page"], "onclick": copyTaskInfo});
//chrome.contextMenus.create({"title": "Copy SIGNATURE info.", "contexts":["page"], "onclick": copySignatureInfo});
//chrome.contextMenus.create({"title": "Mark as workblock form tab.", "contexts":["page"], "onclick": markFormTab});

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.messageType)
		console.log("MessageReceived: messageType = " + msg.messageType);
	else
		console.log("MessageReceived");
		
	if (msg.messageType && msg.messageType == "taskInfo" && msg.tType && msg.tDate && msg.tid && msg.cid) {
		if (formTabID) {
			chrome.tabs.sendMessage(formTabID, { messageType: "taskInfo", tType: msg.tType, tDate: msg.tDate, tid: msg.tid, cid: msg.cid } );
			
			chrome.tabs.query({}, function(tabs) { //Save all the open tabs to an array.
				for (var i=0; i < tabs.length; ++i) //For each tab in the array
					chrome.tabs.sendMessage(tabs[i].id, { requestType: "accountCheck", cid: msg.cid }); //Send a 
			});
		}
		else 
			alert("Please mark your form tab then retry.");
	}
	else if (msg.messageType && msg.messageType == "accountInfo" && msg.partner && msg.csr)  {
		if (formTabID)
			chrome.tabs.sendMessage(formTabID, { messageType: "accountInfo", partner: msg.partner, csr: msg.csr } );
		else 
			alert("Please mark your form tab then retry.");
	}
	else if (msg.messageType && msg.messageType == "signatureInfo" && msg.tType && msg.cURL && msg.tid) {
		if (formTabID)
			chrome.tabs.sendMessage(formTabID, { messageType: "signatureInfo", tType: msg.tType, cURL: msg.cURL, tid: msg.tid} );
		else 
			alert("Please mark your form tab then retry.");
	}
	else if (msg.messageType && msg.messageType =="markWorkblockTab" && msg.tabID)
		formTabID = msg.tabID;
});



/*function copyAccountInfo(info, tab) {
	if (formTabID)
		chrome.tabs.sendMessage(tab.id, { requestType: "account" } ); //Send a message to the launchpad tab, should be heard by content.js.
	else 
		alert("Please mark your form tab then try again.");
}*/

/*function copyTaskInfo(info, tab) {
	if (formTabID)
		chrome.tabs.sendMessage(tab.id, { requestType: "task" } ); //Send a message to the launchpad tab, should be heard by content.js.
	else 
		alert("Please mark your form tab then try again.");
}

function copySignatureInfo(info, tab) {
	if (formTabID)
		chrome.tabs.sendMessage(tab.id, { requestType: "signature" } ); //Send a message to the launchpad tab, should be heard by content.js.
	else 
		alert("Please mark your form tab then try again.");
}*/

/*function markAccountTab(info, tab) {
	accountTabID = tab.id;
}*/

/*function markFormTab(info, tab) {
	formTabID = tab.id;
}*/