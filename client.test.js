import { createClientAuthConfig, createClientWithCore } from "./src/client";
import { TestCore } from "./src/core";

test("the right configuration is created", () => {
  const config = createClientAuthConfig({
    auth: "ops_...",
    integrationName: "Test app",
    integrationVersion: "v1",
  });

  expect(config.serviceAccountToken).toBe("ops_...");
  expect(config.integrationName).toBe("Test app");
  expect(config.integrationVersion).toBe("v1");
  expect(config.requestLibraryName).toBe("TBD");
  expect(config.requestLibraryVersion).toBe("TBD");
  expect(config.programmingLanguage).toBe("JS");
  expect(config.sdkVersion).toBe("0010001");
  expect(config.os).toBe("Darwin");
  expect(config.osVersion).toContain("Version");
  expect(config.architecture).toContain("64");
});

test("authenticated client resolves secrets correctly", () => {
  const core = new TestCore(0);
  createClientWithCore(
    {
      auth: "test token",
      integrationName: "test integration",
      integrationVersion: "test integration",
    },
    core,
  ).then((client) => {
    expect(client.secrets).toBeDefined();
    expect(core.id).toBe(1);
    client.secrets.resolve("secret_ref").then((secret) => {
      expect(secret).toBe(
        "method Resolve called on client 0 with parameters secret_ref",
      );
    });
  });
});
