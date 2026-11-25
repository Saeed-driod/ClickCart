export interface CategorySeed {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
}

export interface BrandSeed {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo: string;
}

export interface ProductSeed {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  salePrice?: number | null;
  sku: string;
  stock: number;
  images: string[];
  featured?: boolean;
  isFlashDeal?: boolean;
  flashDealEnd?: string | null;
  rating: number;
  reviewCount: number;
  region: "USA" | "UK";
  categoryId: string;
  brandId?: string;
}

export const SEED_CATEGORIES: CategorySeed[] = [
  {
    id: "cat-electronics",
    name: "Electronics",
    slug: "electronics",
    description: "Cutting-edge gadgets, smartphones, laptops, audio gear and smart home devices.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
  },
  {
    id: "cat-fashion",
    name: "Fashion",
    slug: "fashion",
    description: "Trendy men's and women's apparel, footwear, designer accessories and jewelry.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
  },
  {
    id: "cat-home-kitchen",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Modern kitchen appliances, stylish home decor, cookware and luxury bedding.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
  },
  {
    id: "cat-beauty",
    name: "Beauty & Personal Care",
    slug: "beauty",
    description: "Luxury skincare, organic haircare, designer fragrances and makeup essentials.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
  },
  {
    id: "cat-sports",
    name: "Sports & Fitness",
    slug: "sports",
    description: "Premium workout equipment, athletic sportswear, outdoor gear and gym accessories.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
  },
  {
    id: "cat-toys",
    name: "Toys & Games",
    slug: "toys",
    description: "Fun learning toys, board games, remote-control drones, LEGO sets and plushies.",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80",
  },
  {
    id: "cat-books",
    name: "Books & Stationery",
    slug: "books",
    description: "Bestselling novels, business guides, tech books, journals and fine art stationery.",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80",
  },
  {
    id: "cat-groceries",
    name: "Groceries & Gourmet",
    slug: "groceries",
    description: "Farm fresh organic produce, gourmet coffees, pantry staples and natural dry fruits.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
  },
];

export const SEED_BRANDS: BrandSeed[] = [
  { id: "brand-apple", name: "Apple", slug: "apple", description: "Think different. Premium consumer electronics.", logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&q=80" },
  { id: "brand-samsung", name: "Samsung", slug: "samsung", description: "Do what you can't. World leader in displays and mobile tech.", logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&q=80" },
  { id: "brand-sony", name: "Sony", slug: "sony", description: "Be moved. Industry-leading audio, cameras and gaming.", logo: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&q=80" },
  { id: "brand-nike", name: "Nike", slug: "nike", description: "Just do it. Iconic athletic footwear and streetwear.", logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80" },
  { id: "brand-adidas", name: "Adidas", slug: "adidas", description: "Impossible is nothing. Performance and lifestyle sportswear.", logo: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=200&q=80" },
  { id: "brand-zara", name: "Zara", slug: "zara", description: "Fast-fashion high-street chic styling.", logo: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&q=80" },
  { id: "brand-philips", name: "Philips", slug: "philips", description: "Sense and simplicity. Home appliances and personal care.", logo: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&q=80" },
  { id: "brand-loreal", name: "L'Oreal", slug: "loreal", description: "Because you're worth it. Global beauty authority.", logo: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&q=80" },
  { id: "brand-nestle", name: "Nestlé", slug: "nestle", description: "Good food, good life. Nutrition and gourmet pantry foods.", logo: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&q=80" },
  { id: "brand-lego", name: "LEGO", slug: "lego", description: "Only the best is good enough. Creative building systems.", logo: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=200&q=80" },
];

// Helper to generate realistic high quality product listings
function generateProducts(): ProductSeed[] {
  const items: ProductSeed[] = [];

  const rawData: Record<string, { brand: string; names: string[]; priceRange: [number, number]; images: string[] }> = {
    "cat-electronics": {
      brand: "brand-apple",
      names: [
        "Pro Wireless Noise-Cancelling Headphones", "Ultra Slim 4K UHD Smart Monitor 27-inch", "Foldable Dual-Screen Smartphone 512GB",
        "Compact Mechanical Gaming Keyboard RGB", "Precision Ergonomic Wireless Mouse", "Studio Quality Condenser Podcast Microphone",
        "Fast Magnetic Wireless Power Bank 10,000mAh", "True Wireless Earbuds with Spatial Audio", "Smart Fitness Tracker Band with Heart Rate Monitor",
        "Rugged Waterproof Portable Bluetooth Speaker", "Mirrorless Full-Frame 4K Vlogging Camera", "High-Speed Dual Band Wi-Fi 6 Mesh Router",
        "USB-C Multi-Port Hub 10-in-1 Adapter", "Ultra-Fast NVMe Portable SSD 1TB", "Smart Home Video Doorbell with 2K Night Vision",
        "Rechargeable Electric Screwdriver Kit", "Digital Drawing Tablet with Battery-Free Stylus", "Foldable Quadcopter Drone with 4K Camera",
        "Smart Ambient LED Light Bar Kit with Sync", "Universal GaN Fast Wall Charger 65W", "Smart Watch Series 9 GPS + Cellular",
        "Noise Isolation In-Ear Monitors for Musicians", "Ultra Lightweight Carbon Fiber Laptop Stand", "Surge Protector Power Strip with Fast USB Ports",
        "Bluetooth Item Tracker GPS Key Finder 4-Pack", "Automatic Robotic Vacuum Cleaner with Mop", "High-Fidelity Audio DAC Headphone Amplifier",
        "Streaming Capture Card 4K 60FPS HDR", "Adjustable Desktop Ring Light for Video Calls", "Thermal Portable Wireless Receipt & Label Printer"
      ],
      priceRange: [3500, 185000],
      images: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
        "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
      ]
    },
    "cat-fashion": {
      brand: "brand-zara",
      names: [
        "Classic Slim-Fit Oxford Cotton Shirt", "Vintage Wash Relaxed Denim Jacket", "Tailored Wool Blend Blazer - Navy",
        "Breathable Athletic Performance Joggers", "Handcrafted Italian Leather Chelsea Boots", "Everyday Soft Cotton Crewneck T-Shirt 3-Pack",
        "Water-Resistant Trench Coat with Belt", "Polarized Retro Aviator Sunglasses UV400", "Minimalist Genuine Leather Bifold Wallet",
        "Ribbed Knit Cashmere Blend Sweater", "High-Waisted Wide Leg Linen Trousers", "Elegant Floral Embroidered Chiffon Dress",
        "Genuine Suede Leather Belt with Brass Buckle", "Lightweight Quilted Puffer Vest", "Canvas Everyday Crossbody Messenger Bag",
        "Silk Touch Satin Evening Pajama Set", "Vintage Distressed Straight Leg Jeans", "Waterproof Stainless Steel Chronograph Watch",
        "Comfortable Knit Slip-On Walking Sneakers", "Handwoven Straw Summer Sun Hat", "Warm Sherpa Fleece Zip-Up Hoodie",
        "Formal Handcrafted Silk Necktie & Cufflinks", "Waterproof Laptop Travel Backpack 25L", "Pleated Midi Skirt in Pastel Blossom",
        "Pure Linen Short-Sleeve Cuban Collar Shirt", "Leather Driving Loafers with Rubber Soles", "Ultra Soft Thermal Base Layer Set",
        "Reversible Vegan Leather Tote Handbag", "Classic Houndstooth Trench Cape", "Performance Moisture-Wicking Running Socks 6-Pack"
      ],
      priceRange: [1800, 32000],
      images: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
      ]
    },
    "cat-home-kitchen": {
      brand: "brand-philips",
      names: [
        "Digital Air Fryer XL 6L with Touch Preset", "Programmable Espresso Machine with Milk Frother", "Hard Anodized Non-Stick Cookware 10-Piece Set",
        "Heavy Duty Countertop Blender 1200W", "Cast Iron Dutch Oven with Enamel Coating 5.5 Qt", "Professional Chef Damascus Steel Knife 8-Inch",
        "Electric Gooseneck Temperature Control Kettle", "Cordless Stick Vacuum Cleaner with HEPA Filter", "Automatic Bread Maker Machine with 15 Programs",
        "Stainless Steel Electric Food Steamer 3-Tier", "Ultra Quiet Ultrasonic Cool Mist Humidifier", "Minimalist Dimmable Nordic Desk Table Lamp",
        "Pure Egyptian Cotton 400-Thread Sheet Set", "Bamboo Cutting Board Set with Juice Grooves", "Vacuum Insulated Stainless Steel Food Flask",
        "Multi-Functional Electric Pressure Cooker 7-in-1", "Aroma Essential Oil Diffuser with LED Mood Light", "Silicone Cooking Utensils Set with Wooden Handles",
        "Double Wall Insulated Glass Coffee Mugs 4-Pack", "Adjustable Bamboo Bath Caddy Tray", "Smart Kitchen Food Scale with Digital Display",
        "Automatic Motion Sensor Trash Can 13 Gallon", "Ergonomic Memory Foam Sleeping Pillow", "Modern Ceramic Dinnerware Set 16-Piece",
        "Spice Rack Organizer with 20 Glass Jars", "Manual Pasta Roller Machine Stainless Steel", "Self-Watering Indoor Herb Garden Planter",
        "Heavyweight Linen Tablecloth with Fringe", "Electric Salt and Pepper Grinder Set Rechargeable", "Compact Countertop Ice Maker Machine"
      ],
      priceRange: [2400, 68000],
      images: [
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80",
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80",
      ]
    },
    "cat-beauty": {
      brand: "brand-loreal",
      names: [
        "Hyaluronic Acid Hydrating Face Serum 30ml", "Pure Vitamin C 20% Radiance Brightening Booster", "Advanced Retinol Night Repair Cream",
        "Gentle Foaming Cleanser with Ceramides", "Mineral Broad Spectrum Matte Sunscreen SPF 50", "Nourishing Argan & Keratin Hair Treatment Mask",
        "Velvet Matte Liquid Lipstick Long-Wearing", "Eyeshadow Palette 18 Warm Sunset Shades", "Waterproof Volumizing & Lengthening Mascara",
        "Rose Water Balancing Facial Toner Spray", "Organic Cold Pressed Jojoba Oil 100ml", "Exfoliating Glycolic Acid 7% Resurfacing Tonic",
        "Luxury Eau de Parfum Vanilla Amber 100ml", "Natural Tea Tree Oil Acne Spot Treatment", "Ultra Repair Lip Therapy Balm with Beeswax",
        "Collagen Peptides Firming Eye Cream", "Biotin & Caffeine Hair Thickening Shampoo", "Shimmering Glow Liquid Highlighter",
        "Professional 12-Piece Soft Makeup Brush Set", "Charcoal Deep Pore Detox Clay Face Mask", "Silk Pillowcase for Skin & Hair Care",
        "Electric Silicone Facial Cleansing Brush", "Nail Strengthening Serum and Cuticle Oil", "Soothing Aloe Vera Moisture Gel 99%",
        "Shea Butter Intensive Hand Care Balm", "French Lavender Aromatherapy Bath Salts 500g"
      ],
      priceRange: [950, 18500],
      images: [
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80",
        "https://images.unsplash.com/photo-1608248597359-0027f99990ea?w=800&q=80",
      ]
    },
    "cat-sports": {
      brand: "brand-nike",
      names: [
        "Pro Cushioned Running Shoes with Air Zoom", "Eco-Friendly Non-Slip Alignment Yoga Mat", "Adjustable Cast Iron Dumbbells Set 20kg",
        "Thermal Insulated Stainless Steel Gym Bottle 1L", "Heavy Duty Pull-Up Bar for Doorway", "High-Density Foam Roller for Muscle Recovery",
        "Anti-Burst Exercise Stability Ball with Pump", "Resistance Bands Set 5-Levels with Handles", "Breathable Compression Gym T-Shirt",
        "Shock-Absorbing Running Knee Support Brace", "Professional Speed Jump Rope with Ball Bearings", "Waterproof Sports Duffle Bag with Shoe Compartment",
        "Smart Badminton Racket Pair with Carbon Shaft", "Official Size 5 FIFA Quality Match Soccer Ball", "Padded Weightlifting Gloves with Wrist Support",
        "Hydration Pack Running Vest with 2L Bladder", "Table Tennis Racket Set with 3 Balls", "Adjustable Aerobic Step Platform",
        "Swimming Goggles with Anti-Fog & UV Shield", "Tactical Outdoor Camping Tent 4-Person", "Trekking Hiking Poles Aluminum Lightweight",
        "Electronic Digital Dartboard with Sound Effects", "Ab Roller Wheel with Extra Thick Knee Mat", "Grip Strength Trainer Hand Dynamometer",
        "Cycling Helmet with Built-In LED Rear Light", "Sports Armband for Large Smartphones"
      ],
      priceRange: [1200, 48000],
      images: [
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
      ]
    },
    "cat-toys": {
      brand: "brand-lego",
      names: [
        "Space Exploration Shuttle Building Brick Set", "Remote Control High-Speed Off-Road Stunt Buggy", "Classic Wooden Jenga Tumbling Tower",
        "Deluxe Monopolist Board Game City Edition", "STEM Magnetic Building Tiles 100-Piece Kit", "Ultra-Soft Giant Plush Teddy Bear 100cm",
        "Programmable Educational Robot for Kids", "Art & Craft Deluxe Drawing Studio Case", "Interactive Talking Globe with Augmented Reality",
        "Diecast Metal Model Supercar 1:18 Scale", "Kids Foldable Kick Scooter with LED Light Wheels", "Musical Keyboard Piano with Microphone 61 Keys",
        "Play Kitchen Cooking Set with Sound & Light", "Underwater Exploration Submarine Drone Toy", "Color Clay Dough Modeling Set 24 Tubs",
        "Magic Tricks Starter Kit for Young Magicians", "Detailed 3D Wooden Mechanical Puzzle Clock", "Mini Tabletop Foosball Soccer Table",
        "Doctor Medical Roleplay Cart Playset", "Outdoor Inflatable Water Sprinkler Splash Pad", "Solar Powered DIY Science Exploration Rover",
        "Glow in the Dark Constellation Ceiling Kit", "Dollhouse Miniature Wooden Villa with Furniture", "Speed Rubik's Cube 3x3 Smooth Turn Stickerless",
        "Walkie Talkies for Kids Long Range 3-Pack", "Action Superhero Collectible Figurine 12-Inch"
      ],
      priceRange: [1400, 36000],
      images: [
        "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80",
        "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80",
        "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80",
      ]
    },
    "cat-books": {
      brand: "brand-apple",
      names: [
        "Atomic Habits: Tiny Changes, Remarkable Results", "Deep Work: Rules for Focused Success in a Distracted World",
        "The Psychology of Money: Timeless Lessons on Wealth", "Clean Code: A Handbook of Agile Software Craftsmanship",
        "Designing Data-Intensive Applications by Martin Kleppmann", "Thinking, Fast and Slow by Daniel Kahneman",
        "Sapiens: A Brief History of Humankind", "The Pragmatic Programmer: 20th Anniversary Edition",
        "Zero to One: Notes on Startups by Peter Thiel", "Principles: Life and Work by Ray Dalio",
        "The Midnight Library: A Novel by Matt Haig", "Dune: The Classic Science Fiction Masterpiece",
        "Project Hail Mary: A Thrilling Space Adventure", "Man's Search for Meaning by Viktor E. Frankl",
        "Building a Second Brain by Tiago Forte", "The Art of War: Deluxe Hardcover Collector's Edition",
        "Rich Dad Poor Dad: What the Rich Teach Their Kids", "Good to Great: Why Some Companies Make the Leap",
        "System Design Interview: An Insider's Guide", "Refactoring: Improving the Design of Existing Code",
        "Essentialism: The Disciplined Pursuit of Less", "Can't Hurt Me: Master Your Mind by David Goggins",
        "The Lean Startup by Eric Ries", "Start with Why: How Great Leaders Inspire Action",
        "Fine Dotted Bullet Journal Hardcover A5", "Calligraphy Fountain Pen Luxury Gift Set with Ink"
      ],
      priceRange: [850, 9500],
      images: [
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80",
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
      ]
    },
    "cat-groceries": {
      brand: "brand-nestle",
      names: [
        "Extra Virgin Cold Pressed Olive Oil 1L", "Pure Himalayan Raw Honey Comb Jar 500g", "Super Kernel Aged Basmati Rice 5kg",
        "Artisanal Whole Coffee Beans Medium Roast 1kg", "Organic Matcha Green Tea Ceremonial Grade 100g", "Roasted California Almonds Supreme 1kg",
        "Raw Turkish Walnuts Vacuum Packed 500g", "Premium Medjool Jumbo Dates Royal Box 1kg", "Organic Chia Seeds Rich in Omega-3 500g",
        "100% Pure Maple Syrup Grade A Dark Amber 250ml", "Dark Belgian Chocolate Drops 72% Cacao 500g", "Naturally Brewed Japanese Soy Sauce 500ml",
        "Himalayan Pink Rock Salt Fine Crystals 1kg", "Cold Pressed Virgin Coconut Oil Organic 500ml", "Premium Whole Kashmiri Saffron Threads 5g",
        "Organic Gluten-Free Rolled Oats 1kg", "Spiced Chai Herbal Loose Tea Blend 250g", "Raw Pistachios Shelled Salted 500g",
        "Pure Spanish Smoked Paprika Powder 150g", "Wild Berry Granola with Honey & Nuts 750g", "Organic Apple Cider Vinegar with The Mother 500ml",
        "Premium Cashew Nuts Whole Jumbo W240 1kg", "Earl Grey Black Tea Bergamot Infusion 100 Bags", "Whole Dried Figs Turkish Delight 500g",
        "Balsamic Vinegar of Modena Aged 250ml", "Pure Natural Peanut Butter Smooth 1kg"
      ],
      priceRange: [650, 14500],
      images: [
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
        "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=800&q=80",
        "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=800&q=80",
      ]
    }
  };

  let count = 1;

  for (const [catId, catInfo] of Object.entries(rawData)) {
    catInfo.names.forEach((name, idx) => {
      const price = Math.round((catInfo.priceRange[0] + Math.random() * (catInfo.priceRange[1] - catInfo.priceRange[0])) / 50) * 50;
      const hasDiscount = idx % 3 === 0;
      const salePrice = hasDiscount ? Math.round(price * 0.8 / 50) * 50 : null;
      const isFeatured = idx < 4;
      const isFlash = idx === 0 || idx === 1;
      const sku = `CKC-${catId.replace("cat-", "").toUpperCase().slice(0, 3)}-${String(count).padStart(4, "0")}`;
      const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") + `-${count}`;

      // Pick 2-3 images
      const img1 = catInfo.images[idx % catInfo.images.length];
      const img2 = catInfo.images[(idx + 1) % catInfo.images.length];
      const img3 = catInfo.images[(idx + 2) % catInfo.images.length];

      items.push({
        id: `prod-${count}`,
        name,
        slug,
        description: `Premium quality ${name}. Engineered for unmatched performance, durability, and customer satisfaction. Features genuine components, manufacturer warranty, and certified inspection standards for peace of mind.`,
        price,
        salePrice,
        sku,
        stock: Math.floor(Math.random() * 45) + 5,
        images: [img1, img2, img3],
        featured: isFeatured,
        isFlashDeal: isFlash,
        flashDealEnd: isFlash ? new Date(Date.now() + 86400000 * 3).toISOString() : null,
        rating: Number((4.1 + Math.random() * 0.8).toFixed(1)),
        reviewCount: Math.floor(Math.random() * 120) + 12,
        region: idx % 2 === 0 ? "USA" : "UK",
        categoryId: catId,
        brandId: catInfo.brand,
      });

      count++;
    });
  }

  return items;
}

export const SEED_PRODUCTS = generateProducts();

export const SEED_COUPONS = [
  {
    id: "coupon-welcome10",
    code: "WELCOME10",
    discountType: "PERCENTAGE" as const,
    discountValue: 10,
    minOrderAmount: 2000,
    maxDiscount: 1500,
    expiryDate: new Date("2028-12-31"),
    usageLimit: 1000,
    usedCount: 42,
    isActive: true,
  },
  {
    id: "coupon-click20",
    code: "CLICK20",
    discountType: "PERCENTAGE" as const,
    discountValue: 20,
    minOrderAmount: 5000,
    maxDiscount: 3000,
    expiryDate: new Date("2028-12-31"),
    usageLimit: 500,
    usedCount: 88,
    isActive: true,
  },
  {
    id: "coupon-flat500",
    code: "FLAT500",
    discountType: "FIXED" as const,
    discountValue: 500,
    minOrderAmount: 3500,
    maxDiscount: 500,
    expiryDate: new Date("2028-12-31"),
    usageLimit: 300,
    usedCount: 19,
    isActive: true,
  },
];
