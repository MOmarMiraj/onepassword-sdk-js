import sdk from "@1password/sdk";

let myceliumConfig = {
  myceliumKeys: {
    psk: "AZyfHIuGbOhPKrLkpuCPtaJ6HD28tt4hw0JSieFy5LU",
    localKeypair:
      "no-6QxAZLKdWN1SdUYmHjtit74kqz0-hzg8lRB3n5vlYvV5kkDEgfeSQDv9zuIXa8lxp0pweUWrjoXQrT1SBQQ",
    remotePubKey: "FXAjChqbEFR9MaM8PUymBL4FKsvf7seweRnAqZpoTlQ",
  },
  signInAddress: "https://aicanadapoc.b5dev.ca",
  reconnectToken: "PSIE1C7xiDREWB-ULZmZ9Q",
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
  console.log("Getting website for aircanada!");
  // await getWebsite("www.aircanada.com");
  await getWebsite("https://www.autofill.me");
  await getWebsite("www.autofill.me");
  await getWebsite("autofill.me");
}

run().catch((err) => {
  console.error("Error:", err);
});
