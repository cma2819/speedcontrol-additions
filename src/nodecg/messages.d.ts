import { SpeedcontrolUserAddition } from "./generated/speedcontrolUserAddition";
import { SheetData } from '../types/SheetData';
import { AdditionSocial } from './generated/additionSocial';
import { Commentator } from './generated/commentator';

export type MessageMap = {
  'updateUserAddition': {
    data: SpeedcontrolUserAddition;
  };

  'createCommentator': {
    data: {
      name: string;
      social: {
        twitch?: string;
        nico?: string;
        youtube?: string;
        twitter?: string;
      };
      assignedRunIdArray: string[];
    }
  }
  'updateCommentator': {
    data: Commentator
  };
  'removeCommentator': {
    data: string
  };

  'loadSheetsFromSpreadsheet': {
    data: string;
    result: SheetData[];
  };

  'importAdditionFromSpreadsheet': {
    data: {
      url: string;
      sheetName: string;
      indexes: {
        name: number;
        nico: number;
        youtube: number;
        twitter: number;
      }
    },
    result: boolean;
  }

  'importCommentatorFromSpreadsheet': {
    data: {
      url: string;
      sheetName: string;
      indexes: {
        runId: number;
        name: number;
        twitch: number;
        nico: number;
        youtube: number;
        twitter: number;
      }
    },
    result: boolean;
  }

  'importTwitchGamesFromSpreadsheet': {
    data: {
      url: string;
      sheetName: string;
      lineIdIndex: number;
      gameNameIndex: number;
    },
    result: boolean;
  }
};
