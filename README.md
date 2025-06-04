# RIE Server - TypeScript/Node.js Version

This is a TypeScript/Node.js implementation of the Recipe Information Exchange (RIE) server.

## Technology Stack

- **TypeScript**: Strongly-typed JavaScript superset
- **Node.js**: JavaScript runtime
- **Koa**: Lightweight web framework for Node.js
- **PostgreSQL**: Database for storing recipes, users, and other data
- **Zod**: Schema validation with automatic TypeScript type inference
- **JWT**: Authentication with JSON Web Tokens
- **Winston**: Logging library
- **Mocha & Chai**: Testing framework

## Project Structure

```
rie-server/
├── config/                  # Configuration files for different environments
├── sql/                     # SQL schema and seed files
├── dist/                    # Compiled TypeScript output
├── src/                     # Source code (TypeScript)
│   ├── app.js               # Main application setup
│   ├── controllers/         # API endpoint handlers
│   │   ├── user.js          # User-related endpoints
│   │   ├── recipe.js        # Recipe-related endpoints
│   │   └── news.js          # News-related endpoints
│   ├── daos/                # Data Access Objects for database operations
│   │   ├── db.js            # Database connection and utilities
│   │   ├── userDao.js       # User database operations
│   │   ├── recipeDao.js     # Recipe database operations
│   │   ├── recipeFavoriteDao.js # Recipe favorites database operations
│   │   └── newsDao.js       # News database operations
│   ├── middleware/          # Koa middleware components
│   │   ├── auth.js          # Authentication middleware
│   │   └── validate.js      # Request validation middleware
│   ├── schemas/             # Data validation schemas
│   │   └── index.js         # Schema definitions using Zod
│   ├── services/            # Business logic services
│   │   ├── userService.js   # User-related business logic
│   │   ├── recipeService.js # Recipe-related business logic
│   │   ├── recipeFavoriteService.js # Favorites-related business logic
│   │   └── newsService.js   # News-related business logic
│   ├── clients/             # External API clients
│   └── server.js            # Entry point
├── static/                  # Static files
└── test/                    # Test files
    ├── helpers/             # Test helper functions
    ├── test_users_post.js   # Tests for user endpoints
    ├── test_recipes_post.js # Tests for recipe endpoints
    └── test_middleware_authentication.js # Tests for authentication middleware
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- PostgreSQL 14 or later
- Docker (optional)

### Installation

1. Clone the repository
2. Install dependencies:

```bash
npm install
```

3. Set up the database:

```bash
psql -U postgres -f sql/schema.sql
```

### Running the Application

#### Development Mode

```bash
npm run dev
```

#### Production Mode

```bash
# Build the TypeScript files
npm run build

# Run the compiled JavaScript
npm start
```

### With Docker

```bash
# Build and run the Docker image with TypeScript compilation
docker-compose up --build
```

## Architecture

The application follows a layered architecture pattern:

1. **Controllers Layer** - Handles HTTP requests and responses
   - Validates incoming data
   - Calls appropriate service methods
   - Formats and returns responses

2. **Service Layer** - Contains business logic
   - Implements domain-specific operations
   - Coordinates between multiple DAOs
   - Handles complex operations

3. **Data Access Layer** - Interacts with the database
   - Uses Data Access Objects (DAOs)
   - Encapsulates SQL queries
   - Manages database transactions

4. **Schema Layer** - Defines data structures
   - Uses Zod for schema validation
   - Ensures data integrity

### Key Design Patterns

- **Dependency Injection** - Services and DAOs are instantiated as singletons
- **Repository Pattern** - DAOs abstract database access
- **Middleware Pattern** - Koa middleware for cross-cutting concerns

## API Endpoints

### Users

- `POST /users` - Create a new user
- `GET /users/:username` - Get user profile

### Recipes

- `GET /recipes` - Search recipes
- `GET /recipes/:slug` - Get a specific recipe
- `POST /recipes` - Create a new recipe
- `PUT /recipes/:slug` - Update a recipe
- `DELETE /recipes/:slug` - Delete a recipe
- `POST /recipes/:slug/favorite` - Add recipe to favorites
- `DELETE /recipes/:slug/favorite` - Remove recipe from favorites
- `GET /users/:username/favorites` - Get user's favorite recipes

### News

- `GET /news` - Get recent news items
- `GET /recipes/:slug/news` - Get news related to a recipe

## Testing

Tests use Mocha as the test runner and Chai for assertions. Each test suite boots its own server instance to improve test isolation and reliability.

### Running Tests

```bash
# Run all tests
./run-tests.sh

# Run specific tests by pattern
./run-tests.sh --grep "recipes"

# Run with increased timeout
./run-tests.sh --timeout 5000
```

### Test Structure

Each test file follows a pattern where:
- Each test suite boots its own server instance
- Tests use before/after hooks for setup and teardown
- Database state is cleaned between test cases
- Tests are grouped by endpoint functionality

See the [test README](./test/README.md) for detailed guidelines on writing tests.

## License

This project is proprietary and confidential.
