import * as vscode from 'vscode';
import { getMethodInformationFromClassContent, getClassInformationFromEditorCursor, setCursorInCurrentTextEditor, jsonCopy } from './util';
import { format } from 'path';

export function generateOverrideDisposable(): vscode.Disposable {
    let disposable = vscode.commands.registerCommand("extension.overrideMethods", () => {
        // Works below can't work in preview mode
        // vscode.commands.executeCommand("workbench.action.files.save");
 
        vscode.commands.executeCommand("workbench.action.keepEditor");
        // 1. Get information include the class's range and class scope string in the document
        let information = getClassInformationFromEditorCursor();

        if (information === null) {
            vscode.window.showErrorMessage("Where is the Class?I can't find it.");
            return;
        }
        vscode.window.showInformationMessage("class name is", information.className);

        let extension = vscode.extensions.getExtension("dart-code.dart-code");
        if (extension === undefined || extension.isActive === false) {
            vscode.window.showErrorMessage("You should install the extension 'Dart' from 'Dart Code'");
            return;
        }
        extension.activate().then(async function () {
            await vscode.commands.executeCommand("dart.goToSuper").then(async function () {

                let superClassInformation = getClassInformationFromEditorCursor();
                if (superClassInformation === null) {
                    vscode.window.showErrorMessage("Super class is not really open... Maybe you should try to issue or fork author's project solve this by yourself.")
                    return;
                }
                await vscode.commands.executeCommand("workbench.action.closeActiveEditor");

                console.log("#class@", superClassInformation.className);
                console.log("#class#", superClassInformation.classContent);
                getMethodInformationFromClassContent(superClassInformation.classContent);
            });

        });

        // 
        vscode.window.showInformationMessage("DartKu: OverrideMethods");

    });
    return disposable;
}