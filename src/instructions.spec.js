const { expect } = require('chai')
const fs = require('fs')

const {
  tokensArray,
  shouldIgnoreToken,
  tokenWordModifier,
  tokenWrapsModifier,
  wordOffset,
  getTokenMeta,
  instructions
} = require('./instructions')
const { MODIFIERS, MATCH, WRAPS } = require('./constants')

describe('instructions.js', () => {
  describe('tokensArray(text)', () => {
    it(`should split text into an array of words`, () => {
      const text = `should split text into an array of words`
      const result = tokensArray(text)
      expect(result.length).to.equal(15)
    })
    it(`should accept empty params`, () => {
      const text = ``
      const result = tokensArray(text)
      expect(result.length).to.equal(0)
    })
    it(`should not break without param`, () => {
      const result = tokensArray()
      expect(result.length).to.equal(0)
    })
  })
  describe('shouldIgnoreToken(token)', () => {
    it(`should accept words`, () => {
      const word = 'word'
      const result = shouldIgnoreToken(word)
    })
    it(`should ignore spaces`, () => {
      const space = ' '
      const result = shouldIgnoreToken(space)
    })
    it(`should ignore quotes`, () => {
      const quote = '"'
      const result = shouldIgnoreToken(quote)
    })
  })
  describe('tokenWordModifier(word, index)', () => {
    it(`should calculate word delay modifier for short words`, () => {
      const word = 'Word'
      const modifier = tokenWordModifier(word)
      expect(modifier).to.equal(0)
    })
    it(`should return a bigger delay if the word starts a sentence`, () => {
      const word = 'Word'
      const index = 0
      const modifier = tokenWordModifier(word, index)
      expect(modifier).to.equal(0.5)
    })
    it(`should calculate a bigger delay for medium words`, () => {
      const word = 'Bigger'
      const modifier = tokenWordModifier(word)
      expect(modifier).to.equal(0.4)
    })
    it(`should calculate an even bigger delay for long words`, () => {
      const word = 'Enormous'
      const modifier = tokenWordModifier(word)
      expect(modifier).to.equal(0.6)
    })
    it(`should calculate a bigger still delay for even longer words`, () => {
      const word = 'Ridiculous'
      const modifier = tokenWordModifier(word)
      expect(modifier).to.equal(0.8)
    })
    it(`should calculate a bigger still delay for even longer words`, () => {
      const word = 'Preposterous'
      const modifier = tokenWordModifier(word)
      expect(modifier).to.equal(1)
    })
    it(`BUG: this is a problem`, () => {
      const word = 'Supercalifragilisticexpialidocious'
      const modifier = tokenWordModifier(word)
      expect(modifier).to.equal(2)
    })
  })
  describe('tokenWrapsModifier(text)', () => {
    it(`should return an empty wraps object if string contains a word`, () => {
      const text = 'text'
      const result = tokenWrapsModifier(text)
    })
    it(`should create a wraps object for specific tokens`, () => {
      const standardQuote = '"'
      const result = tokenWrapsModifier(standardQuote)
      expect(result.wraps.LEFT).to.equal('"')

      const guillemot = `«»`
      guillemot.match(MATCH.WRAPS).map(q => {
        const { wraps, modifier } = tokenWrapsModifier(q)
        expect(wraps.LEFT).to.equal('«')
        expect(wraps.RIGHT).to.equal('»')
        expect(modifier).to.equal(1.6)
      })

      const doubleQuotes = `“”`
      doubleQuotes.match(MATCH.WRAPS).map(q => {
        const { wraps, modifier } = tokenWrapsModifier(q)
        expect(wraps.LEFT).to.equal('“')
        expect(wraps.RIGHT).to.equal('”')
        expect(modifier).to.equal(1.6)
      })

      const parens = `()`
      parens.match(MATCH.WRAPS).map(p => {
        const { wraps, modifier } = tokenWrapsModifier(p)
        expect(wraps.LEFT).to.equal('(')
        expect(wraps.RIGHT).to.equal(')')
        expect(modifier).to.equal(1.6)
      })
    })
    it(`should match dashes and clauses by default`, () => {
      const tokens = [`—`, `--`, `-`, `–`, `/`, `.`, `!`, `?`, `!?`, `…`, `;`, `:`]
      const results = [ 1.6, 1.6, 1.6, 1.6, 1.6, 2.2, 2.2, 2.2, 2.2, 2.2, 1.6, 1.6 ]
      tokens.map((text, index) => {
        const { modifier } = tokenWrapsModifier(text)
        expect(modifier).to.equal(results[index])
      })
    })
  })
  describe('wordOffset(word)', () => {
    it(`should return optimal offset for word's center alignment`, () => {
      const words = ['a', 'tiny', 'medium', 'prettylong', 'supercalifragilisticexpialidocious']
      const results = [4, 3, 2, 1, 0]
      words.map((word, index) => {
        const result = wordOffset(word)
        expect(result).to.equal(results[index])
      })
    })
  })
  describe('getTokenMeta(text, index)', () => {
    it(`contains no logic - implemented functions are covered`, () => {})
  })
  describe('instructions(text, index)', () => {
    it(`is thoroughly covered in index.spec.js`, () => {})
  })
})
