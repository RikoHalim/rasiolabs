from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, unquote

root=Path(__file__).resolve().parents[1]/'dist'
class Page(HTMLParser):
 def __init__(self,text):
  super().__init__();self.ids=[];self.links=[];self.h1=0;self.feed(text)
 def handle_starttag(self,tag,attrs):
  a=dict(attrs)
  if 'id' in a:self.ids.append(a['id'])
  if tag=='h1':self.h1+=1
  for attr in ('src','href'):
   if attr in a:self.links.append(a[attr])
pages={p.name:Page(p.read_text(encoding='utf-8')) for p in root.glob('*.html')}
errors=[]
for name,p in pages.items():
 if len(p.ids)!=len(set(p.ids)):errors.append(f'{name}: duplicate id')
 if name!='order.html' and p.h1!=1:errors.append(f'{name}: h1={p.h1}')
 for link in p.links:
  u=urlsplit(link)
  if u.scheme or u.netloc:continue
  path=unquote(u.path).lstrip('/') or (name if not u.path else 'index.html')
  if path.endswith('/'):path+='index.html'
  if not (root/path).exists():errors.append(f'{name}: missing {link}')
  elif u.fragment and path in pages and u.fragment not in pages[path].ids:errors.append(f'{name}: missing anchor {link}')
assert not errors,'\n'.join(errors)
print(f'PASS: {len(pages)} pages; local links, assets, IDs, anchors, and headings verified.')
