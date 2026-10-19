import YandexGamesHelper from '../../../core/service/integration/YandexGamesHelper';

export function storyNode(tag:string,text?:string,cls?:string):HTMLElement {
    const e=document.createElement(tag);if(text)e.textContent=text;if(cls)e.className=cls;return e;
}
export function storyButton(parent:HTMLElement,text:string,action:()=>void,disabled=false):HTMLButtonElement {
    const b=<HTMLButtonElement>storyNode('button',text,'story-button');b.type='button';b.disabled=disabled;
    b.onclick=()=>{if(!b.disabled)action();};parent.appendChild(b);return b;
}
export function portraitPath(id:string):string {
    return {sveta:'assets/base/characters/sveta1.png',boris:'assets/base/characters/cat1.png',owl:'assets/additional/characters/sova1.png',leshy:'assets/additional/characters/leshii1.png'}[id]||'assets/base/characters/sveta1.png';
}
export function installStoryStyles():void {
    if(document.getElementById('arcane-story-styles'))return;
    const s=storyNode('style');s.id='arcane-story-styles';s.textContent=`
    .story-overlay{position:fixed;inset:0;z-index:15000;background:#152d2baf;display:flex;align-items:center;justify-content:center;padding:12px;box-sizing:border-box;font-family:Georgia,serif;color:#293e35}
    .story-shell{position:relative;width:min(100%,660px);max-height:96dvh;overflow:auto;background:#e6e6d4;box-shadow:0 14px 70px #11292299;border:1px solid #d9c493;border-radius:24px 24px 12px 12px}
    .story-scene{height:340px;max-height:43dvh;position:relative;background-size:cover;background-position:center 27%;overflow:hidden;border-radius:23px 23px 0 0}
    .story-scene:after{content:'';position:absolute;inset:75% 0 0;background:linear-gradient(transparent,#e6e6d4)}
    .story-title{position:absolute;z-index:2;top:12px;left:16px;right:66px;font-size:21px;margin:0;text-shadow:0 1px #fff;color:#243e35;background:#f3eddaeb;padding:10px 14px;border-radius:14px}
    .story-close{position:absolute;z-index:4;right:10px;top:10px;width:46px;height:46px;border:0;border-radius:50%;font-size:30px;color:#2d493e;background:#f3edda;cursor:pointer}
    .story-portrait{position:absolute;left:9%;bottom:0;height:82%;max-width:58%;object-fit:contain;object-position:bottom;filter:drop-shadow(0 6px 5px #263f3d40);z-index:1}
    .story-body{position:relative;padding:0 24px 22px;font-size:17px;line-height:1.5;min-height:180px}
    .story-speaker{font-size:20px;color:#835837;margin:0 0 7px}.story-body p{margin:8px 0 15px}.story-kicker{font:12px Arial,sans-serif;letter-spacing:1.5px;text-transform:uppercase;color:#636f57}
    .story-button{display:block;width:100%;box-sizing:border-box;min-height:48px;border:0;padding:14px 54px;margin:8px 0;background:transparent url('assets/base/ui/arcane/secondary-control.png') center/100% 100% no-repeat;color:#294638;font:600 15px/1.35 Georgia,serif;cursor:pointer}
    .story-button.primary{background-image:url('assets/base/ui/pnlButton.png')}.story-button:disabled{opacity:.55;cursor:default}.story-button:focus-visible,.relation-tabs button:focus-visible{outline:3px solid #bd8246;outline-offset:-3px}
    .story-heroes{display:flex;gap:7px;flex-wrap:wrap;margin:10px 0}.story-heroes button{width:auto;min-height:40px;border:1px solid #a7b19b;border-radius:20px;background:#f4efdd;color:#354b3b;padding:9px 13px;cursor:pointer}.story-heroes button[aria-pressed=true]{background:#365b4b;color:#fff1d4}
    .story-check-detail{display:block;font:13px/1.5 Arial,sans-serif;margin-top:3px;color:#59624f}.story-note{font:13px/1.5 Arial,sans-serif;color:#59624f}.story-reward{border-top:1px solid #b7b89d;padding-top:12px;color:#775332}.room-artifact{position:absolute;z-index:1;width:52px;height:64px;object-fit:contain;right:15%;top:44%;filter:drop-shadow(0 0 12px #ffdd8d)}.room-artifact.keepsake{right:28%;top:47%;width:40px;height:48px}
    .relation-ui{position:fixed;z-index:12000;transform-origin:top left;font-family:Georgia,serif;color:#2c4237;pointer-events:none}.relation-tabs{display:flex;gap:12px;height:80px;padding:0 24px;box-sizing:border-box;pointer-events:auto}.relation-tabs button{flex:1;border:0;background:transparent url('assets/base/ui/arcane/secondary-control.png') center/100% 100% no-repeat;color:#3a503e;font:38px Georgia,serif;padding:12px 36px;cursor:pointer}.relation-tabs button[aria-selected=true]{background-image:url('assets/base/ui/pnlButton.png');color:#254834;font-weight:bold}
    .relation-content{pointer-events:auto;height:580px;overflow:auto;padding:18px 34px 28px;box-sizing:border-box;background:#eee9d8;border:2px solid #b9a579;box-shadow:0 6px 24px #162e3040;border-radius:20px;margin:8px 18px 0;scrollbar-width:thin;font-size:34px;line-height:1.35}.relation-content h3{font-size:40px;margin:2px 0 10px}.relation-content p{margin:8px 0}.relation-content .story-note{font-size:28px}.relation-content .story-button{font-size:32px;min-height:82px;padding:19px 40px}.relation-summary{display:flex;justify-content:space-between;align-items:center;gap:14px}.relation-progress{height:10px;background:#c9cdb6;border-radius:6px;overflow:hidden;margin:12px 0 20px}.relation-progress span{display:block;height:100%;background:#b47d65}.relation-actions{display:grid;grid-template-columns:1fr 1fr;gap:10px}.relation-step{border-left:3px solid #afbea1;padding:5px 0 16px 22px;margin:0 0 0 16px;position:relative}.relation-step:before{content:'';position:absolute;left:-10px;top:16px;width:16px;height:16px;background:#b7c3a9;border-radius:50%}.relation-step.done:before{background:#b58456}.relation-step h4{font-size:35px;margin:4px 0}.relation-step p{font-size:28px;color:#646d57}.relation-step.locked{opacity:.65}.relation-step .story-button{margin-bottom:0}.relation-bubble{position:absolute;bottom:calc(100% + 34px);left:30px;max-width:470px;padding:22px 28px;background:#fff4ddec;border:2px solid #d9bd88;border-radius:24px;font:34px/1.35 Georgia,serif;box-shadow:0 8px 24px #162e3020;pointer-events:none;animation:relation-bubble-in .25s ease-out}.relation-bubble:after{content:'';position:absolute;left:70px;top:-20px;border-width:0 19px 20px 0;border-style:solid;border-color:transparent transparent #fff4dd transparent}.relation-heart{position:absolute;bottom:calc(100% + 10px);left:110px;color:#cb807c;font-size:38px;animation:relation-heart 1.6s ease-out forwards;pointer-events:none}@keyframes relation-heart{to{transform:translate(var(--drift),-170px) rotate(15deg);opacity:0}}@keyframes relation-bubble-in{from{opacity:0;transform:translateY(10px)}}
    .relation-summary>span{font-size:27px;color:#6d765d}.relation-growth-next{font-size:27px;color:#63734f;line-height:1.45}.relation-level-reward{padding:15px 20px;margin:14px 0;background:#dce8ce;border-left:5px solid #58905a;color:#2e633e;font-size:30px}.relation-gain-stats{display:flex;flex-wrap:wrap;gap:10px 20px;margin-top:8px;font-size:28px;font-weight:bold}.relation-growth-rules{font-size:25px;color:#63734f;margin:16px 0}.relation-growth-rules summary{cursor:pointer;min-height:40px}.relation-growth-rules p{font-size:24px;line-height:1.5}
    @media(max-width:450px){.story-overlay{padding:8px}.story-body{padding:0 16px 16px;font-size:16px}.story-scene{height:290px}.story-title{font-size:18px}.story-button{padding:14px 48px}}
    @media(prefers-reduced-motion:reduce){.relation-heart{animation:none;display:none}.relation-bubble{animation:none}}`;
    document.head.appendChild(s);
}

export default class StoryOverlay {
    public root:HTMLElement;public scene:HTMLElement;public body:HTMLElement;
    private previous:HTMLElement;private onClose:()=>void;private focusTimer:any;
    private keys=(e:KeyboardEvent)=>{
        if(e.key==='Escape'){e.preventDefault();e.stopPropagation();this.close();}
        if(e.key==='Tab'){
            const all=this.root.querySelectorAll('button:not(:disabled)'),first=<HTMLElement>all[0],last=<HTMLElement>all[all.length-1];
            if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
            else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
        }
    };
    constructor(title:string,background:string,character:string,onClose?:()=>void){
        installStoryStyles();this.onClose=onClose;this.previous=<HTMLElement>document.activeElement;
        this.root=storyNode('div',null,'story-overlay');this.root.setAttribute('role','dialog');this.root.setAttribute('aria-modal','true');this.root.setAttribute('aria-label',title);
        const shell=storyNode('section',null,'story-shell');this.root.appendChild(shell);
        this.scene=storyNode('div',null,'story-scene');this.scene.style.backgroundImage='url("'+background+'")';shell.appendChild(this.scene);
        this.scene.appendChild(storyNode('h2',title,'story-title'));
        if(character){const p=<HTMLImageElement>storyNode('img',null,'story-portrait');p.src=portraitPath(character);p.alt='';this.scene.appendChild(p);}
        const close=storyButton(shell,'×',()=>this.close());close.className='story-close';close.setAttribute('aria-label','Закрыть диалог');
        this.body=storyNode('div',null,'story-body');this.body.setAttribute('aria-live','polite');shell.appendChild(this.body);
        document.body.appendChild(this.root);document.addEventListener('keydown',this.keys,true);close.focus();YandexGamesHelper.stopGameplay();
    }
    public say(speaker:string,text:string):void {
        this.body.textContent='';this.body.appendChild(storyNode('h3',speaker,'story-speaker'));this.body.appendChild(storyNode('p',text));
        clearTimeout(this.focusTimer);this.focusTimer=setTimeout(()=>{if(!this.root)return;const next=<HTMLElement>this.body.querySelector('button:not(:disabled)');if(next)next.focus();},0);
    }
    public close():void {
        if(!this.root)return;clearTimeout(this.focusTimer);this.root.remove();this.root=null;document.removeEventListener('keydown',this.keys,true);
        if(this.previous&&document.documentElement.contains(this.previous))this.previous.focus();
        if(this.onClose)this.onClose();YandexGamesHelper.startGameplay();
    }
}
