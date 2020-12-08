# Warp

## Push Smart Contracts to Public Repository

Update contracts branch with just Smart-Contracts directory from master
```bash
git checkout master
git pull
git subtree split --prefix Smart-Contracts -b contracts
git checkout contracts
git remote set-url --push origin https://github.com/warpfinance/Warp-Contracts.git
git push
git checkout master
git pull
git remote set-url --push origin https://github.com/warpfinance/Warp.git
```

Pushes to [here](https://github.com/warpfinance/Warp-Contracts)
