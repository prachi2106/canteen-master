import { Balance } from "@mui/icons-material";
import { Typography, Grid, Container } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Tagline, WelcomeTag, NameTag, Image, BalanceTag } from "./HomeStyles";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Home = () => {

  const [loggedInUSer, setLoggedInUSer] = useState(JSON.parse(sessionStorage.getItem("User")))
  return (
    <>
      <section class="home" id="home">
        <div class="home-title">
          <Tagline style={{ textAlign: "center" }}>We’ve got something for everyone</Tagline>
        </div>
        <Container>
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <Image src="/images/bg.jpg" alt="food"></Image>
            </Grid>
            {
              (loggedInUSer && loggedInUSer.role) === "user" &&
              <Grid item xs={6}>
                <WelcomeTag>
                  Welcome
                </WelcomeTag>
                <NameTag> {loggedInUSer.firstName} {loggedInUSer.lastName}</NameTag>
                <BalanceTag>
                  You have a balance of &#8377;{loggedInUSer.balance}
                </BalanceTag>
              </Grid>
            }
            {
              (loggedInUSer && loggedInUSer.role) === "admin" &&
              <>
                <WelcomeTag>Welcome</WelcomeTag>
                <NameTag>  <AdminPanelSettingsIcon fontSize="large" />
                  Admin</NameTag>
              </>
            }
          </Grid>
        </Container>

      </section>
    </>
  );
};

export default Home;