module.exports = function (app) {
	"use strict";

	// All other routes should redirect to the index.html
	app.route('/*')
		.get(function(req, res) {
			res.sendFile(app.get('appPath') + '/index.html');
		});
};