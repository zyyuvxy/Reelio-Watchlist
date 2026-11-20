import { PrismaClient, ItemType, WatchStatus } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting local database seeding for Reelio...');

  // 1. Create or update demo user
  const email = 'demo@reelio.com';
  const saltRounds = 10;
  const passwordHash = await bcrypt.hash('password123', saltRounds);

  const demoUser = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      name: 'Adimas Cinephile',
      email,
      passwordHash,
    },
  });

  console.log(`👤 Demo user created/verified: ${demoUser.email} (Password: password123)`);

  // 2. Clear existing items for demo user to ensure clean seed
  await prisma.watchlistItem.deleteMany({
    where: { userId: demoUser.id },
  });

  // 3. Insert diverse sample items covering all statuses & types
  const sampleItems = [
    {
      title: 'Past Lives',
      type: ItemType.MOVIE,
      status: WatchStatus.COMPLETED,
      genre: 'Drama, Romance',
      rating: 10,
      notes: 'Konsep in-yeon yang sangat puitis dan emosional. Salah satu film indie terbaik tahun ini.',
    },
    {
      title: 'Severance',
      type: ItemType.SERIES,
      status: WatchStatus.WATCHING,
      genre: 'Sci-Fi, Psychological Thriller',
      rating: 9,
      notes: 'Misteri Lumon Industries yang adiktif. Setiap episode penuh intrik korporat distopia.',
    },
    {
      title: 'Dune: Part Two',
      type: ItemType.MOVIE,
      status: WatchStatus.COMPLETED,
      genre: 'Sci-Fi, Epic',
      rating: 9,
      notes: 'Sinematografi Greig Fraser dan skor Hans Zimmer yang spektakuler.',
    },
    {
      title: 'Challengers',
      type: ItemType.MOVIE,
      status: WatchStatus.PLAN_TO_WATCH,
      genre: 'Drama, Sport',
      rating: null,
      notes: 'Rekomendasi teman komunitas film karena musik tekno dan tensi pertandingannya.',
    },
    {
      title: 'The Bear',
      type: ItemType.SERIES,
      status: WatchStatus.WATCHING,
      genre: 'Drama, Comedy',
      rating: 9,
      notes: 'Yes, Chef! Ritme dapur yang super intens dan karakterisasi yang mendalam.',
    },
    {
      title: 'The Idol',
      type: ItemType.SERIES,
      status: WatchStatus.DROPPED,
      genre: 'Drama',
      rating: 3,
      notes: 'Alur cerita kurang konsisten dan terasa dangkal setelah 3 episode.',
    },
  ];

  for (const item of sampleItems) {
    await prisma.watchlistItem.create({
      data: {
        userId: demoUser.id,
        ...item,
      },
    });
  }

  console.log(`🎬 Seeded ${sampleItems.length} watchlist items successfully!`);
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
