import TipsAndUpdatesOutlinedIcon from '@mui/icons-material/TipsAndUpdatesOutlined';
import IconButton from "@mui/material/IconButton";

export default function InformationBtn(){

    return(
        <IconButton aria-label="delete" sx={{backgroundColor:'#870058', "&:hover": {
            backgroundColor: "#870058",
            cursor: "default",
            transform: "scale(1.2)"
            }}}>
        <TipsAndUpdatesOutlinedIcon sx={{color:"white"}} />
      </IconButton> 
    )
}