module.exports = {
  default: [
    "--require-module ts-node/register", // Load TypeScript module
    "--require features/step_definitions/**/*.steps.ts", // Load step definitions
    "--require src/hooks/**/*.ts", // Load hooks
    //"--format progress", // Load custom formatter
    "--format html:./reports/cucumber-report.html",
    "--format json:./reports/cucumber-report.json",
    "--publish",
    "--retry 3", // The number of running again when run failed
    "--retry-tag-filter \"@retry\"", // Just run again when scenarios have tag @retry
    "--parallel 6"
  ].join(" "),
};
