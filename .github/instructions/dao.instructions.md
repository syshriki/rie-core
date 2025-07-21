---
applyTo: "src/db/daos/**/*"
---

- a Dao shoud never call another dao
- The last parameters in the dao function should always be a transaction object (postgres.Sql)
- A dao should only ever contain type casting logic, 
- the function name of the dao should exclusively start with one of the following: fetch, update, insert, delete, count
- created_at dates should always be set to the current date
- When inserting there is no need to write every field into the query. the Postgresjs library simply allows us to pass in an object and it will insert all the fields that are not null.
- Do not cast to/from snake case in the query, the Postgresjs library does this automatically.
- When only expecting a single result make the type <X> | undefined, not <X> | null