var maxFeedItems;
if(localStorage["reddit_max_events"]==null) {maxFeedItems=10;}
else {maxFeedItems = parseInt(localStorage["reddit_max_events"]);}
var selected_subreddit = localStorage["reddit_subreddit"];

var req;
var buildPopupAfterResponse = false;
var OnFeedSuccess = null;
var OnFeedFail = null;
var retryMilliseconds = 120000;

function init_options(key, value) {
	if (localStorage[key] == null) {
		localStorage[key] = value;
	}
}

function update_if_ready(force) {
	var lastRefresh = parseFloat(localStorage["reddit_last_refresh"]);
	var interval = parseFloat(localStorage["reddit_request_interval"]);
	var nextRefresh = lastRefresh + interval;
	var curTime = parseFloat((new Date()).getTime());
	var isReady = (curTime > nextRefresh);
	var isNull = (localStorage["reddit_last_refresh"] == null);
	if ((force == true) || (localStorage["reddit_last_refresh"] == null)) {
		update_feed();
	}
	else {
	  if (isReady) {
	    update_feed();
	  }
	}
}

function update_feed() {
  $.ajax({type:'GET', dataType:'xml', url: 'https://www.reddit.com/'+selected_subreddit+'.rss', timeout:5000, success:rss_success, error:feed_err, async: false});
}

function get_num_comments(link) { // get # comments, score 
  var address = "https://www.reddit.com/" + link + ".json?";
  var x = new Array();
    $.ajax({
      url: address,
      dataType: 'json',
      async: false,
      success: function(data) {
        for (var i=0; i<20; i++) {
          x[i] = new Array(2)
          x[i][0] = data.data.children[i].data.num_comments;
          x[i][1] = data.data.children[i].data.score;
        }
      },
      error:feed_err
    });
    return x;
}

function rss_success(doc) {
  if (!doc) {
    rss_parse_err("Not a valid feed.");
    return;
  }
 	links = parse_post_links(doc);
	save_links(links);
	if (buildPopupAfterResponse == true) {
		build_popup(links);
		buildPopupAfterResponse = false;
	}
	localStorage["reddit_last_refresh"] = (new Date()).getTime();
}

function feed_err(xhr, type, error) {
  rss_parse_err('Failed to fetch feed.');
}

function rss_parse_err(error) {
  var feed = document.getElementById("feed");
  feed.className = "error"
  feed.innerText = "Error: " + error;
  localStorage["reddit_last_refresh"] = localStorage["reddit_last_refresh"] + retryMilliseconds;
}

function update_refresh_time() {
  localStorage["reddit_last_refresh"] = (new Date()).getTime();
}

function parse_post_links(doc) {
	var entries = doc.getElementsByTagName('entry');
	if (entries.length == 0) {
	  entries = doc.getElementsByTagName('item');
	}
  var count = Math.min(entries.length, maxFeedItems);
  var links = new Array();
  var num_comments = get_num_comments(localStorage["reddit_subreddit"]);
  for (var i=0; i< count; i++) {
    item = entries.item(i);
    var post_link = new Object();
    // Grab the title
    var itemTitle = item.getElementsByTagName('title')[0];
    if (itemTitle) {
      post_link.Title = itemTitle.textContent;
    } else {
      post_link.Title = "Unknown Title";
    }
    
    // Grab the post link
    var item_description = item.getElementsByTagName('description')[0].textContent;
    var regex = /(?:<a href=")([^<]*?)(?:">)(?=\[link\])/g;
    var link = (regex.exec(item_description))[1]; // grab link from description text w/ regex and convert to dom object
    var xmlString = "<link>" + link + "</link>" // I should make a function for this - parse xml and create node-list object
      , parser = new DOMParser()
      , doc = parser.parseFromString(xmlString, "text/xml");
    itemLink = doc.firstChild;

    if (!itemLink) {
      itemLink = item.getElementsByTagName('link')[0];
    }
    if (itemLink) {
      post_link.Link = itemLink.textContent;
    } else {
      post_link.Link = '';
    }

    // Grab the comments link
    var commentsLink = item.getElementsByTagName('link')[0];
    var commentsLinkText = commentsLink.textContent;
    if (commentsLink) {
      post_link.CommentsLink = commentsLinkText;
    } else {
      post_link.CommentsLink = '';
    }

    post_link.num_comments = num_comments[i][0]; // set number of comments
    post_link.score = num_comments[i][1];

    links.push(post_link);
  }
  return links;
}


function save_links(links) {
	localStorage["reddit_num_links"] = links.length;
	for (var i=0; i<links.length; i++) {
		localStorage["reddit_link" + i] = JSON.stringify(links[i]);
	}
}

function retrieve_links() {
	var numLinks = localStorage["reddit_num_links"];
	if (numLinks == null) {
		return null;
	}
	else {
		var links = new Array();
		for (var i=0; i<numLinks; i++) {
			links.push(JSON.parse(localStorage["reddit_link" + i]))
		}
		return links;
	}
}

function open_options() {
	var optionsUrl = chrome.extension.getURL('options.html');
	chrome.tabs.create({url: optionsUrl});
}

function open_link(e) {
  e.preventDefault();
  // if this.href links to image open in extension, else...
  if(/(jpg|gif|png)$/.test(this.href)) { 
    document.getElementById('posted_image').src=this.href; 
    hide_element("container");
    display_element("image");
  } else {
    open_url(this.href, (localStorage['reddit_background_tabs'] == 'false'));
  }
}

function open_link_front(e) {
	e.preventDefault();
	open_url(this.href, true);
}

// Show url in a new tab.
function open_url(url, take_focus) {
  if (url.indexOf("http:") != 0 && url.indexOf("https:") != 0) {
    return;
  }
  chrome.tabs.create({url: url, selected: take_focus});
}
	
function hide_element(id) {
	var e = document.getElementById(id);
	e.style.display = 'none';
}

function display_element(id) {
	var e = document.getElementById(id);
	e.style.display = 'block';
}

function toggle(id) {
	var e = document.getElementById(id);
	if(e.style.display == 'block')
		e.style.display = 'none';
	else
		e.style.display = 'block';
}
