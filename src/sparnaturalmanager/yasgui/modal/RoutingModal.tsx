import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import { Link } from 'react-router-dom';
import { DataFactory, Quad_Object } from 'n3';
import SparqlHandler from '../../../SparqlHandler';

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const btnStyle = {
    float: 'right',
    marginRight: '80px'
}


export default function BasicModal({open,handleClose,iri}:{open:boolean,handleClose:()=>void,iri:string}) {
  const linkTarget = {
    pathname: `/twin/${SparqlHandler.getNamespaceObject(iri).value}`,
    key: iri, // we could use Math.random, but that's not guaranteed unique.
    state: {
      applied: true
    }
  };
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            IRI result selected
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            Would you like to open the following IRI in the web or in this application?
            <br />
            IRI: {iri}    
          </Typography>
          <br />
          <div>
            <Button variant="contained">Open in Web</Button>
            <Button component={Link} to={linkTarget} state={{ subject: iri }} variant="contained" sx={btnStyle}>Go to Digital Twin</Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}