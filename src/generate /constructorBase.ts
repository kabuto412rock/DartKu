

import * as vscode from 'vscode';
import { getClassInformationFromEditorCursor, setCursorInCurrentTextEditor, jsonCopy } from './util';

// TODO: generate the class's constructor in the Dart.
export function generateConstructorDisposable(): vscode.Disposable {
    let disposable = vscode.commands.registerCommand("extension.generateConstructor", () => {
        // 1. Get information include the class's range and class scope string in the document
        let information = getClassInformationFromEditorCursor();

        if (information === null) {
            vscode.window.showErrorMessage("Where is the Class?I can't find it.");
            return;
        }
        // 2. Show the class code that correspond to your cursor
        console.log(information.classContent);
        const bracketStartIndex = information.classContent.indexOf("{");
        const regexp = /class\s([_\w\d]+)(\sextends\s(.+))?\s?(implements\s(([_<>\w\d\s]+),?)+)?\s?{\n?/g;
        const match = regexp.exec(information.classContent);

        if (match === null) {
            console.log("match is null...");
            return;
        }
        const constructorName = match[1];
        vscode.window.showInformationMessage("constructorName is ", constructorName);
        console.log("constructorName is ", constructorName);

        // 3. Get variables bottom index in classContent(current constructor or function's top)
        const regexpForVariablesBottom = /((@override\s?\n)*(([\w\d_ ]+) )?[\w\d]+\([_\w\s\d]*\s?[_\w\d\s]*\) ?{)/g;
        const matchForVariablesBottom = regexpForVariablesBottom.exec(information.classContent);
        let variablesBottomIndex = information.classContent.length;
        if (matchForVariablesBottom !== null) {
            variablesBottomIndex = matchForVariablesBottom.index;
        }
        // 4. Generate a new class content string (Keep the class's variables scope and remove the other parts.)
        const classContentKeepVariables = information.classContent.substring(0, variablesBottomIndex);

        // 5. Get your class's variable type and name for new consturctor
        const regexpForVariables = /([\w\d]+)[ ]?([\w\d]+)[ ]?(( ?= ?)(("?([ \d\.\w]+)?"?)|((new)? ?\_?[\d\w]+\(\))))?;\n?/g;
        let classVariables: any[][] = [];
        let matchForVariable = regexpForVariables.exec(classContentKeepVariables);
        while (true) {
            // Get current class's variable type and variable name 
            if (matchForVariable === null) {
                break;
            }
            classVariables.push([matchForVariable[1], matchForVariable[2]]);
            matchForVariable = regexpForVariables.exec(classContentKeepVariables);
        }
        for (let index = 0; index < classVariables.length; index++) {
            const element = classVariables[index];
            console.log("classVariables[" + index + "]: type=", element[0], ", name=", element[1]);
        }
        console.log();

        // 6. Create new constructor boilerplate string
        var constructorContentTemplate = "\n"+constructorName + "(";
        if (classVariables.length > 0) {
            constructorContentTemplate += "{";
            classVariables.forEach(element => {
                constructorContentTemplate += "this.";
                constructorContentTemplate += element[1] + ",";
            });
            constructorContentTemplate += "}";
            
        }
        constructorContentTemplate += "){";
        let constructorContentTemplateEnd = "}\n";

        // 7. Get position for insert constructor into the code(Actually it's the vscode document)
        console.log("constructorContentTemplate:\n", constructorContentTemplate);
        if (vscode.window.activeTextEditor === undefined) {
            vscode.window.showErrorMessage("Your text editor already closed, I can't insert constructor into your dart file😢.");
            return;
        }
        let classHeadOffsetInDocument = vscode.window.activeTextEditor.document.offsetAt(information.startPosition);
        let classBottomOffset = classHeadOffsetInDocument + variablesBottomIndex;
        let classBottomPositionInDocument = vscode.window.activeTextEditor.document.positionAt(classBottomOffset);
        // 8. Insert your constructor template string (top of another class function and constuctor)
        setCursorInCurrentTextEditor(classBottomPositionInDocument);
        const editor = vscode.window.activeTextEditor;
        editor.edit((editBuilder) => {
            // let constructBodyInsideOffset = editor.document.offsetAt(vscode.window.visibleTextEditors[0].selection.active)+ constructorContentTemplate.length;
            editBuilder.insert(classBottomPositionInDocument, constructorContentTemplate + constructorContentTemplateEnd);
        }).then(( (value) => {
             // 9. Put the cursor in the construcotor body just like below
            /* ex: 
                construcotr(){
                    | <- it's your cursor
                }
            */
            const newCursorPosition = vscode.window.visibleTextEditors[0].selection.active;
            const maybeInsideBracketsOffset = editor.document.offsetAt(newCursorPosition) - constructorContentTemplateEnd.length;
            
            setCursorInCurrentTextEditor(editor.document.positionAt(maybeInsideBracketsOffset));
            vscode.window.showInformationMessage("DartKu:Generator Constructor is Nice!");

        }));

    });

    return disposable;
}
