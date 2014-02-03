# Gingko Export

  Export Gingko tree to specific format.
  Available as component and node module.

## Example

```js
var gingkoExport = require('gingko-export');
var cards = app.get('cards').toJSON();

var html = gingkoExport(cards, { format: 'html' });
console.log(html); // cards in html format
```

## API

### gingkoExport(cards, options, markedOptions)

  `cards` is an array ob objects.
  Available `options`:

  - **format**(required) - txt, html, impress
  - **column** - all columns or only specific one
  - **cardId** - export subtree

***

  Use `markedOptions` to pass specific options
  for [marked](https://github.com/gingkoapp/marked).
