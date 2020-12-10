

import React from 'react';
import { Team } from '../util/calculateTeamMetrics';
import { getLogger } from '../util/logger';


const logger = getLogger('Hooks::useTeamMetricsCache');
const cacheURL = "https://warpfinancelaunch.s3-us-west-2.amazonaws.com/team_cache.json";

export const useTeamMetricsCache = () => {
  const [cachedTeams, setCacheTeams] = React.useState<Team[]>([]);
  const [attemptedToLoad, setAttemptedToLoad] = React.useState(false);

  React.useEffect(() => {
    let isSubscribed = true;

    const getCache = async () => {
      let res: Maybe<Response> = null;

      try {
        try {
          res = await fetch(cacheURL);
        } catch (e) {
          logger.error(`failed to get cache`);
          console.log(e);
          throw e;
        }
      
        if (!res.ok) {
          logger.error(`Unable to get cache.`);
          console.log(res);
          setAttemptedToLoad(true);
          return;
        }
  
        const jsonResponse = await res.json();
        logger.log(`Parsed JSON response: ${JSON.stringify(jsonResponse)}`);
        if (isSubscribed) {
          setCacheTeams(jsonResponse);
          setAttemptedToLoad(true);
        }
      } catch (e) {
        console.error(`Error while getting cache: ${e}`);
        if (isSubscribed) {
          setAttemptedToLoad(true);
        }
        return;
      }
    }
    
    getCache();

    return () => {
      isSubscribed = false;
    }
  }, [])

  return {
    cachedTeams,
    attemptedToLoad
  }
}