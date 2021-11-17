import { useState, useEffect } from "react";

import "./Summary.css";

const Summary = ({
  emojiData,
  users,
  activeSummaryTab,
  setActiveSummaryTab,
  setShowSummary,
}) => {
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    let reactedUserList = [];
    if (activeSummaryTab === "all") {
      let tempUserList = [];
      // populate temp array with reactedBy array
      Object.keys(emojiData).forEach((item) => {
        tempUserList = [...tempUserList, ...emojiData[item].reactedBy];
      });

      // map temp array with users matching id
      tempUserList.forEach((item) => {
        const user = users.find((user) => user.id === item.user_id);
        const reaction = emojiData[item.reaction_id].emoji;
        if (user) {
          reactedUserList.push({ ...user, reaction });
        }
      });
    } else {
      emojiData &&
        emojiData[activeSummaryTab].reactedBy.forEach((item) => {
          const user = users.find((user) => user.id === item.user_id);
          const reaction = emojiData[activeSummaryTab].emoji;
          if (user) {
            reactedUserList.push({ ...user, reaction });
          }
        });
    }
    setUserList(reactedUserList);
  }, [activeSummaryTab, users, emojiData]);

  const changeActiveTab = (key) => {
    setActiveSummaryTab(key);
  };

  return (
    // on mouse leave close summary
    <div className="summary" onMouseLeave={() => setShowSummary(false)}>
      <header className="summary-header">
        <h1 className="summary-title">Reactions</h1>
        <ul className="summary-tabs">
          <li
            className={`summary-tab-item ${
              activeSummaryTab === "all" ? "active" : ""
            }`}
            onClick={() => setActiveSummaryTab("all")}
          >
            All
          </li>
          {Object.keys(emojiData).map((key) => (
            <li
              key={key}
              className={`summary-tab-item ${
                key === activeSummaryTab ? "active" : ""
              }`}
              onClick={() => changeActiveTab(key)}
            >
              <span>{emojiData[key].emoji}</span>
              <span>{emojiData[key].count}</span>
            </li>
          ))}
        </ul>
      </header>
      <main className="summary-body">
        <ul className="summary-user-list">
          {userList.map((item, index) => (
            <li key={index} className="summary-user-item">
              <img
                className="summary-user-img"
                src={item.avatar}
                alt="profile-pic"
              />
              <span>
                {item.reaction}&ensp;{item.first_name} {item.last_name}
              </span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
};

export default Summary;
