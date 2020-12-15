import React from "react"
import { BorrowerCountdownContext } from "../hooks/borrowerCountdown"
import { NftTimeContext } from "../hooks/nftTime"
import { MigrationStatusProvider } from "../hooks/useMigrations"
import { TeamMetricsProvider } from "../hooks/useTeamMetrics"
import { TeamContextProvider } from "../hooks/useTeams"

export const GlobalContextProviders: React.FC = props=> {

  var maxDate = 8640000000000000;
	var countDownDate = new Date(process.env.REACT_APP_BORROWING_ENABLED_DATETIME || maxDate).getTime();

	const [countdown, setCountdown] = React.useState(true);
	const [countdownText, setCountdownText] = React.useState("");
	setInterval(function () {
		var now = new Date().getTime();
		var distance = countDownDate - now;
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
		setCountdownText(days + "d " + hours + "h "
			+ minutes + "m " + seconds + "s ");
		if (distance < 0) {
			setCountdown(false);
		}
	}, 1000);

  return (
    <React.Fragment>
      <BorrowerCountdownContext.Provider value={{ countdown: countdown, countdownText: countdownText }} >
        <NftTimeContext.Provider value={{nftTime: true}}>
          <TeamContextProvider>
            <TeamMetricsProvider>
              <MigrationStatusProvider>
                {props.children}
              </MigrationStatusProvider>
            </TeamMetricsProvider>
          </TeamContextProvider>
        </NftTimeContext.Provider>
      </BorrowerCountdownContext.Provider>
    </React.Fragment>
  )
}