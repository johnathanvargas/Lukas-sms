# VINE
Virtual Intelligence for Nursery Excellence

## Features
- **Calculators** - Mix Calculator and Granular Helper for precise chemical application calculations
- **Diagnostics** - Plant observation and issue analysis tools
- **Logs** - Consolidated scouting and treatment record keeping
- **Chemical Library** - Comprehensive database of products with rates and specifications
- **Rotation Schedule** - Chemical rotation planning and tracking

## Recent Changes
See [CALCULATORS_CONSOLIDATION.md](./CALCULATORS_CONSOLIDATION.md) for details on the latest calculator consolidation update.

## Development

### Running Tests
```bash
# Unit tests for calculator utilities
node utils/calculators.test.js

# Integration tests
node utils/calculators-integration.test.js

# File existence tests
node test-app.js
```

### Local Development
```bash
# Start a local web server
python3 -m http.server 8080

# Then open http://localhost:8080 in your browser
```

## Architecture
- Pure vanilla JavaScript (no frameworks)
- Progressive Web App (PWA) with offline support
- Service Worker for caching and performance
- LocalStorage for data persistence
- Responsive design for mobile and desktop

## Contributing
This is an internal tool for Lukas Nursery. Always follow product labels - the label is the law.

