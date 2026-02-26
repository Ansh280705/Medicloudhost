import { currentUser } from "@clerk/nextjs/server";
import { db } from "./prisma";


export const checkUser = async () => {
  const user = await currentUser();

  if (!user) {
    return null;
  }

  try {
    const loggedInUser = await db.user.findUnique({
      where: {
        clerkUserId: user.id,
      },
      include: {
        transactions: {
          where: {
            type: "CREDIT_PURCHASE",
            // Only get transactions from current month
            createdAt: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
        },
      },
    });

    if (loggedInUser) {
      return loggedInUser;
    }

    // Check if user exists by email if clerkUserId lookup failed
    const emailAddress = user.emailAddresses[0].emailAddress;
    const existingUserByEmail = await db.user.findUnique({
      where: { email: emailAddress },
    });

    if (existingUserByEmail) {
      // Link the existing user with the new Clerk ID
      const updatedUser = await db.user.update({
        where: { id: existingUserByEmail.id },
        data: {
          clerkUserId: user.id,
          imageUrl: user.imageUrl,
          name: `${user.firstName} ${user.lastName}`,
        },
      });
      return updatedUser;
    }

    const name = `${user.firstName} ${user.lastName}`;

    const newUser = await db.user.create({
      data: {
        clerkUserId: user.id,
        name,
        imageUrl: user.imageUrl,
        email: emailAddress,
        transactions: {
          create: {
            type: "CREDIT_PURCHASE",
            packageId: "free_user",
            amount: 0,
          },
        },
      },
    });

    return newUser;
  } catch (error) {
    console.log(error.message);
  }
};