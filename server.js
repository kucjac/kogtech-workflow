import express from 'express';
import bodyParser from 'body-parser';
import request from 'request';
import jiraWebhook from './hooks/jira-webhook';
//import redirect from './routes/redirect';
//import issueAssigned from './controllers/issue-assigned';


// Create the express app
const app = express();

// Setup req.body to contain POST JSON data
app.use(bodyParser.json({ type: 'application/json' }));

// OAuth2 redirect handler
//app.get('/redirect', redirect);
import BitbucketActions from './actions/bitbucket-actions';
app.get('/debug', (req, res) => {
  BitbucketActions.mergePullRequestWithIssueKey('KST-123');
});

// JIRA webhook handler
app.post('/jira-webhook', (req, res) => {

  console.log(`Incoming JIRA webhook at ${new Date()}`);
  console.log(req.body);
  console.log(req.body.changelog.items);
  jiraWebhook(req.body);

  //const changelog_items = req.body.changelog.items;
  //const type_of_change = changelog_item.field; // assignee, status
  /*
  { field: 'assignee',
    fieldtype: 'jira',
    from: 'marcus',
    fromString: 'Marcus Erlandsson',
    to: null,
    toString: null },
  { field: 'status',
    fieldtype: 'jira',
    from: '11100',
    fromString: 'Backlog',
    to: '3',
    toString: 'In Progress' }
    */

  // Switch case checks the issue type and runs the correct controller
  /*switch (req.body.issue_event_type_name) {
    case 'issue_assigned':

      break;
    case 'issue_generic':
      if (req.body.changelog.items[0] && req.body.changelog.items[0].field === 'assignee') {
        console.log('- Issue assignee updated, proxy to issue assigned');
        issueAssigned(req.body);
      }
      break;
    // More cases can be added here to deal with various issue types
    default:
      console.log(`- Unsupported issue type '${req.body.issue_event_type_name}'`);
  }
  */
});

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
