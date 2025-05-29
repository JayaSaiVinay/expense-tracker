import "./styles.input.css";

function Input({ label, placeholder, state, setState, type }) {
  return (
    <div className="input-wrapper">
      <p className="label-input">{label}</p>
      <input
        type={type || "text"} // Default type is text if not specified
        value={state}
        placeholder={placeholder}
        onChange={(e) => setState(e.target.value)}
        className="custom-input" 
      />
    </div>
  );
}

export default Input;
