
import * as vscode from 'vscode';
import { generateConstructorDisposable } from './generate /constructorBase';


export function activate(context: vscode.ExtensionContext) {

    let disposable2 = vscode.commands.registerCommand("extension.overrideMethods", () => {
        // TODO: Try to override the parent class or interface's methods in the Dart.
        vscode.window.showInformationMessage("DartKu: OverrideMethods");
    });

    context.subscriptions.push(
        generateConstructorDisposable(), disposable2);
}