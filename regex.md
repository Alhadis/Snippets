Regular Expressions
===================


### Emacs modeline ###

	/-\*-(?:(?:(?!mode\s*:)[^:;]+:[^:;]+;)*\s*mode\s*:)?\s*(          )\s*(?:;[^:;]+:[^:;]+?)*;?\s*-\*-/i
	                                                        ^^^^^^^^^^
	                                                       REPLACE THIS

### Vim modeline ###

	/(?:vim?|ex):\s*(?:set?.*\s)?(?:syntax|filetype|ft)=(          )\s?(?:.*:)?/i
	                                                     ^^^^^^^^^^
	                                                    REPLACE THIS

### Basic CSS Minification

    /((\/\*)[^\x00]*?(\*\/))|[\t\n]/gm


### E-mail Address

    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/


### Encode HTML Ampersands
[Source](http://www.php.net/manual/en/function.htmlspecialchars.php#96159)

    Search:     &(?![A-Za-z0-9#]{1,7};)
    Replace:    &amp;


### FB Auto-URL
Replicates Facebook's auto-hyperlinking, at least as late as 1410215399 (2014-09-09).
It's possible it's changed since then (I no longer use Facebook, so I wouldn't know).

    \b(https?://([-\w\.]+)|www\.|([-\w\.]+)\/)\S+|$


### Get nth word in a sentence.
Substitute `8` for `nth - 1`

    ^(?:(?:^|\s+)\S+){8}(\s+\S+)


### Match contents of HTML tag with class

    Pattern:    (<(\w+)\b[^>]*class\s*=\s*("[^">]*pre-line[^">]*"|\'[^\'>]*pre-line[^\'>]*\')[^>]*>)(.*?)(</\2>)
    Flags:      ism


### print_r'd Array to PHP Array

    Search:     \[(\w+)\] => ([^\n]+)(\n|$)
    Replace:    "\1" => "\2",\3


### Tab-linter
Find where tabs have been used after a non-whitespace character.

    ^\t*[^\t\n]+\t+.*?$


### Split words

Inclusive hyphenation ("One-word" will be one word)

    /[^\w-_'\u2019]+|['\u2019]{2,}/g

Exclusive hyphenation ("Two-words" will be two words)

    /[^\w_'\u2019]+|['\u2019]{2,}/g


### String literal
Match quoted strings, even when parts of it are escaped.

    "([^\\"]|\\.)*"|'([^\\']|\\.)*'


### Strip Block Comments

    /((\/\*)[^\x00]*?(\*\/))/gm


### Trim multiline whitespace

    (?:^[\x20\t]+)|(?:\n\s*)(?=\n)|\s+$|\n\n


### Strip whitespace-only lines

    /^[\x20\t]*\n|\n[\x20\t]*(?=\n|$)/gm


### Split a URL into its components

    ^([^\/#\?]*:?\/\/)?(\/?(?:[^\/#\?]+\/)*)?([^\/#\?]+)?(?:\/(?=$))?(\?[^#]*)?(#.*)?$


### URL

    ^\s*(https?:)?//([^:]+:[^@]+@)?([\w-]+)(\.[\w-]+)*(:\d+)?(/\S+)?\s*$

Escaped version for ECMAScript:

    /^\s*(https?:)?\/\/([^:]+:[^@]+@)?([\w-]+)(\.[\w-]+)*(:\d+)?(\/\S+)?\s*$/


### TextMate-compatible grammars: Unescaped line-break

    (?<!\\\\)$


### Numeral with English ordinal suffix (1st, 2nd, 103rd, etc)

	\b(\d*1[1-3]th|\d*0th|(?:(?!11st)\d)*1st|\d*2nd|(?:(?!13rd)\d*)3rd|\d*[4-9]th)\b
