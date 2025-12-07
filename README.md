# SmartDebt_BackEnd
This is Backend side for SmartDebt

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Run backend

   ```bash
   npm run dev
   ```

##APIs:

Contacts:

GET    /api/contacts
GET    /api/contacts/:id
POST   /api/contacts
PUT    /api/contacts/:id
DELETE /api/contacts/:id

POST /api/contacts
{
  "ho": "Nguyễn Văn B",
  "phone": "0909123456",
  "note": "Bạn thân"
}

Debts:

GET    /api/debts
GET    /api/debts/:id
POST   /api/debts
PUT    /api/debts/:id
DELETE /api/debts/:id

PATCH  /api/debts/:id/mark-paid


POST /api/debts
{
  "contact_id": 1,
  "type": "OWE_YOU",
  "title": "Tiền cà phê",
  "amount": 50000,
  "due_date": "2025-12-10",
  "note": "Hẹn Chủ nhật"
}


Expenses:
GET    /api/expenses
GET    /api/expenses/:id
POST   /api/expenses
PUT    /api/expenses/:id
DELETE /api/expenses/:id

Categories
GET    /api/categories
POST   /api/categories
PUT    /api/categories/:id
DELETE /api/categories/:id
