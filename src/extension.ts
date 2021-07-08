/*
 * @Author: your name
 * @Date: 2021-07-08 17:18:15
 * @LastEditTime: 2021-07-08 19:29:00
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /json2class-vscode/src/extension.ts
 */

import * as vscode from 'vscode'
const generate = require('@chenxxx/json2class/dist/index').default

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    'json2class.generate',
    () => generateInterfaces()
  )
  context.subscriptions.push(disposable)
}

async function generateInterfaces() {
  const clipBoardContent = await readFromClipboard()

  try {
    const typeScriptInterfaces = generate(clipBoardContent)
    const activeTextEditor = vscode.window.activeTextEditor

    if (!activeTextEditor) {
      const document = await vscode.workspace
        .openTextDocument({
          language: 'typescript',
          content: typeScriptInterfaces
        })
      await vscode.window.showTextDocument(document)
    } else {
      await activeTextEditor.edit(edit => {
        const selection = activeTextEditor.selection.active
        edit.insert(selection, typeScriptInterfaces)
      })
    }

    vscode.window.showInformationMessage('TypeScript interfaces generated')
  } catch (exception) {
    vscode.window.showErrorMessage(
      'The clipboard does not contain a valid JSON'
    )
  }
}

async function readFromClipboard() {
  return vscode.env.clipboard.readText()
}

// this method is called when your extension is deactivated
export function deactivate() { }



