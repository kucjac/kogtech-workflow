import Slack from 'slack-node';

const slack = new Slack(process.env.SLACK_TOKEN);

export default slack;
