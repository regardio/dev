# API Design Standards

API design and implementation guidelines for Regardio projects.

## Table of Contents

- [API Design Principles](#api-design-principles)
- [Error Handling](#error-handling)
- [Security Standards](#security-standards)
- [Performance Guidelines](#performance-guidelines)
- [Documentation Requirements](#documentation-requirements)
- [Testing Standards](#testing-standards)

## API Design Principles

### RESTful Patterns

- **Resource-oriented**: Design around resources, not actions
- **HTTP methods**: Use appropriate HTTP verbs (GET, POST, PUT, PATCH, DELETE)
- **Status codes**: Return meaningful HTTP status codes
- **Consistent URLs**: Follow predictable URL patterns

```text
GET    /api/users          # List users
GET    /api/users/:id      # Get specific user
POST   /api/users          # Create user
PATCH  /api/users/:id      # Update user
DELETE /api/users/:id      # Delete user
```

### Data Consistency

- **Single source of truth**: Maintain authoritative data layer
- **Filtered access**: Implement proper access control
- **Consistent structure**: Standardized response formats across endpoints
- **Versioning**: Version APIs to support backward compatibility

### Response Format

Use consistent response structures:

```typescript
// Success response
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

// Error response
interface ErrorResponse {
  success: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
```

## Error Handling

### Error Categories

Define clear error types for different failure modes:

```typescript
enum ApiErrorType {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  PERMISSION = 'permission',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  RATE_LIMIT = 'rate_limit',
  NETWORK = 'network',
  SERVER = 'server',
  UNKNOWN = 'unknown'
}

class ApiError extends Error {
  constructor(
    message: string,
    public type: ApiErrorType,
    public code: string,
    public statusCode: number,
    public details?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### HTTP Status Codes

Use appropriate status codes:

| Code | Meaning | Use Case |
|------|---------|----------|
| 200 | OK | Successful GET, PATCH, DELETE |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE with no response body |
| 400 | Bad Request | Invalid request format or parameters |
| 401 | Unauthorized | Missing or invalid authentication |
| 403 | Forbidden | Valid auth but insufficient permissions |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource conflict (e.g., duplicate) |
| 422 | Unprocessable Entity | Validation errors |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server-side error |
| 503 | Service Unavailable | Temporary unavailability |

### Error Response Format

```typescript
// Validation error example
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid input data',
    details: {
      fields: {
        email: 'Invalid email format',
        age: 'Must be at least 18'
      }
    }
  }
}

// Permission error example
{
  success: false,
  error: {
    code: 'PERMISSION_DENIED',
    message: 'You do not have permission to access this resource'
  }
}
```

### Client Error Handling

Implement consistent error handling in clients:

```typescript
async function fetchUser(id: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${id}`);
    const result: ApiResponse<User> = await response.json();

    if (!result.success) {
      throw new ApiError(
        result.error.message,
        mapErrorCode(result.error.code),
        result.error.code,
        response.status,
        result.error.details
      );
    }

    return result.data;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      'Network error occurred',
      ApiErrorType.NETWORK,
      'NETWORK_ERROR',
      0
    );
  }
}
```

## Security Standards

### Authentication

- **Token-based auth**: Use JWT or similar token mechanisms
- **Secure transmission**: Always use HTTPS in production
- **Token expiration**: Implement reasonable token expiration
- **Refresh tokens**: Support token refresh for long-lived sessions

```typescript
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}

class AuthService {
  async login(email: string, password: string): Promise<AuthTokens> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      throw new ApiError(
        'Login failed',
        ApiErrorType.AUTHENTICATION,
        'LOGIN_FAILED',
        response.status
      );
    }

    const result: ApiResponse<AuthTokens> = await response.json();
    return result.data;
  }

  async refreshToken(refreshToken: string): Promise<AuthTokens> {
    // Implementation
  }
}
```

### Authorization

- **Principle of least privilege**: Grant minimum necessary permissions
- **Role-based access control**: Implement clear permission levels
- **Resource ownership**: Verify user owns or has access to resources
- **Input validation**: Validate and sanitize all inputs

```typescript
// Good: Check permissions before operations
async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const currentUser = await getCurrentUser();
  
  // Check if user can update this resource
  if (currentUser.id !== id && !currentUser.roles.includes('admin')) {
    throw new ApiError(
      'Permission denied',
      ApiErrorType.PERMISSION,
      'PERMISSION_DENIED',
      403
    );
  }

  // Validate input
  const validatedData = validateUserUpdate(data);
  
  // Perform update
  return await userRepository.update(id, validatedData);
}
```

### Input Validation

- **Validate all inputs**: Never trust client data
- **Type checking**: Ensure correct data types
- **Range validation**: Check numeric ranges and string lengths
- **Format validation**: Validate emails, URLs, dates, etc.
- **Sanitization**: Remove or escape dangerous characters

```typescript
import { z } from 'zod';

// Good: Schema-based validation
const UserUpdateSchema = z.object({
  email: z.string().email().optional(),
  displayName: z.string().min(2).max(50).optional(),
  age: z.number().int().min(18).max(120).optional(),
  website: z.string().url().optional()
});

function validateUserUpdate(data: unknown): Partial<User> {
  try {
    return UserUpdateSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError(
        'Validation failed',
        ApiErrorType.VALIDATION,
        'VALIDATION_ERROR',
        422,
        { fields: error.flatten().fieldErrors }
      );
    }
    throw error;
  }
}
```

## Performance Guidelines

### Query Optimization

- **Pagination**: Implement pagination for list endpoints
- **Filtering**: Support filtering to reduce data transfer
- **Field selection**: Allow clients to specify needed fields
- **Caching**: Implement appropriate caching strategies

```typescript
// Good: Paginated list endpoint
interface ListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  filter?: Record<string, unknown>;
}

async function listUsers(params: ListParams): Promise<ApiResponse<User[]>> {
  const page = params.page || 1;
  const limit = Math.min(params.limit || 20, 100); // Max 100 items
  const offset = (page - 1) * limit;

  const [users, total] = await Promise.all([
    userRepository.findMany({
      offset,
      limit,
      sortBy: params.sortBy,
      sortOrder: params.sortOrder,
      filter: params.filter
    }),
    userRepository.count(params.filter)
  ]);

  return {
    success: true,
    data: users,
    meta: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit)
    }
  };
}
```

### Caching Strategies

- **HTTP caching**: Use appropriate Cache-Control headers
- **ETags**: Implement ETags for conditional requests
- **In-memory caching**: Cache frequently accessed data
- **CDN caching**: Use CDN for static or semi-static content

```typescript
// Good: Cache-Control headers
app.get('/api/users/:id', async (req, res) => {
  const user = await userRepository.findById(req.params.id);
  
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'User not found' }
    });
  }

  // Cache for 5 minutes
  res.set('Cache-Control', 'private, max-age=300');
  res.set('ETag', generateETag(user));
  
  res.json({ success: true, data: user });
});
```

### Rate Limiting

Implement rate limiting to prevent abuse:

```typescript
// Good: Rate limiting middleware
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      code: 'RATE_LIMIT_EXCEEDED',
      message: 'Too many requests, please try again later'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

app.use('/api/', apiLimiter);
```

## Documentation Requirements

### API Documentation

Every API endpoint should document:

- **Purpose**: What the endpoint does
- **Authentication**: Required authentication/authorization
- **Parameters**: Request parameters and their types
- **Response**: Response format and possible values
- **Errors**: Possible error codes and meanings
- **Examples**: Request and response examples

```typescript
/**
 * Update user profile
 * 
 * @route PATCH /api/users/:id
 * @auth Required - User must be authenticated
 * @permission User can only update their own profile unless admin
 * 
 * @param {string} id - User ID
 * @body {Partial<User>} data - User data to update
 * 
 * @returns {User} Updated user object
 * 
 * @throws {401} UNAUTHORIZED - Not authenticated
 * @throws {403} PERMISSION_DENIED - Cannot update other user's profile
 * @throws {404} NOT_FOUND - User not found
 * @throws {422} VALIDATION_ERROR - Invalid input data
 * 
 * @example
 * // Request
 * PATCH /api/users/123
 * {
 *   "displayName": "John Doe",
 *   "email": "john@example.com"
 * }
 * 
 * // Response
 * {
 *   "success": true,
 *   "data": {
 *     "id": "123",
 *     "displayName": "John Doe",
 *     "email": "john@example.com",
 *     "updatedAt": "2024-01-01T00:00:00Z"
 *   }
 * }
 */
```

### OpenAPI/Swagger

Consider using OpenAPI specification for API documentation:

```yaml
openapi: 3.0.0
info:
  title: User API
  version: 1.0.0

paths:
  /api/users/{id}:
    patch:
      summary: Update user profile
      security:
        - bearerAuth: []
      parameters:
        - name: id
          in: path
          required: true
          schema:
            type: string
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserUpdate'
      responses:
        '200':
          description: User updated successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
```

## Testing Standards

### API Testing Levels

- **Unit tests**: Test individual functions and handlers
- **Integration tests**: Test API endpoints with database
- **Contract tests**: Verify API contracts are maintained
- **Load tests**: Test performance under load

### Testing Example

```typescript
describe('User API', () => {
  describe('PATCH /api/users/:id', () => {
    it('updates user profile successfully', async () => {
      const user = await createTestUser();
      const token = await generateAuthToken(user);

      const response = await request(app)
        .patch(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ displayName: 'Updated Name' });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.displayName).toBe('Updated Name');
    });

    it('returns 403 when updating other user', async () => {
      const user1 = await createTestUser();
      const user2 = await createTestUser();
      const token = await generateAuthToken(user1);

      const response = await request(app)
        .patch(`/api/users/${user2.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ displayName: 'Hacked' });

      expect(response.status).toBe(403);
      expect(response.body.success).toBe(false);
      expect(response.body.error.code).toBe('PERMISSION_DENIED');
    });

    it('validates input data', async () => {
      const user = await createTestUser();
      const token = await generateAuthToken(user);

      const response = await request(app)
        .patch(`/api/users/${user.id}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(422);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });
  });
});
```

## Related Documentation

- [React Standards](./react-standards.md) - Client-side integration patterns
- [SQL Schema Standards](./sql-schema-standards.md) - Database function implementation
- [Testing Approach](./testing.md) - Testing philosophy and patterns
- [Development Principles](./development-principles.md) - Universal coding standards

---

**License**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) © Regardio
