-- CreateTable
CREATE TABLE "DemoAccount" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "dailyCount" INTEGER NOT NULL DEFAULT 0,
    "hourlyCount" INTEGER NOT NULL DEFAULT 0,
    "lastRequestTime" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DemoAccount_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "DemoAccount_userId_key" ON "DemoAccount"("userId");
