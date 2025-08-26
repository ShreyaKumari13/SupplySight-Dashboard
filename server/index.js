const { ApolloServer } = require('@apollo/server');
const { startStandaloneServer } = require('@apollo/server/standalone');

const typeDefs = `
  type Warehouse {
    code: ID!
    name: String!
    city: String!
    country: String!
  }

  type Product {
    id: ID!
    name: String!
    sku: String!
    warehouse: String!
    stock: Int!
    demand: Int!
  }

  type KPI {
    date: String!
    stock: Int!
    demand: Int!
  }

  type Query {
    products(search: String, status: String, warehouse: String): [Product!]!
    warehouses: [Warehouse!]!
    kpis(range: String!): [KPI!]!
  }

  type Mutation {
    updateDemand(id: ID!, demand: Int!): Product!
    transferStock(id: ID!, from: String!, to: String!, qty: Int!): Product!
  }
`;

const mockProducts = [
  { "id": "P-1001", "name": "12mm Hex Bolt", "sku": "HEX-12-100", "warehouse": "BLR-A", "stock": 180, "demand": 120 },
  { "id": "P-1002", "name": "Steel Washer", "sku": "WSR-08-500", "warehouse": "BLR-A", "stock": 50, "demand": 80 },
  { "id": "P-1003", "name": "M8 Nut", "sku": "NUT-08-200", "warehouse": "PNQ-C", "stock": 80, "demand": 80 },
  { "id": "P-1004", "name": "Bearing 608ZZ", "sku": "BRG-608-50", "warehouse": "DEL-B", "stock": 24, "demand": 120 },
  { "id": "P-1005", "name": "Steel Rod 10mm", "sku": "ROD-10-300", "warehouse": "BLR-A", "stock": 200, "demand": 150 },
  { "id": "P-1006", "name": "Rubber Gasket", "sku": "GSK-RB-100", "warehouse": "PNQ-C", "stock": 30, "demand": 30 },
  { "id": "P-1007", "name": "Aluminum Plate", "sku": "PLT-AL-200", "warehouse": "DEL-B", "stock": 45, "demand": 60 },
  { "id": "P-1008", "name": "Spring Coil", "sku": "SPR-CL-50", "warehouse": "BLR-A", "stock": 100, "demand": 90 },
  { "id": "P-1009", "name": "Copper Wire", "sku": "WR-CP-500", "warehouse": "PNQ-C", "stock": 15, "demand": 40 },
  { "id": "P-1010", "name": "Plastic Cover", "sku": "CVR-PL-100", "warehouse": "DEL-B", "stock": 75, "demand": 55 },
  { "id": "P-1011", "name": "Stainless Screw", "sku": "SCR-SS-250", "warehouse": "BLR-A", "stock": 120, "demand": 140 },
  { "id": "P-1012", "name": "Ceramic Insulator", "sku": "INS-CR-75", "warehouse": "PNQ-C", "stock": 35, "demand": 35 }
];

const mockWarehouses = [
  { "code": "BLR-A", "name": "Bangalore Warehouse A", "city": "Bangalore", "country": "India" },
  { "code": "PNQ-C", "name": "Pune Warehouse C", "city": "Pune", "country": "India" },
  { "code": "DEL-B", "name": "Delhi Warehouse B", "city": "Delhi", "country": "India" }
];

const generateKPIs = (range) => {
  const days = range === '7d' ? 7 : range === '14d' ? 14 : 30;
  const kpis = [];
  
  for (let i = days - 1; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    
    const totalStock = mockProducts.reduce((sum, p) => sum + p.stock, 0);
    const totalDemand = mockProducts.reduce((sum, p) => sum + p.demand, 0);
    
    // Add some variation
    const stockVariation = Math.floor(Math.random() * 100) - 50;
    const demandVariation = Math.floor(Math.random() * 80) - 40;
    
    kpis.push({
      date: date.toISOString().split('T')[0],
      stock: Math.max(0, totalStock + stockVariation),
      demand: Math.max(0, totalDemand + demandVariation)
    });
  }
  
  return kpis;
};

const resolvers = {
  Query: {
    products: (_, { search, status, warehouse }) => {
      let filtered = [...mockProducts];
      
      if (search) {
        const searchLower = search.toLowerCase();
        filtered = filtered.filter(p => 
          p.name.toLowerCase().includes(searchLower) ||
          p.sku.toLowerCase().includes(searchLower) ||
          p.id.toLowerCase().includes(searchLower)
        );
      }
      
      if (warehouse && warehouse !== 'All') {
        filtered = filtered.filter(p => p.warehouse === warehouse);
      }
      
      if (status && status !== 'All') {
        filtered = filtered.filter(p => {
          const productStatus = p.stock > p.demand ? 'Healthy' : 
                               p.stock === p.demand ? 'Low' : 'Critical';
          return productStatus === status;
        });
      }
      
      return filtered;
    },
    warehouses: () => mockWarehouses,
    kpis: (_, { range }) => generateKPIs(range)
  },
  Mutation: {
    updateDemand: (_, { id, demand }) => {
      const productIndex = mockProducts.findIndex(p => p.id === id);
      if (productIndex !== -1) {
        mockProducts[productIndex].demand = demand;
        return mockProducts[productIndex];
      }
      throw new Error('Product not found');
    },
    transferStock: (_, { id, from, to, qty }) => {
      const productIndex = mockProducts.findIndex(p => p.id === id);
      if (productIndex !== -1) {
        if (mockProducts[productIndex].stock >= qty) {
          mockProducts[productIndex].stock -= qty;
          mockProducts[productIndex].warehouse = to;
          return mockProducts[productIndex];
        }
        throw new Error('Insufficient stock');
      }
      throw new Error('Product not found');
    }
  }
};

async function startServer() {
  const server = new ApolloServer({
    typeDefs,
    resolvers,
  });

  const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 },
  });

  console.log(`🚀 Server ready at: ${url}`);
}

startServer().catch(error => {
  console.error('Error starting server:', error);
});