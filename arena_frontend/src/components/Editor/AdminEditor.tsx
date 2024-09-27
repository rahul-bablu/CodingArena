import {
  Card,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent
} from "@mui/material";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import styles from "./Editor.module.css";


let initLanguages = [
  ["c", "C (GCC 9.2.0)"],
  ["cpp", "C++ (GCC 9.2.0)"],
  ["python", "Python (3.8.1)"],
  ["javascript", "JavaScript (Node.js 12.14.0)"],
  ["go", "Go (1.13.5)"],
  ["java", "Java (OpenJDK 13.0.1)"],
  ["rust", "Rust (1.40.0)"],
  ["typeScript", "TypeScript (3.7.4)"],
];

// const initStaterCode: { [key: string]: string } = {
//   c: `#include <stdio.h>
// #include <stdint.h>

// int main()
// {
//     uint64_t dx = 0x77E435B08;
//     while (dx) {
//         putchar(0x726F6C6564574820 >> (((dx >>= 3) & 7) << 3) & 0xFF);
//     }
// }`,
//   java: `import java.io.*;
// import java.util.*;

// public class Main {

//     public static void main(String[] args) {
//         /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Main. */
//     }
// }`,
//   "c#": `using System;
// using System.Collections.Generic;
// using System.IO;
// class Solution {
//     static void Main(String[] args) {
//         /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution */
//     }
// }`,
//   python: `# Enter your code here. Read input from STDIN. Print output to STDOUT`,
//   go: `package main
// import "fmt"

// func main() {
// 	/* Enter your code here. Read input from STDIN. Print output to STDOUT */ 
// }`,
//   javascript: `function processData(input) {
// 	/* Enter your code here. Read input from STDIN. Print output to STDOUT */ 
// } 

// process.stdin.resume();
// process.stdin.setEncoding("ascii");
// _input = "";
// process.stdin.on("data", function (input) {
//     _input += input;
// });

// process.stdin.on("end", function () {
//    processData(_input);
// });`,
// };

export const AdminEditor = ({
  language,
  initCode,
}: {
  language: MutableRefObject<string>;
  initCode: MutableRefObject<string>;
}) => {
  const cmplang = useRef(language.current);
  const clipbord = useRef("");
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);
  const [languages, _setLanguages] = useState(initLanguages);
  const [theme, setTheme] = useState(
    localStorage.getItem("code-theme") || "vs-dark"
  );

  useEffect(() => {
    // console.log("Trying Editer load", initStaterCode, setLanguages([]));
    if (monacoEl.current) {
        setEditor((editor) => {
          if (editor) return editor;
          
          const ed = monaco.editor.create(monacoEl.current!, {
            value: "getStater(cmplang.current, false, true)",
  
            language: cmplang.current,
            automaticLayout: true,
            dropIntoEditor: { enabled: false },
            theme: theme,
            fontFamily: " Consolas, 'Courier New', monospace",
            // fontWeight: "medium",
            fontWeight: "normal",
            fontSize: 16,
            lineHeight: 22,
            letterSpacing: 0,
          });
          
        return ed;
        });
      
    }


    return () => {editor?.dispose();};
  }, [monacoEl]);


  function changeLanguage(lang: string) {
    language.current= lang;
    // language = tm
    // alert("got" + lang);
    // console.log(editor?.getValue(), "coucbeiub");
    // setLanguage(cmplang.current);
    // localStorage.setItem("current-lang", cmplang.current);
    monaco.editor.setModelLanguage(editor?.getModel()!, lang);
    // editor?.setValue(getStater(cmplang.current));

    // editor.
  }

  useEffect(()=>{
    editor?.onDidChangeModelContent(() => {
        // console.log(editor.getValue(), "Secound", cmplang.current);
  
        initCode.current = editor.getValue();
      });
  }, [editor])

  

  function changeTheme(event: SelectChangeEvent) {
    const tm = event.target.value;
    setTheme(tm);
    monaco.editor.setTheme(tm);
    localStorage.setItem("code-theme", tm);
  }

  return (
    <Card style={{ height: "100%", position:'relative', paddingTop: 5,
      paddingBottom: 5,
       }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {JSON.stringify(languages, null, 2)}
        <div>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="language-selection-lable">Language</InputLabel>
            <Select
              labelId="language-selection-lable"
              id="language-selection-lable"
              value={language.current}
              label="Language"
              onChange={(e) => changeLanguage(e.target.value as string)}
              size="small"
            >
              {languages.map((v, _i) => (
                <MenuItem value={v[0]} key={v[1]}>
                  {v[1]}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="language-selection-lable">Theme</InputLabel>
            <Select
              labelId="language-selection-lable"
              id="language-selection-lable"
              value={theme}
              label="Theme"
              onChange={changeTheme}
              size="small"
            >
              <MenuItem value={"vs-dark"}>VS Dark</MenuItem>
              <MenuItem value={"vs"}>VS</MenuItem>
              <MenuItem value={"hc-black"}>Hign Contrast Black</MenuItem>
              <MenuItem value={"light"}>Light</MenuItem>
            </Select>
          </FormControl>
        </div>
        
      </div>

            <div style={{position:'relative', width:'100%', height:"92%", }}>
            <div className={styles.Editor} ref={monacoEl}></div>
      
        </div>
    </Card>
  );
};
