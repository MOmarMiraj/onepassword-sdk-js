import sdk from "@1password/sdk";

let myceliumConfig = {
  reconnectToken: "XnbQubMEv9DfkwZwwntpww",
  myceliumKeys: {
    psk: "gmfTCX6pp1_Rn7UWfHLDh2y1IqPLbgN7kdLNNpOhPeE",
    localKeypair:
      "sdB38zhFVOmIyiqSYlo36LN9358V5bmTk54p5ps9NmnuuJmZ_3OR28_c3KL5DP9NWe5W-zh8Ibij3bhj0sEmKg",
    remotePubKey: "9S8Pqc-q2d83fIJhJABC92k-fXtpXzcND42P86Go5yQ",
  },
  signInAddress: "https://momstestingcompany.b5test.com",
};

async function getWebsite(website) {
  const result = await sdk.getForWebsite(website, myceliumConfig);
  console.log(JSON.stringify(result));
  if (result.response.type === "success") {
    console.log(`The first item is: ${result.response.data.serializedItem}`);
  } else {
    console.log("mycelium channel failed to send the message.");
  }
  const jsonString = JSON.stringify(result.new_reconnect_bundle, null, 2);
  console.log(jsonString);
  myceliumConfig = result.new_reconnect_bundle;
}

async function run() {
  // console.log("Getting website for aircanada!");
  await getWebsite("www.aircanada.com");
  // await getWebsite("https://www.autofill.me");
  // await getWebsite("www.te.me");
  await getWebsite("autofill.me");
}

run().catch((err) => {
  console.error("Error:", err);
});
