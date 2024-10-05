import { Link, Outlet } from "react-router-dom";

const NavTab = () => {
  return (
    <div>
      <nav>
        <ul style={{ display: 'flex', listStyle: 'none' }}>
          <li style={{ marginRight: '20px' }}>
            <Link to="/">Home</Link>
          </li>
          <li style={{ marginRight: '20px' }}>
            <Link to="/about">About</Link>
          </li>
          <li style={{ marginRight: '20px' }}>
            <Link to="/contact">Contact</Link>
          </li>
        </ul>
      </nav>
      <Outlet />
    </div>
  );
};

export default NavTab;
