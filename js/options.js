/*
var i;
console.log("local storage");
for (i = 0; i < localStorage.length; i++)   {
    console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
}
*/

$(function(){
  restore_options();
  $('.background-tabs-radio, #RequestInterval, #number_events').change(function(){
    save_options();
  });
});
var selectMaxEvents;
var selectReqInterval;
var radioBackgroundTabs;

function init_variables() {
  selectMaxEvents = document.getElementById("number_events");
  selectReqInterval = document.getElementById("RequestInterval");
  radioBackgroundTabs = document.getElementsByName("BackgroundTabs");
}

function restore_options() {
  init_variables();
  var events = localStorage["reddit_max_events"];
  for (var i=0; i<selectMaxEvents.children.length; i++) {
    if (selectMaxEvents[i].value == events) {
      selectMaxEvents[i].selected = "true";
      break;
    }
  }  
  var reqInterval = localStorage["reddit_request_interval"];
  for (var i=0; i<selectReqInterval.children.length; i++) {
    if (selectReqInterval[i].value == reqInterval) {
      selectReqInterval[i].selected = "true";
      break;
    }
  }
  var backgroundTabs = localStorage["reddit_background_tabs"];
  for (var i=0; i<radioBackgroundTabs.length; i++) {
    if (radioBackgroundTabs[i].value == backgroundTabs) {
      radioBackgroundTabs[i].checked = "true";
    }
  }
}

function save_options() {
  var stories = selectMaxEvents.children[selectMaxEvents.selectedIndex].value;
  localStorage["reddit_max_events"] = stories;

  var interval = selectReqInterval.children[selectReqInterval.selectedIndex].value;
  localStorage["reddit_request_interval"] = interval;

  for (var i=0; i<radioBackgroundTabs.length; i++) {
    if (radioBackgroundTabs[i].checked) {
      localStorage["reddit_background_tabs"] = radioBackgroundTabs[i].value;
      break;
    }
  }
}
