/*!
 * artplayer-plugin-ads.js v1.0.6 (Modified)
 * Github: https://github.com/zhw2590582/ArtPlayer
 * (c) 2017-2022 Harvey Zack
 * Released under the MIT License.
 */

!(function (e, n, l, t, i) {
  var a =
    "undefined" != typeof globalThis
      ? globalThis
      : "undefined" != typeof self
        ? self
        : "undefined" != typeof window
          ? window
          : "undefined" != typeof global
            ? global
            : {},
    r = "function" == typeof a.parcelRequirea5da && a.parcelRequirea5da,
    o = r.cache || {},
    d =
      "undefined" != typeof module &&
      "function" == typeof module.require &&
      module.require.bind(module);
  function p(n, l) {
    if (!o[n]) {
      if (!e[n]) {
        var t =
          "function" == typeof a.parcelRequirea5da && a.parcelRequirea5da;
        if (!l && t) return t(n, !0);
        if (r) return r(n, !0);
        if (d && "string" == typeof n) return d(n);
        var i = new Error("Cannot find module '" + n + "'");
        throw ((i.code = "MODULE_NOT_FOUND"), i);
      }
      (u.resolve = function (l) {
        var t = e[n][1][l];
        return null != t ? t : l;
      }),
        (u.cache = {});
      var s = (o[n] = new p.Module(n));
      e[n][0].call(s.exports, u, s, s.exports, this);
    }
    return o[n].exports;
    function u(e) {
      var n = u.resolve(e);
      return !1 === n ? {} : p(n);
    }
  }
  (p.isParcelRequire = !0),
    (p.Module = function (e) {
      (this.id = e), (this.bundle = p), (this.exports = {});
    }),
    (p.modules = e),
    (p.cache = o),
    (p.parent = r),
    (p.register = function (n, l) {
      e[n] = [
        function (e, n) {
          n.exports = l;
        },
        {},
      ];
    }),
    Object.defineProperty(p, "root", {
      get: function () {
        return a.parcelRequirea5da;
      },
    }),
    (a.parcelRequirea5da = p);
  for (var s = 0; s < n.length; s++) p(n[s]);
  var u = p(l);
  "object" == typeof exports && "undefined" != typeof module
    ? (module.exports = u)
    : "function" == typeof define &&
    define.amd &&
    define(function () {
      return u;
    });
})(
  {
    E13ST: [
      function (e, n, l) {
        var t = e("@parcel/transformer-js/src/esmodule-helpers.js");
        t.defineInteropFlag(l);
        var i = e("bundle-text:./style.less"),
          a = t.interopDefault(i);
        function r(e) {
          return (n) => {
            const {
              template: { $player: l },
              icons: {
                volume: t,
                volumeClose: i,
                fullscreenOn: a,
                fullscreenOff: r,
                loading: o,
              },
              constructor: {
                validator: d,
                utils: { query: p, append: s, setStyle: u },
              },
            } = n;
            e = d(
              {
                html: "",
                video: "",
                url: "",
                playDuration: 5,
                totalDuration: 10,
                muted: !1,
                i18n: {
                  close: "关闭广告",
                  countdown: "%s秒",
                  detail: "查看详情",
                  canBeClosed: "%s秒后可关闭广告",
                },
                ...e,
              },
              {
                html: "?string",
                video: "?string",
                url: "?string",
                playDuration: "number",
                totalDuration: "number",
                muted: "?boolean",
                i18n: {
                  close: "string",
                  countdown: "string",
                  detail: "string",
                  canBeClosed: "string",
                },
              }
            );
            let c = null,
              y = null,
              f = null,
              g = null,
              m = null,
              v = null,
              x = 0,
              h = null,
              b = !1,
              w = !1,
              D = !1;

            // Add keystroke blocking functionality
            let keystrokeBlocked = false;
            let originalKeydownHandler = null;

            function blockKeystrokes() {
              if (!keystrokeBlocked) {
                keystrokeBlocked = true;
                // Store original keydown handler if it exists
                originalKeydownHandler = document.onkeydown;
                // Block all keydown events
                document.onkeydown = function(event) {
                  event.preventDefault();
                  event.stopPropagation();
                  return false;
                };
                // Also add event listener for additional blocking
                document.addEventListener('keydown', preventKeydown, true);
                document.addEventListener('keyup', preventKeydown, true);
                document.addEventListener('keypress', preventKeydown, true);
              }
            }

            function unblockKeystrokes() {
              if (keystrokeBlocked) {
                keystrokeBlocked = false;
                // Restore original keydown handler
                document.onkeydown = originalKeydownHandler;
                // Remove event listeners
                document.removeEventListener('keydown', preventKeydown, true);
                document.removeEventListener('keyup', preventKeydown, true);
                document.removeEventListener('keypress', preventKeydown, true);
              }
            }

            function preventKeydown(event) {
              event.preventDefault();
              event.stopPropagation();
              return false;
            }

            // Add timeupdate listener to pause main player during ad
            function addTimeupdateListener() {
              if (n.video && !n.video.paused) {
                n.pause();
              }
            }

            function j(e, n) {
              return n.replace("%s", e);
            }

            function k() {
              (b = !0),
                n.play(),
                e.video && c.pause(),
                u(n.template.$ads, "display", "none"),
                
                // Unblock keystrokes when ad finishes
                unblockKeystrokes();
                
                // Remove timeupdate listener
                n.off('video:timeupdate', addTimeupdateListener);
                
                // Emit close event when ad finishes
                n.emit("artplayerPluginAds:close", e);
                n.emit("artplayerPluginAds:skip", e);
              resetAd();
              isAdActive = false;
            }

            function O() {
              b ||
                (h = setTimeout(() => {
                  x += 1;
                  const n = e.playDuration - x;
                  n >= 1
                    ? (f.innerHTML = j(n, e.i18n.canBeClosed))
                    : ((f.innerHTML = e.i18n.close), D || (D = !0)),
                    (g.innerHTML = j(
                      e.totalDuration - x,
                      e.i18n.countdown
                    )),
                    x >= e.totalDuration ? k() : O();
                }, 1e3));
            }

            function $() {
              b || clearTimeout(h);
            }

            function resetAd() {
              // Remove event listeners
              if (n.unproxy) {
                n.unproxy(f, "click");
                n.unproxy(c, "error");
                n.unproxy(c, "loadedmetadata");
                n.unproxy(document, "visibilitychange");
              }

              // Clear ad elements
              if (n.template && n.template.$ads) {
                n.template.$ads.innerHTML = "";
              }

              // Reset variables
              f = null; // Close button element
              g = null; // Countdown element
              m = null; // Control elements
              y = null; // Timer element
              c = null; // Video element
              v = null; // Loading element

              // Reset state variables
              w = false; // Ad started flag
              D = false; // Ad close flag
              b = false; // Ad finished flag
              x = 0; // Time counter

              // Ensure keystrokes are unblocked
              unblockKeystrokes();
            }

            function P() {
              if (!w) {
                w = true;
                
                // Block keystrokes when ad starts
                blockKeystrokes();
                
                // Add timeupdate listener to pause main video
                n.on('video:timeupdate', addTimeupdateListener);
                
                (function () {
                  n.template.$ads = s(
                    l,
                    '<div class="artplayer-plugin-ads"></div>'
                  );
                  c = s(
                    n.template.$ads,
                    e.video
                      ? `<video class="artplayer-plugin-ads-video" src="${e.video}" loop playsInline></video>`
                      : `<div class="artplayer-plugin-ads-html">${e.html}</div>`
                  );
                  v = s(
                    n.template.$ads,
                    '<div class="artplayer-plugin-ads-loading"></div>'
                  );
                  s(v, o);
                  y = s(
                    n.template.$ads,
                    `<div class="artplayer-plugin-ads-timer"><div class="artplayer-plugin-ads-close">${e.playDuration <= 0
                      ? e.i18n.close
                      : j(e.playDuration, e.i18n.canBeClosed)
                    }</div>
                      <div class="artplayer-plugin-ads-countdown">${j(
                      e.totalDuration,
                      e.i18n.countdown
                    )}</div></div>`
                  );
                  f = p(".artplayer-plugin-ads-close", y);
                  g = p(".artplayer-plugin-ads-countdown", y);
                  
                  // Add click event for countdown button with custom event dispatch
                  n.proxy(g, "click", () => {
                    const event = new CustomEvent('playerAction', {
                      detail: {
                        action: 'subscribeButton',
                        data: {}
                      }
                    });
                    document.dispatchEvent(event);
                  });
                  
                  if (e.playDuration >= e.totalDuration) {
                    u(f, "display", "none");
                  }
                  n.proxy(f, "click", () => {
                    if (D) {
                      k();
                    }
                  });
                  m = s(
                    n.template.$ads,
                    `<div class="artplayer-plugin-ads-control"><div class="artplayer-plugin-ads-detail">${e.i18n.detail}</div><div class="artplayer-plugin-ads-muted"></div><div class="artplayer-plugin-ads-fullscreen"></div></div>`
                  );
                  const d = p(".artplayer-plugin-ads-detail", m);
                  const x = p(".artplayer-plugin-ads-muted", m);
                  const h = p(".artplayer-plugin-ads-fullscreen", m);
                  if (e.url) {
                    n.proxy(d, "click", () => {
                      window.open(e.url);
                      n.emit("artplayerPluginAds:click", e);
                    });
                  } else {
                    u(d, "display", "none");
                  }
                  if (e.video) {
                    const l = s(x, t);
                    const a = s(x, i);
                    u(a, "display", "none");
                    if (e.muted) {
                      c.muted = true;
                      u(l, "display", "none");
                      u(a, "display", "inline-flex");
                    }
                    n.proxy(x, "click", () => {
                      c.muted = !c.muted;
                      if (c.muted) {
                        u(l, "display", "none");
                        u(a, "display", "inline-flex");
                      } else {
                        u(l, "display", "inline-flex");
                        u(a, "display", "none");
                      }
                    });
                  } else {
                    u(x, "display", "none");
                  }
                  const b = s(h, a);
                  const w = s(h, r);
                  u(w, "display", "none");
                  n.proxy(h, "click", () => {
                    n.fullscreen = !n.fullscreen;
                    if (n.fullscreen) {
                      u(b, "display", "inline-flex");
                      u(w, "display", "none");
                    } else {
                      u(b, "display", "none");
                      u(w, "display", "inline-flex");
                    }
                  });
                  n.proxy(c, "click", () => {
                    if (e.url) {
                      window.open(e.url);
                    }
                    n.emit("artplayerPluginAds:click", e);
                  });
                })();
                n.pause();
                isAdActive = true;
                // setupAdLayer();
                if (e.video) {
                  n.proxy(c, "error", k);
                  n.proxy(c, "loadedmetadata", () => {
                    O();
                    c.play();
                    u(y, "display", "flex");
                    u(m, "display", "flex");
                    u(v, "display", "none");
                    n.emit("preLoll", e);
                  });
                } else {
                  O();
                  u(y, "display", "flex");
                  u(m, "display", "flex");
                  u(v, "display", "none");
                  n.emit("adStarted", e);
                }
                n.proxy(document, "visibilitychange", () => {
                  if (document.hidden) {
                    $();
                  } else {
                    O();
                  }
                });
              }
            }

            function updateVideoLink(newVideoLink, newPlayDuration, newTotalDuration) {
              P();
              e.video = newVideoLink;
              e.playDuration = newPlayDuration;
              e.totalDuration = newTotalDuration;
              e.i18n.canBeClosed = newPlayDuration > 120
                ? languageCode === 'rw' ? 'Kwishyura?' : 'To Pay?'
                : languageCode === 'rw' ? '%s | Kwishyura?' : '%s | To Pay?';

              c.src = newVideoLink;
              c.load();
            }

            return {
              name: "artplayerPluginAds",
              skip: k,
              pause: $,
              play: O,
              startAd: P, // Expose the P function
              updateVideoLink, // Expose the updateVideoLink function
              resetAd,
              blockKeystrokes, // Expose keystroke blocking
              unblockKeystrokes, // Expose keystroke unblocking
            };
          };
        }
        if (
          ((l.default = r),
            (r.env = "production"),
            (r.version = "1.0.6"),
            (r.build = "1663552935766"),
            "undefined" != typeof document &&
            !document.getElementById("artplayer-plugin-ads"))
        ) {
          const e = document.createElement("style");
          (e.id = "artplayer-plugin-ads"),
            (e.textContent = a.default),
            document.head.appendChild(e);
        }
        "undefined" != typeof window && (window.artplayerPluginAds = r);
      },
      {
        "bundle-text:./style.less": "5j5O2",
        "@parcel/transformer-js/src/esmodule-helpers.js": "9v6Cv",
      },
    ],
    "5j5O2": [
      function (e, n, l) {
        n.exports =
          ".artplayer-plugin-ads{z-index:150;width:100%;height:100%;color:#fff;background-color:#000;font-size:13px;line-height:1;position:absolute;inset:0;overflow:hidden}.artplayer-plugin-ads .artplayer-plugin-ads-html{width:100%;height:100%;justify-content:center;align-items:center;display:flex}.artplayer-plugin-ads .artplayer-plugin-ads-video{width:100%;height:100%}.artplayer-plugin-ads .artplayer-plugin-ads-timer{display:flex;position:absolute;bottom:50px;right:10px;flex-direction:column;align-items:flex-end}.artplayer-plugin-ads .artplayer-plugin-ads-timer>div:first-child{background-color:rgba(0,0,0,0.5);color:#fff;border:none;padding:5px 10px;font-size:14px;font-weight:bold;cursor:default;margin-bottom:0;text-align:center;border-radius:5px 5px 0 0;width:100%;box-sizing:border-box}@media (max-width:768px){.artplayer-plugin-ads .artplayer-plugin-ads-timer>div:first-child{font-size:12px}}.artplayer-plugin-ads .artplayer-plugin-ads-timer>div:last-child{background-color:#1FDF67;color:#000;border:none;padding:10px 20px;border-radius:10px;font-size:14px;font-weight:bold;cursor:pointer;transition:background-color 0.3s ease;width:200px;height:50px;text-align:center;display:flex;align-items:center;justify-content:center}@media (max-width:768px){.artplayer-plugin-ads .artplayer-plugin-ads-timer>div:first-child{font-size:12px}.artplayer-plugin-ads .artplayer-plugin-ads-timer>div:last-child{font-size:12px;margin-left:10px;margin-right:10px;width:calc(100% - 20px);height:50px;border-radius:10px}}.artplayer-plugin-ads .artplayer-plugin-ads-control{display:none;position:absolute;bottom:10px;right:10px}.artplayer-plugin-ads .artplayer-plugin-ads-control>div{cursor:pointer;background-color:#00000080;border-radius:15px;align-items:center;margin-left:5px;padding:5px 10px;display:flex}.artplayer-plugin-ads .artplayer-plugin-ads-control .art-icon svg{width:20px;height:20px}.artplayer-plugin-ads .artplayer-plugin-ads-loading{width:100%;height:100%;justify-content:center;align-items:center;display:flex;position:absolute;inset:0}@media (max-width:768px){.artplayer-plugin-ads .artplayer-plugin-ads-timer{right:0;left:0;align-items:center}.artplayer-plugin-ads .artplayer-plugin-ads-timer>div:last-child{margin-left:10px;margin-right:10px;width:calc(100vw - 20px);max-width:calc(100% - 20px)}}";


      },
      {},
    ],
    "9v6Cv": [
      function (e, n, l) {
        (l.interopDefault = function (e) {
          return e && e.__esModule ? e : { default: e };
        }),
          (l.defineInteropFlag = function (e) {
            Object.defineProperty(e, "__esModule", { value: !0 });
          }),
          (l.exportAll = function (e, n) {
            return (
              Object.keys(e).forEach(function (l) {
                "default" === l ||
                  "__esModule" === l ||
                  n.hasOwnProperty(l) ||
                  Object.defineProperty(n, l, {
                    enumerable: !0,
                    get: function () {
                      return e[l];
                    },
                  });
              }),
              n
            );
          }),
          (l.export = function (e, n, l) {
            Object.defineProperty(e, n, { enumerable: !0, get: l });
          });
      },
      {},
    ],
  },
  ["E13ST"],
  "E13ST"
);
