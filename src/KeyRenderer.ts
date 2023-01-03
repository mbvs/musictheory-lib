import Note from './Note';
import Interval from './Interval';
import { Canvas, createCanvas, loadImage } from 'canvas';
import * as fs from 'fs';
import { Context } from 'vm';

const keyPositions = [
  { x: 33, y: 290 }, // c
  { x: 61, y: 150 }, // c#
  { x: 101, y: 290 }, // d
  { x: 141, y: 150 }, // d#
  { x: 168, y: 290 }, // e
  { x: 235, y: 290 }, // f
  { x: 259.5, y: 150 }, // f#
  { x: 302, y: 290 }, // g
  { x: 335.5, y: 150 }, // g#
  { x: 370, y: 290 }, // a
  { x: 413, y: 150 }, // a#
  { x: 437, y: 290 } // b
];

const defaults = {
  template: './assets/88_keyboard.png',
  scale: 1,
  canvasWidth: 3500,
  canvasHeight: 354,
  startC: 1,
  startOffset: 137,
  font: '30px Arial Black',
  fontColor: '#ffffff',
  dotRadius: 30,
  dotColor: 'blue',
  offsetOctave: 470.8
};

type Options = typeof defaults;

// for 88 full keyboard:
// C1 is lowest C, A0 is lowest key
// C8 is highest C and highest key
// TODO: constraint range and render A0 + B0

// for 49 small keyboard:
// C2 is lowest C and lowest key
// C6 is highest C and highest key
export default class KeyRenderer {
  async render(renderee: Note | Interval, filename?: string): Promise<Buffer> {
    let options;
    if (this.getRange(renderee) === 'small') {
      options = Object.assign({}, defaults, {
        template: './assets/49_keyboard.png',
        canvasWidth: 1955,
        startC: 2,
        startOffset: 2,
        offsetC0: 0,
        offsetOctave: 471.4
      });
    } else {
      options = defaults;
    }

    const canvas = createCanvas(
      options.canvasWidth * options.scale,
      options.canvasHeight * options.scale
    );
    const context = canvas.getContext('2d');
    context.scale(options.scale, options.scale);

    context.save();
    context.fillStyle = 'white';
    context.fillRect(0, 0, options.canvasWidth, options.canvasHeight);
    context.restore();

    const keyboard = await loadImage(options.template);
    context.drawImage(keyboard, 0, 0, options.canvasWidth, options.canvasHeight);

    if (renderee instanceof Note) {
      this.drawNote(context, renderee, options);
    } else {
      this.drawInterval(context, renderee, options);
    }

    if (filename) {
      this.writeImage(filename, canvas);
    }

    return this.getImageBuffer(canvas);
  }

  private getRange(renderee: Note | Interval): 'small' | 'full' {
    const notes: Array<Note> = renderee instanceof Note ? [renderee] : renderee.notes;
    const range = notes.reduce((range: 'small' | 'full', note: Note) => {
      if (note.isHigherThan('C6') || note.isLowerThan('C2')) {
        range = 'full';
      }
      return range;
    }, 'small');
    return range;
  }

  private drawInterval(context: Context, interval: Interval, options: Options) {
    interval.notes.forEach((note, index) => {
      let color;
      let text;
      if (index === 0) {
        color = 'blue';
        text = interval.notes[0].toString();
      } else {
        color = 'green';
        text = interval.notes[1].toString();
      }
      this.drawNote(context, note, options, color);
    });
  }

  private drawNote(context: Context, note: Note, options: Options, color?: string, text?: string) {
    note = note.getEnharmonics()[0];
    context.beginPath();
    const x =
      keyPositions[note.chroma].x +
      options.startOffset +
      options.offsetOctave * (note.octave - options.startC);
    const y = keyPositions[note.chroma].y;
    context.arc(x, y, options.dotRadius, 0, 2 * Math.PI, false);
    context.fillStyle = color ? color : options.dotColor;
    context.fill();

    if (text) {
      context.fillStyle = options.fontColor;
      context.font = options.font;
      const dim = context.measureText(text);
      context.fillText(text, x - dim.width / 2, y + dim.actualBoundingBoxAscent / 2);
    }
  }

  private getImageData(canvas: Canvas): string {
    return canvas.toDataURL().split(';base64,').pop() as string;
  }

  private getImageBuffer(canvas: Canvas): Buffer {
    return Buffer.from(this.getImageData(canvas), 'base64');
  }

  private writeImage(filename: string, canvas: Canvas): void {
    const image = this.getImageData(canvas);
    fs.writeFileSync(filename, image, { encoding: 'base64' });
  }
}
