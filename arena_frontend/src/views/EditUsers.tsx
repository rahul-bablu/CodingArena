import { Card, MenuItem, Select, SelectChangeEvent, TextField } from "@mui/material";
import { DataGrid, GridActionsCellItem, GridRowId, GridToolbar } from "@mui/x-data-grid";
import Axios from "axios";
import { FormEvent, useContext, useEffect, useState } from "react";
import { AlertContext } from "../components/common/AlertProvider";
import Navbar from "../components/common/Navbar";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmDialog from "../components/common/confirmDialog";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";

type UserData = {
  id: number;
  username: string;
  role: string;
  email: string;
}



const EditUsersHelper = ({
  open,
  setOpen,
  id,
  user,
  action
}:
  {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    id: number;
    user?: UserData;
    action: any;
  }) => {
  const alert = useContext(AlertContext);
  const roles = ["dev", "admin", "user"];
  const [role, setRole] = useState(user?.role);
  const [name, setName] = useState(user?.username);
  const [email, setEmail] = useState(user?.email);
  const handleChange = (event: SelectChangeEvent) => {
    setRole(event.target.value as string);
  };
  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      const response = await Axios.patch(`/api/users/update`, {
        id: id, username: name, role: role, email: email
      });
      if (response.status == 200) {
        alert?.showAlert(response.data.message, 'success');
      } else {
        alert?.showAlert(response.data.message, 'warning');
      }
      action(true);
    } catch (error: any) {
      alert?.showAlert(error.response.data.message, 'warning');
    }
  }
  return (
    <>
      <Dialog

        open={open}
        onClose={() => setOpen(false)}
      >
        <DialogTitle>Edit User</DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            {/* <DialogContentText>
            Edit User
          </DialogContentText> */}
            {/* {name} */}
            <TextField
              onChange={(e) => setName(e.target.value)}
              autoFocus
              margin="dense"
              label="Username"
              type="text"
              fullWidth
              defaultValue={user?.username}
              required
            />
            <Select
              key="user-role-selector"
              onChange={handleChange}
              displayEmpty
              inputProps={{ 'aria-label': 'Without label' }}
              defaultValue={user?.role}
              fullWidth
            >
              {roles.map((role, index) => (
                <MenuItem key = {index} value={role}>
                  {role}
                </MenuItem>
              ))}
            </Select>
            <TextField
              onChange={(e) => setEmail(e.target.value)}
              autoFocus
              margin="dense"
              id="floor"
              label="Email"
              type="email"
              fullWidth
              defaultValue={user?.email}
              required
            />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" color="error" onClick={() => action(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" color="success">
              Edit
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}


const EditUsers = () => {
  const alert = useContext(AlertContext);
  const [users, setUsers] = useState<UserData[]>([]);
  const [reload, setReload] = useState(false);
  const [openDel, setDelOpen] = useState(false);
  const [openEdit, setEditOpen] = useState(false);
  const [id, setId] = useState<number>(-1);
  const [ordUsers, setOrdUsers] = useState<Map<number, UserData>>(new Map());

  const handleEditClick = (id: GridRowId) => () => {
    setId(parseInt(id.toString()));
    setEditOpen(true);
  };
  async function confirmEdit(update: boolean) {
    if (update) setReload(!reload);
    setEditOpen(false);
    setId(-1);
  }
  async function confirmDelete(del: boolean) {
    if (del) {
      const response = await Axios.delete(`/api/users/delete?id=${id}`);
      if (response.status == 200) {
        alert?.showAlert(response.data.message, 'success');
      } else {
        alert?.showAlert(response.data.message, 'error');
      }
      setReload(!reload);
    }
    setId(-1);
  }
  const handleDeleteClick = (id: GridRowId) => () => {
    setId(parseInt(id.toString()));
    setDelOpen(true);
  };
  useEffect(() => {
    (async () => {
      const { data } = await Axios.get(`/api/users/all`);
      let userMap: Map<number, UserData> = new Map();
      for (let i = 0; i < data.length; i++) {
        userMap.set(data[i].id, data[i]);
      }
      setUsers(data);
      setOrdUsers(userMap);

    })();
  }, [reload]);
  return (
    <>
      <Navbar />
      <Card
        sx={{
          width: "90%",
          margin: "20px auto",
          "& .data-grid-header": {
            backgroundColor: "rgba(150, 150, 150, 0.7)",
            color: 'white'
          },
          maxWidth: '1000px',
          paddingBlock: '50px'
        }}
      >

        <div style={{
          fontSize: "25px",
          paddingBottom: '30px',
          textAlign: "center",
          fontFamily: '"M PLUS Rounded 1c", sans-serif',
          margin: "auto 100px",
          fontWeight: 600,
        }}>Manage Users</div>
        <DataGrid
          sx={{ width: "80%", margin: "auto", }}
          getRowId={(row: any) => { return row.id; }}
          columns={[
            { field: "username", headerName: "Username", headerClassName: 'data-grid-header', flex: 2 },
            { field: "role", headerName: "Role", headerClassName: 'data-grid-header', flex: 1 },
            {
              field: "email",
              headerName: "Email",
              headerClassName: 'data-grid-header',
              flex: 3,
            },
            {
              field: "actions",
              headerName: "Actions",
              type: 'actions',
              cellClassName: 'actions',
              headerClassName: 'data-grid-header',
              flex: 1,
              getActions: ({ id }) => {
                return [
                  <GridActionsCellItem
                    icon={<EditIcon />}
                    label="Edit"
                    className="textPrimary"
                    onClick={handleEditClick(id)}
                    color="inherit"
                  />,
                  <GridActionsCellItem
                    icon={<DeleteIcon />}
                    label="Delete"
                    onClick={handleDeleteClick(id)}
                    color="inherit"
                  />,
                ];
              }
            },
          ]}
          rows={users}
          disableRowSelectionOnClick
          editMode="row"
          initialState={{ pagination: { paginationModel: { pageSize: 15 } } }}
          pageSizeOptions={[15, 30, 50]}
          autoHeight
          slots={{ toolbar: GridToolbar }}
        // sx={{ "--DataGrid-overlayHeight": "300px" }}
        />

      </Card>
      {openDel ? <div style={{ margin: "auto", width: "80%" }}>
        <div style={{ marginLeft: "auto", marginRight: 0, width: 100 }}>
          <ConfirmDialog title="Delete" content="Are you sure you want to delete this user?" open={openDel} setOpen={setDelOpen} action={confirmDelete} />
        </div>
      </div> :
        <></>}
      {openEdit ?
        <div style={{ margin: "auto", width: "80%" }}>
          <div style={{ marginLeft: "auto", marginRight: 0, width: 100 }}>
            <EditUsersHelper open={openEdit} setOpen={setEditOpen} id={id} user={ordUsers.get(id)} action={confirmEdit} />
          </div>
        </div>
        :
        <></>}
    </>
  );
};

export default EditUsers;
