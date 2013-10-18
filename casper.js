var utils = require('utils'),
	fs = require('fs'),
	casper = require('casper').create({
		verbose: true,
		logLevel: 'error',
		pageSettings: {
		loadImages: false,
		loadPlugins: false
		},
		clientScripts: []
	});

var i = 0,
	links = [],
	code_data = [];

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
		//utils.dump(code_data);
		console.log('code_data: ' + code_data.length);
		console.log('links: ' + links.length);
		fs.write("miami-code.txt", code_data, 'w');
		this.exit();
	}
}

function getCodeData(link) {
	this.start(link, function() {


		//if is level2

		if ( link.indexOf('level2') != -1 ) {

				// Page Heading
			var heading = this.fetchText('h2').replace(/\s(?=\s)/g,'').trim() + '\r',
				// Content
				content = heading + this.fetchText('.wrap p').replace(/\s(?=\s)/g,'').replace(/\\"/,'&quot;').trim() + '\n\n';

				// data = {
				// 	title: heading,
				// 	url: link,
				// 	content: content
				// };
				
			console.log(content);
			code_data.push(content);
		}

	});

}

casper.start('http://library.municode.com/toc.aspx?clientId=10620&checks=false', function() {
	links = this.evaluate(getCodeLinks);

	// convert relative urls
	for (var i = 0; i < links.length; i++) {
		links[i] = "http://library.municode.com/" + links[i];
	}

});

casper.run(loopThroughCodeLinks);