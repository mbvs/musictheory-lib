import { expect, describe, test } from '@jest/globals';
import Interval from '../src/Interval';
import Note from '../src/Note';
import Chord from '../src/Chord';

describe('Chords', () => {
  test('should parse Chord notation correctly', () => {
    expect(new Chord('C').quality).toBe('major');
    expect(new Chord('CMaj').quality).toBe('major');
    expect(new Chord('CM').quality).toBe('major');
    // how to type the triangle?

    expect(new Chord('Cm').quality).toBe('minor');
    expect(new Chord('Cmin').quality).toBe('minor');
    expect(new Chord('C-').quality).toBe('minor');

    expect(new Chord('C+').quality).toBe('augumented');
    expect(new Chord('Caug').quality).toBe('augumented');
    expect(new Chord('CM#5').quality).toBe('augumented');
    expect(new Chord('CM+5').quality).toBe('augumented');

    expect(new Chord('Co').quality).toBe('diminished');
    expect(new Chord('Cdim').quality).toBe('diminished');
    expect(new Chord('Cmb5').quality).toBe('diminished');
    expect(new Chord('Cmo5').quality).toBe('diminished');
  });

  test('should reject unknown chord types', () => {
    const t = () => {
      new Chord('C', 'unknown type');
    };
    expect(t).toThrow('unknown chord quality');
    const s = () => {
      new Chord('CSomething');
    };
    expect(s).toThrow('unknown chord quality');
  });

  test('should generate minor chords correctly', () => {
    const cMinor = new Chord('C', 'minor');
    expect(cMinor.notes[0].toString()).toBe('C4');
    expect(cMinor.notes[1].toString()).toBe('E4b');
    expect(cMinor.notes[2].toString()).toBe('G4');
    expect(cMinor.toString(false)).toBe('Cm');
    expect(cMinor.toString(true)).toBe('Cm (C - Eb - G)');
    expect(cMinor.toNiceString(true)).toBe('Cm (C - E♭ - G)');

    const eMinor = new Chord('E', 'minor');
    expect(eMinor.notes[0].toString()).toBe('E4');
    expect(eMinor.notes[1].toString()).toBe('G4');
    expect(eMinor.notes[2].toString()).toBe('B4');
    expect(eMinor.toString(false)).toBe('Em');
    expect(eMinor.toNiceString(true)).toBe('Em (E - G - B)');

    const bSharpMinor = new Chord('B#', 'minor');
    expect(bSharpMinor.notes[0].toString()).toBe('B4#');
    expect(bSharpMinor.notes[1].toString()).toBe('D5#');
    expect(bSharpMinor.notes[2].toString()).toBe('F5##');
    expect(bSharpMinor.toString(false)).toBe('B#m');
    expect(bSharpMinor.toNiceString(true)).toBe('B♯m (B♯ - D♯ - F𝄪)');
  });

  test('should generate major chords correctly', () => {
    const cMajor = new Chord('C', 'major');
    expect(cMajor.notes[0].toString()).toBe('C4');
    expect(cMajor.notes[1].toString()).toBe('E4');
    expect(cMajor.notes[2].toString()).toBe('G4');
    expect(cMajor.toString(false)).toBe('C');
    expect(cMajor.toString(true)).toBe('C (C - E - G)');
    expect(cMajor.toNiceString(true)).toBe('C (C - E - G)');

    const eMajor = new Chord('E', 'major');
    expect(eMajor.notes[0].toString()).toBe('E4');
    expect(eMajor.notes[1].toString()).toBe('G4#');
    expect(eMajor.notes[2].toString()).toBe('B4');
    expect(eMajor.toString(false)).toBe('E');
    expect(eMajor.toNiceString(true)).toBe('E (E - G♯ - B)');

    const bSharpMajor = new Chord('B#', 'major');
    expect(bSharpMajor.notes[0].toString()).toBe('B4#');
    expect(bSharpMajor.notes[1].toString()).toBe('D5##');
    expect(bSharpMajor.notes[2].toString()).toBe('F5##');
    expect(bSharpMajor.toString(false)).toBe('B#');
    expect(bSharpMajor.toNiceString(true)).toBe('B♯ (B♯ - D𝄪 - F𝄪)');
  });

  test('should generate diminished chords correctly', () => {
    const cDiminished = new Chord('C', 'diminished');
    expect(cDiminished.notes[0].toString()).toBe('C4');
    expect(cDiminished.notes[1].toString()).toBe('E4b');
    expect(cDiminished.notes[2].toString()).toBe('G4b');
    expect(cDiminished.toString(false)).toBe('Co');
    expect(cDiminished.toNiceString(true)).toBe('C⁰ (C - E♭ - G♭)');

    const eDiminished = new Chord('E', 'diminished');
    expect(eDiminished.notes[0].toString()).toBe('E4');
    expect(eDiminished.notes[1].toString()).toBe('G4');
    expect(eDiminished.notes[2].toString()).toBe('B4b');
    expect(eDiminished.toString(false)).toBe('Eo');
    expect(eDiminished.toNiceString(true)).toBe('E⁰ (E - G - B♭)');

    const bSharpDiminished = new Chord('B#', 'diminished');
    expect(bSharpDiminished.notes[0].toString()).toBe('B4#');
    expect(bSharpDiminished.notes[1].toString()).toBe('D5#');
    expect(bSharpDiminished.notes[2].toString()).toBe('F5#');
    expect(bSharpDiminished.toString(false)).toBe('B#o');
    expect(bSharpDiminished.toNiceString(true)).toBe('B♯⁰ (B♯ - D♯ - F♯)');
  });
});
