import { useState, useEffect, useRef } from "react";
import { useStore } from "../../context/StoreContext";
import axios from "axios";
import EmojiList from "../EmojiList/EmojiList";
import Summary from "../Summary/Summary";
import { EmojiPlus, LoadingIndicator } from "../../icons";

import "./Trigger.css";

const Trigger = ({ emojiData, contentId }) => {
  const [showEmojiList, setShowEmojiList] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [activeSummaryTab, setActiveSummaryTab] = useState("all");
  const [isLoading, setIsLoading] = useState(false);
  const emojiListRef = useRef(null);

  const { currentUserID, updateData, users } = useStore();

  // toggle emoji list
  const toggleEmojiList = () => {
    setShowEmojiList((prev) => !prev);
  };

  // show summary component
  const handleShowSummary = (id) => {
    setShowSummary(true);
    setActiveSummaryTab(id);
  };

  // check whether click outside of emoji list
  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (
        emojiListRef &&
        emojiListRef.current &&
        !emojiListRef.current.contains(e.target)
      ) {
        setShowEmojiList(false);
      }
    };
    document.addEventListener("mousedown", checkIfClickedOutside);
    return () => {
      // Cleanup the event listener
      document.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showSummary]);

  // remove reaction if the selected reaction is already selected
  const handleRemoveReaction = async (reaction) => {
    setIsLoading(true);
    if (reaction) {
      await axios.delete(
        `https://artful-iudex.herokuapp.com/user_content_reactions/${reaction.id}`
      );

      updateData();
    }
    setIsLoading(false);
  };

  return (
    <div className="reaction-container">
      <div className="reaction-wrapper">
        <div className="emoji-count-wrapper">
          {isLoading && <LoadingIndicator className="spin" />}
          {Object.keys(emojiData).map((item) => {
            // check if user selected reaction is present
            const isUserSelected = emojiData[item].reactedBy.find(
              (item) => item.user_id === currentUserID
            );
            return (
              <div
                key={item}
                className={`emoji-count ${
                  isUserSelected ? "user-selected-emoji" : ""
                }`}
                onMouseEnter={() => handleShowSummary(item)}
                onClick={() => handleRemoveReaction(isUserSelected)}
              >
                <span>{emojiData[item].emoji}</span>{" "}
                <span>{emojiData[item].count}</span>
              </div>
            );
          })}
        </div>
        <div
          className="add-emoji-btn"
          onClick={toggleEmojiList}
          ref={emojiListRef}
        >
          {showEmojiList && (
            <EmojiList contentId={contentId} setIsLoading={setIsLoading} />
          )}
          <EmojiPlus />
        </div>
        {showSummary && (
          <Summary
            emojiData={emojiData}
            users={users}
            activeSummaryTab={activeSummaryTab}
            setActiveSummaryTab={setActiveSummaryTab}
            setShowSummary={setShowSummary}
          />
        )}
      </div>
    </div>
  );
};

export default Trigger;
