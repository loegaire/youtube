/** Canonical teaching implementation used by both the visuals and the attack demo. */
export function toyHash8States(data: string): number[] {
  let h = 0x6d;
  const states: number[] = [];

  for (let i = 0; i < data.length; i++) {
    h = (h ^ data.charCodeAt(i)) + 0x3d;
    h &= 0xff;
    h = ((h << 3) & 0xff) | (h >>> 5);
    states.push(h);
  }

  return states;
}

export function toyHash8(data: string): number {
  const states = toyHash8States(data);
  return states.length === 0 ? 0x6d : states[states.length - 1];
}

export function toyHash8Hex(data: string): string {
  return toyHash8(data).toString(16).padStart(2, '0');
}
