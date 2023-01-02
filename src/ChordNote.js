import Note from './Note.js'

export default class ChordNote extends Note { 
    constructor(name, octave, accidental, degree) {
        super(name, octave, accidental);
        this.degree = degree;
    }
}
