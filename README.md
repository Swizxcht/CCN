# Celebrity Cable Network Inc.
## Web-Based Subscriber Management and Service Request System

A full-stack web application developed for Celebrity Cable Network Inc. to manage subscribers, internet and cable plans, billing, payments, service requests, job orders, and customer self-service portal.

---

# Project Overview

The system provides a centralized platform for:

- Subscriber Management
- Internet Plan Management
- Cable TV Plan Management
- Billing and Payment Processing
- Customer Portal
- Service Request Tracking
- Job Order Management
- Technician Assignment
- Customer Support
- Announcements and Notifications

The goal is to reduce manual office work, improve customer experience, and streamline technical support operations.

---

# Technology Stack

## Frontend

- React.js
- React Router DOM
- Axios
- Tailwind CSS

## Backend

- Node.js
- Express.js
- JWT Authentication
- bcryptjs

## Database

- MySQL

---

# User Roles

## Admin

Can:

- Manage subscribers
- Manage internet plans
- Manage cable plans
- Generate bills
- Record payments
- View reports
- Manage service requests
- Create job orders
- Assign technicians
- Manage announcements

---

## Customer

Can:

- Register account
- Login
- View subscriber profile
- View plans
- View billing history
- View payment history
- Submit service requests
- Track request status
- View announcements

---

## Technician

Can:

- Login
- View assigned job orders
- View customer information
- Update job status
- Mark jobs as completed

---

# Core Features

---

## Authentication System

### Features

- User Registration
- User Login
- JWT Authentication
- Role-Based Access Control
- Protected Routes

### Tables

- users

---

## Subscriber Management

### Features

- Create Subscriber
- Update Subscriber
- Delete Subscriber
- View Subscriber Details
- Assign Plans
- Activate/Deactivate Accounts

### Tables

- subscribers

---

## Internet Plan Management

### Features

- Add Internet Plan
- Edit Internet Plan
- Delete Internet Plan
- View Available Plans

### Tables

- internet_plans

Fields:

- Plan Name
- Speed
- Monthly Fee
- Installation Fee
- Description

---

## Cable Plan Management

### Features

- Add Cable Plan
- Edit Cable Plan
- Delete Cable Plan
- View Available Plans

### Tables

- cable_plans

Fields:

- Plan Name
- Monthly Fee
- Description

---

## Billing Management

### Features

- Monthly Bill Generation
- Prevent Duplicate Bills
- Billing History
- Due Date Tracking
- Outstanding Balance Monitoring

### Tables

- bills

Fields:

- Subscriber
- Billing Month
- Amount
- Amount Paid
- Remaining Balance
- Due Date
- Status

Statuses:

- Unpaid
- Partial
- Paid

---

## Automated Billing Engine

### Features

- Monthly Billing Generation
- Duplicate Bill Prevention
- Production-Safe Billing Logic
- Billing History Tracking

Billing Rule:

Only generate one bill per subscriber per billing month.

---

## Payment Management

### Features

- Record Payment
- Partial Payment Support
- Full Payment Support
- Receipt Number Generation
- Payment History

### Tables

- payments

Fields:

- Receipt Number
- Bill ID
- Amount
- Payment Date
- Payment Method

Methods:

- Cash
- GCash
- Bank Transfer

---

## Customer Portal

### Features

View:

- Subscriber ID
- Full Name
- Address
- Contact Number
- Internet Plan
- Cable Plan
- Installation Date
- Account Status
- Due Date
- Billing History
- Payment History

---

## Service Request System

### Features

Submit:

- No Internet Connection
- Slow Internet
- Cable Signal Problem
- Relocation Request
- Upgrade Plan
- New Installation
- Other Concerns

### Tables

- service_requests

Fields:

- Account Number
- Contact Number
- Address
- Issue Description
- Status

Statuses:

- Pending
- Assigned
- In Progress
- On Site
- Resolved

---

## Job Order System

### Features

- Auto Job Order Creation
- Technician Assignment
- Request Tracking

Example:

JO-2026-001

Workflow:

Customer Request
↓
Admin Review
↓
Assign Technician
↓
Technician Visit
↓
Resolved

---

## Complaint Tracking

### Features

Customer can track:

- Pending
- Assigned
- In Progress
- On Site
- Resolved

---

## Technician Dashboard

### Features

View:

- Assigned Job Orders
- Customer Details
- Contact Number
- Address
- Issue Description

Actions:

- Update Status
- Mark Resolved

---

## Announcements System

### Features

Publish:

- Scheduled Maintenance
- Service Interruptions
- Fiber Expansion
- Promotions
- Company News

---

## FAQ System

### Features

Common Questions:

- How to pay bills
- How to reset router
- How to reconnect account
- Troubleshooting guides

---

# Database Tables

Current Core Tables:

```text
users
subscribers
internet_plans
cable_plans
bills
payments
service_requests
```

Future Tables:

```text
technicians
announcements
faqs
job_orders
notifications
activity_logs
```

---

# ISP Workflow

## New Customer

```text
Register Account
↓
Admin Reviews
↓
Subscriber Created
↓
Plan Assigned
↓
Account Activated
```

---

## Monthly Billing

```text
Run Billing Engine
↓
Generate Bills
↓
Prevent Duplicates
↓
Customer Views Bill
```

---

## Payment Process

```text
Customer Pays
↓
Admin Records Payment
↓
Bill Updated
↓
Receipt Generated
```

---

## Service Request Process

```text
Customer Submits Request
↓
System Creates Job Order
↓
Admin Assigns Technician
↓
Technician Updates Status
↓
Customer Tracks Progress
↓
Request Resolved
```

---

# Functional Requirements

The system must:

- Authenticate users securely
- Manage subscribers
- Manage internet plans
- Manage cable plans
- Generate monthly bills
- Record payments
- Track balances
- Handle customer complaints
- Create job orders
- Assign technicians
- Provide customer self-service portal
- Publish announcements
- Maintain billing history

---

# Non-Functional Requirements

- Responsive Design
- Secure Authentication
- Database Integrity
- Fast Performance
- Scalability
- Maintainability
- User-Friendly Interface

---

# Project Status

## Completed

- Authentication System
- Subscriber Management
- Internet Plans
- Cable Plans
- Billing System
- Automated Billing Engine
- Payment Management
- Customer Portal
- Service Request Foundation

## In Progress

- Technician Assignment
- Job Order Tracking
- Complaint Tracking UI

## Planned

- Announcements
- FAQs
- Notifications
- Reports & Analytics
- Deployment

---

© Celebrity Cable Network Inc.
All Rights Reserved.