-- Add new columns to institutions table for onboarding
ALTER TABLE public.institutions
  ADD COLUMN IF NOT EXISTS ownership_type text,
  ADD COLUMN IF NOT EXISTS consumption_per_term numeric DEFAULT 0,
  ADD COLUMN IF NOT EXISTS consumption_unit text,
  ADD COLUMN IF NOT EXISTS wishes_to_transition_steam boolean DEFAULT false,
  ADD COLUMN IF NOT EXISTS setup_completed boolean DEFAULT false;

-- Allow authenticated users to insert their own institution records
CREATE POLICY "Authenticated users can create institutions"
  ON public.institutions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = created_by);

-- Allow institution creators to update their own records
CREATE POLICY "Creators can update own institutions"
  ON public.institutions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = created_by);