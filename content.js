// Create the button and progress elements
const button = createButton();
let progressBar;
const progress = createProgress();

// Insert the button and progress bar into the DOM
insertIntoDOM();

// Button click event
attachButtonEvent();

// Create a MutationObserver instance to watch for changes in the DOM
const observer = new MutationObserver(function(mutations) {
  const buttonExists = document.body.contains(button);
  const progressExists = document.body.contains(progress);

  // If the button or progress bar has been removed, insert them back into the DOM
  if (!buttonExists || !progressExists) {
    insertIntoDOM();
  }
});

// Start observing the document with the configured parameters
observer.observe(document.body, { childList: true, subtree: true });

function createButton() {
  const button = document.createElement('button');
  button.innerText = 'Submit File';
  button.style.backgroundColor = 'green';
  button.style.color = 'white';
  button.style.padding = '5px';
  button.style.border = 'none';
  button.style.borderRadius = '20px';
  button.style.margin = '5px';

  return button;
}

function createProgress() {
    const progress = document.createElement('div');
    progress.style.width = '99%';
    progress.style.height = '5px';
    progress.style.backgroundColor = 'grey';
    progress.style.borderRadius = '20px';
    progressBar = document.createElement('div');  // Update progressBar here
    progressBar.style.width = '0%';
    progressBar.style.height = '100%';
    progressBar.style.backgroundColor = 'blue';
    progressBar.style.borderRadius = '20px';
    progress.appendChild(progressBar);
  
    return progress;
  }

function insertIntoDOM() {
  const targetElement = document.querySelector('.flex.flex-col.w-full.py-\\[10px\\].flex-grow.md\\:py-4.md\\:pl-4.relative.border.border-black\\/10.bg-white.dark\\:border-gray-900\\/50.dark\\:text-white.dark\\:bg-gray-700.rounded-xl.shadow-xs.dark\\:shadow-xs');
  targetElement.parentNode.insertBefore(button, targetElement);
  targetElement.parentNode.insertBefore(progress, targetElement);
}

function attachButtonEvent() {
  button.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.txt,.js,.py,.html,.css,.json,.csv';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = async function(event) {
        const text = event.target.result;
        const chunkSize = 15000;
        const numChunks = Math.ceil(text.length / chunkSize);
        for (let i = 0; i < numChunks; i++) {
          const start = i * chunkSize;
          const end = start + chunkSize;
          const chunk = text.substring(start, end);
          await submitConversation(chunk, i + 1, file.name, progressBar);
          progressBar.style.width = `${((i + 1) / numChunks) * 100}%`;
        }
        progressBar.style.backgroundColor = 'blue';
      };
      reader.readAsText(file);
    };
    input.click();
  });
}

async function submitConversation(text, part, filename) {
    const textarea = document.querySelector("textarea[tabindex='0']");
    const enterKeyEvent = new KeyboardEvent("keydown", {
      bubbles: true,
      cancelable: true,
      keyCode: 13,
    });
    const chunkSize = 15000;
    const numChunks = Math.ceil(text.length / chunkSize);
    progressBar.style.width = `${((part) / numChunks) * 100}%`;
    textarea.value = `Part ${part} of ${filename}: \n\n ${text}`;
    textarea.dispatchEvent(enterKeyEvent);
    let chatgptReady = false;
    while (!chatgptReady) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      chatgptReady = !document.querySelector(".text-2xl > span:not(.invisible)");
    }
  }