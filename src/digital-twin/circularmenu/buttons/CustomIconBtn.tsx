import LightModeIcon from '@mui/icons-material/LightMode';
import IconButton from "@mui/material/IconButton";

export default function CustomBtn(){

    return(
        <IconButton aria-label="delete" sx={{backgroundColor:'#0DBEC7', "&:hover": {
            backgroundColor: "#0DBEC7",
            cursor: "default",
            transform: "scale(1.2)"
            }}}>
        <LightModeIcon sx={{color:"white"}} />
      </IconButton> 
    )
}