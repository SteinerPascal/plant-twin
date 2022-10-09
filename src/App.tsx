import { Routes, Route } from "react-router-dom";
import './App.scss';
import Twin from "./digital-twin/Twin";
import Manager from "./sparnaturalmanager/Manager";
import TdEditor from "./td-editor/TdEditor";

function App() {
  return (
      <Routes>
        <Route path="/" element={<Manager />} />
        <Route path="/twin/*" element={<Twin />} />
        <Route path='/tdeditor/*' element={<TdEditor/>} />
      </Routes>
  );
}
export default App;
