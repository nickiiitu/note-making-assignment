import { Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Home from "./components/Home";
function App() {
  // console.log(user);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </div>
  );
}

export default App;
