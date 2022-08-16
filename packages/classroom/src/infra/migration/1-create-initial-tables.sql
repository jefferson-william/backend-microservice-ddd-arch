CREATE TABLE "user" (id INT PRIMARY KEY, uuid UUID NOT NULL, email VARCHAR NOT NULL, password VARCHAR NOT NULL);

CREATE TABLE "Student" ("id" TEXT NOT NULL, "name" TEXT NOT NULL, "email" TEXT NOT NULL, CONSTRAINT "Student_pkey" PRIMARY KEY ("id"));

CREATE TABLE "Course" ("id" TEXT NOT NULL, "title" TEXT NOT NULL, "purchasesProductId" TEXT, CONSTRAINT "Course_pkey" PRIMARY KEY ("id"));

CREATE TABLE "Enrollment" ("id" TEXT NOT NULL, "studentId" TEXT NOT NULL, "courseId" TEXT NOT NULL, "purchasesEnrolledByPurchaseId" TEXT, "inactivatedAt" TIMESTAMP(3), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, CONSTRAINT "Enrollment_pkey" PRIMARY KEY ("id"));

CREATE UNIQUE INDEX "Student_email_key" ON "Student"("email");

CREATE UNIQUE INDEX "Course_purchasesProductId_key" ON "Course"("purchasesProductId");

CREATE UNIQUE INDEX "Enrollment_purchasesEnrolledByPurchaseId_key" ON "Enrollment"("purchasesEnrolledByPurchaseId");

ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "Enrollment" ADD CONSTRAINT "Enrollment_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
