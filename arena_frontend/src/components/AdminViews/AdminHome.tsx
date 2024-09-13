import { Button, Card } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../common/Navbar";

const AdminHome = () => {
  // const { user } = useAuth()!;
  const [contests, setContests] = useState<any>([]); 
  useEffect(() => {
    (async () => {
      const { data } = await Axios.get(`/api/contest/all`, {
        withCredentials: true,
      });
      // const { data } = await Axios.post(`/api/contest/adduser/1`,{userId:1}, {withCredentials:true});
    //   console.log(data);
      setContests(data);
    })();
  }, []);
  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
      <div style={{ width: "100%", position: "relative" }}>
        <Card
          sx={{ maxWidth: "1000px", margin: "50px auto", paddingBlock: "50px" }}
          variant="outlined"
        >
          <div
            style={{
              fontSize: "40px",
              textAlign: "center",
              fontFamily: '"M PLUS Rounded 1c", sans-serif',
              margin: "auto 100px",
              fontWeight: 600,
            }}
          >
            Hello Admin
          </div>
          <div
            style={{
              paddingTop: "100px",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <Button sx={{ width: "200px" }} variant="contained" onClick={()=>navigate('/admin/users')}>
              Manage Users
            </Button>
            <Button sx={{ width: "200px" }} variant="contained" onClick={()=>navigate('/admin/contests')}>
              Manage Contests
            </Button>
            <Button sx={{ width: "200px" }} variant="contained" onClick={()=>navigate('/admin/viewsubmissions')}>
              View Submissions
            </Button>
          </div>
        </Card>
        <Card
          sx={{ maxWidth: "1000px", margin: "50px auto", paddingBlock: "50px" }}
          variant="elevation"
        >
          <h3 style={{ textAlign: "center", fontSize: '20px' }}>Current Contest</h3>
          <div style={{ display: "flex", width: '90%', margin: 'auto' }}>
            <DataGrid
              sx={{ width: "50%", margin: "auto",  }}
              getRowId={(row: any) => row.id}
              columns={[
                {
                  field: "id",
                  headerName: "ID",
                  headerClassName: "data-grid-header",
                  flex: 2,
                },
                {
                  field: "title",
                  headerName: "Contest Title",
                  headerClassName: "data-grid-header",
                  flex: 3,
                },
                {
                  field: "state",
                  headerName: "State",
                  headerClassName: "data-grid-header",
                  flex: 2,
                },
              ]}
              rows={contests}
              disableRowSelectionOnClick
              pageSizeOptions={[7]}
              autoHeight
              slots={{ toolbar: GridToolbar }}
              getRowClassName={(params) =>
                params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
              }
              // sx={{ "--DataGrid-overlayHeight": "300px" }}
            />
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminHome;
