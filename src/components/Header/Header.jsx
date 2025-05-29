import "./styles.header.css";
function Header() {
  function handleLogout() {
    alert("You have been logged out successfully.");
  }
  return (
    <div className="navbar">
      <p style={{ color: "var(--white)", fontWeight: 700, fontSize: "1.2rem" }}>
        Financely.
      </p>
      <p className='logo link' onClick={handleLogout}>Logout</p>
    </div>
  );
}

export default Header;
