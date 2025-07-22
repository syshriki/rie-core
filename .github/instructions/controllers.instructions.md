---
applyTo: "src/controllers/**/*"
---

1. Testing
    - Whenever there is a change to controllers the tests must be updated to properly test against the new functionality. This can involve introducing tests, removing tests or modifying tests.

2. Input Validation + Coersion
    - If the route has any input it should be validated using zod schemas and stored as a sibling to the controller with the filename schema.ts. for validating requestBody, requestParams, or requestQuery. Name the schema and export an infered type for the schema. The naming should be something like `createRecipeBody` for a request body schema on the POST /recipe controller... Similar for the query parameters and url parameters. First line in the controller should be a cast from the request to the schema type, e.g. `const recipeData = ctx.sanitizedRequest.body as CreateRecipeBody;`
    - Use `z.coerce` for coercing types, such as converting strings to numbers or booleans. For example, `z.coerce.number().int().positive()` for a positive integer.

3. Default Input Values
    - If the input has a default value, it should be set in the zod schema. For example, if a query parameter has a default value of 10, it should be defined in the schema as `z.coerce.number().int().positive().default(10)`.