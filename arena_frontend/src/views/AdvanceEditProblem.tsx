import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../components/Auth/AuthProvider";
import Navbar from "../components/common/Navbar";

const AdvanceEditProblem = () => {
  const contestId = parseInt(useParams()["id"] || "");
  const { user } = useAuth()!;

  const navigate = useNavigate();
  return (
    <div>
      <Navbar />
    </div>
  );
};

export default AdvanceEditProblem;
