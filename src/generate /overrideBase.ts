import * as vscode from 'vscode';

export function generateOverrideDisposable(): vscode.Disposable {
    let disposable = vscode.commands.registerCommand("extension.overrideMethods", () => {
        // TODO: Try to override the parent class or interface's methods in the Dart.
        vscode.window.showInformationMessage("DartKu: OverrideMethods");
    });
    return disposable;
}