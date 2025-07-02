import {
  TOTALSCORE,
  MATCHINGITEM,
  ISFIRSTINSTALL,
  MESSAGECOUNT,
  NOTIFICATIONCOUNT,
  REMEMBERME,
  ITEMUPLODED,
  ISDARKTHEME,
  FAVIROTCATEGORY,
  ALLOWSWIPERIGHT,
  ISSHOWPOPUPAGAIN,
  ISSHOWFIRSTPOPUPAGAIN
} from '../types';
const initState = {
  totalScore: 0,
  matchingItems: { id: '$', title: 'Cash' },
  firstinstall: true,
  dontShowAgain: false,
  dontShowFirstAgain: false,
  notificationCount: 0,
  messageCount: 0,
  remember: {
    email: '',
    password: ''
  },
  itemuploded: true,
  darktheme: false,
  favCategory: '',
  allowSwiprRight: true

};
const userdataReducer = (state = initState, action) => {
  switch (action.type) {
    case TOTALSCORE:
      return {
        ...state,
        totalScore: action.payload,
      };
    case MATCHINGITEM:
      return {
        ...state,
        matchingItems: action.payload,
      };
    case ALLOWSWIPERIGHT:
      return {
        ...state,
        allowSwiprRight: action.payload,
      };
    case FAVIROTCATEGORY:
      return {
        ...state,
        favCategory: action.payload,
      };
    case ISFIRSTINSTALL:
      return {
        ...state,
        firstinstall: action.payload,
      };
    case ISSHOWPOPUPAGAIN:
      return {
        ...state,
        dontShowAgain: action.payload,
      };
    case ISSHOWFIRSTPOPUPAGAIN:
      return {
        ...state,
        dontShowFirstAgain: action.payload,
      };
    case MESSAGECOUNT:
      return {
        ...state,
        messageCount: action.payload,
      };
    case REMEMBERME:
      return {
        ...state,
        remember: action.payload,
      };
    case NOTIFICATIONCOUNT:
      return {
        ...state,
        notificationCount: action.payload,
      };
    case ITEMUPLODED:
      return {
        ...state,
        itemuploded: action.payload,
      };
    case ISDARKTHEME:
      return {
        ...state,
        darktheme: action.payload,
      };
    default:
      return state;
  }
};

export default userdataReducer;
