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