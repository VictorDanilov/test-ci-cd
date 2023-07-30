import core from '@actions/core';
import github from '@actions/github';

const eslintReportJobName = 'ESLint Report Analysis';

const rulesDictionary = {
  'react/self-closing-comp': `Папався на **react/self-closing-comp**. Чекай инфу - http://hdrezka.me/continue/`,
  'react/jsx-no-useless-fragment': 'Мусорный фрагмент? Серьезно? Выпиливай!',
};

const defaultCommentSuggestion = 'Ля, я хз, правь сам. Советов нет.';

async function run() {
  const octokit = github.getOctokit(process.env.TOKEN);

  const {
    payload: {
      pull_request: {
        head: { sha: lastCommit },
        number: pullRequestNumber,
      },
    },
    repo: { owner, repo },
  } = github.context;

  const pathParams = {
    owner,
    repo,
    pull_number: pullRequestNumber,
    headers: {
      'X-GitHub-Api-Version': '2022-11-28',
    },
  };

  const { data: checkRuns } = await octokit.request(
    'GET /repos/{owner}/{repo}/commits/{ref}/check-runs',
    {
      ...pathParams,
      ref: lastCommit,
    },
  );

  const { id: checkRunId } = checkRuns.check_runs.find(
    ({ name }) => name === eslintReportJobName,
  );

  const { data: annotations } = await octokit.request(
    'GET /repos/{owner}/{repo}/check-runs/{check_run_id}/annotations',
    {
      ...pathParams,
      check_run_id: checkRunId,
    },
  );

  if (annotations.length === 0) {
    return;
  }

  const { data: pullRequestMessages } = await octokit.request(
    'GET /repos/{owner}/{repo}/pulls/{pull_number}/comments',
    {
      ...pathParams,
    },
  );

  const setOfMessages = pullRequestMessages.reduce(
    (acc, { path, line, body }) => acc.add(`${path}_${line}_${body}`),
    new Set(),
  );

  for (const annotation of annotations) {
    const {
      path,
      start_line: startLine,
      end_line: endLine,
      message,
    } = annotation;

    console.log(message, startLine, endLine, annotation);

    const line = startLine === endLine ? startLine : endLine;

    const eslintRule = message.slice(1, message.indexOf(']'));
    const commentMessage =
      rulesDictionary[eslintRule] || defaultCommentSuggestion;
    const commitId = annotation.blob_href.split('/')[6];
    const messageForCheck = `${path}_${line}_${commentMessage}`;

    const isNewComment = !setOfMessages.has(messageForCheck);

    if (isNewComment) {
      await octokit.request(
        'POST /repos/{owner}/{repo}/pulls/{pull_number}/comments',
        {
          ...pathParams,
          body: commentMessage,
          line,
          path,
          commit_id: commitId,
        },
      );
    }
  }

  core.setFailed('Check ESLint errors.');
}

try {
  run();
} catch (error) {
  core.setFailed(error.message);
}
