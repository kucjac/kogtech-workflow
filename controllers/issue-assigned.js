import fs from 'fs';
import slack from 'controllers/slack';
import { getUserSlackIdFromEmail } from 'controllers/get-user';

export default function issueAssigned(response) {

  // Announce what we're doing
  console.log('- Issue assigned');

  const changelog = response.changelog.items[0];
  const messageString = `${response.user.displayName} has just assigned ${response.issue.key} to you (${changelog.toString}) - https://opsview.atlassian.net/browse/${response.issue.key}`;

  changelog.to = changelog.to || '';

  getUserSlackIdFromEmail(changelog.to.toLowerCase(), (err, slackId) => {
    if (err) {
      console.log(`- No Slack ID found for email ${changelog.to.toLowerCase()}`);
    } else {
      slack.api('chat.postMessage', {
        text: messageString,
        channel: slackId,
        as_user: false,
        username: process.env.BOT_USERNAME || 'JIRA Bot',
        icon_emoji: process.env.BOT_EMOJI || ':information_source:'
      }, err => {
        if (err) {
      	  console.log('Could not notify via Slack. Error:', err);
      	}
      });
    }
  });
}
