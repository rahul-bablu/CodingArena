import {
  darken,
  styled
} from "@mui/material";

import Tab from "@mui/material/Tab";
import Tabs from "@mui/material/Tabs";
import "split-pane-react/esm/themes/default.css";
import "../components/Editor/useWorker";
import "./Code.module.css";

export const StyledTabs = styled(Tabs)(({ theme }) => ({
  borderBottom: `1px solid ${theme.palette.divider}`,
  "& .MuiTabs-indicator": {
    backgroundColor: "#252525",
    height: "2px",
  },
}));

export const StyledTab = styled(Tab)(({ theme }) => ({
  textTransform: "none",
  // minWidth: 72,
  fontWeight: theme.typography.fontWeightRegular,
  marginRight: theme.spacing(4),
  color: theme.palette.text.primary,
  "&:hover": {
    color: theme.palette.text.primary,
    opacity: 1,
  },
  "&.Mui-selected": {
    color: darken(theme.palette.text.primary, 0),
    fontWeight: theme.typography.fontWeightBold,
  },
  "&.Mui-focusVisible": {
    backgroundColor: theme.palette.primary.light,
  },
}));
const AdminCodeRunner = () => {
  return <></>
  // const alert = useContext(AlertContext);
  // // TODO: Handle NaN
  // const [sizes, setSizes] = useState(["65%", "35%"] as (string | number)[]);
  // const [hsizes, setHsizes] = useState(["80%", "20%"] as (string | number)[]);

  // const [submissions, setSubmissions] = useState<any>([]);
  // const [contest, setContest] = useState<any>(null);
  // const [problem, setProblem] = useState<any>(null);
  // const [testCase, setTestCase] = useState<any>(null);

  // const [contests, setContests] = useState<any>(null);
  // const [problems, setProblems] = useState<any>({});
  // const [testCases, setTestCases] = useState<any>({});

  // let code = useRef(""),
  //   lang = useRef("c");

  // useEffect(() => {
  //   Axios.get("/api/contest")
  //     .then(({ data }) => {
  //       setContests(data);
  //       setProblems(null);
  //       setTestCases(null);
  //     })
  //     .catch((e) => {
  //       alert?.showAlert("Couldn't fetch contest data", "error");
  //     });
  // }, []);
  // const [diffOpen, setDiffOpen] = useState(false);
  // const [result, setResult] = useState('');

  // function handleDiffClose() {
  //   setDiffOpen(false);
  // }
  // const [diffEditor, setDiffEditor] =
  //   useState<any>(null);
  //   const monacoDifEl = useRef(null);
  // useEffect(() => {
  //   if(!diffOpen) return;
  //   console.log("Trying Editer load");
  //   if (true) {
  //       setDiffEditor((diffEditor:any) => {
  //         // if (diffEditor) return diffEditor;
  //         let tmpEditor = monaco.editor.createDiffEditor(
  //           monacoDifEl.current!
  //           ,{
  //             readOnly: true
  //           }
  //         );
  //         let originalModel = monaco.editor.createModel(
  //           "This line is removed on the right.\njust some text\nabcd\nefgh\nSome more text",
  //           "text/plain"
  //         );
  //         let modifiedModel = monaco.editor.createModel(
  //           "just some text\nabcz\nzzzzefgh\nSome more text.\nThis line is removed on the left.",
  //           "text/plain"
  //         );
  //         tmpEditor.setModel({
  //           original: originalModel,
  //           modified: modifiedModel,
  //         });
  //         return tmpEditor
  //       });
      
  //   }


  //   return () => {diffEditor?.dispose();};
  // }, [diffOpen]);

  // function getAllProblemOf(contestId: number) {
  //   Axios.get(`/api/contest/problems?contestId=${contestId}`)
  //     .then(({ data }) => {
  //       console.log(data.problems);
  //       setProblems(data.problems);
  //       setTestCase(null);
  //     })
  //     .catch((e) => {
  //       alert?.showAlert("Couldn't fetch problems data", "error");
  //     });
  // }

  // function getAllIOsOf(problemId: number) {
  //   Axios.get(`/api/problem/io/${problemId}`)
  //     .then(({ data }) => {
  //       setTestCases(data);
  //     })
  //     .catch((e) => {
  //       alert?.showAlert("Couldn't fetch testcase data", "error");
  //     });
  // }

  // return (
  //   <BaseBox
  //     style={{
  //       height: "100vh",
  //       minWidth: 500,
  //       overflow: "auto",
  //     }}
  //   >
  //     <Navbar />

  //     <div style={{ height: "calc(100vh - 50px)" }}>
  //       {/* <div style={{height:100}}></div> */}
  //       <SplitPane
  //         split="vertical"
  //         sizes={sizes}
  //         onChange={setSizes}
  //         sashRender={undefined}
  //         // resizerSize={7}
  //       >
  //         <Pane minSize={200} maxSize="80%" style={{ height: "100%" }}>
  //           <AdminEditor language={lang} initCode={code} />
  //         </Pane>
  //         <Pane>
  //           <Autocomplete
  //             value={contest}
  //             onChange={(event: any, newValue: any) => {
  //               setContest(newValue);
  //               getAllProblemOf(newValue.id);
  //             }}
  //             getOptionLabel={(option) => {
  //               return option.id + " " + option.title;
  //             }}
  //             id="contest-autocomplete-component"
  //             options={contests}
  //             sx={{ width: 300, margin: "10px" }}
  //             renderInput={(params) => (
  //               <TextField {...params} label="Contest" />
  //             )}
  //           />
  //           {problems && (
  //             <Autocomplete
  //               value={problem}
  //               onChange={(event: any, newValue: any) => {
  //                 setProblem(newValue);
  //                 getAllIOsOf(newValue.id);
  //               }}
  //               getOptionLabel={(option) => {
  //                 return option.id + " " + option.title;
  //               }}
  //               id="problem-autocomplete-component"
  //               options={problems}
  //               sx={{ width: 300, margin: "10px" }}
  //               renderInput={(params) => (
  //                 <TextField {...params} label="Problem" />
  //               )}
  //             />
  //           )}
  //           {testCases && (
  //             <Autocomplete
  //               value={testCase}
  //               onChange={(event: any, newValue: any) => {
  //                 setTestCase(newValue);
  //               }}
  //               getOptionLabel={(option) => {
  //                 return option.id + " ";
  //               }}
  //               id="testcase-autocomplete-component"
  //               options={testCases}
  //               sx={{ width: 300, margin: "10px" }}
  //               renderInput={(params) => (
  //                 <TextField {...params} label="Testcase" />
  //               )}
  //             />
  //           )}
  //           <Button
  //             variant="contained"
  //             onClick={async () => {
  //               if (!testCase) {
  //                 alert?.showAlert(
  //                   "Please select testcase before submitting",
  //                   "warning"
  //                 );
  //                 return;
  //               }
  //               const { data } = await Axios.post(`/api/problem/run/testcase`, {
  //                 code: code.current,
  //                 lid: lang.current,
  //                 tcid: testCase.id,
  //               });
  //               setResult(data);
  //               console.log(data);
  //             }}
  //           >
  //             Run
  //           </Button>
  //           <Button onClick={() => {setDiffOpen(true); }}>
  //             Open Diff Editor
  //           </Button>
  //           <Dialog
  //             fullScreen
  //             open={diffOpen}
  //             onClose={handleDiffClose}
  //           >
  //             <Toolbar>
  //           <IconButton
  //             edge="start"
  //             color="inherit"
  //             onClick={handleDiffClose}
  //             aria-label="close"
  //           >
  //             <CloseIcon />
  //           </IconButton>
            
  //         </Toolbar>
  //         <div  ref={monacoDifEl} style={{height: '100vh'}}></div>
  //           </Dialog>

  //           <div>{JSON.stringify(result)}</div>
  //         </Pane>
  //       </SplitPane>
  //     </div>
  //   </BaseBox>
  // );
};

export default AdminCodeRunner;
