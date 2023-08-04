import * as vscode from "vscode";
import { getNonce } from "./getNonce";
const fs = require("fs");
const path = require("path");

export class SidebarProvider implements vscode.WebviewViewProvider {
  _view?: vscode.WebviewView;
  _doc?: vscode.TextDocument;

  constructor(private readonly _extensionUri: vscode.Uri) {}

  public resolveWebviewView(webviewView: vscode.WebviewView) {
    this._view = webviewView;

    webviewView.webview.options = {
      // Allow scripts in the webview
      enableScripts: true,

      localResourceRoots: [this._extensionUri],
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

    webviewView.webview.onDidReceiveMessage(async (data) => {
      switch (data.command) {
        case 'generateFile':
            if (!vscode.workspace.workspaceFolders) {
                vscode.window.showErrorMessage('Please open a workspace before trying to generate a file.');
                return;
            }

            const content = data.content;
            const fileName = data.fileName;
            const folderPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
            fs.writeFile(path.join(folderPath, `${fileName? fileName : 'README'}.md`), content, (err:any) => {
                if (err) {
                    console.error(err);
                    return vscode.window.showErrorMessage('Failed to generate README.md file😑');
                } else{
                  return vscode.window.showInformationMessage('Successfully generated a README.md file🎉');
                }
            });
          case 'preview':
            break;
    }
      
      switch (data.type) {
        case "onInfo": {
          if (!data.value) {
            return;
          }
          vscode.window.showInformationMessage(data.value);
          break;
        }
        case "onError": {
          if (!data.value) {
            return;
          }
          vscode.window.showErrorMessage(data.value);
          break;
        }
      }
    });
  }

  public revive(panel: vscode.WebviewView) {
    this._view = panel;
  }

  private _getHtmlForWebview(webview: vscode.Webview) {
    const scriptUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "main.js")
    );
    const styleResetUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "reset.css")
    );
    const styleVSCodeUri = webview.asWebviewUri(
      vscode.Uri.joinPath(this._extensionUri, "media", "vscode.css")
    );


    // Use a nonce to only allow a specific script to be run.
    const nonce = getNonce();

    return `<!DOCTYPE html>
			<html lang="en">
			<head>
				<meta charset="UTF-8">
				<!--
					Use a content security policy to only allow loading images from https or from our extension directory,
					and only allow scripts that have a specific nonce.
        -->
        <meta http-equiv="Content-Security-Policy" content="img-src https: data:; style-src 'unsafe-inline' ${
          webview.cspSource
        };
				<meta name="viewport" content="width=device-width, initial-scale=1.0">
				<link href="${styleResetUri}" rel="stylesheet">
				<link href="${styleVSCodeUri}" rel="stylesheet">

			</head>
      <body>

      <h3>Welcome to Markdown Master</h3>
      <p>Write Markdown files in GUI</p>
      <form>
      <!-- <input style="border: 1px solid" type="text" placeholder="Enter your MD name with out (.md)"> -->
      <input style="border: 1px solid" type="text" placeholder="File name with out (.md)">
      <input style="border: 1px solid" type="text" placeholder="Enter your paragraph">
      
      <button id='Generate'>Generate</button>
      <button id='preview'>Preview</button>
      <br />
      <br />
      <br />
      
      <p style="color: #fff; text-align: center"> &copy; Sharafdin</p>
      </form>

      <div class="content" id="content">

      </div>

      <script src="${scriptUri}" nonce="${nonce}">
      
			</body>
			</html>`;
  }
}
