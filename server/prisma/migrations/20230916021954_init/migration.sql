/*
  Warnings:

  - You are about to drop the `Post` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Post" DROP CONSTRAINT "Post_authorId_fkey";

-- DropTable
DROP TABLE "Post";

-- DropTable
DROP TABLE "User";

-- CreateTable
CREATE TABLE "HowToGuide" (
    "id" SERIAL NOT NULL,
    "path" TEXT NOT NULL,
    "metadataId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "HowToGuide_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Metadata" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "imageUrl" TEXT,

    CONSTRAINT "Metadata_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HowToGuide_path_key" ON "HowToGuide"("path");

-- CreateIndex
CREATE UNIQUE INDEX "HowToGuide_metadataId_key" ON "HowToGuide"("metadataId");

-- AddForeignKey
ALTER TABLE "HowToGuide" ADD CONSTRAINT "HowToGuide_metadataId_fkey" FOREIGN KEY ("metadataId") REFERENCES "Metadata"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
