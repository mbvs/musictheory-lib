import { expect, describe, test } from '@jest/globals';
import Note from '../src/Note';

describe('Notes', () => {
  test('should print correctly', () => {
    expect(new Note('C').toString()).toBe('C4');
    expect(new Note('C3#').toString()).toBe('C3#');
    expect(new Note('C2##').toString()).toBe('C2##');
    expect(new Note('C1###').toString()).toBe('C1###');

    expect(new Note('C').toString()).toBe('C4');
    expect(new Note('C5b').toString()).toBe('C5b');
    expect(new Note('C6bb').toString()).toBe('C6bb');
    expect(new Note('C7bbb').toString()).toBe('C7bbb');
  });

  // 1d12a 𝄪
  // 1d12b 𝄫
  // 266d ♭
  // 2664 ♯
  test('should nice print correctly', () => {
    expect(new Note('C').toNiceString()).toBe('C4');
    expect(new Note('C3#').toNiceString()).toBe('C3♯');
    expect(new Note('C2##').toNiceString()).toBe('C2𝄪');
    // no triple sharp in unicode :(
    expect(new Note('C1###').toNiceString()).toBe('C1♯𝄪');
    expect(new Note('C').toNiceString()).toBe('C4');
    expect(new Note('C5b').toNiceString()).toBe('C5♭');
    expect(new Note('C6bb').toNiceString()).toBe('C6𝄫');
    // no triple flat in unicode :(
    expect(new Note('C7bbb').toNiceString()).toBe('C7♭𝄫');
  });

  test('should calculate enharmonics octaves correctly', () => {
    expect(
      new Note('B3')
        .getEnharmonics()
        .map((enharmonic) => enharmonic.toString())
        .join(' ')
    ).toBe('B3 A3## C4b D4bbb');
    expect(
      new Note('B3#')
        .getEnharmonics()
        .map((enharmonic) => enharmonic.toString())
        .join(' ')
    ).toBe('C4 B3# D4bb A3###');
    expect(
      new Note('A3#')
        .getEnharmonics()
        .map((enharmonic) => enharmonic.toString())
        .join(' ')
    ).toBe('A3# B3b C4bb G3###');
    expect(
      new Note('C3#')
        .getEnharmonics()
        .map((enharmonic) => enharmonic.toString())
        .join(' ')
    ).toBe('C3# B2## D3b E3bbb');
    expect(
      new Note('D3')
        .getEnharmonics()
        .map((enharmonic) => enharmonic.toString())
        .join(' ')
    ).toBe('D3 C3## E3bb B2### F3bbb');
    expect(
      new Note('G3#')
        .getEnharmonics()
        .map((enharmonic) => enharmonic.toString())
        .join(' ')
    ).toBe('G3# A3b F3### B3bbb');
    expect(
      new Note('F3')
        .getEnharmonics()
        .map((enharmonic) => enharmonic.toString())
        .join(' ')
    ).toBe('F3 E3# G3bb D3###');
  });
});
