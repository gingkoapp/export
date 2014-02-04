describe('export', function() {
  var _ = require('underscore');
  var expect = require('chai').expect;
  var result, cards, gingkoExport;

  try {
    gingkoExport = require('./');
  } catch (err) {
    gingkoExport = require('gingko-export');
  }

  beforeEach(function() {
    cards = _.shuffle([
      { _id: 1, content: '# Async Javascript',             position: 1, parentId: null },
      { _id: 3, content: '## Javascript Web Applications', position: 1, parentId: 1 },
      { _id: 5, content: '### Javascript. The Good Parts', position: 1, parentId: 3 },
      { _id: 6, content: '### Javascript Patterns',        position: 2, parentId: 3 },
      { _id: 4, content: '## jQuery in Action',            position: 2, parentId: 1 },
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
    expect(result).length(cards.length);
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
