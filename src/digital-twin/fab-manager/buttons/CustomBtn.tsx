import IconButton from "@mui/material/IconButton";


export default function CustomBtn({icon}:{icon:JSX.Element}){

    return(
        <IconButton aria-label="custombtn"  sx={{backgroundColor:'#6A802E', "&:hover": {
            backgroundColor: "#6A802E",
            cursor: "default",
            transform: "scale(1.2)"
            }}} >
        {icon}
      </IconButton> 
    )
}