import sdk from "@1password/sdk";

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function run() {
  const myceliumConfig = {
    reconnectToken: "kd0bBAvZK6-yspLyKmybpw",
    myceliumKeys: {
      psk: "1P2LOvJ3u-JFE1AmkECZ_KfD6_dRsdHmDHUYpF_L9O4",
      localKeypair:
        "QVC2FzHtUEh_lEb_yLr0_tYlXQVJUfWL7AGJsMzwTqjaBm_k4IqkFJm08YWVAop822LjVxpXfMbqzuwx62OwLQ",
      remotePubKey: "JdDROjT6aYSsB0d6rmkV-OT63JQv9_kBW0__NXYaOxI",
    },
    device: {
      accountUrl: "https://momstestingcompany.b5test.com/",
      uuid: "5vsdxwtfpljh6urvkfpfpjveru",
      clientName: "1Password Extension",
      clientVersion: "81104027",
    },
  };

  const result = await sdk.getForWebsite("autofill.me", myceliumConfig);
  if (result.response.type === "success") {
    const item = JSON.parse(result.response.value);
    console.log(`The first item is: ${item}`);
  } else {
    console.log("mycelium channel failed to send the message.");
  }
  console.log(`The bundle is ${result.last_reconnect_bundle}`);
  await delay(5000);

  const nextresult = await sdk.getForWebsite(
    "www.aircanada.com",
    result.last_reconnect_bundle,
  );
  if (nextresult.response.type === "success") {
    const item = JSON.parse(nextresult.response.value);
    console.log(`The first item is: ${item}`);
  } else {
    console.log("mycelium channel failed to send the message.");
  }

  await delay(5000);

  const lastresult = await sdk.getForWebsite(
    "www.delta.com",
    nextresult.last_reconnect_bundle,
  );
  if (lastresult.response.type === "success") {
    const item = JSON.parse(lastresult.response.value);
    console.log(`The first item is: ${item}`);
  } else {
    console.log("mycelium channel failed to send the message.");
  }

  const jsonString = JSON.stringify(lastresult, null, 2);
  console.log(jsonString);
  await fs.writeFile("next_keys.json", jsonString, "utf-8");
  console.log("File saved successfully");
}

run().catch((err) => {
  console.error("Error:", err);
});
