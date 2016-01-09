//Background page for Onsite All In One extension for Google Chrome. Runs behind all pages.

var lpCustomerLookupExtensionID = "ihejmcmpmieakakkpgpepnmekcabgkel";
var loginCredentialsTabID, loginCredentialsURL, loginCredentialsUser, loginCredentialsPass;
var openedTabIDs = new Array();
var previousWorkblockDate;
var previousWorkblockInfo;

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
	if (msg.messageType)
		console.log("Received message: " + msg.messageType);
	else
		console.log ("Received message.");
	if (msg.messageType && msg.messageType == "closeTabs") {
		closeTabs();
	}
	else if (msg.messageType && msg.messageType == "openCustomerAccount" && msg.cid) { //If messageType is openCustomerAccount, create a launchpad tab and send a message to the LP customer lookup extension.
		chrome.storage.sync.get({
			// Set defaults.
			customerAccountOpenEnabled: true
		}, function(items) {
			if(items.customerAccountOpenEnabled) {
				chrome.tabs.create({ "url": "https://launchpad.boostability.com/#/customerservice/customersearch/" + msg.cid }, 
					function(tab){ 
						openedTabIDs.push(tab.id);
						chrome.runtime.sendMessage(lpCustomerLookupExtensionID, { tabID: tab.id, cid: msg.cid } );
						//chrome.runtime.sendMessage("ednpecpamjlbnmpmdhjfpnpechihianb", { tabID: tab.id, cid: msg.cid } ); //Test extension
					}
				);
			}
		});
		
	}
	else if (msg.messageType && (msg.messageType == "openCMS" || msg.messageType == "openHosting") && msg.url) {
		console.log("url: " + msg.url);
		chrome.storage.sync.get({
			// Set defaults.
			customerLoginOpenEnabled: true
		}, function(items) {
			if (items.customerLoginOpenEnabled) {
				if (msg.url && msg.user && msg.password) {
					if (msg.url.indexOf("dev.websiteexperts.com") > -1) //Website experts has issues with full URL, replace with direct URL.
						msg.url = "https://dev.websiteexperts.com";
					if (msg.url.toLowerCase().indexOf("http://") <= -1 && msg.url.toLowerCase().indexOf("https://") <= -1) //If there isn't http or https in the url, add it.
						msg.url = "http://" + msg.url;
					chrome.tabs.create({ "url": msg.url } ,
						function(tab) {
							openedTabIDs.push(tab.id);
							loginCredentialsTabID = tab.id;
							loginCredentialsURL = msg.url;
							loginCredentialsUser = msg.user;
							loginCredentialsPass = msg.password;
						}
					);
				}
				else {
					chrome.tabs.create({ "url": msg.url } ,
						function(tab) {
							openedTabIDs.push(tab.id);
						}
					);
				}
			}
		});
	}
	else if (msg.messageType && msg.messageType == "openCustomerSite" && msg.url) {
		chrome.storage.sync.get({
			// Set defaults.
			customerSiteOpenEnabled: 2
		}, function(items) {
			if (items.customerSiteOpenEnabled >=0 && items.customerSiteOpenEnabled < 5) {
				for(var i = 0; i < items.customerSiteOpenEnabled; i++) {
					chrome.tabs.create({ "url": msg.url } ,
						function(tab) {
							openedTabIDs.push(tab.id);
						}
					);
				}
			}

		});
	}
	else if (msg.messageType && msg.messageType == "openTaskFile" && msg.url) {
		chrome.storage.sync.get({
			taskFileOpenEnabled: true
		}, function(items) {
			if (items.taskFileOpenEnabled) {
				chrome.tabs.create({ "url": msg.url } ,
					function(tab) {
						openedTabIDs.push(tab.id);
					}
				);;
			}
		});
	}
	else if (msg.messageType && msg.messageType == "openGoogleAnalytics") {
		chrome.storage.sync.get({
			gaOpenEnabled: true
		}, function(items) {
			if (items.gaOpenEnabled) {
				chrome.windows.create({"url": "https://accounts.google.com/ServiceLogin?service=analytics&continue=https://www.google.com/analytics/web/?hl%3Den&followup=https://www.google.com/analytics/web/?hl%3Den#identifier", "incognito": true});
			}
		});
	}
	else if (msg.messageType && msg.messageType == "openGoogleWMT") {
		chrome.storage.sync.get({
			gwmtOpenEnabled: true
		}, function(items) {
			if (items.gwmtOpenEnabled) {
				chrome.windows.create({"url": "https://accounts.google.com/ServiceLogin?service=sitemaps&passive=1209600&continue=https%3A%2F%2Fwww.google.com%2Fwebmasters%2Ftools%2F&followup=https%3A%2F%2Fwww.google.com%2Fwebmasters%2Ftools%2F#identifier", "incognito": true});
			}
		});
    }
	else if (msg.messageType && msg.messageType == "savePreviousWorkblockInfo" && msg.pdate && msg.pinfo) {
		previousWorkblockDate = msg.pdate;
		previousWorkblockInfo = msg.pinfo;
		console.log("Prev info: " + previousWorkblockDate + " " + previousWorkblockInfo);
    }
	else if (msg.messageType && msg.messageType == "clearWBInfo") {
		previousWorkblockDate = "";
		previousWorkblockInfo = "";
		console.log("Prev WB info cleared.");
    }
});

chrome.tabs.onRemoved.addListener(function(tabID , info) {
	for (i = 0; i < openedTabIDs.length; i++) {
		if (tabID == openedTabIDs[i])
			openedTabIDs.splice(i, 1);
	}
});


chrome.tabs.onUpdated.addListener(function(tabID , info) {
    if (info.status == "complete" && loginCredentialsTabID !== undefined && loginCredentialsTabID == tabID) {
        checkURLAndSendLoginCredentials();
    }
});

function checkURLAndSendLoginCredentials() {
	console.log("checkURLAndSendLoginCredentials");
	
	var probableLoginType;

	if (loginCredentialsURL.indexOf("wp-admin") > -1 || loginCredentialsURL.indexOf("wp-login") > -1)
		probableLoginType = "wordpress";
	else if (loginCredentialsURL.indexOf("/administrator") > -1)
		probableLoginType = "joomla";
	else if ((loginCredentialsURL.indexOf("/admin") > -1 && loginCredentialsURL.indexOf("/administrator") <= -1) || loginCredentialsURL.indexOf("/user") > -1)
		probableLoginType = "drupal";
	else if (loginCredentialsURL.indexOf("dev.websiteexperts.com") > -1)
		probableLoginType = "devWebsiteExperts";
	else
		probableLoginType = "unknown";

	console.log(probableLoginType + " " + loginCredentialsTabID);	
	if (loginCredentialsTabID && loginCredentialsUser && loginCredentialsPass)
		chrome.tabs.sendMessage(loginCredentialsTabID, { messageType: "loginCredentials", probableType: probableLoginType, user: loginCredentialsUser, password: loginCredentialsPass } );

	loginCredentialsTabID = null;
	loginCredentialsURL = null;
	loginCredentialsUser = null;
	loginCredentialsPass = null;
	/*setTimeout(function() {
	}, 5000);*/

}

function closeTabs() {
	for (i = 0; i < openedTabIDs.length; i++) {
		try {
			chrome.tabs.remove(openedTabIDs[i]); //Close all the tabs opened by this plugin.
		} catch (err) {
			console.log("Failed to close tab ID: " + openedTabIDs[i]);
		}
	}
	openedTabIDs = new Array(); //Clear the array.
}

chrome.extension.onRequest.addListener(function(request, sender, sendResponse) {
    if(request == "is_selected") {
        chrome.tabs.getSelected(null, function(tab){
            if(tab.id == sender.tab.id) {
                sendResponse(true); //in focus (selected)
            } else {
                sendResponse(false);    //not in focus
            }
        });
    }
});