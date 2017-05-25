const expect = require('chai').expect;
const rewire = require("rewire");
const htmlToText = rewire('../lib/html-to-text');

describe('モジュール html-to-text のテスト', () => {

  describe('関数 tokenize のテスト', () => {
    it ('関数の存在チェック', () => {
      expect(htmlToText.__get__('tokenize')).to.be.a('function');
    });

    it ('全くtagを含まない場合一要素の配列を返す', () => {
      const src = "あいうえお";
      const out = htmlToText.__get__('tokenize')(src);

      expect(out).to.eql(["あいうえお"]);
    });

    it ('tag のみが含まれる場合 tag の数と同じ要素数の配列を返す', () => {
      let src = "";
      let out = [];
      let predict = [];

      for (let n=0; n<3; n++) {
        src += '<tag>';
        out = htmlToText.__get__('tokenize')(src);
        predict.push('<tag>');

        expect(out).to.eql(predict);
      }
    });

    it ('tag とテキストが混在している場合も正しく分割できる', () => {
      const src = "<a href=\"https://mastodon.toycode.com/tags/include\" class=\"mention hashtag\">#<span>include</span></a> &lt;stdio.h&gt;</p><p>int main(int ac, char *av[])<br />{<br />  printf(&quot;Hello, world\\n&quot;);<br />  return 0;<br />}</p>";
      const out = htmlToText.__get__('tokenize')(src);

      expect(out).to.eql([
        "<a href=\"https://mastodon.toycode.com/tags/include\" class=\"mention hashtag\">",
        "#",
        "<span>",
        "include",
        "</span>",
        "</a>",
        " &lt;stdio.h&gt;",
        "</p>",
        "<p>",
        "int main(int ac, char *av[])",
        "<br />",
        "{",
        "<br />",
        "  printf(&quot;Hello, world\\n&quot;);",
        "<br />",
        "  return 0;",
        "<br />",
        "}",
        "</p>"]);
    });

    it ('正しくない入力には null を返す', () => {
      const srces = ["<<hoge>>","<>hoge","><ng>", "fuga>"];

      srces.forEach((src) => expect(htmlToText.__get__('tokenize')(src)).to.be.null);
    });

  });


  describe('export した html-to-text 関数のテスト', () => {
    it ('タグが含まれていなければ、元のテキストを返す', () => {
      const src = "あいうえお";
      const out = htmlToText(src);

      expect(out).to.equal("あいうえお");
    });

    it ('<br> は改行に変わる', () => {
      const src = "あいう<br>えお";
      const out = htmlToText(src);

      expect(out).to.equal("あいう\nえお");
    });

    it ('<br />も改行に変わる', () => {
      const src = "あいう<br>えお";
      const out = htmlToText(src);

      expect(out).to.equal("あいう\nえお");
    });

    it ('段落の終わり</p>は改行２つに変わる', () => {
      const src = "<p>a</p><p>b</p><p>c</p>";
      const out = htmlToText(src);

      expect(out).to.equal("a\n\nb\n\n\c\n\n");
    });

    it ('html4時代のブロックレベルタグは改行に変わる', () => {
      const src = "<address>1</address><blockquote>2</blockquote><dd>3</dd><div>4</div>"
                + "<dl>5</dl><fieldset>6</fieldset><form>7</form><h1>8</h1><h2>9</h2>"
                + "<h3>10</h3><h4>11</h4><h5>12</h5><h6>13</h6>14<hr><li>15</li>"
                + "<main>16</main><nav>17</nav><noscript>18</noscript><ol>19</ol>" +
                "<p>20</p><pre>21</pre><table>22</table><tfoot>23</tfoot><ul>24</ul>";
      const out = htmlToText(src);

      expect(out).to.equal("1\n2\n3\n4\n"
                           + "5\n6\n7\n8\n9\n"
                           + "10\n11\n12\n13\n14\n\n15\n"
                           + "16\n17\n18\n19\n"
                           + "20\n\n21\n22\n23\n24\n");
    });

    it ('<hr/> <p/> のは改行2つに変わる', () => {
      const src = "x<hr/>y<p/>";
      const out = htmlToText(src);

      expect(out).to.equal("x\n\ny\n\n");
    });

    it ('<br/> <br> は改行に変わる', () => {
      const src = "<br><br /><br  />";
      const out = htmlToText(src);

      expect(out).to.equal("\n\n\n");
    });


    it ('タグは取り除かれ必要な箇所は改行に変わる', () => {
      const src = "<p><span class=\"h-card\"><a href=\"https://mastodon.toycode.com/@hello\" class=\"u-url mention\">@<span>hello</span></a></span> <a href=\"https://mastodon.toycode.com/tags/include\" class=\"mention hashtag\">#<span>include</span></a> &lt;stdio.h&gt;</p><p>int main(int ac, char *av[])<br />{<br />   printf(&quot;Hello, world\\n&quot;);</p><p>    return 0;<br />}</p>";
      const out = htmlToText(src);
      const predict = ['@hello #include <stdio.h>',
        '',
        'int main(int ac, char *av[])',
        '{',
        '   printf("Hello, world\\n");',
        '',
        '    return 0;',
        '}'].join('\n');

      expect(out.trim()).to.equal(predict);
    });
  });
});

