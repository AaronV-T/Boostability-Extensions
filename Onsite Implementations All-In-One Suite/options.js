document.addEventListener('DOMContentLoaded', restore_options);
document.getElementById('save').addEventListener('click', save_options);


// Loads options from chrome.storage
function restore_options() {
  chrome.storage.sync.get({
    // Set defaults.
	customerAccountOpenEnabled: true,
    customerSiteOpenEnabled: 2,
	taskFileOpenEnabled: true, 
	customerLoginOpenEnabled: true,
	gwmtOpenEnabled: true,
	gaOpenEnabled: true,
	name: ""
  }, function(items) {
    document.getElementById('customerAccountOpen').checked = items.customerAccountOpenEnabled;
    document.getElementById('customerSiteOpen').value = items.customerSiteOpenEnabled;
	document.getElementById('taskFileOpen').checked = items.taskFileOpenEnabled;
	document.getElementById('customerLoginOpen').checked = items.customerLoginOpenEnabled;
	document.getElementById('gwmtOpen').checked = items.gwmtOpenEnabled;
	document.getElementById('gaOpen').checked = items.gaOpenEnabled;
	document.getElementById('nameText').value = items.name;
	document.getElementById('mainDiv').style.display = "inline";
	document.getElementById('loadingDiv').style.display = "none";
  });
}


// Saves options to chrome.storage
function save_options() {
  var customerAccount = document.getElementById('customerAccountOpen').checked;
  var customerSite = document.getElementById('customerSiteOpen').value;
  var taskFile = document.getElementById('taskFileOpen').checked;
  var customerLogin = document.getElementById('customerLoginOpen').checked;
  var gwmt = document.getElementById('gwmtOpen').checked;
  var ga = document.getElementById('gaOpen').checked;
  var nameText = document.getElementById('nameText').value;
  
	if (customerSite && !isNaN(customerSite) && customerSite >= 0 && customerSite < 5) {
		chrome.storage.sync.set({
			customerAccountOpenEnabled: customerAccount,
			customerSiteOpenEnabled: customerSite,
			taskFileOpenEnabled: taskFile,
			customerLoginOpenEnabled: customerLogin,
			gwmtOpenEnabled: gwmt,
			gaOpenEnabled: ga,
			name: nameText
		}, function() {
			// Update status to let user know options were saved.
			updateStatusText("Options saved.", 750);
		});
	}
	else 
		updateStatusText("Customer Site input not valid, input a number between 0 and 4.", 3000);
}

function updateStatusText(text, displayTime) {
	var status = document.getElementById('status');
	status.textContent = text;
	setTimeout(function() {
		status.textContent = '';
	}, displayTime);
}
