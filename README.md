<p align="center">
  <img
    alt="Cheet Sheet"
    src="/docs/images/readme_logo.png"
    width="700"
  />
</p>
<br/>

Cheet Sheet is an open source Content Management System for developers and development teams to Create, Edit and Share code snippets. This accelerates software engineering by having a centralized place where one can see how they or teammates have solved common problems in the past.
<br/><br/>
Setting up Cheet Sheet for you or your organization is simple. All you need is Docker, node and an AWS account. It's 100% Serverless so your costs and infrastructure will automatically scale and grow automatically with minimal effort on your part. ***Read [Getting Started](/docs/getting-started.md)***
<br/><br/>
Here is my own instance of the application: https://cheet-sheet.gugz.net/
<br/><br/>
If you use the app and like it please leave a star. If you find bugs feel free to submit an issue.

<h1>Features</h1>

<h2>Public View</h2>
<p align="left">
  <img
    alt="Public View"
    src="/docs/images/Public_View.png"
    width="700"
  />
</p>
Cheet Sheet is fairly simple to understand. Code snippets are are organized as sheets with self defined category (ex: Programming Language, Framework, tool, etc). Each sheet has two columns of index cards. Every index card has a code snippet. You can copy the entire content of the card by clicking on the copy icon. Everything here is read only.

<h2>Personal View</h2>
<p align="left">
  <img
    alt="Personal View"
    src="/docs/images/Personal_View.png"
    width="700"
  />
</p>

If you sign up for an account and log in, you will have access to your own Personal Cheet Sheet workspace. AWS Cognito handles authentication for this app. Sheets in your personal workspace are only accessible to you. They are completely separate from the ones in the Public View. As a logged in user you have to ability to Create, Modify and Delete sheets in your personal workspace.

<p align="left">
  <img
    alt="Personal View Edit Mode"
    src="/docs/images/Personal_View_Edit_Mode.png"
    width="700"
  />
</p>

You can enter Edit mode by manually toggling it on and off. When on, you can add, remove and modify index cards. You can even rearrange them via drag and drop. All changes to your sheet are transient and won't be permanent unless you save. Refreshing the page, moving between sheets, or workspaces will cause you to loose all progress so be careful.

<h2>Teams</h2>
<p align="left">
  <img
    alt="Personal View Edit Mode"
    src="/docs/images/Team_Workspaces.png"
    width="450"
  />
</p>

Team workspaces are also available for logged in users. Everything you can do on a Personal workspace applies here except that this workspace can be viewed and edited by anyone who is on your team. To create a new workspace all you need to do is simply make a group in the Cognito user pool and add users to it. The name of the group is the name of team.
<br/><br/>
The sheets and index cards that are viewable by the public, are part of the Public Workspace. For a user to modify the sheets in this workspace they must be added to the `admin` user group in cognito.

<h2>Built With</h2>
Here are some of the publicly available tools Cheet Sheet was built with:

- AWS CDK
- AWS SAM
- Angular
- Angular Material
- Ace Editor
- Python
- Typescript
- Javascript
- Node
- Docker
- Circle CI

<h2>AWS Services Used</h2>
These are the AWS services a deployed instance of Cheet Sheet uses:

- Cloudformation
- Lambda
- API Gateway
- S3
- Coginto
- IAM
- Cloudfront
- Route53
- Cloudwatch
