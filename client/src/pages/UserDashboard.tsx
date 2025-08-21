import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/layout/header";
import { 
  User, 
  ShoppingCart, 
  FileText, 
  Clock, 
  Package,
  Heart,
  Settings,
  Bell
} from "lucide-react";

export default function UserDashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, setLocation] = useLocation();
  const [recentOrders, setRecentOrders] = useState([]);
  const [recentPrescriptions, setRecentPrescriptions] = useState([]);

  useEffect(() => {
    if (!isAuthenticated) {
      setLocation('/login');
      return;
    }

    // Load user data
    loadUserData();
  }, [isAuthenticated, setLocation]);

  const loadUserData = async () => {
    try {
      // Load recent orders
      const ordersResponse = await fetch('/api/orders', {
        credentials: 'include'
      });
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        setRecentOrders(ordersData.slice(0, 3)); // Show last 3 orders
      }

      // Load recent prescriptions
      const prescriptionsResponse = await fetch('/api/prescriptions/history', {
        credentials: 'include'
      });
      if (prescriptionsResponse.ok) {
        const prescriptionsData = await prescriptionsResponse.json();
        setRecentPrescriptions(prescriptionsData.slice(0, 3)); // Show last 3 prescriptions
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  const getUserDisplayName = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName} ${user.lastName}`;
    }
    return user?.username || user?.email || 'User';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {getUserDisplayName()}!
          </h1>
          <p className="text-gray-600">
            Manage your health journey with Smile Pills Ltd
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <ShoppingCart className="h-8 w-8 text-primary" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{recentOrders.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <FileText className="h-8 w-8 text-green-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Prescriptions</p>
                  <p className="text-2xl font-bold text-gray-900">{recentPrescriptions.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Heart className="h-8 w-8 text-red-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Saved Items</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center">
                <Package className="h-8 w-8 text-blue-600" />
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Orders</p>
                  <p className="text-2xl font-bold text-gray-900">0</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShoppingCart className="h-5 w-5" />
                Recent Orders
              </CardTitle>
              <CardDescription>
                Your latest medication orders
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentOrders.length > 0 ? (
                <div className="space-y-4">
                  {recentOrders.map((order: any, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Order #{order.id || index + 1}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(order.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {order.status || 'Processing'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No orders yet</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setLocation('/shop')}
                  >
                    Start Shopping
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Prescriptions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Recent Prescriptions
              </CardTitle>
              <CardDescription>
                Your uploaded prescription history
              </CardDescription>
            </CardHeader>
            <CardContent>
              {recentPrescriptions.length > 0 ? (
                <div className="space-y-4">
                  {recentPrescriptions.map((prescription: any, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">Prescription #{prescription.id || index + 1}</p>
                        <p className="text-sm text-gray-600">
                          {new Date(prescription.createdAt || Date.now()).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline">
                        {prescription.status || 'Pending'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No prescriptions uploaded</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setLocation('/prescription')}
                  >
                    Upload Prescription
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks to help manage your health
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => setLocation('/shop')}
              >
                <ShoppingCart className="h-6 w-6 mb-2" />
                Shop Medications
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => setLocation('/prescription')}
              >
                <FileText className="h-6 w-6 mb-2" />
                Upload Prescription
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => setLocation('/cart')}
              >
                <Package className="h-6 w-6 mb-2" />
                View Cart
              </Button>
              
              <Button
                variant="outline"
                className="h-20 flex-col"
                onClick={() => setLocation('/contact')}
              >
                <Bell className="h-6 w-6 mb-2" />
                Contact Support
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}