import Box from '@mui/material/Box';
import Modal from '@mui/material/Modal';
const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  maxWidth: '1000px',
  maxHeight: '900px',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  display:'flex',
  p: 4,
};

export default function ActionModal({open,handleClose,actionEl}:{open:boolean,handleClose:()=>void,actionEl:JSX.Element}) {

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
            {actionEl}
        </Box>
      </Modal>
    </div>
  );
}