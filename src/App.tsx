import React, { useState, useRef, useEffect, MouseEvent } from "react";
// @ts-ignore
import SVGInject from "@iconfu/svg-inject";
import "./styles/foundation-base.css";
import "./App.css";

import queenBeeImage from "./images/queen-bee.svg";
import workerBeeImage from "./images/worker-bee.svg";
import droneBeeImage from "./images/drone-bee.svg";
import bgHexagonImages from "./images/icons/svg/hexagon.svg";
import tileHexagonImage from "./images/icons/svg/hexagon-single.svg";

import reloadSfx from "./sound/reload.mp3";
import swatSfx from "./sound/swat.mp3";
import deadBeeSfx from "./sound/dead_bee.mp3";
import hitQueenSfx from "./sound/hit_queen.mp3";
import youWinSfx from "./sound/you_win.mp3";

export function App() {
  const [isMobile, setIsMobile] = useState(true);
  const [hitCounter, setHitCounter] = useState(0);
  const [gameOver, setGameOver] = useState(false);

  const tileArray: string[] = [
    "queen",
    "worker",
    "worker",
    "worker",
    "worker",
    "worker",
    "drone",
    "drone",
    "drone",
    "drone",
    "drone",
    "drone",
    "drone",
    "drone",
  ];

  const queenBeeImpactRef = useRef<HTMLElement>();

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

  const handleStartGame = (event: MouseEvent<HTMLButtonElement>) => {
    const homeScreen = document.querySelector("#home-screen") as HTMLElement;
    homeScreen.classList.add("hide");
    const gameScreen = document.querySelector("#game-screen") as HTMLElement;
    gameScreen.classList.remove("hide");

    // play sound-effect
    playAudio(reloadSfx);

    // animate tile, then remove animation class when completed
    document.querySelectorAll(".tile-instance").forEach((item: Element) => {
      setInterval(() => {
        item.classList.toggle("shine");
      }, 1000);
    });
  };

  const handleHitBeeClick = () => {
    // update hitCount
    setHitCounter(hitCounter + 1);

    // calculate 'hive' array - find tile-instances not disabled
    const hive = document.querySelectorAll(
      "#gameplay .tile-instance:not(.disabled)"
    );
    const singleBee = hive[Math.floor(Math.random() * hive.length)];

    // standard tile-instance calculations
    const thisCounter = singleBee.querySelector(
      ".counter span:first-of-type"
    ) as Element;
    const thisNumber = Number(thisCounter.innerHTML);

    // animate bee when hit, then remove animation class when completed
    singleBee.classList.add("activated", "wobble");
    const finishWobble = () => {
      singleBee.classList.remove("wobble");
    };
    singleBee.addEventListener("transitionend", finishWobble);

    switch (true) {
      // Queen Bee increment only if not disabled
      case singleBee.matches("#queen-bee") &&
        !singleBee.classList.contains("disabled"):
        // pause sound-effect
        pauseAudio(swatSfx);
        // play sound-effect
        playAudio(hitQueenSfx);

        thisCounter.innerHTML = (thisNumber - 8).toString();

        // update impact animation
        if (queenBeeImpactRef.current) {
          const queenBeeImpact = queenBeeImpactRef.current;
          // animate bee when hit, then remove transition class when completed
          queenBeeImpact.classList.add("animate");
          const finishAnimate = () => {
            queenBeeImpact.classList.remove("animate");
          };
          queenBeeImpact.addEventListener("transitionend", finishAnimate);
        }
        break;
      // Worker Bee increment only if not disabled
      case singleBee.matches(".worker-bee") &&
        !singleBee.classList.contains("disabled"):
        // play sound-effect
        playAudio(swatSfx);

        thisCounter.innerHTML = (thisNumber - 10).toString();
        break;
      // Drone Bee increment only if not disabled
      case singleBee.matches(".drone-bee") &&
        !singleBee.classList.contains("disabled"):
        // play sound-effect
        playAudio(swatSfx);

        thisCounter.innerHTML = (thisNumber - 12).toString();
        break;
      default:
    }

    // Kill bee
    if (Number(thisCounter.innerHTML) <= 0) {
      // Game over
      if (singleBee.matches("#queen-bee")) {
        // update game state
        setGameOver(true);

        // pause sound-effect
        pauseAudio(hitQueenSfx);
        pauseAudio(swatSfx);
        // play sound-effect
        playAudio(youWinSfx);

        // kill all remaining bees
        document.querySelectorAll(".tile-instance").forEach((item: Element) => {
          item.classList.add("activated", "disabled");
          item.classList.remove("wobble");
          const thisCounter = item.querySelector(
            ".counter span:first-of-type"
          ) as Element;
          thisCounter.innerHTML = "Defeated!";
        });
      } else {
        // pause sound-effect
        pauseAudio(swatSfx);
        // play sound-effect
        playAudio(deadBeeSfx);

        singleBee.classList.add("disabled");
        singleBee.classList.remove("wobble");
        thisCounter.innerHTML = "Defeated!";
      }
    }
  };

  const handleRestartGame = (event: MouseEvent<HTMLButtonElement>) => {
    // update game state
    setGameOver(false);
    // update hitCount
    setHitCounter(0);

    const queenBeeSpan = document.querySelector(
      "#queen-bee .counter span:first-of-type"
    ) as Element;
    queenBeeSpan.innerHTML = "100";

    document
      .querySelectorAll(".worker-bee .counter span:first-of-type")
      .forEach((item: Element) => {
        item.innerHTML = "75";
      });

    document
      .querySelectorAll(".drone-bee .counter span:first-of-type")
      .forEach((item: Element) => {
        item.innerHTML = "50";
      });

    // update impact animation
    if (queenBeeImpactRef.current) {
      const queenBeeImpact = queenBeeImpactRef.current;
      queenBeeImpact.classList.remove("animate");
    }

    // remove animation classes, fade in tiles
    document.querySelectorAll(".tile-instance").forEach((item: Element) => {
      item.classList.remove("activated", "disabled");
    });

    // play sound-effect
    playAudio(reloadSfx);
  };

  const BackgroundCharacters = () => {
    return (
      <>
        <figure className="bee-character">
          <img src={queenBeeImage} alt="Queen Bee" />
        </figure>
        <figure className="bee-character">
          <img src={workerBeeImage} alt="Worker Bee" />
        </figure>
        <figure className="bee-character">
          <img src={droneBeeImage} alt="Drone Bee" />
        </figure>
      </>
    );
  };

  const BackgroundHexagonCompositeList = ({ orientation }: any) => {
    const BackgroundHexagonComposite = () => {
      const BackgroundHexagon = () => {
        useEffect(() => {
          SVGInject(document.querySelectorAll("img.svg-inject"));
        }, []);

        return (
          <img className="svg-inject" src={bgHexagonImages} alt="Hexagon" />
        );
      };

      return (
        <li>
          <figure className="hexagon">
            <BackgroundHexagon />
          </figure>
          <figure className="hexagon hue-wipe">
            <BackgroundHexagon />
          </figure>
        </li>
      );
    };

    return (
      <ul className={`no-disc ${orientation}`}>
        <BackgroundHexagonComposite />
        <BackgroundHexagonComposite />
        <BackgroundHexagonComposite />
        <BackgroundHexagonComposite />
        <BackgroundHexagonComposite />
      </ul>
    );
  };

  const UserInputFragment = () => {
    return (
      <>
        <div className="hit-bee">
          <div className="hit-counter">
            Hit count: <span>{hitCounter}</span>
          </div>
          {!gameOver && (
            <button onClick={(e) => handleHitBeeClick()}>Hit a Bee!</button>
          )}
        </div>
        {gameOver && (
          <div className="restart center">
            <p className="winning-message">
              {hitCounter < 90 && "RANK: SWAT-KING"}
              {hitCounter >= 90 && "RANK: AMATEUR BEE CLEANER"}
            </p>
            <button className="rounded" onClick={(e) => handleRestartGame(e)}>
              Restart game?
            </button>
          </div>
        )}
      </>
    );
  };

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
      <section id="home-screen" className="page">
        <div className="row">
          <div className="small-12 columns">
            <div className="panel-container">
              <div className="panel center">
                <div className="content">
                  <h1>
                    Welcome to <span>The Bee Game</span>
                  </h1>
                  <p>Click the &apos;Hit a Bee!&apos; button repeatedly.</p>
                  <p>
                    Get lucky and hit the Queen enough times to take out the
                    whole Hive at once!
                  </p>
                  <p>
                    The object is to defeat the Hive in the least amount of
                    hits. Score below 90 hits for a different end rank!
                  </p>
                  <button
                    className="rounded"
                    onClick={(e) => handleStartGame(e)}
                  >
                    Start game
                  </button>
                </div>
                <div className="background"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
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
                  {isMobile && <UserInputFragment />}
                  <div className="border"></div>
                  {/* QueenBeeTile */}
                  <div className="impact-container">
                    <div className="impact"></div>
                    <figure id="queen-bee" className="tile-instance">
                      <img
                        className="svg-inject"
                        src={tileHexagonImage}
                        alt="Hexagon single"
                      />
                      <span>Queen Bee</span>
                      <div className="counter">
                        <span>100</span>
                        <span>/100</span>
                      </div>
                    </figure>
                  </div>
                  <div className="border"></div>
                  <ul className="inline-list">
                    {tileArray.map((item, index) =>
                      // WorkerBeeTile
                      item === "worker" ? (
                        <li key={index} className="worker-bee tile-instance">
                          <img
                            className="svg-inject"
                            src={tileHexagonImage}
                            alt="Hexagon single"
                          />
                          <span>Worker Bee</span>
                          <div className="counter">
                            <span>75</span>
                            <span>/75</span>
                          </div>
                        </li>
                      ) : null
                    )}
                  </ul>
                  <div className="border"></div>
                  <ul className="inline-list">
                    {tileArray.map((item, index) =>
                      // DroneBeeTile
                      item === "drone" ? (
                        <li key={index} className="drone-bee tile-instance">
                          <img
                            className="svg-inject"
                            src={tileHexagonImage}
                            alt="Hexagon single"
                          />
                          <span>Drone Bee</span>
                          <div className="counter">
                            <span>50</span>
                            <span>/50</span>
                          </div>
                        </li>
                      ) : null
                    )}
                  </ul>
                  <div className="border"></div>
                  {!isMobile && <UserInputFragment />}
                </div>
                <div className="background"></div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

export default App;
