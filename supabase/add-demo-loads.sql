-- Add some demo loads/shipments
INSERT INTO loads (
  load_number, 
  origin_id, 
  destination_id, 
  shipper_id, 
  carrier_id, 
  pickup_date, 
  delivery_date, 
  weight, 
  pieces, 
  commodity, 
  equipment_type, 
  rate, 
  carrier_rate, 
  status, 
  notes
) VALUES 
(
  'TMS-2024-001',
  (SELECT id FROM locations WHERE name = 'ABC Manufacturing - Main' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'XYZ Distribution Center' LIMIT 1),
  (SELECT id FROM shippers WHERE name = 'ABC Manufacturing' LIMIT 1),
  (SELECT id FROM carriers WHERE name = 'Fast Freight LLC' LIMIT 1),
  '2024-10-20',
  '2024-10-22',
  25000.00,
  15,
  'Electronics',
  'Dry Van',
  2500.00,
  2200.00,
  'in_transit',
  'Rush delivery required'
),
(
  'TMS-2024-002',
  (SELECT id FROM locations WHERE name = 'Port of Los Angeles' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Miami Warehouse' LIMIT 1),
  (SELECT id FROM shippers WHERE name = 'XYZ Distribution' LIMIT 1),
  (SELECT id FROM carriers WHERE name = 'Reliable Transport' LIMIT 1),
  '2024-10-18',
  '2024-10-25',
  40000.00,
  25,
  'Automotive Parts',
  'Flatbed',
  3200.00,
  2800.00,
  'delivered',
  'Special handling required'
),
(
  'TMS-2024-003',
  (SELECT id FROM locations WHERE name = 'ABC Manufacturing - Main' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Miami Warehouse' LIMIT 1),
  (SELECT id FROM shippers WHERE name = 'ABC Manufacturing' LIMIT 1),
  NULL,
  '2024-10-25',
  '2024-10-28',
  15000.00,
  8,
  'Medical Equipment',
  'Refrigerated',
  3500.00,
  NULL,
  'created',
  'Temperature controlled shipment'
),
(
  'TMS-2024-004',
  (SELECT id FROM locations WHERE name = 'Port of Los Angeles' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'XYZ Distribution Center' LIMIT 1),
  (SELECT id FROM shippers WHERE name = 'XYZ Distribution' LIMIT 1),
  (SELECT id FROM carriers WHERE name = 'Fast Freight LLC' LIMIT 1),
  '2024-10-15',
  '2024-10-17',
  30000.00,
  20,
  'Consumer Goods',
  'Dry Van',
  2800.00,
  2500.00,
  'closed',
  'Standard delivery'
),
(
  'TMS-2024-005',
  (SELECT id FROM locations WHERE name = 'ABC Manufacturing - Main' LIMIT 1),
  (SELECT id FROM locations WHERE name = 'Port of Los Angeles' LIMIT 1),
  (SELECT id FROM shippers WHERE name = 'ABC Manufacturing' LIMIT 1),
  (SELECT id FROM carriers WHERE name = 'Reliable Transport' LIMIT 1),
  '2024-10-22',
  '2024-10-24',
  35000.00,
  12,
  'Industrial Equipment',
  'Flatbed',
  4200.00,
  3800.00,
  'booked',
  'Oversized load - permits required'
)
ON CONFLICT (load_number) DO NOTHING;

-- Add some invoices
INSERT INTO invoices (
  invoice_number,
  load_id,
  shipper_id,
  amount,
  status,
  issued_at,
  due_at
) VALUES
(
  'INV-2024-001',
  (SELECT id FROM loads WHERE load_number = 'TMS-2024-002' LIMIT 1),
  (SELECT id FROM shippers WHERE name = 'XYZ Distribution' LIMIT 1),
  3200.00,
  'pending',
  '2024-10-25',
  '2024-11-24'
),
(
  'INV-2024-002',
  (SELECT id FROM loads WHERE load_number = 'TMS-2024-004' LIMIT 1),
  (SELECT id FROM shippers WHERE name = 'XYZ Distribution' LIMIT 1),
  2800.00,
  'paid',
  '2024-10-17',
  '2024-11-16'
)
ON CONFLICT (invoice_number) DO NOTHING;