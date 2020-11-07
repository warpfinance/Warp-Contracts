import * as React from "react";

import { AmountModal, AuthorizationModal, BigModal, BorrowerTable, Header, InformationCard, RowModal } from "../../components";
import { Avatar, Grid } from "@material-ui/core";

import { AvatarGroup } from "@material-ui/lab";
import { useState } from "react";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { useStableCoinTokens } from "../../hooks/useStableCoins";
import { useLPTokens } from "../../hooks/useLPTokens";
import { Token } from "../../util/token";
import { useUSDCToken } from "../../hooks/useUSDC";
import { BigNumber, utils } from "ethers";
import { useWarpControl } from "../../hooks/useWarpControl";
import { parseBigNumber } from "../../util/tools";
import { ERC20Service } from "../../services/erc20";
import { WarpLPVaultService } from "../../services/warpLPVault";
import { useBorrowLimit } from "../../hooks/useBorrowLimit";
import { getLogger } from "../../util/logger";
import { useCombinedBorrowRate } from "../../hooks/useCombinedBorrowRate";
import { StableCoinWarpVaultService } from "../../services/stableCoinWarpVault";

interface Props {

}

// TO-DO: Web3 integration

const logger = getLogger("Page::Borrower");

export const Borrower: React.FC<Props> = (props: Props) => {
    const context = useConnectedWeb3Context();
    const stableCoins = useStableCoinTokens(context);
    const lpTokens = useLPTokens(context);
    const usdcToken = useUSDCToken(context);
    const {control} = useWarpControl(context);
    const {totalBorrowedAmount, borrowLimit} = useBorrowLimit(context, control);
    const combinedBorrowRate = useCombinedBorrowRate(context, control, stableCoins);

    const data = {
        collateral: parseBigNumber(borrowLimit, usdcToken?.decimals),
        borrowPercentage: 0,
        interestRate: combinedBorrowRate,
        borrowLimit: parseBigNumber(borrowLimit, usdcToken?.decimals),
        borrowLimitUsed: parseBigNumber(totalBorrowedAmount, usdcToken?.decimals),
    }

    if (data.borrowLimit > 0) {
        data.borrowPercentage = (data.borrowLimitUsed / data.borrowLimit) * 100;
    }

    const [authAction, setAuthAction] = useState("borrow");
    const [authorizationModalOpen, setAuthorizationModalOpen] = useState(false);

    const [borrowAmountCurrency, setBorrowAmountCurrency] = React.useState("DAI");
    const [borrowAmountValue, setBorrowAmountValue] = React.useState(0);
    const [borrowError, setBorrowError] = useState(false);
    const [borrowModalOpen, setBorrowModalOpen] = useState(false);

    const [provideAmountValue, setProvideAmountValue] = React.useState(0);
    const [provideError, setProvideError] = useState(false);
    const [provideLpValue, setProvideLpValue] = React.useState(0);
    const [provideModalOpen, setProvideModalOpen] = useState(false);

    const [repayAmountValue, setRepayAmountValue] = React.useState(0);
    const [repayError, setRepayError] = useState(false);
    const [repayModalOpen, setRepayModalOpen] = useState(false);

    const [withdrawAmountValue, setWithdrawAmountValue] = React.useState(0);
    const [withdrawError, setWithdrawError] = useState(false);
    const [withdrawLpValue, setWithdrawLpValue] = React.useState(0);
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);

    const [currentToken, setCurrentToken] = React.useState<Token>({} as Token);
    const [tokenToUSDCRate, setTokenToUSDCRate] = React.useState(0); 
    const [walletAmount, setWalletAmount] = React.useState(0);
    const [vaultAmount, setVaultAmount] = React.useState(0);

    React.useEffect(() => {
        if (borrowAmountValue !== 0) {
            setBorrowError(isBorrowError(borrowAmountValue, currentToken));
        }
        if (provideLpValue !== 0) {
            setProvideError(isProvideError(provideLpValue, currentToken));
        }
        if (repayAmountValue !== 0) {
            setRepayError(isRepayError(repayAmountValue, currentToken));
        }
        if (withdrawLpValue !== 0) {
            setWithdrawError(isWithdrawError(withdrawLpValue, currentToken));
        }
    }, [borrowAmountValue, borrowAmountCurrency,
        provideLpValue, currentToken,
        repayAmountValue,
        withdrawLpValue,
        tokenToUSDCRate]
    );

    const handleAuthClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setAuthorizationModalOpen(false);
    }

    const handleBorrowClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setBorrowModalOpen(false);
    }

    const handleBorrowCurrencySelect = (event: React.ChangeEvent<{
        name?: string | undefined;
        value: string;
    }>, child: React.ReactNode) => {
        setBorrowAmountCurrency(event.target.value);
    }

    const handleProvideClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setProvideModalOpen(false);
    }

    const handleRepayClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setRepayModalOpen(false);
    }

    const handleWithdrawClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setWithdrawModalOpen(false);
    }

    const isBorrowError = (value: number, token: Token) => {
        if (value <= 0 ||
            value > data.borrowLimit - data.borrowLimitUsed) {
            return true;
        }
        return false;
    }

    const isProvideError = (value: number, token: Token) => {
        const index = lpTokens.findIndex((elem: any) => elem === token);
        if (index < 0) return true;
        if (value <= 0 ||
            value > walletAmount) {//collateralData[index].available) {
            return true;
        }
        return false;
    }

    const isRepayError = (value: number, token: Token) => {
        const index = stableCoins.findIndex((elem: any) => elem === token);
        if (index < 0) return true;
        if (value <= 0 ||
            value > walletAmount) { // borrowData[index].amount) {
            return true;
        }
        return false;
    }

    const isWithdrawError = (value: number, token: Token) => {
        const index = lpTokens.findIndex((elem: any) => elem === token);
        if (index < 0) return true;
        if (value <= 0 ||
            value > vaultAmount) { //collateralData[index].provided) {
            return true;
        }
        return false;
    }

    const getLPToUSDCRatio = async (token: Token) => {
        const value = await control.getLPPrice(token.address);
        const ratio = parseBigNumber(value, usdcToken?.decimals);
        setTokenToUSDCRate(ratio);
    }

    const onBorrowAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setBorrowAmountValue(Number(event.target.value));
    };

    const onProvideAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const usdAmount = Number(event.target.value);
        const lpAmount = usdAmount / tokenToUSDCRate;

        setProvideLpValue(lpAmount);
        setProvideAmountValue(usdAmount);
    };

    const onRepayAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        setRepayAmountValue(Number(event.target.value));
    };

    const onWithdrawAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const usdAmount = Number(event.target.value);
        const lpAmount = usdAmount / tokenToUSDCRate;

        setWithdrawLpValue(lpAmount);
        setWithdrawAmountValue(usdAmount);
    };

    const onBorrowClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, token: Token) => {
        setBorrowAmountCurrency(token.symbol);
        setBorrowModalOpen(true);
        setCurrentToken(token);
    }

    const onProvideClick = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, token: Token, walletAmount: BigNumber, vaultAmount: BigNumber) => {
        setCurrentToken(token);
        setProvideModalOpen(true);
        setWalletAmount(parseBigNumber(walletAmount, token.decimals));
        setVaultAmount(parseBigNumber(vaultAmount, token.decimals));

        await getLPToUSDCRatio(token);
    }

    const onRepayClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, token: Token, walletAmount: BigNumber) => {
        setRepayModalOpen(true);
        setCurrentToken(token);
        setWalletAmount(parseBigNumber(walletAmount, token.decimals));
    }

    const onWithdrawClick = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, token: Token, walletAmount: BigNumber, vaultAmount: BigNumber) => {
        setCurrentToken(token);
        setWithdrawModalOpen(true);
        setWalletAmount(parseBigNumber(walletAmount, token.decimals));
        setVaultAmount(parseBigNumber(vaultAmount, token.decimals));

        await getLPToUSDCRatio(token);
    }

    const onAuth = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const erc20 = new ERC20Service(context.library, context.account, currentToken.address);
        const targetVault = await control.getLPVault(currentToken.address);
        await erc20.approveUnlimited(targetVault);

        setAuthorizationModalOpen(false);
    }

    const onBorrow = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const coinPrice = await control.getStableCoinPrice(currentToken.address);
        const priceMultiplier = parseBigNumber(coinPrice, usdcToken?.decimals);
        const numCoins = borrowAmountValue * priceMultiplier;

        const amount = utils.parseUnits(numCoins.toString(), currentToken.decimals);
        await control.borrowStableCoin(currentToken.address, amount);

        setBorrowModalOpen(false);
    }

    const onProvide = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!context.account) {
            return;
        }

        const erc20 = new ERC20Service(context.library, context.account, currentToken.address);
        const targetVault = await control.getLPVault(currentToken.address);
        const enabledAmount = parseBigNumber(await erc20.allowance(context.account, targetVault), currentToken.decimals);
        const needsAuth = provideLpValue > enabledAmount;

        if (needsAuth) {
            setAuthorizationModalOpen(true);
            setAuthAction("provide");
            return;
        }

        const lpVault = new WarpLPVaultService(context.library, context.account, targetVault);
        const amount = utils.parseUnits(provideLpValue.toString(), currentToken.decimals);

        await lpVault.provideCollateral(amount);

        setProvideModalOpen(false);
    }

    const onRepay = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!context.account) {
            return;
        }

        const erc20 = new ERC20Service(context.library, context.account, currentToken.address);
        const targetVault = await control.getStableCoinVault(currentToken.address);
        const enabledAmount = parseBigNumber(await erc20.allowance(context.account, targetVault), currentToken.decimals);
        const needsAuth = repayAmountValue > enabledAmount;

        if (needsAuth) {
            setAuthorizationModalOpen(true);
            setAuthAction("repay");
            return;
        }

        const scVault = new StableCoinWarpVaultService(context.library, context.account, targetVault);
        const amount = utils.parseUnits(repayAmountValue.toString(), currentToken.decimals);

        await scVault.repay(amount);

        setRepayModalOpen(false);
    }

    const onWithdraw = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const targetVault = await control.getLPVault(currentToken.address);
        const lpVault = new WarpLPVaultService(context.library, context.account, targetVault);
        const amount = utils.parseUnits(withdrawLpValue.toString(), currentToken.decimals);

        await lpVault.withdrawCollateral(amount);

        setWithdrawModalOpen(false);
    }

    return (
        <React.Fragment>
            <Grid
                container
                direction="column"
                alignItems="center"
                spacing={5}
            >
                <Header />
                <Grid
                    item
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="stretch"
                >
                    <Grid item>
                        <InformationCard header="Borrow Limit" text={`$${data.collateral.toFixed(2)}`} />
                    </Grid>
                    <Grid item>
                        <InformationCard header="Limit Used %" text={`${data.borrowPercentage.toFixed(0)}%`} />
                    </Grid>
                    <Grid item>
                        <InformationCard header="Interest rate" text={`${data.interestRate.toFixed(2)}%`} />
                    </Grid>
                </Grid>
                <Grid
                    item
                    container
                    direction="row"
                    justify="space-evenly"
                    alignItems="stretch"
                    spacing={3}
                >
                    <Grid item sm>
                        <BorrowerTable
                            tokens={lpTokens}
                            usdc={usdcToken}
                            onLeftButtonClick={onProvideClick}
                            onRightButtonClick={onWithdrawClick}
                            type="collateral" />
                    </Grid>
                    <Grid item sm>
                        <BorrowerTable
                            usdc={usdcToken}
                            tokens={stableCoins}
                            onLeftButtonClick={onRepayClick}
                            onRightButtonClick={onBorrowClick}
                            type="borrow" />
                    </Grid>
                </Grid>
            </Grid >
            <RowModal
                action={"Withdraw Collateral"}
                error={withdrawError}
                handleClose={handleWithdrawClose}
                lp={withdrawLpValue}
                onButtonClick={onWithdraw}
                onChange={onWithdrawAmountChange}
                open={withdrawModalOpen}
                poolIconSrcPrimary={currentToken.image || ""}
                poolIconSrcSecondary={currentToken.image2 || ""}
                token={currentToken}
            />
            <RowModal
                action={"Provide Collateral"}
                error={provideError}
                handleClose={handleProvideClose}
                lp={provideLpValue}
                onButtonClick={onProvide}
                onChange={onProvideAmountChange}
                open={provideModalOpen}
                poolIconSrcPrimary={currentToken.image || ""}
                poolIconSrcSecondary={currentToken.image2 || ""}
                token={currentToken}
            />
            <BigModal
                action="Borrow"
                amount={borrowAmountValue}
                currency={borrowAmountCurrency}
                data={data}
                error={borrowError || borrowAmountValue === 0}
                handleClose={handleBorrowClose}
                handleSelect={handleBorrowCurrencySelect}
                onButtonClick={onBorrow}
                onChange={onBorrowAmountChange}
                open={borrowModalOpen} />
            <AmountModal
                action={"Repay " + currentToken.symbol}
                amount={repayAmountValue}
                currency={currentToken.symbol}
                error={repayError}
                iconSrc={currentToken.symbol || ""}
                handleClose={handleRepayClose}
                onButtonClick={onRepay}
                onChange={onRepayAmountChange}
                open={repayModalOpen}
            />
            <AuthorizationModal
                action={authAction}
                handleClose={handleAuthClose}
                onButtonClick={onAuth}
                open={authorizationModalOpen}
            />
        </React.Fragment>
    );
}