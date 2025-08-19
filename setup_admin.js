// Admin setup script - Run this once to create an admin user
// Usage: node setup_admin.js <user_email_or_id>

const { db } = require('./server/db.js');
const { users, adminPermissions } = require('./shared/schema.js');
const { eq } = require('drizzle-orm');

async function setupAdmin(userIdentifier) {
  try {
    console.log('Setting up admin user...');
    
    // Find user by email or ID
    let user;
    if (userIdentifier.includes('@')) {
      user = await db.query.users.findFirst({
        where: eq(users.email, userIdentifier)
      });
    } else {
      user = await db.query.users.findFirst({
        where: eq(users.id, userIdentifier)
      });
    }

    if (!user) {
      console.error('User not found:', userIdentifier);
      process.exit(1);
    }

    // Make user admin
    await db.update(users)
      .set({ 
        isAdmin: true, 
        adminRole: 'super_admin',
        updatedAt: new Date()
      })
      .where(eq(users.id, user.id));

    // Add admin permissions
    const permissions = [
      'edit_products',
      'add_products', 
      'view_prescriptions',
      'manage_users'
    ];

    for (const permission of permissions) {
      await db.insert(adminPermissions)
        .values({
          userId: user.id,
          permission
        })
        .onConflictDoNothing();
    }

    console.log(`✅ Admin setup complete for: ${user.email}`);
    console.log('Admin permissions granted:', permissions.join(', '));
    console.log('\nThe user can now access /admin');

  } catch (error) {
    console.error('Error setting up admin:', error);
    process.exit(1);
  }
}

const userIdentifier = process.argv[2];
if (!userIdentifier) {
  console.error('Usage: node setup_admin.js <user_email_or_id>');
  process.exit(1);
}

setupAdmin(userIdentifier);