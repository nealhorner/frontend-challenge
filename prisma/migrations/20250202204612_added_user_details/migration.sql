-- CreateTable
CREATE TABLE "UserDetails" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "company" TEXT,
    "website" TEXT,
    "location" TEXT,
    "github" TEXT,
    "linkedIn" TEXT,
    "twitter" TEXT,
    "bluesky" TEXT,
    "pronouns" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDetails_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserDetails" ADD CONSTRAINT "UserDetails_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
