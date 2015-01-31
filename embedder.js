/*jslint nomen: true, regexp: true, vars: true */
/*globals window, document, _mlle */
(function (window, document, _mlle) {

    'use strict';

    //Setup MLLE
    var mllembedder = {
        configuration: _mlle || {},
        _youtubeRegexp: /^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com(?:\/embed\/|\/v\/|\/watch\?v=|\/watch\?.+&v=))([\w\-]{11})(?:.+)?$/
    };

    //The function that builds the query string
    mllembedder.buildQueryString = function () {

        var list = [],
            i;

        for (i in mllembedder.configuration) {
            if (mllembedder.configuration.hasOwnProperty(i)) {
                list.push(i + '=' + mllembedder.configuration[i]);
            }
        }

        return '?' + list.join('&');

    };

    //The function that converts embeds
    mllembedder.convert = function (element) {

        //Is this an iframe?
        if (typeof element !== 'object' || !element.tagName || element.tagName !== 'IFRAME') {
            throw 'mllembedder.convert() expects an IFRAME for its first parameter.';
        }

        //Match the URL
        var match = element.src.match(mllembedder._youtubeRegexp);

        //Did it work?
        if (!match) {
            return false;
        }

        //Get the video ID

        var videoId = match[1];

        //Change the source
        element.src = 'https://embed.movielala.com/embed/' + videoId + mllembedder.buildQueryString();

        return true;

    };

    //The function that hunts for embeds to convert them
    mllembedder.hunt = function () {

        //Look for iframes
        var iframes = document.getElementsByTagName('iframe');
        for (var i = iframes.length; i--;) {
            var iframe = iframes[i];

            //Did we hunt this before?
            if (iframe.getAttribute('data-mllembedder-hunted')) {
                continue;
            }

            //Now we hunted it for sure
            iframe.setAttribute('data-mllembedder-hunted', true);

            //Let's convert it
            mllembedder.convert(iframes[i]);
        }

    };

    //The function we call when the page is ready
    //We might call it more than once, it's no problem
    var onReady = function () {

        /*
        We could call `hunt()` right here, but there will probably be other scripts which inject content on DOMContentLoaded or load.
        By doing a `setTimeout(func, 0)`, we send our call to the callback queue and let everything on call stack get executed.
        */
        window.setTimeout(mllembedder.hunt, 0);

    };

    //The function that starts the magic
    var run = function () {

        //Are we ready?
        if (document.readyState === 'complete') {
            onReady();
        //No?
        } else {
            window.addEventListener('load', onReady, false);
            document.addEventListener('DOMContentLoaded', onReady, false);
        }

    };

    //Run!
    run();

    //Export library to window
    window.mllembedder = mllembedder;

}(window, document, _mlle));