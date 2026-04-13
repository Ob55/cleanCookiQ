
-- Provider Products table
CREATE TABLE public.provider_products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  price NUMERIC,
  image_url TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.provider_products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage products" ON public.provider_products FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authenticated can view products" ON public.provider_products FOR SELECT TO authenticated USING (true);
CREATE POLICY "Creators can manage own products" ON public.provider_products FOR ALL TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);

-- Provider Services table
CREATE TABLE public.provider_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  details TEXT,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.provider_services ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage services" ON public.provider_services FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authenticated can view services" ON public.provider_services FOR SELECT TO authenticated USING (true);
CREATE POLICY "Creators can manage own services" ON public.provider_services FOR ALL TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);

-- Provider Documents table
CREATE TABLE public.provider_documents (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  file_url TEXT,
  document_type TEXT DEFAULT 'project_photo',
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.provider_documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage documents" ON public.provider_documents FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Creators can manage own documents" ON public.provider_documents FOR ALL TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);

-- Institution Needs table (admin creates, suppliers view)
CREATE TABLE public.institution_needs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution_id UUID NOT NULL REFERENCES public.institutions(id) ON DELETE CASCADE,
  description TEXT NOT NULL,
  technology_type TEXT,
  status TEXT NOT NULL DEFAULT 'open',
  created_by UUID,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.institution_needs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage needs" ON public.institution_needs FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Authenticated can view needs" ON public.institution_needs FOR SELECT TO authenticated USING (true);

-- Supplier Interest table
CREATE TABLE public.supplier_interest (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  need_id UUID NOT NULL REFERENCES public.institution_needs(id) ON DELETE CASCADE,
  provider_id UUID NOT NULL REFERENCES public.providers(id) ON DELETE CASCADE,
  user_id UUID NOT NULL,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'expressed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(need_id, provider_id)
);

ALTER TABLE public.supplier_interest ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage interest" ON public.supplier_interest FOR ALL USING (public.has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Users can insert own interest" ON public.supplier_interest FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own interest" ON public.supplier_interest FOR SELECT TO authenticated USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'::app_role));

-- Storage bucket for supplier assets
INSERT INTO storage.buckets (id, name, public) VALUES ('supplier-assets', 'supplier-assets', true);

CREATE POLICY "Authenticated can upload supplier assets" ON storage.objects FOR INSERT TO authenticated WITH CHECK (bucket_id = 'supplier-assets');
CREATE POLICY "Public can view supplier assets" ON storage.objects FOR SELECT USING (bucket_id = 'supplier-assets');
CREATE POLICY "Authenticated can update own supplier assets" ON storage.objects FOR UPDATE TO authenticated USING (bucket_id = 'supplier-assets');
CREATE POLICY "Authenticated can delete own supplier assets" ON storage.objects FOR DELETE TO authenticated USING (bucket_id = 'supplier-assets');

-- Triggers for updated_at
CREATE TRIGGER update_provider_products_updated_at BEFORE UPDATE ON public.provider_products FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_provider_services_updated_at BEFORE UPDATE ON public.provider_services FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_institution_needs_updated_at BEFORE UPDATE ON public.institution_needs FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
