/*
安卓：晶彩天气(v8.3.7)

此脚本负责：捉包重写

脚本会自动提现，如果不想自动提现的，请不要捉提现body，或者新建环境变量zqkdFastWithdrawFlag，写成0

重写：
https://tq.xunsl.com/v17/NewTask/getTaskListByWeather.json  -- 点开福利页即可获取zqkdFastCookie
https://tq.xunsl.com/v5/CommonReward/toGetReward.json       -- 签到，和福利页任务奖励（目前应该只有激励视频和20篇文章的奖励），获取完建议关掉重写
https://tq.xunsl.com/v5/article/info.json                   -- 点开文章获取文章body，获取完建议关掉重写
https://tq.xunsl.com/v5/article/detail.json                 -- 点开视频获取视频body，获取完建议关掉重写
https://tq.xunsl.com/v5/user/stay.json                      -- 阅读文章或者看视频一段时间后可以获取到时长body，获取完务必关掉重写
https://tq.xunsl.com/v5/nameless/adlickstart.json           -- 点开看看赚获取body，可以一直开着，脚本会自动删除重复和失效body
https://tq.xunsl.com/v5/Weather/giveBoxOnWeather.json       -- 点开福利页浮窗宝箱和观看翻倍视频获取body，获取完建议关掉重写
https://tq.xunsl.com/v5/weather/giveTimeInterval.json       -- 点开首页气泡红包和观看翻倍视频获取body，获取完建议关掉重写
https://tq.xunsl.com/v5/wechat/withdraw2.json               -- 提现一次对应金额获取body
https://tq.xunsl.com/v5/CommonReward/toDouble.json          -- 领取签到翻倍奖励后可获取

任务：
zqkdFast_daily.js   -- 领转发页定时宝箱，领福利页定时宝箱，领首页气泡红包，时段转发，刷福利视频，抽奖5次
zqkdFast_reward.js  -- 签到和翻倍，任务奖励领取，统计今日收益，自动提现
zqkdFast_kkz.js     -- 完成看看赚任务，删除重复和失效的body
zqkdFast_read.js    -- 阅读文章，浏览视频

*/

const jsname = '钟情极速版捉包重写'
const $ = Env(jsname)
const notifyFlag = 1; //0为关闭通知，1为打开通知,默认为1
const logDebug = 0

//let zqkdFastCookie = ($.isNode() ? process.env.zqkdFastCookie : $.getdata('zqkdFastCookie')) || '';
let zqkdFastjczxBoxbody = ($.isNode() ? process.env.zqkdFastjczxBoxbody : $.getdata('zqkdFastjczxBoxbody')) || '';
//let zqkdFastTimeBody = ($.isNode() ? process.env.zqkdFastTimeBody : $.getdata('zqkdFastTimeBody')) || '';
let zqkdFastWzBody = ($.isNode() ? process.env.zqkdFastWzBody : $.getdata('zqkdFastWzBody')) || '';
let zqkdFastLookStartbody = ($.isNode() ? process.env.zqkdFastLookStartbody : $.getdata('zqkdFastLookStartbody')) || '';
let zqkdFastWithdraw = ($.isNode() ? process.env.zqkdFastWithdraw : $.getdata('zqkdFastWithdraw')) || '';
let zqkdFastBubbleBody = ($.isNode() ? process.env.zqkdFastBubbleBody : $.getdata('zqkdFastBubbleBody')) || '';
let zqkdFastGiveBoxBody = ($.isNode() ? process.env.zqkdFastGiveBoxBody : $.getdata('zqkdFastGiveBoxBody')) || '';
let zqkdFastSignDoubleBody = ($.isNode() ? process.env.zqkdFastSignDoubleBody : $.getdata('zqkdFastSignDoubleBody')) || '';

///////////////////////////////////////////////////////////////////

!(async () => {

    if(typeof $request !== "undefined")
    {
        await getRewrite()
    } else {
        $.msg(jsname+': 此脚本只负责重写，请检查任务设置')
    }

})()
.catch((e) => $.logErr(e))
.finally(() => $.done())

async function getRewrite() {
    
    if($request.url.indexOf('v17/NewTask/getTaskListByWeather.json') > -1) {
        rUrl = $request.url
        app_version = rUrl.match(/app_version=([\w\.]+)/)[1]
        zqkey = rUrl.match(/zqkey=([\w-]+)/)[1]
        zqkey_id = rUrl.match(/zqkey_id=([\w-]+)/)[1]
        uid = rUrl.match(/uid=([\w]+)/)[1]
        uidStr = 'uid=' + uid
        
        let newCookie = `app_version=${app_version}&cookie=${zqkey}&cookie_id=${zqkey_id}&uid=${uid}`
        if(zqkdFastCookie) {
            if(zqkdFastCookie.indexOf(uidStr) > -1) {
                $.msg(jsname+` 此zqkdFastCookie已存在，本次跳过`)
            } else {
                zqkdFastCookie = zqkdFastCookie + '@' + newCookie
                $.setdata(zqkdFastCookie, 'zqkdFastCookie');
                bodyList = zqkdFastCookie.split('@')
                $.msg(jsname+` 获取第${bodyList.length}个zqkdFastCookie成功`)
            }
        } else {
            $.setdata(newCookie, 'zqkdFastCookie');
            $.msg(jsname+` 获取第1个zqkdFastCookie成功`)
        }
    }
    
    if($request.url.indexOf('FastApi/CommonReward/toGetReward.json') > -1) {//精彩资讯
        rBody = $request.body
        if(zqkdFastjczxBoxbody) {
            if(zqkdFastjczxBoxbody.indexOf(rBody) > -1) {
                $.msg(jsname+` 此签到/奖励body已存在，本次跳过`)
            } else {
                zqkdFastjczxBoxbody = zqkdFastjczxBoxbody + '&' + rBody
                $.setdata(zqkdFastjczxBoxbody, 'zqkdFastjczxBoxbody');
                bodyList = zqkdFastjczxBoxbody.split('&')
                $.msg(jsname+` 获取第${bodyList.length}个签到/奖励body成功`)
            }
        } else {
            $.setdata(rBody, 'zqkdFastjczxBoxbody');
            $.msg(jsname+` 获取第1个签到/奖励body成功`)
        }
    }
    
    if($request.url.indexOf('v5/article/info.json') > -1 || 
       $request.url.indexOf('v5/article/detail.json') > -1) {
        rUrl = $request.url
        bodys = rUrl.split('?p=')
        rBody = 'p=' + bodys[1]
        if(zqkdFastWzBody) {
            if(zqkdFastWzBody.indexOf(rBody) > -1) {
                $.msg(jsname+` 此文章/视频body已存在，本次跳过`)
            } else {
                zqkdFastWzBody = zqkdFastWzBody + '&' + rBody
                $.setdata(zqkdFastWzBody, 'zqkdFastWzBody');
                bodyList = zqkdFastWzBody.split('&')
                $.msg(jsname+` 获取第${bodyList.length}个文章/视频body成功`)
            }
        } else {
            $.setdata(rBody, 'zqkdFastWzBody');
            $.msg(jsname+` 获取第1个文章/视频body成功`)
        }
    }
    
    if($request.url.indexOf('v5/user/stay.json') > -1) {
        rBody = $request.body
        if(zqkdFastTimeBody) {
            if(zqkdFastTimeBody.indexOf(rBody) > -1) {
                $.msg(jsname+` 此时长body已存在，本次跳过`)
            } else {
                zqkdFastTimeBody = zqkdFastTimeBody + '&' + rBody
                $.setdata(zqkdFastTimeBody, 'zqkdFastTimeBody');
                bodyList = zqkdFastTimeBody.split('&')
                $.msg(jsname+` 获取第${bodyList.length}个时长body成功`)
            }
        } else {
            $.setdata(rBody, 'zqkdFastTimeBody');
            $.msg(jsname+` 获取第1个时长body成功`)
        }
    }
    
    if($request.url.indexOf('v5/nameless/adlickstart.json') > -1) {
        rBody = $request.body
        if(zqkdFastLookStartbody) {
            if(zqkdFastLookStartbody.indexOf(rBody) > -1) {
                $.msg(jsname+` 此看看赚body已存在，本次跳过`)
            } else {
                zqkdFastLookStartbody = zqkdFastLookStartbody + '&' + rBody
                $.setdata(zqkdFastLookStartbody, 'zqkdFastLookStartbody');
                bodyList = zqkdFastLookStartbody.split('&')
                $.msg(jsname+` 获取第${bodyList.length}个看看赚body成功`)
            }
        } else {
            $.setdata(rBody, 'zqkdFastLookStartbody');
            $.msg(jsname+` 获取第1个看看赚body成功`)
        }
    }
    
    if($request.url.indexOf('v5/wechat/withdraw2.json') > -1) {
        rBody = $request.body
        if(zqkdFastWithdraw) {
            if(zqkdFastWithdraw.indexOf(rBody) > -1) {
                $.msg(jsname+` 此提现body已存在，本次跳过`)
            } else {
                zqkdFastWithdraw = zqkdFastWithdraw + '&' + rBody
                $.setdata(zqkdFastWithdraw, 'zqkdFastWithdraw');
                bodyList = zqkdFastWithdraw.split('&')
                $.msg(jsname+` 获取第${bodyList.length}个提现body成功`)
            }
        } else {
            $.setdata(rBody, 'zqkdFastWithdraw');
            $.msg(jsname+` 获取第1个提现body成功`)
        }
    }
    
    if($request.url.indexOf('v5/Weather/giveBoxOnWeather.json') > -1) {
        rBody = $request.body
        if(zqkdFastGiveBoxBody) {
            if(zqkdFastGiveBoxBody.indexOf(rBody) > -1) {
                $.msg(jsname+` 此福利页宝箱/翻倍body已存在，本次跳过`)
            } else {
                zqkdFastGiveBoxBody = zqkdFastGiveBoxBody + '&' + rBody
                $.setdata(zqkdFastGiveBoxBody, 'zqkdFastGiveBoxBody');
                bodyList = zqkdFastGiveBoxBody.split('&')
                $.msg(jsname+` 获取第${bodyList.length}个福利页宝箱/翻倍body成功`)
            }
        } else {
            $.setdata(rBody, 'zqkdFastGiveBoxBody');
            $.msg(jsname+` 获取第1个福利页宝箱/翻倍body成功`)
        }
    }
    
    if($request.url.indexOf('v5/weather/giveTimeInterval.json') > -1) {
        rBody = $request.body
        if(zqkdFastBubbleBody) {
            if(zqkdFastBubbleBody.indexOf(rBody) > -1) {
                $.msg(jsname+` 此首页气泡/翻倍body已存在，本次跳过`)
            } else {
                zqkdFastBubbleBody = zqkdFastBubbleBody + '&' + rBody
                $.setdata(zqkdFastBubbleBody, 'zqkdFastBubbleBody');
                bodyList = zqkdFastBubbleBody.split('&')
                $.msg(jsname+` 获取第${bodyList.length}个首页气泡/翻倍body成功`)
            }
        } else {
            $.setdata(rBody, 'zqkdFastBubbleBody');
            $.msg(jsname+` 获取第1个首页气泡/翻倍body成功`)
        }
    }
    
    if($request.url.indexOf('v5/CommonReward/toDouble.json') > -1) {
        rBody = $request.body
        if(zqkdFastSignDoubleBody) {
            if(zqkdFastSignDoubleBody.indexOf(rBody) > -1) {
                $.msg(jsname+` 此签到翻倍body已存在，本次跳过`)
            } else {
                zqkdFastSignDoubleBody = zqkdFastSignDoubleBody + '&' + rBody
                $.setdata(zqkdFastSignDoubleBody, 'zqkdFastSignDoubleBody');
                bodyList = zqkdFastSignDoubleBody.split('&')
                $.msg(jsname+` 获取第${bodyList.length}个签到翻倍body成功`)
            }
        } else {
            $.setdata(rBody, 'zqkdFastSignDoubleBody');
            $.msg(jsname+` 获取第1个签到翻倍body成功`)
        }
    }
}

////////////////////////////////////////////////////////////////////
function Env(t, e) { class s { constructor(t) { this.env = t } send(t, e = "GET") { t = "string" == typeof t ? { url: t } : t; let s = this.get; return "POST" === e && (s = this.post), new Promise((e, i) => { s.call(this, t, (t, s, r) => { t ? i(t) : e(s) }) }) } get(t) { return this.send.call(this.env, t) } post(t) { return this.send.call(this.env, t, "POST") } } return new class { constructor(t, e) { this.name = t, this.http = new s(this), this.data = null, this.dataFile = "box.dat", this.logs = [], this.isMute = !1, this.isNeedRewrite = !1, this.logSeparator = "\n", this.startTime = (new Date).getTime(), Object.assign(this, e), this.log("", `\ud83d\udd14${this.name}, \u5f00\u59cb!`) } isNode() { return "undefined" != typeof module && !!module.exports } isQuanX() { return "undefined" != typeof $task } isSurge() { return "undefined" != typeof $httpClient && "undefined" == typeof $loon } isLoon() { return "undefined" != typeof $loon } toObj(t, e = null) { try { return JSON.parse(t) } catch { return e } } toStr(t, e = null) { try { return JSON.stringify(t) } catch { return e } } getjson(t, e) { let s = e; const i = this.getdata(t); if (i) try { s = JSON.parse(this.getdata(t)) } catch { } return s } setjson(t, e) { try { return this.setdata(JSON.stringify(t), e) } catch { return !1 } } getScript(t) { return new Promise(e => { this.get({ url: t }, (t, s, i) => e(i)) }) } runScript(t, e) { return new Promise(s => { let i = this.getdata("@chavy_boxjs_userCfgs.httpapi"); i = i ? i.replace(/\n/g, "").trim() : i; let r = this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout"); r = r ? 1 * r : 20, r = e && e.timeout ? e.timeout : r; const [o, h] = i.split("@"), a = { url: `http://${h}/v1/scripting/evaluate`, body: { script_text: t, mock_type: "cron", timeout: r }, headers: { "X-Key": o, Accept: "*/*" } }; this.post(a, (t, e, i) => s(i)) }).catch(t => this.logErr(t)) } loaddata() { if (!this.isNode()) return {}; { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e); if (!s && !i) return {}; { const i = s ? t : e; try { return JSON.parse(this.fs.readFileSync(i)) } catch (t) { return {} } } } } writedata() { if (this.isNode()) { this.fs = this.fs ? this.fs : require("fs"), this.path = this.path ? this.path : require("path"); const t = this.path.resolve(this.dataFile), e = this.path.resolve(process.cwd(), this.dataFile), s = this.fs.existsSync(t), i = !s && this.fs.existsSync(e), r = JSON.stringify(this.data); s ? this.fs.writeFileSync(t, r) : i ? this.fs.writeFileSync(e, r) : this.fs.writeFileSync(t, r) } } lodash_get(t, e, s) { const i = e.replace(/\[(\d+)\]/g, ".$1").split("."); let r = t; for (const t of i) if (r = Object(r)[t], void 0 === r) return s; return r } lodash_set(t, e, s) { return Object(t) !== t ? t : (Array.isArray(e) || (e = e.toString().match(/[^.[\]]+/g) || []), e.slice(0, -1).reduce((t, s, i) => Object(t[s]) === t[s] ? t[s] : t[s] = Math.abs(e[i + 1]) >> 0 == +e[i + 1] ? [] : {}, t)[e[e.length - 1]] = s, t) } getdata(t) { let e = this.getval(t); if (/^@/.test(t)) { const [, s, i] = /^@(.*?)\.(.*?)$/.exec(t), r = s ? this.getval(s) : ""; if (r) try { const t = JSON.parse(r); e = t ? this.lodash_get(t, i, "") : e } catch (t) { e = "" } } return e } setdata(t, e) { let s = !1; if (/^@/.test(e)) { const [, i, r] = /^@(.*?)\.(.*?)$/.exec(e), o = this.getval(i), h = i ? "null" === o ? null : o || "{}" : "{}"; try { const e = JSON.parse(h); this.lodash_set(e, r, t), s = this.setval(JSON.stringify(e), i) } catch (e) { const o = {}; this.lodash_set(o, r, t), s = this.setval(JSON.stringify(o), i) } } else s = this.setval(t, e); return s } getval(t) { return this.isSurge() || this.isLoon() ? $persistentStore.read(t) : this.isQuanX() ? $prefs.valueForKey(t) : this.isNode() ? (this.data = this.loaddata(), this.data[t]) : this.data && this.data[t] || null } setval(t, e) { return this.isSurge() || this.isLoon() ? $persistentStore.write(t, e) : this.isQuanX() ? $prefs.setValueForKey(t, e) : this.isNode() ? (this.data = this.loaddata(), this.data[e] = t, this.writedata(), !0) : this.data && this.data[e] || null } initGotEnv(t) { this.got = this.got ? this.got : require("got"), this.cktough = this.cktough ? this.cktough : require("tough-cookie"), this.ckjar = this.ckjar ? this.ckjar : new this.cktough.CookieJar, t && (t.headers = t.headers ? t.headers : {}, void 0 === t.headers.Cookie && void 0 === t.cookieJar && (t.cookieJar = this.ckjar)) } get(t, e = (() => { })) { t.headers && (delete t.headers["Content-Type"], delete t.headers["Content-Length"]), this.isSurge() || this.isLoon() ? (this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.get(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) })) : this.isQuanX() ? (this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t))) : this.isNode() && (this.initGotEnv(t), this.got(t).on("redirect", (t, e) => { try { if (t.headers["set-cookie"]) { const s = t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString(); this.ckjar.setCookieSync(s, null), e.cookieJar = this.ckjar } } catch (t) { this.logErr(t) } }).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) })) } post(t, e = (() => { })) { if (t.body && t.headers && !t.headers["Content-Type"] && (t.headers["Content-Type"] = "application/x-www-form-urlencoded"), t.headers && delete t.headers["Content-Length"], this.isSurge() || this.isLoon()) this.isSurge() && this.isNeedRewrite && (t.headers = t.headers || {}, Object.assign(t.headers, { "X-Surge-Skip-Scripting": !1 })), $httpClient.post(t, (t, s, i) => { !t && s && (s.body = i, s.statusCode = s.status), e(t, s, i) }); else if (this.isQuanX()) t.method = "POST", this.isNeedRewrite && (t.opts = t.opts || {}, Object.assign(t.opts, { hints: !1 })), $task.fetch(t).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => e(t)); else if (this.isNode()) { this.initGotEnv(t); const { url: s, ...i } = t; this.got.post(s, i).then(t => { const { statusCode: s, statusCode: i, headers: r, body: o } = t; e(null, { status: s, statusCode: i, headers: r, body: o }, o) }, t => { const { message: s, response: i } = t; e(s, i, i && i.body) }) } } time(t) { let e = { "M+": (new Date).getMonth() + 1, "d+": (new Date).getDate(), "H+": (new Date).getHours(), "m+": (new Date).getMinutes(), "s+": (new Date).getSeconds(), "q+": Math.floor(((new Date).getMonth() + 3) / 3), S: (new Date).getMilliseconds() }; /(y+)/.test(t) && (t = t.replace(RegExp.$1, ((new Date).getFullYear() + "").substr(4 - RegExp.$1.length))); for (let s in e) new RegExp("(" + s + ")").test(t) && (t = t.replace(RegExp.$1, 1 == RegExp.$1.length ? e[s] : ("00" + e[s]).substr(("" + e[s]).length))); return t } msg(e = t, s = "", i = "", r) { const o = t => { if (!t) return t; if ("string" == typeof t) return this.isLoon() ? t : this.isQuanX() ? { "open-url": t } : this.isSurge() ? { url: t } : void 0; if ("object" == typeof t) { if (this.isLoon()) { let e = t.openUrl || t.url || t["open-url"], s = t.mediaUrl || t["media-url"]; return { openUrl: e, mediaUrl: s } } if (this.isQuanX()) { let e = t["open-url"] || t.url || t.openUrl, s = t["media-url"] || t.mediaUrl; return { "open-url": e, "media-url": s } } if (this.isSurge()) { let e = t.url || t.openUrl || t["open-url"]; return { url: e } } } }; this.isMute || (this.isSurge() || this.isLoon() ? $notification.post(e, s, i, o(r)) : this.isQuanX() && $notify(e, s, i, o(r))); let h = ["", "==============\ud83d\udce3\u7cfb\u7edf\u901a\u77e5\ud83d\udce3=============="]; h.push(e), s && h.push(s), i && h.push(i), console.log(h.join("\n")), this.logs = this.logs.concat(h) } log(...t) { t.length > 0 && (this.logs = [...this.logs, ...t]), console.log(t.join(this.logSeparator)) } logErr(t, e) { const s = !this.isSurge() && !this.isQuanX() && !this.isLoon(); s ? this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t.stack) : this.log("", `\u2757\ufe0f${this.name}, \u9519\u8bef!`, t) } wait(t) { return new Promise(e => setTimeout(e, t)) } done(t = {}) { const e = (new Date).getTime(), s = (e - this.startTime) / 1e3; this.log("", `\ud83d\udd14${this.name}, \u7ed3\u675f! \ud83d\udd5b ${s} \u79d2`), this.log(), (this.isSurge() || this.isQuanX() || this.isLoon()) && $done(t) } }(t, e) }
