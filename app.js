const styleMap = {
  sans: 'Inter, system-ui, sans-serif',
  serif: '"Iowan Old Style", "Times New Roman", Georgia, serif',
  slab: '"Rockwell", "Roboto Slab", "Courier New", serif',
  script: '"Brush Script MT", "Segoe Script", "Snell Roundhand", cursive',
  display: '"Impact", "Haettenschweiler", "Arial Black", sans-serif',
  mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
};

const inclinationMap = {
  upright: { fontStyle: 'normal', slnt: 0, ital: 0 },
  slanted: { fontStyle: 'oblique', slnt: -10, ital: 0 },
  italic: { fontStyle: 'italic', slnt: 0, ital: 1 },
};

const fallbackCatalog = [
  { family: 'Inter', style: 'sans', stack: 'Inter, system-ui, sans-serif', source: 'default' },
  { family: 'Merriweather', style: 'serif', stack: 'Merriweather, Georgia, serif', source: 'default' },
  { family: 'Roboto Slab', style: 'slab', stack: '"Roboto Slab", Rockwell, serif', source: 'default' },
  { family: 'Pacifico', style: 'script', stack: 'Pacifico, "Brush Script MT", cursive', source: 'default' },
  { family: 'Bungee', style: 'display', stack: 'Bungee, Impact, sans-serif', source: 'default' },
  { family: 'JetBrains Mono', style: 'mono', stack: '"JetBrains Mono", Consolas, monospace', source: 'default' },
];

let currentCatalog = [...fallbackCatalog];

const refs = {
  style: document.getElementById('style'),
  inclination: document.getElementById('inclination'),
  catalogFont: document.getElementById('catalogFont'),
  libraryFile: document.getElementById('libraryFile'),
  libraryUrl: document.getElementById('libraryUrl'),
  loadFromUrl: document.getElementById('loadFromUrl'),
  libraryStatus: document.getElementById('libraryStatus'),
  weight: document.getElementById('weight'),
  width: document.getElementById('width'),
  contrast: document.getElementById('contrast'),
  round: document.getElementById('round'),
  previewText: document.getElementById('previewText'),
  preview: document.getElementById('preview'),
  recipe: document.getElementById('recipe'),
  weightValue: document.getElementById('weightValue'),
  widthValue: document.getElementById('widthValue'),
  contrastValue: document.getElementById('contrastValue'),
  roundValue: document.getElementById('roundValue'),
};

function setLibraryStatus(message, isError = false) {
  refs.libraryStatus.textContent = message;
  refs.libraryStatus.dataset.error = isError ? 'true' : 'false';
}

function normalizeCatalogEntry(entry) {
  if (!entry || typeof entry !== 'object') {
    return null;
  }

  const family = String(entry.family || '').trim();
  if (!family) {
    return null;
  }

  const style = String(entry.style || 'sans').toLowerCase();
  return {
    family,
    style: Object.hasOwn(styleMap, style) ? style : 'sans',
    stack: String(entry.stack || family),
    source: String(entry.source || 'icloud'),
  };
}

function parseCatalogPayload(payload) {
  const list = Array.isArray(payload?.fonts)
    ? payload.fonts
    : Array.isArray(payload)
      ? payload
      : null;

  if (!list) {
    throw new Error('Formatfejl: JSON skal være et array eller et objekt med feltet "fonts".');
  }

  const normalized = list.map(normalizeCatalogEntry).filter(Boolean);

  if (!normalized.length) {
    throw new Error('Ingen gyldige font-familier fundet i biblioteket.');
  }

  return normalized;
}

function renderCatalogOptions() {
  refs.catalogFont.innerHTML = '';

  currentCatalog.forEach((font, index) => {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = `${font.family} (${font.style})`;
    refs.catalogFont.append(option);
  });
}

function getSelectedCatalogFont() {
  const idx = Number(refs.catalogFont.value || 0);
  return currentCatalog[idx] || currentCatalog[0] || fallbackCatalog[0];
}

function syncStyleToCatalog() {
  const selected = getSelectedCatalogFont();
  refs.style.value = selected.style;
}

function applyPreview() {
  const style = refs.style.value;
  const inclination = refs.inclination.value;
  const selectedFont = getSelectedCatalogFont();
  const weight = refs.weight.value;
  const width = refs.width.value;
  const contrast = refs.contrast.value;
  const round = refs.round.value;
  const text = refs.previewText.value.trim();
  const inclinationAxes = inclinationMap[inclination];

  refs.weightValue.value = weight;
  refs.widthValue.value = width;
  refs.contrastValue.value = contrast;
  refs.roundValue.value = round;

  const familyStack = selectedFont?.stack || styleMap[style];

  refs.preview.style.setProperty('--preview-family', familyStack);
  refs.preview.style.setProperty('--preview-font-style', inclinationAxes.fontStyle);
  refs.preview.style.setProperty('--preview-weight', weight);
  refs.preview.style.setProperty('--preview-width', `${width}%`);
  refs.preview.style.setProperty('--preview-contrast', `${contrast / 100}em`);
  refs.preview.style.setProperty('--preview-rounding', `${round}px`);
  refs.preview.textContent = text || 'Skriv noget tekst for preview...';

  refs.recipe.textContent = JSON.stringify(
    {
      sourceLibrary: selectedFont?.source || 'Cloud Font Catalog',
      selectedFamily: selectedFont?.family || 'N/A',
      generatedAt: new Date().toISOString(),
      style,
      inclination,
      axes: {
        wght: Number(weight),
        wdth: Number(width),
        cntr: Number(contrast),
        rnd: Number(round),
        slnt: inclinationAxes.slnt,
        ital: inclinationAxes.ital,
      },
      export: {
        format: 'woff2 (MVP)',
        mode: 'recipe-only prototype',
      },
    },
    null,
    2,
  );
}

async function loadCatalogFromText(rawText, sourceLabel) {
  try {
    const parsed = JSON.parse(rawText);
    currentCatalog = parseCatalogPayload(parsed);
    renderCatalogOptions();
    refs.catalogFont.value = '0';
    syncStyleToCatalog();
    setLibraryStatus(`Bibliotek indlæst (${currentCatalog.length} fonte) fra ${sourceLabel}.`);
    applyPreview();
  } catch (error) {
    setLibraryStatus(`Kunne ikke indlæse bibliotek: ${error.message}`, true);
  }
}

refs.libraryFile.addEventListener('change', async (event) => {
  const [file] = event.target.files || [];
  if (!file) {
    return;
  }

  const text = await file.text();
  await loadCatalogFromText(text, `filen "${file.name}"`);
});

refs.loadFromUrl.addEventListener('click', async () => {
  const url = refs.libraryUrl.value.trim();
  if (!url) {
    setLibraryStatus('Indsæt et iCloud-link først.', true);
    return;
  }

  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const text = await response.text();
    await loadCatalogFromText(text, `linket ${url}`);
  } catch (error) {
    setLibraryStatus(`Kunne ikke hente fra link: ${error.message}`, true);
  }
});

refs.catalogFont.addEventListener('change', () => {
  syncStyleToCatalog();
  applyPreview();
});

Object.values(refs).forEach((el) => {
  if (el instanceof HTMLElement && ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) {
    el.addEventListener('input', applyPreview);
  }
});

renderCatalogOptions();
refs.catalogFont.value = '0';
syncStyleToCatalog();
applyPreview();
