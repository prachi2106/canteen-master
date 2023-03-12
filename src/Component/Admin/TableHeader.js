import React from "react";
import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";
const TableHeader = ({valueToOrderBy, orderDirection, handleRequestSort}) => {

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event,property);
    }
    return (
        <TableHead>
              <TableRow>
                <TableCell
                  key={"firstName"}
                  align="center"
                  sx={{ fontWeight: "bold" }}
                >
                  <TableSortLabel
                    active={valueToOrderBy === "firstName"}
                    direction={
                      valueToOrderBy === "firstName" ? orderDirection : "asc"
                    }
                    onClick={createSortHandler("firstName")}
                  >
                    Employee First Name
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  key={"lastName"}
                  align="center"
                  sx={{ fontWeight: "bold" }}
                >
                  <TableSortLabel
                    active={valueToOrderBy === "lastName"}
                    direction={
                      valueToOrderBy === "lastName" ? orderDirection : "asc"
                    }
                    onClick={createSortHandler("lastName")}
                  >
                    Employee Last Name
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  key={"balance"}
                  align="center"
                  sx={{ fontWeight: "bold" }}
                >
                  <TableSortLabel
                    active={valueToOrderBy === "balance"}
                    direction={
                      valueToOrderBy === "balance" ? orderDirection : "asc"
                    }
                    onClick={createSortHandler("balance")}
                  >
                    Balance
                  </TableSortLabel>
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Edit
                </TableCell>
                <TableCell align="center" sx={{ fontWeight: "bold" }}>
                  Delete
                </TableCell>
              </TableRow>
            </TableHead>
    )
}

export default TableHeader;