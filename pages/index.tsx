import React, { Fragment, useState } from "react";
import type { NextPage, GetStaticProps } from "next";
import Image from "next/image";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import MinusIcon from "@mui/icons-material/Remove";
import Carousel from "react-material-ui-carousel";
import { getHotelsData } from "../lib/api/hotels";
import { HomePageProps, Hotel, Room, IFilters } from "../lib/types/types";

const ADULT = "adults";
const CHILD = "children";

const Home: NextPage<HomePageProps> = ({ hotelsData }) => {
  const [filters, setFilters] = useState<IFilters>({
    rating: 0,
    adults: 0,
    children: 0,
  });

  const setCapacity = (guestType: string, incrementBy: number) => {
    setFilters({
      ...filters,
      [guestType]: filters[guestType] + incrementBy,
    });
  };

  const filteredHotels = hotelsData.filter(
    (hotel: Hotel) => parseInt(hotel.starRating) >= filters.rating,
  );

  const filteredRooms = (rooms: Room[]) => {
    return rooms.filter(
      (room) =>
        room.occupancy.maxAdults >= filters.adults &&
        room.occupancy.maxChildren >= filters.children,
    );
  };

  return (
    <>
      {/* Hero Section*/}
      <Box
        sx={{
          height: 500,
          background: `url(https://www.guestline.com/wp-content/uploads/2020/09/home-hero4a.jpg?auto=format&ch=DPR%2CWidth&crop=faces%2Cedges&fit=crop&h=980&ixjsv=2.2.4&q=65&w=1920)`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "center center",
          backgroundSize: "cover",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
        <Typography variant="h1" color="#fff">
          Guestline
        </Typography>
      </Box>

      <Container maxWidth="md">
        {/* Filters */}
        <Paper
          sx={{
            p: 2,
            margin: "auto",
            transform: "translateY(-50%)",
            maxWidth: 700,
            flexGrow: 1,
          }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4} alignSelf="flex-end" textAlign="center">
              <Rating
                name="simple-controlled"
                size="large"
                value={filters.rating}
                onChange={(event, newValue) => {
                  setFilters({
                    ...filters,
                    rating: newValue as number,
                  });
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <Typography variant="subtitle1">Adults:</Typography>
                <IconButton onClick={() => setCapacity(ADULT, -1)} disabled={filters.adults === 0}>
                  <MinusIcon />
                </IconButton>
                <Typography>{filters.adults}</Typography>
                <IconButton onClick={() => setCapacity(ADULT, 1)}>
                  <AddIcon />
                </IconButton>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4}>
              <Stack direction="row" alignItems="center" justifyContent="center" spacing={2}>
                <Typography variant="subtitle1">Children:</Typography>
                <IconButton
                  onClick={() => setCapacity(CHILD, -1)}
                  disabled={filters.children === 0}>
                  <MinusIcon />
                </IconButton>
                <Typography>{filters.children}</Typography>
                <IconButton onClick={() => setCapacity(CHILD, 1)}>
                  <AddIcon />
                </IconButton>
              </Stack>
            </Grid>
          </Grid>
        </Paper>
        {/* Hotels */}
        {filteredHotels.map((hotel: Hotel) => (
          <Paper
            key={hotel.id}
            sx={{
              p: 2,
              my: 2,
              flexGrow: 1,
            }}>
            <Grid container spacing={2} mb={1}>
              <Grid item xs={6} md={3}>
                <Carousel indicators={false}>
                  {hotel.images.map((item, i) => (
                    <Image key={i} alt={item.alt} width={500} height={400} src={item.url} />
                  ))}
                </Carousel>
              </Grid>
              <Grid container item xs={6} md={6} sm direction="column">
                <Typography gutterBottom variant="h6" component="h1">
                  {hotel.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hotel.address1}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hotel.address2}
                </Typography>
              </Grid>
              <Grid item md={3} textAlign="right">
                <Rating name="read-only" size="large" value={parseInt(hotel.starRating)} readOnly />
              </Grid>
            </Grid>
            {/* Rooms */}
            {filteredRooms(hotel.rooms).length > 0 ? (
              filteredRooms(hotel.rooms).map((room) => (
                <Fragment key={room.id}>
                  <Divider />
                  <Grid container spacing={2} py={2}>
                    <Grid item xs={12} md={3}>
                      <Typography gutterBottom variant="subtitle2" component="h2">
                        {room.name}
                      </Typography>
                      <Typography gutterBottom variant="body2" color="text.secondary">
                        Adults: {room.occupancy.maxAdults}
                      </Typography>
                      <Typography gutterBottom variant="body2" color="text.secondary">
                        Children: {room.occupancy.maxChildren}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} md={9}>
                      <Typography variant="body2">{room.longDescription}</Typography>
                    </Grid>
                  </Grid>
                </Fragment>
              ))
            ) : (
              <>
                <Divider />
                <Grid container spacing={2} py={2}>
                  <Grid item>
                    <Typography gutterBottom variant="body2" color="text.secondary">
                      There are no rooms available based on the room capacity you have selected.
                    </Typography>
                  </Grid>
                </Grid>
              </>
            )}
          </Paper>
        ))}
      </Container>
    </>
  );
};

export const getStaticProps: GetStaticProps = async () => {
  const hotelsData = await getHotelsData();
  return {
    props: {
      hotelsData,
    },
  };
};

export default Home;
