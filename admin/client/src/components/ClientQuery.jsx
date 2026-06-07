import React, { useState, useEffect } from 'react';
import {
  MessageSquare,
  Building,
  Mail,
  Phone,
  MapPin,
  Trash2,
  Eye,
  X,
  CheckCircle,
  UtensilsCrossed,
  Car
} from 'lucide-react';

import {
  hotelAPI,
  restaurantAPI,
  transportAPI,
  tripOrganizerAPI
} from '../services/api';

import toast from 'react-hot-toast';

const ClientQuery = () => {
  const [pendingItems, setPendingItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedItem, setSelectedItem] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  // 🔥 NEW: refresh trigger
  const [refresh, setRefresh] = useState(false);

  // Fetch pending items
  useEffect(() => {
    fetchPendingItems();
  }, [refresh]);

  const fetchPendingItems = async () => {
    try {
      setLoading(true);
      setError('');

      const [hotelsRes, restaurantsRes, transportsRes, tripOrganizersRes] =
        await Promise.all([
          hotelAPI.getAll().catch(() => []),
          restaurantAPI.getAll().catch(() => []),
          transportAPI.getAll().catch(() => []),
          tripOrganizerAPI.getAll().catch(() => [])
        ]);

      const allHotels = Array.isArray(hotelsRes)
        ? hotelsRes
        : hotelsRes.hotels || [];

      const allRestaurants = Array.isArray(restaurantsRes)
        ? restaurantsRes
        : restaurantsRes.restaurants || [];

      const allTransports = Array.isArray(transportsRes)
        ? transportsRes
        : transportsRes.transports || [];

      const allTripOrganizers = Array.isArray(tripOrganizersRes)
        ? tripOrganizersRes
        : tripOrganizersRes.tripOrganizers || [];

      const pendingHotels = allHotels
        .filter(i => !i.approved)
        .map(i => ({ ...i, itemType: 'Hotel' }));

      const pendingRestaurants = allRestaurants
        .filter(i => !i.approved)
        .map(i => ({ ...i, itemType: 'Restaurant' }));

      const pendingTransports = allTransports
        .filter(i => !i.approved)
        .map(i => ({ ...i, itemType: 'Transport' }));

      const pendingTripOrganizers = allTripOrganizers
        .filter(i => !i.approved)
        .map(i => ({ ...i, itemType: 'Trip Organizer' }));

      setPendingItems([
        ...pendingHotels,
        ...pendingRestaurants,
        ...pendingTransports,
        ...pendingTripOrganizers
      ]);
    } catch (err) {
      console.error(err);
      setError('Failed to load pending items');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 refresh helper
  const triggerRefresh = () => setRefresh(prev => !prev);

  const handleApprove = async (item) => {
    try {
      setLoading(true);

      switch (item.itemType) {
        case 'Hotel':
          await hotelAPI.approve(item._id || item.id);
          break;
        case 'Restaurant':
          await restaurantAPI.approve(item._id || item.id);
          break;
        case 'Transport':
          await transportAPI.approve(item._id || item.id);
          break;
        case 'Trip Organizer':
          await tripOrganizerAPI.approve(item._id || item.id);
          break;
        default:
          throw new Error('Unknown type');
      }

      toast.success(`${item.itemType} approved`);
      setSelectedItem(null);

      // 🔥 FIX: refresh list
      triggerRefresh();
    } catch (err) {
      console.error(err);
      toast.error('Approve failed');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (item) => {
    try {
      setLoading(true);

      switch (item.itemType) {
        case 'Hotel':
          await hotelAPI.delete(item._id || item.id);
          break;
        case 'Restaurant':
          await restaurantAPI.delete(item._id || item.id);
          break;
        case 'Transport':
          await transportAPI.delete(item._id || item.id);
          break;
        case 'Trip Organizer':
          await tripOrganizerAPI.delete(item._id || item.id);
          break;
        default:
          throw new Error('Unknown type');
      }

      toast.success(`${item.itemType} deleted`);
      setItemToDelete(null);
      setSelectedItem(null);

      // 🔥 FIX: refresh list
      triggerRefresh();
    } catch (err) {
      console.error(err);
      toast.error('Delete failed');
    } finally {
      setLoading(false);
    }
  };

  const filteredItems =
    selectedType === 'All'
      ? pendingItems
      : pendingItems.filter(i => i.itemType === selectedType);

  const itemTypeStats = {
    Hotel: pendingItems.filter(i => i.itemType === 'Hotel').length,
    Restaurant: pendingItems.filter(i => i.itemType === 'Restaurant').length,
    Transport: pendingItems.filter(i => i.itemType === 'Transport').length,
    'Trip Organizer': pendingItems.filter(
      i => i.itemType === 'Trip Organizer'
    ).length
  };

  return (
    <div className="p-10 min-h-screen">

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Client Query</h1>
        <p className="text-gray-600">Vendor onboarding requests</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-8">
        <div className="p-4 bg-white shadow rounded">
          Pending: {pendingItems.length}
        </div>
        <div className="p-4 bg-white shadow rounded">
          Hotels: {itemTypeStats.Hotel}
        </div>
        <div className="p-4 bg-white shadow rounded">
          Restaurants: {itemTypeStats.Restaurant}
        </div>
        <div className="p-4 bg-white shadow rounded">
          Transport:{" "}
          {itemTypeStats.Transport + itemTypeStats["Trip Organizer"]}
        </div>
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded p-4">

        {loading ? (
          <p>Loading...</p>
        ) : filteredItems.length === 0 ? (
          <p>No pending items</p>
        ) : (
          filteredItems.map(item => (
            <div
              key={item._id || item.id}
              className="flex justify-between border-b p-2"
            >
              <div>
                <p className="font-bold">{item.name}</p>
                <p className="text-sm text-gray-500">{item.email}</p>
              </div>

              <div className="flex gap-2">
                <button onClick={() => setSelectedItem(item)}>
                  <Eye />
                </button>

                <button onClick={() => handleApprove(item)}>
                  <CheckCircle />
                </button>

                <button onClick={() => setItemToDelete(item)}>
                  <Trash2 />
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-4 rounded">
            <p>Delete {itemToDelete.name}?</p>

            <button onClick={() => setItemToDelete(null)}>
              Cancel
            </button>

            <button onClick={() => handleDelete(itemToDelete)}>
              Delete
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default ClientQuery;