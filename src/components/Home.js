import React from "react";
import VerifyNft from "./VerifyNft";

function Home() {
  let props = {
    userWalletAddress: "0xc37dbfaea001fcdf",
    contractAddress: "A.329feb3ab062d289.RaceDay_NFT",
  };

  return (
    <>
      <div>Home</div>
      <VerifyNft {...props} />
    </>
  );
}

export default Home;
