import { window, Selection, Position } from "vscode";
export function jsonCopy(src: any): any {
    return JSON.parse(JSON.stringify(src));
}


function indexOfGroup(m: RegExpExecArray, n: number) {
    let ix = m.index;
    for (let i = 1; i < n; i++) {
        ix += m[i].length;

    }
    return ix;
}
type MethodInformation = {
    methodName: string,
    paramterNames: string[],
    parameterTypes: string[],
    returnType: string,
};
export type ClassCotentInformation = {
    startPosition: Position,
    endPosition: Position,
    classContent: string,
    className: string,
};

export function setCursorInCurrentTextEditor(newPosition: Position) {
    const editor = window.visibleTextEditors[0];

    var currentCursor = editor.selection.active;
    if (currentCursor === null) {
        window.showWarningMessage("Please put your cursor in text editor that you want to innsert your constructor's position .👿");
        return null;
    }
    var newCursorPosition = currentCursor.with(newPosition.line, newPosition.character);
    var newSelection = new Selection(newCursorPosition, newCursorPosition);
    editor.selection = newSelection;
}
export function getClassInformationFromEditorCursor(): ClassCotentInformation | null {

    if (window.visibleTextEditors.length < 1) {
        window.showWarningMessage("You don't have any texteditor in your workspace.😢");
        console.log("%You don't have any texteditor in your workspace.😢");
        return null;
    }
    const editor = window.visibleTextEditors[0];

    var currentCursor = editor.selection.active;
    if (currentCursor === null) {
        window.showWarningMessage("Please put your cursor in text editor that you want to innsert your constructor's position .👿");
        console.log("%Please put your cursor in text editor that you want to innsert your constructor's position .👿");
        return null;
    }
    window.showInformationMessage("Your current cursor 's line position is " + currentCursor.line.toString());
    var newCursorPosition = currentCursor.with(currentCursor.line, 0);
    var newSelection = new Selection(newCursorPosition, newCursorPosition);
    editor.selection = newSelection;

    // Current cursor's position 當前的游標位置
    const chPosition = newCursorPosition.character.toString();
    window.showInformationMessage("Your current cursor 's char is " + chPosition);
    const allText = editor.document.getText();

    // Find strings that match pattern like "class ... {" in all text string.
    // 找到所有符合"class ... {"
    // const allMatchArray = allText.match(/class .+{/g);
    const classRe = /(abstract class|class)\s([_\w\d\s]+)?(<([_\w\d\s,]+)>)?(\sextends\s<?([_<>,\w\d\s]+))>??\s?(implements\s(([_<>\w\d\s]+),?)+)?\s?{\n?/g;
    const cursorIndex = editor.document.offsetAt(newCursorPosition);
    let classCount = 0;
    let startIndex = 0;
    let realStartIndex = 0;
    let endIndex = 0;
    let isClassFind: boolean = false;
    let match;
    console.log("\n\n@@@@@@@@@@@@");
    while ((match = classRe.exec(allText)) !== null) {
        let bracketScore = 0;
        let matchClassName = match[2];
        console.log("matchClassName:", matchClassName);
        realStartIndex = match.index;

        startIndex = allText.indexOf('{', realStartIndex);
        bracketScore = 0;
        for (let index = startIndex; index < allText.length; index++) {
            const ch = allText[index];
            switch (ch) {
                case '{':
                    bracketScore += 1;
                    break;
                case '}':
                    bracketScore -= 1;
                    break;
            }
            if (bracketScore === 0) {
                endIndex = index;
                classCount += 1;
                break;
            }
        }

        console.log("cursorIndex = " + cursorIndex + " realStartIndex=" + realStartIndex + ", endIndex=" + endIndex);
        let cursorPosition = editor.document.positionAt(cursorIndex);
        console.log("line:", cursorPosition.line, ", char:", cursorPosition.character);
        if (cursorIndex >= realStartIndex && cursorIndex <= endIndex) {
            // find the class's range
            let realStartPosition = editor.document.positionAt(realStartIndex);
            console.log("realStatIndex:", realStartIndex, ", line:", realStartPosition.line, ", char:", realStartPosition.character);


            console.log("符合條件:", cursorIndex, " >= ", realStartIndex, " && ", cursorIndex, " <= ", endIndex);

            isClassFind = true;
            break;
        } else {
            console.log("不符合條件:", cursorIndex, " >= ", realStartIndex, " && ", cursorIndex, " <= ", endIndex);
        }


    }
    console.log("你逃出了while迴圈cursorIndex:", cursorIndex, " >= ", realStartIndex, " && ", cursorIndex, " <= ", endIndex);
    if (classCount === 0) {
        window.showWarningMessage("沒有class你還想叫我產生建構子...");
        console.log("%沒有class你還想叫我產生建構子...");

        return null;
    }

    if (isClassFind === false || match === null) {
        window.showWarningMessage("沒有找到對應的class, Sorry");
        console.log("%沒有找到對應的class, Sorry, isClassFind:", isClassFind, ",match:", match);
        return null;
    }
    let classContent = allText.substring(realStartIndex, endIndex);
    // 印出cursor所在的Class內容範圍
    // console.log(classContent);

    const bracketStartIndex = classContent.indexOf("{");
    const regexp = /class\s(([_\w\d]+)\s?(<[,\s\w\d]+>)?)(\sextends\s([_<>,\w\d\s]+))?\s?(implements\s(([_<>\w\d\s]+),?)+)?\s?{\n?/g;
    const matchClassName = regexp.exec(classContent);

    if (matchClassName === null) {
        console.log("%match is null...");
        return null;
    }
    const className = matchClassName[2];
    return {
        startPosition: editor.document.positionAt(realStartIndex),
        endPosition: editor.document.positionAt(endIndex),
        classContent: classContent,
        className: className,
    };

}

export function getMethodInformationFromClassContent(classContent: string) {
    let methodRe = /(([_\w\d]+)\s+([_\w\d]+)\s*\(([_\w\d\s]*,?)*\))/g
    let match: RegExpExecArray | null;

    // Regular Expression Result just like below
    /* All:$1
       RETURN_TYPE: $2
       METHOD_NAME: $3
       PARAMETER:(parmerType parameterName):$4 
    */
    while ((match = methodRe.exec(classContent)) !== null) {
        console.log("All:", match[1]);
        console.log("RETURN_TYPE:", match[2]);
        console.log("METHOD_NAME:", match[3]);
        console.log("PARAMETER:", match[4]);
        console.log("\n");
    }
}