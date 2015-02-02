/*globals define */
if (typeof DEBUG === 'undefined') DEBUG = false; //jshint ignore:line
//AMD Loader with fallback
//Cleaner version of https://github.com/umdjs/umd/blob/master/amdWeb.js
(function (root, moduleName, factory) {

    'use strict';

    //Check if an AMD module loader is available
    if (typeof define === 'function' && define.amd) {
        //Register the wrapper
        define(moduleName, [], function () {

            //Call the factory
            return factory.apply(root, [true]);

        });
    //Export to root (window) otherwise
    } else {

        //Remove dots from the moduleName
        //If we don't, users would have to access it using `window['my.module.name'].method()`
        //Doing this will allow them to use just `mymodulename.method()`
        var exportName = moduleName.replace(/\./g, '');

        root[exportName] = factory.apply(root, [false]);

    }

//Module registration
}(this, 'mll.embed', function (amd) {

   'use strict';

    var window = this;
    var document = window.document;

    DEBUG && console.info('[mll.embed] Factory called.'); //jshint ignore:line

    //Setup the caller
    //This caller just replicates async loader's `lazyloader()` to bypass the lazy call stack and invoke methods directly
    //For sync loading or AMD loading, you don't have to use `mllembed('method', 'arg', ...)` since `mllembed.method('arg', ...)` will be available
    //README.md has more information on this
    var mllembed = function () {

        //Convert arguments to array
        var args = Array.prototype.slice.call(arguments);

        //Get the method
        var method = args.shift();

        DEBUG && console.info('[mll.embed] Got lazycaller call for "' + method + '()".', args); //jshint ignore:line

        //Call the method
        mllembed[method].apply(null, args);

    };

    //Initialize configuration
    var configuration = {
        _autorun: !amd,
        _embedUrl: 'https://embed.movielala.com/embed/',
        _youtubeRegexps: [
            /^https?:\/\/www\.youtube\.com\/embed\/([\w\-]{11})(?:\?(.+)$|$)/,
            /^https?:\/\/www\.youtu\.be\/embed\/([\w\-]{11})(?:\?(.+)$|$)/,
            /^https?:\/\/www\.youtube-nocookie\.com\/embed\/([\w\-]{11})(?:\?(.+)$|$)/
        ]
    };

    //The function that builds the query string
    var getQueries = function () {

        var list = [],
            i;

        for (i in configuration) {
            //Check if the property is not inherited
            if (configuration.hasOwnProperty(i)) {
                //Check if it is not private
                if (!i.match(/^\_/)) {
                    list.push(i + '=' + configuration[i]);
                }
            }
        }

        return list;

    };

    //The function that gets and sets configuration
    mllembed.config = function (key, value) {

        //Get the old value
        var oldValue = configuration[key];

        //Set the value if it's provided
        if (arguments.length !== 1) {
            configuration[key] = value;
        }

        DEBUG && console.info('[mll.embed] Configuration "' + key + '"=>"' + value + '" (was "' + oldValue + '") done.'); //jshint ignore:line

        //Return the old value
        return oldValue;

    };

    //The function that converts embeds
    var convert = function convert(element) {

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
        for (var i = configuration._youtubeRegexps.length; i--;) {
            var regexp = configuration._youtubeRegexps[i];

            //Try to match
            match = element.src.match(regexp);

            //Did we?
            if (match) {
                break;
            }
        }

        //Did it work?
        if (!match) {
            
            DEBUG && console.info('[mll.embed] Converter couldn\'t match "' + element.src + '".'); //jshint ignore:line

            return false;
        }

        DEBUG && console.info('[mll.embed] Converter matched "' + element.src + '".'); //jshint ignore:line

        //Get the video ID
        var videoId = match[1];

        //Get the video queries
        var videoQueries = match[2]?match[2].split('&'):[];

        //Build the query string
        //Using "&amp;" instead of "&" is an HTML thing
        //Since this code isn't being inlined in HTML, we don't have to use "&amp;"
        //http://stackoverflow.com/questions/7261628/xhtml-html-js-syntax-when-do-i-use-amp
        var queryString = videoQueries.concat(getQueries()).join('&');

        //Change the source
        element.src = configuration._embedUrl + videoId + '?' + queryString;

        DEBUG && console.info('[mll.embed] Converted to "' + element.src + '".'); //jshint ignore:line

        return true;

    };

    //The function that looks for embeds to convert them
    mllembed.run = function run(element) {

        //Was an element specified?
        if (arguments.length !== 0) {
            //Convert a single element
            return convert(element);
        }

        DEBUG && console.info('[mll.embed] Running...'); //jshint ignore:line

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
            convert(iframes[i]);
        }

        DEBUG && console.info('[mll.embed] Ran.'); //jshint ignore:line

    };

    //The function that stores callbacks and calls them when we are ready
    //The execution is FIFO
    var isReady = false;
    var readyCallbacks = [];
    mllembed.ready = function ready(callback) {

        //Was an callback specified?
        if (arguments.length === 0) {
            //Return the ready status
            return isReady;
        }

        //Is this a valid callback?
        if (typeof callback !== 'function') {
            throw new Error('mllembed.ready() expects a function for its first and only parameter.');
        }

        //Are we ready?
        if (isReady) {

            DEBUG && console.info('[mll.embed] Calling "ready()" callback directly...'); //jshint ignore:line

            //Then just call it
            callback(mllembed);

            return;

        }

        DEBUG && console.info('[mll.embed] Pushing "ready()" callback to the list...'); //jshint ignore:line

        //Push the callback to the list
        readyCallbacks.push(callback);

    };

    //The function we call when the page is ready
    //We might call it more than once, it's no problem
    var onReady = function onReady() {

        DEBUG && console.info('[mll.embed] "onReady()" got called.'); //jshint ignore:line

        //Mark it
        isReady = true;

        //Call the callbacks
        var callback;
        while ((callback = readyCallbacks.shift())) {
            DEBUG && console.info('[mll.embed] Calling "ready()" callback late...'); //jshint ignore:line

            callback(mllembed);
        }

        //Should we autorun?
        if (!mllembed.config('_autorun')) {
            return;
        }

        //We could call `run()` right here, but there will probably be other scripts which inject content on DOMContentLoaded or load.
        //By doing a `setTimeout(func, 0)`, we send our call to the callback queue and let everything on call stack get executed.
        window.setTimeout(mllembed.run, 0);

    };

    //Detect the lazycaller
    if (typeof window.mllembed === 'function' && window.mllembed.stack) {
        //Store the lazycaller
        var lazycaller = window.mllembed;

        //Swap it with mllembed
        window.mllembed = mllembed;

        //Invoke the calls on the lazycaller stack
        DEBUG && console.info('[mll.embed] Emptying lazycaller stack...'); //jshint ignore:line

        for (var i = lazycaller.stack.length; i--;) {
            var call = lazycaller.stack[i];

            //Invoke the call
            mllembed.apply(null, call);
        }
    }

    //Run!
    //Are we ready?
    if (document.readyState === 'complete') {
        DEBUG && console.info('[mll.embed] Document is ready.'); //jshint ignore:line

        onReady();
    //No?
    } else {
        DEBUG && console.info('[mll.embed] Document is not ready.'); //jshint ignore:line

        window.addEventListener('load', onReady, false);
        document.addEventListener('DOMContentLoaded', onReady, false);
    }

    //Export library
    return mllembed;

}));