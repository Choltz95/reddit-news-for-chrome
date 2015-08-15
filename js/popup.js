window.onload = function(){
  main();
  init_events();
};
function init_events() {
  $('#submitLink').click(submit_cur_tab);
  $('#refresh').click(refresh_links);
  $('#searchbox').keypress(search_on_enter);
  $('#options').click(function(){
    open_options();
  });
}
function main() {
  if (localStorage['reddit_num_links'] == null) {
    buildPopupAfterResponse = true;
    update_if_ready();
  }
  else {
    build_popup(retrieve_links());
  }
}

function build_popup(links) {
  var header = document.getElementById("header");
  var feed = document.getElementById("feed");
  var issueLink = document.getElementById("issues");
  issueLink.addEventListener("click", open_link_front);

  //Setup Title Link
  var title = document.getElementById("title");
  title.addEventListener("click", open_link);
  
  //Setup search button
  var searchButton = document.getElementById("searchbutton");
  searchButton.addEventListener("click", search);

  for (var i=0; i<links.length; i++) {
    post_link = links[i];
    var row = document.createElement("tr");
    row.className = "link";
    var num = document.createElement("td");
    num.innerText = i+1;
    var link_col = document.createElement("td")
    var title = document.createElement("a");
      title.className = "link_title";
      title.innerText = post_link.Title;
      title.href = post_link.Link;
      title.addEventListener("click", open_link);
    var comments = document.createElement("a");
      comments.className = "comments";
      comments.innerText = "(comments)";
      comments.href = post_link.CommentsLink;
      comments.addEventListener("click", open_link);
    link_col.appendChild(title);
    link_col.appendChild(comments);
    row.appendChild(num);
    row.appendChild(link_col)
    feed.appendChild(row);
  }
  hide_element("spinner");
  display_element("container");
}

function search_on_enter(e) {
  if (e.keyCode == 13) {
    search();
  }
}

function search() {
  var searchBox = document.getElementById("searchbox");
  var keywords = searchBox.value;
  if (keywords.length > 0) {
    var search_url = "https://www.reddit.com/search?q=" + keywords.replace(" ", "+") + "&sort=relevance&t=all";
    open_url(search_url, true);
  }
}

function refresh_links() {
  var linkTable = document.getElementById("feed");
  while(linkTable.hasChildNodes()) linkTable.removeChild(linkTable.firstChild); //Remove all current links
  toggle("container");
  toggle("spinner");
  buildPopupAfterResponse = true;
  update_feed();
  update_refresh_time();
}

//Submit the current tab - not functional
function submit_cur_tab() {
  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
        var reddit_submit = "https://www.reddit.com/submit";
        var submit_url = tabs[0].url;
        var submit_title = tabs[0].title;
        var win=  window.open(reddit_submit, '_blank');
        win.focus();
      }
  );
}

