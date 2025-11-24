import { useState } from "react";

import Card from "./components/card";
import KrpanoViewer from "./components/virtualViewer";
import ButtonBar from "./components/buttons";

import "./App.css";

import img1 from "./assets/images/011.jpg";
import img2 from "./assets/images/001.jpg";
import img3 from "./assets/images/03.jpg";
import img4 from "./assets/images/015.jpg";
import img5 from "./assets/images/depth-1.jpg";

const cardData = [
  // {
  //   image: img1,
  //   title: "Greenfield Community",
  //   page: 1,
  // },
  {
    image: img2,
    title: "Stunning Cityscape",
    page: 2,
  },
  {
    image: img3,
    title: "Maplewood Apartments",
    page: 3,
  },
  {
    image: img1,
    title: "Gyroscope Effect",
    page: 4,
  },
  {
    image: img4,
    title: "Three js example",
    page: 5,
  },
  {
    image: img5,
    title: "Depthmap Navigation",
    page: 6,
  },
];

function App() {
  const [selectedCard, setSelectedCard] = useState<{
    image: string;
    title: string;
    page: number;
  } | null>(null);

  const handleCardClick = (card: {
    image: string;
    title: string;
    page: number;
  }) => {
    setSelectedCard(card);
  };

  const handleBack = () => {
    setSelectedCard(null);
  };

  return (
    <div className="App">
      <div className="container">
        {!selectedCard ? (
          <>
            <h1 className="heading">Virtual Tours</h1>
            <div className="card-section">
              {cardData.map((card, index) => (
                <Card
                  key={index}
                  image={card.image}
                  title={card.title}
                  onClick={() => handleCardClick(card)}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="viewerSection">
            <button onClick={handleBack} className="backBtn">
              Back
            </button>
            <ButtonBar />
            <KrpanoViewer page={selectedCard?.page} />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
