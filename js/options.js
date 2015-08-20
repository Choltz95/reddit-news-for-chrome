/* DEBUG
var i;
console.log("local storage");
for (i = 0; i < localStorage.length; i++)   {
    console.log(localStorage.key(i) + "=[" + localStorage.getItem(localStorage.key(i)) + "]");
}
*/

$(function(){
  restore_options();
  $('.background-tabs-radio, #RequestInterval, #number_events, #subreddit, .upvotes-radio, #custom_subreddit').change(function(){
    save_options();
  });
});

var selectSubreddit;
var selectMaxEvents;
var selectReqInterval;
var radioBackgroundTabs;
var radioUpvotes;

function init_variables() {
  selectSubreddit = document.getElementById("subreddit");
  selectMaxEvents = document.getElementById("number_events");
  selectReqInterval = document.getElementById("RequestInterval");
  radioBackgroundTabs = document.getElementsByName("BackgroundTabs");
  radioUpvotes = document.getElementsByName("upvotes");
}

function restore_options() {
  init_variables();
  var sub = localStorage["reddit_subreddit"];
  for (var i=0; i<selectSubreddit.children.length; i++) {
    if (selectSubreddit[i].value == sub) {
      selectSubreddit[i].selected = "true";
      break;
    }
  }  
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
  var upvotes = localStorage["reddit_upvotes"];
  for (var i=0; i<radioUpvotes.length; i++) {
    if (radioUpvotes[i].value == upvotes) {
      radioUpvotes[i].checked = "true";
    }
  }
}

function save_options() {
  var subred = selectSubreddit.children[selectSubreddit.selectedIndex].value;
  if (subred) {
    document.getElementsByName("custom_subreddit")[0].style.display='none';
    localStorage["reddit_subreddit"] = subred;
  } else{
    document.getElementsByName("custom_subreddit")[0].style.display='inline';
    localStorage["reddit_subreddit"] = document.getElementsByName("custom_subreddit")[0].value;
  }

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

  for (var i=0; i<radioUpvotes.length; i++) {
    if (radioUpvotes[i].checked) {
      localStorage["reddit_upvotes"] = radioUpvotes[i].value;
      break;
    }
  }
}