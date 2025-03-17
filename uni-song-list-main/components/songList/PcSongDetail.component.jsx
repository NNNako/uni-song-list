import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import styles from "../../styles/Home.module.css";
import { Button, Dropdown } from "react-bootstrap";

const paidIcons = {
  1: { src: '/assets/icon/paid30.png', alt: '付费', title: '付费曲目' },
  2: { src: '/assets/icon/paid50.png', alt: '付费', title: '付费曲目' },
  3: { src: '/assets/icon/paid100.png', alt: '付费', title: '付费曲目' },
  default: { src: '/assets/icon/paid.png', alt: '付费', title: '付费曲目' },
};

const PAGE_SIZE = 20;

const Icon = ({ src, alt, title, className, style }) => (
  <img
    src={src}
    alt={alt}
    title={title}
    className={className}
    style={{ display: 'inline-block', ...style }}
  />
);

const PcSongDetail = ({ filteredSongList, handleClickToCopy, showBiliPlayer, isPerformanceMode }) => {
  const [likedStates, setLikedStates] = useState({});
  const [page, setPage] = useState(1);
  const loader = useRef(null);

  useEffect(() => {
    const initialLikedStates = {};
    filteredSongList.forEach((song) => {
      const storageKey = `${song.song_name}+${song.artist}`;
      const liked = localStorage.getItem(storageKey) === 'true';
      initialLikedStates[storageKey] = liked;
    });
    setLikedStates(initialLikedStates);
  }, [filteredSongList]);

  const visibleSongs = useMemo(() => filteredSongList.slice(0, PAGE_SIZE * page), [filteredSongList, page]);

  const handleLikeClick = useCallback((storageKey) => {
    const newLikedState = !likedStates[storageKey];
    setLikedStates((prev) => ({
      ...prev,
      [storageKey]: newLikedState,
    }));
    localStorage.setItem(storageKey, newLikedState);
  }, [likedStates]);

  const handleObserver = useCallback((entries) => {
    const target = entries[0];
    if (target.isIntersecting) {
      setPage((prev) => prev + 1); 
    }
  }, []);

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0.1,
    };
    const observer = new IntersectionObserver(handleObserver, option);
    if (loader.current) observer.observe(loader.current);

    return () => {
      observer.disconnect();
    };
  }, [handleObserver, filteredSongList, page]);
  
  const hasMoreSongs = filteredSongList.length > visibleSongs.length;

  if (filteredSongList.length === 0) {
    return (
      <tr>
        <td className={`${styles.noSongInListPc} display-6 text-center`} colSpan="7">
          歌单里没有诶~ 可以去直播间碰碰运气哦!
        </td>
      </tr>
    );
  }

  return (
    <>
      {visibleSongs.map((song) => {
        const { index, sticky_top, paid, song_name, BVID, artist, language, genre, remarks } = song;
        const icon = paidIcons[paid] || paidIcons.default;
        const storageKey = `${song_name}+${artist}`;
        const isLiked = likedStates[storageKey] || false;

        return (
          <tr
            className={`${sticky_top ? styles.songRowTop : paid ? styles.songRowPaid : styles.songRow} ${ !isPerformanceMode ? styles.songRowFadeIn : ''}`}
            key={index}
            onClick={() => handleClickToCopy(song)}
          >
            {/* 图标列 */}
            <td className={styles.tableIconTd} style={{ textAlign: 'left' }}>
              {sticky_top === 1 && (
                <Icon
                  src="/assets/icon/new.png"
                  alt="新增"
                  title="新增曲目"
                  className={styles.tableIcons}
                  style={{ marginLeft: '10px', transform: 'translateY(-0.05em)', opacity: 0.7 }}
                />
              )}
              {paid && (
                <Icon
                  src={icon.src}
                  alt={icon.alt}
                  title={icon.title}
                  className={`${styles.tableIcons} ${styles.paidIcon}`}
                  style={{ marginLeft: '10px', transform: 'translateY(-0.05em)', opacity: 0.7 }}
                />
              )}
            </td>

            {/* 歌曲名称列 */}
            <td className={styles.tableWrap} id={paid ? `paid ${index}` : index}>
              {song_name}
            </td>

            {/* 收藏 播放按钮列 */}
            <td className={styles.tableIconTd} style={{ textAlign: 'left' }}>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleLikeClick(storageKey);
                }}
                style={{ 
                  border: 'none', 
                  background: 'none',
                  cursor: 'url("./assets/cursor/pointer.png"), pointer',
                }}
              >
                <Icon
                  src={isLiked ? '/assets/icon/favor.png' : '/assets/icon/nofavor.png'}
                  alt={isLiked ? '取消收藏' : '收藏'}
                  title={isLiked ? '取消收藏' : '收藏'}
                  className={isLiked ? styles.favorIcon : styles.nofavorIcon}
                />
              </button>
              {BVID && (
                <Button
                  className={styles.bvPlayerButton}
                  title="投稿歌切试听"
                  style={{ marginTop: 0, padding: "0.25rem" }}
                  onClick={(e) => {
                    e.stopPropagation();
                    showBiliPlayer(song);
                  }}
                >
                  <div className="d-flex">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      fill="#1D0C26"
                      className="bi bi-play-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="m11.596 8.697-6.363 3.692c-.54.313-1.233-.066-1.233-.697V4.308c0-.63.692-1.01 1.233-.696l6.363 3.692a.802.802 0 0 1 0 1.393z" />
                    </svg>
                  </div>
                </Button>
              )}
            </td>

            {/* 其他列 */}
            <td className={styles.tableWrap}>{artist.replace(/\//g, ' / ')}</td>
            <td className={styles.tableWrap}>{language}</td>
            <td className={styles.tableWrap}>{genre.replace(/\//g, '、')}</td>
            <td className={styles.tableNoWrap}>{remarks}</td>
          </tr>
        );
      })}

      {hasMoreSongs && (
        <tr ref={loader}>
          <td colSpan="7" style={{ textAlign: 'center', padding: '10px' }}>
            <Button
              onClick={() => setPage((prev) => prev + 1)}
              style={{
                color: 'black',
                cursor: 'url("/assets/cursor/pointer.png"), pointer',
                background: 'none',
                border: 'none',
              }}
            >
              Load More Songs...
            </Button>
          </td>
        </tr>
      )}
    </>
  );
};

export default React.memo(PcSongDetail);