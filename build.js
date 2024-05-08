import fs from 'node:fs';
import pkg from './package.json' assert { type: 'json' };
import data from './src/main.js';

async function write(content, filename = 'news.opml') {
  const dir = './dist';

  try {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  } catch (err) {
    console.error(err);
  }

  fs.writeFile(`${dir}/${filename}`, content, (err) => {
    if (err) {
      console.error(err);
    } else {
      // file written successfully
      console.log(`${filename} written`);
    }
  });
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
  opml += `\n  <body>\n`;
  let content = '';

  data.forEach((item) => {
    content += `    <outline `;
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
  opml += `  </body>\n</opml>`;

  return opml;
};

const opml = createOpml(data);
let minified = opml.trim();
minified = minified.replace(/\s\s+/g, ' ');
minified = minified.replace(/\>\ \</g, '><');
write(opml, 'news-austria.opml');
write(minified, 'news-austria.min.opml');
