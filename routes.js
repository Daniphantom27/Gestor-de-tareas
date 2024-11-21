import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Registro from "./Registro";
import Tareas from "./Tareas";

function App() {
  var session = JSON.parse(localStorage.getItem("session"));
  if (session) {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/registro" element={<Registro />}></Route>
          <Route path="/tareas" element={<Tareas />}></Route>
        </Routes>
      </Router>
    );
  } else {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Login />}></Route>
          <Route path="/registro" element={<Registro />}></Route>
          <Route path="/tareas" element={<Login />}></Route>
        </Routes>
      </Router>
    );
  }
}

export default App;