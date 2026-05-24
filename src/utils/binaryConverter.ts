import { BinarySeparator, ByteRepresentation, PresetSample } from '../types';

/**
 * Encodes text into UTF-8 bytes.
 */
export function textToBytes(text: string): Uint8Array {
  try {
    const encoder = new TextEncoder();
    return encoder.encode(text);
  } catch (e) {
    return new Uint8Array();
  }
}

/**
 * Decodes UTF-8 bytes back into text.
 */
export function bytesToText(bytes: Uint8Array): string {
  try {
    const decoder = new TextDecoder('utf-8', { fatal: false });
    return decoder.decode(bytes);
  } catch (e) {
    return '';
  }
}

/**
 * Converts a byte array into a formatted binary string.
 */
export function bytesToBinary(bytes: Uint8Array, separator: BinarySeparator): string {
  const binarySegments = Array.from(bytes).map(byte => {
    return byte.toString(2).padStart(8, '0');
  });

  const sepChar = separator === 'none' ? '' : separator;
  return binarySegments.join(sepChar);
}

/**
 * Parses a binary string into a byte array, detecting error offsets.
 */
export function binaryToBytes(binary: string): { bytes: Uint8Array; errors: string[] } {
  const errors: string[] = [];
  if (!binary.trim()) {
    return { bytes: new Uint8Array(), errors };
  }

  // Identify any non-binary or non-separator characters
  const segmentPattern = /[^01\s,\-]/g;
  if (segmentPattern.test(binary)) {
    errors.push("Le texte contient des caractères qui ne sont ni des bits (0/1) ni des séparateurs autorisés (espace, virgule, tiret).");
  }

  // Tokenize the string.
  // Replace symbols/separators with whitespace so we can easily split.
  const cleaned = binary.replace(/[\s,\-]+/g, ' ').trim();
  
  let tokens: string[] = [];
  
  if (!cleaned) {
    return { bytes: new Uint8Array(), errors };
  }

  if (!binary.includes(' ') && !binary.includes(',') && !binary.includes('-')) {
    // Solid block of binary digits, let's group by 8.
    const cleanNumbersOnly = binary.replace(/[^01]/g, '');
    for (let i = 0; i < cleanNumbersOnly.length; i += 8) {
      tokens.push(cleanNumbersOnly.substring(i, i + 8));
    }
    
    // Warn if the last group is truncated
    if (cleanNumbersOnly.length % 8 !== 0) {
      errors.push(`Le dernier bloc est incomplet (${cleanNumbersOnly.length % 8} bits au lieu de 8).`);
    }
  } else {
    // Separator present
    tokens = cleaned.split(' ');
  }

  const byteList: number[] = [];
  
  tokens.forEach((token, index) => {
    if (token.length === 0) return;

    // Check if contains non-binary
    if (/[^01]/.test(token)) {
      errors.push(`Le groupe n°${index + 1} ("${token}") contient des caractères non autorisés.`);
      return;
    }

    // Check width
    if (token.length > 8) {
      // Split into 8-bit pieces
      for (let i = 0; i < token.length; i += 8) {
        const sub = token.substring(i, i + 8);
        const val = parseInt(sub, 2);
        if (!isNaN(val)) {
          byteList.push(val);
        }
      }
      errors.push(`Le groupe n°${index + 1} dépasse 8 bits (${token.length} bits). Il a été segmenté.`);
    } else {
      if (token.length < 8) {
        // Pad left with zeros silently or note it
        const padded = token.padStart(8, '0');
        const val = parseInt(padded, 2);
        byteList.push(val);
      } else {
        const val = parseInt(token, 2);
        byteList.push(val);
      }
    }
  });

  return {
    bytes: new Uint8Array(byteList),
    errors: Array.from(new Set(errors)) // Deduplicate errors
  };
}

/**
 * Generates an array of individual representations for each byte.
 */
export function getBytesDetails(bytes: Uint8Array): ByteRepresentation[] {
  // To deal with UTF-8 characters properly (which could span multiple bytes):
  // We can decode character-by-character. But let's build a simpler representation where:
  // We showcase each individual byte, its bit pattern, decimal, and hex.
  // And for the single character symbol, let's decapsulate single-byte vs multi-byte
  // sequence representation to make it very elegant.
  const details: ByteRepresentation[] = [];
  
  bytes.forEach((byte, index) => {
    const binaryStr = byte.toString(2).padStart(8, '0');
    const hexStr = byte.toString(16).toUpperCase().padStart(2, '0');
    
    // Try to represent as a single char or helper
    let charRepresent = '.';
    if (byte >= 32 && byte <= 126) {
      charRepresent = String.fromCharCode(byte);
    } else if (byte >= 160 && byte <= 255) {
      // Extended ASCII latin
      charRepresent = String.fromCharCode(byte);
    } else {
      // Non-printable control or multi-byte UTF-8 sequence byte
      charRepresent = `\\x${hexStr}`;
    }

    details.push({
      index,
      char: charRepresent,
      binary: binaryStr,
      decimal: byte,
      hex: hexStr,
      isValid: true,
    });
  });

  // Let's also do a second pass to group actual UTF-8 character symbols if we want,
  // but showing individual parsed byte streams is universally what binary courses do.
  // Let's combine contiguous UTF-8 bytes to label the characters for the user:
  try {
    // We can match bytes with chars by decoding character by character
    let bytePointer = 0;
    const decoder = new TextDecoder('utf-8', { fatal: false });
    
    while (bytePointer < bytes.length) {
      // Determine the length of the UTF-8 character starting here
      const firstByte = bytes[bytePointer];
      let length = 1;
      
      if ((firstByte & 0x80) === 0) {
        length = 1;
      } else if ((firstByte & 0xE0) === 0xC0) {
        length = 2; // 110xxxxx
      } else if ((firstByte & 0xF0) === 0xE0) {
        length = 3; // 1110xxxx
      } else if ((firstByte & 0xF8) === 0xF0) {
        length = 4; // 11110xxx
      }
      
      // Clamp length to remaining bytes
      if (bytePointer + length > bytes.length) {
        length = bytes.length - bytePointer;
      }
      
      const charBytes = bytes.slice(bytePointer, bytePointer + length);
      const charStr = decoder.decode(charBytes) || '';
      
      // Update the character field in our details array for this span of bytes,
      // letting the user know they form a unified symbol (like an emoji or accent)!
      for (let i = 0; i < length; i++) {
        if (details[bytePointer + i]) {
          details[bytePointer + i].char = charStr + (length > 1 ? ` (Octet ${i + 1}/${length})` : '');
        }
      }
      
      bytePointer += length;
    }
  } catch (err) {
    // Ignore and fallback
  }

  return details;
}

/**
 * Presets to help users explore instantly.
 */
export const PRESET_SAMPLES: PresetSample[] = [
  {
    name: "Message de Bienvenue",
    description: "Le fameux salut 'Hello!'",
    text: "Hello! 👋",
    binary: "01001000 01100101 01101100 01101100 01101111 00100001 00100000 11110000 10011111 10010001 10101011"
  },
  {
    name: "Signal de Détresse SOS",
    description: "Le code Morse international traduit en binaire",
    text: "S.O.S",
    binary: "01010011 00101110 01001111 00101110 01010011"
  },
  {
    name: "Chiffres Clés",
    description: "Séquence binaire des chiffres 1, 2, 3",
    text: "1 2 3",
    binary: "00110001 00100000 00110010 00100000 00110011"
  },
  {
    name: "Code Secret",
    description: "Un mot secret rigolo",
    text: "Binaire d'Or 🌟",
    binary: "01000010 01101001 01101110 01100001 01101001 01110010 01100101 00100000 01100100 00100111 01001111 01110010 00100000 11110000 10011111 10011000 10011111"
  }
];
