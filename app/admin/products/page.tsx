"use client";

import * as React from "react";
import Image from "next/image";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  X,
  Upload,
  ImagePlus,
  Loader2,
  Link as LinkIcon,
} from "lucide-react";
import { ProductItem, CategoryItem } from "@/types";
import { formatMoney } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminProductsPage() {
  const [products, setProducts] = React.useState<ProductItem[]>([]);
  const [categories, setCategories] = React.useState<CategoryItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState("ALL");
  const [selectedRegionTab, setSelectedRegionTab] = React.useState<"ALL" | "USA" | "UK">("ALL");

  // Modal State
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingProduct, setEditingProduct] = React.useState<ProductItem | null>(null);
  const [isSaving, setIsSaving] = React.useState(false);

  // Form state
  const [formName, setFormName] = React.useState("");
  const [formPrice, setFormPrice] = React.useState("");
  const [formSalePrice, setFormSalePrice] = React.useState("");
  const [formStock, setFormStock] = React.useState("");
  const [formSku, setFormSku] = React.useState("");
  const [formCategory, setFormCategory] = React.useState("");
  const [formRegion, setFormRegion] = React.useState<"USA" | "UK">("USA");
  const [formDescription, setFormDescription] = React.useState("");
  const [formImages, setFormImages] = React.useState<string[]>([]);
  const [urlInput, setUrlInput] = React.useState("");
  const [isUploadingImages, setIsUploadingImages] = React.useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Bulk selection
  const [selectedIds, setSelectedIds] = React.useState<string[]>([]);

  React.useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch("/api/products?limit=250"),
        fetch("/api/categories"),
      ]);
      if (prodRes.ok) {
        const data = await prodRes.json();
        setProducts(data.products || []);
      }
      if (catRes.ok) {
        const cats = await catRes.json();
        setCategories(cats || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenAdd = () => {
    const defaultRegion = selectedRegionTab === "UK" ? "UK" : "USA";
    setEditingProduct(null);
    setFormName("");
    setFormPrice("49.99");
    setFormSalePrice("");
    setFormStock("20");
    setFormSku(`${defaultRegion}-PROD-${Math.floor(1000 + Math.random() * 9000)}`);
    setFormCategory(categories[0]?.id || "");
    setFormRegion(defaultRegion);
    setFormDescription("Premium high-quality retail product with verified manufacturer warranty.");
    setFormImages([]);
    setUrlInput("");
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p: ProductItem) => {
    setEditingProduct(p);
    setFormName(p.name);
    setFormPrice(String(p.price));
    setFormSalePrice(p.salePrice ? String(p.salePrice) : "");
    setFormStock(String(p.stock));
    setFormSku(p.sku);
    setFormCategory(p.categoryId || categories[0]?.id || "");
    setFormRegion((p.region === "UK" ? "UK" : "USA"));
    setFormDescription(p.description);
    setFormImages(p.images || []);
    setUrlInput("");
    setIsModalOpen(true);
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploadingImages(true);

    try {
      const uploadedUrls: string[] = [];
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });
        const data = await res.json();

        if (!res.ok) {
          toast.error(data.error || `Failed to upload ${file.name}`);
          continue;
        }
        if (data.url) {
          uploadedUrls.push(data.url);
        }
      }

      if (uploadedUrls.length > 0) {
        setFormImages((prev) => [...prev, ...uploadedUrls]);
        toast.success(`${uploadedUrls.length} image(s) uploaded!`);
      }
    } catch (err) {
      toast.error("Error uploading image(s).");
    } finally {
      setIsUploadingImages(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleAddImageUrl = () => {
    const trimmed = urlInput.trim();
    if (!trimmed) return;
    setFormImages((prev) => [...prev, trimmed]);
    setUrlInput("");
  };

  const handleRemoveImage = (index: number) => {
    setFormImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formPrice) {
      toast.error("Please enter a valid product name and price.");
      return;
    }

    const imagesToSave =
      formImages.length > 0
        ? formImages
        : ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"];

    const payload = {
      name: formName.trim(),
      price: Number(formPrice),
      salePrice: formSalePrice ? Number(formSalePrice) : null,
      stock: Number(formStock) || 0,
      sku: formSku.trim(),
      categoryId: formCategory || categories[0]?.id || "cat-electronics",
      region: formRegion,
      description: formDescription.trim(),
      images: imagesToSave,
    };

    setIsSaving(true);
    try {
      if (editingProduct) {
        const res = await fetch(`/api/products/${editingProduct.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const updated = await res.json();
        setProducts(
          products.map((p) => (p.id === editingProduct.id ? { ...p, ...updated } : p))
        );
        toast.success("Product updated successfully!");
      } else {
        const res = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const created = await res.json();
        if (!res.ok) {
          toast.error(created.error || "Failed to create product");
          setIsSaving(false);
          return;
        }
        setProducts([created, ...products]);
        toast.success("New product uploaded successfully!");
      }
      setIsModalOpen(false);
    } catch (err) {
      toast.error("Failed to save product.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await fetch(`/api/products/${id}`, { method: "DELETE" });
      setProducts(products.filter((p) => p.id !== id));
      toast.success("Product removed.");
    } catch {
      toast.error("Failed to delete product.");
    }
  };

  const handleToggleActive = async (id: string) => {
    const target = products.find((p) => p.id === id);
    if (!target) return;
    const nextActive = !target.isActive;
    try {
      await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: nextActive }),
      });
      setProducts(
        products.map((p) => (p.id === id ? { ...p, isActive: nextActive } : p))
      );
      toast.info("Product status updated.");
    } catch {
      toast.error("Failed to update status.");
    }
  };

  const handleBulkDelete = async () => {
    if (!confirm(`Delete ${selectedIds.length} selected products?`)) return;
    try {
      await Promise.all(
        selectedIds.map((id) => fetch(`/api/products/${id}`, { method: "DELETE" }))
      );
      setProducts(products.filter((p) => !selectedIds.includes(p.id)));
      setSelectedIds([]);
      toast.success("Selected products deleted.");
    } catch {
      toast.error("Bulk delete failed.");
    }
  };

  // Filtered view
  const usaCount = products.filter((p) => p.region !== "UK").length;
  const ukCount = products.filter((p) => p.region === "UK").length;

  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchesCat =
      selectedCategory === "ALL" ||
      p.categoryId === selectedCategory ||
      p.category?.slug === selectedCategory;
    const matchesRegion =
      selectedRegionTab === "ALL" ||
      (selectedRegionTab === "UK" ? p.region === "UK" : p.region !== "UK");
    return matchesSearch && matchesCat && matchesRegion;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Products Inventory</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Upload new products with images, manage stock, pricing, and separate USA / UK catalogs.
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add New {selectedRegionTab === "UK" ? "UK" : selectedRegionTab === "USA" ? "USA" : ""} Product</span>
        </Button>
      </div>

      {/* Region Tabs: All | USA | UK */}
      <div className="flex flex-wrap gap-2 border-b border-border pb-3">
        <button
          onClick={() => setSelectedRegionTab("ALL")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedRegionTab === "ALL"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          All Regions ({products.length})
        </button>
        <button
          onClick={() => setSelectedRegionTab("USA")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedRegionTab === "USA"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          🇺🇸 USA Products ({usaCount})
        </button>
        <button
          onClick={() => setSelectedRegionTab("UK")}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            selectedRegionTab === "UK"
              ? "bg-indigo-600 text-white shadow-sm"
              : "bg-card border border-border text-muted-foreground hover:text-foreground"
          }`}
        >
          🇬🇧 UK Products ({ukCount})
        </button>
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
          {categories.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
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
                <th className="p-3">Region</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Price</th>
                <th className="p-3">Stock</th>
                <th className="p-3">Status</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {loading ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-muted-foreground">
                    Loading products...
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isSelected = selectedIds.includes(p.id);
                  const imgSrc =
                    p.images[0] ||
                    "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&q=80";

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
                              src={imgSrc}
                              alt={p.name}
                              fill
                              unoptimized={imgSrc.startsWith("data:")}
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 max-w-xs">
                            <span className="font-bold text-foreground block truncate">{p.name}</span>
                            <span className="text-[10px] text-muted-foreground">
                              {p.category?.name || "General"}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 font-semibold">
                        {p.region === "UK" ? "🇬🇧 UK" : "🇺🇸 USA"}
                      </td>
                      <td className="p-3 font-mono font-semibold text-muted-foreground">{p.sku}</td>
                      <td className="p-3">
                        <div className="flex items-baseline gap-1.5">
                          <span className="font-bold text-foreground">
                            {formatMoney(p.salePrice || p.price, p.region === "UK" ? "GBP" : "USD")}
                          </span>
                          {p.salePrice && (
                            <span className="text-[10px] text-muted-foreground line-through">
                              {formatMoney(p.price, p.region === "UK" ? "GBP" : "USD")}
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
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${p.isActive
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
                })
              )}
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
          <div className="relative w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-foreground">
                {editingProduct ? "Edit Product" : "Upload New Product"}
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

              {/* Image Upload Section */}
              <div className="space-y-2.5 p-4 rounded-xl border border-dashed border-indigo-300 dark:border-indigo-800 bg-indigo-50/30 dark:bg-indigo-950/20">
                <div className="flex items-center justify-between">
                  <label className="font-bold text-foreground flex items-center gap-1.5">
                    <ImagePlus className="h-4 w-4 text-indigo-600" />
                    <span>Product Images</span>
                  </label>
                  <span className="text-[11px] text-muted-foreground">
                    JPG, PNG, WEBP (Max 4 MB each)
                  </span>
                </div>

                {/* Click / Drop Upload Trigger */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                />

                <button
                  type="button"
                  disabled={isUploadingImages}
                  onClick={() => fileInputRef.current?.click()}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => {
                    e.preventDefault();
                    handleFileUpload(e.dataTransfer.files);
                  }}
                  className="w-full py-5 px-4 rounded-xl border-2 border-dashed border-border bg-background hover:border-indigo-500 hover:bg-indigo-50/40 dark:hover:bg-indigo-950/30 transition-all flex flex-col items-center justify-center gap-1.5 cursor-pointer"
                >
                  {isUploadingImages ? (
                    <>
                      <Loader2 className="h-6 w-6 text-indigo-600 animate-spin" />
                      <span className="font-semibold text-indigo-600">Uploading image(s)...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="h-6 w-6 text-indigo-600" />
                      <span className="font-bold text-foreground">
                        Click to upload image(s) or drag & drop
                      </span>
                      <span className="text-[11px] text-muted-foreground">
                        Select one or multiple photos from your device
                      </span>
                    </>
                  )}
                </button>

                {/* Preview Uploaded Thumbnails */}
                {formImages.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1">
                    {formImages.map((img, idx) => (
                      <div
                        key={idx}
                        className="relative aspect-square rounded-lg overflow-hidden border border-border bg-muted group"
                      >
                        <Image
                          src={img}
                          alt={`Product preview ${idx + 1}`}
                          fill
                          unoptimized={img.startsWith("data:")}
                          className="object-cover"
                        />
                        {idx === 0 && (
                          <span className="absolute bottom-1 left-1 px-1.5 py-0.5 rounded bg-indigo-600 text-[9px] font-bold text-white">
                            Main
                          </span>
                        )}
                        <button
                          type="button"
                          onClick={() => handleRemoveImage(idx)}
                          className="absolute top-1 right-1 h-5 w-5 rounded-full bg-red-600 text-white flex items-center justify-center opacity-90 hover:opacity-100 shadow"
                          title="Remove image"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                {/* Optional Paste Image URL */}
                <div className="flex gap-2 pt-1">
                  <div className="relative flex-1">
                    <Input
                      value={urlInput}
                      onChange={(e) => setUrlInput(e.target.value)}
                      placeholder="Or paste an image URL (https://...)"
                      className="pl-8 h-8 text-xs"
                    />
                    <LinkIcon className="absolute left-2.5 top-2 h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={handleAddImageUrl}
                    className="h-8 text-xs"
                  >
                    Add URL
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    Region *
                  </label>
                  <select
                    value={formRegion}
                    onChange={(e) => setFormRegion(e.target.value as "USA" | "UK")}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                  >
                    <option value="USA">🇺🇸 United States (USA)</option>
                    <option value="UK">🇬🇧 United Kingdom (UK)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    Category *
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-input bg-background"
                  >
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-semibold text-muted-foreground mb-1">
                    Base Price *
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
                    Sale Price (Optional)
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
                  Description *
                </label>
                <textarea
                  rows={3}
                  required
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
                <Button type="submit" isLoading={isSaving || isUploadingImages}>
                  {editingProduct ? "Save Changes" : "Upload Product"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
