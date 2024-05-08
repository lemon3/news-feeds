import fs from 'node:fs/promises';
import pkg from './package.json' assert { type: 'json' };
import data from './src/main.js';

async function write(content, filename = 'news.opml') {
  try {
    const data = await fs.writeFile(`./dist/${filename}`, content);
    return data;
  } catch (err) {
    console.log(err);
    return err;
  }
}

const createOpml = (data) => {
  let opml = '';

  const time = new Date();

  const head = `<?xml version="1.0" encoding="ISO-8859-1"?>
<opml version="2.0">
  <head>
    <title>mySubscriptions.opml</title>
    <dateCreated>${time}</dateCreated>
    <dateModified>${time}</dateModified>
    <ownerName>${pkg.author}</ownerName>
    <ownerEmail></ownerEmail>
  </head>`;

  opml += head;
  opml += '\n\t<body>\n';
  let content = '';

  data.forEach((item) => {
    content += '\t\t<outline ';
    if (0 === item.category.length) {
      delete item.category;
    }

    Object.entries(item).forEach((entry) => {
      const [key, value] = entry;
      content += `${key}="${value}" `;
    });
    content += '/>\n';
  });

  opml += content;
  opml += '\t</body>';
  opml += '\n</opml>';

  return opml;
};

const opml = createOpml(data);
write(opml);
