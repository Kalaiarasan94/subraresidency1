import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, Search, Bed, Users, DoorOpen, Layers, 
  Wrench, CheckCircle2, ChevronRight, Sparkles, SlidersHorizontal, RefreshCw
} from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { API_BASE_URL } from '../../../lib/api';
import { 
  resolveRoomImageUrl, 
  handleImageError, 
  extractRoomPrice 
} from '../../../lib/roomImageHelper';

interface Props {
  onAddRoom?: () => void;
  onEditRoom?: (room: any) => void;
}

export const CategoryManagement: React.FC<Props> = ({ onAddRoom, onEditRoom }) => {
  const [categories, setCategories] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'available' | 'maintenance'>('all');

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/rooms/categories`);
      if (res.status === 404) {
        setCategories([]);
        return;
      }
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      } else {
        setCategories([]);
      }
    } catch (err) {
      console.error('Failed to fetch rooms', err);
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    return categories.filter((cat) => {
      const name = (cat.title || cat.room_name || '').toLowerCase();
      const tag = (cat.category_tag || cat.tag || '').toLowerCase();
      const bed = (cat.bed_type || '').toLowerCase();
      const query = searchQuery.toLowerCase().trim();

      const matchesSearch = !query || name.includes(query) || tag.includes(query) || bed.includes(query);
      const isMaint = cat.status === 'Maintenance';
      const matchesStatus = 
        statusFilter === 'all' ? true :
        statusFilter === 'maintenance' ? isMaint :
        !isMaint;

      return matchesSearch && matchesStatus;
    });
  }, [categories, searchQuery, statusFilter]);

  // Aggregate Inventory Metrics
  const metrics = useMemo(() => {
    const totalTypes = categories.length;
    let totalUnits = 0;
    let availableUnits = 0;
    let inMaintenance = 0;

    categories.forEach((cat) => {
      const units = Number(cat.sub_room_count || cat.total_rooms || 0);
      const avail = Number(cat.available_rooms !== undefined ? cat.available_rooms : units);
      totalUnits += units;
      availableUnits += avail;
      if (cat.status === 'Maintenance') {
        inMaintenance += 1;
      }
    });

    return { totalTypes, totalUnits, availableUnits, inMaintenance };
  }, [categories]);

  return (
    <div className="space-y-6">
      {/* Top Header & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-gray-200/80 gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Room Inventory & Suites</h1>
            <span className="bg-emerald-50 text-emerald-700 text-xs font-semibold px-2.5 py-0.5 rounded-full border border-emerald-200/60">
              {categories.length} Categories
            </span>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Manage room classes, pricing structures, amenity configurations, and physical sub-room units.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Button
            onClick={fetchCategories}
            variant="outline"
            className="border-gray-200 text-gray-600 hover:text-gray-900 hover:bg-gray-50 text-xs px-3 py-2 h-auto rounded-lg shadow-2xs"
            title="Refresh list"
          >
            <RefreshCw size={13} className={isLoading ? 'animate-spin' : ''} />
          </Button>

          <Button 
            onClick={() => onAddRoom?.()} 
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium px-4 py-2.5 rounded-lg text-xs h-auto shadow-sm transition-all flex items-center gap-1.5 active:scale-98"
          >
            <Plus size={15} />
            <span>Add New Room Category</span>
          </Button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-2xs">
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Room Classes</p>
          <div className="flex items-baseline justify-between mt-1.5">
            <p className="text-2xl font-bold text-gray-900">{metrics.totalTypes}</p>
            <span className="text-[11px] text-emerald-600 font-medium bg-emerald-50 px-2 py-0.5 rounded-md">
              Configured
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-2xs">
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Total Physical Units</p>
          <div className="flex items-baseline justify-between mt-1.5">
            <p className="text-2xl font-bold text-gray-900">{metrics.totalUnits}</p>
            <span className="text-[11px] text-blue-600 font-medium bg-blue-50 px-2 py-0.5 rounded-md">
              Rooms Mapped
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-2xs">
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Live & Available</p>
          <div className="flex items-baseline justify-between mt-1.5">
            <p className="text-2xl font-bold text-emerald-600">{metrics.availableUnits}</p>
            <span className="text-[11px] text-emerald-700 font-medium bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Bookable
            </span>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 rounded-xl p-4 shadow-2xs">
          <p className="text-[11px] font-medium text-gray-500 uppercase tracking-wider">Maintenance</p>
          <div className="flex items-baseline justify-between mt-1.5">
            <p className={`text-2xl font-bold ${metrics.inMaintenance > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
              {metrics.inMaintenance}
            </p>
            <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
              metrics.inMaintenance > 0 ? 'text-amber-700 bg-amber-50' : 'text-gray-500 bg-gray-100'
            }`}>
              {metrics.inMaintenance > 0 ? 'Action Needed' : 'All Clear'}
            </span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-gray-200/80 rounded-xl p-3 flex flex-col md:flex-row items-center justify-between gap-3 shadow-2xs">
        <div className="relative w-full md:w-80">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input 
            type="text"
            placeholder="Search by category, bed type, tag..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full text-xs pl-9 pr-3 py-2 bg-gray-50/70 border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:bg-white transition-all text-gray-800 placeholder-gray-400"
          />
        </div>

        <div className="flex items-center gap-1.5 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <button
            onClick={() => setStatusFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'all'
                ? 'bg-gray-900 text-white shadow-2xs'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200/70'
            }`}
          >
            All Categories ({categories.length})
          </button>
          <button
            onClick={() => setStatusFilter('available')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'available'
                ? 'bg-emerald-600 text-white shadow-2xs'
                : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100/70'
            }`}
          >
            Available Only
          </button>
          <button
            onClick={() => setStatusFilter('maintenance')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              statusFilter === 'maintenance'
                ? 'bg-amber-600 text-white shadow-2xs'
                : 'bg-amber-50 text-amber-700 hover:bg-amber-100/70'
            }`}
          >
            Maintenance
          </button>
        </div>
      </div>

      {/* Grid of Room Cards */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div key={n} className="bg-white border border-gray-200 rounded-2xl p-4 animate-pulse space-y-4">
              <div className="aspect-[16/10] bg-gray-200 rounded-xl" />
              <div className="h-4 bg-gray-200 rounded w-2/3" />
              <div className="h-6 bg-gray-200 rounded w-1/3" />
              <div className="h-10 bg-gray-100 rounded-lg" />
            </div>
          ))}
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white border border-dashed border-gray-300 rounded-2xl p-12 text-center max-w-lg mx-auto">
          <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <Bed size={22} />
          </div>
          <h3 className="text-base font-semibold text-gray-900">No Room Categories Found</h3>
          <p className="text-xs text-gray-500 mt-1 max-w-sm mx-auto">
            {searchQuery 
              ? `No rooms match your filter "${searchQuery}". Try clearing search.`
              : 'Get started by creating your first luxury room category.'}
          </p>
          <div className="mt-5 flex items-center justify-center gap-3">
            {searchQuery && (
              <Button
                variant="outline"
                onClick={() => { setSearchQuery(''); setStatusFilter('all'); }}
                className="text-xs border-gray-300"
              >
                Clear Search
              </Button>
            )}
            <Button
              onClick={() => onAddRoom?.()}
              className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs"
            >
              <Plus size={14} className="mr-1" /> Add Room Category
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCategories.map((cat, idx) => {
            const price24h = extractRoomPrice(cat);
            const isMaint = cat.status === 'Maintenance';
            const imageUrl = resolveRoomImageUrl(cat.image, cat.id || cat.title || idx);
            const unitsCount = Number(cat.sub_room_count || cat.total_rooms || 0);
            const categoryTag = cat.category_tag || cat.tag || 'Premium';
            const guestsCount = cat.max_guests || cat.adults || 2;
            const bedType = cat.bed_type || 'King Bed';

            return (
              <div 
                key={cat.id || idx}
                className="group bg-white border border-gray-200/80 hover:border-emerald-300 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Photo Banner with Zoom Hover & Status Badges */}
                  <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                    <img 
                      src={imageUrl} 
                      alt={cat.title || cat.room_name} 
                      onError={(e) => handleImageError(e, cat.id || cat.title || idx)}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />

                    {/* Gradient Overlay for Readability */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

                    {/* Top Left: Category Tag Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider bg-black/40 backdrop-blur-md text-white border border-white/20 shadow-xs">
                        <Sparkles size={10} className="text-amber-300" />
                        {categoryTag}
                      </span>
                    </div>

                    {/* Top Right: Status Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold backdrop-blur-md shadow-xs ${
                        isMaint 
                          ? 'bg-amber-500/90 text-white border border-amber-400' 
                          : 'bg-emerald-600/90 text-white border border-emerald-400'
                      }`}>
                        {isMaint ? (
                          <>
                            <Wrench size={11} />
                            <span>Maintenance</span>
                          </>
                        ) : (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                            <span>Available</span>
                          </>
                        )}
                      </span>
                    </div>

                    {/* Bottom Floating Bar on Image: Quick Bed & Guests Info */}
                    <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-[11px] font-medium drop-shadow-md">
                      <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                        <Users size={12} />
                        {guestsCount} Guests Max
                      </span>
                      <span className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-md border border-white/10">
                        <DoorOpen size={12} />
                        {unitsCount} {unitsCount === 1 ? 'Unit' : 'Units'}
                      </span>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5">
                    {/* Title & Pricing */}
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <h3 className="text-base font-bold text-gray-900 group-hover:text-emerald-700 transition-colors leading-tight">
                          {cat.title || cat.room_name}
                        </h3>
                        <p className="text-[11px] text-gray-400 mt-0.5">
                          Floor {cat.floor || cat.floor_number || '3'} • {cat.size ? `${cat.size} sq ft` : 'Spacious Layout'}
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="text-base font-bold text-emerald-600 tabular-nums leading-tight">
                          ₹{price24h > 0 ? price24h.toLocaleString('en-IN') : 'N/A'}
                        </div>
                        <span className="text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                          / 24h Nightly
                        </span>
                      </div>
                    </div>

                    {/* 12h Rate Pill if configured */}
                    {cat.price_12h && Number(cat.price_12h) > 0 && (
                      <div className="mt-2 flex items-center justify-end">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-gray-50 text-gray-600 border border-gray-200">
                          12h Flex: ₹{Number(cat.price_12h).toLocaleString('en-IN')}
                        </span>
                      </div>
                    )}

                    {/* Key Attributes Pill Strip */}
                    <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-gray-100 text-center">
                      <div className="px-1">
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Bed Setup</p>
                        <p className="text-xs font-semibold text-gray-800 mt-0.5 truncate" title={bedType}>
                          {bedType}
                        </p>
                      </div>
                      <div className="border-x border-gray-100 px-1">
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Occupancy</p>
                        <p className="text-xs font-semibold text-gray-800 mt-0.5">
                          {cat.adults || 2}A {cat.children ? `+ ${cat.children}C` : ''}
                        </p>
                      </div>
                      <div className="px-1">
                        <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">Inventory</p>
                        <p className="text-xs font-semibold text-gray-800 mt-0.5">
                          {unitsCount} Rooms
                        </p>
                      </div>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">
                      {cat.description || cat.full_description || "Luxury accommodation with high-class amenities and traditional Kumbakonam hospitality."}
                    </p>

                    {/* Amenities Badges Preview */}
                    {Array.isArray(cat.amenities) && cat.amenities.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-1.5">
                        {cat.amenities.slice(0, 3).map((am: string, i: number) => (
                          <span 
                            key={i} 
                            className="inline-flex items-center text-[10px] font-medium text-gray-600 bg-gray-50 px-2 py-0.5 rounded border border-gray-200/60"
                          >
                            {am}
                          </span>
                        ))}
                        {cat.amenities.length > 3 && (
                          <span className="inline-flex items-center text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-100">
                            +{cat.amenities.length - 3} more
                          </span>
                        )}
                      </div>
                    )}

                    {/* Maintenance Date Warning if active */}
                    {isMaint && cat.maintenance_start && cat.maintenance_end && (
                      <div className="mt-3 p-2 bg-amber-50 rounded-lg border border-amber-200 text-[11px] text-amber-800 font-medium flex items-center gap-1.5">
                        <Wrench size={13} className="shrink-0 text-amber-600" />
                        <span className="truncate">
                          Under maintenance: {cat.maintenance_start} to {cat.maintenance_end}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Action Footer */}
                <div className="px-5 pb-5 pt-1 border-t border-gray-100 mt-2 flex items-center gap-2">
                  <Button 
                    onClick={() => onEditRoom?.(cat)}
                    className="flex-1 bg-gray-900 hover:bg-emerald-600 text-white rounded-lg text-xs py-2 h-auto font-medium transition-colors flex items-center justify-center gap-1.5 shadow-2xs group/btn"
                  >
                    <span>Configure & Gallery</span>
                    <ChevronRight size={14} className="group-hover/btn:translate-x-0.5 transition-transform" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
