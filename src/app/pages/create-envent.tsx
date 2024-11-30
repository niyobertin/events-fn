import { gql, useMutation } from '@apollo/client';
import { useState } from 'react';

const CREATE_EVENT = gql`
  mutation CreateEvent(
    $title: String!
    $description: String!
    $availableSeats: Int!
    $startTime: String!
    $endTime: String!
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
  const [createEvent] = useMutation(CREATE_EVENT);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    availableSeats: '',
    startTime: '',
    endTime: '',
    location: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { title, description, availableSeats, startTime, endTime, location } = formData;

    try {
      await createEvent({
        variables: {
          title,
          description,
          availableSeats: parseInt(availableSeats),
          startTime,
          endTime,
          location,
        },
      });
      alert('Event created successfully!');
    } catch (err) {
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
          className="w-full p-2 border rounded-md"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <textarea
          name="description"
          placeholder="Description"
          className="w-full p-2 border rounded-md"
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        />
        <input
          type="number"
          name="availableSeats"
          placeholder="Available Seats"
          className="w-full p-2 border rounded-md"
          onChange={(e) => setFormData({ ...formData, availableSeats: e.target.value })}
        />
        <input
          type="datetime-local"
          name="startTime"
          className="w-full p-2 border rounded-md"
          onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
        />
        <input
          type="datetime-local"
          name="endTime"
          className="w-full p-2 border rounded-md"
          onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
        />
        <input
          type="text"
          name="location"
          placeholder="Location"
          className="w-full p-2 border rounded-md"
          onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Create Event
        </button>
      </form>
    </div>
  );
}
