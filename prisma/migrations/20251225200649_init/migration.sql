-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'user');

-- CreateEnum
CREATE TYPE "InstructionType" AS ENUM ('text', 'video', 'pdf');

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "group_name" TEXT,
    "email" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'user',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instructions" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" "InstructionType" NOT NULL,
    "content" TEXT,
    "video_url" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instructions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instruction_attachments" (
    "id" TEXT NOT NULL,
    "instruction_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_type" TEXT NOT NULL,
    "file_url" TEXT NOT NULL,
    "uploaded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "instruction_attachments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instruction_ack" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "instruction_id" TEXT NOT NULL,
    "acknowledged_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "instruction_ack_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tests" (
    "id" TEXT NOT NULL,
    "instruction_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "pass_score" INTEGER NOT NULL DEFAULT 70,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answers" (
    "id" TEXT NOT NULL,
    "question_id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "answers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "test_results" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "test_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "passed" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "test_results_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");

-- CreateIndex
CREATE INDEX "instructions_type_idx" ON "instructions"("type");

-- CreateIndex
CREATE INDEX "instruction_attachments_instruction_id_idx" ON "instruction_attachments"("instruction_id");

-- CreateIndex
CREATE INDEX "instruction_ack_instruction_id_idx" ON "instruction_ack"("instruction_id");

-- CreateIndex
CREATE INDEX "instruction_ack_user_id_idx" ON "instruction_ack"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "instruction_ack_user_id_instruction_id_key" ON "instruction_ack"("user_id", "instruction_id");

-- CreateIndex
CREATE INDEX "tests_instruction_id_idx" ON "tests"("instruction_id");

-- CreateIndex
CREATE INDEX "questions_test_id_idx" ON "questions"("test_id");

-- CreateIndex
CREATE INDEX "answers_question_id_idx" ON "answers"("question_id");

-- CreateIndex
CREATE INDEX "test_results_user_id_idx" ON "test_results"("user_id");

-- CreateIndex
CREATE INDEX "test_results_test_id_idx" ON "test_results"("test_id");

-- AddForeignKey
ALTER TABLE "instruction_attachments" ADD CONSTRAINT "instruction_attachments_instruction_id_fkey" FOREIGN KEY ("instruction_id") REFERENCES "instructions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instruction_ack" ADD CONSTRAINT "instruction_ack_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "instruction_ack" ADD CONSTRAINT "instruction_ack_instruction_id_fkey" FOREIGN KEY ("instruction_id") REFERENCES "instructions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests" ADD CONSTRAINT "tests_instruction_id_fkey" FOREIGN KEY ("instruction_id") REFERENCES "instructions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answers" ADD CONSTRAINT "answers_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "test_results" ADD CONSTRAINT "test_results_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;
