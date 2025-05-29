import Header from "../components/Header/Header";
import SignUpSignIn from "../components/SignUpSignIn/SignUpSignIn"; 
function SignUp() {
  return (
    <div>
      <Header />
      <div className="wrapper">
        <SignUpSignIn />
      </div>
    </div>
  );
}

export default SignUp;
