# 11.1 Warming up

_Think about a hypothetical situation where we have an application being worked on by a team of about 6 people. The application is in active development and will be released soon._

_Let us assume that the application is coded with **C#, specifically .NET ASP Core**._

_Write a short text, say 200-300 words, where you answer or discuss some of the points below:_

- _Some common steps in a CI setup include linting, testing, and building. What are the specific tools for taking care of these steps in the ecosystem of the language you picked?_

- _What alternatives are there to set up the CI besides Jenkins and GitHub Actions?_

- _Would this setup be better in a self-hosted or a cloud-based environment? Why? What information would you need to make that decision?_

In a team of six, it is preferrable to have strictly defined rules for CI/CD pipeline to avoid any confusion later on, when the implementation is already well underway. The team should use consistent coding style by utilizing `.editorConfig` file in their VS Code project. Unit testing can be performed with tools such as `xUnit`, `NUnit`, or `MSTest`. The application can be built using `MSBuild` or `dotnet.exe` to create `NuGet` packages. `Azure Pipelines` can be used to automate this process relatively easily for standard use cases.

Perhaps the most logical choice for a CI/CD cloud service would be `Azure DevOps`. The support for .NET framework is very good on Azure, perhaps because they both have the same company behind them (Microsoft). `Azure DevOps` can also be used as a self-hosted CI/CD server framework. The downside is relatively higher cost than the alternatives. Other alternatives are `TeamCity` by JetBrains and `GitLab`, among others.

If the team is working on the app independently, and especially if this team comprises the entire company, cloud-based environment is likely a better choice, if the app doesn't require special hardware and doesn't contain highly confidential data. With cloud-based environment, the already small team can focus on improving the app itself, and not worry about the DevOps details as much, not to mention that the initial price for obtaining their own dedicated server can be a significant impact on the company budget.
