"use client";

import Image from "next/image";
import { useState } from "react";
import {
  BarChart3,
  Check,
  FileText,
  Package,
  PanelTop,
  Pencil,
  Plus,
  Search,
  Settings2,
  Tags,
  Trash2,
  MoreVertical,
  Upload,
  UploadCloud,
} from "lucide-react";
import CmsEditorShell from "@/components/cms/CmsEditorShell";
import CmsFooter from "@/components/cms/CmsFooter";
import CmsHeader from "@/components/cms/CmsHeader";
import CmsSidebar from "@/components/cms/CmsSidebar";
import CmsSelect from "@/components/cms/CmsSelect";
import { cmsRolePermissions, cmsSectionPermissions, cmsNavigation, type CmsRole, type CmsSection } from "@/components/cms/cms-config";

const sampleProducts = [
  { name: "Noir Mystique", category: "Men", price: "120.00 KWD", status: "Published", image: "/images/Perfume/1.webp" },
  { name: "Velvet Bloom", category: "Women", price: "135.00 KWD", status: "Published", image: "/images/Perfume/2.webp" },
  { name: "Amber Dusk", category: "Unisex", price: "110.00 KWD", status: "Draft", image: "/images/Perfume/9.webp" },
  { name: "Cedar Amber", category: "Men", price: "110.00 KWD", status: "Published", image: "/images/Perfume/31.webp" },
];

export default function CmsPage() {
  const [active, setActive] = useState<CmsSection>("overview");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [role] = useState<CmsRole>("admin");
  const [notice, setNotice] = useState("");

  function save(section: string) {
    setNotice(`${section} changes are ready to publish through the CMS API.`);
    window.setTimeout(() => setNotice(""), 3500);
  }

  return (
    <main className="min-h-screen bg-[#f7f0e2] text-textPrimary sm:h-screen sm:overflow-hidden">
      <div className="flex h-full">
        <CmsSidebar open={sidebarOpen} role={role} activeSection={active} onToggle={() => setSidebarOpen((open) => !open)} onSelect={setActive} />

        <section className="flex min-w-0 flex-1 flex-col sm:overflow-hidden">
          <CmsHeader
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((open) => !open)}
            onOpenSidebar={() => setSidebarOpen(true)}
          />

          {notice ? <div className="mx-5 mt-5 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800 sm:mx-8 lg:mx-12"><Check className="h-4 w-4" /> {notice}</div> : null}
          <div className="min-h-0 flex-1 px-4 py-6 sm:overflow-y-auto sm:px-8 sm:py-8 lg:px-12 lg:py-10">
            {active === "overview" ? <Overview onSelect={setActive} /> : null}
            {active === "homepage" ? <HomepageEditor onSave={() => save("Homepage")} onPublish={() => save("Homepage publish")} /> : null}
            {active === "products" ? <ProductsEditor onSave={() => save("Product")} onPublish={() => save("Product publish")} /> : null}
            {active === "categories" ? <CategoriesEditor onSave={() => save("Category")} onPublish={() => save("Category publish")} /> : null}
            {active === "collections" ? <CollectionsEditor onSave={() => save("Collection")} onPublish={() => save("Collection publish")} /> : null}
            {active === "navigation" ? <MenuManagementEditor onSave={() => save("Menu")} onPublish={() => save("Menu publish")} /> : null}
            {active === "media" ? <MediaEditor /> : null}
            {active === "settings" ? <SettingsEditor onSave={() => save("Site settings")} onPublish={() => save("Site settings publish")} /> : null}
            {active === "permissions" ? <PermissionsEditor onSave={() => save("Permissions")} onPublish={() => save("Permissions publish")} /> : null}
          </div>
          <CmsFooter />
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
            <Step number="03" title="Publish" text="Push changes through the NestJS API." />
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
  const [openActions, setOpenActions] = useState<string | null>(null);
  const [editingProduct, setEditingProduct] = useState<string | null>(null);
  const [editProductName, setEditProductName] = useState("");
  const [editProductCategory, setEditProductCategory] = useState("");
  const [editProductPrice, setEditProductPrice] = useState("");

  function startEditing(product: (typeof sampleProducts)[number]) {
    setEditingProduct(product.name);
    setEditProductName(product.name);
    setEditProductCategory(product.category);
    setEditProductPrice(product.price);
  }

  function saveProduct(name: string) {
    if (!editProductName.trim()) return;
    setProducts((current) => current.map((product) => product.name === name
      ? { ...product, name: editProductName.trim(), category: editProductCategory.trim(), price: editProductPrice.trim() }
      : product));
    setEditingProduct(null);
  }

  function deleteProduct(name: string) {
    if (!window.confirm(`Delete the ${name} product?`)) return;
    setProducts((current) => current.filter((product) => product.name !== name));
  }

  function publishProduct(name: string) {
    setProducts((current) => current.map((product) => product.name === name ? { ...product, status: "Published" } : product));
  }

  return <CmsEditorShell title="Product catalog" description="Create and maintain every fragrance shown in the storefront." onSave={onSave} onPublish={onPublish}>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div className="relative max-w-md flex-1"><Search className="absolute left-3 top-3 h-4 w-4 text-textSecondary" /><input placeholder="Search products" className="min-h-11 w-full rounded-xl border border-black/15 bg-white pl-10 pr-3 text-sm outline-none focus:border-black" /></div>
      <button type="button" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-full bg-black px-4 text-sm font-semibold text-white"><Plus className="h-4 w-4" /> Add product</button>
    </div>
    <div className="mt-6 overflow-x-auto rounded-xl border border-black/10">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-[#faf6ee] text-xs uppercase tracking-wider text-textSecondary"><tr><th className="px-4 py-3">Product</th><th className="px-4 py-3">Category</th><th className="px-4 py-3">Price</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr></thead>
        <tbody>{products.map((product) => editingProduct === product.name ? (
          <tr key={product.name} className="border-t border-black/10">
            <td className="px-4 py-3"><div className="flex items-center gap-3 font-semibold"><Image src={product.image} alt="" width={40} height={40} className="h-10 w-10 rounded-lg object-cover" /><input value={editProductName} onChange={(event) => setEditProductName(event.target.value)} aria-label="Edit product name" className="min-h-9 w-full rounded-lg border border-black/15 px-2 text-sm outline-none focus:border-black" /></div></td>
            <td className="px-4 py-3"><input value={editProductCategory} onChange={(event) => setEditProductCategory(event.target.value)} aria-label="Edit product category" className="min-h-9 w-full rounded-lg border border-black/15 px-2 text-sm outline-none focus:border-black" /></td>
            <td className="px-4 py-3"><input value={editProductPrice} onChange={(event) => setEditProductPrice(event.target.value)} aria-label="Edit product price" className="min-h-9 w-full rounded-lg border border-black/15 px-2 text-sm outline-none focus:border-black" /></td>
            <td className="px-4 py-3"><span className="text-xs text-textSecondary">{product.status}</span></td>
            <td className="px-4 py-3"><div className="flex gap-2"><button type="button" onClick={() => saveProduct(product.name)} className="rounded-lg bg-black px-2.5 py-2 text-xs font-semibold text-white">Save</button><button type="button" onClick={() => setEditingProduct(null)} className="rounded-lg border border-black/15 px-2.5 py-2 text-xs font-semibold">Cancel</button></div></td>
          </tr>
        ) : (
          <tr key={product.name} className="border-t border-black/10"><td className="flex items-center gap-3 px-4 py-3 font-semibold"><Image src={product.image} alt="" width={40} height={40} className="h-10 w-10 rounded-lg object-cover" />{product.name}</td><td className="px-4 py-3 text-textSecondary">{product.category}</td><td className="px-4 py-3">{product.price}</td><td className="px-4 py-3"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${product.status === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{product.status}</span></td><td className="relative px-4 py-3"><button type="button" onClick={() => setOpenActions((current) => current === product.name ? null : product.name)} aria-label={`Open actions for ${product.name}`} className="rounded-lg p-2 text-textSecondary hover:bg-black/5 hover:text-textPrimary"><MoreVertical className="h-4 w-4" /></button>{openActions === product.name ? <div className="absolute right-4 top-11 z-10 w-32 rounded-lg border border-black/10 bg-white p-1 shadow-lg"><button type="button" onClick={() => { startEditing(product); setOpenActions(null); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-black/5"><Pencil className="h-3.5 w-3.5 text-textSecondary" /> Edit</button>          <button type="button" onClick={() => { publishProduct(product.name); setOpenActions(null); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-emerald-700 hover:bg-emerald-50"><Upload className="h-3.5 w-3.5" /> Publish</button><button type="button" onClick={() => { deleteProduct(product.name); setOpenActions(null); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /> Delete</button></div> : null}</td></tr>
        ))}</tbody>
      </table>
    </div>
  </CmsEditorShell>;
}

function CategoriesEditor({ onSave, onPublish }: { onSave: () => void; onPublish: () => void }) {
  const [categories, setCategories] = useState([
    { name: "Men", slug: "men", description: "Refined fragrances for men.", status: "Published" },
    { name: "Women", slug: "women", description: "Elegant scents for women.", status: "Published" },
    { name: "Unisex", slug: "unisex", description: "Balanced fragrances for everyone.", status: "Published" },
  ]);
  const [newCategory, setNewCategory] = useState("");
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [editName, setEditName] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [openActions, setOpenActions] = useState<string | null>(null);

  function addCategory() {
    const name = newCategory.trim();
    if (!name || categories.some((category) => category.name.toLowerCase() === name.toLowerCase())) return;
    setCategories((current) => [...current, { name, slug: name.toLowerCase().replace(/\s+/g, "-"), description: "", status: "Draft" }]);
    setNewCategory("");
  }

  function startEditing(category: (typeof categories)[number]) {
    setEditingSlug(category.slug);
    setEditName(category.name);
    setEditDescription(category.description);
  }

  function saveCategory(slug: string) {
    const name = editName.trim();
    if (!name) return;
    setCategories((current) => current.map((category) => category.slug === slug
      ? { ...category, name, description: editDescription.trim(), slug: name.toLowerCase().replace(/\s+/g, "-") }
      : category));
    setEditingSlug(null);
  }

  function deleteCategory(slug: string) {
    const category = categories.find((item) => item.slug === slug);
    if (!category || !window.confirm(`Delete the ${category.name} category?`)) return;
    setCategories((current) => current.filter((item) => item.slug !== slug));
  }

  function publishCategory(slug: string) {
    setCategories((current) => current.map((category) => category.slug === slug ? { ...category, status: "Published" } : category));
  }

  return <CmsEditorShell title="Category management" description="Create and organize the categories used across your product catalog." onSave={onSave} onPublish={onPublish}>
    <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div>
        <h4 className="font-semibold">Product categories</h4>
        <p className="mt-1 text-sm text-textSecondary">Categories help customers browse the right fragrance collection.</p>
      </div>
      <div className="flex gap-2">
        <input value={newCategory} onChange={(event) => setNewCategory(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addCategory(); }} placeholder="New category" aria-label="New category" className="min-h-10 min-w-0 rounded-lg border border-black/15 bg-white px-3 text-sm outline-none focus:border-black sm:w-40" />
        <button type="button" onClick={addCategory} className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-black px-3 text-xs font-semibold text-white hover:bg-black/80"><Plus className="h-3.5 w-3.5" /> Add</button>
      </div>
    </div>
    <div className="mt-6 overflow-x-auto rounded-xl border border-black/10">
      <table className="w-full min-w-[620px] text-left text-sm">
        <thead className="bg-[#faf6ee] text-xs uppercase tracking-wider text-textSecondary"><tr><th className="px-4 py-3">Category</th><th className="px-4 py-3">Slug</th><th className="px-4 py-3">Description</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Actions</th></tr></thead>
        <tbody>{categories.map((category) => editingSlug === category.slug ? (
          <tr key={category.slug} className="border-t border-black/10">
            <td className="px-4 py-3"><input value={editName} onChange={(event) => setEditName(event.target.value)} aria-label="Edit category name" className="min-h-9 w-full rounded-lg border border-black/15 px-2 text-sm outline-none focus:border-black" /></td>
            <td className="px-4 py-3 text-textSecondary">{category.slug}</td>
            <td className="px-4 py-3"><input value={editDescription} onChange={(event) => setEditDescription(event.target.value)} aria-label="Edit category description" className="min-h-9 w-full rounded-lg border border-black/15 px-2 text-sm outline-none focus:border-black" /></td>
            <td className="px-4 py-3"><span className="text-xs text-textSecondary">{category.status}</span></td>
            <td className="px-4 py-3"><div className="flex gap-2"><button type="button" onClick={() => saveCategory(category.slug)} className="rounded-lg bg-black px-2.5 py-2 text-xs font-semibold text-white">Save</button><button type="button" onClick={() => setEditingSlug(null)} className="rounded-lg border border-black/15 px-2.5 py-2 text-xs font-semibold">Cancel</button></div></td>
          </tr>
        ) : (
          <tr key={category.slug} className="border-t border-black/10"><td className="px-4 py-4 font-semibold">{category.name}</td><td className="px-4 py-4 text-textSecondary">{category.slug}</td><td className="px-4 py-4 text-textSecondary">{category.description || "Add a category description"}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${category.status === "Published" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>{category.status}</span></td><td className="relative px-4 py-4"><button type="button" onClick={() => setOpenActions((current) => current === category.slug ? null : category.slug)} aria-label={`Open actions for ${category.name}`} className="rounded-lg p-2 text-textSecondary hover:bg-black/5 hover:text-textPrimary"><MoreVertical className="h-4 w-4" /></button>{openActions === category.slug ? <div className="absolute right-4 top-12 z-10 w-32 rounded-lg border border-black/10 bg-white p-1 shadow-lg"><button type="button" onClick={() => { startEditing(category); setOpenActions(null); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm hover:bg-black/5"><Pencil className="h-3.5 w-3.5 text-textSecondary" /> Edit</button>          <button type="button" onClick={() => { publishCategory(category.slug); setOpenActions(null); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-emerald-700 hover:bg-emerald-50"><Upload className="h-3.5 w-3.5" /> Publish</button><button type="button" onClick={() => { deleteCategory(category.slug); setOpenActions(null); }} className="flex w-full items-center gap-2 rounded-md px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /> Delete</button></div> : null}</td></tr>
        ))}</tbody>
      </table>
    </div>
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
  const [openActions, setOpenActions] = useState<string | null>(null);
  const [editingCollection, setEditingCollection] = useState<string | null>(null);
  const [editCollectionName, setEditCollectionName] = useState("");
  const [editCollectionDescription, setEditCollectionDescription] = useState("");
  const [newCollectionName, setNewCollectionName] = useState("");
  const [newCollectionDescription, setNewCollectionDescription] = useState("");

  function startEditing(collection: (typeof collections)[number]) {
    setEditingCollection(collection.name);
    setEditCollectionName(collection.name);
    setEditCollectionDescription(collection.description);
  }

  function saveCollection(name: string) {
    if (!editCollectionName.trim()) return;
    setCollections((current) => current.map((collection) => collection.name === name
      ? { ...collection, name: editCollectionName.trim(), description: editCollectionDescription.trim() }
      : collection));
    setEditingCollection(null);
  }

  function deleteCollection(name: string) {
    if (!window.confirm(`Delete the ${name} collection?`)) return;
    setCollections((current) => current.filter((collection) => collection.name !== name));
  }

  function publishCollection(name: string) {
    setCollections((current) => current.map((collection) => collection.name === name ? { ...collection, status: "Published" } : collection));
  }

  function addCollection() {
    const name = newCollectionName.trim();
    if (!name || collections.some((collection) => collection.name.toLowerCase() === name.toLowerCase())) return;
    setCollections((current) => [...current, {
      name,
      description: newCollectionDescription.trim() || "Collection description from CMS",
      image: "/images/collections/m1.jpg",
      status: "Draft",
    }]);
    setNewCollectionName("");
    setNewCollectionDescription("");
  }

  return <CmsEditorShell title="Collections" description="Organize products into editorial collections." onSave={onSave} onPublish={onPublish}>
    <div className="mb-6 rounded-xl border border-black/10 bg-[#faf6ee] p-5">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div>
          <h4 className="font-semibold">Add collection</h4>
          <p className="mt-1 text-sm text-textSecondary">Create a new collection for your storefront.</p>
        </div>
        <button type="button" onClick={addCollection} className="inline-flex min-h-10 w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-black px-4 text-xs font-semibold text-white hover:bg-black/80 sm:w-auto">
          <Plus className="h-3.5 w-3.5" /> Add collection
        </button>
      </div>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <input value={newCollectionName} onChange={(event) => setNewCollectionName(event.target.value)} placeholder="Collection name" aria-label="New collection name" className="min-h-10 rounded-lg border border-black/15 bg-white px-3 text-sm outline-none focus:border-black" />
        <input value={newCollectionDescription} onChange={(event) => setNewCollectionDescription(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addCollection(); }} placeholder="Collection description" aria-label="New collection description" className="min-h-10 rounded-lg border border-black/15 bg-white px-3 text-sm outline-none focus:border-black" />
      </div>
    </div>
    <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
      {collections.map((collection) => <div key={collection.name} className="overflow-visible rounded-2xl border border-black/10 bg-white shadow-card">
        <div className="relative overflow-hidden rounded-t-2xl bg-[#faf6ee]">
          <Image src={collection.image} alt="" width={480} height={180} className="h-36 w-full object-cover" />
          <div className="absolute right-3 top-3">
            <button type="button" onClick={() => setOpenActions((current) => current === collection.name ? null : collection.name)} aria-label={`Open actions for ${collection.name}`} className="rounded-full p-1 text-black transition-colors hover:bg-[#f9a826] hover:text-[#20150f]"><MoreVertical className="h-3 w-3" /></button>
            {openActions === collection.name ? <div className="absolute right-0 top-11 z-10 w-32 rounded-xl border border-black/10 bg-white p-1.5 text-left shadow-card"><button type="button" onClick={() => { startEditing(collection); setOpenActions(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-textPrimary hover:bg-[#faf6ee]"><Pencil className="h-3.5 w-3.5 text-accent" /> Edit</button><button type="button" onClick={() => { publishCollection(collection.name); setOpenActions(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-emerald-700 hover:bg-emerald-50"><Upload className="h-3.5 w-3.5" /> Publish</button><button type="button" onClick={() => { deleteCollection(collection.name); setOpenActions(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /> Delete</button></div> : null}
          </div>
        </div>
        <div className="p-5">
          {editingCollection === collection.name ? <div className="space-y-2"><input value={editCollectionName} onChange={(event) => setEditCollectionName(event.target.value)} aria-label="Edit collection name" className="min-h-9 w-full rounded-lg border border-black/15 px-2 text-sm outline-none focus:border-black" /><textarea value={editCollectionDescription} onChange={(event) => setEditCollectionDescription(event.target.value)} aria-label="Edit collection description" rows={2} className="w-full rounded-lg border border-black/15 px-2 py-2 text-xs outline-none focus:border-black" /><div className="flex gap-2"><button type="button" onClick={() => saveCollection(collection.name)} className="rounded-lg bg-black px-2.5 py-2 text-xs font-semibold text-white">Save</button><button type="button" onClick={() => setEditingCollection(null)} className="rounded-lg border border-black/15 px-2.5 py-2 text-xs font-semibold">Cancel</button></div></div> : <><h4 className="font-semibold">{collection.name}</h4><p className="mt-1 text-xs text-textSecondary">{collection.description}</p></>}
        </div>
      </div>)}
    </div>
  </CmsEditorShell>;
}

function MediaEditor() {
  return <CmsEditorShell title="Media library" description="Upload and reuse product, hero, collection and editorial images." onSave={() => undefined}>
    <div className="rounded-2xl border-2 border-dashed border-black/15 bg-[#faf6ee] p-8 text-center sm:p-12"><UploadCloud className="mx-auto h-8 w-8 text-accent" /><h3 className="mt-4 font-heading text-2xl font-semibold">Drop images here</h3><p className="mt-2 text-sm text-textSecondary">PNG, JPG, WEBP up to 10MB. Media will be served by the CMS.</p><button type="button" className="mt-5 rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">Choose files</button></div>
  </CmsEditorShell>;
}

function SettingsEditor({ onSave, onPublish }: { onSave: () => void; onPublish: () => void }) {
  return <CmsEditorShell title="Site settings" description="Control global SEO, footer, contact and social content." onSave={onSave} onPublish={onPublish}>
    <div className="grid gap-5 lg:grid-cols-2"><Field label="Site title" value="Scentora | Timeless Scents, Lasting Impressions" /><Field label="Contact email" value="support@scentora.com" /><Field label="Contact phone" value="+96500000000" /><Field label="Instagram URL" value="" /><Field label="Meta description" value="Discover elegant, long-lasting fragrances crafted for individuality." textarea /><Field label="Footer tagline" value="Timeless Scents, Lasting Impressions" textarea /></div>
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
  const [selectedRole, setSelectedRole] = useState<CmsRole>("admin");
  const [access, setAccess] = useState<PermissionAccess>(() => buildPermissionAccess("admin"));
  const pageItems = cmsNavigation.filter((item) => item.id !== "permissions");

  function changeRole(role: CmsRole) {
    setSelectedRole(role);
    setAccess(buildPermissionAccess(role));
  }

  function togglePermission(page: string, action: PermissionAction) {
    setAccess((current) => ({
      ...current,
      [page]: { ...current[page], [action]: !current[page][action] },
    }));
  }

  return <CmsEditorShell title="Permissions" description="Choose which pages and actions each role can access." onSave={onSave} onPublish={onPublish}>
    <div className="mb-6 flex flex-col justify-between gap-4 rounded-xl border border-black/10 bg-[#faf6ee] p-5 sm:flex-row sm:items-center">
      <CmsSelect
        label="Role"
        value={selectedRole}
        onChange={(value) => changeRole(value as CmsRole)}
        onClear={() => changeRole("admin")}
        options={[
          { value: "super_admin", label: "SuperAdmin" },
          { value: "admin", label: "Admin" },
          { value: "editor", label: "Editor" },
          { value: "catalog_manager", label: "Catalog manager" },
        ]}
        className="w-full sm:w-[470px]"
      />
    </div>
    <div className="overflow-x-auto rounded-xl border border-black/10 bg-white">
      <table className="w-full min-w-[680px] text-left text-sm">
        <thead className="bg-[#faf6ee] text-[11px] font-semibold uppercase tracking-[0.12em] text-textSecondary"><tr><th className="px-4 py-3">Permission name</th><th className="px-4 py-3 text-center">View</th><th className="px-4 py-3 text-center">Create</th><th className="px-4 py-3 text-center">Update</th><th className="px-4 py-3 text-center">Delete</th></tr></thead>
        <tbody>{pageItems.map((item) => <tr key={item.id} className="border-t border-black/10"><td className="px-4 py-4 font-semibold text-textPrimary">{item.label}</td>{(["view", "create", "update", "delete"] as PermissionAction[]).map((action) => <td key={action} className="px-4 py-4 text-center"><input type="checkbox" checked={access[item.id]?.[action] ?? false} onChange={() => togglePermission(item.id, action)} aria-label={`${action} ${item.label}`} className="h-4 w-4 cursor-pointer accent-[#f9a826]" /></td>)}</tr>)}</tbody>
      </table>
    </div>
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
  const [label, setLabel] = useState("");
  const [path, setPath] = useState("");
  const [openActions, setOpenActions] = useState<string | null>(null);

  function addItem() {
    const nextLabel = label.trim();
    const nextPath = path.trim();
    if (!nextLabel || !nextPath || items.some((item) => item.label.toLowerCase() === nextLabel.toLowerCase())) return;
    setItems((current) => [...current, { label: nextLabel, parent: "-", order: current.length, isMenu: true, path: nextPath, icon: "Menu", created: "Sep 23, 2026" }]);
    setLabel("");
    setPath("");
  }

  function deleteItem(itemLabel: string) {
    if (!window.confirm(`Delete the ${itemLabel} menu item?`)) return;
    setItems((current) => current.filter((item) => item.label !== itemLabel));
  }

  return <CmsEditorShell title="Menu Management" description="Create and manage the menu items used across your storefront." onSave={onSave} onPublish={onPublish}>
    <div className="mb-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
      <div><h4 className="font-semibold">Storefront menu</h4><p className="mt-1 text-sm text-textSecondary">Control menu order, paths, parent menus and visibility.</p></div>
      <button type="button" onClick={addItem} className="inline-flex min-h-10 items-center justify-center gap-2 rounded-lg bg-black px-4 text-xs font-semibold text-white hover:bg-black/80"><Plus className="h-3.5 w-3.5" /> Add record</button>
    </div>
    <div className="mb-5 grid gap-3 rounded-xl border border-black/10 bg-[#faf6ee] p-4 sm:grid-cols-2">
      <input value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Menu name" aria-label="Menu name" className="min-h-10 rounded-lg border border-black/15 bg-white px-3 text-sm outline-none focus:border-black" />
      <input value={path} onChange={(event) => setPath(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter") addItem(); }} placeholder="/path" aria-label="Menu path" className="min-h-10 rounded-lg border border-black/15 bg-white px-3 text-sm outline-none focus:border-black" />
    </div>
    <div className="overflow-x-auto rounded-xl border border-black/10">
      <table className="w-full min-w-[920px] text-left text-sm">
        <thead className="bg-[#faf6ee] text-xs uppercase tracking-wider text-textSecondary"><tr><th className="px-4 py-3">Menu</th><th className="px-4 py-3">Parent Menu</th><th className="px-4 py-3">Display Order</th><th className="px-4 py-3">Is Menu</th><th className="px-4 py-3">Path</th><th className="px-4 py-3">Icon</th><th className="px-4 py-3">Created Date</th><th className="px-4 py-3">Actions</th></tr></thead>
        <tbody>{items.map((item) => <tr key={item.label} className="border-t border-black/10"><td className="px-4 py-4 font-semibold">{item.label}</td><td className="px-4 py-4 text-textSecondary">{item.parent}</td><td className="px-4 py-4">{item.order}</td><td className="px-4 py-4"><span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">Yes</span></td><td className="px-4 py-4 text-textSecondary">{item.path}</td><td className="px-4 py-4 text-textSecondary">{item.icon}</td><td className="px-4 py-4 text-textSecondary">{item.created}</td><td className="relative px-4 py-4"><button type="button" onClick={() => setOpenActions((current) => current === item.label ? null : item.label)} aria-label={`Open actions for ${item.label}`} className="rounded-lg p-2 text-textSecondary hover:bg-black/5"><MoreVertical className="h-4 w-4" /></button>{openActions === item.label ? <div className="absolute right-4 top-12 z-10 w-32 rounded-xl border border-black/10 bg-white p-1.5 shadow-card"><button type="button" onClick={() => setOpenActions(null)} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm hover:bg-[#faf6ee]"><Pencil className="h-3.5 w-3.5 text-accent" /> Edit</button><button type="button" onClick={() => { deleteItem(item.label); setOpenActions(null); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /> Delete</button></div> : null}</td></tr>)}</tbody>
      </table>
    </div>
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
