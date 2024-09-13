import { Button, Card, LinearProgress, Switch, TextField } from "@mui/material";
import Axios from "axios";
import { memo, useContext, useState } from "react";
import { AlertContext } from "../common/AlertProvider";
import BaseBox from "../common/BaseBox";

const getCode = (problemId:number, lang: string) => {
  let storageData = JSON.parse(localStorage.getItem('autoSavedCodes')|| '{}');

    // Load the code if it exists
    if (storageData &&
        storageData[problemId] &&
        storageData[problemId][lang] !== undefined) {
        return storageData[problemId][lang];
    } else { return undefined}
}

const Console = memo(({ id, language, setConfettiActive }: { id: number; language: string, setConfettiActive: any }) => {
  const [verdect, setVerdect] = useState("  - - -  ");
  const [loading, setLoading] = useState(false);
  const [current_out_put, setCurrentOutPut] = useState(
    "Run the program to see the output..."
  );
  const alert = useContext(AlertContext);
  const [tcInput, setTCInput] = useState("");
  const [custominp, setCustomInp] = useState(false);

  return (
    <BaseBox
    // variant="outlined"
      style={{
        // borderBlockStart: "2px solid rgb(240,240,240)",
        borderRadius: 10,
        position: "relative",
        height: "100%",
        overflowY:'auto',
      }}
    >
      <div style={{}}>
        <Card
        variant="outlined"
          style={{
            paddingBlock: 4,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderRadius: '5px 0px',
            // borderBottom: "1px solid",
            // backgroundColor: "white",
            width: "100%",
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

          <div style={{ paddingInline: 10 }}>
            <Button
              onClick={async () => {
                // TODO: Something you know
                setLoading(true);
                try {
                const { data } = await Axios.post(`/api/problem/run/${id}`, {
                  code: getCode(id, language),
                  lid: language,
                  input: tcInput,
                  custominp
                });
                setCurrentOutPut(data.output);
                setVerdect(data.verdect);
              }catch(e:any) {
                // alert(e)
                alert?.showAlert(e.response.data.message, 'error')
              }
              finally{
                setLoading(false);
              }
              }}
              variant="outlined"
              sx={{ marginInline: 1 }}
            >
              Run
            </Button>
            <Button
              onClick={async () => {
                try{
                const { data } = await Axios.post(
                  `/api/problem/submission/${id}`,
                  { code: getCode(id, language), lid:language },
                  
                );

                setVerdect(data.verdect);
                if(data.verdect == 'Accepted') {
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
                for(const tc of data.tcs){
                  s += `TestCase ${i}: ${tc.score}/${tc.maxScore} - ${tc.verdect}\n`
                  i++;
                }
                setCurrentOutPut(s);
              } catch (e:any) {
                alert?.showAlert(e.response.data.message, "error")
              }
              }}
              variant="contained"
            >
              Submit
            </Button>
          </div>
        </Card>
        {loading ? <LinearProgress /> : <></>}
        <div >
          <div style={{ margin: 15 }}>
            Custom Input: <Switch checked={custominp} onChange={(e)=>setCustomInp(e.target.checked)}></Switch>
            {custominp?<>Input: 

            <TextField
              defaultValue={tcInput}
              multiline
              onChange={(e) => setTCInput(e.target.value)}
              maxRows={5}
              
              sx={{margin: '5px', width: '250px'}}
              variant="standard"
            ></TextField></>:<></>}
          </div>
          <div style={{ margin: 15 }}>
            <>Verdect: </>
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
                fontFamily:"Consolas, 'Courier New', monospace"
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
      </div>
    </BaseBox>
  );
});

export default Console;
