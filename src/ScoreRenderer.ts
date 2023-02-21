import Note from './Note';
import Interval from './Interval';
import * as fs from 'fs';
import * as path from 'path';
import { Buffer } from 'node:buffer';
import * as Vex from 'vexflow';
const { Renderer, Stave, StaveNote, Voice, Formatter, StaveConnector, Accidental } = Vex.Flow;
import { JSDOM } from 'jsdom';

interface IRenderOptions {
  scale: number;
  width: number;
  height: number;
  staveWidth: number;
  staveX: number;
  staveBassY: number;
}

// TODO: image size only fits until G1
export default class ScoreRenderer {
  render(renderee: Note | Interval, filename?: string): Buffer {
    const options = {
      scale: 1.8,
      width: 175,
      height: 200,
      staveWidth: 100,
      staveX: 40,
      staveBassY: 80
    };

    let canvas: HTMLCanvasElement;

    if (renderee instanceof Note) {
      canvas = this.renderNote(renderee, options);
    } else if (renderee instanceof Interval) {
      canvas = this.renderInterval(
        renderee,
        Object.assign({}, options, { canvasWidth: 250, staveWidth: 180 })
      );
    }

    if (filename) {
      this.writeImage(filename, canvas);
    }

    return this.getImageBuffer(canvas);
  }

  private renderNote(note: Note, options: IRenderOptions): HTMLCanvasElement {
    const [canvas, context] = this.createCanvas(options);
    const [staveBass, staveTreble] = this.renderStaves(context, options);
    const [staveRender, renderClef] = [
      note.isHigherThan('B3') ? staveTreble : staveBass,
      note.isHigherThan('B3') ? 'treble' : 'bass'
    ];

    const voice = new Voice({ num_beats: 1, beat_value: 4 });
    const noteRender = new StaveNote({
      clef: renderClef,
      auto_stem: true,
      keys: [note.toVexflowString()],
      duration: 'q'
    });
    if (note.hasAccidentals) {
      if (note.accidental.length == 3) {
        noteRender.addModifier(new Accidental(note.accidental.slice(0, 2)));
        noteRender.addModifier(new Accidental(note.accidental.slice(2)));
      } else {
        noteRender.addModifier(new Accidental(note.accidental));
      }
    }
    voice.addTickable(noteRender);
    new Formatter().joinVoices([voice]).format([voice], options.staveWidth);

    voice.draw(context, staveRender);

    return canvas;
  }

  private renderInterval(interval: Interval, options: IRenderOptions): HTMLCanvasElement {
    const [canvas, context] = this.createCanvas(options);
    const [staveBass, staveTreble] = this.renderStaves(context, options);
    const formatter = new Formatter();

    if (interval.notes[0].isHigherThan('G3#') && interval.notes[1].isHigherThan('G3#')) {
      // both notes are in the treble clef
      const voice = new Voice({ num_beats: 2, beat_value: 4 });
      const tickables = interval.notes.map((note) => this.getStaveNote(note, 'treble'));
      voice.addTickables(tickables).setStave(staveTreble);
      formatter.joinVoices([voice]).format([voice], options.staveWidth - 20);

      voice.draw(context);
    } else if (interval.notes[0].isLowerThan('F4') && interval.notes[1].isLowerThan('F4')) {
      // both notes are in the bass clef
      const voice = new Voice({ num_beats: 2, beat_value: 4 });
      const tickables = interval.notes.map((note) => this.getStaveNote(note, 'bass'));
      voice.addTickables(tickables).setStave(staveBass);
      formatter.joinVoices([voice]).format([voice], options.staveWidth - 20);

      voice.draw(context);
    } else {
      // both notes are in different clefs -> two voices and invisible rests needed
      const voiceTreble = new Voice({ num_beats: 2, beat_value: 4 });
      const voiceBass = new Voice({ num_beats: 2, beat_value: 4 });

      interval.notes.forEach((note, index) => {
        const staveNote = this.getStaveNote(note);
        const stave = this.getTickableClef(staveNote) === 'treble' ? staveTreble : staveBass;
        const voice = this.getTickableClef(staveNote) === 'treble' ? voiceTreble : voiceBass;
        if (index === 1) {
          voice.addTickable(this.getStaveRest()).setStave(stave);
          voice.addTickable(staveNote).setStave(stave);
        } else {
          voice.addTickable(staveNote).setStave(stave);
          voice.addTickable(this.getStaveRest()).setStave(stave);
        }
      });
      formatter.joinVoices([voiceTreble]);
      formatter.joinVoices([voiceBass]);
      formatter.format([voiceTreble, voiceBass], options.staveWidth);

      voiceTreble.draw(context);
      voiceBass.draw(context);
    }

    return canvas;
  }

  private getStaveNote(note: Note, clef?: 'treble' | 'bass'): Vex.Flow.StaveNote {
    clef = clef ? clef : note.isHigherThan(new Note('B3')) ? 'treble' : 'bass';
    const staveNote = new StaveNote({
      clef: clef,
      auto_stem: true,
      keys: [note.toVexflowString()],
      duration: 'q'
    });
    if (note.hasAccidentals) {
      if (note.accidental.length == 3) {
        staveNote.addModifier(new Accidental(note.accidental.slice(0, 2)));
        staveNote.addModifier(new Accidental(note.accidental.slice(2)));
      } else {
        staveNote.addModifier(new Accidental(note.accidental));
      }
    }
    return staveNote;
  }

  private getStaveRest() {
    const staveRest = new StaveNote({ keys: ['b/4'], duration: 'qr' });
    staveRest.setStyle({ fillStyle: 'rgba(0,0,0,0)' });
    return staveRest;
  }

  private getTickableClef(tickable: Vex.Flow.Tickable) {
    return (tickable as unknown as { clef: string }).clef;
  }

  private createCanvas(options: IRenderOptions): [HTMLCanvasElement, Vex.IRenderContext] {
    const dom = new JSDOM(`<!DOCTYPE html></html>`);
    const document = dom.window.document;
    const canvas = document.createElement('canvas');
    dom.window.document.body.appendChild(canvas);

    const renderer = new Renderer(canvas, Renderer.Backends.CANVAS);
    renderer.resize(options.width * options.scale, options.height * options.scale);
    const context = renderer.getContext().scale(options.scale, options.scale);

    context.save();
    context.setFillStyle('white');
    context.fillRect(0, 0, options.width, options.height);
    context.restore();
    return [canvas, context];
  }

  private renderStaves(
    context: Vex.IRenderContext,
    options: IRenderOptions
  ): [Vex.Flow.Stave, Vex.Flow.Stave] {
    const staveTreble = new Stave(options.staveX, 0, options.staveWidth);
    const staveBass = new Stave(options.staveX, options.staveBassY, options.staveWidth);
    staveTreble.addClef('treble');
    staveBass.addClef('bass');
    const connector = new StaveConnector(staveTreble, staveBass);
    const line = new StaveConnector(staveTreble, staveBass);
    connector.setType(StaveConnector.type.BRACE);
    line.setType(StaveConnector.type.SINGLE);
    staveTreble.setContext(context).draw();
    staveBass.setContext(context).draw();
    connector.setContext(context).draw();
    line.setContext(context).draw();

    return [staveBass, staveTreble];
  }

  private getImageData(canvas: HTMLCanvasElement): string {
    return canvas.toDataURL().split(';base64,').pop() as string;
  }

  private getImageBuffer(canvas: HTMLCanvasElement): Buffer {
    return Buffer.from(this.getImageData(canvas), 'base64');
  }

  private writeImage(filename: string, canvas: HTMLCanvasElement): void {
    const image = this.getImageData(canvas);
    if (!fs.existsSync(path.dirname(filename))) {
      fs.mkdirSync(path.dirname(filename));
    }
    fs.writeFileSync(filename, image, { encoding: 'base64' });
  }
}
