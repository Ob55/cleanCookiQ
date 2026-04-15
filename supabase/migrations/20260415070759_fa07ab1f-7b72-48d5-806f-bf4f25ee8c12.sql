
-- Update default approval_status to 'approved' for new profiles
ALTER TABLE public.profiles ALTER COLUMN approval_status SET DEFAULT 'approved';

-- Update existing pending profiles to approved
UPDATE public.profiles SET approval_status = 'approved' WHERE approval_status = 'pending';

-- Create function to auto-assign role based on org_type metadata
CREATE OR REPLACE FUNCTION public.handle_new_user_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  _org_type text;
  _role public.app_role;
BEGIN
  _org_type := NEW.raw_user_meta_data->>'org_type';
  
  IF _org_type = 'institution' THEN
    _role := 'institution_admin';
  ELSIF _org_type = 'supplier' THEN
    _role := 'ta_provider';
  ELSIF _org_type = 'funder' THEN
    _role := 'financing_partner';
  ELSE
    RETURN NEW;
  END IF;

  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role)
  ON CONFLICT (user_id, role) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Create trigger on auth.users for role assignment
CREATE TRIGGER on_auth_user_created_assign_role
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_role();
