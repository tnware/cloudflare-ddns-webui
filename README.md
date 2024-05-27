# Cloudflare DDNS WebUI 🚀

[![Docker](https://img.shields.io/badge/Docker-🐳-blue?logo=docker)](https://docker.com/)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-1.20.4-orange?logo=svelte)](https://svelte.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![SQLite](https://img.shields.io/badge/SQLite-3-<COLOR>?logo=sqlite)](https://www.sqlite.org/index.html)
[![Node.js](https://img.shields.io/badge/Node.js-16.14.2-green?logo=node.js)](https://nodejs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.2-teal?logo=tailwind-css)](https://tailwindcss.com/)
[![Axios](https://img.shields.io/badge/Axios-1.4.0-purple?logo=axios)](https://axios-http.com/)

> 🌟 Not another Cloudflare Dynamic DNS Updater 🌟

🌐 Node.js Web User Interface for keeping Cloudflare DNS records up to date with Dynamic WAN IPs

🔨 Proudly built with SvelteKit 🛠️

# Update - 5-27-2024

I have made some questionable design decisions throughout this project, most of which should be remedied easily, but to be fully tansparent, I have no idea what I'm doing with this project anymore. I was attempting to use sveltekit as both the frontend and the backend, which has proven "possible", but I'm not fully happy with my path and where it's taken me.

If you still feel compelled to run this project, I won't stop you, but here are some things to know:

- the app doesn't care about IPv6
  - doesn't care to figure out how to use it, and may break things in trying (same tbh)

- after `npm -i`, you should run `npx knex migrate:latest`
  - the docker container will likely not have a database unless you do this yourself

- i've tried more npm sqlite packages than I care to admit, and I think knex is fine, but by this point I'm completely sick and tired of re-writing the internal API to interact with the sqlite db. This area will not be very pretty.

- the very first load of the frontend *will fail*. the app will crash (due to decisions I made involving the lifecycle of the database, and at which point it's populated versus trying to read the data that should be populated)

  - a second execution of `npm run dev` should work fine.

- you'd need to add a zone on the "zones" page before anything works.

  - make sure to populate a `.env` according to the `.env.example` first

  - once the zone is added, you'd also need to "update records" for that zone

  - then, all the things happen in the "records" page, where you can toggle on/off auto-updating an IP for a record

- further configuration is done in the settings page
  - most of these properties are functional

- you can also see some logging on the logging page, but there was not enough thought put into the logging process, as to what gets logged, or how it's displayed, or if it would just grow enormously and fill up your server

- above all, feel free to contribute. I'd be happy to collaborate with others on this project; but for my own purposes, i've lost motivation ):

# So

This is basically what the app does... (sometimes I wonder if I should have just written a wrapper for someone else's project.)

```
Using providers:
https://api.ipify.org?format=json
Determiend Public IP Address: 1.2.3.4
Public IP Hasn't changed for object www.example.com
```

and

```
Using providers:
https://api.ipify.org?format=json
Determiend Public IP Address: 1.2.3.4
Public IP Changed! object: www2.example.com
{
  id: '68a1def18f8ad126e112228e82fb17f4',
  content: '4.5.6.7',
  name: 'www2.example.com',
  type: 'A',
  modified_on: '2023-07-16T21:21:01.890672Z',
  zone_name: 'example.com',
  zone_id: '2abf9ec05bbca57cd00dd6f5a123ceb4',
  enabled: 1
}
```

But, it has a sveltekit, server-side rendered frontend, and uses local sqlite database  **in attempt** to provide an enhanced user experience (when compared to cli-based or config-file based alternative cloudflare ddns update solutions)

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [Local Install](#local-installation)
  - [Docker](#docker)
  - [Development Server](#development-server)
- [Docker](#docker)
- [Contributing](#contributing)
- [License](#license)

## Features ✨

- Check your public IP address against multiple API providers
- Configure polling schedule through the user interface
  - Support for custom intervals using cron syntax
- Easily configure zones via the user interface
- Import records from zones using the user interface
- Multiple zone support for managing records across different DNS zones (scoped to your API key)
- Quickly enable or disable individual records for updating when your IP changes

## Installation

Follow these basic steps to get the project ready. You don't need to run `npm install` if you will be using Docker.

```shell
# Clone the repository
git clone https://github.com/tnware/cloudflare-ddns-gui.git

# Navigate to the project directory
cd cloudflare-ddns-gui

# Install dependencies
# Skip this step for Docker only
npm install
```

Next, create a file .env in the project root.

There is a provided .env.example, so you can just rename that and fill in your details.

If you do not have a Cloudflare API key, please [create one](https://dash.cloudflare.com/profile/api-tokens).

```bash
# .env
SECRET_CLOUDFLARE_AUTH="Bearer auth_token_here"
SECRET_CLOUDFLARE_EMAIL="name@example.com"
```

Now you can run the app or start developing.

- [Local Install](#local-installation)
- [Docker](#docker)
- [Development Server](#development-server)

---

### Local Installation

First, complete the [installation steps](#installation).

To run locally (i.e. you have node and npm binaries installed on your host)

Make sure your node version is at least 16.14.2 (SvelteKit minimum) and that you've created the .env file above.

```shell
# Build the project
npm run build

# Run the build for production
node build

# Output from the Node.js server
> Server started.
> Listening on 0.0.0.0:3000
```

---

### Docker

First, complete the [installation steps](#installation).

To build and run the docker container, navigate to the project root in your terminal and run the following commands:

1. Build the container

```docker
docker build . -t cloudflare-ddns-gui
```

2. Run the container

```docker
docker run -p 3000:3000 -d cloudflare-ddns-gui
```

---

### Development Server

First, complete the [installation steps](#installation).

To run the dev server without building the app:

```bash
# Start the development server
npm run dev
```

---

## Contributing

Contribution guidelines are not fully established. Some general guidelines should always be followed, though:

If you would like to contribute to this project, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature/bug fix.
3. Make your changes and commit them with descriptive messages.
4. Push your changes to your forked repository.
5. Submit a pull request, clearly describing your changes.

## License

This project is licensed under the [MIT License](LICENSE).
