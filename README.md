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
- Web: Start the web frontend with `yarn start:web`.
- Android: Start the android native app with `yarn start:android`.

For more detailed documentation, check out the docs directory.