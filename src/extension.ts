// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from "vscode";

// const fs = require("fs");
// const path = require("path");

import { SidebarProvider } from "./SidebarProvider";
import { PreviewProvider } from "./PreviewProvider";

export function activate(context: vscode.ExtensionContext) {
  console.log('Congratulations, your extension "Markdown Master" is now active!');

  // let disposable = vscode.commands.registerCommand(
  //   "Markdown-Master.generateFile",
  //   () => {
      // const content = "# Sharafdin";

      // const folderPath =
      //   vscode.workspace.workspaceFolders &&
      //   vscode.workspace.workspaceFolders[0].uri.fsPath;

      // if (!folderPath) {
      //   return vscode.window.showErrorMessage(
      //     "Failed to determine the workspace folder path"
      //   );
      // }

      // fs.writeFile(path.join(folderPath, "README.md"), content, (err: any) => {
      //   if (err) {
      //     console.error(err);
      //     return vscode.window.showErrorMessage(
      //       "Failed to create README.md file"
      //     );
      //   }
      //   vscode.window.showInformationMessage(
      //     "The README.md file has been generated successfully"
      //   );
      // });
  //   }
  // );

  // context.subscriptions.push(disposable)

  context.subscriptions.push(vscode.commands.registerCommand(
    "Markdown-Master.preview",
    () => {
      PreviewProvider.createOrShow(context.extensionUri);
    }));

  const sidebarProvider = new SidebarProvider(context.extensionUri);
  // const previewProvider = new PreviewProvider(context.extensionUri);

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider(
      
      "Markdown-Master-sidebar",
      sidebarProvider
    )
  );
}

// This method is called when your extension is deactivated
export function deactivate() {}
