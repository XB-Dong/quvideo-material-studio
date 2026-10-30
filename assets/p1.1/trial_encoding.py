from pathlib import Path
from PIL import Image,ImageOps,ImageFilter
from io import BytesIO
import json
s=Image.open("docs/waves/P1.1/references/assets/ink-wu-yun-landscape.jpg").crop((0,1050,3000,2100)).convert("L").resize((1600,560),Image.Resampling.LANCZOS)
results=[]
for blur in [0,0.4,0.6]:
 im=ImageOps.autocontrast(s.filter(ImageFilter.GaussianBlur(blur)),cutoff=1).point([round(255*(v/255)**0.88) for v in range(256)])
 im=ImageOps.colorize(im,(105,117,136),(249,250,248))
 for q in [40,50,60]:
  b=BytesIO();im.save(b,format="WEBP",quality=q,method=6,exact=True);results.append(dict(width=1600,height=560,blur=blur,quality=q,bytes=len(b.getvalue())))
Path("docs/waves/P1.1/evidence/assets/encoding-trials.json").write_text(json.dumps(results,indent=2)+"\n")
print(json.dumps(results,indent=2))
