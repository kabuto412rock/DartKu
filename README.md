# DartKu 
This is a VSCode extension.
the code generate for Dart lang, i created it just for fun, so don't expect this extension can help you(even me😂).
## Features
1. generate a simple constructor code
   
2. 💩show super class document on the splited window(this's an experimental feature and using [Dart](https://marketplace.visualstudio.com/items?itemName=Dart-Code.dart-code) command "goToSuper")
3. generate final variables code.
## Requirements
You should allready installed extension [Dart](https://marketplace.visualstudio.com/items?itemName=Dart-Code.dart-code) in VSCode.

## Commands you can use.
1. ##### DartKu.generateConstructor
> Generate a simple constructor code
> (It can't understand what is your super class)
![The demo for Generate a simple constructor](./gif/DartKu_generateConstructor.gif)
2. ##### DartKu.showSuperClassIWant
> Show super class document and it will split the window, its performance just like💩
![The demo for showing the super class](./gif/dartku_show_super_class.gif)
3. ##### DartKu.generateFinalVariableInput
> it will show a inputbox, then transform your input from [normal variable declartion] to [final variable decalration].
Example:
You input "int a;double b=3.3;"and confirm then your editor will insert
"final int a;\n
 final double b=3.3;\n" into your code.
 ![final variable decalration.gif](./gif/finalVariableInout.gif)
4. ##### DartKu.quickPickDartKu
> Quick picker for the all DartKu commands.
> (Now just three commands above)
![DartKu Quick picker.gif](./gif/DartKu_quickPickDartKu.gif)
### Whatever
this extension isn't worth to install and my english is too terriable to understand your any quesion, Haha.
But i will do my best to understand😎 even my english levels likes 💩.
