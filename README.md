# Reading Instructions

JS utility for parsing plain text into instructions for an automated reader.

## Usage

NOTE: sentence splitting is up to the user. This is intentional in order to avoid redundancies in implementation.

Install reading instructions from npm

```shell
npm i --save reading-instructions
```

Import and call:

```javascript
import getInstructions from 'reading-instructions'

const sentence = `This is going to be awesome!`
console.log(getInstructions(sentence))
```

`getInstructions` splits the text into words, spaces, punctuation, quotes, and parentheses; and assign various properties - optimal alignment, display duration, whether text is nested within quotes or parentheses, and whether text should be ignored by a screen reader.

The results will contain an array of tokens with the following model:

```javascript
{
  text: String,       // plain text for the token - words, space, punctuation, quote, etc.
  index: Number,      // location within the text
  modifier?: Number,  // optimal display duration based on word length and position
  wraps?: {
    LEFT: String,     // quoted or parentheses string of length 1
    RIGHT: String     // quoted or parentheses string of length 1
  },
  offset?: Number     // offset x characters from left - for optimal alignment
  ignore?: Boolean,   // speed readers should ignore spaces, quotes and parens
}
```

## Testing

```bash
npm run test
```

Watch your `src` file while [Mocha](https://github.com/mochajs/mocha) runs tests with [Babel](https://github.com/babel/babel) for latest syntax and [Standard](https://github.com/feross/standard) for linting.

#### Coverage with [nyc](https://github.com/istanbuljs/nyc)

```bash
npm run coverage
```

#### Pending Tests:

- [ ] should handle nested quotes
- [ ] should split (and hyphenate) long words
