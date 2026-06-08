# HopeLink — A Support Community Platform

HopeLink is a web platform that connects communities in need (orphanages, shelters, elderly care homes, disability support centers) with donors and volunteers. Built as the AOL project for Software Engineering (COMP6100001) at Binus University.

**SDG Alignment:** SDG 1 (No Poverty) · SDG 10 (Reduce Inequality) · SDG 17 (Partnerships for Goals)

---

## Team Members

| Name | NIM |
|---|---|
| M. Aghas Aswangga Nazira Kumala | 2802548455 |
| Artika Nethania Joana Benedict S | 2802455350 |
| Catherine Sharon | 2802415063 |
| Kezia Gracella Natanaella H | 2802526044 |
| Rebecca Jielian | 2802426110 |

---

## Features

- User authentication with role-based access (Donor, Community Representative, Admin)
- Community registration and admin verification
- Donation and volunteer application system
- Activity/event management with slot tracking
- Rating and review system
- Notification system
- Admin dashboard

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | HTML, CSS, Vanilla JavaScript |
| Backend | Node.js + Express.js |
| Database | MySQL + Sequelize ORM |
| Authentication | JWT (JSON Web Token) |
| Testing | Jest + Supertest |

---

## Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v16 or higher)
- [MySQL](https://www.mysql.com/) (v8 or higher)
- [Git](https://git-scm.com/)

---

## How to Run

### 1. Clone the repository
```bash
git clone https://github.com/ArtikaNethania/HopeLink_AOL.git
cd HopeLink_AOL
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup environment variables
Create a `.env` file in the root directory:
```env
NODE_ENV=development
PORT=3000

DB_HOST=localhost
DB_PORT=3306
DB_NAME=hopelink_db
DB_USER=root
DB_PASSWORD=

JWT_SECRET=hopelink_secret_key_super_aman_123456
JWT_EXPIRE=7d
JWT_REFRESH_EXPIRE=30d

FRONTEND_URL=http://localhost:3000
```

### 4. Setup database
Open MySQL and create the database:
```sql
CREATE DATABASE hopelink_db;
```

### 5. Run the backend server
```bash
npm run dev
```
Server will run on `http://localhost:3000`

### 6. Open the frontend
Open `index.html` in your browser, or use a static file server like Live Server (VS Code extension).

---

## Default Admin Account

```
Email: admin@hopelink.com
Password: admin123
```

---

## Running Tests

```bash
npm test
```

Expected output: **19 passed, 0 failed**

---

## Project Links

Stuff related to this project can be accessed through:
[https://binusianorg-my.sharepoint.com/personal/rebecca_jielian_binus_ac_id/_layouts/15/guestaccess.aspx?share=IgCbcetsWVSsSolI68gOuZnHAWpwoid8wfgigiFldJGAzU0&e=aJx8KX](https://binusianorg-my.sharepoint.com/personal/rebecca_jielian_binus_ac_id/_layouts/15/guestaccess.aspx?share=IgCbcetsWVSsSolI68gOuZnHAWpwoid8wfgigiFldJGAzU0&e=aJx8KX)

| Resource | Link |
|---|---|
| GitHub Repository | [HopeLink_AOL](https://github.com/ArtikaNethania/HopeLink_AOL) |
| Presentation (PPT) | [Canva](https://canva.link/42lafj4itl6tj74) |
| UI Design (Figma) | [Figma](https://www.figma.com/design/f11L4GZhJsiD49dPonzLPv/AOL_SE?node-id=0-1&t=ab2GLXg6Pexc5qUg-1) |
| Final Report | [SharePoint](https://binusianorgmy.sharepoint.com/personal/kezia_haryono_binus_ac_id/_layouts/15/guestaccess.aspx?share=IQATlNvynHMgSI-6AjXBg5dVAeMqkBj8vLbVRYtxWINquk&e=TxCFj9) |

---

## License

This project is created for educational purposes as part of Binus University Software Engineering AOL Assessment.