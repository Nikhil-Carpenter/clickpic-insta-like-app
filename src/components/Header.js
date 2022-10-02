import "../css/Header.css";
import { Link } from "react-router-dom";
import { useRef, useState } from "react";

function Header() {
  let loginDetails = useRef(JSON.parse(localStorage.getItem("login_details")));
  let [searchedUser, setSearchedUser] = useState([]);
  // console.log(loginDetails.current)

  function searchUser(username) {
    if (username !== "") {
      fetch(`http://localhost:8000/users/search/${username}`, {
        headers: {
          authorization: `Bearer ${loginDetails.current.token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);
          if (data.success === true) {
            setSearchedUser(data.users);
          }
          // console.log(data.users)
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      setSearchedUser([]);
    }
  }

  return (
    // <div className="header_container1">
    <header className="header">
      <div className="header_container">
        <div className="logo_head">
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR1hJgLcgM1sdPwIGw44fJekZgZH-UKBKBLGv1ZhfVS&s"
            alt="instagram logo"
          />
        </div>
        <div className="search_area">
          <div className="search">
            <i className="bi bi-search"></i>
            <input
              onChange={(event) => {
                searchUser(event.target.value);
              }}
              type="search"
              placeholder="Search"
            />
          </div>

          {searchedUser.length !== 0 ? (
            <div className="search_results">
              {searchedUser.map((user, idx) => {
                return (
                  <div className="search_result" key={idx}>
                    <img src={user.profilePic} alt="" />

                    <p>
                      <Link to={`/profile/${user.username}`}>
                        <span className="us_username">{user.username}</span>
                      </Link>
                      <span className="us_user">{user.name}</span>
                    </p>
                  </div>
                );
              })}
            </div>
          ) : null}
        </div>
        <nav className="nav_links">
          <ul className="navigation">
            <li>
              <Link to="/homepage">
                <i className="bi bi-house-door"></i>
              </Link>
            </li>
            <li>
            <Link to="/chat">
              <i className="bi bi-messenger"></i>
              </Link>
            </li>
            <li>
              <Link to="/createpost">
                <i className="bi bi-plus-square"></i>
              </Link>
            </li>
            <li>
              <Link to="/explore">
                <i className="fa-solid fa-compass"></i>
              </Link>
            </li>
            
            <li>
                <Link to="/timeline">
                  <i className="fa-solid fa-heart"></i>
                </Link>
            </li>
            
            
            <Link to={`/profile/${loginDetails.current.username}`}>
              <li className="profile">
                <img src={loginDetails.current.profilePic} alt="login user" />
              </li>
            </Link> 

          </ul>
        </nav>
      </div>
    </header>
    // </div>
  );
}

export default Header;
