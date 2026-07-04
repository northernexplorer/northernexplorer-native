# Scripts
Use these commands to build the individual components for production or testing.

## Dev
- `dev:setup`: Performs initial system configuration. This script is designedto run on Debian systems. It installs packages. Look at the script in `dev/setup.sh` before running it.
- `dev:start`: Streamlines the process of opening your development environment by automatically spawning tabs in Yakuake, navigating to the correct directories, and triggering the necessary build/start commands.
- `dev:organize`: This script enforces repository consistency and cleans up the workspace. It should be run periodically to ensure that all packages remain synchronized and formatted correctly.

## Start
- `start:migrate`: Runs the migration service, to update your postgres db with the latest schema
- `start:server`: Starts backend server.
- `start:web`: Starts expo and opens web
- `start:android`: Stars expo and opens the android emulator

## Quality Assurance & Maintenance
- `test:lint`: Runs ESLint across the entire project.
- `test:format`: Checks for code formatting issues using Prettier.
- `test:types`: Performs a full TypeScript build (tsc) to verify type safety across workspaces.
- `test:deps`: Runs depcheck to identify unused dependencies, ignoring development-only tooling.
