import { useState, useRef, useEffect } from "react";
import SVGInject from "@iconfu/svg-inject";

import BackgroundCharacters from "./BackgroundCharacters";
import BackgroundHexagonCompositeList from "./BackgroundHexagonCompositeList";
import HomeScreen from "./HomeScreen";
import UserInputFragment from "./UserInputFragment";
import BeeTile from "./BeeTile";
import BeeTileList from "./BeeTileList";

const App = () => {
  const [isMobile, setIsMobile] = useState<boolean>(true);
  const [hitCounter, setHitCounter] = useState<number>(0);
  const [gameOver, setGameOver] = useState<boolean>(false);

  const queenBeeImpactRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    // reference important static elements
    queenBeeImpactRef.current = document.querySelector(
      ".impact"
    ) as HTMLElement;

    // screen size switch
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsMobile(true);
      } else {
        setIsMobile(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    SVGInject(document.querySelectorAll("img.svg-inject"));
  }, []);

  const pauseAudio = (clip: string) => {
    const audioPause = new Audio(clip);
    // pause then reset
    audioPause.pause();
    audioPause.currentTime = 0;
  };

  const playAudio = (clip: string) => {
    const audioPlay = new Audio(clip);
    // reset then play
    audioPlay.currentTime = 0;
    audioPlay.play();
  };

  const beeDetails = [
    {
      id: "queen",
      title: "Queen",
      life: "100",
    },
    {
      id: "worker",
      title: "Worker",
      life: "75",
    },
    {
      id: "drone",
      title: "Drone",
      life: "50",
    },
  ];

  return (
    <main>
      <div id="background" className="cf">
        <div className="floating">
          <div className="left">
            <BackgroundCharacters />
          </div>
          <div className="right">
            <BackgroundCharacters />
          </div>
        </div>
        <div id="grass"></div>
        <BackgroundHexagonCompositeList orientation="top" />
        <BackgroundHexagonCompositeList orientation="bottom" />
        <BackgroundHexagonCompositeList orientation="left" />
        <BackgroundHexagonCompositeList orientation="right" />
      </div>
      <HomeScreen playAudio={playAudio} />
      <section id="game-screen" className="page hide">
        <div className="row">
          <div className="small-12 columns">
            <div className="panel center">
              <div className="content">
                <h1>The Bee Game</h1>
              </div>
              <div className="background"></div>
            </div>
            <div id="gameplay">
              <div className="panel center">
                <div className="content">
                  {isMobile && (
                    <UserInputFragment
                      setHitCounter={setHitCounter}
                      pauseAudio={pauseAudio}
                      playAudio={playAudio}
                      queenBeeImpactRef={queenBeeImpactRef}
                      setGameOver={setGameOver}
                      hitCounter={hitCounter}
                      gameOver={gameOver}
                    />
                  )}
                  <div className="border"></div>
                  {/* QueenBeeTile */}
                  <div className="impact-container">
                    <div className="impact"></div>
                    <figure id="queen-bee" className="tile-instance">
                      <BeeTile details={beeDetails[0]} />
                    </figure>
                  </div>
                  <div className="border"></div>
                  {/* WorkerBeeTile */}
                  <BeeTileList details={beeDetails[1]} />
                  <div className="border"></div>
                  {/* DroneBeeTile */}
                  <BeeTileList details={beeDetails[2]} />
                  <div className="border"></div>
                  {!isMobile && (
                    <UserInputFragment
                      setHitCounter={setHitCounter}
                      pauseAudio={pauseAudio}
                      playAudio={playAudio}
                      queenBeeImpactRef={queenBeeImpactRef}
                      setGameOver={setGameOver}
                      hitCounter={hitCounter}
                      gameOver={gameOver}
                    />
                  )}
                </div>
                <div className="background"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default App;
