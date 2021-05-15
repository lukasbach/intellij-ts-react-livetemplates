import * as xml2js from 'xml2js';
import * as fs from 'fs';
import * as path from 'path';

(async () => {
  const templatesXml = await fs.promises.readFile(path.join(__dirname, '../src/main/resources/templates/TypedReact.xml'));
  const templates: any = await new Promise(res => xml2js.parseString(templatesXml, (e, r) => res(r)));
  let mdDocs = '';
  let htmlDocs = '';
  let mdList = '';

  for (const { $: template, variable, context } of templates.templateSet.template) {
mdDocs += `
### ${template.description}

Invoked via \`${template.name}\`.

\`\`\`
${template.value}
\`\`\`
`;

if (variable) {
mdDocs += `Variables:

|Name|Expression|Default Value|Skip if defined|
|----|----------|-------------|---------------|
${ variable.map(({$}) => `|\`${ $.name }\`|\`${ $.expression || '-' }\`|${ $.defaultValue }|${ $.alwaysStopAt ? 'false' : 'true' }|`).join('\n') }
`;
}

mdList += `- \`${template.name}\`: _${template.description}_\n`;

htmlDocs += `
<li><tt>${template.name}</tt>: <em>${template.description}</em></li>
`;
  }

  const mdTemplate = await fs.promises.readFile(path.join(__dirname, '../readme.template.md'), { encoding: 'utf8' });
  await fs.promises.writeFile(path.join(__dirname, '../readme.md'), mdTemplate.replace(/%DOCS%/g, mdDocs).replace(/%DOCS_LIST%/g, mdList));

  const xmlTemplate = await fs.promises.readFile(path.join(__dirname, '../plugin.template.xml'), { encoding: 'utf8' });
  await fs.promises.writeFile(path.join(__dirname, '../src/main/resources/META-INF/plugin.xml'), xmlTemplate.replace(/%DOCS%/g, htmlDocs));
})();