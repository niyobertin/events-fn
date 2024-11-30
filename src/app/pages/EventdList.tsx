'use client';
import { useEffect, useState } from "react";
import { graphQLClient } from "@/graphQL/graphQL";
import { gql } from "graphql-request";

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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const data:any = await graphQLClient.request(getAllEvents);
        setEvents(data.allEvents);
        setLoading(false);
      } catch (err) {
        if(err instanceof Error)
        setError(err.message);
        setLoading(false);
      }
    }

    fetchEvents();
  }, []);

  if (loading) return <p>Loading events...</p>;
  if (error) return <p>Error loading events: {error}</p>;

  if (events.length === 0) {
    return <p>No events found.</p>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold">Events</h1>
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <li key={event.id} className="p-4 border rounded-md shadow-md">
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <p>{event.description}</p>
            <p>Location: {event.location}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}
