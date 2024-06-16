import { useRef, useState, useEffect } from "react";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import styles from "./Editor.module.css";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
  IconButton,
  Tooltip,
  CircularProgress,
  Box,
} from "@mui/material";
import RestartAltIcon from "@mui/icons-material/RestartAlt";
import Axios from "axios";


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

const initStaterCode: { [key: string]: string } = {
  c: `#include <stdio.h>
#include <stdint.h>

int main()
{
    uint64_t dx = 0x77E435B08;
    while (dx) {
        putchar(0x726F6C6564574820 >> (((dx >>= 3) & 7) << 3) & 0xFF);
    }
}`,
  java: `import java.io.*;
import java.util.*;

public class Main {

    public static void main(String[] args) {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Main. */
    }
}`,
  "c#": `using System;
using System.Collections.Generic;
using System.IO;
class Solution {
    static void Main(String[] args) {
        /* Enter your code here. Read input from STDIN. Print output to STDOUT. Your class should be named Solution */
    }
}`,
  python: `# Enter your code here. Read input from STDIN. Print output to STDOUT`,
  go: `package main
import "fmt"

func main() {
	/* Enter your code here. Read input from STDIN. Print output to STDOUT */ 
}`,
  javascript: `function processData(input) {
	/* Enter your code here. Read input from STDIN. Print output to STDOUT */ 
} 

process.stdin.resume();
process.stdin.setEncoding("ascii");
_input = "";
process.stdin.on("data", function (input) {
    _input += input;
});

process.stdin.on("end", function () {
   processData(_input);
});`,
};

let count: number=0;
export const Editor = ({
  language,
  setLanguage,
  problemId,
  // getStater,
  // initValue,
  onValueChange,
}: {
  language: string;
  setLanguage: (lang: string) => void;
  // getStater: (lang: string, force?: boolean) => string;
  // initValue: string;
  problemId: number;
  onValueChange: (value: string, language: string) => void;
}) => {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);
  let clipbord = "";
  const staterCode = useRef(initStaterCode);
  const [languages, setLanguages] = useState(initLanguages);
  const [theme, setTheme] = useState(
    localStorage.getItem("code-theme") || "vs-dark"
  );
  const cmplang = useRef(language); // this just a copy used for immediate change and computation
  const flag = useRef(false);
  
  const getFromLocalStorage = (lang:string) => {
    let storageData = JSON.parse(
      localStorage.getItem("autoSavedCodes") || "{}"
    );

    // Load the code if it exists
    if (
      storageData &&
      storageData[problemId] &&
      storageData[problemId][lang] !== undefined
    ) {
      return storageData[problemId][lang];
    }
    return null;
    
  }
  
  const getStater = (lang: string, force: boolean = false, set: boolean = false) => {
    let storageData = getFromLocalStorage(lang);
    if(!force && storageData) {
      return storageData;
    } else {
      if(set)
      onValueChange(staterCode.current[lang], lang)
      return staterCode.current[lang] || "";
    }
  };

  useEffect(() => {
    // console.log("editor changed", count);
    // count++;
    flag.current = false
    Axios.get(`/api/problem/statercode/${problemId}`, {
      withCredentials: true,
    })
      .then(({ data }) => {
        if (data) {
          staterCode.current = JSON.parse(data.scode);
          setLanguages(JSON.parse(data.languages));
          // editor?.setValue(getStater(language));
          
        }
        // console.log(data);
      })
      .catch((_e) => {
        // alert("Couldn't stater codes" + "error");
        
      }).finally(()=>{flag.current = true;});
  }, [staterCode]);

  useEffect(()=>{
    if(!editor) return;
    if (
      languages.reduce(
        (total, num) => (num[0] == cmplang.current ? true : false || total),
        false
      )
    ) {
      if(!getFromLocalStorage(cmplang.current)){
        changeLanguage(cmplang.current)
      }
      } else {
      changeLanguage(languages[0][0]);
      // alert('NP')
    }
  },[languages]);

  useEffect(() => {
    console.log("Trying Editer load");
    if (monacoEl.current) {
        setEditor((editor) => {
          if (editor) return editor;
          
          return monaco.editor.create(monacoEl.current!, {
            value: getStater(language, false, true),

            language: language,
            automaticLayout: true,
            theme: theme,
            fontFamily: " Consolas, 'Courier New', monospace",
            // fontWeight: "medium",
            fontWeight: "normal",
            fontSize: 16,
            lineHeight: 22,
            letterSpacing: 0,
          });
        });
      
    }


    return () => {editor?.dispose();};
  }, [monacoEl]);

  useEffect(() => {
    const triggerPaste = (text: string) => {
      if (editor) {
        const position = editor.getPosition()!;
        editor?.executeEdits("", [
          {
            range: new monaco.Range(
              position.lineNumber,
              position.column,
              position.lineNumber,
              position.column
            ),
            text: text,
            forceMoveMarkers: true,
          },
        ]);
        const newPosition = {
          lineNumber: position.lineNumber,
          column: position.column + text.length,
        };
        editor.setPosition(newPosition);

        editor?.focus();
      }
    };

    // prevent Ctrl + v and c
    editor?.onKeyDown((event) => {
      const { keyCode, ctrlKey, metaKey } = event;
      if ((keyCode === 33 || keyCode === 54) && (metaKey || ctrlKey)) {
        if (editor) {
          const model = editor.getModel()!;
          const selection = editor.getSelection();
          if (selection) {
            const selectedText = model.getValueInRange(selection);
            clipbord = selectedText;
          }
        }
        // event.preventDefault();
        return;
      }

      if (keyCode === 52 && (metaKey || ctrlKey)) {
        triggerPaste(clipbord);
        event.preventDefault();
      }
    });

    editor?.onDidChangeModelContent(() => {
      // console.log(editor.getValue(), "Secound", cmplang.current);

      onValueChange(editor.getValue(), cmplang.current);
    });

    // prevent right click and past
    editor?.onDidPaste(() => {
      // alert("No cheating");
      editor.trigger("", "undo", undefined);
      triggerPaste(clipbord);
    });
  }, [editor]);

  function changeLanguage(lang: string) {
    cmplang.current = lang;
    // language = tm
    // alert("got" + lang);
    // console.log(editor?.getValue(), "coucbeiub");
    setLanguage(cmplang.current);
    localStorage.setItem("current-lang", cmplang.current);
    monaco.editor.setModelLanguage(editor?.getModel()!, cmplang.current);
    editor?.setValue(getStater(cmplang.current));

    // editor.
  }

  

  function changeTheme(event: SelectChangeEvent) {
    const tm = event.target.value;
    setTheme(tm);
    monaco.editor.setTheme(tm);
    localStorage.setItem("code-theme", tm);
  }

  return (
    <div style={{ height: "100%", marginTop: 5 }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
            <InputLabel id="language-selection-lable">Language</InputLabel>
            <Select
              labelId="language-selection-lable"
              id="language-selection-lable"
              value={language}
              label="Language"
              onChange={(e) => changeLanguage(e.target.value)}
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
        <Tooltip title="Reset to default code">
          <IconButton
            onClick={() => editor?.setValue(getStater(language, true))}
            sx={{
              color: "black",
              "&:hover": {
                backgroundColor: "transparent",
                cursor: "default",
              },
            }}
            disableRipple
          >
            <RestartAltIcon fontSize="large" />
          </IconButton>
        </Tooltip>
      </div>

            <div style={{position:'relative', width:'100%', height:"100%"}}>
            <div className={styles.Editor} ref={monacoEl}></div>
      {flag.current && false ?<></>:<Box sx={{ width: "100%", height: "100vh", position: "relative" }}>
          <div
            style={{
              top:'30%',
              left: "50%",
              zIndex: 200,
              transform: "translate(-50%, -50%)",
              position: "absolute",
            }}
          >
            <div>Making your editor ready please standby...</div>
            <div style={{margin:'auto', width:'max-content'}}><CircularProgress /></div>
          </div>
        </Box>}
        </div>
    </div>
  );
};
