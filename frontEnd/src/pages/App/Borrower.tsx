import * as React from "react";

import { AmountModal, AuthorizationModal, BigModal, BorrowerTable, Header, InformationCard, RowModal, TransactionModal } from "../../components";
import { convertNumberToBigNumber, countDecimals, formatBigNumber, isAddress, parseBigNumber } from "../../util/tools";

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
    const [ authType, setAuthType ] = React.useState<"sc" | "lp">("sc");

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

    const [provideAmountValue, setProvideAmountValue] = useState("");
    const [provideMax, setProvideMax] = useState(false);
    const [provideError, setProvideError] = useState(false);
    const [provideLpValue, setProvideLpValue] = useState(BigNumber.from(0));
    const [provideModalOpen, setProvideModalOpen] = useState(false);

    const [repayAmountValue, setRepayAmountValue] = useState(BigNumber.from(0));
    const [repayMax, setRepayMax] = useState(false);
    const [repayError, setRepayError] = useState(false);
    const [repayModalOpen, setRepayModalOpen] = useState(false);
    const [borrowedAmount, setBorrowedAmount] = useState(BigNumber.from(0));

    const [withdrawAmountValue, setWithdrawAmountValue] = useState("");
    const [withdrawMax, setWithdrawMax] = useState(false);
    const [withdrawError, setWithdrawError] = useState(false);
    const [withdrawLpValue, setWithdrawLpValue] = useState(BigNumber.from(0));
    const [withdrawModalOpen, setWithdrawModalOpen] = useState(false);
    const [maxWithdrawAmount, setMaxWithdrawAmount] = useState(BigNumber.from(0));

    const [currentToken, setCurrentToken] = useState<Token>({} as Token);
    const [tokenToUSDCRate, setTokenToUSDCRate] = useState(0);
    const [walletAmount, setWalletAmount] = useState(BigNumber.from(0));
    const [vaultAmount, setVaultAmount] = useState(BigNumber.from(0));
    

    // TO-DO: Web3 integration
    const [transactionHash, setTransactionHash] = useState("0x716af84c2de1026e87ec2d32df563a6e7e43b261227eb10358ba3d8dd372eceb");
    const [transactionConfirmed, setTransactionConfirmed] = useState(false);
    const [transactionModalOpen, setTransactionModalOpen] = useState(false);

    React.useEffect(() => {
        if (borrowTokenAmount !== 0) {
            setBorrowError(isBorrowError(borrowTokenAmount, currentToken));
        }

        if (!provideLpValue.eq(BigNumber.from(0))) {
            setProvideError(isProvideError(provideLpValue, currentToken));
        }

        setRepayError(!repayMax && isRepayError(repayAmountValue, currentToken));
    
        if (!withdrawLpValue.eq(BigNumber.from(0))) {
            setWithdrawError(!withdrawMax && isWithdrawError(withdrawLpValue, currentToken));
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

    const isProvideError = (value: BigNumber, token: Token) => {
        const index = lpTokens.findIndex((elem: any) => elem === token);
        if (index < 0) return true;
        if (value.lte(BigNumber.from(0)) ||
            value.gt(walletAmount)) {
            return true;
        }
        return false;
    }

    const isRepayError = (value: BigNumber, token: Token) => {
        const index = stableCoins.findIndex((elem: any) => elem === token);
        if (index < 0) return true;
        if (value.lte(BigNumber.from(0)) ||
            value.gt(walletAmount) || value.gt(borrowedAmount)) {
            return true;
        }
        return false;
    }

    const isWithdrawError = (value: BigNumber, token: Token) => {
        const index = lpTokens.findIndex((elem: any) => elem === token);
        if (index < 0) return true;
        if (value.lte(BigNumber.from(0)) ||
            value.gt(vaultAmount) || value.gt(maxWithdrawAmount)) { 
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

        setProvideLpValue(convertNumberToBigNumber(lpAmount, currentToken.decimals));
        setProvideAmountValue(event.target.value);
    };

    const onRepayAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        logger.log(`Repay amount changed to ${event.target.value}`)
        setRepayAmountValue(convertNumberToBigNumber(Number(event.target.value), currentToken.decimals));
        setRepayMax(false);
    };

    const onWithdrawAmountChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        const usdAmount = Number(event.target.value);
        const lpAmount = usdAmount / tokenToUSDCRate;
        const lpValue = convertNumberToBigNumber(lpAmount, currentToken.decimals);

        logger.log(`Withdraw amount changed to ${usdAmount} USD or ${lpAmount} LP`);
        setWithdrawLpValue(lpValue);
        setWithdrawAmountValue(event.target.value);
        setWithdrawMax(false);
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
        setWalletAmount(walletAmount);
        setVaultAmount(vaultAmount);
        setProvideAmountValue("");
        setProvideLpValue(BigNumber.from(0));
        setProvideMax(false);

        await getLPToUSDCRatio(token);
    }

    const onRepayClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, token: Token, walletAmount: BigNumber, amountDue: BigNumber) => {
        setRepayModalOpen(true);
        setCurrentToken(token);
        setRepayAmountValue(BigNumber.from(0));
        setRepayMax(false);
        setWalletAmount(walletAmount);
        setBorrowedAmount(amountDue);
    }

    const onWithdrawClick = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, token: Token, walletAmount: BigNumber, vaultAmount: BigNumber) => {
        setCurrentToken(token);
        setWithdrawModalOpen(true);
        setWalletAmount(walletAmount);
        setVaultAmount(vaultAmount);
        setWithdrawAmountValue("");
        setWithdrawLpValue(BigNumber.from(0));
        setWithdrawMax(false);

        const lpToUSDC = await getLPToUSDCRatio(token);

        if (!context.account) {
            logger.error("onWithdrawClick: No account when there should be.");
            return;
        }

        const maxAmount = await control.getMaxCollateralWithdrawAmount(context.account, token.address);
        const maxAmountParsed = parseBigNumber(maxAmount, token.decimals);
        const maxAmountInUSDC = maxAmountParsed * lpToUSDC;
        logger.log(`Max amount of ${token.symbol} that can be withdrawn is ${maxAmountParsed} LP or ${maxAmountInUSDC.toFixed(4)} USDC (converstion rate of ${lpToUSDC})`);
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
        let targetVault;
        if (authType == "lp") {
            targetVault = await control.getLPVault(currentToken.address);
        } else {
            targetVault = await control.getStableCoinVault(currentToken.address);
        }

        const tx = erc20.approveUnlimited(targetVault);

        setAuthorizationModalOpen(false);
        setAction("Authorizing");

        await handleTransaction(tx);
        refresh();
    }

    const onBorrow = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const amount = convertNumberToBigNumber(borrowTokenAmount, currentToken.decimals);
        logger.log(`Borrowing ${borrowTokenAmount} ${currentToken.symbol} (${amount} in weth)`)
        const tx = control.borrowStableCoin(currentToken.address, amount);

        setAction("Borrowing");

        setBorrowModalOpen(false);

        await handleTransaction(tx);
        refresh();
    }

    const onProvide = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!context.account) {
            return;
        }
        setAction("Provide Collateral");

        const erc20 = new ERC20Service(context.library, context.account, currentToken.address);
        const targetVault = await control.getLPVault(currentToken.address);
        const enabledAmount = await erc20.allowance(context.account, targetVault);
        const needsAuth = provideLpValue.gt(enabledAmount);

        if (needsAuth) {
            setAuthType("lp");
            setAuthorizationModalOpen(true);
            return;
        }

        const lpVault = new WarpLPVaultService(context.library, context.account, targetVault);

        const parsedProvideLpValue = parseBigNumber(provideLpValue, currentToken.decimals);
        logger.log(`Providing ${parsedProvideLpValue.toString()} (${provideLpValue}) ${currentToken.symbol}`);

        const tx = lpVault.provideCollateral(provideLpValue);

        setProvideModalOpen(false);

        await handleTransaction(tx);
        refresh();
    }

    const onProvideMax = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setProvideMax(true);
        setProvideLpValue(walletAmount);

        const maxAmountParsed = parseBigNumber(walletAmount, currentToken.decimals);
        const maxAmountInUSDC = maxAmountParsed * tokenToUSDCRate;
        setProvideAmountValue(maxAmountInUSDC.toFixed(4));
    }

    const onRepay = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        if (!context.account) {
            return;
        }

        const erc20 = new ERC20Service(context.library, context.account, currentToken.address);
        const targetVault = await control.getStableCoinVault(currentToken.address);
        const enabledAmount = await erc20.allowance(context.account, targetVault);
        const needsAuth = repayAmountValue.gt(enabledAmount);

        setAction("Repay Loan");
        if (needsAuth) {
            setAuthType("sc");
            setAuthorizationModalOpen(true);
            return;
        }

        const scVault = new StableCoinWarpVaultService(context.library, context.account, targetVault);

        const tx = scVault.repay(repayAmountValue);

        setRepayModalOpen(false);

        await handleTransaction(tx);
        refresh();
    }
    
    const onRepayMax = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        setRepayMax(true);
        logger.log(`Set repay to max of ${parseBigNumber(borrowedAmount, currentToken.decimals).toFixed(currentToken.decimals)} (${borrowedAmount.toString()})`);
        setRepayAmountValue(borrowedAmount);
    }

    const onWithdraw = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        const targetVault = await control.getLPVault(currentToken.address);
        const lpVault = new WarpLPVaultService(context.library, context.account, targetVault);

       
        let tx: Maybe<Promise<TransactionInfo>> = null;

        if (withdrawMax) {
            logger.log(`Withdrawing max.`);
            tx = lpVault.withdrawCollateral(BigNumber.from(0));
        } else {
            const withdrawAmountParsed = parseBigNumber(withdrawLpValue, currentToken.decimals);
            const maxWithdrawAmountParsed = parseBigNumber(maxWithdrawAmount, currentToken.decimals);
            logger.log(`Withdrawing ${withdrawAmountParsed} LP (${withdrawLpValue.toString()}) current max is ${maxWithdrawAmountParsed} LP (${maxWithdrawAmount.toString()})`);

            tx = lpVault.withdrawCollateral(withdrawLpValue);
        }

        setWithdrawModalOpen(false);
        setWithdrawMax(false);
        setAction("Withdraw Collateral");
        await handleTransaction(tx);
        refresh();
    }

    const onWithdrawMax = async (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        logger.log(`User indicated to withdrawing max`);
        setWithdrawMax(true);
        setWithdrawLpValue(maxWithdrawAmount);

        const maxAmountParsed = parseBigNumber(maxWithdrawAmount, currentToken.decimals);

        const maxAmountInUSDC = maxAmountParsed * tokenToUSDCRate;
        setWithdrawAmountValue(maxAmountInUSDC.toFixed(4));
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
                lp={parseBigNumber(withdrawLpValue, currentToken.decimals)}
                onButtonClick={onWithdraw}
                onChange={onWithdrawAmountChange}
                onMaxButtonClick={onWithdrawMax}
                open={withdrawModalOpen}
                poolIconSrcPrimary={currentToken.image || ""}
                poolIconSrcSecondary={currentToken.image2 || ""}
                token={currentToken}
                value={withdrawAmountValue}
            />
            <RowModal
                action={"Provide Collateral"}
                error={provideError}
                handleClose={handleProvideClose}
                lp={parseBigNumber(provideLpValue, currentToken.decimals)}
                onButtonClick={onProvide}
                onChange={onProvideAmountChange}
                onMaxButtonClick={onProvideMax}
                open={provideModalOpen}
                poolIconSrcPrimary={currentToken.image || ""}
                poolIconSrcSecondary={currentToken.image2 || ""}
                token={currentToken}
                value={provideAmountValue}
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
                amount={
                    repayMax ? 
                    formatBigNumber(repayAmountValue, currentToken.decimals, currentToken.decimals) :
                    formatBigNumber(repayAmountValue, currentToken.decimals)
                }
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