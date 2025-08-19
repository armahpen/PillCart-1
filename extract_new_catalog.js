import XLSX from 'xlsx';
import fs from 'fs';

function extractNewCatalogData() {
    try {
        // Read the new Excel file
        const workbook = XLSX.readFile('attached_assets/Merged_Product_Catalog_Cleaned_1755607383577.xlsx');
        
        console.log('Sheet names:', workbook.SheetNames);
        
        // Get the first sheet
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { defval: "" });
        
        console.log(`\nFound ${jsonData.length} products in sheet: ${firstSheetName}`);
        
        if (jsonData.length > 0) {
            console.log('\nColumns found:');
            Object.keys(jsonData[0]).forEach(col => {
                console.log(`- ${col}`);
            });
            
            console.log('\nFirst 5 products:');
            console.log(JSON.stringify(jsonData.slice(0, 5), null, 2));
            
            // Save to JSON file for React component usage
            fs.writeFileSync('client/public/product_catalog.json', JSON.stringify(jsonData, null, 2));
            console.log('\nProduct catalog saved to client/public/product_catalog.json');
            
            // Generate category list
            const categories = [...new Set(jsonData.map(item => item.Category).filter(Boolean))];
            console.log(`\nCategories (${categories.length}):`, categories);
            
            return { products: jsonData, categories };
        }
        
    } catch (error) {
        console.error('Error reading Excel file:', error);
        return null;
    }
}

extractNewCatalogData();