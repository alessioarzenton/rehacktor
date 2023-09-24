import { Dna } from "react-loader-spinner";
import classes from "./Loader.module.css";

export default function Loadering() {
    return (
        <div className={classes.loader}>
            <Dna
                visible={true}
                height="150"
                width="150"
                ariaLabel="dna-loading"
                wrapperStyle={{}}
                wrapperClass="dna-wrapper"
            />
        </div>
    );
}
