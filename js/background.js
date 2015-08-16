var firstRequest = true;
function init_request() {
	update_if_ready(firstRequest);
	firstRequest = false;
	window.setTimeout(init_request, 60000);
}
//If any options are not already set, they will be set to defaults here
init_options("reddit_request_interval", 1200000);
init_options("reddit_background_tabs", false);
init_options("reddit_max_events", 10);
init_options("reddit_subreddit", "");

init_request();