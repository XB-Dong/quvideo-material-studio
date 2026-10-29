"""Run in Dockerfile.assets container with repository mounted at /workspace."""
from pathlib import Path
from io import BytesIO
import hashlib,json
from PIL import Image,ImageOps,__version__
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/'docs/waves/P1/references'
OUTPUT=ROOT/'backend/src/main/resources/demo'
EVIDENCE=ROOT/'docs/waves/P1/evidence/assets'
MAPPING={'travel':('postcard',(.5,.5)),'pet':('pet',(.84,.5)),'portrait':('portrait',(.85,.5)),'abstract':('story',(.5,.5))}
def main():
 EVIDENCE.mkdir(parents=True,exist_ok=True);records=[]
 for source in json.loads((SOURCE/'manifest.json').read_text())['assets']:
  data=(SOURCE/source['file']).read_bytes();assert hashlib.sha256(data).hexdigest()==source['sha256']
  key,center=MAPPING[source['id']];image=ImageOps.exif_transpose(Image.open(BytesIO(data))).convert('RGB')
  # Original horizontal photos have 640px short edge; preserve pixels instead of upscaling.
  cover=ImageOps.fit(image,(480,640),Image.Resampling.LANCZOS,centering=center)
  cover_path=OUTPUT/(key+'-p1-cover.jpg');cover.save(cover_path,format='JPEG',quality=86,optimize=True,progressive=True,subsampling=0)
  assert cover_path.stat().st_size<=180*1024
  result=image.copy();result.thumbnail((960,960),Image.Resampling.LANCZOS);result_path=OUTPUT/(key+'-p1-result.png')
  while True:
   result.save(result_path,format='PNG',optimize=True,compress_level=9)
   if result_path.stat().st_size<=1024*1024:break
   result=result.resize((int(result.width*.9),int(result.height*.9)),Image.Resampling.LANCZOS)
  for path,kind in [(cover_path,'cover'),(result_path,'result')]:
   raw=path.read_bytes()
   with Image.open(path) as check:
    check.load();records.append(dict(templateId=source['templateId'],kind=kind,key=path.name,mimeType=Image.MIME[check.format],width=check.width,height=check.height,bytes=len(raw),sha256=hashlib.sha256(raw).hexdigest(),sourceSha256=source['sha256'],sourceUrl=source['sourceUrl'],author=source['author'],license='Unsplash License',cropCenter=list(center) if kind=='cover' else None))
 out=dict(tool='Pillow '+__version__,imagePolicy='RGB; no recolor; results preserve full framing',baseCommit='7997279301ce28c1bf1ee5e15d971aa7243a645c',assets=records)
 (EVIDENCE/'production-manifest.json').write_text(json.dumps(out,ensure_ascii=False,indent=2)+'\n',encoding='utf-8');print(json.dumps(out,ensure_ascii=False,indent=2))
if __name__=='__main__':main()
