var express = require("express"),
    app = express(),
    bodyParser = require('body-parser'),
    errorHandler = require('errorhandler'),
    methodOverride = require('method-override'),
    hostname = process.env.HOSTNAME || 'localhost',
    port = parseInt(process.env.PORT, 10) || 3003,
    publicDir = process.argv[2] || __dirname + '/public';


var exec = require('child_process').exec;
var fs = require('fs');

//Show homepage
app.get("/", function (req, res) {
  res.redirect("/index.html");
});

//Search page
app.get("/search/", function (req, res) {
  res.redirect("/search.html");
});

//Search API for AJAX
app.get('/search/:keyword', function(req, res) {

	var keyword = req.params.keyword;
	var child = exec('casperjs ../flipkart.js ' + keyword, function(error, stdout, stderr) {
		console.log(stdout);

		if (error !== null) {
			console.log('An error occured: ' + error);
			res.json({"result": "fail"});		
		}else{
			var suggestions = JSON.parse(fs.readFileSync(__dirname + '/suggestions.dat','utf8'));
			var products = JSON.parse(fs.readFileSync(__dirname + '/products.dat','utf8'));

			res.json({
					"result": "success",
					"keyword" : req.params.keyword,
					"popular" : suggestions.popular,
					"suggestions"  : suggestions.suggestions,
					"products" : products,
					});			
		}

	});

	
});

app.use(methodOverride());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static(publicDir));
app.use(errorHandler({
  dumpExceptions: true,
  showStack: true
}));

console.log("Server showing %s listening at http://%s:%s", publicDir, hostname, port);
app.listen(port);
