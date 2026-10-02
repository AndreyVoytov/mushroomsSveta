"""Build the standalone /ideas page from the editable editorial content."""
from pathlib import Path
from html import escape
import json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'docs/ideas'
data = json.loads((OUT / 'content.json').read_text(encoding='utf-8'))
e = escape
kinds = {'reskin': 'Рескин', 'evolve': 'Развитие правила', 'new': 'Новая механика'}

chapters = ''
for i, c in enumerate(data['chapters']):
    chapters += f'''<details class="chapter" {'open' if i == 0 else ''}>
    <summary><span class="range">{e(c['range'])}</span><span><small>Глава {i+1:02}</small><strong>{e(c['title'])}</strong></span><span class="plus" aria-hidden="true">+</span></summary>
    <div class="chapter-body"><p class="existing"><b>Сейчас в игре.</b> {e(c['current'])}</p>
    <div class="split"><div><h4>Сюжет</h4><p>{e(c['story'])}</p><h4>Что остаётся после главы</h4><p>{e(c['payoff'])}</p></div>
    <div><h4>На поле</h4><p>{e(c['play'])}</p><h4>Зачем это нужно</h4><p>{e(c['change'])}</p></div></div>
    <blockquote>{e(c['quote'])}</blockquote></div></details>'''

cards = ''
for i, m in enumerate(data['mechanics']):
    cards += f'''<article class="mechanic" id="{m['id']}" data-kind="{m['kind']}">
    <div class="card-top"><span class="tag {m['kind']}">{kinds[m['kind']]}</span><span class="number">{i+1:02}</span></div>
    <h3>{e(m['name'])}</h3><p class="meta">Уровни {e(m['levels'])} · Сложность реализации: {e(m['effort'])}</p>
    <p class="rule">{e(m['rule'])}</p><dl><dt>Решение игрока</dt><dd>{e(m['decision'])}</dd>
    <dt>Что переиспользуем</dt><dd>{e(m['base'])}</dd><dt>С чем сочетать</dt><dd>{e(m['combo'])}</dd>
    <dt>Граница правила</dt><dd>{e(m['guard'])}</dd></dl><div class="priority">{e(m['priority'])}</div></article>'''

prototypes = ''
for p in data['prototypes']:
    prototypes += f'''<article class="prototype"><div class="level">{p['level']}</div><div><h3>{e(p['name'])}</h3>
    <p>{e(p['setup'])}</p><p><b>Что осваиваем.</b> {e(p['lesson'])}</p><p class="verify"><b>Что проверить.</b> {e(p['check'])}</p></div></article>'''

html = '''<!doctype html>
<html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="theme-color" content="#183d32"><meta name="description" content="Сюжет и головоломки уровней 30–100: десять глав, тринадцать механик и шесть идей прототипов.">
<title>Лес помнит дорогу · Идеи для уровней 30–100</title>
<style>
:root{--paper:#f5f3ec;--ink:#23372f;--muted:#68756c;--line:#dcded3;--green:#235746;--lime:#d9e8b6;--orange:#b96938}*{box-sizing:border-box}html{scroll-behavior:smooth;scroll-padding-top:90px}body{margin:0;background:var(--paper);color:var(--ink);font:17px/1.65 system-ui,-apple-system,"Segoe UI",sans-serif}a{color:var(--green);text-underline-offset:4px}button,input{font:inherit}button{cursor:pointer}a:focus-visible,button:focus-visible,summary:focus-visible,input:focus-visible{outline:3px solid #c48838;outline-offset:4px}[hidden]{display:none!important}.wrap{max-width:1160px;margin:auto;padding:0 32px}.top{display:flex;justify-content:space-between;align-items:center;padding-top:22px;padding-bottom:22px;font-size:13px;letter-spacing:.08em;text-transform:uppercase}.top a{text-decoration:none;font-weight:700}.edition{color:var(--muted)}.hero{background:#183d32;color:#f5f4e9;border-radius:24px;padding:54px 56px;position:relative;overflow:hidden}.hero:after{content:"";position:absolute;width:360px;height:360px;border:1px solid #72916c55;border-radius:50%;right:-175px;top:10px;box-shadow:0 0 0 48px #54765418,0 0 0 96px #54765413;pointer-events:none}.eyebrow{color:#c3d5a7;font-size:12px;text-transform:uppercase;letter-spacing:.18em;font-weight:700}h1{font:500 clamp(40px,6vw,70px)/1.08 Georgia,serif;max-width:700px;margin:20px 0}h1 em{font-style:normal;color:#d9e8b6}.hero p{max-width:720px;color:#dbe3d8;font-size:19px}.hero-foot{display:flex;flex-wrap:wrap;gap:24px;margin-top:35px;padding-top:20px;border-top:1px solid #78978055;font-size:14px;color:#dce6d3}.hero-foot strong{color:#fff;font-size:23px;padding-right:5px}.nav{position:sticky;top:0;z-index:10;background:#f5f3ecf5;backdrop-filter:blur(14px);border-bottom:1px solid var(--line);display:flex;gap:26px;padding:18px 0;overflow:auto}.nav a{white-space:nowrap;text-decoration:none;font-size:14px;font-weight:650}.nav a:hover{text-decoration:underline}section{padding-top:66px}h2{font:500 clamp(29px,4vw,41px)/1.2 Georgia,serif;margin:8px 0 16px}h3{font-size:22px;line-height:1.3;margin:15px 0 12px}h4{font-size:12px;text-transform:uppercase;letter-spacing:.12em;margin:0 0 8px;color:var(--green)}p{margin:0 0 17px}.section-number{color:var(--orange);font-size:12px;font-weight:750;text-transform:uppercase;letter-spacing:.14em}.lead{max-width:800px;color:var(--muted);font-size:18px}.note{border-left:3px solid #a8ba91;padding:14px 20px;background:#edf0e5;font-size:15px;margin:25px 0}.recommendation{display:grid;grid-template-columns:repeat(3,1fr);gap:18px;margin:25px 0}.pick{background:#e8eddd;border-radius:12px;padding:23px}.pick span{font-size:12px;letter-spacing:.07em;color:var(--green)}.pick h3{font-size:20px}.pick p{font-size:15px;margin-bottom:10px}.principles{display:grid;grid-template-columns:1fr 1fr;gap:20px 35px;margin-top:28px}.principles p{font-size:16px}.toolbar{display:flex;justify-content:space-between;align-items:center;gap:15px;margin:25px 0 15px}.text-button{border:1px solid #b5c1b0;border-radius:8px;background:transparent;color:var(--green);padding:8px 14px;font-size:14px}.chapter{border-top:1px solid var(--line)}.chapter:last-child{border-bottom:1px solid var(--line)}summary{display:flex;align-items:center;gap:22px;padding:23px 0;cursor:pointer;list-style:none}summary::-webkit-details-marker{display:none}.range{flex:0 0 90px;color:var(--orange);font-size:23px;font-family:Georgia,serif}summary small{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.13em;color:var(--muted);margin-bottom:4px}summary strong{font-size:20px;font-weight:650}.plus{margin-left:auto;font-size:26px;color:var(--green)}details[open] .plus{transform:rotate(45deg)}.chapter-body{padding:0 0 28px 112px}.existing{font-size:14px;color:var(--muted);padding-bottom:15px;border-bottom:1px solid var(--line)}.split{display:grid;grid-template-columns:1fr 1fr;gap:35px}.split p{font-size:16px}blockquote{margin:4px 0 0;padding:17px 23px;border-left:3px solid #c88a56;background:#eee9dd;font-family:Georgia,serif;font-size:19px}.filters{display:flex;flex-wrap:wrap;gap:9px;margin:24px 0 14px}.filter{border:1px solid #cad1c3;border-radius:24px;padding:8px 17px;background:transparent;color:var(--ink);font-size:14px}.filter[aria-pressed="true"]{background:var(--green);border-color:var(--green);color:white}.search{width:100%;max-width:460px;border:1px solid #cad1c3;border-radius:8px;padding:11px 15px;background:#fffdf7;color:var(--ink)}.results{color:var(--muted);font-size:13px;margin:12px 0 20px}.cards{display:grid;grid-template-columns:1fr 1fr;gap:22px}.mechanic{background:#fffdf8;border:1px solid #dcded2;border-radius:16px;padding:27px;display:flex;flex-direction:column;scroll-margin-top:100px}.card-top{display:flex;justify-content:space-between;align-items:center}.tag{font-size:11px;font-weight:750;letter-spacing:.05em;text-transform:uppercase;border-radius:5px;padding:5px 9px;background:#ece6d8;color:#796037}.tag.evolve{background:#e0ebdc;color:#376344}.tag.new{background:#e4e7f0;color:#526282}.number{font:26px Georgia,serif;color:#afb6a7}.meta{font-size:12px;color:var(--muted)}.rule{font-size:16px}dl{font-size:14px;margin:0 0 18px}dt{font-weight:750;color:var(--green);margin-top:13px}dd{margin:3px 0 0}.priority{margin-top:auto;border-top:1px solid var(--line);padding-top:13px;font-size:12px;color:var(--orange);font-weight:700}.prototype{display:flex;gap:25px;padding:24px 0;border-top:1px solid var(--line)}.level{font:34px Georgia,serif;color:var(--orange);flex:0 0 70px;padding-top:13px}.prototype p{font-size:16px}.verify{color:var(--muted);font-size:14px!important}.phases{display:grid;grid-template-columns:repeat(3,1fr);gap:20px}.phase{padding:24px;border-top:3px solid #a9bb91;background:#ecefe5}.phase h3{font-size:19px}.phase p{font-size:15px}.rules{padding-left:23px;max-width:920px}.rules li{margin-bottom:15px}.footer{margin-top:65px;padding:28px 0 45px;border-top:1px solid var(--line);font-size:13px;color:var(--muted)}.footer a{margin-right:18px}.sources{font-size:13px;overflow-wrap:anywhere}.empty{padding:28px;background:#e9eddf;border-radius:12px}.sr{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0)}
@media(max-width:760px){.wrap{padding:0 19px}.top{font-size:11px}.edition{max-width:135px;text-align:right}.hero{padding:32px 26px;border-radius:15px}.hero p{font-size:17px}.hero-foot{gap:12px 20px}.nav{gap:20px}.recommendation,.principles,.cards,.split,.phases{grid-template-columns:1fr}.chapter-body{padding-left:0}.range{flex-basis:67px;font-size:20px}summary{gap:13px}summary strong{font-size:17px}.mechanic{padding:22px}.prototype{gap:12px}.level{flex-basis:48px}section{padding-top:44px}.toolbar{align-items:flex-start}.toolbar .lead{font-size:15px}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}}
@media print{body{background:white;font-size:11pt}.hero{background:white;color:#183d32;padding:0}.hero p,.hero-foot,.hero-foot strong,.eyebrow,h1 em{color:#183d32}.hero:after,.nav,.filters,.search,.toolbar button,.top,.download,.results{display:none}.wrap{max-width:none;padding:0}.chapter-body{padding-left:0}.cards,.recommendation,.phases{display:block}.mechanic,.pick,.phase{break-inside:avoid;margin-bottom:16px}.chapter,.prototype{break-inside:avoid}section{padding-top:24px}.hero-foot{margin-top:12px}h1{font-size:36pt}.footer{margin-top:25px}}
</style></head><body><div class="wrap">
<header class="top"><a href="../">← К игре</a><span class="edition">Заметки по развитию · 30—100</span></header>
<main><div class="hero"><div class="eyebrow">Сюжет × логика поля</div><h1>Лес помнит<br><em>дорогу</em></h1>
<p>Сделать путь от Мрачного Леса до мельницы историей, которую игрок проходит своими решениями.</p>
<div class="hero-foot"><span><strong>10</strong> сюжетных глав</span><span><strong>13</strong> идей предметов</span><span><strong>6</strong> прототипов уровней</span></div></div>
<nav class="nav" aria-label="Разделы страницы"><a href="#direction">Главная идея</a><a href="#story">Сюжет 30–100</a><a href="#mechanics">Предметы и правила</a><a href="#levels">Прототипы</a><a href="#plan">Порядок работ</a></nav>
<section id="direction"><div class="section-number">01 / Направление</div><h2>От чужой легенды — к собственному плану</h2><p class="lead">__PREMISE__</p>
<div class="note"><b>Это предложения, а не описание внедрённых изменений.</b> Основа сверена с текущими репликами и конфигурацией игры. Концепция сохраняет Эмму, Бориса, Совёнка, Хозяйку, Скороходы и мельницу. Из прежнего наброска про «старое русло» сюда не перенесена замена всей сюжетной линии.</div>
<p>Главная правка сюжета: находка должна давать знание или возможность, которыми герои пользуются в следующей главе. Каждые 5–8 уровней — маленький ответ, заметный результат и новый вопрос. Каждые 10–15 — смена вида задач, а не только новый список предметов.</p>
<div class="recommendation"><div class="pick"><span>ПЕРВЫЙ ПРОТОТИП · 33</span><h3><a href="#lantern">Гриб-фонарик</a></h3><p>Новая информация без автоматического открытия. Меняет следующий выбор и помогает почувствовать выход из темноты.</p></div>
<div class="pick"><span>ВТОРОЙ ПРОТОТИП · 67</span><h3><a href="#ribbon">Общая ленточка</a></h3><p>Один узел освобождает несколько коробок. Чердак получает собственное правило, близкое к знакомым блокировкам.</p></div>
<div class="pick"><span>ТРЕТИЙ ПРОТОТИП · 86</span><h3><a href="#root">Батарейный корень</a></h3><p>Соседние открытия заряжают подсказку. Рецепт Скороходов становится действием на поле.</p></div></div>
<div class="principles"><p><b>Эмма.</b> Сначала ищет выход, затем проверяет улики, к 85-му сама распределяет задачи. «Избранность» остаётся вопросом, а поступки уже дают ответ.</p><p><b>Борис.</b> Шутит и ошибается, но замечает важные детали и отвечает за последствия. Сцена с мукой заканчивается его инициативой починить мельницу.</p><p><b>Совёнок.</b> Не только озвучивает решения. Он прячет неловкую ошибку, признаётся в ней и заслуживает доверие, подготовив маршрут.</p><p><b>Хозяйка.</b> Её вещи, пометки и помощь лесу показывают характер раньше встречи. В шаре она действует: удерживает проход ради кого-то ещё.</p></div>
</section>
<section id="story"><div class="section-number">02 / Сюжетный маршрут</div><h2>Десять глав с видимым результатом</h2>
<div class="toolbar"><p class="lead">В каждой главе: существующая опора, изменение сцены и конкретный ход для поля.</p><button class="text-button" id="expand" type="button">Развернуть всё</button></div>__CHAPTERS__</section>
<section id="mechanics"><div class="section-number">03 / Предметы и механики</div><h2>Не каждый новый предмет требует нового правила</h2>
<p class="lead">4 рескина для смены настроения, 6 вариантов развития правил и 3 новые системы. Основной маршрут использует только часть: остальные — альтернативы и резерв для следующей главы.</p>
<p>Сложность — относительная оценка по структуре текущего кода, не обещание сроков. Даже рескину нужны рисунки, привязка к редактору, обучение и проверка читаемости.</p>
<div class="filters" role="group" aria-label="Тип идеи"><button class="filter" data-filter="all" aria-pressed="true">Все идеи</button><button class="filter" data-filter="reskin" aria-pressed="false">Рескины</button><button class="filter" data-filter="evolve" aria-pressed="false">Развитие правил</button><button class="filter" data-filter="new" aria-pressed="false">Новые механики</button></div>
<label for="search" class="sr">Поиск по предметам, уровням и правилам</label><input id="search" class="search" type="search" placeholder="Найти: чердак, корень, лодка…" autocomplete="off">
<p id="results" class="results" aria-live="polite">Показано идей: 13 из 13</p><div class="cards">__CARDS__</div><p class="empty" id="empty" hidden>Совпадений нет. Попробуй другое слово или выбери «Все идеи».</p></section>
<section id="levels"><div class="section-number">04 / Проверить в игре</div><h2>Шесть маленьких прототипов</h2><p class="lead">Это задания для дизайна карт, не готовые сбалансированные уровни. Количество ходов и энергии нужно подобрать после проверки раскладок.</p>__PROTOTYPES__</section>
<section id="plan"><div class="section-number">05 / Что делать сначала</div><h2>Собрать дугу, затем усложнять поле</h2>
<div class="phases"><div class="phase"><h3>1. Связать существующие сцены</h3><p>Переписать переходы 32 → 37 → 47, сделать неверного совёнка полезной находкой, показать пустой заряд сапог заранее. На 99-м дать Борису инициативу исправить ошибку.</p><p>Добавить в дневник ленту, очки, маршрут и рецепт. Это сохраняет смысл прохождения между диалогами.</p></div>
<div class="phase"><h3>2. Проверить три правила</h3><p>Сделать по одному полю для фонарика, ленточки и корня. Только после понятного первого прохождения добавлять закрепление и комбинации.</p><p>Фонарик и корень используют общий показ чисел на закрытых клетках — одна доработка работает в двух главах.</p></div>
<div class="phase"><h3>3. Расширить после сотого</h3><p>Сначала течение и причал, затем шлюз. Ракушку-эхо оставить резервом, если берегу понадобится дополнительное развитие.</p><p>Выдвижной ящик — альтернатива ленточке, если та окажется слишком похожей на обычную блокировку.</p></div></div>
<h3>Правила, которые удержат всё вместе</h3><ol class="rules">
<li><b>Сохранять доверие к числам.</b> Скрытое содержимое фиксируется при создании поля. Новые механики меняют доступ или объём информации. Если когда-нибудь понадобится менять содержимое — это отдельная задача с явным обновлением всех затронутых подсказок.</li>
<li><b>Одна новая причина подумать за раз.</b> Вводный уровень → повторение → сочетание с одним знакомым правилом → передышка. На 57-м, 61-м, 93-м и 97-м не перекрывать обучение уже существующим новинкам.</li>
<li><b>Никакой гонки на время.</b> Фонарик не гаснет по таймеру, корень не теряет заряд от размышления, лодка движется по действию игрока. Темп остаётся темпом головоломки.</li>
<li><b>Сюжетная улика гарантирована.</b> Ключ к следующей сцене не зависит от редкого выпадения, рекламы или докупки. Выбранный сложный маршрут может давать приятный бонус, но не право увидеть сюжет.</li>
<li><b>Не ломать бустеры и подсветку.</b> Для ракеты и массового открытия заранее определить порядок событий и однократность наград. Жёлтая подсветка остаётся 100% opacity; новые связи отмечаются нитями, символами и формой, а не снижением яркости подсказки.</li>
<li><b>Показывать последствия.</b> После спасения зверька остаётся пустая паутинка, после чердака — собранный набор, после зарядки — светящиеся камни сапог. На 100-м дверь мельницы действительно открывается.</li></ol>
<div class="note"><b>Чего я бы не добавлял в 30–100:</b> голод с постоянной потерей ресурса; кражу собранных целей; случайное перемешивание содержимого после прочтения цифр; несколько цветов зарядов; отдельную игру «вращай трубы» внутри обычного уровня. Они требуют много обучения и размывают основу.</div>
<h3>Как понять, что идея работает</h3><p>После первого знакомства игрок может одной фразой предсказать результат нажатия. На следующем уровне использует правило без повторной длинной подсказки. У комбинации есть понятная выгода и хотя бы один запасной путь. Если меняется только название предмета, честно считать это рескином, а разнообразие искать в геометрии и целях.</p>
<p class="sources">Опоры: ReplicasConfiguration.ts и русские тексты сцен r34c–r99; ForestReplicasConfiguration.ts (fr6–fr9); ForestConfiguration.ts; правила соседних открытий, ульев, лиан, ракушек и лодок в ForestScreen.ts. Указанные будущие события, свойства предметов и раскладки — авторские предложения по этим исходникам.</p>
</section></main><footer class="footer"><p>Идеи для обсуждения и прототипирования · Уровни 30–100 · Обновлено 2 октября 2026</p><a href="../">Вернуться в игру</a><a class="download" href="ideas.md" download>Скачать текст .md</a><a class="download" href="content.json" download>Данные страницы .json</a></footer></div>
<script>
(()=>{'use strict';
 const cards=Array.from(document.querySelectorAll('.mechanic'));
 const filters=Array.from(document.querySelectorAll('[data-filter]'));
 const input=document.getElementById('search');let kind='all';
 function update(){const q=input.value.toLocaleLowerCase('ru').trim();let count=0;
 cards.forEach(card=>{const match=(kind==='all'||card.dataset.kind===kind)&&card.textContent.toLocaleLowerCase('ru').includes(q);card.hidden=!match;if(match)count++;});
 document.getElementById('results').textContent='Показано идей: '+count+' из '+cards.length;
 document.getElementById('empty').hidden=count!==0;}
 filters.forEach(button=>button.addEventListener('click',()=>{kind=button.dataset.filter;filters.forEach(b=>b.setAttribute('aria-pressed',String(b===button)));update();}));
 input.addEventListener('input',update);
 const chapters=Array.from(document.querySelectorAll('.chapter'));const expand=document.getElementById('expand');
 const label=()=>{expand.textContent=chapters.every(c=>c.open)?'Свернуть всё':'Развернуть всё';};
 expand.addEventListener('click',()=>{const open=!chapters.every(c=>c.open);chapters.forEach(c=>c.open=open);label();});chapters.forEach(c=>c.addEventListener('toggle',label));
 function revealHash(){const target=document.getElementById(location.hash.slice(1));if(target&&target.classList.contains('mechanic')){kind='all';input.value='';filters.forEach(b=>b.setAttribute('aria-pressed',String(b.dataset.filter==='all')));update();target.scrollIntoView();}}
 window.addEventListener('hashchange',revealHash);revealHash();
 let printState=[];window.addEventListener('beforeprint',()=>{printState=chapters.map(c=>c.open);chapters.forEach(c=>c.open=true);cards.forEach(c=>c.hidden=false);});window.addEventListener('afterprint',()=>{chapters.forEach((c,i)=>c.open=printState[i]);update();});
})();
</script></body></html>'''
html = html.replace('__PREMISE__', e(data['premise'])).replace('__CHAPTERS__', chapters).replace('__CARDS__', cards).replace('__PROTOTYPES__', prototypes)
(OUT / 'index.html').write_text(html, encoding='utf-8')
md = f"# {data['title']}\n\n{data['subtitle']}\n\nПредложения, не внедрённые изменения.\n\n{data['premise']}\n\n## Сюжет\n"
for c in data['chapters']:
    md += f"\n### {c['range']}. {c['title']}\n\n"
    for label,key in [('Сейчас','current'),('Предложение','story'),('На поле','play'),('Зачем','change'),('Результат','payoff'),('Реплика','quote')]: md += f"**{label}:** {c[key]}\n\n"
md += '\n## Предметы и механики\n'
for m in data['mechanics']:
    md += f"\n### {m['name']}\n\n{kinds[m['kind']]} · {m['levels']} · Сложность: {m['effort']}\n\n"
    for label,key in [('Правило','rule'),('Решение','decision'),('Основа','base'),('Сочетание','combo'),('Ограничение','guard'),('Приоритет','priority')]: md += f"**{label}:** {m[key]}\n\n"
md += '\n## Прототипы\n'
for p in data['prototypes']: md += f"\n### {p['level']}. {p['name']}\n\n{p['setup']}\n\n{p['lesson']}\n\n**Проверить:** {p['check']}\n"
(OUT / 'ideas.md').write_text(md, encoding='utf-8')
print(f"Built {OUT / 'index.html'}: {len(data['chapters'])} chapters, {len(data['mechanics'])} mechanics, {len(data['prototypes'])} prototypes")
