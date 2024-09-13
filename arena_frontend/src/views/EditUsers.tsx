import { Card } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";

const EditUsers = () => {
  const [users, setUsers] = useState<any>([]);
  useEffect(() => {
    (async () => {
      const { data } = await Axios.get(`/api/users/all`);
      console.log(JSON.stringify(data));
      setUsers(data);
    })();
  }, []);
  return (
    <>
    <Navbar/>
    <Card
      sx={{
        width: "90%",
        margin: "20px auto",
        "& .data-grid-header": {
          backgroundColor: "rgba(150, 150, 150, 0.7)",
          color: 'white'
        },
        maxWidth:'1000px',
paddingBlock: '50px'
      }}
    >
      <div style={{fontSize: "25px",
      paddingBottom: '30px',
              textAlign: "center",
              fontFamily: '"M PLUS Rounded 1c", sans-serif',
              margin: "auto 100px",
              fontWeight: 600,}}>Manage Users</div>
      <DataGrid
        sx={{ width: "80%", margin: "auto",  }}
        getRowId={(row: any) => row.id}
        columns={[
          { field: "username", headerName: "Username",headerClassName:'data-grid-header', flex:2, },
          { field: "role", headerName: "Role", headerClassName:'data-grid-header', flex: 1, },
          {
            field: "email",
            headerName: "Email",
            headerClassName:'data-grid-header',
            flex: 3,
          },
        ]}
        rows={users}
        disableRowSelectionOnClick
        pageSizeOptions={[10]}
        autoHeight
        slots={{ toolbar: GridToolbar }}
        // sx={{ "--DataGrid-overlayHeight": "300px" }}
      />
    </Card>
    </>
  );
};

export default EditUsers;
