import bitbucketActions from '../actions/bitbucket-actions';
import teamcityActions from '../actions/teamcity-actions';

const hook = function(body) {
  const changelog_items = body.changelog.items;
  const issue_key = body.issue.key;
  const status_change_item = changelog_items.find((change_item) => change_item.field === 'status');

  if (status_change_item) {
    switch(status_change_item.toString) {
      case "Done":
        if (bitbucketActions.mergePullRequestWithIssueKey(issue_key)) {
          teamcityActions.releaseCurrentDevToProduction();
        }
        break;
      default:
        console.log(`NON IMPLEMENTED STATUS CHANGE TO - ${status_change_item.toString}`);
    }
    return;
  }

  console.log(`NON IMPLEMENTED CHANGE FIELD, WITHOUT STATUS TRANSITION - ${changelog_items[0].field}`);


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
};

export default hook;