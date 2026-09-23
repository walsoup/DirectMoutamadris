# Direct Moutamadris 📚

> A fast, direct client to view your Moroccan high school and middle school grades without the clunky portal wait.

Direct Moutamadris is a lightweight web interface and client designed to query the Massar / Moutamadris student grading service directly. It fetches grade breakdowns, continuous assessment marks, and exam summaries cleanly and fast.

---

## Why This Exists

During peak exam weeks, thousands of students refresh the Massar portal simultaneously, turning simple grade checks into an exercise in waiting out timeouts. Direct Moutamadris bypasses the portal assets entirely. It queries the student endpoint directly and formats your marks cleanly.

---

## Features

- **Fast Grade Queries**: Directly retrieves your module marks and semester averages.
- **Clean Layout**: Clean, readable typography optimized for mobile screens.
- **Zero Credential Storage**: Authentication occurs directly against institutional login endpoints. Credentials are not saved, logged, or forwarded anywhere.
- **Local / Self-Hostable**: Run locally on your own machine.

---

## Getting Started

### Prerequisites

- Node.js 18+ or modern browser runtime.
- Your official Massar credentials (`CNE/Code Massar` and password).

### Local Setup

```bash
# Clone the repository
git clone https://github.com/walsoup/DirectMoutamadris.git
cd DirectMoutamadris

# Install dependencies
npm install

# Start the local development server
npm run dev
```

Open `http://localhost:3000` in your browser.

> **Note**: Due to CORS policies and IP filtering applied by upstream servers, cloud-hosted deployments (e.g. standard Vercel serverless nodes outside Morocco) may experience connection timeouts. Running locally or via a domestic IP proxy provides the most reliable connection.

---

## Disclaimer & Terms of Use

This project is an unofficial, independent tool built for student convenience and educational purposes. It is not affiliated with, endorsed by, or connected to the Ministry of National Education, Preschool and Sports (MENPS). 

Please read the full [Disclaimer and Terms of Use](DISCLAIMER.md) before using this tool.

---

## License

[MIT License](LICENSE)
