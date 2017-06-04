// disassemble-content.js

const htmlToText = require('./html-to-text');

const AT_USERNAME_REX = /^@[a-z0-9_]{1,30}/i;
const FILE_NAME_REX_TEXT = '[a-zA-Z_][a-zA-Z0-9_-]{0,31}\.' +
                           '(gnuplot|bash|html|java|lisp|asm|cpp|dot|f90|f95|gpi|htm|lsp|lua|php|plt|py2|py3|scm|sql|svg|vim|zsh|bc|bf|cs|go|hs|js|ml|pl|py|rb|sh|ts|b|c|f)';
const FILE_NAME_REX = new RegExp('^' + FILE_NAME_REX_TEXT);
const SHELLBANG_REX = /^#!/;

module.exports = (content) => {

  let text = htmlToText(content);
  // remove @username
  while (AT_USERNAME_REX.test(text)) {
    text = text.replace(AT_USERNAME_REX, '').trim();
  }

  text = text.trim();

  if (FILE_NAME_REX.test(text)) {
    return {
      file_name: FILE_NAME_REX.exec(text)[0],
      src_code: text.replace(FILE_NAME_REX,'').trim() + "\n"
    };
  }

  if (SHELLBANG_REX.test(text)) {
    return {
      file_name: 'script',
      src_code: text + "\n"
    };
  }

  if (text[0] === '#') {
    return {
      error: 'Shebang must start with #!.'
    };
  }

  return {
    error: `Sorry "${text.split(/\s/)[0]}" is not a valid filename, currently valid file name is ${FILE_NAME_REX_TEXT}`
  };
};

