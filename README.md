# Glyph Suite React App

This repository contains a React implementation of the Glyph Suite tool.

## Development

Install dependencies and start the development server:

```bash
npm install
npm run dev
```

## Production Build

To create a production build:

```bash
npm run build
```

The output will be placed in the `dist` directory.

## Codex Setup

When running in the Codex environment, dependencies must be installed during the
setup phase before network access is disabled. A setup script has been provided
in `.codex/setup.sh`:

```bash
./.codex/setup.sh
```

This script simply runs `npm install` so that subsequent build commands such as
`npm run build` succeed offline.
