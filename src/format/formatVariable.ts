import { window, Selection, Position } from "vscode";
import { getClassInformationFromEditorCursor } from '../util';
import * as vscode from 'vscode';

export function formatVariableReferenceConstructor() :vscode.Disposable {
    let disposable = vscode.commands.registerCommand("extension.formatVariableReferenceConstructor", () => {

        let currentSelection = window.activeTextEditor?.selection;
        let information = getClassInformationFromEditorCursor();

        if (information === null || information === undefined) {
            vscode.window.showErrorMessage("Where is the Class?I can't find it.");
            return;
        }
        let classScope = information.classContent;

        console.log(classScope);
    });
    return disposable;

}