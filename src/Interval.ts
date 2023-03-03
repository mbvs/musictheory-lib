import Note from './Note';

const PitchClasses = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
type PitchClass = typeof PitchClasses[number];

const Accidentals = ['bbb', 'bb', 'b', '', '#', '##', '###'];
type Accidental = typeof Accidentals[number];

const Chromas = [
  ['C', 'B#', 'Dbb', 'A###'],
  ['C#', 'B##', 'Db', 'Ebbb'],
  ['D', 'C##', 'Ebb', 'B###', 'Fbbb'],
  ['D#', 'Eb', 'Fbb', 'C###'],
  ['E', 'D##', 'Fb', 'Gbbb'],
  ['F', 'E#', 'Gbb', 'D###'],
  ['F#', 'E##', 'Gb', 'Abbb'],
  ['G', 'F##', 'Abb', 'E###'],
  ['G#', 'Ab', 'F###', 'Bbbb'],
  ['A', 'G##', 'Bbb', 'Cbbb'],
  ['A#', 'Bb', 'Cbb', 'G###'],
  ['B', 'A##', 'Cb', 'Dbbb']
];
type Chroma = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11;

// TODO: add compound intervals
const Intervals = [
  ['P1', 'd2'],
  ['m2', 'A1'],
  ['M2', 'd3'],
  ['m3', 'A2'],
  ['M3', 'd4'],
  ['P4', 'A3'],
  ['A4', 'd5'],
  ['P5', 'd6'],
  ['m6', 'A5'],
  ['M6', 'd7'],
  ['m7', 'A6'],
  ['M7', 'd8'],
  ['P8', 'A7']
];

const allIntervals = Intervals.flat();
type IntervalIdent = typeof allIntervals[number];
const directions = ['up', 'down'];
type IntervalDirection = typeof directions[number];

const IntervalRegex = /^([mMAdP])(\d?)$/;

export default class Interval {
  public notes: Array<Note> = [];
  public interval: IntervalIdent;
  public direction: IntervalDirection;

  constructor(base: Note | string, interval: IntervalIdent, direction: IntervalDirection = 'up') {
    if (typeof base === 'string') {
      base = new Note(base);
    }
    this.notes[0] = base;
    this.notes[1] = Interval.getInterval(base, interval, direction);
    this.interval = interval;
    this.direction = direction;
  }

  static getInterval(base: Note, interval: IntervalIdent, direction: IntervalDirection): Note {
    const [, , pcSteps] = IntervalRegex.exec(interval) || [];

    const halfSteps = Intervals.findIndex((equivalents) => equivalents.includes(interval));

    // accending interval
    if (direction == 'up') {
      let octave = base.octave;
      let pcIndex = PitchClasses.indexOf(base.pitchClass) + (parseInt(pcSteps) - 1);
      if (pcIndex >= PitchClasses.length) {
        octave++;
        pcIndex = pcIndex - PitchClasses.length;
      }
      const pitchClass = PitchClasses[pcIndex];
      const chroma = (base.chroma + halfSteps) % 12;
      const accidental = Chromas[chroma]
        .find((enharmonic) => enharmonic.slice(0, 1) === pitchClass)
        .slice(1);
      return new Note(`${pitchClass}${octave}${accidental}`);
    }
    // decending interval
    else {
      let pcIndex = PitchClasses.indexOf(base.pitchClass) - (parseInt(pcSteps) - 1);
      let octave = base.octave;
      if (pcIndex < 0) {
        pcIndex = PitchClasses.length + pcIndex;
        octave--;
      }
      const pitchClass = PitchClasses[pcIndex];
      let chroma = base.chroma - halfSteps;
      chroma = chroma < 0 ? Chromas.length + chroma : chroma;
      const accidental = Chromas[chroma]
        .find((enharmonic) => enharmonic.slice(0, 1) === pitchClass)
        .slice(1);
      return new Note(`${pitchClass}${octave}${accidental}`);
    }
  }

  static identifyInterval(base: Note, note: Note) {
    const basePcIndex = PitchClasses.indexOf(base.pitchClass);
    const notePcIndex = PitchClasses.indexOf(note.pitchClass);
    const intervalDistance =
      (notePcIndex < basePcIndex ? notePcIndex + 7 : notePcIndex) - basePcIndex;
    // account for octave

    const halfsteps = (note.chroma < base.chroma ? note.chroma + 11 : note.chroma) - base.chroma;
    console.log(halfsteps);
  }
}
