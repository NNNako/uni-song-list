import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Col, Container, Row, Table } from 'react-bootstrap';
import PcSongDetail from './PcSongDetail.component';
import styles from '../../styles/Home.module.css';
import { isEqual } from 'lodash';

const COLUMN_WIDTHS = {
  index: '10%',
  songName: '22.5%',
  icon: '8%',
  artist: '19%',
  language: '12.5%',
  genre: '15.5%',
  remark: '12.5%',
};

const SortButton = ({ sortKey, sortConfig, handleSort }) => {
  const isActive = sortConfig.key === sortKey;
  const direction = isActive ? sortConfig.direction : null;
  const arrow = direction === 'asc' ? '↑' : direction === 'desc' ? '↓' : '↑↓';

  return (
    <button
      onClick={() => handleSort(sortKey)}
      style={{ marginLeft: '2px', border: 'none', background: 'none' }}
    >
      {isActive ? arrow : '↑↓'}
    </button>
  );
};

const PcSongListTable = React.memo(({ sortedSongList, handleClickToCopy, showBiliPlayer, handleSort, sortConfig, isPerformanceMode }) => {
  const [filterKey, setFilterKey] = useState(0);
  const prevSongListRef = useRef();

  useEffect(() => {
    if (isPerformanceMode) return;

    if (!isEqual(prevSongListRef.current, sortedSongList)) {
      setFilterKey((prevKey) => prevKey + 1);
    }
    prevSongListRef.current = sortedSongList;
  }, [sortedSongList, isPerformanceMode]);

  return (
    <div className={styles.pcSongList}>
      <Container fluid>
        <Table responsive style={{ width: '100%', tableLayout: 'fixed' }}>
          <thead>
            <tr>
              <th style={{ width: COLUMN_WIDTHS.index }}></th>
              <th style={{ width: COLUMN_WIDTHS.songName }}>
                歌名
                <SortButton sortKey="song_name" sortConfig={sortConfig} handleSort={handleSort} />
              </th>
              <th style={{ width: COLUMN_WIDTHS.icon }}></th>
              <th style={{ width: COLUMN_WIDTHS.artist }}>
                歌手
                <SortButton sortKey="artist" sortConfig={sortConfig} handleSort={handleSort} />
              </th>
              <th style={{ width: COLUMN_WIDTHS.language }}>语言</th>
              <th style={{ width: COLUMN_WIDTHS.genre }}>曲风</th>
              <th style={{ width: COLUMN_WIDTHS.remark }}>备注</th>
            </tr>
          </thead>
          <tbody>
            <PcSongDetail
              key={filterKey}
              filteredSongList={sortedSongList}
              handleClickToCopy={handleClickToCopy}
              showBiliPlayer={showBiliPlayer}
              isPerformanceMode={isPerformanceMode}
            />
          </tbody>
        </Table>
      </Container>
    </div>
  );
});

PcSongListTable.displayName = 'PcSongListTable'
export default PcSongListTable;