const fs = require('fs');
const path = require('path');

const logDir = path.resolve(__dirname, '../../logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const logFile = path.join(logDir, 'security.log');

function log(level, event, details = {}) {
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    event,
    ...details,
  });
  fs.appendFileSync(logFile, entry + '\n');
}

module.exports = {
  logAuthSuccess: (email, ip) => log('INFO', 'AUTH_SUCCESS', { email, ip }),
  logAuthError: (email, ip) => log('WARN', 'AUTH_FAILURE', { email, ip }),
  logLogout: (userId, ip) => log('INFO', 'LOGOUT', { userId, ip }),
  logSearch: (userId, query) => log('INFO', 'SEARCH', { userId, query }),
  logInsert: (userId, name) => log('INFO', 'INSERT', { userId, exerciseName: name }),
};
