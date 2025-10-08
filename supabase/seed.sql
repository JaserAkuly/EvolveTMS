-- Seed data for Evolve TMS

-- Insert test carriers
INSERT INTO carriers (id, name, mc_number, dot_number, email, phone, address, city, state, zip, insurance_exp) VALUES
('a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 'Swift Transport', 'MC123456', 'DOT789012', 'dispatch@swift.com', '555-0001', '123 Highway Rd', 'Phoenix', 'AZ', '85001', '2025-12-31'),
('b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 'Knight Logistics', 'MC234567', 'DOT890123', 'ops@knight.com', '555-0002', '456 Freight Ave', 'Dallas', 'TX', '75201', '2025-11-30'),
('c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', 'Prime Trucking', 'MC345678', 'DOT901234', 'carrier@evolve.local', '555-0003', '789 Transport Blvd', 'Chicago', 'IL', '60601', '2025-10-31'),
('d0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', 'Werner Enterprises', 'MC456789', 'DOT012345', 'dispatch@werner.com', '555-0004', '321 Logistics Way', 'Omaha', 'NE', '68101', '2025-09-30'),
('e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', 'Schneider National', 'MC567890', 'DOT123456', 'operations@schneider.com', '555-0005', '654 Shipping St', 'Green Bay', 'WI', '54301', '2025-08-31');

-- Insert test shippers
INSERT INTO shippers (id, name, billing_contact, email, phone, address, city, state, zip, payment_terms, credit_limit) VALUES
('a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'Amazon Logistics', 'John Smith', 'shipper@evolve.local', '555-1001', '410 Terry Ave N', 'Seattle', 'WA', '98109', 30, 100000.00),
('b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'Walmart Distribution', 'Jane Doe', 'billing@walmart.com', '555-1002', '702 SW 8th St', 'Bentonville', 'AR', '72716', 45, 150000.00),
('c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'Target Supply Chain', 'Bob Johnson', 'logistics@target.com', '555-1003', '1000 Nicollet Mall', 'Minneapolis', 'MN', '55403', 30, 75000.00);

-- Insert test locations
INSERT INTO locations (id, name, type, address, city, state, zip, contact_name, contact_phone) VALUES
('a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'Amazon SEA1', 'warehouse', '410 Terry Ave N', 'Seattle', 'WA', '98109', 'Mike Wilson', '555-2001'),
('b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'Walmart DC 7030', 'warehouse', '702 SW 8th St', 'Bentonville', 'AR', '72716', 'Sarah Brown', '555-2002'),
('c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'Target DC Minneapolis', 'warehouse', '1000 Nicollet Mall', 'Minneapolis', 'MN', '55403', 'Tom Davis', '555-2003'),
('d2eebc99-9c0b-4ef8-bb6d-6bb9bd380a34', 'Port of Los Angeles', 'pickup', '425 S Palos Verdes St', 'Los Angeles', 'CA', '90731', 'Lisa Garcia', '555-2004'),
('e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a35', 'Chicago Rail Terminal', 'delivery', '2001 S Lumber St', 'Chicago', 'IL', '60616', 'James Miller', '555-2005'),
('f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a36', 'Miami Distribution Center', 'warehouse', '7850 NW 146th St', 'Miami Lakes', 'FL', '33016', 'Maria Rodriguez', '555-2006');

-- Insert test loads with various statuses
INSERT INTO loads (id, load_number, origin_id, destination_id, shipper_id, carrier_id, pickup_date, delivery_date, weight, pieces, commodity, equipment_type, rate, carrier_rate, status, notes) VALUES
('a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'LD2400001', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a34', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2025-01-10', '2025-01-12', 42000, 26, 'Electronics', 'Dry Van', 2850.00, 2400.00, 'delivered', 'High value load - handle with care'),
('b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a42', 'LD2400002', 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a35', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '2025-01-11', '2025-01-13', 38000, 22, 'General Merchandise', 'Dry Van', 2200.00, 1900.00, 'delivered', 'Standard shipment'),
('c3eebc99-9c0b-4ef8-bb6d-6bb9bd380a43', 'LD2400003', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a36', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'c0eebc99-9c0b-4ef8-bb6d-6bb9bd380a13', '2025-01-12', '2025-01-15', 35000, 20, 'Retail Goods', 'Dry Van', 3100.00, 2650.00, 'in_transit', 'Currently en route'),
('d3eebc99-9c0b-4ef8-bb6d-6bb9bd380a44', 'LD2400004', 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a34', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 'd0eebc99-9c0b-4ef8-bb6d-6bb9bd380a14', '2025-01-13', '2025-01-14', 44000, 28, 'Import Containers', 'Flatbed', 3500.00, 3000.00, 'booked', 'Port pickup scheduled'),
('e3eebc99-9c0b-4ef8-bb6d-6bb9bd380a45', 'LD2400005', 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a35', 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'e0eebc99-9c0b-4ef8-bb6d-6bb9bd380a15', '2025-01-14', '2025-01-16', 40000, 24, 'Food Products', 'Reefer', 3200.00, 2750.00, 'booked', 'Temperature controlled'),
('f3eebc99-9c0b-4ef8-bb6d-6bb9bd380a46', 'LD2400006', 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a36', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', NULL, '2025-01-15', '2025-01-17', 37000, 21, 'Furniture', 'Dry Van', 2600.00, NULL, 'tendered', 'Awaiting carrier assignment'),
('a4eebc99-9c0b-4ef8-bb6d-6bb9bd380a47', 'LD2400007', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'e2eebc99-9c0b-4ef8-bb6d-6bb9bd380a35', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', NULL, '2025-01-16', '2025-01-18', 41000, 25, 'Electronics', 'Dry Van', 2950.00, NULL, 'created', 'New load - needs tender'),
('b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a48', 'LD2400008', 'b2eebc99-9c0b-4ef8-bb6d-6bb9bd380a32', 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a34', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', '2025-01-09', '2025-01-11', 39000, 23, 'General Merchandise', 'Dry Van', 3400.00, 2900.00, 'closed', 'Completed and paid'),
('c4eebc99-9c0b-4ef8-bb6d-6bb9bd380a49', 'LD2400009', 'c2eebc99-9c0b-4ef8-bb6d-6bb9bd380a33', 'a2eebc99-9c0b-4ef8-bb6d-6bb9bd380a31', 'c1eebc99-9c0b-4ef8-bb6d-6bb9bd380a23', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', '2025-01-08', '2025-01-10', 36000, 20, 'Retail Goods', 'Dry Van', 2800.00, 2400.00, 'closed', 'Completed and paid'),
('d4eebc99-9c0b-4ef8-bb6d-6bb9bd380a50', 'LD2400010', 'd2eebc99-9c0b-4ef8-bb6d-6bb9bd380a34', 'f2eebc99-9c0b-4ef8-bb6d-6bb9bd380a36', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', NULL, '2025-01-17', '2025-01-20', 43000, 27, 'Import Goods', 'Dry Van', 3800.00, NULL, 'created', 'Pending carrier selection');

-- Insert test invoices
INSERT INTO invoices (id, invoice_number, load_id, shipper_id, amount, status, issued_at, due_at) VALUES
('a5eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', 'INV-2025-00001', 'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'a1eebc99-9c0b-4ef8-bb6d-6bb9bd380a21', 2850.00, 'paid', '2025-01-12', '2025-02-11'),
('b5eebc99-9c0b-4ef8-bb6d-6bb9bd380a52', 'INV-2025-00002', 'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a42', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 2200.00, 'pending', '2025-01-13', '2025-02-27'),
('c5eebc99-9c0b-4ef8-bb6d-6bb9bd380a53', 'INV-2025-00003', 'b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a48', 'b1eebc99-9c0b-4ef8-bb6d-6bb9bd380a22', 3400.00, 'paid', '2025-01-11', '2025-02-25');

-- Insert test settlements
INSERT INTO settlements (id, load_id, carrier_id, carrier_payment, status, paid_at) VALUES
('a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a61', 'a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2400.00, 'paid', '2025-01-14'),
('b6eebc99-9c0b-4ef8-bb6d-6bb9bd380a62', 'b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a42', 'b0eebc99-9c0b-4ef8-bb6d-6bb9bd380a12', 1900.00, 'pending', NULL),
('c6eebc99-9c0b-4ef8-bb6d-6bb9bd380a63', 'b4eebc99-9c0b-4ef8-bb6d-6bb9bd380a48', 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11', 2900.00, 'paid', '2025-01-13');

-- Insert test journal entries
INSERT INTO journal_entries (type, reference_id, reference_type, amount, description) VALUES
('ar', 'a5eebc99-9c0b-4ef8-bb6d-6bb9bd380a51', 'invoice', 2850.00, 'Invoice INV-2025-00001 - Amazon Logistics'),
('ap', 'a6eebc99-9c0b-4ef8-bb6d-6bb9bd380a61', 'settlement', 2400.00, 'Settlement for LD2400001 - Swift Transport'),
('ar', 'b5eebc99-9c0b-4ef8-bb6d-6bb9bd380a52', 'invoice', 2200.00, 'Invoice INV-2025-00002 - Walmart Distribution'),
('ap', 'b6eebc99-9c0b-4ef8-bb6d-6bb9bd380a62', 'settlement', 1900.00, 'Settlement for LD2400002 - Knight Logistics'),
('ar', 'c5eebc99-9c0b-4ef8-bb6d-6bb9bd380a53', 'invoice', 3400.00, 'Invoice INV-2025-00003 - Walmart Distribution'),
('ap', 'c6eebc99-9c0b-4ef8-bb6d-6bb9bd380a63', 'settlement', 2900.00, 'Settlement for LD2400008 - Swift Transport');

-- Create a few sample documents
INSERT INTO documents (load_id, type, name, url) VALUES
('a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'bol', 'BOL-LD2400001.pdf', 'https://storage.example.com/bol/BOL-LD2400001.pdf'),
('a3eebc99-9c0b-4ef8-bb6d-6bb9bd380a41', 'pod', 'POD-LD2400001.pdf', 'https://storage.example.com/pod/POD-LD2400001.pdf'),
('b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a42', 'bol', 'BOL-LD2400002.pdf', 'https://storage.example.com/bol/BOL-LD2400002.pdf'),
('b3eebc99-9c0b-4ef8-bb6d-6bb9bd380a42', 'pod', 'POD-LD2400002.pdf', 'https://storage.example.com/pod/POD-LD2400002.pdf');