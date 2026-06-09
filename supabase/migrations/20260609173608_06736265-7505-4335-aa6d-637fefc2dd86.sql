
CREATE OR REPLACE FUNCTION public.generate_access_codes_batch(count INT)
RETURNS INT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  inserted INT := 0;
  new_code TEXT;
  i INT := 0;
BEGIN
  WHILE i < count LOOP
    new_code := public.generate_access_code();
    BEGIN
      INSERT INTO public.access_codes (code) VALUES (new_code);
      inserted := inserted + 1;
      i := i + 1;
    EXCEPTION WHEN unique_violation THEN
      NULL;
    END;
  END LOOP;
  RETURN inserted;
END;
$$;

REVOKE EXECUTE ON FUNCTION public.generate_access_codes_batch(INT) FROM PUBLIC, anon, authenticated;
