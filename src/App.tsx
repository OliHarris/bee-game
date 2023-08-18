import { useState, useRef, MutableRefObject, useEffect } from "react";
import SVGInject from "@iconfu/svg-inject";

import queenBeeImage from "./assets/images/queen-bee.svg";
import workerBeeImage from "./assets/images/worker-bee.svg";
import droneBeeImage from "./assets/images/drone-bee.svg";
import bgHexagonImages from "./assets/images/icons/svg/hexagon.svg";
import tileHexagonImage from "./assets/images/icons/svg/hexagon-single.svg";

import reloadSfx from "./assets/sound/reload.mp3";
import swatSfx from "./assets/sound/swat.mp3";
import deadBeeSfx from "./assets/sound/dead_bee.mp3";
import hitQueenSfx from "./assets/sound/hit_queen.mp3";
import youWinSfx from "./assets/sound/you_win.mp3";

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

const BackgroundHexagon = () => (
  <img className="svg-inject" src={bgHexagonImages} alt="Hexagon" />
);

const BackgroundHexagonComposite = () => {
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

interface BackgroundHexagonCompositeListInterface {
  orientation: string;
}
const BackgroundHexagonCompositeList = ({
  orientation,
}: BackgroundHexagonCompositeListInterface) => {
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

interface HomeScreenInterface {
  playAudio: (clip: string) => void;
}
const HomeScreen = ({ playAudio }: HomeScreenInterface) => {
  const handleStartGame = () => {
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

  return (
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
                  Get lucky and hit the Queen enough times to take out the whole
                  Hive at once!
                </p>
                <p>
                  The object is to defeat the Hive in the least amount of hits.
                  Score below 90 hits for a different end rank!
                </p>
                <button className="rounded" onClick={() => handleStartGame()}>
                  Start game
                </button>
              </div>
              <div className="background"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

interface UserInputFragmentInterface {
  setHitCounter: (value: number) => void;
  pauseAudio: (clip: string) => void;
  playAudio: (clip: string) => void;
  queenBeeImpactRef: MutableRefObject<HTMLElement | null>;
  setGameOver: (value: boolean) => void;
  hitCounter: number;
  gameOver: boolean;
}
const UserInputFragment = ({
  setHitCounter,
  pauseAudio,
  playAudio,
  queenBeeImpactRef,
  setGameOver,
  hitCounter,
  gameOver,
}: UserInputFragmentInterface) => {
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

  const handleRestartGame = () => {
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

  return (
    <>
      <div className="hit-bee">
        <div className="hit-counter">
          Hit count: <span>{hitCounter}</span>
        </div>
        {!gameOver && (
          <button onClick={() => handleHitBeeClick()}>Hit a Bee!</button>
        )}
      </div>
      {gameOver && (
        <div className="restart center">
          <p className="winning-message">
            {hitCounter < 90 && "RANK: SWAT-KING"}
            {hitCounter >= 90 && "RANK: AMATEUR BEE CLEANER"}
          </p>
          <button className="rounded" onClick={() => handleRestartGame()}>
            Restart game?
          </button>
        </div>
      )}
    </>
  );
};

interface BeeTileInterface {
  details: {
    id: string;
    title: string;
    life: string;
  };
}
const BeeTile = ({ details }: BeeTileInterface) => {
  return (
    <>
      <img className="svg-inject" src={tileHexagonImage} alt="Hexagon single" />
      <span>{details.title} Bee</span>
      <div className="counter">
        <span>{details.life}</span>
        <span>/{details.life}</span>
      </div>
    </>
  );
};

const BeeTileList = ({ details }: BeeTileInterface) => {
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

  return (
    <ul className="inline-list">
      {tileArray.map((item, index) =>
        item === details.id ? (
          <li key={index} className={`${details.id}-bee tile-instance`}>
            <BeeTile details={details} />
          </li>
        ) : null
      )}
    </ul>
  );
};

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
