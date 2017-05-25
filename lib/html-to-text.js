// html-to-text.js

function tokenize(html) {
  const TAG_REX = /^<[^>]+>/;
  const NON_TAG_REX = /[^<>]+/;
  const tokens = [];
  while( html !== '') {
    if (TAG_REX.test(html)) {
      tokens.push( TAG_REX.exec(html)[0]);
      html = html.replace(TAG_REX, '');
    } else if (NON_TAG_REX.test(html)) {
      tokens.push( NON_TAG_REX.exec(html)[0]);
      html = html.replace(NON_TAG_REX, '');
    } else {
      return null;
    }
  }
  return tokens;
}

const DOUBLE_LINE_BREAK_TAGS = [
  /<\/p>/,
  /<p.*\/>/,
  /<\/hr>/,
  /<hr.*>/
];

const LINE_BREAK_TAGS = [
  /<\/address>/,
  /<\/blockquote>/,
  /<\/dd>/,
  /<\/div>/,
  /<\/dl>/,
  /<\/fieldset>/,
  /<\/form>/,
  /<\/h1>/,
  /<\/h2>/,
  /<\/h3>/,
  /<\/h4>/,
  /<\/h5>/,
  /<\/h6>/,
  /<\/li>/,
  /<\/main>/,
  /<\/nav>/,
  /<\/noscript>/,
  /<\/ol>/,
  /<\/pre>/,
  /<\/table>/,
  /<\/tfoot>/,
  /<\/ul>/,
  /<\/video>/,
  /<br.*>/,
  /<hr.*>/];


function convertTagToLineBreak(token) {
  if (token[0] !== '<') {
    return token;
  }
  for(let i=0; i<DOUBLE_LINE_BREAK_TAGS.length; i++) {
    if (DOUBLE_LINE_BREAK_TAGS[i].test(token)) {
      return '\n\n';
    }
  }
  for(let i=0; i<LINE_BREAK_TAGS.length; i++) {
    if (LINE_BREAK_TAGS[i].test(token)) {
      return '\n';
    }
  }
  return '';
}

function unEscape(text) {
  return text.replace(/&quot;/g, '"')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

module.exports = function (html) {

  return tokenize(html)
    .map(convertTagToLineBreak)
    .map(unEscape)
    .join('');
};
