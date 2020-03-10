import * as vscode from 'vscode';
import { getClassInformationFromEditorCursor, setCursorInCurrentTextEditor } from '../util';

export function showSuperClassIWant(): vscode.Disposable {
    let disposable = vscode.commands.registerCommand("extension.showSuperClassIWant", async function () {
        await vscode.commands.executeCommand("workbench.action.keepEditor");
        console.log("show i want");

        // 1. Get information include the class's range and class scope string in the document
        let information = getClassInformationFromEditorCursor();

        if (information === null || information === undefined) {
            vscode.window.showErrorMessage("Where is the Class?I can't find it.");
            return;
        }
        let extension = vscode.extensions.getExtension("dart-code.dart-code");
        if (extension === undefined || extension.isActive === false) {
            vscode.window.showErrorMessage("You should install the extension 'Dart', its author is 'Dart Code'");
            return;
        }
        let isSuperClassSameFile: boolean = false;
        let extendClassName: string;
        let extendClassNameIndex: number = 0;
        if (information.extendString !== "") {
            extendClassName = information.extendString;
            // console.log("Your extend class:'", extendClassName, "'");
            information.classNamesInThisFile.forEach((someClass, index, arr) => {
                // console.log("Another claas in same file:'", someClass, "'");
                if (someClass === extendClassName) {
                    // console.log("同樣的");
                    isSuperClassSameFile = true;
                    if (information !== null) {
                        extendClassNameIndex = information.classNamesInThisFileIndices[index];
                    }
                }
            });
        }

        extension.activate();

        await vscode.commands.executeCommand("dart.goToSuper");

        let goToSuperUri = vscode.window.activeTextEditor?.document.uri;

        if (goToSuperUri === undefined || goToSuperUri === null) {
            vscode.window.showErrorMessage("You can't open the super class file.");
            return;
        }
        let superClassInformation = getClassInformationFromEditorCursor();

        console.log("");
        let doc = await vscode.workspace.openTextDocument(goToSuperUri);

        if (!isSuperClassSameFile) {
            await vscode.commands.executeCommand("workbench.action.closeActiveEditor");
        }

        await vscode.window.showTextDocument(doc, {
            viewColumn: vscode.ViewColumn.Two
        }).then((editor) => {
            if (editor === undefined || editor === null) {
                return null;
            }
            if (superClassInformation === null) {
                vscode.window.showErrorMessage("Super class is not really open... Maybe you should try to issue or fork author's project solve this by yourself.");
                return;
            }
            console.log("SuperClass's content", superClassInformation.classContent);
            // Get super class's name position from its document.
            let superClassNamesInformationIndex: number = -1;
            if (superClassInformation.classNamesInThisFileIndices.length === superClassInformation.classNamesInThisFile.length) {
                let targetClassName = superClassInformation.className;
                for (let index = 0; index < superClassInformation.classNamesInThisFileIndices.length; index++) {
                    const className = superClassInformation.classNamesInThisFile[index];
                    console.log("look for superClass's name:", className, ", target:", targetClassName);
                    if (targetClassName === className) {
                        superClassNamesInformationIndex = superClassInformation.classNamesInThisFileIndices[index];
                        console.log("Found it", superClassNamesInformationIndex);
                        break;
                    }
                }
            }
            if (superClassNamesInformationIndex === -1) {
                vscode.window.showErrorMessage("Not found where the cursor should be putted... ");
            }

            let newCursorPositionInSuperClass = editor.document.positionAt(superClassNamesInformationIndex);
            console.log("line:", newCursorPositionInSuperClass.line, ", char:", newCursorPositionInSuperClass.character);
            setCursorInCurrentTextEditor(newCursorPositionInSuperClass);
            editor.revealRange(new vscode.Range(newCursorPositionInSuperClass, newCursorPositionInSuperClass));


        });

    });
    return disposable;
}