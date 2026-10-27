"""Render every Orbit Index watch face image for the Amazfit GTR Mini (416x416).

Usage:
    git clone --depth 1 https://github.com/RedHatOfficial/RedHatFont.git generator/RedHatFont
    pip install playwright && playwright install chromium
    python generator/run.py assets-out

Set RED_HAT_FONTS to point somewhere else if the fonts live elsewhere.
"""
import base64, json, os, pathlib, sys
from playwright.sync_api import sync_playwright

here = pathlib.Path(__file__).parent
fonts = pathlib.Path(os.environ.get("RED_HAT_FONTS", here / "RedHatFont" / "fonts"))
out = pathlib.Path(sys.argv[1])
out.mkdir(parents=True, exist_ok=True)

def face(name, path, weight):
    b64 = base64.b64encode((fonts / path).read_bytes()).decode()
    return f"@font-face{{font-family:'{name}';src:url(data:font/ttf;base64,{b64});font-weight:{weight}}}"

css = "".join([
    face("RHD", "Proportional/RedHatDisplay/ttf/RedHatDisplay-Medium.ttf", 500),
    face("RHD", "Proportional/RedHatDisplay/ttf/RedHatDisplay-SemiBold.ttf", 600),
    face("RHD", "Proportional/RedHatDisplay/ttf/RedHatDisplay-Bold.ttf", 700),
    face("RHM", "Mono/RedHatMono/ttf/RedHatMono-SemiBold.ttf", 600),
])
# spans force the browser to load every face before generate() runs
html = f"""<!doctype html><meta charset=utf-8><style>{css}</style>
<span style="font:500 12px RHD">0</span><span style="font:600 12px RHD">0</span><span style="font:700 12px RHD">0</span><span style="font:600 12px RHM">0</span>
<script>{(here / 'gen.js').read_text()}</script>"""

with sync_playwright() as p:
    b = p.chromium.launch()
    pg = b.new_page()
    errs = []
    pg.on("pageerror", lambda e: errs.append(str(e)))
    pg.set_content(html)
    pg.evaluate("Promise.all([document.fonts.load('500 12px RHD'),document.fonts.load('600 12px RHD'),document.fonts.load('700 12px RHD'),document.fonts.load('600 12px RHM')])")
    res = pg.evaluate("generate()")
    b.close()
if errs:
    print("ERRORS", errs); sys.exit(1)

for path, url in res["files"].items():
    f = out / path
    f.parent.mkdir(parents=True, exist_ok=True)
    f.write_bytes(base64.b64decode(url.split(",", 1)[1]))
(out / "_layout.json").write_text(json.dumps(res["layout"], indent=2))
print(json.dumps(res["layout"], indent=1))
print(len(res["files"]), "files")
