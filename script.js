
let selectedBlock = null;

function addBlock() {
  const block = document.createElement('div');
  block.className = 'block';
  block.contentEditable = true;
  block.style.top = '100px';
  block.style.left = '100px';
  block.style.width = '200px';
  block.style.height = '100px';
  block.innerText = '텍스트';
  block.onclick = () => selectBlock(block);
  makeDraggable(block);
  document.getElementById('canvas').appendChild(block);
  selectBlock(block);
  updatePreview();
}

function makeDraggable(el) {
  el.onmousedown = function(e) {
    if (e.target !== el) return;
    let shiftX = e.clientX - el.getBoundingClientRect().left;
    let shiftY = e.clientY - el.getBoundingClientRect().top;

    function moveAt(pageX, pageY) {
      el.style.left = pageX - shiftX + 'px';
      el.style.top = pageY - shiftY + 'px';
    }

    function onMouseMove(e) {
      moveAt(e.pageX, e.pageY);
    }

    document.addEventListener('mousemove', onMouseMove);

    el.onmouseup = function() {
      document.removeEventListener('mousemove', onMouseMove);
      el.onmouseup = null;
      updatePreview();
    };
  };

  el.ondragstart = () => false;
}

function selectBlock(block) {
  selectedBlock = block;
  document.getElementById('bgColor').value = rgbToHex(block.style.backgroundColor || '#333');
  document.getElementById('blockText').value = block.innerText;
}

function updateBlockStyle() {
  if (!selectedBlock) return;
  selectedBlock.style.backgroundColor = document.getElementById('bgColor').value;
  selectedBlock.innerText = document.getElementById('blockText').value;
  updatePreview();
}

function setBlockImage(event) {
  if (!selectedBlock) return;
  const reader = new FileReader();
  reader.onload = function(e) {
    selectedBlock.style.backgroundImage = `url('${e.target.result}')`;
    selectedBlock.style.backgroundSize = "cover";
    updatePreview();
  };
  reader.readAsDataURL(event.target.files[0]);
}

function saveLayout() {
  const blocks = Array.from(document.querySelectorAll('.block')).map(b => ({
    text: b.innerText,
    top: b.style.top,
    left: b.style.left,
    width: b.style.width,
    height: b.style.height,
    backgroundColor: b.style.backgroundColor,
    backgroundImage: b.style.backgroundImage
  }));
  const blob = new Blob([JSON.stringify({ blocks }, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'layout.json';
  link.click();
}

function loadLayout(event) {
  const file = event.target.files[0];
  const reader = new FileReader();
  reader.onload = function(e) {
    const data = JSON.parse(e.target.result);
    const canvas = document.getElementById('canvas');
    canvas.innerHTML = '';
    data.blocks.forEach(b => {
      const block = document.createElement('div');
      block.className = 'block';
      block.contentEditable = true;
      block.innerText = b.text;
      block.style.top = b.top;
      block.style.left = b.left;
      block.style.width = b.width;
      block.style.height = b.height;
      block.style.backgroundColor = b.backgroundColor;
      if (b.backgroundImage) {
        block.style.backgroundImage = b.backgroundImage;
        block.style.backgroundSize = "cover";
      }
      block.onclick = () => selectBlock(block);
      makeDraggable(block);
      canvas.appendChild(block);
    });
    updatePreview();
  };
  reader.readAsText(file);
}

function updatePreview() {
  const previewFrame = document.getElementById("mobilePreview");
  const canvas = document.getElementById("canvas");
  const html = '<!DOCTYPE html><html><head><style>' +
    document.querySelector("style").textContent +
    '</style></head><body>' + canvas.innerHTML + '</body></html>';
  previewFrame.srcdoc = html;
}

function rgbToHex(rgb) {
  if (!rgb) return '#333';
  const result = rgb.match(/\d+/g);
  return "#" + result.map(x => (+x).toString(16).padStart(2, '0')).join('');
}
