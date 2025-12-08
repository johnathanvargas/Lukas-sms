-- Up: Apply changes
-- Ensure updated_at column exists (safe / idempotent)
ALTER TABLE public.items
  ADD COLUMN IF NOT EXISTS updated_at timestamptz DEFAULT now();

-- Create or replace trigger function that sets NEW.updated_at = now() on UPDATE
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Drop any existing trigger of the same name (idempotent) and create the trigger
DROP TRIGGER IF EXISTS items_set_updated_at ON public.items;
CREATE TRIGGER items_set_updated_at
  BEFORE UPDATE ON public.items
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();

-- Notes:
-- * This migration is safe to run multiple times (uses IF NOT EXISTS / DROP IF EXISTS).
-- * If the updated_at column already existed, the ALTER TABLE above is a no-op.
-- * If your DB already applied this trigger manually, this migration will reconcile schema with the repo.
-- * Manual verification after migration: SELECT trigger_name FROM information_schema.triggers WHERE event_object_table = 'items';

-- Down: Rollback changes
-- The following removes the trigger and the function.
-- NOTE: Do NOT drop the updated_at column unconditionally unless you are certain this migration created it.
-- If you DID want to drop the column during rollback and you are certain, uncomment the DROP COLUMN line below.

-- Remove trigger and function
DROP TRIGGER IF EXISTS items_set_updated_at ON public.items;
DROP FUNCTION IF EXISTS public.set_updated_at();

-- OPTIONAL manual action (UNCOMMENT TO DROP the updated_at column if this migration originally added it and you're rolling back):
-- ALTER TABLE public.items DROP COLUMN IF EXISTS updated_at;
