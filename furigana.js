let cp = require('child_process');
let StringDecoder = require('string_decoder').StringDecoder;

function mecab(input, callback) {
    let decoder = new StringDecoder('utf8');
<<<<<<< HEAD
    var c = cp.spawn('/usr/bin/mecab', []);
=======
    var c = cp.spawn('/usr/local/bin/mecab', []);
>>>>>>> refs/remotes/origin/master

    c.stdin.write(input + '\n');
    c.stdout.on('data', data => {
        callback(decoder.write(data));
    });
    c.stdin.end();
}

function katakanaToHiragana(input = '') {
    const HIRAGANA_START = 0x3041;
    const KATAKANA_START = 0x30A1;
    const KATAKANA_END = 0x30FC;
    var hira = '';
    for (var letter of input) {
        var code = letter.charCodeAt(0);
        if (code >= KATAKANA_START && code <= KATAKANA_END)
            code = code + (HIRAGANA_START - KATAKANA_START);
        hira += String.fromCharCode(code);
    }
    return hira;
}
    
function slice(string, start, end, step) { // a proper substr
    var slice = string.slice, sliced = slice.call(string, start, end), result, length, i;
    if (!step)
        return sliced;
    result = [];
    length = sliced.length;
    i = (step > 0) ? 0 : length - 1;
    for (; i < length && i >= 0; i += step) {
        result.push(sliced[i]);
    }
    return result.join('');
}
    
function furiToRb(kanji, reading) {
    if (kanji == reading)
        return reading;
    if (kanji == 'だ' && reading == "で")
        return "だ";
    var furigana = '';
    var placeLeft = 0
    var placeRight = 0
    var lastKanji = kanji.length;
    var lastReading = reading.length;
    var j = 0;
    for (var i = 0; i < kanji.length; i++) {
        placeRight = i;
        j = i + 1;
        if (kanji[lastKanji - j] != reading[lastReading - j])
            break;
    }
    for (var i = 0; i < kanji.length; i++) {
        placeLeft = i
        if (kanji[i] != reading[i])
            break;
    }
    var before = '';
    var after = '';
    var ruby = '';
    var rt = '';
    if (placeLeft == 0) {
        if (placeRight == 0) {
            ruby = kanji;
            rt = reading;
        } else {
            ruby = slice(kanji, 0, lastKanji - placeRight);
            rt = slice(reading, 0, lastReading - placeRight);
            after = slice(reading, lastReading - placeRight);
        }
    } else {
        if (placeRight == 0) {
            before = slice(reading, 0, placeLeft);
            ruby = slice(kanji, placeLeft);
            rt = slice(reading, placeLeft);
        } else {
            before = slice(reading, 0, placeLeft);
            ruby = slice(kanji, placeLeft, lastKanji - placeRight);
            rt = slice(reading, placeLeft, lastReading - placeRight);
            after = slice(reading, lastReading - placeRight);
        }
    }
<<<<<<< HEAD
    return `${before}<ruby><rb>${ruby}</rb><rt>${rt}</rt></ruby>${after}`;
=======
    return `${before}<ruby><rb>${ruby}</rb><rt style="-webkit-user-select:none;">${rt}</rt></ruby>${after}`;
>>>>>>> refs/remotes/origin/master
}


function sentenceToFurigana(sentence, cb) {
    mecab(sentence, (stdout) => {
        var rows = stdout.split("\n");
        var furi = '';
        for (var row of rows) {
            row = row.split("\t");
            const original = row[0];
            let cols = row[1];
            if (typeof cols === 'undefined')
                continue;
            cols = cols.split(',');
            const isText = (original.match(/([A-Za-z0-9]+)$/) !== null);
            const isHiraKata = (original.match(/^([\u3000-\u303f\u3040-\u309f\u30a0-\u30ff\uff00-\uff9f]+)$/) !== null);
            const isControlCharacter = original.includes('\x9d') || original.includes('\x9e');
            if (isText || isHiraKata || isControlCharacter)
                furi += original
            else
                furi += furiToRb(original, katakanaToHiragana(cols[7]));
        }
<<<<<<< HEAD
        cb(furi.replace(/\x9d/g, "<br />").replace(/\x9e/g, " "));
=======
        cb(furi.replace(/\x9d/g, "<br />").replace(/\x9f/g, "　").replace(/\x9e/g, " "));
>>>>>>> refs/remotes/origin/master
    });
}

function replaceSync(message, node) {
    return new Promise((resolve, reject) => {
        try {
            
        } catch(e) {
            reject(e);
        }
    });
}

function processMessage(message, callback) {
    if (message.className.includes("processed"))
        return callback();

    var scrollPoint = document.querySelector('.messages.scroller').scrollTop;

    var i = 0;
    var childNodes = message.childNodes;
    function processNode(node, cb) {
        if (node.nodeType === 3) {
            var text = node.textContent;
<<<<<<< HEAD
            text = text.replace(/\n/g, '\x9d').replace(/\s/g, '\x9e');

            sentenceToFurigana(text, (furi) => {
                var span = document.createElement('span');
                span.innerHTML = `<span>${furi}</span>`
=======
            text = text.replace(/\n/g, '\x9d').replace(/\u3000/g, '\x9f').replace(/\s/g, '\x9e');

            sentenceToFurigana(text, (furi) => {
                var span = document.createElement('span');
                span.innerHTML = furi;
>>>>>>> refs/remotes/origin/master
                message.replaceChild(span, node);
                cb();
            });
        }else
            cb();
    }
    
    function doProcess() {
        if(i < childNodes.length)
            processNode(childNodes[i++], doProcess);
        else {
            message.className += " processed";
            document.querySelector('.messages.scroller').scrollTop = scrollPoint + 12;
            callback();
        }
    }
    
    doProcess();
}

var a = setInterval(() => {
    var messages = document.querySelector(".messages").querySelectorAll('.markup');
    var i = messages.length - 1;

    function doProcess() {
        if (i > 0)
            processMessage(messages[i--], doProcess);
    }

    doProcess();
}, 1000);
