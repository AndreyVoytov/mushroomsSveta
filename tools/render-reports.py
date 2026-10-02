from html import escape
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parents[1]


def inline(text):
    text = escape(text, quote=False)
    text = re.sub(r'`([^`]+)`', r'<code>\1</code>', text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'!\[([^\]]*)\]\(([^)]+)\)', r'<img alt="\1" src="\2">', text)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
    return text


def render_markdown(markdown):
    lines = markdown.splitlines()
    out = []
    paragraph = []
    table = []
    listing = None

    def flush_paragraph():
        if paragraph:
            out.append('<p>' + inline(' '.join(paragraph)) + '</p>')
            paragraph.clear()

    def flush_table():
        if not table:
            return
        rows = [[cell.strip() for cell in row.strip().strip('|').split('|')] for row in table]
        rows = [row for row in rows if not all(re.fullmatch(r':?-{3,}:?', cell) for cell in row)]
        if rows:
            out.append('<div class="table-wrap"><table>')
            for index, row in enumerate(rows):
                out.append('<tr>' + ''.join(('<th>' if index == 0 else '<td>') + inline(cell) + ('</th>' if index == 0 else '</td>') for cell in row) + '</tr>')
            out.append('</table></div>')
        table.clear()

    def close_list():
        nonlocal listing
        if listing:
            out.append('</' + listing + '>')
            listing = None

    for line in lines:
        stripped = line.strip()
        if not stripped:
            flush_paragraph(); flush_table(); close_list(); continue
        if stripped.startswith('|'):
            flush_paragraph(); close_list(); table.append(stripped); continue
        flush_table()
        heading = re.match(r'^(#{1,4})\s+(.*)$', stripped)
        if heading:
            flush_paragraph(); close_list()
            level = min(len(heading.group(1)) + 1, 5)
            out.append(f'<h{level}>' + inline(heading.group(2)) + f'</h{level}>')
            continue
        bullet = re.match(r'^-\s+(.*)$', stripped)
        if bullet:
            flush_paragraph()
            if listing != 'ul': close_list(); listing = 'ul'; out.append('<ul>')
            out.append('<li>' + inline(bullet.group(1)) + '</li>')
            continue
        if listing:
            close_list()
        if stripped.startswith('!['):
            flush_paragraph(); out.append('<figure>' + inline(stripped) + '</figure>')
        else:
            paragraph.append(stripped)
    flush_paragraph(); flush_table(); close_list()
    return '\n'.join(out)


files = ['sphere-booster-ideas-ru.md', 'level-novelty-analysis-ru.md']
sections = []
for filename in files:
    source = (ROOT / 'docs' / filename).read_text(encoding='utf-8-sig')
    title = source.splitlines()[0].lstrip('# ').strip()
    sections.append(f'<article><a class="source" href="{filename}">Открыть Markdown</a>{render_markdown(source)}</article>')

page = '''<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Идеи и анализ уровней</title><style>
*{box-sizing:border-box}body{margin:0;background:#f4f2e9;color:#24352f;font:17px/1.65 system-ui,-apple-system,"Segoe UI",sans-serif}
main{max-width:1060px;margin:0 auto;padding:30px 22px 70px}header{padding:20px 8px 24px}h1{font-size:34px;line-height:1.2;margin:0 0 8px}header p{color:#5c6c64;margin:0}
article{position:relative;background:#fffdf7;border:1px solid #e5e0d3;border-radius:18px;padding:30px 34px;margin:20px 0;box-shadow:0 8px 26px #263b2910}
h2{font-size:28px;margin:0 0 18px}h3{font-size:21px;margin:28px 0 10px}h4{font-size:18px;margin:24px 0 8px}p{margin:10px 0}ul{padding-left:25px}li{margin:6px 0}
.source{position:absolute;right:32px;top:34px;font-size:13px;color:#397f78;text-decoration:none}.source:hover{text-decoration:underline}
.table-wrap{overflow-x:auto;margin:18px 0}table{width:100%;border-collapse:collapse;font-size:15px}th,td{padding:10px 12px;border-bottom:1px solid #e8e4d9;text-align:left;vertical-align:top}th{background:#f3f0e4;color:#35473d}tr:nth-child(even) td{background:#fcfaf4}
figure{margin:20px 0;text-align:center}figure img{display:block;width:100%;height:auto;border-radius:10px}code{background:#f0eee5;padding:2px 5px;border-radius:4px;font-size:.92em}strong{color:#273e34}
.gallery{background:#fffdf7;border:1px solid #e5e0d3;border-radius:18px;padding:20px 26px;margin:0 0 20px}.gallery img{max-width:100%;height:auto;display:block;margin:12px auto;border-radius:10px}.gallery h2{margin:0}
@media(max-width:640px){main{padding:16px 10px 42px}article{padding:25px 18px;border-radius:12px}.source{position:static;display:block;margin-bottom:10px}h1{font-size:28px}h2{font-size:23px}}
</style></head><body><main><header><h1>Идеи бустера и темп уровней</h1><p>Предложения по замене Сферы и разбор первых появлений механик, целей и локаций.</p></header><section class="gallery"><h2>Новые предметы поля</h2><img src="field-items-preview.png" alt="Новые версии найденных предметов"><h3>Набор тёмного леса</h3><img src="dark-items-preview.png" alt="Мшистый камень, тёмное дерево, трухлявый пень и паутинный лог"></section>''' + '\n'.join(sections) + '</main></body></html>'
(ROOT / 'docs' / 'index.html').write_text(page, encoding='utf-8')
print('Rendered docs/index.html')
