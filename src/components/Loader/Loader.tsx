import { FadeLoader } from "react-spinners";
import css from "./Loader.module.css";

export default function Loader() {
  return <FadeLoader className={css.loader} />;
}
