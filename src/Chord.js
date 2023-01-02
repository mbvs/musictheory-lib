import ChordNote from './ChordNote.js';

export default class Chord {

    pitches;
    degree;
    inversion;
    scale;

    static inversionOrders = [
        [0, 1, 2],
        [1, 2, 0],
        [2, 1, 0],
    ]

    constructor(chordPitches, scale, degree, inversion) {
        this.pitches = chordPitches;
        this.scale = scale;
        this.degree = degree;
        this.inversion = inversion == undefined ? 0 : inversion;
    }

    get root() {
        return this.pitches.find(pitch => pitch.degree == 0);
    }

    get third() {
        return this.pitches.find(pitch => pitch.degree == 1);
    }

    get fifth() {
        return this.pitches.find(pitch => pitch.degree == 2);
    }

    getInversion(inversion) {
        const chordPitches = [];
        let octave = this.pitches[0].octave;
        for (let j=0; j<=2; j++) {
            const tone = this.pitches.find(tone => tone.degree == Chord.inversionOrders[inversion][j])
            const chordNote = new ChordNote(tone.pitch, tone.octave, tone.accidental, tone.degree);
            chordPitches.push(chordNote);
        }
        chordPitches.map( (pitch, i) => {
            octave = i>0 && chordPitches[i].lowerThan(chordPitches[i-1]) ? octave + 1 : octave;
            pitch.octave = octave;
        })
        const chord = new Chord(chordPitches, this.scale, this.degree, inversion);
        return chord;
    }
}