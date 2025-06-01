import React from "react";

import styles from "../../styles/Home.module.css";
import "react-toastify/dist/ReactToastify.css";

import { config } from "../../config/constants";
import BannerButton from "./BannerButton.component";

export default function BannerIntro({}) {
  return (
    <div>
      {config.BannerContent.map((cnt) => {
        return <p className={styles.introParagraph} key={cnt}>{cnt}</p>;
      })}
      {config.CustomButtons.map((btn) => {
        return (
          <BannerButton
            link={btn.link}
            image={btn.image}
            name={btn.name}
            style={{ 
              border: "2px solid #1D0C26", 
              width: "100%", 
              cursor: 'url("./assets/cursor/normal.png"), normal',
            }}
            key={btn.link}
          ></BannerButton>
        );
      })}
    </div>
  );
}
