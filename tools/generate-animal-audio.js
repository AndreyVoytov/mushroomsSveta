// Original short cartoon encounter cues; no samples or third-party licenses.
// Run: node tools/generate-animal-audio.js
const fs = require('fs'), path = require('path');
const rate = 22050;
const cues = {
    rabbit: [[0, 523.25, .17, .65], [.14, 659.25, .16, .6], [.29, 783.99, .2, .7], [.49, 1046.5, .31, .45]],
    butterfly: [[0, 1046.5, .48, .38], [.19, 1318.5, .5, .3], [.39, 1568, .48, .25], [.62, 1396.9, .52, .18]],
    bat: [[0, 392, .25, .42], [.2, 415.3, .24, .28], [.46, 523.25, .46, .36], [.63, 659.25, .5, .18]]
};
for (const name of Object.keys(cues)) {
    const data = new Float64Array(Math.ceil(rate * 1.8));
    for (const [start, freq, duration, gain] of cues[name]) {
        for (let i = 0; i < duration * rate; i++) {
            const t = i / rate, u = t / duration;
            const env = Math.min(1, t / .012) * Math.pow(1 - u, 2);
            const phase = 2 * Math.PI * freq * (t + (name === 'rabbit' ? .0007 * Math.sin(t * 22) : 0));
            const tone = Math.sin(phase) + .2 * Math.sin(phase * 2) * Math.exp(-t * 14)
                + (name === 'butterfly' ? .1 * Math.sin(phase * 3.01) : 0);
            const index = Math.round(start * rate) + i;
            data[index] += tone * env * gain * .45;
        }
    }
    // Subtle short echo, never an abrupt cutoff.
    for (let i = data.length - 1; i >= rate * .11; i--) data[i] += data[i - Math.round(rate * .11)] * .13;
    const wav = Buffer.alloc(44 + data.length * 2);
    wav.write('RIFF'); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
    wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(1, 22);
    wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 2, 28); wav.writeUInt16LE(2, 32);
    wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(data.length * 2, 40);
    data.forEach((v, i) => wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, v)) * 32767), 44 + i * 2));
    const target = path.join(__dirname, '../assets/other/audio/encounter_' + name + '.wav');
    fs.writeFileSync(target, wav); console.log(target, wav.length);
}
