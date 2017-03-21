# Reading Instructions

NodeJS library for parsing plain text into instructions for a (screen) reader to utilize for playing the text one word at a time. Returns an array of objects with original `text` and `index` along with different properties depending on the type of token it is.

### Object model

```javascript
{
  text: String,       // Plain text for the token - words, space, punctuation, quote, etc.
  index: Number,      // Location within the text
  modifier?: Number,  // Adjust display duration based on word length and position
  wraps?: {
    LEFT: String,     // Quoted or parentheses string of length 1
    RIGHT: String     // Quoted or parentheses string of length 1
  },
  offset?: Number     // Offset x characters from left - for optimal alignment
  ignore?: Boolean,   // A speed reader should ignore spaces, quotes and parens
}
```
