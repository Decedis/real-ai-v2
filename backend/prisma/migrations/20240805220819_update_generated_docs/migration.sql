/*
  Warnings:

  - You are about to drop the column `referencedSubmissions` on the `GeneratedDocuments` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_GeneratedDocuments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_GeneratedDocuments" ("content", "id") SELECT "content", "id" FROM "GeneratedDocuments";
DROP TABLE "GeneratedDocuments";
ALTER TABLE "new_GeneratedDocuments" RENAME TO "GeneratedDocuments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
