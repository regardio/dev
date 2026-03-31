---

title: API Design Standards
type: concept
status: published
summary: API design and implementation guidelines for Regardio projects
related: [react-standards, sql-schema-standards, testing, development-principles]
locale: en-US
---

# API Design Standards

API design and implementation guidelines for Regardio projects.

## API Design Principles

### RESTful Patterns

- Resource-oriented design
- Use appropriate HTTP verbs (GET, POST, PUT, PATCH, DELETE)
- Return meaningful HTTP status codes
- Follow predictable URL patterns

```text
GET    /api/users          # List users
GET    /api/users/:id      # Get specific user
POST   /api/users          # Create user
PATCH  /api/users/:id      # Update user
DELETE /api/users/:id      # Delete user
```

### Data Consistency

- Maintain single source of truth
- Implement proper access control
- Standardized response formats
- Version APIs for backward compatibility

### Response Format

```typescript
interface SuccessResponse<T> {
  success: true;
  data: T;
  meta?: { page?: number; limit?: number; total?: number };
}

interface ErrorResponse {
  success: false;
  error: { code: string; message: string; details?: unknown };
}

type ApiResponse<T> = SuccessResponse<T> | ErrorResponse;
```

## Error Handling

### Error Categories

```typescript
enum ApiErrorType {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  PERMISSION = 'permission',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  RATE_LIMIT = 'rate_limit',
  SERVER = 'server'
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

| Code | Use Case |
|------|----------|
| 200 | Successful GET, PATCH, DELETE |
| 201 | Successful POST |
| 400 | Invalid request |
| 401 | Missing/invalid authentication |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Resource conflict |
| 422 | Validation errors |
| 429 | Rate limit exceeded |
| 500 | Server error |

### Error Response Format

```typescript
{
  success: false,
  error: {
    code: 'VALIDATION_ERROR',
    message: 'Invalid input data',
    details: { fields: { email: 'Invalid email format' } }
  }
}
```

### Client Error Handling

```typescript
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const result: ApiResponse<User> = await response.json();

  if (!result.success) {
    throw new ApiError(
      result.error.message,
      mapErrorCode(result.error.code),
      result.error.code,
      response.status
    );
  }

  return result.data;
}
```

## Security Standards

### Authentication

- Use JWT or similar token mechanisms
- Always use HTTPS in production
- Implement token expiration and refresh

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
      throw new ApiError('Login failed', ApiErrorType.AUTHENTICATION, 'LOGIN_FAILED', response.status);
    }

    const result: ApiResponse<AuthTokens> = await response.json();
    return result.data;
  }
}
```

### Authorization

- Grant minimum necessary permissions
- Implement role-based access control
- Verify resource ownership
- Validate and sanitize all inputs

```typescript
async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const currentUser = await getCurrentUser();

  if (currentUser.id !== id && !currentUser.roles.includes('admin')) {
    throw new ApiError('Permission denied', ApiErrorType.PERMISSION, 'PERMISSION_DENIED', 403);
  }

  const validatedData = validateUserUpdate(data);
  return await userRepository.update(id, validatedData);
}
```

### Input Validation

- Never trust client data
- Validate types, ranges, and formats
- Sanitize dangerous characters

```typescript
import { z } from 'zod';

const UserUpdateSchema = z.object({
  email: z.string().email().optional(),
  displayName: z.string().min(2).max(50).optional(),
  age: z.number().int().min(18).max(120).optional()
});

function validateUserUpdate(data: unknown): Partial<User> {
  try {
    return UserUpdateSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new ApiError('Validation failed', ApiErrorType.VALIDATION, 'VALIDATION_ERROR', 422,
        { fields: error.flatten().fieldErrors });
    }
    throw error;
  }
}
```

## Performance

### Query Optimization

- Implement pagination for list endpoints
- Support filtering and field selection
- Implement caching strategies

```typescript
interface ListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

async function listUsers(params: ListParams): Promise<ApiResponse<User[]>> {
  const page = params.page || 1;
  const limit = Math.min(params.limit || 20, 100);
  const offset = (page - 1) * limit;

  const [users, total] = await Promise.all([
    userRepository.findMany({ offset, limit, sortBy: params.sortBy, sortOrder: params.sortOrder }),
    userRepository.count()
  ]);

  return {
    success: true,
    data: users,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) }
  };
}
```

### Caching & Rate Limiting

- Use Cache-Control headers and ETags
- Cache frequently accessed data
- Implement rate limiting

```typescript
app.get('/api/users/:id', async (req, res) => {
  const user = await userRepository.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
  }
  res.set('Cache-Control', 'private, max-age=300');
  res.json({ success: true, data: user });
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' } }
});
app.use('/api/', apiLimiter);
```

## Documentation

Document endpoints with:

- Purpose and authentication requirements
- Parameters and response format
- Possible error codes
- Request/response examples

```typescript
/**
 * Update user profile
 * @route PATCH /api/users/:id
 * @auth Required
 * @param {string} id - User ID
 * @returns {User} Updated user
 * @throws {401} UNAUTHORIZED
 * @throws {403} PERMISSION_DENIED
 * @throws {422} VALIDATION_ERROR
 */
```

Consider using OpenAPI/Swagger for comprehensive API documentation.

## Testing

- **Unit tests**: Individual functions and handlers
- **Integration tests**: API endpoints with database
- **Contract tests**: API contract verification

```typescript
describe('User API', () => {
  it('updates user profile successfully', async () => {
    const user = await createTestUser();
    const token = await generateAuthToken(user);

    const response = await request(app)
      .patch(`/api/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ displayName: 'Updated Name' });

    expect(response.status).toBe(200);
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
    expect(response.body.error.code).toBe('PERMISSION_DENIED');
  });
});
```

## Related Documentation

- [React](./react.md) - Client-side integration patterns
- [SQL](./sql.md) - Database function implementation
- [Testing](./testing.md) - Testing philosophy and patterns
- [Principles](./principles.md) - Universal coding standards

---

**License**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) © Regardio
