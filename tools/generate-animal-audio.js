// Original short animal cues. No external recordings or background music.
// Rebuild with: node tools/generate-animal-audio.js
const fs = require('fs'), path = require('path');
const rate = 44100;
let seed = 173;
function noise() { seed = (1664525 * seed + 1013904223) >>> 0; return seed / 2147483648 - 1; }
function render(name, duration, events) {
    const samples = new Float64Array(Math.ceil(rate * duration));
    for (const event of events) {
        const [start, length, voice, gain, pitch] = event;
        let phase = 0, filtered = 0;
        for (let i = 0; i < length * rate; i++) {
            const t = i / rate, u = t / length;
            const envelope = Math.pow(Math.sin(Math.PI * u), 1.6);
            filtered += .12 * (noise() - filtered);
            phase += 2 * Math.PI * pitch * (1 + .025 * Math.sin(t * 38)) / rate;
            let sample = 0;
            if (voice === 'wing') sample = filtered * (.65 + .35 * Math.sin(t * 145));
            if (voice === 'hop') sample = .6 * Math.sin(2 * Math.PI * (pitch * t - 35 * t * t)) * Math.exp(-t * 16) + filtered * .22;
            if (voice === 'bleat') sample = (Math.sin(phase) + .3 * Math.sin(phase * 2) + .15 * Math.sin(phase * 3)) * (.8 + .2 * Math.sin(t * 43));
            if (voice === 'quack') sample = (Math.sin(phase) * .5 + Math.sin(phase * 3) * .22 + filtered * .35) * Math.exp(-u * 1.5);
            if (voice === 'bubble') sample = Math.sin(2 * Math.PI * pitch * (t + 2.5 * t * t)) * Math.exp(-u * 3) + filtered * .12;
            if (voice === 'buzz') sample = Math.sin(phase) * .5 + Math.sin(phase * 2) * .16 + filtered * .15;
            const index = Math.round(start * rate) + i;
            if (index < samples.length) samples[index] += sample * envelope * gain;
        }
    }
    let peak = 0; for (const sample of samples) peak = Math.max(peak, Math.abs(sample));
    const gain = .58 / Math.max(.1, peak);
    const wav = Buffer.alloc(44 + samples.length * 2);
    wav.write('RIFF'); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
    wav.writeUInt32LE(16,16); wav.writeUInt16LE(1,20); wav.writeUInt16LE(1,22);
    wav.writeUInt32LE(rate,24); wav.writeUInt32LE(rate*2,28); wav.writeUInt16LE(2,32); wav.writeUInt16LE(16,34);
    wav.write('data',36); wav.writeUInt32LE(samples.length*2,40);
    samples.forEach((v,i) => wav.writeInt16LE(Math.round(v*gain*32767),44+i*2));
    fs.writeFileSync(path.join(__dirname, '../assets/other/audio/encounter_'+name+'.wav'),wav);
    console.log(name, duration+'s', 'peak 0.58');
}
render('butterfly', .95, [[0,.32,'wing',.35,0],[.22,.36,'wing',.28,0],[.49,.38,'wing',.18,0]]);
render('rabbit', .95, [[0,.18,'hop',.55,150],[.27,.17,'hop',.42,175],[.57,.19,'hop',.3,190]]);
render('ram', 1.25, [[.05,.72,'bleat',.48,185],[.87,.15,'hop',.13,130]]);
render('duck', 1.1, [[0,.32,'quack',.5,255],[.40,.29,'quack',.35,230],[.73,.2,'wing',.15,0]]);
render('fish', 1.0, [[0,.20,'bubble',.4,420],[.20,.22,'bubble',.3,570],[.49,.38,'wing',.2,0]]);
render('hive', .65, [[.04,.48,'buzz',.4,180]]);

// Restore the melodic cues after rendering to preserve the other cues' noise seed.
require('./generate-melodic-animal-audio');
