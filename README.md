<div align="center">
  <a target="_blank" href=""><img src="https://img.shields.io/github/contributors/deskproapps/Bubble365.svg?style=for-the-badge" alt="Contributors" /></a>
  <a target="_blank" href="https://github.com/deskproapps/Bubble365/issues"><img src="https://img.shields.io/github/issues/deskproapps/Bubble365.svg?style=for-the-badge" alt="Issues" /></a>
  <a target="_blank" href="https://github.com/deskproapps/Bubble365/releases"><img src="https://img.shields.io/github/v/release/deskproapps/Bubble365?style=for-the-badge" alt="GitHub Release" /></a>

</div>

<div align="center">
  <img src="icon.svg" width="256" height="256">

  <h1>Bubble365-Deskpro</h1>
  <p></p>
  <a href="https://wiki.redcactus.cloud/en/crm-software/Deskpro-embedded" target="_blank">Bubble wiki page</a>
  <span>&nbsp;&nbsp;•&nbsp;&nbsp;</span>
  <a href="./SETUP.md" target="_blank">App Setup Guide</a>
  <br />
  <hr />
  <br />
</div>

## **About the app**
With the Bubble365 Embedded CRM App, you experience the power of the Bubble integration tool, fully integrated within your CRM environment.
The Bubble365 Embedded CRM App is compatible with 90+ telephony platforms.
If your telephony platform supports Call Control, you can manage your softphone or connected desk phone directly from the CRM, with features such as taking calls, transferring calls, putting calls on hold, and hanging up.
The app provides a seamless user experience and increases productivity by bringing all communication and CRM functionalities together in one interface.

**Pop-up Notification**: Instantly see all customer information on incoming, outgoing, and transferred calls.

**SearchBar**: Search directly in Deskpro contacts, open a customer card or send a message.

**Call Logging**: Automatic capture of call information directly into your Deskpro under the customer card.

**Conversation Note**: Take notes immediately so that all information is visible to your colleagues within Deskpro.

**Call History**: Instantly see when and which colleagues the caller has previously spoken to.

## **Setting up the app in Deskpro**
You can follow our [wiki guide](https://wiki.redcactus.cloud/en/crm-software/Deskpro-embedded) for a step-by-step guide to setting up the app in Deskpro.

## Development
This app was developed primarily using **TypeScript**, **React**, and **Vite**.

#### Setup
To run this project locally:

 ```bash
# Clone the repository
git clone https://github.com/DeskproApps/Bubble365.git

# Change to the project directory
cd Bubble365

# Install dependencies
pnpm install

# Run the development server.
pnpm start
```

You should now be able to view the app in your browser. For more information about developing [Deskpro apps](https://www.deskpro.com/apps), [Visit the docs](https://support.deskpro.com/ga/guides/developers/anatomy-of-an-app).

### Testing
We've included `jest` to run tests. It will look anywhere in `/src` for test suite files ending in `.test.tsx` or `.test.ts`.

You can run all tests using:

```bash
pnpm test
```

## Versioning
Every app deployment requires that the version property in the `manifest.json` file be updated to reflect the new app version. This is so Deskpro can detect changes and add/upgrade apps accordingly. As such, we've made altering versions easy by having CI make the actual version change for you. Here's what we do:

* We increment patch versions, i.e. 1.0.1, automatically. You don't need to do anything and this will happen
* Minor versions, i.e. 1.1.0, are incremented if you add the minor-version GitHub label to your PR
* Major versions, i.e. 2.0.0, are incremented if you add the major-version GitHub label to your PR

## Top contributors
[![Contributors](https://contrib.rocks/image?repo=deskproapps/Bubble365)](https://github.com/deskproapps/Bubble365/graphs/contributors)
