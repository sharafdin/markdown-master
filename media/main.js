const vscode = acquireVsCodeApi(); // Get the vscode API

// getting elements from the document
let input = document.querySelector('input');
let contentPreview = document.querySelector('.content');

function generateFile() {
    const content = `# ${input.value}`;
    const fileName = input.value;

    vscode.postMessage({
        command: 'generateFile',
        fileName: fileName,
        content: content
    });
}

const button = document.querySelector('button');
button.addEventListener('click', (e) => {
    e.preventDefault();
    button.innerText = 'Generated!';
    generateFile();
});

const previewButton = document.querySelector('#preview');
const previewText = document.querySelector('.previewText');
previewButton.addEventListener('click', (e) => {
    e.preventDefault();
    previewButton.innerText = 'Previewing...';
    previewText.innerText = input.value ? 'Previewing ' + input.value + '.md' : 'Previewing README.md';
    contentPreview.innerHTML = `<h1>${input.value}</h1>`;
});
