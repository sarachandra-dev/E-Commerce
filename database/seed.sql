USE shopsphere;

INSERT IGNORE INTO categories (name) VALUES ('Electronics'), ('Clothing'), ('Books'), ('Home & Kitchen');

INSERT IGNORE INTO users (name, email, password, role) VALUES
('Admin User', 'admin@shopsphere.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'ADMIN'),
('John Doe', 'john@example.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', 'USER');

INSERT IGNORE INTO products (name, description, price, stock, image_url, category_id) VALUES
('iPhone 15 Pro', 'Latest Apple iPhone with A17 Pro chip, 48MP camera system, titanium design and USB-C connectivity.', 999.99, 50, 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400', 1),
('Samsung Galaxy S24 Ultra', 'Flagship Android phone with Snapdragon 8 Gen 3, 200MP camera, built-in S Pen.', 1199.99, 40, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', 1),
('MacBook Pro 14 inch', 'Powered by Apple M3 Pro chip with 18GB RAM and 512GB SSD.', 1999.99, 20, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', 1),
('Sony WH-1000XM5 Headphones', 'Industry-leading noise canceling wireless headphones with 30-hour battery life.', 349.99, 60, 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400', 1),
('iPad Air 5th Gen', '10.9-inch Liquid Retina display powered by M1 chip with 5G capability.', 749.99, 35, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', 1),
('Apple Watch Series 9', 'Advanced health monitoring with crash detection, ECG, blood oxygen sensor.', 399.99, 45, 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400', 1),
('Canon EOS R50 Camera', 'Mirrorless camera with 24.2MP APS-C sensor, 4K video recording.', 679.99, 25, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', 1),
('Dell XPS 15 Laptop', 'Intel Core i9 processor, 32GB RAM, 1TB SSD with stunning OLED display.', 1799.99, 15, 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=400', 1),
('Nike Air Max 270', 'Iconic Nike sneakers featuring a large Air unit in the heel for all-day comfort.', 129.99, 80, 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400', 2),
('Levis 501 Original Jeans', 'Classic straight fit jeans crafted from premium denim fabric.', 79.99, 100, 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=400', 2),
('Adidas Essential Hoodie', 'Comfortable cotton blend hoodie with kangaroo pocket and adjustable drawstring.', 59.99, 75, 'https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400', 2),
('Floral Summer Dress', 'Elegant floral print midi dress perfect for summer occasions.', 49.99, 60, 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=400', 2),
('Classic Polo Shirt', 'Premium pique cotton polo shirt with embroidered logo.', 89.99, 90, 'https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=400', 2),
('North Face Winter Jacket', 'Waterproof and windproof jacket with DryVent technology and insulated lining.', 199.99, 40, 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400', 2),
('Atomic Habits', 'James Clear reveals how tiny changes in behavior can lead to remarkable results.', 16.99, 150, 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=400', 3),
('The Psychology of Money', 'Morgan Housel shares timeless lessons on wealth, greed and happiness.', 14.99, 120, 'https://images.unsplash.com/photo-1592496431122-2349e0fbc666?w=400', 3),
('Clean Code', 'Robert C. Martin teaches you how to write clean, readable and maintainable code.', 39.99, 80, 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=400', 3),
('The Alchemist', 'Paulo Coelho magical story about a young shepherd following his dreams.', 12.99, 200, 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400', 3),
('Deep Work', 'Cal Newport rules for focused success in a distracted world.', 15.99, 100, 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400', 3),
('Instant Pot Duo 7-in-1', 'Multi-use electric pressure cooker, slow cooker, rice cooker, steamer. 6 quart capacity.', 89.99, 55, 'https://images.unsplash.com/photo-1585515320310-259814833e62?w=400', 4),
('Dyson V15 Detect Vacuum', 'Cordless vacuum cleaner with laser dust detection and powerful suction.', 649.99, 20, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400', 4),
('KitchenAid Stand Mixer', 'Professional 5-quart tilt-head stand mixer with 10 speeds and multiple attachments.', 449.99, 25, 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400', 4),
('Nespresso Vertuo Coffee Machine', 'Premium coffee machine using centrifusion technology for perfect espresso.', 179.99, 45, 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400', 4),
('Modern Bookshelf Unit', 'Versatile and stylish shelf unit perfect for storage and display in any room.', 129.99, 30, 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=400', 4),
('Air Purifier HEPA Filter', 'True HEPA air purifier removes 99.97% of airborne particles. Covers up to 500 sq ft.', 249.99, 35, 'https://images.unsplash.com/photo-1585771724684-38269d6639fd?w=400', 4);
