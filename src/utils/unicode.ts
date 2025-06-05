// Special characters definitions
export const specialCharacters: Record<string, { name: string; category: string }> = {
  '\u200B': { name: 'ZERO WIDTH SPACE', category: 'Invisible Separator' },
  '\u200C': { name: 'ZERO WIDTH NON-JOINER', category: 'Invisible Separator' },
  '\u200D': { name: 'ZERO WIDTH JOINER', category: 'Invisible Separator' },
  '\uFEFF': { name: 'ZERO WIDTH NO-BREAK SPACE (BOM)', category: 'Invisible Separator' },
  // Add more special characters as needed...
};

// Decoding strategies
export const decodingStrategies = [
  {
    name: "Surrogate Pair Tag Character Decoder",
    description: "Decodes surrogate pairs that represent Unicode tag characters",
    decode: (text: string) => {
      const surrogatePairsPattern = /(?:56128|U\+DB40|\\uDB40)(?:\|U\+DB40)?[\s\|]+(?:56[34][0-9]{2}|U\+DC[0-7][0-9A-F]|\\uDC[0-7][0-9A-Fa-f])\|?(?:U\+DC[0-7][0-9A-F])?/g;
      const matches = Array.from(text.matchAll(surrogatePairsPattern));

      if (matches.length > 0) {
        const message = matches
          .map(match => {
            const dcMatch = match[0].match(/DC([0-7][0-9A-Fa-f])/i);
            if (dcMatch) {
              const asciiCode = parseInt(dcMatch[1], 16);
              return String.fromCharCode(asciiCode);
            }
            return '';
          })
          .join('');

        return {
          found: true,
          message,
          details: `Decoded ${matches.length} surrogate pairs representing Unicode tag characters.`
        };
      }

      return { found: false };
    }
  },
  // Add more decoding strategies as needed...
];

// Encoding functions
export function encodeMessage(message: string, method: string): string {
  switch (method) {
    case 'tag_chars':
      return encodeWithTagChars(message);
    case 'surrogate_pairs_notation':
      return encodeWithSurrogatePairNotation(message);
    case 'actual_surrogates':
      return encodeWithActualSurrogates(message);
    case 'decorated':
      return encodeWithDecoration(message);
    default:
      return 'ERROR: Invalid encoding method';
  }
}

function encodeWithTagChars(message: string): string {
  return message
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if (code < 128) {
        return `U+E0${code.toString(16).padStart(2, '0').toUpperCase()}`;
      }
      return char;
    })
    .join(' ');
}

function encodeWithSurrogatePairNotation(message: string): string {
  return message
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if (code < 128) {
        const lowSurrogateHex = code.toString(16).padStart(2, '0').toUpperCase();
        return `56128|U+DB40 56${lowSurrogateHex}|U+DC${lowSurrogateHex}`;
      }
      return char;
    })
    .join(' ');
}

function encodeWithActualSurrogates(message: string): string {
  return message
    .split('')
    .map(char => {
      const code = char.charCodeAt(0);
      if (code < 128) {
        const highSurrogate = String.fromCharCode(0xDB40);
        const lowSurrogate = String.fromCharCode(0xDC00 + code);
        return highSurrogate + lowSurrogate;
      }
      return char;
    })
    .join('');
}

function encodeWithDecoration(message: string): string {
  const surrogateEncoded = encodeWithActualSurrogates(message);
  return `⊰•-✧-•⦑${surrogateEncoded}⦒•-✧-•⊱`;
}