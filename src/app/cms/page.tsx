"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import {
  BarChart3,
  Check,
  FileText,
  Package,
  PanelTop,
  Pencil,
  Plus,
  Settings2,
  Tags,
  Trash2,
  Upload,
  UploadCloud,
} from "lucide-react";
import CmsEditorShell from "@/components/storefront/cms/CmsEditorShell";
import Footer from "@/components/shared/Footer";
import Header from "@/components/shared/Header";
import CmsSidebar from "@/components/storefront/cms/CmsSidebar";
import OrderReporting from "@/components/storefront/cms/OrderReporting";
import DynamicListing, { type ListingConfig } from "@/components/listing/DynamicListing";
import ConfirmationDialog from "@/components/notifications/ConfirmationDialog";
import CmsEntityDialog from "@/components/storefront/cms/CmsEntityDialog";
import RolesEditor from "@/components/storefront/cms/RolesEditor";
import { siteConfig } from "@/lib/site-config";
import { cmsRolePermissions, cmsSectionPermissions, cmsNavigation, type CmsRole, type CmsSection } from "@/components/storefront/cms/cms-config";

const sampleProducts = [
  { name: "Noir Mystique", category: "Men", price: "120.00 KWD", status: "Published", image: "/images/Perfume/1.webp" },
  { name: "Velvet Bloom", category: "Women", price: "135.00 KWD", status: "Published", image: "/images/Perfume/2.webp" },
  { name: "Amber Dusk", category: "Unisex", price: "110.00 KWD", status: "Draft", image: "/images/Perfume/9.webp" },
  { name: "Cedar Amber", category: "Men", price: "110.00 KWD", status: "Published", image: "/images/Perfume/31.webp" },
];
const productCategoryOptions = ["Men", "Women", "Unisex"];

export default function CmsPage() {
  const [active, setActive] = useState<CmsSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role] = useState<CmsRole>("admin");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    if (window.matchMedia("(max-width: 639px)").matches) {
      setSidebarOpen(false);
    }
    const sectionFromUrl = new URLSearchParams(window.location.search).get("section");
    if (sectionFromUrl && cmsNavigation.some((item) => item.id === sectionFromUrl)) {
      setActive(sectionFromUrl as CmsSection);
    }
  }, []);

  function save(section: string) {
    setNotice(`${section} changes are ready to publish through the CMS API.`);
    window.setTimeout(() => setNotice(""), 3500);
  }

  return (
  <main className="cms-app-shell h-[100dvh] overflow-hidden bg-[#f7f0e2] text-textPrimary">
    <div className="cms-app-layout flex h-full min-w-0">
      <CmsSidebar
        open={sidebarOpen}
        role={role}
        activeSection={active}
        onToggle={() => setSidebarOpen((open) => !open)}
        onSelect={setActive}
      />

      <section className="cms-app-content flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <Header
          variant="cms"
          sidebarOpen={sidebarOpen}
          onToggleSidebar={() =>
            setSidebarOpen((open) => !open)
          }
          onOpenSidebar={() => setSidebarOpen(true)}
        />

        {notice ? (
          <div className="mx-5 mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 sm:mx-8 lg:mx-12">
            <Check className="h-4 w-4" />
            {notice}
          </div>
        ) : null}

        <div
          className={
            active === "orders"
              ? "cms-orders-content min-h-0 flex-1 overflow-hidden p-3 sm:p-4"
              : "min-h-0 flex-1 overflow-y-auto px-4 py-6 sm:px-8 sm:py-8 lg:px-12 lg:py-10"
          }
        >
          {active === "overview" ? (
            <Overview onSelect={setActive} />
          ) : null}

          {active === "homepage" ? (
            <HomepageEditor
              onSave={() => save("Homepage")}
              onPublish={() => save("Homepage publish")}
            />
          ) : null}

          {active === "products" ? (
            <ProductsEditor
              onSave={() => save("Product")}
              onPublish={() => save("Product publish")}
            />
          ) : null}

          {active === "categories" ? (
            <CategoriesEditor
              onSave={() => save("Category")}
              onPublish={() => save("Category publish")}
            />
          ) : null}

          {active === "collections" ? (
            <CollectionsEditor
              onSave={() => save("Collection")}
              onPublish={() => save("Collection publish")}
            />
          ) : null}

          {active === "orders" ? (
            <OrderReporting />
          ) : null}

          {active === "menu" ? (
            <MenuEditor
              onSave={() => save("Menu")}
              onPublish={() => save("Menu publish")}
            />
          ) : null}

          {active === "media" ? (
            <MediaEditor />
          ) : null}

          {active === "settings" ? (
            <SiteSettingsEditor
              onSave={() => save("Site settings")}
              onPublish={() => save("Site settings publish")}
            />
          ) : null}

          {active === "roles" ? (
            <RolesEditor />
          ) : null}

          {active === "permissions" ? (
            <PermissionsEditor />
          ) : null}
        </div>
      </section>
    </div>
  </main>
);
}

function Overview({ onSelect }: { onSelect: (section: CmsSection) => void }) {
  return (
    <div className="mx-auto max-w-6xl">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Stat label="Products" value="36" icon={Package} />
        <Stat label="Collections" value="5" icon={Tags} />
        <Stat label="Homepage blocks" value="8" icon={PanelTop} />
        <Stat label="Publishing" value="Ready" icon={BarChart3} />
      </div>
      <div className="mt-8 grid gap-5 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-card sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-textSecondary">Content controls</p>
          <h3 className="mt-2 font-heading text-3xl font-semibold">Shape the storefront</h3>
          <p className="mt-3 text-sm leading-6 text-textSecondary">Every visible content area has a home here. Edit, preview, and publish without rebuilding the frontend.</p>
          <div className="mt-7 grid gap-3 sm:grid-cols-2">
            {[
              ["Homepage", "Hero, promo banner, categories and sections.", "homepage", SparkIcon],
              ["Products", "Catalog, pricing, notes, images and SEO.", "products", Package],
              ["Collections", "Curated groups and collection imagery.", "collections", Tags],
              ["Site settings", "Footer, contact, social links and metadata.", "settings", Settings2],
            ].map(([label, description, section, Icon]) => (
              <button key={label as string} type="button" onClick={() => onSelect(section as CmsSection)} className="group rounded-xl border border-black/10 p-4 text-left hover:-translate-y-0.5 hover:border-accent hover:shadow-card">
                <Icon className="h-5 w-5 text-accent" />
                <h4 className="mt-4 font-semibold">{label as string}</h4>
                <p className="mt-1 text-xs leading-5 text-textSecondary">{description as string}</p>
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-2xl bg-[#20150f] p-6 text-white shadow-card sm:p-7">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#ffcc70]">Publishing flow</p>
          <h3 className="mt-3 font-heading text-3xl font-semibold">One source of truth</h3>
          <div className="mt-7 space-y-5">
            <Step number="01" title="Edit content" text="Update copy, imagery, products and metadata." />
            <Step number="02" title="Review changes" text="Check the storefront before publishing." />
            <Step number="03" title="Publish" text="Push changes to the live site." />
          </div>
        </div>
      </div>
    </div>
  );
}

function HomepageEditor({ onSave, onPublish }: { onSave: () => void; onPublish: () => void }) {
  const [sections, setSections] = useState(["Hero", "Categories", "Fragrance edit", "Experience", "Featured collections", "Premium ingredients", "Best sellers", "Newsletter"]);
  const [newSection, setNewSection] = useState("");

  function addSection() {
    const label = newSection.trim();
    if (!label || sections.includes(label)) return;
    setSections((current) => [...current, label]);
    setNewSection("");
  }

  return <CmsEditorShell title="Homepage content" description="Manage the page sections customers see first." onSave={onSave} onPublish={onPublish}>
    <div className="grid gap-5 lg:grid-cols-2">
      <Field label="Promo banner text" value="Free Shipping on Orders over 30KWD - Arrives Next Day From 5 to 9 PM" />
      <Field label="Hero eyebrow" value="Timeless scents, lasting impressions" />
      <Field label="Hero heading" value="Discover your signature scent" large />
      <Field label="Hero description" value="Experience the art of fine fragrance, crafted for elegance and individuality." textarea />
    </div>
    <div className="mt-6 rounded-xl border border-black/10 bg-[#faf6ee] p-5">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
        <h4 className="font-semibold">Homepage sections</h4>
        <div className="flex gap-2">
          <input value={newSection} onChange={(event) => setNewSection(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addSection(); }} placeholder="New section name" aria-label="New section name" className="min-h-10 min-w-0 rounded-lg border border-black/15 bg-white px-3 text-sm outline-none focus:border-black sm:w-44" />
          <button type="button" onClick={addSection} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-black px-3 text-xs font-semibold text-white hover:bg-black/80"><Plus className="h-3.5 w-3.5" /> Add</button>
        </div>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        {sections.map((item, index) => <ToggleRow key={item} label={item} enabled={index !== 3} />)}
      </div>
    </div>
  </CmsEditorShell>;
}

function ProductsEditor({ onSave, onPublish }: { onSave: () => void; onPublish: () => void }) {
  const [products, setProducts] = useState(sampleProducts);
  const [editorOpen, setEditorOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editProductName, setEditProductName] = useState("");
  const [editProductCategory, setEditProductCategory] = useState("");
  const [editProductPrice, setEditProductPrice] = useState("");

  function startEditing(product: (typeof sampleProducts)[number]) {
    setEditingProduct(product.name);
    setEditProductName(product.name);
    setEditProductCategory(product.category);
    setEditProductPrice(product.price);
    setEditorOpen(true);
  }

  function saveProduct() {
    if (!editProductName.trim()) return;
    if (products.some((product) => product.name.toLowerCase() === editProductName.trim().toLowerCase() && product.name !== editingProduct)) return;
    if (editingProduct) {
      setProducts((current) => current.map((product) => product.name === editingProduct
        ? { ...product, name: editProductName.trim(), category: editProductCategory.trim(), price: editProductPrice.trim() }
        : product));
    } else {
      setProducts((current) => [...current, { name: editProductName.trim(), category: editProductCategory.trim(), price: editProductPrice.trim(), status: "Draft", image: "/images/Perfume/1.webp" }]);
    }
    setEditingProduct(null);
    setEditorOpen(false);
  }

  function deleteProduct(name: string) {
    setDeleteTarget(name);
  }

  function confirmDeleteProduct() {
    if (!deleteTarget) return;
    setProducts((current) => current.filter((product) => product.name !== deleteTarget));
    setDeleteTarget(null);
  }

  function publishProduct(name: string) {
    setProducts((current) => current.map((product) => product.name === name ? { ...product, status: "Published" } : product));
  }

  const config: ListingConfig<(typeof products)[number]> = {
    title: "Product catalog",
    description: "Create and maintain every fragrance shown in the storefront.",
    hideHeader: true,
    searchable: true,
    searchPlaceholder: "Search products",
    showFilter: true,
    filterable: true,
    filters: [
      { key: "category", label: "Category", type: "select", options: productCategoryOptions.map((category) => ({ value: category, label: category })) },
      { key: "status", label: "Status", type: "select", options: [{ value: "Published", label: "Published" }, { value: "Draft", label: "Draft" }] },
    ],
    exportFileName: "scentora-products.csv",
    tableMinWidth: 760,
    columns: [
      { key: "name", label: "Product", sortable: true, render: (_value, product) => <div className="flex min-w-48 items-center gap-3 font-semibold"><Image src={product.image} alt="" width={40} height={40} className="h-10 w-10 rounded-lg object-cover" />{product.name}</div> },
      { key: "category", label: "Category", sortable: true },
      { key: "price", label: "Price", sortable: true },
      { key: "status", label: "Status", render: (_value, product) => <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.status === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{product.status}</span> },
    ],
    actions: [
      { key: "edit", label: "Edit", icon: <Pencil className="h-4 w-4" />, onClick: (product) => startEditing(product) },
      { key: "publish", label: "Publish", icon: <Upload className="h-4 w-4" />, show: (product) => editingProduct !== product.name && product.status !== "Published", onClick: (product) => publishProduct(product.name) },
      { key: "delete", label: "Delete", icon: <Trash2 className="h-4 w-4" />, color: "error", onClick: (product) => deleteProduct(product.name) },
    ],
    emptyState: { title: "No products found", description: "Add a fragrance or adjust your search and filters." },
  };

  return <CmsEditorShell title="Product catalog" description="Create and maintain every fragrance shown in the storefront." onSave={onSave} onPublish={onPublish} headerAction={<button type="button" onClick={() => { setEditingProduct(null); setEditProductName(""); setEditProductCategory("Unisex"); setEditProductPrice(""); setEditorOpen(true); }} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#a15d2d] px-3 text-xs font-semibold text-white hover:bg-[#8c4d24] sm:flex-none sm:px-4 sm:text-sm"><Plus className="h-4 w-4" /> Add product</button>}>
    <DynamicListing config={config} data={products} />
    <CmsEntityDialog open={editorOpen} title={editingProduct ? "Edit product" : "Add product"} description={editingProduct ? "Update the product information shown in your catalog." : "Add a new product to your catalog."} fields={[{ key: "name", label: "Product name", value: editProductName, required: true }, { key: "category", label: "Category", value: editProductCategory, type: "select", options: productCategoryOptions.map((category) => ({ value: category, label: category })) }, { key: "price", label: "Price", value: editProductPrice }]} onChange={(key, value) => { if (key === "name") setEditProductName(value); if (key === "category") setEditProductCategory(value); if (key === "price") setEditProductPrice(value); }} onClose={() => setEditorOpen(false)} onSave={saveProduct} saveLabel={editingProduct ? "Save changes" : "Add product"} />
    <ConfirmationDialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={confirmDeleteProduct} title="Delete product?" message={`Delete ${deleteTarget ?? "this product"} from the catalog? This action cannot be undone.`} confirmText="Delete product" cancelText="Keep product" type="danger" />
  </CmsEditorShell>;
}

function CategoriesEditor({ onSave, onPublish }: { onSave: () => void; onPublish: () => void }) {
  const [categories, setCategories] = useState([
    { name: "Men", slug: "men", description: "Refined fragrances for men.", status: "Published" },
    { name: "Women", slug: "women", description: "Elegant scents for women.", status: "Published" },
    { name: "Unisex", slug: "unisex", description: "Balanced fragrances for everyone.", status: "Published" },
  ]);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");

  function addCategory() {
    setEditingSlug(null);
    setEditName("");
    setEditDescription("");
    setEditorOpen(true);
  }

  function startEditing(category: (typeof categories)[number]) {
    setEditingSlug(category.slug);
    setEditName(category.name);
    setEditDescription(category.description);
    setEditorOpen(true);
  }

  function saveCategory() {
    const name = editName.trim();
    if (!name) return;
    const slug = name.toLowerCase().replace(/\s+/g, "-");
    if (categories.some((category) => category.slug === slug && category.slug !== editingSlug)) return;
    if (editingSlug) {
      setCategories((current) => current.map((category) => category.slug === editingSlug
        ? { ...category, name, description: editDescription.trim(), slug }
        : category));
    } else {
      setCategories((current) => [...current, { name, slug, description: editDescription.trim(), status: "Draft" }]);
    }
    setEditingSlug(null);
    setEditorOpen(false);
  }

  function deleteCategory(slug: string) {
    if (!categories.some((item) => item.slug === slug)) return;
    setDeleteTarget(slug);
  }

  function confirmDeleteCategory() {
    if (!deleteTarget) return;
    setCategories((current) => current.filter((item) => item.slug !== deleteTarget));
    setDeleteTarget(null);
  }

  function publishCategory(slug: string) {
    setCategories((current) => current.map((category) => category.slug === slug ? { ...category, status: "Published" } : category));
  }

  const config: ListingConfig<(typeof categories)[number]> = {
    title: "Product categories",
    description: "Categories help customers browse the right fragrance collection.",
    hideHeader: true,
    searchable: true,
    searchPlaceholder: "Search categories",
    filterable: true,
    showFilter: true,
    filters: [{ key: "status", label: "Status", type: "select", options: [{ value: "Published", label: "Published" }, { value: "Draft", label: "Draft" }] }],
    exportFileName: "scentora-categories.csv",
    tableMinWidth: 760,
    columns: [
      { key: "name", label: "Category", sortable: true, render: (_value, category) => <span className="font-semibold">{category.name}</span> },
      { key: "slug", label: "Slug", sortable: true },
      { key: "description", label: "Description", render: (_value, category) => category.description || "Add a category description" },
      { key: "status", label: "Status", render: (_value, category) => <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${category.status === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{category.status}</span> },
    ],
    actions: [
      { key: "edit", label: "Edit", icon: <Pencil className="h-4 w-4" />, onClick: (category) => startEditing(category) },
      { key: "publish", label: "Publish", icon: <Upload className="h-4 w-4" />, show: (category) => editingSlug !== category.slug && category.status !== "Published", onClick: (category) => publishCategory(category.slug) },
      { key: "delete", label: "Delete", icon: <Trash2 className="h-4 w-4" />, color: "error", onClick: (category) => deleteCategory(category.slug) },
    ],
    emptyState: { title: "No categories found", description: "Add a category or adjust your search and filters." },
  };

  return <CmsEditorShell title="Category management" description="Create and organize the categories used across your product catalog." onSave={onSave} onPublish={onPublish} headerAction={<button type="button" onClick={addCategory} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#a15d2d] px-3 text-xs font-semibold text-white hover:bg-[#8c4d24] sm:flex-none sm:px-4 sm:text-sm"><Plus className="h-4 w-4" /> Add category</button>}>
    <DynamicListing config={config} data={categories} />
    <CmsEntityDialog open={editorOpen} title={editingSlug ? "Edit category" : "Add category"} description={editingSlug ? "Update this category and its storefront description." : "Create a category to help customers browse your products."} fields={[{ key: "name", label: "Category name", value: editName, required: true }, { key: "description", label: "Description", value: editDescription, type: "textarea" }]} onChange={(key, value) => { if (key === "name") setEditName(value); if (key === "description") setEditDescription(value); }} onClose={() => setEditorOpen(false)} onSave={saveCategory} saveLabel={editingSlug ? "Save changes" : "Add category"} />
    <ConfirmationDialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={confirmDeleteCategory} title="Delete category?" message={`Delete ${categories.find((category) => category.slug === deleteTarget)?.name ?? "this category"}? This action cannot be undone.`} confirmText="Delete category" cancelText="Keep category" type="danger" />
  </CmsEditorShell>;
}

function CollectionsEditor({ onSave, onPublish }: { onSave: () => void; onPublish: () => void }) {
  const [collections, setCollections] = useState([
    { name: "All Collection", description: "Collection description from CMS", image: "/images/collections/m1.jpg", status: "Published" },
    { name: "Men's Collection", description: "Collection description from CMS", image: "/images/collections/m2.jpg", status: "Published" },
    { name: "Women's Collection", description: "Collection description from CMS", image: "/images/collections/m3.jpeg", status: "Published" },
    { name: "Unisex Collection", description: "Collection description from CMS", image: "/images/collections/m4.jpg", status: "Published" },
    { name: "Luxury Collection", description: "Collection description from CMS", image: "/images/collections/m1.jpg", status: "Draft" },
  ]);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingCollection, setEditingCollection] = useState<string | null>(null);
  const [editCollectionName, setEditCollectionName] = useState("");
  const [editCollectionDescription, setEditCollectionDescription] = useState("");

  function startEditing(collection: (typeof collections)[number]) {
    setEditingCollection(collection.name);
    setEditCollectionName(collection.name);
    setEditCollectionDescription(collection.description);
    setEditorOpen(true);
  }

  function saveCollection() {
    const name = editCollectionName.trim();
    if (!name) return;
    if (collections.some((collection) => collection.name.toLowerCase() === name.toLowerCase() && collection.name !== editingCollection)) return;
    if (editingCollection) {
      setCollections((current) => current.map((collection) => collection.name === editingCollection
        ? { ...collection, name, description: editCollectionDescription.trim() }
        : collection));
    } else {
      setCollections((current) => [...current, { name, description: editCollectionDescription.trim() || "Collection description from CMS", image: "/images/collections/m1.jpg", status: "Draft" }]);
    }
    setEditingCollection(null);
    setEditorOpen(false);
  }

  function deleteCollection(name: string) {
    setDeleteTarget(name);
  }

  function confirmDeleteCollection() {
    if (!deleteTarget) return;
    setCollections((current) => current.filter((collection) => collection.name !== deleteTarget));
    setDeleteTarget(null);
  }

  function publishCollection(name: string) {
    setCollections((current) => current.map((collection) => collection.name === name ? { ...collection, status: "Published" } : collection));
  }

  function addCollection() {
    setEditingCollection(null);
    setEditCollectionName("");
    setEditCollectionDescription("");
    setEditorOpen(true);
  }

  const config: ListingConfig<(typeof collections)[number]> = {
    title: "Collections",
    description: "Organize products into editorial collections.",
    hideHeader: true,
    searchable: true,
    searchPlaceholder: "Search collections",
    filterable: true,
    showFilter: true,
    filters: [{ key: "status", label: "Status", type: "select", options: [{ value: "Published", label: "Published" }, { value: "Draft", label: "Draft" }] }],
    exportFileName: "scentora-collections.csv",
    tableMinWidth: 760,
    columns: [
      { key: "image", label: "Image", render: (_value, collection) => <Image src={collection.image} alt="" width={48} height={40} className="h-10 w-12 rounded-lg object-cover" /> },
      { key: "name", label: "Collection", sortable: true, render: (_value, collection) => <span className="font-semibold">{collection.name}</span> },
      { key: "description", label: "Description" },
      { key: "status", label: "Status", render: (_value, collection) => <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${collection.status === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{collection.status}</span> },
    ],
    actions: [
      { key: "edit", label: "Edit", icon: <Pencil className="h-4 w-4" />, onClick: (collection) => startEditing(collection) },
      { key: "publish", label: "Publish", icon: <Upload className="h-4 w-4" />, show: (collection) => editingCollection !== collection.name && collection.status !== "Published", onClick: (collection) => publishCollection(collection.name) },
      { key: "delete", label: "Delete", icon: <Trash2 className="h-4 w-4" />, color: "error", onClick: (collection) => deleteCollection(collection.name) },
    ],
    emptyState: { title: "No collections found", description: "Create a collection or adjust your search and filters." },
  };

  return <CmsEditorShell title="Collections" description="Organize products into editorial collections." onSave={onSave} onPublish={onPublish} headerAction={<button type="button" onClick={addCollection} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#a15d2d] px-3 text-xs font-semibold text-white hover:bg-[#8c4d24] sm:flex-none sm:px-4 sm:text-sm"><Plus className="h-4 w-4" /> Add collection</button>}>
    <DynamicListing config={config} data={collections} />
    <CmsEntityDialog open={editorOpen} title={editingCollection ? "Edit collection" : "Add collection"} description={editingCollection ? "Update this collection’s name and storefront description." : "Create a collection to group products for your storefront."} fields={[{ key: "name", label: "Collection name", value: editCollectionName, required: true }, { key: "description", label: "Description", value: editCollectionDescription, type: "textarea" }]} onChange={(key, value) => { if (key === "name") setEditCollectionName(value); if (key === "description") setEditCollectionDescription(value); }} onClose={() => setEditorOpen(false)} onSave={saveCollection} saveLabel={editingCollection ? "Save changes" : "Add collection"} />
    <ConfirmationDialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={confirmDeleteCollection} title="Delete collection?" message={`Delete ${deleteTarget ?? "this collection"}? This action cannot be undone.`} confirmText="Delete collection" cancelText="Keep collection" type="danger" />
  </CmsEditorShell>;
}

function MediaEditor() {
  return <CmsEditorShell title="Media library" description="Upload and reuse product, hero, collection and editorial images." onSave={() => undefined}>
    <div className="rounded-2xl border-2 border-dashed border-black/15 bg-[#faf6ee] p-8 text-center sm:p-12"><UploadCloud className="mx-auto h-8 w-8 text-accent" /><h3 className="mt-4 font-heading text-2xl font-semibold">Drop images here</h3><p className="mt-2 text-sm text-textSecondary">PNG, JPG, WEBP up to 10MB. Media will be served by the CMS.</p><button type="button" className="mt-5 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">Choose files</button></div>
  </CmsEditorShell>;
}

function SettingsEditor({ onSave, onPublish }: { onSave: () => void; onPublish: () => void }) {
  return <CmsEditorShell title="Site settings" description="Control global SEO, footer, contact and social content." onSave={onSave} onPublish={onPublish}>
    <div className="grid gap-5 lg:grid-cols-2"><Field label="Site title" value={`${siteConfig.name} | Timeless Scents, Lasting Impressions`} /><Field label="Contact email" value={siteConfig.contactEmail} /><Field label="Contact phone" value={process.env.NEXT_PUBLIC_CONTACT_PHONE || ""} /><Field label="Instagram URL" value="" /><Field label="Meta description" value={siteConfig.description} textarea /><Field label="Footer tagline" value="Timeless Scents, Lasting Impressions" textarea /></div>
  </CmsEditorShell>;
}

type PermissionAction = "view" | "create" | "update" | "delete";
type PermissionAccess = Record<string, Record<PermissionAction, boolean>>;

function buildPermissionAccess(role: CmsRole): PermissionAccess {
  const rolePermissions = cmsRolePermissions[role];
  return Object.fromEntries(
    cmsNavigation
      .filter((item) => item.id !== "permissions")
      .map((item) => {
        const permission = cmsSectionPermissions[item.id];
        const allowed = rolePermissions.includes(permission);
        return [item.id, { view: allowed, create: allowed, update: allowed, delete: allowed }];
      }),
  );
}

function PermissionsEditor({ onSave, onPublish }: { onSave: () => void; onPublish: () => void }) {
  const [selectedRole, setSelectedRole] = useState<CmsRole | null>(null);
  const [access, setAccess] = useState<PermissionAccess>(() => buildPermissionAccess("admin"));
  const pageItems = cmsNavigation.filter((item) => item.id !== "permissions");

  function changeRole(role: CmsRole | null) {
    setSelectedRole(role);
    if (role) setAccess(buildPermissionAccess(role));
  }

  function togglePermission(page: string, action: PermissionAction) {
    setAccess((current) => ({
      ...current,
      [page]: { ...current[page], [action]: !current[page][action] },
    }));
  }

  const permissionRows = selectedRole
    ? pageItems.map((item) => ({ ...item, ...access[item.id] }))
    : [];
  const config: ListingConfig<(typeof permissionRows)[number]> = {
    title: "Role permissions",
    hideHeader: true,
    searchable: false,
    filterable: true,
    showFilter: true,
    externalFilterKeys: ["role"],
    filters: [{ key: "role", label: "Role", type: "select", options: [
      { value: "super_admin", label: "SuperAdmin" },
      { value: "admin", label: "Admin" },
      { value: "editor", label: "Editor" },
      { value: "catalog_manager", label: "Catalog manager" },
    ] }],
    tableMinWidth: 680,
    columns: [
      { key: "label", label: "Permission name", sortable: true, render: (value) => <span className="font-semibold">{value}</span> },
      ...(["view", "create", "update", "delete"] as PermissionAction[]).map((action) => ({
        key: action,
        label: action[0].toUpperCase() + action.slice(1),
        align: "center" as const,
        render: (_value: unknown, item: (typeof permissionRows)[number]) => <input type="checkbox" checked={access[item.id]?.[action] ?? false} onChange={() => togglePermission(item.id, action)} aria-label={`${action} ${item.label}`} className="h-4 w-4 cursor-pointer accent-[#f9a826]" />,
      })),
    ],
    emptyState: selectedRole
      ? { title: "No permissions found", description: "Adjust your search to find a permission." }
      : { title: "Select a role", description: "Choose a role to view and manage its permissions." },
  };

  return <CmsEditorShell title="Permissions" description="Choose which pages and actions each role can access." onSave={onSave} onPublish={onPublish}>
    <DynamicListing config={config} data={permissionRows} onFilter={(filters) => changeRole((filters.role as CmsRole) || null)} />
  </CmsEditorShell>;
}

function MenuManagementEditor({ onSave, onPublish }: { onSave: () => void; onPublish: () => void }) {
  const [items, setItems] = useState([
    { label: "Home", parent: "-", order: 0, isMenu: true, path: "/", icon: "Home", created: "Sep 23, 2026" },
    { label: "Shop", parent: "-", order: 1, isMenu: true, path: "/shop", icon: "Storefront", created: "Sep 23, 2026" },
    { label: "Best Sellers", parent: "-", order: 2, isMenu: true, path: "/best-sellers", icon: "TrendingUp", created: "Sep 23, 2026" },
    { label: "Collections", parent: "-", order: 3, isMenu: true, path: "/collections", icon: "Tags", created: "Sep 23, 2026" },
    { label: "About", parent: "-", order: 4, isMenu: true, path: "/about", icon: "Info", created: "Sep 23, 2026" },
    { label: "Guide", parent: "-", order: 5, isMenu: true, path: "/guide", icon: "BookOpen", created: "Sep 23, 2026" },
    { label: "FAQs", parent: "-", order: 6, isMenu: true, path: "/faqs", icon: "CircleHelp", created: "Sep 23, 2026" },
    { label: "Contact", parent: "-", order: 7, isMenu: true, path: "/contact", icon: "Mail", created: "Sep 23, 2026" },
    { label: "Wishlist", parent: "-", order: 8, isMenu: true, path: "/wishlist", icon: "Heart", created: "Sep 23, 2026" },
    { label: "Cart", parent: "-", order: 9, isMenu: true, path: "/cart", icon: "ShoppingBag", created: "Sep 23, 2026" },
    { label: "Shipping & Returns", parent: "-", order: 10, isMenu: true, path: "/shipping-returns", icon: "Truck", created: "Sep 23, 2026" },
    { label: "Terms", parent: "-", order: 11, isMenu: true, path: "/terms", icon: "FileText", created: "Sep 23, 2026" },
    { label: "Privacy", parent: "-", order: 12, isMenu: true, path: "/privacy", icon: "Lock", created: "Sep 23, 2026" },
  ]);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [editingMenuLabel, setEditingMenuLabel] = useState<string | null>(null);
  const [label, setLabel] = useState("");
  const [path, setPath] = useState("");

  function addItem() {
    setEditingMenuLabel(null);
    setLabel("");
    setPath("");
    setEditorOpen(true);
  }

  function editItem(item: (typeof items)[number]) {
    setEditingMenuLabel(item.label);
    setLabel(item.label);
    setPath(item.path);
    setEditorOpen(true);
  }

  function saveItem() {
    const nextLabel = label.trim();
    const nextPath = path.trim();
    if (!nextLabel || !nextPath) return;
    if (items.some((item) => item.label.toLowerCase() === nextLabel.toLowerCase() && item.label !== editingMenuLabel)) return;
    if (editingMenuLabel) {
      setItems((current) => current.map((item) => item.label === editingMenuLabel ? { ...item, label: nextLabel, path: nextPath } : item));
    } else {
      setItems((current) => [...current, { label: nextLabel, parent: "-", order: current.length, isMenu: true, path: nextPath, icon: "Menu", created: "Sep 23, 2026" }]);
    }
    setEditingMenuLabel(null);
    setEditorOpen(false);
  }

  function deleteItem(itemLabel: string) {
    setDeleteTarget(itemLabel);
  }

  function confirmDeleteMenuItem() {
    if (!deleteTarget) return;
    setItems((current) => current.filter((item) => item.label !== deleteTarget));
    setDeleteTarget(null);
  }

  const config: ListingConfig<(typeof items)[number]> = {
    title: "Storefront menu",
    description: "Control menu order, paths, parent menus and visibility.",
    hideHeader: true,
    searchable: true,
    searchPlaceholder: "Search menu items",
    filterable: true,
    showFilter: true,
    filters: [{ key: "isMenu", label: "Visibility", type: "select", options: [{ value: "true", label: "Visible" }, { value: "false", label: "Hidden" }] }],
    exportFileName: "scentora-menu.csv",
    tableMinWidth: 980,
    columns: [
      { key: "label", label: "Menu", sortable: true, render: (value) => <span className="font-semibold">{value}</span> },
      { key: "parent", label: "Parent menu" },
      { key: "order", label: "Display order", sortable: true, align: "center" },
      { key: "isMenu", label: "Visibility", render: (value) => <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${value ? "bg-emerald-50 text-emerald-700" : "bg-stone-100 text-stone-600"}`}>{value ? "Visible" : "Hidden"}</span> },
      { key: "path", label: "Path" },
      { key: "icon", label: "Icon" },
      { key: "created", label: "Created date" },
    ],
    actions: [
      { key: "edit", label: "Edit", icon: <Pencil className="h-4 w-4" />, onClick: (item) => editItem(item) },
      { key: "delete", label: "Delete", icon: <Trash2 className="h-4 w-4" />, color: "error", onClick: (item) => deleteItem(item.label) },
    ],
    emptyState: { title: "No menu items found", description: "Add a menu item or adjust your search and filters." },
  };

  return <CmsEditorShell title="Menu Management" description="Create and manage the menu items used across your storefront." onSave={onSave} onPublish={onPublish} headerAction={<button type="button" onClick={addItem} className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-full bg-[#a15d2d] px-3 text-xs font-semibold text-white hover:bg-[#8c4d24] sm:flex-none sm:px-4 sm:text-sm"><Plus className="h-4 w-4" /> Add menu item</button>}>
    <DynamicListing config={config} data={items} />
    <CmsEntityDialog open={editorOpen} title={editingMenuLabel ? "Edit menu item" : "Add menu item"} description={editingMenuLabel ? "Update this navigation label and destination." : "Add a navigation link to your storefront menu."} fields={[{ key: "label", label: "Menu name", value: label, required: true }, { key: "path", label: "Path", value: path, required: true }]} onChange={(key, value) => { if (key === "label") setLabel(value); if (key === "path") setPath(value); }} onClose={() => setEditorOpen(false)} onSave={saveItem} saveLabel={editingMenuLabel ? "Save changes" : "Add menu item"} />
    <ConfirmationDialog open={Boolean(deleteTarget)} onClose={() => setDeleteTarget(null)} onConfirm={confirmDeleteMenuItem} title="Delete menu item?" message={`Delete ${deleteTarget ?? "this menu item"}? This action cannot be undone.`} confirmText="Delete item" cancelText="Keep item" type="danger" />
  </CmsEditorShell>;
}

function Field({ label, value, textarea = false, large = false }: { label: string; value: string; textarea?: boolean; large?: boolean }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold">{label}</span>{textarea ? <textarea defaultValue={value} rows={large ? 5 : 3} className="w-full rounded-xl border border-black/15 bg-[#fffdf7] px-4 py-3 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10" /> : <input defaultValue={value} className={`min-h-12 w-full rounded-xl border border-black/15 bg-[#fffdf7] px-4 text-sm outline-none focus:border-black focus:ring-2 focus:ring-black/10 ${large ? "text-lg font-semibold" : ""}`} />}</label>;
}

function ToggleRow({ label, enabled }: { label: string; enabled: boolean }) {
  const [active, setActive] = useState(enabled);
  return <div className="flex items-center justify-between rounded-xl border border-black/10 bg-white px-4 py-3"><span className="text-sm font-semibold">{label}</span><button type="button" onClick={() => setActive((value) => !value)} aria-pressed={active} className={`relative h-6 w-11 rounded-full transition ${active ? "bg-accent" : "bg-black/15"}`}><span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition ${active ? "left-6" : "left-1"}`} /></button></div>;
}

function Stat({ label, value, icon: Icon }: { label: string; value: string; icon: typeof Package }) {
  return <div className="rounded-2xl border border-black/10 bg-white p-5 shadow-card"><Icon className="h-5 w-5 text-accent" /><p className="mt-5 text-3xl font-semibold">{value}</p><p className="mt-1 text-sm text-textSecondary">{label}</p></div>;
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return <div className="flex gap-4"><span className="text-xs font-semibold text-[#ffcc70]">{number}</span><div><p className="font-semibold">{title}</p><p className="mt-1 text-sm leading-6 text-white/60">{text}</p></div></div>;
}

function SparkIcon() {
  return <FileText className="h-5 w-5 text-accent" />;
}
