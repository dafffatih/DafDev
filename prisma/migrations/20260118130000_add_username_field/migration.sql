-- AlterTable: Add username column to User
ALTER TABLE "User" ADD COLUMN "username" TEXT;

-- CreateIndex: Unique constraint on username
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- AlterTable: Rename email to username in LoginAttempt (if exists)
-- First check if LoginAttempt table exists and has email column
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_name = 'LoginAttempt'
    ) THEN
        -- Rename email column to username in LoginAttempt
        IF EXISTS (
            SELECT 1 FROM information_schema.columns 
            WHERE table_name = 'LoginAttempt' AND column_name = 'email'
        ) THEN
            ALTER TABLE "LoginAttempt" RENAME COLUMN "email" TO "username";
        END IF;
    END IF;
END $$;

-- CreateTable: LoginAttempt (if not exists)
CREATE TABLE IF NOT EXISTS "LoginAttempt" (
    "id" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "lockUntil" TIMESTAMP(3),
    "delayLevel" INTEGER NOT NULL DEFAULT 1,
    "lastAttempt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LoginAttempt_pkey" PRIMARY KEY ("id")
);

-- CreateIndex: Unique constraint on LoginAttempt username (if not exists)
CREATE UNIQUE INDEX IF NOT EXISTS "LoginAttempt_username_key" ON "LoginAttempt"("username");

-- AlterTable: Add order column to Skill (if not exists)
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'Skill' AND column_name = 'order'
    ) THEN
        ALTER TABLE "Skill" ADD COLUMN "order" INTEGER NOT NULL DEFAULT 0;
    END IF;
END $$;
