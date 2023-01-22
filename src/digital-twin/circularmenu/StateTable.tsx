import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import IconButton from '@mui/material/IconButton';
import { Literal, NamedNode } from 'n3';

export interface StateRow{
  foi:NamedNode,
  deduction:NamedNode,
  propLbl:Literal,
  stateLbl:Literal,
  goalStateLbl:Literal
  sensor:Literal
}

export default function StateTable({stateData,actionHandler}:{stateData:Array<StateRow>,actionHandler:(event:any)=>void}) {
    const actionNeeded = (currentState:string,goalState:string,deduction:string,foi:string)=>{
      if(goalState === "No goal state defined" || currentState === goalState ){
        return <CheckCircleOutlineIcon sx={{ color: '#66ff66', opacity:1}} />
      }
      return <IconButton value={JSON.stringify({deduction:deduction,foi:foi})} onClick={actionHandler} aria-label="delete">
      <WarningAmberIcon sx={{ color: 'red' }} />
    </IconButton>
    }
  const cellStyle = {color:'white'}

  return (
      <TableContainer sx={{position:'absolute',marginLeft:'22%',marginTop:'88%',minWidth:750}} component={Paper}>
          <Table sx={{  minWidth: 750, opacity:0.9, background: '#35735E' , borderRadius: '10px'}} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell sx={cellStyle}>Property</TableCell>
                <TableCell sx={cellStyle} align="left">Current State</TableCell>
                <TableCell sx={cellStyle} align="left">Goal State</TableCell>
                <TableCell sx={cellStyle} align="left">Sensor</TableCell>
                <TableCell sx={cellStyle} align="left">Evaluation</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              
              {stateData.map((row) => (
                <TableRow
                  key={row.propLbl?.value}
                  sx={{ color:'#A36746','&:last-child td, &:last-child th': { borderRadius: '0 10px 10px 0' } }}
                >
                  <TableCell sx={cellStyle} component="th" scope="row">
                    {row.propLbl?.value}
                  </TableCell>
                  <TableCell sx={cellStyle} align="left" component="th" scope="row">
                    {row.stateLbl?.value}
                  </TableCell>
                  <TableCell sx={cellStyle} align="left">{row.goalStateLbl?.value}</TableCell>
                  <TableCell sx={cellStyle} align="left">{row.sensor?.value}</TableCell>
                  <TableCell sx={cellStyle} align="left">{actionNeeded(row.stateLbl.value,row.goalStateLbl.value,row.deduction.value,row.foi.value)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>    
  );
}