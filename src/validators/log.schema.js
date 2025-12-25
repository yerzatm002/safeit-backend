const { z } = require("zod");

const uuid = z.string().uuid();
const isoDate = z.string().datetime({ offset: true }).or(z.string().datetime()).or(z.string()); 
// допускаем "2025-01-01" и ISO, в сервисе нормализуем

const ackLogQuerySchema = z.object({
  query: z.object({
    user_id: uuid.optional(),
    instruction_id: uuid.optional(),
    date_from: z.string().optional(),
    date_to: z.string().optional()
  })
});

const testLogQuerySchema = z.object({
  query: z.object({
    user_id: uuid.optional(),
    test_id: uuid.optional(),
    instruction_id: uuid.optional(), // удобно: фильтр по instruction через test
    date_from: z.string().optional(),
    date_to: z.string().optional()
  })
});

module.exports = {
  ackLogQuerySchema,
  testLogQuerySchema
};
