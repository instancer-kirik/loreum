# Context Drop Migration Resolution

## Problem Summary

We had conflicting migration files for handling context drops:

- `009_fix_context_drop_constraint.sql` - Added `context-drop` to templates table constraint
- `009_cleanup_old_context_drops.sql` - Removed `context-drop` from templates table constraint

This created a migration conflict where the same migration number (009) did opposite things.

## Resolution

**Migration 012** (`012_resolve_context_drop_conflicts.sql`) was created to cleanly resolve this conflict by:

1. **Migrating existing context-drop templates** to the dedicated `context_drops` table
2. **Removing context-drop records** from `loreum_ipsumarium_templates`
3. **Updating the constraint** to exclude `context-drop` from allowed template types
4. **Cleaning up old functions/triggers** that were template-based
5. **Ensuring proper triggers** exist on the `context_drops` table

## Final Architecture

### Before (Conflicted State)
- Context drops stored in `loreum_ipsumarium_templates` as `type = 'context-drop'`
- Conflicting migration files
- Mixed responsibilities in templates table

### After (Clean State)
- **Templates**: `loreum_ipsumarium_templates` - Only for game entity templates
- **Context Drops**: `context_drops` - Dedicated table for conversation exports
- **Clear separation** of concerns
- **No migration conflicts**

## Deprecated Files

These files have been renamed with `.DEPRECATED` extension and should be ignored:

- `009_fix_context_drop_constraint.sql.DEPRECATED`
- `009_cleanup_old_context_drops.sql.DEPRECATED`

## Current Migration Sequence

```
008_add_context_drop_support.sql     # Added initial context-drop support
010_create_context_drops_table.sql   # Created dedicated context_drops table  
011_remove_context_drop_from_templates.sql  # Placeholder/verification
012_resolve_context_drop_conflicts.sql      # FINAL RESOLUTION
```

## Database Schema State

After running migration 012:

### `loreum_ipsumarium_templates` table:
- **Constraint**: Excludes `context-drop` type
- **No context-drop records**
- **Clean template-only data**

### `context_drops` table:
- **All context drops** migrated from templates
- **Proper triggers** for computed fields
- **Full-text search** capabilities
- **Entity annotation** support

## Next Steps

1. **Run migration 012** to resolve conflicts: `psql -f 012_resolve_context_drop_conflicts.sql`
2. **Verify the migration** worked by checking record counts
3. **Update application code** to use `context_drops` table instead of templates for context drops
4. **Remove deprecated files** once confident everything works

## Verification Commands

```sql
-- Verify no context-drops in templates
SELECT COUNT(*) FROM loreum_ipsumarium_templates WHERE type = 'context-drop';
-- Should return 0

-- Verify context drops in dedicated table  
SELECT COUNT(*) FROM context_drops;
-- Should show your migrated records

-- Verify constraint excludes context-drop
SELECT pg_get_constraintdef(oid) 
FROM pg_constraint 
WHERE conname = 'loreum_ipsumarium_templates_type_check';
-- Should NOT contain 'context-drop'
```

## Lessons Learned

1. **Migration numbering conflicts** can cause serious issues
2. **Dedicated tables** are better than overloading existing tables
3. **Clear migration sequences** prevent conflicts
4. **Always verify migration state** before applying new migrations