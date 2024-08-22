import { Avatar, Card } from "@mui/material";
import Axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../components/common/Navbar";

export const UserSubs = () => {
    const [subs, setSubs] = useState([]);
    useEffect(() => {
        (async () => {
          const { data } = await Axios.get(
            `/api/users/submissions?userId=${1}`
          );
          setSubs(data);
          console.log(data);
        })();
      }, []);
    return (
    <div style={{height: '100vh'}}>
    <Navbar />
    <div style={{display:'flex', width: '100%', height: 'calc(100% - 80px)', position: 'relative'}}>
        <div style={{maxWidth: '300px', backgroundColor:'rgb(250, 250, 250)', position: 'sticky', height: '100%',width: '30%', top:'100px', display: 'grid', alignItems:'center', placeContent: 'center'}}>
            <Avatar sx={{ width: 100, height: 100, margin: 'auto', marginBlock:'15px' }}/>
            <div style={{fontSize: '18px', fontWeight: 600, }}>Bezawada Vignesh</div>
        </div>
        <div style={{ flexGrow: 1, overflowY:'auto'}}>
            {subs.map((v, i) => {
                return <Card sx={{width: '70%' , maxWidth: '700px', margin:'10px auto', padding: '20px'}}>{JSON.stringify(v)}</Card>
            })}
        </div>
    </div>
    
</div>)
}