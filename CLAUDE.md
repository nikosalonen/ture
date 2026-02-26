# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Kap is an open-source macOS screen recorder built with Electron, React, Next.js, and TypeScript. It captures screen recordings via the Aperture framework and converts them to various formats (MP4, WebM, GIF, APNG, AV1, HEVC) using FFmpeg.

## Commands

```bash
pnpm start          # Compile TypeScript + launch Electron app (development)
pnpm dev            # Run Next.js dev server for renderer only
pnpm lint           # Run XO linter
pnpm lint:fix       # Auto-fix lint issues
pnpm test           # Run lint + tests
pnpm test:main      # Run AVA tests only
pnpm build          # Compile main process (tsc) + build renderer (next build + export)
pnpm dist           # Build + create distributable DMG
```

Run a single test file: `TS_NODE_PROJECT=test/tsconfig.json pnpm exec ava test/<file>.ts`

## Architecture

### Electron Two-Process Model

- **Main process** (`main/`): Node.js backend compiled via `tsc` to `dist-js/`. Entry point: `main/index.ts`.
- **Renderer process** (`renderer/`): Next.js 14 + React 18 app, statically exported to `renderer/out/`. Pages: `_app.tsx`, `editor.tsx`, `exports.tsx`.

### IPC and State Synchronization (Remote States)

Main and renderer communicate via a custom "Remote State" pattern built on `electron-better-ipc`:
- Main side: `main/remote-states/` — each file defines state + actions, uses `setup-remote-state.ts` to broadcast changes
- Renderer side: `renderer/hooks/use-remote-state.tsx` — creates React hooks that subscribe to main process state
- Remote states: `exports`, `editor-options`, `exports-list`

### Recording Flow

1. `main/windows/cropper.ts` — user selects screen area
2. `main/aperture.ts` — controls macOS screen capture (start/stop/pause/resume)
3. `main/video.ts` — wraps recorded file metadata, opens editor
4. `main/conversion.ts` — orchestrates format conversion via FFmpeg
5. `main/export.ts` — handles sharing through plugins

### Plugin System

- `main/plugins/plugin.ts` — plugin definition and loading
- `main/plugins/index.ts` — plugin manager (install/uninstall/upgrade)
- `main/plugins/service.ts` — service interface with lifecycle hooks (`willStartRecording`, `didStopRecording`, etc.)
- `main/plugins/built-in/` — built-in plugins: copy-to-clipboard, save-to-disk, open-with

### Window Management

`main/windows/manager.ts` exports a singleton `windowManager` with typed managers for each window type (cropper, editor, exports, preferences, config, dialog).

### Settings

`electron-store` with JSON schema validation in `main/common/settings.ts`.

## Code Style

- **Linter**: XO (opinionated ESLint wrapper) with `xo-react` and `xo-typescript` extensions
- **Indentation**: 2 spaces
- **TypeScript**: Strict mode in main process (extends `@sindresorhus/tsconfig`), relaxed in renderer
- **Husky pre-commit/pre-push hooks** run `pnpm lint`

## Testing

- **Framework**: AVA with `ts-node` and `module-alias` for mocking Electron
- Tests are in `test/`, with helpers in `test/helpers/` and mocks in `test/mocks/`
- Electron modules are mocked via `module-alias` (`_moduleAliases` in package.json maps `electron` to `test/mocks/electron.ts`)
- Tests primarily cover video conversion formats and recording history

## TypeScript Configuration

Three separate tsconfig files:
- Root `tsconfig.json`: compiles `main/` to ES2019 CommonJS in `dist-js/`
- `renderer/tsconfig.json`: Next.js config with path aliases (`utils/*`, `components/*`, `containers/*`, `hooks/*`, `common/*`, `vectors`)
- `test/tsconfig.json`: test-specific config

## Key Dependencies

- `aperture` — macOS screen recording
- `ffmpeg-static` — bundled FFmpeg for conversion
- `electron-better-ipc` — typed IPC
- `unstated` / `unstated-next` — lightweight state containers in renderer
- `mac-screen-capture-permissions`, `macos-audio-devices`, `mac-windows` — native macOS integrations
