import express from 'express';
import bodyParser from 'body-parser';
import request from 'request';
import redirect from 'routes/redirect';
import issueAssigned from 'controllers/issue-assigned';

// Create the express app
const app = express();

// Setup req.body to contain POST JSON data
app.use(bodyParser.json({ type: 'application/json' }));

// OAuth2 redirect handler
app.get('/redirect', redirect);

// JIRA webhook handler
app.post('/jira-webhook', (req, res) => {
  debug('incoming')(`Incoming webhook at ${new Date()}`);

  // Switch case checks the issue type and runs the correct controller
  switch (req.body.issue_event_type_name) {
    case 'issue_assigned':
      issueAssigned(req.body);
      break;
    // More cases can be added here to deal with various issue types
    default:
      debug('error')(`Unsupported issue type '${req.body.issue_event_type_name}'`);
  }
});

app.listen(process.env.PORT, () => {
  debug('info')(`Server running on port ${process.env.PORT}\n`);
});
