import IconButton from "@mui/material/IconButton";


export default function CustomBtn({icon}:{icon:JSX.Element}){

    return(
        <IconButton aria-label="custombtn"  sx={{ opacity:0.9,backgroundColor:'#35735E', "&:hover": {
            backgroundColor: "#35735E",
            opacity:1,
            cursor: "default",
            transform: "scale(1.2)"
            }}} >
        {icon}
      </IconButton> 
    )
}