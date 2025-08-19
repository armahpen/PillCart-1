import fs from 'fs';

// Read the extracted catalog data
const catalogData = JSON.parse(fs.readFileSync('catalog_data.json', 'utf8'));

console.log(`Processing ${catalogData.length} products from catalog...`);

// Group by category and brand
const categories = {};
const brands = {};
const products = [];

catalogData.forEach((item, index) => {
  const category = item.Category || 'Uncategorized';
  const brand = item.Brand || 'Generic';
  const productName = item.ProductName || `Product ${index + 1}`;
  const price = item['Price(Ghc)'] || 0;
  const imageUrl = item.Direct_Link || '';

  // Track categories
  if (!categories[category]) {
    categories[category] = {
      name: category,
      slug: category.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
      description: `${category} products for your health needs`
    };
  }

  // Track brands
  if (!brands[brand]) {
    brands[brand] = {
      name: brand,
      slug: brand.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-'),
      description: `Quality ${brand} products`
    };
  }

  // Create product slug
  const productSlug = productName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100);

  products.push({
    name: productName,
    slug: productSlug,
    description: `${productName} - High quality ${brand} product in ${category}`,
    shortDescription: productName.length > 50 ? productName.substring(0, 50) + '...' : productName,
    price: price.toString(),
    dosage: extractDosage(productName),
    category: category,
    brand: brand,
    imageUrl: imageUrl,
    stockQuantity: Math.floor(Math.random() * 150) + 50,
    requiresPrescription: isPrescriptionRequired(productName, category),
    rating: (Math.random() * 2 + 3).toFixed(1), // Random rating between 3-5
    reviewCount: Math.floor(Math.random() * 500) + 50
  });
});

function extractDosage(productName) {
  // Extract dosage info from product name
  const dosageMatch = productName.match(/(\d+\s*(mg|mcg|g|ml|tablets?|capsules?|count|ct))/i);
  return dosageMatch ? dosageMatch[0] : 'As directed';
}

function isPrescriptionRequired(productName, category) {
  // Simple logic to determine prescription requirement
  const prescriptionKeywords = ['prescription', 'rx', 'antibiotic', 'steroid'];
  const productLower = productName.toLowerCase();
  return prescriptionKeywords.some(keyword => productLower.includes(keyword));
}

// Generate TypeScript/JavaScript code for seeding
const generatedCode = `
// Auto-generated catalog seeding data from Excel file
// ${new Date().toISOString()}

// Categories (${Object.keys(categories).length} total)
const catalogCategories = ${JSON.stringify(Object.values(categories), null, 2)};

// Brands (${Object.keys(brands).length} total)  
const catalogBrands = ${JSON.stringify(Object.values(brands), null, 2)};

// Products (${products.length} total)
const catalogProducts = ${JSON.stringify(products, null, 2)};

export { catalogCategories, catalogBrands, catalogProducts };
`;

fs.writeFileSync('generated_catalog_seeding.js', generatedCode);

console.log(`\nGenerated seeding data:`);
console.log(`- ${Object.keys(categories).length} categories`);
console.log(`- ${Object.keys(brands).length} brands`);
console.log(`- ${products.length} products`);
console.log(`\nCategories: ${Object.keys(categories).join(', ')}`);
console.log(`\nTop brands: ${Object.keys(brands).slice(0, 10).join(', ')}`);
console.log(`\nCode generated in: generated_catalog_seeding.js`);