-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT CHECK (type IN ('pickup', 'delivery', 'warehouse', 'office')) NOT NULL,
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

-- Create shippers table
CREATE TABLE IF NOT EXISTS shippers (
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
  credit_limit NUMERIC(10, 2),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create carriers table
CREATE TABLE IF NOT EXISTS carriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  mc_number TEXT,
  dot_number TEXT,
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

-- Create loads table
CREATE TABLE IF NOT EXISTS loads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  load_number TEXT UNIQUE NOT NULL,
  origin_id UUID REFERENCES locations(id),
  destination_id UUID REFERENCES locations(id),
  shipper_id UUID REFERENCES shippers(id),
  carrier_id UUID REFERENCES carriers(id),
  pickup_date DATE,
  delivery_date DATE,
  weight NUMERIC(10, 2),
  pieces INTEGER,
  commodity TEXT,
  equipment_type TEXT,
  rate NUMERIC(10, 2),
  carrier_rate NUMERIC(10, 2),
  status TEXT CHECK (status IN ('created', 'tendered', 'booked', 'in_transit', 'delivered', 'closed')) DEFAULT 'created',
  notes TEXT,
  created_by UUID REFERENCES auth.users(id),
  assigned_to UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  load_id UUID REFERENCES loads(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('bol', 'pod', 'invoice', 'rate_confirmation', 'other')) NOT NULL,
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  uploaded_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number TEXT UNIQUE NOT NULL,
  load_id UUID REFERENCES loads(id),
  shipper_id UUID REFERENCES shippers(id),
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')) DEFAULT 'pending',
  issued_at DATE DEFAULT CURRENT_DATE,
  due_at DATE,
  paid_at DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create settlements table
CREATE TABLE IF NOT EXISTS settlements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  load_id UUID REFERENCES loads(id),
  carrier_id UUID REFERENCES carriers(id),
  carrier_payment NUMERIC(10, 2) NOT NULL,
  status TEXT CHECK (status IN ('pending', 'paid', 'overdue', 'cancelled')) DEFAULT 'pending',
  paid_at DATE,
  check_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT CHECK (type IN ('ar', 'ap')) NOT NULL,
  reference_id UUID,
  reference_type TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  description TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE shippers ENABLE ROW LEVEL SECURITY;
ALTER TABLE carriers ENABLE ROW LEVEL SECURITY;
ALTER TABLE loads ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE settlements ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for authenticated users (basic read-all for now)
CREATE POLICY "Enable read for authenticated users" ON locations
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable all for authenticated users" ON locations
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for authenticated users" ON shippers
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable all for authenticated users" ON shippers
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for authenticated users" ON carriers
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable all for authenticated users" ON carriers
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for authenticated users" ON loads
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable all for authenticated users" ON loads
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for authenticated users" ON documents
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable all for authenticated users" ON documents
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for authenticated users" ON invoices
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable all for authenticated users" ON invoices
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for authenticated users" ON settlements
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable all for authenticated users" ON settlements
  FOR ALL USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable read for authenticated users" ON journal_entries
  FOR SELECT USING (auth.uid() IS NOT NULL);

CREATE POLICY "Enable all for authenticated users" ON journal_entries
  FOR ALL USING (auth.uid() IS NOT NULL);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_loads_status ON loads(status);
CREATE INDEX IF NOT EXISTS idx_loads_shipper ON loads(shipper_id);
CREATE INDEX IF NOT EXISTS idx_loads_carrier ON loads(carrier_id);
CREATE INDEX IF NOT EXISTS idx_invoices_status ON invoices(status);
CREATE INDEX IF NOT EXISTS idx_settlements_status ON settlements(status);

-- Insert some sample data for testing
INSERT INTO shippers (name, email, phone, city, state, payment_terms, credit_limit) 
VALUES 
  ('ABC Manufacturing', 'contact@abcmfg.com', '555-0100', 'Chicago', 'IL', 30, 50000),
  ('XYZ Distribution', 'info@xyzdist.com', '555-0200', 'Dallas', 'TX', 45, 75000)
ON CONFLICT DO NOTHING;

INSERT INTO carriers (name, mc_number, dot_number, email, phone, city, state)
VALUES 
  ('Fast Freight LLC', 'MC123456', 'DOT789012', 'dispatch@fastfreight.com', '555-0300', 'Atlanta', 'GA'),
  ('Reliable Transport', 'MC654321', 'DOT210987', 'ops@reliabletrans.com', '555-0400', 'Phoenix', 'AZ')
ON CONFLICT DO NOTHING;

INSERT INTO locations (name, type, address, city, state, zip, contact_name, contact_phone)
VALUES
  ('ABC Manufacturing - Main', 'pickup', '123 Industrial Way', 'Chicago', 'IL', '60601', 'John Smith', '555-0101'),
  ('XYZ Distribution Center', 'delivery', '456 Commerce Blvd', 'Dallas', 'TX', '75201', 'Jane Doe', '555-0201'),
  ('Port of Los Angeles', 'pickup', '789 Harbor Dr', 'Los Angeles', 'CA', '90001', 'Mike Johnson', '555-0501'),
  ('Miami Warehouse', 'delivery', '321 Storage Ave', 'Miami', 'FL', '33101', 'Sarah Wilson', '555-0601')
ON CONFLICT DO NOTHING;