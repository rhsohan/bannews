# BanNews Investment Tracker

A modern, responsive frontend-only investment management web application for BanNews.
Built with React, Vite, Tailwind CSS, and uses Google Sheets as the database via Google Apps Script.

## Features
- **Dashboard**: Track Total Investment, Total Profit, ROI, and transaction counts.
- **Charts**: Interactive monthly and cumulative trends using Recharts.
- **Transactions**: Add, edit, and delete investments and profits.
- **Table**: Sort, filter (by type and search term), and pagination.
- **Export**: Export filtered data directly to CSV.
- **Security**: No database credentials in frontend (Google Apps Script abstraction layer).

## Setup Instructions

### 1. Google Sheets Setup
1. Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
2. Name it "BanNews Tracker".

### 2. Google Apps Script Setup
1. In your new Google Sheet, go to **Extensions > Apps Script**.
2. Delete any code in the default `Code.gs` file.
3. Open the `apps-script/Code.gs` file from this project's folder.
4. Copy all its contents and paste them into your Apps Script editor.
5. Click the **Save** icon.
6. Click **Deploy > New deployment**.
7. In the *Select type* gear icon, choose **Web app**.
8. Set the configuration to:
   - **Description**: BanNews API
   - **Execute as**: Me
   - **Who has access**: Anyone
9. Click **Deploy** and authorize the permissions when prompted.
10. Copy the generated **Web app URL**.

### 3. Frontend Setup
1. Create a `.env` file in the root of the React project based on `.env.example`.
2. Set the URL you copied from Apps Script:
   ```env
   VITE_APPS_SCRIPT_URL=https://script.google.com/macros/s/YOUR_URL/exec
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

### 4. Build for Production
To build the application for deployment (e.g., Netlify, Vercel, Firebase):
```bash
npm run build
```
The optimized files will be located in the `dist` directory.
