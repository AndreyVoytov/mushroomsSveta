// Original small water lap: warm droplets and a quiet low-passed water wash.
// Run: node tools/generate-water-lily-audio.js
const fs=require('fs'),path=require('path');
const rate=44100,length=Math.round(rate*.85),samples=new Float64Array(length);
let seed=1729,filtered=0;
for(let i=0;i<length;i++){
    const t=i/rate;
    seed=(Math.imul(seed,1664525)+1013904223)>>>0;
    filtered+=.035*((seed/4294967296*2-1)-filtered);
    samples[i]=filtered*.13*Math.sin(Math.PI*Math.min(1,t/.75))**2;
}
for(const [start,pitch,gain] of [[0,620,.38],[.09,840,.22],[.21,530,.28],[.34,710,.16]]){
    let phase=0;
    for(let i=Math.round(start*rate);i<length;i++){
        const t=i/rate-start;
        const frequency=pitch*(1+.26*Math.exp(-t*24));
        phase+=2*Math.PI*frequency/rate;
        const envelope=(1-Math.exp(-t*180))*Math.exp(-t*15);
        samples[i]+=(Math.sin(phase)+.12*Math.sin(phase*2.01))*envelope*gain;
    }
}
const wav=Buffer.alloc(44+length*2);
wav.write('RIFF');wav.writeUInt32LE(wav.length-8,4);wav.write('WAVEfmt ',8);
wav.writeUInt32LE(16,16);wav.writeUInt16LE(1,20);wav.writeUInt16LE(1,22);
wav.writeUInt32LE(rate,24);wav.writeUInt32LE(rate*2,28);wav.writeUInt16LE(2,32);
wav.writeUInt16LE(16,34);wav.write('data',36);wav.writeUInt32LE(length*2,40);
for(let i=0;i<length;i++)wav.writeInt16LE(Math.round(Math.max(-1,Math.min(1,samples[i]))*32767),44+i*2);
fs.writeFileSync(path.join(__dirname,'../assets/other/audio/waterLilySway.wav'),wav);
console.log('Generated waterLilySway.wav (0.85s, 44.1kHz, mono).');
