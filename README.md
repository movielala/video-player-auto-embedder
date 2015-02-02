# MovieLaLa Video Player Auto Embedder (MLLEmbed)

[![Code Climate](https://codeclimate.com/github/movielala/video-player-auto-embedder/badges/gpa.svg)](https://codeclimate.com/github/movielala/video-player-auto-embedder)
[![Build Status](https://travis-ci.org/movielala/video-player-auto-embedder.svg)](https://travis-ci.org/movielala/video-player-auto-embedder)

## What is MLLEmbed (mll.embed)

MLLEmbed, or by it's module name `mll.embed`, is a script that turns YouTube embeds into MovieLaLa embeds.
It looks for IFRAMEs and converts their URLs.

For example, this:
```
http://www.youtube.com/embed/bo36MrBfTk4?autoplay=1
```
will become:
```
http://embed.movielala.com/embed/bo36MrBfTk4?autoplay=1&clientId=SomeCompany&some=thing
```

## How to Use

MLLEmbed gives you three options here:

1- Asynchronized loading with `mllembed-loader`.
2- Asynchronized loading with RequireJS and alike.
3- Synchronized loading.

The first method is a little bit different so please make sure you have followed the documentation if you decide to use others.

### Asynchronized with `mllembed-loader`

[Link to Example](/examples/async-with-loader.html)

```html
<script>
    !function(e, t, n, s) {
        "use strict";
        var c, a = t.createElement(n), m = t.getElementsByTagName(n), r = m[0];
        a.async = !0, a.src = s, r.parentNode.insertBefore(a, r), c = function() {
            c.stack.push(arguments);
        }, c.stack = [], e.mllembed = c;
    }(window, document, "script", "../mllembed.js");

    /*
        This example is different than sync and async-with-requirejs because it uses mllembed-loader and it's lazycaller.

        All calls made here (like "mllembed('config', ...);" and "mllembed('ready', ...);") are not actually run
            and are pushed to lazycaller's stack. When mllembed is loaded, it looks for the "lazycaller.stack" array
            and executes every call stored in it.

        By doing this, we can fake these calls and make them look sync.
    */

    //Configuration
    mllembed('config', 'clientId', 'SomeCompany');
    mllembed('config', 'something', 'else');

    //Calling the API
    mllembed('ready', function (mllembed) {

        //Add a new iframe
        $('<iframe width="640" height="360" src="https://www.youtube.com/embed/zf_cb_Nw5zY?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>')
            .appendTo('body');

        //Run the automatic converter manually so it finds the iframe above
        mllembed.run();

        //Add another iframe
        var iframe = $('<iframe width="640" height="360" src="https://www.youtube-nocookie.com/embed/_cLvpJY2deo?showinfo=0" frameborder="0" allowfullscreen></iframe>')
            .appendTo('body');

        //Ask mllembed to convert the inserted iframe
        mllembed.convert(iframe[0]);

    });
</script>
```


### Asynchronized with RequireJS

[Link to Example](/examples/async-with-requirejs.html)

Since MLLEmbed is a named module, you won't be able to load it using it's path.

```javascript
//Wrong:
require(['path/to/mllembed.min.js'], function (mllembed) {
    //mllembed is undefined!
});

//Correct:
require.config({
    paths: {
        'mll.embed': 'path/to/mllembed.min.js'
    }
});

//Don't care about using the API?
require(['mll.embed']);

//Want to use the API?
require(['jquery', 'mll.embed', function ($, mllembed) {

    //Configure
    mllembed.config('clientId', 'SomeCompany');
    mllembed.config('something', 'else');

    mllembed.ready(function () {

        //Add a new iframe
        $('<iframe width="640" height="360" src="https://www.youtube.com/embed/zf_cb_Nw5zY?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>')
            .appendTo('body');

        //Run the automatic converter manually so it finds the iframe above
        mllembed.run();

        //Add another iframe
        var iframe = $('<iframe width="640" height="360" src="https://www.youtube-nocookie.com/embed/_cLvpJY2deo?showinfo=0" frameborder="0" allowfullscreen></iframe>')
            .appendTo('body');

        //Ask mllembed to convert the inserted iframe
        mllembed.convert(iframe[0]);

    });

}]);
```

### Synchronized

[Link to Example](/examples/sync.html)

```html
<script src="path/to/embed.js"></script>
<script>
    //Configure
    mllembed.config('clientId', 'SomeCompany');
    mllembed.config('something', 'else');

    mllembed.ready(function (mllembed) {

        //Add a new iframe
        $('<iframe width="640" height="360" src="https://www.youtube.com/embed/zf_cb_Nw5zY?rel=0&amp;controls=0&amp;showinfo=0" frameborder="0" allowfullscreen></iframe>')
            .appendTo('body');

        //Run the automatic converter manually
        mllembed.run();

        //Add another
        var iframe = $('<iframe width="640" height="360" src="https://www.youtube-nocookie.com/embed/_cLvpJY2deo?showinfo=0" frameborder="0" allowfullscreen></iframe>')
            .appendTo('body');

        //Convert an element manually
        mllembed.convert(iframe[0]);

    });
</script>
```

## How to Build

- Be sure you have Node.js installed.
- Checkout the repository.
- `npm install`.
- `gulp`

## How to Test

No tests yet.