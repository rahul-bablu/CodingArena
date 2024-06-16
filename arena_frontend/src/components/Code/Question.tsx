import Axios from "axios";
import { memo, useContext, useEffect, useState } from "react";
import { AlertContext } from "../common/AlertProvider";
import Markdown from "../common/Markdown";
import style from './Question.module.css';


const Question = memo(({ id, hidden }: { id: number; hidden: boolean }) => {
  const [md, setMd] = useState("Couldn't load question...");
  const [title, setTitle] = useState();
  const [loading, setLoading] = useState(true);
  const alert = useContext(AlertContext);
  useEffect(() => {
    (async () => {
      try {
        const { data } = await Axios.get(`/api/problem/${id}`);
        setMd(data.q);
        setTitle(data.title);
      } catch (e) {
        console.log(e);
        alert?.showAlert("Couldn't load question...", 'error');
        
      } finally {
        
        setLoading(false);
      }
    })();
  }, []);
  return (
    <div
      hidden={hidden}
      style={{
        padding: "10px",
        fontFamily: "Roboto, Helvetica Neue, sans-serif",
      }}
      className={style.questionBlock}
    >
      { loading ? <>Loding...</> : <><h1>{title}</h1><Markdown children={md} /></>}
    </div>
  );
});

export default Question;
