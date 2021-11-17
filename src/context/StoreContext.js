import { useState, useEffect, useContext, createContext } from "react";
import axios from "axios";

const StoreContext = createContext();

export const useStore = () => useContext(StoreContext);

const StoreProvider = ({ children }) => {
  const [currentUserID, setCurrentUserID] = useState(null);
  const [reRender, setReRender] = useState(0);

  const [emojis, setEmojis] = useState([]);
  const [userContentReactions, setUserContentReaction] = useState([]);
  const [users, setUsers] = useState([]);

  // fetch emoji, users and user content reaction data from API
  useEffect(() => {
    const fetchData = async () => {
      // fetch emojis only one time
      if (reRender === 0) {
        const emojiData = await axios.get(
          "https://artful-iudex.herokuapp.com/reactions"
        );
        setEmojis(emojiData.data);
      }

      const userReactionData = await axios.get(
        "https://artful-iudex.herokuapp.com/user_content_reactions"
      );
      const userData = await axios.get(
        "https://artful-iudex.herokuapp.com/users"
      );

      setUserContentReaction(userReactionData.data);
      setUsers(userData.data);
    };
    fetchData();
  }, [reRender]);

  // check whether userId is present in localstorage
  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (userId) {
      setCurrentUserID(Number(userId));
    }
  }, []);

  // function to refetch the data
  const updateData = () => {
    setReRender((prev) => prev + 1);
  };

  const values = {
    currentUserID,
    setCurrentUserID,
    updateData,
    emojis,
    userContentReactions,
    users,
  };

  return (
    <StoreContext.Provider value={values}>{children}</StoreContext.Provider>
  );
};

export default StoreProvider;
