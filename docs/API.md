# Livinexo — Backend API Documentation

Base URL: `/api`

All responses are JSON. Dates use ISO 8601 format. Currency values are in INR (₹).

---

## Data Models

### Member

```json
{
  "id": "clx1abc23...",
  "name": "Arjun Sharma",
  "email": "arjun@haveli.com",
  "avatar": null,
  "createdAt": "2026-04-01T10:00:00.000Z",
  "updatedAt": "2026-04-01T10:00:00.000Z"
}
```

### ExpenseItem

```json
{
  "id": "clx2def45...",
  "itemName": "Basmati Rice",
  "quantity": 5,
  "quantityUnit": "kg",
  "price": 90,
  "totalAmount": 450,
  "purchaseDate": "2026-04-02T14:30:00.000Z",
  "notes": "Bought from BigBasket",
  "category": "Groceries",
  "addedById": "clx1abc23...",
  "addedBy": { /* Member object */ },
  "splits": [ /* ExpenseSplit[] */ ],
  "createdAt": "2026-04-02T14:30:00.000Z",
  "updatedAt": "2026-04-02T14:30:00.000Z"
}
```

### ExpenseSplit

```json
{
  "id": "clx3ghi67...",
  "amount": 112.5,
  "settled": false,
  "expenseId": "clx2def45...",
  "memberId": "clx1abc23...",
  "member": { /* Member object */ },
  "createdAt": "2026-04-02T14:30:00.000Z",
  "updatedAt": "2026-04-02T14:30:00.000Z"
}
```

### Enums / Constants

**Quantity Units:** `pcs`, `pack`, `dozen`, `kg`, `g`, `L`, `ml`

**Categories:** `Groceries`, `Electronics`, `Household`, `Kitchen`, `Personal Care`, `Clothing`, `Food & Dining`, `Utilities`, `Entertainment`, `General`

---

## 1. Members

### 1.1 List All Members

```
GET /api/members
```

Returns all members ordered by most recently created, with counts of their expenses and splits.

**Response `200`**

```json
[
  {
    "id": "clx1abc23...",
    "name": "Arjun Sharma",
    "email": "arjun@haveli.com",
    "avatar": null,
    "createdAt": "2026-04-01T10:00:00.000Z",
    "updatedAt": "2026-04-01T10:00:00.000Z",
    "_count": {
      "expensesAdded": 8,
      "splits": 15
    }
  }
]
```

**Used on:** Members page, Expenses page (filter dropdown), Add Expense page (added by + split selection)

---

### 1.2 Create Member

```
POST /api/members
```

**Request Body**

| Field   | Type   | Required | Description             |
|---------|--------|----------|-------------------------|
| `name`  | string | Yes      | Full name of the member |
| `email` | string | Yes      | Unique email address    |

**Request Example**

```json
{
  "name": "Arjun Sharma",
  "email": "arjun@haveli.com"
}
```

**Response `201`** — Created member object

**Error `400`** — `name` or `email` missing

**Error `409`** — Email already exists

**Used on:** Members page (Add Member modal)

---

### 1.3 Get Single Member

```
GET /api/members/:id
```

Returns member with all their added expenses and splits.

**Response `200`** — Member object with nested `expensesAdded[]` and `splits[]`

**Error `404`** — Member not found

**Used on:** Currently unused on frontend (available for future member detail page)

---

### 1.4 Update Member

```
PUT /api/members/:id
```

**Request Body**

| Field   | Type   | Required | Description          |
|---------|--------|----------|----------------------|
| `name`  | string | No       | Updated name         |
| `email` | string | No       | Updated email        |

**Request Example**

```json
{
  "name": "Arjun Kumar Sharma",
  "email": "arjun@haveli.com"
}
```

**Response `200`** — Updated member object

**Used on:** Members page (Edit Member modal)

---

### 1.5 Delete Member

```
DELETE /api/members/:id
```

Deletes the member and cascades to all their expenses and splits.

**Response `200`**

```json
{ "success": true }
```

**Used on:** Members page (delete button)

---

## 2. Expenses

### 2.1 List Expenses (Paginated + Filtered)

```
GET /api/expenses
```

**Query Parameters**

| Param      | Type   | Default | Description                                          |
|------------|--------|---------|------------------------------------------------------|
| `page`     | number | `1`     | Page number                                          |
| `limit`    | number | `20`    | Items per page                                       |
| `category` | string | `all`   | Filter by category (e.g. `Groceries`, `Electronics`) |
| `memberId` | string | `all`   | Filter by member who added the expense               |

**Response `200`**

```json
{
  "expenses": [
    {
      "id": "clx2def45...",
      "itemName": "Basmati Rice",
      "quantity": 5,
      "quantityUnit": "kg",
      "price": 90,
      "totalAmount": 450,
      "purchaseDate": "2026-04-02T14:30:00.000Z",
      "notes": null,
      "category": "Groceries",
      "addedById": "clx1abc23...",
      "addedBy": {
        "id": "clx1abc23...",
        "name": "Arjun Sharma",
        "email": "arjun@haveli.com"
      },
      "splits": [
        {
          "id": "clx3ghi67...",
          "amount": 112.5,
          "settled": false,
          "memberId": "clx1abc23...",
          "member": {
            "id": "clx1abc23...",
            "name": "Arjun Sharma"
          }
        }
      ]
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 28,
    "totalPages": 2
  }
}
```

**Used on:** Expenses page (main list), Dashboard (recent 5 with `?limit=5`)

---

### 2.2 Create Expense

```
POST /api/expenses
```

Creates an expense and automatically splits it equally among selected members.

**Request Body**

| Field          | Type     | Required | Description                                    |
|----------------|----------|----------|------------------------------------------------|
| `itemName`     | string   | Yes      | Name of the item                               |
| `quantity`     | number   | No       | Quantity purchased (default: `1`)              |
| `quantityUnit` | string  | No       | Unit of measurement (default: `"pcs"`)         |
| `price`        | number   | Yes      | Price per unit                                 |
| `purchaseDate` | string   | No       | ISO date string (default: now)                 |
| `notes`        | string   | No       | Additional notes                               |
| `category`     | string   | No       | Category name (default: `"General"`)           |
| `addedById`    | string   | Yes      | Member ID of who added the expense             |
| `splitAmong`   | string[] | Yes      | Array of member IDs to split the expense among |

**Request Example**

```json
{
  "itemName": "Basmati Rice",
  "quantity": 5,
  "quantityUnit": "kg",
  "price": 90,
  "purchaseDate": "2026-04-02T14:30:00.000Z",
  "category": "Groceries",
  "addedById": "clx1abc23...",
  "splitAmong": ["clx1abc23...", "clx1xyz89...", "clx1mno45..."]
}
```

**Computation:** `totalAmount = quantity × price`, `splitAmount = totalAmount / splitAmong.length`

**Response `201`** — Created expense with `addedBy` and `splits` populated

**Error `400`** — Missing required fields

**Used on:** Add Expense page

---

### 2.3 Get Single Expense

```
GET /api/expenses/:id
```

**Response `200`** — Expense with `addedBy` and `splits[]` (each with `member`)

**Error `404`** — Expense not found

**Used on:** Currently unused on frontend (available for future expense detail page)

---

### 2.4 Delete Expense

```
DELETE /api/expenses/:id
```

Deletes the expense and all its splits (cascade).

**Response `200`**

```json
{ "success": true }
```

**Used on:** Expenses page (delete button on each expense card)

---

### 2.5 Toggle Split Settlement

```
PATCH /api/expenses/:id/settle
```

Marks a specific member's split as settled or pending.

**Request Body**

| Field     | Type    | Required | Description                   |
|-----------|---------|----------|-------------------------------|
| `splitId` | string  | Yes      | ID of the expense split       |
| `settled` | boolean | Yes      | `true` = settled, `false` = pending |

**Request Example**

```json
{
  "splitId": "clx3ghi67...",
  "settled": true
}
```

**Response `200`** — Updated split object with `member`

**Used on:** Expenses page (clicking on a member's split badge toggles settlement)

---

## 3. Analytics

### 3.1 Get All Analytics

```
GET /api/analytics
```

Returns all aggregated analytics data in a single response. No parameters.

**Response `200`**

```json
{
  "totalExpenses": 25430,
  "totalItems": 28,
  "memberCount": 4,
  "avgExpensePerItem": 908.21,

  "topItems": [
    { "name": "Basmati Rice", "count": 3, "total": 1350 },
    { "name": "Milk", "count": 2, "total": 620 }
  ],

  "highestSpending": [
    { "name": "Electricity Bill", "total": 2800 },
    { "name": "WiFi Router", "total": 1899 }
  ],

  "memberSpending": [
    { "name": "Arjun Sharma", "spent": 8500, "owed": 6320 },
    { "name": "Priya Sharma", "spent": 7200, "owed": 6540 }
  ],

  "monthlyTrend": [
    { "month": "Nov 2025", "total": 3200 },
    { "month": "Dec 2025", "total": 4800 },
    { "month": "Jan 2026", "total": 5100 },
    { "month": "Feb 2026", "total": 3900 },
    { "month": "Mar 2026", "total": 4600 },
    { "month": "Apr 2026", "total": 3830 }
  ],

  "categoryBreakdown": [
    { "category": "Groceries", "total": 8540 },
    { "category": "Utilities", "total": 3700 },
    { "category": "Electronics", "total": 3646 }
  ]
}
```

**Field details:**

| Field               | Description                                                        |
|---------------------|--------------------------------------------------------------------|
| `totalExpenses`     | Sum of `totalAmount` across all expenses                           |
| `totalItems`        | Count of all expense entries                                       |
| `memberCount`       | Count of all members                                               |
| `avgExpensePerItem` | `totalExpenses / totalItems`                                       |
| `topItems`          | Top 8 items by purchase frequency (`count`), with total spend      |
| `highestSpending`   | Top 8 items sorted by total amount spent                           |
| `memberSpending`    | Per-member: `spent` = total they added, `owed` = total from splits |
| `monthlyTrend`      | Last 6 months of spending totals                                   |
| `categoryBreakdown` | Spending totals grouped by category, sorted descending             |

**Used on:** Dashboard (stat cards, member spending bars, top 4 items), Analytics page (all charts and lists)

---

## 4. Suggestions

### 4.1 Search Item Suggestions

```
GET /api/suggestions?q=:query
```

Searches previously added expense items from the database. Results are merged on the frontend with a local curated item catalog (client-side only, not from this API).

**Query Parameters**

| Param | Type   | Required | Description                     |
|-------|--------|----------|---------------------------------|
| `q`   | string | Yes      | Search query (min 1 character)  |

**Response `200`**

```json
[
  {
    "name": "Basmati Rice",
    "category": "Groceries",
    "unit": "kg",
    "defaultPrice": 90,
    "source": "history"
  },
  {
    "name": "Basmati Rice",
    "category": "Groceries",
    "unit": "kg",
    "defaultPrice": 90,
    "source": "suggested"
  }
]
```

| Field          | Description                                                |
|----------------|------------------------------------------------------------|
| `name`         | Item name                                                  |
| `category`     | Category the item belongs to                               |
| `unit`         | Quantity unit (`pcs`, `kg`, `g`, `L`, `ml`, `pack`, `dozen`) |
| `defaultPrice` | Last known or suggested price                              |
| `source`       | `"history"` = from DB, `"suggested"` = from curated list   |

Returns max 8 results. History items appear first, deduplicated by name.

Returns empty array `[]` if query is empty or on error.

**Used on:** Add Expense page (item name autocomplete dropdown)

---

## Error Format

All error responses follow this structure:

```json
{
  "error": "Human-readable error message"
}
```

Common status codes:

| Code  | Meaning                          |
|-------|----------------------------------|
| `200` | Success                          |
| `201` | Created                          |
| `400` | Bad request (missing fields)     |
| `404` | Resource not found               |
| `409` | Conflict (duplicate email, etc.) |
| `500` | Internal server error            |

---

## API Summary

| #  | Method   | Endpoint                       | Purpose                          |
|----|----------|--------------------------------|----------------------------------|
| 1  | `GET`    | `/api/members`                 | List all members with counts     |
| 2  | `POST`   | `/api/members`                 | Create a member                  |
| 3  | `GET`    | `/api/members/:id`             | Get single member with details   |
| 4  | `PUT`    | `/api/members/:id`             | Update a member                  |
| 5  | `DELETE` | `/api/members/:id`             | Delete a member (cascade)        |
| 6  | `GET`    | `/api/expenses`                | List expenses (paginated/filtered) |
| 7  | `POST`   | `/api/expenses`                | Create expense with auto-split   |
| 8  | `GET`    | `/api/expenses/:id`            | Get single expense               |
| 9  | `DELETE` | `/api/expenses/:id`            | Delete an expense (cascade)      |
| 10 | `PATCH`  | `/api/expenses/:id/settle`     | Toggle split settlement          |
| 11 | `GET`    | `/api/analytics`               | All analytics in one response    |
| 12 | `GET`    | `/api/suggestions?q=`          | Search item history for autocomplete |
