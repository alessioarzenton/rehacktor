import classes from "./Modal.module.css";

import { createPortal } from "react-dom";

const Backdrop = (props) => {
  return <div className={classes.backdrop} onClick={props.closeModal}></div>;
};

const Overlay = (props) => {
  console.log(props.isStreaming);
  return (
    <div className={classes.modal}>
      <div className="text-center">
        <i className="fab fa-react fa-3x fa-spin text-main"></i>
        <h2>{props.title}</h2>
      </div>
      <p className="my-5">{props.message}</p>
      {props.isStreaming && (
        <p>Ricorda di interrompere lo stream prima di uscire.</p>
      )}
      <div className="mt-5 d-flex justify-content-between">
        <button
          className="btn btn-outline-info rounded-0 px-3"
          onClick={props.closeModal}
        >
          {props.declineMessage}
        </button>

        <button
          className="btn btn-info rounded-0 px-3"
          onClick={props.action}
          disabled={props.isStreaming}
        >
          {props.confirmMessage}
        </button>
      </div>
    </div>
  );
};

const Modal = (props) => {
  return (
    <>
      {createPortal(
        <Backdrop closeModal={props.closeModal} />,
        document.getElementById("backdrop"),
      )}
      {createPortal(<Overlay {...props} />, document.getElementById("overlay"))}
    </>
  );
};

export default Modal;
