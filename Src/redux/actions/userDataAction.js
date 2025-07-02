import {
  TOTALSCORE,
  MATCHINGITEM,
  ISFIRSTINSTALL,
  NOTIFICATIONCOUNT,
  MESSAGECOUNT,
  REMEMBERME,
  ITEMUPLODED,
  ISDARKTHEME,
  FAVIROTCATEGORY,
  ALLOWSWIPERIGHT,
  ISSHOWPOPUPAGAIN,
  ISSHOWFIRSTPOPUPAGAIN
} from '../types';

export const SaveUserId = data => {
  return {
    type: TOTALSCORE,
    payload: data,
  };
};

export const Savematchingitem = data => {

  return {
    type: MATCHINGITEM,
    payload: data,
  };
};
export const SaveAllowSwipe = data => {

  return {
    type: ALLOWSWIPERIGHT,
    payload: data,
  };
};
export const SaveItemuploded = data => {

  return {
    type: ITEMUPLODED,
    payload: data,
  };
};

export const saveUserCradential = data => {

  return {
    type: REMEMBERME,
    payload: data,
  };
};
export const saveisFirstinstall = data => {
  return {
    type: ISFIRSTINSTALL,
    payload: data,
  };
};

export const saveShowAgainPopup = data => {
  return {
    type: ISSHOWPOPUPAGAIN,
    payload: data,
  };
};

export const saveShowFirstPopupAgain = data => {
  return {
    type: ISSHOWFIRSTPOPUPAGAIN,
    payload: data,
  };
};


export const addNotificationcount = data => {
  return {
    type: NOTIFICATIONCOUNT,
    payload: data,
  };
};


export const addmessageCount = data => {
  return {
    type: MESSAGECOUNT,
    payload: data,
  };
};
export const ChangeTheme = data => {
  return {
    type: ISDARKTHEME,
    payload: data,
  };
};
export const SaveFavCategory = data => {
  return {
    type: FAVIROTCATEGORY,
    payload: data,
  };
};
