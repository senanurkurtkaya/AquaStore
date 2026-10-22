import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { brandsApi, categoriesApi } from './api/aquastore.ts'
import { Layout } from './components/Layout.tsx'
import { CustomersPage } from './pages/CustomersPage.tsx'
import { NameDescriptionPage } from './pages/NameDescriptionPage.tsx'
import { OrderCreatePage } from './pages/OrderCreatePage.tsx'
import { OrderDetailPage } from './pages/OrderDetailPage.tsx'
import { OrdersPage } from './pages/OrdersPage.tsx'
import { ProductsPage } from './pages/ProductsPage.tsx'
import { CustomerSelectionProvider } from './selection.tsx'

export default function App() {
  return (
    <BrowserRouter>
      <CustomerSelectionProvider>
        <Layout>
          <Routes>
            <Route path="/" element={<Navigate to="/brands" replace />} />
            <Route path="/brands" element={<NameDescriptionPage title="Markalar" intro="Markaları listeleyin, oluşturun ve düzenleyin." nameLabel="Marka adı" load={brandsApi.list} create={brandsApi.create} update={brandsApi.update} />} />
            <Route path="/categories" element={<NameDescriptionPage title="Kategoriler" intro="Kategorileri listeleyin, oluşturun ve düzenleyin." nameLabel="Kategori adı" load={categoriesApi.list} create={categoriesApi.create} update={categoriesApi.update} />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/customers" element={<CustomersPage />} />
            <Route path="/orders" element={<OrdersPage />} />
            <Route path="/orders/new" element={<OrderCreatePage />} />
            <Route path="/orders/:orderId" element={<OrderDetailPage />} />
          </Routes>
        </Layout>
      </CustomerSelectionProvider>
    </BrowserRouter>
  )
}
