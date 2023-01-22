import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import AssistantIcon from '@mui/icons-material/Assistant';
import { Literal, NamedNode } from 'n3';
import IconButton from '@mui/material/IconButton';


export interface DeductionRow{
  foi:NamedNode
  sensorLbl:Literal,
  deductionLbl:Literal,
  resStateLbl:Literal
}

export default function DeductionTable({deduction, stateData,actionHandler}:{deduction:NamedNode, stateData:Array<DeductionRow>,actionHandler:(event:any)=>void}) {
  return (
    <div>
      <TableContainer sx={{opacity:0.5}}  component={Paper}>
          <Table sx={{ minWidth: 750 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Sensor</TableCell>
                <TableCell align="left">Involved deduction</TableCell>
                <TableCell align="left">Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              
              {stateData.map((row) => (
                <TableRow
                  key={row.sensorLbl?.value}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.sensorLbl?.value}
                  </TableCell>
                  <TableCell align="left" component="th" scope="row">
                    {row.deductionLbl?.value}
                  </TableCell>
                  <TableCell align="left">{row.resStateLbl?.value}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <Button value={deduction.value} onClick={actionHandler} endIcon={<AssistantIcon/>} >
          Show process recommendations
        </Button>
    </div>
    
  );
}