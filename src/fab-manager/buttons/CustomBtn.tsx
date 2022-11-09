import LightModeIcon from '@mui/icons-material/LightMode';
import IconButton from "@mui/material/IconButton";


export default function CustomBtn(){

    return(
        <IconButton aria-label="custombtn"  sx={{backgroundColor:'#6A802E', "&:hover": {
            backgroundColor: "#6A802E",
            cursor: "default",
            transform: "scale(1.2)"
            }}}>
        <LightModeIcon sx={{fontSize: 50,color:"white"}} />
      </IconButton> 
    )
}