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
  "〕": "︺",
};
function genText() {
  const content = tategaki(document.getElementById("content").value, "text");
  document.getElementById("output").value = content;
  const tempInput = document.createElement("input");
  tempInput.value = content;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.body.removeChild(tempInput);
}
function genHTML() {
  const content = tategaki(document.getElementById("content").value, "html");
  document.getElementById("output").value = content;
  const tempInput = document.createElement("input");
  tempInput.value = content;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.body.removeChild(tempInput);
}
function genScript() {
  const content = tategaki(document.getElementById("content").value, "script");
  document.getElementById("output").value = content;
  const tempInput = document.createElement("input");
  tempInput.value = content;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.body.removeChild(tempInput);
}
function tategaki(content, type) {
  const D_MUD = "ガギグゲゴザジズゼゾダヂヅデドバビブベボパピプペポヴヷヺ";
  const S_MUD = "ｶﾞｷﾞｸﾞｹﾞｺﾞｻﾞｼﾞｽﾞｾﾞｿﾞﾀﾞﾁﾞﾂﾞﾃﾞﾄﾞﾊﾞﾋﾞﾌﾞﾍﾞﾎﾞﾊﾟﾋﾟﾌﾟﾍﾟﾎﾟｳﾞﾜﾞｦﾞ";

  const D_KIY =
    "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホ" +
    "マミムメモヤユヨラリルレロワヲンァィゥェォッャュョー・";
  const S_KIY = "ｱｲｳｴｵｶｷｸｹｺｻｼｽｾｿﾀﾁﾂﾃﾄﾅﾆﾇﾈﾉﾊﾋﾌﾍﾎﾏﾐﾑﾒﾓﾔﾕﾖﾗﾘﾙﾚﾛﾜｦﾝｧｨｩｪｫｯｬｭｮｰ･";
  const toZenKata = (str) => {
    for (let i = 0, len = D_MUD.length; i < len; i++) {
      str = str
        .split(S_MUD.slice(i * 2, i * 2 + 2))
        .join(D_MUD.slice(i, i + 1));
    }
    for (let i = 0, len = D_KIY.length; i < len; i++) {
      str = str.split(S_KIY.slice(i, i + 1)).join(D_KIY.slice(i, i + 1));
    }
    return str;
  };

  const convertedContent = halfWidthToFullWidth(toZenKata(content));
  const replacedContent = replaceMultiple(convertedContent, replaceChars);
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
  const lines = content.split("\n");
  const maxLength = Math.max(...lines.map((line) => line.length));
  const result = [];
  lines.forEach((line) => {
    const characters = line.split("");
    while (characters.length < maxLength) {
      characters.push("　");
    }
    result.push(characters);
  });
  return result;
}
function halfWidthToFullWidth(str) {
  let result = "";
  for (let i = 0; i < str.length; i++) {
    let charCode = str.charCodeAt(i);
    if (charCode >= 0x20 && charCode <= 0x7e) {
      result += String.fromCharCode(charCode + 0xfee0);
    } else {
      result += str.charAt(i);
    }
  }
  return result;
}
function replaceMultiple(str, replacements) {
  let result = str;
  for (let pattern in replacements) {
    if (replacements.hasOwnProperty(pattern)) {
      result = result.replace(new RegExp(pattern, "g"), replacements[pattern]);
    }
  }
  return result;
}
function reconstructForHTML(array) {
  let reconstructedText = "";
  for (let i = 0; i < array[0].length; i++) {
    for (let j = array.length - 1; j >= 0; j--) {
      if (array[j][i] !== undefined) {
        reconstructedText += checkWidth(array[j][i])
          ? array[j][i]
          : `${array[j][i]} `;
      }
    }
    reconstructedText += "<br>\n";
  }
  return reconstructedText;
}
function reconstructForScript(array) {
  let reconstructedText = "";
  for (let i = 0; i < array[0].length; i++) {
    for (let j = array.length - 1; j >= 0; j--) {
      if (array[j][i] !== undefined) {
        reconstructedText += checkWidth(array[j][i])
          ? array[j][i]
          : `${array[j][i]} `;
      }
    }
    reconstructedText += "\\n";
  }
  return reconstructedText;
}
function reconstructForText(array) {
  let reconstructedText = "";
  for (let i = 0; i < array[0].length; i++) {
    for (let j = array.length - 1; j >= 0; j--) {
      if (array[j][i] !== undefined) {
        reconstructedText += checkWidth(array[j][i])
          ? array[j][i]
          : `${array[j][i]} `;
      }
    }
    reconstructedText += "\n";
  }
  return reconstructedText;
}
function checkWidth(char) {
  return char.match(/^[^\x01-\x7E\uFF61-\uFF9F]+$/);
}
