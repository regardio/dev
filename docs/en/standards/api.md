---

title: "API"
description: "REST endpoint shape, error handling, security, and performance patterns for Regardio APIs."
publishedAt: 2026-04-17
order: 8
language: "en"
status: "published"
kind: "reference"
area: "dev"
---

Regardio APIs are resource-oriented, predictable, and consistent about errors. This page catalogues the shape of endpoints, the response envelope, and the patterns for authentication, validation, caching, and testing. The contract a client sees — URL, verb, status, envelope — stays stable; the implementation behind it is free to change.

## Design

### RESTful URLs

- One resource per URL
- Standard HTTP verbs carry the operation
- Status codes carry the outcome

```text
GET    /api/users          List users
GET    /api/users/:id      Get a specific user
POST   /api/users          Create a user
PATCH  /api/users/:id      Update a user
DELETE /api/users/:id      Delete a user
```

### Response envelope

Every response wraps its payload in a discriminated union so that a client never has to guess whether it received success or failure:

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

Breaking changes go through versioning; consistency across versions keeps clients portable.

## Errors

### Categories

```typescript
enum ApiErrorType {
  VALIDATION = 'validation',
  AUTHENTICATION = 'authentication',
  PERMISSION = 'permission',
  NOT_FOUND = 'not_found',
  CONFLICT = 'conflict',
  RATE_LIMIT = 'rate_limit',
  SERVER = 'server',
}

class ApiError extends Error {
  constructor(
    message: string,
    public type: ApiErrorType,
    public code: string,
    public statusCode: number,
    public details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```

### Status codes

| Code | Use |
|------|-----|
| 200 | Successful GET, PATCH, DELETE |
| 201 | Successful POST |
| 400 | Invalid request |
| 401 | Missing or invalid authentication |
| 403 | Insufficient permissions |
| 404 | Resource not found |
| 409 | Resource conflict |
| 422 | Validation failure |
| 429 | Rate limit exceeded |
| 500 | Server error |

### Error payload

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": { "fields": { "email": "Invalid email format" } }
  }
}
```

### Client handling

```typescript
async function fetchUser(id: string): Promise<User> {
  const response = await fetch(`/api/users/${id}`);
  const result: ApiResponse<User> = await response.json();

  if (!result.success) {
    throw new ApiError(
      result.error.message,
      mapErrorCode(result.error.code),
      result.error.code,
      response.status,
    );
  }

  return result.data;
}
```

## Security

### Authentication

- Token-based (JWT or equivalent)
- HTTPS in every environment that sees real traffic
- Tokens expire; refresh is explicit

```typescript
interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresAt: number;
}
```

### Authorisation

- Minimum necessary permissions
- Role-based access for cross-resource actions
- Ownership verified on every resource-scoped action
- Server-side validation is the line; the client is untrusted

```typescript
async function updateUser(id: string, data: Partial<User>): Promise<User> {
  const currentUser = await getCurrentUser();

  if (currentUser.id !== id && !currentUser.roles.includes('admin')) {
    throw new ApiError('Permission denied', ApiErrorType.PERMISSION, 'PERMISSION_DENIED', 403);
  }

  const validatedData = validateUserUpdate(data);
  return userRepository.update(id, validatedData);
}
```

### Input validation

Types, ranges, and formats are validated on the server. A schema library carries the shape so the contract stays single-sourced:

```typescript
import { z } from 'zod';

const UserUpdateSchema = z.object({
  email: z.string().email().optional(),
  displayName: z.string().min(2).max(50).optional(),
  age: z.number().int().min(18).max(120).optional(),
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
        { fields: error.flatten().fieldErrors },
      );
    }
    throw error;
  }
}
```

## Performance

### Pagination

List endpoints paginate; limits are capped so a client cannot ask for the world:

```typescript
interface ListParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

async function listUsers(params: ListParams): Promise<ApiResponse<User[]>> {
  const page = params.page ?? 1;
  const limit = Math.min(params.limit ?? 20, 100);
  const offset = (page - 1) * limit;

  const [users, total] = await Promise.all([
    userRepository.findMany({ offset, limit, sortBy: params.sortBy, sortOrder: params.sortOrder }),
    userRepository.count(),
  ]);

  return {
    success: true,
    data: users,
    meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
  };
}
```

### Caching and rate limiting

- `Cache-Control` and ETags where the resource tolerates it
- Rate limits protect against runaway clients and scraped keys

```typescript
app.get('/api/users/:id', async (req, res) => {
  const user = await userRepository.findById(req.params.id);
  if (!user) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'User not found' },
    });
  }
  res.set('Cache-Control', 'private, max-age=300');
  res.json({ success: true, data: user });
});

const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: { code: 'RATE_LIMIT_EXCEEDED', message: 'Too many requests' } },
});
app.use('/api/', apiLimiter);
```

## Documentation

Each endpoint carries:

- Purpose and authentication requirement
- Parameters and response shape
- Error codes that can arise
- A request/response example

```typescript
/**
 * Update a user profile.
 * @route  PATCH /api/users/:id
 * @auth   Required
 * @param  id  User ID
 * @returns    Updated user
 * @throws 401 UNAUTHORIZED
 * @throws 403 PERMISSION_DENIED
 * @throws 422 VALIDATION_ERROR
 */
```

For large APIs, OpenAPI/Swagger carries the same contract in a form tooling can consume.

## Testing

- **Unit tests** — individual handlers and helpers
- **Integration tests** — endpoints against a real database
- **Contract tests** — request/response shape held to the documented contract

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

  it('returns 403 when updating another user', async () => {
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

## Related

- [React](./react.md) — Patterns for the clients that consume the API
- [SQL](./sql.md) — Naming, structure, and access on the database side
- [Testing](./testing.md) — Testing philosophy and layers
- [Principles](./principles.md) — Shared principles

---

**License**: [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/) © Regardio
