# Invoice Management System

This document describes the invoice management functionality implemented in the FSS Inventory Management System.

## Overview

The invoice system allows users to:
- Create invoices from existing orders or custom orders
- Create standalone invoices
- Edit and update invoices
- View invoices in a professional format
- Download invoices as PDF
- Print invoices
- Manage all invoices in a centralized interface

## Components

### 1. InvoiceView (`InvoiceView.tsx`)
The main invoice component that handles:
- Invoice creation and editing
- Form management using Forge
- API integration for CRUD operations
- Professional invoice layout matching the provided design
- Print and PDF download functionality

**Props:**
- `orderId?: string` - ID of the order to create invoice from
- `customOrderId?: string` - ID of the custom order to create invoice from
- `invoiceId?: string` - ID of existing invoice to view/edit
- `mode?: 'create' | 'edit' | 'view'` - Display mode
- `onClose?: () => void` - Callback when closing the invoice

### 2. InvoiceButton (`InvoiceButton.tsx`)
A reusable button component for creating invoices from orders:
- Displays a file icon button
- Opens InvoiceView in a dialog
- Can be used in table action columns

**Props:**
- `orderId?: string` - Order ID to create invoice from
- `customOrderId?: string` - Custom order ID to create invoice from
- `variant?: string` - Button variant
- `size?: string` - Button size

### 3. InvoiceManagement (`InvoiceManagement.tsx`)
A comprehensive invoice management interface:
- Lists all invoices in a data table
- Search and filter functionality
- Create, view, edit, and delete invoices
- Download PDF and print options
- Status tracking

## Features

### Invoice Layout
The invoice follows the provided PDF design with:
- Company logo and branding (Food Stuff Store)
- Invoice header with number, date, and due date
- Editable "FROM" and "BILL TO" sections
- Line items table with description, quantity, unit price, and amount
- Automatic calculation of subtotal, tax, and total
- Notes and terms sections
- Professional footer

### Editable Fields
When creating or editing invoices, the following fields are editable:
- Business information (name, address, phone, email)
- Customer information (name, company, address, phone, email)
- Invoice dates
- Line items (description, quantity, unit price)
- Tax rate
- Notes and terms

### API Integration
The system integrates with the following API endpoints:
- `POST /orders/invoices/` - Create new invoice
- `GET /orders/invoices/` - List all invoices
- `GET /orders/invoices/:id/` - Get specific invoice
- `PUT /orders/invoices/:id/` - Update invoice
- `DELETE /orders/invoices/:id/` - Delete invoice
- `GET /orders/invoices/download/:id/` - Download PDF
- `GET /orders/invoices/preview/:id/` - Preview HTML

### Form Validation
The system uses Forge (built on react-hook-form) for:
- Required field validation
- Email format validation
- Number format validation
- Real-time form state management

## Usage

### Creating Invoices from Orders
1. Navigate to the Orders or Custom Orders tab
2. Click the file icon in the action column of any order
3. The invoice form will open with pre-filled customer information
4. Edit the "FROM" and "BILL TO" sections as needed
5. Add or modify line items
6. Save the invoice

### Managing Invoices
1. Navigate to the "Invoices" tab
2. View all invoices in the data table
3. Use the search bar to find specific invoices
4. Use action buttons to:
   - View invoices (eye icon)
   - Edit invoices (edit icon)
   - Download PDF (download icon)
   - Delete invoices (trash icon)

### Creating Standalone Invoices
1. Go to the "Invoices" tab
2. Click "Create Invoice" button
3. Fill in all required information
4. Add line items
5. Save the invoice

## Technical Details

### Dependencies
- React Hook Form (via Forge)
- TanStack Query for API state management
- ShadCN UI components
- Lucide React icons
- TailwindCSS for styling

### File Structure
```
src/pages/CustomerOrder/components/
├── InvoiceView.tsx          # Main invoice component
├── InvoiceButton.tsx        # Reusable invoice button
├── InvoiceManagement.tsx    # Invoice management interface
└── README_Invoice.md        # This documentation
```

### Styling
The invoice uses TailwindCSS classes to match the provided design:
- Professional layout with proper spacing
- Color scheme matching the brand (red accents, green section headers)
- Responsive design for different screen sizes
- Print-friendly styles with `.no-print` class for UI elements

## Future Enhancements

1. **Email Integration**: Send invoices directly via email
2. **Payment Tracking**: Track payment status and history
3. **Recurring Invoices**: Set up automatic recurring invoices
4. **Templates**: Create and use custom invoice templates
5. **Multi-currency Support**: Handle different currencies
6. **Advanced Reporting**: Generate invoice reports and analytics

## Troubleshooting

### Common Issues
1. **PDF Download Not Working**: Ensure the backend PDF generation endpoint is properly configured
2. **Form Validation Errors**: Check that all required fields are filled
3. **API Errors**: Verify that the backend API endpoints are accessible
4. **Print Issues**: Use the print button for better formatting than browser print

### Error Handling
The system includes comprehensive error handling:
- Toast notifications for success/error messages
- Form validation with user-friendly error messages
- API error handling with fallback messages
- Loading states during API operations