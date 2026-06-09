import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

export const activateCode = createServerFn({ method: "POST" })
  .inputValidator((data) =>
    z.object({ code: z.string().trim().min(1) }).parse(data)
  )
  .middleware([requireSupabaseAuth])
  .handler(async ({ data, context }) => {
    const { supabase, userId } = context;

    if (!data?.code) {
      return { success: false, error: "No code provided" };
    }

    const normalized = data.code.toUpperCase().trim();

    // 1. Fetch code safely
    const { data: codeRow, error: fetchErr } = await supabase
      .from("access_codes")
      .select("id, code, status")
      .eq("code", normalized)
      .maybeSingle();

    if (fetchErr) {
      console.error("Supabase fetch error:", fetchErr);
      return { success: false, error: "Database error while validating code" };
    }

    if (!codeRow) {
      return { success: false, error: "Invalid code" };
    }

    if (codeRow.status === "used") {
      return { success: false, error: "Code already used" };
    }

    if (codeRow.status === "disabled") {
      return { success: false, error: "Code disabled" };
    }

    const now = new Date().toISOString();

    // 2. Mark code as used
    const { error: updateCodeErr } = await supabase
      .from("access_codes")
      .update({
        status: "used",
        used_at: now,
        used_by: userId,
      })
      .eq("id", codeRow.id);

    if (updateCodeErr) {
      console.error("Update code error:", updateCodeErr);
      return { success: false, error: "Failed to activate code" };
    }

    // 3. Update profile safely (upsert-safe)
    const { error: profileErr } = await supabase
      .from("profiles")
      .update({
        activated: true,
        activated_at: now,
      })
      .eq("id", userId);

    if (profileErr) {
      console.error("Profile update error:", profileErr);
      return { success: false, error: "Failed to update profile" };
    }

    return { success: true, error: null };
  });

export const getActivationStatus = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { supabase, userId } = context;

    const { data, error } = await supabase
      .from("profiles")
      .select("activated")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("Profile fetch error:", error);
      return { activated: false };
    }

    return { activated: data?.activated ?? false };
  });