// ==UserScript==
// @name           Vk Media Downloader
// @name:en        Vk Media Downloader
// @description    Скачать музыку, видео с vk.com (ВКонтакте)
// @description:en Download music, video from vk.com (Vkontakte)
// @namespace      https://greasyfork.org/users/136230
// @include        *://vk.com/*
// @include        *://m.vk.com/*
// @include        *://*.vk-cdn.com/*
// @include        *://*.vk-cdn.net/*
// @include        *://*.userapi.com/*
// @include        *://*.vkuseraudio.net/*
// @include        *://*.vkuservideo.net/*
// @include        *://*.pladform.ru/*
// @include        *://*.mycdn.me/*
// @version        2.3.12
// @author         EisenStein
// @compatible     firefox
// @compatible     chrome
// @compatible     safari
// @compatible     opera
// @compatible     edge
// @connect        vk.com
// @connect        vk-cdn.com
// @connect        vk-cdn.net
// @connect        userapi.com
// @connect        vkuseraudio.net
// @connect        vkuservideo.net
// @connect        mycdn.me
// @connect        pladform.ru
// @connect        rutube.ru
// @run-at         document-start
// @grant          unsafeWindow
// @grant          GM.xmlHttpRequest
// @grant          GM_xmlhttpRequest
// @grant          GM_download
// @grant          GM_info
// @grant          GM_setValue
// @grant          GM_getValue
// @grant          GM_deleteValue
// @grant          GM_listValues
// @grant          GM_notification
// @require        https://greasemonkey.github.io/gm4-polyfill/gm4-polyfill.js
// @grant          GM.setValue
// @grant          GM.getValue
// @grant          GM.deleteValue
// @grant          GM.listValues
// @require        https://greasyfork.org/scripts/391148/code/script.user.js?version=804805
// @require        https://greasyfork.org/scripts/391452/code/script.user.js?version=742854
// ==/UserScript==

// @require        https://code.jquery.com/jquery-3.3.1.min.js
// @require        https://code.jquery.com/ui/1.12.1/jquery-ui.min.js
// @require        https://cdn.jsdelivr.net/npm/hls.js@latest
// @require        https://cdn.jsdelivr.net/npm/url-toolkit@2
// @require        https://cdn.jsdelivr.net/npm/jszip/dist/jszip.min.js

/*
 * > v2.3.13 - 2020.07.01
 *   fix encoding
 * > v2.3.11 - 2020.06.22
 *   handle new response format for videos
 * > v2.3.10 - 2020.06.12
 *   handle size request error
 * > v2.3.9 - 2020.06.12
 *   simplify batch scripts
 *   disable addToDomainList method
 * > v2.3.8 - 2020.05.23
 *   fallback to m3u8 downloading if mp3 size does not match m3u8 size
 * > v2.3.7 - 2020.05.13
 *   new hack for mp3 downloading - convert m3u8 link to mp3 link (thanks askornot, https://greasyfork.org/ru/users/320573)
 *   update max duration for hls to 10 hours
 *   update max size for hls to 2 GiB
 *   add new user option "try mp3 from m3u8" - create mp3 link from m3u8 link
 * > v2.3.6 - 2020.04.29
 *   filename for some cases
 * > v2.3.5 - 2020.04.08
 *   add media filename into "filename.txt"
 * > v2.3.4 - 2019.11.25
 *   download audio on audio tooltip click
 * > v2.3.3 - 2019.11.19
 *   fix audio hash extractor
 * > v2.3.2 - 2019.11.17
 *   add support for mobile version of vk.com
 *   fix menu animation
 *   add vkmd button to left side bar
 * > v2.3.1 - 2019.11.03
 *   disable cache for checking updates request
 * > v2.3.0 - 2019.10.30
 *   add Pladform videos downloader
 * > v2.2.5 - 2019.10.29
 *   better style for user settings modal
 * > v2.2.4 - 2019.10.27
 *   add referer header for gm request api
 *   update version checker
 * > v2.2.3 - 2019.10.26
 *   add notifications of new versions
 *   add 'disable noisy notifications' option
 * > v2.2.2 - 2019.10.22
 *   handle "network error" at queue loader - repeat request 3-5 times untill successfull request
 *   fix live update of global variables (HLS_MAX_DURATION, HLS_MAX_SIZE, DOWNLOAD_TS, etc.)
 * > v2.2.1 - 2019.10.18
 *   add new option: 'hide vkmd from top left'
 *   add VkMD button to top-right profile menu
 * > v2.2.0 - 2019.10.15
 *   add User Settings modal
 * > v2.1.29 - 2019.10.14
 *   update global variables
 * > v2.1.28 - 2019.10.13
 *   fix responseType issue
 * > v2.1.27 - 2019.10.05
 *   replace $ with jQuery
 *   fix logger's serializer
 * > v2.1.26 - 2019.10.03
 *   fix logger for binary data
 * > v2.1.25 - 2019.09.30
 *   fix video API handler
 *   fix audio id parser
 * > v2.1.24 - 2019.09.29
 *   fix mp4 generator batch script
 * > v2.1.23 - 2019.09.28
 *   avoid usage of GM_xmlhttpRequest for Violentmonkey users,
 *     the reason is that VM does not allow to set custom User-Agent header,
 *     even if documentation says opposite
 *     P.S. I hardly recommend not to use VM, use GM or TM instead
 *   update logger - press Shift+S to save logs
 *   handle progress for GM_download
 *   fix race condition on audio request
 * > v2.1.22 - 2019.09.27
 *   handle new Vk API
 *   enable GM4 polyfill
 * > v2.1.21 - 2019.09.25
 *   fix function context
 *   handle buggy GM API
 * > v2.1.20 - 2019.05.17
 *   fix video id getting
 *   handle GM_download error
 * > v2.1.19 - 2019.05.14
 *   improved mutation observer for videos
 *   make script faster by using GreaseMonkey API
 * > v2.1.18 - 2019.05.12
 *   fix css for video tooltip
 *   fix hls source url
 *   add logger for keydown (32)
 *   minor changes
 * > v2.1.17 - 2019.05.11
 *   toggle debug mode off
 * > v2.1.16 - 2019.05.11
 *   added magic user-agent header =D
 * > v2.1.15 - 2019.05.10
 *   load inline scripts
 * > v2.1.14 - 2019.05.10
 *   make audio data load before tooltip open
 * > v2.1.13 - 2019.05.01
 *   try to fix audio tooltip activation for some browser configurations
 *   added extra logger to tooltip
 * > v2.1.12 - 2019.04.28
 *   added logger for audio tooltip
 * > v2.1.11
 *   minor changes in logger
 * > v2.1.10
 *   fix jquery-ui-css loader
 * > v2.1.9
 *   update *.ts concatenation scripts (UPD. HLS_MAX_DURATION = 3 hours, HLS_MAX_SIZE = 1 GB)
 * > v2.1.8
 *   handle errors on audio fetching
 * > v2.1.7
 *   HLS_MAX_DURATION = 40 mins
 *   maximum active queues = 10
 *   reduced *.ts filenames
 *   additional logger instances (.audio - 4, .ajax - 8)
 * > v2.1.6
 *   hotfix: shorten *.ts source folder name and file names, reason: "generate.mpN.bat" script can't handle long strings
 *   insert carriage return (CR) character before line feed (LF) to README.txt file for Windows users
 * > v2.1.5
 *   fixed ms edge error
 * > v2.1.4
 *   enabled hls video downloading as *ts fragments
 * > v2.1.3
 *   fixed mp3 audio filename generator
 * > v2.1.2
 *   changed audio filename format to "%artist% - %name%"
 * > v2.1.1
 *   added README.txt
 * > v2.1.0
 * Important updates:
 * + added downloader of *.ts files archived into *.zip file:
 *   - source/
 *     - stream.001.ts
 *     - stream.002.ts
 *     - ...
 *   - generate.mp3.bat
 *   - generate.mp3.sh
 * + Why is this update needed?
 *   you may have noticed that some *.mp3 media contain sound distortions,
 *     so in a new version v2.1.0 I have added *.ts downloader for further concatenation of the *.ts files into a single *.mp3 file by using ffmpeg,
 *     such *.mp3 files have clear sound without distortions
 * + How to concatenate *.ts files into a single *.mp3
 *   install ffmpeg (google helps you)
 *   run generate.mp3.[bat|sh] (bat - Windows, sh - Linux, MacOs) script
 * + to disable *.zip downloader feature just set "DOWNLOAD_TS = false" - and you will directly download *.mp3 files,
 *     but be aware that such *.mp3 files may contain sound distortions
 */
 
(async function(window, WINDOW, undefined){
    'use strict';
    const str = '===============================================';
    console.log(['VK_MEDIA_DOWNLOADER START', str].join('\n'));
    const { hostname, pathname } = self.location;
    const SCRIPT_VERSION = typeof GM_info !== 'undefined' ? `v${GM_info.script.version}` : 'v2.3.12';
    console.log('vkmd.. (', SCRIPT_VERSION, ')', hostname + pathname, top === self ? 'top' : 'child');
    // 0 - no log, 1 - switch on .log, 2 - switch on .out, 4 - switch on .audio, 8 - .ajax, 16 - .att, 32 - .keydown
    const DEBUG = 0; // e.i 7 = (1 + 2 + 4) = (.log + .out + .audio) logs
    const LOGGER = new Logger();
    const TEXTAREA = document.createElement('textarea');
    const LINK = document.createElement('a');
    const DOMAIN_LIST = ['vk.com', 'vk-cdn.com', 'vk-cdn.net', 'userapi.com', 'vkuseraudio.net', 'vkuservideo.net', 'pladform.ru', 'rutube.ru', 'mycdn.me'];
    const MASTER_PLAYLIST_REGEX = /#EXT-X-STREAM-INF:([^\n\r]*)[\r\n]+([^\r\n]+)/g;
    const DECIMAL_RESOLUTION_REGEX = /^(\d+)x(\d+)$/;
    const ATTR_LIST_REGEX = /\s*(.+?)\s*=((?:\".*?\")|.*?)(?:,|$)/g;
    const SOURCE_EXTENSION_REGEX = /\.([a-z\-0-9]+)$/;
    const ALPHANUM = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890';
    const STORAGE_KEY = 'vk-domains';
    const SCRIPT_NAME = typeof GM_info !== 'undefined' ? GM_info.script.name : 'Vk Media Downloader';
    const HLS_MAX_SIZE = 1 * 1024 * 1024 * 1024; // 1 GB
    const HLS_MAX_DURATION = 3 * 60 * 60; // 3 hours
    const TRY_MP3_FROM_M3U8 = true;
    /**
     * DOWNLOAD_TS
     *
     * m3u8 file option
     * true  :=> download *.ts fragments of m3u8 file and pack them into *.zip (use generate.mp3.[bat|sh] script to concatenate *.ts fragments to a single mp3 file)
     * false :=> (highly not recommended, not compatible with videos) convert m3u8 file to *.mp3 directly by using HLS library (BE AWARE! such audios may contain sound distortions!)
     */
    const DOWNLOAD_TS = true;
    const MP2T_SIZE_FACTOR = 0.97;
    const JS_INLINE = true; // load js as inline script or as a blob
    const USE_CUSTOM_UA = false; // whether or not change User-Agent header in audio requests
    const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/64.0.3282.140 Safari/537.36 Edge/17.17134';
    const SCRIPT_HANDLER = typeof GM_info !== 'undefined' ? (GM_info.scriptHandler || '').toLowerCase() : null;
    const LOG_WITH_CONSOLE = false;
    const SCRIPTS = {
        'jquery-js': {
            url: 'https://code.jquery.com/jquery-3.3.1.min.js',
            id: 'jquery-js',
            name: 'jQuery',
            get val() { return window[this.name]; },
        },
        'jquery-ui-js': {
            id: 'jquery-ui-js',
            url: 'https://code.jquery.com/ui/1.12.1/jquery-ui.min.js',
            name: 'jQuery.ui',
            get val(){
                return window.jQuery ? window.jQuery.ui : undefined;
            },
        },
        'hls-js': {
            id: 'hls-js',
            url: 'https://cdn.jsdelivr.net/npm/hls.js@latest',
            name: 'Hls',
            get val() { return window[this.name]; },
        },
        'url-toolkit-js': {
            id: 'url-toolkit-js',
            url: 'https://cdn.jsdelivr.net/npm/url-toolkit@2',
            name: 'URLToolkit',
            get val() { return window[this.name]; },
        },
        'jszip-js': {
            id: 'jszip-js',
            url: 'https://cdn.jsdelivr.net/npm/jszip/dist/jszip.min.js',
            name: 'JSZip',
            get val() { return window[this.name]; },
        },
    };
    const global = {
        SCRIPT_NAME,
        SCRIPT_VERSION,
        SCRIPT_HANDLER,
        DEBUG,
        LOGGER,
        HLS_MAX_DURATION,
        HLS_MAX_SIZE,
        DOWNLOAD_TS,
        MP2T_SIZE_FACTOR,
        JS_INLINE,
        USE_CUSTOM_UA,
        USER_AGENT,
        LOG_WITH_CONSOLE,
        TRY_MP3_FROM_M3U8,
    };
    const MEDIA_LIST = {
        audio: {},
        video: {},
    };
    const DICTIONARY = {
        lang: null,
        intl: function(key, defaultValue) {
            const translation = this[key];
            return translation && translation[this.lang] || defaultValue;
        },
        loading: {
            ru: 'Загрузка..',
            en: 'Loading..',
        },
        fileSize: {
            ru: 'Размер',
            en: 'Size',
        },
        fileExtension: {
            ru: 'Тип',
            en: 'Extension',
        },
        downloadVideoTitle: {
            ru: 'Скачать видеозапись',
            en: 'Download video',
        },
        downloadAudioTitle: {
            ru: 'Скачать аудиозапись',
            en: 'Download audio',
        },
        audioNotFound: {
            ru: 'Аудиозапись не найдена',
            en: 'Audio not found',
        },
        videoNotFound: {
            ru: 'Видеозапись не найдена',
            en: 'Video not found',
        },
        domainWarning: {
            ru: 'ВНИМАНИЕ: обнаружен домен, отсутствующий в списке включений',
            en: 'WARNING: domain not found in the include list',
        },
        domainName: {
            ru: 'Название домена',
            en: 'Domain',
        },
        domainInstruction: {
            ru: 'Для правильной работы скрипта необходимо добавить его в список включений',
            en: 'For the script to work correctly, you need to add it to the include list',
        },
        domainMessage: {
            ru: 'Больше не показывать это сообщение',
            en: 'Do not show this message again'
        },
        firstLoadInstruction: {
            ru: 'Кликните на кнопку "VkMD" в левом верхнем углу, чтобы открыть модалку с пользовательскими настройками',
            en: 'Click on "VkMD" button on top-left corner to open User Settings modal',
        },
    };

    let AUDIO_LIST;
    let VIDEO_LIST;
    let CHANNEL_LIST;
    let DOWNLOADER;
    let OS_NAME;

    function serialize(val, ...args) {
        if (val instanceof HTMLElement) {
            try {
                val = node2json.call(val);
            } catch (e) {
                val = 'node2json-error';
            }
        }
        if (val instanceof Window) {
            val = parseWindow(val);
        }
        if (isArrayBuffer(val)) {
            try {
                val = `array buffer object (${val.byteLength} bytes)`;
            } catch (e) {
                val = 'array buffer object';
            }
        }
        if (val instanceof Error) {
            try {
                const { name, message } = val;
                val = { name, message };
            } catch (e) {
                val = val.message;
            }
        }
        switch (typeof val) {
            case 'undefined':
            case 'null':
                return '';
            case 'string':
            case 'number':
            case 'boolean':
            case 'bool':
                return val;
            case 'object':
            case 'array':
                try {
                    return JSON.stringify(val, ...args);
                } catch (er) {
                    return 'cyclic-object';
                }
            default:
                return val && typeof val.toString === 'function' ? val.toString() : '';
        }
    }
    function parseWindow(win) {
        const { self, top, parent, opener } = window;
        const obj = {};
        obj.type = 'window';
        obj.isTop = win === top;
        obj.isSelf = win === self;
        obj.isOpener = win === opener;
        try {
            obj.href = win.location.href;
        } catch (e) { }
        if (!obj.isSelf) {
            obj.ownerHref = window.location.href;
        }
        return obj;
    }
    function Logger() {
        const list = [];
        const slice = Array.prototype.slice;
        this.save = function() {
            if (!list.length) {
                return;
            }
            const lines = list.map(function(args){
                const date = new Date(args[0]);
                let s = date.toISOString();
                for (let i = 1; i < args.length; ++i) {
                    s += ' ' + serialize(args[i], null, 2);
                }
                return s;
            });
            list.length = 0;
            const timestamp = Math.floor(Date.now() / 1000);
            const filename = 'vkmd-logs-' + timestamp + (top === self ? '' : ('-' + hostname)) + '.txt';
            saveTextFile(lines, filename);
        };
        this.create = function(type, withConsole = false) {
            return function(){
                const args = [Date.now(), type, ...slice.call(arguments), '\r\n'];
                list.push(args);
                if (withConsole) {
                    if (console[type]) {
                        console[type].apply(console, arguments);
                    } else {
                        console.log.apply(console, arguments);
                    }
                }
            };
        };
    };

    LOGGER.log = (DEBUG & 1) ? LOGGER.create('log', global.LOG_WITH_CONSOLE) : function(){};
    LOGGER.out = (DEBUG & 2) ? LOGGER.create('out', global.LOG_WITH_CONSOLE) : function(){};
    LOGGER.audio = (DEBUG & 4) ? LOGGER.create('audio', global.LOG_WITH_CONSOLE) : function(){};
    LOGGER.ajax = (DEBUG & 8) ? LOGGER.create('ajax', global.LOG_WITH_CONSOLE) : function(){};
	LOGGER.att = (DEBUG & 16) ? LOGGER.create('att', global.LOG_WITH_CONSOLE) : function(){}; // audio tooltip
	LOGGER.keydown = (DEBUG & 32) ? LOGGER.create('keydown', global.LOG_WITH_CONSOLE) : function(){}; // mouse keydown events
    LOGGER.info = LOGGER.create('info', true);
    LOGGER.warn = LOGGER.create('warn', true);
    LOGGER.error = LOGGER.create('error', true);

    const userOptions = await WINDOW.createData(global);
    console.log('[+] userOptions.formatedData: ', JSON.stringify(userOptions.formatedData, null, 2));
    try {
        DICTIONARY.lang = (navigator.language || navigator.userLanguage).match(/^([a-zA-Z]+)/)[1],
        DICTIONARY.lang = (DICTIONARY.lang || '').toLowerCase();
    } catch (error) {
        LOGGER.warn('[-] failed to define default language');
    }
    if (userOptions.firstLoad) {
        WINDOW.GM_notification({
            title: `${SCRIPT_NAME} ${SCRIPT_VERSION}`,
            text: DICTIONARY.intl('firstLoadInstruction'),
            timeout: 10e3,
        });
    }

    LOGGER.log('[+] vkmd ', SCRIPT_VERSION, SCRIPT_HANDLER, hostname + pathname, top === self ? 'top' : 'child');
    LOGGER.log('[+] language: ', DICTIONARY.lang);

    LOGGER.log('[+] configuration: ', {
        DEBUG,
        DOMAIN_LIST,
        STORAGE_KEY,
        SCRIPT_NAME,
        HLS_MAX_SIZE: global.HLS_MAX_SIZE,
        HLS_MAX_DURATION: global.HLS_MAX_DURATION,
        DOWNLOAD_TS: global.DOWNLOAD_TS,
        JS_INLINE: global.JS_INLINE,
        USE_CUSTOM_UA: global.USE_CUSTOM_UA,
        USER_AGENT,
        SCRIPT_HANDLER,
        MP2T_SIZE_FACTOR,
        LOG_WITH_CONSOLE: global.LOG_WITH_CONSOLE,
        NATIVE_UA: navigator.userAgent,
        TRY_MP3_FROM_M3U8: global.TRY_MP3_FROM_M3U8,
    });
    window.addEventListener('keydown', function(e){
        const code = e.which || e.keyCode;
        const c = String.fromCharCode(code);
        if (e.shiftKey && c.toLowerCase() === 's') {
            if (typeof LOGGER.save === 'function') {
                LOGGER.save();
            }
            if (typeof CHANNEL_LIST.saveLogs === 'function') {
                CHANNEL_LIST.saveLogs();
            }
        }
    });

    LOGGER.out('[+] startMediaObserver');
    async function startMediaObserver() {
        const MutationObserver = window.MutationObserver || window.WebKitMutationObserver;
        const containClass = function(element, classname) {
            return element && element.classList.contains(classname);
        }
        const hasClass = function(element, ...classes) {
            let retval = 0;
            for (const c of classes) {
                retval += containClass(element, c);
            }
            return !!retval;
        };
        const activateNode = async function (node) {
            const date = new Date();
            const args = [+date, date.toISOString()];
            if (hasClass(node, 'audio_row__actions', '_audio_row__actions')) {
                LOGGER.log('[+] MutationObserver() -> .audio_row__actions', ...args);
                audioRow(node);
            } else if (hasClass(node, 'video_item', '_video_item')) {
                LOGGER.log('[+] MutationObserver() -> .video_item', ...args);
                videoItem(node);
            } else if (hasClass(node, 'mv_playlist')) {
                LOGGER.log('[+] MutationObserver() -> .mv_playlist', ...args);
                mvPlaylist(node);
            } else if (hasClass(node, 'mv_info_narrow_column')) {
                LOGGER.log('[+] MutationObserver() -> .mv_info_narrow_column', ...args);
                mvRecom(node);
            } else if (hasClass(node, 'video_box_wrap') || node.id === 'video_player') {
                if (node.id === 'video_player') {
                    LOGGER.log('[+] MutationObserver() -> #video_player', ...args);
                } else {
                    LOGGER.log('[+] MutationObserver() -> .video_box_wrap', ...args);
                }
                videoBox(node);
            } else if (hasClass(node, 'inline_video_wrap') || (node.id || '').indexOf('wrap') === 0) {
                await delay(200);
                const nodes = jQuery('.video_item, .mv_playlist, .mv_info_narrow_column, .video_box_wrap, #video_player', node);
                if (nodes) {
                    jQuery.makeArray(nodes).forEach(activateNode);
                }
            } else if (node.tagName === 'DIV' && !node.classList.contains('video_thumb_action_download')){
                // LOGGER.log('[+] MutationObserver() -> unhandled node: ', node);
            }
        };
        const nodeError = function (error) {
            LOGGER.error('[-] activateNode() -> error:', error);
        }
        const observer = new MutationObserver(function(mutations) {
            for (const mutation of mutations) {
                const { addedNodes = [] } = mutation;
                let st = 0;
                for (const node of addedNodes) {
                    if (node.nodeType === 1) {
                        activateNode(node).catch(nodeError);
                    }
                }
            }
        });
        activateNodes();
        await readyPromise();
        LOGGER.log('______________________')
        LOGGER.log('[+] startMediaObserver()');
        observer.observe(jQuery('body')[0], {
            childList: true,
            subtree: true,
        });
    }
    function node2json() {
        if (!this.__top) {
            this.__top = this;
            this.__classes = ['video_item', 'mv_playlist', 'mv_info_narrow_column', 'video_box_wrap'];
        }
        const self = this;
        const children = Array.prototype.slice.call(this.children);
        const attributes = Array.prototype.slice.call(this.attributes);
        const retval = {};
        retval.tagName = this.tagName;
        for (const { name, value } of attributes) {
            retval[name] = value;
        }
        retval.children = [];
        for (const child of children) {
            child.__top = this.__top;
            child.toJSON = node2json;
            retval.children.push(child);
        }
        if (!this.children.length) {
            delete retval.children;
            if (this.tagName !== 'SCRIPT') {
                retval.innerText = this.innerText;
            }
        }
        return retval;
    }
    LOGGER.out('[+] activateNodes');
    async function activateNodes() {
        await readyPromise();
        const arow = jQuery('.audio_row__actions').each(function(index, node){audioRow(node);});
        const vitem = jQuery('.video_item').each(function(index, node){ videoItem(node); });
        const mplist = jQuery('.mv_playlist').each(function(index, node){ mvPlaylist(node); });
        const mrecom = jQuery('.mv_info_narrow_column').each(function(index, node){ mvRecom(node); });
        const vbox = jQuery('.video_box_wrap').each(function(index, node){ videoBox(node); });
        LOGGER.log('_________________________\n');
        LOGGER.log('[+] mv_info_narrow_column:', mrecom.length);
        LOGGER.log('[+] mv_playlist          :', mplist.length);
        LOGGER.log('[+] video_item           :', vitem.length);
        LOGGER.log('[+] video_box            :', vbox.length);
        LOGGER.log('[+] audio_row            :', arow.length);
    }
    LOGGER.out('[+] audioRow');
    function audioRow(node) {
        if (jQuery(node).attr('data-status') === 'activated') {
            return;
        }
        const classList = 'audio_row__action _audio_row__action audio_row__download';
        const title = DICTIONARY.intl('downloadAudioTitle');
        jQuery('<button class="' + classList + '" title="' + title + '"></button>')
        .attr('data-media', 'audio')
        .appendTo(node)
        .on('mouseenter', async function(e) {
            const [audio] = jQuery(e.target).parents('.audio_row');
			LOGGER.att('[+] audioRow.onmouseenter() -> .audio_row: ', audio);
            AUDIO_LIST.currentId = jQuery(audio).attr('data-full-id');
			LOGGER.att('[+] audioRow.onmouseenter() -> .audio_row.data-full-id: ', AUDIO_LIST.currentId);
            try {
            const fullId = AUDIO_LIST.currentId;
            const id = getAudioId(null, audio);
            const data = AUDIO_LIST.list[fullId];
            let promise = Promise.resolve();
            if (!data) {
                promise = AUDIO_LIST.get([id]);
            }
            promise.then(function(){
                LOGGER.att('[+] audioRow.onmouseenter() -> .audio_row[data-full-id]: ', AUDIO_LIST.list[fullId]);
                LOGGER.att('[+] audioRow.onmouseenter() -> .audio_row list: ', AUDIO_LIST.list);
            }).catch(function(err) {
                LOGGER.error('[-] audioRow.onmouseenter() -> AUDIO_LIST.get() error: ', err);
            });
            } catch (err) {
                LOGGER.error('[-] audioRow.onmouseenter() -> error: ', err);
            }
            if (jQuery(audio).attr('tooltip-state') !== 'ready') {
                makeAudioTooltip(audio);
                jQuery(audio).attr('tooltip-state', 'ready');
            }
        })
        .on('click', audioIconClick);
        jQuery(node).attr('data-status', 'activated');
    }
    LOGGER.out('[+] videoItem');
    function videoItem(node) {
        if (jQuery(node).attr('data-status') === 'activated') {
            return;
        }
        const title = DICTIONARY.intl('downloadVideoTitle');
        node.classList.add('video_can_download');
        const dataId = jQuery(node).attr('data-id');
        if (!dataId) {
            LOGGER.warn('[-] videoItem() -> video is not found, node: ', node, ', parentNode: ', node.parentNode);
        }
        const $actions = jQuery('.video_thumb_actions', node);
        let flag = 0;
        jQuery('<div id="download" class="video_thumb_action_download"><div class="icon icon_download" title="' + title + '"></div></div>')
        .attr('data-id', dataId)
        .attr('data-media', 'video')
        .appendTo($actions)
        .on('mouseenter', function(e){
            VIDEO_LIST.currentId = dataId;
            if (!flag++) {
                makeVideoTooltip(node);
            }
        })
        .on('click', videoIconClick);
        jQuery(node).attr('data-status', 'activated');
    }
    LOGGER.out('[+] mvPlaylist');
    function mvPlaylist(node) {
        if (jQuery(node).attr('data-status') === 'activated') {
            return;
        }
        const title = DICTIONARY.intl('downloadVideoTitle');
        jQuery('.mv_playlist_item_thumb', node)
        .each(function(index, element) {
            const dataId = jQuery(element).parent().attr('data-vid');
            if (!dataId) {
                LOGGER.warn('[-] mvPlaylist() -> video id not found, node: ', node, ', parentNode: ', node.parentNode);
            }
            let flag = 0;
            jQuery('<div class="mv_playlist_item_download"></div>')
            .attr('data-id', dataId)
            .attr('data-media', 'video')
            .attr('title', title)
            .appendTo(element)
            .on('mouseenter', function(){
                VIDEO_LIST.currentId = dataId;
                if (!flag++) {
                    makeVideoTooltip(node);
                }
            })
            .on('click', videoIconClick);
        });
        jQuery(node).attr('data-status', 'activated');
    }
    LOGGER.out('[+] mvRecom');
    function mvRecom(node) {
        if (jQuery(node).attr('data-status') === 'activated') {
            return;
        }
        const title = DICTIONARY.intl('downloadVideoTitle');
        jQuery('.mv_recom_item_thumb', node)
        .each(function(index, element) {
            const dataId = element.pathname.replace('/video', '');
            if (!dataId) {
                LOGGER.warn('[-] mvRecom() -> video id not found, node: ', node, ', parentNode: ', node.parentNode);
            }
            let flag = 0;
            jQuery('<div class="mv_recom_item_download"></div>')
            .attr('data-id', dataId)
            .attr('data-media', 'video')
            .attr('title', title)
            .appendTo(element)
            .on('mouseenter', function(){
                VIDEO_LIST.currentId = dataId;
                if (!flag++) {
                    makeVideoTooltip(node);
                }
            })
            .on('click', videoIconClick);
        });
        jQuery(node).attr('data-status', 'activated');
    }
    LOGGER.out('[+] videoBox');
    function videoBox(node) {
        if (jQuery(node).attr('data-status') === 'activated') {
            return;
        }
        const $controls = jQuery('.videoplayer_controls', node);
        if ($controls.length && !jQuery('.videoplayer_btn_download', $controls).length) {
            const [fullscreen] = jQuery('.videoplayer_btn_fullscreen', $controls);
            if (!fullscreen) {
                LOGGER.warn('[+] videoBox() -> warning: fullscreen btn not found at', $controls[0]);
                return;
            }
            let dataId;
            try {
                dataId = jQuery(node).parent().attr('id').replace('video_box_wrap', '');
            } catch (err) {
                dataId = jQuery(node).attr('id').replace('video_box_wrap', '');
            }
            if (!dataId) {
                LOGGER.warn('[-] videoBox() -> video id not found, node: ', node, ', parentNode: ', node.parentNode);
            }
            const classList = 'videoplayer_controls_item videoplayer_btn videoplayer_btn_download';
            let flag = 0;
            jQuery('<div class="' + classList + '" role="button" tabindex="0"></div>')
            .attr('data-id', dataId)
            .attr('data-media', 'video')
            .appendTo($controls)
            .insertBefore(fullscreen)
            .on('mouseenter', function(){
                VIDEO_LIST.currentId = dataId;
                if (!flag++) {
                    makeVideoTooltip($controls[0]);
                }
            })
            .on('click', videoIconClick);
            jQuery(node).attr('data-status', 'activated');
        }
    }
    LOGGER.out('[+] videoIconClick');
    function videoIconClick(e) {
        LOGGER.log('[+] videoIconClick()');
        e.stopPropagation();
        e.preventDefault();
    }
    LOGGER.out('[+] audioIconClick');
    function audioIconClick(e) {
        LOGGER.log('[+] audioIconClick()');
        e.stopPropagation();
        e.preventDefault();
        const { currentId: id = null } = AUDIO_LIST;
        AUDIO_LIST.download(id);
    }
    //-------------------------------------------------------------------------//
    LOGGER.out('[+] loadScript');
    async function loadScript(url, id, rnd = random()) {
        LOGGER.log('[+] loadScript() -> loading js (id = ' + id + '):', url);
        let js = id ? SCRIPTS[id] : null;
        if (!js) {
            LOGGER.warn('[+] loadScript() -> warning: script (id = ' + id + ') not found in SCRIPT list');
            js = SCRIPTS[id] = {};
        } else if (js.loaded || js.data) {
            LOGGER.warn('[-] loadScript() -> warning: script (id = ' + id + ') is already loaded');
            return id;
        }
        const { response } = await makeRequest({ url });
        const type = 'text/javascript';
        js.data = response;
        const script = document.createElement('script');
        script.id = id + '-' + rnd;
        script.setAttribute('type', type);
        script.setAttribute('data-id', id);
        const handler = {};
        const promise = new Promise(function(resolve, reject) {
            handler.resolve = resolve;
            handler.reject = reject;
        });
        const onload = function() {
            js.loaded = true;
            LOGGER.log('[+] loadScript() ----> loaded <----', id, js.val);
            handler.resolve(id);
        };
        if (global.JS_INLINE) {
            script.innerHTML = response;
            LOGGER.log('[+] loadScript() -> inline (id = ' + id + ')');
        } else {
            js.blob = new Blob([response], { type });
            LOGGER.log('[+] loadScript() -> blob (id = ' + id + '):', js.blob);
            js.resource = URL.createObjectURL(js.blob);
            script.src = js.resource;
        }
        await readyPromise();
        const { head = document.querySelector('head') } = document;
        const scripts = head.querySelectorAll('script');
        head.insertBefore(script, scripts[0]);
        LOGGER.log('[+] loadScript() -> script: ', script);
        if (js.val) {
            onload();
        } else {
            script.addEventListener('load', onload);
        }
        script.addEventListener('error', handler.reject);
        return promise;
    }
    LOGGER.out('[+] loadCss');
    async function loadCss(url) {
        const { response } = await makeRequest({ url });
        const { head = document.querySelector('head') } = document;
        const elm = document.createElement('style');
        elm.setAttribute('class', 'jquery-ui-css');
        elm.setAttribute('type', 'text/css');
        elm.innerHTML = response;
        head.appendChild(elm);
    }
    //-------------------------------------------------------------------------//
    //-------------------------------- CHANNEL --------------------------------//
    //-------------------------------------------------------------------------//
    LOGGER.out('[+] Channel');
    function Channel(target, targetOrigin) {
        const that = this;
        this.name = 'Channel';
        this.listeners = {};
        this.target = target;
        this.targetOrigin = targetOrigin;
        this.id = random(10);
        this.url = window.location.href;
        this.origin = window.location.origin;
        this.mainListener = async function(e){
            if (that.targetOrigin && e.origin !== that.targetOrigin) {
                return;
            }
            const { _ready } = that;
            if ((e.source !== that.target && _ready) || typeof e.data !== 'object') {
                return;
            }
            const { type } = e.data;
            if (type !== 'request') {
                return;
            }
            const { method, messageId = null, params } = e.data;
            const { id: targetId } = params;
            if (method !== 'ping' && method !== 'pong' && targetId !== that.targetId) {
                LOGGER.warn('[-] Channel::mainListener() -> invalid targetId', { targetId, thatTargetId: that.targetId });
                return;
            }
            const promises = [];
            const callbacks = that.listeners[method] || [];
            for (const callback of [...callbacks]) {
                const retval = callback.call(that, params, e.source);
                promises.push(retval);
            }
            if (!messageId) {
                return;
            }
            const { id, origin } = that;
            let error = null;
            let data = null;
            try {
                data = await Promise.all(promises);
            } catch (err) {
                error = err.message;
            }
            that.target.postMessage({
                method,
                messageId,
                type: 'response',
                params: { error, data, id, origin },
            }, '*');
        };
        window.addEventListener('message', this.mainListener);
    }
    LOGGER.out('[+] Channel.prototype.destroy');
    Channel.prototype.destroy = function() {
        window.removeEventListener('message', this.mainListener);
        this.target = null;
        this._ready = false;
        this.targetId = null;
        const keys = Object.keys(this.listeners);
        for (const key of keys) {
            delete this.listeners[key];
        }
    };
    LOGGER.out('[+] Channel.prototype.init');
    Channel.prototype.init = function() {
        window.addEventListener('message', this.mainListener);
        if (this.target && this.targetId && this._ready) {
            return;
        }
        const readyHandler = function() {
            this.off('__ready', readyHandler);
        };
        this.on('__ready', readyHandler);
    };
    LOGGER.out('[+] Channel.prototype.ready');
    Channel.prototype.ready = function(callback = dummy) {
        if (this.targetId && this.target && this._ready) {
            return callback.call(this);
        }
        const cb = function() {
            this.off('__ready', cb);
            callback.call(this);
        };
        this.on('__ready', cb);
    };
    LOGGER.out('[+] Channel.prototype.readyPromise');
    Channel.prototype.readyPromise = function() {
        const that = this;
        return new Promise(function(resolve){
            that.ready(resolve);
        });
    };
    LOGGER.out('[+] Channel.prototype.on');
    Channel.prototype.on = function on(method, callback) {
        if (typeof callback !== 'function') {
            throw new Error(this.name + '::on invalid arguments');
        }
        this.listeners[method] = this.listeners[method] || [];
        const listeners = this.listeners[method];
        const idx = listeners.indexOf(callback);
        if (idx === -1) {
            listeners.push(callback);
        }
    };
    LOGGER.out('[+] Channel.prototype.off');
    Channel.prototype.off = function off(method, callback) {
        if (!this.listeners[method]) {
            return;
        }
        if (callback === undefined) {
            this.listeners[method] = [];
            return;
        }
        const listeners = this.listeners[method];
        if (!listeners.length) {
            return;
        }
        const idx = listeners.indexOf(callback);
        if (idx !== -1) {
            listeners.splice(idx, 1);
        }
    };
    LOGGER.out('[+] Channel.prototype.ping');
    Channel.prototype.ping = function ping() {
        clearInterval(this.pingTimer);
        this.off('pong');
        this.off('ping');
        const that = this;
        this.pingTimer = setInterval(function(){
            that.emit('ping');
        }, 100);
        this.on('pong', function({ id }, source) {
            LOGGER.log('[+] Channel::ping() -> on pong:', window, ', from', source);
            clearInterval(this.pingTimer);
            this.targetId = id;
            this.target = source;
            this._ready = true;
            this.off('pong');
            LOGGER.log('[+] Channel::ping() -> on pong -> emit(__ready):', window, ', to', source);
            this.emit('__ready');
        });
    };
    LOGGER.out('[+] Channel.prototype.pong');
    Channel.prototype.pong = function pong() {
        this.off('ping');
        this.off('pong');
        this.on('ping', function({ id }, source) {
            LOGGER.log('[+] Channel::pong() -> on ping: ', window, ', from', source);
            this.targetId = id;
            this.target = source;
            this.off('ping');
            this.emit('pong', null, function() {
                this._ready = true;
                LOGGER.log('[+] Channel::pong() -> on ping -> emit(pong) -> emit(__ready):', window, ', to', source);
                this.emit('__ready');
            });
        });
    };
    LOGGER.out('[+] Channel.prototype.emit');
    Channel.prototype.emit = function emit(method, params, callback = null) {
        const that = this;
        const { target, id, origin } = this;
        const withCallback = typeof callback === 'function';
        const messageId = withCallback ? random(20) : null;
        target.postMessage({
            type: 'request',
            method,
            messageId,
            params: params ? extend(params, { id, origin }) : { id, origin },
        }, '*');
        if (!withCallback) {
            return;
        }
        const handler = function(e) {
            if (e.source !== target || typeof e.data !== 'object') {
                return;
            }
            const { messageId: responseId, method: responseMethod, params, type } = e.data;
            if (responseId === messageId && responseMethod === method && type === 'response') {
                callback.call(that, params.error, params.data);
                window.removeEventListener('message', handler);
            }
        };
        window.addEventListener('message', handler);
    };
    LOGGER.out('[+] ChannelList');
    function ChannelList(){
        this.origin = window.location.origin;
        this.list = {};
    }
    LOGGER.out('[+] ChannelList.prototype.size');
    ChannelList.prototype.size = async function({ url, ext, name, prop, id }, callback = null) {
        addToDomainList(url);
        LOGGER.log('[+] CHANNEL_LIST.size() -> url:', url);
        const channel = await this.ready(url);
        const cb = callback ? function(error, [response]) { callback(error, response.size, response); } : null;
        channel.emit('size-req', {
            data: { url, ext, name, prop, id },
        }, cb);
    };
    LOGGER.out('[+] ChannelList.prototype.download');
    ChannelList.prototype.download = async function({ url, ext, name, prop, id }, callback = null) {
        addToDomainList(url);
        LOGGER.log('[+] CHANNEL_LIST.download() -> url:', url);
        const channel = await this.ready(url);
        channel.emit('download-req', {
            data: { url, ext, name, prop, id },
        }, callback);
    };
    LOGGER.out('[+] ChannelList.prototype.saveLogs');
    ChannelList.prototype.saveLogs = function() {
        const origins = Object.keys(this.list);
        for (const origin of origins) {
            this.list[origin].emit('save-logs');
        }
    };
    LOGGER.out('[+] ChannelList.prototype.fetchPladformPlaylist');
    ChannelList.prototype.fetchPladformPlaylist = async function(details, callback = null) {
        LOGGER.log('[+] CHANNEL_LIST.fetchPladformPlaylist() -> details: ', details);
        const channel = await this.ready(details.url);
        const cb = callback ? function(error, resp) { callback(error, resp && resp[0]); } : null;
        channel.emit('fetch-pladform-playlist', { data: details }, cb);
    };
    LOGGER.out('[+] ChannelList.prototype.request');
    ChannelList.prototype.request = async function(details) {
        LOGGER.log('[+] CHANNEL_LIST.request() -> details: ', details);
        const channel = await this.ready(details.url);
        const { url, method = 'GET', headers = {}, data, onprogress, responseType } = details;
        const id = random(10);
        const handler = {};
        const promise = new Promise(function(resolve, reject) {
            handler.resolve = resolve;
            handler.reject = reject;
        });
        const oncomplete = function() {
            channel.off(`load-${id}`);
            channel.off(`progress-${id}`);
            channel.off(`error-${id}`);
        };
        channel.on(`load-${id}`, function(resp) {
            oncomplete();
            LOGGER.log('[+] CHANNEL_LIST.request() -> load: ', resp.headers);
            handler.resolve(resp);
        });
        if (typeof onprogress === 'function') {
            channel.on(`progress-${id}`, onprogress);
        }
        channel.on(`error-${id}`, (resp) => {
            oncomplete();
            const error = resp instanceof Error ? resp : new Error(`${resp}`);
            LOGGER.error('[-] CHANNEL_LIST.request() -> error: ', error, details);
            handler.reject(error);
        });
        const dt = { url, method, headers, data, requestId: id, responseType };
        channel.emit('request', { data: dt });
        return promise;
    };
    LOGGER.out('[+] ChannelList.prototype.create');
    ChannelList.prototype.create = function(url) {
        const { origin, pathname } = getLocation(url);
        LOGGER.log('[+] CHANNEL_LIST.create() -> origin:', origin);
        const channel = new Channel(null, origin);
        this.list[origin] = channel;
        channel.init();
        LOGGER.log('[+] CHANNEL_LIST.create() -> init()');
        channel.pong();
        LOGGER.log('[+] CHANNEL_LIST.create() -> pong()');
        let page = '';
        if (origin.indexOf('pladform') !== -1) {
            page = origin;
        } else if (origin.indexOf('rutube.ru') !== -1) {
            page = 'https://out.pladform.ru';
        } else {
            page = origin + pathname + '.html#' + encodeURIComponent(this.origin);
        }
        LOGGER.log('[+] CHANNEL_LIST.create() -> page url:', page);
        const [iframe] = jQuery('<iframe style="width: 1px; height: 1px; visibility: hidden"></iframe>')
        .attr('id', origin + '-channel')
        .attr('src', page)
        .appendTo('body');
        LOGGER.log('[+] CHANNEL_LIST.create() -> iframe:', iframe);
        return channel;
    };
    LOGGER.out('[+] ChannelList.prototype.ready');
    ChannelList.prototype.ready = async function(url) {
        const { origin } = getLocation(url);
        let channel = this.list[origin];
        if (!channel) {
            channel = this.create(url);
        }
        await channel.readyPromise();
        LOGGER.log('[+] CHANNEL_LIST.ready() -> origin:', origin);
        return channel;
    };
    LOGGER.out('[+] ChannelList.prototype.destroy');
    ChannelList.prototype.destroy = function(origin) {
        const channel = this.list[origin];
        if (!channel) {
            return;
        }
        channel.destroy();
        jQuery('iframe#' + origin + '-channel').remove();
        delete this.list[origin];
    };
    LOGGER.out('[+] random');
    function random(len = 6) {
        let str = '';
        const size = ALPHANUM.length;
        for (let i = 0; i < len; ++i) {
            str += ALPHANUM[Math.round(Math.random() * size) % size];
        }
        return str;
    }
    //-------------------------------------------------------------------------//
    LOGGER.out('[+] QueueLoader');
    function QueueLoader({ maxActiveSize = 4, maxMaxActiveSize = 10 } = {}) {
        LOGGER.log('[+] QueueLoader()');
        this.queue = [];
        this.active = [];
        this.setMaxMaxActiveSize(maxMaxActiveSize);
        this.setMaxActiveSize(maxActiveSize);
    }
    LOGGER.out('[+] QueueLoader.prototype.setMaxMaxActiveSize');
    QueueLoader.prototype.setMaxMaxActiveSize = function setMaxMaxActiveSize(maxMaxActiveSize) {
        if (maxMaxActiveSize > 0) {
            this.maxMaxActiveSize = maxMaxActiveSize;
        } else {
            this.maxMaxActiveSize = 1;
        }
    };
    LOGGER.out('[+] QueueLoader.prototype.setMaxActiveSize');
    QueueLoader.prototype.setMaxActiveSize = function setMaxActiveSize(maxActiveSize) {
        if (maxActiveSize > 0) {
            this.maxActiveSize = maxActiveSize <= this.maxMaxActiveSize ? maxActiveSize : this.maxMaxActiveSize;
        } else {
            this.maxActiveSize = 1;
        }
    };
    LOGGER.out('[+] QueueLoader.prototype.isBusy');
    QueueLoader.prototype.isBusy = function isBusy() {
        return this.active.length >= this.maxActiveSize;
    };
    LOGGER.out('[+] QueueLoader.defaultDetails');
    QueueLoader.defaultDetails = {
        responseType: 'arraybuffer',
        timeout: 0,
        context: null,
        callback: dummy,
    };
    LOGGER.out('[+] QueueLoader.extendDetails');
    QueueLoader.extendDetails = function extendDetails(details) {
        return extend({}, QueueLoader.defaultDetails, details);
    };
    LOGGER.out('[+] QueueLoader.prototype.enqueue');
    QueueLoader.prototype.enqueue = function enqueue(...requests) {
        LOGGER.log('[+] QueueLoader::enqueue:', requests.length);
        const { length: size } = requests;
        if (size) {
            this.queue.push(...requests.map(QueueLoader.extendDetails));
        }
        this.forceRun(size);
    };
    LOGGER.out('[+] QueueLoader.prototype.stop');
    QueueLoader.prototype.stop = function stop() {
        this._stop = true;
    };
    LOGGER.out('[+] QueueLoader.prototype.resume');
    QueueLoader.prototype.resume = function resume() {
        this._stop = false;
        this.forceRun();
    };
    LOGGER.out('[+] QueueLoader.prototype.forceRun');
    QueueLoader.prototype.forceRun = function forceRun(size) {
        if (size === undefined) {
            size = this.maxMaxActiveSize;
        }
        for (var i = 0; i < size && i < this.maxActiveSize && !this.load(); ++i);
    };
    LOGGER.out('[+] stringToUint');
    function stringToUint(string) {
        var string = btoa(unescape(encodeURIComponent(string))),
            charList = string.split(''),
            uintArray = [];
        for (var i = 0; i < charList.length; i++) {
            uintArray.push(charList[i].charCodeAt(0));
        }
        return new Uint8Array(uintArray);
    }
    LOGGER.out('[+] uintToString');
    function uintToString(uintArray) {
        var encodedString = String.fromCharCode.apply(null, uintArray),
            decodedString = decodeURIComponent(escape(atob(encodedString)));
        return decodedString;
    }
    LOGGER.out('[+] isArrayBuffer');
    function isArrayBuffer(data) {
        return !!data && (data.buffer instanceof ArrayBuffer || data.byteLength !== undefined);
    }
    LOGGER.out('[+] queueRequest');
    async function queueRequest(details) {
        const { url } = details;
        if (url.indexOf('pladform') !== -1 || url.indexOf('rutube.ru') !== -1) {
            return CHANNEL_LIST.request(details);
        }
        return makeRequest(details);
    }
    LOGGER.out('[+] QueueLoader.prototype.load');
    QueueLoader.prototype.load = function load() {
        if (!this.queue.length || this.isBusy() || this._stop) {
            return 1;
        }
        const request = this.queue.shift();
        LOGGER.log('[+] QueueLoader.load() -> request:', request);
        this.active.push(request);
        const { callback, context, responseType } = request;
        const _this = this;
        const onLoad = function({ response: data }) {
            const _isArrayBuffer = isArrayBuffer(data);
            LOGGER.log('[+] QueueLoader.load() -> response:', typeof data, ', length:', data.length, ', byteLength:', data.byteLength, ', buffer:', data.buffer);
            if (responseType === 'arraybuffer' && !_isArrayBuffer) {
                const error = new Error('invalid responseType, got response type: ' + typeof data + ', but requested type: ' + responseType);
                LOGGER.error('[-] QueueLoader::load.error:', error);
                return callback.call(context, error);
            }
            if (_isArrayBuffer) {
                data = new Uint8Array(data);
            } else if (typeof data === 'string' && responseType === 'arraybuffer') {
                data = stringToUint(data);
            }
            callback.call(context, null, data);
        };
        const onError = function(error, retry) {
            if (error.message === 'network error') {
                LOGGER.log('[*] QueueLoader.load() -> retry[' + retry + '] on "network error", url: ', request.url);
                return queueRequest(request).then(onLoad)
                .then(function(r){
                    LOGGER.log('[+] QueueLoader.load() -> success retry[' + retry + '] on "network error", url: ', request.url);
                    return r;
                });
            }
            throw error;
        };
        let promise = queueRequest(request).then(onLoad);
        const maxRetry = 3;
        for (let retry = 0; retry < maxRetry; ++retry) {
            promise = promise.catch(function(error){
                return onError(error, retry + 1);
            });
        }
        promise.catch(function(error) {
            LOGGER.error('[-] QueueLoader::load.error:', error);
            callback.call(context, error);
        })
        .then(function(){
            const index = _this.active.indexOf(request);
            if (index !== -1) {
                _this.active.splice(index, 1);
            }
            _this.load();
        });
        return 0;
    };
    LOGGER.out('[+] Decryter');
    function Decryter() {
        try {
            const { crypto } = window;
            const { subtle = crypto.webkitSubtle } = crypto;
            this.subtle = subtle;
        } catch (e) {}
        this.disableWebCrypto = !this.subtle;
    }
    LOGGER.out('[+] Decryter.prototype.decrypt');
    Decryter.prototype.decrypt = function decrypt(data, key, iv) {
        LOGGER.log('[+] Decryter.decrypt() -> key:', key);
        LOGGER.log('[+] Decryter.decrypt() -> iv:', iv);
        if (this.disableWebCrypto) {
            const error = new Error('Web crypto not supported');
            LOGGER.error('[-] Decryter.decrypt() -> error:', error);
            throw error;
        }
        const { subtle } = this;
        if (this.key !== key) {
            this.key = key;
            this.fastAesKey = new FastAesKey(subtle, key);
        }
        return this.fastAesKey.expandKey()
        .then(function(aesKey) {
            // decrypt using web crypto
            const crypto = new AESCrypto(subtle, iv);
            return crypto.decrypt(data, aesKey);
        });
        // .then(function(result){
            // callback(null, result);
        // })
        // .catch(function(error) {
            // LOGGER.error('[-] Decryter::decrypt.error:', error);
            // callback(error);
        // });
    };
    LOGGER.out('[+] hexadecimalInteger');
    function hexadecimalInteger(hex) {
        if (hex) {
            let stringValue = (hex || '0x').slice(2);
            stringValue = ((stringValue.length & 1) ? '0' : '') + stringValue;
            const view = new Uint8Array(stringValue.length / 2);
            for (let i = 0; i < stringValue.length / 2; i++) {
                view[i] = parseInt(stringValue.slice(i * 2, i * 2 + 2), 16);
            }
            return view;
        } else {
            return null;
        }
    }
    LOGGER.out('[+] createInitializationVector');
    function createInitializationVector(segmentNumber) {
        const view = new Uint8Array(16);
        for (let i = 12; i < 16; ++i) {
            view[i] = (segmentNumber >> (8 * (15 - i))) & 0xff;
        }
        return view;
    }
    LOGGER.out('[+] AESCrypto');
    function AESCrypto(subtle, iv) {
        this.subtle = subtle;
        this.aesIV = iv;
    }
    LOGGER.out('[+] AESCrypto.prototype.decrypt');
    AESCrypto.prototype.decrypt = function decrypt (data, key) {
        return this.subtle.decrypt({ name: 'AES-CBC', iv: this.aesIV }, key, data);
    };
    LOGGER.out('[+] FastAesKey');
    function FastAesKey(subtle, key) {
        this.subtle = subtle;
        this.key = key;
    }
    LOGGER.out('[+] FastAesKey.prototype.expandKey');
    FastAesKey.prototype.expandKey = function expandKey () {
        return this.subtle.importKey('raw', this.key, { name: 'AES-CBC' }, false, ['encrypt', 'decrypt']);
    };
    LOGGER.out('[+] Downloader');
    function Downloader() {
        this.crypto = new Decryter();
        this.fragLoader = new QueueLoader();
        this.fragLoader.setMaxActiveSize(10);
        this.zipType = Downloader.getZipType();
    }
    LOGGER.out('[+] Downloader.loadKey');
    Downloader.loadKey = function loadKey(baseurl, relurl) {
        const url = URLToolkit.buildAbsoluteURL(baseurl, relurl);
        LOGGER.log('[+] Downloader.loadKey() -> url:', url);
        const maxRetry = 5;
        let promise = makeRequest({ url, responseType: 'arraybuffer' });
        const onError = function(error, retry) {
            if (error.message === 'network error') {
                LOGGER.log('[*] Downloader.loadKey() -> retry[' + retry + '] on "network error", url: ', url);
                return makeRequest({ url, responseText: 'arraybuffer' })
                .then(function(r){
                    LOGGER.log('[+] Downloader.loadKey() -> succeeded retry[' + retry + '] on "network error", url: ', url);
                    return r;
                });
            }
            throw error;
        };
        for (let retry = 0; retry < maxRetry; ++retry) {
            promise = promise.catch(function(error){
                return onError(error, retry + 1);
            });
        }
        return promise.then(function({ response }){
            LOGGER.log('[+] Downloader.loadKey() -> response:', response);
            return new Uint8Array(response);
        })
        .catch(function(error){
            LOGGER.error('[-] Downloader.loadKey() -> error: ', error);
        });
    };
    LOGGER.out('[+] Downloader.prototype.createCallback');
    Downloader.prototype.createCallback = function createCallback (fragments, totalduration, progress, promise) {
        let count = 0;
        const { length: size = 0 } = fragments || {};
        const _this = this;
        let loaded = 0;
        const callback = async function (error, data) {
            const context = this;
            const { segmentNumber } =  context;
            const string = '[+] Downloader.download() -> callback(' + segmentNumber + ')';
            LOGGER.log(string, '-> data:', data);
            if (error) {
                LOGGER.log(string, '-> error:', error);
                if (promise && promise.reject) {
                    promise.reject(error);
                    promise.clean();
                }
                return;
            }
            let decryptedData = data;
            const frag = fragments[segmentNumber - 1];
            const { levelkey = {} } = frag;
            if (levelkey.method) {
                const { baseuri, reluri } = levelkey;
                const key = await Downloader.loadKey(baseuri, reluri);
                let { iv } = levelkey;
                if (!iv) {
                    iv = createInitializationVector(segmentNumber);
                } else if (typeof iv === 'string') {
                    iv = hexadecimalInteger(iv);
                }
                LOGGER.log(string, '-> levelkey:', { iv, key });
                decryptedData = await _this.crypto.decrypt(data, key, iv);
            } else {
                decryptedData = data;
            }
            LOGGER.log(string, '-> decryptedData:', decryptedData);
            frag.decryptedData = decryptedData;
            loaded += frag.duration;
            if (typeof progress === 'function') {
                progress({ loaded, total: totalduration });
            }
            ++count;
            if (count >= size && promise && promise.resolve) {
                promise.resolve();
                promise.clean();
            }
        };
        return callback;
    };
    LOGGER.out('[+] Downloader.cleanPromise');
    Downloader.cleanPromise = function cleanPromise() {
        this.resolve = null;
        this.reject = null;
    };
    LOGGER.out('[+] Downloader.getHlsFragments');
    Downloader.getHlsFragments = async function getHlsFragments(url) {
        LINK.href = url;
        const { origin } = LINK;
        let hls;
        if (origin.indexOf('pladform.ru') !== -1 || origin.indexOf('rutube.ru') !== -1) {
            console.log('[+] Downloader.getHlsFragments() cross domain url: ', url);
            hls = new Hls({
                loader: Loader,
                pLoader: Loader,
            });
        } else {
            hls = new Hls();
        }
        hls.loadSource(url);
        try {
            await levelLoaded(hls)
        } catch (error) {
            LOGGER.error('[-] Downloader.getHlsFragments() -> error:', error);
            hls.destroy();
            return [];
        }
        const { fragments: _fragments, totalduration } = getHlsComponents(hls);
        const fragments = _fragments.map(function({ url, levelkey, duration }, idx){
            return { url, duration, levelkey: extend({}, levelkey), segmentNumber: (idx + 1) };
        });
        hls.destroy();
        return { fragments, totalduration };
    };
    LOGGER.out('[+] Loader');
    function Loader() {}
    LOGGER.out('[+] Loader.prototype.load');
    Loader.prototype.load = function(context, config, callbacks){
                    const stats = {};
                    stats.trequest = performance.now();
                    this._req = GM.xmlHttpRequest({
                        method: 'GET',
                        url: context.url,
                        responseType: context.responseType,
                        timeout: config.timeout,
                        headers: {},
                        onload: function(r){
                            stats.tload = performance.now();
                            const response = { url: context.url, data: r.response };
                            callbacks.onSuccess(response, stats, context, { r });
                        },
                        onprogress: function(r){
                            if (!stats.tfirst) {
                                stats.tfirst = performance.now();
                            }
                            stats.loaded = r.loaded;
                            stats.total = r.total;
                            if (callbacks.onProgress) {
                                callbacks.onProgress(stats, context, { r });
                            }
                        },
                        onerror: function(r){
                            if (callbacks.onError) {
                                callbacks.onError({ code: 10000, text: 'something wrong' }, context, { r });
                            }
                        },
                        ontimeout: function(r){
                            if (callbacks.onTimeout) {
                                callbacks.onTimeout(stats, context);
                            }
                        },
                    });
                    this._context = context;
                };
    LOGGER.out('[+] Loader.prototype.abort');
    Loader.prototype.abort = function(){
                    if (this._req && this._req.abort) {
                        this._req.abort();
                    }
                };
    LOGGER.out('[+] Loader.prototype.destroy');
    Loader.prototype.destroy = function(){
                    if (typeof this._context === 'object') {
                        Object.keys(this._context).forEach(function(key){
                            delete this._context[key];
                        });
                        this._context = null;
                    }
                };
    LOGGER.out('[+] Downloader.prototype.createRequests');
    Downloader.prototype.createRequests = function createRequests(fragments, totalduration, progress) {
        const promise = {
            resolve: dummy,
            reject: dummy,
            clean: Downloader.cleanPromise,
       };
        const callback = this.createCallback(fragments, totalduration, progress, promise);
        const requests = [];
        for (let index = 0, segmentNumber = 1; index < fragments.length; ++index, ++segmentNumber) {
            const { url } = fragments[index];
            const context = { segmentNumber };
            requests.push({ url, responseType: 'arraybuffer', callback, context });
        }
        return { requests, promise };
    };
    LOGGER.out('[+] Downloader.getZipType');
    Downloader.getZipType = function getZipType() {
        const types = ['uint8array', 'blob', 'base64'];
        let type;
        for (const t of types) {
            if (JSZip.support[t]) {
                type = t;
                break;
            }
        }
        if (!type) {
            throw new Error('your browser does not support any of ' + types.join(', ') + ' types');
        }
        return type;
    };
    LOGGER.out('[+] base64ToUint8array');
    function base64ToUint8array(str) {
        const byteChars = atob(s);
        const { length: size } = byteChars;
        const bytes = new Array(size);
        for (var i = 0; i < size; ++i) {
            bytes[i] = byteChars.charCodeAt(i);
        }
        return new Uint8Array(bytes);
    }
    LOGGER.out('[+] Downloader.generateMp3Bat');
    Downloader.generateMp3Bat = function generateMp3Bat(fileName = 'output') {
        if (Downloader._mp3bat && !fileName) {
            return Downloader._mp3bat.join('\r\n');
        }
        Downloader._mp3bat = [
            '@echo off',
            'setlocal enabledelayedexpansion',
            'chcp 65001',
            'ffmpeg -version',
            'if errorlevel 1 (',
            '  echo "ffmpeg not found"',
            '  @pause',
            '  exit',
            ')',
            'SET "filename=' + fileName + '"',
            'echo "filename: %filename%"',
            'echo "cd: %cd%"',
            'dir',
            '@pause',
            '(FOR /R %%i IN (*.ts) DO @echo file \'s/%%~nxi\') > list.txt',
            'ffmpeg -f concat -safe 0 -loglevel panic -i list.txt -c:a copy -vn "%filename%.mp3"',
            'del "list.txt"',
            'echo "success"',
            '@pause',
        ];
        return Downloader._mp3bat.join('\r\n');
    };
    LOGGER.out('[+] Downloader.generateMp4Bat');
    Downloader.generateMp4Bat = function generateMp4Bat(fileName = 'output') {
        if (Downloader._mp4bat && !fileName) {
            return Downloader._mp4bat.join('\r\n');
        }
        Downloader._mp4bat = [
            '@echo off',
            'setlocal enabledelayedexpansion',
            'chcp 65001',
            'ffmpeg -version',
            'if errorlevel 1 (',
            '  echo "ffmpeg not found"',
            '  @pause',
            'exit',
            ')',
            'SET "filename=' + fileName + '"',
            'echo "filename: %filename%"',
            'echo "cd: %cd%"',
            'dir',
            '@pause',
            '(FOR /R %%i IN (*.ts) DO @echo file \'s/%%~nxi\') > list.txt',
            'ffmpeg -f concat -safe 0 -loglevel panic -i list.txt -c:a copy -c:v copy "%filename%.mp4"',
            'del "list.txt"',
            'echo "success"',
            '@pause',
        ];
        return Downloader._mp4bat.join('\r\n');
    };
    LOGGER.out('[+] Downloader.generateMp4Sh');
    Downloader.generateMp4Sh = function generateMp4Sh() {
        if (Downloader._mp4sh) {
            return Downloader._mp4sh.join('\n');
        }
        Downloader._mp4sh = [
            '#!/bin/bash',
            'ffmpeg -version',
            'if [ $? != 0 ]; then',
            '  echo "ffmpeg not found"',
            '  exit 0',
            'fi',
            'filename=$(ls *.out)',
            'filename="${filename%.*}"',
            'for file in s/*.ts; do',
            '  echo "file \'$file\'" >> list.txt;',
            'done',
            'ffmpeg -f concat -safe 0 -loglevel panic -i list.txt -c:a copy -c:v copy "$filename.mp4"',
            'rm -f list.txt',
            'exit 0',
        ];
        return Downloader._mp4sh.join('\n');
    };
    LOGGER.out('[+] Downloader.generateMp3Sh');
    Downloader.generateMp3Sh = function generateMp3Sh() {
        if (Downloader._mp3sh) {
            return Downloader._mp3sh.join('\n');
        }
        Downloader._mp3sh = [
            '#!/bin/bash',
            'ffmpeg -version',
            'if [ $? != 0 ]; then',
            '  echo "ffmpeg not found"',
            '  exit 0',
            'fi',
            'filename=$(ls *.out)',
            'filename="${filename%.*}"',
            'for file in s/*.ts; do',
            '  echo "file \'$file\'" >> list.txt;',
            'done',
            'ffmpeg -f concat -safe 0 -loglevel panic -i list.txt -c:a copy -vn "$filename.mp3"',
            'rm -f list.txt',
            'exit 0',
        ];
        return Downloader._mp3sh.join('\n');
    };
    LOGGER.out('[+] Downloader.generateReadme');
    Downloader.generateReadme = async function generateReadme() {
        if (Downloader._readme) {
            return Downloader._readme.join('\n');
        }
        Downloader._readme = [
            'README',
            '1) install ffmpeg',
            '2.a) Windows users',
            '  run generate.mp3.bat',
            '2.b) Linux, MacOS users',
            '  chmod +x generate.mp3.sh # make generate.mp3.sh executable',
            '  ./generate.mp3.sh',
        ];
        return Downloader._readme.join(OS_NAME !== 'Windows' ? '\n' : '\r\n');
    };
    LOGGER.out('[+] Downloader.createZip');
    Downloader.createZip = async function createZip(fragments, name, type) {
        const jszip = new JSZip();
        for (const { url, segmentNumber, decryptedData } of fragments) {
            const ext = getExtension(url);
            const i = Math.floor(segmentNumber / 1000);
            const filename = ALPHANUM[i] + pad(segmentNumber, 3) + '.' + ext;
            const data = decryptedData.buffer || decryptedData;
            LOGGER.log('[+] Downloader.createZip() -> data:', filename, data);
            jszip.file('s/' + filename, data, { binary: true });
        }
        jszip.file(name + '.out', '');
        jszip.file('filename.txt', name);
        jszip.file('generate.mp3.bat', Downloader.generateMp3Bat(name));
        jszip.file('generate.mp3.sh', Downloader.generateMp3Sh(), {
            unixPermissions: '755',
        });
        jszip.file('generate.mp4.bat', Downloader.generateMp4Bat(name));
        jszip.file('generate.mp4.sh', Downloader.generateMp4Sh(), {
            unixPermissions: '755',
        });
        jszip.file('README.txt', Downloader.generateReadme());
        return jszip.generateAsync({ type });
    };
    LOGGER.out('[+] Downloader.downloadZip');
    Downloader.downloadZip = function downloadZip (data, name, type) {
        LOGGER.log('[+] Downloader.downloadZip()');
        let blob;
        let bytes = [0];
        if (type === 'blob') {
            blob = data;
        } else if (type === 'uint8array') {
            bytes = data;
        } else if (type === 'base64') {
            bytes = base64ToUint8array(data);
        }
        blob = blob || new Blob([bytes], { type: 'application/zip' });
        LOGGER.log('[+] Downloader.downloadZip() -> blob:', blob);
        const resource = URL.createObjectURL(blob);
        LOGGER.log('[+] Downloader.downloadZip() -> resource:', resource);
        const link = jQuery('<a style="visibility: hidden">' + name + '</a>')
        .appendTo('body')[0];
        link.href = resource;
        link.download = name + '.zip';
        LOGGER.log('[+] Downloader.downloadZip() -> link:', link);
        link.click();
        delay(200).then(function(){
            URL.revokeObjectURL(resource);
            jQuery(link).remove();
        });
    };
    LOGGER.out('[+] Downloader.prototype.download');
    Downloader.prototype.download = async function download (url, name, progress) {
        const { fragments, totalduration } = await Downloader.getHlsFragments(url);
        LOGGER.log('[+] Downloader.download() -> fragments:', fragments.length);
        const { requests, promise } = this.createRequests(fragments, totalduration, progress);
        this.fragLoader.enqueue(...requests);
        const downloadPromise = new Promise(function(resolve, reject) {
            promise.resolve = resolve;
            promise.reject = reject;
        });
        try {
            await downloadPromise;
            const type = this.zipType;
            const data = await Downloader.createZip(fragments, name, type);
            LOGGER.log('[+] Downloader.download() -> zipData:', type, data);
            Downloader.downloadZip(data, name, type);
        } catch (error) {
            LOGGER.error('[-] Downloader.download() -> error:', error);
        }
    };
    //-------------------------------------------------------------------------//
    //------------------------------- MEDIA API -------------------------------//
    LOGGER.out('[+] getarray');
    function getarray() {
        const retval = [];
        for (const key of Object.keys(this.list)) {
            retval.push(this.list[key]);
        }
        return retval;
    };
    LOGGER.out('[+] AudioList');
    function AudioList() {
        this.list = {};
    }
    LOGGER.out('[+] VideoList');
    function VideoList() {
        this.list = {};
    }
    AudioList.prototype.getarray = getarray;
    VideoList.prototype.getarray = getarray;
    AudioList.prototype.init = function(){
        this.createAudioUnmaskSource();
        this.createContent();
    };
    VideoList.prototype.init = function(){
        this.createContent();
    };
    LOGGER.out('[+] AudioList.prototype.createAudioUnmaskSource');
    AudioList.prototype.createAudioUnmaskSource = function (){
        'use strict';
        const that = this;
        LOGGER.log('[+] AUDIO_LIST.createAudioUnmaskSource() version = 1');
        function i() {
            return window.wbopen && ~(window.open + "").indexOf("wbopen")
        }
        function o(t) {
            if (!i() && ~t.indexOf("audio_api_unavailable")) {
                var e = t.split("?extra=")[1].split("#"),
                    o = "" === e[1] ? "" : a(e[1]);
                if (e = a(e[0]), "string" != typeof o || !e) return t;
                o = o ? o.split(String.fromCharCode(9)) : [];
                for (var s, r, n = o.length; n--;) {
                    if (r = o[n].split(String.fromCharCode(11)), s = r.splice(0, 1, e)[0], !l[s]) return t;
                    e = l[s].apply(null, r)
                }
                if (e && "http" === e.substr(0, 4)) return e
            }
            return t
        }
        function a(t) {
            if (!t || t.length % 4 == 1) return !1;
            for (var e, i, o = 0, a = 0, s = ""; i = t.charAt(a++);) i = r.indexOf(i), ~i && (e = o % 4 ? 64 * e + i : i, o++ % 4) && (s += String.fromCharCode(
                255 & e >> (-2 * o & 6)));
            return s
        }
        function s(t, e) {
            var i = t.length,
                o = [];
            if (i) {
                var a = i;
                for (e = Math.abs(e); a--;) e = (i * (a + 1) ^ e + a) % i, o[a] = e
            }
            return o
        }
        that.unmask = function audioUnmaskSource(url) {
            if (!that.uid && window.vk) {
                that.uid = window.vk.id;
                LOGGER.info('[+] audioUnmaskSource() -> vk.id:', that.uid);
            } else if (!window.vk) {
                LOGGER.warn('[-] audioUnmaskSource() -> vk.id not found');
            }
            return o.call(that, url);
        };
        var r = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMN0PQRSTUVWXYZO123456789+/=",
            l = {
                v: function(t) {
                    return t.split("").reverse().join("")
                },
                r: function(t, e) {
                    t = t.split("");
                    for (var i, o = r + r, a = t.length; a--;) i = o.indexOf(t[a]), ~i && (t[a] = o.substr(i - e, 1));
                    return t.join("")
                },
                s: function(t, e) {
                    var i = t.length;
                    if (i) {
                        var o = s(t, e),
                            a = 0;
                        for (t = t.split(""); ++a < i;) t[a] = t.splice(o[i - 1 - a], 1, t[a])[0];
                        t = t.join("")
                    }
                    return t
                },
                i: function(t, e) {
                    return l.s(t, e ^ that.uid)
                },
                x: function(t, e) {
                    var i = [];
                    return e = e.charCodeAt(0), each(t.split(""), function(t, o) {
                        i.push(String.fromCharCode(o.charCodeAt(0) ^ e))
                    }), i.join("")
                }
            }
    };
    LOGGER.out('[+] bitrateToSize');
    function bitrateToSize(data) {
        return data.bitrate * data.duration / 8;
    }
    LOGGER.out('[+] sizeToBitrate');
    function sizeToBitrate(data) {
        return data.size * 8 / data.duration;
    }
    LOGGER.out('[+] AudioList.prototype.bitrate');
    AudioList.prototype.bitrate = async function(id) {
        const data = this.list[id];
        if (!data) {
            return null;
        }
        if (data.bitrate) {
            data.size = data.size || bitrateToSize(data);
        } else if (data.size) {
            data.bitrate = sizeToBitrate(data);
        } else if (data.ext.indexOf('m3u') !== -1) {
            const hls = new Hls();
            hls.loadSource(data.src);
            await levelLoaded(hls);
            const { totalduration } = getHlsComponents(hls);
            data.duration = totalduration || data.duration;
            const bitrate = await getBitrateEstimate(hls);
            hls.destroy();
            data.size = bitrateToSize(data);
            data.bitrate = bitrate;
        } else {
            data.size = await this.size(id);
            data.bitrate = sizeToBitrate(data);
        }
        this.updateContent(id);
        return data.bitrate;
    };
    LOGGER.out('[+] AudioList.prototype.size');
    AudioList.prototype.size = async function(id) {
        LOGGER.log('_________________\n[+] AUDIO_LIST.size(' + id + ')');
        const data = this.list[id];
        if (!data) {
            return null;
        }
        if (typeof data._onsize !== 'function') {
            data._onsize = function(callback) {
                data._sizeEvents = data._sizeEvents || [];
                data._sizeEvents.push(callback);
            };
        }
        if (data.sizeRequested) {
            return new Promise(function(resolve){
                data._onsize(resolve);
            });
        }
        data.sizeRequested = true;
        LOGGER.log('[+] AUDIO_LIST.size()..');
        if (data.size) {
            data.bitrate = data.bitrate || sizeToBitrate(data);
        } else if (data.bitrate) {
            const { bitrate, duration } = data;
            data.size = bitrateToSize(data);
        } else if (data.ext.indexOf('m3u') !== -1) {
            LOGGER.log('[+] AUDIO_LIST.size() -> request "' + data.ext + '" bitrate');
            let bitrate;
            LOGGER.log('[+] AUDIO_LIST.size() -> Hls:', typeof Hls);
            const hls = new Hls();
            LOGGER.log('[+] AUDIO_LIST.size() -> data:', data);
            const { src, duration } = data;
            LOGGER.log('[+] AUDIO_LIST.size() -> hls:', hls);
            hls.loadSource(src);
            LOGGER.log('[+] AUDIO_LIST.size() -> hls level loading');
            await levelLoaded(hls);
            LOGGER.log('[+] AUDIO_LIST.size() -> hls level loaded');
            const { totalduration } = getHlsComponents(hls);
            LOGGER.log('[+] AUDIO_LIST.size() -> hls totalduration:', totalduration);
            data.duration = totalduration || data.duration;
            LOGGER.log('[+] AUDIO_LIST.size() -> levelLoaded');
            bitrate = await getBitrateEstimate(hls);
            LOGGER.log('[+] AUDIO_LIST.size() -> bitrate:', bitrate);
            hls.destroy();
            data.bitrate = bitrate;
            data.size = bitrateToSize(data);
        } else {
            const { src: url, ext } = data;
            LOGGER.log('[+] AUDIO_LIST.size() -> request "' + ext + '" size');
            data.size = await new Promise(function(resolve, reject){
                if (!global.USE_CUSTOM_UA || typeof GM === 'undefined' || typeof GM.xmlHttpRequest === 'undefined') {
                    CHANNEL_LIST.size({ url }, function(error, size) {
                        return error ? reject(error) : resolve(size);
                    });
                    return;
                }
                makeRequest({
                    method: 'HEAD',
                    url,
                    headers: {
                        'user-agent': USER_AGENT,
                        'x-requested-with': 'XMLHttpRequest',
                        referer: location.href,
                    },
                }).then(function({ headers }){
                    const { 'content-length': size } = headers;
                    resolve(+size);
                }).catch(reject);
            }).catch(function(error){
                LOGGER.error('[-] AUDIO_LIST.size() -> error:', error);
            });
            data.bitrate = sizeToBitrate(data);
        }
        LOGGER.log('[+] AUDIO_LIST.size() -> size:', data.size, ' bytes');
        this.updateContent(id);
        if (data._sizeEvents) {
            data._sizeEvents.forEach(function(callback){
                callback(data.size);
            });
            data._sizeEvents.length = 0;
        }
        data.sizeRequested = false;
        return data.size;
    };
    LOGGER.out('[+] AudioList.prototype.download');
    AudioList.prototype.download = async function(id) {
        LOGGER.log('[+] AUDIO_LIST.download() -> id:', id);
        const data = this.list[id];
        if (!data) {
			LOGGER.log('[+] AUDIO_LIST.download() -> warning: no data found');
            return null;
        }
        const { duration, filename, downloadState = 'void', size } = data;
        let { src: url } = data;
        const source = data;
        if (downloadState === 'started') {
            LOGGER.log('[+] AUDIO_LIST.download() -> download already started');
            return;
        }
        let ext = getExtension(url);
        LOGGER.log('[+] AUDIO_LIST.download() -> extension = "' + ext + '"');
        if (ext.indexOf('m3u') !== -1 && global.TRY_MP3_FROM_M3U8) {
          const mp3_url = url.replace(/\/index\.m3u8?/, '.mp3').split('/').filter(function (_, idx, arr) {
            return idx !== arr.length - 2;
          }).join('/');
          const mp3_size = await new Promise(function (resolve, reject) {
            CHANNEL_LIST.size({ url: mp3_url }, function (error, size) {
              if (error) { reject(error) }
              else { resolve(size) }
            });
          }).catch(function(error){ return 0; });
          const ratio = mp3_size / size;
          console.log('[+] ', { ratio, mp3_size, size });
          if (mp3_size && ratio < 1.1 && ratio > 0.9) {
            url = mp3_url;
            ext = getExtension(url);
            LOGGER.log('[+] AUDIO_LIST.download() -> try mp3 from m3u8, url = "' + url + '"');
          }
        }
        if (ext.indexOf('m3u') !== -1) {
			LOGGER.log('[+] AUDIO_LIST.download() -> hls stream: ', url);
            source.downloadState = 'started';
            await downloadHls({
                id,
                url,
                size,
                duration,
                filename,
                context: this,
            }).catch(function(error){
                source.downloadState = 'error: ' + error;
            });
        } else {
            const that = this;
            source.downloadState = 'started';
            const promise = new Promise(function(resolve, reject){
                LOGGER.log('[+] AUDIO_LIST.download() -> file url:', url);
                const callback = function(error) {
                    return error ? reject(error) : resolve();
                };
                if (typeof GM_download === 'undefined') {
                    LOGGER.log('[+] AUDIO_LIST.downlaod() -> CHANNEL_LIST.downlaod()');
                    return CHANNEL_LIST.download({ url, id, name: filename }, callback);
                }
                const onerror = function(error) {
                    LOGGER.warn('[-] AUDIO_LIST.download() -> GM_download failed,\nfilename = "' + filename + '",\nurl = "' + url + '",\nresponse: ', error, '\nstarting Channel download..');
                    return CHANNEL_LIST.download({ url, id, name: filename }, callback);
                };
                const onload = function(response) {
                    LOGGER.log('[+] AUDIO_LIST.download() -> GM_download complete: ', response);
                    resolve();
                };
                const onprogress = function(...args) {
                    LOGGER.log('[+] AUDIO_LIST.downlaod() -> GM_download progress: ', args.length, ...args);
                    const { loaded = 0, total = 1 } = args[0] || {};
                    that.updateProgress(id, loaded / total);
                };
                LOGGER.log('[+] GM_download');
                GM_download({
                    url,
                    name: filename + '.' + getExtension(url),
                    onerror,
                    onload,
                    onprogress,
                });
            }).catch(function(error){
                source.downloadState = 'error: ' + error;
                LOGGER.error('[-] audioList.download() -> error:', error);
            });
            await promise;
        }
        if (source.downloadState.indexOf('error') === -1) {
            source.downloadState = 'complete';
        }
    };
    LOGGER.out('[+] AudioList.prototype.getMid');
    AudioList.prototype.getMid = function(id) {
        return id.match(/^(-|_)?\d+_\d+/)[0];
    };
    LOGGER.out('[+] AudioList.prototype.get');
    AudioList.prototype.get = async function requestAudio(id_s = []) {
        LOGGER.log('[+] audioList.get() -> ids:', id_s);
        if (!id_s.length) {
            return;
        }
        const self = this;
        const regex = /^(-|_)?\d+_\d+/;
        const ids = [];
        self._getEvents = self._getEvents || [];
        self._onceGet = self._onceGet || function(callback){
            self._getEvents.push(callback);
        };
        this.requested = this.requested || {};
        const promises = [];
        for (const id1 of id_s) {
            const [id2] = id1.match(regex) || [];
            const { mid, src, ext } = this.list[id2] || {};
            if (id2 && mid === id2 && src) {
                LOGGER.log('[+] audioList.get() -> audio (id = ' + id2 + ') already exists');
            } else if (this.requested[id2]) {
                LOGGER.log('[+] audioList.get() -> audio get in progress (id = ' + id2 + ')');
                promises.push(new Promise(function(resolve){
                    self._onceGet(resolve);
                }));
            } else {
                ids.push(id1);
                this.requested[id2] = true;
            }
        }
        LOGGER.log('[+] audioList.get() -> new ids:', ids);
        if (!ids.length) {
            return Promise.all(promises);
        }
        let s = requestJSON({
            method: 'POST',
            url: 'https://vk.com/al_audio.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': USER_AGENT,
                referer: location.href,
            },
            data: {
                al: 1,
                act: 'reload_audio',
                ids: ids.join(','),
            },
        }).then(function(response){
            const [, user] = response;
            if (typeof user === 'object') {
                const [uid] = Object.keys(user);
                response[1] = uid;
                if (!self.uid) {
                    self.uid = uid;
                }
            }
            try {
                LOGGER.audio('[+] audio -> response raw: ', response.length, JSON.stringify(response, null, 2));
            } catch (error) {
                LOGGER.warn('[-] audio -> error: ', error);
            }
            return response;
        });
        const keys = ['aid', 'oid', 'url', 'name', 'artist', 'duration'];
        for (let i = 0, id; i < ids.length; ++i) {
            id = ids[i];
            s = s.then(function(response){
                if (!response[0]) {
                    LOGGER.audio('[+] audioList.get() -> list: ', JSON.stringify(self.list, null, 2));
                    LOGGER.error('[-] audioList.get() -> response: ', JSON.stringify(response, null, 2), id);
                    throw new Error('Response object has invalid shape');
                }
                const item = response[0][i];
                const t = {};
                for (let k = 0, key; k < keys.length; ++k) {
                    key = keys[k];
                    TEXTAREA.innerHTML = (k === 3 && item[16]) ? (item[k] + ' (' + item[16] + ')') : item[k];
                    t[key] = TEXTAREA.value;
                }
                t.duration = +t.duration;
                t.src = self.unmask(t.url);
                t.uid = response[1];
                t.mid = t.oid + '_' + t.aid;
                t.hid = id;
                t.ext = getExtension(t.src);
                t.filename = t.artist + ' - ' + t.name;
                response[0][i] = t;
                const { audio } = MEDIA_LIST;
                audio[t.mid] = {
                    mid: t.mid,
                    url: t.src,
                    ext: t.ext,
                    name: t.filename,
                };
                return response;
            });
        }
        const [response] = await s;
        let iter = 0;
        for (const data of response) {
            LOGGER.audio('[+] audio -> response parsed:', JSON.stringify(data, null, 2));
            const { mid, ext } = data;
            this.list[mid] = data;
            this.size(mid);
            this.requested[mid] = false;
        }
        LOGGER.audio('[+] audioList.get() -> list: ', JSON.stringify(this.list, null, 2));
        if (this._getEvents) {
            this._getEvents.forEach(function(callback){
                callback();
            });
            this._getEvents.length = 0;
        }
    };
    LOGGER.out('[+] getHlsComponents');
    function getHlsComponents(hls) {
        const {
            coreComponents: [,,,, {
                segments = [],
            } = {}, {
                levels: [{
                    details: {
                        fragments = [],
                        totalduration = 0,
                    } = {},
                } = {}] = [],
            } = {}] = []
        } = hls || {};
        return { segments, fragments, totalduration };
    }

    LOGGER.out('[+] getBitrateEstimate');
    async function getBitrateEstimate(hls) {
        let idx = -1;
        const { fragments } = getHlsComponents(hls);
        LOGGER.log('[+] getBitrateEstimate() -> fragments.length:', fragments.length);
        for (let i = 0; i < fragments.length; ++i) {
            const { levelkey: { method }, duration, baseurl, relurl } = fragments[i];
            idx = (!method && duration > 1) ? i : idx;
        }
        LOGGER.log('[+] getBitrateEstimate() -> idx:', idx);
        if (idx === -1) {
            return Promise.reject(new Error('url not found'));
        }
        const { baseurl, relurl, duration } = fragments[idx];
        const url = URLToolkit.buildAbsoluteURL(baseurl, relurl);
        LOGGER.log('[+] getBitrateEstimate() -> requesting source:', url);
        const { response } = await makeRequest({ url });
        let size;
        if (response instanceof ArrayBuffer) {
            size = response.byteLength;
        } else {
            size = response.length;
        }
        size *= global.MP2T_SIZE_FACTOR;
        LOGGER.log('[+] getBitrateEstimate() -> size:', size);
        const bitrate = sizeToBitrate({ size, duration });
        LOGGER.log('[+] getBitrateEstimate() -> bitrate:', bitrate);
        return bitrate;
    }

    LOGGER.out('[+] VideoList.prototype.size');
    VideoList.prototype.size = async function(id, q) {
        LOGGER.log('[+] VIDEO_LIST.size() -> id = ' + id + ', q = ' + q);
        const data = this.list[id];
        if (!data) {
            return null;
        }
        const source = data.sources[q];
        const { duration } = data;
        const url = source.src || source.hls;
        const ext = source.ext || getExtension(url);
        LINK.href = url;
        const origin = LINK.origin;
        LOGGER.log('[+] VIDEO_LIST.size() -> start');
        LOGGER.log('[+] VIDEO_LIST.url: ', ext, url);
        if (!source.size && source.bitrate) {
            source.size = bitrateToSize({ bitrate: source.bitrate, duration });
            return source.size;
        } else if (ext && ext.indexOf('m3u') !== -1) {
            LOGGER.log('[+] VIDEO_LIST.size() -> request ' + ext + ' bitrate');
            const hls = new Hls();
            hls.loadSource(url);
            await levelLoaded(hls);
            const bitrate = await getBitrateEstimate(hls);
            hls.destroy();
            source.size = bitrateToSize({ bitrate, duration });
            source.bitrate = bitrate;
        } else {
            LOGGER.log('[+] VIDEO_LIST.size() -> request ' + ext + ' bitrate');
            const promise = new Promise(function(resolve, reject){
                if (typeof GM === 'undefined' || typeof GM.xmlHttpRequest === 'undefined' || (origin && origin.indexOf('mycdn.me') !== -1)) {
                    CHANNEL_LIST.size({ url }, function(error, size, response){
                        if (response) source.ext = source.ext || response.ext;
                        return error ? reject(error) : resolve(size);
                    });
                    return;
                }
                makeRequest({
                    method: 'HEAD',
                    url,
                    headers: {
                        'user-agent': USER_AGENT,
                        'x-requested-with': 'XMLHttpRequest',
                        referer: location.href,
                    },
                }).then(function({ headers }){
                    const { 'content-length': size, 'content-type': type } = headers;
                    source.ext = source.ext || (type ? type.split('/')[1] : null);
                    resolve(+size);
                }).catch(function (err) {
                    console.log('[?] VIDEO_LIST.size() -> retry due to error: ', err);
                    CHANNEL_LIST.size({ url }, function(error, size, response){
                        if (response) source.ext = source.ext || response.ext;
                        return error ? reject(error) : resolve(size);
                    });
                });
            }).catch(function(error){
                LOGGER.error('[-] VIDEO_LIST.size() -> error:', error);
            });
            source.size = await promise;
            source.bitrate = sizeToBitrate({ size: source.size, duration });
        }
        LOGGER.log('[+] VIDEO_LIST.size() -> size:', source.size, 'bytes');
        this.updateContent(id);
        return source.size;
    };

    LOGGER.out('[+] VideoList.prototype.get');
    VideoList.prototype.get = async function requestVideo(id) {
        LOGGER.log('[+] VIDEO_LIST.get() -> id:', id);
        const dt = this.list[id];
        if (dt && dt.quality && dt.quality.length) {
            LOGGER.log('[+] VIDEO_LIST.get() -> already exists');
            return;
        }
        const s = requestJSON({
            method: 'POST',
            url: 'https://vk.com/al_video.php',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-Requested-With': 'XMLHttpRequest',
                'User-Agent': USER_AGENT,
                referer: location.href,
            },
            data: {
                act: 'show',
                al: 1,
                al_d: 0,
                autoplay: 0,
                list: '',
                module: '',
                video: id || '',
            },
        }).then(async function(response){
            const resp = response;
            response = response.find(function(r){
                return r && typeof r.is_vk_player !== 'undefined';
            });
            if (response && response.player && response.player.type !== 'vk') {
                return { error: response.player.type + ' video' };
            }
            if (!response) {
                return { error: 'Not vk video' };
            }
            
            const t = {};
            
            if (response.is_vk_player) {
                /**
                 * {{
                 *   sources: Object.<string, { src: string, q: number, hls?: string, size?: number, bitrate?: number }>,
                 *   quality: number[],
                 *   name: string,
                 *   mid: string,
                 *   duration: number,
                 *   levels: Object.<string, { url: string, width: number, height: number, bitrate: number, name: string }>[]
                 * }}
                 */
                const [params] = response.player.params;
                const keys = ['oid', 'vid', 'viewer_id', 'duration', 'md_title', 'md_author', 'add_hash', 'action_hash', 'embed_hash', 'hls', 'hls_raw'];
                for (const key of keys) {
                    t[key] = params[key];
                }
                t.sources = {};
                t.quality = [];
                t.name = t.md_title;
                t.mid = t.oid + '_' + t.vid;
                const sources2 = {};
                const quality2 = [];
                for (const key in params) {
                    const match = key.match(/url(\d+)/);
                    if (match) {
                        const q = +match[1];
                        const src = params[key];
                        t.sources[q] = { src, q };
                        t.quality.push(q);
                    }
                    const match2 = key.match(/cache(\d+)/);
                    if (match2) {
                        const q = +match2[1];
                        const src = params[key];
                        sources2[q] = { src, q };
                        quality2.push(q);
                    }
                }
                if (quality2.length && getExtension(sources2[quality2[0]].src)) {
                    if (!t.quality.length || !getExtension(t.sources[t.quality[0]].src)) {
                        t.quality = quality2;
                        t.sources = sources2;
                    }
                }
                if (!t.hls_raw) {
                    t.quality.sort(compareNum);
                    return t;
                }
                t.levels = parseMasterPlaylist(t.hls_raw);
            } else {
                // pladform video
                const div = document.createElement('div');
                div.innerHTML = resp[1];
                const pladformIFrame = div.querySelector('iframe[src*="pladform.ru"]');
                if (!pladformIFrame) {
                    return { error: 'Not vk video' };
                }
                const { title, duration, oid, vid } = response.mvData;
                t.name = title;
                t.sources = {};
                t.quality = [];
                t.mid = oid + '_' + vid;
                t.oid = oid;
                t.vid = vid;
                t.duration = duration;
                LINK.href = pladformIFrame.src;
                const { pathname, origin } = LINK;
                const query = LINK.search.slice(1).split('&').reduce(function(acc, cur){
                    const [key, val] = cur.split('=');
                    acc[key] = val;
                    return acc;
                }, {});
                const url = `${origin}${pathname}?pl=${query.pl}&videoid=${query.videoid}`;
                const promise = new Promise(function(resolve, reject){
                    CHANNEL_LIST.fetchPladformPlaylist({ url }, function(error, response){
                        if (error) {
                            reject(error);
                        } else {
                            resolve(response);
                        }
                    });
                });
                let hls_raw;
                try {
                    hls_raw = await promise;
                } catch (e) {
                    return { error: e instanceof Error ? e.message : e };
                }
                t.levels = parseMasterPlaylist(hls_raw);
                t.hls_raw = hls_raw;
            }
            const bitrates = Object.keys(t.levels).map(function(k){ return +k; });
            t.sources = t.sources || {};
            t.quality = t.quality || [];
            const { duration } = t;
            const isEmpty = !t.quality.length;
            for (const bitrate of bitrates) {
                const level = t.levels[bitrate];
                let { height } = level;
                if (!height) {
                    continue;
                }
                const idx = t.quality.indexOf(height);
                if (isEmpty) {
                    t.quality.push(height);
                } else if (idx === -1) {
                    const dif = [];
                    for (const q of t.quality) {
                        dif.push({ q, d: Math.abs(q - height) });
                    }
                    dif.sort(function(lhs, rhs){ return lhs.d - rhs.d; });
                    ([{ q: height = height } = {}] = dif);
                }
                const source = t.sources[height] = t.sources[height] || {};
                source.hls = level.url;
                source.bitrate = bitrate;
                if (duration) {
                    source.size = bitrateToSize({ bitrate, duration });
                }
            }
            t.quality.sort(compareNum);
            const qmax = t.quality.length ? t.quality[t.quality.length - 1] : null;
            if (qmax) {
                const { src, hls } = t.sources[qmax];
                const url = src || hls;
                const { video } = MEDIA_LIST;
                video[t.mid] = {
                    mid: t.mid,
                    url,
                    ext: getExtension(url),
                    name: t.name + '.' + qmax + 'p',
                };
            }
            return t;
        }).catch(function(error){
            LOGGER.error('[-] VIDEO_LIST.get() -> error:', error);
            return { vid: null };
        });
        const data = await s;
        const { oid, vid } = data;
        if (vid === null || data.error) {
            return this.list[id] = data;
        }
        const dataId = oid + '_' + vid;
        this.list[dataId] = data;
        data.id = dataId;
        for (const q of data.quality) {
            if (!data.sources[q].size) {
                this.size(id, q); // async
            }
        }
    };
    LOGGER.out('[+] decimalResolution');
    function decimalResolution(attrName) {
        const res = DECIMAL_RESOLUTION_REGEX.exec(this[attrName]);
        if (res === null) {
            return undefined;
        }
        return {
            width: parseInt(res[1], 10),
            height: parseInt(res[2], 10)
        };
    }
    LOGGER.out('[+] decimalInteger');
    function decimalInteger(attrName) {
        const intValue = parseInt(this[attrName], 10);
        if (intValue > Number.MAX_SAFE_INTEGER) {
            return Infinity;
        }

        return intValue;
    }
    LOGGER.out('[+] parseMasterPlaylist');
    function parseMasterPlaylist(string) {
        const levels = {};
        let result;
        MASTER_PLAYLIST_REGEX.lastIndex = 0;

        while ((result = MASTER_PLAYLIST_REGEX.exec(string)) != null) {
            const level = {};

            level.url = result[2];
            const attrs = parseAttrList(result[1]);

            const resolution = decimalResolution.call(attrs, 'RESOLUTION');
            if (resolution) {
                level.width = resolution.width;
                level.height = resolution.height;
            }
            const bitrate = level.bitrate = decimalInteger.call(attrs, 'AVERAGE-BANDWIDTH') || decimalInteger.call(attrs, 'BANDWIDTH');
            level.name = attrs.NAME;

            levels[bitrate] = level;
        }
        return levels;
    }
    LOGGER.out('[+] parseAttrList');
    function parseAttrList(input) {
        let match, attrs = {};
        ATTR_LIST_REGEX.lastIndex = 0;
        while ((match = ATTR_LIST_REGEX.exec(input)) !== null) {
            let value = match[2], quote = '"';
            if (value.indexOf(quote) === 0 && value.lastIndexOf(quote) === (value.length - 1)) {
                value = value.slice(1, -1);
            }
            attrs[match[1]] = value;
        }
        return attrs;
    }
    LOGGER.out('[+] AudioList.prototype.createContent');
    AudioList.prototype.createContent = function(){
        this.contentError = jQuery('<div><code>' + DICTIONARY.intl('audioNotFound', 'Audio not found') + ' (id = <span class="content-id"></span>)</code></div>');
        this.content = jQuery('<div class="vkmd-tooltip-content" data-media="audio">' +
        '<section class="vkmd-tooltip-section content-name content-link">' +
            '<a style="text-decoration: none; color: #fff;" target="_blank"></a>' +
        '</section>' +
        // '<section class="vkmd-tooltip-section content-type"></section>' +
        '<section class="vkmd-tooltip-section content-size"></section>' +
        '<section class="vkmd-tooltip-section content-bitrate"></section>' +
        '</div>');
    };
    LOGGER.out('[+] AudioList.prototype.onclick');
    AudioList.prototype.onclick = function(event) {
        event.stopPropagation();
        event.preventDefault();
        const { currentTarget: target } = event;
        const id = jQuery(target).attr('audio-id');
        const data = AUDIO_LIST.list[id];
        if (id && data) {
            AUDIO_LIST.download(id);
        }
    };
    AudioList.prototype.activateContent = function() {
        if (!this.content) {
            this.createContent();
        }
        jQuery('section > a', this.content).on('click', this.onclick);
    };
    LOGGER.out('[+] AudioList.prototype.updateProgress');
    AudioList.prototype.updateProgress = function(id, progress, isDone) {
        const data = this.list[id];
        if (!data) {
            return;
        }
        data.progress = progress;
        if (isDone) {
            data.size = (progress * data.size);
            data.bitrate = sizeToBitrate(data);
            data.progress = 1;
        }
        if (!data.active) {
            return;
        }
        const { size } = data;
        jQuery('.content-size', this.content)
        .text('Размер: ' + (size / (1024 * 1024)).toFixed(1) + ' MB, ' + (data.progress * 100).toFixed(1) + '%');
    };
    LOGGER.out('[+] AudioList.prototype.updateContent');
    AudioList.prototype.updateContent = function(id) {
        if (!this.content) {
            this.createContent();
        }
        jQuery('.content-id', this.contentError).text(id);
        const loading = this.requested ? this.requested[id] : false;
        const data = this.list[id];
        if (!data) {
            return this.contentError;
        }
        data.active = true;
        const keys = Object.keys(this.list);
        for (const key of keys) {
            if (key !== id) {
                this.list[key].active = false;
            }
        }
        const { name, artist, duration, size = 0, src, progress = 0 } = data;
        let { ext } = data;
        ext = ext || getExtension(src);
        data.ext = ext;
        const title = (artist  && name) ? (artist + ' - ' + name) : 'unknown';
        const bitrate = Math.round(size * 8 / duration);
        const filename = title + (ext ? ('.' + ext) : '');
        // set id, url, name
        jQuery(this.content)
        .attr('data-id', id)
        .attr('data-url', src)
        .attr('data-name', title)
        .attr('data-size', size)
        .attr('data-progress', progress)
        .attr('title', filename);
        // set name
        jQuery('.content-name > a', this.content)
        .attr('href', src)
        .attr('title', filename)
        .attr('audio-id', id)
        .text(title);
        // set type
        const kbps = Math.round(bitrate / 1024);
        // jQuery('.content-type', this.content)
        // .text(DICTIONARY.intl('fileExtension') + ': ' + ext);
        if (!size) {
            jQuery('.content-size, .content-bitrate', this.content).hide();
            return this.content;
        }
        // set size
        let sizeTxt = DICTIONARY.intl('fileSize') + ': ' + (size / (1024 * 1024)).toFixed(1) + ' MB';
        sizeTxt += (progress ? (', ' + (progress * 100).toFixed(1) + '%') : '');
        jQuery('.content-size', this.content)
        .show()
        .text(sizeTxt)
        // set bitrate
        jQuery('.content-bitrate', this.content)
        .show()
        .removeClass('media-hd')
        .addClass(kbps > 300 ? 'media-hd' : '')
        .text('~' + kbps + ' kbps');
        return this.content;
    };
    LOGGER.out('[+] VideoList.prototype.createContent');
    VideoList.prototype.createContent = function(){
        this.contentError = jQuery('<div><code>' + DICTIONARY.intl('videoNotFound', 'Video not found') + ' (id = <span class="content-id"></span>)</code></div>');
        let html = '<div class="vkmd-tooltip-content" data-media="video">';
        for (let i = 0; i < 8; ++i) {
            html += '<section class="vkmd-tooltip-section">' +
            '<a style="color: #fff; text-decoration: none;"></a>' +
            '</section>';
        }
        html += '</div>';
        this.content = jQuery(html);
    };
    LOGGER.out('[+] VideoList.prototype.onmouseenter');
    VideoList.prototype.onmouseenter = function(event) {
        const { currentTarget: target } = event;
        const id = jQuery(target).attr('data-id');
        const data = VIDEO_LIST.list[id];
        if (!id || !data) {
            return;
        }
        const q = jQuery(target).attr('data-quality');
        const source = data.sources[q];
        if (source.size) {
            return;
        }
        const url = jQuery(target).attr('data-url');
        const name = jQuery(target).attr('data-name');
        VIDEO_LIST.size(id, +q);
    };
    LOGGER.out('[+] VideoList.prototype.onclick');
    VideoList.prototype.onclick = function(event) {
        event.stopPropagation();
        event.preventDefault();
        const { currentTarget: target } = event;
        const id = jQuery(target).attr('data-id');
        const data = VIDEO_LIST.list[id];
        if (!id || !data || data.error) {
            return;
        }
        const q = jQuery(target).attr('data-quality');
        const { downloadState = 'void' } = data.sources[q];
        VIDEO_LIST.download(id, +q);
    };
    LOGGER.out('[+] VideoList.prototype.updateProgress');
    VideoList.prototype.updateProgress = function(id, q, progress) {
        const data = this.list[id];
        if (!data) {
            return;
        }
        const source = data.sources[q];
        if (!source) {
            LOGGER.warn('[+] VIDEO_LIST.updateProgress() -> warning: sources[' + q + '] not found');
            return;
        }
        source.progress = progress;
        if (!data.active) {
            return;
        }
        const { size } = source;
        let sizeHTML = size ? ' (' + (size / (1024 * 1024)).toFixed(1) + ' MB)' : '';
        sizeHTML += progress ? (', ' + (progress * 100).toFixed(1) + '%') : '';
        jQuery('[data-quality="' + q + '"] a', this.content)
        .text(q + 'p' + sizeHTML);
    };
    LOGGER.out('[+] downloadHls');
    async function downloadHls({ url, id, filename, size, duration, context, q }) {
        LOGGER.log('[+] downloadHls()..');
        if (size && size > global.HLS_MAX_SIZE) {
            LOGGER.warn('[+] downloadHls() -> warning: max size (' + global.HLS_MAX_SIZE + ' bytes) reached, filesize (' + size + ' bytes), download rejected');
            return;
        }
        if (duration && duration > global.HLS_MAX_DURATION) {
            LOGGER.warn('[+] downloadHls() -> warning: max duration (' + global.HLS_MAX_DURATION + ' seconds) reached, file duration (' + duration + ' seconds), downloading rejected');
            return;
        }
        if (q && !global.DOWNLOAD_TS) {
            LOGGER.warn('[+] downloadHls() -> warning: hls video downloading rejected');
            return;
        }
        if (global.DOWNLOAD_TS) {
            const args = q ? [id, q] : [id];
            const progress = function({ loaded = 0, total = 1 }) {
                context.updateProgress(...args, loaded / total);
            };
            const promise = DOWNLOADER.download(url, filename, progress);
            try {
                await promise;
            } catch(error) {
                LOGGER.error('[-] downlaodHls.DOWNLOADER:', DOWNLOADER);
                LOGGER.error('[-] downlaodHls.error:', error);
            }
            return;
        }
        const config = {};
        if (size && duration) {
            config.maxBufferLength = duration + 5;
            config.maxMaxBufferLength = duration + 60;
            config.maxBufferSize = size + 1024;
        }
        LOGGER.log('[+] downloadHls() -> creating hls');
        const hls = new Hls(config);
        LOGGER.log('[+] downloadHls() -> loading source');
        hls.loadSource(url);
        let progress = 0;
        let flag = 0;
        let timerId;
        const audioBuffer = [];
        const videoBuffer = [];
        LOGGER.log('[+] downloadHls() -> hlsConfig:', config);
        const forceLoad = function() {
            hls.stopLoad();
            const { media } = hls;
            if (!media) {
                return;
            }
            const { buffered } = media;
            if (!buffered.length) {
                return;
            }
            const { length: size } = buffered;
            media.currentTime = buffered.end(size - 1);
            LOGGER.log('[+] downloadHls() -> continue load at:', media.currentTime);
            hls.startLoad(media.currentTime);
        };
        let iter = 0;
        hls.on(Hls.Events.FRAG_DECRYPTED, function(evname, data) {
            LOGGER.log('[+] downloadHls() -> frag decrypted', (iter + 1), data);
        });
        hls.on(Hls.Events.BUFFER_APPENDING, function(evname, { data, content, type }) {
            if (content !== 'data') {
                LOGGER.log('[+] downloadHls() -> rejected content:', content, data.length, data);
                return;
            }
            clearTimeout(timerId);
            progress += data.length;
            ++iter;
            const { buffered } = hls.media;
            let end;
            if (buffered.length) {
                end = buffered.end(buffered.length - 1);
            }
            LOGGER.log('[+] downloadHls() ->', pad(iter, 3), pad(data.length, 6), pad(progress, 7), end, data);
            const factor = progress / (size || 1);
            if (q) {
                context.updateProgress(id, q, factor);
            } else {
                context.updateProgress(id, factor);
            }
            if (type === 'audio' && iter % 2 === 0) {
                audioBuffer.push(data.buffer);
            } else if (type === 'video' && iter % 2 === 0) {
                videoBuffer.push(data.buffer);
            }
            timerId = setTimeout(forceLoad, 3000);
        });
        const promise = new Promise(function(resolve){
            hls.on(Hls.Events.BUFFER_EOS, function() {
                clearTimeout(timerId);
                const { buffered } = hls.media;
                let end;
                if (buffered.length) {
                    end = buffered.end(buffered.length - 1);
                }
                const factor = progress / (size || 1);
                LOGGER.log('[+] downloadHls() -> on buffer eos:', factor);
                if (factor < global.MP2T_SIZE_FACTOR || factor > (1 / global.MP2T_SIZE_FACTOR) ) {
                    const args = [progress, ', size:', size, (factor * 100).toFixed(1), '%'];
                    LOGGER.warn('[+] downloadHls() -> end progress:', ...args);
                }
                context.updateProgress(id, factor, true);
                LOGGER.log('[+] downloadHls() -> download complete');
                const { fragments } = getHlsComponents(hls);
                LOGGER.log('[+] levelLoaded() -> fragments:', fragments.length, fragments);
                LOGGER.log('[+] levelLoaded() -> iterations:', iter, end);
                resolve();
            });
        });
        const [video] = jQuery('<video style="display:none" muted autoplay></video>')
        .appendTo('body');
        hls.attachMedia(video);
        await promise;
        const suffix = audioBuffer.length && videoBuffer.length ? '.part' : '';
        if (audioBuffer.length) {
            await downloadBuffer(audioBuffer, filename + suffix, 'mp3');
        }
        if (videoBuffer.length) {
            await downloadBuffer(videoBuffer, filename + suffix, 'mp4');
        }
        hls.detachMedia();
        hls.destroy();
        LOGGER.log('[+] downloadHls() -> destroy hls');
        jQuery(video).remove();
    }
    LOGGER.out('[+] downloadBuffer');
    async function downloadBuffer(buffer, filename, ext, type = 'application/octet-stream') {
        const blob = new Blob(buffer, { type });
        const wURL = window.URL || window.webkitURL;
        const resource = wURL.createObjectURL(blob);
        const [link] = jQuery('<a></a>')
        .attr('download', filename + '.' + ext)
        .appendTo('body')
        link.href = resource;
        link.click();
        await delay(200);
        wURL.revokeObjectURL(resource);
        jQuery(link).remove();
    }
    LOGGER.out('[+] VideoList.prototype.download');
    VideoList.prototype.download = async function(id, q) {
        const data = this.list[id];
        if (!data) {
            return null;
        }
        const { duration, name } = data;
        const source = data.sources[q];
        const { downloadState = 'void', src, hls, size = 0 } = source;
        if (downloadState === 'started') {
            return;
        }
        const url = src || hls;
        const ext = source.ext || getExtension(url);
        const filename = name + '.' + q + 'p';
        LOGGER.log('[+] VIDEO_LIST.download()..');
        if (ext && ext.indexOf('m3u') !== -1) {
            source.downloadState = 'started';
            LOGGER.log('[+] VIDEO_LIST.download() -> ' + ext);
            await downloadHls({
                id,
                q,
                url,
                size,
                duration,
                filename,
                context: this,
            }).catch(function(error){
                source.downloadState = 'error: ' + error;
            });
        } else {
            const that = this;
            LOGGER.log('[+] VIDEO_LIST.download() -> ' + ext);
            source.downloadState = 'started';
            const promise = new Promise(function(resolve, reject){
                const callback = function(error) {
                    return error ? reject(error) : resolve();
                };
                if (typeof GM_download === 'undefined') {
                    return CHANNEL_LIST.download({ url, id, prop: q, name: filename, ext }, callback);
                }
                const onerror = function(error) {
                    LOGGER.warn('[-] VIDEO_LIST.download() -> GM_download failed,\nfilename = "' + filename + '",\nurl = "' + url + '",\nresponse: ', error, '\nstarting Channel download');
                    return CHANNEL_LIST.download({ url, id, prop: q, name: filename, ext }, callback);
                };
                const onload = function(response) {
                    LOGGER.log('[+] VIDEO_LIST.download() -> GM_download complete: ', response);
                    resolve();
                };
                const onprogress = function(...args) {
                    LOGGER.log('[+] VIDEO_LIST.downlaod() -> GM_download progress: ', args.length, ...args);
                    const { loaded = 0, total = 1 } = args[0] || {};
                    that.updateProgress(id, q, loaded / total);
                };
                LOGGER.log('[+] GM_download');
                GM_download({
                    url,
                    name: filename + '.' + (source.ext || getExtension(url)),
                    onerror,
                    onload,
                    onprogress,
                });
            }).catch(function(error){
                source.downloadState = 'error: ' + error;
                LOGGER.error('[-] VIDEO_LIST.download() -> error:', error);
            });
            await promise;
        }
        if (source.downloadState.indexOf('error') === -1) {
            source.downloadState = 'complete';
        }
    };
    LOGGER.out('[+] VideoList.prototype.activateContent');
    VideoList.prototype.activateContent = function(){
        if (!this.content) {
            this.createContent();
        }
        const that = this;
        jQuery('section', this.content)
        .each(function(index, section) {
            jQuery(section)
            .on('mouseenter', that.onmouseenter)
            .on('click', that.onclick);
        });
    };
    LOGGER.out('[+] VideoList.prototype.updateContent');
    VideoList.prototype.updateContent = function(id) {
        if (!this.content) {
            this.createContent();
            console.warn('content deleted?');
        }
        jQuery('.content-id', this.contentError).text(id);
        const data = this.list[id];
        if (!data || data.error) {
            jQuery('code', this.contentError).text((data && data.error) || DICTIONARY.intl('videoNotFound', 'Video not found'));
            return this.contentError;
        }
        const keys = Object.keys(this.list);
        for (const key of keys) {
            if (key !== id) {
                this.list[key].active = false;
            }
        }
        data.active = true;
        const { quality = [], md_title } = data;
        const $sections = jQuery('section', this.content);
        let i = 0;
        for (; i < quality.length; ++i) {
            const q = +quality[i];
            let { size = 0, src, hls, progress = 0, ext } = data.sources[q];
            const url = src || hls;
            ext = ext || getExtension(url);
            data.sources[q].ext = ext;
            const title = md_title + '.' + q + 'p';
            const filename = title + (ext ? ('.' + ext) : '');
            const section = $sections[i];
            let sizeHTML = size ? ' (' + (size / (1024 * 1024)).toFixed(1) + ' MB)' : '';
            sizeHTML += progress ? (', ' + (progress * 100).toFixed(1) + '%') : '';
            // set id, url, quality, name
            jQuery(section)
            .show()
            .removeClass('media-hd')
            .addClass(q > 480 ? 'media-hd' : '')
            .attr('data-id', id)
            .attr('data-url', url)
            .attr('data-quality', q)
            .attr('data-name', title)
            .attr('title', filename);
            // set url, title, quality, size
            jQuery('a', section)
            .attr('href', url)
            .attr('title', filename)
            .text(q + 'p' + sizeHTML);
        }
        for (; i < $sections.length; ++i) {
            const section = $sections[i];
            jQuery(section).hide();
        }
        return this.content;
    };
    LOGGER.out('[+] AudioList.prototype.getall');
    AudioList.prototype.getall = async function requestAudioAll(begin, end) {
        LOGGER.log('[+] AUDIO_LIST.getall()');
        const self = this;
        const slice = Array.prototype.slice;
        const audios = jQuery('.audio_row').slice(begin || 0, end || undefined);
        const ids = [];
        for (let i = 0; i < audios.length; i += 10) {
            const ids_partial = audios.slice(i, i + 10).map(getAudioId).get();
            ids.push(ids_partial);
        }
        LOGGER.log('[+] AUDIO_LIST.getall() -> ids:', ids);
        return ids.reduce(function(s, id){
            return s.then(function(){
                return self.get(id);
            });
        }, Promise.resolve());
    };
    LOGGER.out('[+] VideoList.prototype.getall');
    VideoList.prototype.getall = async function requestVideoAll(begin, end) {
        LOGGER.log('[+] VIDEO_LIST.getall()');
        const self = this;
        const classes = [
            'video_box_wrap',
            'video_item',
            'mv_playlist',
            'mv_info_narrow_column',
        ];
        const videos = jQuery('.' + classes.join(', .')).slice(begin || 0, end || undefined);
        LOGGER.log('[+] VIDEO_LIST.getall() -> videos:', videos.length);
        const ids = [];
        for (let i = 0; i < videos.length; i += 10) {
            const ids_partial = videos.slice(i, i + 10).map(function(idx, el){ return jQuery(el).attr('data-id'); }).get();
            ids.push(ids_partial);
        }
        LOGGER.log('[+] VIDEO_LIST.getall() -> ids:', ids);
        return ids.reduce(function(s, id){
            return s.then(function(){
                return id.reduce(function(_s, _id){
                    return _s.then(function(){
                        return self.get(_id);
                    }).catch(function(error){
                        LOGGER.error('[-] VIDEO_LIST.getall() -> error:', error);
                    });
                }, Promise.resolve())
                .then(function(){
                    const msec = 3000;
                    LOGGER.log('[+] VIDEO_LIST.getall() -> waiting for ' + (msec/1000) + ' seconds..');
                    return delay(msec);
                });
            });
        }, Promise.resolve());
    };
    LOGGER.out('[+] getAudioId');
    function getAudioId(index, element){
        const id = jQuery(element).attr('data-full-id');
        try {
            const audio = JSON.parse(jQuery(element).attr('data-audio'));
            const match = audio[13].match(/[0-9a-zA-Z]+/g);
            const result = id + '_' + (match.length <= 3 ? match.slice(match.length - 2) : match.slice(-3, -1)).join('_');
            LOGGER.log('[+] getAudioId() -> id: ', id, ', hash: ', match, ', result_id: ', result, ', audio[13]: ', audio[13]);
            return result;
        } catch (error) {
            LOGGER.warn('[+] getAudioId() -> data:', jQuery(element).attr('data-audio'));
            LOGGER.warn('[-] getAudioId() -> warning:', error.message);
        }
        return id;
    }
    LOGGER.out('[+] requestJSON');
    function requestJSON(details) {
        return makeRequest(details).then(parseJSON);
    }
    LOGGER.out('[+] parseJSON');
    function parseJSON({ response, headers }) {
        try {
            LOGGER.ajax('[+] parseJSON() -> content-type: ', headers['content-type']);
            if (headers['content-type'] && headers['content-type'].indexOf('application/json') !== -1) {
                let payload;
                const json = JSON.parse(response, function(key, val){
                    if (key === 'payload') payload = val;
                    return val;
                });
                LOGGER.ajax('[+] parseJSON() -> response: ', response);
                if (Array.isArray(payload)) {
                    return payload[1];
                } else if (Array.isArray(json.payload)) {
                    return json.payload[1];
                } else {
                    LOGGER.warn('[-] ajax() -> response is not iterable', JSON.stringify(json, null, 2));
                }
            }
        } catch (error) {
            LOGGER.warn('[-] ajax() -> warning: ', error);
        }
        const results = [];
        let idx = response.indexOf('<!json>');
        let idx2;
        let txt;
        while (idx !== -1) {
            idx2 = response.indexOf('<!>', idx + 7);
            if( idx2 === -1 )
                break;
            results.push(JSON.parse(response.slice(idx + 7, idx2)));
            idx = response.indexOf('<!json>', idx2);
        }
        try {
            LOGGER.ajax('[+] ajax() -> json parsed: ', JSON.stringify(results, null, 2));
        } catch (error) {
            LOGGER.warn('[-] ajax() -> warning: ', error);
        }
        return results;
    }
    LOGGER.out('[+] extend');
    function extend(target, ...args) {
        target = target || {};
        for (const elm of args) {
            if (!elm) {
                continue;
            }
            for (const key of Object.keys(elm)) {
                target[key] = elm[key];
            }
        }
        return target;
    }
    LOGGER.out('[+] makeRequest');
    async function makeRequest(_details, forceGM = false) {
        const details = extend({
            method: 'GET',
            url: '/',
            data: null,
            headers: {},
        }, _details);
        LOGGER.log('[+] makeRequest() -> url:', forceGM, details.url);
        LOGGER.log('[+] makeRequest() -> details:', details);
        const { method, url, headers, data: dataObj, responseType } = details;
        details.data = !dataObj ? null : Object.keys(dataObj).map(function(key){ return key + '=' + dataObj[key]; }).join('&');
        const handler = {};
        const promise = new Promise(function(resolve, reject) {
            handler.resolve = resolve;
            handler.reject = reject;
        });
        details.onload = function(event){
            const { target = event } = event;
            const { status, statusText } = target;
            const response = !target.responseType || target.responseType.toLowerCase() === 'text' ? target.responseText : target.response;
            const trim = function(str) { return str && str.trim(); };
            const { responseHeaders = target.getAllResponseHeaders() } = target;
            const headers = responseHeaders
            .trim()
            .split('\n')
            .reduce(function(heads, s){
                const [key, val] = s.split(/\:/).map(trim);
                if (key && val) {
                    heads[key.toLowerCase()] = val.toLowerCase();
                }
                return heads;
            }, {});
            LOGGER.log('[+] makeRequest() -> status:', status, url);
            if (status === 200) {
                try {
                    const { length: len = response.byteLength } = response;
                    LOGGER.ajax('[+] ajax() -> response: ', len, len < 1100 ? response : response.slice(0, 1100));
                } catch (error) {}
                return handler.resolve({ response, headers });
            } else {
                const error = new Error('request error status: ' + status);
                error.code = status;
                LOGGER.error('[-] makeRequest() -> error:', error);
                return handler.reject(error);
            }
        };
        details.onerror = function(event){
            const { target = event } = event || {};
            const status = target ? target.status : 'unknown';
            let response;
            if (target) {
                response = !target.responseType || target.responseType.toLowerCase() === 'text' ? target.responseText : target.response;
            }
            const error = new Error('network error');
            LOGGER.error('[-] makeRequest() -> error:', error, { status, url, response });
            handler.reject(error);
        };
        if (details.timeout) {
            details.ontimeout = function(event) {
                const error = new Error('timeout');
                LOGGER.error('[-] makeRequest() -> timeout:', error);
                handler.reject(error);
            };
        }
        if (forceGM || Object.keys(details.headers).find(function(key){ return key.toLowerCase() === 'user-agent'; })) {
            if (!forceGM && (!global.USE_CUSTOM_UA || SCRIPT_HANDLER === 'violentmonkey')) {
                const keys = Object.keys(details.headers);
                let idx = keys.findIndex(function(key){ return key.toLowerCase() === 'user-agent'; });
                if (idx !== -1) {
                    delete details.headers[keys[idx]];
                }
                if (details.headers) {
                    delete details.headers.referer;
                }
            } else if (typeof GM !== 'undefined' && typeof GM.xmlHttpRequest !== 'undefined') {
                LOGGER.log('[+] GM.xmlHttpRequest');
                GM.xmlHttpRequest(details);
                return promise;
            } else if (typeof GM_xmlhttpRequest !== 'undefined') {
                LOGGER.log('[+] GM_xmlhttpRequest');
                GM_xmlhttpRequest(details);
                return promise;
            } else {
                LOGGER.warn('[*] makeRequest() -> GM API not found');
                const keys = Object.keys(details.headers);
                let idx = keys.findIndex(function(key){ return key.toLowerCase() === 'user-agent'; });
                if (idx !== -1) {
                    delete details.headers[keys[idx]];
                }
                if (details.headers) {
                    delete details.headers.referer;
                }
            }
        }
        let request;
        if (window.XMLHttpRequest) {
            LOGGER.log('[+] new XMLHttpRequest');
            request = new XMLHttpRequest();
        } else if (window.ActiveXObject) {
            LOGGER.log('[+] new ActiveXObject(Msxml2.XMLHTTP.6.0)');
            request = new ActiveXObject('Msxml2.XMLHTTP.6.0');
        } else {
            throw new Error('AJAX API not found');
        }
        request.open(method, url, true);
        LOGGER.log('[+] new XMLHttpRequest.headers: ', headers);
        for (const key in headers) {
            request.setRequestHeader(key, headers[key]);
        }
        if (responseType) {
            request.responseType = responseType;
        }
        if (details.timeout) {
            request.timeout = details.timeout;
            request.ontimeout = details.onload;
        }
        request.onload = details.onload;
        request.onerror = details.onerror;
        request.send(details.data);
        return promise;
    }
    //------------------------------ REQUEST API ------------------------------//
    //-------------------------------------------------------------------------//
    LOGGER.out('[+] saveMediaList');
    function saveMediaList() {
        LOGGER.log('[+] saveMediaList()');
        const { audio, video } = MEDIA_LIST;
        LOGGER.log('[+] saveMediaList() -> audio:', audio);
        LOGGER.log('[+] saveMediaList() -> video:', video);
        let txt = '';
        txt += saveMediaList1(audio);
        txt += saveMediaList1(video);
        if (txt) {
            LOGGER.log('[+] saveTextFile()');
            LOGGER.log('[+] saveTextFile() -> text:', txt);
            saveTextFile(txt, 'vkmd.urls.' + (new Date().toISOString()) + '.txt');
        }
    }
    LOGGER.out('[+] saveMediaList1');
    function saveMediaList1(media) {
        LOGGER.log('[+] saveMediaList1(media)');
        let txt = '';
        for (const mid of Object.keys(media)) {
            const { url, name, ext, saved = false } = media[mid];
            if (saved || ext.indexOf('m3u') !== -1) {
                continue;
            }
            const t = createAria2Text(url, name, ext);
            LOGGER.log('[+] saveMediaList1() -> txt:', t);
            txt += t + '\r\n';
            media[mid].saved = true;
        }
        return txt;
    }
    LOGGER.out('[+] saveTextFile');
    function saveTextFile(text, filename, type) {
     	const blob = new Blob(Array.isArray(text) ? text : [text], { type: type || 'text/plain' });
        const wURL = window.URL || window.webkitURL;
        const resource = wURL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = resource;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setTimeout(function(){
            wURL.revokeObjectURL(resource);
        }, 1e3);
    }
    LOGGER.out('[+] createAria2Text');
    function createAria2Text(url, name, ext) {
        return url + ' --out="' + name.replace(/[\/]+/g, '-') + '.' + ext + '"';
    }
    LOGGER.out('[+] updateMediaList');
    function updateMediaList() {
        LOGGER.log('[+] updateMediaList()');
        return Promise.all([
            VIDEO_LIST.getall(0, 20),
            AUDIO_LIST.getall(0, 20),
        ]).catch(function(error) {
            LOGGER.error('[-] updateMediaList() -> error:', error);
        });
    }
    LOGGER.out('[+] keyboardListener');
    function keyboardListener(e) {
        LOGGER.keydown('[*] keydown: ', JSON.stringify({
            altKey: e.altKey, code: e.which || e.keyCode, symbol: String.fromCharCode(e.which || e.keyCode).toUpperCase(),
        }, null, 2));
        if( !e.altKey ) {
            return;
        }
        const charCode = e.which || e.keyCode;
        const c = String.fromCharCode(charCode).toUpperCase();
        switch (c) {
            case 'A':
                updateMediaList();
                break;
            case 'S':
                saveMediaList();
                break;
            case 'R':
                activateNodes();
                break;
            default:
                LOGGER.keydown('[*] keydown: invalid');
                if (charCode !== 18) {
                    LOGGER.warn('[+] keyboardListener() -> warning, invalid key pressed, code = ' + charCode + ', string = ' + c);
                }
        }
	}
    LOGGER.out('[+] activateKeyboard');
    function activateKeyboard() {
        window.addEventListener('keydown', keyboardListener);
    }
    LOGGER.out('[+] configHls');
    function configHls() {
        Hls.DefaultConfig.maxBufferLength = 600; // seconds
        Hls.DefaultConfig.maxBufferSize = 256 * 1024 * 1024; // bytes
        Hls.DefaultConfig.maxMaxBufferLength = 1200; // seconds
        LOGGER.log('[+] Hls.prototype.levelLoaded');
        Hls.prototype.levelLoaded = function() {
            return levelLoaded(this);
        };
    }
    async function levelLoaded(hls) {
        if (!hls) {
            throw new Error('hls is undefined');
        }
        const { fragments } = getHlsComponents(hls);
        if (fragments.length) {
            return;
        }
        return new Promise(function(resolve){
            const listener = function(){
                hls.off(Hls.Events.LEVEL_LOADED, listener);
                const { fragments } = getHlsComponents(hls);
                LOGGER.log('[+] levelLoaded() -> fragments:', fragments.length, fragments);
                resolve();
            };
            hls.on(Hls.Events.LEVEL_LOADED, listener);
        });
    }
    LOGGER.out('[+] DOMReady');
    function DOMReady(callback) {
        switch (document.readyState) {
            case 'loading':
                document.addEventListener('DOMContentLoaded', callback);
                break;
            case 'interactive':
            case 'complete':
                callback();
                break;
            default:
                LOGGER.warn('[+] DOMReady() -> unknown state:', document.readyState);
        }
    }
    LOGGER.out('[+] createIcon');
    function createIcon() {
        return {
            index: 824,
            data: "PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiB4bWxuczp4bGluaz0iaHR0cDovL3d3dy53My5vcmcvMTk5OS94bGluayIgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4PSIwcHgiIHk9IjBweCIgd2lkdGg9IjE2cHgiIGhlaWdodD0iMTZweCIgdmlld0JveD0iMCAwIDQzMy41IDQzMy41IiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA0MzMuNSA0MzMuNTsiIHhtbDpzcGFjZT0icHJlc2VydmUiPgo8Zz4KCTxnIGlkPSJmaWxlLWRvd25sb2FkIj4KCQk8cGF0aCBkPSJNMzk1LjI1LDE1M2gtMTAyVjBoLTE1M3YxNTNoLTEwMmwxNzguNSwxNzguNUwzOTUuMjUsMTUzeiBNMzguMjUsMzgyLjV2NTFoMzU3di01MUgzOC4yNXoiIGZpbGw9IiM4MDgwODAiLz4KCTwvZz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8Zz4KPC9nPgo8L3N2Zz4K",
            prefix: "data:image/svg+xml;utf8;base64,",
            color: function(c){
                if( !c || c.length != 7 )
                    c = '#808080';
                c = btoa('"' + c + '"');
                return this.prefix + this.data.slice(0, this.index) + c + this.data.slice(this.index + c.length);
            },
        };
    }
    LOGGER.out('[+] addIcon');
    function addIcon(icon) {
        const s = jQuery('<style class="my-test-class" type="text/css"></style>')
        .text(`
        .ui-widget-content {
            background: #000 !important;
            opacity: 0.8 !important;
        }
        .ui-corner-all {
            border-radius: 4px !important;
        }
        .my-test-class,
        .audio_row__download ,
        ._audio_row__download {
            background: url(${icon.color("#808080")}) no-repeat !important;
            position: relative;
            top: 5px;
        }
        .video_item.video_can_download #download{
            display: inline-block;
        }
        .my-test-class ,
        .video_thumb_actions .icon.icon_download {
            background: url(${icon.color('#ffffff')}) no-repeat !important;
        }
        div.video_thumb_action_download {
            display: inline-block;
        }
        .my-test-class ,
        .videoplayer_btn_download {
            background-image: url(${icon.color('#ffffff')});
            background-repeat: no-repeat;
            background-position: 3px;
            border-radius: 3px;
            left: 0;
            bottom: 0;
            z-index: 10;
            width: 18px;
            height: 18px;
            padding: 2px;
            transform: scale(1.1);
        }
        .mv_recom_item_download ,
        .mv_playlist_item_download {
            background-image: url(${icon.color('#ffffff')});
            background-repeat: no-repeat;
            background-color: #000;
            background-position: 3px;
            border-radius: 3px;
            position: absolute;
            left: 0;
            bottom: 0;
            z-index: 10;
            width: 18px;
            height: 18px;
            padding: 2px;
            opacity: 0.7;
        }
        .mv_recom_item_download:hover ,
        .mv_playlist_item_download:hover {
            opacity: 1 !important;
        }
        .media-hd:after{
            content: 'HD';
            padding-left: 3px;
            opacity: 0.7;
        }
        .ui-tooltip {
            z-index: 999999 !important;
        }
        .vkmd-tooltip-section {
            cursor: pointer;
            padding: 5px;
            opacity: 0.8;
            color: #fff;
        }
        .vkmd-tooltip-section:hover {
            opacity: 1;
            border-style: solid;
            border-width: 1px;
            padding: 4px;
        }
        .vkmd-tooltip-section[data-media="audio"] {
            opacity: 1;
        }`)
        .appendTo('head');
        return s[0];
    }
    LOGGER.out('[+] makeTooltip');
    function makeTooltip({
        selector = document,
        items,
        open = dummy,
        content = DICTIONARY.intl('loading'),
        classes = {},
        position: { my = 'right top+10', at = 'right bottom', collision = 'flipfit' } = {},
    }) {
        jQuery(selector).tooltip({
            items,
            content,
            show: null,
            track: true,
            position: { my, at, collision },
            open: function (event, ui) {
                LOGGER.att('[+] makeTooltip() -> open()..');
                if (typeof event.originalEvent === 'undefined') {
                    LOGGER.att('[-] makeTooltip() -> can not open tooltip');
                    return false;
                }
                const id = jQuery(ui.tooltip).attr('id');
                jQuery(ui.tooltip).removeClass('ui-widget-shadow');
                jQuery('div.ui-tooltip').not('#' + id).remove();
                const { 'ui-tooltip': ui_tooltip = '', 'ui-tooltip-content': ui_tooltip_content = '' } = classes;
                ui.tooltip.addClass(ui_tooltip);
                jQuery('.ui-tooltip-content', ui.tooltip).addClass(ui_tooltip_content);
                // ajax function to pull in data and add it to the tooltip goes here
                LOGGER.att('[+] makeTooltip() -> opening tooltip..');
                open.call(this, event, ui);
            },
            close: function (event, ui) {
                ui.tooltip.hover(function() {
                    jQuery(this).stop(true).fadeTo(40000, 1); 
                },
                    function() {
                    jQuery(this).fadeOut('40000', function() {
                        jQuery(this).remove();
                    });
                });
            },
        });
    }
    LOGGER.out('[+] openVideoTooltip');
    async function openVideoTooltip(event, ui, selector) {
        const { currentTarget, target } = event.originalEvent;
        // get video id
        const id = jQuery(currentTarget).attr('data-id') || jQuery(target).attr('data-id');
        if (!id) {
            LOGGER.warn('[-] makeVideoTooltip() -> open, video id not found');
            LOGGER.warn('[-] makeVideoTooltip() -> open, currentTarget', currentTarget);
            LOGGER.warn('[-] makeVideoTooltip() -> open, target', target);
            return;
        }
        const $outContent = jQuery('.ui-tooltip-content', ui.tooltip);
        if (!VIDEO_LIST.list[id]) {
            // get video data
            $outContent.text(DICTIONARY.intl('loading'));
            await VIDEO_LIST.get(id);
        }
        // update video tooltip content
        const content = VIDEO_LIST.updateContent(id);
        $outContent.text('');
        $outContent.append(content);
        $outContent.append(content);
        VIDEO_LIST.activateContent();
    }
    LOGGER.out('[+] makeVideoTooltip');
    function makeVideoTooltip(node) {
        const [vkmd] = jQuery('.vkmd-tooltip', node);
        const $child = jQuery(node).children(':first');
        if (vkmd || !$child.length) {
            return;
        }
        $child.attr('class', 'vkmd-tooltip');
        const items = '.videoplayer_btn_download, .mv_recom_item_download, .mv_playlist_item_download, .video_thumb_action_download';
        makeTooltip({
            selector: node,
            items,
            open: openVideoTooltip,
            content: function(){
                if (VIDEO_LIST.list[VIDEO_LIST.currentId]) {
                    VIDEO_LIST.updateContent(VIDEO_LIST.currentId);
                    return VIDEO_LIST.content.html();
                } else {
                    return DICTIONARY.intl('loading');
                }
            }
        });
    }
    LOGGER.out('[+] openAudioTooltip');
    async function openAudioTooltip(event, ui) {
        LOGGER.att('[+] openAudioTooltip()..');
		if (!event.originalEvent) {
			LOGGER.att('[-] openAudioTooltip() -> error: ', new Error('event.originalEvent not found'));
		}
        const { target, currentTarget } = event.originalEvent;
		LOGGER.att('[+] openAudioTooltip() -> target: ', target, '\n', currentTarget);
		if (!target && !currentTarget) {
			LOGGER.att('[-] openAudioTooltip() -> error: ', new Error('target and currentTarget not found'));
		}
        const [audio] = jQuery(target).parents('.audio_row');
		if (!audio) {
			LOGGER.att('[-] openAudioTooltip() -> error: ', new Error('.audio_row not found'));
		} else {
			LOGGER.att('[+] openAudioTooltip() -> .adio_row: ', audio);
		}
        const fullId = jQuery(audio).attr('data-full-id');
		LOGGER.att('[+] openAudioTooltip() -> fullId: ', fullId);
        let data;
        if (fullId) {
            data = AUDIO_LIST.list[fullId];
        }
        const $outContent = jQuery('.ui-tooltip-content', ui.tooltip);
        if (!data) {
            $outContent.text(DICTIONARY.intl('loading'));
            const id = getAudioId(null, audio);
			LOGGER.audio('[+] openAudioTooltip() -> loading data, id = %s', id);
            await AUDIO_LIST.get([id]);
        }
		LOGGER.audio('[+] openAudioTooltip() -> data: ', data);
        const content = AUDIO_LIST.updateContent(fullId);
        $outContent.text('');
        $outContent.append(content);
        if (AUDIO_LIST.activateContent) {
            AUDIO_LIST.activateContent(fullId);
        }
    }
    LOGGER.out('[+] makeAudioTooltip');
    function makeAudioTooltip(node) {
        LOGGER.att('[+] makeAudioTooltip()..', node);
        makeTooltip({
            selector: node,
            items: 'button.audio_row__download',
            content: function(){
                if (AUDIO_LIST.list[AUDIO_LIST.currentId]) {
                    AUDIO_LIST.updateContent(AUDIO_LIST.currentId);
                    return AUDIO_LIST.content.html();
                } else {
                    return DICTIONARY.intl('loading');
                }
            },
            open: openAudioTooltip,
        });
    }
    LOGGER.out('[+] getExtension');
    function getExtension(url) {
        try {
            return getLocation(url, 'pathname').match(SOURCE_EXTENSION_REGEX)[1];
        } catch (error) {
            return null;
        }
    }
    LOGGER.out('[+] getOS');
    function getOS() {
        const { userAgent, platform } = window.navigator;
        if (['Macintosh', 'MacIntel', 'MacPPC', 'Mac68K'].indexOf(platform) !== -1) {
            return 'MacOS';
        }
        if (['iPhone', 'iPad', 'iPod', 'iPhone Simulator', 'iPad Simulator', 'iPod Simulator'].indexOf(platform) !== -1) {
            return 'iOS';
        }
        if (['Win32', 'Win64', 'Windows', 'WinCE'].indexOf(platform) !== -1) {
            return 'Windows';
        }
        if (/Linux/.test(platform)) {
            return 'Linux';
        }
        if (/Android/.test(userAgent)) {
            return 'Android';
        }
        return null;
    }
    LOGGER.out('[+] pad');
    function pad(val, len = 6) {
        const v = val + '';
        len = Math.max(v.length, len);
        return ('00000000000000' + v).slice(-len);
    }
    LOGGER.out('[+] compareNum');
    function compareNum(lhs, rhs) { return lhs - rhs; }
    LOGGER.out('[+] getLocation');
    function getLocation(url, prop) {
        if (!url) {
            return null;
        }
        LINK.href = url;
        return prop ? LINK[prop] : LINK;
    }
    LOGGER.out('[+] dummy');
    function dummy() {}
    function _readyPromiseCb_ (resolve) { DOMReady(resolve); }
    LOGGER.out('[+] readyPromise');
    function readyPromise(callback = dummy) {
        return new Promise(_readyPromiseCb_).then(callback);
    }
    LOGGER.out('[+] delay');
    function delay(timeout) {
        return new Promise(function(resolve){
            setTimeout(resolve, timeout);
        });
    }
    LOGGER.out('[+] addToDomainList');
    function addToDomainList(url) {
        return -1;
        /*
        LOGGER.log('[+] addToDomainList()');
        if (window.location.hostname !== 'vk.com') {
            return -1;
        }
        LINK.href = url;
        const { origin, hostname } = LINK;
        const domain = hostname.split('.').slice(-2).join('.');
        let storage = localStorage.getItem(STORAGE_KEY);
        try {
            storage = JSON.parse(storage || '{}');
        } catch(e) {
            localStorage.removeItem(STORAGE_KEY);
            storage = {};
        }
        try {
            LOGGER.log('[+] addToDomainList() -> storage:', JSON.stringify(storage, null, 2));
        } catch (error) {}
        const { domains = [] } = storage;
        storage.domains = domains;
        if (domains.indexOf(domain) === -1) {
            domains.push(domain);
            LOGGER.info('[+] addToDomainList() -> added new domain:', domain);
            if (!localStorage.getItem('vk-warning-off') && DOMAIN_LIST.indexOf(domain) === -1) {
                const r = confirm('' +
                SCRIPT_NAME + ' v' + SCRIPT_VERSION + '\r\n' +
                DICTIONARY.intl('domainWarning') + '\r\n' +
                DICTIONARY.intl('domainName') + ': ' + domain + '\r\n' +
                DICTIONARY.intl('domainInstruction') + ':\r\n' +
                '// @include\t*://*.' + domain + '/*\r\n' +
                DICTIONARY.intl('domainMessage'));
                if( r ) {
                    localStorage.setItem('vk-warning-off', true);
                }
            }
        }
        const list = storage[domain] || [];
        storage[domain] = list;
        if (list.indexOf(origin) === -1) {
            list.push(origin);
            LOGGER.info('[+] addToDomainList() -> added new origin:', origin);
        }
        localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
        return 0;
        */
    }
    LOGGER.out('[+] child');
    async function child() {
        LOGGER.log('[+] child()');
        const { hostname } = window.location;
        const valid = DOMAIN_LIST.some(function(host) { return hostname.indexOf(host) !== -1; });
        if (!valid) {
            LOGGER.error('[-] error:', hostname + ' not found in vkmd\'s host list');
            return;
        }
        const { parent, opener, location: { hash } } = window;
        const target = opener || parent;
        const parentOrigin = hash ? decodeURIComponent(hash.slice(1)) : undefined;
        const channel = new Channel(target, parentOrigin);
        LOGGER.log('[+] child() -> init()');
        channel.init();
        LOGGER.log('[+] child() -> on size-req');
        channel.on('size-req', async function({ data: dt }) {
            try {
                LOGGER.log('[+] child() -> on size-req data:', JSON.stringify(dt, null, 2));
            } catch (error) {}
            const { url, id = 'unknown', prop = 'unknown', media = 'unknown', name = 'unknown' } = dt;
            let ext = getExtension(url) || dt.ext;
            const filename = name + '.' + ext;
            const { headers } = await makeRequest({
                method: 'HEAD',
                url,
            }).catch(function(e) {
              LOGGER.log('[-] child() -> on size-req error: ', e);
              return {};
            });
            const size = headers && headers['content-length'] ? +headers['content-length'] : 0;
            ext = ext || (headers && headers['content-type'] ? headers['content-type'].split('/')[1] : null);
            LOGGER.log('[+] child() -> size-req size:', size);
            const data = { size, url, id, prop, media, name, ext };
            return data;
        });
        LOGGER.log('[+] child() -> on download-req');
        channel.on('download-req', async function({ data: dt }) {
            try {
                LOGGER.log('[+] child() -> on download-req data:', JSON.stringify(dt, null, 2));
            } catch (error) {}
            const { url, id, prop, name, media = 'unknown' } = dt;
            const ext = getExtension(url) || dt.ext;
            const filename = name + '.' + ext;
            LOGGER.log('[+] child() -> on download-req ext:', ext);
            if (ext && ext.indexOf('m3u') !== -1) {
                channel.emit('download-resp');
                LOGGER.log('[+] child() -> download-req hls playlist.');
                return;
            }
            var a = document.createElement('a');
            a.href = url;
            a.setAttribute('download', filename);
            await readyPromise();
            document.body.appendChild(a);
            a.click();
            a.parentNode.removeChild(a);
            channel.emit('download-resp');
            LOGGER.log('[+] child() -> download-req end.');
        });
        LOGGER.log('[+] child() -> saveLogs');
        channel.on('save-logs', async function(){
            if (typeof LOGGER.save === 'function') {
                LOGGER.save();
            }
        });
        channel.on('fetch-pladform-playlist', async function({ data }){
            LOGGER.log('[+] child() -> on fetch-pladform-playlist data: ', data);
            if (WINDOW.fetchPladformPlaylistHLS) {
                return WINDOW.fetchPladformPlaylistHLS(data.url);
            }
            throw new Error('fetchPladformPlaylistHLS function not found');
        });
        channel.on('request', async function({ data: details }) {
            LOGGER.log('[+] child() -> on request data: ', details);
            const { requestId: id } = details;
            try {
                const { headers, response } = await makeRequest(details);
                channel.emit(`load-${id}`, { headers, response });
            } catch (error) {
                channel.emit(`error-${id}`, { error: error.message });
            }
        });
        LOGGER.log('[+] child() -> ping()');
        channel.ping();
        await channel.readyPromise();
        console.log('vkmd ready.. (', SCRIPT_VERSION, ')', hostname + pathname);
    }
    LOGGER.out('[+] main');
    async function main() {
        const { hostname } = window.location;
        if (hostname !== 'vk.com' && hostname !== 'm.vk.com') {
            return;
        }
        OS_NAME = getOS();
        LOGGER.log('[+] main() -> getOS()', OS_NAME);

        LOGGER.log('[+] main() -> new Downloader()');
        DOWNLOADER = new Downloader();

        LOGGER.log('[+] main() -> configHls()');
        configHls();

        LOGGER.log('[+] main() -> new ChannelList()');
        CHANNEL_LIST = new ChannelList();

        LOGGER.log('[+] main() -> createIcon()');
        const icon = createIcon();

        LOGGER.log('[+] main() -> new AudioList()');
        AUDIO_LIST = new AudioList();

        LOGGER.log('[+] main() -> new VideoList()');
        VIDEO_LIST = new VideoList();

        LOGGER.log('[+] main() -> startMediaObserver()');
        startMediaObserver();

        LOGGER.log('[+] main() -> activateKeyboard()');
        activateKeyboard();

        LOGGER.log('[+] main() -> await readyPromise()');
        await readyPromise();

        console.log('vkmd ready.. (', SCRIPT_VERSION, ')', hostname + pathname);
        LOGGER.log('[+] vkmd ready.. (', SCRIPT_VERSION, SCRIPT_HANDLER, ')', hostname + pathname, top === self ? 'top' : 'child');

        LOGGER.log('[+] main() -> AUDIO_LIST.init()');
        AUDIO_LIST.init();

        LOGGER.log('[+] main() -> VIDEO_LIST.init()');
        VIDEO_LIST.init();

        LOGGER.log('[+] main() -> addIcon(icon)');
        addIcon(icon);

        LOGGER.log('[+] main() -> loadCss("jquery-ui.css")');
        loadCss('https://code.jquery.com/ui/1.12.0/themes/ui-darkness/jquery-ui.css');
    }
    LOGGER.out('[+] updateScriptsStatus');
    function updateScriptsStatus() {
        const { jQuery, Hls, URLToolkit, JSZip } = window;
        SCRIPTS['jquery-js'].loaded = !!jQuery;
        SCRIPTS['jquery-ui-js'].loaded = !!(jQuery && jQuery.ui);
        SCRIPTS['hls-js'].loaded = !!Hls;
        SCRIPTS['url-toolkit-js'].loaded = !!URLToolkit;
        SCRIPTS['jszip-js'].loaded = !!JSZip;
        const keys = Object.keys(SCRIPTS);
        const copy = {};
        for (const key of keys) {
            const { id, url, loaded, resource = null } = SCRIPTS[key];
            copy[key] = { id, url, loaded, resource };
        }
        LOGGER.log('[+] updateScriptsStatus() -> status:', JSON.stringify(copy, null, 2));
        return SCRIPTS;
    }
    LOGGER.out('[+] load');
    async function load() {
        LOGGER.log('[+] load()');
        const {
            'jquery-js': jquery,
            'jquery-ui-js': jqueryUI,
            'hls-js': hls,
            'url-toolkit-js': urlToolkit,
            'jszip-js': jszip,
        } = updateScriptsStatus();
        const rnd = random();
        const promises = [];
        let p;
        // load jQuery
        p = loadScript(jquery.url, jquery.id, rnd)
        .then(function(){
            // load jQueryUI
            return loadScript(jqueryUI.url, jqueryUI.id, rnd);
        });
        promises.push(p);

        // load Hls
        p = loadScript(hls.url, hls.id, rnd);
        promises.push(p);

        // load URLToolkit
        p = loadScript(urlToolkit.url, urlToolkit.id, rnd);
        promises.push(p);

        // load JSZip
        p = loadScript(jszip.url, jszip.id, rnd);
        promises.push(p);

        LOGGER.log('[+] load() -> promises:', promises.length);
        return Promise.all(promises).then(function(){
            updateScriptsStatus();
            LOGGER.log('[+] load() -> complete');
        }).catch(function(error){
            LOGGER.error('[-] load() -> error:', error);
        })
    }
    LOGGER.out('[+] start');
    async function start() {
        LOGGER.log('[+] start()');
        window.URL = window.URL || window.webkitURL;
        // load scripts
        const { location: { hostname, pathname }, self, top } = window;
        const state = (hostname === 'vk.com' || hostname === 'm.vk.com') | ((self !== top) << 1);
        let isChild;
        LOGGER.log('[+] start() -> state:', state);
        switch (state) {
            case 0:
                LOGGER.warn('[+] start() -> warning: script stopped on this top window');
                break;
            case 1:
                await load();
                await main();
                await WINDOW.attachInterface(userOptions);
                break;
            case 2:
                isChild = !!DOMAIN_LIST.find(function(h){
                    return hostname.indexOf(h) !== -1;
                });
                if (isChild) {
                    return child();
                }
                throw new Error('hostname = ' + hostname + ' not found in DOMAIN_LIST = ' + DOMAIN_LIST.join(', '));
                break;
            case 3:
                LOGGER.info('[+] start() -> vk frame loader', hostname + pathname);
                break;
            default:
                throw new Error('unknown state ' + state);
        }
    }
    start().catch(function(error){
        LOGGER.error('[-] start() -> Fatal error:', error);
    });
    console.log(['VK_MEDIA_DOWNLOADER END', str].join('\n'));
})(typeof unsafeWindow !== 'undefined' ? unsafeWindow : window, window);