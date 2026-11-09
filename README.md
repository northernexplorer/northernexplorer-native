# Northern Explorer
Northern Explorer is a data and mapping platform built for modern explorers. Combining real-time meteorological data with historical records, it helps you discover the history around you. From planning backcountry expeditions to verifying historical landmarks, Northern Explorer provides the tools to map the wild and uncover the stories hidden in the landscape.

## Technologies
- Backend: Node.js, Express, PostgreSQL
- ORM: MikroORM
- Frontend: React Native (Expo)
- Maps: MapLibre GL

## Setup
- Clone the repository and navigate into the folder.
- Run yarn install to install dependencies.
- Copy the `.env.default` to `.env` for each app. Fill with the correct info.

## Development
- Database: Run yarn start in the apps/migrate directory to apply schema updates using the internal migration service.
- Server: Start the backend with `yarn start:server`.
- Web: Start the web frontend with `yarn start:web` (port 7001).
- Android: Start the android native app with `yarn start:android` (port 7002).

## API CORS
The server allows `http://localhost:7001`, `https://northernexplorer.org`, and `https://www.northernexplorer.org` by default. Set the server's `CORS` environment variable to a comma-separated list to replace these defaults; only include trusted origins. If you configure `CORS` in production, include `https://www.northernexplorer.org` and redeploy or restart the API for the change to take effect.

For more detailed documentation, check out the docs directory.