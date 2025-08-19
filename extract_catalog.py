#!/usr/bin/env python3

import pandas as pd
import json
import sys

def extract_catalog_data(excel_file):
    """Extract product data from Excel catalog file"""
    try:
        # Read all sheets from Excel file
        excel_data = pd.read_excel(excel_file, sheet_name=None)
        
        print(f"Found {len(excel_data)} sheets in the Excel file:")
        for sheet_name in excel_data.keys():
            print(f"- {sheet_name}: {len(excel_data[sheet_name])} rows")
        
        # Get the first sheet or main data sheet
        main_sheet_name = list(excel_data.keys())[0]
        df = excel_data[main_sheet_name]
        
        print(f"\nUsing sheet: {main_sheet_name}")
        print(f"Columns: {list(df.columns)}")
        print(f"First few rows:")
        print(df.head())
        
        # Convert to JSON format for easy processing
        catalog_data = []
        for index, row in df.iterrows():
            product = {}
            for col in df.columns:
                value = row[col]
                # Handle NaN values
                if pd.isna(value):
                    product[col] = ""
                else:
                    product[col] = str(value)
            catalog_data.append(product)
        
        return catalog_data
        
    except Exception as e:
        print(f"Error reading Excel file: {e}")
        return None

if __name__ == "__main__":
    excel_file = "attached_assets/Merged_Product_Catalog_Cleaned_1755606785626.xlsx"
    
    catalog_data = extract_catalog_data(excel_file)
    
    if catalog_data:
        # Save to JSON file for easy reading
        with open("catalog_data.json", "w") as f:
            json.dump(catalog_data, f, indent=2)
        
        print(f"\nExtracted {len(catalog_data)} products from catalog")
        print("Data saved to catalog_data.json")
        
        # Show sample product structure
        if catalog_data:
            print(f"\nSample product structure:")
            print(json.dumps(catalog_data[0], indent=2))
    else:
        print("Failed to extract catalog data")