# MovieLaLa Video Player Auto Embedder (MLLEmbedder)

[![Code Climate](https://codeclimate.com/github/movielala/video-player-auto-embedder/badges/gpa.svg)](https://codeclimate.com/github/movielala/video-player-auto-embedder)
[![Build Status](https://travis-ci.org/movielala/video-player-auto-embedder.svg)](https://travis-ci.org/movielala/video-player-auto-embedder)

## How to Use

Insert this HTML into target file.

```html
<script>
    (function (d, s, p) {
        var e = d.createElement(s);
        e.async = true;
        e.src = p;
        var o = d.getElementsByTagName(s)[0];
        o.parentNode.insertBefore(e, o);
    }(document, 'script', 'path/to/embedder.min.js'));
    var _mlle = {
        clientId: 'SomeCompany',
        some: 'thing'
    };
</script>
```

Every property you put in `_mlle` will be added as a query string for the embeds.

For example, this:
```
http://www.youtube.com/embed/bo36MrBfTk4
```
will become:
```
http://embed.movielala.com/embed/bo36MrBfTk4?clientId=SomeCompany&some=thing
```

## How to Build

- Be sure you have Node.js installed.
- Checkout the repository.
- `npm install`.
- `gulp`

## How to Test

No tests yet.