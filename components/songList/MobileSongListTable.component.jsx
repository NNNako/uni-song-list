import React, { useState, useEffect, useRef } from 'react';
import { Container, Row } from 'react-bootstrap';
import MobileSongDetail from './MobileSongDetail.component'; // 确保路径正确
import styles from '../../styles/Home.module.css';
import { isEqual } from 'lodash';


const MobileSongListTable = React.memo(({ sortedSongList, handleClickToCopy, isPerformanceMode}) => {
  const [filterKey, setFilterKey] = useState(0);
  const prevSongListRef = useRef();

  useEffect(() => {
    if (isPerformanceMode) return;

    if (!isEqual(prevSongListRef.current, sortedSongList)) {
      setFilterKey((prevKey) => prevKey + 1);
    }
    prevSongListRef.current = sortedSongList;
  }, [sortedSongList, isPerformanceMode]);

  if (sortedSongList.length === 0) {
    return (
      <div className={`${styles.noSongInListMobile} display-6 text-center`}>
        歌单里没有诶~ 可以去直播间碰碰运气哦!
      </div>
    );
  }

  return (
    <div className={styles.mobileSongList}>
      <Container fluid className="p-0">
        <Row className="g-0">
          <div className="d-grid gap-2">
            <MobileSongDetail
              key={filterKey}
              filteredSongList={sortedSongList}
              handleClickToCopy={handleClickToCopy}
              isPerformanceMode={isPerformanceMode}
            />
          </div>
        </Row>
      </Container>
    </div>
  );
});

MobileSongListTable.displayName = 'MobileSongListTable'
export default MobileSongListTable;