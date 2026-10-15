const fs=require('fs'),path=require('path'),crypto=require('crypto'),{execFileSync}=require('child_process');
const root=path.resolve(__dirname,'..'),source=path.join(root,'.pages-dist');
const branch=execFileSync('git',['branch','--show-current'],{cwd:root,encoding:'utf8'}).trim();
if(branch!=='reskin/arcane-watercolor')throw Error('Arcane publication requires its isolated reskin branch.');
const outputRoot=path.join(root,'.local-workbench'),output=path.join(outputRoot,'arcane-publish-'+crypto.randomUUID());
if(!output.startsWith(outputRoot+path.sep))throw Error('Invalid staging directory');
fs.mkdirSync(output,{recursive:true});
const download='ideas2/downloads/puzzle-and-ideas-2026-10-06.zip';let files=0,bytes=0;
function copyTree(directory,relative=''){
 for(const entry of fs.readdirSync(directory,{withFileTypes:true})){
  const file=relative?relative+'/'+entry.name:entry.name;if(file===download)continue;
  const from=path.join(directory,entry.name),to=path.join(output,file);
  if(entry.isSymbolicLink())throw Error('Symlink in static publication source');
  if(entry.isDirectory()){fs.mkdirSync(to,{recursive:true});copyTree(from,file);}
  else if(entry.isFile()){
   const size=fs.statSync(from).size;if(size>25*1024*1024)throw Error('Pages file limit exceeded: '+file);
   if(['_worker.js','_routes.json'].includes(file))throw Error('Unexpected Worker in static publication source');
   fs.copyFileSync(from,to);files++;bytes+=size;
  }
 }
}
copyTree(source);
fs.writeFileSync(path.join(output,'_redirects'),'/'+download+' https://andreyvoytov.github.io/mushroomsSveta/'+download+' 302\n');
const bundleSha256=crypto.createHash('sha256').update(fs.readFileSync(path.join(output,'js/bundle.js'))).digest('hex');
const metadataPath=path.join(output,'deployment.json'),metadata=JSON.parse(fs.readFileSync(metadataPath,'utf8'));
Object.assign(metadata,{branch,commit:execFileSync('git',['rev-parse','HEAD'],{cwd:root,encoding:'utf8'}).trim(),theme:'arcane-watercolor',builtAt:new Date().toISOString(),bundleSha256});
fs.writeFileSync(metadataPath,JSON.stringify(metadata,null,2)+'\n');
const state={output,projectName:'andreyvoytov-mushrooms-arcane',accountId:'95c932141b4454d6ab28ef6f7693e7bc',url:'https://andreyvoytov-mushrooms-arcane.pages.dev',files,bytes,bundleSha256,commit:metadata.commit};
fs.writeFileSync(path.join(outputRoot,'arcane-publication-state.json'),JSON.stringify(state,null,2));console.log(JSON.stringify(state));
