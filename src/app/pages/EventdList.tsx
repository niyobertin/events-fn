'use client';
import { useEffect, useState } from "react";
import { graphQLClient } from "@/graphQL/graphQL";
import { gql } from "graphql-request";
import UpdateEventForm from "./updateEvent";

type Event = {
  id: string;
  title: string;
  description: string;
  availableSeats: number;
  startTime: string;
  endTime: string;
  location: string;
};

const getAllEvents = gql`
  query GetAllEvents {
    allEvents {
      id
      title
      description
      location
      availableSeats
      startTime
      endTime
    }
  }
`;

export default function EventLists() {
  const [events, setEvents] = useState<Event[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data: any = await graphQLClient.request(getAllEvents);
        setEvents(data.allEvents);
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) setError(err.message);
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  const openModal = (event: Event) => {
    setSelectedEvent(event);
  };

  const closeModal = () => {
    setSelectedEvent(null);
  };

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error loading events: {error}</p>;

  if (events.length === 0) {
    return <p>No events found.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Events</h1>
      <ul className="space-y-4">
        {events.map((event) => (
          <li key={event.id} className="p-4 border rounded-md shadow-md">
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <p>{event.description}</p>
            <p>Location: {event.location}</p>
            <p><span className="font-bold">Available seats:</span> {event.availableSeats}</p>
            <p><span className="font-bold">Start Time:</span> {event.startTime}</p>
            <p><span className="font-bold">End Time:</span> {event.endTime}</p>
            <div className="flex gap-4">
            <button
              onClick={() => openModal(event)}
              className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              Update
            </button>
            <button
              onClick={() => openModal(event)}
              className="mt-2 bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
            >
              Delete
            </button>
            </div>
          </li>
        ))}
      </ul>

      {/* Modal for Updating Event */}
      {selectedEvent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-full max-w-lg">
            <button
              className="absolute right-84 text-black hover:text-gray-700"
              onClick={closeModal}
            >
              ✕
            </button>
            <UpdateEventForm event={selectedEvent} onClose={closeModal} />
          </div>
        </div>
      )}
    </div>
  );
}
