const { prompt } = require('inquirer');
var request = require('request');
const chalk = require('chalk');
const util = require('util');
const fs = require('fs');

const writeFilePromise = util.promisify(fs.writeFile);
const readFilePromise = util.promisify(fs.readFile);

/**
 * These are the question propmts for this CLI command
 */
const questions = [
    {
        type : 'input',
        name : 'inputFileName',
        message : 'What env file do you want to generate base64 for',
        validate : (fileName) => {
            if (fileName.endsWith('.env')) return true;
            return 'Please make sure your file type is .env';
        }
    }
]

module.exports = () => {

    console.log(chalk.bold.green(
        `\nYou can use the result of this command to power Continous deployment of your app. Simply add it ` +
        `to paste it as the value for and ENVIRONMENT variable in CircleCI like DEV_ENV_FILE, ` +
        `STAGING_ENV_FILE, PROD_ENV_FILE etc  and update .circleci/confi.yml if needed.\n`
    ));

    prompt(questions)
        .then(answers => {
            return readFilePromise(`../${answers.inputFileName}`);
        })
        .then((fileContent) => {
            console.log(fileContent.toString('base64'));
        })
        .catch(err => {
            console.error(chalk.bold.red('Something went wrong:'));
            console.error(err.stack);
        });
}
