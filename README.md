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
