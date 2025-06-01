import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { Button } from 'react-bootstrap';
import styles from '../../styles/Home.module.css';

const paidIcons = {
  1: { src: '/assets/icon/paid30.png', alt: '付费', title: '付费曲目' },
  2: { src: '/assets/icon/paid50.png', alt: '付费', title: '付费曲目' },
  3: { src: '/assets/icon/paid100.png', alt: '付费', title: '付费曲目' },
  default: { src: '/assets/icon/paid.png', alt: '付费', title: '付费曲目' },
};

const PAGE_SIZE = 20;

const MobileSongDetail = ({ filteredSongList, handleClickToCopy, isPerformanceMode}) => {
  const [likedStates, setLikedStates] = useState({});
  const [activeButton, setActiveButton] = useState(null);
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
    setActiveButton(storageKey);
    setTimeout(() => setActiveButton(null), 150);
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
      <div className={`${styles.noSongInListMobile} display-6 text-center`}>
        歌单里没有诶~ 可以去直播间碰碰运气哦!
      </div>
    );
  }

  return (
    <>
      {visibleSongs.map((song) => {
        const { index, paid, sticky_top, song_name, BVID, artist, language, genre } = song;
        const icon = paidIcons[paid] || paidIcons.default;
        const storageKey = `${song_name}+${artist}`;
        const isLiked = likedStates[storageKey] || false;
        const isActive = activeButton === storageKey;
        const isNewSubmit = BVID.includes('https')

        return (
          <Button
            key={index}
            className={`${styles.songButton} ${paid ? styles.songButtonPaid : ''} ${isNewSubmit ? styles.songButtonNewSubmit : ''} ${sticky_top ? styles.songButtonTop : ''} ${isActive ? styles.songButtonActive : ''} ${ !isPerformanceMode ? styles.songRowFadeIn : ''}`}
            onClick={() => handleClickToCopy(song)}
          >
            {/* 歌曲信息 */}
            <div className={styles.songButtonContent}>
              <div className={styles.songInfo}>
                <span className={`${styles.songLine} ${sticky_top ? styles.stickytop : isNewSubmit ? styles.isNewSubmit : paid ? styles.paid : styles.default}`}></span>
                <span className={styles.songText}>
                  {song_name} - {artist.replace(/\//g, ' / ')}
                </span>
              </div>
              <div className={styles.tagsContainer}>
                {language && <div className={`${styles.tag} ${styles.language}`}>{language}</div>}
                {genre && genre.split('/').map((genreItem, idx) => (
                  <div key={idx} className={`${styles.tag} ${styles.genre}`}>{genreItem}</div>
                ))}
              </div>
            </div>

            {/* 收藏按钮 */}
            <div
              onClick={(e) => {
                e.stopPropagation();
                handleLikeClick(storageKey);
              }}
              style={{ 
                border: 'none', 
                background: 'none',
                cursor: 'url("./assets/cursor/normal.png"), normal',
                position: 'absolute',
                top: '0',
                right: '0',
              }}
            >
              <img
                src={isLiked ? '/assets/icon/favor.png' : '/assets/icon/nofavor.png'}
                alt={isLiked ? '取消收藏' : '收藏'}
                className={isLiked ? styles.favorIcon : styles.nofavorIcon}
                title={isLiked ? '取消收藏' : '收藏'}
              />
            </div>

            {/* 付费、新投稿、置顶图标 */}
            <div className={styles.iconContainer}>
              {sticky_top != 0 && (
                <img
                  src="/assets/icon/new.png"
                  alt="新增"
                  className={styles.tableIcons}
                  title="新增曲目"
                  style={{ marginBottom: '1px', opacity: 0.7 }}
                />
              )}
              {isNewSubmit && (
                <img
                  src="/assets/icon/newSubmit.png"
                  alt="投稿"
                  title="新增投稿"
                  className={styles.tableIcons}
                 style={{ marginBottom: '1px', opacity: 0.7 }}
                />
              )}
              {paid && (
                <img
                  src={icon.src}
                  alt={icon.alt}
                  className={styles.tableIcons}
                  title={icon.title}
                  style={{ marginBottom: '1px', opacity: 0.7 }}
                />
              )}
            </div>
          </Button>
        );
      })}

      {/* 加载更多按钮 */}
      {hasMoreSongs && (
        <div ref={loader} style={{ textAlign: 'center', padding: '10px' }}>
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
        </div>
      )}
    </>
  );
};

export default React.memo(MobileSongDetail);