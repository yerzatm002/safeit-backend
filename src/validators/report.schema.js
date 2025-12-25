const { z } = require("zod");

const uuid = z.string().uuid();

const instructionReportQuerySchema = z.object({
  query: z.object({
    user_id: uuid.optional(),
    instruction_id: uuid.optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional()
  })
});

const testReportQuerySchema = z.object({
  query: z.object({
    user_id: uuid.optional(),
    test_id: uuid.optional(),
    instruction_id: uuid.optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional()
  })
});

const pdfReportQuerySchema = z.object({
  query: z.object({
    user_id: uuid.optional(),
    instruction_id: uuid.optional(),
    test_id: uuid.optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional()
  })
});

module.exports = {
  instructionReportQuerySchema,
  testReportQuerySchema,
  pdfReportQuerySchema
};
