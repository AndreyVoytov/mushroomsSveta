const fs=require('fs'),{analyze}=require('../docs/operations/analysis');
if(require.main===module){if(!process.argv[2])throw Error('Usage: node tools/analyze-telemetry.js <export.json> [--include-tests]');console.log(JSON.stringify(analyze(JSON.parse(fs.readFileSync(process.argv[2],'utf8').replace(/^\uFEFF/,'')),{includeTests:process.argv.includes('--include-tests')}),null,2));}
module.exports={analyze};
