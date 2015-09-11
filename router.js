var Profile = require("./profile.js");
var renderer = require("./renderer.js");
var querystring = require("querystring");


var commonHeader = {'Content-Type': 'text/html'};

// Handle HTTP route GET / and POST / e.g. Home
function home(request, response){
	// if url === "/" && GET
	if (request.url === "/"){
		if (request.method === "GET"){
			// show search field
			response.writeHead(200, commonHeader);
		  	renderer.view("header", {}, response);
		  	renderer.view("search", {}, response);
		  	renderer.view("footer", {}, response);
		  	response.end();
		}
		else {
			// if url === "/" && POST
			// get the post data from body
			request.on('data', function(postBody){
				console.log(postBody.toString());
				// extract the username
				var query = querystring.parse(postBody.toString());
				// redirect to /:username
				response.writeHead(303, {"Location": "/"+query.username});
				response.end();
			})


		}
  }
};

// Handle HTTP route GET /:username e.g. chalkers
function user(request, response){
	// if url === "/...."
	var username = request.url.replace("/", "");
	if (username.length > 0){
		response.writeHead(200, commonHeader);
	  	renderer.view("header", {}, response);

	  	var studentProfile = new Profile(username);
	  	// on end, show profile
	  	studentProfile.on("end", function(profileJSON){
	  		// show profile

	  		// store the values which we need
	  		var values = {
	  			avatarUrl: profileJSON.gravatar_url,
	  			username: profileJSON.profile_name,
	  			badges: profileJSON.badges.length,
	  			javascriptPoints: profileJSON.points['JavaScript']
	  		}
	  		// simple response
			renderer.view("profile", values, response);
	  		renderer.view("footer", {}, response);
	  		response.end();
	  	});

	  	// on error, show error
	  	studentProfile.on("error", function(error){
	  		// show error
	  		renderer.view("error", {errorMessage: error.message}, response);
		  	renderer.view("search", {}, response);
	  		renderer.view("footer", {}, response);
	  		response.end();
	  	});


			
	}
}


module.exports.home = home;
module.exports.user = user;