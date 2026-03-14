# fancyfont

Menu-drevet MVP til generering af font-stil fra et cloud-bibliotek (prototype).

## Hvad kan den nu?

- Vælge stil (sans/serif/mono)
- Justere weight, width, kontrast og rounding via menu
- Live preview af sample-tekst
- Generere en "font-opskrift" (JSON) som kan bruges af en backend pipeline

## Kør lokalt

```bash
python3 -m http.server 8000
```

Åbn derefter: <http://localhost:8000>

## Næste trin

- Koble til rigtig cloud font metadata-katalog
- Tilføje backend job-queue for reel eksport til WOFF2/TTF
- Udvide akser og presets (brand-profiler)
