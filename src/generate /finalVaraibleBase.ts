import { window, commands, Disposable } from "vscode";

export async function generateFinalVariableInput() {

    // i'm too lazy to touch many times enter;
    // Wait!!Can i make one line variables declartion and use extension to format?
    // I think it's functionality that should be inserted into my extension.

    window.showInputBox({
        prompt: "Generate final variable",
        placeHolder: "Ex: int a;float b;Circle c= new Circle(\"demo;;\")"
    }).then((userInput) => {
        if (userInput === undefined) {
            return;
        }
        let regexp = /([^\s;]+)\s*([\w\d]+)\s*(=(\s*([^\s]+|\"[^\"]\"|new [\w\d]+\(.*\))))?\s*;/g;
        let match: RegExpExecArray | null;

        let finalVariablesTemplate = "";
        while (match = regexp.exec(userInput)) {
            finalVariablesTemplate += "final " + match[0] + "\n";
        }
        const editor = window.activeTextEditor;

        if (editor === undefined || editor === null) {
            window.showErrorMessage("Oops!Can't find editor to insert declarations.");
            return;
        }
        editor.edit((editBuilder) => {
            // let constructBodyInsideOffset = editor.document.offsetAt(vscode.window.visibleTextEditors[0].selection.active)+ constructorContentTemplate.length;
            let insertPosition = editor.selection.active;
            editBuilder.insert(insertPosition, finalVariablesTemplate);
        });

    });


}