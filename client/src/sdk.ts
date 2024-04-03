import { SharedCore } from "./core.js";
import { ClientConfiguration } from "./configuration.js";
import { Client } from "./client.js";
import { createClientWithCore } from "./client_builder.js";

export const DEFAULT_INTEGRATION_NAME = "Unknown";
export const DEFAULT_INTEGRATION_VERSION = "Unknown";

export * from "./client.js";

/**
 * Creates a default 1Password SDK client.
 * @returns The authenticated 1Password SDK client.
 */
export const createClient = async (
  config: ClientConfiguration,
): Promise<Client> => createClientWithCore(config, new SharedCore());
