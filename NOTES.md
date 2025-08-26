# SupplySight Dashboard - Development Notes

## Architecture Decisions

### Frontend Stack
- **React + TypeScript**: Chosen for type safety and better developer experience
- **Tailwind CSS**: Used for rapid UI development with consistent styling
- **Apollo Client**: Selected for GraphQL state management and caching
- **Recharts**: Implemented for the Stock vs Demand trend visualization

### GraphQL Server
- **Apollo Server**: Used standalone server for simplicity in this demo
- **In-memory data**: Mock data stored in memory for demo purposes
- **Extended sample data**: Added more products (12 total) to better demonstrate pagination

## Key Features Implemented

### 1. Dashboard Layout
✅ Top bar with SupplySight logo and date range chips (7d/14d/30d)
✅ Responsive design that works on mobile and desktop
✅ Clean, modern UI following the specification

### 2. KPI Cards
✅ Total Stock calculation (sum of all product stock)
✅ Total Demand calculation (sum of all product demand)  
✅ Fill Rate calculation using formula: `(sum(min(stock, demand)) / sum(demand)) * 100%`
✅ Color-coded Fill Rate (green ≥80%, yellow ≥60%, red <60%)

### 3. Stock vs Demand Chart
✅ Interactive line chart using Recharts
✅ Dynamic data based on selected date range
✅ Realistic data variation with some randomness
✅ Proper tooltips and legends

### 4. Filtering System
✅ Live search by product name, SKU, or ID
✅ Warehouse dropdown filter (populated from GraphQL)
✅ Status filter (All/Healthy/Low/Critical)
✅ Real-time filter updates without manual refresh

### 5. Products Table
✅ All required columns: Product, SKU, Warehouse, Stock, Demand, Status
✅ Status pills with correct color coding:
  - 🟢 Healthy (stock > demand)
  - 🟡 Low (stock = demand)  
  - 🔴 Critical (stock < demand)
✅ Red-tinted rows for critical products
✅ Pagination with 10 products per page
✅ Loading states with skeleton UI

### 6. Product Details Drawer
✅ Right-side slide-out drawer on row click
✅ Complete product information display
✅ Update Demand form with GraphQL mutation
✅ Transfer Stock form with validation and warehouse selection
✅ Real-time data updates after mutations

## Business Logic Implementation

### Status Calculation
```typescript
const getStatus = (stock: number, demand: number) => {
  if (stock > demand) return 'Healthy';
  if (stock === demand) return 'Low';
  return 'Critical'; // stock < demand
}
```

### Fill Rate Calculation
```typescript
const fillRate = products.reduce((sum, product) => 
  sum + Math.min(product.stock, product.demand), 0
) / products.reduce((sum, product) => sum + product.demand, 0) * 100;
```

## Trade-offs Made

### 1. Data Persistence
**Decision**: Used in-memory storage for simplicity
**Trade-off**: Data resets on server restart, but suitable for demo purposes
**Production Alternative**: Would use a proper database (PostgreSQL, MongoDB)

### 2. Error Handling
**Decision**: Basic error handling with alerts
**Trade-off**: Simple but not production-ready UX
**Improvement**: Toast notifications, retry mechanisms, proper error boundaries

### 3. Real-time Updates  
**Decision**: Manual refetch after mutations
**Trade-off**: Simple implementation vs real-time sync
**Improvement**: GraphQL subscriptions for live updates

### 4. Validation
**Decision**: Basic client-side validation
**Trade-off**: Minimal validation for demo speed
**Improvement**: Schema validation, server-side validation, form libraries like Formik

### 5. Mobile Responsiveness
**Decision**: Basic responsive design
**Trade-off**: Works on mobile but could be more optimized
**Improvement**: Dedicated mobile drawer, touch gestures, mobile-first design

## Performance Considerations

### Implemented
- Apollo Client caching for query optimization
- Pagination to limit DOM elements
- Debounced search (implicit through React state)
- Lazy loading of drawer component

### Future Improvements
- Virtual scrolling for large datasets
- Query optimization with GraphQL fragments
- Image lazy loading if product images were added
- Code splitting for better bundle size

## Testing Strategy (Not Implemented)

If given more time, would implement:
- Unit tests for utility functions (status calculation, fill rate)
- Component testing with React Testing Library
- Integration tests for GraphQL operations
- E2E tests with Cypress for critical user flows

## Accessibility Considerations

### Implemented
- Semantic HTML structure
- Keyboard navigation support
- Focus indicators on interactive elements
- ARIA labels where appropriate

### Future Improvements
- Screen reader optimizations
- High contrast mode support
- Reduced motion preferences
- Better focus management in drawer

## Deployment Considerations

### Current Setup
- Separate frontend and backend processes
- Frontend: React dev server (port 3000)
- Backend: Apollo Server (port 4000)

### Production Improvements
- Docker containerization
- Environment variable configuration
- Build optimization and minification
- CDN for static assets
- HTTPS and security headers

## Time Spent Breakdown
- **Setup & Configuration**: 30 minutes
- **GraphQL Server & Schema**: 45 minutes  
- **React Components**: 2 hours
- **Styling & Polish**: 45 minutes
- **Testing & Bug fixes**: 30 minutes
- **Documentation**: 15 minutes

**Total**: ~4.25 hours

## What I'd Improve with More Time

1. **Better Error Handling**: Toast notifications, retry logic, offline support
2. **Advanced Filtering**: Date range filters, multi-select options
3. **Data Export**: CSV/Excel export functionality
4. **Bulk Operations**: Multi-select rows for bulk updates
5. **Dashboard Customization**: Draggable widgets, user preferences
6. **Performance**: Virtual scrolling, advanced caching
7. **Testing**: Comprehensive test suite
8. **Analytics**: Usage tracking, performance monitoring