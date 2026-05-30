const fs = require('fs');
const path = require('path');

const dir = 'src/templates/home-services-base';
fs.mkdirSync(dir, { recursive: true });

const comps = [
  'Layout', 'Header', 'Footer', 'HomePage', 'AboutPage', 'ContactPage',
  'ServicesIndexPage', 'ServiceDetailPage', 'ServiceAreaPage',
  'BlogIndexPage', 'BlogPostPage', 'PrivacyPage', 'TermsPage'
];

comps.forEach(c => {
  const content = `export function ${c}(props: any) {
  return (
    <div className="p-4 border m-4 bg-white text-black">
      <h2>${c} Placeholder</h2>
      <p>Light Mode - Home Services</p>
      {props.children}
    </div>
  );
}`;
  fs.writeFileSync(path.join(dir, c + '.tsx'), content);
});

fs.writeFileSync(path.join(dir, 'theme.ts'), 'export const theme = {};');

const indexContent = `import type { TemplatePack } from "@/types/template";
${comps.map(c => `import { ${c} } from "./${c}";`).join('\n')}

const pack: TemplatePack = {
  ${comps.join(',\n  ')}
};

export default pack;
`;
fs.writeFileSync(path.join(dir, 'index.ts'), indexContent);

const manifestContent = {
  id: 'home-services-base',
  name: 'Home Services Base',
  version: '1.0.0',
  config_schema: []
};
fs.writeFileSync(path.join(dir, 'manifest.json'), JSON.stringify(manifestContent, null, 2));

console.log('Template placeholders generated.');
