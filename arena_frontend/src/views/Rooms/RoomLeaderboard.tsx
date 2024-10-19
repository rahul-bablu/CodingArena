import { Card } from "@mui/material";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import Axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AlertContext } from "../../components/common/AlertProvider";
import Navbar from "../../components/common/Navbar";

const RoomLeaderboard = () => {
    const { id: contestId } = useParams()!;
    const alert = useContext(AlertContext);
    const [leaderboard, setLeaderboard] = useState([]);
    const [reload, setReload] = useState(false);
    const [id, setId] = useState<number>(-1);
    
    
    useEffect(() => {
      (async () => {
        const { data } = await Axios.get(`/api/room/leaderboard/${contestId}`);
        console.log(data)
        setLeaderboard(data.flat())
  
      })();
    }, [reload]);
    return (
      <>
        <Navbar />
        <Card
          sx={{
            width: "90%",
            margin: "20px auto",
            // "& .data-grid-header": {
            //   backgroundColor: "rgba(150, 150, 150, 0.7)",
            //   color: 'white'
            // },
            maxWidth: '1000px',
            paddingBlock: '50px',
            boxShadow: '0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19)'
          
          }}
        >
  
          <div style={{
            fontSize: "25px",
            paddingBottom: '30px',
            textAlign: "center",
            fontFamily: '"M PLUS Rounded 1c", sans-serif',
            margin: "auto 100px",
            fontWeight: 600,
          }}>Leaderboard</div>
          <DataGrid
            sx={{ width: "80%", margin: "auto", }}
            getRowId={(row: any) => { return row.username+row.latestSubmissionTime; }}
            columns={[
              { field: "username", headerName: "Username", headerClassName: 'data-grid-header', flex: 2 },
              { field: "totalScore", headerName: "Score", headerClassName: 'data-grid-header', flex: 1 },
              {
                field: "latestSubmissionTime",
                headerName: "Time",
                headerClassName: 'data-grid-header',
                flex: 2,
              },
              {
                field: "contestName",
                headerName: "Contest Name",
                headerClassName: 'data-grid-header',
                flex: 2,
              },
            //   {
            //     field: "actions",
            //     headerName: "Actions",
            //     type: 'actions',
            //     cellClassName: 'actions',
            //     headerClassName: 'data-grid-header',
            //     flex: 1,
            //     getActions: ({ id }) => {
            //       return [
            //         <GridActionsCellItem
            //           icon={<EditIcon />}
            //           label="Edit"
            //           className="textPrimary"
            //           onClick={handleEditClick(id)}
            //           color="inherit"
            //         />,
            //         <GridActionsCellItem
            //           icon={<DeleteIcon />}
            //           label="Delete"
            //           onClick={handleDeleteClick(id)}
            //           color="inherit"
            //         />,
            //       ];
            //     }
            //   },
            ]}
            rows={leaderboard}
            disableRowSelectionOnClick
            // editMode="row"
            initialState={{ pagination: { paginationModel: { pageSize: 15 } } }}
            pageSizeOptions={[15, 30, 50]}
            autoHeight
            slots={{ toolbar: GridToolbar }}
          // sx={{ "--DataGrid-overlayHeight": "300px" }}
          />
  
        </Card>
        
        
      </>
    );
  };
  
  export default RoomLeaderboard;
  