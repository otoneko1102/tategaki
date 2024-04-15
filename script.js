const replaceChars = {
  "ー": "｜",
  "（": "︵",
  "）": "︶",
  "「": "﹁",
  "」": "﹂",
  "『": "﹃",
  "』": "﹄",
  "〈": "︿",
  "〉": "﹀",
  "《": "︽",
  "》": "︾",
  "｛": "︷",
  "｝": "︸",
  "［": "﹇",
  "］": "﹈",
  "【": "︻",
  "】": "︼",
  "〖": "︗",
  "〗": "︘",
  "❲": "︹",
  "❳": "︺",
  "〔": "︹",
  "〕": "︺"
};

function genText() {
  const content = tategaki(document.getElementById('content').value, "text");
  document.getElementById('output').value = content;

  const tempInput = document.createElement('input');
  tempInput.value = content;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.body.removeChild(tempInput);
}

function genHTML() {
  const content = tategaki(document.getElementById('content').value, "html");
  document.getElementById('output').value = content;

  const tempInput = document.createElement('input');
  tempInput.value = content;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.body.removeChild(tempInput);
}

function genScript() {
  const content = tategaki(document.getElementById('content').value, "script");
  document.getElementById('output').value = content;

  const tempInput = document.createElement('input');
  tempInput.value = content;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.body.removeChild(tempInput);
}

function tategaki(content, type) {
	const convertedContent = halfWidthToFullWidth(content);
	const convertedJapaneseContent = halfWidthToFullWidth(convertedContent)
	const replacedContent = replaceMultiple(convertedJapaneseContent, replaceChars);
  const splitedContent = convertTo2DArray(replacedContent);
  let result;

  if (type === "text") result = reconstructForText(splitedContent);
  if (type === "html") result = reconstructForHTML(splitedContent);
  if (type === "script") result = reconstructForScript(splitedContent);

  return result;
}

function copyText() {
  var textArea = document.getElementById("output");
  textArea.select();
  document.execCommand("copy");
  alert("クリップボードにコピーしました！");
}

function convertTo2DArray(content) {
  const lines = content.split('\n');
  const maxLength = Math.max(...lines.map(line => line.length));
  const result = [];

  lines.forEach(line => {
    const characters = line.split('');
    while (characters.length < maxLength) {
      characters.push('　');
    }
    result.push(characters);
  });

  return result;
}

function halfWidthToFullWidth(str) {
  let result = '';
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i);
    if (charCode >= 0x20 && charCode <= 0x7E) {
      result += String.fromCharCode(charCode + 0xFEE0);
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}

function kanaHalfToFull(str) {
  const kanaMap = {
    'ｶﾞ': 'ガ', 'ｷﾞ': 'ギ', 'ｸﾞ': 'グ', 'ｹﾞ': 'ゲ', 'ｺﾞ': 'ゴ',
    'ｻﾞ': 'ザ', 'ｼﾞ': 'ジ', 'ｽﾞ': 'ズ', 'ｾﾞ': 'ゼ', 'ｿﾞ': 'ゾ',
    'ﾀﾞ': 'ダ', 'ﾁﾞ': 'ヂ', 'ﾂﾞ': 'ヅ', 'ﾃﾞ': 'デ', 'ﾄﾞ': 'ド',
    'ﾊﾞ': 'バ', 'ﾋﾞ': 'ビ', 'ﾌﾞ': 'ブ', 'ﾍﾞ': 'ベ', 'ﾎﾞ': 'ボ',
    'ﾊﾟ': 'パ', 'ﾋﾟ': 'ピ', 'ﾌﾟ': 'プ', 'ﾍﾟ': 'ペ', 'ﾎﾟ': 'ポ',
    'ｳﾞ': 'ヴ', 'ﾜﾞ': 'ヷ', 'ｦﾞ': 'ヺ',
    'ｱ': 'ア', 'ｲ': 'イ', 'ｳ': 'ウ', 'ｴ': 'エ', 'ｵ': 'オ',
    'ｶ': 'カ', 'ｷ': 'キ', 'ｸ': 'ク', 'ｹ': 'ケ', 'ｺ': 'コ',
    'ｻ': 'サ', 'ｼ': 'シ', 'ｽ': 'ス', 'ｾ': 'セ', 'ｿ': 'ソ',
    'ﾀ': 'タ', 'ﾁ': 'チ', 'ﾂ': 'ツ', 'ﾃ': 'テ', 'ﾄ': 'ト',
    'ﾅ': 'ナ', 'ﾆ': 'ニ', 'ﾇ': 'ヌ', 'ﾈ': 'ネ', 'ﾉ': 'ノ',
    'ﾊ': 'ハ', 'ﾋ': 'ヒ', 'ﾌ': 'フ', 'ﾍ': 'ヘ', 'ﾎ': 'ホ',
    'ﾏ': 'マ', 'ﾐ': 'ミ', 'ﾑ': 'ム', 'ﾒ': 'メ', 'ﾓ': 'モ',
    'ﾔ': 'ヤ', 'ﾕ': 'ユ', 'ﾖ': 'ヨ',
    'ﾗ': 'ラ', 'ﾘ': 'リ', 'ﾙ': 'ル', 'ﾚ': 'レ', 'ﾛ': 'ロ',
    'ﾜ': 'ワ', 'ｦ': 'ヲ', 'ﾝ': 'ン',
    'ｧ': 'ァ', 'ｨ': 'ィ', 'ｩ': 'ゥ', 'ｪ': 'ェ', 'ｫ': 'ォ',
    'ｯ': 'ッ', 'ｬ': 'ャ', 'ｭ': 'ュ', 'ｮ': 'ョ',
    '｡': '。', '､': '、', 'ｰ': '｜', '･': '・'
	};

  const reg = new RegExp('(' + Object.keys(kanaMap).join('|') + ')', 'g');
  return str.replace(reg, function (match) {
    return kanaMap[match];
  }).replace(/ﾞ/g, '゛').replace(/ﾟ/g, '゜');
};

function replaceMultiple(str, replacements) {
	let result = str;
	for (let pattern in replacements) {
    if (replacements.hasOwnProperty(pattern)) {
      result = result.replace(new RegExp(pattern, 'g'), replacements[pattern]);
    }
  }
  return result;
}

function reconstructForHTML(array) {
  let reconstructedText = '';

  for (let i = 0; i < array[0].length; i++) {
    for (let j = array.length - 1; j >= 0; j--) {
      if (array[j][i] !== undefined) {
        reconstructedText += checkWidth(array[j][i]) ? array[j][i] : `${array[j][i]} `;
      }
    }
    reconstructedText += '<br>\n';
  }
  
  return reconstructedText;
}

function reconstructForScript(array) {
  let reconstructedText = '';

  for (let i = 0; i < array[0].length; i++) {
    for (let j = array.length - 1; j >= 0; j--) {
      if (array[j][i] !== undefined) {
        reconstructedText += checkWidth(array[j][i]) ? array[j][i] : `${array[j][i]} `;
      }
    }
    reconstructedText += '\\n';
  }
  
  return reconstructedText;
}

function reconstructForText(array) {
  let reconstructedText = '';

  for (let i = 0; i < array[0].length; i++) {
    for (let j = array.length - 1; j >= 0; j--) {
      if (array[j][i] !== undefined) {
        reconstructedText += checkWidth(array[j][i]) ? array[j][i] : `${array[j][i]} `;
      }
    }
    reconstructedText += '\n';
  }
  
  return reconstructedText;
}

function checkWidth(char) {
  return char.match(/^[^\x01-\x7E\uFF61-\uFF9F]+$/);
}
