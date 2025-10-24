
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { ThemeProvider } from "@/providers/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Header from "@/components/Header";
import Index from "@/pages/Index";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import History from "@/pages/History";
import Settings from "@/pages/Settings";
import Account from "@/pages/Account";
import Admin from "@/pages/Admin";
import Subscription from "@/pages/Subscription";
import PaymentPage from "@/pages/PaymentPage";
import BasicSuccess from "@/pages/BasicSuccess";
import PremiumSuccess from "@/pages/PremiumSuccess";
import SubscriptionSuccess from "@/pages/SubscriptionSuccess";
import Player from "@/pages/Player";
import Contact from "@/pages/Contact";

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider>
        <LanguageProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/player/:id" element={<Player />} />
                <Route path="/subscription" element={<Subscription />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/basicSuccess" element={<BasicSuccess />} />
                <Route path="/premiumSuccess" element={<PremiumSuccess />} />
                <Route path="/subscription-success" element={<SubscriptionSuccess />} />
                <Route
                  path="/history"
                  element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute>
                      <Account />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/admin"
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <Admin />
                    </ProtectedRoute>
                  }
                />
                <Route path="/contact" element={<Contact />} />
                <Route path="/contact/:phone" element={<Contact />} />
              </Routes>
              <Toaster />
            </div>
          </Router>
        </LanguageProvider>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
