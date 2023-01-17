import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { useState } from 'react';
import { Literal } from 'n3';

export interface StateRow{
    propertyLbl:Literal,
    deductionLbl:Literal,
    stateLbl:Literal
    
}

export default function StateTable({stateData}:{stateData:Array<StateRow>}) {
    const [states, addStateData] = useState<Array<StateRow>>(stateData)
    console.log('states')
    console.dir(stateData)
  return (
    <TableContainer component={Paper}>
    <Table sx={{ minWidth: 550 }} aria-label="simple table">
      <TableHead>
        <TableRow>
          <TableCell>Property</TableCell>
          <TableCell align="right">Deduction</TableCell>
          <TableCell align="right">State</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        
        {stateData.map((row) => (
          <TableRow
            key={row.propertyLbl?.value}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell component="th" scope="row">
              {row.propertyLbl?.value}
            </TableCell>
            <TableCell align="right">{row.deductionLbl?.value}</TableCell>
            <TableCell align="right">{row.stateLbl?.value}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
  );
}