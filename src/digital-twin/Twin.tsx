import { useLocation } from "react-router-dom";
import Layout from '../layout/Layout'
import CircularMenu from "./circularmenu/CirularMenu";

interface RoutingState {
  subject: string
}

const Twin = () => {
  const location = useLocation()
  const { subject } = (location.state as RoutingState)
  return (
    <Layout>
      <h1>Digital Twin UI for {subject}</h1>
      <CircularMenu></CircularMenu>
    </Layout>
  );
};

export default Twin;
