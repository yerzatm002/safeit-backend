const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const logger = require("./utils/logger");
const errorHandler = require("./middlewares/errorHandler");
const app = express();

// Middlewares
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(logger);

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "inabat-backend" });
});

// Routes placeholder
// app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/instructions", require("./routes/instruction.routes"));
app.use("/api/instructions", require("./routes/instructionAttachment.routes"));
app.use("/api/attachments", require("./routes/attachment.routes"));
app.use("/api/instructions", require("./routes/ack.routes"));
app.use("/api/tests", require("./routes/test.routes"));
app.use("/api/logs", require("./routes/log.routes"));
app.use("/api/reports", require("./routes/report.routes"));

app.use(errorHandler);

module.exports = app;
