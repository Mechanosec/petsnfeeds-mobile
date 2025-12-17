// Mock data for testing without backend
import { Order, Product, ProductInStore, Store, User } from "../types";

// Helper function to get price range for a product
export function getProductPriceRange(productId: string): {
  minPrice: number;
  maxPrice: number;
} {
  const storesForProduct = mockProductsInStores[productId] || [];
  if (storesForProduct.length === 0) {
    return { minPrice: 0, maxPrice: 0 };
  }
  const prices = storesForProduct.map((s) => s.price);
  return {
    minPrice: Math.min(...prices),
    maxPrice: Math.max(...prices),
  };
}

// Helper to check if product is in stock anywhere
export function isProductInStock(productId: string): boolean {
  const storesForProduct = mockProductsInStores[productId] || [];
  return storesForProduct.some(
    (s) => s.availability === "in_stock" || s.availability === "low_stock"
  );
}

// Mock User
export const mockUser: User = {
  id: "user-1",
  email: "user@example.com",
  firstName: "Олександр",
  lastName: "Петренко",
  phone: "+380501234567",
  avatarUrl: "https://i.pravatar.cc/150?img=12",
  location: {
    latitude: 50.4501,
    longitude: 30.5234,
  },
};

// Mock Stores
export const mockStores: Store[] = [
  {
    id: "store-1",
    name: "ZooMax",
    address: "вул. Хрещатик, 22, Київ",
    phone: "+380443334455",
    latitude: 50.4501,
    longitude: 30.5234,
    workingHours: "Пн-Нд: 09:00-21:00",
    rating: 4.8,
    distance: 0.5,
  },
  {
    id: "store-2",
    name: "Pet Shop",
    address: "пр. Перемоги, 54, Київ",
    phone: "+380445556677",
    latitude: 50.4521,
    longitude: 30.5294,
    workingHours: "Пн-Пт: 10:00-20:00, Сб-Нд: 10:00-18:00",
    rating: 4.5,
    distance: 1.2,
  },
  {
    id: "store-3",
    name: "Kormoland",
    address: "вул. Саксаганського, 121, Київ",
    phone: "+380447778899",
    latitude: 50.4441,
    longitude: 30.5174,
    workingHours: "Пн-Нд: 08:00-22:00",
    rating: 4.9,
    distance: 2.0,
  },
  {
    id: "store-4",
    name: "Тварини & Я",
    address: "вул. Велика Васильківська, 72, Київ",
    phone: "+380442223344",
    latitude: 50.4381,
    longitude: 30.5214,
    workingHours: "Пн-Сб: 09:00-20:00",
    rating: 4.3,
    distance: 3.5,
  },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: "product-1",
    name: "Royal Canin Maxi Adult",
    description:
      "Повнораціонний сухий корм для дорослих собак великих порід (вага дорослої собаки від 26 до 44 кг) віком від 15 місяців до 5 років.",
    category: "Корм для собак",
    imageUrl: "https://picsum.photos/seed/dog-food-1/400/300",
    brand: "Royal Canin",
    unit: "15 кг",
    tags: ["Преміум", "Сухий корм", "Великі породи"],
  },
  {
    id: "product-2",
    name: "Whiskas з куркою",
    description:
      "Повнораціонний корм для дорослих котів з куркою. Містить всі необхідні вітаміни та мінерали.",
    category: "Корм для котів",
    imageUrl: "https://picsum.photos/seed/cat-food-1/400/300",
    brand: "Whiskas",
    unit: "1.9 кг",
    tags: ["Сухий корм", "З куркою", "Популярне"],
  },
  {
    id: "product-3",
    name: "Іграшка м'яч для собак",
    description:
      "М'яч для тренувань та ігор з вашим вихованцем. Виготовлений з якісної гуми, безпечний для здоров'я.",
    category: "Іграшки",
    imageUrl: "https://picsum.photos/seed/toy-1/400/300",
    brand: "Trixie",
    unit: "1 шт",
    tags: ["Іграшки", "Для собак", "Гума"],
  },
  {
    id: "product-4",
    name: "Proplan для котів лосось",
    description:
      "Повнораціонний корм преміум класу для дорослих котів з лососем. Підтримує здоров'я шкіри та шерсті.",
    category: "Корм для котів",
    imageUrl: "https://picsum.photos/seed/cat-food-2/400/300",
    brand: "Pro Plan",
    unit: "3 кг",
    tags: ["Преміум", "З лососем", "Сухий корм"],
  },
  {
    id: "product-5",
    name: "Pedigree для собак яловичина",
    description:
      "Повнораціонний сухий корм для дорослих собак з яловичиною та овочами.",
    category: "Корм для собак",
    imageUrl: "https://picsum.photos/seed/dog-food-2/400/300",
    brand: "Pedigree",
    unit: "2.4 кг",
    tags: ["З яловичиною", "Сухий корм", "Бюджетний"],
  },
  {
    id: "product-6",
    name: "Дряпка для котів",
    description:
      "Високоякісна дряпка для котів з сизалевою мотузкою. Допоможе зберегти ваші меблі.",
    category: "Аксесуари",
    imageUrl: "https://picsum.photos/seed/scratcher-1/400/300",
    brand: "PetCraft",
    unit: "1 шт",
    tags: ["Аксесуари", "Для котів", "Дряпка"],
  },
  {
    id: "product-7",
    name: "Sheba Perfect Portions",
    description:
      "Вологий корм для котів в порційних паучах. Ніжна паштетна консистенція.",
    category: "Корм для котів",
    imageUrl: "https://picsum.photos/seed/cat-food-3/400/300",
    brand: "Sheba",
    unit: "24 x 85г",
    tags: ["Вологий корм", "Паучі", "Преміум"],
  },
  {
    id: "product-8",
    name: "Collar Soft нашийник",
    description:
      "М'який нашийник для собак середніх порід з м'якою підкладкою.",
    category: "Аксесуари",
    imageUrl: "https://picsum.photos/seed/collar-1/400/300",
    brand: "Collar",
    unit: "1 шт",
    tags: ["Аксесуари", "Нашийники", "Для собак"],
  },
];

// Mock Products in Stores
export const mockProductsInStores: Record<string, ProductInStore[]> = {
  "product-1": [
    {
      productId: "product-1",
      storeId: "store-1",
      price: 1299.99,
      availability: "in_stock",
      quantity: 15,
      store: mockStores[0],
    },
    {
      productId: "product-1",
      storeId: "store-2",
      price: 1349.99,
      availability: "low_stock",
      quantity: 3,
      store: mockStores[1],
    },
    {
      productId: "product-1",
      storeId: "store-3",
      price: 1249.99,
      availability: "in_stock",
      quantity: 20,
      store: mockStores[2],
    },
  ],
  "product-2": [
    {
      productId: "product-2",
      storeId: "store-1",
      price: 189.99,
      availability: "in_stock",
      quantity: 50,
      store: mockStores[0],
    },
    {
      productId: "product-2",
      storeId: "store-2",
      price: 199.99,
      availability: "in_stock",
      quantity: 30,
      store: mockStores[1],
    },
    {
      productId: "product-2",
      storeId: "store-4",
      price: 179.99,
      availability: "in_stock",
      quantity: 25,
      store: mockStores[3],
    },
  ],
  "product-3": [
    {
      productId: "product-3",
      storeId: "store-1",
      price: 89.99,
      availability: "in_stock",
      quantity: 40,
      store: mockStores[0],
    },
    {
      productId: "product-3",
      storeId: "store-3",
      price: 85.99,
      availability: "low_stock",
      quantity: 5,
      store: mockStores[2],
    },
  ],
  "product-4": [
    {
      productId: "product-4",
      storeId: "store-1",
      price: 599.99,
      availability: "in_stock",
      quantity: 12,
      store: mockStores[0],
    },
    {
      productId: "product-4",
      storeId: "store-2",
      price: 619.99,
      availability: "in_stock",
      quantity: 8,
      store: mockStores[1],
    },
    {
      productId: "product-4",
      storeId: "store-3",
      price: 589.99,
      availability: "in_stock",
      quantity: 15,
      store: mockStores[2],
    },
  ],
  "product-5": [
    {
      productId: "product-5",
      storeId: "store-2",
      price: 149.99,
      availability: "in_stock",
      quantity: 30,
      store: mockStores[1],
    },
    {
      productId: "product-5",
      storeId: "store-4",
      price: 145.99,
      availability: "in_stock",
      quantity: 20,
      store: mockStores[3],
    },
  ],
  "product-6": [
    {
      productId: "product-6",
      storeId: "store-1",
      price: 349.99,
      availability: "in_stock",
      quantity: 10,
      store: mockStores[0],
    },
    {
      productId: "product-6",
      storeId: "store-3",
      price: 339.99,
      availability: "low_stock",
      quantity: 2,
      store: mockStores[2],
    },
  ],
  "product-7": [
    {
      productId: "product-7",
      storeId: "store-1",
      price: 449.99,
      availability: "in_stock",
      quantity: 25,
      store: mockStores[0],
    },
    {
      productId: "product-7",
      storeId: "store-2",
      price: 459.99,
      availability: "in_stock",
      quantity: 18,
      store: mockStores[1],
    },
  ],
  "product-8": [
    {
      productId: "product-8",
      storeId: "store-1",
      price: 129.99,
      availability: "in_stock",
      quantity: 35,
      store: mockStores[0],
    },
    {
      productId: "product-8",
      storeId: "store-4",
      price: 119.99,
      availability: "in_stock",
      quantity: 20,
      store: mockStores[3],
    },
  ],
};

// Mock Orders
export const mockOrders: Order[] = [
  {
    id: "order-1",
    userId: "user-1",
    status: "ready",
    items: [
      {
        id: "item-1",
        productId: "product-2",
        product: mockProducts[1],
        quantity: 2,
        price: 189.99,
      },
    ],
    totalAmount: 379.98,
    store: mockStores[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    pickupTime: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "order-2",
    userId: "user-1",
    status: "reserved",
    items: [
      {
        id: "item-2",
        productId: "product-1",
        product: mockProducts[0],
        quantity: 1,
        price: 1299.99,
      },
      {
        id: "item-3",
        productId: "product-3",
        product: mockProducts[2],
        quantity: 1,
        price: 89.99,
      },
    ],
    totalAmount: 1389.98,
    store: mockStores[0],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "order-3",
    userId: "user-1",
    status: "completed",
    items: [
      {
        id: "item-4",
        productId: "product-4",
        product: mockProducts[3],
        quantity: 1,
        price: 599.99,
      },
    ],
    totalAmount: 599.99,
    store: mockStores[1],
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "order-4",
    userId: "user-1",
    status: "completed",
    items: [
      {
        id: "item-5",
        productId: "product-6",
        product: mockProducts[5],
        quantity: 1,
        price: 349.99,
      },
    ],
    totalAmount: 349.99,
    store: mockStores[0],
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
