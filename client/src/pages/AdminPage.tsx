import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { 
  Settings, 
  Package, 
  FileText, 
  Users, 
  Edit, 
  Save, 
  Trash2, 
  Plus,
  Upload,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  ShoppingBag,
  CreditCard,
  Activity,
  AlertCircle,
  DollarSign,
  User,
  Search,
  Filter
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProducts } from "@/contexts/ProductContext";
import * as XLSX from 'xlsx';

interface AdminUser {
  id: string;
  username?: string;
  email: string;
  firstName?: string;
  lastName?: string;
  isAdmin: boolean;
  adminRole?: string;
  adminPermissions?: { permission: string }[];
}

interface Product {
  id?: string;
  Category?: string;
  'Product Name'?: string;
  name?: string;
  Brand?: string;
  brand?: { name: string };
  category?: { name: string };
  Price?: number;
  price?: string;
  ImageURL?: string;
  imageUrl?: string;
}

interface PaymentRecord {
  id: string;
  email: string;
  amount: number;
  reference: string;
  status: string;
  timestamp: string;
}

interface LogEntry {
  id: string;
  action: string;
  details: string;
  timestamp: string;
  user?: string;
}



export default function AdminPage() {
  const [, setLocation] = useLocation();
  const [currentUser, setCurrentUser] = useState<AdminUser | null>(null);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentSearchEmail, setPaymentSearchEmail] = useState("");
  const [paymentSearchRef, setPaymentSearchRef] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

  // Use ProductContext for shared product management
  const { products, updateProduct, deleteProduct, addProduct } = useProducts();
  
  // Local state for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  // Extract categories from products
  const categories = products ? Array.from(
    new Set(
      products
        .map(p => p.category?.name || p.Category)
        .filter((c): c is string => Boolean(c && c.trim() !== ''))
    )
  ) : [];

  // Filter products based on search and category
  const filteredProducts = products ? products.filter(product => {
    // Filter by category
    if (selectedCategory !== 'All') {
      const productCategory = product.category?.name || product.Category;
      if (productCategory !== selectedCategory) return false;
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const name = product.name || product['Product Name'] || '';
      const category = product.category?.name || product.Category || '';
      const brand = product.brand?.name || product.Brand || '';
      
      return (
        name.toLowerCase().includes(query) ||
        category.toLowerCase().includes(query) ||
        brand.toLowerCase().includes(query)
      );
    }

    return true;
  }) : [];

  const productsLoading = !products || products.length === 0;
  const productsError = null;

  const { toast } = useToast();

  // Filter payments based on search criteria
  const filteredPayments = paymentHistory.filter((payment) => {
    const matchesEmail = payment.email.toLowerCase().includes(paymentSearchEmail.toLowerCase());
    const matchesRef = payment.reference.toLowerCase().includes(paymentSearchRef.toLowerCase());
    const matchesStatus = paymentStatusFilter === "all" || payment.status === paymentStatusFilter;
    
    return matchesEmail && matchesRef && matchesStatus;
  });

  const clearPaymentFilters = () => {
    setPaymentSearchEmail("");
    setPaymentSearchRef("");
    setPaymentStatusFilter("all");
  };


  // Add log entry
  const addLog = (action: string, details: string) => {
    const newLog: LogEntry = {
      id: Date.now().toString(),
      action,
      details,
      timestamp: new Date().toLocaleString(),
      user: currentUser?.username || currentUser?.email || 'Admin'
    };
    setLogs(prev => [newLog, ...prev.slice(0, 99)]); // Keep last 100 logs
  };

  // Load payment history from localStorage and mock data
  const loadPaymentHistory = () => {
    try {
      const savedPayments = localStorage.getItem('adminPaymentHistory');
      let payments: PaymentRecord[] = [];
      
      if (savedPayments) {
        payments = JSON.parse(savedPayments);
      }
      
      // Add some sample payments if none exist
      if (payments.length === 0) {
        payments = [
          {
            id: '1',
            email: 'customer1@example.com',
            amount: 125.50,
            reference: 'PAY_001',
            status: 'success',
            timestamp: new Date(Date.now() - 3600000).toISOString()
          },
          {
            id: '2',
            email: 'customer2@example.com',
            amount: 89.75,
            reference: 'PAY_002',
            status: 'success',
            timestamp: new Date(Date.now() - 7200000).toISOString()
          },
          {
            id: '3',
            email: 'john.doe@gmail.com',
            amount: 234.20,
            reference: 'PAY_003',
            status: 'success',
            timestamp: new Date(Date.now() - 86400000).toISOString()
          },
          {
            id: '4',
            email: 'sarah.wilson@yahoo.com',
            amount: 67.30,
            reference: 'PAY_004',
            status: 'failed',
            timestamp: new Date(Date.now() - 172800000).toISOString()
          },
          {
            id: '5',
            email: 'michael.brown@hotmail.com',
            amount: 156.80,
            reference: 'PAY_005',
            status: 'pending',
            timestamp: new Date(Date.now() - 259200000).toISOString()
          }
        ];
        localStorage.setItem('adminPaymentHistory', JSON.stringify(payments));
      }
      
      setPaymentHistory(payments);
      addLog('Payment History Loaded', `${payments.length} payment records loaded`);
    } catch (error) {
      console.error('Error loading payment history:', error);
      setPaymentHistory([]);
    }
  };

  // Check admin authentication
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // First check localStorage for role-based admin login
        const userRole = localStorage.getItem('role');
        const adminUsername = localStorage.getItem('adminUsername');
        
        if (userRole === 'admin' && adminUsername === 'Admin1') {
          // Use hardcoded admin credentials - separate from regular users
          setCurrentUser({
            id: 'admin-hardcoded-001',
            username: adminUsername,
            email: 'admin@smilepills.com',
            isAdmin: true,
            adminRole: 'super_admin',
            firstName: 'Admin',
            lastName: '1'
          });
          loadPaymentHistory();
          setLoading(false);
          return;
        }

        // Fallback to backend authentication
        const response = await fetch('/api/auth/user', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.isAdmin) {
            setCurrentUser(data.user);
            loadPaymentHistory();
          } else {
            setLocation('/admin/login');
          }
        } else {
          setLocation('/admin/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setLocation('/admin/login');
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [setLocation]);

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
    setIsEditDialogOpen(true);
    addLog('Product Edit', `Started editing product: ${product.name || product['Product Name']}`);
  };

  const handleSaveProduct = async () => {
    if (!editingProduct || !editingProduct.id) return;
    
    try {
      // Convert the editing product to proper format for the update
      const updates: any = {
        name: editingProduct.name,
        'Product Name': editingProduct['Product Name'],
        Category: editingProduct.Category,
        Brand: editingProduct.Brand,
        Price: editingProduct.Price,
        price: editingProduct.price,
        ImageURL: editingProduct.ImageURL,
        imageUrl: editingProduct.imageUrl,
      };
      
      console.log('Admin: Calling updateProduct for ID:', editingProduct.id, 'with updates:', updates);
      await updateProduct(editingProduct.id, updates);
      setEditingProduct(null);
      setIsEditDialogOpen(false);
      console.log('Admin: Product update completed');
      addLog('Product Updated', `${editingProduct.name || editingProduct['Product Name']} was modified`);
      toast({
        title: "Product Updated",
        description: "Product has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (productId: string | undefined, productName: string) => {
    if (!productId) return;
    
    try {
      console.log('Admin: Calling deleteProduct for ID:', productId);
      await deleteProduct(productId);
      console.log('Admin: Product delete completed');
      addLog('Product Deleted', `${productName} was removed from catalog`);
      toast({
        title: "Product Deleted",
        description: "Product has been deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting product:', error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
  };

  const handleAddProduct = async (newProduct: Omit<Product, 'id'>) => {
    try {
      // Create a clean product object for adding new product
      const cleanProduct: any = {
        'Product Name': newProduct['Product Name'],
        Category: newProduct.Category,
        Brand: newProduct.Brand,
        Price: newProduct.Price,
        ImageURL: newProduct.ImageURL,
      };
      await addProduct(cleanProduct);
      setIsAddingProduct(false);
      addLog('Product Added', `${newProduct.name || newProduct['Product Name']} was added to catalog`);
      toast({
        title: "Product Added",
        description: "Product has been added successfully",
      });
    } catch (error) {
      console.error('Error adding product:', error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  if (loading || productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Activity className="h-8 w-8 animate-spin mx-auto mb-4" />
              <p>Loading admin dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return null; // Will redirect to login
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">
            Welcome back, {currentUser.username || currentUser.email}
          </p>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Product Management
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment History
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Live Logs
            </TabsTrigger>
          </TabsList>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="products" className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              Product Management
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Payment History
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Live Logs
            </TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-semibold">Product Catalog</h2>
                <p className="text-gray-600">Manage your product inventory ({filteredProducts.length} products shown)</p>
              </div>
              
              <Dialog open={isAddingProduct} onOpenChange={setIsAddingProduct}>
                <DialogTrigger asChild>
                  <Button 
                    className="flex items-center gap-2 bg-primary hover:bg-primary/90 shadow-lg" 
                    data-testid="button-add-product"
                    size="lg"
                  >
                    <Plus className="h-5 w-5" />
                    Add New Product
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Plus className="h-5 w-5" />
                      Add New Product to Catalog
                    </DialogTitle>
                  </DialogHeader>
                  <AddProductForm 
                    categories={categories}
                    onAdd={handleAddProduct}
                    onCancel={() => setIsAddingProduct(false)}
                  />
                </DialogContent>
              </Dialog>
            </div>

            {/* Search and Filter Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Search & Filter Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      type="text"
                      placeholder="Search products by name, brand, or category..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                      data-testid="input-product-search"
                    />
                  </div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger data-testid="select-product-category">
                      <SelectValue placeholder="Filter by category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All Categories ({products.length})</SelectItem>
                      {categories.map(category => {
                        const count = products.filter(p => (p.category?.name || p.Category) === category).length;
                        return (
                          <SelectItem key={category} value={category}>
                            {category} ({count})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                {(searchQuery || selectedCategory !== 'All') && (
                  <div className="mt-4 flex items-center gap-2">
                    <span className="text-sm text-gray-600">Active filters:</span>
                    {searchQuery && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Search: "{searchQuery}"
                        <button 
                          onClick={() => setSearchQuery('')}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    {selectedCategory !== 'All' && (
                      <Badge variant="secondary" className="flex items-center gap-1">
                        Category: {selectedCategory}
                        <button 
                          onClick={() => setSelectedCategory('All')}
                          className="ml-1 hover:bg-gray-300 rounded-full p-0.5"
                        >
                          ×
                        </button>
                      </Badge>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSearchQuery('');
                        setSelectedCategory('All');
                      }}
                      className="h-6 px-2 text-xs"
                    >
                      Clear All
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Product</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Brand</TableHead>
                      <TableHead>Price (GHS)</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8">
                          <div className="flex flex-col items-center gap-2">
                            <Search className="h-8 w-8 text-gray-400" />
                            <p className="text-gray-500">No products found</p>
                            {(searchQuery || selectedCategory !== 'All') && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSearchQuery('');
                                  setSelectedCategory('All');
                                }}
                              >
                                Clear Filters
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredProducts.map((product, index) => (
                        <TableRow key={product.id || index}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border relative">
                                {(product.imageUrl || product.ImageURL) ? (
                                  <img 
                                    src={product.imageUrl || product.ImageURL} 
                                    alt={product.name || product['Product Name']}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = 'none';
                                      const fallback = target.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                                      if (fallback) fallback.style.display = 'flex';
                                    }}
                                    onLoad={(e) => {
                                      const fallback = (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-icon') as HTMLElement;
                                      if (fallback) fallback.style.display = 'none';
                                    }}
                                  />
                                ) : null}
                                <div className={`fallback-icon absolute inset-0 flex items-center justify-center bg-gray-50 ${(product.imageUrl || product.ImageURL) ? 'hidden' : ''}`}>
                                  <Package className="h-8 w-8 text-gray-400" />
                                </div>
                              </div>
                              <div className="flex flex-col">
                                <span className="font-medium text-sm">{product.name || product['Product Name']}</span>
                                <span className="text-xs text-gray-500">
                                  Stock: {product.stockQuantity || 0}
                                </span>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="secondary">{product.category?.name || product.Category}</Badge>
                          </TableCell>
                          <TableCell>{product.brand?.name || product.Brand}</TableCell>
                          <TableCell>
                            <span className="font-semibold">₵{parseFloat(String(product.price || product.Price || 0)).toFixed(2)}</span>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleEditProduct(product)}
                                data-testid={`button-edit-${product.id || index}`}
                                className="h-8 px-2"
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteProduct(product.id, product.name || product['Product Name'] || '')}
                                data-testid={`button-delete-${product.id || index}`}
                                className="h-8 px-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Edit Product Dialog */}
            <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <Edit className="h-5 w-5" />
                    Edit Product
                  </DialogTitle>
                </DialogHeader>
                {editingProduct && (
                  <EditProductForm
                    product={editingProduct}
                    categories={categories}
                    onSave={(updatedProduct) => {
                      handleSaveProduct();
                      setIsEditDialogOpen(false);
                    }}
                    onCancel={() => {
                      setIsEditDialogOpen(false);
                      setEditingProduct(null);
                    }}
                  />
                )}
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="payments" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Payment History</h2>
              <p className="text-gray-600">Track customer payments and transaction details</p>
            </div>

            {/* Payment Search and Filters */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Search & Filter Payments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Input
                    placeholder="Search by email..."
                    value={paymentSearchEmail}
                    onChange={(e) => setPaymentSearchEmail(e.target.value)}
                    data-testid="search-payment-email"
                  />
                  <Input
                    placeholder="Search by reference..."
                    value={paymentSearchRef}
                    onChange={(e) => setPaymentSearchRef(e.target.value)}
                    data-testid="search-payment-reference"
                  />
                  <Select value={paymentStatusFilter} onValueChange={setPaymentStatusFilter}>
                    <SelectTrigger data-testid="filter-payment-status">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    variant="outline"
                    onClick={clearPaymentFilters}
                    data-testid="clear-payment-filters"
                  >
                    Clear Filters
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <DollarSign className="h-4 w-4" />
                    Total Revenue
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">₵{filteredPayments.reduce((sum, p) => sum + p.amount, 0).toFixed(2)}</p>
                  <p className="text-sm text-muted-foreground">From {filteredPayments.length} transactions</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <ShoppingBag className="h-4 w-4" />
                    Total Orders
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{filteredPayments.length}</p>
                  <p className="text-sm text-muted-foreground">Matching filter criteria</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="h-4 w-4" />
                    Success Rate
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {filteredPayments.length > 0 ? 
                      Math.round((filteredPayments.filter(p => p.status === 'success').length / filteredPayments.length) * 100) : 0}%
                  </p>
                  <p className="text-sm text-muted-foreground">Of filtered transactions</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Transaction Records</CardTitle>
                <p className="text-sm text-muted-foreground">
                  Showing {filteredPayments.length} of {paymentHistory.length} total payments
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Customer Email</TableHead>
                      <TableHead>Amount (GHS)</TableHead>
                      <TableHead>Reference</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Transaction Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPayments.length > 0 ? (
                      filteredPayments.map((payment) => (
                        <TableRow key={payment.id}>
                          <TableCell>
                            <div className="font-medium">{payment.email}</div>
                            <div className="text-sm text-muted-foreground">Customer ID: {payment.id}</div>
                          </TableCell>
                          <TableCell>
                            <span className="font-semibold text-lg">₵{payment.amount.toFixed(2)}</span>
                          </TableCell>
                          <TableCell>
                            <code className="text-sm bg-gray-100 px-2 py-1 rounded font-mono">
                              {payment.reference}
                            </code>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant={
                                payment.status === 'success' ? 'default' : 
                                payment.status === 'failed' ? 'destructive' : 'secondary'
                              }
                            >
                              {payment.status.toUpperCase()}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{payment.timestamp}</div>
                            <div className="text-sm text-muted-foreground">
                              {new Date(payment.timestamp).toLocaleDateString()}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                          No payments match your search criteria
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="logs" className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold">Live Activity Logs</h2>
              <p className="text-gray-600">Real-time tracking of product updates, additions, and deletions</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Total Activities
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">{logs.length}</p>
                  <p className="text-sm text-muted-foreground">Actions recorded</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Products Added
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {logs.filter(log => log.action === 'Product Added').length}
                  </p>
                  <p className="text-sm text-muted-foreground">New products</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Products Updated
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold">
                    {logs.filter(log => log.action === 'Product Updated').length}
                  </p>
                  <p className="text-sm text-muted-foreground">Modifications made</p>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Recent Activity Feed
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Live updates of admin actions and system changes
                </p>
              </CardHeader>
              <CardContent className="p-6">
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {logs.map((log, index) => (
                    <div key={log.id} className={`flex items-start gap-4 p-4 rounded-lg border-l-4 ${
                      log.action === 'Product Added' ? 'bg-green-50 border-green-500' :
                      log.action === 'Product Updated' ? 'bg-blue-50 border-blue-500' :
                      log.action === 'Product Deleted' ? 'bg-red-50 border-red-500' :
                      'bg-gray-50 border-gray-500'
                    }`}>
                      <div className={`p-2 rounded-full ${
                        log.action === 'Product Added' ? 'bg-green-100' :
                        log.action === 'Product Updated' ? 'bg-blue-100' :
                        log.action === 'Product Deleted' ? 'bg-red-100' :
                        'bg-gray-100'
                      }`}>
                        {log.action === 'Product Added' ? <Plus className="h-4 w-4 text-green-600" /> :
                         log.action === 'Product Updated' ? <Edit className="h-4 w-4 text-blue-600" /> :
                         log.action === 'Product Deleted' ? <Trash2 className="h-4 w-4 text-red-600" /> :
                         <Activity className="h-4 w-4 text-gray-600" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="font-semibold text-sm">{log.action}</h4>
                          <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded">
                            {log.timestamp}
                          </span>
                        </div>
                        <p className="text-gray-700 text-sm">{log.details}</p>
                        {log.user && (
                          <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                            <User className="h-3 w-3" />
                            by {log.user}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {logs.length === 0 && (
                    <div className="text-center py-12 text-gray-500">
                      <AlertCircle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                      <h3 className="text-lg font-medium mb-2">No Activity Yet</h3>
                      <p className="text-sm">Start managing products to see live activity logs here</p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Edit Product Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Edit className="h-5 w-5" />
              Edit Product
            </DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <EditProductForm
              product={editingProduct}
              categories={categories}
              onSave={(updatedProduct) => {
                handleSaveProduct();
                setIsEditDialogOpen(false);
              }}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setEditingProduct(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Edit Product Form Component
interface EditProductFormProps {
  product: Product;
  categories: string[];
  onSave: (product: Product) => void;
  onCancel: () => void;
}

function EditProductForm({ product, categories, onSave, onCancel }: EditProductFormProps) {
  const [formData, setFormData] = useState({
    name: product.name || product['Product Name'] || '',
    category: product.category?.name || product.Category || '',
    brand: product.brand?.name || product.Brand || '',
    price: (product.price || product.Price || 0).toString(),
    imageUrl: product.imageUrl || product.ImageURL || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const updatedProduct = {
      ...product,
      name: formData.name,
      'Product Name': formData.name,
      Category: formData.category,
      Brand: formData.brand,
      Price: parseFloat(formData.price) || 0,
      price: formData.price,
      ImageURL: formData.imageUrl,
      imageUrl: formData.imageUrl
    };
    onSave(updatedProduct);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setFormData({ ...formData, imageUrl: fakeUrl });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="productName">Product Name</Label>
        <Input
          id="productName"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          data-testid="input-product-name"
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value) => setFormData({ ...formData, category: value })}
        >
          <SelectTrigger data-testid="select-category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="brand">Brand</Label>
        <Input
          id="brand"
          value={formData.brand}
          onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
          data-testid="input-brand"
        />
      </div>

      <div>
        <Label htmlFor="price">Price (GHS)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          data-testid="input-price"
        />
      </div>

      <div>
        <Label htmlFor="imageUrl">Product Image</Label>
        <div className="space-y-2">
          <Input
            id="imageUrl"
            value={formData.imageUrl}
            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
            placeholder="Enter image URL or upload below"
            data-testid="input-image-url"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            data-testid="input-image-file"
          />
        </div>
        {formData.imageUrl && (
          <div className="mt-2">
            <img
              src={formData.imageUrl}
              alt="Product preview"
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button type="submit" data-testid="button-save-product">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button type="button" variant="outline" onClick={onCancel} data-testid="button-cancel-edit">
          Cancel
        </Button>
      </div>
    </form>
  );
}

// Add Product Form Component
interface AddProductFormProps {
  categories: string[];
  onAdd: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}

function AddProductForm({ categories, onAdd, onCancel }: AddProductFormProps) {
  const [newProduct, setNewProduct] = useState<Product>({
    'Product Name': '',
    Category: categories[0] || '',
    Brand: '',
    Price: 0,
    ImageURL: ''
  });

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      setNewProduct({ ...newProduct, ImageURL: fakeUrl });
    }
  };

  const handleAdd = () => {
    if (!newProduct['Product Name']?.trim() || (newProduct.Price || 0) <= 0) {
      alert('Please fill in all required fields');
      return;
    }
    onAdd(newProduct);
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="newProductName">Product Name *</Label>
        <Input
          id="newProductName"
          value={newProduct['Product Name'] || ''}
          onChange={(e) => setNewProduct({ ...newProduct, 'Product Name': e.target.value })}
          placeholder="Enter product name"
          data-testid="input-new-product-name"
        />
      </div>

      <div>
        <Label htmlFor="newCategory">Category</Label>
        <Select
          value={newProduct.Category || ''}
          onValueChange={(value) => setNewProduct({ ...newProduct, Category: value })}
        >
          <SelectTrigger data-testid="select-new-category">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {categories.map((category) => (
              <SelectItem key={category} value={category}>
                {category}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="newBrand">Brand</Label>
        <Input
          id="newBrand"
          value={newProduct.Brand || ''}
          onChange={(e) => setNewProduct({ ...newProduct, Brand: e.target.value })}
          placeholder="Enter brand name"
          data-testid="input-new-brand"
        />
      </div>

      <div>
        <Label htmlFor="newPrice">Price (GHS) *</Label>
        <Input
          id="newPrice"
          type="number"
          step="0.01"
          min="0"
          value={newProduct.Price}
          onChange={(e) => setNewProduct({ ...newProduct, Price: parseFloat(e.target.value) || 0 })}
          placeholder="0.00"
          data-testid="input-new-price"
        />
      </div>

      <div>
        <Label htmlFor="newImageUrl">Product Image</Label>
        <div className="space-y-2">
          <Input
            id="newImageUrl"
            value={newProduct.ImageURL}
            onChange={(e) => setNewProduct({ ...newProduct, ImageURL: e.target.value })}
            placeholder="Enter image URL or upload below"
            data-testid="input-new-image-url"
          />
          <Input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            data-testid="input-new-image-file"
          />
        </div>
        {newProduct.ImageURL && (
          <div className="mt-2">
            <img
              src={newProduct.ImageURL}
              alt="Product preview"
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={handleAdd} data-testid="button-add-new-product">
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
        <Button variant="outline" onClick={onCancel} data-testid="button-cancel-add">
          Cancel
        </Button>
      </div>
    </div>
  );
}