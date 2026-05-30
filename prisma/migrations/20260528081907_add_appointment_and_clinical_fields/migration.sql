-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Visit" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "patientName" TEXT NOT NULL,
    "email" TEXT,
    "phone" TEXT,
    "type" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "visitorCompanion" TEXT,
    "ailments" TEXT,
    "medicines" TEXT,
    "followUp" TEXT,
    "isAppointment" BOOLEAN NOT NULL DEFAULT false,
    "appointmentDate" DATETIME,
    "qrToken" TEXT,
    "status" TEXT NOT NULL DEFAULT 'in house',
    "checkInTime" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "checkOutTime" DATETIME,
    "doctorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Visit_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "Doctor" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Visit" ("checkInTime", "checkOutTime", "createdAt", "destination", "doctorId", "email", "id", "patientName", "reason", "status", "type", "updatedAt", "visitorCompanion") SELECT "checkInTime", "checkOutTime", "createdAt", "destination", "doctorId", "email", "id", "patientName", "reason", "status", "type", "updatedAt", "visitorCompanion" FROM "Visit";
DROP TABLE "Visit";
ALTER TABLE "new_Visit" RENAME TO "Visit";
CREATE UNIQUE INDEX "Visit_qrToken_key" ON "Visit"("qrToken");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
