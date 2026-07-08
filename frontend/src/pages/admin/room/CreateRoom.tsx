import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../../../components/ui/button';
import { CheckCircle2, MapPin, BedDouble, Images, BadgeIndianRupee, Settings } from 'lucide-react';
import { API_DIR_URL } from '../../../lib/api';

interface CreateRoomForm {
  room_name: string;
  room_code: string;
  floor_number: number;
  base_price: number;
  price_12_hours?: number;
  price_24_hours?: number;
  weekend_price?: number;
  festival_price?: number;
  extra_bed_price?: number;
  max_adults: number;
  max_children: number;
  max_guests: number;
  room_size: string;
  bed_type: string;
  number_of_beds: number;
  balcony: boolean;
  air_conditioning: boolean;
  smoking_allowed: boolean;
  amenities: string[];
  short_description: string;
  full_description: string;
  highlights: string;
  house_rules: string;
  status: string;
  show_on_website: boolean;
  featured_image: FileList;
  gallery_images?: FileList;
}

const STEPS = [
  { id: 1, title: 'Identity', icon: BedDouble },
  { id: 2, title: 'Rates', icon: BadgeIndianRupee },
  { id: 3, title: 'Specs', icon: MapPin },
  { id: 4, title: 'Features', icon: CheckCircle2 },
  { id: 5, title: 'Media', icon: Images },
  { id: 6, title: 'Publish', icon: Settings }
];

interface CreateRoomProps {
  initialData?: any;
  onSuccess?: () => void;
  onCancel?: () => void;
}

// The list endpoint (`rooms/categories`) returns a different shape than the form fields
// (e.g. `title` not `room_name`, `price_24h` not `base_price`) — translate for edit mode.
const mapCategoryToForm = (cat: any): Partial<CreateRoomForm> => ({
  room_name: cat.title ?? cat.room_name,
  room_code: cat.room_code ?? '',
  base_price: cat.price_24h ?? cat.base_price,
  price_12_hours: cat.price_12h,
  price_24_hours: cat.price_24h,
  max_adults: cat.adults ?? cat.max_adults ?? 2,
  max_children: cat.children ?? cat.max_children ?? 0,
  max_guests: cat.max_guests ?? 0,
  room_size: cat.size ?? cat.room_size,
  bed_type: cat.bed_type,
  number_of_beds: cat.beds_count ?? cat.number_of_beds,
  balcony: !!cat.balcony,
  air_conditioning: cat.ac ?? cat.air_conditioning ?? true,
  smoking_allowed: !!cat.smoking,
  amenities: cat.amenities ?? [],
  short_description: cat.description ?? cat.short_description ?? '',
  full_description: cat.full_description ?? '',
  highlights: cat.highlights ?? '',
  house_rules: cat.house_rules ?? '',
  status: cat.status ?? 'Available',
  show_on_website: cat.show_on_website ?? true,
});

export const CreateRoom: React.FC<CreateRoomProps> = ({ initialData, onSuccess, onCancel }) => {
  const isEditMode = !!initialData;
  const { register, handleSubmit, formState: { }, trigger, reset } = useForm<CreateRoomForm>({
    defaultValues: initialData ? mapCategoryToForm(initialData) : {
      status: 'Available',
      show_on_website: true,
      max_adults: 2,
      max_children: 0,
      balcony: false,
      air_conditioning: true,
      smoking_allowed: false
    }
  });

  const [subRoomCount, setSubRoomCount] = useState(5);
  const [roomNumbers, setRoomNumbers] = useState<string[]>(Array(5).fill(''));

  const handleSubRoomCountChange = (count: number) => {
    const safeCount = Math.max(1, Math.min(50, count || 1));
    setSubRoomCount(safeCount);
    setRoomNumbers((prev) => {
      const next = [...prev];
      while (next.length < safeCount) next.push('');
      return next.slice(0, safeCount);
    });
  };

  useEffect(() => {
    if (initialData) {
      reset(mapCategoryToForm(initialData));
      if (initialData.image) setFeaturedPreview(initialData.image);
    }
  }, [initialData, reset]);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [featuredPreview, setFeaturedPreview] = useState<string | null>(null);
  const [featuredFile, setFeaturedFile] = useState<File | null>(null);
  const handleFeaturedChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFeaturedFile(file);
      setFeaturedPreview(URL.createObjectURL(file));
    }
  };

  const nextStep = async () => {
    let fieldsToValidate: any[] = [];
    if (currentStep === 1) fieldsToValidate = ['room_name'];
    if (currentStep === 2) fieldsToValidate = ['base_price'];

    if (fieldsToValidate.length > 0) {
      const isValid = await trigger(fieldsToValidate as any);
      if (!isValid) return;
    }
    if (currentStep === 1 && !isEditMode && roomNumbers.some((n) => !n.trim())) {
      setSubmitError('Please fill in a room number for every physical room in this category.');
      return;
    }
    setSubmitError('');
    setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
  };

  const prevStep = () => setCurrentStep((prev) => Math.max(prev - 1, 1));

  const onSubmit = async (data: CreateRoomForm) => {
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const formData = new FormData();
      Object.keys(data).forEach((key) => {
        if (['featured_image', 'gallery_images'].includes(key)) return;
        if (key === 'amenities') {
          if (data.amenities) formData.append('amenities', data.amenities.join(','));
        } else {
          // @ts-ignore
          formData.append(key, data[key]);
        }
      });
      if (featuredFile) formData.append('featured_image', featuredFile);
      if (!isEditMode) formData.append('room_numbers', JSON.stringify(roomNumbers.map((n) => n.trim())));

      if (isEditMode) formData.append('id', initialData.id);

      const apiUrl = isEditMode
        ? `${API_DIR_URL}/admin/rooms/update.php`
        : `${API_DIR_URL}/admin/rooms/create.php`;

      const response = await fetch(apiUrl, { method: 'POST', body: formData });
      const result = await response.json();

      if (!response.ok || !result.success) throw new Error(result.message || 'Error');

      setSuccessMessage('Successfully Saved!');
      if (onSuccess) setTimeout(onSuccess, 1000);
    } catch (err: any) {
      setSubmitError(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden font-sans">
      <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{isEditMode ? 'Edit Configuration' : 'New Room Configuration'}</h1>
          <p className="text-sm text-slate-500 font-medium">Step {currentStep} of {STEPS.length}: {STEPS[currentStep-1].title}</p>
        </div>
        <div className="flex gap-2">
          {STEPS.map(s => (
            <div key={s.id} className={`w-2 h-2 rounded-full ${currentStep === s.id ? 'bg-emerald-600 w-6' : currentStep > s.id ? 'bg-emerald-200' : 'bg-slate-200'} transition-all`} />
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-10">
        <div className="min-h-[400px]">
          {currentStep === 1 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Category Name</label>
                  <input {...register('room_name', { required: true })} className="w-full border border-slate-200 p-4 rounded-xl outline-none focus:border-emerald-600 bg-slate-50" placeholder="e.g. Heritage Suite" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Internal ID Code</label>
                  <input {...register('room_code')} className="w-full border border-slate-200 p-4 rounded-xl outline-none bg-slate-50" placeholder="SR-101" />
                </div>
                {!isEditMode && (
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Number of Physical Rooms</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={subRoomCount}
                      onChange={(e) => handleSubRoomCountChange(parseInt(e.target.value, 10))}
                      className="w-full border border-slate-200 p-4 rounded-xl outline-none focus:border-emerald-600 bg-slate-50"
                    />
                    <p className="text-[10px] text-slate-400">How many actual physical rooms exist under this category (e.g. 5).</p>
                  </div>
                )}
              </div>

              {!isEditMode && (
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Room Numbers ({roomNumbers.length})</label>
                  <div className="grid grid-cols-3 gap-4">
                    {roomNumbers.map((num, idx) => (
                      <input
                        key={idx}
                        value={num}
                        onChange={(e) => {
                          const next = [...roomNumbers];
                          next[idx] = e.target.value;
                          setRoomNumbers(next);
                        }}
                        placeholder={`Room ${idx + 1} number`}
                        className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:border-emerald-600 bg-slate-50 text-sm"
                      />
                    ))}
                  </div>
                  <p className="text-[10px] text-slate-400">Each entry becomes a bookable physical room (e.g. SD-01, SD-02...) under this category.</p>
                </div>
              )}
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
               <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Base Rate (₹)</label>
                  <input type="number" {...register('base_price', { required: true })} className="w-full border border-slate-200 p-4 rounded-xl outline-none focus:border-emerald-600 text-emerald-600 font-bold text-xl" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Weekend Surcharge (₹)</label>
                  <input type="number" {...register('weekend_price')} className="w-full border border-slate-200 p-4 rounded-xl outline-none" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
              <div className="grid grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Max Adults</label>
                  <input type="number" {...register('max_adults')} className="w-full border border-slate-200 p-4 rounded-xl text-center font-bold" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Bed Type</label>
                  <select {...register('bed_type')} className="w-full border border-slate-200 p-4 rounded-xl">
                    <option value="King Size">King Size</option>
                    <option value="Queen Size">Queen Size</option>
                    <option value="Double Bed">Double Bed</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Size (sqft)</label>
                  <input {...register('room_size')} className="w-full border border-slate-200 p-4 rounded-xl" placeholder="450" />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
               <div className="grid grid-cols-2 gap-x-12 gap-y-6 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  {['WiFi', 'TV', 'Mini Fridge', 'AC', 'Balcony', 'Rain Shower', 'Room Service', 'Workspace'].map(item => (
                    <label key={item} className="flex items-center gap-3 cursor-pointer">
                      <input type="checkbox" value={item} {...register('amenities')} className="w-5 h-5 accent-emerald-600" />
                      <span className="text-sm font-bold text-slate-700">{item}</span>
                    </label>
                  ))}
               </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-8 animate-in slide-in-from-right-4">
               <div className="space-y-4">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Main Card Image</label>
                  {featuredPreview ? (
                    <div className="relative w-72 aspect-video rounded-xl overflow-hidden shadow-md">
                      <img src={featuredPreview} className="w-full h-full object-cover" />
                      <button type="button" onClick={() => setFeaturedPreview(null)} className="absolute top-2 right-2 bg-white text-rose-600 rounded-full w-6 h-6 font-bold shadow-sm">✕</button>
                    </div>
                  ) : (
                    <label className="w-72 aspect-video border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-slate-50 transition-colors">
                      <Images className="text-slate-300 mb-2" />
                      <span className="text-[10px] font-bold text-slate-400">Click to upload</span>
                      <input type="file" className="hidden" onChange={handleFeaturedChange} />
                    </label>
                  )}
               </div>
            </div>
          )}

          {currentStep === 6 && (
            <div className="space-y-6 animate-in slide-in-from-right-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Public Information (Full Description)</label>
                  <textarea {...register('full_description')} className="w-full border border-slate-200 p-4 rounded-xl h-32 outline-none focus:border-emerald-600" />
                </div>
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">Guest Rules</label>
                    <textarea {...register('house_rules')} className="w-full border border-slate-200 p-4 rounded-xl h-24" />
                  </div>
                  <div className="space-y-2 flex flex-col justify-center">
                    <label className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-100 rounded-xl cursor-pointer">
                      <input type="checkbox" {...register('show_on_website')} className="w-6 h-6 accent-emerald-600" />
                      <span className="font-bold text-emerald-900">Publish to Public Website</span>
                    </label>
                  </div>
                </div>
            </div>
          )}
        </div>

        <div className="mt-12 flex justify-between border-t border-slate-100 pt-8">
          <Button type="button" variant="ghost" onClick={currentStep === 1 ? onCancel : prevStep} className="font-bold uppercase tracking-widest text-xs px-8 py-3 h-auto">
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </Button>

          {currentStep < STEPS.length ? (
            <Button type="button" onClick={nextStep} className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold uppercase tracking-widest text-xs px-12 py-5 h-auto rounded-xl">
              Next Step
            </Button>
          ) : (
            <Button type="submit" disabled={isSubmitting} className="bg-emerald-950 hover:bg-emerald-900 text-white font-bold uppercase tracking-widest text-xs px-16 py-5 h-auto rounded-xl shadow-lg">
              {isSubmitting ? 'Saving...' : 'Deploy Configuration'}
            </Button>
          )}
        </div>
      </form>

      {submitError && <div className="absolute bottom-8 left-10 text-rose-500 font-bold text-sm bg-rose-50 px-4 py-2 rounded-lg border border-rose-100">Error: {submitError}</div>}
      {successMessage && <div className="absolute bottom-8 left-10 text-emerald-600 font-bold text-sm bg-emerald-50 px-4 py-2 rounded-lg border border-emerald-100">{successMessage}</div>}
    </div>
  );
};
