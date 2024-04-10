window.addEventListener('load', function() {
  document.getElementById('generateButton').addEventListener('click', function() {
    gen();
  });
});

function gen() {
  const content = tategaki(document.getElementById('content').value);
  document.getElementById('output').value = content;

  const tempInput = document.createElement('input');
  tempInput.value = content;
  document.body.appendChild(tempInput);
  tempInput.select();
  document.execCommand('copy');
  document.body.removeChild(tempInput);

  alert('クリップボードにコピーしました！');
}

function tategaki(content) {
  const splitedContent = convertTo2DArray(content);
  const result = reconstructText(splitedContent);

  return result;
}

function convertTo2DArray(content) {
  const lines = content.split('\n');
  const result = [];

  lines.forEach(line => {
    const characters = line.split('');
    result.push(characters);
  });

  return result;
}

function reconstructText(array) {
  let reconstructedText = '';

  for (let i = 0; i < array[0].length; i++) {
    for (let j = 0; j < array.length; j++) {
      if (array[j][i] !== undefined) {
        reconstructedText += array[j][i];
      }
    }
    reconstructedText += '\n';
  }
  
  return reconstructedText;
}
