import RestartAltIcon from "@mui/icons-material/RestartAlt";
import {
  Card,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  Tooltip,
} from "@mui/material";
import Axios from "axios";
import * as monaco from "monaco-editor/esm/vs/editor/editor.api";
import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useAuth } from "../Auth/AuthProvider";
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
  java: `// from stater
import java.io.*;
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

export const Editor = ({
  language,
  setLanguage,
  problemId,
  clipboard: clipbord,
  // getStater,
  // initValue,
  onValueChange,
}: {
  language: string;
  setLanguage: (lang: string) => void;
  // getStater: (lang: string, force?: boolean) => string;
  // initValue: string;
  problemId: number;
  clipboard: MutableRefObject<string>;
  onValueChange: (value: string, language: string) => void;
}) => {
  const [editor, setEditor] =
    useState<monaco.editor.IStandaloneCodeEditor | null>(null);
  const monacoEl = useRef(null);
  // const clipbord = useRef("");
  const {user} = useAuth()!;
  const loding = useRef(true);
  // const [loding, setLoding] = useState(true);
  const staterCode = useRef(initStaterCode);
  const [languages, setLanguages] = useState(initLanguages);
  const [theme, setTheme] = useState(
    localStorage.getItem("code-theme") || "vs-dark"
  );
  const cmplang = useRef(language); // this just a copy used for immediate change and computation
  // const flag = useRef(false);
  const getFromLocalStorage = (lang: string) => {
    let storageData = JSON.parse(
      localStorage.getItem(user+"_autoSavedCodes") || "{}"
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
  };

  const getStater = (
    lang: string,
    force: boolean = false,
    set: boolean = false,
  ) => {
    let storageData = getFromLocalStorage(lang);
    console.log(storageData, force);
    if (!force && storageData) {
      return storageData;
    } else {
      if (set) onValueChange(staterCode.current[lang], lang);
    
      return staterCode.current[lang] || "";
    }
  };

  useEffect(() => {
    if (editor){
    Axios.get(`/api/problem/statercode/${problemId}`, {
      withCredentials: true,
    })
      .then(({ data }) => {
        if (data) {
          staterCode.current = JSON.parse(data.scode);
          const tmpl = JSON.parse(data.languages)
          setLanguages(tmpl);
          if (
            tmpl.some(
              (num:any) => num[0] === cmplang.current
            )
          ) {
            if (!getFromLocalStorage(cmplang.current)) {
              changeLanguage(cmplang.current);
              // editor.setValue(getStater(cmplang.current));
            }
          } else {
            changeLanguage(tmpl[0][0]);
          }
          // egetStater(cmplang.current, false, true)
        }
        console.log(data, JSON.parse(data.scode));
      })
      .catch((_e) => {
        console.log(_e);
      })
      .finally(() => {
        editor.setValue(getStater(cmplang.current, false, true));
        // setLoding(false);
        loding.current = false;
        // alert("Got stater");
      });
    }
  }, [editor]);

  useEffect(() => {
    if (monacoEl.current) {
      setEditor((editor) => {
        if (editor) return editor;
        // if (
        //   languages.some(
        //     (num) => num[0] === cmplang.current
        //   )
        // ) {
        //   if (!getFromLocalStorage(cmplang.current)) {
        //     changeLanguage(cmplang.current);
        //   }
        // } else {
        //   changeLanguage(languages[0][0]);
        // }
        const ed = monaco.editor.create(monacoEl.current!, {
            value: getStater(cmplang.current),
  
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
          const triggerPaste = (text: string) => {
            if (ed) {
              const position = ed.getPosition()!;
              ed?.executeEdits("", [
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
              const tmp = text.split(/\r\n|\r|\n/); 
              const newPosition = {
                lineNumber: position.lineNumber + tmp.length,
                column: position.column + text.length,
              };
              ed.setPosition(newPosition);
      
              ed?.focus();
            }
          };
      
          // prevent Ctrl + v and c
          ed?.onKeyDown((event) => {
            const { keyCode, ctrlKey, metaKey } = event;
            if ((keyCode === monaco.KeyCode.KeyC || keyCode === monaco.KeyCode.KeyX) && (metaKey || ctrlKey)) {
              if (ed) {
                const model = ed.getModel()!;
                const selection = ed.getSelection();
                if (selection) {
                  const selectedText = model.getValueInRange(selection);
                  clipbord.current = selectedText;
                //   alert(selectedText)
                }
              }
              return;
            }
      
            if (keyCode === monaco.KeyCode.Backspace) {
              return;
            }
            if (keyCode === monaco.KeyCode.KeyV && (metaKey || ctrlKey)) {
              triggerPaste(clipbord.current);
              event.preventDefault();
              return;
            }
          });
          
          ed.onDidChangeModelContent(() => {
            console.log(ed.getValue(), "Secound", cmplang.current);
      
            onValueChange(ed.getValue(), cmplang.current);
          });
      
          // prevent right click and past
          ed.onDidPaste(() => {
            // alert("No cheating");
            ed.trigger("", "undo", undefined);
            triggerPaste(clipbord.current);
          });
        return ed;
      });
    }
    return () => {
      editor?.dispose();
    };

  }, [monacoEl, loding]);


  function changeLanguage(lang: string) {
    cmplang.current = lang;
    setLanguage(cmplang.current);
    localStorage.setItem("current-lang", cmplang.current);
    if (editor) {
      monaco.editor.setModelLanguage(editor?.getModel()!, cmplang.current);
      editor?.setValue(getStater(cmplang.current));
    }
  }

  function changeTheme(event: SelectChangeEvent) {
    const tm = event.target.value;
    setTheme(tm);
    monaco.editor.setTheme(tm);
    localStorage.setItem("code-theme", tm);
  }

  return (
    <Card
      style={{
        height: "100%",
        position: "relative",
        paddingTop: 5,
        paddingBottom: 5,
      }}
    >
      
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

        {!editor ? <></> : <Tooltip title="Reset to default code">
          <IconButton
            onClick={() => {
              if(editor){
                // alert("GCET")
              editor.setValue(getStater(cmplang.current, true));
            }
              console.log(staterCode, getStater(cmplang.current, true));
            }}
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
        </Tooltip>}
      </div>
      <div style={{ position: "relative", width: "100%", height: "92%" }}>
        {
          // loding ?<Box sx={{ width: "100%", height: "100%", position: "relative" }}>
          //     <div
          //       style={{
          //         top:'30%',
          //         left: "50%",
          //         zIndex: 200,
          //         transform: "translate(-50%, -50%)",
          //         position: "absolute",
          //       }}
          //     >
          //       <div>Making your editor ready please standby...</div>
          //       <div style={{margin:'auto', width:'max-content'}}><CircularProgress /></div>
          //     </div>
          //   </Box>:
          <div className={styles.Editor} ref={monacoEl}></div>
        }
      </div>
    </Card>
  );
};
