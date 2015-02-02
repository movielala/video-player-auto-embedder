/*globals window, document */
(function (window, document, scriptString, embedderPath) {

	'use strict';

	//Create a script element
	var element = document.createElement(scriptString);

	//Find where the other scripts are
	var others = document.getElementsByTagName(scriptString);

	//Grab one of them
	var other = others[0];

	//Set async for browsers that support it
	element.async = true;

	//Set path for our element
	element.src = embedderPath;

	//Inject our element
	other.parentNode.insertBefore(element, other);

	//Create the lazycaller
	var lazycaller = function () {

		//Push the call to the stack so it can be called later
		lazycaller.stack.push(arguments);
		return;

	};

	//Initialize the stack
	lazycaller.stack = [];

	//Export the lazycaller
	window.mllembed = lazycaller;

}(window, document, 'script', '../mllembed.min.js'));