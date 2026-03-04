export async function getTickets() {
  try {
    const res = await fetch("/fake-data/fake-tickets.json");
    if (!res.ok) {
      throw new Error("Cannot load tickets.json");
    }
    return await res.json();
  } catch (error) {
    console.error("Load tickets error:", error);
    return [];
  }
}
