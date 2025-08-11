import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Filter, X } from "lucide-react";

interface ProductFiltersProps {
  categories: Array<{ id: string; name: string; slug: string }>;
  brands: Array<{ id: string; name: string }>;
  selectedCategory: string;
  selectedBrand: string;
  selectedPrice: string;
  onFilterChange: (filterType: string, value: string) => void;
  onClearFilters: () => void;
}

export default function ProductFilters({
  categories,
  brands,
  selectedCategory,
  selectedBrand,
  selectedPrice,
  onFilterChange,
  onClearFilters,
}: ProductFiltersProps) {
  const priceRanges = [
    { value: "0-10", label: "Under $10" },
    { value: "10-50", label: "$10 - $50" },
    { value: "50-100", label: "$50 - $100" },
    { value: "100+", label: "Over $100" },
  ];

  const activeFiltersCount = [selectedCategory, selectedBrand, selectedPrice].filter(Boolean).length;

  return (
    <Card className="bg-white shadow-sm sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <Filter className="h-5 w-5 mr-2 text-primary" />
            Filters
          </div>
          {activeFiltersCount > 0 && (
            <div className="flex items-center space-x-2">
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={onClearFilters}
                className="text-xs p-1 h-auto"
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Price Range */}
        <div>
          <h3 className="font-medium text-sm mb-3">Price Range</h3>
          <div className="space-y-2">
            {priceRanges.map((range) => (
              <div key={range.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`price-${range.value}`}
                  checked={selectedPrice === range.value}
                  onCheckedChange={(checked) => {
                    onFilterChange('price', checked ? range.value : '');
                  }}
                />
                <label 
                  htmlFor={`price-${range.value}`} 
                  className="text-sm cursor-pointer hover:text-primary transition-colors"
                >
                  {range.label}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-medium text-sm mb-3">Category</h3>
          <div className="space-y-2">
            {categories.map((category) => (
              <div key={category.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`category-${category.id}`}
                  checked={selectedCategory === category.slug}
                  onCheckedChange={(checked) => {
                    onFilterChange('category', checked ? category.slug : '');
                  }}
                />
                <label 
                  htmlFor={`category-${category.id}`} 
                  className="text-sm cursor-pointer hover:text-primary transition-colors"
                >
                  {category.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Brands */}
        <div>
          <h3 className="font-medium text-sm mb-3">Brand</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
            {brands.map((brand) => (
              <div key={brand.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`brand-${brand.id}`}
                  checked={selectedBrand === brand.id}
                  onCheckedChange={(checked) => {
                    onFilterChange('brand', checked ? brand.id : '');
                  }}
                />
                <label 
                  htmlFor={`brand-${brand.id}`} 
                  className="text-sm cursor-pointer hover:text-primary transition-colors"
                >
                  {brand.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Availability */}
        <div>
          <h3 className="font-medium text-sm mb-3">Availability</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <Checkbox id="in-stock" defaultChecked />
              <label htmlFor="in-stock" className="text-sm cursor-pointer hover:text-primary transition-colors">
                In Stock
              </label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox id="out-of-stock" />
              <label htmlFor="out-of-stock" className="text-sm cursor-pointer hover:text-primary transition-colors">
                Out of Stock
              </label>
            </div>
          </div>
        </div>

        {/* Clear Filters Button */}
        {activeFiltersCount > 0 && (
          <Button 
            variant="outline" 
            className="w-full" 
            onClick={onClearFilters}
          >
            Clear All Filters
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
