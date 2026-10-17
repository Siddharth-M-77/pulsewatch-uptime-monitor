-- AlterTable
ALTER TABLE "User" ADD COLUMN     "currentPeriodEnd" TIMESTAMP(3),
ADD COLUMN     "plan" TEXT NOT NULL DEFAULT 'free',
ADD COLUMN     "razorpayCustomerId" TEXT,
ADD COLUMN     "razorpaySubscriptionId" TEXT,
ADD COLUMN     "subscriptionStatus" TEXT;
