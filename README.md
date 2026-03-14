# fancyfont

Menu-drevet MVP til generering af font-stil fra et cloud-bibliotek (prototype).

## Hvad kan den nu?

- Vælge stil (sans/serif/slab serif/script/display/mono)
- Justere hældning, weight, width, kontrast og rounding via menu
- Integrere dit fontbibliotek fra iCloud via JSON-fil eller iCloud-link
- Vælge font-familie direkte fra indlæst bibliotek
- Live preview af sample-tekst
- Generere en "font-opskrift" (JSON) som kan bruges af en backend pipeline

## iCloud integration (MVP)

Appen understøtter iCloud integration ved at indlæse et font-katalog i JSON-format.

Du kan enten:

1. Eksportere metadata fra dit bibliotek til en `.json` fil og vælge den i UI, eller
2. Bruge et offentligt iCloud-delingslink til JSON-filen.

### Forventet JSON-format

```json
{
  "fonts": [
    {
      "family": "My Sans",
      "style": "sans",
      "stack": "My Sans, Inter, sans-serif",
      "source": "icloud"
    },
    {
      "family": "My Serif",
      "style": "serif",
      "stack": "My Serif, Georgia, serif",
      "source": "icloud"
    }
  ]
}
```

> `style` skal være en af: `sans`, `serif`, `slab`, `script`, `display`, `mono`.

## Kør lokalt

```bash
python3 -m http.server 8000
```

Åbn derefter: <http://localhost:8000>

## Deploy via GitHub Pages

Ja — denne app er statisk, så den passer perfekt til GitHub Pages.

1. Push branch til GitHub (helst `main`).
2. Gå til **Settings → Pages** i repoet.
3. Under **Build and deployment**, vælg **Source: GitHub Actions**.
4. Workflowen i `.github/workflows/pages.yml` deployer automatisk ved push til `main`.
5. Når workflowen er grøn, ligger siden typisk på:
   - `https://<brugernavn>.github.io/<repo-navn>/`

> Hvis siden ikke loader korrekt med assets, så bekræft at `index.html`, `styles.css` og `app.js` ligger i repo-roden (som nu).

## Næste trin

- Koble på rigtig iCloud API/auth flow via backend (token + sync-job)
- Tilføje backend job-queue for reel eksport til WOFF2/TTF
- Udvide akser og presets (brand-profiler)
