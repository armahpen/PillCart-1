import XLSX from 'xlsx';
import fs from 'fs';

function extractCatalogData() {
    try {
        // Read Excel file
        const workbook = XLSX.readFile('attached_assets/Merged_Product_Catalog_Cleaned_1755606785626.xlsx');
        
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
            
            console.log('\nFirst 3 products:');
            console.log(JSON.stringify(jsonData.slice(0, 3), null, 2));
            
            // Save to JSON file
            fs.writeFileSync('catalog_data.json', JSON.stringify(jsonData, null, 2));
            console.log('\nCatalog data saved to catalog_data.json');
            
            return jsonData;
        }
        
    } catch (error) {
        console.error('Error reading Excel file:', error);
        return null;
    }
}

extractCatalogData();