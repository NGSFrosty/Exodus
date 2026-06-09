
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.generate_access_code() FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION public.generate_access_code()
RETURNS TEXT LANGUAGE plpgsql SET search_path = public AS $$
DECLARE
  prefixes TEXT[] := ARRAY['CRYPTO','ACCESS','VAULT','NEBULA','EXODUS'];
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  part1 TEXT := '';
  part2 TEXT := '';
  i INT;
BEGIN
  FOR i IN 1..5 LOOP
    part1 := part1 || substr(chars, (floor(random()*length(chars))+1)::int, 1);
    part2 := part2 || substr(chars, (floor(random()*length(chars))+1)::int, 1);
  END LOOP;
  RETURN prefixes[1 + floor(random()*array_length(prefixes,1))::int] || '-' || part1 || '-' || part2;
END; $$;
