import { useSelector } from "react-redux";

export function getErrorString(err) {
  if (!err.message) return 'Unknown error has occurred';

  return err.message.replace('GraphQL error: ', '').replace(/;/g, '\n');
}



export const CheckTheme = () => {
  const isDarkTheme = useSelector(state => state.userdataReducer.darktheme);

  return isDarkTheme
}