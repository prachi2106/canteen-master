import StarIcon from "@mui/icons-material/Star";
import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  TextField,
  Typography,
  TablePagination,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { useSnackbar } from "notistack";
import TableHeaderItem from "./TableHeaderItem";
import SearchIcon from "@mui/icons-material/Search";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import Divider from "@mui/material/Divider";

const descendingComparator = (a, b, orderBy) => {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
};

const getComparator = (order, orderBy) => {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
};

const sortedRowInformation = (rowArray, comparator) => {
  const stabilizedArray = rowArray.map((el, index) => [el, index]);
  stabilizedArray.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });
  return stabilizedArray.map((el) => el[0]);
};

const emptyItem = { name: "", price: "", quantity: "" };

const ItemPortal = () => {
  const [selectedItem, setSelectedItem] = useState({});
  const [isSelecting, setIsSelecting] = useState(false);
  const [newItem, setNewItem] = useState(emptyItem);
  const [Items, setItems] = useState([]);
  const [search, setSearch] = useState("");
  const [orderDirection, setOrderDirection] = useState("asc");
  const [valueToOrderBy, setValueToOrderBy] = useState("itemName");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    axios.get("http://localhost:3333/items").then((response) => {
      setItems(response.data);
    });

    axios.get("http://localhost:3333/daySpecial").then((response) => {
      if (Items.length === 1) {
        setSelectedItem(Items[0]);
      } else if (
        Items.filter((item) => item.name === response.data[0].name).length === 0
      ) {
        setSelectedItem(null);
      } else {
        setSelectedItem(response.data[0]);
      }
    });
  }, [Items]);

  useEffect(() => {
    getData();
  }, [newItem]);

  const getData = async () => {
    const response = await axios.get("http://localhost:3333/items/");
    console.log("response", response);
    setItems(response.data);
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
          .delete("http://localhost:3333/items/" + id)
          .then((response) => {
            Swal.fire("Deleted!", "Item data deleted.", "success");
            setItems(Items.filter((existing) => existing.id != id));
          })
          .catch((e) => {
            Swal.fire("Something went wrong!", "Item data not found.", "error");
          });
      }
    });
  };

  const editHandler = (item) => {
    Swal.fire({
      title: "Edit Item Form",
      html: `
        <input type="text" id="itemName" class="swal2-input" placeholder="Update Item Name" value=${item.name}>
        <input type="number" id="itemPrice" class="swal2-input" placeholder="New Price" value=${item.price}>
        <input type="number" id="itemQuantity" class="swal2-input" placeholder="New Quantity" value=${item.quantity}>
        `,
      confirmButtonText: "Update",
      focusConfirm: false,
      preConfirm: () => {
        const itemName = Swal.getPopup().querySelector("#itemName").value;
        const itemPrice = Swal.getPopup().querySelector("#itemPrice").value;
        const itemQuantity =
          Swal.getPopup().querySelector("#itemQuantity").value;
        if (!itemName || !itemPrice || !itemQuantity) {
          Swal.showValidationMessage(`Please enter the fields`);
        }
        return { itemName, itemPrice, itemQuantity };
      },
    }).then((result) => {
      console.log(result.value);
      if (result.value) {
        axios
          .put("http://localhost:3333/items/" + item.id, result.value)
          .then((response) => {
            console.log("response", response);
            Swal.fire("Updated!", "Items updated", "success");
            getData();
            console.log("items", Items);
          })
          .catch((e) => {
            Swal.fire("Oops! You have got an error", e);
          });
      }
    });
  };

  const addItemHandler = ({ name, quantity, price }) => {
    const validate = () => {
      if (name.length === 0) {
        enqueueSnackbar("Please add Item name", { variant: "warning" });
        return false;
      } else if (price == undefined || quantity == undefined) {
        enqueueSnackbar("Price or Quantity can't be empty", {
          variant: "warning",
        });
        return false;
      } else if (Number(price) === 0 || Number(quantity) === 0) {
        enqueueSnackbar("Price and Quantity can't be 0", {
          variant: "warning",
        });
        return false;
      } else if (Number(price) < 0 || Number(quantity) < 0) {
        enqueueSnackbar("Price and Quantity can't be negative", {
          variant: "warning",
        });
        return false;
      } else {
        return true;
      }
    };
    if (validate()) {
      Swal.fire({
        title: "Add Item?",
        //text: "You won't be able to revert this!",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes",
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .post("http://localhost:3333/items", newItem)
            .then((response) => {
              Swal.fire("Added!", "Item data Added.", "success");
              // setItems((prevState) => { return [...prevState, newItem] });
              setNewItem(emptyItem);
            })
            .catch((e) => {
              Swal.fire(
                "Something went wrong!",
                "Item data not added.",
                "failed"
              );
            });
        }
      });
    }
  };

  const handleItemChange = (e) => {
    setSelectedItem(e.target.value);
    setIsSelecting(false);
    axios
      .put("http://localhost:3333/daySpecial/1", {
        name: e.target.value.name,
        price: e.target.value.price,
        quantity: e.target.value.quantity,
      })
      .then((response) => {});
  };

  const handleRequestSort = (event, property) => {
    const isAscending = valueToOrderBy === property && orderDirection === "asc";
    setValueToOrderBy(property);
    setOrderDirection(isAscending ? "desc" : "asc");
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value), 10);
    setPage(0);
  };

  
  useEffect(() => {
    if (search.length > 0)
    {  setItems(Items.filter((e) =>(e.name && e.name.toUpperCase().includes(search.toUpperCase()))))}
    else getData();
  }, [search]);

  return (
    <Box sx={{ m: 2 }}>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid
              item
              sx={{
                background: "white",
                m: 4,
                p: 2,
                borderRadius: 2,
              }}
            >
              <Stack direction="row" spacing={2}>
                <TextField
                  label="Item Name"
                  color="secondary"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      name: e.target.value,
                    })
                  }
                />
                <TextField
                  type="number"
                  label="Item Quantity"
                  color="secondary"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      quantity: e.target.value,
                    })
                  }
                />
                <TextField
                  type="number"
                  label="Item Price"
                  color="secondary"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem({
                      ...newItem,
                      price: e.target.value,
                    })
                  }
                />
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => addItemHandler(newItem)}
                >
                  Add Item
                </Button>
              </Stack>
            </Grid>

            <Grid>
              {Items.length ? (
                <>
                  <Typography
                    sx={{ mt: 4, mb: 2, fontFamily: "Hanuman", color: "white" }}
                    variant="h6"
                    component="div"
                  >
                    Available Items
                  </Typography>
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
                      placeholder="Search Menu"
                      inputProps={{ "aria-label": "search Menu" }}
                      onChange={(e) => setSearch(e.target.value)}
                    />
                    <IconButton
                      type="button"
                      sx={{ p: "10px" }}
                      aria-label="search"
                    >
                      <SearchIcon />
                    </IconButton>
                    <Divider
                      sx={{ height: 28, m: 0.5 }}
                      orientation="vertical"
                    />
                  </Paper>
                  <Paper sx={{ width: "100%", overflow: "hidden" }}>
                    <TableContainer sx={{ maxHeight: 600 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHeaderItem
                          valueToOrderBy={valueToOrderBy}
                          orderDirection={orderDirection}
                          handleRequestSort={handleRequestSort}
                        />
                        <TableBody>
                          {Items &&
                            sortedRowInformation(
                              Items,
                              getComparator(orderDirection, valueToOrderBy)
                            )
                              .slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              .map((item) => (
                                <TableRow
                                  key={item.id}
                                  sx={{
                                    "&:last-child td, &:last-child th": {
                                      border: 0,
                                    },
                                  }}
                                >
                                  <TableCell align="center">
                                    {item.name}
                                  </TableCell>
                                  <TableCell align="center">
                                    {item.quantity}
                                  </TableCell>
                                  <TableCell align="center">
                                    {item.price}
                                  </TableCell>
                                  <TableCell align="center">
                                    <Button
                                      onClick={() => editHandler(item)}
                                      variant="contained"
                                    >
                                      Edit
                                    </Button>
                                  </TableCell>
                                  <TableCell align="center">
                                    <Button
                                      variant="contained"
                                      onClick={() => deleteHandler(item.id)}
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
                      count={Items.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    ></TablePagination>
                  </Paper>
                </>
              ) : (
                <Typography variant="h3">NO ITEMS AVAILABLE!</Typography>
              )}
            </Grid>
          </Grid>
        </Grid>
        {Items.length && (
          <Grid item xs={6}>
            <Grid
              item
              xs={12}
              md={6}
              sx={{ background: "white", m: 4, p: 2, borderRadius: 2 }}
            >
              <Typography variant="h5">
                Item of the Day <StarIcon /> :{" "}
                {selectedItem && selectedItem.name}
              </Typography>
              <Button
                sx={{
                  display: "flex",
                  justifyContent: "flex-start",
                  margin: 2,
                }}
                variant="contained"
                onClick={() => setIsSelecting(true)}
              >
                Change Item of the Day
              </Button>
              {isSelecting && (
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">
                    Select Item
                  </InputLabel>
                  <Select
                    labelId="selectItem"
                    id="selectItem"
                    onChange={(e) => handleItemChange(e)}
                    label="Select Item"
                  >
                    {Items &&
                      Items.length > 0 &&
                      Items.map((item) => (
                        <MenuItem value={item}>{item.name}</MenuItem>
                      ))}
                  </Select>
                </FormControl>
              )}
            </Grid>
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default ItemPortal;
