

import React from 'react';
import { TeamMetrics } from '../util/calculateTeamMetrics';
import { getLogger } from '../util/logger';
import { dateReviver } from '../util/tools';


const logger = getLogger('Hooks::useTeamMetricsCache');
const cacheURL = "https://warpfinancelaunch.s3-us-west-2.amazonaws.com/team_cache.json";

export const useTeamMetricsCache = () => {
  const [cache, setCache] = React.useState<Maybe<TeamMetrics>>(null);
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
        const responseText = await res.text();
  
        const jsonResponse = JSON.parse(responseText, dateReviver);
        logger.log(`Parsed JSON response: ${responseText}`);
        if (isSubscribed) {
          setCache(jsonResponse);
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
    cache,
    attemptedToLoad
  }
}