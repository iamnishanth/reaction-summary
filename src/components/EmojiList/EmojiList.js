import axios from "axios";
import { useStore } from "../../context/StoreContext";

import "./EmojiList.css";

const EmojiList = ({ contentId, setIsLoading }) => {
  const { currentUserID, setCurrentUserID, updateData, emojis } = useStore();

  const onEmojiSelect = async (selectedEmoji) => {
    setIsLoading(true);
    if (currentUserID === null) {
      // create new user
      const randomId = Math.floor(Math.random() * 10000);
      const newUser = {
        first_name: `User`,
        last_name: `${randomId}`,
        email: `user${randomId}@gmail.com`,
        avatar: "https://dummyimage.com/200x200/e607e6/000000.jpg",
      };

      const { data } = await axios.post(
        "https://artful-iudex.herokuapp.com/users",
        newUser
      );

      const obtainedUserId = data.id;
      localStorage.setItem("userId", obtainedUserId);
      setCurrentUserID(obtainedUserId);
    }

    const userID = localStorage.getItem("userId");

    // check if user already reacted to that content
    const contents = await axios.get(
      `https://artful-iudex.herokuapp.com/user_content_reactions?user_id=${userID}`
    );

    const alreadyReactedData = contents.data.find(
      (item) => item.content_id === contentId
    );

    if (alreadyReactedData) {
      // if already reacted then delete that reaction from server
      await axios.delete(
        `https://artful-iudex.herokuapp.com/user_content_reactions/${alreadyReactedData.id}`
      );
    }

    // if already reacted emoji is same as currently selected emoji, then don't make a post request
    if (
      !(
        alreadyReactedData &&
        alreadyReactedData.reaction_id === selectedEmoji.id
      )
    ) {
      // create new user content reaction
      const newUCR = {
        user_id: Number(userID),
        reaction_id: selectedEmoji.id,
        content_id: contentId,
      };

      await axios.post(
        "https://artful-iudex.herokuapp.com/user_content_reactions",
        newUCR
      );
    }

    updateData();
    setIsLoading(false);
  };

  return (
    <div className="emoji-list-wrapper">
      {emojis &&
        emojis.map((emoji) => (
          <div className="emoji-list" key={emoji.id}>
            <div className="tooltip">{emoji.name}</div>
            <button className="emoji-btn" onClick={() => onEmojiSelect(emoji)}>
              {emoji.emoji}
            </button>
          </div>
        ))}
    </div>
  );
};

export default EmojiList;
