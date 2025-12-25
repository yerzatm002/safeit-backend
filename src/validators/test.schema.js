const { z } = require("zod");

const uuid = z.string().uuid();

const createTestSchema = z.object({
  body: z.object({
    instruction_id: uuid,
    title: z.string().min(3, "title must be at least 3 characters"),
    pass_score: z.number().int().min(0).max(100).optional(),
    questions: z
      .array(
        z.object({
          text: z.string().min(1, "question text required"),
          answers: z
            .array(
              z.object({
                text: z.string().min(1, "answer text required"),
                is_correct: z.boolean()
              })
            )
            .min(2, "at least 2 answers required")
        })
      )
      .min(1, "at least 1 question required")
  })
});

const testIdSchema = z.object({
  params: z.object({
    id: uuid
  })
});

const submitTestSchema = z.object({
  params: z.object({
    id: uuid
  }),
  body: z.object({
    answers: z
      .array(
        z.object({
          questionId: uuid,
          answerId: uuid
        })
      )
      .min(1, "answers are required")
  })
});

module.exports = {
  createTestSchema,
  testIdSchema,
  submitTestSchema
};
