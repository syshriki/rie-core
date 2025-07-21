---
applyTo: "src/controllers/**/*"
---

1. Testing
    - Whenever there is a change to controllers the tests must be updated to properly test against the new functionality. This can involve introducing tests, removing tests or modifying tests.

2. Structure
    - If the route has any input it should be validated using zod schemas and stored as a sibling to the controller with the filename schema.ts. for validating requestBody, requestParams, or requestQuery. Name the schema and export an infered type for the schema. The naming should be something like `createRecipeBody` for a request body schema on the POST /recipe controller... Similar for the query parameters and url parameters. First line in the controller should be a cast from the request to the schema type, e.g. `const recipeData = ctx.sanitizedRequest.body as CreateRecipeBody;`