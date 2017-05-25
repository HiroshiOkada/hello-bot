const expect = require('chai').expect;
const disassembleContent = require('../lib/disassemble-content');

describe('モジュール disassemble-content のテスト', () => {

  describe('不完全な content のテスト', () => {
    it ('ファイル名が存在しない', () => {
      const contents = [
        "<p><span class=\"h-card\"><a href=\"https://mastodon.toycode.com/@hello\" class=\"u-url mention\">@<span></span></a></span> abcde</p>",
        "<p><span class=\"h-card\"><a href=\"https://mastodon.toycode.com/@hello\" class=\"u-url mention\">@<span>hello</span></a></span> abcde</p>",
        "<p><span class=\"h-card\"><a href=\"https://mastodon.toycode.com/@hello\" class=\"u-url mention\">@<span>a:b.c</span></a></span> abcde</p>",
        "<p><span class=\"h-card\"><a href=\"https://mastodon.toycode.com/@hello\" class=\"u-url mention\">@<span>.rb</span></a></span> abcde</p>"];

      contents.forEach((content) => {
        const out = disassembleContent(content);
        expect(out.error).not.null;
      });
    });
  });

  describe('完全な content のテスト', () => {
    it ('ファイル名がある場合はファイル名が抽出される', () => {
      const contents = [
        "<p><span class=\"h-card\"><a href=\"https://mastodon.toycode.com/@hello\" class=\"u-url mention\">@<span>hello</span></a></span> @hirosh <br />test.rb<br />puts &quot;Hello&quot;</p>",
        "<p><span class=\"h-card\"><a href=\"https://mastodon.toycode.com/@hello\" class=\"u-url mention\">@<span>hello</span></a></span> <span class=\"h-card\"><a href=\"https://mastodon.toycode.com/@hiroshi\" class=\"u-url mention\">@<span>hiroshi</span></a></span> test.rb<br />puts &quot;Hello&quot;</p>"
      ];

      contents.forEach((content) => {
        const out = disassembleContent(content);
        expect(out).to.be.eql({
          file_name: 'test.rb',
          src_code: 'puts "Hello"\n'
        });
      });
    });

    it ('shellBangがある場合はダミーで script というファイル名が与えられる', () => {
      const contents = [
        "<p><span class=\"h-card\"><a href=\"https://mastodon.toycode.com/@hello\" class=\"u-url mention\">@<span>hello</span></a></span> #!/usr/bin/env ruby<br />puts &quot;Hello&quot;</p>",
        "<p><span class=\"h-card\"><a href=\"https://mastodon.toycode.com/@hello\" class=\"u-url mention\">@<span>hello</span></a></span><br />#!/usr/bin/env ruby<br />puts &quot;Hello&quot;</p>"
      ];

      contents.forEach((content) => {
        const out = disassembleContent(content);
        expect(out).to.be.eql({
          file_name: 'script',
          src_code: '#!/usr/bin/env ruby\nputs "Hello"\n'
        });
      });
    });
  });

});

