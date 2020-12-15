# Warp Front End

## Quickstart

Start the site locally by running the following in this directory:
```bash
yarn install
yarn start
```

You can connect your components to Zeplin by following the docs [here](https://github.com/zeplin/connected-components-docs/blob/master/docs/gettingStarted/REACT.md) and installing the following global modules:
```bash
npm install -g @zeplin/cli
npm install -g @zeplin/cli-connect-react-plugin
```

## Test Deploy

Update testDeploy branch with just frontEnd directory from develop
```bash
git checkout develop
git pull
git subtree split --prefix frontEnd -b testDeploy
git checkout testDeploy
git push
```

Deploys on Heroku to [here](https://warpfinance-warp-test.herokuapp.com)

## UAT Deploy

Update uatDeploy branch with just frontEnd directory from uat
```bash
git checkout uat
git pull
git subtree split --prefix frontEnd -b uatDeploy
git checkout uatDeploy
git push
```

Deploys on Heroku to [here](https://warpfinance-warp-uat.herokuapp.com)

## Production Deploy

Update deploy branch with just frontEnd directory from master
```bash
git checkout master
git pull
git subtree split --prefix frontEnd -b deploy
git checkout deploy
git push
```

Deploys on Heroku to [here](https://warpfinance-warp.herokuapp.com)
