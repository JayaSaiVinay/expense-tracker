import { useAuthState } from "react-firebase-hooks/auth";
import "./styles.header.css";
import { auth } from "../../firebase";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { signOut } from "firebase/auth";
function Header() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, loading]);
  function handleLogout() {
    try {
      signOut(auth)
        .then(() => {
          toast.success("Successfully logged out.");
          navigate("/");
        })
        .catch((e) => {
          console.error("Error signing out:", e);
          toast.error("Error signing out. Please try again.");
        });
    } catch (error) {
      toast.error("Error logging out. Please try again.");
    }
  }
  return (
    <div className="navbar">
      <p style={{ color: "var(--white)", fontWeight: 700, fontSize: "1.2rem" }}>
        Financely.
      </p>
      {user && (
        <p className="logo link" onClick={handleLogout}>
          Logout
        </p>
      )}
    </div>
  );
}

export default Header;
