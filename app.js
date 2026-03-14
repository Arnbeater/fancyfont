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

const refs = {
  style: document.getElementById('style'),
  inclination: document.getElementById('inclination'),
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

function applyPreview() {
  const style = refs.style.value;
  const inclination = refs.inclination.value;
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

  refs.preview.style.setProperty('--preview-family', styleMap[style]);
  refs.preview.style.setProperty('--preview-font-style', inclinationAxes.fontStyle);
  refs.preview.style.setProperty('--preview-weight', weight);
  refs.preview.style.setProperty('--preview-width', `${width}%`);
  refs.preview.style.setProperty('--preview-contrast', `${contrast / 100}em`);
  refs.preview.style.setProperty('--preview-rounding', `${round}px`);
  refs.preview.textContent = text || 'Skriv noget tekst for preview...';

  refs.recipe.textContent = JSON.stringify(
    {
      sourceLibrary: 'Cloud Font Catalog',
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

Object.values(refs).forEach((el) => {
  if (el instanceof HTMLElement && ['INPUT', 'SELECT', 'TEXTAREA'].includes(el.tagName)) {
    el.addEventListener('input', applyPreview);
  }
});

applyPreview();
