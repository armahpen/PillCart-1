import { useState, useEffect } from "react";
import Header from "@/components/layout/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
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
  Clock
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface AdminUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  isAdmin: boolean;
  adminRole: string;
  adminPermissions: { permission: string }[];
}

interface Product {
  id: string;
  name: string;
  price: number;
  imageUrl?: string;
  description?: string;
  stockQuantity: number;
  isActive: boolean;
  brand?: { name: string };
  category?: { name: string };
}

interface Prescription {
  id: string;
  patientName: string;
  doctorName: string;
  doctorContact: string;
  prescriptionDate: string;
  medications?: string;
  status: string;
  reviewNotes?: string;
  createdAt: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
  reviewer?: {
    firstName: string;
    lastName: string;
  };
}

export default function AdminPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("products");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({});

  // Check admin status
  const { data: adminUser, isLoading: isCheckingAdmin } = useQuery({
    queryKey: ['/api/admin/me'],
    retry: false,
  });

  // Fetch products for admin
  const { data: productsData } = useQuery({
    queryKey: ['/api/admin/products'],
    enabled: !!adminUser,
  });

  // Fetch prescriptions
  const { data: prescriptionsData } = useQuery({
    queryKey: ['/api/admin/prescriptions'],
    enabled: !!adminUser,
  });

  // Update product mutation
  const updateProductMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Product> }) =>
      apiRequest('PUT', `/api/admin/products/${id}`, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      setEditingProduct(null);
      toast({ title: "Product updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update product", variant: "destructive" });
    },
  });

  // Create product mutation
  const createProductMutation = useMutation({
    mutationFn: (product: Partial<Product>) =>
      apiRequest('POST', '/api/admin/products', product),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      setNewProduct({});
      toast({ title: "Product created successfully" });
    },
    onError: () => {
      toast({ title: "Failed to create product", variant: "destructive" });
    },
  });

  // Delete product mutation
  const deleteProductMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/admin/products/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
      toast({ title: "Product deleted successfully" });
    },
    onError: () => {
      toast({ title: "Failed to delete product", variant: "destructive" });
    },
  });

  // Update prescription status mutation
  const updatePrescriptionMutation = useMutation({
    mutationFn: ({ id, status, reviewNotes }: { id: string; status: string; reviewNotes?: string }) =>
      apiRequest('PUT', `/api/admin/prescriptions/${id}/status`, { status, reviewNotes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/admin/prescriptions'] });
      toast({ title: "Prescription status updated" });
    },
    onError: () => {
      toast({ title: "Failed to update prescription", variant: "destructive" });
    },
  });

  // Image upload handlers
  const handleGetUploadParameters = async () => {
    const response = await apiRequest('POST', '/api/admin/objects/upload');
    return {
      method: 'PUT' as const,
      url: response.uploadURL,
    };
  };

  const handleImageUploadComplete = (result: any, productId: string) => {
    if (result.successful && result.successful[0]) {
      const imageURL = result.successful[0].uploadURL;
      // Update product with new image
      apiRequest('PUT', '/api/admin/product-images', { imageURL, productId })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ['/api/admin/products'] });
          toast({ title: "Product image updated successfully" });
        })
        .catch(() => {
          toast({ title: "Failed to update product image", variant: "destructive" });
        });
    }
  };

  if (isCheckingAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Checking Admin Access...</h2>
          </div>
        </div>
      </div>
    );
  }

  if (!adminUser) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-gray-600 mb-4">You need admin permissions to access this page.</p>
            <Button onClick={() => window.location.href = '/'}>Return Home</Button>
          </div>
        </div>
      </div>
    );
  }

  const products = productsData?.products || [];
  const prescriptions = prescriptionsData?.prescriptions || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-neutral mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome, {adminUser.user?.firstName} {adminUser.user?.lastName}</p>
            <Badge variant="secondary" className="mt-2">
              {adminUser.user?.adminRole || 'Admin'}
            </Badge>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Product Management
              </TabsTrigger>
              <TabsTrigger value="prescriptions" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Prescriptions
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">Products</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="flex items-center gap-2">
                      <Plus className="h-4 w-4" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Add New Product</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="productName">Product Name</Label>
                        <Input
                          id="productName"
                          value={newProduct.name || ''}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Enter product name"
                        />
                      </div>
                      <div>
                        <Label htmlFor="productPrice">Price (GHS)</Label>
                        <Input
                          id="productPrice"
                          type="number"
                          step="0.01"
                          value={newProduct.price || ''}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, price: parseFloat(e.target.value) }))}
                          placeholder="0.00"
                        />
                      </div>
                      <div>
                        <Label htmlFor="productDescription">Description</Label>
                        <Textarea
                          id="productDescription"
                          value={newProduct.description || ''}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                          placeholder="Product description"
                        />
                      </div>
                      <div>
                        <Label htmlFor="productStock">Stock Quantity</Label>
                        <Input
                          id="productStock"
                          type="number"
                          value={newProduct.stockQuantity || ''}
                          onChange={(e) => setNewProduct(prev => ({ ...prev, stockQuantity: parseInt(e.target.value) }))}
                          placeholder="0"
                        />
                      </div>
                      <Button 
                        onClick={() => createProductMutation.mutate(newProduct)}
                        disabled={createProductMutation.isPending || !newProduct.name || !newProduct.price}
                        className="w-full"
                      >
                        {createProductMutation.isPending ? 'Creating...' : 'Create Product'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid gap-4">
                {products.map((product: Product) => (
                  <Card key={product.id}>
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex gap-4">
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                            {product.imageUrl ? (
                              <img 
                                src={product.imageUrl} 
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <Package className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-lg">{product.name}</h3>
                            <p className="text-primary font-semibold">GHS {product.price}</p>
                            <p className="text-sm text-gray-600">{product.brand?.name} • Stock: {product.stockQuantity}</p>
                            <Badge variant={product.isActive ? "default" : "secondary"}>
                              {product.isActive ? 'Active' : 'Inactive'}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <ObjectUploader
                            maxNumberOfFiles={1}
                            maxFileSize={5242880} // 5MB
                            onGetUploadParameters={handleGetUploadParameters}
                            onComplete={(result) => handleImageUploadComplete(result, product.id)}
                            buttonClassName="p-2"
                          >
                            <Upload className="h-4 w-4" />
                          </ObjectUploader>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setEditingProduct(product)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => deleteProductMutation.mutate(product.id)}
                          >
                            <Trash2 className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Edit Product Dialog */}
              {editingProduct && (
                <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Edit Product</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="editName">Product Name</Label>
                        <Input
                          id="editName"
                          value={editingProduct.name}
                          onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, name: e.target.value }) : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editPrice">Price (GHS)</Label>
                        <Input
                          id="editPrice"
                          type="number"
                          step="0.01"
                          value={editingProduct.price}
                          onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, price: parseFloat(e.target.value) }) : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editDescription">Description</Label>
                        <Textarea
                          id="editDescription"
                          value={editingProduct.description || ''}
                          onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, description: e.target.value }) : null)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="editStock">Stock Quantity</Label>
                        <Input
                          id="editStock"
                          type="number"
                          value={editingProduct.stockQuantity}
                          onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, stockQuantity: parseInt(e.target.value) }) : null)}
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="editActive"
                          checked={editingProduct.isActive}
                          onChange={(e) => setEditingProduct(prev => prev ? ({ ...prev, isActive: e.target.checked }) : null)}
                        />
                        <Label htmlFor="editActive">Active</Label>
                      </div>
                      <Button 
                        onClick={() => updateProductMutation.mutate({ 
                          id: editingProduct.id, 
                          updates: editingProduct 
                        })}
                        disabled={updateProductMutation.isPending}
                        className="w-full"
                      >
                        <Save className="h-4 w-4 mr-2" />
                        {updateProductMutation.isPending ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              )}
            </TabsContent>

            <TabsContent value="prescriptions" className="space-y-6">
              <h2 className="text-2xl font-semibold">Prescription Management</h2>
              
              <div className="grid gap-4">
                {prescriptions.map((prescription: Prescription) => (
                  <Card key={prescription.id}>
                    <CardHeader className="pb-3">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">
                          {prescription.patientName}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge 
                            variant={
                              prescription.status === 'verified' ? 'default' :
                              prescription.status === 'rejected' ? 'destructive' : 'secondary'
                            }
                            className="flex items-center gap-1"
                          >
                            {prescription.status === 'verified' && <CheckCircle className="h-3 w-3" />}
                            {prescription.status === 'rejected' && <XCircle className="h-3 w-3" />}
                            {prescription.status === 'pending' && <Clock className="h-3 w-3" />}
                            {prescription.status}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500">Doctor</p>
                            <p className="font-medium">{prescription.doctorName}</p>
                            <p className="text-gray-600">{prescription.doctorContact}</p>
                          </div>
                          <div>
                            <p className="text-gray-500">Patient</p>
                            <p className="font-medium">{prescription.user.firstName} {prescription.user.lastName}</p>
                            <p className="text-gray-600">{prescription.user.email}</p>
                          </div>
                        </div>
                        
                        {prescription.medications && (
                          <div>
                            <p className="text-gray-500 text-sm">Medications</p>
                            <p className="text-sm">{prescription.medications}</p>
                          </div>
                        )}

                        {prescription.reviewNotes && (
                          <div>
                            <p className="text-gray-500 text-sm">Review Notes</p>
                            <p className="text-sm">{prescription.reviewNotes}</p>
                          </div>
                        )}

                        <div className="flex gap-2 pt-2">
                          {prescription.status === 'pending' && (
                            <>
                              <Button
                                size="sm"
                                onClick={() => updatePrescriptionMutation.mutate({ 
                                  id: prescription.id, 
                                  status: 'verified',
                                  reviewNotes: 'Prescription verified and approved for medication dispensing.'
                                })}
                                disabled={updatePrescriptionMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Verify
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => updatePrescriptionMutation.mutate({ 
                                  id: prescription.id, 
                                  status: 'rejected',
                                  reviewNotes: 'Prescription rejected due to incomplete or unclear information.'
                                })}
                                disabled={updatePrescriptionMutation.isPending}
                              >
                                <XCircle className="h-4 w-4 mr-1" />
                                Reject
                              </Button>
                            </>
                          )}
                          <Button size="sm" variant="ghost">
                            <Eye className="h-4 w-4 mr-1" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <h2 className="text-2xl font-semibold">Admin Settings</h2>
              
              <Card>
                <CardHeader>
                  <CardTitle>Your Admin Profile</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="font-medium">{adminUser.user?.firstName} {adminUser.user?.lastName}</p>
                      <p className="text-gray-600">{adminUser.user?.email}</p>
                      <Badge className="mt-2">{adminUser.user?.adminRole}</Badge>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-500 mb-2">Permissions:</p>
                      <div className="flex gap-2 flex-wrap">
                        {adminUser.user?.adminPermissions?.map((perm: any) => (
                          <Badge key={perm.permission} variant="outline">
                            {perm.permission}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}