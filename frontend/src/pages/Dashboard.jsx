import React, { useState } from 'react';
import { useMyStores } from '@/hooks/useStore';

const SKELETON_KEYS = Array.from({ length: 8 }, (_, i) => `skeleton-${i}`);
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
import { Skeleton } from '@/components/ui/Skeleton';

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const [editTarget, setEditTarget] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);

  const { data: storeData, isLoading: storeLoading, isError: storeError } = useMyStores();
  const store = storeData?.stores?.[0] ?? null;

  const { data: productsData, isLoading: productsLoading } = useProducts(
    store ? { store: store._id } : null,
  );
  const products = productsData?.products ?? [];

  const { mutate: createProduct, isPending: creating } = useCreateProduct();
  const { mutate: updateProduct, isPending: updating } = useUpdateProduct();
  const { mutate: deleteProduct } = useDeleteProduct();

  const openCreate = () => {
    setEditTarget(null);
    setModalOpen(true);
  };

  const openEdit = (product) => {
    setEditTarget(product);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditTarget(null);
  };

  const handleSubmit = (data) => {
    if (editTarget) {
      updateProduct({ id: editTarget._id, ...data }, { onSuccess: closeModal });
    } else {
      createProduct({ store: store._id, ...data }, { onSuccess: closeModal });
    }
  };

  const handleDelete = (product) => {
    setDeleteTarget(product);
  };

  const confirmDelete = () => {
    deleteProduct(deleteTarget._id, { onSuccess: () => setDeleteTarget(null) });
  };

  if (storeLoading) {
    return <div>Loading…</div>;
  }

  if (storeError || !storeData?.stores?.length) {
    return <div>No store found. Please create a store first.</div>;
  }

  const count = products.length;
  const productWord = count === 1 ? 'product' : 'products';
  const countLabel = productsLoading ? '…' : `${count} ${productWord}`;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between border-b border-gray-200 pb-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{store.name}</h1>
          <p className="text-gray-500 mt-1">{countLabel}</p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium px-4 py-2 rounded-lg"
        >
          Add Product
        </button>
      </div>

      {productsLoading && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {SKELETON_KEYS.map((key) => (
            <Skeleton key={key} className="h-40 rounded-xl" />
          ))}
        </div>
      )}
      {!productsLoading && products.length === 0 && (
        <p className="text-gray-500">No products yet. Add your first product!</p>
      )}
      {!productsLoading && products.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <ProductCard
              key={p._id}
              product={p}
              onEdit={openEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <Modal open={modalOpen} onClose={closeModal}>
        <ProductForm
          initial={editTarget}
          onSubmit={handleSubmit}
          loading={creating || updating}
        />
      </Modal>

      <ConfirmDialog
        open={!!deleteTarget}
        title="Hapus Produk"
        description={`Yakin ingin menghapus "${deleteTarget?.name}"?`}
        onConfirm={confirmDelete}
        onClose={() => setDeleteTarget(null)}
      />
    </div>
  );
}
