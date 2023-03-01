import React, { useState } from "react";
import VerifyNft from "./VerifyNft";
import QrReader from "react-qr-reader";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";

function Home() {
  const [startScan, setStartScan] = useState(false);
  const [data, setData] = useState("");
  const [contractAdd, setContractAdd] = useState();

  const handleScan = async (scanData) => {
    if (scanData && scanData !== "") {
      // console.log(`loaded >>>`, scanData);
      setData(scanData);
      setStartScan(false);

      // setPrecScan(scanData);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  return (
    <>
      <Container
        disableGutters
        maxWidth="sm"
        component="main"
        sx={{ pt: 8, pb: 6 }}
      >
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="text.primary"
          gutterBottom
        >
          Introducing Token Gating on Flow
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="text.secondary"
          component="p"
        >
          Accese events and meetups with NFTs as your tickets. No wallet connect
          required!
        </Typography>
      </Container>

      <Container maxWidth="sm" sx={{ pb: 6 }} align="center">
        <Box
          component="form"
          sx={{
            "& .MuiTextField-root": { m: 1, width: "35ch" },
          }}
          noValidate
          autoComplete="off"
        >
          <div>
            <TextField
              id="outlined-required"
              label="Enter NFT Contract Address"
              placeholder="A.329feb3ab062d289.RaceDay_NFT"
              onChange={(e) => setContractAdd(e.target.value)}
            />
          </div>
        </Box>
        <div className="Button" style={{ paddingTop: 5, paddingBottom: 6 }}>
          <Button
            variant="outlined"
            onClick={() => {
              setStartScan(!startScan);
            }}
          >
            {startScan ? "Stop Scan" : "Start Scan"}
          </Button>
        </div>
        {startScan && (
          <>
            <QrReader
              delay={1000}
              onError={handleError}
              onScan={handleScan}
              style={{ width: "300px" }}
            />
          </>
        )}

        {data !== "" && <p>User Wallet Address: {data}</p>}

        {/* <p>{data}</p> */}
        {data !== "" && (
          <VerifyNft
            {...{
              userWalletAddress: data,
              contractAddress: contractAdd,
            }}
          />
        )}
      </Container>
    </>
  );
}

export default Home;
