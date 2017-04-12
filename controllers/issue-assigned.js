import fs from 'fs';
import slack from './slack';
import { getUserSlackIdFromEmail } from './get-user';

export default function issueAssigned(response) {

  // Announce what we're doing
  console.log(`- Issue assigned ${new Date()}`);

  const changelog = response.changelog.items[0];
  let messageString = `${response.user.displayName} has just assigned ${response.issue.key} to you (${changelog.toString}) - https://opsview.atlassian.net/browse/${response.issue.key}`;
  const commentTotal = response.issue.fields.comment.total;
  const comment = response.issue.fields.comment.comments[commentTotal - 1];
  const wasCommentAddedInLast15Mins = comment && Math.round(((new Date() - new Date(comment.created)) / 1000) / 60) < 15;

  if (wasCommentAddedInLast15Mins) {
    messageString = `${messageString} with the comment: _${comment.body}_`;
  }

  // We don't send it to you if you assigned it to yourself
  if (response.user.displayName.toLowerCase() === changelog.toString.toLowerCase()) {
    return false;
  }

  changelog.to = changelog.to || '';

  getUserSlackIdFromEmail(changelog.to.toLowerCase(), (err, slackId) => {
    if (err) {
      console.log(`- No Slack ID found for email ${changelog.to.toLowerCase()} ${new Date()}`, err);
    } else {
      console.log(`- Sending message to ${changelog.toString} from ${response.user.displayName} ${new Date()}`);
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
	console.log(`- Message sent successfully ${new Date()}`)
      });
    }
  });
}
