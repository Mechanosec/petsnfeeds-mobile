# Архітектура застосунку Pets&Feed

## Огляд

Pets&Feed - це мобільний застосунок на React Native Expo для пошуку та бронювання товарів для тварин. Застосунок використовує file-based routing через Expo Router та TypeScript для type safety.

## Структура проєкту

```
petsnfeeds-mobile/
├── app/                          # Екрани (file-based routing)
│   ├── _layout.tsx              # Root layout з навігацією
│   ├── (tabs)/                  # Tab navigation group
│   │   ├── _layout.tsx          # Tabs layout
│   │   ├── index.tsx            # Головна (пошук)
│   │   └── explore.tsx          # Замовлення
│   ├── product/                 # Dynamic routes
│   │   └── [id].tsx            # Деталі товару
│   ├── order/
│   │   └── [id].tsx            # Деталі замовлення
│   ├── map.tsx                  # Карта магазинів
│   ├── profile.tsx              # Профіль
│   └── modal.tsx                # Example modal
│
├── components/                   # Reusable UI components
│   ├── product-card.tsx         # Картка товару
│   ├── search-bar.tsx           # Пошукова панель
│   ├── store-list-item.tsx      # Елемент списку магазинів
│   └── order-card.tsx           # Картка замовлення
│
├── services/                     # API services
│   ├── api.ts                   # Base API client (axios)
│   ├── products.service.ts      # Products API
│   ├── orders.service.ts        # Orders API
│   ├── stores.service.ts        # Stores API
│   └── auth.service.ts          # Authentication API
│
├── contexts/                     # React contexts
│   └── auth-context.tsx         # Auth state management
│
├── hooks/                        # Custom React hooks
│   ├── use-location.ts          # Location permissions & coords
│   ├── use-color-scheme.ts      # Theme detection
│   └── use-theme-color.ts       # Theme colors
│
├── types/                        # TypeScript type definitions
│   └── index.ts                 # Core types
│
└── constants/                    # App constants
    ├── theme.ts                 # Theme configuration
    └── colors.ts                # Color palette
```

## Шари архітектури

### 1. Presentation Layer (UI)

**app/** - Екрани застосунку
- Використовується file-based routing від Expo Router
- Кожен файл автоматично стає роутом
- Динамічні роути через `[param]` синтаксис
- Групування через `(tabs)`, `(stack)`, etc.

**components/** - UI компоненти
- Переісполюзовані компоненти
- Presentation logic
- Stylesheets з React Native StyleSheet API

### 2. Business Logic Layer

**services/** - API інтеграція
- Axios для HTTP запитів
- Централізована конфігурація API
- Interceptors для auth токенів
- Error handling

**contexts/** - State management
- React Context API для глобального стану
- Auth context для аутентифікації
- Можна додати інші контексти (Cart, Filters, etc.)

**hooks/** - Custom React hooks
- Переісполюзована логіка
- Side effects
- State management

### 3. Data Layer

**types/** - Type definitions
- TypeScript interfaces
- Type safety across the app
- API response types

## Навігація

### Stack Navigation (Root)
```
RootLayout
├── (tabs) - Tab Navigator
├── product/[id] - Product Details
├── order/[id] - Order Details  
├── map - Map View
└── profile - User Profile
```

### Tab Navigation
```
TabLayout
├── index (Home) - Product Search
└── explore (Orders) - Orders List
```

### Навігаційні patterns

**Push** - Перехід на новий екран
```typescript
router.push('/product/123');
```

**Modal** - Відкрити як модальне вікно
```typescript
router.push('/profile'); // Configured as modal in _layout
```

**Back** - Повернутись назад
```typescript
router.back();
```

## Data Flow

### 1. User Action
```
User clicks on product card
  ↓
ProductCard onPress callback
  ↓
router.push('/product/123')
```

### 2. API Request
```
ProductDetailsScreen loads
  ↓
useEffect calls loadProductDetails()
  ↓
productsService.getProduct(id)
  ↓
axios.get('/api/products/123')
```

### 3. State Update
```
API response received
  ↓
setState(data)
  ↓
Component re-renders with new data
```

## Authentication Flow

```
Login Screen
  ↓
authService.login(email, password)
  ↓
API returns { user, token }
  ↓
Store token in SecureStore
  ↓
Update AuthContext
  ↓
Navigate to Home
```

### Protected Routes
```typescript
// В _layout.tsx або в екрані
const { isAuthenticated } = useAuth();

if (!isAuthenticated) {
  router.replace('/login');
  return null;
}
```

## API Integration

### Request Flow
```
Component
  ↓
Service (productsService)
  ↓
API Client (axios)
  ↓
Request Interceptor (add auth token)
  ↓
Backend API
  ↓
Response Interceptor (handle errors)
  ↓
Service returns typed data
  ↓
Component updates state
```

### Error Handling
```typescript
try {
  const data = await productsService.getProduct(id);
  setProduct(data);
} catch (error) {
  console.error('Failed to load product:', error);
  // Show error toast/alert
}
```

## State Management Strategy

### Local State (useState)
- Component-specific state
- Form inputs
- UI state (loading, expanded, etc.)

### Context API (useContext)
- Global app state
- User authentication
- Theme preferences
- Shopping cart (TODO)

### Server State (API)
- Products data
- Orders data
- User profile
- Stores data

## Styling Strategy

### StyleSheet API
```typescript
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
});
```

### Theme System
- Colors defined in `constants/colors.ts`
- Light/Dark theme support через `useColorScheme`
- Consistent design tokens

### Responsive Design
- Flexbox for layouts
- Platform.select() для platform-specific styles
- SafeAreaView для notch/status bar

## Performance Optimizations

### 1. List Rendering
```typescript
<FlatList
  data={items}
  renderItem={renderItem}
  keyExtractor={(item) => item.id}
  // Performance props
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
  windowSize={10}
/>
```

### 2. Image Optimization
```typescript
<Image
  source={{ uri: url }}
  resizeMode="cover"
  // Може додати progressive loading
/>
```

### 3. Memoization
```typescript
const MemoizedComponent = React.memo(Component);

const memoizedValue = useMemo(() => computeExpensive(), [deps]);

const memoizedCallback = useCallback(() => {}, [deps]);
```

## Security Considerations

### 1. Secure Storage
```typescript
import * as SecureStore from 'expo-secure-store';

// Store sensitive data
await SecureStore.setItemAsync('userToken', token);

// Retrieve
const token = await SecureStore.getItemAsync('userToken');
```

### 2. API Security
- HTTPS only
- Auth tokens in headers
- Token refresh logic
- Logout on 401

### 3. Input Validation
- Validate user inputs
- Sanitize data before API calls
- Handle edge cases

## Testing Strategy (TODO)

### Unit Tests
- Services
- Utility functions
- Custom hooks

### Integration Tests
- API integration
- Navigation flows

### E2E Tests
- Critical user flows
- Purchase flow
- Authentication

## Build & Deployment

### Development
```bash
npm start
```

### Production Build
```bash
# Android
eas build --platform android

# iOS
eas build --platform ios
```

### OTA Updates
```bash
eas update --branch production
```

## Розширення функціональності

### Додавання нового екрану
1. Створити файл в `app/`
2. Додати route в `_layout.tsx` (опціонально)
3. Імплементувати компонент з екраном

### Додавання нового API endpoint
1. Додати метод в відповідний service
2. Типізувати request/response
3. Викликати з компонента

### Додавання нового компонента
1. Створити файл в `components/`
2. Експортувати компонент
3. Використати в екранах

## Майбутні покращення

- [ ] Redux або Zustand для складнішого state management
- [ ] React Query для server state caching
- [ ] Offline support з AsyncStorage
- [ ] Error boundaries
- [ ] Analytics integration
- [ ] Performance monitoring
- [ ] Automated testing
- [ ] CI/CD pipeline
