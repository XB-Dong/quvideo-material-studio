from pathlib import Path
import zlib,struct,math
out=Path(__file__).resolve().parents[1]/"src/main/resources/demo"
out.mkdir(parents=True,exist_ok=True)
def chunk(kind,data):return struct.pack(">I",len(data))+kind+data+struct.pack(">I",zlib.crc32(kind+data)&0xffffffff)
for name,palette in {"postcard":((243,186,145),(39,105,119)),"pet":((215,197,167),(88,93,63)),"story":((194,176,234),(82,69,124)),"portrait":((245,161,128),(94,64,106))}.items():
 w,h=600,900;raw=bytearray()
 for y in range(h):
  raw.append(0)
  for x in range(w):
   t=y/h;a,b=palette;c=[int(a[i]*(1-t)+b[i]*t) for i in range(3)]
   if (x-420)**2+(y-210)**2<75**2:c=[255,224,175]
   if y>540+95*math.sin(x/145):c=[int(v*.67) for v in b]
   if y>720+40*math.sin(x/75):c=[int(v*.85) for v in b]
   if name=="pet" and ((x-300)**2/140**2+(y-420)**2/170**2<1):c=[232,220,192]
   if name=="pet" and ((x-250)**2+(y-400)**2<10**2 or (x-350)**2+(y-400)**2<10**2):c=[49,44,37]
   if name=="portrait" and (x-300)**2/110**2+(y-400)**2/160**2<1:c=[219,174,147]
   raw.extend(c)
 png=b"\x89PNG\r\n\x1a\n"+chunk(b"IHDR",struct.pack(">IIBBBBB",w,h,8,2,0,0,0))+chunk(b"IDAT",zlib.compress(bytes(raw),9))+chunk(b"IEND",b"")
 (out/(name+".png")).write_bytes(png)
