import * as React from "react";

import { Grid, Typography } from "@material-ui/core";

import { NftTimeContext } from "../../hooks/nftTime";

interface Props { }

export const LeaderboardSubheader: React.FC<Props> = (props: Props) => {
    return (
        <NftTimeContext.Consumer>
            {({ nftTime }) => (
                <React.Fragment>
                    { nftTime === true ?
                        null
                        :
                        <React.Fragment>
                            <Grid item>
                                <Typography variant="subtitle1" color="textSecondary">
                                    Users are competing for Warp NFTs for 1 week that
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="subtitle1" color="textSecondary">
                                    give them access to additional Warp Rewards!
                                </Typography>
                            </Grid>
                        </React.Fragment>
                    }
                </React.Fragment>
            )}
        </NftTimeContext.Consumer>
    )
}