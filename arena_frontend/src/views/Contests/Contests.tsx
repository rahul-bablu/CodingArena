import { Box } from "@mui/material";
import Axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "../../components/common/Navbar";
// import { useAuth } from "../components/Auth/AuthProvider";
import { CurrentContest } from "./CurrentContest";
import { FeaturedContest } from "./FeaturedContest";
import { PastContest } from "./PastContest";

const Contests = () => {
  const [qs, setQs] = useState<any>([]);

  useEffect(() => {
    (async () => {
      const { data } = await Axios.get(`/api/contest/user?userId=${1}`, {
        withCredentials: true,
      });
      setQs(data);
    })();
  }, []);

  return (
    <div>
      <Navbar />
      <Box>
        <CurrentContest
          qs={qs.filter((item: any) => item.registred && item.state != "end")}
        />

        <FeaturedContest
          list={qs.filter(
            (item: any) => !item.registred && item.state != "end"
          )}
        />
        <PastContest qs={qs.filter((item: any) => item.state == "end")} />
      </Box>
    </div>
  );
};

export default Contests;
