
import * as vscode from 'vscode';
import { generateConstructor } from './generate /constructorBase';
import { generateOverrideDisposable } from './generate /overrideBase';
import { showSuperClassIWant } from './hint/showIWant';
import { generateFinalVariableInput } from './generate /finalVaraibleBase';

export function activate(context: vscode.ExtensionContext) {
    let disposable1 = vscode.commands.registerCommand("DartKu.generateConstructor", () => {
        generateConstructor();
    });
    let disposable2 = vscode.commands.registerCommand("DartKu.showSuperClassIWant", async function () {
        showSuperClassIWant();
    });

    let disposable3 = vscode.commands.registerCommand("DartKu.generateFinalVariableInput", () => {
        generateFinalVariableInput();
    });

    context.subscriptions.push(disposable1,// Stable
        disposable2,// Experimental functionality
        disposable3
    );

    context.subscriptions.push(quickPickDartKu(context));
}

function quickPickDartKu(context: vscode.ExtensionContext): vscode.Disposable {
    let disposable = vscode.commands.registerCommand("DartKu.quickPickDartKu", () => {
        const quickPick = vscode.window.createQuickPick();
        const options: { [key: string]: (context: vscode.ExtensionContext) => Promise<void> } = {
            generateConstructor,
            generateFinalVariableInput,
            showSuperClassIWant
		};

		quickPick.items = Object.keys(options).map(label => ({ label }));
		quickPick.onDidChangeSelection(selection => {
			if (selection[0]) {
				options[selection[0].label](context)
					.catch(console.error);
            }
		});
		quickPick.onDidHide(() => quickPick.dispose());
		quickPick.show();



    });
    return disposable;
}
