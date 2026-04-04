---

title: SQL Schema Standards
type: concept
status: published
summary: SQL schema styling and structure guidelines for PostgreSQL and Supabase projects
related: [naming-conventions, api-standards]
locale: en-US
---

# SQL Schema Standards

SQL schema styling and structure guidelines for PostgreSQL and Supabase projects.

## Impulse

Database work needs clear structural standards because schema decisions are costly to reverse once they shape application behavior.

- Inconsistent SQL structure makes schemas harder to maintain
- Weak naming and placement choices blur access boundaries and intent
- Shared standards help teams design schema, functions, and policies with the same assumptions

## Signal

SQL quality depends on more than syntax. Organization, naming, security, and testing all shape whether a schema remains workable over time.

- Schema placement communicates responsibility and exposure
- Naming and formatting affect readability across migrations and reviews
- Functions, access control, and tests reveal where structural discipline matters most

## Effect

There are several ways to document database standards.

- A style-only guide helps formatting, but misses architectural concerns
- Team-local conventions can fit one system, but they drift across projects
- A combined schema and function standard gives teams a shared basis for structural SQL work

## Accord

We use shared SQL standards to keep PostgreSQL and Supabase schemas legible, secure, and maintainable across Regardio projects.

- Prefer explicit naming and schema placement
- Treat security and access control as part of schema design
- Keep documentation and testing close to the database objects they describe

## Action

Use the patterns below when designing schemas, naming functions, formatting SQL, and testing database behavior.

### Schema Organization

#### Schema Structure

- **`public`** - User-facing API (views, functions)
- **`private`** - Core data storage, relational integrity
- **`util`/`tools`** - Utility functions, development helpers
- **`extensions`** - Third-party extensions

### File Organization

#### File Structure

```sql
/*
 * [Entity/Domain Name]
 * Purpose: [Brief description]
 * Schema: [schema_name]
 */

-- Definitions, Indexes, Triggers, Comments, Permissions
```

### Naming Conventions

- Use `snake_case` for all identifiers
- Singular form for table names (`user`, not `users`)
- Consistent suffixes: `_id`, `_intl`, `_at`

```sql
CREATE TABLE {schema}.{table_name} (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  handle TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NULL
);
```

#### Function Naming

**Pattern Categories:**

1. **Entity Management**: `{entity}_{verb}` or `{entity}_{verb}_{context}`
   - `user_create`, `member_invite_to_group`, `ownership_transfer`

2. **Domain Utilities**: `{domain}_{verb}_{target}`
   - `jsonb_is_boolean`, `storage_get_usage`, `model_get_schema`

3. **Access Control**: `{entity}_{check/is}_{condition}`
   - `user_is_owner_of_entity`, `access_check_resource_permissions`

4. **Private Helpers**: `{entity}_{get/has}_{property}`
   - `private.user_get_id()`, `private.user_has_admin_override()`

**Standard Verbs**: `get`, `list`, `create`, `update`, `delete`, `check`, `is`, `has`, `filter`, `transfer`

**Domain Prefixes**: `auth`, `user`, `group`, `content`, `jsonb`, `storage`, `model`, `util`

#### Constraint, Index, and Trigger Naming

- **Constraints**: `chk_[field]_[purpose]`, `fk_[field]`, `uq_[field]`
- **Indexes**: `idx_[field]`, `idx_unique_[field]`
- **Triggers**: `trg_[purpose]`

```sql
ADD CONSTRAINT chk_handle_format CHECK (handle ~ '^[a-z0-9\-_]{3,32}$');
CREATE UNIQUE INDEX idx_unique_handle ON {schema}.{table}(handle);
CREATE TRIGGER trg_updated_at BEFORE UPDATE ON {schema}.{table}
  FOR EACH ROW EXECUTE FUNCTION {schema}.time_set_updated();
```

### Table Design

#### Standard Structure

Group fields logically:

```sql
CREATE TABLE {schema}.{entity} (
  -- Identity
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Relationships
  parent_id UUID NULL REFERENCES {schema}.parent(id),
  owner_id UUID NOT NULL REFERENCES {schema}.user(id),
  -- Business Data
  handle TEXT NOT NULL,
  name TEXT NOT NULL,
  data JSONB NOT NULL,
  -- Lifecycle
  active_from TIMESTAMPTZ NULL,
  active_until TIMESTAMPTZ NULL,
  deleted_at TIMESTAMPTZ NULL,
  -- System
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NULL
);
```

#### JSONB Fields

- Validate against JSON Schema 2020-12
- Include GIN indexes for searchability
- Use `_intl` suffix for internationalized content

### Function Standards

- Declare volatility (IMMUTABLE, STABLE, VOLATILE)
- Set security context (SECURITY DEFINER/INVOKER)
- Specify language (LANGUAGE plpgsql)
- Secure search path (SET search_path = '')
- Use schema-qualified names

```sql
CREATE OR REPLACE FUNCTION {schema}.time_get_effective_dates(
    p_active_from TIMESTAMPTZ,
    p_active_until TIMESTAMPTZ
  ) RETURNS TABLE(
    effective_active_from TIMESTAMPTZ,
    effective_active_until TIMESTAMPTZ
  )
  LANGUAGE plpgsql IMMUTABLE SET search_path = ''
AS $function$
BEGIN
  RETURN QUERY SELECT COALESCE(p_active_from, NOW()), p_active_until;
END;
$function$;
```

#### Schema Placement

- **Public**: API endpoints, business logic, access control
- **Private**: Data manipulation, complex logic, performance-critical
- **Tools**: Development utilities, migrations, testing

### SQL Formatting

- 2-space indentation
- Capitalize SQL keywords
- Major clauses on new lines
- Trailing commas preferred

```sql
SELECT o.id, o.handle, o.name, u.email
FROM {schema}.organization o
  INNER JOIN {schema}.user u ON o.owner_id = u.id
WHERE o.deleted_at IS NULL AND u.active = true
ORDER BY o.created_at DESC;
```

### Documentation

- Add purpose comments to tables and functions
- Comment all columns with descriptions
- Document security considerations

```sql
/* Purpose: Stores organization data with multi-tenant isolation */
CREATE TABLE {schema}.organization (...);

COMMENT ON COLUMN {schema}.organization.handle IS 'Unique identifier for URLs';
```

### Access Control

#### Multi-Tenancy

- Include tenant identifier in tenant-scoped tables
- Use foreign keys for relationship integrity
- Implement RLS policies for automatic filtering

```sql
ALTER TABLE {schema}.document ENABLE ROW LEVEL SECURITY;

CREATE POLICY document_isolation ON {schema}.document FOR SELECT
  USING (org_id IN (
    SELECT org_id FROM {schema}.membership WHERE user_id = auth.uid()
  ));
```

### Testing

#### PGTap Assertions

- `is(value, expected, description)` - Equality test
- `throws_ok(sql, error_code, message, description)` - Error test
- `has_function(schema, name, params, description)` - Function existence

```sql
SELECT plan(n);
SET ROLE role_name;
-- test assertions
SELECT * FROM finish();
```

#### Testing Standards

- Test functions with valid and invalid inputs
- Verify access control rules
- Test multi-tenant isolation
- Validate constraints and triggers
- Use EXPLAIN ANALYZE for performance

### Best Practices

- Follow naming conventions strictly
- Comment tables, columns, and functions
- Use RLS policies appropriately
- Add indexes for foreign keys and frequent queries
- Use migrations for all schema changes

## Essence

This document gives database work a shared structural language.

- Schemas and functions stay easier to reason about over time
- Security and access control remain visible in schema design
- Reviews can focus on trade-offs instead of avoidable inconsistency

Related documents:

- [Naming Conventions](../conventions/naming.md) — Consistent naming patterns across Regardio projects
- [API Design Standards](./api.md) — API design and implementation guidelines for Regardio projects
