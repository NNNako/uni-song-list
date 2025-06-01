import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import styles from '../styles/Home.module.css';
import 'react-toastify/dist/ReactToastify.css';
import { Button, Col, Container, Form, Offcanvas, Row } from 'react-bootstrap';
import { toast } from 'react-toastify';
import copy from 'copy-to-clipboard';
import MusicList from '../public/music_list.json';
import Banner from '../components/banner/Banner.component';
import BannerIntro from '../components/banner/BannerIntro.component';
import BiliPlayerModal from '../components/BiliPlayerModal.component';
import SongListFilter from '../components/songList/SongListFilter.component';
import PcSongListTable from '../components/songList/PcSongListTable.component';
import MobileSongListTable from '../components/songList/MobileSongListTable.component';
import imageLoader from '../utils/ImageLoader';
import { config } from '../config/constants';
import * as utils from '../utils/utils';

const MusicNotes = dynamic(() => import('../components/MusicNotes.component'), {
  ssr: false,
});

export default function Home() {
  const [categorySelection, setCategorySelection] = useState({
    lang: '',
    genre: '',
    paid: false,
  });
  const [favoriteSelection, setFavoriteSelection] = useState(false);
  const [searchBox, setSearchBox] = useState('');
  const [showToTopButton, setToTopShowButton] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const [modalPlayerShow, setPlayerModalShow] = useState(false);
  const [modalPlayerSongName, setPlayerModalSongName] = useState('');
  const [BVID, setBVID] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: 'asc',
  });
  const [isPerformanceMode, setIsPerformanceMode] = useState(false);

  useEffect(() => {
    const savedPerformanceMode = localStorage.getItem('performanceMode');
    if (savedPerformanceMode !== null) {
      setIsPerformanceMode(savedPerformanceMode === 'true');
    } else {
      setIsPerformanceMode(true);
    }
  }, []);

  useEffect(() => {
    const avatarElements = document.querySelectorAll(`.${styles.avatar}`);
    avatarElements.forEach((avatar) => {
      if (isPerformanceMode) {
        avatar.style.animation = 'none';
      } else {
        avatar.style.animation = '';
      }
    });
  }, [isPerformanceMode]);

  const handlePerformanceModeToggle = () => {
    const newPerformanceMode = !isPerformanceMode;
    setIsPerformanceMode(newPerformanceMode);
    localStorage.setItem('performanceMode', newPerformanceMode);

    const avatarElements = document.querySelectorAll(`.${styles.avatar}`);
    avatarElements.forEach((avatar) => {
      if (newPerformanceMode) {
        avatar.style.animation = 'none';
      } else {
        avatar.style.animation = '';
      }
    });
  };

  useEffect(() => {
    // 网页Title
    const handleVisibilityChange = () => {
      const isHidden = document.hidden;
      document.title = isHidden ? '拜拜宝宝 ~' : '早上中午晚上好 ~';
      setTimeout(() => {
        document.title = '糊涂蛋uni的歌单';
      }, 1500);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  useEffect(() => {
    // 检测窗口滚动
    const handleScroll = () => {
      setToTopShowButton(window.scrollY > 600);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // 歌曲过滤
  const filteredSongList = MusicList.filter(
    (song) =>
      (utils.include(song.song_name, searchBox, true) ||
      utils.include(song.artist, searchBox, true) ||
      utils.include(song.remarks, searchBox, false) ||
      utils.include(song.language, searchBox, false)) &&
      (categorySelection.lang === "其他语言"
        ? !config.Mainlang.includes(song.language) && song.language
        : categorySelection.lang
        ? song.language?.includes(categorySelection.lang)
        : true) &&
      (categorySelection.genre ? song.genre?.split('/').includes(categorySelection.genre) : true) &&
      (categorySelection.paid ? song.paid === 1 : true) &&
      (!favoriteSelection || localStorage.getItem(`${song.song_name}+${song.artist}`) === 'true')
  );

  // 歌曲排序
  const sortedSongList = React.useMemo(() => {
    let sortableList = [...filteredSongList];
    if (sortConfig.key && sortConfig.direction) {
      sortableList.sort((a, b) => {
        console.log(a[sortConfig.key])
        const aValue = a[sortConfig.key] ? a[sortConfig.key].toLowerCase() : '';
        const bValue = b[sortConfig.key] ? b[sortConfig.key].toLowerCase() : '';
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }
    return sortableList;
  }, [filteredSongList, sortConfig]);

  const handleSort = (key) => {
    let direction = null;
    if (sortConfig.key !== key) {
      direction = 'asc';
    } else {
      switch (sortConfig.direction) {
        case null:
          direction = 'asc';
          break;
        case 'asc':
          direction = 'desc';
          break;
        case 'desc':
          direction = null;
          break;
        default:
          direction = null;
      }
    }
    setSortConfig({ key, direction });
  };

  // 复制
  const handleClickToCopy = (song) => {
    if (song) {
      if (song.commandStr) {
        copy(song.commandStr);
      } else {
        copy('点歌 ' + song.song_name);
      }
      toast.success(
        song.paid
          ? `付费曲目「${song.song_name}」成功复制到剪贴板!`
          : `「${song.song_name}」成功复制到剪贴板!`
      );
    }
  };

  // 语言过滤
  const setLanguageState = (lang) => {
    setCategorySelection({ lang, genre: '', paid: false});
    setFavoriteSelection(false);
  };

  // 曲风过滤
  const setgenreState = (genre) => {
    setCategorySelection({ lang: '', genre, paid: false});
    setFavoriteSelection(false);
  };

  // 付费过滤
  const setPaidState = (paid) => {
    setCategorySelection({ lang: '', genre: '', paid});
    setFavoriteSelection(false);
  };

  const setFavorState = (state) => {
    setCategorySelection({ lang: '', genre: '', paid: false});
    setFavoriteSelection(state);
  };

  // 在对应类目里面的随便听听
  const handleRandomSongWithFilter = () => {
    if (sortedSongList.length <= 0) {
      toast.success(`当前筛选条件下没有歌曲哦~`);
      return;
    }
    const random = Math.floor(Math.random() * sortedSongList.length);
    handleClickToCopy(sortedSongList[random]);
  };

  // 滚动到顶部
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  // 显示 B 站播放器 OR 直接打开对应网页
  const showBiliPlayer = (song) => {
    if (song.BVID.includes('https')) {
      window.open(song.BVID, '_blank');
    } else {
      setBVID(song.BVID);
      setPlayerModalShow(true);
      setPlayerModalSongName(song.song_name);
    }
  };

  // 自我介绍 off canvas 开关
  const handleShowIntro = () => setShowIntro(true);
  const handleCloseIntro = () => setShowIntro(false);

  return (
    <div className={styles.outerContainer}>
      <Link href={`https://live.bilibili.com/${config.BiliLiveRoomID}`} passHref>
        <a target="_blank" style={{ textDecoration: 'none', color: '#1D0C26' }}>
          <div className={styles.goToLiveDiv}>
            <div className={styles.cornerToggle}>
              <Image
                loader={imageLoader}
                src="assets/icon/bilibili_logo_padded.png"
                alt="去直播间"
                width={50}
                height={50}
              />
              <b><i>去直播间</i></b>
            </div>
          </div>
        </a>
      </Link>

      <div className={styles.outerContainer}>
        <div className={styles.selfIntroToggleDiv} onClick={handleShowIntro}>
          <div className={styles.cornerToggle}>
            <Image
              loader={imageLoader}
              src="assets/images/self_intro.webp"
              alt="打开相关链接"
              width={50}
              height={50}
            />
            <b><i>相关链接</i></b>
          </div>
        </div>
      </div>

      {!isPerformanceMode && <MusicNotes />}

      <Container>
        <Head>
          <title>{config.Name}的歌单</title>
          <meta name="keywords" content="B站,bilibili,哔哩哔哩,电台唱见,歌单" />
          <meta name="description" content={`${config.Name}的歌单`} />
          <link rel="icon" type="image/x-icon" href="/favicon.png" />
        </Head>

        <section className={styles.main}>
          {/** 头像和标题 */}
          <Row>
            <Banner songCount={MusicList.length} />
          </Row>

          <Row>
            {/** 性能模式单选框 */}
            <Row className="justify-content-end">
              <Col xs={12} md={12}>
                <div className="form-check form-switch">
                  <input
                    type="checkbox"
                    id="performance-mode-switch"
                    className="form-check-input"
                    checked={isPerformanceMode}
                    onChange={handlePerformanceModeToggle}
                  />
                  <label htmlFor="performance-mode-switch" className="form-check-label">
                    <span style={{ 
                      marginLeft: '-5px', 
                    }}>
                      性能模式：{isPerformanceMode ? '开' : '关'}
                    </span>
                  </label>
                </div>
              </Col>
            </Row>

            {/** 过滤器控件 */}
            <Col xs={12} md={12}>
              <SongListFilter
                categorySelection={categorySelection}
                setLanguageState={setLanguageState}
                setPaidState={setPaidState}
                setgenreState={setgenreState}
                favoriteSelection={favoriteSelection}
                setFavorState={setFavorState}
              />
            </Col>

            <Col xs={12} md={9}>
              <Form.Control
                className={styles.filters}
                type="search"
                aria-label="搜索"
                placeholder="搜索"
                onChange={(e) => setSearchBox(e.target.value)}
              />
            </Col>

            <Col xs={12} md={3}>
              <div className="d-grid">
                <Button
                  title="从下面的歌单里随机挑一首"
                  className={styles.RandomSongButton}
                  onClick={handleRandomSongWithFilter}
                >
                  随便听听
                </Button>
              </div>
            </Col>
          </Row>

          {/** 歌单表格 */}
          <PcSongListTable
            sortedSongList={sortedSongList}
            handleClickToCopy={handleClickToCopy}
            showBiliPlayer={showBiliPlayer}
            handleSort={handleSort}
            sortConfig={sortConfig}
            isPerformanceMode={isPerformanceMode}
          />

          <MobileSongListTable
            sortedSongList={sortedSongList}
            handleClickToCopy={handleClickToCopy}
            isPerformanceMode={isPerformanceMode}
          />
        </section>

        {showToTopButton && (
          <button
            onClick={scrollToTop}
            className={styles.backToTopBtn}
            title="返回顶部"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-chevron-up"
              viewBox="0 0 16 16"
            >
              <path
                fillRule="evenodd"
                d="M7.646 4.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1-.708.708L8 5.707l-5.646 5.647a.5.5 0 0 1-.708-.708l6-6z"
              />
            </svg>
          </button>
        )}

        <footer className={styles.footer}>
          <div>{config.Footer}</div>
          <div>Update Date: {config.UpdateDate}</div>
          <a
            href="https://beian.miit.gov.cn/"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: 'black',
              textDecoration: 'none',
              cursor: 'url("./assets/cursor/pointer.png"), pointer',
            }}
          >
            {config.ICP}
          </a>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
            <img 
              src="/assets/images/beian.png" 
              style={{ 
                display: 'inline-block',
                width: '20px',
              }}
            />
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: 'black',
                textDecoration: 'none',
                cursor: 'url("./assets/cursor/pointer.png"), pointer',
              }}
            >
              {config.beian}
            </a>
          </div>
        </footer>
      </Container>

      <Offcanvas show={showIntro} onHide={handleCloseIntro}>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>{config.Name}的自我介绍</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <BannerIntro />
        </Offcanvas.Body>
      </Offcanvas>

      <BiliPlayerModal
        show={modalPlayerShow}
        onHide={() => setPlayerModalShow(false)}
        bvid={BVID}
        modalPlayerSongName={modalPlayerSongName}
      />
    </div>
  );
}

console.log('你来偷看了对吧，对吧，对吧！');
console.log('那就快去关注糊涂蛋uni！');
console.log('有能力的也可以上个舰哦！');