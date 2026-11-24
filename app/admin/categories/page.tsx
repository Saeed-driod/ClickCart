"use client";

import * as React from "react";
import Image from "next/image";
import { Layers, Plus, Trash2, Edit, X } from "lucide-react";
import { SEED_CATEGORIES, SEED_BRANDS } from "@/data/seed-data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

export default function AdminCategoriesBrandsPage() {
  const [categories, setCategories] = React.useState(SEED_CATEGORIES);
  const [brands, setBrands] = React.useState(SEED_BRANDS);

  const [activeTab, setActiveTab] = React.useState<"categories" | "brands">("categories");

  // New Category / Brand modal state
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [image, setImage] = React.useState("");

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setCategories([
      ...categories,
      {
        id: `cat-${Date.now()}`,
        name: name.trim(),
        slug,
        description: description.trim() || "Department collection.",
        image: image.trim() || "https://images.unsplash.com/photo-1498049794561-7780e7231661?w=800&q=80",
      },
    ]);
    toast.success(`Category "${name}" created successfully!`);
    setIsModalOpen(false);
    setName("");
    setDescription("");
    setImage("");
  };

  const handleAddBrand = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    setBrands([
      ...brands,
      {
        id: `brand-${Date.now()}`,
        name: name.trim(),
        slug,
        description: description.trim() || "Official partner brand.",
        logo: image.trim() || "https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200&q=80",
      },
    ]);
    toast.success(`Brand "${name}" added!`);
    setIsModalOpen(false);
    setName("");
    setDescription("");
    setImage("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-foreground">Categories & Brands</h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Organize and classify products across store departments and vendor brands.
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          <span>Add New {activeTab === "categories" ? "Category" : "Brand"}</span>
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border gap-6">
        <button
          onClick={() => setActiveTab("categories")}
          className={`pb-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "categories"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Categories ({categories.length})
        </button>
        <button
          onClick={() => setActiveTab("brands")}
          className={`pb-3 text-xs font-bold border-b-2 transition-all ${
            activeTab === "brands"
              ? "border-indigo-600 text-indigo-600"
              : "border-transparent text-muted-foreground hover:text-foreground"
          }`}
        >
          Brands ({brands.length})
        </button>
      </div>

      {/* Grid List */}
      {activeTab === "categories" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="p-4 rounded-2xl border border-border bg-card space-y-3 hover:shadow-sm transition-all"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                <Image src={cat.image} alt={cat.name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">{cat.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{cat.description}</p>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-muted-foreground">/{cat.slug}</span>
                <button
                  onClick={() => {
                    setCategories(categories.filter((c) => c.id !== cat.id));
                    toast.info(`Category deleted`);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {brands.map((b) => (
            <div
              key={b.id}
              className="p-4 rounded-2xl border border-border bg-card space-y-3 hover:shadow-sm transition-all"
            >
              <div className="relative aspect-video rounded-xl overflow-hidden bg-muted">
                <Image src={b.logo} alt={b.name} fill className="object-cover" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-foreground">{b.name}</h4>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-1">{b.description}</p>
              </div>
              <div className="pt-2 border-t border-border flex items-center justify-between text-xs">
                <span className="font-mono text-[10px] text-muted-foreground">/{b.slug}</span>
                <button
                  onClick={() => {
                    setBrands(brands.filter((item) => item.id !== b.id));
                    toast.info(`Brand deleted`);
                  }}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setIsModalOpen(false)}
          />
          <div className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <h3 className="font-bold text-base text-foreground">
                Add New {activeTab === "categories" ? "Category" : "Brand"}
              </h3>
              <button onClick={() => setIsModalOpen(false)}>
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>

            <form
              onSubmit={activeTab === "categories" ? handleAddCategory : handleAddBrand}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Name *
                </label>
                <Input
                  required
                  placeholder={activeTab === "categories" ? "e.g. Health & Wellness" : "e.g. Huawei"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Image / Logo URL
                </label>
                <Input
                  placeholder="https://images.unsplash.com/..."
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                />
              </div>

              <div>
                <label className="block font-semibold text-muted-foreground mb-1">
                  Description
                </label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-input bg-background"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit">Create</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
