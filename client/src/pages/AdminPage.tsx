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
  User
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
  Category: string;
  'Product Name': string;
  Brand: string;
  Price: number;
  ImageURL: string;
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
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [paymentHistory, setPaymentHistory] = useState<PaymentRecord[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentSearchEmail, setPaymentSearchEmail] = useState("");
  const [paymentSearchRef, setPaymentSearchRef] = useState("");
  const [paymentStatusFilter, setPaymentStatusFilter] = useState("all");

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

  // Load products from Excel file
  const loadProducts = async () => {
    try {
      // Use the same API endpoint as the shop to get properly formatted products
      const response = await fetch('/api/products?limit=1000');
      if (!response.ok) throw new Error('Failed to fetch products');
      
      const data = await response.json();
      const products = data.products || [];
      
      console.log('Admin: Loaded products sample:', products.slice(0, 3));
      console.log('Admin: Products with images:', products.filter((p: any) => p.ImageURL).length);
      
      setProducts(products);
      
      // Extract unique categories
      const uniqueCategories = Array.from(new Set(products.map((p: any) => p.Category).filter((c: string) => c && c.trim() !== ''))) as string[];
      setCategories(uniqueCategories);
      
      addLog('Products loaded', `${products.length} products loaded from API`);
    } catch (error) {
      console.error('Error loading products:', error);
      toast({
        title: "Error",
        description: "Failed to load products from API",
        variant: "destructive",
      });
      
      // Fallback to Excel loading if API fails
      try {
        const response = await fetch('/product_catalog.xlsx');
        if (!response.ok) throw new Error('Failed to fetch catalog');
        
        const arrayBuffer = await response.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'buffer' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet) as Product[];
        
        const validProducts = data
          .map((row: any) => ({
            Category: row.Category || row.category || '',
            'Product Name': row['Product Name'] || row.ProductName || row['product name'] || '',
            Brand: row.Brand || row.brand || '',
            Price: parseFloat(row.Price || row.price || row['Price(Ghc)'] || '0') || 0,
            ImageURL: row.ImageURL || row.imageurl || row['Image URL'] || row.DirectLink || row['Direct_Link'] || ''
          }))
          .filter((product: Product) => product['Product Name'].trim() !== '' && product.Price > 0);

        setProducts(validProducts);
        
        // Extract unique categories
        const uniqueCategories = Array.from(new Set(validProducts.map(p => p.Category).filter(c => c.trim() !== '')));
        setCategories(uniqueCategories);
        
        addLog('Products loaded', `${validProducts.length} products loaded from Excel fallback`);
      } catch (fallbackError) {
        console.error('Fallback loading also failed:', fallbackError);
        setProducts([]);
        setCategories([]);
      }
    }
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
        const response = await fetch('/api/auth/user', {
          credentials: 'include'
        });
        
        if (response.ok) {
          const data = await response.json();
          if (data.user && data.user.isAdmin) {
            setCurrentUser(data.user);
            await loadProducts();
            loadPaymentHistory();
          } else {
            setLocation('/login');
          }
        } else {
          setLocation('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        setLocation('/login');
      }
      setLoading(false);
    };
    
    checkAuth();
  }, [setLocation]);

  const saveProductsToFile = async (updatedProducts: Product[]) => {
    try {
      setProducts(updatedProducts);
      toast({
        title: "Products Updated",
        description: "Product catalog has been updated successfully",
      });
      return true;
    } catch (error) {
      console.error('Error saving products:', error);
      toast({
        title: "Error",
        description: "Failed to save product changes",
        variant: "destructive",
      });
      return false;
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct({ ...product });
  };

  const handleSaveProduct = async () => {
    if (!editingProduct) return;
    
    const updatedProducts = products.map(p => 
      p['Product Name'] === editingProduct['Product Name'] ? editingProduct : p
    );
    
    const success = await saveProductsToFile(updatedProducts);
    if (success) {
      setEditingProduct(null);
      addLog('Product Updated', `${editingProduct['Product Name']} was modified`);
    }
  };

  const handleDeleteProduct = async (productName: string) => {
    const updatedProducts = products.filter(p => p['Product Name'] !== productName);
    const success = await saveProductsToFile(updatedProducts);
    if (success) {
      addLog('Product Deleted', `${productName} was removed from catalog`);
    }
  };

  const handleAddProduct = async (newProduct: Product) => {
    const updatedProducts = [...products, newProduct];
    const success = await saveProductsToFile(updatedProducts);
    if (success) {
      setIsAddingProduct(false);
      addLog('Product Added', `${newProduct['Product Name']} was added to catalog`);
    }
  };

  if (loading) {
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
                <p className="text-gray-600">Manage your product inventory</p>
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
                    {products.map((product, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden border relative">
                              {product.ImageURL ? (
                                <img 
                                  src={product.ImageURL} 
                                  alt={product['Product Name']}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    target.style.display = 'none';
                                    const fallback = target.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                                    if (fallback) fallback.style.display = 'flex';
                                    console.log('Image failed to load:', product.ImageURL);
                                  }}
                                  onLoad={(e) => {
                                    const fallback = (e.target as HTMLImageElement).parentElement?.querySelector('.fallback-icon') as HTMLElement;
                                    if (fallback) fallback.style.display = 'none';
                                    console.log('Image loaded successfully:', product.ImageURL);
                                  }}
                                />
                              ) : null}
                              <div className={`fallback-icon absolute inset-0 flex items-center justify-center bg-gray-50 ${product.ImageURL ? 'hidden' : ''}`}>
                                <Package className="h-8 w-8 text-gray-400" />
                              </div>
                            </div>
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{product['Product Name']}</span>
                              <span className="text-xs text-gray-500">
                                {product.ImageURL ? `Image: ${product.ImageURL.substring(0, 30)}...` : 'No image URL'}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{product.Category}</Badge>
                        </TableCell>
                        <TableCell>{product.Brand}</TableCell>
                        <TableCell>
                          <span className="font-semibold">₵{(product.Price || 0).toFixed(2)}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex gap-2 justify-end">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleEditProduct(product)}
                              data-testid={`button-edit-${index}`}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleDeleteProduct(product['Product Name'])}
                              data-testid={`button-delete-${index}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
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
      {editingProduct && (
        <Dialog open={true} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Product</DialogTitle>
            </DialogHeader>
            <EditProductForm
              product={editingProduct}
              categories={categories}
              onChange={setEditingProduct}
              onSave={handleSaveProduct}
              onCancel={() => setEditingProduct(null)}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}

// Edit Product Form Component
interface EditProductFormProps {
  product: Product;
  categories: string[];
  onChange: (product: Product) => void;
  onSave: () => void;
  onCancel: () => void;
}

function EditProductForm({ product, categories, onChange, onSave, onCancel }: EditProductFormProps) {
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fakeUrl = URL.createObjectURL(file);
      onChange({ ...product, ImageURL: fakeUrl });
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <Label htmlFor="productName">Product Name</Label>
        <Input
          id="productName"
          value={product['Product Name']}
          onChange={(e) => onChange({ ...product, 'Product Name': e.target.value })}
          data-testid="input-product-name"
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={product.Category}
          onValueChange={(value) => onChange({ ...product, Category: value })}
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
          value={product.Brand}
          onChange={(e) => onChange({ ...product, Brand: e.target.value })}
          data-testid="input-brand"
        />
      </div>

      <div>
        <Label htmlFor="price">Price (GHS)</Label>
        <Input
          id="price"
          type="number"
          step="0.01"
          value={product.Price}
          onChange={(e) => onChange({ ...product, Price: parseFloat(e.target.value) || 0 })}
          data-testid="input-price"
        />
      </div>

      <div>
        <Label htmlFor="imageUrl">Product Image</Label>
        <div className="space-y-2">
          <Input
            id="imageUrl"
            value={product.ImageURL}
            onChange={(e) => onChange({ ...product, ImageURL: e.target.value })}
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
        {product.ImageURL && (
          <div className="mt-2">
            <img
              src={product.ImageURL}
              alt="Product preview"
              className="w-20 h-20 object-cover rounded-lg"
            />
          </div>
        )}
      </div>

      <div className="flex gap-2 pt-4">
        <Button onClick={onSave} data-testid="button-save-product">
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </Button>
        <Button variant="outline" onClick={onCancel} data-testid="button-cancel-edit">
          Cancel
        </Button>
      </div>
    </div>
  );
}

// Add Product Form Component
interface AddProductFormProps {
  categories: string[];
  onAdd: (product: Product) => void;
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
    if (!newProduct['Product Name'].trim() || newProduct.Price <= 0) {
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
          value={newProduct['Product Name']}
          onChange={(e) => setNewProduct({ ...newProduct, 'Product Name': e.target.value })}
          placeholder="Enter product name"
          data-testid="input-new-product-name"
        />
      </div>

      <div>
        <Label htmlFor="newCategory">Category</Label>
        <Select
          value={newProduct.Category}
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
          value={newProduct.Brand}
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