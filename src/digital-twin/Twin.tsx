import { useLocation } from "react-router-dom";
import Layout from '../layout/Layout'
import CircularMenu from "./circularmenu/CirularMenu";
import SparqlHandler from "./SparqlHandler";

interface RoutingState {
  subject: string
}

const Twin = () => {
  // TODO: move away from hardcoded endpoint
  const sparqlHandler = new SparqlHandler("http://localhost:7200/repositories/geneva-example")
  const location = useLocation()
  const { subject } = (location.state as RoutingState)
  sparqlHandler.describeTwin(subject)
  return (
    <Layout>
      <h1>Digital Twin UI for {subject}</h1>
      <CircularMenu></CircularMenu>
    </Layout>
  );
};

export default Twin;
