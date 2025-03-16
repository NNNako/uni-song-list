import styles from "../styles/Home.module.css";
import { SplitButton, Dropdown } from "react-bootstrap";
import { getCursor } from "../utils/utils";
import MusicList from "../public/music_list.json";

const activeColor = "#BEA5C1";

const availableGenre = [
  ...new Set(MusicList.flatMap((x) => x.genre?.split("/") || []).filter(Boolean)),
];

export default function GenreBtn({ genreFilter, setgenreState }) {
  return (
    <div className="d-grid">
      <SplitButton
        title="曲风"
        className={genreFilter === "" ? styles.GenreBtn : styles.GenreBtnActive}
        onClick={() => setgenreState("")}
      >
        {availableGenre.map((genre) => (
          <Dropdown.Item
            key={genre}
            onClick={() => setgenreState(genreFilter === genre ? "" : genre)}
            style={{
              backgroundColor: genreFilter === genre ? activeColor : undefined,
              cursor: getCursor(),
            }}
          >
            {genre}
          </Dropdown.Item>
        ))}
      </SplitButton>
    </div>
  );
}