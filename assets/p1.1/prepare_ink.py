"""Deterministic single-image ink derivative; execute in the pinned asset container."""
from pathlib import Path
import hashlib,json,sys
from PIL import Image,ImageOps,ImageFilter,features,__version__
ROOT=Path(__file__).resolve().parents[2]
SOURCE=ROOT/"docs/waves/P1.1/references/assets/ink-wu-yun-landscape.jpg"
OUTPUT=ROOT/"frontend/public/ink/landscape.webp"
EVIDENCE=ROOT/"docs/waves/P1.1/evidence/assets"
SOURCE_HASH="846674ae63b4e6a51e8b60079120861711dc62afbd0d585bffb6e2e0dbad1e60"
CROP=(0,1050,3000,2100)
SIZE=(1600,560)
def main():
 assert __version__=="11.3.0"
 raw=SOURCE.read_bytes();assert hashlib.sha256(raw).hexdigest()==SOURCE_HASH
 with Image.open(SOURCE) as original:
  assert original.size==(4000,3000)
  gray=ImageOps.grayscale(original.crop(CROP)).resize(SIZE,Image.Resampling.LANCZOS)
 gray=ImageOps.autocontrast(gray.filter(ImageFilter.GaussianBlur(0.4)),cutoff=1)
 gray=gray.point([round(255*(v/255)**0.88) for v in range(256)])
 image=ImageOps.colorize(gray,black=(105,117,136),white=(249,250,248))
 OUTPUT.parent.mkdir(parents=True,exist_ok=True)
 image.save(OUTPUT,format="WEBP",quality=40,method=6,exact=True)
 data=OUTPUT.read_bytes();assert len(data)<=80*1024,len(data)
 with Image.open(OUTPUT) as check:
  check.load();assert check.size==SIZE and check.format=="WEBP"
  extrema=check.convert("L").getextrema();assert extrema[1]-extrema[0]>80
 record={"taskId":"P11-ASSET","specVersion":"P1.1-1.0.0","executionBase":"c1d3efc8b5710e1f99c0d45e09c7023aa95b99ef","source":{"path":SOURCE.relative_to(ROOT).as_posix(),"sha256":SOURCE_HASH,"bytes":len(raw),"author":"Wu Yun / 吴云 (1811–1883)","title":"Landscape / 仙霞新霁图","date":"1854","objectId":737785,"accession":"2024.549.47","sourceUrl":"https://www.metmuseum.org/art/collection/search/737785","downloadUrl":"https://images.metmuseum.org/CRDImages/as/original/DP-42597-004.jpg","license":"Public Domain / CC0","licenseUrl":"https://www.metmuseum.org/hubs/open-access","metadataEvidence":"docs/waves/P1.1/references/manifest.json","obtainedDate":"2026-10-30"},"processing":{"cropLeftTopRightBottom":list(CROP),"resampling":"LANCZOS","grayscale":"Pillow ImageOps.grayscale","paperTextureFilter":{"type":"GaussianBlur","radius":0.4},"autocontrastCutoffPercent":1,"gamma":0.88,"gammaFormula":"round(255*(v/255)**0.88)","colorizeBlack":[105,117,136],"colorizeWhite":[249,250,248],"encoding":{"format":"WEBP","quality":40,"method":6,"exact":True,"metadata":"none"}},"output":{"path":OUTPUT.relative_to(ROOT).as_posix(),"url":"/ink/landscape.webp","width":SIZE[0],"height":SIZE[1],"bytes":len(data),"sha256":hashlib.sha256(data).hexdigest(),"mimeType":"image/webp","grayscaleExtrema":list(extrema),"targetBytes":65536,"capBytes":81920},"toolchain":{"python":sys.version.split()[0],"pillow":__version__,"libwebp":features.version("webp"),"libjpeg":features.version("jpg"),"baseImage":"python:3.12.12-slim@sha256:f3fa41d74a768c2fce8016b98c191ae8c1bacd8f1152870a3f9f87d350920b7c"},"usage":"One shared local image for aligned clear/fog layers; no raw museum image or runtime external request"}
 EVIDENCE.mkdir(parents=True,exist_ok=True)
 (EVIDENCE/"production-manifest.json").write_text(json.dumps(record,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
 print(json.dumps(record["output"],ensure_ascii=False,indent=2))
if __name__=="__main__":main()
