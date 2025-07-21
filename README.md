# Frontend Interview Task: User Table

## Description

Your task is to implement a responsive and user-friendly table component that displays user data fetched from a public API.

## Requirements

1. **Data Source**

   - Fetch user data from the [JSONPlaceholder Users API](https://jsonplaceholder.typicode.com/users).
   - (You can suggest a different public API if you prefer, but the structure must be similar.)

2. **Table Features**

   - Display the fetched users in a table with at least the following columns: `name`, `email`, and any others you find relevant.
   - The table must have pagination.

3. **Filtering**

   - Add filters for the `email` and `name` columns.
   - Filtering should be performed by sending queries to the API, e.g. `/users?email=*` (the API supports exact matches, but it’s fine for this task).
   - Filters should use a debounced state to avoid firing requests on every keystroke.

4. **URL Synchronization**

   - Pagination and filter state must be synchronized with the URL (e.g. using query parameters).
   - Filters and pagination should persist when the page is reloaded.

5. **UI/UX**

   - Add skeleton loaders for the table (not just a spinner or “…”) while loading.
   - The table should be neat and have a responsive/adaptive layout.
   - Table header and the first column should use `position: sticky` to remain visible when scrolling.

6. **Performance**
   - Optimize the table rendering using techniques such as `useCallback` and `useMemo` where appropriate.
