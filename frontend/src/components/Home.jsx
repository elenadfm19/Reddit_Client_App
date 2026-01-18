import {useEffect} from "react";
import { Link, NavLink, Outlet, useNavigate, useLocation} from "react-router-dom";
import SearchBar from "./SearchBar.jsx";
import logo from "../assets/logo.png";

/*
  Home component — top-level layout for the app's main view.
 
  - Displays the site logo, navigation links for subreddit categories, and a search bar.
  - Uses React Router's <Outlet /> to render nested routes
  - Automatically redirects from '/' to '/default' when visiting the root path.
 */
export default function Home() {
  const navigate = useNavigate();
  const location = useLocation();

  // Redirects to '/default' if the current path is the root '/'
  useEffect(()=> {
    if (location.pathname === '/') {
      navigate('default');
    }

  },[location]);
  

  return (
    <div>
      <div className="home-bar">
        {/* Logo section — clicking redirects to root */}
        <div>
          <Link to='/'><img id='logo' src={logo} /></Link>
        </div>

        {/* Navigation links to subreddits categories */}
        <div className='home-list'>
          <legend>SUBREDDITS</legend>
          <div className='navlinks'>
          <NavLink to="subreddits/default" className={({isActive})=> isActive ? 'activeNavLink': 'inactiveNavLink'}> Default </NavLink>
          <NavLink to="subreddits/popular" className={({isActive})=> isActive ? 'activeNavLink': 'inactiveNavLink'}>Popular</NavLink>
          <NavLink to="subreddits/new" className={({ isActive }) => isActive ? 'activeNavLink' : 'inactiveNavLink'}>New</NavLink>
          </div>
        </div>

        {/* Search Bar for user input */}
        <div>
          <SearchBar />
        </div>
      </div>

      {/* Outlet where nested routes will be rendered */}
      <Outlet />
    </div>
  );
}
