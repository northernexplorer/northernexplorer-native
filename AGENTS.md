## apps/web Rules

- Never call `apiClient` directly; always use `useApiFetch` or `useApiMutation`.
- Do not hardcode error messages in web components or screens when errors come from `useApiFetch` or `useApiMutation`, as those hooks handle error display/reporting themselves.
- Never place logic in /apps/native/src/app. This should only be the layout file.

## Testing Rules

- We only want tests for files in `apps/server`.
- Tests should always be placed beside the file they test.
