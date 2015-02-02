/*globals define */
//AMD Loader with fallback
//Cleaner version of https://github.com/umdjs/umd/blob/master/amdWeb.js
(function (root, moduleName, factory) {

    'use strict';

    //Check if an AMD module loader is available
    if (typeof define === 'function' && define.amd) {
        //Register the wrapper
        define(moduleName, [], function () {

            //Call the factory
            return factory.apply(root);

        });
    //Export to root (window) otherwise
    } else {

        //Remove dots from the moduleName
        //If we don't, users would have to access it using `window['my.module.name'].method()`
        //Doing this will allow them to use just `mymodulename.method()`
        var exportName = moduleName.replace(/\./g, '');

        root[exportName] = factory.apply(root);

    }

//Module registration
}(this, 'mll.embed', function () {

   'use strict';

    var window = this;
    var document = window.document;
    var lazycaller = window.mllembed;

    //Setup the caller
    //This caller just replicates async loader's `lazyloader()` to bypass the lazy call stack and invoke methods directly
    //For sync loading or AMD loading, you don't have to use `mllembed('method', 'arg', ...)` since `mllembed.method('arg', ...)` will be available
    //README.md has more information on this
    var mllembed = function () {

        //Convert arguments to array
        var args = Array.prototype.slice.call(arguments);

        //Get the method
        var method = args.shift();

        //Call the method
        mllembed[method].apply(null, args);

    };

    //Initialize configuration
    mllembed.configuration = {
        _embedUrl: 'https://embed.movielala.com/embed/',
        _youtubeRegexps: [
            /^https?:\/\/www\.youtube\.com\/embed\/([\w\-]{11})(?:\?(.+)$|$)/,
            /^https?:\/\/www\.youtu\.be\/embed\/([\w\-]{11})(?:\?(.+)$|$)/,
            /^https?:\/\/www\.youtube-nocookie\.com\/embed\/([\w\-]{11})(?:\?(.+)$|$)/
        ]
    };

    //The function that builds the query string
    mllembed.getQueries = function () {

        var list = [],
            i;

        for (i in mllembed.configuration) {
            //Check if the property is not inherited
            if (mllembed.configuration.hasOwnProperty(i)) {
                //Check if it is not private
                if (!i.match(/^\_/)) {
                    list.push(i + '=' + mllembed.configuration[i]);
                }
            }
        }

        return list;

    };

    //The function that gets and sets configuration
    mllembed.config = function (key, value) {

        //Get the old value
        var oldValue = mllembed.configuration[key];

        //Set the value if it's provided
        if (arguments.length !== 1) {
            mllembed.configuration[key] = value;
        }

        //Return the old value
        return oldValue;

    };

    //The function that converts embeds
    mllembed.convert = function convert(element) {

        //Is this a DOM element?
        if (typeof element !== 'object' || !element.tagName) {
            throw new Error('mllembed.convert() expects an IFRAME for its first and only parameter.');
        }

        //Is this DOM node an IFRAME?
        //In HTML, element.tagName is always uppercase, but not in XML so we toUpperCase() it just in case
        //https://developer.mozilla.org/en-US/docs/Web/API/Element.tagName
        if (element.tagName.toUpperCase() !== 'IFRAME') {
            throw new Error('mllembed.convert() expects an IFRAME for its first and only parameter.');
        }

        //Try to match the URL
        var match;
        for (var i = mllembed.configuration._youtubeRegexps.length; i--;) {
            var regexp = mllembed.configuration._youtubeRegexps[i];

            //Try to match
            match = element.src.match(regexp);

            //Did we?
            if (match) {
                break;
            }
        }

        //Did it work?
        if (!match) {
            
            DEBUG && console.info('[mll.embed] Couldn\'t match "' + element.src + '".'); //jshint ignore:line

            return false;
        }

        DEBUG && console.info('[mll.embed] Matched "' + element.src + '".'); //jshint ignore:line

        //Get the video ID
        var videoId = match[1];

        //Get the video queries
        var videoQueries = match[2]?match[2].split('&'):[];

        //Build the query string
        //Using "&amp;" instead of "&" is an HTML thing
        //Since this code isn't being inlined in HTML, we don't have to use "&amp;"
        //http://stackoverflow.com/questions/7261628/xhtml-html-js-syntax-when-do-i-use-amp
        var queryString = videoQueries.concat(mllembed.getQueries()).join('&');

        //Change the source
        element.src = mllembed.configuration._embedUrl + videoId + '?' + queryString;

        return true;

    };

    //The function that looks for embeds to convert them
    mllembed.run = function run() {

        //Look for iframes
        //We need to use lowercase 'iframe' for XML compatibility
        //https://developer.mozilla.org/en-US/docs/Web/API/Element.getElementsByTagName
        var iframes = document.getElementsByTagName('iframe');
        for (var i = iframes.length; i--;) {
            var iframe = iframes[i];

            //Did we check this before?
            if (iframe.getAttribute('data-mllembed-checked')) {
                continue;
            }

            //Now we will check it for sure
            iframe.setAttribute('data-mllembed-checked', true);

            //Let's convert it
            mllembed.convert(iframes[i]);
        }

    };

    //The function that stores callbacks and calls them when we are ready
    //The execution is FIFO
    mllembed.isReady = false;
    var readyCallbacks = [];
    mllembed.ready = function ready(callback) {

        //Is this a valid callback?
        if (typeof callback !== 'function') {
            throw new Error('mllembed.ready() expects a function for its first and only parameter.');
        }

        //Are we ready?
        if (mllembed.isReady) {

            //Then just call it
            callback(mllembed);

            return;

        }

        //Push the callback to the list
        readyCallbacks.push(callback);

    };

    //The function we call when the page is ready
    //We might call it more than once, it's no problem
    var onReady = function onReady() {

        //Mark it
        mllembed.isReady = true;

        //Call the callbacks
        var callback;
        while ((callback = readyCallbacks.shift())) {
            callback(mllembed);
        }

        //We could call `run()` right here, but there will probably be other scripts which inject content on DOMContentLoaded or load.
        //By doing a `setTimeout(func, 0)`, we send our call to the callback queue and let everything on call stack get executed.
        window.setTimeout(mllembed.run, 0);

    };

    //The caller
    /*mllembed.caller = function () {

        //Convert arguments to array
        var args = Array.prototype.slice.call(arguments);

        //Get the method
        var method = args.shift();

        //Call the method
        mllembed[method].apply(null, args);

    };*/

    //Run!
    //Are we ready?
    if (document.readyState === 'complete') {
        onReady();
    //No?
    } else {
        window.addEventListener('load', onReady, false);
        document.addEventListener('DOMContentLoaded', onReady, false);
    }

    //Invoke the calls on the lazycaller stack
    if (typeof lazycaller === 'object' && lazycaller.stack) {
        for (var i = lazycaller.stack.length; i--;) {
            var call = lazycaller.stack[i];

            //Invoke the call
            mllembed.apply(null, call);
        }
    }

    //Export library
    return mllembed;

}));