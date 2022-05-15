const { tagmanager } = require("@googleapis/tagmanager");
const { readFileSync } = require("fs");
const { GoogleAuth, JWT } = require("google-auth-library");
const path = require("path");
const { google } = require("googleapis");

process.env.GOOGLE_APPLICATION_CREDENTIALS = path.join(
  __dirname,
  "credentials.json"
);

async function main() {
  const auth = new google.auth.GoogleAuth({
    scopes: [
      "https://www.googleapis.com/auth/tagmanager.edit.containers",
      "https://www.googleapis.com/auth/tagmanager.manage.accounts",
      "https://www.googleapis.com/auth/tagmanager.readonly",
    ],
  });

  const gtm = google.tagmanager({
    version: "v2",
    auth: await auth.getClient(),
  });

  try {
    // const res = await gtm.accounts.list({
    //   auth: client,
    // });

    const account = (await gtm.accounts.list({})).data.account[0];

    const container = (
      await gtm.accounts.containers.list({
        parent: account.path,
      })
    ).data.container[0];

    const workspace = (
      await gtm.accounts.containers.workspaces.list({
        parent: container.path,
      })
    ).data.workspace[0];

    const tagTemplate = readFileSync(
      path.join(__dirname, "tags/test.html"),
      "utf8"
    );

    const tag = (
      await gtm.accounts.containers.workspaces.tags.list({
        parent: workspace.path,
      })
    ).data.tag;

    console.log(tag[1]);

    // const tag = (
    //   await gtm.accounts.containers.workspaces.tags.create({
    //     parent: workspace.path,
    //     requestBody: {
    //       tagId: "test-tag-id",
    //       consentSettings: {
    //         consentStatus: "notSet",
    //       },
    //       monitoringMetadata: { type: "map" },
    //       type: "html",
    //       name: "Test from Script",
    //       parameter: [
    //         {
    //           type: "template",
    //           key: "html",
    //           value: tagTemplate,
    //         },
    //         { type: "boolean", key: "supportDocumentWrite", value: "false" },
    //       ],
    //       tagFiringOption: "oncePerEvent",
    //     },
    //   })
    // ).data;
  } catch (e) {
    console.log("ERROR");
    console.log(e);
  }
}

main();
