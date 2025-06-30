# Context Drop Migration State and Action Plan

## Current State Analysis

### What Actually Happened
1. **Migration 008** (`008_add_context_drop_support.sql`) was run
   - Added `context-drop` to the templates table type constraint
   - Created a VIEW called `context_drops` that queries from `loreum_ipsumarium_templates`
   - Created functions and triggers for context drops within the templates system

2. **Migration 009** - You have two conflicting files (both renamed to `.DEPRECATED`)
   - One adds `context-drop` to constraint (redundant since 008 already did this)
   - One removes `context-drop` from constraint (the cleanup approach)

3. **Migration 010** (`010_create_context_drops_table.sql`) - **NOT RUN YET**
   - This would create a proper dedicated `context_drops` TABLE
   - But it hasn't been run, so `context_drops` is still just a VIEW

4. **Migration 011** - Verification/cleanup file

5. **Migration 012** - The one you just tried to run

### Current Database State
- ✅ `context-drop` is in the templates constraint
- ✅ 2 context-drop records exist in `loreum_ipsumarium_templates`
- ✅ `context_drops` exists as a VIEW (not a table)
- ❌ No dedicated `context_drops` table exists

## The Problem
The migration sequence assumes `context_drops` is a TABLE (from migration 010), but it's actually a VIEW (from migration 008). This is why you're getting column mismatch errors.

## Recommended Action Plan

### Option 1: Complete Separation (Recommended)
Run these migrations in order:

1. **Run the updated `012_cleanup_context_drop_migration.sql`**
   - This will clean up the templates table
   - Remove `context-drop` from the constraint
   - Drop the old VIEW

2. **Run `010_create_context_drops_table.sql`**
   - This creates the proper dedicated table
   - Sets up proper columns and triggers
   - Now you'll have a real `context_drops` table

3. **Manually migrate the data** (if needed)
   ```sql
   -- After running both migrations above, if you need the old data:
   -- You'll need to reconstruct it from backups or logs since
   -- the templates were deleted in step 1
   ```

### Option 2: Keep Everything in Templates (Not Recommended)
If you want to keep using templates for context drops:

1. Don't run any more migrations
2. Keep using the current VIEW-based approach
3. Delete the conflicting migration files

### Option 3: Backup First, Then Migrate
If you want to preserve the existing context-drop data:

1. **First, backup the data:**
   ```sql
   CREATE TABLE context_drops_backup AS
   SELECT * FROM loreum_ipsumarium_templates 
   WHERE type = 'context-drop';
   ```

2. **Then run migrations 012 and 010 as in Option 1**

3. **Restore data to the new table:**
   ```sql
   INSERT INTO context_drops (id, name, description, raw_content, ...)
   SELECT id, name, description, 
          metadata->>'raw_content', ...
   FROM context_drops_backup;
   ```

## Final Architecture Decision

You need to decide:
- **Separate Tables**: Better architecture, cleaner separation of concerns
- **Everything in Templates**: Simpler but mixes different concepts

The migration files assume you want separate tables, which is the better long-term choice.

## Migration File Status

| File | Status | Purpose |
|------|--------|---------|
| 008_add_context_drop_support.sql | ✅ Applied | Added context-drop to templates |
| 009_fix_context_drop_constraint.sql.DEPRECATED | ❌ Skip | Conflicting, deprecated |
| 009_cleanup_old_context_drops.sql.DEPRECATED | ❌ Skip | Conflicting, deprecated |
| 010_create_context_drops_table.sql | ⏳ To Run | Creates dedicated table |
| 011_remove_context_drop_from_templates.sql | ⏳ Optional | Verification only |
| 012_cleanup_context_drop_migration.sql | ⏳ To Run | Cleans up templates |

## Quick Fix Commands

```bash
# If you want to proceed with separation:
psql -f 012_cleanup_context_drop_migration.sql
psql -f 010_create_context_drops_table.sql

# If you want to check current state first:
psql -f check_migration_state.sql
```
