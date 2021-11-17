import { useState, useEffect } from "react";
import { useStore } from "../../context/StoreContext";
import Trigger from "../Trigger/Trigger";

import "./Content.css";

const Content = ({ author, id, imageURL }) => {
  const { emojis, userContentReactions } = useStore();

  const [emojiData, setEmojiData] = useState({});

  useEffect(() => {
    // filter data with content_id = this content
    const filteredUserContentReactions = userContentReactions.filter(
      (item) => item.content_id === id
    );

    // map reaction_id with emoji id
    const mappedEmojis = filteredUserContentReactions.map((item) => {
      return emojis.find((emoji) => emoji.id === item.reaction_id);
    });

    const emojiCount = {};

    // count number of reactions for each emoji
    mappedEmojis.forEach((item) => {
      if (emojiCount[item.id]) {
        emojiCount[item.id].count += 1;
      } else {
        emojiCount[item.id] = {
          name: item.name,
          emoji: item.emoji,
          count: 1,
          reactedBy: filteredUserContentReactions.filter(
            (ucr) => ucr.reaction_id === item.id
          ),
        };
      }
    });
    setEmojiData(emojiCount);
  }, [userContentReactions, emojis, id]);

  return (
    <div className="content">
      <div className="content-container">
        <img
          src="https://picsum.photos/200"
          className="content-user-img"
          alt="profile-pic"
        />
        <div className="content-right">
          <h1 className="content-user-name">
            {author ? author : "Unknown User"}
          </h1>
          <div className="content-body">
            {imageURL ? (
              <img className="content-img" src={imageURL} alt="post-img" />
            ) : (
              <>
                Sint id culpa esse deserunt amet dolor proident amet incididunt.
                Sit anim eu qui mollit nostrud culpa quis nisi velit id. Ullamco
                proident quis ea et ad qui. Duis in consequat qui ea nisi.
              </>
            )}
          </div>
          <Trigger contentId={id} emojiData={emojiData} />
        </div>
      </div>
    </div>
  );
};

export default Content;
