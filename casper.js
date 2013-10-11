var utils = require('utils');
var fs = require('fs');
var casper = require('casper').create({
	verbose: true,
	logLevel: 'error',
	pageSettings: {
	loadImages: false,
	loadPlugins: false
	},
	clientScripts: []
});

var i = 0;
var links = [];
var code_data = [];

// Get Top Level Links
function getCodeLinks () {
	var links = document.querySelectorAll('.dxtl__B0 a');
	return [].map.call(links, function(link) {
		return link.getAttribute('href');
	});
}


// Get Top Level Data, write to json file
function loopThroughCodeLinks() {
	if (i < links.length) {
		this.echo(links[i]);
		getCodeData.call(this, links[i]);
		i++;
		this.run(loopThroughCodeLinks);
	} else {
		utils.dump(code_data);
		console.log('code_data: ' + code_data.length);
		console.log('links: ' + links.length);
		fs.write("miami-code.json", JSON.stringify(code_data), 'w');
		this.exit();
	}
}

function getCodeData(link) {
	this.start(link, function() {


		//if is level2

		if ( link.indexOf("level2") != -1 ) {

			// Page Heading
			var heading = this.fetchText('h2');
			// Content
			var content = this.getHTML('.wrap');

			var data = {
				title: heading,
				url: link,
				content: content
			};

			code_data.push(data);

		}

	});

}

casper.start('http://library.municode.com/toc.aspx?clientId=10620&checks=false', function() {
	links = this.evaluate(getCodeLinks);

	// Slice off .. and convert relative urls
	for (var i = 0; i < links.length; i++) {
		links[i] = "http://library.municode.com/" + links[i];//.slice(2);
	}

});

casper.run(loopThroughCodeLinks);