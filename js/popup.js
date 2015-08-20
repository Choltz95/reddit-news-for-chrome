window.onload = function(){
  main();
  init_events();
};
function init_events() {
  $('.ref').click(refresh_links);
  $('#searchbox').keypress(search_on_enter);
  $('.opt').click(function(){
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

// draw popup
function build_popup(links) {
  var header = document.getElementById("header");
  var feed = document.getElementById("feed");
  var issueLink = document.getElementsByClassName("issue");
  if(localStorage["reddit_subreddit"]=="") { $("#subreddit").text("Front Page"); $("#subreddit").attr('href',"http://reddit.com"); }
  else { $("#subreddit").text(localStorage["reddit_subreddit"]); $("#subreddit").attr('href', "http://reddit.com" + localStorage["reddit_subreddit"]); }

  for(var i=0;i<issueLink.length;i++){
    issueLink[i].addEventListener("click", open_link_front);
  }

  //Setup Title Link
  var title = document.getElementById("title");
  title.addEventListener("click", open_link);
  var subreddit = document.getElementById("subreddit");
  subreddit.addEventListener("click", open_link);
  
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
      if(/(.jpg|.gif|.png)$/.test(post_link.Link) || /(imgur)/.test(this.href) && !/a/.test(this.href) && !/gallery/.test(this.href)) { 
        post_link.Title = "<font color=\"orange\"> * </font>" + post_link.Title;
      }
      if(localStorage["reddit_upvotes"] == "true") {
        title.innerHTML =  "(" + post_link.score + ") " + post_link.Title;
      } else {
        title.innerHTML =  post_link.Title;
      }
      title.href = post_link.Link;
      title.addEventListener("click", open_link);
    var comments = document.createElement("a");
      comments.className = "comments";
      comments.innerText =  post_link.num_comments + " comments";
      comments.href = post_link.CommentsLink;
      comments.addEventListener("click", open_link);
    link_col.appendChild(title);
    link_col.appendChild(comments);
    row.appendChild(num);
    row.appendChild(link_col)
    feed.appendChild(row);
  }
  hide_element("spinner");
  hide_element("image");
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