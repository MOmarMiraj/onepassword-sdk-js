import {
  invoke,
} from "@1password/sdk-core";

import { ReplacerFunc } from "./types";
import { throwError } from "./errors";

// In empirical tests, we determined that maximum message size that can cross the FFI boundary
// is ~64MB. Past this limit, the wasm-bingen FFI will throw an error and the program will crash.
// We set the limit to 50MB to be safe, to be reconsidered upon further testing.
const messageLimit = 50 * 1024 * 1024;

/**
 *  Exposes the SDK core to the host JS SDK.
 */
export interface Core {
  /**
   *  Calls async business logic from a given client and returns the result.
   */
  invoke(config: InvokeConfig, last_reconnect_bundle: MyceliumConfig): Promise<string>;

}

/**
 *  Wraps configuration information needed to allocate and authenticate a client instance and sends it to the SDK core.
 */
 export interface MyceliumConfig {
   /** Mycelium reconnect token */
   reconnectToken: string;

   /** The credential bundle used to authenticate with mycelium channel. */
   myceliumKeys: MyceliumKeys;

   /** Device info of the mycelium channel */
   device: MyceliumDevice;
 }

 export interface MyceliumKeys {
   /** Mycelium shared PSK */
   psk: string;

   /** Keypair of current device. */
   localKeypair: string;

   /**
    * Public key of other Mycelium party,
    * representing the user's 1Password account.
    */
   remotePubKey: string;
 }

 export interface MyceliumDevice {
   /** Account URL */
   accountUrl: string;

   /** The device UUID of the one starting the mycelium channel */
   deviceUuid: string; // assuming DeviceUuid is just a string

   /** Name of the client */
   clientName: string;

   /** Version of the client */
   clientVersion: string;
 }

/**
 *  Calls certain logic from the SDK core, with the given parameters.
 */
export interface Invocation {
  parameters: Parameters;
}
export interface Parameters {
  /**
   *  Functionality name
   */
  name: string;
  /**
   *  Parameters
   */
  parameters: { [key: string]: unknown };
}

/**
 *  An implementation of the `Core` interface that shares resources across all clients.
 */
export class SharedCore implements Core {

  public async invoke(config: InvokeConfig, last_reconnect_bundle: MyceliumConfig): Promise<string> {
    const serializedConfig = JSON.stringify(config, ReplacerFunc);
    const serializedReconnectBundle = JSON.stringify(last_reconnect_bundle, ReplacerFunc);
    try {
      return await invoke(serializedConfig,serializedReconnectBundle);
    } catch (e) {
      throwError(e as string);
    }
  }
}

/**
 *  Represents the client instance on which a call is made.
 */
export interface InnerClient {
  core: Core;
}
