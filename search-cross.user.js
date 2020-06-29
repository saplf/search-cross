// ==UserScript==
// @name         Search Cross
// @namespace    https://github.com/saplf/search-cross
// @version      0.5
// @description  不同搜索引擎间的切换，自用
// @author       saplf
// @license      GPL-3.0
// @supportURL   https://github.com/saplf/search-cross
// @home-url     https://greasyfork.org/zh-CN/scripts/389989-search-cross
// @match        *://www.baidu.com/s?*
// @match        *://www.google.com/search?*
// @match        *://cn.bing.com/search?*
// @match        *://www.so.com/*
// @match        *://github.com/search?*
// @match        *://www.zhihu.com/search?*
// @match        *://search.bilibili.com/*
// @match        *://zh.wikipedia.org/wiki/*
// @note         2020.01.10-v0.3 修复github下样式问题
// @note         2020.06.29-v0.4 切换图标源，减小源码体积；添加中文维基
// @note         2020.06.29-v0.5 由于 Github 的安全策略，外部样式代码改由代码下载
// @grant        GM_addStyle
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_info
// @grant        GM_xmlhttpRequest
// @connect      at.alicdn.com
// @run-at       document-end
// ==/UserScript==

var config = {
    default: {
        position: 'left', // 'left' or 'right'
        height: 54,
        top: '120px',
        peekSize: 30,
        delayEnter: 120,
        delayLeave: 400,
        zIndex: 9999,
        triggleVer: '10px',
        triggleHor: '20px',
    },
    'www.google.com': {
        top: '140px',
    },
};

var engines = {
    'www.baidu.com': {
        name: '百度',
        icon: 'sc-baidu',
        url: 'https://www.baidu.com/s?wd={q}',
        match: /(?<=\Wwd=).*?(?=$|(?=&))/,
    },
    'www.google.com': {
        name: 'Google',
        icon: 'sc-google',
        url: 'https://www.google.com/search?q={q}',
        match: /(?<=\Wq=).*?(?=$|(?=&))/,
    },
    'cn.bing.com': {
        name: 'Bing',
        icon: 'sc-bing',
        url: 'https://cn.bing.com/search?q={q}',
        match: /(?<=\Wq=).*?(?=$|(?=&))/,
    },
    'www.so.com': {
        name: '360',
        icon: 'sc-360',
        url: 'https://www.so.com/s?q={q}',
        match: /(?<=\Wq=).*?(?=$|(?=&))/,
    },
    'github.com': {
        name: 'GitHub',
        icon: 'sc-github',
        url: 'https://github.com/search?q={q}',
        match: /(?<=\Wq=).*?(?=$|(?=&))/,
    },
    'www.zhihu.com': {
        name: '知乎',
        icon: 'sc-zhihu',
        url: 'https://www.zhihu.com/search?q={q}',
        match: /(?<=\Wq=).*?(?=$|(?=&))/,
    },
    'search.bilibili.com': {
        name: 'bilibili',
        icon: 'sc-bilibili',
        url: 'https://search.bilibili.com/all?keyword={q}',
        match: /(?<=\Wkeyword=).*?(?=$|(?=&))/,
    },
    'zh.wikipedia.org': {
        name: '维基中文',
        icon: 'sc-wiki',
        url: 'https://zh.wikipedia.org/wiki/{q}',
        match: /(?<=\Wwiki\/).*/,
    },
};

var configCached = GM_getValue('config', config);
GM_setValue('config', configCached);
var setting = Object.assign(config.default, configCached.default, configCached[location.host]);
// engines = GM_getValue('sites', engines);
// GM_setValue('sites', engines);

function appendStyles() {
    var isLeft = setting.position === 'left';
    var offsetSignal = isLeft ? '-' : '';
    GM_addStyle(`
#sc-panel {
  position: fixed;
  ${setting.position}: ${setting.peekSize}px;
  top: ${setting.top};
  padding: 0 20px 0 60px;
  transform: translate(${offsetSignal}100%, -50%);
  transition: all .2s;
  height: ${setting.height}px;
  border-radius: ${setting.height / 2}px;
  opacity: .6;
  background: red;
  z-index: ${setting.zIndex};

  display: flex;
  flex-direction: row;
  align-items: stretch;
}

#sc-panel.active {
  transform: translate(${offsetSignal}${setting.peekSize * 2}px, -50%);
  box-shadow: 0 0 10px rgba(255, 0, 0, .4);
  opacity: 1;
}

#sc-panel-triggle {
  position: absolute;
  left: -${isLeft ? 0 : setting.triggleHor};
  right: -${isLeft ? setting.triggleHor : 0};
  top: -${setting.triggleVer};
  bottom: -${setting.triggleVer};
  z-index: ${setting.zIndex - 1};
}

#sc-panel .sc-panel-item {
  position: relative;
  z-index: ${setting.zIndex + 1};
  color: white;
  font-size: 12px;
  box-sizing: content-box;

  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  transition: background .3s;
}

#sc-panel .sc-panel-item:hover {
  background: rgba(255, 255, 255, .2);
}

#sc-panel .scf {
  font-size: 2em;
  margin-bottom: 2px;
}
`);
}

function appendElement() {
    var body = document.body;
    if (!body) return;

    var panel = document.createElement('div');
    panel.id = 'sc-panel';
    // panel.className = 'active';

    // panel triggle
    var triggle = document.createElement('div');
    var timerEnter = null;
    var timerLeave = null;
    var funcEnter = () => addClassName(panel, 'active');
    var funcLeave = () => removeClassName(panel, 'active');
    triggle.id = 'sc-panel-triggle';
    panel.onmouseenter = () => {
        clearTimeout(timerLeave);
        timerEnter = setTimeout(funcEnter, setting.delayEnter);
    }
    panel.onmouseleave = () => {
        clearTimeout(timerEnter);
        timerLeave = setTimeout(funcLeave, setting.delayLeave);
    }
    panel.appendChild(triggle);

    // engines
    Object.entries(engines).forEach(entry => {
        var key = entry[0];
        if (key === location.host) return;
        var engine = entry[1];
        var ele = document.createElement('a');
        ele.className = 'sc-panel-item';
        ele.setAttribute('href', engine.url.replace(/\{q\}/, queryParam()));
        var iconI = document.createElement('i');
        iconI.className = 'scf ' + engine.icon;
        ele.appendChild(iconI);
        var name = document.createElement('span');
        name.innerText = engine.name;
        ele.appendChild(name);
        panel.appendChild(ele);
    });

    body.appendChild(panel);
}

function addClassName(ele, name) {
    var classes = (ele.className || '').split(' ').filter(it => it);
    if (!classes.includes(name)) {
        classes.push(name);
    }
    ele.className = classes.join(' ');
}

function removeClassName(ele, name) {
    var classes = (ele.className || '').split(' ').filter(it => it && it !== name);
    ele.className = classes.join(' ');
}

function queryParam() {
    var current = engines[location.host];
    if (!current) return '';
    return location.href.match(current.match)[0];
}

function appendExtraCss(url) {
    GM_xmlhttpRequest({
        method: 'GET',
        url: url,
        onload: (args) => {
            GM_addStyle(args.responseText);
        },
    });
}

(function() {
    'use strict';

    appendStyles();
    appendElement();
    appendExtraCss('//at.alicdn.com/t/font_1911184_h0w7n7n9yfk.css');
})();
