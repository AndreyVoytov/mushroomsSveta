// Original, sample-free casual-game encounter cues.
// Run: node tools/generate-melodic-animal-audio.js
const fs = require('fs'), path = require('path');
const rate = 44100, duration = 2.15;
const cues = {
    rabbit: [[0.00, 610, .26, .66], [.18, 748, .25, .62], [.39, 900, .30, .55], [.68, 1120, .38, .42]],
    butterfly: [[0.00, 1175, .52, .32], [.22, 1397, .50, .29], [.46, 1660, .52, .24], [.76, 1480, .55, .20]],
    bat: [[0.00, 365, .34, .48], [.24, 414, .32, .38], [.53, 493, .43, .42], [.78, 585, .50, .26]]
};
function envelope(t, length) {
    return Math.min(1, t / .018) * Math.pow(Math.max(0, 1 - t / length), 1.8);
}
function noise(i) {
    const x = Math.sin(i * 12.9898 + 78.233) * 43758.5453;
    return (x - Math.floor(x)) * 2 - 1;
}
for (const name of ['rabbit', 'butterfly']) {
    const left = new Float64Array(Math.ceil(rate * duration));
    const right = new Float64Array(left.length);
    for (const [start, freq, length, gain] of cues[name]) {
        const first = Math.round(start * rate), count = Math.round(length * rate);
        for (let i = 0; i < count; i++) {
            const t = i / rate, u = t / length, env = envelope(t, length);
            const vibrato = name === 'rabbit' ? .005 * Math.sin(2 * Math.PI * 8 * t)
                : name === 'butterfly' ? .012 * Math.sin(2 * Math.PI * 5.5 * t)
                    : .008 * Math.sin(2 * Math.PI * 4.1 * t);
            const phase = 2 * Math.PI * freq * t * (1 + vibrato);
            let tone;
            if (name === 'rabbit') {
                tone = Math.sin(phase) + .34 * Math.sin(phase * 2) * Math.exp(-t * 9)
                    + .13 * Math.sin(phase * 3) * Math.exp(-t * 13)
                    + noise(i + first) * .055 * Math.exp(-t * 18);
            } else if (name === 'butterfly') {
                tone = .72 * Math.sin(phase) + .24 * Math.sin(phase * 2.006)
                    + .15 * Math.sin(phase * 3.012) + .09 * Math.sin(phase * .502)
                    + noise(i + first) * .035 * (1 - u);
            } else {
                tone = .82 * Math.sin(phase) + .30 * Math.sin(phase * 2.01)
                    + .16 * Math.sin(phase * .5) + .12 * Math.sin(phase * 3) * Math.exp(-t * 7)
                    + noise(i + first) * .026 * Math.exp(-t * 7);
            }
            const sample = tone * env * gain * .42;
            left[first + i] += sample;
            right[first + i] += sample * (name === 'butterfly' ? .86 + .10 * Math.sin(t * 7) : .94);
        }
    }
    const taps = name === 'butterfly' ? [[.085, .22], [.19, .13], [.32, .08]]
        : name === 'rabbit' ? [[.11, .18], [.235, .09]] : [[.13, .19], [.29, .11], [.43, .06]];
    taps.forEach(([seconds, amount]) => {
        const offset = Math.round(seconds * rate);
        for (let i = offset; i < left.length; i++) {
            left[i] += right[i - offset] * amount;
            right[i] += left[i - offset] * amount * .78;
        }
    });
    const wav = Buffer.alloc(44 + left.length * 4);
    wav.write('RIFF'); wav.writeUInt32LE(wav.length - 8, 4); wav.write('WAVEfmt ', 8);
    wav.writeUInt32LE(16, 16); wav.writeUInt16LE(1, 20); wav.writeUInt16LE(2, 22);
    wav.writeUInt32LE(rate, 24); wav.writeUInt32LE(rate * 4, 28); wav.writeUInt16LE(4, 32);
    wav.writeUInt16LE(16, 34); wav.write('data', 36); wav.writeUInt32LE(left.length * 4, 40);
    for (let i = 0; i < left.length; i++) {
        wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, left[i])) * 32767), 44 + i * 4);
        wav.writeInt16LE(Math.round(Math.max(-1, Math.min(1, right[i])) * 32767), 46 + i * 4);
    }
    const target = path.join(__dirname, '../assets/other/audio/encounter_' + name + '.wav');
    fs.writeFileSync(target, wav); console.log(target, wav.length);
}
