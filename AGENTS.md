## API & Testing Rules
- Never call `apiClient` directly; always use `useApiFetch` or `useApiMutation`.
- Do not hardcode error messages in web components or screens when errors come from `useApiFetch` or `useApiMutation`, as those hooks handle error display/reporting themselves.
- Never add tests under `apps/native`.