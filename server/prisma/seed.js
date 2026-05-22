const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@projectflow.dev' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@projectflow.dev',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create member users
  const memberPassword = await bcrypt.hash('Member@123', 12);
  const member1 = await prisma.user.upsert({
    where: { email: 'alice@projectflow.dev' },
    update: {},
    create: {
      name: 'Alice Johnson',
      email: 'alice@projectflow.dev',
      password: memberPassword,
      role: 'MEMBER',
    },
  });

  const member2 = await prisma.user.upsert({
    where: { email: 'bob@projectflow.dev' },
    update: {},
    create: {
      name: 'Bob Smith',
      email: 'bob@projectflow.dev',
      password: memberPassword,
      role: 'MEMBER',
    },
  });

  // Create sample project
  const project = await prisma.project.upsert({
    where: { id: 'seed-project-1' },
    update: {},
    create: {
      id: 'seed-project-1',
      title: 'Website Redesign',
      description: 'Complete overhaul of the company website with modern design and improved UX.',
      createdById: admin.id,
    },
  });

  // Add members to project
  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project.id, userId: admin.id } },
    update: {},
    create: { projectId: project.id, userId: admin.id },
  });
  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project.id, userId: member1.id } },
    update: {},
    create: { projectId: project.id, userId: member1.id },
  });
  await prisma.projectMember.upsert({
    where: { projectId_userId: { projectId: project.id, userId: member2.id } },
    update: {},
    create: { projectId: project.id, userId: member2.id },
  });

  // Create sample tasks
  const tasks = [
    {
      title: 'Design wireframes',
      description: 'Create wireframes for all main pages',
      status: 'DONE',
      priority: 'HIGH',
      dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      assignedToId: member1.id,
    },
    {
      title: 'Implement authentication',
      description: 'JWT-based auth system with refresh tokens',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      assignedToId: member2.id,
    },
    {
      title: 'Setup CI/CD pipeline',
      description: 'Configure GitHub Actions for automated deployment',
      status: 'TODO',
      priority: 'MEDIUM',
      dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
      assignedToId: member1.id,
    },
    {
      title: 'Write API documentation',
      description: 'Document all REST API endpoints with examples',
      status: 'TODO',
      priority: 'LOW',
      dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // overdue
      assignedToId: member2.id,
    },
  ];

  for (const task of tasks) {
    await prisma.task.create({
      data: {
        ...task,
        projectId: project.id,
        createdById: admin.id,
      },
    });
  }

  console.log('✅ Seed complete!');
  console.log('\n📧 Login credentials:');
  console.log('  Admin:  admin@projectflow.dev / Admin@123');
  console.log('  Member: alice@projectflow.dev / Member@123');
  console.log('  Member: bob@projectflow.dev   / Member@123');
}

main()
  .catch((e) => {
    console.error('❌ Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
