
-- ta_providers
CREATE TABLE public.ta_providers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  organisation_id uuid REFERENCES public.organisations(id),
  user_id uuid NOT NULL,
  expertise_areas text[] DEFAULT '{}',
  counties_served text[] DEFAULT '{}',
  availability_status public.ta_availability NOT NULL DEFAULT 'available',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.ta_providers ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage ta_providers" ON public.ta_providers FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "TA providers can view own" ON public.ta_providers FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "TA providers can update own" ON public.ta_providers FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "TA providers can insert own" ON public.ta_providers FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE TRIGGER update_ta_providers_updated_at BEFORE UPDATE ON public.ta_providers FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- financing_applications
CREATE TABLE public.financing_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  institution_id uuid NOT NULL REFERENCES public.institutions(id),
  financing_type public.financing_type NOT NULL,
  amount_requested_ksh numeric DEFAULT 0,
  status public.financing_status NOT NULL DEFAULT 'draft',
  funder_organisation_id uuid REFERENCES public.organisations(id),
  submitted_at timestamptz,
  decision_at timestamptz,
  disbursed_at timestamptz,
  disbursement_amount_ksh numeric DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.financing_applications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage financing" ON public.financing_applications FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can view financing" ON public.financing_applications FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert financing" ON public.financing_applications FOR INSERT TO authenticated WITH CHECK (true);
CREATE TRIGGER update_financing_updated_at BEFORE UPDATE ON public.financing_applications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- dmrv_records
CREATE TABLE public.dmrv_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id),
  recorded_at timestamptz NOT NULL DEFAULT now(),
  meals_verified integer DEFAULT 0,
  usage_hours numeric DEFAULT 0,
  co2_verified_tonnes numeric DEFAULT 0,
  verification_method public.verification_method NOT NULL DEFAULT 'manual_survey',
  verifier_id uuid,
  status public.dmrv_status NOT NULL DEFAULT 'pending',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.dmrv_records ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage dmrv" ON public.dmrv_records FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can view dmrv" ON public.dmrv_records FOR SELECT TO authenticated USING (true);
CREATE POLICY "Verifiers can insert dmrv" ON public.dmrv_records FOR INSERT WITH CHECK (has_role(auth.uid(), 'dmrv_verifier'));
CREATE POLICY "Verifiers can update dmrv" ON public.dmrv_records FOR UPDATE USING (has_role(auth.uid(), 'dmrv_verifier'));
CREATE TRIGGER update_dmrv_updated_at BEFORE UPDATE ON public.dmrv_records FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- opex_contracts
CREATE TABLE public.opex_contracts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id),
  provider_id uuid REFERENCES public.providers(id),
  contract_type public.contract_type NOT NULL DEFAULT 'maintenance',
  start_date date,
  end_date date,
  monthly_value_ksh numeric DEFAULT 0,
  renewal_alert_days integer DEFAULT 30,
  status public.contract_status NOT NULL DEFAULT 'active',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.opex_contracts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage opex" ON public.opex_contracts FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can view opex" ON public.opex_contracts FOR SELECT TO authenticated USING (true);
CREATE TRIGGER update_opex_updated_at BEFORE UPDATE ON public.opex_contracts FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- support_tickets
CREATE TABLE public.support_tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES public.projects(id),
  raised_by uuid,
  assigned_to_provider_id uuid REFERENCES public.providers(id),
  title text NOT NULL,
  description text,
  priority public.ticket_priority NOT NULL DEFAULT 'medium',
  status public.ticket_status NOT NULL DEFAULT 'open',
  created_at timestamptz NOT NULL DEFAULT now(),
  resolved_at timestamptz,
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.support_tickets ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage tickets" ON public.support_tickets FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can view tickets" ON public.support_tickets FOR SELECT TO authenticated USING (true);
CREATE POLICY "Authenticated can insert tickets" ON public.support_tickets FOR INSERT TO authenticated WITH CHECK (true);
CREATE TRIGGER update_tickets_updated_at BEFORE UPDATE ON public.support_tickets FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- programmes
CREATE TABLE public.programmes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  programme_manager_id uuid,
  target_institution_count integer DEFAULT 0,
  county_scope text[] DEFAULT '{}',
  total_budget_ksh numeric DEFAULT 0,
  status public.programme_status NOT NULL DEFAULT 'planning',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.programmes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage programmes" ON public.programmes FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "PM can manage own programmes" ON public.programmes FOR ALL USING (auth.uid() = programme_manager_id);
CREATE POLICY "Authenticated can view programmes" ON public.programmes FOR SELECT TO authenticated USING (true);
CREATE TRIGGER update_programmes_updated_at BEFORE UPDATE ON public.programmes FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- procurement_rfqs
CREATE TABLE public.procurement_rfqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  programme_id uuid NOT NULL REFERENCES public.programmes(id),
  title text NOT NULL,
  scope_description text,
  submission_deadline timestamptz,
  status public.rfq_status NOT NULL DEFAULT 'draft',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.procurement_rfqs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage rfqs" ON public.procurement_rfqs FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "PM can manage rfqs" ON public.procurement_rfqs FOR ALL USING (
  EXISTS (SELECT 1 FROM public.programmes p WHERE p.id = procurement_rfqs.programme_id AND p.programme_manager_id = auth.uid())
);
CREATE POLICY "Authenticated can view rfqs" ON public.procurement_rfqs FOR SELECT TO authenticated USING (true);
CREATE TRIGGER update_rfqs_updated_at BEFORE UPDATE ON public.procurement_rfqs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- rfq_responses
CREATE TABLE public.rfq_responses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  rfq_id uuid NOT NULL REFERENCES public.procurement_rfqs(id),
  provider_id uuid NOT NULL REFERENCES public.providers(id),
  proposed_value_ksh numeric DEFAULT 0,
  proposal_summary text,
  submitted_at timestamptz DEFAULT now(),
  status public.rfq_response_status NOT NULL DEFAULT 'submitted',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
ALTER TABLE public.rfq_responses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins can manage responses" ON public.rfq_responses FOR ALL USING (has_role(auth.uid(), 'admin'));
CREATE POLICY "Authenticated can view responses" ON public.rfq_responses FOR SELECT TO authenticated USING (true);
CREATE POLICY "Providers can insert responses" ON public.rfq_responses FOR INSERT TO authenticated WITH CHECK (true);
CREATE TRIGGER update_rfq_responses_updated_at BEFORE UPDATE ON public.rfq_responses FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
