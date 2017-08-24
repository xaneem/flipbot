# Flipbot - Keyword Analysis for Flipkart

Analyze a search keyword on [Flipkart.com]('http://www.flipkart.com'). Shows the keyword suggestions, popular products shown during search, and the top products in the search results page.

If you're competing for keywords, this will help you learn more about your competition. More metrics work in progress.

Note that this tool is still a work-in-progress, and is not guaranteed to work for your purpose. If you need a more reliable method, take a look at a wrapper for the Flipkart API [here](https://github.com/xaneem/flipkart-api-php).

## Demo
A hosted version of this tool is available on [ClusterDev](http://cloud.clusterdev.com:3003/search.html).

## Behind the scenes
This uses CasperJS which opens the website using the headless browser PhantomJS, and writes the results to a file. The frontend is powered by Node.js/Express. It requests a new search, reads the generated file and displays results.

## License
MIT License
