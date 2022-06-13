'use strict';

/**
 * Required modules.
 */
const query = require('./query'),
    Logger = require('winston'),
    log = Logger.log;

/**
 * Gets all the questions on the site or returns the questions identified in [ids].
 *
 * @param {Object} criteria
 * @param {Array} ids collection of IDs
 * @api public
 */
function questions(criteria, ids) {
  ids = ids || [];
  return query('questions/' + ids.join(';'), criteria);
}

/**
 * Gets the answers to a set of questions identified in [ids].
 *
 * @param {Object} criteria
 * @param {Number} id collection of IDs
* @api public
*/
function answers(criteria, id) {
  if (!id)
    return console.error('questions.answers lacks IDs to query');
  return query('questions/' + `${id}` + '/answers', criteria);
}

// Expose commands.
module.exports.questions = questions;
module.exports.answers = answers;
