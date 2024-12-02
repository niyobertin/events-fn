'use client';
import { gql } from 'graphql-request';
import { graphQLClient } from '@/graphQL/graphQL';
import { useState, useEffect } from 'react';

interface Event {
    id: string;
    title: string;
    description: string;
    availableSeats?: number;
    startTime?: string;
    endTime?: string;
    location: string;
  }
  

const UPDATE_EVENT = gql`
  mutation UpdateEvent(
    $id: Int!
    $title: String
    $description: String
    $availableSeats: Int
    $startTime: DateTime
    $endTime: DateTime
    $location: String
  ) {
    updateEvent(
      id: $id
      title: $title
      description: $description
      availableSeats: $availableSeats
      startTime: $startTime
      endTime: $endTime
      location: $location
    ) {
      event {
        id
        title
      }
    }
  }
`;

export default function UpdateEventForm({ 
    event,
    onClose
     }: {
        event:Event,
        onClose :() => void;
     }) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    availableSeats: '',
    startTime: '',
    endTime: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);

  // Populate form with event data
  useEffect(() => {
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        availableSeats: event.availableSeats?.toString() || '',
        startTime: event.startTime || '',
        endTime: event.endTime || '',
        location: event.location || '',
      });
    }
  }, [event]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      await graphQLClient.request(UPDATE_EVENT, {
        id: parseInt(event.id),
        title: formData.title,
        description: formData.description,
        availableSeats: parseInt(formData.availableSeats, 10),
        startTime: formData.startTime,
        endTime: formData.endTime,
        location: formData.location,
      });
      alert('Event updated successfully!');
      setLoading(false);
      onClose(); 
    } catch (err) {
      console.error(err);
      alert('Failed to update event.');
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-3xl font-bold mb-4">Update Event</h1>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={formData.title}
          className="w-full p-2 border border-black rounded-md"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
        <textarea
          name="description"
          placeholder="Description"
          value={formData.description}
          className="w-full p-2 border border-black rounded-md"
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          required
        />
        <input
          type="number"
          name="availableSeats"
          placeholder="Available Seats"
          value={formData.availableSeats}
          className="w-full p-2 border border-black rounded-md"
          onChange={(e) => setFormData({ ...formData, availableSeats: e.target.value })}
          required
        />
        <input
          type="datetime-local"
          name="startTime"
          value={formData.startTime}
          className="w-full p-2 border border-black rounded-md"
          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
        />
        <input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          className="w-full p-2 border border-black rounded-md"
          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          className="w-full p-2 border border-black rounded-md"
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
          required
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
          disabled={loading}
        >
          {loading ? 'Updating...' : 'Update Event'}
        </button>
      </form>
    </div>
  );
}
