import "./styles.signupsignin.css";
import Input from "../Input/Input";
import { useState } from "react";
import Button from "../Button/Button";
import { toast } from "react-toastify";

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { doc, setDoc, serverTimestamp, getDoc } from "firebase/firestore";
import { auth, db } from "../../firebase.js";
import { useNavigate } from "react-router-dom";

function SignUpSignIn() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loginForm, setLoginForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function signUpWithEmailAndPassword(e) {
    e.preventDefault();
    setLoading(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setLoading(false);
      return;
    }

    if (name && email && password && confirmPassword) {
      try {
        const result = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = result.user;
        await createDocumentForUser(user);
        toast.success("Successfully Signed Up!");
        navigate("/dashboard");
      } catch (error) {
        toast.error(error.message);
        console.error(
          "Error signing up with email and password:",
          error.message
        );
      } finally {
        setLoading(false);
      }
    } else {
      toast.error("Please fill all the fields");
      setLoading(false);
    }
  }

  async function createDocumentForUser(user) {
    if (!user) {
      return;
    }
    const userRef = doc(db, "users", user.uid);
    const userData = await getDoc(userRef);
    if (!userData.exists()) {
      try {
        await setDoc(doc(db, "users", user.uid), {
          name: user.displayName ? user.displayName : name,
          email: email,
          photoURL: user.photoURL ? user.photoURL : "",
          createdAt: serverTimestamp(),
        });
        toast.success("User document created successfully");
      } catch (error) {
        toast.error("Error creating user document: " + error.message);
      }
    } else {
      toast.error("User DOC already exists");
    }
  }

  function signUpWithGoogle() {}

  function signInWithEmail() {
    setLoading(true);
    if (email !== "" && password !== "") {
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log("User signed in:", user);
          toast.success("User signed in successfully");
          setEmail("");
          setPassword("");
          setLoading(false);
          navigate("/dashboard");
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error("Error signing in:", errorCode, errorMessage);
          toast.error(errorMessage);
          setLoading(false);
        });
    } else {
      toast.error("Please fill all the fields");
      setLoading(false);
    }
  }
  function signInWithGoogle() {}

  return (
    <>
      {loginForm ? (
        <div className="signup-wrapper">
          <h2 className="title">
            Sign In to <span style={{ color: "var(--theme)" }}>Financely.</span>
          </h2>
          <form>
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
              placeholder={"Enter your password"}
            />
            <Button
              disabled={loading}
              text={loading ? "Loading" : "Sign in using Email and Password"}
              blue={false}
              onClick={signInWithEmail}
            />
            <p className="p-label">Or</p>
            <Button
              text={loading ? "Loading" : "Sign in using Google"}
              blue={true}
              onClick={signInWithGoogle}
            />
            <p className="p-label">
              Or Don't have an account?{" "}
              <span className="click-here" onClick={() => setLoginForm(false)}>
                Click Here
              </span>
            </p>
          </form>
        </div>
      ) : (
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
            <p className="p-label">Or</p>
            <Button
              text={loading ? "Loading" : "Sign Up using Google"}
              blue={true}
              onClick={signUpWithGoogle}
            />
            <p className="p-label">
              Or have an account already?{" "}
              <span className="click-here" onClick={() => setLoginForm(true)}>
                Click Here to login
              </span>
            </p>
          </form>
        </div>
      )}
    </>
  );
}

export default SignUpSignIn;
