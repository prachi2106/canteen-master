import { Typography, Grid, Container } from "@mui/material";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Tagline, WelcomeTag, NameTag, Image } from "./HomeStyles";

const Home = () => {

  const [loggedInUSer, setLoggedInUSer] = useState(JSON.parse(sessionStorage.getItem("User")))
  return (
    <>
      <section class="home" id="home">
        <div class="home-title">
          <Tagline style={{ textAlign: "center" }}>We’ve got something for everyone</Tagline>
          {/* <<a ]class="btn">
          Explore the menu
        </a>> */}
          <Link to={"/menu"}>Explore the menu</Link>
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
            <Typography>
              You have a balance of {loggedInUSer.balance}
            </Typography>
          </Grid>
}
        </Grid>
        </Container>

      </section>
    </>
  );
};

export default Home;