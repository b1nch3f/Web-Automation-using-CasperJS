var casper = require('casper').create();
/*
var casper = require('casper').create({
	pageSettings: {
		userAgent: 'Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/61.0.3163.100 Safari/537.36'
	}
});
*/
var fs = require('fs');

var data;

casper.on('remote.message', function(msg) {
	console.log('remote message is: ' + msg);
})

casper.start('http://www.google.com', function() {
    this.fill('form', {q:'hello world!'}, true);
});
casper.wait(1000, function() {
	data = this.evaluate(function() {
		var targetElements = document.querySelectorAll('.g h3 a');
		var data = [];
		for (var index = 0; index < targetElements.length; index++) {
			var currentEl = targetElements[index];
			var currentLink = currentEl.getAttribute('href');
			var currentTitle = currentEl.text;
			var currentItem = {
				'link': currentLink,
				'title': currentTitle
			}
			data.push(currentItem);
		}
		return data;
	});
});
casper.run(function() {
	fs.write('./output.json', JSON.stringify(data, null, '\t'))
	this.exit();
});
