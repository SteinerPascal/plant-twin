import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { Literal, NamedNode } from 'n3';
import IconButton from '@mui/material/IconButton';


export interface ProcessRow{
    device:NamedNode;
    deviceLbl:Literal;
    deviceDesc:Literal;
    aaLbl:Literal;
    aaDesc:Literal;
    procedure:NamedNode;
    procedureLbl:Literal;
}

export default function ProcessTable({stateData}:{stateData:Array<ProcessRow>}) {
  return (
    <div>
      <TableContainer sx={{opacity:0.5}}  component={Paper}>
          <Table sx={{ minWidth: 750 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Device</TableCell>
                <TableCell align="left">Device description</TableCell>
                <TableCell align="left">Actuation</TableCell>
                <TableCell align="left">Actuation description</TableCell>
                <TableCell align="left">Recommended procedure</TableCell>
                <TableCell align="left">Execution button</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              
              {stateData.map((row) => (
                <TableRow
                  key={row.device?.value+row.device}
                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                >
                  <TableCell component="th" scope="row">
                    {row.deviceLbl?.value}
                  </TableCell>
                  <TableCell align="left" component="th" scope="row">
                    {row.deviceDesc?.value}
                  </TableCell>
                  <TableCell align="left">{row.aaLbl?.value}</TableCell>
                  <TableCell align="left">{row.aaDesc?.value}</TableCell>
                  <TableCell align="left">{row.procedureLbl?.value}</TableCell>
                  <TableCell align="left"><IconButton><PowerSettingsNewIcon/></IconButton></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
    </div>
    
  );
}