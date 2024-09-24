import { Button, Card, LinearProgress, Switch, TextField, useTheme } from "@mui/material";
import Axios from "axios";
import { memo, useContext, useState } from "react";
import { useAuth } from "../Auth/AuthProvider";
import { AlertContext } from "../common/AlertProvider";
import BaseBox from "../common/BaseBox";

const getCode = (problemId: number, lang: string, user: string | null) => {
  let storageData = JSON.parse(localStorage.getItem(user + '_autoSavedCodes') || '{}');

  // Load the code if it exists
  if (storageData &&
    storageData[problemId] &&
    storageData[problemId][lang] !== undefined) {
    return storageData[problemId][lang];
  } else { return undefined }
}

const Console = memo(({ id, language, setConfettiActive, setSizes }: { id: number; language: string, setConfettiActive: any, setSizes: any }) => {
  const [verdect, setVerdect] = useState("  - - -  ");
  const [loading, setLoading] = useState(false);
  const [current_out_put, setCurrentOutPut] = useState(
    "Run the program to see the output..."
  );
  const alert = useContext(AlertContext);
  const [tcInput, setTCInput] = useState("");
  const [custominp, setCustomInp] = useState(false);
  const { user } = useAuth()!;
  const theme = useTheme();

  return (
    <BaseBox
      // variant="outlined"
      style={{
        margin: "5px 3px 3px 3px",
        
        position: "relative",
        height: "97%",
      }}
    >
      <Card
        variant="outlined"
        style={{
          borderRadius: "8px",
          boxSizing: "border-box",
          height: "100%",
          display: "flex",
          flexDirection: "column"
        }}>
        <Card
          // variant="outlined"
          style={{
            paddingBlock: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: '8px 8px 0px 0px',
            
            backgroundColor: theme.palette.background.paper, 
            // backgroundColor: "white",
            flexShrink: 0,

            width: "100%",
            boxShadow: "none"
          }}
        >
          <div
            style={{
              paddingTop: 2,
              fontSize: 20,
              paddingLeft: "2%",
              fontWeight: 600,
            }}
          >
            Console
          </div>

          <div style={{ paddingInline: 10, }}>
            <Button
              onClick={async () => {
                // TODO: Something you know
                setLoading(true);
                try {
                  const { data } = await Axios.post(`/api/problem/run/${id}`, {
                    code: getCode(id, language, user),
                    lid: language,
                    input: tcInput,
                    custominp
                  });
                  setCurrentOutPut(data.output);
                  setVerdect(data.verdect);
                } catch (e: any) {
                  // alert(e)
                  alert?.showAlert(e.response.data.message, 'error')
                }
                finally {
                  setLoading(false);
                  setSizes(['40%', '60%']);
                }
              }}
              // variant="outlined"
              sx={{
                backgroundColor: '#7777771e',
                marginInline: 1,
                borderRadius: '11px',
                color: theme.palette.text.primary,
                textTransform: 'none',
                fontWeight: '600',
                outline: '2px solid #0000',
                ':hover': {
                  bgcolor: (theme.palette.mode == "dark")? "#cccccc1e": "#5555553f",

                },
              }}
            >
              Run
            </Button>
            <Button
              onClick={async () => {
                setLoading(true);
                try {
                  const { data } = await Axios.post(
                    `/api/problem/submission/${id}`,
                    { code: getCode(id, language, user), lid: language },

                  );

                  setVerdect(data.verdect);
                  if (data.verdect == 'Accepted') {
                    alert?.showAlert('Your submission has been Accepted', 'success')
                    setConfettiActive(true);
                    setTimeout(() => {
                      setConfettiActive(false);
                    }, 4000);
                  } else {
                    alert?.showAlert('Your submission has not been Accepted', 'error')
                  }
                  let i = 1;
                  let s = "";
                  for (const tc of data.tcs) {
                    s += `TestCase ${i}: ${tc.score}/${tc.maxScore} - ${tc.verdect}\n`
                    i++;
                  }
                  setCurrentOutPut(s);
                } catch (e: any) {
                  alert?.showAlert(e.response.data.message, "error")
                } finally {
                  setLoading(false);
                  setSizes(['40%', '60%']);
                }
              }}
              variant="contained"
              sx={{
                backgroundColor: theme.palette.success.main,
                borderRadius: '11px',
                color: 'white',
                textTransform: 'none',
                fontWeight: '600',
                ':hover': {
                  bgcolor: theme.palette.success.light,
                },
              }}
            >
              Submit
            </Button>
          </div>
        </Card>
        {loading ? <LinearProgress /> : <></>}
        
        <div
          style={{
            flexGrow: 1,
            overflowY: "auto",
            backgroundColor: theme.palette.background.default, 

          }}
        >
          <div style={{
            padding: 15,
            
          }}
          >
            Custom Input: <Switch checked={custominp} onChange={(e) => setCustomInp(e.target.checked)}></Switch>
            {custominp ? <>Input:

              <TextField
                defaultValue={tcInput}
                multiline
                onChange={(e) => setTCInput(e.target.value)}
                maxRows={5}

                sx={{ margin: '5px', width: '250px' }}
                variant="standard"
              ></TextField></> : <></>}
          </div>
          <div style={{ margin: 15 }}>
            <>Verdict: </>
            <Card
              sx={{
                fontSize: 14,
                width: "70%",
                marginTop: 1,
                whiteSpace: "preserve",
                padding: 1,
              }}
              variant="outlined"
            >
              {verdect}
            </Card>
          </div>
          <div style={{ margin: 15 }}>
            <>Output: </>
            <Card
              sx={{
                fontSize: 14,
                width: "70%",
                marginTop: 1,
                whiteSpace: "preserve",
                padding: 1,
                fontFamily: "Consolas, 'Courier New', monospace"
              }}
              variant="outlined"
            >
              {current_out_put}
            </Card>
            {
              // <div style={{top: '50%', position: 'absolute', left: '50%', translate: -50}}>Compiler output goes here</div>
            }
          </div>
        </div>
      </Card>
    </BaseBox>
  );
});

export default Console;
