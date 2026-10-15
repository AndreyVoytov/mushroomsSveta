// Original soft glass resonance, with rounded attacks and restrained overtones.
// Run: node tools/generate-mirror-audio.js
const fs = require('fs'), path = require('path');
const rate = 44100, length = Math.round(rate * 0.8);
const samples = new Float64Array(length);
for (const [start, gain, pitch] of [[0, 0.52, 1], [0.15, 0.22, 1.025]]) {
    for (let i = Math.round(start * rate); i < length; i++) {
        const t = i / rate - start;
        const attack = Math.min(1, t / 0.014);
        let value = 0;
        for (const [frequency, strength, decay] of [[1080,0.69,6],[1747,0.23,9],[2860,0.07,14],[4200,0.01,22]]) {
            value += Math.sin(2 * Math.PI * frequency * pitch * t) * strength * Math.exp(-t * decay);
        }
        samples[i] += value * attack * gain;
    }
}
const wav = Buffer.alloc(44 + length * 2);
wav.write('RIFF');wav.writeUInt32LE(wav.length - 8,4);wav.write('WAVEfmt ',8);
wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);
wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);
wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(length*2,40);
for (let i=0;i<length;i++) wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,samples[i]))*32767),44+i*2);
fs.writeFileSync(path.join(__dirname,'../assets/other/audio/mirrorGlass.wav'),wav);
console.log('Generated mirrorGlass.wav (0.8s, 44.1kHz, mono).');
