export type QuantityUnit = "pcs" | "kg" | "g" | "L" | "ml" | "pack" | "dozen";

export const QUANTITY_UNITS: { value: QuantityUnit; label: string; type: "weight" | "volume" | "count" }[] = [
  { value: "pcs", label: "Pieces", type: "count" },
  { value: "pack", label: "Pack", type: "count" },
  { value: "dozen", label: "Dozen", type: "count" },
  { value: "kg", label: "Kg", type: "weight" },
  { value: "g", label: "Grams", type: "weight" },
  { value: "L", label: "Litres", type: "volume" },
  { value: "ml", label: "ml", type: "volume" },
];

export interface HouseholdItem {
  name: string;
  category: string;
  unit: QuantityUnit;
  defaultPrice?: number;
  tags: string[];
}

export const HOUSEHOLD_ITEMS: HouseholdItem[] = [
  // Groceries — Staples
  { name: "Basmati Rice", category: "Groceries", unit: "kg", defaultPrice: 90, tags: ["chawal", "biryani", "pulao", "grain", "staple"] },
  { name: "Wheat Atta", category: "Groceries", unit: "kg", defaultPrice: 38, tags: ["flour", "roti", "chapati", "grain", "staple"] },
  { name: "Toor Dal", category: "Groceries", unit: "kg", defaultPrice: 160, tags: ["arhar", "lentil", "pulse", "dal", "staple"] },
  { name: "Moong Dal", category: "Groceries", unit: "kg", defaultPrice: 140, tags: ["lentil", "pulse", "dal", "staple"] },
  { name: "Chana Dal", category: "Groceries", unit: "kg", defaultPrice: 120, tags: ["lentil", "pulse", "dal", "chickpea", "staple"] },
  { name: "Masoor Dal", category: "Groceries", unit: "kg", defaultPrice: 110, tags: ["lentil", "pulse", "dal", "staple"] },
  { name: "Rajma", category: "Groceries", unit: "kg", defaultPrice: 150, tags: ["kidney beans", "pulse", "staple"] },
  { name: "Sugar", category: "Groceries", unit: "kg", defaultPrice: 44, tags: ["cheeni", "sweetener", "staple"] },
  { name: "Salt", category: "Groceries", unit: "kg", defaultPrice: 25, tags: ["namak", "staple"] },
  { name: "Milk", category: "Groceries", unit: "L", defaultPrice: 62, tags: ["doodh", "dairy", "daily"] },
  { name: "Curd", category: "Groceries", unit: "kg", defaultPrice: 70, tags: ["dahi", "yogurt", "dairy"] },
  { name: "Paneer", category: "Groceries", unit: "g", defaultPrice: 90, tags: ["cottage cheese", "dairy", "protein"] },
  { name: "Butter", category: "Groceries", unit: "g", defaultPrice: 260, tags: ["makhan", "dairy", "amul"] },
  { name: "Ghee", category: "Groceries", unit: "L", defaultPrice: 550, tags: ["clarified butter", "dairy", "cooking"] },
  { name: "Eggs", category: "Groceries", unit: "dozen", defaultPrice: 80, tags: ["anda", "protein", "daily"] },
  { name: "Bread Loaf", category: "Groceries", unit: "pcs", defaultPrice: 45, tags: ["toast", "sandwich", "bakery"] },

  // Groceries — Oils & Spices
  { name: "Mustard Oil", category: "Groceries", unit: "L", defaultPrice: 180, tags: ["sarson", "cooking oil"] },
  { name: "Sunflower Oil", category: "Groceries", unit: "L", defaultPrice: 150, tags: ["cooking oil", "refined"] },
  { name: "Olive Oil", category: "Groceries", unit: "ml", defaultPrice: 380, tags: ["cooking oil", "salad"] },
  { name: "Coconut Oil", category: "Groceries", unit: "L", defaultPrice: 200, tags: ["nariyal", "cooking oil", "hair oil"] },
  { name: "Turmeric Powder", category: "Groceries", unit: "g", defaultPrice: 55, tags: ["haldi", "spice", "masala"] },
  { name: "Red Chilli Powder", category: "Groceries", unit: "g", defaultPrice: 65, tags: ["lal mirch", "spice", "masala"] },
  { name: "Cumin Seeds", category: "Groceries", unit: "g", defaultPrice: 45, tags: ["jeera", "spice", "masala"] },
  { name: "Garam Masala", category: "Groceries", unit: "g", defaultPrice: 70, tags: ["spice", "masala", "mix"] },
  { name: "Coriander Powder", category: "Groceries", unit: "g", defaultPrice: 50, tags: ["dhaniya", "spice", "masala"] },
  { name: "Tea Leaves", category: "Groceries", unit: "g", defaultPrice: 250, tags: ["chai", "patti", "beverage"] },
  { name: "Coffee Beans", category: "Groceries", unit: "g", defaultPrice: 650, tags: ["coffee", "beverage", "filter"] },

  // Groceries — Fresh
  { name: "Vegetables Weekly", category: "Groceries", unit: "kg", defaultPrice: 400, tags: ["sabzi", "fresh", "weekly"] },
  { name: "Fruits Weekly", category: "Groceries", unit: "kg", defaultPrice: 350, tags: ["phal", "fresh", "weekly"] },
  { name: "Onions", category: "Groceries", unit: "kg", defaultPrice: 30, tags: ["pyaaz", "vegetable", "fresh"] },
  { name: "Potatoes", category: "Groceries", unit: "kg", defaultPrice: 25, tags: ["aloo", "vegetable", "fresh"] },
  { name: "Tomatoes", category: "Groceries", unit: "kg", defaultPrice: 40, tags: ["tamatar", "vegetable", "fresh"] },
  { name: "Green Chillies", category: "Groceries", unit: "g", defaultPrice: 80, tags: ["hari mirch", "vegetable", "fresh"] },
  { name: "Ginger Garlic Paste", category: "Groceries", unit: "g", defaultPrice: 60, tags: ["adrak lehsun", "cooking", "masala"] },
  { name: "Fresh Coriander", category: "Groceries", unit: "pcs", defaultPrice: 10, tags: ["dhaniya", "herb", "garnish"] },
  { name: "Lemons", category: "Groceries", unit: "pcs", defaultPrice: 5, tags: ["nimbu", "citrus", "fresh"] },
  { name: "Bananas", category: "Groceries", unit: "dozen", defaultPrice: 50, tags: ["kela", "fruit", "fresh"] },

  // Groceries — Snacks & Packaged
  { name: "Biscuits", category: "Groceries", unit: "pack", defaultPrice: 30, tags: ["cookies", "snack", "tea time"] },
  { name: "Namkeen / Mixture", category: "Groceries", unit: "g", defaultPrice: 50, tags: ["snack", "bhujia", "haldiram"] },
  { name: "Maggi Noodles", category: "Groceries", unit: "pack", defaultPrice: 56, tags: ["instant", "snack", "noodles"] },
  { name: "Cornflakes / Oats", category: "Groceries", unit: "g", defaultPrice: 180, tags: ["breakfast", "cereal", "healthy"] },
  { name: "Dry Fruits Mixed", category: "Groceries", unit: "g", defaultPrice: 450, tags: ["mewa", "cashew", "almond", "healthy"] },
  { name: "Poha / Flattened Rice", category: "Groceries", unit: "g", defaultPrice: 40, tags: ["chivda", "breakfast", "snack"] },

  // Kitchen
  { name: "Dish Soap", category: "Kitchen", unit: "ml", defaultPrice: 75, tags: ["bartan", "cleaning", "liquid"] },
  { name: "Dishwasher Tablets", category: "Kitchen", unit: "pack", defaultPrice: 350, tags: ["cleaning", "machine"] },
  { name: "Steel Scrubber", category: "Kitchen", unit: "pack", defaultPrice: 30, tags: ["juna", "cleaning", "utensils"] },
  { name: "Kitchen Sponge", category: "Kitchen", unit: "pack", defaultPrice: 40, tags: ["cleaning", "utensils"] },
  { name: "Kitchen Towels", category: "Kitchen", unit: "pack", defaultPrice: 60, tags: ["paper", "cleaning", "tissue"] },
  { name: "Aluminium Foil Roll", category: "Kitchen", unit: "pcs", defaultPrice: 120, tags: ["wrap", "cooking", "baking"] },
  { name: "Cling Wrap Roll", category: "Kitchen", unit: "pcs", defaultPrice: 100, tags: ["plastic wrap", "food storage"] },
  { name: "Garbage Bags", category: "Kitchen", unit: "pack", defaultPrice: 80, tags: ["dustbin", "waste", "trash"] },
  { name: "Water Purifier Filter", category: "Kitchen", unit: "pcs", defaultPrice: 1200, tags: ["RO", "kent", "aquaguard"] },
  { name: "Gas Lighter", category: "Kitchen", unit: "pcs", defaultPrice: 50, tags: ["matchbox", "igniter", "stove"] },
  { name: "Storage Containers Set", category: "Kitchen", unit: "pcs", defaultPrice: 400, tags: ["dabba", "tupperware", "organise"] },

  // Household
  { name: "Floor Cleaner", category: "Household", unit: "L", defaultPrice: 189, tags: ["lizol", "mopping", "cleaning"] },
  { name: "Toilet Cleaner", category: "Household", unit: "ml", defaultPrice: 110, tags: ["harpic", "bathroom", "cleaning"] },
  { name: "Glass Cleaner", category: "Household", unit: "ml", defaultPrice: 140, tags: ["colin", "window", "cleaning"] },
  { name: "Laundry Detergent", category: "Household", unit: "kg", defaultPrice: 425, tags: ["surf", "tide", "washing", "cleaning"] },
  { name: "Fabric Softener", category: "Household", unit: "ml", defaultPrice: 200, tags: ["comfort", "laundry", "clothes"] },
  { name: "Phenyl / Disinfectant", category: "Household", unit: "L", defaultPrice: 85, tags: ["cleaning", "sanitiser", "mopping"] },
  { name: "Broom / Jhaadu", category: "Household", unit: "pcs", defaultPrice: 120, tags: ["sweeping", "cleaning"] },
  { name: "Mop & Bucket", category: "Household", unit: "pcs", defaultPrice: 350, tags: ["pocha", "cleaning", "floor"] },
  { name: "Room Freshener", category: "Household", unit: "pcs", defaultPrice: 180, tags: ["spray", "fragrance", "odonil"] },
  { name: "Mosquito Repellent", category: "Household", unit: "pcs", defaultPrice: 90, tags: ["good knight", "allout", "coil"] },
  { name: "LED Bulbs", category: "Household", unit: "pack", defaultPrice: 599, tags: ["light", "electric", "bulb"] },
  { name: "Batteries", category: "Household", unit: "pack", defaultPrice: 120, tags: ["duracell", "cell", "remote"] },
  { name: "Bed Sheets Set", category: "Household", unit: "pcs", defaultPrice: 1500, tags: ["bedding", "linen", "bedroom"] },
  { name: "Pillow Covers", category: "Household", unit: "pack", defaultPrice: 400, tags: ["bedding", "linen"] },
  { name: "Doormat", category: "Household", unit: "pcs", defaultPrice: 250, tags: ["entrance", "floor"] },

  // Personal Care
  { name: "Shampoo", category: "Personal Care", unit: "ml", defaultPrice: 310, tags: ["hair", "wash", "bath"] },
  { name: "Conditioner", category: "Personal Care", unit: "ml", defaultPrice: 280, tags: ["hair", "wash", "bath"] },
  { name: "Hair Oil", category: "Personal Care", unit: "ml", defaultPrice: 150, tags: ["coconut", "hair", "oil"] },
  { name: "Soap", category: "Personal Care", unit: "pack", defaultPrice: 160, tags: ["bath", "body wash", "cleaning"] },
  { name: "Face Wash", category: "Personal Care", unit: "ml", defaultPrice: 220, tags: ["skin", "face", "cleanser"] },
  { name: "Toothpaste", category: "Personal Care", unit: "pcs", defaultPrice: 95, tags: ["colgate", "oral", "dental"] },
  { name: "Toothbrush", category: "Personal Care", unit: "pack", defaultPrice: 120, tags: ["oral", "dental", "brush"] },
  { name: "Deodorant", category: "Personal Care", unit: "pcs", defaultPrice: 200, tags: ["perfume", "body spray", "fragrance"] },
  { name: "Moisturiser / Body Lotion", category: "Personal Care", unit: "ml", defaultPrice: 280, tags: ["skin", "cream", "winter"] },
  { name: "Razor / Shaving Kit", category: "Personal Care", unit: "pack", defaultPrice: 200, tags: ["gillette", "shave", "grooming"] },
  { name: "Sunscreen", category: "Personal Care", unit: "ml", defaultPrice: 350, tags: ["SPF", "skin", "sun protection"] },
  { name: "Sanitary Pads", category: "Personal Care", unit: "pack", defaultPrice: 160, tags: ["hygiene", "whisper", "stayfree"] },
  { name: "Cotton Buds", category: "Personal Care", unit: "pack", defaultPrice: 50, tags: ["ear buds", "hygiene"] },
  { name: "Hand Sanitiser", category: "Personal Care", unit: "ml", defaultPrice: 80, tags: ["hygiene", "dettol", "cleaning"] },
  { name: "Tissue Paper Rolls", category: "Personal Care", unit: "pack", defaultPrice: 200, tags: ["toilet paper", "bathroom", "hygiene"] },

  // Electronics
  { name: "Phone Charger", category: "Electronics", unit: "pcs", defaultPrice: 499, tags: ["mobile", "USB", "cable", "charging"] },
  { name: "USB Cable", category: "Electronics", unit: "pcs", defaultPrice: 250, tags: ["type-c", "data", "charging"] },
  { name: "HDMI Cable", category: "Electronics", unit: "pcs", defaultPrice: 349, tags: ["TV", "monitor", "display"] },
  { name: "Wireless Mouse", category: "Electronics", unit: "pcs", defaultPrice: 899, tags: ["computer", "laptop", "bluetooth"] },
  { name: "Extension Board", category: "Electronics", unit: "pcs", defaultPrice: 450, tags: ["power strip", "plug", "socket"] },
  { name: "WiFi Router", category: "Electronics", unit: "pcs", defaultPrice: 1899, tags: ["internet", "modem", "network"] },
  { name: "Power Bank", category: "Electronics", unit: "pcs", defaultPrice: 1200, tags: ["portable charger", "battery", "mobile"] },
  { name: "Earphones / Headphones", category: "Electronics", unit: "pcs", defaultPrice: 800, tags: ["music", "audio", "bluetooth"] },

  // Food & Dining
  { name: "Biryani Dinner", category: "Food & Dining", unit: "pcs", defaultPrice: 850, tags: ["restaurant", "non-veg", "takeaway"] },
  { name: "Pizza Night", category: "Food & Dining", unit: "pcs", defaultPrice: 1200, tags: ["dominos", "delivery", "fast food"] },
  { name: "Swiggy / Zomato Order", category: "Food & Dining", unit: "pcs", defaultPrice: 600, tags: ["delivery", "online", "takeaway"] },
  { name: "Restaurant Dinner", category: "Food & Dining", unit: "pcs", defaultPrice: 2000, tags: ["dining out", "family", "eating out"] },
  { name: "Chai / Coffee (Café)", category: "Food & Dining", unit: "pcs", defaultPrice: 300, tags: ["starbucks", "CCD", "café"] },

  // Utilities
  { name: "Electricity Bill", category: "Utilities", unit: "pcs", defaultPrice: 2800, tags: ["bijli", "power", "monthly bill"] },
  { name: "Water Bill", category: "Utilities", unit: "pcs", defaultPrice: 500, tags: ["paani", "monthly bill"] },
  { name: "Gas Cylinder Refill", category: "Utilities", unit: "pcs", defaultPrice: 900, tags: ["LPG", "cooking gas", "indane", "HP"] },
  { name: "WiFi / Internet Bill", category: "Utilities", unit: "pcs", defaultPrice: 800, tags: ["broadband", "jio", "airtel", "monthly bill"] },
  { name: "Mobile Recharge", category: "Utilities", unit: "pcs", defaultPrice: 299, tags: ["prepaid", "jio", "airtel", "vi"] },
  { name: "DTH / Cable TV Recharge", category: "Utilities", unit: "pcs", defaultPrice: 350, tags: ["tata sky", "dish TV", "monthly bill"] },
  { name: "House Rent", category: "Utilities", unit: "pcs", defaultPrice: 15000, tags: ["kiraya", "monthly bill", "landlord"] },
  { name: "Society Maintenance", category: "Utilities", unit: "pcs", defaultPrice: 3000, tags: ["apartment", "monthly bill", "flat"] },

  // Entertainment
  { name: "Netflix Subscription", category: "Entertainment", unit: "pcs", defaultPrice: 649, tags: ["streaming", "OTT", "monthly"] },
  { name: "Hotstar Subscription", category: "Entertainment", unit: "pcs", defaultPrice: 299, tags: ["disney", "streaming", "OTT"] },
  { name: "Movie Tickets", category: "Entertainment", unit: "pcs", defaultPrice: 250, tags: ["cinema", "film", "PVR", "INOX"] },
  { name: "Amazon Prime", category: "Entertainment", unit: "pcs", defaultPrice: 179, tags: ["streaming", "OTT", "delivery"] },
  { name: "Spotify / Music Subscription", category: "Entertainment", unit: "pcs", defaultPrice: 119, tags: ["streaming", "music", "monthly"] },

  // Clothing
  { name: "T-shirt", category: "Clothing", unit: "pcs", defaultPrice: 500, tags: ["casual", "top", "wear"] },
  { name: "Jeans / Trousers", category: "Clothing", unit: "pcs", defaultPrice: 1200, tags: ["pants", "bottom", "denim"] },
  { name: "Kurta / Ethnic Wear", category: "Clothing", unit: "pcs", defaultPrice: 800, tags: ["traditional", "festival", "Indian"] },
  { name: "Footwear / Chappal", category: "Clothing", unit: "pcs", defaultPrice: 600, tags: ["shoes", "sandals", "slippers"] },
  { name: "Undergarments", category: "Clothing", unit: "pack", defaultPrice: 400, tags: ["inner wear", "essentials"] },
  { name: "Socks", category: "Clothing", unit: "pack", defaultPrice: 200, tags: ["footwear", "winter", "pair"] },
];

export function searchHouseholdItems(query: string): HouseholdItem[] {
  if (!query || query.length < 1) return [];
  const lower = query.toLowerCase();
  const words = lower.split(/\s+/).filter(Boolean);

  const scored = HOUSEHOLD_ITEMS.map((item) => {
    const nameLower = item.name.toLowerCase();
    const catLower = item.category.toLowerCase();
    let score = 0;

    if (nameLower.includes(lower)) score += 10;
    if (nameLower.startsWith(lower)) score += 5;

    for (const word of words) {
      if (nameLower.includes(word)) score += 3;
      if (catLower.includes(word)) score += 1;
      for (const tag of item.tags) {
        if (tag.toLowerCase().includes(word)) {
          score += 2;
          break;
        }
      }
    }

    return { item, score };
  })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score);

  return scored.map((s) => s.item);
}
