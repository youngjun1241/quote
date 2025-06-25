
fetch('config.json')
  .then(response => response.json())
  .then(data => {
    document.body.style.backgroundImage = `url(${data.background})`;
    const container = document.getElementById('main-container');

    data.blocks.forEach(block => {
      const div = document.createElement('div');
      div.className = 'block';
      div.textContent = block.text;
      div.style.top = block.top;
      div.style.left = block.left;
      div.style.backgroundColor = block.color || 'rgba(0,0,0,0.6)';
      div.style.transform = `rotate(${block.rotation || 0}deg)`;
      container.appendChild(div);
    });
  });
