-- CreateTable
CREATE TABLE "LearningResources" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "url" TEXT NOT NULL,

    CONSTRAINT "LearningResources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningEngagementEvents" (
    "id" SERIAL NOT NULL,
    "learningResourceId" INTEGER NOT NULL,
    "learningResourceType" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "LearningEngagementEvents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LearningEngagementEventsAggregated" (
    "id" SERIAL NOT NULL,
    "learningResourceType" TEXT NOT NULL,
    "learningResourceId" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "LearningEngagementEventsAggregated_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "LearningResources_title_key" ON "LearningResources"("title");

-- CreateIndex
CREATE UNIQUE INDEX "LearningResources_url_key" ON "LearningResources"("url");

-- AddForeignKey
ALTER TABLE "LearningEngagementEvents" ADD CONSTRAINT "LearningEngagementEvents_learningResourceId_fkey" FOREIGN KEY ("learningResourceId") REFERENCES "LearningResources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LearningEngagementEventsAggregated" ADD CONSTRAINT "LearningEngagementEventsAggregated_learningResourceId_fkey" FOREIGN KEY ("learningResourceId") REFERENCES "LearningResources"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
