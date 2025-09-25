import sdk from "@1password/sdk";

let myceliumConfig = {
  reconnectToken: "token",
  myceliumKeys: {
    psk: "psk",
    localKeypair: "key-pair",
    remotePubKey: "pubkey",
  },
  signInAddress: "sign-in-address",
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
  await getWebsite("www.aircanada.com");
  await getWebsite("https://www.autofill.me");
  await getWebsite("www.fakewebsite.me");
  await getWebsite("autofill.me");
}

run().catch((err) => {
  console.error("Error:", err);
});
