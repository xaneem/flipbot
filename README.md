# Flipbot - Keyword Analysis for Flipkart

Analyze a search keyword on [Flipkart.com]('http://www.flipkart.com'). Shows the keyword suggestions, popular products shown during search, and the top products in the search results page.

If you're competing for keywords, this will help you learn more about your competition. More metrics work in progress.

## Demo
A hosted version of this tool is available on [ClusterDev](http://cloud.clusterdev.com:3003/search.html).

## Behind the scenes
This uses CasperJS which opens the website using the headless browser PhantomJS, and writes the results to a file. The frontend is powered by Node.js/Express. It requests a new search, reads the generated file and displays results.

##License
MIT License
