import ChordNote from './ChordNote.js';
import Chord from './Chord.js';

export default class Scale {

    scale;

    static templates = {
        'major': 'wwhwwwh',
        'minor': 'whwwhww'
    }

    static buildScale(root, type) {
        const scale = [];
        scale.push(root);
        let template = Scale.templates[type];
        let nextNote = root;
        do {
            const step = template.slice(0, 1);
            template = template.slice(1);
            if (step == 'w') {
                nextNote = nextNote.getMajorSecond();
                const wait = true;
            } else if (step == 'h') {
                nextNote = nextNote.getMinorSecond();
                const wait = true;
            }
            scale.push(nextNote);
        } while (template.length > 0)
        return new Scale(scale, type);
    }

    constructor(scale, type) {
        this.scale = scale;
        this.type = type;
    }

    get name() {
        return this.root.pitch.toUpperCase() + this.root.accidentalSymbol + ' ' + this.type;
    }

    get root() {
        return this.scale[0];
    }

    getChord(degree) {
        const chordTones = [];
        let octave = this.root.octave;
        let step = degree;
        for (let j=0; j<=2; j++) {
            const tone = this.scale[step];
            const chordNote = new ChordNote(tone.pitch, octave, tone.accidental, j);
            chordTones.push(chordNote);
            const nextstep = (step + 2) % 7;
            octave = nextstep < step ? octave + 1 : octave;
            step = nextstep;
        }
        return new Chord(chordTones, this, degree);
    }

    toString() {
        const nameArray = this.scale.map(note => note.name)
        return nameArray.join(' / ');
    }


}