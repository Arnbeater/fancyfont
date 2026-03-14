const styleMap = {
  sans: 'Inter, system-ui, sans-serif',
  serif: '"Iowan Old Style", "Times New Roman", Georgia, serif',
  mono: '"JetBrains Mono", "Fira Code", Consolas, monospace',
};

const refs = {
  style: document.getElementById('style'),
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
  const weight = refs.weight.value;
  const width = refs.width.value;
  const contrast = refs.contrast.value;
  const round = refs.round.value;
  const text = refs.previewText.value.trim();

  refs.weightValue.value = weight;
  refs.widthValue.value = width;
  refs.contrastValue.value = contrast;
  refs.roundValue.value = round;

  refs.preview.style.setProperty('--preview-family', styleMap[style]);
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
      axes: {
        wght: Number(weight),
        wdth: Number(width),
        cntr: Number(contrast),
        rnd: Number(round),
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
