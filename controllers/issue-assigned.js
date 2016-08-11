import slack from 'controllers/slack';
import { getUserSlackIdFromEmail } from 'controllers/get-user';
import fs from 'fs';

export default function issueAssigned(response) {
  // Log any records we send
  fs.appendFile('responses.json', JSON.stringify(response) + '\n', function(err) { 
    if (err) {
      console.log('failed to write to file', err); 
    }
  });
  const changelog = response.changelog.items[0];
  const messageString = `${response.user.displayName} has just assigned ${response.issue.key} to you (${changelog.toString}) - https://opsview.atlassian.net/browse/${response.issue.key}`;
  changelog.to = changelog.to || "";

  // If someone is assigning something to themselves this stops them recieveing a notification 
  if (response.user.displayName === changelog.to.toLowerCase() || response.user.displayName === changelog.to) {
    return false;
  }

  getUserSlackIdFromEmail(changelog.to.toLowerCase(), (err, slackId) => {
    if (err) {
      console.log(`- No Slack ID found for email ${changelog.to.toLowerCase()}`);
    } else {
      slack.api('chat.postMessage', {
        text: `${messageString}`,
        channel: slackId,
        as_user: false,
        username: 'Opsview JIRA',
        icon_emoji: ':party_parrot:'
      }, err => {
        if (err) { 
	  throw new Error(err);
	}		
      });
    }
  });
}
