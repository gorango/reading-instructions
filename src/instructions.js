
const { instructions, tokensArray } = require('./utils')

/**
 * Generate instructions for displaying a given string of text in an automated reader
 * NOTE: This function doesn't split text into sentences or paragraphs. The onus is on the user.
 *
 * @param  {String} sentence    any old string
 * @return {Array}              array of Token objects
 *
 * Token = {
 *   text: String,       // Plain text for the token - words, space, punctuation, quote, etc.
 *   index: Number,      // Location within the text
 *   modifier: Number,   // Adjust display duration based on word length and position
 *   wraps: {
 *     LEFT: String,     // Quoted or parentheses string of length 1
 *     RIGHT: String     // Quoted or parentheses string of length 1
 *   },
 *   offset: Number      // Offset x characters from left - for optimal alignment
 *   ignore: Boolean,    // A speed reader should ignore spaces, quotes and parens
 * }
 */
const getInstructions = sentence => {
  // keet track of the word wraps in order to update words nested in parens or quotes.
  let wraps = {}
  // keep track of additional word delay modifiers to update later words (following ignored tokens)
  // first word in the text should start with an automatic delay.
  let modifier = 0.5
  let usedModifier = false
  // split text into an array of tokens (words, spaces, quotes, ...)
  return tokensArray(sentence)
    .map((token, index) => {
      if (token.length > 13) {
        const result = []
        const dashIdx = token.indexOf('-')
        if (dashIdx > 0 && dashIdx < token.length - 1) {
          result.push(token.substr(0, dashIdx))
          result.push(token.substr(dashIdx + 1))
          return getInstructions(result.join('- '))
          // NOTE: Remember to rejoin dashed strings if displaying in a long format
          // .reduce((arr, obj) => {
          //   if (arr.length) {
          //     const {text} = arr[arr.length - 1]
          //     if (text[text.length - 1] === '-') {
          //
          //     }
          //   }
          // }, []))
        // } else {
        }
        let partitions = Math.ceil(token.length / 8)
        const partitionLength = Math.ceil(token.length / partitions)
        while (partitions--) {
          result.push(token.substr(0, partitionLength))
          token = token.substr(partitionLength)
        }
        return getInstructions(result.join('- ')).filter(({ ignore }) => !ignore)
      }
      const { text, offset, ignore, modifier: newModifier, wraps: newWraps } = instructions(token, index)

      // If wraps are declared, assign appropriate value to our local variable
      if (Object.keys(newWraps).length) {
        // Because standard quotes (") are the same on both ends, we need to toggle them.
        // This approach is applied to all wraps for consistency (even though we can detect for others)
        // Simply check if they've already been initialized and close them.
        // BUG: runs into issues with nested quotes -- rare occurence but it happens
        if (!Object.keys(wraps).length) {
          wraps = newWraps
        } else {
          wraps = {}
        }
      }

      // transfer modifiers nested in quotes and parentheses
      // if a modifier was passed to a paren or quote token, update our local varaible
      if (ignore) {
        if (modifier + 1 < newModifier) {
          modifier = newModifier - 1
        }
      } else {
        // we are on a word with its own modifier
        modifier = modifier + newModifier
        usedModifier = true
      }

      // Result objects based on the type of token:
      const result = ignore
        // - if the token is a space, paren, puntuation or quotation:
        ? { text, ignore, index }
        // - if the token is a word:
        : { text, modifier, wraps, offset, index }

      // reset our local values for tracking delay modifiers
      if (usedModifier) { modifier = 0; usedModifier = false }

      return result
    })
    .reduce((arr, token) => Array.isArray(token)
      ? [...arr, ...token]
      : [...arr, token], [])
    .map((token, i) => Object.assign({}, token, { index: i }))
}

module.exports = getInstructions
