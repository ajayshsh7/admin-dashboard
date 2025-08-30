// Fake users data
export const seedUsers = [
  {
    name: "Alice Johnson",
    email: "alice@example.com",
    profilePic: "https://i.pravatar.cc/150?img=1",
  },
  {
    name: "Bob Smith",
    email: "bob@example.com",
    profilePic: "https://i.pravatar.cc/150?img=2",
  },
  {
    name: "Charlie Davis",
    email: "charlie@example.com",
    profilePic: "https://i.pravatar.cc/150?img=3",
  },
];

// Fake transactions data
export const seedTransactions = [
  {
    amount: 150,
    date: new Date().toISOString(),
    userEmail: "alice@example.com",
  },
  {
    amount: 200,
    date: new Date().toISOString(),
    userEmail: "bob@example.com",
  },
  { amount: 150, date: new Date("2025-08-20").toISOString(), userEmail: "alice@example.com" },
  { amount: 200, date: new Date("2025-08-21").toISOString(), userEmail: "bob@example.com" },
  { amount: 300, date: new Date("2025-08-22").toISOString(), userEmail: "charlie@example.com" },
  { amount: 250, date: new Date("2025-08-23").toISOString(), userEmail: "david@example.com" },
  { amount: 180, date: new Date("2025-08-24").toISOString(), userEmail: "eve@example.com" },
  { amount: 220, date: new Date("2025-08-25").toISOString(), userEmail: "alice@example.com" },
  { amount: 170, date: new Date("2025-08-26").toISOString(), userEmail: "bob@example.com" },
];

