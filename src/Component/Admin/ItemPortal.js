import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/EditRounded";
import StarIcon from "@mui/icons-material/Star";
import {
  Avatar,
  Button,
  ButtonGroup,
  FormControl,
  Grid,
  IconButton,
  InputLabel,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  MenuItem,
  Modal,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Box, Stack } from "@mui/system";
import axios from "axios";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";

const styles = {
  Paper: {
    padding: 20,
    margin: "auto",
    textAlign: "center",
    width: 500,
  },
};

const emptyItem = { name: "", price: "", quantity: "" };

const ItemPortal = () => {
  const [selectedItem, setSelectedItem] = useState({});
  const [isSelecting, setIsSelecting] = useState(false);
  const [newItem, setNewItem] = useState(emptyItem);
  const [Items, setItems] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3333/items").then((response) => {
      setItems(response.data);
    });

    axios.get("http://localhost:3333/daySpecial").then((response) => {
      setSelectedItem(response.data[0]);
    });
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3333/items").then((response) => {
      setItems(response.data);
    });
  }, [newItem]);

  const deleteHandler = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        axios
          .delete("http://localhost:3333/items/" + id)
          .then((response) => {
            Swal.fire("Deleted!", "Item data deleted.", "success");
            setItems(Items.filter((existing) => existing.id !=id));
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
        <input type="text" id="itemName" class="swal2-input" placeholder="Update Item Name">
        <input type="number" id="itemPrice" class="swal2-input" placeholder="New Price">
        `,
      confirmButtonText: "Update",
      focusConfirm: false,
      preConfirm: () => {
        const itemName = Swal.getPopup().querySelector("#itemName").value;
        const itemPrice = Swal.getPopup().querySelector("#itemPrice").value;
        if (!itemName || !itemPrice) {
          Swal.showValidationMessage(`Please enter New Name and itemPrice`);
        }
        return { itemName, itemPrice };
      },
    }).then((result) => {
      console.log(result.value);

      setItems(
        Items.map((obj) =>
          obj.name === item
            ? { name: result.value.itemName, price: result.value.itemPrice }
            : obj
        )
      );
      Swal.fire("Updated!", "Item Updated.", "success");
    });
  };

  const addItemHandler = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, add it!",
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
            Swal.fire("Something went wrong!", "Item data not added.", "failed");
          });
      }
    });
  };

  const handleItemChange = (e) => {
    setSelectedItem(e.target.value);
    setIsSelecting(false);
    axios.put("http://localhost:3333/daySpecial/1", {  "name": e.target.value.name,   "price": e.target.value.price,   "quantity": e.target.value.quantity}).then((response) => {

    });
  };

  return (
    <Box>
      <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={6}>
          <Grid
            container
            direction="column"
            justifyContent="center"
            alignItems="center"
          >
            <Grid item>
              <Stack direction="row" spacing={1}>
                <TextField
                  label="Item Name"
                  color="secondary"
                  value={newItem.name}
                  onChange={(e) =>
                    setNewItem((prev) => {
                      return { name: e.target.value, price: prev.price };
                    })
                  }
                />
                <TextField
                  type="number"
                  label="Item Quantity"
                  color="secondary"
                  value={newItem.price}
                  onChange={(e) =>
                    setNewItem((prev) => {
                      return {
                        name: prev.name,
                        price: e.target.value,
                        quantity: prev.quantity,
                      };
                    })
                  }
                />
                <TextField
                  type="number"
                  label="Item Price"
                  color="secondary"
                  value={newItem.quantity}
                  onChange={(e) =>
                    setNewItem((prev) => {
                      return {
                        name: prev.name,
                        price: prev.price,
                        quantity: e.target.value,
                      };
                    })
                  }
                />
                <Button
                  variant="outlined"
                  color="success"
                  onClick={addItemHandler}
                >
                  Add Item
                </Button>
              </Stack>
            </Grid>

            <Grid>
              <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
                Available Items
              </Typography>
              <Paper sx={{ width: "100%", overflow: "hidden" }}>
                <TableContainer sx={{ maxHeight: 600 }}>
                  <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                      <TableRow>
                        <TableCell align="center">Item Name</TableCell>
                        <TableCell align="center">Item Quantity</TableCell>
                        <TableCell align="center">Item Price</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {Items &&
                        Items.map((item) => (
                          <TableRow
                            key={item.id}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell align="center">{item.name}</TableCell>
                            <TableCell align="center">
                              {item.quantity}
                            </TableCell>
                            <TableCell align="center">{item.price}</TableCell>
                            <TableCell align="center">
                              <Button
                                onClick={() => editHandler(item.name)}
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
              </Paper>
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={6}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5">
              Item of the Day <StarIcon /> :{" "}
              {
                selectedItem  && selectedItem.name
              }
            </Typography>
            <Button
              sx={{ display: "flex", justifyContent: "flex-start", margin: 2 }}
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
      </Grid>
    </Box>
  );
};

export default ItemPortal;
