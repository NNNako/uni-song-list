import json
import pandas as pd
import urllib.request
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

song_list = []

def getSongListUrl():
    url = "https://www.kdocs.cn/api/office/file/ctsnBA8iQZ1c/download"
    try:
        req = urllib.request.Request(url, method="GET")
        resp = urllib.request.urlopen(req)
        jsonObjString = resp.read().decode('utf-8')
        jsonObj = json.loads(jsonObjString)
        return jsonObj["download_url"]
    except:
        print("Error obtaining song list URL")
        exit()

def updateSongList():
    url = getSongListUrl()
    try:
        urllib.request.urlretrieve(url, "uni_song.xlsx")
    except:
        print("Error retrieving the song list excel file")
        exit()


def parseSonglist():
    song_df = pd.read_excel('./uni_song.xlsx')
    song_df = song_df.where(pd.notnull(song_df),"")

    for index, row in song_df.iterrows():
        song_data = {
            "index": index,
            "song_name": str(row.iloc[0]),
            "artist": str(row.iloc[1]),
            "language": str(row.iloc[2]),
            "remarks": str(row.iloc[3]),
            "genre": str(row.iloc[4]),
            "sticky_top": row.iloc[5],
            "paid": row.iloc[6],
            "BVID": str(row.iloc[7]),
            "commandStr": str(row.iloc[8]),
        }

        if row.iloc[5] == 1:
            song_list.insert(0,song_data)
        else:
            song_list.append(song_data)

if __name__ == '__main__':
    updateSongList()
    parseSonglist()
    with open("../public/music_list.json", 'w') as f:
        f.write(json.dumps(song_list))
        logging.info("Successfully wrote song list to music_list.json")
