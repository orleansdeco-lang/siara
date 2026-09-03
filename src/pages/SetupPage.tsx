import { ChangeEvent, FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ImagePlus, MapPin, Phone, Save, UserRound } from 'lucide-react';
import { useAuthStore, GarageProfile } from '../store/authStore';
import { useGarageStore } from '../store/store';

const defaultProfile: GarageProfile = { name: '', wilaya: '', address: '', storefrontImage: '', ownerName: '', workshopPhone: '', ownerPhone: '' };

export function SetupPage() {
  const navigate = useNavigate();
  const account = useAuthStore((state) => state.account);
  const updateProfile = useAuthStore((state) => state.updateProfile);
  const setGarage = useGarageStore((state) => state.setGarage);
  const [profile, setProfile] = useState<GarageProfile>(account?.profile ?? defaultProfile);
  const [saved, setSaved] = useState(false);

  if (!account) {
    return <a href="/auth" className="block p-8 text-center text-amber-400">Connexion requise</a>;
  }

  const update = (key: keyof GarageProfile, value: string) => setProfile((current) => ({ ...current, [key]: value }));
  const uploadImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update('storefrontImage', String(reader.result));
    reader.readAsDataURL(file);
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    updateProfile(profile);
    setGarage({ name: profile.name, address: `${profile.address}, ${profile.wilaya}`, phone: profile.workshopPhone });
    setSaved(true);
    window.setTimeout(() => navigate('/'), 500);
  };

  return (
    <div className="min-h-screen bg-slate-950 px-4 py-8 text-slate-100">
      <div className="mx-auto max-w-3xl rounded-3xl border border-slate-800 bg-slate-900/90 p-5 sm:p-8">
        <div className="mb-6 flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-orange-400 text-slate-950"><UserRound size={23} /></div><div><p className="text-xs uppercase tracking-[0.2em] text-amber-300">SIARA</p><h1 className="text-2xl font-black">Informations du محل</h1></div></div>
        <form onSubmit={submit} className="space-y-5">
          <div className="grid gap-3 sm:grid-cols-2">
            {([['name', 'Nom du محل / atelier', 'text'], ['wilaya', 'Wilaya', 'text'], ['address', 'Adresse', 'text'], ['ownerName', 'Nom du propriétaire', 'text'], ['workshopPhone', 'Téléphone du محل', 'tel'], ['ownerPhone', 'Téléphone du propriétaire', 'tel']] as const).map(([key, label, type]) => <label key={key} className="block"><span className="mb-1 block text-xs font-semibold text-slate-400">{label}</span><div className="relative">{key === 'wilaya' || key === 'address' ? <MapPin className="absolute left-3 top-3 h-4 w-4 text-slate-500" /> : key.includes('Phone') ? <Phone className="absolute left-3 top-3 h-4 w-4 text-slate-500" /> : null}<input type={type} value={profile[key]} onChange={(event) => update(key, event.target.value)} className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2.5 text-sm outline-none focus:border-amber-500" required={key !== 'ownerPhone'} /></div></label>)}
          </div>
          <label className="block"><span className="mb-2 block text-xs font-semibold text-slate-400">Photo واجهة المحل</span><div className="relative flex min-h-36 items-center justify-center overflow-hidden rounded-2xl border border-dashed border-slate-700 bg-slate-950">{profile.storefrontImage ? <img src={profile.storefrontImage} alt="Façade du محل" className="h-48 w-full object-cover" /> : <div className="text-center text-slate-500"><ImagePlus className="mx-auto mb-2" /><span className="text-xs">JPG / PNG</span></div>}<input type="file" accept="image/*" onChange={uploadImage} className="absolute h-0 w-0 opacity-0" id="storefront-image" /><label htmlFor="storefront-image" className="absolute cursor-pointer rounded-xl bg-amber-500 px-3 py-2 text-xs font-bold text-slate-950">Choisir une photo</label></div></label>
          <button type="submit" className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-400 px-4 py-3 font-bold text-slate-950"><Save size={17} />{saved ? 'Enregistré ✓' : 'Enregistrer et ouvrir SIARA'}</button>
        </form>
      </div>
    </div>
  );
}
