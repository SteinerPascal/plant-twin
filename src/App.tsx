import { Routes, Route } from "react-router-dom";
import './App.scss';
import SparqlHandler from "./SparqlHandler";
import Twin from "./digital-twin/Twin";
import Manager from "./sparnaturalmanager/Manager";
import TdEditor from "./td-editor/TdEditor";
import LeafletContainer from "./map-viewer/LeafletContainer";

function App() {
  // create Store and get twin information
  const endpointUrl = "http://localhost:7200/repositories/map-data"
  SparqlHandler.initSparqlClient(endpointUrl)
  return (
      <Routes>
        <Route path="/" element={<Manager />} />
        <Route path="/twin/*" element={<Twin endpointUrl={endpointUrl}/>} />
        <Route path='/tdeditor/*' element={<TdEditor endpointUrl={endpointUrl}/>} />
        <Route path='/mapviewer/*' element={<LeafletContainer />} />

      </Routes>
  );
}
export default App;
