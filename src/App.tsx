import { Routes, Route } from "react-router-dom";
import './App.scss';
import SparqlHandler from "./digital-twin/SparqlHandler";
import Twin from "./digital-twin/Twin";
import Manager from "./sparnaturalmanager/Manager";
import TdEditor from "./td-editor/TdEditor";

function App() {
  // create Store and get twin information
  const endpointUrl = "http://localhost:7200/repositories/geneva-demo"
  SparqlHandler.initSparqlClient(endpointUrl)
  return (
      <Routes>
        <Route path="/" element={<Manager />} />
        <Route path="/twin/*" element={<Twin endpointUrl={endpointUrl}/>} />
        <Route path='/tdeditor/*' element={<TdEditor endpointUrl={endpointUrl}/>} />
      </Routes>
  );
}
export default App;
