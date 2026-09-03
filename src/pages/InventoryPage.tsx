import { useEffect, useMemo, useState } from 'react';
import { Barcode, Boxes, PackagePlus, Printer, Search, ShieldAlert, TrendingUp, Wallet } from 'lucide-react';
import { fetchSupabaseTable, insertSupabaseRow, updateSupabaseRow } from '../lib/supabase';
import { useUiStore } from '../store/store';

export type StockItem = {
  id: string;
  barcode: string;
  name: string;
  category: string;
  engine: string;
  quantity: number;
  minQty: number;
  purchasePrice: number;
  salePrice: number;
  supplier: string;
  supplierPhone: string;
  supplierContact: string;
  location: string;
  expiryDate: string;
  lastUpdated: string;
  brand: string;
  partNumber: string;
  warranty: string;
  notes: string;
};

const initialStock: StockItem[] = [
  {
    id: 'stk-1',
    barcode: 'HU-5W30-01',
    name: 'Huile moteur 5W-30 Synthétique',
    category: 'Huile / زيت',
    engine: 'Renault / Dacia / Peugeot / VW',
    quantity: 24,
    minQty: 12,
    purchasePrice: 3200,
    salePrice: 5400,
    supplier: 'AutoParts DZ',
    supplierPhone: '+213 550 11 22 33',
    supplierContact: 'Said M.',
    location: 'Étagère A1',
    expiryDate: '2027-12-31',
    lastUpdated: '2026-08-30',
    brand: 'MANNOL',
    partNumber: 'MN-5W30-4L',
    warranty: '12 mois',
    notes: 'زيت تخليقي ممتاز لجميع محركات الديزل والبنزين الحديثة',
  },
  {
    id: 'stk-2',
    barcode: 'FIL-HU-719',
    name: 'Filtre à huile MANN HU 719/7x',
    category: 'Filtre / فلتر',
    engine: 'Renault Clio IV / K9K 1.5 dCi 90',
    quantity: 7,
    minQty: 10,
    purchasePrice: 1800,
    salePrice: 2600,
    supplier: 'Garage Supply Algérie',
    supplierPhone: '+213 670 44 55 66',
    supplierContact: 'Karim B.',
    location: 'Étagère B2',
    expiryDate: '2028-06-30',
    lastUpdated: '2026-08-29',
    brand: 'MANN',
    partNumber: 'HU 719/7x',
    warranty: '6 mois',
    notes: 'فلتر أصلي ألماني عالي التحمل',
  },
  {
    id: 'stk-3',
    barcode: 'FIL-AIR-2812',
    name: 'Filtre à air MANN CU 2812',
    category: 'Filtre / فلتر',
    engine: 'Mercedes C-Class / OM651 2.1 CDI',
    quantity: 3,
    minQty: 8,
    purchasePrice: 1500,
    salePrice: 2100,
    supplier: 'Sarl Lubricants',
    supplierPhone: '+213 661 00 11 22',
    supplierContact: 'Lina D.',
    location: 'Étagère C3',
    expiryDate: '2028-03-15',
    lastUpdated: '2026-08-27',
    brand: 'MANN',
    partNumber: 'CU 2812',
    warranty: '12 mois',
    notes: 'فلتر هواء لمحركات الديزل',
  },
  {
    id: 'stk-4',
    barcode: 'LIQ-BRAKE-01',
    name: 'Liquide de frein DOT 4 (Castrol)',
    category: 'Liquide / سوائل',
    engine: 'Tous moteurs / عام',
    quantity: 15,
    minQty: 10,
    purchasePrice: 1200,
    salePrice: 1800,
    supplier: 'AutoParts DZ',
    supplierPhone: '+213 550 11 22 33',
    supplierContact: 'Said M.',
    location: 'Aisle D1',
    expiryDate: '2027-09-30',
    lastUpdated: '2026-08-30',
    brand: 'Castrol',
    partNumber: 'DOT4-1L',
    warranty: '18 mois',
    notes: 'سائل فرامل عالي الجودة',
  },
];

const INVENTORY_KEY = 'siara_inventory_stock_v2';

export function InventoryPage() {
  const { language, theme } = useUiStore();
  const isDark = theme === 'dark';
  const isArabic = language === 'ar';

  const [items, setItems] = useState<StockItem[]>(() => {
    try {
      const saved = localStorage.getItem(INVENTORY_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return initialStock;
  });

  const [form, setForm] = useState({
    barcode: '',
    name: '',
    category: 'Huile',
    engine: '',
    quantity: '10',
    purchasePrice: '3000',
    salePrice: '4500',
    minQty: '5',
    supplier: 'Fournisseur DZ',
  });

  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(initialStock[0].id);

  // Sync from Supabase on mount
  useEffect(() => {
    fetchSupabaseTable<any>('inventory', '*').then((rows) => {
      if (rows && rows.length > 0) {
        setItems(
          rows.map((r: any) => ({
            id: String(r.id),
            barcode: r.barcode || `BAR-${r.id}`,
            name: r.product_name || 'Produit',
            category: r.category || 'Huile',
            engine: r.engine_compatibility || 'Tous moteurs',
            quantity: Number(r.quantity || r.stock_quantity || 0),
            minQty: Number(r.min_qty || 5),
            purchasePrice: Number(r.purchase_price || 0),
            salePrice: Number(r.sale_price || 0),
            supplier: r.supplier || 'Fournisseur',
            supplierPhone: r.supplier_phone || '+213 550 00 11 22',
            supplierContact: r.supplier_contact || 'Contact',
            location: r.location || 'Étagère A1',
            expiryDate: r.expiry_date || '2028-12-31',
            lastUpdated: r.updated_at ? r.updated_at.slice(0, 10) : new Date().toISOString().slice(0, 10),
            brand: r.brand || 'Marque',
            partNumber: r.part_number || 'N/A',
            warranty: r.warranty || '12 mois',
            notes: r.notes || '',
          }))
        );
      }
    });
  }, []);

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem(INVENTORY_KEY, JSON.stringify(items));
    } catch {}
  }, [items]);

  const filteredItems = useMemo(() => {
    const val = search.trim().toLowerCase();
    if (!val) return items;

    return items.filter((item) => {
      const text = `${item.barcode} ${item.name} ${item.engine} ${item.category} ${item.brand} ${item.supplier}`.toLowerCase();
      return text.includes(val);
    });
  }, [items, search]);

  const selectedProduct = useMemo(
    () => items.find((i) => i.id === selectedProductId) ?? filteredItems[0] ?? items[0] ?? null,
    [filteredItems, items, selectedProductId]
  );

  const totalStockValue = items.reduce((sum, i) => sum + i.quantity * i.purchasePrice, 0);
  const lowStockCount = items.filter((i) => i.quantity <= i.minQty).length;
  const totalUnits = items.reduce((sum, i) => sum + i.quantity, 0);

  const formatPrice = (v: number) => `DA ${new Intl.NumberFormat('fr-DZ').format(v)}`;

  const handleScanBarcode = () => {
    if (!form.barcode.trim()) {
      setMessage(isArabic ? 'يرجى إدخال أو مسح رمز الباركود أولاً.' : 'Veuillez saisir un code-barres.');
      return;
    }

    const match = items.find((i) => i.barcode.toLowerCase() === form.barcode.trim().toLowerCase());
    if (!match) {
      setMessage(
        isArabic
          ? 'القطعة غير موجودة بالمخزون، يمكنك تعبئة البيانات لإضافتها.'
          : 'Produit non trouvé, vous pouvez le créer.'
      );
      return;
    }

    setForm({
      barcode: match.barcode,
      name: match.name,
      category: match.category,
      engine: match.engine,
      quantity: String(match.quantity),
      purchasePrice: String(match.purchasePrice),
      salePrice: String(match.salePrice),
      minQty: String(match.minQty),
      supplier: match.supplier,
    });
    setSelectedProductId(match.id);
    setMessage(isArabic ? `تم العثور على القطعة: ${match.name}` : `Produit détecté : ${match.name}`);
  };

  const handleAddStock = async () => {
    if (!form.barcode.trim() || !form.name.trim()) {
      setMessage(isArabic ? 'الباركود واسم القطعة مطلوبان.' : 'Code-barres et nom requis.');
      return;
    }

    const qty = Number(form.quantity || 0);
    const purchase = Number(form.purchasePrice || 0);
    const sale = Number(form.salePrice || 0);
    const minQty = Number(form.minQty || 5);

    const existingIndex = items.findIndex(
      (i) => i.barcode.toLowerCase() === form.barcode.trim().toLowerCase()
    );

    if (existingIndex >= 0) {
      const existing = items[existingIndex];
      const updatedItem = {
        ...existing,
        name: form.name,
        quantity: existing.quantity + qty,
        purchasePrice: purchase > 0 ? purchase : existing.purchasePrice,
        salePrice: sale > 0 ? sale : existing.salePrice,
        minQty,
        lastUpdated: new Date().toISOString().slice(0, 10),
      };

      const nextItems = [...items];
      nextItems[existingIndex] = updatedItem;
      setItems(nextItems);

      // Supabase update
      try {
        await updateSupabaseRow('inventory', `barcode=eq.${encodeURIComponent(existing.barcode)}`, {
          quantity: updatedItem.quantity,
          purchase_price: updatedItem.purchasePrice,
          sale_price: updatedItem.salePrice,
        });
      } catch {}

      setMessage(isArabic ? 'تم تحديث كمية القطعة بنجاح!' : 'Quantité mise à jour avec succès !');
    } else {
      const newItem: StockItem = {
        id: `stk-${Date.now()}`,
        barcode: form.barcode.trim(),
        name: form.name.trim(),
        category: form.category,
        engine: form.engine.trim() || (isArabic ? 'متوافق مع عدة محركات' : 'Multi-moteurs'),
        quantity: qty,
        minQty,
        purchasePrice: purchase,
        salePrice: sale,
        supplier: form.supplier || 'Fournisseur Algérie',
        supplierPhone: '+213 550 00 00 00',
        supplierContact: 'Contact',
        location: 'Étagère A1',
        expiryDate: '2028-12-31',
        lastUpdated: new Date().toISOString().slice(0, 10),
        brand: 'MANNOL',
        partNumber: form.barcode.trim(),
        warranty: '12 mois',
        notes: isArabic ? 'منتج مضاف جديد' : 'Nouveau produit ajouté',
      };

      setItems([newItem, ...items]);
      setSelectedProductId(newItem.id);

      // Supabase insert
      try {
        await insertSupabaseRow('inventory', {
          garage_id: 1,
          barcode: newItem.barcode,
          product_name: newItem.name,
          category: newItem.category,
          quantity: newItem.quantity,
          min_qty: newItem.minQty,
          purchase_price: newItem.purchasePrice,
          sale_price: newItem.salePrice,
          supplier: newItem.supplier,
          location: newItem.location,
        });
      } catch {}

      setMessage(isArabic ? 'تمت إضافة القطعة الجديدة إلى المخزون بنجاح!' : 'Nouvel article ajouté au stock !');
    }

    setForm({
      barcode: '',
      name: '',
      category: 'Huile',
      engine: '',
      quantity: '10',
      purchasePrice: '3000',
      salePrice: '4500',
      minQty: '5',
      supplier: 'Fournisseur DZ',
    });
  };

  const quickAdd = (id: string, qty: number) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, quantity: i.quantity + qty, lastUpdated: new Date().toISOString().slice(0, 10) }
          : i
      )
    );
  };

  const cardSurface = isDark ? 'border-slate-800 bg-slate-900/90' : 'border-slate-200 bg-white shadow-sm';
  const subCard = isDark ? 'border-slate-800 bg-slate-950/70' : 'border-slate-200 bg-slate-50';
  const baseText = isDark ? 'text-white' : 'text-slate-900';
  const inputClass = isDark
    ? 'border-slate-700 bg-slate-950 text-white placeholder:text-slate-500 focus:border-amber-500'
    : 'border-slate-300 bg-white text-slate-900 placeholder:text-slate-400 focus:border-amber-500';

  return (
    <div className="space-y-5">
      {/* Top Header & Inventory KPIs */}
      <div className={`rounded-2xl border p-5 ${cardSurface}`}>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-500">
              {isArabic ? 'المخزون والقطع' : 'Stock & Pièces'}
            </p>
            <h2 className={`mt-1 text-2xl font-black sm:text-3xl ${baseText}`}>
              {isArabic ? 'إدارة المخزون وقطع الغيار والزيوت' : 'Gestion du stock & Pièces détachées'}
            </h2>
          </div>
          <span className="inline-flex rounded-xl bg-emerald-500/15 px-3 py-1.5 text-xs font-bold text-emerald-400">
            {isArabic ? 'مزامنة مباشرة 100%' : 'Synchronisé en direct'}
          </span>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <div className={`rounded-xl border p-3.5 ${subCard}`}>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Boxes size={15} />
              <span>{isArabic ? 'إجمالي القطع المتوفرة' : 'Unités en stock'}</span>
            </div>
            <p className={`mt-2 text-xl font-black ${baseText}`}>{totalUnits} {isArabic ? 'قطعة' : 'pcs'}</p>
          </div>

          <div className={`rounded-xl border p-3.5 ${subCard}`}>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <ShieldAlert size={15} className="text-amber-400" />
              <span>{isArabic ? 'تنبيهات انخفاض المخزون' : 'Alertes stock faible'}</span>
            </div>
            <p className="mt-2 text-xl font-black text-amber-400">{lowStockCount} {isArabic ? 'منتجات' : 'produits'}</p>
          </div>

          <div className={`col-span-2 rounded-xl border p-3.5 sm:col-span-1 ${subCard}`}>
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400">
              <Wallet size={15} />
              <span>{isArabic ? 'القيمة المالية للمخزون' : 'Valeur marchande'}</span>
            </div>
            <p className="mt-2 text-xl font-black text-emerald-400">{formatPrice(totalStockValue)}</p>
          </div>
        </div>
      </div>

      {/* Main Stock Interface */}
      <div className="grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        {/* Left: Add / Update Stock Item Form */}
        <div className={`rounded-2xl border p-5 space-y-4 ${cardSurface}`}>
          <div className="flex items-center gap-2 text-amber-500">
            <PackagePlus size={18} />
            <h3 className={`text-base font-bold ${baseText}`}>
              {isArabic ? 'إضافة / توريد قطع للمخزون' : 'Ajouter / Entrée de stock'}
            </h3>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                value={form.barcode}
                onChange={(e) => setForm({ ...form, barcode: e.target.value })}
                placeholder={isArabic ? 'رمز الباركود (مثال: HU-5W30-01)' : 'Code-barres'}
                className={`w-full rounded-xl border px-3 py-2 text-xs font-mono focus:outline-none ${inputClass}`}
              />
              <button
                type="button"
                onClick={handleScanBarcode}
                className="inline-flex items-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-400 hover:bg-amber-500/20"
              >
                <Barcode size={15} />
                <span>{isArabic ? 'مسح' : 'Scanner'}</span>
              </button>
            </div>

            <input
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder={isArabic ? 'اسم القطعة أو نوع الزيت *' : 'Nom du produit *'}
              className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
            />

            <div className="grid grid-cols-2 gap-2">
              <select
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
                className={`rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
              >
                <option value="Huile">{isArabic ? 'زيت محرك' : 'Huile'}</option>
                <option value="Filtre">{isArabic ? 'فلتر' : 'Filtre'}</option>
                <option value="Liquide">{isArabic ? 'سوائل وفرامل' : 'Liquide'}</option>
                <option value="Pièce">{isArabic ? 'قطع أخرى' : 'Autre pièce'}</option>
              </select>

              <input
                value={form.engine}
                onChange={(e) => setForm({ ...form, engine: e.target.value })}
                placeholder={isArabic ? 'توافق المحرك (Clio, X5...)' : 'Compatibilité moteur'}
                className={`rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">{isArabic ? 'الكمية المضافة' : 'Quantité'}</label>
                <input
                  type="number"
                  min={1}
                  value={form.quantity}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                  className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">{isArabic ? 'الحد الأدنى للتنبيه' : 'Alerte mini'}</label>
                <input
                  type="number"
                  min={1}
                  value={form.minQty}
                  onChange={(e) => setForm({ ...form, minQty: e.target.value })}
                  className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">{isArabic ? 'سعر الشراء (دج)' : 'Prix d’achat'}</label>
                <input
                  type="number"
                  value={form.purchasePrice}
                  onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
                  className={`w-full rounded-xl border px-3 py-2 text-xs focus:outline-none ${inputClass}`}
                />
              </div>
              <div>
                <label className="mb-1 block text-[11px] text-slate-400">{isArabic ? 'سعر البيع للزبون (دج)' : 'Prix de vente'}</label>
                <input
                  type="number"
                  value={form.salePrice}
                  onChange={(e) => setForm({ ...form, salePrice: e.target.value })}
                  className={`w-full rounded-xl border px-3 py-2 text-xs font-bold text-amber-500 focus:outline-none ${inputClass}`}
                />
              </div>
            </div>

            {message && (
              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-2.5 text-xs text-amber-300">
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handleAddStock}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 py-2.5 text-xs font-bold text-slate-950 shadow-md shadow-amber-500/20 hover:brightness-105 active:scale-95"
            >
              {isArabic ? 'حفظ القطعة في المخزون' : 'Ajouter / Mettre à jour le stock'}
            </button>
          </div>
        </div>

        {/* Right: Stock Items Table & Item Details */}
        <div className={`rounded-2xl border p-5 space-y-4 ${cardSurface}`}>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-amber-500">
              <TrendingUp size={18} />
              <h3 className={`text-base font-bold ${baseText}`}>
                {isArabic ? 'قائمة المواد المتوفرة' : 'Inventaire disponible'}
              </h3>
            </div>

            <div className="relative w-full max-w-xs">
              <Search size={15} className={`pointer-events-none absolute top-2.5 text-slate-400 ${isArabic ? 'right-3' : 'left-3'}`} />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isArabic ? 'بحث بالاسم، الباركود...' : 'Recherche stock...'}
                className={`w-full rounded-xl border py-1.5 text-xs focus:outline-none ${isArabic ? 'pr-8 pl-3' : 'pl-8 pr-3'} ${inputClass}`}
              />
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
            {/* Table */}
            <div className="max-h-96 overflow-y-auto rounded-xl border border-slate-800">
              <table className="w-full text-start text-xs">
                <thead className={`sticky top-0 ${isDark ? 'bg-slate-950 text-slate-400' : 'bg-slate-100 text-slate-600'}`}>
                  <tr>
                    <th className="py-2 px-3">{isArabic ? 'القطعة' : 'Produit'}</th>
                    <th className="py-2 px-3">{isArabic ? 'الكمية' : 'Qté'}</th>
                    <th className="py-2 px-3">{isArabic ? 'الحالة' : 'Statut'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/40">
                  {filteredItems.map((item) => {
                    const isLow = item.quantity <= item.minQty;
                    const isSelected = selectedProduct?.id === item.id;
                    return (
                      <tr
                        key={item.id}
                        onClick={() => setSelectedProductId(item.id)}
                        className={`cursor-pointer transition ${
                          isSelected
                            ? 'bg-amber-500/15'
                            : isDark ? 'hover:bg-slate-800/40' : 'hover:bg-slate-50'
                        }`}
                      >
                        <td className="py-2.5 px-3">
                          <strong className={baseText}>{item.name}</strong>
                          <div className="font-mono text-[10px] text-amber-400">{item.barcode}</div>
                        </td>
                        <td className={`py-2.5 px-3 font-bold ${baseText}`}>{item.quantity}</td>
                        <td className="py-2.5 px-3">
                          <span
                            className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                              isLow ? 'bg-rose-500/15 text-rose-400' : 'bg-emerald-500/15 text-emerald-400'
                            }`}
                          >
                            {isLow ? (isArabic ? 'منخفض' : 'Faible') : (isArabic ? 'متوفر' : 'OK')}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Selected Item Card */}
            {selectedProduct ? (
              <div className={`space-y-3 rounded-xl border p-4 text-xs ${subCard}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-amber-400">{selectedProduct.category}</span>
                    <h4 className={`text-sm font-bold ${baseText}`}>{selectedProduct.name}</h4>
                  </div>
                  <span className="rounded-lg bg-slate-800 px-2 py-0.5 font-mono text-amber-400">
                    {selectedProduct.barcode}
                  </span>
                </div>

                <div className="space-y-1.5 border-t border-slate-800 pt-2 text-slate-300">
                  <div className="flex justify-between"><span className="text-slate-500">{isArabic ? 'الماركة:' : 'Marque:'}</span> <strong>{selectedProduct.brand}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">{isArabic ? 'سعر الشراء:' : 'Achat:'}</span> <span>{formatPrice(selectedProduct.purchasePrice)}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">{isArabic ? 'سعر البيع:' : 'Vente:'}</span> <strong className="text-emerald-400">{formatPrice(selectedProduct.salePrice)}</strong></div>
                  <div className="flex justify-between"><span className="text-slate-500">{isArabic ? 'المورد:' : 'Fournisseur:'}</span> <span>{selectedProduct.supplier}</span></div>
                  <div className="flex justify-between"><span className="text-slate-500">{isArabic ? 'الموقع في الورشة:' : 'Emplacement:'}</span> <span>{selectedProduct.location}</span></div>
                </div>

                <button
                  type="button"
                  onClick={() => quickAdd(selectedProduct.id, 5)}
                  className="w-full rounded-xl border border-amber-500/40 bg-amber-500/10 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20"
                >
                  + 5 {isArabic ? 'قطع توريد سريع' : 'unités'}
                </button>
                <button
                  type="button"
                  onClick={() => window.print()}
                  className="no-print inline-flex w-full items-center justify-center gap-1.5 rounded-xl border border-amber-500/40 bg-amber-500/10 py-1.5 text-xs font-bold text-amber-400 hover:bg-amber-500/20"
                >
                  <Printer size={14} /> {isArabic ? 'طباعة طلب شراء' : 'Imprimer bon de commande'}
                </button>
                <div className="print-ticket print-only rounded-xl border border-slate-300 bg-white p-6 text-slate-900">
                  <h1 className="text-xl font-black">{isArabic ? 'طلب شراء' : 'Bon de commande fournisseur'}</h1>
                  <p className="mt-3">{selectedProduct.supplier}</p>
                  <p>{selectedProduct.name} ({selectedProduct.partNumber})</p>
                  <p className="mt-2">{isArabic ? 'الكمية المطلوبة:' : 'Quantité demandée :'} {Math.max(5, selectedProduct.minQty - selectedProduct.quantity + 5)}</p>
                  <p>{isArabic ? 'سعر الوحدة:' : 'Prix unitaire :'} {formatPrice(selectedProduct.purchasePrice)}</p>
                  <p>{isArabic ? 'التاريخ:' : 'Date :'} {new Date().toLocaleDateString('fr-DZ')}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
