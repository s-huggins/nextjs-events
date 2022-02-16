export async function getAllEvents() {
  console.log(process.env.FIREBASE_EVENTS_PATH);
  const response = await fetch(process.env.FIREBASE_EVENTS_PATH);
  const data = await response.json();

  const events = [];

  for (const key in data) {
    events.push({
      id: key,
      ...data[key]
    });
  }

  return events;
}

//xxx following methods are sufficient for a demo app xxx//

export async function getFeaturedEvents() {
  const allEvents = await getAllEvents();

  return allEvents.filter(event => event.isFeatured);
}

export async function getEventById(id) {
  const allEvents = await getAllEvents();

  return allEvents.find(event => event.id === id);
}

export async function getFilteredEvents(dateFilter) {
  const { year, month } = dateFilter;

  const allEvents = await getAllEvents();

  const filteredEvents = allEvents.filter(event => {
    const eventDate = new Date(event.date);
    return (
      eventDate.getFullYear() === year && eventDate.getMonth() === month - 1
    );
  });

  return filteredEvents;
}
