//casperjs is used, which opens the website in PhantomJS, a headless browser, and scrapes the data.
//The results are saved to a file, and then read by node.

var casper = require('casper').create();
var utils = require('utils');
var fs = require('fs');

//Get working directory
var pwd = require('system').env['PWD'];

var save_suggestions = fs.pathJoin(pwd, 'suggestions.dat');
var save_products = fs.pathJoin(pwd, 'products.dat');

var keyword = casper.cli.args[0];

//Open homepage
casper.start('http://www.flipkart.com/search', function() {
	this.echo('Page loaded.');

	if(!this.exists('#fk-header-search-form #fk-top-search-box')){
    	this.echo('Search form not found!');
    	exit();
	}

	this.sendKeys('#fk-top-search-box', keyword, { keepFocus: true });
	this.page.sendEvent("keydown");
});

//Wait for suggestions to show up.
casper.waitForSelector('.fk-ac-results', function() {
	//The search suggestions should now be loaded.

	var data = this.evaluate(function() {
        var suggestions = [];

		var element = $('.fk-ac-results #list_\\?').find('.header').prevAll().filter(function() { 
          return $(this).data("otracker") != 'as-incategory'; 
        });

        element.each(function(){
            var item = $(this).text().replace(/^\s+|\s+$/g, '');
            suggestions.push(item);
        });

        var popular = [];
        var element = $('.fk-ac-results #list_\\?').find('.header').nextAll();

        element.each(function(){
            var item = {
                price: $(this).find('.title').find('.price').text().replace(/^\s+|\s+$/g, ''),
                title: $(this).find('.title').clone().children('.price').remove().end().text().replace(/^\s+|\s+$/g, ''),
            };
            
            popular.push(item);
        });

	    return {
            suggestions: suggestions,
            popular: popular
        };
	});

	// To take a screenshot,
    // this.captureSelector('suggestions.png', '.fk-ac-results');

    fs.write(save_suggestions, JSON.stringify(data), 'w');

    //Submit the search
	this.evaluate(function() {
		$('#fk-header-search-form .search-bar-submit').trigger('click');
	});
}, function(){
	//timeout

	this.echo('Suggestions timeout.');
	var data = {
            suggestions: [],
            popular: []
        };

	fs.write(save_suggestions, JSON.stringify(data), 'w');

}, 20000);

//One search is clicked, wait for search results page to be loaded.
casper.waitForUrl(/\/search/, function() {

    this.echo('Showing results');
    // this.capture('results.png');

    var products = this.evaluate(function() {
        var products = [];

        var base_url = 'http://www.flipkart.com';

    	$('.results #products .product-unit').each(function(){
    		var product = {
    			image: $(this).find('.fk-product-thumb img').attr('src'),
    			url: base_url + $(this).find('.pu-title a').attr('href').split("?")[0],
    			title: $(this).find('.pu-title a').text().replace(/^\s+|\s+$/g, ''),
    			rating: $(this).find('.pu-rating .fk-stars-small').attr('title'),
    			reviews: $(this).find('.pu-rating').text().replace(/^\s+|\s+$/g, ''),
    			category: $(this).find('.pu-category .category-name').text().replace(/^\s+|\s+$/g, ''),
    			discount: $(this).find('.pu-price .pu-discount').text().replace(/^\s+|\s+$/g, ''),
    			price: $(this).find('.pu-price .pu-final').text().replace(/^\s+|\s+$/g, ''),
    		};

    		products.push(product);
    	});

        return products;
    });

    this.echo(products.length + ' products retrieved.');

    fs.write(save_products, JSON.stringify(products), 'w');
    
}, function(){
//Timeout

	this.echo('Search page timeout.');
	var products = [];
	fs.write(save_products, JSON.stringify(products), 'w');

}, 20000);


casper.run();
