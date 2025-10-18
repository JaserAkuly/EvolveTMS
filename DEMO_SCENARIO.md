# EvolveTMS Demo Scenario

## Overview
This document provides a complete end-to-end demo scenario for the Transportation Management System (TMS), showcasing how different personas interact with the system to complete a shipment from creation to delivery and payment.

## Demo Accounts
- **Admin**: admin@evolve.local / password123
- **Carrier**: carrier@evolve.local / password123
- **Shipper**: shipper@evolve.local / password123
- **Viewer**: viewer@evolve.local / password123

## Scenario: ABC Manufacturing Ships Products to XYZ Distribution

### Act 1: Shipper Creates Load Request

**Login as Shipper** (shipper@evolve.local)

1. **Dashboard Overview**
   - Notice the clean dashboard showing recent activity
   - Click on "Create Shipment" button

2. **Create New Shipment**
   - **Origin**: Select "ABC Manufacturing - Main" (Chicago, IL)
   - **Destination**: Select "XYZ Distribution Center" (Dallas, TX)
   - **Pickup Date**: Tomorrow's date
   - **Delivery Date**: 3 days from now
   - **Commodity**: "Industrial Equipment Parts"
   - **Weight**: 42,000 lbs
   - **Pieces**: 26 pallets
   - **Equipment Type**: "Dry Van 53'"
   - **Special Instructions**: "Driver must have PPE for pickup. Delivery appointment required."
   - **Customer Rate**: $3,500
   - Click "Create Shipment"

3. **View Created Shipment**
   - From dashboard, click on the newly created shipment
   - Review all details are correct
   - Notice status is "Created"

### Act 2: Admin Manages the Load

**Login as Admin** (admin@evolve.local)

1. **Review Notifications**
   - Click on notification bell (shows 3 notifications)
   - See notification about new load created
   - Click to view the load

2. **Assign Carrier**
   - Go to Shipments page
   - Find the new load (status: Created)
   - Click to view details
   - Click "Update Status" → Change to "Tendered"
   - Navigate to Carriers page
   - Review available carriers
   - Select "Fast Freight LLC" based on their equipment and location

3. **Update Load with Carrier**
   - Return to the shipment details
   - Edit shipment to assign "Fast Freight LLC" as carrier
   - Set **Carrier Rate**: $2,800
   - Notice the margin calculation:
     - Customer Rate: $3,500
     - Carrier Cost: $2,800
     - Gross Margin: $700 (20%)

4. **Update Status to Booked**
   - Click "Update Status"
   - Select "Booked"
   - Click "Update Status" to confirm

5. **Add Rate Confirmation**
   - Click "Add Document"
   - Type: "Rate Confirmation"
   - Name: "RC-2024-001-FastFreight"
   - Click "Add Document"
   - Toast notification confirms document added

### Act 3: Carrier Executes the Shipment

**Login as Carrier** (carrier@evolve.local)

1. **View Assigned Loads**
   - Dashboard shows loads assigned to carrier
   - Click on the load to view details
   - Review pickup and delivery information
   - Note special instructions about PPE

2. **Update Load Progress**
   - **Day 1 - Pickup**:
     - Admin updates status to "In Transit" (carrier would call/email)
   - **Upload Bill of Lading**:
     - Admin clicks "Add Document"
     - Type: "Bill of Lading"
     - Name: "BOL-2024-001"
     - Click "Add Document"

3. **Send Status Update**
   - Click "Send Update"
   - Message: "Load picked up successfully at 10:30 AM. ETA to delivery is on schedule for requested date. Driver has confirmed PPE requirements met."
   - Click "Send Update"

4. **Delivery Completion**
   - **Day 3 - Delivery**:
     - Admin updates status to "Delivered"
   - **Upload Proof of Delivery**:
     - Click "Add Document"
     - Type: "Proof of Delivery"
     - Name: "POD-2024-001-Signed"
     - Click "Add Document"

### Act 4: Billing and Settlement

**Continue as Admin**

1. **Create Customer Invoice**
   - In shipment details, click "Create Invoice"
   - Review invoice preview:
     - Load Number: 2024-001
     - Customer: ABC Manufacturing
     - Amount: $3,500
   - Click "Create Invoice"
   - Note invoice number (e.g., INV-123456)

2. **Process Carrier Settlement**
   - Review carrier payment due: $2,800
   - Navigate to Reports page
   - View financial summary showing:
     - Revenue: $3,500
     - Costs: $2,800
     - Margin: $700

3. **Close the Load**
   - Return to shipment details
   - Click "Update Status"
   - Select "Closed"
   - Update status

### Act 5: Shipper Reviews Completed Shipment

**Login as Shipper** (shipper@evolve.local)

1. **Check Shipment Status**
   - View dashboard
   - See shipment marked as "Delivered"
   - Click to view details

2. **Download Documents**
   - View attached documents:
     - Rate Confirmation
     - Bill of Lading
     - Proof of Delivery
   - (In production, these would be downloadable PDFs)

3. **Review Invoice**
   - Check Reports section
   - View pending invoice for $3,500
   - Due date: 30 days from issue

### Act 6: Viewer Access

**Login as Viewer** (viewer@evolve.local)

1. **Limited Access Demo**
   - Can view dashboard with shipment data
   - Can see shipment details
   - Cannot create or edit shipments
   - Cannot access financial information
   - Good for customers who need visibility but not control

## Key Features Demonstrated

### 1. Role-Based Access Control
- **Admin**: Full system access, all CRUD operations
- **Carrier**: View assigned loads, limited updates
- **Shipper**: Create loads, view their shipments
- **Viewer**: Read-only access

### 2. Workflow Management
- Status progression: Created → Tendered → Booked → In Transit → Delivered → Closed
- Each status change triggers appropriate notifications

### 3. Document Management
- Multiple document types supported
- Documents attached to specific loads
- Full audit trail of uploads

### 4. Financial Tracking
- Customer rates vs carrier costs
- Automatic margin calculation
- Invoice generation
- Settlement tracking

### 5. Communication Features
- In-app notifications
- Status updates
- Update messages to stakeholders

### 6. Search and Filter
- Search shipments by load number
- Filter by status
- Sort by date

## Demo Tips

1. **Show Responsiveness**: Open on mobile device to show responsive design
2. **Real-time Updates**: Have two browser windows with different users to show real-time updates
3. **Error Handling**: Try to create shipment without required fields to show validation
4. **Professional UI**: Highlight the clean, modern interface with shadcn/ui components
5. **Performance**: Note the quick load times and smooth transitions

## Common Questions & Answers

**Q: Can we integrate with our existing ERP?**
A: Yes, the system is built with APIs that can integrate with any ERP system.

**Q: How are documents stored?**
A: Documents can be stored in Supabase Storage or integrated with your existing document management system.

**Q: Can we customize the workflow?**
A: Yes, status workflows and business rules can be customized to match your operations.

**Q: Is there an audit trail?**
A: Yes, all actions are logged with timestamps and user information.

**Q: Can we add custom fields?**
A: Yes, the system is flexible and can be extended with custom fields and data types.

**Q: What about EDI integration?**
A: The system can be extended to support EDI transactions for automated data exchange.

## Next Steps After Demo

1. **Customization Discussion**
   - Identify specific workflow requirements
   - Custom fields needed
   - Integration points with existing systems

2. **Data Migration**
   - Plan for importing existing shipment data
   - Map current data structure to TMS

3. **User Training**
   - Schedule training sessions for different user roles
   - Create customized training materials

4. **Pilot Program**
   - Start with a small group of users
   - Gather feedback and iterate
   - Full rollout after pilot success