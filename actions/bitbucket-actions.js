import request from 'request';

const request_settings = {
                  'auth': {
                    'user': process.env.BITBUCKET_USER,
                    'pass': process.env.BITBUCKET_PASS,
                  }
                };

const actions = {
  mergePullRequestWithIssueKey: (issue_key) => {
    console.log(`BitbucketActions: Merge PR w/ issue key ${issue_key} - TODO`);
    request.get('https://api.bitbucket.org/2.0/repositories/kognity/kog/pullrequests?pagelen=50',
                request_settings,
                function (error, response, body) {
                  console.log('Response from BB:');
                  if (!error && response.statusCode == 200) {
                    //console.log(response);
                    var info = JSON.parse(body);
                    console.log('Source:', info.values[0].source)
                    console.log('Target:', info.values[0].target);
                    console.log(info);
                  } else {
                    console.log(`Statuscode: ${response.statusCode}, error :`, error);
                  }
                }
    );
    return true;
  }
};

export default actions;


/*
pullrequests
{values: [
{ description: '',
       links: [Object],
       title: 'KOG-3123 Allowed all teachers to access Exam style question functionality in book',
       close_source_branch: true,
       merge_commit: null,
       destination: [Object],
       state: 'OPEN',
       closed_by: null,
       source: {
        commit: { hash: '5ccb319c2b72', links: { self: [Object] } },
        repository: {
          links: { self: [Object], html: [Object], avatar: [Object] },
          type: 'repository',
          name: 'kog',
          full_name: 'kognity/kog',
          uuid: '{845bb207-c1ee-4990-937e-bdb31e9bd22f}' },
          branch: { name: 'KOG-3123-remove-beta-access-limiitation-' }
        },
       comment_count: 0,
       author: [Object],
       created_on: '2017-04-13T08:48:54.152906+00:00',
       reason: '',
       updated_on: '2017-04-13T09:08:40.904529+00:00',
       type: 'pullrequest',
       id: 402,
       task_count: 0 }
]}
 */
