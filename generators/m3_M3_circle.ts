import Note from '../src/Note';
import Interval from '../src/Interval';
import ObjectsToCsv from 'objects-to-csv';
import * as fs from 'fs';
import * as crypto from 'crypto';

type Row = {
  Guid: string;
  Deck: string;
  Note: string;
  Tags: string;
  Front: string;
  Back: string;
};

const shuffleArray = (array: Array<Row>): Array<Row> => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
};

(async () => {
  const data: Array<Row> = [];
  const csvPath = './dist/csv/m3_M3/';
  const csvFile = 'm3_M3_circle.csv';

  const noteName = 'Basic';
  const deckName = 'm3 M3 rows';

  const ankiTags = {
    separator: 'Comma',
    html: true,
    columns: 'Guid, Deck, Note, Tags, Front, Back',
    'guid column': 1,
    'deck column': 2,
    'notetype column': 3,
    'tags column': 4
  };

  // clean folders and files
  if (!fs.existsSync(csvPath)) {
    fs.mkdirSync(csvPath, { recursive: true });
  }

  // generate entries
  ['A', 'B', 'C', 'D', 'E', 'F', 'G'].map((pitchclass) => {
    ['', '#', 'b'].map((accidental) => {
      ['m3', 'M3'].map((ident) => {
        ['up', 'down'].map((direction) => {
          const steps: Array<Interval> = [];
          const octave = 4;
          let interval: Interval;
          let note = new Note(`${pitchclass}${octave}${accidental}`);
          do {
            interval = new Interval(note, ident, direction);
            steps.push(interval);
            note = interval.notes[1];
          } while (!note.hasTrippleAccidentals);

          steps.shift();
          // eslint-disable-next-line max-len
          const front = `What are the consecutive ${
            ident === 'm3' ? 'minor thirds' : 'major thirds'
          } from ${new Note(`${pitchclass}${octave}${accidental}`).toNiceString(
            false
          )} ${direction}?`;
          const back = [
            `${new Note(`${pitchclass}${octave}${accidental}`).toNiceString(false)}`,
            ...steps.map((interval) => interval.notes[0].toNiceString(false))
          ].join(' ');
          const row: Row = {
            Guid: crypto.randomUUID(),
            Deck: deckName,
            Note: noteName,
            Tags: '',
            Front: front,
            Back: back
          };
          data.push(row);
        });
      });
    });
  });

  // write csv file
  const csv = new ObjectsToCsv(shuffleArray(data));
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
