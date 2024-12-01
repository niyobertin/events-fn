'use client';
import { gql } from 'graphql-request';
import { graphQLClient } from '@/graphQL/graphQL';
import { useState } from 'react';

const CREATE_EVENT = gql`
  mutation CreateEvent(
    $title: String!
    $description: String!
    $availableSeats: Int!
    $startTime: DateTime!
    $endTime: DateTime!
    $location: String!
  ) {
    createEvent(
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

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    availableSeats: '',
    startTime: '',
    endTime: '',
    location: '',
  });
  const [loading, setLoading] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, description, availableSeats, startTime, endTime, location } = formData;

    try {
      setLoading(true);
      const response = await graphQLClient.request(CREATE_EVENT, {
        title,
        description,
        availableSeats: parseInt(availableSeats),
        startTime,
        endTime,
        location,
      });
      setLoading(false);
      alert(`Event created successfully!}`);
      setFormData({
        title: '',
        description: '',
        availableSeats: '',
        startTime: '',
        endTime: '',
        location: '',
      });
    } catch (err) {
      setLoading(false);
      console.error(err);
      alert('Failed to create event.');
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-lg">
      <h1 className="text-3xl font-bold mb-4">Create Event</h1>
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
          required
        />
        <input
          type="datetime-local"
          name="endTime"
          value={formData.endTime}
          className="w-full p-2 border rounded-md"
          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
          required
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
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}
