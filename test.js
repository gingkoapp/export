var _ = require('underscore');
var expect = require('chai').expect;
var gingkoExport = require('./index');

describe('export', function() {
  var result, cards;

  beforeEach(function() {
    cards = _.shuffle([
      { _id: 1, content: '# Async Javascript',             position: 1, parentId: null },
      { _id: 3, content: '## Javascript Web Applications', position: 1, parentId: 1 },
      { _id: 5, content: '### Javascript. The Good Parts', position: 1, parentId: 3 },
      { _id: 6, content: '### Javascript Patterns',        position: 2, parentId: 3 },
      { _id: 4, content: '## jQuery in Action',            position: 2, parentId: 1 },
      { _id: 9, content: '## Deleted book',                position: 3, parentId: 1, deleted: true },
      { _id: 0, content: '### Unhappy child',              position: 1, parentId: 9 },
      { _id: 7, content: '### Professional Javascript',    position: 1, parentId: 4 },
      { _id: 2, content: '# Node.js in action',            position: 2, parentId: null },
      { _id: 8, content: '## Web Performance Daybook',     position: 1, parentId: 2 },
    ]);
  });

  it('throws error when format is not specified', function() {
    expect(function() {
      gingkoExport(cards, { format: 'md' });
    }).throw(/md format/);
    expect(function() { gingkoExport(cards) }).throw(/format/);
  });

  it('to text', function() {
    result = gingkoExport(cards, { format: 'txt' }).split('\n\n');
    expect(result[0]).equal('# Async Javascript');
    expect(result).length(cards.length - 2);
  });

  it('to html', function() {
    result = gingkoExport(cards, { format: 'html' });
    expect(result).contain('<h1 id="node.js-in-action">Node.js in action</h1>');
    expect(result).contain('<h3 id="professional-javascript">Professional Javascript</h3>');
  });

  it('to impress', function() {
    result = gingkoExport(cards, { format: 'impress' });
    expect(result).contain('<div class="step"><h3 id="professional-javascript">Professional Javascript');
  });

  it('to json', function() {
    result = gingkoExport(cards, { format: 'json', column: 1 });
    expect(result).eql([
      { content: '# Async Javascript' },
      { content: '# Node.js in action' }
    ]);

    result = gingkoExport(cards, { format: 'json', cardId: 3 });
    expect(result).eql([{
      content: '## Javascript Web Applications',
      children: [
        { content: '### Javascript. The Good Parts' },
        { content: '### Javascript Patterns' }
      ]
    }]);

    result = gingkoExport(cards, { format: 'json', column: 4 });
    expect(result).eql([]);
  });

  it('filter by `column`', function() {
    result = gingkoExport(cards, { format: 'txt', column: 3 });
    expect(result.split('\n\n')).eql(['### Javascript. The Good Parts',
      '### Javascript Patterns', '### Professional Javascript']);

    result = gingkoExport(cards, { format: 'txt', column: 1 });
    expect(result.split('\n\n')).eql(['# Async Javascript', '# Node.js in action']);
  });

  it('filter by `cardId`', function() {
    result = gingkoExport(cards, { format: 'txt', cardId: 2 });
    expect(result.split('\n\n')).eql(['# Node.js in action', '## Web Performance Daybook']);

    result = gingkoExport(cards, { format: 'txt', cardId: 3 });
    expect(result.split('\n\n')).eql(['## Javascript Web Applications',
      '### Javascript. The Good Parts', '### Javascript Patterns']);

    result = gingkoExport(cards, { format: 'txt', cardId: 100 });
    expect(result).eql('');
  });
});
