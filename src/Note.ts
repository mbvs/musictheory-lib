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

const PitchRegex = /^([a-g])(\d?)([#nb]{0,3})$/i;

export default class Note {
  pitchClass: PitchClass;
  accidental: Accidental;
  chroma: Chroma;
  octave: number;

  constructor(identifier: string) {
    // if PitchClass were an enum ...
    // this.pitchClass = PitchClass[<keyof typeof PitchClass>pitchClass.toUpperCase()];
    const [, pitchClass, octave, accidental] = PitchRegex.exec(identifier) || [];

    this.pitchClass = pitchClass.toUpperCase() as PitchClass;
    this.octave = octave !== '' ? parseInt(octave) : 4;
    this.accidental = accidental as Accidental;
    this.chroma = Chromas.findIndex((enharmonics) =>
      enharmonics.includes(this.pitchClass + this.accidental)
    ) as Chroma;
  }

  private get totalChroma(): number {
    return this.octave * 100 + this.chroma;
  }

  get hasAccidentals(): boolean {
    return this.accidental !== '';
  }

  toString(): string {
    return `${this.pitchClass}${this.octave}${this.accidental}`;
  }

  toNiceString(): string {
    const accidental = this.accidental
      .replace(/###/, '\u{266F}\u{1D12A}')
      .replace(/##/, '\u{1D12A}')
      .replace(/#/, '\u{266F}')
      .replace(/bbb/, '\u{266D}\u{1D12B}')
      .replace(/bb/, '\u{1D12B}')
      .replace(/b/, '\u{266D}');
    return `${this.pitchClass}${this.octave}${accidental}`;
  }

  toVexflowString(): string {
    // no support for tripple sharps/flats in vexflow!
    return `${this.pitchClass}${this.accidental.slice(0, 2)}/${this.octave}`;
  }

  isHigherThan(note: Note | string) {
    if (!(note instanceof Note)) {
      note = new Note(note);
    }
    return this.getEnharmonics()[0].totalChroma > note.getEnharmonics()[0].totalChroma;
  }

  isLowerThan(note: Note | string) {
    if (!(note instanceof Note)) {
      note = new Note(note);
    }
    return this.getEnharmonics()[0].totalChroma < note.getEnharmonics()[0].totalChroma;
  }

  getEnharmonics(): Array<Note> {
    const enharmonics = Chromas[this.chroma];
    const notes = enharmonics.map((enharmonic) => {
      const [, pitchClass, , accidental] = PitchRegex.exec(enharmonic);
      let octave = this.octave;
      const newPCindex = PitchClasses.indexOf(pitchClass);
      const oldPCindex = PitchClasses.indexOf(this.pitchClass);
      if (Math.abs(newPCindex - oldPCindex) > 2) {
        octave = newPCindex > oldPCindex ? octave - 1 : octave + 1;
      }
      return new Note(`${pitchClass}${octave}${accidental}`);
    });
    return notes;
  }
}
