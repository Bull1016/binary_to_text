export type ConversionMode = 'TEXT_TO_BINARY' | 'BINARY_TO_TEXT';

export type BinarySeparator = ' ' | 'none' | ',' | '-';

export interface ByteRepresentation {
  index: number;         // Index of the byte/character in the sequence
  char: string;          // The decoded character string (e.g. 'A' or '👋')
  binary: string;        // 8-bit string (e.g. '01000001')
  decimal: number;       // Decimal ASCII/UTF-8 value (e.g. 65)
  hex: string;           // Hex value command (e.g. '41')
  isValid: boolean;      // Whether it is a valid 8-bit byte representation
}

export interface PresetSample {
  name: string;
  description: string;
  text: string;
  binary: string;
}
