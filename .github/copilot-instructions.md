# Coding Standards

Below is a partial list of coding standards that we follow when building software. These standards help us stay consistent across all of our projects and are designed to be easily referenced by team members and LLMs.

## Code Organization

- **Code Minimization:** Eliminate unnecessary code. Leverage existing libraries to their full potential, provided they don't overcomplicate the project.

- **Helper Functions:** Introduce helper functions only when significant logic or functionality is duplicated across multiple locations.

- **Controller Organization:** All endpoint code should be placed in controller files. Only move code to services when it's shared between multiple endpoints.
  ```javascript
  // ❌ Avoid: Moving endpoint-specific code to services
  // userService.js
  export const handleGetUserRequest = async (req, res) => {
    // Endpoint-specific logic that's only used in one place
  };
  
  // ✅ Better: Keep endpoint logic in controllers
  // userController.js
  export const getUser = async (req, res) => {
    // Endpoint-specific logic stays in the controller
  };
  
  // ✅ Good: Move shared functionality to services
  // userService.js
  export const validateUserData = async (userData) => {
    // Shared validation logic used by multiple endpoints
  };
  ```

- **Controller File Structure:** Implement only one controller per file. When multiple controllers serve the same entity type, create a dedicated folder in the controllers directory named after that entity.
  ```
  // ❌ Avoid: Multiple controllers in a single file
  // vesselControllers.js
  export const getAllVessels = async (req, res) => { /* ... */ };
  export const getVesselById = async (req, res) => { /* ... */ };
  export const createVessel = async (req, res) => { /* ... */ };
  export const updateVessel = async (req, res) => { /* ... */ };
  export const deleteVessel = async (req, res) => { /* ... */ };
  
  // ✅ Better: One controller per file in a dedicated folder
  // controllers/vessel/getAll.js
  export const getAllVessels = async (req, res) => { /* ... */ };
  
  // controllers/vessel/getOne.js
  export const getVesselById = async (req, res) => { /* ... */ };
  
  // controllers/vessel/create.js
  export const createVessel = async (req, res) => { /* ... */ };
  ```

- **Module Interface:** When a single-purpose module becomes too complex, split it into multiple files and use `index.js` to orchestrate these components into a cohesive operation:
  ```javascript
  // ❌ Avoid: Large monolithic files for complex operations
  // createUser.js
  export const createUser = async (userData) => {
    // Validation logic
    // Database operations
    // Email notifications
    // Logging
    // Error handling
    // ... many more lines of code
  };

  // ✅ Better: Split into focused component files
  // users/createUser/validation.js
  export const validateUserData = (userData) => { /* ... */ };
  
  // users/createUser/database.js
  export const saveUserToDatabase = async (validatedData) => { /* ... */ };
  
  // users/createUser/notification.js
  export const sendWelcomeEmail = async (user) => { /* ... */ };
  
  // users/createUser/index.js - orchestrates the entire operation
  import { validateUserData } from './validation';
  import { saveUserToDatabase } from './database';
  import { sendWelcomeEmail } from './notification';
  
  export const createUser = async (userData) => {
    const validData = validateUserData(userData);
    const user = await saveUserToDatabase(validData);
    await sendWelcomeEmail(user);
    return user;
  };
  
  // ❌ Avoid: Exposing all internal components in index.js
  // users/createUser/index.js
  export * from './validation';
  export * from './database';
  export * from './notification';
  // This exposes internal implementation details that should remain encapsulated
  ```

## Naming Conventions

- **Casing Conventions:** Use consistent casing patterns across the codebase:
  ```javascript
  // ✅ Good: camelCase for variables, functions, and file names (excluding tests)
  const userData = fetchUserProfile();
  function calculateTotalAmount() { /* ... */ }
  // File: userController.js, authMiddleware.js, dataHelper.js
  
  // ✅ Good: snake_case for SQL queries, but camelCase for output
  const query = `
    SELECT 
      user_id, 
      first_name, 
      last_name, 
      created_at 
    FROM users 
    WHERE status_code = 'active'
  `;
  
  // Transform SQL snake_case to camelCase in results, this is usually done by the postgres library transformer toCamelCase
  const users = results.map(user => ({
    userId: user.user_id,
    firstName: user.first_name,
    lastName: user.last_name,
    createdAt: user.created_at
  }));
  ```

- **Variable Name Scope:** Variable name length should correlate with its scope and usage. Larger scopes require more descriptive names:
  ```javascript
  // ❌ Avoid: Short names in large scopes
  const t = await Transaction.findById(id);  // What is 't'?
  const u = await getUser();  // Unclear in broader context
  
  // ❌ Avoid: Overly verbose names in tight scopes
  array.map(currentArrayElement => currentArrayElement.value);
  
  // ✅ Good: Descriptive names in larger scopes
  const userTransaction = await Transaction.findById(id);
  const activeUser = await getUser();
  
  // ✅ Good: Concise but clear names in small scopes
  items.map(item => item.value);
  users.filter(user => user.isActive);
  array.reduce((sum, num) => sum + num, 0);
  
  // ✅ Good: In very small scopes, single letters can be used when context is clear
  items.map(i => i.value);
  users.filter(u => u.isActive);
  
  // ❌ Avoid: Ambiguous single-letter names in complex operations
  data.filter(x => x.y.filter(z => z > 10));  // What are x, y, z?
  ```

- **Database Entity Naming:** When querying database entities, use names that directly reflect the entity:
  ```javascript
  // Single entity queries
  const edge = await Edge.findById(id);
  
  // Multiple entities of same type
  const sourceEdge = await Edge.findById(sourceId);
  const targetEdge = await Edge.findById(targetId);
  
  // Collections
  const edges = await Edge.find({ type: 'active' });
  ```

- **Data Access Method Naming:** Methods that interact with external data sources should be prefixed with action verbs that clearly indicate the operation type:
  ```javascript
  // ✅ Good: Clear verb prefixes indicate the operation type
  const fetchUserProfile = async (userId) => {
    return await api.get(`/users/${userId}`);
  };
  
  const updateUserPreferences = async (userId, preferences) => {
    return await api.put(`/users/${userId}/preferences`, preferences);
  };
  
  const deleteUserAccount = async (userId) => {
    return await api.delete(`/users/${userId}`);
  };
  
  const insertNewTransaction = async (transactionData) => {
    return await api.post('/transactions', transactionData);
  };
  
  // ✅ Good: Specify the search/filter criteria in the function name
  const fetchUserById = async (userId) => {
    return await api.get(`/users/${userId}`);
  };
  
  const fetchUsersByStatus = async (status) => {
    return await api.get('/users', { params: { status } });
  };
  
  // ❌ Avoid: Ambiguous criteria or missing criteria in function name
  const fetchUser = async (id) => { // Should be fetchUserById
    return await api.get(`/users/${id}`);
  };
  
  // ❌ Avoid: Ambiguous method names that don't indicate operation type
  const userProfile = async (userId) => {
    return await api.get(`/users/${userId}`);
  };
  
  // ❌ Avoid: Inconsistent naming patterns across related operations
  const getUser = async (userId) => { ... }; // Should be fetchUser
  const updateUser = async (userId, data) => { ... }; // Good
  const removeUser = async (userId) => { ... }; // Should be deleteUser
  const addUser = async (userData) => { ... }; // Should be insertUser
  ```

## Database Operations

- **Database Update Approaches:** Prefer complete record updates over dynamic, incremental queries when using SQL. Avoid conditionally building database queries when possible.
  ```javascript
  // ❌ Avoid: Complex conditional query building
  const updateUserPartially = async (userId, updates) => {
    let query = 'UPDATE users SET ';
    const setClauses = [];
    const values = [];
    
    if (updates.name) {
      setClauses.push('name = $' + (values.length + 1));
      values.push(updates.name);
    }
    if (updates.email) {
      setClauses.push('email = $' + (values.length + 1));
      values.push(updates.email);
    }
    // Many more conditionals...
    
    query += setClauses.join(', ') + ' WHERE id = $' + (values.length + 1);
    values.push(userId);
    
    return db.query(query, values);
  };
  
  // ✅ Better: Full object updates
  const updateUser = async (userId, userData) => {
    const query = `
      UPDATE users 
      SET name = $1, email = $2, role = $3, ...
      WHERE id = $4
    `;
    return db.query(query, [userData.name, userData.email, userData.role, ..., userId]);
  };
  ```

## Logging and Comments

- **Logging Usage:** Add logs purposefully, not unnecessarily. Timing logs should only be added to API calls and other performance-critical operations.
  ```javascript
  // ❌ Avoid: Unnecessary logging
  const simpleCalculation = (a, b) => {
    console.log('Starting calculation'); // Unnecessary
    const result = a + b;
    console.log('Calculation finished'); // Unnecessary
    return result;
  };
  
  // ✅ Good: Logging API calls with timing information
  const fetchExternalData = async (params) => {
    logger.info('Starting API call with params:', params);
    const startTime = performance.now();
    const result = await externalApi.fetch(params);
    logger.info(`API call completed in ${performance.now() - startTime}ms`);
    return result;
  };
  ```

- **Comments Usage:** Add comments only when clarifying non-obvious logic or implicit behavior. Code should be self-documenting through clear function and variable names:
  ```javascript
  // ❌ Avoid: Obvious comments that repeat what the code does
  // Loop through the users array
  users.forEach(user => {
    // Check if the user is active
    if (user.isActive) {
      // Add the user to the active users array
      activeUsers.push(user);
    }
  });
  
  // ❌ Avoid: Comments for simple, clear operations
  // Calculate the sum of numbers
  const sum = numbers.reduce((a, b) => a + b, 0);
  
  // ✅ Good: Comment explaining complex algorithm or domain-specific logic
  // Dijkstra's algorithm to find shortest path
  function findShortestPath(graph, start, end) {
    // ...algorithm implementation
  }
  
  // ✅ Good: Comment explaining non-obvious side effects or implicit behavior
  // This mutates the original object for performance reasons
  function optimizeRenderTree(sceneObject) {
    // ...implementation
  }
  
  // ✅ Good: Comment explaining why a specific approach was chosen
  // Using a lookup table instead of regex for better performance with large datasets
  const statusCodes = {
    active: 1,
    pending: 2,
    cancelled: 3
  };
  
  // ✅ Good: Explaining workarounds for external issues
  // Fix for browser inconsistency in Safari (see bug #1234)
  element.style.transform = 'translateZ(0)';
  
  // ✅ Good: TODO comments with clear action items and ownership
  // TODO(username): Refactor this algorithm once we upgrade to Node 18
  // TODO(username): Replace with the official API when it becomes available in Q2 2023
  // TODO(username): This is a temporary workaround - remove once issue #4321 is resolved
  
  // ❌ Avoid: Vague or unattributed TODO comments
  // TODO: Fix this
  // TODO: Make this better
  // TODO: Someone should improve this later
  ```

## Array and Data Operations

- **Array Operations:** Avoid deeply nested array operations. Keep array method chaining readable and maintainable:
  ```javascript
  // ✅ Good: Simple two-level nesting with clear operations
  const result = users
    .filter(user => user.isActive)
    .map(user => user.email);

  // ❌ Avoid: Deep nesting becomes hard to read
  const result = items.map(x => 
    x.items.filter(y => 
      y.values.reduce((z, v) => z + v, 0) > 100
    )
  );

  // ✅ Good: Break complex operations into steps
  const sumValues = values => values.reduce((sum, val) => sum + val, 0);
  const filterBySum = items => items.filter(item => sumValues(item.values) > 100);
  const result = items.map(item => filterBySum(item.items));

  // ✅ Good: Use traditional loops for complex operations
  const result = [];
  for (const item of items) {
    const validItems = [];
    for (const subItem of item.items) {
      const sum = subItem.values.reduce((acc, val) => acc + val, 0);
      if (sum > 100) {
        validItems.push(subItem);
      }
    }
    result.push(validItems);
  }
  ```

## Testing Requirements

The following test cases are required for endpoints:
```javascript
// ✅ Required test cases for all endpoints

// 1. Pagination tests
it('should return paginated results with correct limit and offset', () => {
  // Test that endpoint properly handles pagination parameters
});

// 2. Authentication tests
it('should reject requests without valid authentication', () => {
  // Test that unauthorized access is properly prevented
});

// 3. Authorization tests
it('should verify user has proper role/permissions', () => {
  // Test various authorization scenarios
});

// 4. Payload shape tests
it('should return response with expected structure', () => {
  // Validate that the response matches the documented schema
});

// 5. Error assertion tests
it('should return appropriate error when input validation fails', () => {
  // Test each error condition the endpoint can produce
});

// 6. Data ordering tests (for list endpoints)
it('should return results in the correct order', () => {
  // Verify that list data is ordered according to the expected criteria
  // Example: by created date, alphabetically, or by specified sort parameter
});
```

### Mocking in Tests

Always mock external dependencies using the `nock` library:
```javascript
// ✅ Good: Use nock to intercept HTTP requests
beforeEach(() => {
  nock('https://api.example.com')
    .get('/users')
    .reply(200, { users: [] })
    .post('/users')
    .reply(201, { id: 'new-user-id' });
});

// ✅ Good: Clean up nock after tests
afterEach(() => {
  nock.cleanAll();
});

// ❌ Avoid: Making actual network calls in tests
it('should fetch users from API', async () => {
  const users = await fetchUsers(); // This would make a real HTTP request
});

// ❌ Avoid: Using tools like Sinon for HTTP mocking
sinon.stub(axios, 'get').resolves({ data: { users: [] } });
```

In rare cases where `nock` is insufficient (e.g., mocking internal Node.js modules or complex object behaviors), use `sinon`:
```javascript
// ✅ Acceptable: Use sinon for non-HTTP dependencies
const clock = sinon.useFakeTimers(new Date(2023, 0, 1));

// ✅ Acceptable: Stubbing internal module functions
sinon.stub(fs, 'readFileSync').returns('mocked file content');

// ✅ Acceptable: Spying on internal method calls
const spy = sinon.spy(myObject, 'internalMethod');
```

### Database Access in Tests

- The database must never be accessed directly from tests. All interactions should occur via the application's API layers.
- Tests should only access the API via helper functions located in the directory containing the tests`./helpers` folder. There will usually just be api calls.
- Any database cleanup or reset operations must only be performed after tests have completed running, using dedicated cleanup routines.

```javascript
// ❌ Avoid: Accessing database directly in tests
it('should create a new user', async () => {
  await db.collection('users').insertOne({ name: 'Test User' });
  // Test implementation
});

// ❌ Avoid: Calling API endpoints directly without helper functions
it('should create a new user', async () => {
  const response = await request(app).post('/users').send({ name: 'Test User' });
  expect(response.status).toBe(201);
});

// ✅ Good: Using helper functions from testing/helpers
it('should create a new user', async () => {
  const response = await testHelpers.createUser({ name: 'Test User' });
  expect(response.status).toBe(201);
});

// Example helper function in testing/helpers/userHelpers.js
export const createUser = async (userData) => {
  return await request(app).post('/users')
    .set('Authorization', `Bearer ${getTestToken()}`)
    .send(userData);
};
```

### Test Naming and Organization

- **Test Naming Conventions:**
  - Test files should be placed in the `<project_root>/tests` folder.
  - Test files should be named using the pattern: `test_<endpoint entity type or middleware>_<endpoint_method>.js`.
  - Use a single top-level `describe` block that clearly identifies the endpoint or middleware being tested:
    - For endpoints: `describe('/users POST', () => { ... })`
    - For middleware: `describe('middleware (middleware name)', () => { ... })`
  - Test descriptions should follow the pattern: `it('should [expected behavior] when [condition]')`.

- **Test Structure Examples:**
```javascript
// ✅ Good: Single describe with endpoint name
describe('/dashboards GET', () => {
  it('should return user dashboards when authenticated', async () => {
    // Test implementation
  });
  
  it('should return 401 when token is invalid', async () => {
    // Test implementation
  });
});

// ✅ Good: Middleware test structure
describe('middleware (authentication)', () => {
  it('should pass request when token is valid', async () => {
    // Test implementation
  });
  
  it('should reject request when token is expired', async () => {
    // Test implementation
  });
});

// ❌ Avoid: Multiple nested describes
describe('/users', () => {
  describe('POST', () => { // Don't nest like this
    it('should create user', async () => {
      // Test implementation
    });
  });
});

// ❌ Avoid: Missing endpoint information in describe
describe('User tests', () => { // Not identifying the endpoint
  it('can create users', async () => {
    // Test implementation
  });
});
```

- **Test File Organization:**
  - All test files should be located in the `<project_root>/tests` directory.
  - Example file naming:
  
```
tests/
├── test_users_get.js
├── test_users_post.js
├── test_dashboards_get.js
├── test_middleware_authentication.js
```

- **Reusing Existing Helpers:** Always check for existing helper functions before creating new ones. When in doubt, review other similar implementations to avoid reinventing functionality.
```javascript
// ❌ Avoid: Creating new helper functions that duplicate existing ones
// newHelpers.js
export const fetchUserDetails = async (userId) => {
  // Implementation that already exists elsewhere
};

// ✅ Better: Reuse existing helpers
import { getUserData } from './userHelpers';
// Use getUserData instead of creating fetchUserDetails
```

### Determining Test Coverage Requirements

Beyond the required test cases listed above, you should determine additional tests by examining the implementation details of each endpoint. The following scenarios must be tested:

#### 1. Conditional Logic Coverage

- **Every Conditional Branch:** Each if/else branch, switch case, and ternary operation in controller code must have at least one test case.
  ```javascript
  // Example controller with conditional logic
  const updateUser = async (ctx) => {
    const { id } = ctx.params;
    const { name, email, role } = ctx.request.body;
    
    // Every branch of this conditional requires a test
    if (!id) {
      ctx.throw(400, 'User ID is required');
    } else if (!name && !email) {
      ctx.throw(400, 'At least one field (name or email) must be provided');
    }
    
    // This ternary requires tests for both possibilities
    const result = await userDao.updateUser(id, {
      name,
      email,
      status: role === 'admin' ? 'active' : 'pending'
    });
    
    ctx.body = result;
  }
  
  // Required tests for this controller:
  it('should return 400 when id is missing', async () => { /* ... */ });
  it('should return 400 when both name and email are missing', async () => { /* ... */ });
  it('should set status to active when role is admin', async () => { /* ... */ });
  it('should set status to pending when role is not admin', async () => { /* ... */ });
  ```

#### 2. Database Query Path Coverage

- **Query Parameter Variations:** All query parameters that affect the structure or logic of database queries must be tested individually and in combination.
  ```javascript
  // Example DAO with query parameter conditionals
  exports.getUsers = optionalTransaction((sql, filters) => {
    let query = sql`SELECT * FROM users WHERE 1=1`;
    
    if (filters.status) {
      query = sql`${query} AND status = ${filters.status}`;
    }
    
    if (filters.role) {
      query = sql`${query} AND role = ${filters.role}`;
    }
    
    if (filters.search) {
      query = sql`${query} AND (name ILIKE ${`%${filters.search}%`} OR email ILIKE ${`%${filters.search}%`})`;
    }
    
    return query;
  });
  
  // Required tests for different query paths:
  it('should query users with status filter', async () => { /* ... */ });
  it('should query users with role filter', async () => { /* ... */ });
  it('should query users with search filter', async () => { /* ... */ });
  it('should query users with combined status and role filters', async () => { /* ... */ });
  it('should query users with all filters combined', async () => { /* ... */ });
  ```

#### 3. Database Join and Relationship Testing

- **Join Conditions:** For queries involving table joins, test scenarios where the join conditions produce different results.
  ```javascript
  // For an endpoint that retrieves user data with related roles:
  it('should return user with multiple roles', async () => { /* ... */ });
  it('should return user with no roles assigned', async () => { /* ... */ });
  it('should handle inner vs. outer joins appropriately', async () => { /* ... */ });
  ```

#### 4. Error Handling and Recovery

- **Required tests for specific error conditions:**
  ```javascript
  // Database constraint violations
  it('should handle unique constraint violations', async () => { /* ... */ });
  it('should handle foreign key constraint violations', async () => { /* ... */ });
  
  // Application-specific errors
  it('should handle resource conflict errors', async () => { /* ... */ });
  it('should handle resource not found errors', async () => { /* ... */ });
  
  // Network and external service errors
  it('should handle external service timeouts', async () => { /* ... */ });
  it('should retry failed operations according to policy', async () => { /* ... */ });
  ```

Below are more project specific things to keep in mind when writing tests.

# Testing Standards and Best Practices

This document outlines the testing standards and best practices for our Node.js server project. Following these guidelines ensures consistent, reliable, and maintainable tests across the codebase.

## Test Setup and Lifecycle

### Required Test Hooks

Every test file must implement the following hooks:

```javascript
describe('/endpoint METHOD', () => {
  let server;

  // Start the application server before all tests
  before(async () => {
    server = await app();
  });

  // Stop the application server after all tests
  after(async () => {
    server.close();
  });

  // Reset database and seed initial data before each test
  beforeEach(async () => {
    await cleanDb();
    await createFirstUser({ server });
    await createNamespace({ server, id: 'test', displayName: 'Test' });
    
    // Additional test-specific setup
  });

  // Clean up resources after each test
  afterEach(async () => {
    await cleanCache();
    nock.cleanAll();
  });

  // Test cases go here
});
```

### Authentication and Authorization

1. **Super Token Usage:**
   - Use the super token (`superUser.token`) only for setting up test data.
   - Never use the super token to execute the actual test API calls being tested.

2. **Test User Provisioning:**
   - For each test, provision a new user with the specific permissions required.
   - Explicitly define the roles and permissions needed for the test.

```javascript
it('should perform an action when properly authorized', async () => {
  // Create a role with specific permissions for this test
  const { id } = await createRole({ 
    server, 
    namespace: 'test', 
    permissions: ['resource:action'] 
  });

  // Create a test user with this role
  const testUser = await createUser({
    server,
    roles: [id],
    namespace: 'test',
  });

  // Execute the test with the test user's token
  const response = await request(server)
    .post('/endpoint')
    .set('Authorization', `Bearer ${testUser.token}`)
    .send(payload)
    .expect(200);
    
  // Assertions
});
```

## Required Test Cases

All endpoint tests must include the following test cases:

1. **Authentication Tests:**
   ```javascript
   it('should reject unauthenticated requests', async () => {
     const response = await request(server)
       .get('/endpoint')
       .expect(401);
   });
   ```

2. **Authorization Tests:**
   ```javascript
   it('should reject unauthorized requests', async () => {
     // Create user without required permission
     const testUser = await createUser({
       server,
       roles: [],
       namespace: 'test',
     });

     const response = await request(server)
       .get('/endpoint')
       .set('Authorization', `Bearer ${testUser.token}`)
       .expect(403);
   });
   ```

3. **Validation Tests:**
   ```javascript
   it('should validate required fields', async () => {
     // Create authorized user
     const testUser = await createAuthorizedUser();

     const response = await request(server)
       .post('/endpoint')
       .set('Authorization', `Bearer ${testUser.token}`)
       .send(invalidPayload)
       .expect(400);
       
     expect(response.body).to.have.property('error');
   });
   ```

4. **For List Endpoints:**
   ```javascript
   it('should return paginated results', async () => {
     // Setup test data
     // ...
     
     const response = await request(server)
       .get('/endpoint?limit=5&offset=10')
       .set('Authorization', `Bearer ${testUser.token}`)
       .expect(200);
       
     expect(response.body).to.have.property('items');
     expect(response.body.items).to.have.length.at.most(5);
     expect(response.body).to.have.property('total');
   });
   ```

5. **Happy Path Tests:**
   ```javascript
   it('should successfully perform the operation', async () => {
     // Setup and test the expected successful scenario
   });
   ```

## External Dependency Mocking

Always mock external dependencies using `nock`:

```javascript
beforeEach(() => {
  // Mock external API calls
  nock('https://external-api.example.com')
    .get('/resource')
    .reply(200, { data: 'mock response' });
});

afterEach(() => {
  nock.cleanAll();
});
```

## Database Access

1. Never access the database directly from tests.
2. Use the application's API and helper functions for all data operations.
3. Database cleanup should be handled by the `cleanDb()` helper in the `beforeEach` hook.

## Test Naming and Organization

1. Test files should be named with the pattern: `test_<resource>_<action>.js`
2. Use descriptive test names that explain what is being tested and the expected outcome:
   ```javascript
   it('should return 403 when user lacks required permission', async () => {
     // Test implementation
   });
   ```

## Test Implementation

1. Each test should be focused on a single aspect of functionality.
2. Tests should be independent and not rely on the state from other tests.
3. Use helper functions from the `test/helpers` directory for common operations.
4. Keep test code DRY by creating test-specific helper functions for repetitive operations.

## Test Performance

1. Keep tests efficient by minimizing unnecessary setup.
2. Group related tests to reuse setup when appropriate.
3. Use focused `describe` blocks for different aspects of the same endpoint.

## Common Patterns

### Creating an Authorized User

```javascript
async function createAuthorizedUser(permissions = ['resource:action']) {
  const { id } = await createRole({ 
    server, 
    namespace: 'test', 
    permissions 
  });

  return createUser({
    server,
    roles: [id],
    namespace: 'test',
  });
}
```

### Testing Error Conditions

```javascript
it('should handle resource not found', async () => {
  const testUser = await createAuthorizedUser();
  
  const response = await request(server)
    .get('/endpoint/nonexistent-id')
    .set('Authorization', `Bearer ${testUser.token}`)
    .expect(404);
    
  expect(response.body).to.have.property('error');
  expect(response.body.error).to.include('not found');
});
```

By following these guidelines, we ensure our tests are robust, maintainable, and provide effective coverage of our API functionality.

