import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Clearing existing threads...');
  await prisma.thread.deleteMany();

  console.log('Seeding initial threads...');
  
  await prisma.thread.createMany({
    data: [
      {
        title: 'Feature Idea: Syncing swimming distance for Endurance stats',
        content: 'I swim 2km every morning. It would be amazing if the app could sync with my waterproof tracker to convert distance into endurance points!',
        authorName: 'AquaWarrior',
      },
      {
        title: 'Looking for a Guild!',
        content: 'Hey everyone, forming a guild for weightlifters in the downtown area. We aim to take down the Regional Titan boss by the end of the month. Hit me up if you want an invite.',
        authorName: 'IronLifter',
      },
      {
        title: 'How will the Luck stat actually work?',
        content: 'Title says it all. Will it boost drop rates from walking around or critical hit chance during challenges? Anyone read the dev blog on this?',
        authorName: 'RNGesus',
      }
    ]
  });

  console.log('Seeding complete! 🚀');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
