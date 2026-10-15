// Art preparation is optional; normal game builds use the checked-in PNGs/fonts.
const path=require('path'),os=require('os');
module.exports=function dependency(name){
 try{return require(name);}
 catch(error){
  if(error.code!=='MODULE_NOT_FOUND')throw error;
  const bundled=path.join(os.homedir(),'.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules',name);
  try{return require(bundled);}
  catch(_){throw Error('Art preparation needs '+name+'. Install it locally or use the bundled Codex document runtime.');}
 }
};
