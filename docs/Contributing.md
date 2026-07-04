# Contributing
Thank you for your interest in contributing to Northern Explorer! Whether you are helping with the map interface, backend performance, or adding new historic site data, your contributions help keep the project alive.

## How to Contribute
### Reporting Issues
Before opening a new issue, please search the existing issues to see if it has already been reported. If you are reporting a bug:
- Include steps to reproduce the issue.
- Provide information about your environment (OS, Node version).
- If it is related to the map or UI, include a screenshot if possible.

### Pull Requests
- Fork the repository and create your branch from main.
- Make your changes in a clear, atomic commit.
- If you add new functionality, please ensure it follows the existing project structure:
- Backend: Add entities to apps/server/src/core/entities and ensure they are added to the migration flow.
- Shared Logic: Use packages in packages/ for reusable code, types, or tools.
- Run the build locally to ensure no regressions
- Open a Pull Request with a clear description of the problem solved or the feature added.

### Development Workflow
- Migrations: If your change modifies the database schema, you must update the migrationsRegistry and run the migration service (yarn start in apps/migrate) before submitting.
- Dependencies: Please avoid adding new dependencies unless absolutely necessary.
- Types: Strictly adhere to the existing TypeScript setup. No any types allowed.

### Style Guide
- Keep code clean and consistent with existing patterns.

### Getting Help
- If you are stuck, feel free to open a "Draft" PR to get early feedback from the maintainers.