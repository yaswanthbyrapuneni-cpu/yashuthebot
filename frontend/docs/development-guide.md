# Development Guide

## Getting Started

### Environment Setup

1. **Node.js Installation**
   ```bash
   # Check Node.js version
   node --version  # Should be latest LTS
   ```

2. **Project Setup**
   ```bash
   # Clone repository
   git clone [repository-url]
   cd demo

   # Install dependencies
   npm install
   ```

3. **Development Server**
   ```bash
   # Start development server
   npm run dev

   # Build for production
   npm run build
   ```

## Project Structure

```
demo/
├── src/
│   ├── components/         # React components
│   │   ├── VirtualTryOn.tsx
│   │   ├── ProductCard.tsx
│   │   └── ...
│   ├── detectors/         # ML model management
│   │   └── DetectorManager.ts
│   ├── utils/             # Utility functions
│   │   ├── jewelry-positioner.ts
│   │   └── ...
│   ├── styles/            # CSS/styling files
│   │   └── globals.css
│   └── assets/           # Static assets
├── public/               # Public assets
├── docs/                # Documentation
└── package.json         # Project configuration
```

## Code Style Guide

### TypeScript Guidelines

1. **Type Definitions**
   ```typescript
   // Prefer interfaces for objects
   interface ProductProps {
     id: string;
     name: string;
     price: number;
   }

   // Use type for unions/intersections
   type JewelryCategory = 'necklace' | 'earrings' | 'rings';
   ```

2. **Error Handling**
   ```typescript
   try {
     await loadDetector(type);
   } catch (error) {
     if (error instanceof Error) {
       console.error(`Detector loading failed: ${error.message}`);
     }
     // Handle error appropriately
   }
   ```

### React Best Practices

1. **Component Structure**
   ```typescript
   // Functional components with TypeScript
   interface ComponentProps {
     // Props definition
   }

   export function Component({ prop1, prop2 }: ComponentProps) {
     // Component logic
     return (
       // JSX
     );
   }
   ```

2. **Hooks Usage**
   ```typescript
   // Custom hooks
   function useDetector(type: DetectorType) {
     const [isLoading, setIsLoading] = useState(true);
     // Hook logic
     return { isLoading, /* other values */ };
   }
   ```

## Testing

### Unit Testing
```bash
# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### E2E Testing
```bash
# Run E2E tests
npm run test:e2e
```

## Performance Optimization

### Video Processing
- Limit frame rate to 30 FPS
- Use WebGL acceleration
- Implement frame skipping when needed

### Memory Management
- Clean up resources properly
- Implement proper unmounting cleanup
- Monitor memory usage

## Debugging

### Common Issues

1. **Camera Access**
   - Check HTTPS requirement
   - Verify permissions
   - Check browser compatibility

2. **Detection Issues**
   - Verify model loading
   - Check console for errors
   - Validate input data

3. **Rendering Problems**
   - Check WebGL support
   - Verify canvas context
   - Monitor frame rate

### Development Tools

1. **Browser DevTools**
   - Performance monitoring
   - Memory profiling
   - Network analysis

2. **React DevTools**
   - Component inspection
   - Props/state monitoring
   - Performance profiling

## Deployment

### Build Process
```bash
# Production build
npm run build

# Preview build
npm run preview
```

### Environment Configuration
```env
# .env.production
VITE_API_URL=https://api.example.com
```

## Contributing

### Pull Request Process

1. Fork the repository
2. Create feature branch
3. Commit changes
4. Push to branch
5. Create Pull Request

### Commit Guidelines

```
feat: Add new feature
fix: Bug fix
docs: Documentation updates
style: Code style changes
refactor: Code refactoring
test: Add/update tests
chore: Maintenance tasks
```

## Resources

- [MediaPipe Documentation](https://developers.google.com/mediapipe)
- [React Documentation](https://reactjs.org/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)