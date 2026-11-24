"use client";

import * as React from "react";
import Image from "next/image";
import {
  Package,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  X,
  Upload,
} from "lucide-react";
import { ProductItem, CategoryItem, BrandItem } from "@/types";
import { formatMoney } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<ProductItem[]>([]);
  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
  const [brands, setBrands] = React.useState<BrandItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<ProductItem | null>(null);

  // Form state
  const [formName, setFormName] = React.useState("");
  const [formPrice, setFormPrice] = React.useState("");
  const [formSalePrice, setFormSalePrice] = React.useState("");
  const [formStock, setFormStock] = React.useState("");
  const [formSku, setFormSku] = React.useState("");
  const [formCategory, setFormCategory] = React.useState("cat-electronics");
  const [formDescription, setFormDescription] = React.useState("");
  const [formImageUrl, setFormImageUrl] = React.useState("");

  // Bulk selection
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/products?limit=250");
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    setEditingProduct(null);
    setFormName("");
    setFormPrice("4500");
    setFormSalePrice("");
    setFormStock("20");
    setFormSku(`CKC-PROD-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormCategory("cat-electronics");
    setFormDescription("Premium high-quality retail product with verified manufacturer warranty.");
    setFormImageUrl("https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormPrice(String(p.price));
    setFormSalePrice(p.salePrice ? String(p.salePrice) : "");
    setFormStock(String(p.stock));
    setFormSku(p.sku);
    setFormCategory(p.categoryId);
    setFormDescription(p.description);
    setFormImageUrl(p.images[0] || "");
    setIsModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) {
      toast.error("Please enter a valid product name and price.");
      return;
    }

    const payload = {
      name: formName.trim(),
      price: Number(formPrice),
      salePrice: formSalePrice ? Number(formSalePrice) : null,
      stock: Number(formStock) || 0,
      sku: formSku.trim(),
      categoryId: formCategory,
      description: formDescription.trim(),
      images: [formImageUrl || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"],
    };

    if (editingProduct) {
      // Update local & call API
      setProducts(
        products.map((p) =>
          p.id === editingProduct.id
            ? { ...p, ...payload }
            : p
        )
      );
      toast.success("Product updated successfully!");
    } else {
      // Create new
      const newProd: ProductItem = {
        id: `prod-${Date.now()}`,
        slug: formName.toLowerCase().replace(/[^a-z0-9]+/g, "-") + `-${Date.now()}`,
        name: formName,
        price: Number(formPrice),
        salePrice: formSalePrice ? Number(formSalePrice) : null,
        stock: Number(formStock) || 0,
        sku: formSku,
        categoryId: formCategory,
        description: formDescription,
        images: [formImageUrl],
        rating: 5.0,
        reviewCount: 1,
        isActive: true,
      };
      setProducts([newProd, ...products]);
      toast.success("New product created successfully!");
    }

    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this product?")) {
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product removed.");
    }
  };

  const handleToggleActive = (id: string) => {
    setProducts(
      products.map((p) => (p.id === id ? { ...p, isActive: !p.isActive } : p))
    );
    toast.info("Product status updated.");
  };

  const handleBulkDelete = () => {
    if (confirm(`Delete ${selectedIds.length} selected products?`)) {
      setProducts(products.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
      toast.success("Selected products deleted.");
    }
  };

  // Filtered view
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "ALL" ||
      p.categoryId === selectedCategory ||
      p.category?.slug === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Products Inventory</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Manage your store's 200+ products, stock levels, pricing and SKUs.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add New Product</span>
        </Button>
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Input
            placeholder="Search by product name or SKU..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 text-xs"
          />
          <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
        </div>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="h-10 px-3 rounded-lg border border-input bg-background text-xs font-medium"
        >
          <option value="ALL">All Categories</option>
          <option value="cat-electronics">Electronics</option>
          <option value="cat-fashion">Fashion</option>
          <option value="cat-home-kitchen">Home & Kitchen</option>
          <option value="cat-beauty">Beauty</option>
          <option value="cat-sports">Sports</option>
          <option value="cat-toys">Toys</option>
          <option value="cat-books">Books</option>
          <option value="cat-groceries">Groceries</option>
        </select>
        {selectedIds.length > 0 && (
          <Button
            variant="destructive"
            size="sm"
            onClick={handleBulkDelete}
            className="text-xs"
          >
            Delete Selected ({selectedIds.length})
          </Button>
        )}
      </div>

      {/* Products Table */}
      <div className="rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 border-b border-border text-muted-foreground font-semibold">
              <tr>
                <th className="p-3 w-8">
                  <input
                    type="checkbox"
                    checked={
                      selectedIds.length > 0 &&
                      selectedIds.length === filteredProducts.length
                    }
                    onChange={(e) =>
                      setSelectedIds(
                        e.target.checked ? filteredProducts.map((p) => p.id) : []
                      )
                    }
                  />
                </th>
                <th className="p-3">Product</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Price (PKR)</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {filteredProducts.map((p) => {
                const isSelected = selectedIds.includes(p.id);

                return (
                  <tr key={p.id} className="hover:bg-muted/30 transition-colors">
                    <td className="p-3">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) =>
                          setSelectedIds(
                            e.target.checked
                              ? [...selectedIds, p.id]
                              : selectedIds.filter((id) => id !== p.id)
                          )
                        }
                      />
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative h-10 w-10 rounded-lg overflow-hidden bg-muted shrink-0 border border-border">
                          <Image
                            src={p.images[0] || "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80"}
                            alt={p.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 max-w-xs">
                          <span className="font-bold text-foreground block truncate">{p.name}</span>
                          <span className="text-[10px] text-muted-foreground">{p.category?.name || "General"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-3 font-mono font-semibold text-muted-foreground">{p.sku}</td>
                    <td className="p-3">
                      <div className="flex items-baseline gap-1.5">
                        <span className="font-bold text-foreground">
                          {formatMoney(p.salePrice || p.price)}
                        </span>
                        {p.salePrice && (
                          <span className="text-[10px] text-muted-foreground line-through">
                            {formatMoney(p.price)}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-3">
                      {p.stock <= 5 ? (
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                          Low: {p.stock}
                        </span>
                      ) : (
                        <span className="font-semibold text-foreground">{p.stock}</span>
                      )}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() => handleToggleActive(p.id)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          p.isActive
                            ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {p.isActive ? "Active" : "Inactive"}
                      </button>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleOpenEdit(p)}
                          className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground"
                          title="Edit Product"
                        >
                          <Edit className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          className="p-1.5 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-md text-muted-foreground hover:text-red-600"
                          title="Delete Product"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Product Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-lg rounded-2xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-foreground">
                {editingProduct ? "Edit Product" : "Add New Product"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <form onSubmit={handleSaveProduct} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Product Title *
                </label>
                <Input
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. Wireless Pro Headset"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    Regular Price (₨) *
                  </label>
                  <Input
                    type="number"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    Sale Price (₨) (Optional)
                  </label>
                  <Input
                    type="number"
                    value={formSalePrice}
                    onChange={(e) => setFormSalePrice(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    Stock Quantity *
                  </label>
                  <Input
                    type="number"
                    required
                    value={formStock}
                    onChange={(e) => setFormStock(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    SKU Code *
                  </label>
                  <Input
                    required
                    value={formSku}
                    onChange={(e) => setFormSku(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Category
                </label>
                <select
                  value={formCategory}
                  onChange={(e) => setFormCategory(e.target.value)}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                >
                  <option value="cat-electronics">Electronics</option>
                  <option value="cat-fashion">Fashion</option>
                  <option value="cat-home-kitchen">Home & Kitchen</option>
                  <option value="cat-beauty">Beauty</option>
                  <option value="cat-sports">Sports</option>
                  <option value="cat-toys">Toys</option>
                  <option value="cat-books">Books</option>
                  <option value="cat-groceries">Groceries</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Product Image URL (Cloudinary / Unsplash)
                </label>
                <Input
                  value={formImageUrl}
                  onChange={(e) => setFormImageUrl(e.target.value)}
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-input bg-background"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingProduct ? "Save Changes" : "Create Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
