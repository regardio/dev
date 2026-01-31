# SQL Schema Standards

**Comprehensive SQL schema styling and structure guidelines for PostgreSQL and Supabase projects.**

> **Note**: This document provides database-specific standards for schema file organization, naming conventions, formatting, and documentation. These standards ensure consistency, clarity, and completeness across SQL schema files.

## Table of Contents

- [Schema Organization](#schema-organization)
- [File Organization](#file-organization)
- [Naming Conventions](#naming-conventions)
- [Table Design](#table-design)
- [Function Standards](#function-standards)
- [SQL Formatting](#sql-formatting)
- [Documentation Standards](#documentation-standards)
- [Testing & Quality Assurance](#testing--quality-assurance)

## Schema Organization

### Schema Structure Patterns

Organize database objects into logical schemas based on their purpose and access patterns:

- **`public`** - User-facing API surface with views and functions
- **`internal`** or **`private`** - Core data storage with full relational integrity
- **`util`** or **`tools`** - Utility functions and development helpers
- **`extensions`** - Third-party extensions and their objects

### Schema Responsibilities

**Data Storage Schema** (e.g., `internal`, `private`):

- Core entity tables with consistent structure
- Full relational integrity and constraints
- Data isolation via foreign keys
- Lifecycle management (timestamps, soft deletion)

**API Schema** (e.g., `public`):

- Views with appropriate filtering and access control
- Business logic functions with validation
- Denormalized data optimized for client consumption

**Utility Schema** (e.g., `util`, `tools`):

- Helper functions for data transformation
- Development and maintenance utilities
- Reusable logic shared across schemas

## File Organization

### File Naming Convention

Use numbered prefixes to control execution order:

```text
00_setup_[schema].schema.sql       # Schema creation
01-09_setup_[name].enum.sql        # Enumerations and types
10-19_[schema]_[domain].fn.sql     # Functions grouped by domain
20-29_[schema]_[entity].table.sql  # Tables
30-39_[schema]_[entity].view.sql   # Views
40-49_[schema]_[entity].rls.sql    # Row-level security policies
50-59_[schema]_[entity].index.sql  # Indexes (if separate)
```

### File Structure Template

Each schema file should follow this structure:

```sql
/*
 * [Entity/Domain Name]
 *
 * Purpose: [Brief description]
 * Schema: [schema_name]
 * Dependencies: [List of required tables/functions]
 */

-- Table/View/Function definitions

-- Indexes

-- Triggers

-- Comments

-- Permissions
```

## Naming Conventions

### General Principles

- Use `snake_case` for all identifiers (tables, columns, functions, etc.)
- Be explicit and descriptive in naming
- Follow consistent patterns across the entire codebase
- Prefer full words over abbreviations

### Table and Column Naming

- Use singular form for table names (e.g., `user`, not `users`)
- Group related tables with consistent prefixes (e.g. `topic_`)
- Be consistent with suffix patterns:
  - `_id` for identifiers
  - `_intl` for internationalized JSON fields
  - `_at` for timestamp columns (e.g., `created_at`, `updated_at`)
- Use consistent field names across tables for similar concepts

Example:

```sql
CREATE TABLE {schema}.{table_name} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NULL
);
```

### Function Naming

Follow pattern: `{group}_{verb}_{target}`

- **Group**: Domain area using short, full words
- **Verb**: Action performed (e.g., `get`, `set`, `add`, `list`, `convert`, `check`)
- **Target**: Entity or data being acted upon

#### Example Group Prefixes

| Prefix     | Domain                   |
|------------|---------------------------|
| `auth`     | Authorization            |
| `check`    | Validation logic         |
| `intl`     | Internationalization     |
| `json`     | JSON operations          |
| `jsonb`    | JSONB operations         |
| `storage`  | Storage management       |
| `time`     | Timestamp/date handling  |
| `user`     | User management          |
| `org`      | Organization management  |
| `calc`     | Calculations             |

#### Standard Verb Terms

| Verb       | Purpose                                |
|------------|----------------------------------------|
| `get`      | Retrieve a single item                 |
| `list`     | Retrieve multiple items                |
| `create`   | Create a new item                      |
| `update`   | Modify an existing item                |
| `delete`   | Remove an item                         |
| `check`    | Validate or test a condition           |
| `convert`  | Transform data between formats         |
| `calculate`| Perform a calculation                  |
| `is`       | Test a boolean condition               |
| `has`      | Check for existence or ownership       |

Examples:

- `intl_convert_unit` - Converts units between locales
- `check_handle` - Validates handle format
- `user_get_by_id` - Retrieves user by ID
- `org_list_members` - Lists organization members
- `time_set_updated` - Sets updated_at timestamp
- `calc_total_amount` - Calculates total amount

### Constraint Naming

- Omit table name when defined within the table context
- Use descriptive names that indicate purpose and field
- Follow pattern: `chk_[field]_[purpose]` for CHECK constraints
- Use `pk_` prefix for primary key constraints
- Use `fk_` prefix for foreign key constraints
- Use `uq_` prefix for unique constraints

Examples:

```sql
ADD CONSTRAINT chk_handle_format CHECK (handle ~ '^[a-z0-9\-_]{3,32}$'),
ADD CONSTRAINT chk_max_members_positive CHECK (max_members > 0),
ADD CONSTRAINT fk_parent_circle FOREIGN KEY (parent_circle_id) REFERENCES public.circle(id)
```

### Index Naming

- Use prefix `idx_` for standard indexes
- Use prefix `idx_unique_` for unique indexes
- Indicate purpose or fields being indexed
- Omit table name when defined within the table context

Examples:

```sql
CREATE UNIQUE INDEX idx_unique_handle ON {schema}.{table_name}(handle);
CREATE INDEX idx_stewarding_user_id ON {schema}.{table_name}(stewarding_user_id);
```

### Trigger Naming

- Use prefix `trg_` for all triggers
- Indicate the event timing (BEFORE, AFTER) if relevant
- Indicate purpose or action
- Omit table name when defined within the table context

Examples:

```sql
CREATE TRIGGER trg_updated_at
  BEFORE UPDATE ON {schema}.{table_name}
  FOR EACH ROW EXECUTE FUNCTION {schema}.time_set_updated();
```

## Table Design

### Standard Table Structure

All entities should follow a consistent structure pattern:

```sql
CREATE TABLE {schema}.{entity} (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships (adjust based on your domain)
  parent_id UUID NULL REFERENCES {schema}.parent(id),
  owner_id UUID NOT NULL REFERENCES {schema}.user(id),

  -- Business Data
  handle TEXT NOT NULL,
  name TEXT NOT NULL,
  data JSONB NOT NULL,

  -- Lifecycle Management
  active_from TIMESTAMPTZ NULL,
  active_until TIMESTAMPTZ NULL,
  deleted_at TIMESTAMPTZ NULL,

  -- System Fields
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NULL
);
```

### Field Grouping and Organization

Group fields logically in table definitions with clear comments:

```sql
-- Identity
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Relationships
parent_id UUID NULL REFERENCES {schema}.parent(id),
owner_id UUID NOT NULL REFERENCES {schema}.user(id),

-- Business Data
handle TEXT NOT NULL,
name TEXT NOT NULL,
data JSONB NOT NULL,

-- Lifecycle Management
active_from TIMESTAMPTZ NULL,
active_until TIMESTAMPTZ NULL,
deleted_at TIMESTAMPTZ NULL,

-- System Fields
created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
updated_at TIMESTAMPTZ NULL
```

### JSONB Field Standards

- Use JSONB for flexible content storage
- Validate against JSON Schema 2020-12 definitions
- Include GIN indexes for searchability
- Use `_intl` suffix for internationalized content

## Function Standards

### Function Specifications

- Explicitly declare appropriate volatility (IMMUTABLE, STABLE, VOLATILE)
- Set proper security context (SECURITY DEFINER or INVOKER)
- Specify language explicitly (LANGUAGE plpgsql)
- Configure search path securely (SET search_path = '')
- Use schema-qualified function names

Example:

```sql
CREATE OR REPLACE FUNCTION {schema}.time_get_effective_dates(
    p_active_from TIMESTAMPTZ,
    p_active_until TIMESTAMPTZ,
    p_deleted_at TIMESTAMPTZ
  ) RETURNS TABLE(
    effective_active_from TIMESTAMPTZ,
    effective_active_until TIMESTAMPTZ
  )
  LANGUAGE plpgsql
  IMMUTABLE
  SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY
  SELECT
    COALESCE(p_active_from, NOW()) AS effective_active_from,
    p_active_until AS effective_active_until;
END;
$function$;
```

### Permission Management

- Rely on schema-level permission inheritance
- Follow least-privilege principle consistently
- Include full function signature in permission statements

### Function Schema Placement

**Public Schema Functions**:

- API endpoints for client applications
- Business logic validation
- Data transformation for client consumption
- Access control enforcement

**Internal Schema Functions**:

- Data manipulation and validation
- Complex business logic
- Utility functions for internal use
- Performance-critical operations

**Tools Schema Functions**:

- Development and maintenance utilities
- Data migration helpers
- Testing support functions

## SQL Formatting

### General Formatting Rules

- Use 2-space indentation consistently
- Capitalize SQL keywords (SELECT, FROM, WHERE, etc.)
- Place each major clause on a new line
- Align related elements vertically when it improves readability
- Use consistent comma placement (trailing commas preferred)

### Table Definitions

```sql
CREATE TABLE {schema}.example (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Relationships
  parent_id UUID NULL REFERENCES {schema}.parent(id),
  owner_id UUID NOT NULL REFERENCES {schema}.user(id),

  -- Business Data
  handle TEXT NOT NULL,
  name TEXT NOT NULL,
  data JSONB NOT NULL,

  -- Lifecycle Management
  active_from TIMESTAMPTZ NULL,
  active_until TIMESTAMPTZ NULL,
  deleted_at TIMESTAMPTZ NULL,

  -- System Fields
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NULL,

  -- Constraints
  CONSTRAINT chk_handle_format CHECK (handle ~ '^[a-z0-9\-_]{3,32}$')
);
```

### Query Formatting

```sql
SELECT
  o.id,
  o.handle,
  o.name,
  u.email
FROM
  {schema}.organization o
  INNER JOIN {schema}.user u ON o.owner_id = u.id
WHERE
  o.deleted_at IS NULL
  AND u.active = true
ORDER BY
  o.created_at DESC;
```

## Documentation Standards

### Table Documentation

Each table file should include:

```sql
/*
Purpose: [Brief description of what this table stores and why it exists]

Key Concepts:
- [Concept 1]: [Explanation]
- [Concept 2]: [Explanation]

Provides:
- [Capability 1]: [Description]
- [Capability 2]: [Description]
*/
```

### Column Comments

All columns should have descriptive comments:

```sql
COMMENT ON COLUMN {schema}.organization.handle IS
  'Unique identifier for human-readable URLs and references';
COMMENT ON COLUMN {schema}.organization.name IS
  'Display name for the organization';
```

### Function Documentation

Functions should include comprehensive header comments:

```sql
/*
Purpose: [What this function does and why it exists]
Parameters: [Description of each parameter]
Returns: [Description of return value/type]
Security: [Security considerations and access requirements]
*/
```

## Access Control Patterns

### Multi-Tenancy

For multi-tenant systems, implement consistent isolation:

- Include tenant identifier (e.g., `org_id`, `workspace_id`) in all tenant-scoped tables
- Use foreign key constraints to enforce relationship integrity within tenant boundaries
- Implement Row-Level Security (RLS) policies for automatic filtering
- Create views that filter by tenant membership

### Row-Level Security (RLS)

```sql
-- Enable RLS on table
ALTER TABLE {schema}.document ENABLE ROW LEVEL SECURITY;

-- Policy for users to see only their organization's documents
CREATE POLICY document_isolation ON {schema}.document
  FOR SELECT
  USING (
    org_id IN (
      SELECT org_id
      FROM {schema}.membership
      WHERE user_id = auth.uid()
    )
  );
```

## Testing & Quality Assurance

### Running Tests

```bash
# Example commands (adjust based on your project setup)
pnpm db:test                    # Run all database tests
pnpm db:reset                   # Reset database and run migrations
pnpm db:migrate                 # Apply migrations
```

### PGTap Assertion Functions

| Function | Purpose |
|----------|---------|
| `is(value, expected, description)` | Tests if value equals expected |
| `isnt(value, not_expected, description)` | Tests if value does not equal |
| `is_empty(query, description)` | Tests if query returns no rows |
| `lives_ok(sql, description)` | Tests if SQL executes without errors |
| `throws_ok(sql, error_code, message, description)` | Tests if SQL throws specific error |
| `has_function(schema, name, params, description)` | Tests if function exists |

### Test Organization

```sql
SELECT plan(n);           -- Declare number of tests
SET ROLE role_name;       -- Set role for permission testing
-- ... test assertions ...
SELECT * FROM finish();   -- Complete test run
```

### Database Testing Standards

- Test all functions with valid and invalid inputs
- Verify access control rules work correctly
- Test multi-tenant isolation boundaries
- Validate schema constraints and triggers

### Schema Validation

- JSON Schema validation at application layer with database backup
- Issue tracking for validation failures with resolution workflows
- Schema versioning through `active_from`/`active_until` timestamps
- Migration paths via `migration_target_schema_id` references

### Performance Testing

- Monitor query performance with EXPLAIN ANALYZE
- Test with realistic data volumes
- Validate index effectiveness
- Profile JSONB query patterns

## Development Workflow

Recommended workflow for schema changes:

1. Create or modify schema files following the naming and organization conventions
2. Apply migrations to development database
3. Run linting and formatting checks
4. Execute database tests to verify changes
5. Review generated SQL for correctness and performance
6. Commit changes with descriptive commit messages

## Best Practices Summary

- **Consistency**: Follow naming conventions strictly across all schema objects
- **Documentation**: Comment all tables, columns, and complex functions
- **Organization**: Group related objects logically using schemas and file prefixes
- **Security**: Use RLS policies and schema-level permissions appropriately
- **Performance**: Add indexes for foreign keys and frequently queried columns
- **Testing**: Write comprehensive tests for all functions and constraints
- **Versioning**: Use migrations for all schema changes, never modify existing migration files

---

**License**: This documentation is licensed under [CC-BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/)
by Regardio.
