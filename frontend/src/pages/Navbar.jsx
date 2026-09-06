import { useLocation, useNavigate } from "react-router-dom";
import { useApp } from "../App";

function Navbar() {

  const navigate = useNavigate();
  const location = useLocation();

  const { logout } = useApp();


  const navItems = [
    {
      path: "/dashboard",
      label: "Dashboard",
      icon: "▦",
    },
    {
      path: "/batches",
      label: "Batches",
      icon: "▤",
    },
    {
      path: "/alerts",
      label: "Alerts",
      icon: "!",
    },
    {
      path: "/analytics",
      label: "Analytics",
      icon: "⌁",
    },
    {
      path: "/simulation",
      label: "Live Simulation",
      icon: "◉",
    },
  ];


  const handleLogout = () => {

    logout();

    navigate("/");

  };


  return (

    <header className="top-navbar">


      {/* LEFT */}

      <div className="nav-left">


        <div
          className="nav-logo"
          onClick={() => navigate("/dashboard")}
        >

          <div className="nav-logo-icon">
            F
          </div>

          <div>

            <div className="nav-brand">
              Fresh<span>Sense</span>
            </div>

            <div className="nav-caption">
              COLD-CHAIN INTELLIGENCE
            </div>

          </div>

        </div>


        <nav className="nav-links">

          {navItems.map((item) => {

            const active =
              location.pathname === item.path ||
              (
                item.path === "/batch" &&
                location.pathname.startsWith("/batch/")
              );


            return (

              <button
                key={item.path}
                className={
                  active
                    ? "nav-item active"
                    : "nav-item"
                }
                onClick={() =>
                  navigate(item.path)
                }
              >

                <span className="nav-icon">
                  {item.icon}
                </span>

                {item.label}

              </button>

            );

          })}

        </nav>

      </div>



      {/* RIGHT */}

      <div className="nav-right">


        <div className="system-status">

          <span className="status-dot"></span>

          <span>
            System Operational
          </span>

        </div>


        <div className="nav-user">

          <div className="user-avatar">
            FS
          </div>

          <div className="user-info">

            <strong>
              Demo User
            </strong>

            <span>
              Monitoring Admin
            </span>

          </div>

        </div>


        <button
          className="logout-button"
          onClick={handleLogout}
          title="Logout"
        >
          ↪
        </button>


      </div>

    </header>

  );

}

export default Navbar;