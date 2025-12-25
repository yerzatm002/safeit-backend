function ok(res, data = null, message = "OK") {
  return res.status(200).json({ success: true, message, data });
}

function created(res, data = null, message = "Created") {
  return res.status(201).json({ success: true, message, data });
}

function fail(res, status = 400, message = "Bad Request", errors = null) {
  return res.status(status).json({ success: false, message, errors });
}

module.exports = { ok, created, fail };
