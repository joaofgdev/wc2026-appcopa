const Parser = require('rss-parser');
const cheerio = require('cheerio');
const parser = new Parser({ customFields: { item: ['media:content', 'media:thumbnail', 'enclosure', 'description'] }});
parser.parseURL('https://trivela.com.br/feed/').then(feed => {
  feed.items.slice(0, 3).forEach(item => {
    const htmlContent = item.content || item.description;
    const $ = cheerio.load(htmlContent);
    const img = $('img').first().attr('src');
    console.log(item.title);
    console.log('enclosure:', item.enclosure);
    console.log('img from html:', img);
    console.log('---');
  });
});
