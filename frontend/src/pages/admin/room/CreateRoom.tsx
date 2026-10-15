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
    <div className="crm-card bg-white border border-gray-200 rounded-lg shadow-xs overflow-hidden font-sans">
      {/* Card Header & Stepper */}
      <div className="px-6 py-5 border-b border-gray-200 bg-white">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-lg font-semibold text-gray-900 tracking-tight">
              {isEditMode ? 'Edit Room Configuration' : 'New Room Configuration'}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              Step {currentStep} of {STEPS.length}: {STEPS[currentStep - 1].title}
            </p>
          </div>

          {/* Stepper Navigation */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
            {STEPS.map((s) => {
              const isActive = currentStep === s.id;
              const isPast = currentStep > s.id;
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  onClick={() => {
                    if (isPast) setCurrentStep(s.id);
                  }}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors whitespace-nowrap ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 border border-emerald-300'
                      : isPast
                      ? 'text-gray-700 hover:bg-gray-100 cursor-pointer'
                      : 'text-gray-400'
                  }`}
                >
                  <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-semibold ${
                    isActive ? 'bg-emerald-600 text-white' : isPast ? 'bg-gray-200 text-gray-700' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {s.id}
                  </span>
                  <span>{s.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="p-6 md:p-8">
        <div className="min-h-[360px]">
          {/* Step 1: Identity */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Category Name <span className="text-rose-500">*</span></label>
                  <input 
                    {...register('room_name', { required: true })} 
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs" 
                    placeholder="e.g. Heritage Luxury Suite" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Internal ID Code</label>
                  <input 
                    {...register('room_code')} 
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs" 
                    placeholder="e.g. SR-101" 
                  />
                </div>
                {!isEditMode && (
                  <div className="space-y-1.5 md:col-span-2 max-w-sm">
                    <label className="text-xs font-semibold text-gray-700">Number of Physical Rooms</label>
                    <input
                      type="number"
                      min={1}
                      max={50}
                      value={subRoomCount}
                      onChange={(e) => handleSubRoomCountChange(parseInt(e.target.value, 10))}
                      className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs"
                    />
                    <p className="text-[11px] text-gray-400">Total physical room units under this category to initialize.</p>
                  </div>
                )}
              </div>

              {!isEditMode && (
                <div className="space-y-2 pt-2 border-t border-gray-100">
                  <label className="text-xs font-semibold text-gray-700">
                    Room Numbers ({roomNumbers.length} units)
                  </label>
                  <p className="text-[11px] text-gray-400">
                    Assign a distinct room identifier (e.g. 101, 102, SD-01...) for each physical unit.
                  </p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 pt-1">
                    {roomNumbers.map((num, idx) => (
                      <div key={idx} className="relative">
                        <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-[10px] font-semibold text-gray-400 pointer-events-none">
                          #{idx + 1}
                        </span>
                        <input
                          value={num}
                          onChange={(e) => {
                            const next = [...roomNumbers];
                            next[idx] = e.target.value;
                            setRoomNumbers(next);
                          }}
                          placeholder={`Unit ${idx + 1}`}
                          className="w-full bg-white border border-gray-300 rounded-lg pl-7 pr-2.5 py-1.5 text-xs text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 2: Rates */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Base Price (24h) <span className="text-rose-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                    <input 
                      type="number" 
                      {...register('base_price', { required: true })} 
                      className="w-full bg-white border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-xs font-semibold text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs" 
                      placeholder="3500"
                    />
                  </div>
                  <p className="text-[11px] text-gray-400">Standard 24-hour night tariff.</p>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">12-Hour Transit Rate</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                    <input 
                      type="number" 
                      {...register('price_12_hours')} 
                      className="w-full bg-white border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs" 
                      placeholder="2200"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Weekend Surcharge</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                    <input 
                      type="number" 
                      {...register('weekend_price')} 
                      className="w-full bg-white border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs" 
                      placeholder="500"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Festival / Peak Surcharge</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs">₹</span>
                    <input 
                      type="number" 
                      {...register('festival_price')} 
                      className="w-full bg-white border border-gray-300 rounded-lg pl-7 pr-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs" 
                      placeholder="1000"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Specs */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Max Adults</label>
                  <input 
                    type="number" 
                    {...register('max_adults')} 
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs" 
                    defaultValue={2}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Max Children</label>
                  <input 
                    type="number" 
                    {...register('max_children')} 
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs" 
                    defaultValue={1}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Total Max Occupancy</label>
                  <input 
                    type="number" 
                    {...register('max_guests')} 
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs" 
                    defaultValue={3}
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Bed Type</label>
                  <select 
                    {...register('bed_type')} 
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs"
                  >
                    <option value="King Size">King Size</option>
                    <option value="Queen Size">Queen Size</option>
                    <option value="Twin Beds">Twin Beds</option>
                    <option value="Double Bed">Double Bed</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Room Size (sqft)</label>
                  <input 
                    {...register('room_size')} 
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs" 
                    placeholder="350 sq.ft" 
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">Floor Number</label>
                  <input 
                    type="number"
                    {...register('floor_number')} 
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs" 
                    defaultValue={1}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Features */}
          {currentStep === 4 && (
            <div className="space-y-5">
              <p className="text-xs text-gray-500">Select amenities included with this room category:</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {[
                  'High-Speed WiFi', 'Smart TV', 'Mini Fridge', 'Air Conditioning', 
                  'Balcony', 'Rain Shower', 'Room Service', 'Workspace',
                  'Temple View', 'Tea/Coffee Maker', 'In-room Safe', 'Hot Water'
                ].map(item => (
                  <label 
                    key={item} 
                    className="flex items-center gap-2.5 p-3 bg-white border border-gray-200 rounded-lg cursor-pointer hover:border-gray-300 transition-colors shadow-xs"
                  >
                    <input 
                      type="checkbox" 
                      value={item} 
                      {...register('amenities')} 
                      className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" 
                    />
                    <span className="text-xs font-medium text-gray-700 select-none">{item}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 5: Media */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-700">Featured Display Image</label>
                {featuredPreview ? (
                  <div className="relative w-80 aspect-video rounded-lg overflow-hidden border border-gray-200 shadow-xs">
                    <img src={featuredPreview} alt="Featured Preview" className="w-full h-full object-cover" />
                    <button 
                      type="button" 
                      onClick={() => setFeaturedPreview(null)} 
                      className="absolute top-2 right-2 bg-white/90 text-rose-600 hover:bg-white rounded-md p-1 font-bold text-xs shadow-xs"
                    >
                      ✕ Remove
                    </button>
                  </div>
                ) : (
                  <label className="w-80 aspect-video border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                    <Images className="text-gray-400 mb-2" size={28} />
                    <span className="text-xs font-medium text-gray-600">Click to upload photo</span>
                    <span className="text-[11px] text-gray-400 mt-0.5">PNG, JPG, or WEBP up to 5MB</span>
                    <input type="file" className="hidden" accept="image/*" onChange={handleFeaturedChange} />
                  </label>
                )}
              </div>
            </div>
          )}

          {/* Step 6: Publish */}
          {currentStep === 6 && (
            <div className="space-y-5">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-gray-700">Public Description</label>
                <textarea 
                  {...register('full_description')} 
                  rows={4}
                  className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs" 
                  placeholder="Describe room layout, ambiance, comfort, and view details..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-gray-700">House & Stay Rules</label>
                  <textarea 
                    {...register('house_rules')} 
                    rows={3}
                    className="w-full bg-white border border-gray-300 rounded-lg px-3 py-2 text-xs text-gray-900 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500 shadow-xs" 
                    placeholder="Check-in 12:00 PM, No smoking in rooms..."
                  />
                </div>

                <div className="flex flex-col justify-end">
                  <label className="flex items-center gap-3 p-3.5 bg-gray-50 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-100/70 transition-colors">
                    <input 
                      type="checkbox" 
                      {...register('show_on_website')} 
                      className="w-4 h-4 text-emerald-600 rounded border-gray-300 focus:ring-emerald-500" 
                    />
                    <div>
                      <span className="text-xs font-semibold text-gray-800 block">Publish to Public Website</span>
                      <span className="text-[11px] text-gray-500">Allow customers to view and book this room on the website.</span>
                    </div>
                  </label>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Notices */}
        {submitError && (
          <div className="mt-4 p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
            Error: {submitError}
          </div>
        )}
        {successMessage && (
          <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs rounded-lg font-medium">
            {successMessage}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex items-center justify-between border-t border-gray-200 pt-5">
          <button 
            type="button" 
            onClick={currentStep === 1 ? onCancel : prevStep} 
            className="px-4 py-2 border border-gray-300 rounded-lg text-xs font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors shadow-xs"
          >
            {currentStep === 1 ? 'Cancel' : 'Back'}
          </button>

          {currentStep < STEPS.length ? (
            <button 
              type="button" 
              onClick={nextStep} 
              className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
            >
              Next Step
            </button>
          ) : (
            <button 
              type="submit" 
              disabled={isSubmitting} 
              className="px-6 py-2 bg-gray-900 hover:bg-black text-white rounded-lg text-xs font-medium transition-colors shadow-xs"
            >
              {isSubmitting ? 'Saving...' : 'Deploy Configuration'}
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
