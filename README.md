# Blackys-Helper
This Project is a simple command helper bot for a small discord server. It's licensed under the MIT License, so feel free to fork the repository and ofcourse i'm thankful for any PR's, as this is the my first node project.

## Developer Guide
This project uses config-yml, to setup your local dev environment just copy the ./config/config.yml.template to ./config/dev.yml. 

You need to configure the values in the file ofcourse :).

Start the node app with --env dev.

You can of course name your environment differently, just make sure the file is in .gitignore so you're not running into the risk of publishing your secrets (bot-token, etc)

## Deployment
I'm planning to deploy the bot using docker, but right now i'm still just testing locally. Therefore the dockerfile is yet to come.