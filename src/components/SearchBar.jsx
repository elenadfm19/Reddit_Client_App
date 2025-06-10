import { useState } from "react";
import { useNavigate } from "react-router-dom";

/*
  SearchBar component
 
  - Renders a form with search input and button.
  - On submit, it navigates to the /search/:term route using the entered text.
  - Uses URL encoding to safely include special characters in the search query.
 */
export default function SearchBar() {
  //Local state to track user's input
  const [search, setSearch] = useState("");

  // React Router hook to programmatically navigate
  const navigate = useNavigate();

  //When the form is submitted, it navigates to /search/:term
  function handleSubmit(e) {
    e.preventDefault();
    //It removes white spaces from the term we search to be added to the navigation URL
    const encodedSearch = encodeURIComponent(search.trim());
    navigate(`/search/${encodedSearch}`);
  }

  return (
      <form onSubmit={handleSubmit}>
        <input
          id="search"
          type="text"
          value={search}
          placeholder="Search"
          onChange={(e) => setSearch(e.target.value)}
        />
        <button id='search-button'>Search</button>
      </form>
  );
}
