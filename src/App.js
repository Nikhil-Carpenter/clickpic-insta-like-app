import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Homepage from "./pages/Homepage";
import Login from "./pages/Login";
import Chat from "./pages/Chat";
import Signup from "./pages/Signup";
import Createpost from "./pages/Createpost";
import Profile from "./pages/Profile";
import Timeline from "./pages/Timeline";
import Explore from "./pages/Explore";
import Protect from "./components/Protect";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/homepage" element={<Protect><Homepage /></Protect>} />
          <Route path="/chat" element={<Protect><Chat /></Protect>} />
          <Route path="/explore" element={<Protect><Explore/></Protect>} />
          <Route path="/timeline" element={<Protect><Timeline /></Protect>} />
          <Route path="/createpost" element={<Protect><Createpost/></Protect>} />
          <Route path="/profile/:username" element={<Protect><Profile/></Protect>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
