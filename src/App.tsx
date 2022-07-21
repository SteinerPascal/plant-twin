import { Routes, Route } from "react-router-dom";
import './App.scss';
import Twin from "./digital-twin/Twin";
import Manager from './manager/Manager'

function App() {
  return (
      <Routes>
        <Route path="/" element={<Manager />} />
        <Route path="/twin" element={<Twin />} />
      </Routes>
  );
}
export default App;
