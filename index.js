var _ = require('underscore');
var marked = require('marked');

/**
 * Expose `gingkoExport()`.
 */

module.exports = gingkoExport;

/**
 * Export Gingko tree to different formats.
 * List of options:
 *
 * - format - output format
 * - cardId - subtree
 * - column - all columns or only specific one
 *
 * @param {Array} cards
 * @param {Object} ops
 * @param {Object} markedOps
 * @return {String}
 */

function gingkoExport(cards, ops, markedOps) {
  if (!ops.format) ops.format = 'html';

  switch (ops.format) {
    case 'txt': return toTxt(cards, ops);
    case 'html': return marked(toTxt(cards, ops), markedOps);
    case 'impress': return toImpress(cards, ops, markedOps);
    default: throw new TypeError(ops.format + ' format is not supported');
  }
}

/**
 * Export to plain text.
 *
 * @param {Array} cards
 * @param {Object} ops
 * @return {String}
 */

function toTxt(cards, ops) {
  return sortCards(cards, ops)
    .map(function(card) { return card.content })
    .join('\n\n');
}

/**
 * Export to impress.js presentation.
 *
 * @param {Array} cards
 * @param {Object} ops
 * @param {Object} markedOps
 * @return {String}
 */

function toImpress(cards, ops, markedOps) {
  var start = '<div class="step">';
  var end = '</div>';

  return sortCards(cards, ops)
    .map(function(card) { return start + marked(card.content, markedOps) + end })
    .join('\n');
}

/**
 * Sort cards by parentId and position
 *
 * @param {Array} cards
 * @param {Object} ops
 * @return {Array}
 */

function sortCards(cards, ops) {
  var groups = _.groupBy(cards, 'parentId');
  var result = [];

  function sortGroup(siblings, column) {
    _.sortBy(siblings, 'position').map(function(card) {
      if (!ops.column || column === ops.column) result.push(card);
      if (groups[card._id]) sortGroup(groups[card._id], column + 1);
    });
  }

  if (ops.cardId) {
    if (!ops.noParent) {
      result = cards.filter(function(card) {
        return card._id.toString() === ops.cardId.toString() });
    }
    sortGroup(groups[ops.cardId], 1);
  } else {
    sortGroup(groups[null], 1);
  }

  return result;
}
