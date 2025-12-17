# Pets&Feed - Швидкий старт

## Кроки для запуску проєкту

### 1. Встановлення залежностей

```bash
npm install
```

Або якщо використовуєте yarn:

```bash
yarn install
```

### 2. Налаштування змінних оточення

Створіть файл `.env` в корені проєкту (використовуйте `.env.example` як шаблон):

```bash
cp .env.example .env
```

Відредагуйте `.env` і вкажіть URL вашого бекенду:

```
EXPO_PUBLIC_API_URL=https://your-backend-api.com/api
```

### 3. Налаштування Google Maps

Для роботи з картами потрібні API ключі від Google:

1. Перейдіть на [Google Cloud Console](https://console.cloud.google.com/)
2. Створіть новий проєкт або виберіть існуючий
3. Увімкніть APIs:
   - Maps SDK for Android
   - Maps SDK for iOS
4. Створіть два API ключі (один для Android, один для iOS)
5. Відкрийте `app.json` і замініть:
   - `YOUR_IOS_GOOGLE_MAPS_API_KEY` на ваш iOS ключ
   - `YOUR_ANDROID_GOOGLE_MAPS_API_KEY` на ваш Android ключ

### 4. Запуск проєкту

```bash
npm start
```

Потім виберіть платформу:
- Натисніть `a` для Android
- Натисніть `i` для iOS
- Або відскануйте QR-код в Expo Go app

### 5. Запуск на конкретній платформі

**Android:**
```bash
npm run android
```

**iOS:**
```bash
npm run ios
```

**Web:**
```bash
npm run web
```

## Структура backend API

Ваш backend повинен надавати наступні endpoints:

### Authentication
- `POST /api/auth/login` - Логін
- `POST /api/auth/register` - Реєстрація
- `GET /api/auth/me` - Поточний користувач

### Products
- `GET /api/products/search?q={query}` - Пошук товарів
- `GET /api/products/:id` - Деталі товару
- `GET /api/products/:id/stores` - Магазини з товаром
- `GET /api/products/popular` - Популярні товари

### Orders
- `GET /api/orders` - Список замовлень
- `GET /api/orders/active` - Поточні замовлення
- `GET /api/orders/history` - Історія замовлень
- `GET /api/orders/:id` - Деталі замовлення
- `POST /api/orders` - Створити замовлення
- `POST /api/orders/:id/cancel` - Скасувати замовлення

### Stores
- `GET /api/stores` - Всі магазини
- `GET /api/stores/:id` - Деталі магазину
- `GET /api/stores/nearby?lat={lat}&lng={lng}&radius={radius}` - Найближчі магазини

## Типи даних

Детальні TypeScript типи можна знайти в `types/index.ts`

## Troubleshooting

### Помилка "Cannot find module 'react-native-maps'"

Це означає, що залежності не встановлені. Запустіть:
```bash
npm install
```

### Помилка з Google Maps API

Переконайтесь що:
1. API ключі правильно вказані в `app.json`
2. APIs увімкнені в Google Cloud Console
3. Для Android потрібно додати SHA-1 fingerprint до API ключа

Отримати SHA-1:
```bash
cd android && ./gradlew signingReport
```

### Проблеми з Metro bundler

Очистіть кеш:
```bash
npm start -- --clear
```

### Expo Go не працює

Для нативних модулів (таких як react-native-maps) потрібен development build:
```bash
npx expo run:android
# або
npx expo run:ios
```

## Наступні кроки

1. Реалізуйте backend API згідно з документацією
2. Додайте аутентифікацію з токенами
3. Налаштуйте SecureStore для зберігання токенів
4. Додайте обробку помилок та loading states
5. Імплементуйте кошик для множинного бронювання
6. Додайте push-сповіщення

## Корисні команди

```bash
# Перевірка коду
npm run lint

# Очистка проєкту
npm run reset-project

# Створення production build
npx expo build:android
npx expo build:ios
```

