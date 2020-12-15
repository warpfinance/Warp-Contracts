import { getDateString, getLogger } from "../lib/util";
import * as fs from 'fs';

export type FileType = "data" | "accountScores" | "teamScores";

let fromMain = false;
let mainId = ``;

export const setMainOutputId = (id: string) => {
  fromMain = true;
  mainId = id;
}

const logger = getLogger('scripts::output');

export const outputFile = (type: FileType, data: string): string => {
  let filepath = "";
  
  if (fromMain) {
    let filename = `${type}_${mainId}`;
    filepath = `${filename}.json`;
    if (fs.existsSync(filepath)) {
      const timestamp = getDateString();
      const backupFilepath = `${filename}_backup_${timestamp}.json`;

      logger.info(`Copying existing ${filepath} on ${backupFilepath} on disk`);
      fs.copyFileSync(filepath, backupFilepath);
    }
  } else {
    const timestamp = getDateString();
    filepath = `${type}_${timestamp}.json`;
  }
  
  logger.log(`Saving data as ${filepath} on disk`);
  fs.writeFileSync(filepath, data);

  return filepath;
}

export const getExpectedFilepath = (type: FileType, id: string): string => {
  const filename = `${type}_${id}`;
  const filepath = `${filename}.json`;
  return filepath;
}