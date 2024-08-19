-- CreateTable
CREATE TABLE "GeneratedDocuments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "content" TEXT NOT NULL,
    "referencedSubmissions" INTEGER NOT NULL,
    CONSTRAINT "GeneratedDocuments_referencedSubmissions_fkey" FOREIGN KEY ("referencedSubmissions") REFERENCES "FormSubmission" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
