import styles from "../../styles/Home.module.css";
import { Button, Col, Container, Row } from "react-bootstrap";
import GenreBtn from "../../components/GenreBtn.component";
import { config } from "../../config/constants";

const { LanguageCategories: languageCategories} = config;

const isActive = (selected, except) => 
  selected === except ? styles.customCategoryButtonActive : styles.customCategoryButton;

const switchState = (setter, selected, except) => 
  selected === except ? setter("") : setter(except);

export default function SongListFilter({
  categorySelection,
  setLanguageState,
  setPaidState,
  setgenreState,
  favoriteSelection,
  setFavorState,
}) {
  return (
    <div className={styles.categorySelectionContainer}>
      <h5 className={styles.categorySelectionTitle}>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          className="bi bi-search"
          viewBox="0 0 16 16"
          style={{ verticalAlign: "baseline" }}
        >
          <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001c.03.04.062.078.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1.007 1.007 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0z" />
        </svg>{" "}
        挑个想听的类别呗~
      </h5>
      <Container fluid>
        <Row>
          {languageCategories.map((language) => (
            <Col xs={6} md={3} key={language}>
              <div className="d-grid">
                <Button
                  className={isActive(categorySelection.lang, language)}
                  onClick={() => switchState(setLanguageState, categorySelection.lang, language)}
                >
                  {language}
                </Button>
              </div>
            </Col>
          ))}

          <Col xs={6} md={3}>
            <GenreBtn
              genreFilter={categorySelection.genre}
              setgenreState={setgenreState}
            />
          </Col>

          <Col xs={6} md={3}>
            <div className="d-grid">
              <Button
                className={isActive(categorySelection.paid, true)}
                onClick={() => setPaidState(!categorySelection.paid)}
              >
                付费
              </Button>
            </div>
          </Col>

          <Col xs={6} md={3}>
            <div className="d-grid">
              <Button
                className={favoriteSelection ? styles.customCategoryButtonActive : styles.customCategoryButton}
                onClick={() => setFavorState(!favoriteSelection)}
              >
                我的收藏
              </Button>
            </div>
          </Col>

        </Row>
      </Container>
    </div>
  );
}