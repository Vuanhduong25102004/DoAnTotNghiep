import { Routes, Route } from "react-router-dom";
import MainLayout from "../components/MainLayout";
import AdminRoute from "./AdminRoute";
import ProtectedRoute from "./ProtectedRoute";

// Pages
import HomePage from "../pages/HomePage";
import ServicesPage from "../pages/ServicesPage";
import AboutUsPage from "../pages/AboutUsPage";
import BlogPage from "../pages/BlogPage";
import ContactPage from "../pages/ContactPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ProductsPage from "../pages/ProductsPage";

//admin pages
import AdminDashboard from "../pages/admin/AdminDashboard";
import AdminOrders from "../pages/admin/AdminOrders";
import AdminLayout from "../pages/admin/components/AdminLayout";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminPets from "../pages/admin/AdminPets";
import AdminProducts from "../pages/admin/AdminProducts";
import AdminEmployees from "../pages/admin/AdminEmployees";
import AdminServices from "../pages/admin/AdminServices";
import AdminCategories from "../pages/admin/AdminCategories";
import AdminAppointments from "../pages/admin/AdminAppointments";
import AdminImports from "../pages/admin/AdminImports";
import AdminSuppliers from "../pages/admin/AdminSuppliers";
import AdminPromotions from "../pages/admin/AdminPromotions";
import AdminVaccinations from "../pages/admin/AdminVaccinations";
import AdminReviews from "../pages/admin/AdminReviews";
import AdminPosts from "../pages/admin/AdminPosts";

//user pages
import UserProfile from "../pages/user/UserProfile";

const AppRoutes = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/aboutus" element={<AboutUsPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/products" element={<ProductsPage />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/profile" element={<UserProfile />} />
          {/* Sau này thêm các trang user khác vào đây */}
          {/* <Route path="/my-pets" element={<MyPetsPage />} /> */}
          {/* <Route path="/change-password" element={<ChangePasswordPage />} /> */}
        </Route>
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Admin Routes */}
      <Route element={<AdminRoute />}>
        <Route path="/admin" element={<AdminLayout />}>
          {/* Khi vào /admin, mặc định hiện Dashboard */}
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />

          {/* Các trang quản lý khác */}
          <Route path="users" element={<AdminUsers />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="pets" element={<AdminPets />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="employees" element={<AdminEmployees />} />
          <Route path="appointments" element={<AdminAppointments />} />
          <Route path="services" element={<AdminServices />} />
          <Route path="categories" element={<AdminCategories />} />
          <Route path="imports" element={<AdminImports />} />
          <Route path="suppliers" element={<AdminSuppliers />} />
          <Route path="promotions" element={<AdminPromotions />} />
          <Route path="vaccinations" element={<AdminVaccinations />} />
          <Route path="reviews" element={<AdminReviews />} />
          <Route path="posts" element={<AdminPosts />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default AppRoutes;
