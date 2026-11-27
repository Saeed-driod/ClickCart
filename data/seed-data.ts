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
    description: "Smartphones, audio gear, monitors, laptops and smart home tech.",
    image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
  },
  {
    id: "cat-fashion",
    name: "Fashion",
    slug: "fashion",
    description: "Apparel, footwear, jackets, bags and accessories.",
    image: "https://images.unsplash.com/photo-1445205170230-053b83016050?w=800&q=80",
  },
  {
    id: "cat-home-kitchen",
    name: "Home & Kitchen",
    slug: "home-kitchen",
    description: "Kitchen appliances, cookware, lighting and bedding.",
    image: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
  },
  {
    id: "cat-beauty",
    name: "Beauty & Care",
    slug: "beauty",
    description: "Skincare serums, fragrances, haircare and makeup essentials.",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
  },
  {
    id: "cat-sports",
    name: "Sports & Fitness",
    slug: "sports",
    description: "Workout equipment, athletic footwear and outdoor gear.",
    image: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
  },
  {
    id: "cat-toys",
    name: "Toys & Games",
    slug: "toys",
    description: "Building sets, board games, drones and educational toys.",
    image: "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80",
  },
  {
    id: "cat-books",
    name: "Books & Stationery",
    slug: "books",
    description: "Bestselling novels, business guides, tech books and journals.",
    image: "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80",
  },
  {
    id: "cat-groceries",
    name: "Groceries & Gourmet",
    slug: "groceries",
    description: "Artisanal coffees, teas, pantry staples and organic snacks.",
    image: "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
  },
];

export const SEED_BRANDS: BrandSeed[] = [
  { id: "brand-apple", name: "Apple", slug: "apple", description: "Premium consumer electronics.", logo: "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&q=80" },
  { id: "brand-samsung", name: "Samsung", slug: "samsung", description: "Displays and mobile technology.", logo: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200&q=80" },
  { id: "brand-sony", name: "Sony", slug: "sony", description: "Industry-leading audio and cameras.", logo: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=200&q=80" },
  { id: "brand-nike", name: "Nike", slug: "nike", description: "Athletic footwear and sportswear.", logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200&q=80" },
  { id: "brand-adidas", name: "Adidas", slug: "adidas", description: "Performance and lifestyle sportswear.", logo: "https://images.unsplash.com/photo-1518002171953-a080ee817e1f?w=200&q=80" },
  { id: "brand-zara", name: "Zara", slug: "zara", description: "Modern high-street apparel.", logo: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=200&q=80" },
  { id: "brand-philips", name: "Philips", slug: "philips", description: "Home appliances and personal care.", logo: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=200&q=80" },
  { id: "brand-loreal", name: "L'Oreal", slug: "loreal", description: "Global skincare and beauty.", logo: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=200&q=80" },
  { id: "brand-nestle", name: "Nestlé", slug: "nestle", description: "Gourmet pantry foods and beverages.", logo: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&q=80" },
  { id: "brand-lego", name: "LEGO", slug: "lego", description: "Creative building systems.", logo: "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=200&q=80" },
];

interface RegionCategoryCatalog {
  brand: string;
  usaNames: string[];
  ukNames: string[];
  usaPriceRange: [number, number];
  ukPriceRange: [number, number];
  usaImages: string[];
  ukImages: string[];
}

function generateRegionProducts(): ProductSeed[] {
  const items: ProductSeed[] = [];

  const catalogByCategory: Record<string, RegionCategoryCatalog> = {
    "cat-electronics": {
      brand: "brand-apple",
      usaNames: [
        "Studio ANC Wireless Headphones (US Edition)",
        "UltraSharp 27-inch 4K USB-C Monitor (120V)",
        "Pro Mechanical RGB Gaming Keyboard - ANSI Layout",
        "MagSafe 10,000mAh Fast Wireless Power Bank",
        "Spatial Audio True Wireless Earbuds Pro",
        "4K60 HDR Streaming Capture Card",
        "100W GaN Fast US Wall Charger 4-Port",
        "NVMe Thunderbolt Portable SSD 2TB",
        "Creator 4K Mirrorless Vlogging Camera",
        "Smart Video Doorbell Wired 2K (US Chime)",
        "Wi-Fi 6E Tri-Band Mesh Router 3-Pack",
        "Ergonomic Vertical Wireless Mouse",
        "Condenser USB Podcast Microphone Kit",
        "Foldable 4K GPS Camera Drone (FAA Ready)",
      ],
      ukNames: [
        "British Hi-Fi Wireless Noise-Cancelling Headphones",
        "UltraWide 34-inch QHD Monitor (UK 3-Pin Plug)",
        "Compact Mechanical Keyboard - UK ISO Layout",
        "USB-C PD 65W UK Plug Fast Travel Charger",
        "Waterproof Portable Bluetooth Speaker (IP67)",
        "Smart Fitness Watch Series 9 (UK/EU Band)",
        "Studio Monitor Headphones for Mastering",
        "2K Night Vision Smart Home Security Camera (UK)",
        "Multi-Port Aluminium USB-C Hub 10-in-1",
        "Cordless Precision Electric Screwdriver Set",
        "Digital Graphics Tablet with Battery-Free Pen",
        "Ambient Smart LED TV Backlight Strip Kit",
        "Dual-DAC Portable Headphone Amplifier",
        "Wireless Bluetooth Key & Luggage Tracker 4-Pack",
      ],
      usaPriceRange: [39, 699],
      ukPriceRange: [29, 549],
      usaImages: [
        "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
        "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
      ],
      ukImages: [
        "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800&q=80",
        "https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=800&q=80",
        "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
      ],
    },
    "cat-fashion": {
      brand: "brand-zara",
      usaNames: [
        "American Selvedge Denim Trucker Jacket",
        "NYC Heavyweight Fleece Pullover Hoodie",
        "Classic California Polarized Aviator Sunglasses",
        "Soft Supima Cotton Crewneck Tees 3-Pack",
        "Canvas Heritage Crossbody Messenger Bag",
        "Athletic Stretch Tapered Chino Trousers",
        "Retro Leather Low-Top Court Sneakers",
        "Quilted Nylon Puffer Vest - Midnight",
        "Full-Grain Leather Bifold RFID Wallet",
        "Flannel Brushed Cotton Work Shirt",
        "Travel Weekender Duffel Bag 35L",
        "Suede Western Ankle Boots",
        "Relaxed Straight Fit Vintage Jeans",
        "Performance Moisture-Wicking Crew Socks 6-Pack",
      ],
      ukNames: [
        "Savile Tailored Merino Wool Blazer - Navy",
        "London Heritage Water-Resistant Trench Coat",
        "British Waxed Cotton Field Jacket",
        "Handcrafted Northampton Leather Chelsea Boots",
        "Scottish Cashmere Blend Ribbed Jumper",
        "Oxford Pinpoint Button-Down Cotton Shirt",
        "Houndstooth Classic Wool Wrap Scarf",
        "Rainproof Lightweight Commuter Mac Coat",
        "Brushed Suede Loafers with Crepe Sole",
        "Tailored Linen-Blend Pleated Trousers",
        "Silk Woven Jacquard Necktie & Pocket Square",
        "Structured Vegan Leather Tote Handbag",
        "Classic Breton Striped Long-Sleeve Tee",
        "Tartan Check Wool Flat Cap",
      ],
      usaPriceRange: [24, 189],
      ukPriceRange: [22, 195],
      usaImages: [
        "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&q=80",
        "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&q=80",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      ],
      ukImages: [
        "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80",
        "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=800&q=80",
        "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800&q=80",
      ],
    },
    "cat-home-kitchen": {
      brand: "brand-philips",
      usaNames: [
        "Digital XL 6-Quart Air Fryer (120V US Plug)",
        "Programmable 12-Cup Drip Coffee Maker (US)",
        "Enameled Cast Iron Dutch Oven 5.5 Qt",
        "High-Speed Countertop Blender 1200W (120V)",
        "Multi-Use 7-in-1 Electric Pressure Cooker",
        "Double-Wall Insulated Tumbler 40oz with Straw",
        "Hard-Anodized Nonstick Cookware 10-Piece Set",
        "Bamboo Carving Board Set with Juice Grooves",
        "Motion-Sensor Stainless Kitchen Trash Can 13 Gal",
        "Ultrasonic Cool Mist Bedroom Humidifier",
        "Memory Foam Cervical Contour Bed Pillow",
        "Countertop Nugget Ice Maker Machine",
        "Rechargeable Electric Salt & Pepper Mill Set",
        "Percale Organic Cotton Queen Sheet Set",
      ],
      ukNames: [
        "Rapid-Boil Electric Glass Kettle 1.7L (UK 3kW)",
        "4-Slice Stainless Steel Toaster (UK 230V)",
        "Dual-Zone 9L Digital Air Fryer (UK Plug)",
        "Barista Espresso & Cappuccino Maker (UK)",
        "Cast Iron Casserole Dish 26cm - Sage Green",
        "Cordless HEPA Stick Vacuum Cleaner (UK Charger)",
        "Damascus Steel 8-Inch Chef Knife with Block",
        "Bone China 16-Piece Dining Set",
        "Nordic Dimmable Brass Desk Lamp (UK Plug)",
        "Egyptian Cotton 400-Thread King Duvet Cover Set",
        "Stoneware Tea Pot & 4 Double-Wall Mugs",
        "Expandable Bamboo Bath Caddy Tray",
        "Digital Kitchen Baking Scale (Grams / Oz)",
        "Ceramic Reed & Ultrasonic Aroma Diffuser",
      ],
      usaPriceRange: [25, 299],
      ukPriceRange: [20, 249],
      usaImages: [
        "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&q=80",
        "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&q=80",
      ],
      ukImages: [
        "https://images.unsplash.com/photo-1544717305-2782549b5136?w=800&q=80",
        "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?w=800&q=80",
      ],
    },
    "cat-beauty": {
      brand: "brand-loreal",
      usaNames: [
        "Clinical Vitamin C 20% + Ferulic Face Serum",
        "Ceramide Barrier Repair Daily Facial Cleanser",
        "Broad Spectrum Sheer Mineral Sunscreen SPF 50",
        "Retinol + Peptide Overnight Renewal Cream",
        "California Argan & Keratin Hair Repair Mask",
        "Velvet Matte Long-Wear Lip Trio Set",
        "18-Shade Desert Sunset Eyeshadow Palette",
        "Glycolic Acid 7% Exfoliating Resurfacing Toner",
        "12-Piece Pro Synthetic Makeup Brush Kit",
        "Charcoal & Kaolin Pore Detox Clay Mask",
        "Hyaluronic Plumping Eye Gel Cream",
        "Biotin Thickening Scalp Shampoo 16 fl oz",
        "Silicone Sonic Facial Cleansing Brush",
        "Vanilla Cedarwood Eau de Parfum 3.4 fl oz",
      ],
      ukNames: [
        "British Rose & Hyaluronic Hydrating Serum 30ml",
        "Cotswold Lavender Soothing Bath Salts 500g",
        "Botanical Cold-Pressed Jojoba Facial Oil 100ml",
        "Niacinamide 10% + Zinc Pore Refining Drops",
        "Rich Shea Butter Intensive Hand Balm 75ml",
        "London Pear & Freesia Cologne Spray 100ml",
        "Micellar Gentle Rosewater Toning Mist",
        "Volumizing & Lengthening Waterproof Mascara",
        "Silk Mulberry Anti-Frizz Pillowcase - Ivory",
        "Oat & Chamomile Sensitive Skin Moisturiser",
        "Nail Strengthening Keratin & Cuticle Elixir",
        "Illuminating Liquid Champagne Highlighter",
        "Peppermint & Tea Tree Clarifying Scalp Scrub",
        "Beeswax & Honey Ultra-Repair Lip Balm Duo",
      ],
      usaPriceRange: [14, 95],
      ukPriceRange: [12, 85],
      usaImages: [
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
        "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80",
      ],
      ukImages: [
        "https://images.unsplash.com/photo-1608248597359-0027f99990ea?w=800&q=80",
        "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80",
      ],
    },
    "cat-sports": {
      brand: "brand-nike",
      usaNames: [
        "Air Zoom Pegasus Cushioned Running Shoes",
        "Adjustable Cast Iron Dumbbell Set 50 lbs",
        "Official Composite Leather Basketball Size 7",
        "6-Foot Doorway Heavy-Duty Pull-Up Bar",
        "Tactical 4-Person Waterproof Camping Tent",
        "Insulated Hydration Pack Vest with 2L Bladder",
        "High-Density Trigger Point Foam Roller",
        "5-Level Fabric Resistance Bands Set",
        "Compression Pro Short-Sleeve Training Tee",
        "Speed Ball-Bearing Jump Rope (Weighted)",
        "32oz Insulated Stainless Gym Water Bottle",
        "Padded Weightlifting Leather Wrist Straps",
        "Aluminum Ultralight Trekking Poles Pair",
        "LED Rear-Light Commuter Cycling Helmet",
      ],
      ukNames: [
        "Premier Match Quality Football (Size 5)",
        "Carbon-Shaft Badminton Racket Twin Set",
        "Eco-Cork Non-Slip Alignment Yoga Mat 6mm",
        "Adjustable Neoprene Kettlebell 16kg",
        "Waterproof Gym Holdall with Boot Tunnel",
        "Tourney Grade Table Tennis Bat Set + 3 Balls",
        "Thermal Running Gloves & Headband Kit",
        "Anti-Burst 65cm Gym Stability Ball with Pump",
        "Shock-Absorbing Patella Knee Support Brace",
        "Anti-Fog UV400 Competition Swimming Goggles",
        "Ab Wheel Roller with Extra Thick Knee Pad",
        "Adjustable 3-Level Aerobic Step Platform",
        "Hand Grip Strength Trainer Dynamometer",
        "All-Weather Running Armband for Smartphones",
      ],
      usaPriceRange: [18, 220],
      ukPriceRange: [15, 175],
      usaImages: [
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
        "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&q=80",
      ],
      ukImages: [
        "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80",
        "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&q=80",
      ],
    },
    "cat-toys": {
      brand: "brand-lego",
      usaNames: [
        "NASA Space Shuttle Discovery Building Set",
        "4WD High-Speed Off-Road RC Stunt Buggy",
        "STEM Magnetic Building Tiles 100-Piece Set",
        "US Cities Edition Property Trading Board Game",
        "1:18 Scale Diecast American Muscle Supercar",
        "Programmable Coding Robot Toy for Kids",
        "Deluxe 150-Piece Art & Craft Studio Case",
        "61-Key Electronic Learning Keyboard + Mic",
        "Solar Powered DIY Mars Exploration Rover",
        "Glow-in-the-Dark Galaxy Ceiling Planet Kit",
        "Walkie Talkies Long Range 3-Pack for Kids",
        "3x3 Stickerless Speed Cube Pro",
        "Outdoor Lawn Water Sprinkler Splash Pad",
        "Giant 40-Inch Plush Golden Teddy Bear",
      ],
      ukNames: [
        "London Red Double-Decker Bus Brick Kit",
        "Classic Wooden Tumbling Tower Game (54 Blocks)",
        "Miniature Georgian Wooden Dollhouse + Furniture",
        "Interactive AR World Globe with Quiz App",
        "Kids Foldable Kick Scooter with Light-Up Wheels",
        "Play Kitchen Wooden Tea & Bakery Set",
        "Detailed 3D Mechanical Wooden Clock Puzzle",
        "Tabletop Mini Football (Foosball) Arcade Table",
        "Junior Magician's 35-Trick Performance Box",
        "24-Tub Non-Toxic Modelling Clay Studio Pack",
        "Junior Doctor Roleplay Carry Case Set",
        "Waterproof RC Mini Submarine Toy",
        "Collector's Superhero 12-Inch Action Figure",
        "1000-Piece British Countryside Jigsaw Puzzle",
      ],
      usaPriceRange: [16, 149],
      ukPriceRange: [14, 129],
      usaImages: [
        "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80",
        "https://images.unsplash.com/photo-1585366119957-e9730b6d0f60?w=800&q=80",
      ],
      ukImages: [
        "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=800&q=80",
        "https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&q=80",
      ],
    },
    "cat-books": {
      brand: "brand-apple",
      usaNames: [
        "Atomic Habits (US Hardcover Edition)",
        "The Psychology of Money by Morgan Housel",
        "Designing Data-Intensive Applications",
        "Clean Code: Agile Software Craftsmanship",
        "Zero to One: Notes on Startups",
        "Deep Work: Rules for Focused Success",
        "Project Hail Mary: Hardcover Sci-Fi Novel",
        "Building a Second Brain by Tiago Forte",
        "The Pragmatic Programmer (20th Anniversary)",
        "System Design Interview Insider's Guide",
        "Can't Hurt Me by David Goggins",
        "The Lean Startup by Eric Ries",
        "Hardcover A5 Dotted Bullet Notebook",
        "Calligraphy Fountain Pen + Bottled Ink Set",
      ],
      ukNames: [
        "Sapiens: A Brief History of Humankind (UK Paperback)",
        "The Midnight Library by Matt Haig (UK Edition)",
        "Thinking, Fast and Slow by Daniel Kahneman",
        "Dune: Deluxe British Collector's Hardcover",
        "Man's Search for Meaning (UK Edition)",
        "Principles: Life and Work by Ray Dalio",
        "Good to Great by Jim Collins",
        "Essentialism: The Disciplined Pursuit of Less",
        "Refactoring: Improving Existing Code (2nd Ed)",
        "Start with Why by Simon Sinek",
        "The Art of War: Clothbound Classic Edition",
        "Oxford Compact English Dictionary & Thesaurus",
        "Leather-Bound Lay-Flat Sketchbook A4",
        "Fine Nib Brass Pocket Rollerball Pen",
      ],
      usaPriceRange: [12, 58],
      ukPriceRange: [9, 45],
      usaImages: [
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80",
        "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=800&q=80",
      ],
      ukImages: [
        "https://images.unsplash.com/photo-1512820790803-83ca734da794?w=800&q=80",
        "https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=800&q=80",
      ],
    },
    "cat-groceries": {
      brand: "brand-nestle",
      usaNames: [
        "California Roasted Whole Almonds 2 lb Bag",
        "100% Pure Vermont Grade A Maple Syrup 16 oz",
        "Artisanal Pacific Northwest Medium Roast Beans 2 lb",
        "Wildflower Raw Unfiltered US Honey 24 oz",
        "Organic Gluten-Free Rolled Oats 32 oz",
        "Smoked California Sweet Paprika Jar",
        "Organic Omega-3 Black Chia Seeds 16 oz",
        "Raw Apple Cider Vinegar with The Mother 16 oz",
        "Creamy Stone-Ground Natural Peanut Butter 28 oz",
        "Maple Pecan & Wild Berry Artisan Granola 24 oz",
        "Cold-Pressed Virgin Coconut Oil 16 oz",
        "Extra Virgin Cold-Pressed Olive Oil 33.8 fl oz",
        "Dark Chocolate Baking Chips 72% Cacao 16 oz",
        "Medjool Coachella Valley Jumbo Dates 2 lb",
      ],
      ukNames: [
        "London Heritage Earl Grey Loose Leaf Tea 250g",
        "Scottish Heather Blossom Raw Honey Jar 340g",
        "Yorkshire Gold Strong Breakfast Tea 160 Bags",
        "Belgian 72% Dark Chocolate Baking Drops 500g",
        "Ceremonial Grade Matcha Green Tea Tin 100g",
        "Aged Basmati Aromatic Long-Grain Rice 5kg",
        "Modena Aged Balsamic Vinegar Glass Bottle 250ml",
        "Whole Jumbo Roasted Cashew Nuts 1kg",
        "Himalayan Fine Pink Rock Salt Grinder Refill 1kg",
        "Turkish Sun-Dried Whole Figs 500g",
        "Spiced Masala Chai Loose Herbal Tea 250g",
        "Shelled Roasted Salted Pistachios 500g",
        "Organic Matcha & Honey Oat Cereal Crunch 600g",
        "Authentic Japanese Naturally Brewed Soy Sauce 500ml",
      ],
      usaPriceRange: [8, 48],
      ukPriceRange: [6, 38],
      usaImages: [
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
        "https://images.unsplash.com/photo-1588964895597-cfccd6e2dbf9?w=800&q=80",
      ],
      ukImages: [
        "https://images.unsplash.com/photo-1514733670139-4d87a1941d55?w=800&q=80",
        "https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80",
      ],
    },
  };

  let count = 1;

  for (const [catId, info] of Object.entries(catalogByCategory)) {
    const catCode = catId.replace("cat-", "").toUpperCase().slice(0, 3);

    // 1. Generate USA Products
    info.usaNames.forEach((name, idx) => {
      const base = info.usaPriceRange[0] + ((idx * 17) % (info.usaPriceRange[1] - info.usaPriceRange[0]));
      const price = Number((base + 0.99).toFixed(2));
      const hasDiscount = idx % 3 === 0;
      const salePrice = hasDiscount ? Number((price * 0.8).toFixed(2)) : null;
      const slug = `usa-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${count}`;

      items.push({
        id: `prod-usa-${count}`,
        name,
        slug,
        description: `Exclusive ClickCart USA item: ${name}. Meets US safety & voltage standards with fast nationwide US shipping.`,
        price,
        salePrice,
        sku: `USA-${catCode}-${String(count).padStart(4, "0")}`,
        stock: ((idx * 7) % 40) + 6,
        images: [
          info.usaImages[idx % info.usaImages.length],
          info.usaImages[(idx + 1) % info.usaImages.length],
        ],
        featured: idx < 3,
        isFlashDeal: idx === 0 || idx === 1,
        flashDealEnd: idx < 2 ? new Date(Date.now() + 86400000 * 3).toISOString() : null,
        rating: Number((4.2 + (idx % 7) * 0.1).toFixed(1)),
        reviewCount: 15 + idx * 9,
        region: "USA",
        categoryId: catId,
        brandId: info.brand,
      });
      count++;
    });

    // 2. Generate UK Products
    info.ukNames.forEach((name, idx) => {
      const base = info.ukPriceRange[0] + ((idx * 15) % (info.ukPriceRange[1] - info.ukPriceRange[0]));
      const price = Number((base + 0.99).toFixed(2));
      const hasDiscount = idx % 3 === 0;
      const salePrice = hasDiscount ? Number((price * 0.8).toFixed(2)) : null;
      const slug = `uk-${name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "")}-${count}`;

      items.push({
        id: `prod-uk-${count}`,
        name,
        slug,
        description: `Exclusive ClickCart UK item: ${name}. UK specification (230V / UK sizing) with Royal Mail & DPD express UK delivery.`,
        price,
        salePrice,
        sku: `UK-${catCode}-${String(count).padStart(4, "0")}`,
        stock: ((idx * 5) % 35) + 6,
        images: [
          info.ukImages[idx % info.ukImages.length],
          info.ukImages[(idx + 1) % info.ukImages.length],
        ],
        featured: idx < 3,
        isFlashDeal: idx === 0 || idx === 1,
        flashDealEnd: idx < 2 ? new Date(Date.now() + 86400000 * 3).toISOString() : null,
        rating: Number((4.2 + (idx % 7) * 0.1).toFixed(1)),
        reviewCount: 18 + idx * 8,
        region: "UK",
        categoryId: catId,
        brandId: info.brand,
      });
      count++;
    });
  }

  return items;
}

export const SEED_PRODUCTS = generateRegionProducts();

export const SEED_COUPONS = [
  {
    id: "coupon-welcome10",
    code: "WELCOME10",
    discountType: "PERCENTAGE" as const,
    discountValue: 10,
    minOrderAmount: 20,
    maxDiscount: 50,
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
    minOrderAmount: 60,
    maxDiscount: 100,
    expiryDate: new Date("2028-12-31"),
    usageLimit: 500,
    usedCount: 88,
    isActive: true,
  },
  {
    id: "coupon-flat10",
    code: "FLAT10",
    discountType: "FIXED" as const,
    discountValue: 10,
    minOrderAmount: 40,
    maxDiscount: 10,
    expiryDate: new Date("2028-12-31"),
    usageLimit: 300,
    usedCount: 19,
    isActive: true,
  },
];
