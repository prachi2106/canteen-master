import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Box
} from "@mui/material";
import axios from "axios";
import { useEffect, useState } from "react";

const Transaction = () => {
  const [transactions, setTransactions] = useState([]);
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(sessionStorage.getItem("User"))
  );


  useEffect(() => {
    axios
      .get(`http://localhost:3333/transactions?employeeID=${loggedInUser.id}`)
      .then((response) => {
        setTransactions(response.data);
      });
  }, []);

  return (
    <>
      {transactions.length ? <Paper sx={{ m: 3 }}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Date</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Item</TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>Amount</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {transactions.length &&
                (transactions.map((transaction) => (
                  <TableRow
                    key={transaction.id}
                    sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  >
                    <TableCell align="center">{transaction.eventTime}</TableCell>
                    <TableCell align="center">{transaction.name}</TableCell>
                    <TableCell align="center">{transaction.amount}</TableCell>
                  </TableRow>
                )))
              }
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
        : (<Typography variant="h3" sx={{m:3}}>You have no transactions! Please buy something</Typography>)

      }
    </>
  );
};

export default Transaction;
