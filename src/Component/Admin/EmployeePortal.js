import AddIcon from "@mui/icons-material/Add";
import DirectionsIcon from "@mui/icons-material/Directions";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import { Button, TablePagination, TableSortLabel } from "@mui/material";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Container } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import TableHeader from "./TableHeader";

const descendingComparator = (a,b, orderBy) => {
  if(b[orderBy] < a[orderBy]){
    return -1;
  }
  if(b[orderBy] > a[orderBy]){
    return 1;
  }
  return 0;
}

const getComparator = (order, orderBy) => {
  return order === "desc"
  ? (a,b) => descendingComparator(a,b, orderBy)
  : (a,b) => -descendingComparator(a,b, orderBy)
}

const sortedRowInformation = (rowArray, comparator) => {
const stabilizedArray = rowArray.map((el, index) => [el, index])
stabilizedArray.sort((a,b) => {
  const order = comparator(a[0], b[0])
  if(order !== 0) return order
  return a[1] - b[1]
})
return stabilizedArray.map((el) => el[0])
}

export default function EmployeeTable() {
  const [employees, setEmployees] = useState([]);
  const [search, setSearch] = useState("");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [valueToOrderBy, setValueToOrderBy] = useState("name");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  useEffect(() => {
    getEmployeesData();
  }, []);

  useEffect(() => {
    if (search.length > 0)
      setEmployees(
        employees.filter(
          (e) =>
            (e.firstName &&
              e.firstName.toUpperCase().includes(search.toUpperCase())) ||
            (e.lastName &&
              e.lastName.toUpperCase().includes(search.toUpperCase()))
        )
      );
    else getEmployeesData();
  }, [search]);

  const getEmployeesData = async () => {
    try {
      const response = await axios.get("http://localhost:3333/Employees");
      setEmployees(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const deleteHandler = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete("http://localhost:3333/Employees/" + id)
          .then((response) => {
            Swal.fire("Deleted!", "Employee data deleted.", "success");
            getEmployeesData();
          })
          .catch((e) => {
            Swal.fire(
              "Something went wrong!",
              "Employee data not found.",
              "failed"
            );
          });
      }
    });
  };

  const editHandler = (employee) => {
    console.log("id", employee);
    Swal.fire({
      title: "Employee Update Form",
      html: `
        <input type="text" id="firstName" class="swal2-input" placeholder="First Name" value=${employee.firstName}>
        <input type="text" id="lastName" class="swal2-input" placeholder="Last Name" value=${employee.lastName}>
        <input type="number" id="balance" class="swal2-input" placeholder="Balance" value=${employee.balance}>
        `,
      confirmButtonText: "Update",
      focusConfirm: false,
      preConfirm: () => {
        const firstName = Swal.getPopup().querySelector("#firstName").value;
        const lastName = Swal.getPopup().querySelector("#lastName").value;
        const balance = Swal.getPopup().querySelector("#balance").value;
        if (!firstName || !lastName || !balance) {
          Swal.showValidationMessage(
            `Please enter FirstName and LastName and Balance`
          );
        }
        return { firstName, lastName, balance };
      },
    }).then((result) => {
      console.log(result.value);
      if (result.value) {
        axios
          .put("http://localhost:3333/Employees/" + employee.id, result.value)
          .then((response) => {
            Swal.fire("Updated!", "Employee data Updated.", "success");
            getEmployeesData();
          })
          .catch((e) => {
            Swal.fire(
              "Something went wrong!",
              "Employee data not found.",
              "failed"
            );
          });
      }
    });
  };

  const addEmployeeHandler = () => {
    Swal.fire({
      title: "Add Employee Form",
      html: `
        <input type="text" id="firstName" class="swal2-input" placeholder="First Name">
        <input type="text" id="lastName" class="swal2-input" placeholder="Last Name">
        <input type="number" id="balance" class="swal2-input" placeholder="Balance">
        `,
      confirmButtonText: "Add",
      focusConfirm: false,
      preConfirm: () => {
        const firstName = Swal.getPopup().querySelector("#firstName").value;
        const lastName = Swal.getPopup().querySelector("#lastName").value;
        const balance = Swal.getPopup().querySelector("#balance").value;
        if (!firstName || !lastName || !balance) {
          Swal.showValidationMessage(
            `Please enter FirstName and LastName and Balance`
          );
        }
        return { firstName, lastName, balance };
      },
    }).then((result) => {
      console.log(result.value);
      if (result.value) {
        axios
          .post("http://localhost:3333/Employees/", result.value)
          .then((response) => {
            Swal.fire("Added!", "Employee data Added.", "success");
            getEmployeesData();
          })
          .catch((e) => {
            Swal.fire(
              "Something went wrong!",
              "Employee data not added.",
              "failed"
            );
          });
      }
    });
  };

  const handleRequestSort = (event, property) => {
    const isAscending = (valueToOrderBy === property &&  orderDirection === "asc")
    setValueToOrderBy(property)
    setOrderDirection(isAscending ? "desc" : "asc")
  }

  const handleChangePage = (event, newPage) => {
setPage(newPage)
  }

  const handleChangeRowsPerPage = (event) =>{
    setRowsPerPage(parseInt(event.target.value),10)
    setPage(0)
  }

  return (
    <Container>
      <Button
        sx={{ display: "flex", justifyContent: "end", margin: 3 }}
        variant="contained"
        onClick={addEmployeeHandler}
      >
        <AddIcon /> Add Employee
      </Button>
      <Paper
        component="form"
        sx={{
          p: "2px 4px",
          m: 2,
          display: "flex",
          alignItems: "center",
          width: 400,
        }}
      >
        <InputBase
          sx={{ m: 1, flex: 1 }}
          placeholder="Search Employee"
          inputProps={{ "aria-label": "search employee" }}
          onChange={(e) => setSearch(e.target.value)}
        />
        <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
          <SearchIcon />
        </IconButton>
        <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
      </Paper>
      <Paper sx={{ width: "100%", overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: 600 }}>
          <Table stickyHeader aria-label="sticky table">
           <TableHeader valueToOrderBy={valueToOrderBy}
           orderDirection ={orderDirection}
           handleRequestSort={handleRequestSort}
           />
            <TableBody>
              {sortedRowInformation(employees, getComparator(orderDirection, valueToOrderBy))
              .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
              .map((employee) => (
                <TableRow
                  key={employee.id} 
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell align="center">{employee.firstName}</TableCell>
                  <TableCell align="center">{employee.lastName}</TableCell>
                  <TableCell align="center">{employee.balance}</TableCell>
                  <TableCell align="center">
                    <Button
                      onClick={() => editHandler(employee)}
                      variant="contained"
                    >
                      Edit
                    </Button>
                  </TableCell>
                  <TableCell align="center">
                    <Button
                      variant="contained"
                      onClick={() => deleteHandler(employee.id)}
                    >
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        <TablePagination
        rowsPerPageOptions={5}
        component="div"
        count={employees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        >
        </TablePagination>
      </Paper>
    </Container>
  );
}
