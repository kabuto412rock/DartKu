
import * as vscode from 'vscode';
import { generateConstructorDisposable } from './generate /constructorBase';
import { generateOverrideDisposable } from './generate /overrideBase';

export function activate(context: vscode.ExtensionContext) {
    context.subscriptions.push(
        generateConstructorDisposable(),// work
        generateOverrideDisposable(context));// current not work...
}
