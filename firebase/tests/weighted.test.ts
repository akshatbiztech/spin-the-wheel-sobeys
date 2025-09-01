import { describe, it, expect } from '@jest/globals';

// Simple reproducible weighted choice test
function chooseWeightedIndex(segments: { weight: number }[], rnd: number): number {
  const total = segments.reduce((s, x) => s + x.weight, 0);
  let acc = 0;
  for (let i = 0; i < segments.length; i++) {
    acc += segments[i].weight;
    if (rnd * total < acc) return i;
  }
  return segments.length - 1;
}

describe('chooseWeightedIndex', () => {
  it('respects weights', () => {
    const segs = [{ weight: 1 }, { weight: 9 }];
    let c0 = 0, c1 = 0;
    for (let i = 0; i < 10000; i++) {
      const rnd = Math.random();
      const idx = chooseWeightedIndex(segs, rnd);
      if (idx === 0) c0++; else c1++;
    }
    // index 1 should appear ~9x as often; loose check
    expect(c1).toBeGreaterThan(c0 * 5);
  });
});