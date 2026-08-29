export type CaptionCue = {
  start: number;
  end: number;
  text: string;
};

export type NarrationSegment = {
  id: string;
  start: number;
  end: number;
  text: string;
};

// The full narration script, split into caption cues (4-9 words each)
// following natural speech rhythm. Timestamps reflect scene timings.
// House style: JetBrains Mono, mint chevron prefix ">", warm-white text.
export const CAPTIONS: CaptionCue[] = [
  // ===== Scene 1: Key Generation intro (0.0 - 15.0) =====
  { start: 0.4, end: 3.2, text: 'RSA is a public-key encryption scheme.' },
  { start: 3.4, end: 7.0, text: 'It generates a public key pair n and e,' },
  { start: 7.2, end: 10.8, text: 'and a private key d,' },
  { start: 11.0, end: 14.8, text: 'so encrypting with n and e can only be undone by d.' },

  // ===== Scene 2: Key Generation math (15.0 - 30.0) =====
  { start: 15.4, end: 18.8, text: 'The keys come from two large primes p and q.' },
  { start: 19.0, end: 22.4, text: 'Multiplying them yields n equals p times q.' },
  { start: 22.6, end: 26.6, text: 'We then compute phi of n as p minus one times q minus one.' },
  { start: 26.8, end: 29.8, text: 'A public exponent e is chosen coprime to phi of n.' },

  // ===== Scene 3: Encryption (30.0 - 45.0) =====
  { start: 30.4, end: 34.0, text: 'To encrypt a message M, it becomes an integer.' },
  { start: 34.2, end: 38.4, text: 'The ciphertext is C equals M to the e mod n,' },
  { start: 38.6, end: 42.0, text: 'computed using the public key.' },
  { start: 42.2, end: 44.8, text: 'M is raised to the power e, then trimmed by mod n.' },

  // ===== Scene 4: Decryption (45.0 - 60.0) =====
  { start: 45.4, end: 49.0, text: 'The recipient uses the private key d to recover M,' },
  { start: 49.2, end: 53.0, text: 'computing M equals C to the d mod n.' },
  { start: 53.2, end: 57.0, text: 'Because e times d is one mod phi of n,' },
  { start: 57.2, end: 59.8, text: 'this restores the original message.' },

  // ===== Scene 5: Euler's Theorem (60.0 - 75.0) =====
  { start: 60.4, end: 64.0, text: 'This works by Eulers theorem.' },
  { start: 64.2, end: 68.0, text: 'In a prime modulus p, a to the p minus one is one.' },
  { start: 68.2, end: 72.0, text: 'For n equals p times q, M to the phi of n is one.' },
  { start: 72.2, end: 74.8, text: 'Raising M by e then d wraps back to M.' },

  // ===== Scene 6: Multiplicative group (75.0 - 90.0) =====
  { start: 75.4, end: 79.0, text: 'Only numbers coprime to n form the group.' },
  { start: 79.2, end: 83.0, text: 'There are phi of n of them.' },
  { start: 83.2, end: 87.0, text: 'We work modulo phi of n for exponents,' },
  { start: 87.2, end: 89.8, text: 'so every element has an inverse.' },

  // ===== Scene 7: Prime generation (90.0 - 105.0) =====
  { start: 90.4, end: 94.0, text: 'Finding large primes is computationally expensive.' },
  { start: 94.2, end: 98.0, text: 'Probabilistic tests rapidly eliminate non-primes.' },
  { start: 98.2, end: 102.0, text: 'By the prime number theorem, about one prime per ln N candidates.' },
  { start: 102.2, end: 104.8, text: 'We test many candidates until two big primes emerge.' },

  // ===== Scene 8: Fast exponentiation (105.0 - 120.0) =====
  { start: 105.4, end: 109.0, text: 'Modular exponentiation is optimized.' },
  { start: 109.2, end: 113.0, text: 'We reduce intermediate values at each step.' },
  { start: 113.2, end: 117.0, text: 'Exponentiation by squaring cuts work from e down to log e.' },
  { start: 117.2, end: 119.8, text: 'Square and multiply, three steps instead of eight.' },

  // ===== Scene 9: CRT intro (120.0 - 140.0) =====
  { start: 120.4, end: 124.0, text: 'Decryption can be sped up with the Chinese Remainder Theorem.' },
  { start: 124.2, end: 128.0, text: 'Instead of C to the d mod n in one step,' },
  { start: 128.2, end: 132.0, text: 'compute m one mod p and m two mod q separately.' },
  { start: 132.2, end: 136.0, text: 'Since p and q are half the size of n,' },
  { start: 136.2, end: 139.8, text: 'this gives roughly a four times speedup.' },

  // ===== Scene 10: Garner recombination (140.0 - 160.0) =====
  { start: 140.4, end: 144.0, text: 'We recombine the two results using Garners formula.' },
  { start: 144.2, end: 148.0, text: 'M equals C q plus q times the inverse difference.' },
  { start: 148.2, end: 152.0, text: 'The inverse of q mod p is precomputed.' },
  { start: 152.2, end: 156.0, text: 'Difference, multiply by inverse, multiply by q, add C q.' },
  { start: 156.2, end: 159.8, text: 'The steps light up in sequence, culminating in M.' },

  // ===== Scene 11: CRT exponent reduction (160.0 - 175.0) =====
  { start: 160.4, end: 164.0, text: 'Each branch is sped up further by reducing the exponent.' },
  { start: 164.2, end: 168.0, text: 'd p equals d mod p minus one, by Fermats little theorem.' },
  { start: 168.2, end: 172.0, text: 'Now the exponents are much smaller than p and q.' },
  { start: 172.2, end: 174.8, text: 'The squaring loop runs far quicker.' },

  // ===== Scene 12: Key size security (175.0 - 190.0) =====
  { start: 175.4, end: 179.0, text: 'RSA security comes from the hardness of factoring large n.' },
  { start: 179.2, end: 183.0, text: 'Five hundred twelve bit keys can be broken.' },
  { start: 183.2, end: 187.0, text: 'Current guidance is two thousand forty eight bits or larger.' },
  { start: 187.2, end: 189.8, text: 'Increasing n dramatically increases factorization cost.' },

  // ===== Scene 13: Prime selection attacks (190.0 - 210.0) =====
  { start: 190.4, end: 194.0, text: 'Attackers try smarter math: factoring n or finding d.' },
  { start: 194.2, end: 198.0, text: 'Primes too close enable Fermats factorization.' },
  { start: 198.2, end: 202.0, text: 'p minus one with small factors enables Pollards attack.' },
  { start: 202.2, end: 206.0, text: 'Choose robust, independent strong primes instead.' },
  { start: 206.2, end: 209.8, text: 'They resist the saw of factorization.' },

  // ===== Scene 14: Side-channel attacks (210.0 - 225.0) =====
  { start: 210.4, end: 214.0, text: 'Side-channel attacks like timing can leak bits of d.' },
  { start: 214.2, end: 218.0, text: 'If decryption takes longer on certain inputs,' },
  { start: 218.2, end: 222.0, text: 'an attacker could infer the private key.' },
  { start: 222.2, end: 224.8, text: 'Constant-time algorithms and blinding flatten the timing.' },

  // ===== Scene 15: Chosen-ciphertext / OAEP (225.0 - 240.0) =====
  { start: 225.4, end: 229.0, text: 'RSA is malleable under multiplication.' },
  { start: 229.2, end: 233.0, text: 'An attacker submits X equals two to the e times C.' },
  { start: 233.2, end: 237.0, text: 'The decrypted result is two times M, revealing M.' },
  { start: 237.2, end: 239.8, text: 'Secure padding like OAEP blocks this attack.' },

  // ===== Scene 16: Conclusion (240.0 - 250.0) =====
  { start: 240.4, end: 244.0, text: 'RSA uses exponentiation with large prime-based keys.' },
  { start: 244.2, end: 248.0, text: 'Its security rests on hard number-theory problems.' },
  { start: 248.2, end: 250.0, text: 'Large keys, optimized math, and secure padding.' },
];

export const NARRATION_SEGMENTS: NarrationSegment[] = [
  { id: 's1', start: 0.0, end: 15.0, text: 'RSA is a public-key encryption scheme. It generates a public key pair n and e and a private key d so that encrypting with n and e can only be undone by d.' },
  { id: 's2', start: 15.0, end: 30.0, text: 'The keys come from two large primes p and q. Multiplying them yields n equals p times q. We then compute phi of n as p minus one times q minus one. A public exponent e is chosen coprime to phi of n.' },
  { id: 's3', start: 30.0, end: 45.0, text: 'To encrypt a message M, it becomes an integer. The ciphertext is C equals M to the e mod n, computed using the public key.' },
  { id: 's4', start: 45.0, end: 60.0, text: 'The recipient uses the private key d to recover M, computing M equals C to the d mod n. Because e times d is one mod phi of n, this restores the original message.' },
  { id: 's5', start: 60.0, end: 75.0, text: 'This works by Eulers theorem. In a prime modulus p, a to the p minus one is one. For n equals p times q, M to the phi of n is one. Raising M by e then d wraps back to M.' },
  { id: 's6', start: 75.0, end: 90.0, text: 'Only numbers coprime to n form the group. There are phi of n of them. We work modulo phi of n for exponents, so every element has an inverse.' },
  { id: 's7', start: 90.0, end: 105.0, text: 'Finding large primes is computationally expensive. Probabilistic tests rapidly eliminate non-primes. By the prime number theorem, about one prime per ln N candidates. We test many candidates until two big primes emerge.' },
  { id: 's8', start: 105.0, end: 120.0, text: 'Modular exponentiation is optimized. We reduce intermediate values at each step. Exponentiation by squaring cuts work from e down to log e. Square and multiply, three steps instead of eight.' },
  { id: 's9', start: 120.0, end: 140.0, text: 'Decryption can be sped up with the Chinese Remainder Theorem. Instead of C to the d mod n in one step, compute m one mod p and m two mod q separately. Since p and q are half the size of n, this gives roughly a four times speedup.' },
  { id: 's10', start: 140.0, end: 160.0, text: 'We recombine the two results using Garners formula. M equals C q plus q times the inverse difference. The inverse of q mod p is precomputed. Difference, multiply by inverse, multiply by q, add C q. The steps light up in sequence, culminating in M.' },
  { id: 's11', start: 160.0, end: 175.0, text: 'Each branch is sped up further by reducing the exponent. d p equals d mod p minus one, by Fermats little theorem. Now the exponents are much smaller than p and q. The squaring loop runs far quicker.' },
  { id: 's12', start: 175.0, end: 190.0, text: 'RSA security comes from the hardness of factoring large n. Five hundred twelve bit keys can be broken. Current guidance is two thousand forty eight bits or larger. Increasing n dramatically increases factorization cost.' },
  { id: 's13', start: 190.0, end: 210.0, text: 'Attackers try smarter math: factoring n or finding d. Primes too close enable Fermats factorization. p minus one with small factors enables Pollards attack. Choose robust, independent strong primes instead. They resist the saw of factorization.' },
  { id: 's14', start: 210.0, end: 225.0, text: 'Side-channel attacks like timing can leak bits of d. If decryption takes longer on certain inputs, an attacker could infer the private key. Constant-time algorithms and blinding flatten the timing.' },
  { id: 's15', start: 225.0, end: 240.0, text: 'RSA is malleable under multiplication. An attacker submits X equals two to the e times C. The decrypted result is two times M, revealing M. Secure padding like OAEP blocks this attack.' },
  { id: 's16', start: 240.0, end: 250.0, text: 'RSA uses exponentiation with large prime-based keys. Its security rests on hard number-theory problems. Large keys, optimized math, and secure padding.' },
];
