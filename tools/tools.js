import fs from 'node:fs';
// import pkg from '../package.json' assert { type: 'json' };

export const getCategories = (data) =>
  data.reduce((prev, cur) => {
    if (!cur.category) {
      return prev;
    }
    cur.category.forEach((cat) => {
      if (-1 === prev.indexOf(cat)) {
        prev.push(cat);
      }
    });
    return prev;
  }, []);

export const create = (data, category, name) => {
  // csv
  const csv = createCSV(data);
  write(csv, `${name}.csv`);

  const opml = createOpml(data, category);
  // let minified = opml.trim();
  // minified = minified.replace(/\s\s+/g, ' ');
  // minified = minified.replace(/\>\ \</g, '><');
  write(opml, `${name}.opml`);
};

export const createCSV = (data) => {
  const getValue = (val) => {
    if (Array.isArray(val)) {
      return getValue(val.join(', '));
    }
    if (val.match(/[,; ]/)) {
      return `"${val}"`;
    }
    return val;
  };

  let csv = '';
  const header = Object.keys(data[0]);
  csv +=
    header.reduce((prev, cur) => prev + getValue(cur) + ',', '').slice(0, -1) +
    '\n';

  let content = '';
  data.forEach((item) => {
    let entry = '';
    header.forEach((name) => {
      let value = item[name];
      if (value) {
        entry += getValue(value);
      }
      entry += ',';
    });
    content += entry.slice(0, -1) + '\n';
  });
  csv += content;

  return csv;
};

export const createOpml = (data, category) => {
  let opml = '';

  const time = new Date();

  const head = `<?xml version="1.0" encoding="UTF-8"?>
<opml version="2.0">
  <head>
    <title>lemon3 list</title>
  </head>`;

  opml += head;
  opml += `\n  <body>\n`;
  let content = '';

  // category
  opml += `    <outline text="${category}">\n`;

  data.forEach((item) => {
    content += `      <outline `;
    Object.entries(item).forEach((entry) => {
      let [key, value] = entry;
      if ('category' === key) {
        value = '/' + value.join('/');
      }
      content += `${key}="${value}" `;
    });
    content += '/>\n';
  });

  opml += content;
  opml += `    </outline>\n`;
  opml += `  </body>\n</opml>`;

  return opml;
};

export async function write(content, filename = 'news.opml') {
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
      console.log(`'${filename}' was written.`);
    }
  });
}
