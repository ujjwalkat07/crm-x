import { prisma } from "./lib/prisma";

async function main() {
  console.log("Seeding database with dummy leads...");

  // 1. Get all users
  const users = await prisma.user.findMany();
  if (users.length === 0) {
    console.log("No users found in database. Please create a user/register first before seeding leads.");
    return;
  }

  console.log(`Found ${users.length} users in database.`);

  const firstNames = ["James", "John", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", "Jessica", "Sarah", "Karen"];
  const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Gonzalez", "Wilson", "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin"];
  const companies = ["Apex Corp", "Summit Industries", "Vortex Tech", "Quantum Labs", "Horizon Solutions", "Phoenix Global", "Starlight Inc", "Blue Sky Ventures", "Delta Group", "Echo Systems", "Titan Media", "Omega Holdings"];
  const priorities: ("HIGH" | "MEDIUM" | "LOW")[] = ["HIGH", "MEDIUM", "LOW"];
  const tagsList = [
    ["Enterprise", "Tech"],
    ["SMB", "Retail"],
    ["Inbound", "Referral"],
    ["Outbound", "Cold Email"],
    ["Partner", "Marketing"],
    ["Urgent", "New Deal"],
  ];

  // Helper to generate a random date in the last N months
  const randomDateInPast = (monthsBack: number) => {
    const now = new Date();
    const pastDate = new Date();
    pastDate.setMonth(now.getMonth() - Math.random() * monthsBack);
    // Also randomize day and hour
    pastDate.setDate(Math.floor(Math.random() * 28) + 1);
    pastDate.setHours(Math.floor(Math.random() * 24), Math.floor(Math.random() * 60));
    return pastDate;
  };

  // Generate 20 dummy leads for each user
  for (const user of users) {
    console.log(`Seeding 20 leads for user ${user.fullName} (${user.email})...`);

    const leadsData = [];
    for (let i = 0; i < 20; i++) {
      const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
      const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
      const customerName = `${firstName} ${lastName}`;
      const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
      const phone = `+1 (${Math.floor(100 + Math.random() * 900)}) 555-${String(Math.floor(1000 + Math.random() * 9000))}`;
      const company = companies[Math.floor(Math.random() * companies.length)];
      
      // Distribute statuses: ~25% Open, ~35% Active, ~25% Closed (Won), ~15% Lost
      const randStatus = Math.random();
      let status: "Open" | "Active" | "Closed" | "Lost" = "Open";
      if (randStatus < 0.25) status = "Open";
      else if (randStatus < 0.60) status = "Active";
      else if (randStatus < 0.85) status = "Closed";
      else status = "Lost";

      // Priority distribution
      const priority = priorities[Math.floor(Math.random() * priorities.length)];
      const tags = tagsList[Math.floor(Math.random() * tagsList.length)];
      
      const createdAt = randomDateInPast(6); // last 6 months
      const updatedAt = new Date(createdAt.getTime() + Math.random() * 7 * 24 * 60 * 60 * 1000); // 0-7 days later

      leadsData.push({
        customerName,
        email,
        phone,
        company,
        status,
        priority,
        tags,
        notes: `Simulated lead for database demonstration. Interested in ${tags.join(" and ")} products.`,
        createdAt,
        updatedAt,
        assignedToId: user.id,
      });
    }

    // Insert leads
    await prisma.lead.createMany({
      data: leadsData,
    });
  }

  console.log("Database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
