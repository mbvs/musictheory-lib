import Note from './Note';
import Interval from './Interval';

const ChordQualities = ['minor', 'major', 'diminished', 'augumented'];
type ChordQuality = typeof ChordQualities[number];

const ChordNotations = ['m', '', 'o', '+'];
type ChordNotation = typeof ChordNotations[number];

const ChordStructures = [
  ['P1', 'm3', 'M3'],
  ['P1', 'M3', 'm3'],
  ['P1', 'm3', 'm3'],
  ['P1', 'M3', 'M3']
];

export default class Chord {
  public notes: Array<Note> = [];
  public quality: ChordQuality;

  constructor(root: string | Note, chordQuality: ChordQuality = undefined) {
    if (typeof root === 'string') {
      const result = this.chordRegex().exec(root);
      if (result) {
        const [, pitch, aug, dim, major, minor, rest] = result;
        root = new Note(pitch);
        if (chordQuality !== undefined) {
          if (ChordQualities.indexOf(chordQuality.toLowerCase()) > -1) {
            this.quality = chordQuality.toLowerCase();
          }
        } else {
          this.quality = rest
            ? undefined
            : major
            ? 'major'
            : minor
            ? 'minor'
            : aug
            ? 'augumented'
            : dim
            ? 'diminished'
            : 'major';
        }
        if (this.quality === undefined) {
          throw new Error('unknown chord quality');
        }
      } else {
        throw new Error('could not parse chord string');
      }
    }

    const chordStructure = ChordStructures[ChordQualities.indexOf(this.quality)];
    this.notes[0] = root;
    this.notes[1] = new Interval(root, chordStructure[1]).notes[1];
    this.notes[2] = new Interval(this.notes[1], chordStructure[2]).notes[1];
  }

  toString(withNotes = false) {
    let string = this.notes[0].toString(false);
    string += ChordNotations[ChordQualities.indexOf(this.quality)];
    if (withNotes) {
      string += ` (${this.notes[0].toString(false)} - ${this.notes[1].toString(
        false
      )} - ${this.notes[2].toString(false)})`;
    }
    return string;
  }

  toNiceString(withNotes = false) {
    let string = this.toString(withNotes);
    string = string
      .replace(/###/g, '\u{266F}\u{1D12A}')
      .replace(/##/g, '\u{1D12A}')
      .replace(/#/g, '\u{266F}')
      .replace(/bbb/g, '\u{266D}\u{1D12B}')
      .replace(/bb/g, '\u{1D12B}')
      .replace(/b/g, '\u{266D}')
      .replace(/\+/g, '\u{207A}')
      .replace(/o/g, '\u{2070}');
    return string;
  }

  private chordRegex() {
    const pitch = '([A-G][2-6]?[b#]?)';
    const augumented = '(?:aug|\\+|M\\+5|M#5)';
    const diminished = '(?:dim|mb5|mo5|o)';
    const major = '(?:[mM]aj?|M)';
    const minor = '(?:min|m|-)';

    const rest = '(.*)';

    // eslint-disable-next-line max-len
    const regexString = `^${pitch}(?:(${augumented})|(${diminished})|(${major})|(${minor}))?${rest}$`;

    return new RegExp(regexString);
  }
}
