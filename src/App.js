import Content from "./components/Content/Content";

import "./App.css";

const App = () => {
  const posts = [
    {
      id: 1,
      author: "iamNishanth",
      imageURL: null,
    },
    {
      id: 2,
      author: "Nishanth V",
      imageURL: "https://picsum.photos/300/300",
    },
  ];
  return (
    <div className="App">
      {posts.map((post) => (
        <Content
          key={post.id}
          id={post.id}
          author={post.author}
          imageURL={post.imageURL}
        />
      ))}
    </div>
  );
};

export default App;
