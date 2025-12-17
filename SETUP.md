# Інструкції з налаштування Pets&Feed Mobile

## 📋 Передумови

Перед початком переконайтесь, що у вас встановлено:

- **Node.js** (версія 18 або вище)
- **npm** або **yarn**
- **Expo CLI**: `npm install -g expo-cli`
- **Expo Go** app на телефоні (для швидкого тестування)

Для розробки під конкретні платформи:
- **Android**: Android Studio + Android SDK
- **iOS**: macOS + Xcode (тільки для Mac)

## 🚀 Крок 1: Встановлення залежностей

```bash
cd /home/mechanosec/PetProjects/petsnfeeds-mobile
npm install
```

Це встановить всі необхідні пакети:
- `react-native-maps` - для карт
- `axios` - для HTTP запитів
- `expo-location` - для отримання геолокації
- та інші залежності

## 🔧 Крок 2: Налаштування середовища

### 2.1 Створіть файл `.env`

```bash
cp .env.example .env
```

Відкрийте `.env` та налаштуйте:

```env
EXPO_PUBLIC_API_URL=http://YOUR_BACKEND_IP:3000/api
```

**Важливо для локальної розробки:**
- Для Android емулятора: `http://10.0.2.2:3000/api`
- Для iOS симулятора: `http://localhost:3000/api`
- Для реального пристрою: `http://192.168.x.x:3000/api` (ваша локальна IP адреса)

Дізнатись локальну IP:
```bash
# Linux/macOS
ifconfig | grep "inet "
# або
ip addr show
```

### 2.2 Налаштуйте Google Maps API

1. Відвідайте [Google Cloud Console](https://console.cloud.google.com/)
2. Створіть новий проект
3. Увімкніть API:
   - Maps SDK for Android
   - Maps SDK for iOS
4. Створіть credentials (API Keys):
   - Один для Android
   - Один для iOS

5. Відкрийте `app.json` та замініть ключі:

```json
{
  "ios": {
    "config": {
      "googleMapsApiKey": "AIzaSy..."
    }
  },
  "android": {
    "config": {
      "googleMaps": {
        "apiKey": "AIzaSy..."
      }
    }
  }
}
```

**Примітка**: Для тестування в Expo Go можна тимчасово пропустити цей крок, але карти не працюватимуть.

## 🎯 Крок 3: Запуск застосунку

### Варіант A: Development з Expo Go (найпростіший)

```bash
npm start
```

Потім:
1. Відскануйте QR код через Expo Go app
2. Або натисніть `a` для Android емулятора
3. Або натисніть `i` для iOS симулятора

**Обмеження**: React Native Maps потребує custom native code, тому для повної функціональності потрібен development build (див. Варіант B).

### Варіант B: Development Build (повна функціональність)

Для роботи з картами потрібен custom build:

**Android:**
```bash
npx expo run:android
```

**iOS** (тільки на macOS):
```bash
npx expo run:ios
```

Це створить development build з нативними модулями.

### Варіант C: Web версія (обмежена функціональність)

```bash
npm run web
```

Карти та деякі нативні функції не працюватимуть.

## 🔍 Крок 4: Підключення до Backend

Переконайтесь, що ваш backend запущений і доступний.

### Приклад структури backend API

Ваш backend повинен надавати ці endpoints:

```
POST   /api/auth/login
POST   /api/auth/register
GET    /api/auth/me

GET    /api/products/search?q={query}
GET    /api/products/:id
GET    /api/products/:id/stores
GET    /api/products/popular

GET    /api/orders
GET    /api/orders/active
GET    /api/orders/history
GET    /api/orders/:id
POST   /api/orders
POST   /api/orders/:id/cancel

GET    /api/stores
GET    /api/stores/:id
GET    /api/stores/nearby?lat={lat}&lng={lng}&radius={radius}
```

### Тестування API

Можете використати mockapi.io або json-server для тестування:

```bash
npm install -g json-server
json-server --watch db.json --port 3000
```

## 🧪 Крок 5: Тестування

### Перевірка коду
```bash
npm run lint
```

### Очистка кешу (якщо виникають проблеми)
```bash
npm start -- --clear
```

## 📱 Крок 6: Білд для продакшену

### EAS Build (рекомендовано)

1. Встановіть EAS CLI:
```bash
npm install -g eas-cli
```

2. Залогіньтесь:
```bash
eas login
```

3. Налаштуйте проект:
```bash
eas build:configure
```

4. Створіть білд:
```bash
# Android
eas build --platform android --profile production

# iOS
eas build --platform ios --profile production
```

### Local Build

**Android APK:**
```bash
cd android
./gradlew assembleRelease
```

APK буде в: `android/app/build/outputs/apk/release/`

## 🐛 Troubleshooting

### "Cannot find module 'axios'" або "Cannot find module 'react-native-maps'"

**Рішення:**
```bash
rm -rf node_modules
npm install
```

### Metro bundler не запускається

**Рішення:**
```bash
npm start -- --reset-cache
```

### Expo Go не може підключитись

**Рішення:**
1. Переконайтесь що телефон і комп'ютер в одній WiFi мережі
2. Вимкніть VPN
3. Перевірте firewall налаштування
4. Спробуйте connection через тунель:
```bash
npm start -- --tunnel
```

### Google Maps не показує карту

**Рішення:**
1. Перевірте що API ключі правильно вказані в `app.json`
2. Переконайтесь що APIs увімкнені в Google Cloud Console
3. Для Android додайте SHA-1 fingerprint:
```bash
cd android
./gradlew signingReport
```
4. Додайте fingerprint в Google Cloud Console

### "Invariant Violation: requireNativeComponent: RNMaps was not found"

Це означає що React Native Maps не може працювати в Expo Go.

**Рішення:** Використовуйте development build:
```bash
npx expo run:android
# або
npx expo run:ios
```

## 📚 Додаткові ресурси

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [React Native Maps](https://github.com/react-native-maps/react-native-maps)
- [Axios Documentation](https://axios-http.com/)

## 🎨 Наступні кроки

1. ✅ Запустити backend API
2. ✅ Створити тестові дані в базі
3. ✅ Налаштувати Google Maps API ключі
4. ✅ Зробити development build для тестування карт
5. ✅ Імплементувати аутентифікацію з токенами
6. ✅ Додати error handling та loading states
7. ✅ Налаштувати push notifications
8. ✅ Провести тестування на реальних пристроях

## 💡 Корисні команди

```bash
# Запуск з очищенням кешу
npm start -- --clear

# Показати всі доступні команди
npx expo --help

# Перевірка версії Expo
npx expo --version

# Оновлення Expo
npx expo upgrade

# Показати device logs
npx expo start --dev-client
```

## 🔐 Безпека

Перед публікацією в production:

1. Змініть `EXPO_PUBLIC_API_URL` на production URL
2. Увімкніть HTTPS для всіх API запитів
3. Додайте обфускацію коду
4. Налаштуйте ProGuard для Android
5. Використовуйте SecureStore для sensitive data
6. Додайте SSL pinning для API запитів

---

**Питання або проблеми?** Перевірте документацію або створіть issue.

Успішної розробки! 🚀

