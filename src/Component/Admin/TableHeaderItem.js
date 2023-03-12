import React from "react";
import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";
const TableHeaderItem = ({valueToOrderBy, orderDirection, handleRequestSort}) => {

    const createSortHandler = (property) => (event) => {
        handleRequestSort(event,property);
    }
    return (
        <TableHead>
              <TableRow>
                <TableCell
                  key={"name"}
                  align="center"
                  sx={{ fontWeight: "bold" }}
                >
                  <TableSortLabel
                    active={valueToOrderBy === "name"}
                    direction={
                      valueToOrderBy === "name" ? orderDirection : "asc"
                    }
                    onClick={createSortHandler("name")}
                  >
                    Item Name
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  key={"quantity"}
                  align="center"
                  sx={{ fontWeight: "bold" }}
                >
                  <TableSortLabel
                    active={valueToOrderBy === "quantity"}
                    direction={
                      valueToOrderBy === "quantity" ? orderDirection : "asc"
                    }
                    onClick={createSortHandler("quantity")}
                  >
                    Item Quantity
                  </TableSortLabel>
                </TableCell>
                <TableCell
                  key={"price"}
                  align="center"
                  sx={{ fontWeight: "bold" }}
                >
                  <TableSortLabel
                    active={valueToOrderBy === "price"}
                    direction={
                      valueToOrderBy === "price" ? orderDirection : "asc"
                    }
                    onClick={createSortHandler("price")}
                  >
                    Item Price
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

export default TableHeaderItem;