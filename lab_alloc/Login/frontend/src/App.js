import { BrowserRouter as Router, Routes, Route, } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";


function App() {
  return (
           
    <Router>
      <Routes>
        <Route path="/login" element={<Login/>} ></Route>
        <Route path="/signup" element={<Signup></Signup>}/>
       
       
      </Routes>
    </Router>
  );
}

export default App;
