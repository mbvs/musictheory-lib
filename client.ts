import Note from './src/Note';
import Interval from './src/Interval';
import ScoreRenderer from './src/ScoreRenderer';
import KeyRenderer from './src/KeyRenderer';

const note = new Note('c2');

// renderScore.render(note, 'render/score.png');

const renderKey = new KeyRenderer();
renderKey.render(note, './render/key.png');

const interval = new Interval(note, 'P8', 'up');
console.log(interval.notes[0]);
console.log(interval.notes[1]);
const renderInterval = new KeyRenderer();
renderInterval.render(interval, 'render/interval_key.png');
const renderScore = new ScoreRenderer();
renderScore.render(interval, 'render/score.png');
