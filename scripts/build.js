const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const ICONS_DIR = path.join(ROOT_DIR, 'icons');
const DIST_DIR = path.join(ROOT_DIR, 'dist');
const OUTPUT_FILE = path.join(DIST_DIR, 'icon-bundle.js');

// Ensure dist folder
if (!fs.existsSync(DIST_DIR)) {
    fs.mkdirSync(DIST_DIR);
}

const iconsData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'icons.json'), 'utf8'));

let symbols = '';

iconsData.icons.forEach(icon => {
    const svgPath = path.join(ICONS_DIR, icon.group, `${icon.id}.svg`);
    if (fs.existsSync(svgPath)) {
        let svgContent = fs.readFileSync(svgPath, 'utf8');

        // Extract viewBox
        const viewBoxMatch = svgContent.match(/viewBox="([^"]+)"/);
        const viewBox = viewBoxMatch ? viewBoxMatch[1] : '0 0 24 24';

        // Extract inner content (everything between <svg...> and </svg>)
        let innerContent = svgContent.replace(/<svg[^>]*>/, '').replace(/<\/svg>/, '');
        
        symbols += `<symbol id="icon-${icon.id}" viewBox="${viewBox}">${innerContent}</symbol>\n`;
    } else {
        console.warn(`Warning: Missing SVG file for icon ${icon.id}`);
    }
});

const svgWrapper = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="position: absolute; width: 0; height: 0; overflow: hidden;" aria-hidden="true">\n${symbols}</svg>`;

const jsTemplate = `
!(function() {
  if (typeof window !== 'undefined') {
    var svgHTML = ${JSON.stringify(svgWrapper)};
    var inject = function() {
      var div = document.createElement('div');
      div.innerHTML = svgHTML;
      document.body.insertBefore(div.firstChild, document.body.firstChild);
    };
    if (document.readyState === 'interactive' || document.readyState === 'complete') {
      inject();
    } else {
      document.addEventListener('DOMContentLoaded', inject);
    }
  }
})();
`;

fs.writeFileSync(OUTPUT_FILE, jsTemplate.trim());
console.log(`Successfully built icon bundle -> ${OUTPUT_FILE}`);
