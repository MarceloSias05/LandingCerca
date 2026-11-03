# Recorta Newsreader (OFL) a una instancia estática y al juego de caracteres de la landing.
# Origen: @fontsource-variable/newsreader (npm pack), archivos latin-opsz-*.woff2.
# Requiere fonttools + brotli (pip, en un venv). Uso:
#   python -I subset-newsreader.py <entrada.woff2> <salida.woff2> <wght_min> <wght_max> <opsz_min> <opsz_max>
#   Titular:  ... newsreader-latin-opsz-normal.woff2 Newsreader-500-display.woff2 500 500 60 60
#   Itálica:  ... newsreader-latin-opsz-italic.woff2 Newsreader-400-italic.woff2 400 400 36 36
import sys
from fontTools.ttLib import TTFont
from fontTools.varLib import instancer
from fontTools import subset
src,dst,wlo,whi,olo,ohi=sys.argv[1:7]
f=TTFont(src)
rng=lambda a,b:(float(a) if a==b else (float(a),float(b)))
f=instancer.instantiateVariableFont(f,{"wght":rng(wlo,whi),"opsz":rng(olo,ohi)})
opts=subset.Options(); opts.flavor="woff2"; opts.layout_features=["kern","liga","calt","ccmp","locl","mark","mkmk","onum","lnum","pnum","tnum","case"]; opts.name_IDs=["*"]; opts.notdef_outline=True
text="".join(chr(c) for c in range(0x20,0x7f))+"".join(chr(c) for c in range(0xa0,0x100))+"¿¡«»“”‘’—–·…•→←↻€"
s=subset.Subsetter(opts); s.populate(text=text); s.subset(f)
f.flavor="woff2"; f.save(dst)
