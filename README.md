# 📈 Stock Exchange Project

A modern client-side stock search and comparison web app using vanilla JavaScript and the Financial Modeling Prep API.

---

## 🚀 Features

- 🔍 **Search Companies:** Lookup NASDAQ-listed companies by name or symbol.
- 📊 **View Stock Info:** See real-time stock data including price and change percentage.
- 🧾 **Company Details:** Click on a company to open its profile with a historical chart.
- 🧩 **Compare Companies:** Add companies to a comparison list and navigate to compare page.
- 📡 **Live Marquee Ticker:** Top 10 companies scroll automatically with live updates.
- 🎨 **Clean Modular Code:** ES6 module structure with separation of concerns.

---

## 🗂️ Project Structure

```
Stock-Exchange-Project/
├── index.html              # Main search and comparison page
├── company.html            # Single company detail page
├── compare.html            # Comparison page (WIP or optional)
├── style.css               # Styling (marquee, compare bar, results, etc.)
├── scripts.js              # App entry point that wires modules together
├── Marquee.js              # Live scrolling stock ticker
├── SearchForm.js           # Search bar input logic
├── SearchResults.js        # Renders results with compare buttons
├── CompareListManager.js   # Manages compare bar state and UI
├── CompanyInfo.js          # Detailed company page (class-based)
└── company.js              # Alternative to CompanyInfo.js using functions
```

---

## 🛠️ How to Run

1. Clone this repo:

   ```bash
   git clone https://github.com/HaimFC/Stock-Exchange-Project.git
   cd Stock-Exchange-Project
   ```

2. No build tools needed. Just open `index.html` in your browser.

---

## 📦 API Used

- **Financial Modeling Prep API**
  - [https://financialmodelingprep.com/developer/docs](https://financialmodelingprep.com/developer/docs)

  Make sure to use a valid API key

---

## 🧠 Author

Made with 💻 by Haim Fellner Cohen  
---
