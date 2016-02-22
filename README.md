# MovieLaLa Video Player Auto Embedder (MLLEmbed)

[![Code Climate](https://codeclimate.com/github/movielala/video-player-auto-embedder/badges/gpa.svg)](https://codeclimate.com/github/movielala/video-player-auto-embedder)

## What is MLLEmbed (mll.embed)

MLLEmbed, or by it's module name `mll.embed`, is a script that turns YouTube embeds into MovieLaLa embeds.
It looks for IFRAMEs and changes their URLs.

For example, this url:
```
http://www.youtube.com/embed/bo36MrBfTk4?autoplay=1
```
will become:
```
http://embed.movielala.com/embed/bo36MrBfTk4?autoplay=1&clientId=YourCompany
```

## Details on Usage Methods

You have four options:

- [Synchronized Usage](https://github.com/movielala/video-player-auto-embedder/wiki/Synchronized-Usage)
- [Asynchronized Usage with MLLEmbed Loader](https://github.com/movielala/video-player-auto-embedder/wiki/Asynchronized-Usage-with-MLLEmbed-Loader)

For Advanced  RequireJS
- [Asynchronized Usage with RequireJS](https://github.com/movielala/video-player-auto-embedder/wiki/Asynchronized-Usage-with-RequireJS)

Compatibilty with Youtube IFrame
- [YouTube IFrame API without MLLEmbed](https://github.com/movielala/video-player-auto-embedder/blob/master/examples/youtube-iframe-api.html)


### Synchronous Loading

```html
//Configuration Cloudflare powered CDN with 50+ POPs
<script src="https://assets-embed.movielala.com/mllembed.min.js"></script>
<script>
//Configuration
mllembed.config('clientId', 'YourCompany');
</script>
```

### Asynchronous Loading

```html
<script>
!function(e, t, n, s) {
    'use strict';
    var c, m = t.createElement(n), a = t.getElementsByTagName(n), r = a[0];
    m.async = !0, m.src = s, r.parentNode.insertBefore(m, r), c = function() {
        c.stack.push(arguments);
    }, c.stack = [], e.mllembed = c;
}(window, document, 'script', 'https://assets-embed.movielala.com/mllembed.min.js');

//Configuration
mllembed('config', 'clientId', 'YourCompany');
</script>
```



### Handling Insertations after DOMContentReady

MLLEmbed automatically runs on `DOMContentReady` and `load`. If you are add iframes after, you can handle them like this:

```javascript
//Append iframe
$('#mycontainer').append('<iframe src="http://www.youtube.com/embed/bo36MrBfTk4"></iframe>');

//Run MLLEmbed
mllembed.run();
```


### With YouTube IFrame API

If you already have a YouTube IFrame API implementation, all you have to do is replace the URL of IFrame API with "https://assets-embed.movielala.com/iframe_api". There is no need to use MLLEmbed.

This is the original youtube loader code:
```html
<script>
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
</script>
```
All you have to do is change the URL:
```html
<script>
var tag = document.createElement('script');
tag.src = "https://assets-embed.movielala.com/iframe_api"; //Changed
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
</script>
```



Please make sure you follow the documentation exactly if you decide not to use recommended techniques.

## How to Build

- Be sure you have Node.js installed.
- Checkout the repository.
- `npm install`.
- `gulp`

## How to Test

No tests yet.
