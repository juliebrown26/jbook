import './code-editor.css';
import './syntax.css';
import { useRef } from 'react';
import MonacoEditor, { EditorDidMount } from "@monaco-editor/react";
// import prettier from 'prettier';
// import parser from 'prettier/parser-babel';
import codeShift from 'jscodeshift';
import Highlighter from 'monaco-jsx-highlighter';

interface CodeEditorProps {
  initialValue: string;
  onChange(value: string): void;
}

const CodeEditor: React.FC<CodeEditorProps> = ({ onChange, initialValue }) => {
  const editorRef = useRef<any>();

  const onEditorDidMount: EditorDidMount = (getValue, monacoEditor) => {
    editorRef.current = monacoEditor;
    monacoEditor.onDidChangeModelContent(() => {
      onChange(getValue());
    });

    monacoEditor.getModel()?.updateOptions({ tabSize: 2 });

    const highlighter = new Highlighter(
      // @ts-ignore
      window.monaco,
      codeShift,
      monacoEditor
    );
    highlighter.highLightOnDidChangeModelContent(
      () => {},
      () => {},
      undefined,
      () => {}
    );
  };

  // ****** TODO: Figure out Prettier and webpack 5 issues ******
  // const onFormatClick = () => {
  //   // get current value from editor
  //   const unformatted = editorRef.current.getModel().getValue();

  //   // format the value
  //   const formatted = prettier.format(unformatted, {
  //     // parser: 'babel',
  //     // plugins: [parser],
  //     useTabs: false,
  //     semi: true,
  //     singleQuote: true,
  //   }).replace(/\n$/, '')

  //   // set the formatted value back in the editor
  //   editorRef.current.setValue(formatted);
  // }

  return (
    <div className='editor-wrapper'>
      {/* add onCLick function for formatting: onClick={onFormatClick} */}
      <button
        className='button button-format is-primary is-small'
      >
        Format
      </button>
      <MonacoEditor
        editorDidMount={onEditorDidMount}
        value={initialValue}
        theme="dark"
        language="javascript"
        height="500px"
        options={{
          wordWrap: "on",
          minimap: { enabled: false },
          showUnused: false,
          folding: false,
          lineNumbersMinChars: 3,
          fontSize: 16,
          scrollBeyondLastLine: false,
          automaticLayout: true,
        }}
      />
    </div>
  );
};

export default CodeEditor;
