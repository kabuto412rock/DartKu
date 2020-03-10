
import * as vscode from 'vscode';
import { generateConstructorDisposable } from './generate /constructorBase';
import { generateOverrideDisposable } from './generate /overrideBase';
import { formatVariableReferenceConstructor } from './format/formatVariable';
import { showSuperClassIWant } from './hint/showIWant';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        generateConstructorDisposable(),
        showSuperClassIWant()// work
        );
        // generateOverrideDisposable(context)// current not work...
}
