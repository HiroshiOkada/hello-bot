

# hello bot

A [Mastodon](https://github.com/tootsuite/mastodon) chat bot that execute programs and return the result.
( [日本語](https://hiroshiokada.github.io/hello-bot/index-j.html) )

## How to use

### Basics

__Please talk to [@hello@mastodon.toycode.com](https://mastodon.toycode.com/@hello)__


toot
```
@hello@mastodon.toycode.com
hello.cpp
#include <iostream>
int main()
{
    std::cout << "Hello, World!\n";
}
```

reply
```
Hello, World!
```

__Next word to hello@mastodon.toycode.co is the file name, this bot determines the language by the file extension.__

```
@hello@mastodon.toycode.com
(write "hello, world")
(newline)
```

```
@hello@mastodon.toycode.com
hello.rb
puts "hello, world"
```

__Insted of useing file name, you can use shebang__

```
@hello@mastodon.toycode.com
#!/bin/bash
echo "hello, world"
```

### Generate image

`SVG (*.svg)`, `Dot Language (*.dot)`, `HTML (*.htm|*html)`, `Gnuplot(*.plt|*.gnuplot|*.gpi)` generate image.

toot
```
@hello@mastodon.toycode.com
hello.cpp
#include <iostream>
int main()
{
    std::cout << "Hello, World!\n";
}
```
reply
<img src="https://hiroshiokada.github.io/hello-bot/hello.png" />


If you create `out.png` it return the image.
and if you create `out.svg` it convert to `out.png` and return the image.

toot
```
@hello@mastodon.toycode.com
rgb-tile.c
#include <stdio.h>

void main()
{
  int x, y, n=0;
  char *c[] = {"#e55", "#5e5", "#55e"};
  FILE *fp = fopen("out.svg", "w");

  fprintf(fp, "<svg height='200' width='400'>");
  for(x=0; x<400; x+=10) {
    for(y=0; y<200; y+=10) {
      fprintf(fp, "<rect x='%d' y='%d' width='10' height='10' fill='%s' />\n", x, y,  c[n++%3]);
    }
  }
  fprintf(fp, "</svg>");
}
```

reply
<img src="https://hiroshiokada.github.io/hello-bot/rgb-tile.png" />

## supported prgram language

|拡張子     |language/processer|
|:---:     |:---:            |
|.asm      | NASM            |
|.bc       | bc              |
|.bf       | beef(Brainfuck) |
|.cpp      | clang++(c++)    |
|.cs       | mcs/mono(C#)    |
|.c        | gcc(C)          |
|.dot      | dot/Graphviz    |
|.f .f90 .f95| gfortran    |
|.go       | go              |
|.hs       | ghc             |
|.html     | phantomjs       |
| java     | openjdk-9       |
|.js      | nodejs          |
|.lsp .lisp | clisp          |
|.lua     | lua5.3         |
|.ml      | ocaml          |
|.php     | php7           |
|.plt .gnuplot .gpi | gnuplot |
|.py2     | python2        |
|.py3 .py | python3         |
|.pl      | perl            |
|.rb      | ruby            |
|.scm     | guile(scheme)   |
|.sh .bash| bash            |
|.sql     | sqlite3         |
|.svg     | inkscape        |
|.ts      | tsc(TypeScript) |
|.vim     | vim             |
|.zsh     | zsh             |

## Links

* [hello bot source repository](https://github.com/HiroshiOkada/hello-bot)
* [Docker image repository](https://github.com/HiroshiOkada/bot-playground)
* [Hirohsi Okada(Auther)](http://hiroshi.toycode.com/)

