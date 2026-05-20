import { useState } from 'react';
import { useMyStores } from '@/hooks/useStore';
import {
  useProducts,
  useCreateProduct,
  useUpdateProduct,
  useDeleteProduct,
} from '@/hooks/useProducts';
import ProductCard from '@/components/products/ProductCard';
import ProductForm from '@/components/products/ProductForm';
import Modal from '@/components/ui/Modal';
import ConfirmDialog from '@/components/ui/ConfirmDialog';

export default function Dashboard() {
  const [modal, setModal] = useState({ open: false, product: null });
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: storeData, isLoading: storeLoading, isError: storeError } = useMyStores();
  const store = storeData?.stores?.[0] ?? null;

  const { data, isLoading: productsLoading } = useProducts(
    store ? { store: store._id } : null
  );
  const products = data?.products ?? [];

  const { mutate: createProduct, isPending: creating } = useCreateProduct();
  const { mutate: updateProduct, isPending: updating } = useUpdateProduct();
  const { mutate: deleteProduct, isPending: deleting } = useDeleteProduct();

  const openCreate = () => setModal({ open: true, product: null });
  const openEdit = (product) => setModal({ open: true, product });
  const closeModal = () => setModal({ open: false, product: null });

  const handleSubmit = (formData) => {
    if (modal.product) {
      updateProduct(
        { id: modal.product._id, data: formData },
        { onSuccess: closeModal }
      );
    } else {
      createProduct(
        { ...formData, store: store._id },
        { onSuccess: closeModal }
      );
    }
  };

  const handleConfirmDelete = () => {
    deleteProduct(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) });
  };

  if (storeLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-slate-400">
        Loading…
      </div>
    );
  }

  if (storeError || !store) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3 text-slate-400">
        <span className="text-4xl">🏪</span>
        <p>No store found. Please create a store first.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header row */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-white">{store.name}</h1>
          <p className="text-slate-400 text-sm mt-0.5">
            {productsLoading ? '…' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
          </p>
        </div>
        <button
          onClick={openCreate}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold rounded-lg transition-colors flex items-center gap-2 shrink-0"
        >
          <span className="text-lg leading-none">+</span>
          <span>Add Product</span>
        </button>
      </div>

      {/* Product grid */}
      {productsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="bg-slate-800 rounded-xl h-64 animate-pulse border border-slate-700" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 text-slate-500">
          <span className="text-5xl">📦</span>
          <p>No products yet. Add your first product!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onEdit={openEdit}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Create / Edit modal */}
      <Modal
        open={modal.open}
        onClose={closeModal}
        title={modal.product ? 'Edit Product' : 'Add Product'}
        size="lg"
      >
        <ProductForm
          initial={modal.product}
          onSubmit={handleSubmit}
          loading={creating || updating}
        />
      </Modal>

      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleConfirmDelete}
        title="Deactivate Product"
        message={`Deactivate "${deleteTarget?.name}"? The product will be hidden from your store but its history is preserved.`}
        confirmLabel="Deactivate"
        loading={deleting}
      />
    </div>
  );
}
