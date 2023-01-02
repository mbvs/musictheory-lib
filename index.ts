// import Note from './src/Note.js';
// import Scale from './src/Scale.js';

// //# majors
// //c g d a e  b f# c#
// const CMaj = Scale.buildScale(new Note('c', 4), 'major');
// const GMaj = Scale.buildScale(new Note('g', 4), 'major');
// const DMaj = Scale.buildScale(new Note('d', 4), 'major');
// const AMaj = Scale.buildScale(new Note('a', 4), 'major');
// const EMaj = Scale.buildScale(new Note('e', 4), 'major');
// const BMaj = Scale.buildScale(new Note('b', 4), 'major');
// const FSharpMaj = Scale.buildScale(new Note('f', 4, 'sharp'), 'major');
// const CSharpMaj = Scale.buildScale(new Note('c', 4, 'sharp'), 'major');

// //b majors
// //f bb eb ab db gb cb
// const FMaj = Scale.buildScale(new Note('f', 4), 'major');
// const BFlatMaj = Scale.buildScale(new Note('b', 4, 'flat'), 'major');
// const EFlatMaj = Scale.buildScale(new Note('e', 4, 'flat'), 'major');
// const AFlatMaj = Scale.buildScale(new Note('a', 4, 'flat'), 'major');
// const DFlatMaj = Scale.buildScale(new Note('d', 4, 'flat'), 'major');
// const GFlatMaj = Scale.buildScale(new Note('g', 4, 'flat'), 'major');
// const CFlatMaj = Scale.buildScale(new Note('c', 4, 'flat'), 'major');

// //# minors
// //a e b c# f# g# d# a#
// const AMin = Scale.buildScale(new Note('a', 4), 'minor');
// const EMin = Scale.buildScale(new Note('e', 4), 'minor');
// const BMin = Scale.buildScale(new Note('b', 4), 'minor');
// const CSharpMin = Scale.buildScale(new Note('c', 4, 'sharp'), 'minor');
// const FSharpMin = Scale.buildScale(new Note('f', 4, 'sharp'), 'minor');
// const GSharpMin = Scale.buildScale(new Note('g', 4, 'sharp'), 'minor');
// const DSharpMin = Scale.buildScale(new Note('d', 4, 'sharp'), 'minor');
// const ASharpMin = Scale.buildScale(new Note('a', 4, 'sharp'), 'minor');

// //b minors
// //d g c f bb eb ab
// const DMin = Scale.buildScale(new Note('e', 4), 'minor');
// const GMin = Scale.buildScale(new Note('g', 4), 'minor');
// const CMin = Scale.buildScale(new Note('c', 4), 'minor');
// const FMin = Scale.buildScale(new Note('f', 4), 'minor');
// const BFlatMin = Scale.buildScale(new Note('b', 4, 'flat'), 'minor');
// const EFlatMin = Scale.buildScale(new Note('e', 4, 'flat'), 'minor');
// const AFlatMin = Scale.buildScale(new Note('a', 4, 'flat'), 'minor');

// const majorSharpScales = [CMaj, GMaj, DMaj, AMaj, EMaj, BMaj, FSharpMaj, CSharpMaj];
// const minorSharpScales = [AMin, EMin, BMin, CSharpMin, FSharpMin, GSharpMin, DSharpMin, ASharpMin];
// const majorFlatScales = [FMaj, BFlatMaj, EFlatMaj, AFlatMaj, DFlatMaj, GFlatMaj, CFlatMaj];
// const minorFlatScales = [DMin, GMin, CMin, FMin, BFlatMin, EFlatMin, AFlatMin];

// majorSharpScales.map(scale => console.log(scale.name + ': ' + scale));
// console.log();
// minorSharpScales.map(scale => console.log(scale.name + ': ' + scale));
// console.log();
// majorFlatScales.map(scale => console.log(scale.name + ': ' + scale));
// console.log();
// minorFlatScales.map(scale => console.log(scale.name + ': ' + scale));

// // const tonic = CMaj.getChord(4);
// // const firstInversion = tonic.getInversion(1);
// // const secondInversion = tonic.getInversion(2);
// // const root = secondInversion.getInversion(0);
// // const wait = true;
