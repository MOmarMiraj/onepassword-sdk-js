const { clientAuthConfig, createClientWithCore } = require("../dist/client_util.js");
const { TestCore } = require("./test_core");
const { type } = require("os");

test("the right configuration is created", () => {
  const config = clientAuthConfig({
    auth: "ops_...",
    integrationName: "Test app",
    integrationVersion: "v1",
  });

  expect(config.serviceAccountToken).toBe("ops_...");
  expect(config.integrationName).toBe("Test app");
  expect(config.integrationVersion).toBe("v1");
  expect(config.requestLibraryName).toBe("Fetch API");
  expect(config.requestLibraryVersion).toBe("Fetch API");
  expect(config.programmingLanguage).toBe("JS");
  expect(config.sdkVersion).toBe("0010001");
  expect(config.os).toBe(type());
  expect(config.osVersion).toBe("0.0.0");
  expect(config.architecture).toContain("64");
});

test("authenticated client resolves secrets correctly", () => {
  const core = new TestCore();
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
