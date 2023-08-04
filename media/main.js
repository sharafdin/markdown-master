const vscode = acquireVsCodeApi(); // Get the vscode API

function generateFile() {
    let input = document.querySelectorAll('input');
    const content = `# ${input[0].value}\n\n${input[1].value}`;
    const fileName = input[0].value;

    vscode.postMessage({
        command: 'generateFile',
        fileName: fileName,
        content: content
    });
}

function preview() {
    let input = document.querySelectorAll('input');
    const content = `# ${input[0].value}\n\n${input[1].value}`;
    const fileName = input[0].value;

    vscode.postMessage({
        command: 'preview',
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
