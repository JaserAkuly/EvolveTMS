-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE user_role AS ENUM ('admin', 'carrier', 'shipper', 'viewer');
CREATE TYPE load_status AS ENUM ('created', 'tendered', 'booked', 'in_transit', 'delivered', 'closed');
CREATE TYPE document_type AS ENUM ('bol', 'pod', 'invoice', 'rate_confirmation', 'other');
CREATE TYPE location_type AS ENUM ('pickup', 'delivery', 'warehouse', 'office');
CREATE TYPE payment_status AS ENUM ('pending', 'paid', 'overdue', 'cancelled');
CREATE TYPE journal_type AS ENUM ('ar', 'ap');

-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    display_name TEXT,
    role user_role NOT NULL DEFAULT 'viewer',
    company_name TEXT,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create carriers table
CREATE TABLE carriers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    mc_number TEXT UNIQUE,
    dot_number TEXT UNIQUE,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    country TEXT DEFAULT 'USA',
    insurance_exp DATE,
    w9_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create shippers table
CREATE TABLE shippers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    billing_contact TEXT,
    email TEXT,
    phone TEXT,
    address TEXT,
    city TEXT,
    state TEXT,
    zip TEXT,
    country TEXT DEFAULT 'USA',
    payment_terms INTEGER DEFAULT 30,
    credit_limit DECIMAL(10,2),
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create locations table
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    type location_type NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip TEXT NOT NULL,
    country TEXT DEFAULT 'USA',
    contact_name TEXT,
    contact_phone TEXT,
    contact_email TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create loads table
CREATE TABLE loads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    load_number TEXT UNIQUE NOT NULL,
    origin_id UUID REFERENCES locations(id),
    destination_id UUID REFERENCES locations(id),
    shipper_id UUID REFERENCES shippers(id),
    carrier_id UUID REFERENCES carriers(id),
    pickup_date DATE,
    delivery_date DATE,
    weight DECIMAL(10,2),
    pieces INTEGER,
    commodity TEXT,
    equipment_type TEXT,
    rate DECIMAL(10,2),
    carrier_rate DECIMAL(10,2),
    status load_status DEFAULT 'created',
    notes TEXT,
    created_by UUID REFERENCES auth.users(id),
    assigned_to UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create documents table
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    load_id UUID REFERENCES loads(id) ON DELETE CASCADE,
    type document_type NOT NULL,
    name TEXT NOT NULL,
    url TEXT NOT NULL,
    uploaded_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create invoices table
CREATE TABLE invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT UNIQUE NOT NULL,
    load_id UUID REFERENCES loads(id),
    shipper_id UUID REFERENCES shippers(id),
    amount DECIMAL(10,2) NOT NULL,
    status payment_status DEFAULT 'pending',
    issued_at TIMESTAMPTZ DEFAULT now(),
    due_at TIMESTAMPTZ,
    paid_at TIMESTAMPTZ,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create settlements table
CREATE TABLE settlements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    load_id UUID REFERENCES loads(id),
    carrier_id UUID REFERENCES carriers(id),
    carrier_payment DECIMAL(10,2) NOT NULL,
    status payment_status DEFAULT 'pending',
    paid_at TIMESTAMPTZ,
    check_number TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create journal_entries table
CREATE TABLE journal_entries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type journal_type NOT NULL,
    reference_id UUID,
    reference_type TEXT,
    amount DECIMAL(10,2) NOT NULL,
    description TEXT,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for performance
CREATE INDEX idx_loads_shipper ON loads(shipper_id);
CREATE INDEX idx_loads_carrier ON loads(carrier_id);
CREATE INDEX idx_loads_status ON loads(status);
CREATE INDEX idx_loads_pickup_date ON loads(pickup_date);
CREATE INDEX idx_invoices_shipper ON invoices(shipper_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_settlements_carrier ON settlements(carrier_id);
CREATE INDEX idx_documents_load ON documents(load_id);
CREATE INDEX idx_journal_type ON journal_entries(type);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shippers ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for carriers
CREATE POLICY "All authenticated users can view carriers" ON carriers
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage carriers" ON carriers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for shippers
CREATE POLICY "All authenticated users can view shippers" ON shippers
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage shippers" ON shippers
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for locations
CREATE POLICY "All authenticated users can view locations" ON locations
    FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage locations" ON locations
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for loads
CREATE POLICY "All authenticated users can view loads" ON loads
    FOR SELECT USING (
        auth.uid() IS NOT NULL AND (
            -- Admins can see all
            EXISTS (
                SELECT 1 FROM profiles
                WHERE profiles.id = auth.uid()
                AND profiles.role = 'admin'
            ) OR
            -- Carriers can see their assigned loads
            EXISTS (
                SELECT 1 FROM profiles p
                JOIN carriers c ON c.email = p.email
                WHERE p.id = auth.uid()
                AND loads.carrier_id = c.id
            ) OR
            -- Shippers can see their loads
            EXISTS (
                SELECT 1 FROM profiles p
                JOIN shippers s ON s.email = p.email
                WHERE p.id = auth.uid()
                AND loads.shipper_id = s.id
            )
        )
    );

CREATE POLICY "Admins can manage loads" ON loads
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for documents
CREATE POLICY "Users can view documents for accessible loads" ON documents
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM loads
            WHERE loads.id = documents.load_id
            AND (
                -- Check if user has access to the load
                EXISTS (
                    SELECT 1 FROM profiles
                    WHERE profiles.id = auth.uid()
                    AND profiles.role = 'admin'
                ) OR
                EXISTS (
                    SELECT 1 FROM profiles p
                    JOIN carriers c ON c.email = p.email
                    WHERE p.id = auth.uid()
                    AND loads.carrier_id = c.id
                ) OR
                EXISTS (
                    SELECT 1 FROM profiles p
                    JOIN shippers s ON s.email = p.email
                    WHERE p.id = auth.uid()
                    AND loads.shipper_id = s.id
                )
            )
        )
    );

CREATE POLICY "Admins and carriers can upload documents" ON documents
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND (profiles.role = 'admin' OR profiles.role = 'carrier')
        )
    );

-- RLS Policies for invoices
CREATE POLICY "Admins and shippers can view invoices" ON invoices
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        ) OR
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN shippers s ON s.email = p.email
            WHERE p.id = auth.uid()
            AND invoices.shipper_id = s.id
        )
    );

CREATE POLICY "Admins can manage invoices" ON invoices
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for settlements
CREATE POLICY "Admins and carriers can view settlements" ON settlements
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        ) OR
        EXISTS (
            SELECT 1 FROM profiles p
            JOIN carriers c ON c.email = p.email
            WHERE p.id = auth.uid()
            AND settlements.carrier_id = c.id
        )
    );

CREATE POLICY "Admins can manage settlements" ON settlements
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for journal_entries
CREATE POLICY "Admins can view journal entries" ON journal_entries
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

CREATE POLICY "Admins can create journal entries" ON journal_entries
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Create functions for triggers
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_carriers_updated_at BEFORE UPDATE ON carriers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_shippers_updated_at BEFORE UPDATE ON shippers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_loads_updated_at BEFORE UPDATE ON loads
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_invoices_updated_at BEFORE UPDATE ON invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_settlements_updated_at BEFORE UPDATE ON settlements
    FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Create function to auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, role)
    VALUES (
        NEW.id,
        NEW.email,
        CASE 
            WHEN NEW.email = 'admin@evolve.local' THEN 'admin'::user_role
            WHEN NEW.email = 'carrier@evolve.local' THEN 'carrier'::user_role
            WHEN NEW.email = 'shipper@evolve.local' THEN 'shipper'::user_role
            ELSE 'viewer'::user_role
        END
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-create profile on signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create function to generate load numbers
CREATE OR REPLACE FUNCTION generate_load_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    current_year TEXT;
    last_number INTEGER;
BEGIN
    current_year := to_char(NOW(), 'YY');
    
    SELECT 
        COALESCE(MAX(CAST(SUBSTRING(load_number FROM 4) AS INTEGER)), 0) + 1
    INTO last_number
    FROM loads
    WHERE load_number LIKE 'LD' || current_year || '%';
    
    new_number := 'LD' || current_year || LPAD(last_number::TEXT, 5, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;

-- Create function to generate invoice numbers
CREATE OR REPLACE FUNCTION generate_invoice_number()
RETURNS TEXT AS $$
DECLARE
    new_number TEXT;
    current_year TEXT;
    last_number INTEGER;
BEGIN
    current_year := to_char(NOW(), 'YYYY');
    
    SELECT 
        COALESCE(MAX(CAST(SUBSTRING(invoice_number FROM 5) AS INTEGER)), 0) + 1
    INTO last_number
    FROM invoices
    WHERE invoice_number LIKE 'INV-' || current_year || '%';
    
    new_number := 'INV-' || current_year || '-' || LPAD(last_number::TEXT, 5, '0');
    
    RETURN new_number;
END;
$$ LANGUAGE plpgsql;