const core = require('@actions/core');
const github = require('@actions/github');

function linkedIssues(pullRequestId, limit = 100) {
  return `query {
    node(id: "${pullRequestId}") {
      ... on PullRequest {
        id
        title
        number
        closingIssuesReferences(first: ${limit}) {
          nodes {
            id
            number
            title
          }
          totalCount
          pageInfo {
            hasNextPage
            hasPreviousPage
            startCursor
            endCursor
          }
        }
      }
    }
  }`
}

function issueProjectCardsQuery(issueId) {
  return `query {
    node(id: "${issueId}") {
      ... on Issue {
        id
        projectCards(first: 100) {
          nodes {
            id
            column {
              name
              id
            }
            project {
              id
              name
              columns(first: 100) {
                nodes {
                  id
                  name
                }
              }
            }
          }
        }
      }
    }
  }`
}

function moveProjectCardQuery(cardId, columnId) {
  return `mutation {
    moveProjectCard( input: {
      cardId: "${cardId}",
      columnId: "${columnId}"
    }) { clientMutationId }
  }`
}

async function main() {
  try {
    const pr = github.context.payload.pull_request;
    if (!pr) {
      console.log('Payload doesn\'t contain a pull request, so nothing to be done.');
      return;
    }

    const token = core.getInput('github-token')
    let columnName = core.getInput('column')
    if (pr.draft) {
      columnName = core.getInput('draft-column') || columnName
    }

    const octokit = github.getOctokit(token);

    const linkedIssuesQuery = linkedIssues(pr.node_id);
    core.debug("query:", linkedIssuesQuery);

    const { node } = await octokit.graphql(linkedIssuesQuery)
    core.debug("node:", JSON.stringify(node, undefined, 2))

    for (let issue of node.closingIssuesReferences.nodes) {
      const issueId = issue.id
      const projectCardsQuery = issueProjectCardsQuery(issueId)

      const { node } = await octokit.graphql(projectCardsQuery)
      for (let card of node.projectCards.nodes) {
        const column = card.project.columns.nodes.find(c => c.name === columnName)
        if (!column) {
          console.log(`Issue #${issue.number} has a card on project ${card.project.name}, but there is no column named ${columnName}, so it won't be moved.`);
          continue;
        }
        if (card.column.name === columnName) {
          console.log(`Issue #${issue.number} is already in column ${column.name} on the ${card.project.name} project. Nothing to be done.`)
          continue;
        }

        console.log(`Moving issue #${issue.number} to ${column.name} column on ${card.project.name} project.`)
        const moveQuery = moveProjectCardQuery(card.id, column.id)
        
        await octokit.graphql(moveQuery)
      }
    }
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
