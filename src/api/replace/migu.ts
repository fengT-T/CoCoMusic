/**
 * Migu Api
 * from https://github.com/jsososo/MiguMusicApi
 */

import { baseRequest } from '../base-request'
import { ReplaceResource, resultfilter } from '../replace'

const headers = {
  Referer: ''
}

export async function search (title: string, singers: string[]): Promise<ReplaceResource> {
  headers.Referer = 'http://m.music.migu.cn/'
  let data

  try {
    const url = 'http://m.music.migu.cn/migu/remoting/scr_search_tag'
    const params = {
      keyword: '',
      pgc: 1,
      rows: 5,
      type: 2
    }
    params.keyword = title + ' ' + singers.join(' ')
    data = (await baseRequest.request({ url, headers, params })).data

    const { musics } = data
    for (const music of musics) {
      const { title: musicTitle, singerName, mp3, copyrightId: cid } = music
      if (resultfilter(title, singers, musicTitle, singerName.split(', '))) {
        return {
          id: cid,
          songUrl: mp3
        }
      }
    }
  } catch (e) {
    return { id: '', songUrl: '' }
  }

  return { id: '', songUrl: '' }
}

export async function getLyrics (id: string) {
  if (!id || id === '') {
    return ''
  }
  try {
    headers.Referer = 'http://music.migu.cn'
    const data = (await baseRequest.request({ url: `http://music.migu.cn/v3/api/music/audioPlayer/getLyric?copyrightId=${id}`, headers })).data
    return data.lyric
  } catch (e) {
    return ''
  }
}

export default {
  search, getLyrics
}
