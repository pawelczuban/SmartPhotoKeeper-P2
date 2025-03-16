import Login from "./Login";
import Signup from "./Signup";
import Profile from "./Profile";
import AlbumList from "./AlbumList";
import AlbumDetail from "./AlbumDetail";
import { BrowserRouter, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/albums" element={<Profile />}>
          <Route index element={<AlbumList />} />{" "}
          {/* Default route to AlbumList */}
          <Route path=":albumId" element={<AlbumDetail />} />
        </Route>
        <Route path="/signup" element={<Signup></Signup>}></Route>
        <Route path="/" element={<Login />} />{" "}
        {/* Inne trasy np. do logowania */}
      </Routes>
    </BrowserRouter>
  );
};

export default App;
