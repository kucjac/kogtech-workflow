import slack from 'controllers/slack';

export function getUserSlackIdFromEmail(emailAddress, callback) {
  slack.api('users.list', (err, response) => {
    if (err || !response.ok) {
      throw new Error('Slack API error', err);
    }
    const member = response.members.filter(member => member.profile.email === emailAddress);

    if (member.length > 1 || member.length === 0) {
      callback({
        error: true,
        message: 'More than one matched email or no email matched',
        filteredMembersArray: member
      }, false);
    } else {
      callback(false, member[0].id);
    }
  });
}
