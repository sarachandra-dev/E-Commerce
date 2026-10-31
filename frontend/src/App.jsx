import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ProtectedRoute from './components/ProtectedRoute'

import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetails from './pages/ProductDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import MyOrders from './pages/MyOrders'
import AdminDashboard from './pages/admin/AdminDashboard'
import ManageProducts from './pages/admin/ManageProducts'
import ManageOrders from './pages/admin/ManageOrders'

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetails />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/cart" element={
                <ProtectedRoute><Cart /></ProtectedRoute>
              } />
              <Route path="/checkout" element={
                <ProtectedRoute><Checkout /></ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute><MyOrders /></ProtectedRoute>
              } />

              <Route path="/admin" element={
                <ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>
              } />
              <Route path="/admin/products" element={
                <ProtectedRoute adminOnly><ManageProducts /></ProtectedRoute>
              } />
              <Route path="/admin/orders" element={
                <ProtectedRoute adminOnly><ManageOrders /></ProtectedRoute>
              } />
            </Routes>
          </main>
          <Footer />
        </div>
        <Toaster position="top-right" />
      </BrowserRouter>
    </AuthProvider>
  )
}
