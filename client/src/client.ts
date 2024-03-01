import * as os from "os";
import { SecretsAPI, SecretsSource } from "./secrets.js";
import { ClientAuthConfig, Core, SharedCore } from "./core.js";
import { ClientConfiguration, InnerClient } from "./configuration.js";

export const DEFAULT_INTEGRATION_NAME = "Unknown";
export const DEFAULT_INTEGRATION_VERSION = "Unknown";

const LANGUAGE = "JS";
const VERSION = "0010001"; // v0.1.0

const finalizationRegistry = new FinalizationRegistry(
  (heldClient: InnerClient) => {
    heldClient.core.releaseClient(heldClient.id);
  },
);

/**
 * Creates a default 1Password SDK client.
 * @returns The authenticated 1Password SDK client.
 */
export async function createClient(
  config: ClientConfiguration,
): Promise<Client> {
  return createClientWithCore(config, new SharedCore());
}

// Creates a 1Password SDK client with a given core implementation.
async function createClientWithCore(
  config: ClientConfiguration,
  core: Core,
): Promise<Client> {
  const authConfig = createClientAuthConfig(config);
  const clientID = await core.initClient(authConfig);
  const inner: InnerClient = {
    id: parseInt(clientID, 10),
    core,
  };
  const client = new Client(inner);
  // Cleans up associated memory from core when client instance goes out of scope.
  finalizationRegistry.register(client, inner);
  return client;
}

// Client represents a client instance of the SDK.
export class Client {
  public secrets: SecretsAPI;

  public constructor(innerClient: InnerClient) {
    this.secrets = new SecretsSource(innerClient);
  }
}

function createClientAuthConfig(
  userConfig: ClientConfiguration,
): ClientAuthConfig {
  // TODO: Add logic for computing the correct sanitized version value for each platform
  const defaultOsVersion = "0.0.0";
  return {
    serviceAccountToken: userConfig.auth,
    programmingLanguage: LANGUAGE,
    sdkVersion: VERSION,
    integrationName: userConfig.integrationName,
    integrationVersion: userConfig.integrationVersion,
    requestLibraryName: "Fetch API",
    requestLibraryVersion: "Fetch API",
    // Only supported on Node.js
    os: os.type(),
    osVersion: defaultOsVersion,
    architecture: os.arch(),
  };
}
