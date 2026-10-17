-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "name" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Monitor" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'GET',
    "interval" INTEGER NOT NULL DEFAULT 60,
    "timeout" INTEGER NOT NULL DEFAULT 10000,
    "expectedStatusMin" INTEGER NOT NULL DEFAULT 200,
    "expectedStatusMax" INTEGER NOT NULL DEFAULT 399,
    "paused" BOOLEAN NOT NULL DEFAULT false,
    "slug" TEXT NOT NULL,
    "isPublic" BOOLEAN NOT NULL DEFAULT false,
    "alertEmail" TEXT,
    "currentStatus" TEXT NOT NULL DEFAULT 'pending',
    "lastCheckedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Monitor_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Check" (
    "id" TEXT NOT NULL,
    "monitorId" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "statusCode" INTEGER,
    "responseTime" INTEGER,
    "error" TEXT,
    "checkedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Check_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Incident" (
    "id" TEXT NOT NULL,
    "monitorId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),
    "cause" TEXT,

    CONSTRAINT "Incident_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Monitor_slug_key" ON "Monitor"("slug");

-- CreateIndex
CREATE INDEX "Monitor_userId_idx" ON "Monitor"("userId");

-- CreateIndex
CREATE INDEX "Check_monitorId_checkedAt_idx" ON "Check"("monitorId", "checkedAt");

-- CreateIndex
CREATE INDEX "Incident_monitorId_idx" ON "Incident"("monitorId");

-- AddForeignKey
ALTER TABLE "Monitor" ADD CONSTRAINT "Monitor_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Check" ADD CONSTRAINT "Check_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incident" ADD CONSTRAINT "Incident_monitorId_fkey" FOREIGN KEY ("monitorId") REFERENCES "Monitor"("id") ON DELETE CASCADE ON UPDATE CASCADE;
