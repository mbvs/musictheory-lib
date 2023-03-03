import Note from './src/Note';
import Interval from './src/Interval';
import ScoreRenderer from './src/ScoreRenderer';
import KeyRenderer from './src/KeyRenderer';
import ObjectsToCsv from 'objects-to-csv';
import Chord from './src/Chord';

const interval = new Interval('C', 'M b2');
Interval.identifyInterval(interval.notes[0], interval.notes[1]);
