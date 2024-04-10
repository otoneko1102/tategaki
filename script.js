function genText() {
  const content = tategaki(document.getElementById('content').value, false);
  document.getElementById('output').value = content;

  const tempInput = document.createElement('input');
  tempInput.value = content;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.body.removeChild(tempInput);
}

function genHTML() {
  const content = tategaki(document.getElementById('content').value, true);
  document.getElementById('output').value = content;

  const tempInput = document.createElement('input');
  tempInput.value = content;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.body.removeChild(tempInput);
}

function tategaki(content, html) {
  const splitedContent = convertTo2DArray(content);
  const result = html ? reconstructForHTML(splitedContent) : reconstructForText(splitedContent);

  return result;
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

function reconstructForHTML(array) {
  let reconstructedText = '';

  for (let i = 0; i < array[0].length; i++) {
    for (let j = 0; j < array.length; j++) {
      if (array[j][i] !== undefined) {
        reconstructedText += checkWidth(array[j][i]) ? array[j][i] : `${array[j][i]} `;
      }
    }
    reconstructedText += '<br>';
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
