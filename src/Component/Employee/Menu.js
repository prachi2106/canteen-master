import { AspectRatio, BookmarkAdd } from "@mui/icons-material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Button, Card, Modal, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import Swal from "sweetalert2";
import { date } from "yup";
import StarIcon from "@mui/icons-material/Star";
import { useEffect, useState } from "react";
import { FoodCard } from "./MenuStyles";
import { useSnackbar } from "notistack";

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};


export default function Menu() {
  const { enqueueSnackbar } = useSnackbar();
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(sessionStorage.getItem("User"))
  );
  const [open, setOpen] = useState(false)

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3333/daySpecial").then((response) => {
      items.forEach((item) => {
        item.name === response.data[0].name && setSelectedItem(response.data[0]);
      })
      setSelectedItem(response.data[0]);
    });
  }, []);

  const getLatestUserInfo = () => {
    axios
      .get("http://localhost:3333/Employees/" + loggedInUser.id)
      .then((response) => {
        sessionStorage.setItem("User", JSON.stringify(response.data));
        setLoggedInUser(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getItems = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3333/items/"
      );
      setItems(response.data);
    } catch (e) {
      console.log(e);
    }
  };

  const reduceItemQuantityByOne = (item) => {
    axios
      .put("http://localhost:3333/items/" + item.id, {
        name: item.name,
        price: item.price,
        quantity: item.quantity - 1,
      })
      .then((response) => {
        // getItems();
      });
  };

  const addTransaction = (item) => {
    axios
      .post("http://localhost:3333/transactions/", {
        employeeID: loggedInUser.id,
        eventTime: new Date().toDateString(),
        amount: item.price,
        name: item.name,
      })
      .then((response) => {
        // getItems();
      });
  };

  const reduceBalance = (item) => {
    axios
      .patch("http://localhost:3333/Employees/" + loggedInUser.id, {
        balance: loggedInUser.balance - item.price,
      })
      .then((response) => {
        // getItems();
        getLatestUserInfo();
      });
  };

  const buyClickHandler = (item) => {
    reduceItemQuantityByOne(item);
    setTimeout(function () {
      addTransaction(item);
    }, 500);
    setTimeout(function () {
      reduceBalance(item);
    }, 500);
    enqueueSnackbar("Item bought successfully",{ variant : "success"})
  };

  const buyForEmployeeHandler = () => {
      setOpen(true);

      // console.log(result.value);
      // axios
      //   .put("http://localhost:3333/Employees/", result.value)
      //   .then((response) => {
      //     Swal.fire("Updated!", "Employee data Updated.", "success");
      //     // getEmployeesData()
      //   })
      //   .catch((e) => {
      //     Swal.fire(
      //       "Something went wrong!",
      //       "Employee data not found.",
      //       "failed"
      //     );
      //   });

  };

  return (
      <Box
      component="ul"
      sx={{ display: "flex", gap: 2, flexWrap: "wrap", p: 2, m: 3 }}
    >
      { items.length ?
      <>
      <Typography variant="h5">
      <StarIcon />  Item of the Day : {selectedItem && selectedItem.name}
      </Typography>
      <FoodCard>
      {items.map((item) => (
        <Card variant="outlined" sx={{ width: 320, margin : 0.5 }} key={item.id}>
          <Typography level="h2" sx={{ p:1 }}>
            {item.name}
          </Typography>
              <Typography sx={{p :1}}>
                Price :{item.price}
              </Typography>

            <div style={{display : "flex"}}>
            <Button
              variant="contained"
              size="sm"
              color="primary"
              aria-label="Explore Bahamas Islands"
              sx={{ m: 2,px:1, fontWeight: 600 }}
              onClick={() => buyClickHandler(item)}
            >
              Buy
              <ShoppingCartIcon />
            </Button>
            {loggedInUser && loggedInUser.role === "admin" && (
              <Button
                variant="contained"
                size="sm"
                color="primary"
                aria-label="Explore Bahamas Islands"
                sx={{ m: 2, fontWeight: 600 }}
                onClick={() => buyForEmployeeHandler(item)}
              >
                Buy for employee
                <ShoppingCartIcon />
              </Button>
            )}
            </div>

        </Card>
      ))}
      </FoodCard>
      </> :
      <Typography variant="h3">Sorry! We are sold out!</Typography>
      }
      { open && 
      <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Text in a modal
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2 }}>
          Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
        </Typography>
      </Box>
    </Modal>
      }
    </Box>
  );
}
