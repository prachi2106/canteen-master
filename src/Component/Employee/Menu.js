import { AspectRatio, BookmarkAdd } from "@mui/icons-material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Button, Card, IconButton, Typography } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import Swal from "sweetalert2";
import { date } from "yup";
import StarIcon from "@mui/icons-material/Star";
import { useEffect, useState } from "react";
import { FoodCard } from "./MenuStyles";

export default function Menu() {
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState({});
  const [loggedInUser, setLoggedInUser] = useState(
    JSON.parse(sessionStorage.getItem("User"))
  );

  useEffect(() => {
    getItems();
  }, []);

  useEffect(() => {
    axios.get("http://localhost:3333/daySpecial").then((response) => {
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
        "http://localhost:3333/items?quantity_gte=1"
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
  };

  const buyForEmployeeHandler = () => {
    Swal.fire({
      title: "Employee Update Form",
      html: `
        <input type="number" id="empId" class="swal2-input" placeholder="Enter Employee Id">
        `,
      confirmButtonText: "Update",
      focusConfirm: false,
      preConfirm: () => {
        const empId = Swal.getPopup().querySelector("#empId").value;
        if (!empId) {
          Swal.showValidationMessage(`Please enter empId`);
        }
        return { empId };
      },
    }).then((result) => {
      console.log(result.value);
      axios
        .put("http://localhost:3333/Employees/", result.value)
        .then((response) => {
          Swal.fire("Updated!", "Employee data Updated.", "success");
          // getEmployeesData()
        })
        .catch((e) => {
          Swal.fire(
            "Something went wrong!",
            "Employee data not found.",
            "failed"
          );
        });
    });
  };

  return (
    <Box
      component="ul"
      sx={{ display: "flex", gap: 2, flexWrap: "wrap", p: 2, m: 3 }}
    >
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

            {/* {loggedInUser && loggedInUser.role === "admin" && (
              <Button
                variant="solid"
                size="sm"
                color="primary"
                aria-label="Explore Bahamas Islands"
                sx={{ ml: "auto", fontWeight: 600 }}
                onClick={() => buyForEmployeeHandler(item)}
              >
                Buy for employee
                <ShoppingCartIcon />
              </Button>
            )} */}
            <Button
              variant="contained"
              size="sm"
              color="primary"
              aria-label="Explore Bahamas Islands"
              sx={{ m: 2, fontWeight: 600 }}
              onClick={() => buyClickHandler(item)}
            >
              Buy
              <ShoppingCartIcon />
            </Button>
        </Card>
      ))}
      </FoodCard>
    </Box>
  );
}
