import axios from 'axios';
// TODO: Look at switching to node-html-parser https://www.npmjs.com/package/node-html-parser
// import {DOMParser} from 'react-native-html-parser';
import {DOMParser} from './dom-parser/dom-parser';
import {REACT_APP_SEARCH_DOMAIN} from 'react-native-dotenv';

const DOMAIN = REACT_APP_SEARCH_DOMAIN || 'youtube';
const SEARCH_URL = `https://www.${DOMAIN}.com/?search=`;
const PROXY_URL = 'https://cors-anywhere.herokuapp.com/';

export default class HtmlParse {
  // search query
  search = null;

  // List of ids that will be pulled out of the parsed response
  videos = [];

  constructor(search) {
    this.search = search;
  }

  static async getUrl(id) {
    console.log(`About to request from ${PROXY_URL}https://www.${DOMAIN}.com/${id}`);
    const videoResponse = await axios.get(`${PROXY_URL}https://www.${DOMAIN}.com/${id}`, {
      headers: {'X-Requested-With': 'XMLHttpRequest'},
    });
    const urls = [...videoResponse.data.matchAll(/videoUrl":"(http.*?)"}/g)];
    // TODO: Dynamically switch to other video resolutions
    const videoUrl = urls[0][1].replace(/\\/g, '');
    console.log(`Received`, videoUrl);
    return videoUrl;
  }

  async parsePage() {
    console.log(`About to request from ${PROXY_URL + SEARCH_URL + this.search}`);
    const response = await axios.get(PROXY_URL + SEARCH_URL + this.search, {
      headers: {'X-Requested-With': 'XMLHttpRequest'},
    }); // not needed due to proxy , {headers: {'Access-Control-Allow-Origin': '*'}})
    const parser = new DOMParser({
      errorHandler: {warning: w => console.warn(w), error: e => console.error(e), fatalError: e => console.error(e)},
    });
    const doc = parser.parseFromString(response.data, 'text/html');
    const ulResults = Array.from(doc.getElementsByClassName('tm_video_block', false));
    if (!ulResults) {
      console.log('no results');
      return;
    }
    this.videos = [];
    for (const i of ulResults) {
      const newItem = {};
      newItem.id = i
        .getElementsByClassName('video_link', false)[0]
        .getAttribute('href')
        .replace(/\//g, '');
      newItem.title = i.querySelect('img')[0].getAttribute('alt');
      newItem.img = i.querySelect('img')[0].getAttribute('data-src');
      newItem.duration = i
        .getElementsByClassName('duration', false)[0]
        .textContent.replace(/\n/g, '')
        .replace(/\s+/g, ' ')
        .trim();
      this.videos.push(newItem);
      console.log(newItem);
    }
    // No idea, but seems like the page is always parsed bottom to top ¯\_(ಠ_ಠ)_/¯
    this.videos.reverse();
  }
}
