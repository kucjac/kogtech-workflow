import request from 'request';
import debug from 'debug';

export default function (req, res) {
  const code = req.query.code;

  request(`https://slack.com/api/oauth.access?client_id=${process.env.SLACK_CLIENT_ID}&client_secret=${process.env.SLACK_CLIENT_SECRET}&redirect_uri=${process.env.SLACK_REDIRECT_URI}&code=${code}`, (err, response) => {
    debug('oauth2')(response)
    res.status(200).end();
  });
}
