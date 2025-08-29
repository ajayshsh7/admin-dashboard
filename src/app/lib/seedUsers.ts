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
];

// Fake revenue data
export const seedRevenue = [
  {
    total: 350,
    date: new Date().toISOString(),
  },
];
