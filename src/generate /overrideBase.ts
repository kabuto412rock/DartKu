import * as vscode from 'vscode';
import { getMethodInformationFromClassContent, getClassInformationFromEditorCursor, setCursorInCurrentTextEditor, jsonCopy } from './util';
import { format } from 'path';
import { stringify } from 'querystring';
import { downloadAndUnzipVSCode } from 'vscode-test';

export function generateOverrideDisposable(context: vscode.ExtensionContext): vscode.Disposable {
    let disposable = vscode.commands.registerCommand("extension.overrideMethods", async function () {
        // 0. Keep Editor or your current edit will be broken by command "goToSuper".
        await vscode.commands.executeCommand("workbench.action.keepEditor");

        // 1. Get information include the class's range and class scope string in the document
        let information = getClassInformationFromEditorCursor();

        if (information === null) {
            vscode.window.showErrorMessage("Where is the Class?I can't find it.");
            return;
        }
        // vscode.window.showInformationMessage("class name is", information.className);

        // TODO: Check the super class is in the same file or not
        console.log("classNamesInThisFile:", information.classNamesInThisFile);
        console.log("information.extendString:", information.extendString);

        let isSuperClassSameFile: boolean = false;
        let extendClassName: string;
        let extendClassNameIndex: number = 0;
        if (information.extendString !== "") {
            extendClassName = information.extendString;
            console.log("Your extend class:'", extendClassName, "'");
            information.classNamesInThisFile.forEach(someClass => {

            });
            information.classNamesInThisFile.forEach((someClass, index, arr) => {
                console.log("Another claas in same file:'", someClass, "'");
                if (someClass === extendClassName) {
                    console.log("同樣的");
                    isSuperClassSameFile = true;
                    if (information !== null) {
                        extendClassNameIndex = information.classNamesInThisFileIndices[index];
                    }
                }
            });
        }
        console.log("isSuperClassSameFile:", isSuperClassSameFile);
        let extension = vscode.extensions.getExtension("dart-code.dart-code");
        if (extension === undefined || extension.isActive === false) {
            vscode.window.showErrorMessage("You should install the extension 'Dart' from 'Dart Code'");
            return;
        }

        extension.activate().then(async function () {
            if (!isSuperClassSameFile) {
                await vscode.commands.executeCommand("dart.goToSuper");
            }
            if (isSuperClassSameFile) {
                let editor = vscode.window.activeTextEditor;

                if (editor === undefined) {
                    vscode.window.showErrorMessage("You should install the extension 'Dart' from 'Dart Code'");
                    return;
                }
                // move cursor to your super class when it's in the same file
                let extendClassNamePosition = editor.document.positionAt(extendClassNameIndex);
                setCursorInCurrentTextEditor(extendClassNamePosition);
            }
            let superClassInformation = getClassInformationFromEditorCursor();
            if (superClassInformation === null) {
                vscode.window.showErrorMessage("Super class is not really open... Maybe you should try to issue or fork author's project solve this by yourself.");
                return;
            }
            if (!isSuperClassSameFile) {
                await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
            }
            // console.log("#class@", superClassInformation.className);
            // console.log("#class#", superClassInformation.classContent);
            let methodsTemplateList = getMethodInformationFromClassContent(superClassInformation.classContent);

            // show simple override Hint(work but i want to split the window &put it right!)
            vscode.workspace.openTextDocument({
                content: methodsTemplateList.join("\n"),
                language: "dart",
            }).then((doc) => {
                vscode.window.showTextDocument(doc, {
                    viewColumn: vscode.ViewColumn.Two
                });
            });

        });
        vscode.window.showInformationMessage("DartKu: OverrideMethods");

    });
    return disposable;
}


