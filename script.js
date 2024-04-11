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
  const splitedContent = convertTo2DArray(convertedContent);
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

function reconstructForHTML(array) {
  let reconstructedText = '';

  for (let i = 0; i < array[0].length; i++) {
    for (let j = 0; j < array.length; j++) {
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
    for (let j = 0; j < array.length; j++) {
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
    for (let j = 0; j < array.length; j++) {
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
