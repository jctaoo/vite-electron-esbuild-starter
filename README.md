# ⚡️ vite electron esbuild starter

![⚡️](./demo.gif)

[Chinese](./README_CN.md)

The electron project stater using vite for renderer process and esbuild / tsc for main process.

React demo with antd is available here (Automatic style introduction has been configured. Vite supports on-demand loading by default): [antd branch](https://github.com/jctaoo/electron-starter/tree/antd)

Note: CSC_IDENTITY_AUTO_DISCOVERY is set to false by default to avoid the codesign operation in packaging macos (learn more: [codesign](https://www.electron.build/code-signing))

## Usage

Create a Project:

- Clone this project directly.
- If you use GitHub, click Use this template at the top of the page or [here](https://github.com/jctaoo/electron-starter/generate) (do not check include all branch)

Installation dependencies

```shell
yarn
```
Start local development
```shell
# Use esbuild to compile the main process Typescript, which is faster
yarn run dev

# Use tsc to compile the main process Typescript
yarn run dev:tsc
```

You can also use `dev:main`, `dev:main:tsc`, and `dev:renderer` separately to debug the main process and the rendering process separately.

Compile/Pack

```shell
# Only build the target code and resources of the main process and the rendering process, without packaging (exe, dmg, etc.)
yarn run build

# Preview your application in production mode without pack.
yarn run preview

# Build and pack as a runnable program or installer
yarn run pack:win
yarn run pack:mac
yarn run pack:linux

# Pack for all platforms
yarn run pack # Exclude mac platform, applicable to linux & win
yarn run pack:all
```

Clean up the build directory

```shell
yarn run clean
```

## Screenshot

![screenshot](./screenshot.png)

## File structure

Use [two-package-structure](https://www.electron.build/tutorials/two-package-structure)

```
+ app                     electron-builder app directory and its build product directory (target js code, image resources, etc., instead of installation packages or executable files)
  - package.json          Production dependencies, all stored as dependencies (not devDependencies)
+ dist                    electron-builder package directory
+ scripts                 Support scripts for development/build.
+ src      
  + common                common code
  + main                  for main process
  + renderer              for renderer process
- package.json            Dependencies during development, all stored as devDependencies (not dependencies)
- vite.config.ts          vite configurations
- electron-builder.yml    electron-builder configurations
```
