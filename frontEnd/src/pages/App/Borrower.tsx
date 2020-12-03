import * as React from "react";

import { AmountModal, AuthorizationModal, BigModal, BorrowerTable, Header, InformationCard, RowModal, TransactionModal } from "../../components";
import { convertNumberToBigNumber, isAddress, parseBigNumber } from "../../util/tools";

import { BigNumber } from "ethers";
import { ERC20Service } from "../../services/erc20";
import { Grid } from "@material-ui/core";
import { StableCoinWarpVaultService } from "../../services/stableCoinWarpVault";
import { Token } from "../../util/token";
import { TransactionInfo } from "../../util/types";
import { WarpLPVaultService } from "../../services/warpLPVault";
import { getLogger } from "../../util/logger";
import { useBorrowLimit } from "../../hooks/useBorrowLimit";
import { useCombinedBorrowRate } from "../../hooks/useCombinedBorrowRate";
import { useConnectedWeb3Context } from "../../hooks/connectedWeb3";
import { useLPTokens } from "../../hooks/useLPTokens";
import { useRefreshToken } from "../../hooks/useRefreshToken";
import { useStableCoinTokens } from "../../hooks/useStableCoins";
import { useState } from "react";
import { useUSDCToken } from "../../hooks/useUSDC";
import { useWarpControl } from "../../hooks/useWarpControl";

interface Props {
}

const logger = getLogger("Page::Borrower");

export const Borrower: React.FC<Props> = (props: Props) => {
    const context = useConnectedWeb3Context();
    const { refreshToken, refresh } = useRefreshToken();
    const stableCoins = useStableCoinTokens(context);
    const lpTokens = useLPTokens(context);
    const usdcToken = useUSDCToken(context);
    const { control } = useWarpControl(context);
    const { totalBorrowedAmount, borrowLimit } = useBorrowLimit(context, control, refreshToken);
    const combinedBorrowRate = useCombinedBorrowRate(context, control, stableCoins, usdcToken, refreshToken);
    const [newBorrowLimitUsed, setNewBorrowLimitUsed] = useState(0);

    const data = {
        collateral: parseBigNumber(borrowLimit, usdcToken?.decimals),
        borrowPercentage: 0,
        interestRate: combinedBorrowRate ? combinedBorrowRate : 0,
        borrowLimit: parseBigNumber(borrowLimit, usdcToken?.decimals),
        borrowLimitUsed: parseBigNumber(totalBorrowedAmount, usdcToken?.decimals),
        newBorrowLimitUsed: newBorrowLimitUsed
    }

    if (data.borrowLimit > 0) {
        data.borrowPercentage = (data.borrowLimitUsed / data.borrowLimit) * 100;
    }

    const [action, setAction] = useState("borrow");
    const [authorizationModalOpen, setAuthorizationModalOpen] = useState(false);

    const [borrowAmountCurrency, setBorrowAmountCurrency] = useState("DAI");
    const [borrowTokenAmount, setBorrowTokenAmount] = useState(0);
    const [borrowError, setBorrowError] = useState(false);
    const [borrowModalOpen, setBorrowModalOpen] = useState(false);

    const [provideAmountValue, setProvideAmountValue] = useState(0);
    const [provideError, setProvideError] = useState(false);
    const [provideLpValue, setProvideLpValue] = useState(0);
    const [provideModalOpen, setProvideModalOpen] = useState(false);

    const [referralCode, setReferralCode] = useState("");

    const [repayAmountValue, setRepayAmountValue] = useState(0);
    const [repayError, setRepayError] = useState(false);
    const [repayModalOpen, setRepayModalOpen] = useState(false);
    const [borrowedAmount, setBorrowedAmount] = useState(0);

    const [withdrawAmountValue, setWithdrawAmountValue] = useState(0);
    const [withdrawError, setWithdrawError] = useState(false);
    const [withdrawLpValue, setWithdrawLpValue] = useState(0);
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const [maxWithdrawAmount, setMaxWithdrawAmount] = useState(0);

    const [currentToken, setCurrentToken] = useState<Token>({} as Token);
    const [tokenToUSDCRate, setTokenToUSDCRate] = useState(0);
    const [walletAmount, setWalletAmount] = useState(0);
    const [vaultAmount, setVaultAmount] = useState(0);

    // TO-DO: Web3 integration
    const [transactionHash, setTransactionHash] = useState("0x716af84c2de1026e87ec2d32df563a6e7e43b261227eb10358ba3d8dd372eceb");
    const [transactionConfirmed, setTransactionConfirmed] = useState(false);
    const [transactionModalOpen, setTransactionModalOpen] = useState(false);

    React.useEffect(() => {
        if (borrowTokenAmount !== 0) {
            setBorrowError(isBorrowError(borrowTokenAmount, currentToken));
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
    }, [borrowTokenAmount,
        borrowAmountCurrency,
        provideLpValue,
        currentToken,
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

    const handleTransactClose = (event: {}, reason: "backdropClick" | "escapeKeyDown") => {
        setTransactionModalOpen(false);
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
            value > walletAmount || value > borrowedAmount) { // borrowData[index].amount) {
            return true;
        }
        return false;
    }

    const isWithdrawError = (value: number, token: Token) => {
        const index = lpTokens.findIndex((elem: any) => elem === token);
        console.log(value);
        if (index < 0) return true;
        if (value <= 0 ||
            value > vaultAmount || value > maxWithdrawAmount) { 
            return true;
        }
        return false;
    }

    const getLPToUSDCRatio = async (token: Token): Promise<number> => {
        const value = await control.getLPPrice(token.address);
        const ratio = parseBigNumber(value, usdcToken?.decimals);
        setTokenToUSDCRate(ratio);

        return ratio;
    }

    const onBorrowAmountChange = async (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const numTokens = Number(event.target.value);
        setBorrowTokenAmount(numTokens);

        const coinPrice = await control.getStableCoinPrice(currentToken.address);
        const priceMultiplier = parseBigNumber(coinPrice, usdcToken?.decimals);
        const borrowedAmount = numTokens * priceMultiplier;

        const borrowLimitUsed = parseBigNumber(totalBorrowedAmount, usdcToken?.decimals);
        const newUsage = borrowedAmount + borrowLimitUsed;
        setNewBorrowLimitUsed(newUsage);
        logger.log(`borrow amount changed numtokens=${numTokens} price=${priceMultiplier} current=${borrowLimitUsed} toborrow=${borrowedAmount} newUsed=${newUsage}`);
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
        setBorrowTokenAmount(0);
        
    }

    const onProvideClick = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, token: Token, walletAmount: BigNumber, vaultAmount: BigNumber) => {
        setCurrentToken(token);
        setProvideModalOpen(true);
        setWalletAmount(parseBigNumber(walletAmount, token.decimals));
        setVaultAmount(parseBigNumber(vaultAmount, token.decimals));
        setProvideAmountValue(0);
        setProvideLpValue(0);

        await getLPToUSDCRatio(token);
    }

    const onRepayClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, token: Token, walletAmount: BigNumber, amountDue: BigNumber) => {
        setRepayModalOpen(true);
        setCurrentToken(token);
        setRepayAmountValue(0);
        setWalletAmount(parseBigNumber(walletAmount, token.decimals));
        setBorrowedAmount(parseBigNumber(amountDue, token.decimals));
    }

    const onWithdrawClick = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, token: Token, walletAmount: BigNumber, vaultAmount: BigNumber) => {
        setCurrentToken(token);
        setWithdrawModalOpen(true);
        setWalletAmount(parseBigNumber(walletAmount, token.decimals));
        setVaultAmount(parseBigNumber(vaultAmount, token.decimals));
        setWithdrawAmountValue(0);
        setWithdrawLpValue(0);

        const lpToUSDC = await getLPToUSDCRatio(token);

        if (!context.account) {
            logger.error("onWithdrawClick: No account when there should be.");
            return;
        }

        const maxAmount = parseBigNumber(await control.getMaxCollateralWithdrawAmount(context.account, token.address), token.decimals);
        const maxAmountInUSDC = maxAmount * lpToUSDC;
        logger.log(`Max amount of ${token.symbol} that can be withdrawn is ${maxAmount} LP or ${maxAmountInUSDC.toFixed(4)} USDC (converstion rate of ${lpToUSDC})`);
        setMaxWithdrawAmount(maxAmount);
    }

    const handleTransaction = async (tx: Promise<TransactionInfo>) => {
        try {
            setTransactionConfirmed(false);
            setTransactionModalOpen(true);
            const info = await tx;
            setTransactionConfirmed(true);
            setTransactionHash(info.hash);

            await info.finished;
            setTransactionModalOpen(false);
        } catch(e) {
            let reason = `${e.message}`;
            if (e.data) {
                reason += `\n${e.data.message}`;
            }
            logger.error(`\nTransaction Failed!  Reason:\n${reason}`);
            throw e;
        }
        
    }

    const onAuth = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const erc20 = new ERC20Service(context.library, context.account, currentToken.address);
        const targetVault = await control.getLPVault(currentToken.address);
        const tx = erc20.approveUnlimited(targetVault);
        setAuthorizationModalOpen(false);

        await handleTransaction(tx);
        refresh();
    }

    const onBorrow = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const amount = convertNumberToBigNumber(borrowTokenAmount, currentToken.decimals);
        logger.log(`Borrowing ${borrowTokenAmount} ${currentToken.symbol} (${amount} in weth)`)
        const tx = control.borrowStableCoin(currentToken.address, amount);

        setBorrowModalOpen(false);

        await handleTransaction(tx);
        refresh();
    }

    const onProvide = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!context.account) {
            return;
        }
        setAction("provide");

        const erc20 = new ERC20Service(context.library, context.account, currentToken.address);
        const targetVault = await control.getLPVault(currentToken.address);
        const enabledAmount = parseBigNumber(await erc20.allowance(context.account, targetVault), currentToken.decimals);
        const needsAuth = provideLpValue > enabledAmount;

        if (needsAuth) {
            setAuthorizationModalOpen(true);
            return;
        }

        const lpVault = new WarpLPVaultService(context.library, context.account, targetVault);
        const amount = convertNumberToBigNumber(provideLpValue, currentToken.decimals);
        logger.log(`Providing ${amount.toString()} ${currentToken.symbol}`);

        const tx = lpVault.provideCollateral(amount, referralCode);

        setProvideModalOpen(false);

        await handleTransaction(tx);
        refresh();
    }

    const onProvideMax = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        // TO-DO: Get max and set provide amount value to max provide from web3
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
            setAction("repay");
            return;
        }

        const scVault = new StableCoinWarpVaultService(context.library, context.account, targetVault);
        const amount = convertNumberToBigNumber(repayAmountValue, currentToken.decimals);

        const tx = scVault.repay(amount);

        setRepayModalOpen(false);

        await handleTransaction(tx);
        refresh();
    }
    
    const onRepayMax = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        // TO-DO: Get and set repay amount value to max repay value from web3
    }

    const onWithdraw = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const targetVault = await control.getLPVault(currentToken.address);
        const lpVault = new WarpLPVaultService(context.library, context.account, targetVault);
        const amount = convertNumberToBigNumber(withdrawLpValue, currentToken.decimals);

        const tx = lpVault.withdrawCollateral(amount);

        setWithdrawModalOpen(false);

        await handleTransaction(tx);
        refresh();
    }

    const onWithdrawMax = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        // TO-DO: Get max and set withdrawl amount value to max withdrawl from web3
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
                        <InformationCard header="Borrowed Amount (in USDC)" text={`$${data.borrowLimitUsed.toFixed(2)}`} />
                    </Grid>
                    <Grid item>
                        <InformationCard header="Borrow Limit (in USDC)" text={`$${data.collateral.toFixed(2)}`} />
                    </Grid>
                    <Grid item>
                        <InformationCard header="Limit Used %" text={`${data.borrowPercentage.toFixed(0)}%`} />
                    </Grid>
                    <Grid item>
                        <InformationCard header="Total APY" text={`${data.interestRate.toFixed(2)}%`} />
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
                            refreshToken={refreshToken}
                            type="collateral" />
                    </Grid>
                    <Grid item sm>
                        <BorrowerTable
                            usdc={usdcToken}
                            tokens={stableCoins}
                            onLeftButtonClick={onRepayClick}
                            onRightButtonClick={onBorrowClick}
                            refreshToken={refreshToken}
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
                onMaxButtonClick={onWithdrawMax}
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
                onMaxButtonClick={onProvideMax}
                open={provideModalOpen}
                poolIconSrcPrimary={currentToken.image || ""}
                poolIconSrcSecondary={currentToken.image2 || ""}
                token={currentToken}
            />
            <BigModal
                action="Borrow"
                amount={borrowTokenAmount}
                currency={borrowAmountCurrency}
                data={data}
                error={borrowError || borrowTokenAmount === 0}
                handleClose={handleBorrowClose}
                handleSelect={handleBorrowCurrencySelect}
                onButtonClick={onBorrow}
                onChange={onBorrowAmountChange}
                open={borrowModalOpen}
            />
            <AmountModal
                action={"Repay " + currentToken.symbol}
                amount={repayAmountValue}
                currency={currentToken.symbol}
                error={repayError}
                iconSrc={currentToken.symbol || ""}
                handleClose={handleRepayClose}
                onButtonClick={onRepay}
                onChange={onRepayAmountChange}
                onMaxButtonClick={onRepayMax}
                open={repayModalOpen}
            />
            <AuthorizationModal
                action={action}
                handleClose={handleAuthClose}
                onButtonClick={onAuth}
                open={authorizationModalOpen}
            />
            <TransactionModal
                action={action}
                confirmed={transactionConfirmed}
                handleClose={handleTransactClose}
                poolIconSrcPrimary={currentToken.image || ""}
                poolIconSrcSecondary={currentToken.image2 || ""}
                pool={currentToken.symbol}
                open={transactionModalOpen}
                txHash={transactionHash || ""}
            />
        </React.Fragment>
    );
}