/* eslint-env mocha */
import { expect } from 'chai'

import getInstructions from './instructions'
import { WRAPS } from './constants'

describe('instructions.js', () => {
  describe('getInstructions(text)', () => {
    it('should parse a plain sentence', () => {
      const text = `Here is a regular old sentence.`
      const result = getInstructions(text)
      expect(result.length).to.equal(11)
      // 'here' - short word but starts a sentence (so its modifier shouldn't be === 1)
      expect(result[0].text).to.equal(`Here`)
      expect(result[0].modifier).to.equal(1.7)
      // 'old' - short word should not have a modifier > 1
      expect(result[8].modifier).to.equal(1)
      // eslint-disable-next-line
      expect(result[8].wraps).to.be.empty
    })
    it('should parse a parenthesized sentence', () => {
      const text = `Here's a sentence (parenthesized half way) just because.`
      const result = getInstructions(text)
      expect(result.length).to.equal(17)
      // ensure parenthesized word is parenthesized
      expect(result[7].text).to.equal(`parenthesized`)
      expect(result[7].wraps).to.equal(WRAPS.PARENS)
      // ensure plain word is not parenthesized
      expect(result[14].text).to.equal(`just`)
      // eslint-disable-next-line
      expect(result[14].wraps).to.be.empty
      expect(result[14].modifier).to.equal(1.8)
    })
    it('should parse a quoted sentence', () => {
      const text = `Here's another "but with quotes" this time.`
      const result = getInstructions(text)
      expect(result.length).to.equal(15)
      // ensure quoted word is quoted
      expect(result[5].text).to.equal(`but`)
      expect(result[5].wraps).to.equal(WRAPS.STANDARD_QUOTE)
      // ensure plain word is not quoted
      expect(result[12].text).to.equal(`this`)
      // eslint-disable-next-line
      expect(result[12].wraps).to.be.empty
      expect(result[12].modifier).to.equal(1.8)
    })
    it('BUG: screws up nested quotes', () => {
      const text = `"Nested (parens) suck" am I right?`
      const result = getInstructions(text)
      // 'Nested' will be quoted - GOOD
      expect(result[1].wraps.LEFT).to.equal('"')
      // 'parens' will not be quoted or parenthesized - BAD
      // eslint-disable-next-line
      expect(result[4].wraps).to.be.empty
      // 'suck' will be parenthesized... - WTF!
      expect(result[7].wraps.LEFT).to.equal('(')
    })
    it('should handle nested quotes')
    it('should split long words', () => {
      const text = 'Supercalifragilisticexpialidocious expedition-huntressodeums.'
      const result = getInstructions(text)
      expect(result.length).to.equal(10)
    })
  })
})
