const $find = new Proxy(
    {
        id: new Proxy(
            {},
            { get: (e, t) => document.querySelector(`#${t.toString()}`) },
        ),
        class: new Proxy(
            {},
            { get: (e, t) => document.querySelector(`.${t.toString()}`) },
        ),
        classes: new Proxy(
            {},
            { get: (e, t) => document.querySelectorAll(`.${t.toString()}`) },
        ),
        tag: new Proxy(
            {},
            { get: (e, t) => document.querySelector(`${t.toString()}`) },
        ),
        tags: new Proxy(
            {},
            { get: (e, t) => document.querySelectorAll(`${t.toString()}`) },
        ),
        attr(e, t) {
            if (t) return document.querySelector(`[${e}=${t}]`)
            document.querySelector(`[${e}]`)
        },
        attrs(e, t) {
            if (t) return document.querySelectorAll(`[${e}=${t}]`)
            document.querySelectorAll(`[${e}]`)
        },
    },
    { get: (e, t, r) => Reflect.get(e, t, r), set: () => !1 },
)
const $Id = new Proxy(
    {},
    {
        get(a, b, c) {
            return document.querySelector(`[_id=${b}]`)
        },
    },
)
const $trim = new Proxy(
    {},
    {
        get(a, b, c) {
            return document.querySelector(`[trimId=${b}]`)
        },
    },
)

function $useRoot(o, t, e) {
    let r = $useRoot.prototype.root
        ; (Boolean(r) && document.contains(r)) ||
            (($useRoot.prototype.root = $find.tag[':root']),
                (r = $useRoot.prototype.root))
    const s = Boolean(e) ? $find.attr('rootId', e) : r
    if (Boolean(s)) {
        if (!Boolean(t)) return getComputedStyle(s).getPropertyValue(o)
        {
            Boolean(e) || (e = ':root'), s.style.setProperty(o, t)
            const r = JSON.parse(localStorage.getItem('TrimRoots') || '{}')
            Boolean(r[e]) || (r[e] = {}),
                (r[e][o] = t),
                localStorage.setItem('TrimRoots', JSON.stringify(r))
        }
    }
}

window.$Id = $Id
window.$find = $find
window.$useRoot = $useRoot;
window.$trim = $trim
