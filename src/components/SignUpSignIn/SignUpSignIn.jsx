import "./styles.signupsignin.css";
import Input from "../Input/Input";
import { useState } from "react";
import Button from "../Button/Button";
import { toast } from "react-toastify";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase.js";

function SignUpSignIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(false);

  function signUpWithEmailAndPassword() {
    setLoading(true);
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }
    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      confirmPassword !== ""
    ) {
      createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("User signed up:", user);
          toast.success("User signed up successfully");
          setName("");
          setEmail("");
          setPassword("");
          setConfirmPassword("");
          setLoading(false);

          createDocumentForUser(user);
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error("Error signing up:", errorCode, errorMessage);
          toast.error(errorMessage);
          setLoading(false);
        });
    } else {
      toast.error("Please fill all the fields");
      setLoading(false);
    }
  }

  function createDocumentForUser(user) {
    
  }

  function signUpWithGoogle() {}
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
          type={"email"}
          label={"Email"}
          state={email}
          setState={setEmail}
          placeholder={"johndoe@gmail.com"}
        />
        <Input
          type={"password"}
          label={"Password"}
          state={password}
          setState={setPassword}
          placeholder={"Enter a strong password"}
        />
        <Input
          type={"password"}
          label={"Confirm Password"}
          state={confirmPassword}
          setState={setConfirmPassword}
          placeholder={"Confirm your password"}
        />
        <Button
          disabled={loading}
          text={loading ? "Loading" : "Sign Up using Email and Password"}
          blue={false}
          onClick={signUpWithEmailAndPassword}
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
          text={loading ? "Loading" : "Sign Up using Google"}
          blue={true}
          onClick={signUpWithGoogle}
        />
      </form>
    </div>
  );
}

export default SignUpSignIn;
