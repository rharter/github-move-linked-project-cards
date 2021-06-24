# Move Linked Project Cards

> Automate linked issues in projects based on PR status.

This action allows you to move project cards for issues that your PRs fix.  For example, when a PR is created that fixes an issue and that issue has any project cards, they'll be moved to the In Review column.

## Usage

Create a new workflow `.yml` file in your `.github/workflows/` directory and configure it to be triggered by changes to pull requests. Use the `column` option to specify name the column you want linked issues to be moved to.  Use the optional `draft-column` to specify the name of the column you want linked issues to be move into if the PR is a draft.

```yaml
on:
  pull_request:
    types: [opened, edited, ready_for_review, synchronize]

jobs:
  move-linked-issues:
    runs-on: ubuntu-latest
    name: Move linked issues to In Review or In Progress column
    steps:
      - uses: rharter/github-move-linked-project-cards@v0.1.0
        with:
          github-token: ${{ secrets.GITHUB_TOKEN }}
          column: In Review
          draft-column: In Progress
```

## Options

| Input | Required | Description | Notes |
| --- | --- | --- | --- |
| `github-token` | * | The access token for the repository | `${{ secrets.GITHUB_TOKEN }} |
| `column` | * | The name of the column into which linked issues will be moved. | The column must already exist. |
| `draft-column` |  | The name of the column into which linked issues will be moved for draft PRs. | The column must already exist. |

# License

```
The MIT License (MIT)

Copyright 2021 Ryan Harter

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```
