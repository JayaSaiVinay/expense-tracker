import "./styles.signupsignin.css";
import Input from "../Input/Input";
import { useState } from "react";
import Button from "../Button/Button";
function SignUpSignIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  return (
    <div className="signup-wrapper">
      <h2 className="title">
        Sign Up on <span style={{ color: "var(--theme)" }}>Financely.</span>
      </h2>
      <form>
        <Input
          label={"Full Name"}
          state={name}
          setState={setName}
          placeholder={"John Doe"}
        />
        <Input
          label={"Email"}
          state={email}
          setState={setEmail}
          placeholder={"johndoe@gmail.com"}
        />
        <Input
          label={"Password"}
          state={password}
          setState={setPassword}
          placeholder={"Enter a strong password"}
        />
        <Input
          label={"Confirm Password"}
          state={confirmPassword}
          setState={setConfirmPassword}
          placeholder={"Confirm your password"}
        />
        <Button
          text={"Sign Up using Email and Password"}
          blue={false}
          onClick={() => {
            console.log("Clicked");
          }}
        />
        <p
          style={{
            textAlign: "center",
            fontSize: "0.8rem",
            margin: "0",
            padding: "0",
          }}
        >
          or
        </p>
        <Button
          text={"Sign Up using Google"}
          blue={true}
          onClick={() => {
            console.log("Clicked");
          }}
        />
      </form>
    </div>
  );
}

export default SignUpSignIn;
