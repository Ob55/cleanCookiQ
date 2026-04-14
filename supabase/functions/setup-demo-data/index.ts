import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
  const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(supabaseUrl, serviceKey, { auth: { autoRefreshToken: false, persistSession: false } });

  const keepEmail = "brian55mwangi@gmail.com";
  const password = "Demo@2026!";

  // Get all users except the one to keep
  const { data: { users: allUsers } } = await admin.auth.admin.listUsers({ perPage: 1000 });
  const toDelete = allUsers?.filter(u => u.email !== keepEmail) ?? [];
  
  for (const u of toDelete) {
    // Delete profile, roles, and related data first
    await admin.from("user_roles").delete().eq("user_id", u.id);
    await admin.from("funder_profiles").delete().eq("user_id", u.id);
    await admin.from("profiles").delete().eq("user_id", u.id);
    await admin.auth.admin.deleteUser(u.id);
  }

  // Ensure brian has admin role
  const brianUser = allUsers?.find(u => u.email === keepEmail);
  if (brianUser) {
    const { data: existingRole } = await admin.from("user_roles").select("id").eq("user_id", brianUser.id).eq("role", "admin").single();
    if (!existingRole) {
      await admin.from("user_roles").insert({ user_id: brianUser.id, role: "admin" });
    }
  }

  // Demo users to create
  const demoUsers = [
    { email: "institution@gmail.com", name: "Jane Wanjiku", orgType: "institution", role: "institution_admin" },
    { email: "supplier@gmail.com", name: "Peter Ochieng", orgType: "supplier", role: "ta_provider" },
    { email: "funder@gmail.com", name: "Sarah Kimani", orgType: "funder", role: "financing_partner" },
  ];

  const createdUsers: any[] = [];

  for (const demo of demoUsers) {
    const { data: userData, error } = await admin.auth.admin.createUser({
      email: demo.email,
      password,
      email_confirm: true,
      user_metadata: { full_name: demo.name, org_type: demo.orgType, phone: "+254 700 000 000" },
    });

    if (error) {
      console.error(`Failed to create ${demo.email}:`, error.message);
      continue;
    }

    const userId = userData.user.id;
    createdUsers.push({ email: demo.email, userId, role: demo.role, orgType: demo.orgType });

    // Update profile with phone
    await admin.from("profiles").update({ 
      phone: "+254 700 000 000", 
      approval_status: "approved",
      org_type: demo.orgType 
    }).eq("user_id", userId);

    // Assign role
    await admin.from("user_roles").insert({ user_id: userId, role: demo.role });

    // Funder profile
    if (demo.orgType === "funder") {
      await admin.from("funder_profiles").insert({
        user_id: userId,
        organisation_name: "Green Impact Fund",
        full_name: demo.name,
        funding_type: "grant",
        email: demo.email,
        phone: "+254 700 000 000",
      });
    }
  }

  // --- CREATE DEMO DATA ---

  // Create organisations
  const { data: instOrg } = await admin.from("organisations").insert({
    name: "Nairobi Clean Cooking Initiative",
    org_type: "institution",
    county: "Nairobi",
    contact_email: "info@ncci.co.ke",
    contact_phone: "+254 720 111 111",
  }).select().single();

  const { data: suppOrg } = await admin.from("organisations").insert({
    name: "EcoStove Solutions Ltd",
    org_type: "supplier",
    county: "Nairobi",
    contact_email: "info@ecostove.co.ke",
    contact_phone: "+254 720 222 222",
  }).select().single();

  // Link supplier user to org
  const supplierUser = createdUsers.find(u => u.orgType === "supplier");
  if (supplierUser && suppOrg) {
    await admin.from("profiles").update({ organisation_id: suppOrg.id }).eq("user_id", supplierUser.userId);
  }

  const institutionUser = createdUsers.find(u => u.orgType === "institution");
  if (institutionUser && instOrg) {
    await admin.from("profiles").update({ organisation_id: instOrg.id }).eq("user_id", institutionUser.userId);
  }

  // Create demo institutions
  const institutionRows: any[] = [];
  const demoInstitutions = [
    { name: "Moi Primary School", county: "Nairobi", type: "school", fuel: "firewood", stage: "identified", students: 850, meals: 850, spend: 45000, score: 0 },
    { name: "Kenyatta Hospital Kitchen", county: "Mombasa", type: "hospital", fuel: "charcoal", stage: "assessed", students: 200, meals: 600, spend: 78000, score: 72 },
    { name: "Kamiti Medium Prison", county: "Kiambu", type: "prison", fuel: "firewood", stage: "scored", students: 1200, meals: 3600, spend: 120000, score: 85 },
    { name: "Sunrise Academy", county: "Nakuru", type: "school", fuel: "charcoal", stage: "assessed", students: 420, meals: 420, spend: 32000, score: 68 },
    { name: "Coast General Kitchen", county: "Mombasa", type: "hospital", fuel: "lpg", stage: "matched", students: 150, meals: 500, spend: 95000, score: 78 },
    { name: "Nyeri High School", county: "Nyeri", type: "school", fuel: "firewood", stage: "identified", students: 680, meals: 680, spend: 38000, score: 0 },
    { name: "Lake Hotel & Resort", county: "Kisumu", type: "hotel", fuel: "charcoal", stage: "scored", students: 50, meals: 300, spend: 65000, score: 74 },
    { name: "Mama Ngina Restaurant", county: "Nairobi", type: "restaurant", fuel: "lpg", stage: "contracted", students: 20, meals: 200, spend: 42000, score: 82 },
    { name: "Machakos Industrial Kitchen", county: "Machakos", type: "factory", fuel: "firewood", stage: "installed", students: 500, meals: 1500, spend: 88000, score: 90 },
    { name: "St. Mary's Girls School", county: "Kiambu", type: "school", fuel: "charcoal", stage: "identified", students: 520, meals: 520, spend: 35000, score: 0 },
    { name: "Eldoret County Hospital", county: "Eldoret", type: "hospital", fuel: "firewood", stage: "assessed", students: 300, meals: 900, spend: 105000, score: 71 },
    { name: "Green Valley Academy", county: "Nakuru", type: "school", fuel: "biogas", stage: "monitoring", students: 380, meals: 380, spend: 18000, score: 92 },
  ];

  for (const inst of demoInstitutions) {
    const { data } = await admin.from("institutions").insert({
      name: inst.name,
      county: inst.county,
      institution_type: inst.type,
      current_fuel: inst.fuel,
      pipeline_stage: inst.stage,
      number_of_students: inst.students,
      meals_per_day: inst.meals,
      meals_served_per_day: inst.meals,
      monthly_fuel_spend: inst.spend,
      assessment_score: inst.score,
      assessment_category: inst.score >= 80 ? "high_readiness" : inst.score >= 60 ? "medium_readiness" : inst.score > 0 ? "low_readiness" : null,
      organisation_id: instOrg?.id,
      created_by: institutionUser?.userId || brianUser?.id,
      setup_completed: true,
      contact_person: "Demo Contact",
      contact_email: `contact@${inst.name.toLowerCase().replace(/\s+/g, "")}.co.ke`,
      contact_phone: "+254 7" + String(Math.floor(Math.random() * 100000000)).padStart(8, "0"),
      latitude: -1.28 + (Math.random() - 0.5) * 2,
      longitude: 36.82 + (Math.random() - 0.5) * 4,
      has_dedicated_kitchen: true,
      kitchen_condition: ["good", "fair", "poor"][Math.floor(Math.random() * 3)],
      fuel_of_choice: ["lpg", "biogas", "electric"][Math.floor(Math.random() * 3)],
      recommended_solution: ["LPG System", "Biogas Digester", "Electric Cooker", "Improved Biomass Stove"][Math.floor(Math.random() * 4)],
      transition_interest: ["very_interested", "interested", "exploring"][Math.floor(Math.random() * 3)],
      annual_savings_ksh: inst.spend * 12 * 0.4,
      co2_reduction_tonnes_pa: Math.round(inst.spend * 0.05),
    }).select().single();
    if (data) institutionRows.push(data);
  }

  // Create provider
  const { data: provider } = await admin.from("providers").insert({
    name: "EcoStove Solutions Ltd",
    organisation_id: suppOrg?.id,
    contact_person: "Peter Ochieng",
    contact_email: "supplier@gmail.com",
    contact_phone: "+254 700 000 000",
    provider_category: "equipment_provider",
    technology_types: ["lpg", "biogas", "electric"],
    counties_served: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu"],
    services: ["Installation", "Maintenance", "Training"],
    verified: true,
    rating: 4.5,
  }).select().single();

  // Create provider products
  if (provider) {
    await admin.from("provider_products").insert([
      { provider_id: provider.id, name: "EcoStove Pro 500", description: "Commercial LPG stove for 500+ meals/day", price: 185000, created_by: supplierUser?.userId || brianUser?.id },
      { provider_id: provider.id, name: "BioDigester 2000L", description: "2000L biogas digester with dual burner", price: 320000, created_by: supplierUser?.userId || brianUser?.id },
      { provider_id: provider.id, name: "InduCook 3-Phase", description: "3-phase industrial electric cooker", price: 245000, created_by: supplierUser?.userId || brianUser?.id },
    ]);

    await admin.from("provider_services").insert([
      { provider_id: provider.id, name: "Full Installation Package", details: "Complete installation including plumbing and electrical", price: 45000, created_by: supplierUser?.userId || brianUser?.id },
      { provider_id: provider.id, name: "Annual Maintenance Contract", details: "Quarterly maintenance visits + emergency support", price: 36000, created_by: supplierUser?.userId || brianUser?.id },
      { provider_id: provider.id, name: "Staff Training Programme", details: "2-day training for kitchen staff on new equipment", price: 15000, created_by: supplierUser?.userId || brianUser?.id },
    ]);
  }

  // Create opportunities for some institutions
  for (let i = 0; i < 4 && i < institutionRows.length; i++) {
    await admin.from("opportunities").insert({
      institution_id: institutionRows[i].id,
      title: `Clean cooking transition - ${institutionRows[i].name}`,
      description: `Opportunity to transition ${institutionRows[i].name} from ${institutionRows[i].current_fuel} to clean cooking technology.`,
      technology_required: institutionRows[i].recommended_solution || "LPG System",
      estimated_value: institutionRows[i].monthly_fuel_spend * 24,
      status: "open",
    });
  }

  // Create assessments for assessed institutions
  const assessedInsts = institutionRows.filter(i => ["assessed", "scored", "matched", "contracted", "installed", "monitoring"].includes(i.pipeline_stage));
  for (const inst of assessedInsts) {
    await admin.from("assessments").insert({
      institution_id: inst.id,
      status: "approved",
      assessor_id: brianUser?.id,
      submitted_at: new Date().toISOString(),
      reviewed_at: new Date().toISOString(),
      kitchen_details: { stove_count: 3, fuel_storage: "adequate", ventilation: "good" },
      energy_consumption: { monthly_kwh: inst.monthly_fuel_spend / 10, peak_hours: "6am-2pm" },
      cooking_patterns: { meals_per_day: inst.meals_per_day, cooking_shifts: 2 },
      infrastructure_condition: { electrical: "good", plumbing: "fair", ventilation: "good" },
    });
  }

  // Create a programme
  await admin.from("programmes").insert({
    name: "Kenya National Clean Cooking Transition Phase I",
    description: "National programme to transition 500 institutional kitchens to clean cooking by 2028.",
    status: "active",
    total_budget_ksh: 250000000,
    county_scope: ["Nairobi", "Mombasa", "Kisumu", "Nakuru", "Kiambu"],
    target_institution_count: 500,
    programme_manager_id: brianUser?.id,
  });

  // Create funder institution links
  const funderUser = createdUsers.find(u => u.orgType === "funder");
  if (funderUser) {
    const { data: funderProfile } = await admin.from("funder_profiles").select("id").eq("user_id", funderUser.userId).single();
    if (funderProfile && institutionRows.length >= 3) {
      await admin.from("funder_institution_links").insert([
        { funder_id: funderProfile.id, institution_id: institutionRows[0].id, status: "active" },
        { funder_id: funderProfile.id, institution_id: institutionRows[1].id, status: "active" },
        { funder_id: funderProfile.id, institution_id: institutionRows[2].id, status: "active" },
      ]);
    }
  }

  // Create financing applications
  for (let i = 0; i < 3 && i < institutionRows.length; i++) {
    await admin.from("financing_applications").insert({
      institution_id: institutionRows[i].id,
      financing_type: "grant",
      amount_requested_ksh: institutionRows[i].monthly_fuel_spend * 24,
      status: ["submitted", "under_review", "approved"][i],
      submitted_at: new Date().toISOString(),
    });
  }

  return new Response(JSON.stringify({
    success: true,
    deleted: toDelete.length,
    created: createdUsers.map(u => u.email),
    institutions: institutionRows.length,
    message: "Demo data setup complete",
  }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
