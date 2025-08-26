# SupplySight Dashboard

A React + TypeScript dashboard for daily inventory management with GraphQL backend. Built as a take-home challenge to demonstrate frontend development skills.

## 🚀 Features

- **Real-time Inventory Tracking**: View stock levels, demand, and status across multiple warehouses
- **Interactive KPI Cards**: Total stock, demand, and fill rate calculations
- **Stock vs Demand Trends**: Interactive line chart with configurable date ranges
- **Advanced Filtering**: Search by name/SKU/ID, filter by warehouse and status
- **Product Management**: Update demand and transfer stock between warehouses
- **Responsive Design**: Works seamlessly on desktop and mobile devices

## 🛠 Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS
- **Backend**: Apollo GraphQL Server
- **Charts**: Recharts
- **State Management**: Apollo Client with caching

## 📦 Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   cd supplysight-dashboard
   npm install
   ```

## 🏃‍♂️ Running the Application

### Option 1: Run both servers separately (recommended)

1. **Start the GraphQL server** (Terminal 1):
   ```bash
   npm run server
   ```
   The GraphQL server will start at `http://localhost:4000`

2. **Start the React app** (Terminal 2):
   ```bash
   npm start
   ```
   The React app will start at `http://localhost:3000`

### Option 2: Access GraphQL Playground
Visit `http://localhost:4000` to explore the GraphQL schema and run queries.

## 📊 Dashboard Features

### KPI Cards
- **Total Stock**: Sum of all product inventory
- **Total Demand**: Sum of all product demand
- **Fill Rate**: Percentage of demand that can be fulfilled

### Product Status Logic
- 🟢 **Healthy**: Stock > Demand
- 🟡 **Low**: Stock = Demand  
- 🔴 **Critical**: Stock < Demand (highlighted in red)

### Filtering & Search
- Search products by name, SKU, or product ID
- Filter by warehouse location
- Filter by inventory status
- Real-time updates as you type

### Product Management
Click any product row to:
- View detailed product information
- Update demand quantities
- Transfer stock between warehouses

## 🎯 Sample Data

The application includes 12 sample products across 3 warehouses:
- **BLR-A**: Bangalore Warehouse A
- **PNQ-C**: Pune Warehouse C  
- **DEL-B**: Delhi Warehouse B

## 📋 GraphQL Schema

### Queries
- `products(search, status, warehouse)`: Get filtered product list
- `warehouses`: Get all warehouse locations
- `kpis(range)`: Get stock/demand trends for date range

### Mutations
- `updateDemand(id, demand)`: Update product demand
- `transferStock(id, from, to, qty)`: Transfer stock between warehouses

## 🏗 Project Structure

```
src/
├── components/          # React components
│   ├── Dashboard.tsx    # Main dashboard layout
│   ├── TopBar.tsx      # Header with date range
│   ├── KPICards.tsx    # Metrics cards
│   ├── StockChart.tsx  # Trend visualization
│   ├── FiltersRow.tsx  # Search and filters
│   ├── ProductsTable.tsx # Product table with pagination
│   └── ProductDrawer.tsx # Side panel for product details
├── types/              # TypeScript type definitions
├── apollo-client.ts    # GraphQL client setup
└── App.tsx            # Main app component

server/
└── index.js           # GraphQL server with mock data
```

## 📝 Development Notes

See `NOTES.md` for detailed information about:
- Architecture decisions and trade-offs
- Implementation details
- Performance considerations
- Future improvements

## 🚧 Future Enhancements

- Real-time updates with GraphQL subscriptions
- Advanced filtering and bulk operations
- Data export functionality
- Enhanced mobile experience
- Comprehensive test suite

## 📄 License

This project is for demonstration purposes only.

---

Built with ❤️ for the SupplySight take-home challenge
