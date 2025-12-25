const PDFDocument = require("pdfkit");

function formatDate(date) {
  if (!date) return "";
  const d = new Date(date);
  return d.toISOString().slice(0, 19).replace("T", " ");
}

function safeText(str, max = 40) {
  if (!str) return "";
  const s = String(str);
  return s.length > max ? s.slice(0, max - 3) + "..." : s;
}

/**
 * Creates and streams PDF to response
 */
function generatePdfReport(res, { instructionRows, testRows, generatedBy }) {
  const doc = new PDFDocument({ margin: 40, size: "A4" });

  // HTTP headers
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", `attachment; filename="report.pdf"`);

  doc.pipe(res);

  // Title
  doc.fontSize(18).text("Отчёт по инструктажам и тестам", { align: "center" });
  doc.moveDown(0.5);
  doc.fontSize(10).text(`Дата генерации: ${formatDate(new Date())}`);
  if (generatedBy) {
    doc.fontSize(10).text(`Сформировал: ${generatedBy}`);
  }
  doc.moveDown(1);

  // Section 1: Instructions
  doc.fontSize(14).text("1) Инструктажи (ознакомление)", { underline: true });
  doc.moveDown(0.5);

  if (!instructionRows.length) {
    doc.fontSize(10).text("Нет данных по инструктажам для выбранных фильтров.");
    doc.moveDown(1);
  } else {
    // Table header
    doc.fontSize(10).text(
      "Дата | Пользователь | Email | Инструкция",
      { continued: false }
    );
    doc.moveDown(0.3);
    doc.text("---------------------------------------------------------------------");
    doc.moveDown(0.3);

    instructionRows.forEach((row) => {
      const line = `${formatDate(row.acknowledged_at)} | ${safeText(row.user.full_name, 18)} | ${safeText(row.user.email, 20)} | ${safeText(row.instruction.title, 30)}`;
      doc.text(line);
    });

    doc.moveDown(1);
  }

  // Section 2: Tests
  doc.fontSize(14).text("2) Тестирование (результаты)", { underline: true });
  doc.moveDown(0.5);

  if (!testRows.length) {
    doc.fontSize(10).text("Нет данных по тестам для выбранных фильтров.");
    doc.moveDown(1);
  } else {
    doc.fontSize(10).text(
      "Дата | Пользователь | Тест | Балл | Пройден",
      { continued: false }
    );
    doc.moveDown(0.3);
    doc.text("---------------------------------------------------------------------");
    doc.moveDown(0.3);

    testRows.forEach((row) => {
      const line = `${formatDate(row.created_at)} | ${safeText(row.user.full_name, 18)} | ${safeText(row.test.title, 24)} | ${row.score}% | ${row.passed ? "Да" : "Нет"}`;
      doc.text(line);
    });

    doc.moveDown(1);
  }

  // Footer
  doc.fontSize(9).text("Система Inabat — отчёт сформирован автоматически.", {
    align: "center"
  });

  doc.end();
}

module.exports = { generatePdfReport };
