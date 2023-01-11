import Note from '../src/Note';
import Interval from '../src/Interval';
import ScoreRenderer from '../src/ScoreRenderer';
import KeyRenderer from '../src/KeyRenderer';
import ObjectsToCsv from 'objects-to-csv';
import * as fs from 'fs';
import * as path from 'path';

type Row = {
  interval: string;
  direction: string;
  first: string;
  second: string;
  key: string;
  score: string;
};

(async () => {
  const data: Array<Row> = [];
  const keys = new KeyRenderer();
  const scores = new ScoreRenderer();
  const imagePath = './dist/images/m3_M3/';
  const csvPath = './dist/csv/m3_M3/';
  const csvFile = 'm3_M3.csv';

  const ankiTags = {
    seperator: 'comma',
    html: true,
    columns: 'interval,direction,first,second,key,score'
  };

  // clean folders and files
  if (fs.existsSync(imagePath)) {
    const files = fs.readdirSync(imagePath);
    files.map((file) => fs.unlinkSync(path.join('./dist/images/m3_M3', file)));
  } else {
    fs.mkdirSync(imagePath, { recursive: true });
  }

  if (!fs.existsSync(csvPath)) {
    fs.mkdirSync(csvPath, { recursive: true });
  }

  // generate entries
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
              keys.render(interval, `./dist/images/m3_M3/${key_file}`);
              scores.render(interval, `./dist/images/m3_M3/${score_file}`);
              const row: Row = {
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

  // write csv file
  const csv = new ObjectsToCsv(data);
  await csv.toDisk(csvPath + csvFile);

  // construct tags
  const tags = Object.entries(ankiTags).map(([key, value]) => `#${key}:${value}`);
  // remove first line of csv
  const filecontent = fs.readFileSync(csvPath + csvFile).toString();
  const lines = filecontent.split('\n');
  lines.shift();
  // write out all together
  fs.writeFileSync(csvPath + csvFile, [...tags, ...lines].join('\n'));
})();
