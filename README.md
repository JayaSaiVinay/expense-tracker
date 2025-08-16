# Expense Tracker

A clean, Vite-powered React application to track your income and expenses with ease. Visualize your financial health with beautiful charts, export your data, and deploy seamlessly to Firebase Hosting.

---

##  Live Demo

Check out the deployed app here: [https://expense-tracker-bee55.web.app/](https://expense-tracker-bee55.web.app/)

---

##  Features

- **Add & Edit Transactions**: Log your incomes and expenses with names, amounts, dates, and categories. Modify them anytime.
- **Delete or Reset**: Remove individual transactions or reset your entire history.
- **Balance Overview**: See your current balance, total income, and total expenses at a glance.
- **Stunning Visualizations**:
  - Line chart for balance trends over time.
  - Pie chart for spending distribution by category.
- **Search & Sort**: Easily search by name or category, and sort transactions by date or amount.
- **CSV Export**: Download all your transactions as a CSV file for offline use.

---

##  Tech Stack

| Layer        | Tools & Libraries              |
|--------------|-------------------------------|
| Frontend     | React, Vite                    |
| UI Components| Ant Design, Ant Design Charts |
| Date Handling| Day.js                        |
| CSV Export   | PapaParse (`unparse`)         |
| Notifications| React-Toastify                |
| Backend      | Firebase (Auth, Firestore)    |
| Deployment   | Firebase Hosting              |

---

##  Setup & Running Locally

1. **Clone the repo**  
   ```bash
   git clone https://github.com/JayaSaiVinay/expense-tracker.git
   cd expense-tracker
