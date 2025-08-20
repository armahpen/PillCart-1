import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/landing";
import Home from "@/pages/home";
import Shop from "@/pages/shop";
import Browse from "@/pages/browse";
import ProductDetail from "@/pages/product-detail";
import Cart from "@/pages/cart";
import { CartPage } from "@/pages/CartPage";
import Checkout from "@/pages/checkout";
import CheckoutReturn from "@/pages/checkout-return";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import Privacy from "@/pages/privacy";
import Prescription from "@/pages/prescription";
import PrescriptionView from "@/pages/prescription-view";
import ChatWidget from "@/components/chat/chat-widget";
import { ShopPage } from "@/pages/ShopPage";
import AdminPage from "@/pages/AdminPage";
import PaymentPage from "@/pages/PaymentPage";
import LoginPage from "@/pages/LoginPage";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/shop-catalog" component={ShopPage} />
          <Route path="/browse" component={Browse} />
          <Route path="/product/:slug" component={ProductDetail} />
          <Route path="/prescription" component={Prescription} />
          <Route path="/prescription-view/:id" component={PrescriptionView} />
          <Route path="/cart" component={CartPage} />
          <Route path="/payment" component={PaymentPage} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/login" component={LoginPage} />
          <Route path="/admin" component={AdminPage} />
        </>
      ) : (
        <>
          <Route path="/" component={Home} />
          <Route path="/shop" component={ShopPage} />
          <Route path="/shop-catalog" component={ShopPage} />
          <Route path="/browse" component={Browse} />
          <Route path="/product/:slug" component={ProductDetail} />
          <Route path="/prescription" component={Prescription} />
          <Route path="/prescription-view/:id" component={PrescriptionView} />
          <Route path="/cart" component={CartPage} />
          <Route path="/payment" component={PaymentPage} />
          <Route path="/checkout" component={Checkout} />
          <Route path="/checkout/return" component={CheckoutReturn} />
          <Route path="/about" component={About} />
          <Route path="/contact" component={Contact} />
          <Route path="/privacy" component={Privacy} />
          <Route path="/login" component={LoginPage} />
          <Route path="/admin" component={AdminPage} />
        </>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
        <ChatWidget />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
