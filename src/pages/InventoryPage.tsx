import { useMemo, useState } from 'react';
import { Barcode, Boxes, PackagePlus, ShieldAlert, TrendingUp, Wallet } from 'lucide-react';
import { useUiStore } from '../store/store';

type StockItem = {
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

const seedStock: StockItem[] = [
  {
    id: 'stk-1',
    barcode: 'HU-5W30-01',
    name: 'Huile moteur 5W-30',
    category: 'Huile',
    engine: 'Renault Clio IV / K9K 1.5 dCi 90',
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
    notes: 'Huile synthétique semi-rapide, compatible Renault / Peugeot / VW',
  },
  {
    id: 'stk-2',
    barcode: 'FIL-HU-719',
    name: 'Filtre à huile MANN HU 719/7x',
    category: 'Filtre',
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
    notes: 'Filtre compatible Renault, Dacia, Nissan et Fiat',
  },
  {
    id: 'stk-3',
    barcode: 'FIL-AIR-2812',
    name: 'Filtre à air MANN CU 2812',
    category: 'Filtre',
    engine: 'Mercedes C-Class / OM651 2.1 CDI 170',
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
    notes: 'Pour moteur diesel / filtration renforcée',
  },
  {
    id: 'stk-4',
    barcode: 'LIQ-BRAKE-01',
    name: 'Liquide de frein DOT 4',
    category: 'Liquide',
    engine: 'Tous moteurs',
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
    notes: 'Stock standard pour freinage et entretien',
  },
];

const initialForm = {
  barcode: '',
  name: '',
  category: 'Huile',
  engine: 'Renault Clio IV / K9K 1.5 dCi 90',
  quantity: '12',
  purchasePrice: '3200',
  salePrice: '5400',
  minQty: '8',
};

function formatMoney(value: number) {
  return `DA ${new Intl.NumberFormat('fr-DZ').format(value)}`;
}

export function InventoryPage() {
  const { language } = useUiStore();
  const isArabic = language === 'ar';

  const [items, setItems] = useState<StockItem[]>(seedStock);
  const [form, setForm] = useState(initialForm);
  const [search, setSearch] = useState('');
  const [message, setMessage] = useState('');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(seedStock[0]?.id ?? null);

  const filteredItems = useMemo(() => {
    const value = search.trim().toLowerCase();
    if (!value) return items;
    return items.filter((item) => {
      const text = `${item.barcode} ${item.name} ${item.engine} ${item.category} ${item.supplier} ${item.brand} ${item.partNumber}`.toLowerCase();
      return text.includes(value);
    });
  }, [items, search]);

  const selectedProduct = useMemo(
    () => items.find((item) => item.id === selectedProductId) ?? filteredItems[0] ?? items[0] ?? null,
    [filteredItems, items, selectedProductId],
  );

  const totalStockValue = items.reduce((sum, item) => sum + item.quantity * item.purchasePrice, 0);
  const lowStockCount = items.filter((item) => item.quantity <= item.minQty).length;
  const totalUnits = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleScanBarcode = () => {
    if (!form.barcode.trim()) {
      setMessage(isArabic ? 'Veuillez saisir un code-barres.' : 'Veuillez saisir un code-barres.');
      return;
    }

    const match = items.find((item) => item.barcode.toLowerCase() === form.barcode.trim().toLowerCase());
    if (!match) {
      setMessage(isArabic ? 'Produit non trouvé, vous pouvez l’ajouter.' : 'Produit non trouvé, vous pouvez l’ajouter.');
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
    });

    setMessage(
      isArabic ? `Produit détecté : ${match.name}` : `Produit détecté : ${match.name}`,
    );
  };

  const handleAddStock = () => {
    if (!form.barcode.trim() || !form.name.trim()) {
      setMessage(isArabic ? 'Code-barres et nom requis.' : 'Code-barres et nom requis.');
      return;
    }

    const qty = Number(form.quantity || 0);
    const purchase = Number(form.purchasePrice || 0);
    const sale = Number(form.salePrice || 0);
    const minQty = Number(form.minQty || 0);

    if (qty <= 0 || purchase <= 0 || sale <= 0) {
      setMessage(isArabic ? 'Quantité et prix doivent être valides.' : 'Quantité et prix doivent être valides.');
      return;
    }

    setItems((current) => {
      const existingIndex = current.findIndex((item) => item.barcode.toLowerCase() === form.barcode.trim().toLowerCase());
      if (existingIndex >= 0) {
        const existing = current[existingIndex];
        const updated = [...current];
        updated[existingIndex] = {
          ...existing,
          name: form.name,
          category: form.category,
          engine: form.engine,
          quantity: existing.quantity + qty,
          minQty,
          purchasePrice: purchase,
          salePrice: sale,
            supplier: existing.supplier,
            supplierPhone: existing.supplierPhone,
            supplierContact: existing.supplierContact,
            location: existing.location,
            expiryDate: existing.expiryDate,
            lastUpdated: new Date().toISOString().slice(0, 10),
            brand: existing.brand,
            partNumber: existing.partNumber,
            warranty: existing.warranty,
            notes: existing.notes,
          };
          return updated;
        }

        return [
          {
            id: `stk-${Date.now()}`,
            barcode: form.barcode.trim(),
            name: form.name.trim(),
            category: form.category,
            engine: form.engine,
            quantity: qty,
            minQty,
            purchasePrice: purchase,
            salePrice: sale,
            supplier: 'Fournisseur à définir',
            supplierPhone: '+213 000 000 000',
            supplierContact: 'Contact',
            location: 'À affecter',
            expiryDate: '2027-12-31',
            lastUpdated: new Date().toISOString().slice(0, 10),
            brand: 'Brand',
            partNumber: 'N/A',
            warranty: 'N/A',
            notes: 'Produit ajouté manuellement',
          },
          ...current,
        ];
      });

    setMessage(isArabic ? 'Stock ajouté avec succès.' : 'Stock ajouté avec succès.');
    setForm(initialForm);
  };

  const quickAdd = (id: string, qty: number) => {
    setItems((current) =>
      current.map((item) =>
        item.id === id
          ? {
              ...item,
              quantity: item.quantity + qty,
              lastUpdated: new Date().toISOString().slice(0, 10),
            }
          : item,
      ),
    );
  };

  return (
    <div className="space-y-5">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs uppercase tracking-[0.25em] text-amber-400">{isArabic ? 'المخزون' : 'Stock'}</p>
            <h2 className="mt-2 text-3xl font-bold text-white">{isArabic ? 'إدارة المخزون' : 'Gestion du stock'}</h2>
          </div>
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
            {isArabic ? 'محدث' : 'Live'}
          </div>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Boxes size={16} />
              <span className="text-sm">{isArabic ? 'إجمالي القطع' : 'Pièces totales'}</span>
            </div>
            <div className="mt-3 text-2xl font-bold text-white">{totalUnits}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <ShieldAlert size={16} />
              <span className="text-sm">{isArabic ? 'تنبيهات المخزون' : 'Alertes stock'}</span>
            </div>
            <div className="mt-3 text-2xl font-bold text-amber-300">{lowStockCount}</div>
          </div>
          <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
            <div className="flex items-center gap-2 text-slate-400">
              <Wallet size={16} />
              <span className="text-sm">{isArabic ? 'قيمة المخزون' : 'Valeur stock'}</span>
            </div>
            <div className="mt-3 text-2xl font-bold text-white">{formatMoney(totalStockValue)}</div>
          </div>
        </div>
      </div>

      <div className="grid gap-5 xl:grid-cols-[0.92fr_1.38fr]">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="mb-4 flex items-center gap-2 text-amber-300">
            <PackagePlus size={18} />
            <h3 className="text-lg font-semibold text-white">{isArabic ? 'إضافة قطعة جديدة' : 'Ajouter une pièce'}</h3>
          </div>

          <div className="space-y-3">
            <div className="flex gap-2">
              <input
                value={form.barcode}
                onChange={(event) => setForm((current) => ({ ...current, barcode: event.target.value }))}
                placeholder={isArabic ? 'Code-barres' : 'Code-barres'}
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={handleScanBarcode}
                className="inline-flex items-center gap-2 rounded-xl border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm text-amber-300"
              >
                <Barcode size={16} />
                {isArabic ? 'مسح' : 'Scanner'}
              </button>
            </div>

            <input
              value={form.name}
              onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
              placeholder={isArabic ? 'Nom de la pièce' : 'Nom de la pièce'}
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <select
                value={form.category}
                onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white focus:border-amber-500 focus:outline-none"
              >
                <option value="Huile">Huile</option>
                <option value="Filtre">Filtre</option>
                <option value="Liquide">Liquide</option>
                <option value="Autre">Autre</option>
              </select>

              <input
                value={form.engine}
                onChange={(event) => setForm((current) => ({ ...current, engine: event.target.value }))}
                placeholder={isArabic ? 'Moteur / compatibilité' : 'Moteur / compatibilité'}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="number"
                min={0}
                value={form.quantity}
                onChange={(event) => setForm((current) => ({ ...current, quantity: event.target.value }))}
                placeholder={isArabic ? 'Quantité ajoutée' : 'Quantité ajoutée'}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              />
              <input
                type="number"
                min={0}
                value={form.minQty}
                onChange={(event) => setForm((current) => ({ ...current, minQty: event.target.value }))}
                placeholder={isArabic ? 'Quantité minimale' : 'Quantité minimale'}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <input
                type="number"
                min={0}
                value={form.purchasePrice}
                onChange={(event) => setForm((current) => ({ ...current, purchasePrice: event.target.value }))}
                placeholder={isArabic ? 'Prix d’achat' : 'Prix d’achat'}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              />
              <input
                type="number"
                min={0}
                value={form.salePrice}
                onChange={(event) => setForm((current) => ({ ...current, salePrice: event.target.value }))}
                placeholder={isArabic ? 'Prix de vente' : 'Prix de vente'}
                className="rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
              />
            </div>

            {message && (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-sm text-emerald-300">
                {message}
              </div>
            )}

            <button
              type="button"
              onClick={handleAddStock}
              className="w-full rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 px-3 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-amber-500/20"
            >
              {isArabic ? 'Ajouter au stock' : 'Ajouter au stock'}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-amber-300">
              <TrendingUp size={18} />
              <h3 className="text-lg font-semibold text-white">{isArabic ? 'Stock actuel' : 'Stock actuel'}</h3>
            </div>
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={isArabic ? 'Rechercher...' : 'Rechercher...'}
              className="w-52 rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-sm text-white placeholder:text-slate-500 focus:border-amber-500 focus:outline-none"
            />
          </div>

          <div className="grid gap-4 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="overflow-hidden rounded-xl border border-slate-800">
              <div className="max-h-[420px] overflow-auto">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-slate-950 text-slate-300">
                    <tr>
                      <th className="px-3 py-2">Code</th>
                      <th className="px-3 py-2">Produit</th>
                      <th className="px-3 py-2">Qté</th>
                      <th className="px-3 py-2">Statut</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredItems.map((item) => {
                      const low = item.quantity <= item.minQty;
                      return (
                        <tr
                          key={item.id}
                          onClick={() => setSelectedProductId(item.id)}
                          className={`cursor-pointer border-t border-slate-800 ${selectedProduct?.id === item.id ? 'bg-slate-800/80' : 'bg-slate-900/80'} text-slate-200`}
                        >
                          <td className="px-3 py-2 font-medium text-amber-300">{item.barcode}</td>
                          <td className="px-3 py-2">
                            <div className="font-medium text-white">{item.name}</div>
                            <div className="text-xs text-slate-400">{item.category}</div>
                          </td>
                          <td className="px-3 py-2 font-semibold text-white">{item.quantity}</td>
                          <td className="px-3 py-2">
                            <span className={`rounded-full px-2 py-1 text-[10px] font-medium ${low ? 'bg-amber-500/15 text-amber-300' : 'bg-emerald-500/15 text-emerald-300'}`}>
                              {low ? (isArabic ? 'Faible' : 'Faible') : (isArabic ? 'OK' : 'OK')}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-xl border border-slate-800 bg-slate-950/70 p-4">
              {selectedProduct ? (
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <div className="text-[10px] uppercase tracking-[0.25em] text-slate-500">Produit</div>
                      <div className="mt-1 text-lg font-semibold text-white">{selectedProduct.name}</div>
                    </div>
                    <span className="rounded-full bg-amber-500/15 px-2 py-1 text-[10px] text-amber-300">{selectedProduct.category}</span>
                  </div>

                  <div className="grid gap-2 text-sm text-slate-300">
                    <div className="flex justify-between gap-3"><span>Code-barres</span><span className="text-white font-medium">{selectedProduct.barcode}</span></div>
                    <div className="flex justify-between gap-3"><span>Marque</span><span className="text-white font-medium">{selectedProduct.brand}</span></div>
                    <div className="flex justify-between gap-3"><span>Référence</span><span className="text-white font-medium">{selectedProduct.partNumber}</span></div>
                    <div className="flex justify-between gap-3"><span>Compatibilité moteur</span><span className="text-white font-medium text-right">{selectedProduct.engine}</span></div>
                    <div className="flex justify-between gap-3"><span>Quantité</span><span className="text-white font-medium">{selectedProduct.quantity}</span></div>
                    <div className="flex justify-between gap-3"><span>Min.</span><span className="text-white font-medium">{selectedProduct.minQty}</span></div>
                    <div className="flex justify-between gap-3"><span>Prix achat</span><span className="text-white font-medium">{formatMoney(selectedProduct.purchasePrice)}</span></div>
                    <div className="flex justify-between gap-3"><span>Prix vente</span><span className="text-emerald-300 font-medium">{formatMoney(selectedProduct.salePrice)}</span></div>
                    <div className="flex justify-between gap-3"><span>Fournisseur</span><span className="text-white font-medium text-right">{selectedProduct.supplier}</span></div>
                    <div className="flex justify-between gap-3"><span>Contact</span><span className="text-white font-medium text-right">{selectedProduct.supplierContact}</span></div>
                    <div className="flex justify-between gap-3"><span>Tél.</span><span className="text-white font-medium">{selectedProduct.supplierPhone}</span></div>
                    <div className="flex justify-between gap-3"><span>Emplacement</span><span className="text-white font-medium">{selectedProduct.location}</span></div>
                    <div className="flex justify-between gap-3"><span>Expiration</span><span className="text-white font-medium">{selectedProduct.expiryDate}</span></div>
                    <div className="flex justify-between gap-3"><span>Garantie</span><span className="text-white font-medium">{selectedProduct.warranty}</span></div>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/80 p-3 text-sm text-slate-300">
                    <div className="mb-1 text-[10px] uppercase tracking-[0.2em] text-slate-500">Notes</div>
                    <div>{selectedProduct.notes}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => quickAdd(selectedProduct.id, 10)}
                    className="w-full rounded-xl border border-amber-500/50 bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-300"
                  >
                    +10 unités
                  </button>
                </div>
              ) : (
                <div className="text-sm text-slate-400">Aucun produit sélectionné</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}