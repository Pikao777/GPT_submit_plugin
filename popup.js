document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('submitBtn');
  const progressBar = document.querySelector('.progress-bar');

  button.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      chrome.tabs.executeScript(tabs[0].id, { file: 'content.js' });
    });
  });

  chrome.runtime.onMessage.addListener((message) => {
    if (message.type === 'progressUpdate') {
      const { currentChunk, totalChunks } = message.payload;
      const progress = (currentChunk / totalChunks) * 100;
      progressBar.style.width = `${progress}%`;

      if (currentChunk === totalChunks) {
        progressBar.style.backgroundColor = 'green';
      }
    }
  });
});
