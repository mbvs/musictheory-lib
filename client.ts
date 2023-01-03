import Note from './src/Note';
import Interval from './src/Interval';
import ScoreRenderer from './src/ScoreRenderer';
import KeyRenderer from './src/KeyRenderer';
import ObjectsToCsv from 'objects-to-csv';

// const note = new Note('c2');

// // renderScore.render(note, 'render/score.png');

// const renderKey = new KeyRenderer();
// renderKey.render(note, './render/key.png');

// const interval = new Interval(note, 'P8', 'up');
// console.log(interval.notes[0]);
// console.log(interval.notes[1]);
// const renderInterval = new KeyRenderer();
// renderInterval.render(interval, 'render/interval_key.png');
// const renderScore = new ScoreRenderer();
// renderScore.render(interval, 'render/score.png');

const data: Array<any> = [];
const keys = new KeyRenderer();
const scores = new ScoreRenderer();
[2, 3, 4, 5, 6].map((octave) => {
  ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((pitchclass) => {
    ['', '#', 'b'].map((accidental) => {
      ['m3', 'M3'].map((ident) => {
        ['up', 'down'].map((direction) => {
          const interval = new Interval(`${pitchclass}${octave}${accidental}`, ident, direction);
          if (
            interval.notes[0].isLowerThan('C6#') &&
            interval.notes[1].isLowerThan('C6#') &&
            interval.notes[0].isHigherThan('C2b') &&
            interval.notes[1].isHigherThan('C2b')
          ) {
            const key_file = `key_${pitchclass}${octave}${accidental}_${ident}_${direction}.png`;
            // eslint-disable-next-line max-len
            const score_file = `score_${pitchclass}${octave}${accidental}_${ident}_${direction}.png`;
            keys.render(interval, `./dist/images/${key_file}`);
            scores.render(interval, `./dist/images/${score_file}`);
            const row = {
              interval: interval.interval,
              direction: interval.direction,
              first: interval.notes[0].toNiceString(),
              second: interval.notes[1].toNiceString(),
              key: `<img class="key" src="${key_file}">`,
              score: `<img class="score" src="${score_file}">`
            };
            data.push(row);
          }
        });
      });
    });
  });
});

// If you use "await", code must be inside an asynchronous function:
(async () => {
  const csv = new ObjectsToCsv(data);

  // Save to file:
  await csv.toDisk('./dist/intervals.csv');

  // Return the CSV file as string:
  console.log(await csv.toString());
})();

// #seperator:comma
// #html:true
// #columns:interval,direction,first,second,key,score
