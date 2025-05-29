import "./styles.button.css";
// if blue is true, the button will have a blue background

function Button({ text, onClick, blue, disabled }) {
  return (
    <div disabled={disabled} onClick={onClick} className={blue ? "btn btn-blue" : "btn"}>
      {text}
    </div>
  );
}

export default Button;
