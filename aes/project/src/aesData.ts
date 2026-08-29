// AES reference data — values from FIPS-197 example (Appendix B test vector).
// Plaintext, key, and intermediate states are the canonical AES-128 example.

export type Hex = string;

// Standard AES-128 example (FIPS-197 Appendix B)
export const PLAINTEXT: Hex[][] = [
  ['32', '88', '31', 'e0'],
  ['43', '5a', '31', '37'],
  ['f6', '30', '98', '07'],
  ['a8', '8d', 'a2', '34'],
];

export const CIPHER_KEY: Hex[][] = [
  ['2b', '28', 'ab', '09'],
  ['7e', 'ae', 'f7', 'cf'],
  ['15', 'd2', '15', '4f'],
  ['16', 'a6', '88', '3c'],
];

export const CIPHERTEXT: Hex[][] = [
  ['39', '02', 'dc', '19'],
  ['25', 'dc', '11', '6a'],
  ['84', '09', '85', '0b'],
  ['1d', 'fb', '97', '32'],
];

// State after initial AddRoundKey (plaintext XOR key) — FIPS-197 example
export const STATE_AFTER_ROUND0: Hex[][] = [
  ['19', 'a0', '9a', 'e9'],
  ['3d', 'f4', 'c6', 'f8'],
  ['e3', 'e2', '8d', '48'],
  ['be', '2b', '2a', '08'],
];

// After SubBytes round 1
export const STATE_AFTER_SUBBYTES_1: Hex[][] = [
  ['d4', 'e0', 'b8', '1e'],
  ['27', 'bf', 'b4', '41'],
  ['11', '98', '5d', '52'],
  ['ae', 'f1', 'e5', '30'],
];

// After ShiftRows round 1
export const STATE_AFTER_SHIFTROWS_1: Hex[][] = [
  ['d4', 'e0', 'b8', '1e'],
  ['bf', 'b4', '41', '27'],
  ['5d', '52', '11', '98'],
  ['30', 'ae', 'f1', 'e5'],
];

// After MixColumns round 1
export const STATE_AFTER_MIXCOLUMNS_1: Hex[][] = [
  ['04', '66', '81', 'e5'],
  ['e0', 'cb', '19', '9a'],
  ['48', 'f8', 'd3', '7a'],
  ['28', '06', '26', '4c'],
];

// AES S-box (standard, FIPS-197 Figure 7)
export const SBOX: Hex[] = [
  '63','7c','77','7b','f2','6b','6f','c5','30','01','67','2b','fe','d7','ab','76',
  'ca','82','c9','7d','fa','59','47','f0','ad','d4','a2','af','9c','a4','72','c0',
  'b7','fd','93','26','36','3f','f7','cc','34','a5','e5','f1','71','d8','31','15',
  '04','c7','23','c3','18','96','05','9a','07','12','80','e2','eb','27','b2','75',
  '09','83','2c','1a','1b','6e','5a','a0','52','3b','d6','b3','29','e3','2f','84',
  '53','d1','00','ed','20','fc','b1','5b','6a','cb','be','39','4a','4c','58','cf',
  'd0','ef','aa','fb','43','4d','33','85','45','f9','02','7f','50','3c','9f','a8',
  '51','a3','40','8f','92','9d','38','f5','bc','b6','da','21','10','ff','f3','d2',
  'cd','0c','13','ec','5f','97','44','17','c4','a7','7e','3d','64','5d','19','73',
  '60','81','4f','dc','22','2a','90','88','46','ee','b8','14','de','5e','0b','db',
  'e0','32','3a','0a','49','06','24','5c','c2','d3','ac','62','91','95','e4','79',
  'e7','c8','37','6d','8d','d5','4e','a9','6c','56','f4','ea','65','7a','ae','08',
  'ba','78','25','2e','1c','a6','b4','c6','e8','dd','74','1f','4b','bd','8b','8a',
  '70','3e','b5','66','48','03','f6','0e','61','35','57','b9','86','c1','1d','9e',
  'e1','f8','98','11','69','d9','8e','94','9b','1e','87','e9','ce','55','28','df',
  '8c','a1','89','0d','bf','e6','42','68','41','99','2d','0f','b0','54','bb','16',
];

export function sboxLookup(byte: Hex): Hex {
  return SBOX[parseInt(byte, 16)];
}

// MixColumns fixed polynomial a(x) = {03}x^3 + {01}x^2 + {01}x + {02}
export const MIX_POLY: Hex[] = ['02', '03', '01', '01'];
// Inverse MixColumns polynomial a^-1(x) = {0b}x^3 + {0d}x^2 + {09}x + {0e}
export const INV_MIX_POLY: Hex[] = ['0e', '0b', '0d', '09'];

// Irreducible polynomial m(x) = x^8 + x^4 + x^3 + x + 1  ->  0x11B
export const IRREDUCIBLE = 0x11b;

// GF(2^8) multiplication
export function gmul(a: number, b: number): number {
  let p = 0;
  for (let i = 0; i < 8; i++) {
    if (b & 1) p ^= a;
    const hi = a & 0x80;
    a <<= 1;
    if (hi) a ^= 0x1b;
    b >>= 1;
  }
  return p & 0xff;
}

// House-style color tokens (flat, near-black, nature-inspired green undertones)
export const COLORS = {
  canvas: '#0a0e0c',
  panel: '#11161300',
  ink: '#e8efe6',        // warm off-white primary text
  inkMuted: '#8a9789',   // muted mint-gray secondary
  rule: '#1f2a24',       // crisp rule lines
  mint: '#5fd6a6',       // safe / active state (primary accent)
  mintDeep: '#2f8f6a',
  amber: '#e6b873',      // interpreters / instructions / technical tokens
  coral: '#ff7a6b',      // danger / writes
  blue: '#6fa8d6',       // key material
  violet: '#b58bd6',     // XOR result (use sparingly; not a brand violet)
} as const;
