var Gr = "184";
var sc = 0,
  Co = 1,
  rc = 2;
var Ss = 1,
  ac = 2,
  Hi = 3,
  An = 0,
  Dt = 1,
  fn = 2,
  pn = 0,
  si = 1,
  Ro = 2,
  Io = 3,
  Po = 4,
  oc = 5;
var kn = 100,
  lc = 101,
  cc = 102,
  hc = 103,
  uc = 104,
  dc = 200,
  fc = 201,
  pc = 202,
  mc = 203,
  lr = 204,
  cr = 205,
  gc = 206,
  _c = 207,
  xc = 208,
  vc = 209,
  yc = 210,
  Mc = 211,
  Sc = 212,
  bc = 213,
  Ec = 214,
  hr = 0,
  ur = 1,
  dr = 2,
  ri = 3,
  fr = 4,
  pr = 5,
  mr = 6,
  gr = 7,
  Hr = 0,
  Tc = 1,
  Ac = 2,
  Qt = 0,
  Lo = 1,
  Do = 2,
  Uo = 3,
  No = 4,
  Fo = 5,
  Oo = 6,
  Bo = 7;
var zo = 300,
  Yn = 301,
  di = 302,
  Wr = 303,
  Xr = 304,
  bs = 306,
  _r = 1e3,
  ln = 1001,
  xr = 1002,
  Mt = 1003,
  wc = 1004;
var Es = 1005;
var Tt = 1006,
  qr = 1007;
var Zn = 1008;
var Ft = 1009,
  Vo = 1010,
  ko = 1011,
  Wi = 1012,
  Yr = 1013,
  en = 1014,
  tn = 1015,
  mn = 1016,
  Zr = 1017,
  Jr = 1018,
  Xi = 1020,
  Go = 35902,
  Ho = 35899,
  Wo = 1021,
  Xo = 1022,
  Yt = 1023,
  cn = 1026,
  Jn = 1027,
  qo = 1028,
  $r = 1029,
  $n = 1030,
  Kr = 1031;
var jr = 1033,
  Ts = 33776,
  As = 33777,
  ws = 33778,
  Cs = 33779,
  Qr = 35840,
  ea = 35841,
  ta = 35842,
  na = 35843,
  ia = 36196,
  sa = 37492,
  ra = 37496,
  aa = 37488,
  oa = 37489,
  Rs = 37490,
  la = 37491,
  ca = 37808,
  ha = 37809,
  ua = 37810,
  da = 37811,
  fa = 37812,
  pa = 37813,
  ma = 37814,
  ga = 37815,
  _a = 37816,
  xa = 37817,
  va = 37818,
  ya = 37819,
  Ma = 37820,
  Sa = 37821,
  ba = 36492,
  Ea = 36494,
  Ta = 36495,
  Aa = 36283,
  wa = 36284,
  Is = 36285,
  Ca = 36286;
var is = 2300,
  vr = 2301,
  or = 2302,
  po = 2303,
  mo = 2400,
  go = 2401,
  _o = 2402;
var Ra = 3200;
var Ps = 0,
  Cc = 1,
  In = "",
  Et = "srgb",
  ss = "srgb-linear",
  rs = "linear",
  Qe = "srgb";
var ii = 7680;
var xo = 519,
  Rc = 512,
  Ic = 513,
  Pc = 514,
  Ia = 515,
  Lc = 516,
  Dc = 517,
  Pa = 518,
  Uc = 519,
  vo = 35044;
var Yo = "300 es",
  jt = 2e3,
  Pi = 2001;
function Lh(i) {
  for (let e = i.length - 1; e >= 0; --e) if (i[e] >= 65535) return !0;
  return !1;
}
function Dh(i) {
  return ArrayBuffer.isView(i) && !(i instanceof DataView);
}
function as(i) {
  return document.createElementNS("http://www.w3.org/1999/xhtml", i);
}
function Nc() {
  let i = as("canvas");
  return ((i.style.display = "block"), i);
}
var Cl = {},
  Li = null;
function Zo(...i) {
  let e = "THREE." + i.shift();
  Li ? Li("log", e, ...i) : console.log(e, ...i);
}
function Fc(i) {
  let e = i[0];
  if (typeof e == "string" && e.startsWith("TSL:")) {
    let t = i[1];
    t && t.isStackTrace
      ? (i[0] += " " + t.getLocation())
      : (i[1] =
          'Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.');
  }
  return i;
}
function Ce(...i) {
  i = Fc(i);
  let e = "THREE." + i.shift();
  if (Li) Li("warn", e, ...i);
  else {
    let t = i[0];
    t && t.isStackTrace ? console.warn(t.getError(e)) : console.warn(e, ...i);
  }
}
function Ie(...i) {
  i = Fc(i);
  let e = "THREE." + i.shift();
  if (Li) Li("error", e, ...i);
  else {
    let t = i[0];
    t && t.isStackTrace ? console.error(t.getError(e)) : console.error(e, ...i);
  }
}
function yr(...i) {
  let e = i.join(" ");
  e in Cl || ((Cl[e] = !0), Ce(...i));
}
function Oc(i, e, t) {
  return new Promise(function (n, s) {
    function r() {
      switch (i.clientWaitSync(e, i.SYNC_FLUSH_COMMANDS_BIT, 0)) {
        case i.WAIT_FAILED:
          s();
          break;
        case i.TIMEOUT_EXPIRED:
          setTimeout(r, t);
          break;
        default:
          n();
      }
    }
    setTimeout(r, t);
  });
}
var Bc = {
    [hr]: ur,
    [dr]: mr,
    [fr]: gr,
    [ri]: pr,
    [ur]: hr,
    [mr]: dr,
    [gr]: fr,
    [pr]: ri,
  },
  hn = class {
    addEventListener(e, t) {
      this._listeners === void 0 && (this._listeners = {});
      let n = this._listeners;
      (n[e] === void 0 && (n[e] = []), n[e].indexOf(t) === -1 && n[e].push(t));
    }
    hasEventListener(e, t) {
      let n = this._listeners;
      return n === void 0 ? !1 : n[e] !== void 0 && n[e].indexOf(t) !== -1;
    }
    removeEventListener(e, t) {
      let n = this._listeners;
      if (n === void 0) return;
      let s = n[e];
      if (s !== void 0) {
        let r = s.indexOf(t);
        r !== -1 && s.splice(r, 1);
      }
    }
    dispatchEvent(e) {
      let t = this._listeners;
      if (t === void 0) return;
      let n = t[e.type];
      if (n !== void 0) {
        e.target = this;
        let s = n.slice(0);
        for (let r = 0, a = s.length; r < a; r++) s[r].call(this, e);
        e.target = null;
      }
    }
  },
  Ct = [
    "00",
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "0a",
    "0b",
    "0c",
    "0d",
    "0e",
    "0f",
    "10",
    "11",
    "12",
    "13",
    "14",
    "15",
    "16",
    "17",
    "18",
    "19",
    "1a",
    "1b",
    "1c",
    "1d",
    "1e",
    "1f",
    "20",
    "21",
    "22",
    "23",
    "24",
    "25",
    "26",
    "27",
    "28",
    "29",
    "2a",
    "2b",
    "2c",
    "2d",
    "2e",
    "2f",
    "30",
    "31",
    "32",
    "33",
    "34",
    "35",
    "36",
    "37",
    "38",
    "39",
    "3a",
    "3b",
    "3c",
    "3d",
    "3e",
    "3f",
    "40",
    "41",
    "42",
    "43",
    "44",
    "45",
    "46",
    "47",
    "48",
    "49",
    "4a",
    "4b",
    "4c",
    "4d",
    "4e",
    "4f",
    "50",
    "51",
    "52",
    "53",
    "54",
    "55",
    "56",
    "57",
    "58",
    "59",
    "5a",
    "5b",
    "5c",
    "5d",
    "5e",
    "5f",
    "60",
    "61",
    "62",
    "63",
    "64",
    "65",
    "66",
    "67",
    "68",
    "69",
    "6a",
    "6b",
    "6c",
    "6d",
    "6e",
    "6f",
    "70",
    "71",
    "72",
    "73",
    "74",
    "75",
    "76",
    "77",
    "78",
    "79",
    "7a",
    "7b",
    "7c",
    "7d",
    "7e",
    "7f",
    "80",
    "81",
    "82",
    "83",
    "84",
    "85",
    "86",
    "87",
    "88",
    "89",
    "8a",
    "8b",
    "8c",
    "8d",
    "8e",
    "8f",
    "90",
    "91",
    "92",
    "93",
    "94",
    "95",
    "96",
    "97",
    "98",
    "99",
    "9a",
    "9b",
    "9c",
    "9d",
    "9e",
    "9f",
    "a0",
    "a1",
    "a2",
    "a3",
    "a4",
    "a5",
    "a6",
    "a7",
    "a8",
    "a9",
    "aa",
    "ab",
    "ac",
    "ad",
    "ae",
    "af",
    "b0",
    "b1",
    "b2",
    "b3",
    "b4",
    "b5",
    "b6",
    "b7",
    "b8",
    "b9",
    "ba",
    "bb",
    "bc",
    "bd",
    "be",
    "bf",
    "c0",
    "c1",
    "c2",
    "c3",
    "c4",
    "c5",
    "c6",
    "c7",
    "c8",
    "c9",
    "ca",
    "cb",
    "cc",
    "cd",
    "ce",
    "cf",
    "d0",
    "d1",
    "d2",
    "d3",
    "d4",
    "d5",
    "d6",
    "d7",
    "d8",
    "d9",
    "da",
    "db",
    "dc",
    "dd",
    "de",
    "df",
    "e0",
    "e1",
    "e2",
    "e3",
    "e4",
    "e5",
    "e6",
    "e7",
    "e8",
    "e9",
    "ea",
    "eb",
    "ec",
    "ed",
    "ee",
    "ef",
    "f0",
    "f1",
    "f2",
    "f3",
    "f4",
    "f5",
    "f6",
    "f7",
    "f8",
    "f9",
    "fa",
    "fb",
    "fc",
    "fd",
    "fe",
    "ff",
  ],
  Rl = 1234567,
  ts = Math.PI / 180,
  Di = 180 / Math.PI;
function qi() {
  let i = (Math.random() * 4294967295) | 0,
    e = (Math.random() * 4294967295) | 0,
    t = (Math.random() * 4294967295) | 0,
    n = (Math.random() * 4294967295) | 0;
  return (
    Ct[i & 255] +
    Ct[(i >> 8) & 255] +
    Ct[(i >> 16) & 255] +
    Ct[(i >> 24) & 255] +
    "-" +
    Ct[e & 255] +
    Ct[(e >> 8) & 255] +
    "-" +
    Ct[((e >> 16) & 15) | 64] +
    Ct[(e >> 24) & 255] +
    "-" +
    Ct[(t & 63) | 128] +
    Ct[(t >> 8) & 255] +
    "-" +
    Ct[(t >> 16) & 255] +
    Ct[(t >> 24) & 255] +
    Ct[n & 255] +
    Ct[(n >> 8) & 255] +
    Ct[(n >> 16) & 255] +
    Ct[(n >> 24) & 255]
  ).toLowerCase();
}
function qe(i, e, t) {
  return Math.max(e, Math.min(t, i));
}
function Jo(i, e) {
  return ((i % e) + e) % e;
}
function Uh(i, e, t, n, s) {
  return n + ((i - e) * (s - n)) / (t - e);
}
function Nh(i, e, t) {
  return i !== e ? (t - i) / (e - i) : 0;
}
function ns(i, e, t) {
  return (1 - t) * i + t * e;
}
function Fh(i, e, t, n) {
  return ns(i, e, 1 - Math.exp(-t * n));
}
function Oh(i, e = 1) {
  return e - Math.abs(Jo(i, e * 2) - e);
}
function Bh(i, e, t) {
  return i <= e
    ? 0
    : i >= t
      ? 1
      : ((i = (i - e) / (t - e)), i * i * (3 - 2 * i));
}
function zh(i, e, t) {
  return i <= e
    ? 0
    : i >= t
      ? 1
      : ((i = (i - e) / (t - e)), i * i * i * (i * (i * 6 - 15) + 10));
}
function Vh(i, e) {
  return i + Math.floor(Math.random() * (e - i + 1));
}
function kh(i, e) {
  return i + Math.random() * (e - i);
}
function Gh(i) {
  return i * (0.5 - Math.random());
}
function Hh(i) {
  i !== void 0 && (Rl = i);
  let e = (Rl += 1831565813);
  return (
    (e = Math.imul(e ^ (e >>> 15), e | 1)),
    (e ^= e + Math.imul(e ^ (e >>> 7), e | 61)),
    ((e ^ (e >>> 14)) >>> 0) / 4294967296
  );
}
function Wh(i) {
  return i * ts;
}
function Xh(i) {
  return i * Di;
}
function qh(i) {
  return (i & (i - 1)) === 0 && i !== 0;
}
function Yh(i) {
  return Math.pow(2, Math.ceil(Math.log(i) / Math.LN2));
}
function Zh(i) {
  return Math.pow(2, Math.floor(Math.log(i) / Math.LN2));
}
function Jh(i, e, t, n, s) {
  let r = Math.cos,
    a = Math.sin,
    o = r(t / 2),
    c = a(t / 2),
    l = r((e + n) / 2),
    u = a((e + n) / 2),
    d = r((e - n) / 2),
    h = a((e - n) / 2),
    p = r((n - e) / 2),
    g = a((n - e) / 2);
  switch (s) {
    case "XYX":
      i.set(o * u, c * d, c * h, o * l);
      break;
    case "YZY":
      i.set(c * h, o * u, c * d, o * l);
      break;
    case "ZXZ":
      i.set(c * d, c * h, o * u, o * l);
      break;
    case "XZX":
      i.set(o * u, c * g, c * p, o * l);
      break;
    case "YXY":
      i.set(c * p, o * u, c * g, o * l);
      break;
    case "ZYZ":
      i.set(c * g, c * p, o * u, o * l);
      break;
    default:
      Ce(
        "MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: " +
          s,
      );
  }
}
function Ri(i, e) {
  switch (e.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return i / 4294967295;
    case Uint16Array:
      return i / 65535;
    case Uint8Array:
      return i / 255;
    case Int32Array:
      return Math.max(i / 2147483647, -1);
    case Int16Array:
      return Math.max(i / 32767, -1);
    case Int8Array:
      return Math.max(i / 127, -1);
    default:
      throw new Error("Invalid component type.");
  }
}
function Lt(i, e) {
  switch (e.constructor) {
    case Float32Array:
      return i;
    case Uint32Array:
      return Math.round(i * 4294967295);
    case Uint16Array:
      return Math.round(i * 65535);
    case Uint8Array:
      return Math.round(i * 255);
    case Int32Array:
      return Math.round(i * 2147483647);
    case Int16Array:
      return Math.round(i * 32767);
    case Int8Array:
      return Math.round(i * 127);
    default:
      throw new Error("Invalid component type.");
  }
}
var nn = {
    DEG2RAD: ts,
    RAD2DEG: Di,
    generateUUID: qi,
    clamp: qe,
    euclideanModulo: Jo,
    mapLinear: Uh,
    inverseLerp: Nh,
    lerp: ns,
    damp: Fh,
    pingpong: Oh,
    smoothstep: Bh,
    smootherstep: zh,
    randInt: Vh,
    randFloat: kh,
    randFloatSpread: Gh,
    seededRandom: Hh,
    degToRad: Wh,
    radToDeg: Xh,
    isPowerOfTwo: qh,
    ceilPowerOfTwo: Yh,
    floorPowerOfTwo: Zh,
    setQuaternionFromProperEuler: Jh,
    normalize: Lt,
    denormalize: Ri,
  },
  Ye = class i {
    static {
      i.prototype.isVector2 = !0;
    }
    constructor(e = 0, t = 0) {
      ((this.x = e), (this.y = t));
    }
    get width() {
      return this.x;
    }
    set width(e) {
      this.x = e;
    }
    get height() {
      return this.y;
    }
    set height(e) {
      this.y = e;
    }
    set(e, t) {
      return ((this.x = e), (this.y = t), this);
    }
    setScalar(e) {
      return ((this.x = e), (this.y = e), this);
    }
    setX(e) {
      return ((this.x = e), this);
    }
    setY(e) {
      return ((this.y = e), this);
    }
    setComponent(e, t) {
      switch (e) {
        case 0:
          this.x = t;
          break;
        case 1:
          this.y = t;
          break;
        default:
          throw new Error("index is out of range: " + e);
      }
      return this;
    }
    getComponent(e) {
      switch (e) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        default:
          throw new Error("index is out of range: " + e);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y);
    }
    copy(e) {
      return ((this.x = e.x), (this.y = e.y), this);
    }
    add(e) {
      return ((this.x += e.x), (this.y += e.y), this);
    }
    addScalar(e) {
      return ((this.x += e), (this.y += e), this);
    }
    addVectors(e, t) {
      return ((this.x = e.x + t.x), (this.y = e.y + t.y), this);
    }
    addScaledVector(e, t) {
      return ((this.x += e.x * t), (this.y += e.y * t), this);
    }
    sub(e) {
      return ((this.x -= e.x), (this.y -= e.y), this);
    }
    subScalar(e) {
      return ((this.x -= e), (this.y -= e), this);
    }
    subVectors(e, t) {
      return ((this.x = e.x - t.x), (this.y = e.y - t.y), this);
    }
    multiply(e) {
      return ((this.x *= e.x), (this.y *= e.y), this);
    }
    multiplyScalar(e) {
      return ((this.x *= e), (this.y *= e), this);
    }
    divide(e) {
      return ((this.x /= e.x), (this.y /= e.y), this);
    }
    divideScalar(e) {
      return this.multiplyScalar(1 / e);
    }
    applyMatrix3(e) {
      let t = this.x,
        n = this.y,
        s = e.elements;
      return (
        (this.x = s[0] * t + s[3] * n + s[6]),
        (this.y = s[1] * t + s[4] * n + s[7]),
        this
      );
    }
    min(e) {
      return (
        (this.x = Math.min(this.x, e.x)),
        (this.y = Math.min(this.y, e.y)),
        this
      );
    }
    max(e) {
      return (
        (this.x = Math.max(this.x, e.x)),
        (this.y = Math.max(this.y, e.y)),
        this
      );
    }
    clamp(e, t) {
      return (
        (this.x = qe(this.x, e.x, t.x)),
        (this.y = qe(this.y, e.y, t.y)),
        this
      );
    }
    clampScalar(e, t) {
      return ((this.x = qe(this.x, e, t)), (this.y = qe(this.y, e, t)), this);
    }
    clampLength(e, t) {
      let n = this.length();
      return this.divideScalar(n || 1).multiplyScalar(qe(n, e, t));
    }
    floor() {
      return (
        (this.x = Math.floor(this.x)),
        (this.y = Math.floor(this.y)),
        this
      );
    }
    ceil() {
      return ((this.x = Math.ceil(this.x)), (this.y = Math.ceil(this.y)), this);
    }
    round() {
      return (
        (this.x = Math.round(this.x)),
        (this.y = Math.round(this.y)),
        this
      );
    }
    roundToZero() {
      return (
        (this.x = Math.trunc(this.x)),
        (this.y = Math.trunc(this.y)),
        this
      );
    }
    negate() {
      return ((this.x = -this.x), (this.y = -this.y), this);
    }
    dot(e) {
      return this.x * e.x + this.y * e.y;
    }
    cross(e) {
      return this.x * e.y - this.y * e.x;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    angle() {
      return Math.atan2(-this.y, -this.x) + Math.PI;
    }
    angleTo(e) {
      let t = Math.sqrt(this.lengthSq() * e.lengthSq());
      if (t === 0) return Math.PI / 2;
      let n = this.dot(e) / t;
      return Math.acos(qe(n, -1, 1));
    }
    distanceTo(e) {
      return Math.sqrt(this.distanceToSquared(e));
    }
    distanceToSquared(e) {
      let t = this.x - e.x,
        n = this.y - e.y;
      return t * t + n * n;
    }
    manhattanDistanceTo(e) {
      return Math.abs(this.x - e.x) + Math.abs(this.y - e.y);
    }
    setLength(e) {
      return this.normalize().multiplyScalar(e);
    }
    lerp(e, t) {
      return (
        (this.x += (e.x - this.x) * t),
        (this.y += (e.y - this.y) * t),
        this
      );
    }
    lerpVectors(e, t, n) {
      return (
        (this.x = e.x + (t.x - e.x) * n),
        (this.y = e.y + (t.y - e.y) * n),
        this
      );
    }
    equals(e) {
      return e.x === this.x && e.y === this.y;
    }
    fromArray(e, t = 0) {
      return ((this.x = e[t]), (this.y = e[t + 1]), this);
    }
    toArray(e = [], t = 0) {
      return ((e[t] = this.x), (e[t + 1] = this.y), e);
    }
    fromBufferAttribute(e, t) {
      return ((this.x = e.getX(t)), (this.y = e.getY(t)), this);
    }
    rotateAround(e, t) {
      let n = Math.cos(t),
        s = Math.sin(t),
        r = this.x - e.x,
        a = this.y - e.y;
      return (
        (this.x = r * n - a * s + e.x),
        (this.y = r * s + a * n + e.y),
        this
      );
    }
    random() {
      return ((this.x = Math.random()), (this.y = Math.random()), this);
    }
    *[Symbol.iterator]() {
      (yield this.x, yield this.y);
    }
  },
  un = class {
    constructor(e = 0, t = 0, n = 0, s = 1) {
      ((this.isQuaternion = !0),
        (this._x = e),
        (this._y = t),
        (this._z = n),
        (this._w = s));
    }
    static slerpFlat(e, t, n, s, r, a, o) {
      let c = n[s + 0],
        l = n[s + 1],
        u = n[s + 2],
        d = n[s + 3],
        h = r[a + 0],
        p = r[a + 1],
        g = r[a + 2],
        y = r[a + 3];
      if (d !== y || c !== h || l !== p || u !== g) {
        let m = c * h + l * p + u * g + d * y;
        m < 0 && ((h = -h), (p = -p), (g = -g), (y = -y), (m = -m));
        let f = 1 - o;
        if (m < 0.9995) {
          let M = Math.acos(m),
            T = Math.sin(M);
          ((f = Math.sin(f * M) / T),
            (o = Math.sin(o * M) / T),
            (c = c * f + h * o),
            (l = l * f + p * o),
            (u = u * f + g * o),
            (d = d * f + y * o));
        } else {
          ((c = c * f + h * o),
            (l = l * f + p * o),
            (u = u * f + g * o),
            (d = d * f + y * o));
          let M = 1 / Math.sqrt(c * c + l * l + u * u + d * d);
          ((c *= M), (l *= M), (u *= M), (d *= M));
        }
      }
      ((e[t] = c), (e[t + 1] = l), (e[t + 2] = u), (e[t + 3] = d));
    }
    static multiplyQuaternionsFlat(e, t, n, s, r, a) {
      let o = n[s],
        c = n[s + 1],
        l = n[s + 2],
        u = n[s + 3],
        d = r[a],
        h = r[a + 1],
        p = r[a + 2],
        g = r[a + 3];
      return (
        (e[t] = o * g + u * d + c * p - l * h),
        (e[t + 1] = c * g + u * h + l * d - o * p),
        (e[t + 2] = l * g + u * p + o * h - c * d),
        (e[t + 3] = u * g - o * d - c * h - l * p),
        e
      );
    }
    get x() {
      return this._x;
    }
    set x(e) {
      ((this._x = e), this._onChangeCallback());
    }
    get y() {
      return this._y;
    }
    set y(e) {
      ((this._y = e), this._onChangeCallback());
    }
    get z() {
      return this._z;
    }
    set z(e) {
      ((this._z = e), this._onChangeCallback());
    }
    get w() {
      return this._w;
    }
    set w(e) {
      ((this._w = e), this._onChangeCallback());
    }
    set(e, t, n, s) {
      return (
        (this._x = e),
        (this._y = t),
        (this._z = n),
        (this._w = s),
        this._onChangeCallback(),
        this
      );
    }
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._w);
    }
    copy(e) {
      return (
        (this._x = e.x),
        (this._y = e.y),
        (this._z = e.z),
        (this._w = e.w),
        this._onChangeCallback(),
        this
      );
    }
    setFromEuler(e, t = !0) {
      let n = e._x,
        s = e._y,
        r = e._z,
        a = e._order,
        o = Math.cos,
        c = Math.sin,
        l = o(n / 2),
        u = o(s / 2),
        d = o(r / 2),
        h = c(n / 2),
        p = c(s / 2),
        g = c(r / 2);
      switch (a) {
        case "XYZ":
          ((this._x = h * u * d + l * p * g),
            (this._y = l * p * d - h * u * g),
            (this._z = l * u * g + h * p * d),
            (this._w = l * u * d - h * p * g));
          break;
        case "YXZ":
          ((this._x = h * u * d + l * p * g),
            (this._y = l * p * d - h * u * g),
            (this._z = l * u * g - h * p * d),
            (this._w = l * u * d + h * p * g));
          break;
        case "ZXY":
          ((this._x = h * u * d - l * p * g),
            (this._y = l * p * d + h * u * g),
            (this._z = l * u * g + h * p * d),
            (this._w = l * u * d - h * p * g));
          break;
        case "ZYX":
          ((this._x = h * u * d - l * p * g),
            (this._y = l * p * d + h * u * g),
            (this._z = l * u * g - h * p * d),
            (this._w = l * u * d + h * p * g));
          break;
        case "YZX":
          ((this._x = h * u * d + l * p * g),
            (this._y = l * p * d + h * u * g),
            (this._z = l * u * g - h * p * d),
            (this._w = l * u * d - h * p * g));
          break;
        case "XZY":
          ((this._x = h * u * d - l * p * g),
            (this._y = l * p * d - h * u * g),
            (this._z = l * u * g + h * p * d),
            (this._w = l * u * d + h * p * g));
          break;
        default:
          Ce("Quaternion: .setFromEuler() encountered an unknown order: " + a);
      }
      return (t === !0 && this._onChangeCallback(), this);
    }
    setFromAxisAngle(e, t) {
      let n = t / 2,
        s = Math.sin(n);
      return (
        (this._x = e.x * s),
        (this._y = e.y * s),
        (this._z = e.z * s),
        (this._w = Math.cos(n)),
        this._onChangeCallback(),
        this
      );
    }
    setFromRotationMatrix(e) {
      let t = e.elements,
        n = t[0],
        s = t[4],
        r = t[8],
        a = t[1],
        o = t[5],
        c = t[9],
        l = t[2],
        u = t[6],
        d = t[10],
        h = n + o + d;
      if (h > 0) {
        let p = 0.5 / Math.sqrt(h + 1);
        ((this._w = 0.25 / p),
          (this._x = (u - c) * p),
          (this._y = (r - l) * p),
          (this._z = (a - s) * p));
      } else if (n > o && n > d) {
        let p = 2 * Math.sqrt(1 + n - o - d);
        ((this._w = (u - c) / p),
          (this._x = 0.25 * p),
          (this._y = (s + a) / p),
          (this._z = (r + l) / p));
      } else if (o > d) {
        let p = 2 * Math.sqrt(1 + o - n - d);
        ((this._w = (r - l) / p),
          (this._x = (s + a) / p),
          (this._y = 0.25 * p),
          (this._z = (c + u) / p));
      } else {
        let p = 2 * Math.sqrt(1 + d - n - o);
        ((this._w = (a - s) / p),
          (this._x = (r + l) / p),
          (this._y = (c + u) / p),
          (this._z = 0.25 * p));
      }
      return (this._onChangeCallback(), this);
    }
    setFromUnitVectors(e, t) {
      let n = e.dot(t) + 1;
      return (
        n < 1e-8
          ? ((n = 0),
            Math.abs(e.x) > Math.abs(e.z)
              ? ((this._x = -e.y),
                (this._y = e.x),
                (this._z = 0),
                (this._w = n))
              : ((this._x = 0),
                (this._y = -e.z),
                (this._z = e.y),
                (this._w = n)))
          : ((this._x = e.y * t.z - e.z * t.y),
            (this._y = e.z * t.x - e.x * t.z),
            (this._z = e.x * t.y - e.y * t.x),
            (this._w = n)),
        this.normalize()
      );
    }
    angleTo(e) {
      return 2 * Math.acos(Math.abs(qe(this.dot(e), -1, 1)));
    }
    rotateTowards(e, t) {
      let n = this.angleTo(e);
      if (n === 0) return this;
      let s = Math.min(1, t / n);
      return (this.slerp(e, s), this);
    }
    identity() {
      return this.set(0, 0, 0, 1);
    }
    invert() {
      return this.conjugate();
    }
    conjugate() {
      return (
        (this._x *= -1),
        (this._y *= -1),
        (this._z *= -1),
        this._onChangeCallback(),
        this
      );
    }
    dot(e) {
      return this._x * e._x + this._y * e._y + this._z * e._z + this._w * e._w;
    }
    lengthSq() {
      return (
        this._x * this._x +
        this._y * this._y +
        this._z * this._z +
        this._w * this._w
      );
    }
    length() {
      return Math.sqrt(
        this._x * this._x +
          this._y * this._y +
          this._z * this._z +
          this._w * this._w,
      );
    }
    normalize() {
      let e = this.length();
      return (
        e === 0
          ? ((this._x = 0), (this._y = 0), (this._z = 0), (this._w = 1))
          : ((e = 1 / e),
            (this._x = this._x * e),
            (this._y = this._y * e),
            (this._z = this._z * e),
            (this._w = this._w * e)),
        this._onChangeCallback(),
        this
      );
    }
    multiply(e) {
      return this.multiplyQuaternions(this, e);
    }
    premultiply(e) {
      return this.multiplyQuaternions(e, this);
    }
    multiplyQuaternions(e, t) {
      let n = e._x,
        s = e._y,
        r = e._z,
        a = e._w,
        o = t._x,
        c = t._y,
        l = t._z,
        u = t._w;
      return (
        (this._x = n * u + a * o + s * l - r * c),
        (this._y = s * u + a * c + r * o - n * l),
        (this._z = r * u + a * l + n * c - s * o),
        (this._w = a * u - n * o - s * c - r * l),
        this._onChangeCallback(),
        this
      );
    }
    slerp(e, t) {
      let n = e._x,
        s = e._y,
        r = e._z,
        a = e._w,
        o = this.dot(e);
      o < 0 && ((n = -n), (s = -s), (r = -r), (a = -a), (o = -o));
      let c = 1 - t;
      if (o < 0.9995) {
        let l = Math.acos(o),
          u = Math.sin(l);
        ((c = Math.sin(c * l) / u),
          (t = Math.sin(t * l) / u),
          (this._x = this._x * c + n * t),
          (this._y = this._y * c + s * t),
          (this._z = this._z * c + r * t),
          (this._w = this._w * c + a * t),
          this._onChangeCallback());
      } else
        ((this._x = this._x * c + n * t),
          (this._y = this._y * c + s * t),
          (this._z = this._z * c + r * t),
          (this._w = this._w * c + a * t),
          this.normalize());
      return this;
    }
    slerpQuaternions(e, t, n) {
      return this.copy(e).slerp(t, n);
    }
    random() {
      let e = 2 * Math.PI * Math.random(),
        t = 2 * Math.PI * Math.random(),
        n = Math.random(),
        s = Math.sqrt(1 - n),
        r = Math.sqrt(n);
      return this.set(
        s * Math.sin(e),
        s * Math.cos(e),
        r * Math.sin(t),
        r * Math.cos(t),
      );
    }
    equals(e) {
      return (
        e._x === this._x &&
        e._y === this._y &&
        e._z === this._z &&
        e._w === this._w
      );
    }
    fromArray(e, t = 0) {
      return (
        (this._x = e[t]),
        (this._y = e[t + 1]),
        (this._z = e[t + 2]),
        (this._w = e[t + 3]),
        this._onChangeCallback(),
        this
      );
    }
    toArray(e = [], t = 0) {
      return (
        (e[t] = this._x),
        (e[t + 1] = this._y),
        (e[t + 2] = this._z),
        (e[t + 3] = this._w),
        e
      );
    }
    fromBufferAttribute(e, t) {
      return (
        (this._x = e.getX(t)),
        (this._y = e.getY(t)),
        (this._z = e.getZ(t)),
        (this._w = e.getW(t)),
        this._onChangeCallback(),
        this
      );
    }
    toJSON() {
      return this.toArray();
    }
    _onChange(e) {
      return ((this._onChangeCallback = e), this);
    }
    _onChangeCallback() {}
    *[Symbol.iterator]() {
      (yield this._x, yield this._y, yield this._z, yield this._w);
    }
  },
  U = class i {
    static {
      i.prototype.isVector3 = !0;
    }
    constructor(e = 0, t = 0, n = 0) {
      ((this.x = e), (this.y = t), (this.z = n));
    }
    set(e, t, n) {
      return (
        n === void 0 && (n = this.z),
        (this.x = e),
        (this.y = t),
        (this.z = n),
        this
      );
    }
    setScalar(e) {
      return ((this.x = e), (this.y = e), (this.z = e), this);
    }
    setX(e) {
      return ((this.x = e), this);
    }
    setY(e) {
      return ((this.y = e), this);
    }
    setZ(e) {
      return ((this.z = e), this);
    }
    setComponent(e, t) {
      switch (e) {
        case 0:
          this.x = t;
          break;
        case 1:
          this.y = t;
          break;
        case 2:
          this.z = t;
          break;
        default:
          throw new Error("index is out of range: " + e);
      }
      return this;
    }
    getComponent(e) {
      switch (e) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        default:
          throw new Error("index is out of range: " + e);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y, this.z);
    }
    copy(e) {
      return ((this.x = e.x), (this.y = e.y), (this.z = e.z), this);
    }
    add(e) {
      return ((this.x += e.x), (this.y += e.y), (this.z += e.z), this);
    }
    addScalar(e) {
      return ((this.x += e), (this.y += e), (this.z += e), this);
    }
    addVectors(e, t) {
      return (
        (this.x = e.x + t.x),
        (this.y = e.y + t.y),
        (this.z = e.z + t.z),
        this
      );
    }
    addScaledVector(e, t) {
      return (
        (this.x += e.x * t),
        (this.y += e.y * t),
        (this.z += e.z * t),
        this
      );
    }
    sub(e) {
      return ((this.x -= e.x), (this.y -= e.y), (this.z -= e.z), this);
    }
    subScalar(e) {
      return ((this.x -= e), (this.y -= e), (this.z -= e), this);
    }
    subVectors(e, t) {
      return (
        (this.x = e.x - t.x),
        (this.y = e.y - t.y),
        (this.z = e.z - t.z),
        this
      );
    }
    multiply(e) {
      return ((this.x *= e.x), (this.y *= e.y), (this.z *= e.z), this);
    }
    multiplyScalar(e) {
      return ((this.x *= e), (this.y *= e), (this.z *= e), this);
    }
    multiplyVectors(e, t) {
      return (
        (this.x = e.x * t.x),
        (this.y = e.y * t.y),
        (this.z = e.z * t.z),
        this
      );
    }
    applyEuler(e) {
      return this.applyQuaternion(Il.setFromEuler(e));
    }
    applyAxisAngle(e, t) {
      return this.applyQuaternion(Il.setFromAxisAngle(e, t));
    }
    applyMatrix3(e) {
      let t = this.x,
        n = this.y,
        s = this.z,
        r = e.elements;
      return (
        (this.x = r[0] * t + r[3] * n + r[6] * s),
        (this.y = r[1] * t + r[4] * n + r[7] * s),
        (this.z = r[2] * t + r[5] * n + r[8] * s),
        this
      );
    }
    applyNormalMatrix(e) {
      return this.applyMatrix3(e).normalize();
    }
    applyMatrix4(e) {
      let t = this.x,
        n = this.y,
        s = this.z,
        r = e.elements,
        a = 1 / (r[3] * t + r[7] * n + r[11] * s + r[15]);
      return (
        (this.x = (r[0] * t + r[4] * n + r[8] * s + r[12]) * a),
        (this.y = (r[1] * t + r[5] * n + r[9] * s + r[13]) * a),
        (this.z = (r[2] * t + r[6] * n + r[10] * s + r[14]) * a),
        this
      );
    }
    applyQuaternion(e) {
      let t = this.x,
        n = this.y,
        s = this.z,
        r = e.x,
        a = e.y,
        o = e.z,
        c = e.w,
        l = 2 * (a * s - o * n),
        u = 2 * (o * t - r * s),
        d = 2 * (r * n - a * t);
      return (
        (this.x = t + c * l + a * d - o * u),
        (this.y = n + c * u + o * l - r * d),
        (this.z = s + c * d + r * u - a * l),
        this
      );
    }
    project(e) {
      return this.applyMatrix4(e.matrixWorldInverse).applyMatrix4(
        e.projectionMatrix,
      );
    }
    unproject(e) {
      return this.applyMatrix4(e.projectionMatrixInverse).applyMatrix4(
        e.matrixWorld,
      );
    }
    transformDirection(e) {
      let t = this.x,
        n = this.y,
        s = this.z,
        r = e.elements;
      return (
        (this.x = r[0] * t + r[4] * n + r[8] * s),
        (this.y = r[1] * t + r[5] * n + r[9] * s),
        (this.z = r[2] * t + r[6] * n + r[10] * s),
        this.normalize()
      );
    }
    divide(e) {
      return ((this.x /= e.x), (this.y /= e.y), (this.z /= e.z), this);
    }
    divideScalar(e) {
      return this.multiplyScalar(1 / e);
    }
    min(e) {
      return (
        (this.x = Math.min(this.x, e.x)),
        (this.y = Math.min(this.y, e.y)),
        (this.z = Math.min(this.z, e.z)),
        this
      );
    }
    max(e) {
      return (
        (this.x = Math.max(this.x, e.x)),
        (this.y = Math.max(this.y, e.y)),
        (this.z = Math.max(this.z, e.z)),
        this
      );
    }
    clamp(e, t) {
      return (
        (this.x = qe(this.x, e.x, t.x)),
        (this.y = qe(this.y, e.y, t.y)),
        (this.z = qe(this.z, e.z, t.z)),
        this
      );
    }
    clampScalar(e, t) {
      return (
        (this.x = qe(this.x, e, t)),
        (this.y = qe(this.y, e, t)),
        (this.z = qe(this.z, e, t)),
        this
      );
    }
    clampLength(e, t) {
      let n = this.length();
      return this.divideScalar(n || 1).multiplyScalar(qe(n, e, t));
    }
    floor() {
      return (
        (this.x = Math.floor(this.x)),
        (this.y = Math.floor(this.y)),
        (this.z = Math.floor(this.z)),
        this
      );
    }
    ceil() {
      return (
        (this.x = Math.ceil(this.x)),
        (this.y = Math.ceil(this.y)),
        (this.z = Math.ceil(this.z)),
        this
      );
    }
    round() {
      return (
        (this.x = Math.round(this.x)),
        (this.y = Math.round(this.y)),
        (this.z = Math.round(this.z)),
        this
      );
    }
    roundToZero() {
      return (
        (this.x = Math.trunc(this.x)),
        (this.y = Math.trunc(this.y)),
        (this.z = Math.trunc(this.z)),
        this
      );
    }
    negate() {
      return ((this.x = -this.x), (this.y = -this.y), (this.z = -this.z), this);
    }
    dot(e) {
      return this.x * e.x + this.y * e.y + this.z * e.z;
    }
    lengthSq() {
      return this.x * this.x + this.y * this.y + this.z * this.z;
    }
    length() {
      return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
    manhattanLength() {
      return Math.abs(this.x) + Math.abs(this.y) + Math.abs(this.z);
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    setLength(e) {
      return this.normalize().multiplyScalar(e);
    }
    lerp(e, t) {
      return (
        (this.x += (e.x - this.x) * t),
        (this.y += (e.y - this.y) * t),
        (this.z += (e.z - this.z) * t),
        this
      );
    }
    lerpVectors(e, t, n) {
      return (
        (this.x = e.x + (t.x - e.x) * n),
        (this.y = e.y + (t.y - e.y) * n),
        (this.z = e.z + (t.z - e.z) * n),
        this
      );
    }
    cross(e) {
      return this.crossVectors(this, e);
    }
    crossVectors(e, t) {
      let n = e.x,
        s = e.y,
        r = e.z,
        a = t.x,
        o = t.y,
        c = t.z;
      return (
        (this.x = s * c - r * o),
        (this.y = r * a - n * c),
        (this.z = n * o - s * a),
        this
      );
    }
    projectOnVector(e) {
      let t = e.lengthSq();
      if (t === 0) return this.set(0, 0, 0);
      let n = e.dot(this) / t;
      return this.copy(e).multiplyScalar(n);
    }
    projectOnPlane(e) {
      return (Wa.copy(this).projectOnVector(e), this.sub(Wa));
    }
    reflect(e) {
      return this.sub(Wa.copy(e).multiplyScalar(2 * this.dot(e)));
    }
    angleTo(e) {
      let t = Math.sqrt(this.lengthSq() * e.lengthSq());
      if (t === 0) return Math.PI / 2;
      let n = this.dot(e) / t;
      return Math.acos(qe(n, -1, 1));
    }
    distanceTo(e) {
      return Math.sqrt(this.distanceToSquared(e));
    }
    distanceToSquared(e) {
      let t = this.x - e.x,
        n = this.y - e.y,
        s = this.z - e.z;
      return t * t + n * n + s * s;
    }
    manhattanDistanceTo(e) {
      return (
        Math.abs(this.x - e.x) + Math.abs(this.y - e.y) + Math.abs(this.z - e.z)
      );
    }
    setFromSpherical(e) {
      return this.setFromSphericalCoords(e.radius, e.phi, e.theta);
    }
    setFromSphericalCoords(e, t, n) {
      let s = Math.sin(t) * e;
      return (
        (this.x = s * Math.sin(n)),
        (this.y = Math.cos(t) * e),
        (this.z = s * Math.cos(n)),
        this
      );
    }
    setFromCylindrical(e) {
      return this.setFromCylindricalCoords(e.radius, e.theta, e.y);
    }
    setFromCylindricalCoords(e, t, n) {
      return (
        (this.x = e * Math.sin(t)),
        (this.y = n),
        (this.z = e * Math.cos(t)),
        this
      );
    }
    setFromMatrixPosition(e) {
      let t = e.elements;
      return ((this.x = t[12]), (this.y = t[13]), (this.z = t[14]), this);
    }
    setFromMatrixScale(e) {
      let t = this.setFromMatrixColumn(e, 0).length(),
        n = this.setFromMatrixColumn(e, 1).length(),
        s = this.setFromMatrixColumn(e, 2).length();
      return ((this.x = t), (this.y = n), (this.z = s), this);
    }
    setFromMatrixColumn(e, t) {
      return this.fromArray(e.elements, t * 4);
    }
    setFromMatrix3Column(e, t) {
      return this.fromArray(e.elements, t * 3);
    }
    setFromEuler(e) {
      return ((this.x = e._x), (this.y = e._y), (this.z = e._z), this);
    }
    setFromColor(e) {
      return ((this.x = e.r), (this.y = e.g), (this.z = e.b), this);
    }
    equals(e) {
      return e.x === this.x && e.y === this.y && e.z === this.z;
    }
    fromArray(e, t = 0) {
      return ((this.x = e[t]), (this.y = e[t + 1]), (this.z = e[t + 2]), this);
    }
    toArray(e = [], t = 0) {
      return ((e[t] = this.x), (e[t + 1] = this.y), (e[t + 2] = this.z), e);
    }
    fromBufferAttribute(e, t) {
      return (
        (this.x = e.getX(t)),
        (this.y = e.getY(t)),
        (this.z = e.getZ(t)),
        this
      );
    }
    random() {
      return (
        (this.x = Math.random()),
        (this.y = Math.random()),
        (this.z = Math.random()),
        this
      );
    }
    randomDirection() {
      let e = Math.random() * Math.PI * 2,
        t = Math.random() * 2 - 1,
        n = Math.sqrt(1 - t * t);
      return (
        (this.x = n * Math.cos(e)),
        (this.y = t),
        (this.z = n * Math.sin(e)),
        this
      );
    }
    *[Symbol.iterator]() {
      (yield this.x, yield this.y, yield this.z);
    }
  },
  Wa = new U(),
  Il = new un(),
  Ne = class i {
    static {
      i.prototype.isMatrix3 = !0;
    }
    constructor(e, t, n, s, r, a, o, c, l) {
      ((this.elements = [1, 0, 0, 0, 1, 0, 0, 0, 1]),
        e !== void 0 && this.set(e, t, n, s, r, a, o, c, l));
    }
    set(e, t, n, s, r, a, o, c, l) {
      let u = this.elements;
      return (
        (u[0] = e),
        (u[1] = s),
        (u[2] = o),
        (u[3] = t),
        (u[4] = r),
        (u[5] = c),
        (u[6] = n),
        (u[7] = a),
        (u[8] = l),
        this
      );
    }
    identity() {
      return (this.set(1, 0, 0, 0, 1, 0, 0, 0, 1), this);
    }
    copy(e) {
      let t = this.elements,
        n = e.elements;
      return (
        (t[0] = n[0]),
        (t[1] = n[1]),
        (t[2] = n[2]),
        (t[3] = n[3]),
        (t[4] = n[4]),
        (t[5] = n[5]),
        (t[6] = n[6]),
        (t[7] = n[7]),
        (t[8] = n[8]),
        this
      );
    }
    extractBasis(e, t, n) {
      return (
        e.setFromMatrix3Column(this, 0),
        t.setFromMatrix3Column(this, 1),
        n.setFromMatrix3Column(this, 2),
        this
      );
    }
    setFromMatrix4(e) {
      let t = e.elements;
      return (
        this.set(t[0], t[4], t[8], t[1], t[5], t[9], t[2], t[6], t[10]),
        this
      );
    }
    multiply(e) {
      return this.multiplyMatrices(this, e);
    }
    premultiply(e) {
      return this.multiplyMatrices(e, this);
    }
    multiplyMatrices(e, t) {
      let n = e.elements,
        s = t.elements,
        r = this.elements,
        a = n[0],
        o = n[3],
        c = n[6],
        l = n[1],
        u = n[4],
        d = n[7],
        h = n[2],
        p = n[5],
        g = n[8],
        y = s[0],
        m = s[3],
        f = s[6],
        M = s[1],
        T = s[4],
        E = s[7],
        w = s[2],
        b = s[5],
        R = s[8];
      return (
        (r[0] = a * y + o * M + c * w),
        (r[3] = a * m + o * T + c * b),
        (r[6] = a * f + o * E + c * R),
        (r[1] = l * y + u * M + d * w),
        (r[4] = l * m + u * T + d * b),
        (r[7] = l * f + u * E + d * R),
        (r[2] = h * y + p * M + g * w),
        (r[5] = h * m + p * T + g * b),
        (r[8] = h * f + p * E + g * R),
        this
      );
    }
    multiplyScalar(e) {
      let t = this.elements;
      return (
        (t[0] *= e),
        (t[3] *= e),
        (t[6] *= e),
        (t[1] *= e),
        (t[4] *= e),
        (t[7] *= e),
        (t[2] *= e),
        (t[5] *= e),
        (t[8] *= e),
        this
      );
    }
    determinant() {
      let e = this.elements,
        t = e[0],
        n = e[1],
        s = e[2],
        r = e[3],
        a = e[4],
        o = e[5],
        c = e[6],
        l = e[7],
        u = e[8];
      return (
        t * a * u - t * o * l - n * r * u + n * o * c + s * r * l - s * a * c
      );
    }
    invert() {
      let e = this.elements,
        t = e[0],
        n = e[1],
        s = e[2],
        r = e[3],
        a = e[4],
        o = e[5],
        c = e[6],
        l = e[7],
        u = e[8],
        d = u * a - o * l,
        h = o * c - u * r,
        p = l * r - a * c,
        g = t * d + n * h + s * p;
      if (g === 0) return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0);
      let y = 1 / g;
      return (
        (e[0] = d * y),
        (e[1] = (s * l - u * n) * y),
        (e[2] = (o * n - s * a) * y),
        (e[3] = h * y),
        (e[4] = (u * t - s * c) * y),
        (e[5] = (s * r - o * t) * y),
        (e[6] = p * y),
        (e[7] = (n * c - l * t) * y),
        (e[8] = (a * t - n * r) * y),
        this
      );
    }
    transpose() {
      let e,
        t = this.elements;
      return (
        (e = t[1]),
        (t[1] = t[3]),
        (t[3] = e),
        (e = t[2]),
        (t[2] = t[6]),
        (t[6] = e),
        (e = t[5]),
        (t[5] = t[7]),
        (t[7] = e),
        this
      );
    }
    getNormalMatrix(e) {
      return this.setFromMatrix4(e).invert().transpose();
    }
    transposeIntoArray(e) {
      let t = this.elements;
      return (
        (e[0] = t[0]),
        (e[1] = t[3]),
        (e[2] = t[6]),
        (e[3] = t[1]),
        (e[4] = t[4]),
        (e[5] = t[7]),
        (e[6] = t[2]),
        (e[7] = t[5]),
        (e[8] = t[8]),
        this
      );
    }
    setUvTransform(e, t, n, s, r, a, o) {
      let c = Math.cos(r),
        l = Math.sin(r);
      return (
        this.set(
          n * c,
          n * l,
          -n * (c * a + l * o) + a + e,
          -s * l,
          s * c,
          -s * (-l * a + c * o) + o + t,
          0,
          0,
          1,
        ),
        this
      );
    }
    scale(e, t) {
      return (this.premultiply(Xa.makeScale(e, t)), this);
    }
    rotate(e) {
      return (this.premultiply(Xa.makeRotation(-e)), this);
    }
    translate(e, t) {
      return (this.premultiply(Xa.makeTranslation(e, t)), this);
    }
    makeTranslation(e, t) {
      return (
        e.isVector2
          ? this.set(1, 0, e.x, 0, 1, e.y, 0, 0, 1)
          : this.set(1, 0, e, 0, 1, t, 0, 0, 1),
        this
      );
    }
    makeRotation(e) {
      let t = Math.cos(e),
        n = Math.sin(e);
      return (this.set(t, -n, 0, n, t, 0, 0, 0, 1), this);
    }
    makeScale(e, t) {
      return (this.set(e, 0, 0, 0, t, 0, 0, 0, 1), this);
    }
    equals(e) {
      let t = this.elements,
        n = e.elements;
      for (let s = 0; s < 9; s++) if (t[s] !== n[s]) return !1;
      return !0;
    }
    fromArray(e, t = 0) {
      for (let n = 0; n < 9; n++) this.elements[n] = e[n + t];
      return this;
    }
    toArray(e = [], t = 0) {
      let n = this.elements;
      return (
        (e[t] = n[0]),
        (e[t + 1] = n[1]),
        (e[t + 2] = n[2]),
        (e[t + 3] = n[3]),
        (e[t + 4] = n[4]),
        (e[t + 5] = n[5]),
        (e[t + 6] = n[6]),
        (e[t + 7] = n[7]),
        (e[t + 8] = n[8]),
        e
      );
    }
    clone() {
      return new this.constructor().fromArray(this.elements);
    }
  },
  Xa = new Ne(),
  Pl = new Ne().set(
    0.4123908,
    0.3575843,
    0.1804808,
    0.212639,
    0.7151687,
    0.0721923,
    0.0193308,
    0.1191948,
    0.9505322,
  ),
  Ll = new Ne().set(
    3.2409699,
    -1.5373832,
    -0.4986108,
    -0.9692436,
    1.8759675,
    0.0415551,
    0.0556301,
    -0.203977,
    1.0569715,
  );
function $h() {
  let i = {
      enabled: !0,
      workingColorSpace: ss,
      spaces: {},
      convert: function (s, r, a) {
        return (
          this.enabled === !1 ||
            r === a ||
            !r ||
            !a ||
            (this.spaces[r].transfer === Qe &&
              ((s.r = Tn(s.r)), (s.g = Tn(s.g)), (s.b = Tn(s.b))),
            this.spaces[r].primaries !== this.spaces[a].primaries &&
              (s.applyMatrix3(this.spaces[r].toXYZ),
              s.applyMatrix3(this.spaces[a].fromXYZ)),
            this.spaces[a].transfer === Qe &&
              ((s.r = Ii(s.r)), (s.g = Ii(s.g)), (s.b = Ii(s.b)))),
          s
        );
      },
      workingToColorSpace: function (s, r) {
        return this.convert(s, this.workingColorSpace, r);
      },
      colorSpaceToWorking: function (s, r) {
        return this.convert(s, r, this.workingColorSpace);
      },
      getPrimaries: function (s) {
        return this.spaces[s].primaries;
      },
      getTransfer: function (s) {
        return s === In ? rs : this.spaces[s].transfer;
      },
      getToneMappingMode: function (s) {
        return (
          this.spaces[s].outputColorSpaceConfig.toneMappingMode || "standard"
        );
      },
      getLuminanceCoefficients: function (s, r = this.workingColorSpace) {
        return s.fromArray(this.spaces[r].luminanceCoefficients);
      },
      define: function (s) {
        Object.assign(this.spaces, s);
      },
      _getMatrix: function (s, r, a) {
        return s.copy(this.spaces[r].toXYZ).multiply(this.spaces[a].fromXYZ);
      },
      _getDrawingBufferColorSpace: function (s) {
        return this.spaces[s].outputColorSpaceConfig.drawingBufferColorSpace;
      },
      _getUnpackColorSpace: function (s = this.workingColorSpace) {
        return this.spaces[s].workingColorSpaceConfig.unpackColorSpace;
      },
      fromWorkingColorSpace: function (s, r) {
        return (
          yr(
            "ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace().",
          ),
          i.workingToColorSpace(s, r)
        );
      },
      toWorkingColorSpace: function (s, r) {
        return (
          yr(
            "ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking().",
          ),
          i.colorSpaceToWorking(s, r)
        );
      },
    },
    e = [0.64, 0.33, 0.3, 0.6, 0.15, 0.06],
    t = [0.2126, 0.7152, 0.0722],
    n = [0.3127, 0.329];
  return (
    i.define({
      [ss]: {
        primaries: e,
        whitePoint: n,
        transfer: rs,
        toXYZ: Pl,
        fromXYZ: Ll,
        luminanceCoefficients: t,
        workingColorSpaceConfig: { unpackColorSpace: Et },
        outputColorSpaceConfig: { drawingBufferColorSpace: Et },
      },
      [Et]: {
        primaries: e,
        whitePoint: n,
        transfer: Qe,
        toXYZ: Pl,
        fromXYZ: Ll,
        luminanceCoefficients: t,
        outputColorSpaceConfig: { drawingBufferColorSpace: Et },
      },
    }),
    i
  );
}
var Xe = $h();
function Tn(i) {
  return i < 0.04045
    ? i * 0.0773993808
    : Math.pow(i * 0.9478672986 + 0.0521327014, 2.4);
}
function Ii(i) {
  return i < 0.0031308 ? i * 12.92 : 1.055 * Math.pow(i, 0.41666) - 0.055;
}
var _i,
  Mr = class {
    static getDataURL(e, t = "image/png") {
      if (/^data:/i.test(e.src) || typeof HTMLCanvasElement > "u") return e.src;
      let n;
      if (e instanceof HTMLCanvasElement) n = e;
      else {
        (_i === void 0 && (_i = as("canvas")),
          (_i.width = e.width),
          (_i.height = e.height));
        let s = _i.getContext("2d");
        (e instanceof ImageData
          ? s.putImageData(e, 0, 0)
          : s.drawImage(e, 0, 0, e.width, e.height),
          (n = _i));
      }
      return n.toDataURL(t);
    }
    static sRGBToLinear(e) {
      if (
        (typeof HTMLImageElement < "u" && e instanceof HTMLImageElement) ||
        (typeof HTMLCanvasElement < "u" && e instanceof HTMLCanvasElement) ||
        (typeof ImageBitmap < "u" && e instanceof ImageBitmap)
      ) {
        let t = as("canvas");
        ((t.width = e.width), (t.height = e.height));
        let n = t.getContext("2d");
        n.drawImage(e, 0, 0, e.width, e.height);
        let s = n.getImageData(0, 0, e.width, e.height),
          r = s.data;
        for (let a = 0; a < r.length; a++) r[a] = Tn(r[a] / 255) * 255;
        return (n.putImageData(s, 0, 0), t);
      } else if (e.data) {
        let t = e.data.slice(0);
        for (let n = 0; n < t.length; n++)
          t instanceof Uint8Array || t instanceof Uint8ClampedArray
            ? (t[n] = Math.floor(Tn(t[n] / 255) * 255))
            : (t[n] = Tn(t[n]));
        return { data: t, width: e.width, height: e.height };
      } else
        return (
          Ce(
            "ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied.",
          ),
          e
        );
    }
  },
  Kh = 0,
  Ui = class {
    constructor(e = null) {
      ((this.isSource = !0),
        Object.defineProperty(this, "id", { value: Kh++ }),
        (this.uuid = qi()),
        (this.data = e),
        (this.dataReady = !0),
        (this.version = 0));
    }
    getSize(e) {
      let t = this.data;
      return (
        typeof HTMLVideoElement < "u" && t instanceof HTMLVideoElement
          ? e.set(t.videoWidth, t.videoHeight, 0)
          : typeof VideoFrame < "u" && t instanceof VideoFrame
            ? e.set(t.displayWidth, t.displayHeight, 0)
            : t !== null
              ? e.set(t.width, t.height, t.depth || 0)
              : e.set(0, 0, 0),
        e
      );
    }
    set needsUpdate(e) {
      e === !0 && this.version++;
    }
    toJSON(e) {
      let t = e === void 0 || typeof e == "string";
      if (!t && e.images[this.uuid] !== void 0) return e.images[this.uuid];
      let n = { uuid: this.uuid, url: "" },
        s = this.data;
      if (s !== null) {
        let r;
        if (Array.isArray(s)) {
          r = [];
          for (let a = 0, o = s.length; a < o; a++)
            s[a].isDataTexture ? r.push(qa(s[a].image)) : r.push(qa(s[a]));
        } else r = qa(s);
        n.url = r;
      }
      return (t || (e.images[this.uuid] = n), n);
    }
  };
function qa(i) {
  return (typeof HTMLImageElement < "u" && i instanceof HTMLImageElement) ||
    (typeof HTMLCanvasElement < "u" && i instanceof HTMLCanvasElement) ||
    (typeof ImageBitmap < "u" && i instanceof ImageBitmap)
    ? Mr.getDataURL(i)
    : i.data
      ? {
          data: Array.from(i.data),
          width: i.width,
          height: i.height,
          type: i.data.constructor.name,
        }
      : (Ce("Texture: Unable to serialize Texture."), {});
}
var jh = 0,
  Ya = new U(),
  Ut = class i extends hn {
    constructor(
      e = i.DEFAULT_IMAGE,
      t = i.DEFAULT_MAPPING,
      n = ln,
      s = ln,
      r = Tt,
      a = Zn,
      o = Yt,
      c = Ft,
      l = i.DEFAULT_ANISOTROPY,
      u = In,
    ) {
      (super(),
        (this.isTexture = !0),
        Object.defineProperty(this, "id", { value: jh++ }),
        (this.uuid = qi()),
        (this.name = ""),
        (this.source = new Ui(e)),
        (this.mipmaps = []),
        (this.mapping = t),
        (this.channel = 0),
        (this.wrapS = n),
        (this.wrapT = s),
        (this.magFilter = r),
        (this.minFilter = a),
        (this.anisotropy = l),
        (this.format = o),
        (this.internalFormat = null),
        (this.type = c),
        (this.offset = new Ye(0, 0)),
        (this.repeat = new Ye(1, 1)),
        (this.center = new Ye(0, 0)),
        (this.rotation = 0),
        (this.matrixAutoUpdate = !0),
        (this.matrix = new Ne()),
        (this.generateMipmaps = !0),
        (this.premultiplyAlpha = !1),
        (this.flipY = !0),
        (this.unpackAlignment = 4),
        (this.colorSpace = u),
        (this.userData = {}),
        (this.updateRanges = []),
        (this.version = 0),
        (this.onUpdate = null),
        (this.renderTarget = null),
        (this.isRenderTargetTexture = !1),
        (this.isArrayTexture = !!(e && e.depth && e.depth > 1)),
        (this.pmremVersion = 0),
        (this.normalized = !1));
    }
    get width() {
      return this.source.getSize(Ya).x;
    }
    get height() {
      return this.source.getSize(Ya).y;
    }
    get depth() {
      return this.source.getSize(Ya).z;
    }
    get image() {
      return this.source.data;
    }
    set image(e) {
      this.source.data = e;
    }
    updateMatrix() {
      this.matrix.setUvTransform(
        this.offset.x,
        this.offset.y,
        this.repeat.x,
        this.repeat.y,
        this.rotation,
        this.center.x,
        this.center.y,
      );
    }
    addUpdateRange(e, t) {
      this.updateRanges.push({ start: e, count: t });
    }
    clearUpdateRanges() {
      this.updateRanges.length = 0;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      return (
        (this.name = e.name),
        (this.source = e.source),
        (this.mipmaps = e.mipmaps.slice(0)),
        (this.mapping = e.mapping),
        (this.channel = e.channel),
        (this.wrapS = e.wrapS),
        (this.wrapT = e.wrapT),
        (this.magFilter = e.magFilter),
        (this.minFilter = e.minFilter),
        (this.anisotropy = e.anisotropy),
        (this.format = e.format),
        (this.internalFormat = e.internalFormat),
        (this.type = e.type),
        (this.normalized = e.normalized),
        this.offset.copy(e.offset),
        this.repeat.copy(e.repeat),
        this.center.copy(e.center),
        (this.rotation = e.rotation),
        (this.matrixAutoUpdate = e.matrixAutoUpdate),
        this.matrix.copy(e.matrix),
        (this.generateMipmaps = e.generateMipmaps),
        (this.premultiplyAlpha = e.premultiplyAlpha),
        (this.flipY = e.flipY),
        (this.unpackAlignment = e.unpackAlignment),
        (this.colorSpace = e.colorSpace),
        (this.renderTarget = e.renderTarget),
        (this.isRenderTargetTexture = e.isRenderTargetTexture),
        (this.isArrayTexture = e.isArrayTexture),
        (this.userData = JSON.parse(JSON.stringify(e.userData))),
        (this.needsUpdate = !0),
        this
      );
    }
    setValues(e) {
      for (let t in e) {
        let n = e[t];
        if (n === void 0) {
          Ce(`Texture.setValues(): parameter '${t}' has value of undefined.`);
          continue;
        }
        let s = this[t];
        if (s === void 0) {
          Ce(`Texture.setValues(): property '${t}' does not exist.`);
          continue;
        }
        (s && n && s.isVector2 && n.isVector2) ||
        (s && n && s.isVector3 && n.isVector3) ||
        (s && n && s.isMatrix3 && n.isMatrix3)
          ? s.copy(n)
          : (this[t] = n);
      }
    }
    toJSON(e) {
      let t = e === void 0 || typeof e == "string";
      if (!t && e.textures[this.uuid] !== void 0) return e.textures[this.uuid];
      let n = {
        metadata: {
          version: 4.7,
          type: "Texture",
          generator: "Texture.toJSON",
        },
        uuid: this.uuid,
        name: this.name,
        image: this.source.toJSON(e).uuid,
        mapping: this.mapping,
        channel: this.channel,
        repeat: [this.repeat.x, this.repeat.y],
        offset: [this.offset.x, this.offset.y],
        center: [this.center.x, this.center.y],
        rotation: this.rotation,
        wrap: [this.wrapS, this.wrapT],
        format: this.format,
        internalFormat: this.internalFormat,
        type: this.type,
        normalized: this.normalized,
        colorSpace: this.colorSpace,
        minFilter: this.minFilter,
        magFilter: this.magFilter,
        anisotropy: this.anisotropy,
        flipY: this.flipY,
        generateMipmaps: this.generateMipmaps,
        premultiplyAlpha: this.premultiplyAlpha,
        unpackAlignment: this.unpackAlignment,
      };
      return (
        Object.keys(this.userData).length > 0 && (n.userData = this.userData),
        t || (e.textures[this.uuid] = n),
        n
      );
    }
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
    transformUv(e) {
      if (this.mapping !== zo) return e;
      if ((e.applyMatrix3(this.matrix), e.x < 0 || e.x > 1))
        switch (this.wrapS) {
          case _r:
            e.x = e.x - Math.floor(e.x);
            break;
          case ln:
            e.x = e.x < 0 ? 0 : 1;
            break;
          case xr:
            Math.abs(Math.floor(e.x) % 2) === 1
              ? (e.x = Math.ceil(e.x) - e.x)
              : (e.x = e.x - Math.floor(e.x));
            break;
        }
      if (e.y < 0 || e.y > 1)
        switch (this.wrapT) {
          case _r:
            e.y = e.y - Math.floor(e.y);
            break;
          case ln:
            e.y = e.y < 0 ? 0 : 1;
            break;
          case xr:
            Math.abs(Math.floor(e.y) % 2) === 1
              ? (e.y = Math.ceil(e.y) - e.y)
              : (e.y = e.y - Math.floor(e.y));
            break;
        }
      return (this.flipY && (e.y = 1 - e.y), e);
    }
    set needsUpdate(e) {
      e === !0 && (this.version++, (this.source.needsUpdate = !0));
    }
    set needsPMREMUpdate(e) {
      e === !0 && this.pmremVersion++;
    }
  };
Ut.DEFAULT_IMAGE = null;
Ut.DEFAULT_MAPPING = zo;
Ut.DEFAULT_ANISOTROPY = 1;
var ut = class i {
    static {
      i.prototype.isVector4 = !0;
    }
    constructor(e = 0, t = 0, n = 0, s = 1) {
      ((this.x = e), (this.y = t), (this.z = n), (this.w = s));
    }
    get width() {
      return this.z;
    }
    set width(e) {
      this.z = e;
    }
    get height() {
      return this.w;
    }
    set height(e) {
      this.w = e;
    }
    set(e, t, n, s) {
      return ((this.x = e), (this.y = t), (this.z = n), (this.w = s), this);
    }
    setScalar(e) {
      return ((this.x = e), (this.y = e), (this.z = e), (this.w = e), this);
    }
    setX(e) {
      return ((this.x = e), this);
    }
    setY(e) {
      return ((this.y = e), this);
    }
    setZ(e) {
      return ((this.z = e), this);
    }
    setW(e) {
      return ((this.w = e), this);
    }
    setComponent(e, t) {
      switch (e) {
        case 0:
          this.x = t;
          break;
        case 1:
          this.y = t;
          break;
        case 2:
          this.z = t;
          break;
        case 3:
          this.w = t;
          break;
        default:
          throw new Error("index is out of range: " + e);
      }
      return this;
    }
    getComponent(e) {
      switch (e) {
        case 0:
          return this.x;
        case 1:
          return this.y;
        case 2:
          return this.z;
        case 3:
          return this.w;
        default:
          throw new Error("index is out of range: " + e);
      }
    }
    clone() {
      return new this.constructor(this.x, this.y, this.z, this.w);
    }
    copy(e) {
      return (
        (this.x = e.x),
        (this.y = e.y),
        (this.z = e.z),
        (this.w = e.w !== void 0 ? e.w : 1),
        this
      );
    }
    add(e) {
      return (
        (this.x += e.x),
        (this.y += e.y),
        (this.z += e.z),
        (this.w += e.w),
        this
      );
    }
    addScalar(e) {
      return ((this.x += e), (this.y += e), (this.z += e), (this.w += e), this);
    }
    addVectors(e, t) {
      return (
        (this.x = e.x + t.x),
        (this.y = e.y + t.y),
        (this.z = e.z + t.z),
        (this.w = e.w + t.w),
        this
      );
    }
    addScaledVector(e, t) {
      return (
        (this.x += e.x * t),
        (this.y += e.y * t),
        (this.z += e.z * t),
        (this.w += e.w * t),
        this
      );
    }
    sub(e) {
      return (
        (this.x -= e.x),
        (this.y -= e.y),
        (this.z -= e.z),
        (this.w -= e.w),
        this
      );
    }
    subScalar(e) {
      return ((this.x -= e), (this.y -= e), (this.z -= e), (this.w -= e), this);
    }
    subVectors(e, t) {
      return (
        (this.x = e.x - t.x),
        (this.y = e.y - t.y),
        (this.z = e.z - t.z),
        (this.w = e.w - t.w),
        this
      );
    }
    multiply(e) {
      return (
        (this.x *= e.x),
        (this.y *= e.y),
        (this.z *= e.z),
        (this.w *= e.w),
        this
      );
    }
    multiplyScalar(e) {
      return ((this.x *= e), (this.y *= e), (this.z *= e), (this.w *= e), this);
    }
    applyMatrix4(e) {
      let t = this.x,
        n = this.y,
        s = this.z,
        r = this.w,
        a = e.elements;
      return (
        (this.x = a[0] * t + a[4] * n + a[8] * s + a[12] * r),
        (this.y = a[1] * t + a[5] * n + a[9] * s + a[13] * r),
        (this.z = a[2] * t + a[6] * n + a[10] * s + a[14] * r),
        (this.w = a[3] * t + a[7] * n + a[11] * s + a[15] * r),
        this
      );
    }
    divide(e) {
      return (
        (this.x /= e.x),
        (this.y /= e.y),
        (this.z /= e.z),
        (this.w /= e.w),
        this
      );
    }
    divideScalar(e) {
      return this.multiplyScalar(1 / e);
    }
    setAxisAngleFromQuaternion(e) {
      this.w = 2 * Math.acos(e.w);
      let t = Math.sqrt(1 - e.w * e.w);
      return (
        t < 1e-4
          ? ((this.x = 1), (this.y = 0), (this.z = 0))
          : ((this.x = e.x / t), (this.y = e.y / t), (this.z = e.z / t)),
        this
      );
    }
    setAxisAngleFromRotationMatrix(e) {
      let t,
        n,
        s,
        r,
        c = e.elements,
        l = c[0],
        u = c[4],
        d = c[8],
        h = c[1],
        p = c[5],
        g = c[9],
        y = c[2],
        m = c[6],
        f = c[10];
      if (
        Math.abs(u - h) < 0.01 &&
        Math.abs(d - y) < 0.01 &&
        Math.abs(g - m) < 0.01
      ) {
        if (
          Math.abs(u + h) < 0.1 &&
          Math.abs(d + y) < 0.1 &&
          Math.abs(g + m) < 0.1 &&
          Math.abs(l + p + f - 3) < 0.1
        )
          return (this.set(1, 0, 0, 0), this);
        t = Math.PI;
        let T = (l + 1) / 2,
          E = (p + 1) / 2,
          w = (f + 1) / 2,
          b = (u + h) / 4,
          R = (d + y) / 4,
          x = (g + m) / 4;
        return (
          T > E && T > w
            ? T < 0.01
              ? ((n = 0), (s = 0.707106781), (r = 0.707106781))
              : ((n = Math.sqrt(T)), (s = b / n), (r = R / n))
            : E > w
              ? E < 0.01
                ? ((n = 0.707106781), (s = 0), (r = 0.707106781))
                : ((s = Math.sqrt(E)), (n = b / s), (r = x / s))
              : w < 0.01
                ? ((n = 0.707106781), (s = 0.707106781), (r = 0))
                : ((r = Math.sqrt(w)), (n = R / r), (s = x / r)),
          this.set(n, s, r, t),
          this
        );
      }
      let M = Math.sqrt(
        (m - g) * (m - g) + (d - y) * (d - y) + (h - u) * (h - u),
      );
      return (
        Math.abs(M) < 0.001 && (M = 1),
        (this.x = (m - g) / M),
        (this.y = (d - y) / M),
        (this.z = (h - u) / M),
        (this.w = Math.acos((l + p + f - 1) / 2)),
        this
      );
    }
    setFromMatrixPosition(e) {
      let t = e.elements;
      return (
        (this.x = t[12]),
        (this.y = t[13]),
        (this.z = t[14]),
        (this.w = t[15]),
        this
      );
    }
    min(e) {
      return (
        (this.x = Math.min(this.x, e.x)),
        (this.y = Math.min(this.y, e.y)),
        (this.z = Math.min(this.z, e.z)),
        (this.w = Math.min(this.w, e.w)),
        this
      );
    }
    max(e) {
      return (
        (this.x = Math.max(this.x, e.x)),
        (this.y = Math.max(this.y, e.y)),
        (this.z = Math.max(this.z, e.z)),
        (this.w = Math.max(this.w, e.w)),
        this
      );
    }
    clamp(e, t) {
      return (
        (this.x = qe(this.x, e.x, t.x)),
        (this.y = qe(this.y, e.y, t.y)),
        (this.z = qe(this.z, e.z, t.z)),
        (this.w = qe(this.w, e.w, t.w)),
        this
      );
    }
    clampScalar(e, t) {
      return (
        (this.x = qe(this.x, e, t)),
        (this.y = qe(this.y, e, t)),
        (this.z = qe(this.z, e, t)),
        (this.w = qe(this.w, e, t)),
        this
      );
    }
    clampLength(e, t) {
      let n = this.length();
      return this.divideScalar(n || 1).multiplyScalar(qe(n, e, t));
    }
    floor() {
      return (
        (this.x = Math.floor(this.x)),
        (this.y = Math.floor(this.y)),
        (this.z = Math.floor(this.z)),
        (this.w = Math.floor(this.w)),
        this
      );
    }
    ceil() {
      return (
        (this.x = Math.ceil(this.x)),
        (this.y = Math.ceil(this.y)),
        (this.z = Math.ceil(this.z)),
        (this.w = Math.ceil(this.w)),
        this
      );
    }
    round() {
      return (
        (this.x = Math.round(this.x)),
        (this.y = Math.round(this.y)),
        (this.z = Math.round(this.z)),
        (this.w = Math.round(this.w)),
        this
      );
    }
    roundToZero() {
      return (
        (this.x = Math.trunc(this.x)),
        (this.y = Math.trunc(this.y)),
        (this.z = Math.trunc(this.z)),
        (this.w = Math.trunc(this.w)),
        this
      );
    }
    negate() {
      return (
        (this.x = -this.x),
        (this.y = -this.y),
        (this.z = -this.z),
        (this.w = -this.w),
        this
      );
    }
    dot(e) {
      return this.x * e.x + this.y * e.y + this.z * e.z + this.w * e.w;
    }
    lengthSq() {
      return (
        this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w
      );
    }
    length() {
      return Math.sqrt(
        this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w,
      );
    }
    manhattanLength() {
      return (
        Math.abs(this.x) +
        Math.abs(this.y) +
        Math.abs(this.z) +
        Math.abs(this.w)
      );
    }
    normalize() {
      return this.divideScalar(this.length() || 1);
    }
    setLength(e) {
      return this.normalize().multiplyScalar(e);
    }
    lerp(e, t) {
      return (
        (this.x += (e.x - this.x) * t),
        (this.y += (e.y - this.y) * t),
        (this.z += (e.z - this.z) * t),
        (this.w += (e.w - this.w) * t),
        this
      );
    }
    lerpVectors(e, t, n) {
      return (
        (this.x = e.x + (t.x - e.x) * n),
        (this.y = e.y + (t.y - e.y) * n),
        (this.z = e.z + (t.z - e.z) * n),
        (this.w = e.w + (t.w - e.w) * n),
        this
      );
    }
    equals(e) {
      return (
        e.x === this.x && e.y === this.y && e.z === this.z && e.w === this.w
      );
    }
    fromArray(e, t = 0) {
      return (
        (this.x = e[t]),
        (this.y = e[t + 1]),
        (this.z = e[t + 2]),
        (this.w = e[t + 3]),
        this
      );
    }
    toArray(e = [], t = 0) {
      return (
        (e[t] = this.x),
        (e[t + 1] = this.y),
        (e[t + 2] = this.z),
        (e[t + 3] = this.w),
        e
      );
    }
    fromBufferAttribute(e, t) {
      return (
        (this.x = e.getX(t)),
        (this.y = e.getY(t)),
        (this.z = e.getZ(t)),
        (this.w = e.getW(t)),
        this
      );
    }
    random() {
      return (
        (this.x = Math.random()),
        (this.y = Math.random()),
        (this.z = Math.random()),
        (this.w = Math.random()),
        this
      );
    }
    *[Symbol.iterator]() {
      (yield this.x, yield this.y, yield this.z, yield this.w);
    }
  },
  Sr = class extends hn {
    constructor(e = 1, t = 1, n = {}) {
      (super(),
        (n = Object.assign(
          {
            generateMipmaps: !1,
            internalFormat: null,
            minFilter: Tt,
            depthBuffer: !0,
            stencilBuffer: !1,
            resolveDepthBuffer: !0,
            resolveStencilBuffer: !0,
            depthTexture: null,
            samples: 0,
            count: 1,
            depth: 1,
            multiview: !1,
          },
          n,
        )),
        (this.isRenderTarget = !0),
        (this.width = e),
        (this.height = t),
        (this.depth = n.depth),
        (this.scissor = new ut(0, 0, e, t)),
        (this.scissorTest = !1),
        (this.viewport = new ut(0, 0, e, t)),
        (this.textures = []));
      let s = { width: e, height: t, depth: n.depth },
        r = new Ut(s),
        a = n.count;
      for (let o = 0; o < a; o++)
        ((this.textures[o] = r.clone()),
          (this.textures[o].isRenderTargetTexture = !0),
          (this.textures[o].renderTarget = this));
      (this._setTextureOptions(n),
        (this.depthBuffer = n.depthBuffer),
        (this.stencilBuffer = n.stencilBuffer),
        (this.resolveDepthBuffer = n.resolveDepthBuffer),
        (this.resolveStencilBuffer = n.resolveStencilBuffer),
        (this._depthTexture = null),
        (this.depthTexture = n.depthTexture),
        (this.samples = n.samples),
        (this.multiview = n.multiview));
    }
    _setTextureOptions(e = {}) {
      let t = {
        minFilter: Tt,
        generateMipmaps: !1,
        flipY: !1,
        internalFormat: null,
      };
      (e.mapping !== void 0 && (t.mapping = e.mapping),
        e.wrapS !== void 0 && (t.wrapS = e.wrapS),
        e.wrapT !== void 0 && (t.wrapT = e.wrapT),
        e.wrapR !== void 0 && (t.wrapR = e.wrapR),
        e.magFilter !== void 0 && (t.magFilter = e.magFilter),
        e.minFilter !== void 0 && (t.minFilter = e.minFilter),
        e.format !== void 0 && (t.format = e.format),
        e.type !== void 0 && (t.type = e.type),
        e.anisotropy !== void 0 && (t.anisotropy = e.anisotropy),
        e.colorSpace !== void 0 && (t.colorSpace = e.colorSpace),
        e.flipY !== void 0 && (t.flipY = e.flipY),
        e.generateMipmaps !== void 0 && (t.generateMipmaps = e.generateMipmaps),
        e.internalFormat !== void 0 && (t.internalFormat = e.internalFormat));
      for (let n = 0; n < this.textures.length; n++)
        this.textures[n].setValues(t);
    }
    get texture() {
      return this.textures[0];
    }
    set texture(e) {
      this.textures[0] = e;
    }
    set depthTexture(e) {
      (this._depthTexture !== null && (this._depthTexture.renderTarget = null),
        e !== null && (e.renderTarget = this),
        (this._depthTexture = e));
    }
    get depthTexture() {
      return this._depthTexture;
    }
    setSize(e, t, n = 1) {
      if (this.width !== e || this.height !== t || this.depth !== n) {
        ((this.width = e), (this.height = t), (this.depth = n));
        for (let s = 0, r = this.textures.length; s < r; s++)
          ((this.textures[s].image.width = e),
            (this.textures[s].image.height = t),
            (this.textures[s].image.depth = n),
            this.textures[s].isData3DTexture !== !0 &&
              (this.textures[s].isArrayTexture =
                this.textures[s].image.depth > 1));
        this.dispose();
      }
      (this.viewport.set(0, 0, e, t), this.scissor.set(0, 0, e, t));
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      ((this.width = e.width),
        (this.height = e.height),
        (this.depth = e.depth),
        this.scissor.copy(e.scissor),
        (this.scissorTest = e.scissorTest),
        this.viewport.copy(e.viewport),
        (this.textures.length = 0));
      for (let t = 0, n = e.textures.length; t < n; t++) {
        ((this.textures[t] = e.textures[t].clone()),
          (this.textures[t].isRenderTargetTexture = !0),
          (this.textures[t].renderTarget = this));
        let s = Object.assign({}, e.textures[t].image);
        this.textures[t].source = new Ui(s);
      }
      return (
        (this.depthBuffer = e.depthBuffer),
        (this.stencilBuffer = e.stencilBuffer),
        (this.resolveDepthBuffer = e.resolveDepthBuffer),
        (this.resolveStencilBuffer = e.resolveStencilBuffer),
        e.depthTexture !== null && (this.depthTexture = e.depthTexture.clone()),
        (this.samples = e.samples),
        (this.multiview = e.multiview),
        this
      );
    }
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
  },
  kt = class extends Sr {
    constructor(e = 1, t = 1, n = {}) {
      (super(e, t, n), (this.isWebGLRenderTarget = !0));
    }
  },
  os = class extends Ut {
    constructor(e = null, t = 1, n = 1, s = 1) {
      (super(null),
        (this.isDataArrayTexture = !0),
        (this.image = { data: e, width: t, height: n, depth: s }),
        (this.magFilter = Mt),
        (this.minFilter = Mt),
        (this.wrapR = ln),
        (this.generateMipmaps = !1),
        (this.flipY = !1),
        (this.unpackAlignment = 1),
        (this.layerUpdates = new Set()));
    }
    addLayerUpdate(e) {
      this.layerUpdates.add(e);
    }
    clearLayerUpdates() {
      this.layerUpdates.clear();
    }
  };
var br = class extends Ut {
  constructor(e = null, t = 1, n = 1, s = 1) {
    (super(null),
      (this.isData3DTexture = !0),
      (this.image = { data: e, width: t, height: n, depth: s }),
      (this.magFilter = Mt),
      (this.minFilter = Mt),
      (this.wrapR = ln),
      (this.generateMipmaps = !1),
      (this.flipY = !1),
      (this.unpackAlignment = 1));
  }
};
var ht = class i {
    static {
      i.prototype.isMatrix4 = !0;
    }
    constructor(e, t, n, s, r, a, o, c, l, u, d, h, p, g, y, m) {
      ((this.elements = [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
        e !== void 0 &&
          this.set(e, t, n, s, r, a, o, c, l, u, d, h, p, g, y, m));
    }
    set(e, t, n, s, r, a, o, c, l, u, d, h, p, g, y, m) {
      let f = this.elements;
      return (
        (f[0] = e),
        (f[4] = t),
        (f[8] = n),
        (f[12] = s),
        (f[1] = r),
        (f[5] = a),
        (f[9] = o),
        (f[13] = c),
        (f[2] = l),
        (f[6] = u),
        (f[10] = d),
        (f[14] = h),
        (f[3] = p),
        (f[7] = g),
        (f[11] = y),
        (f[15] = m),
        this
      );
    }
    identity() {
      return (this.set(1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this);
    }
    clone() {
      return new i().fromArray(this.elements);
    }
    copy(e) {
      let t = this.elements,
        n = e.elements;
      return (
        (t[0] = n[0]),
        (t[1] = n[1]),
        (t[2] = n[2]),
        (t[3] = n[3]),
        (t[4] = n[4]),
        (t[5] = n[5]),
        (t[6] = n[6]),
        (t[7] = n[7]),
        (t[8] = n[8]),
        (t[9] = n[9]),
        (t[10] = n[10]),
        (t[11] = n[11]),
        (t[12] = n[12]),
        (t[13] = n[13]),
        (t[14] = n[14]),
        (t[15] = n[15]),
        this
      );
    }
    copyPosition(e) {
      let t = this.elements,
        n = e.elements;
      return ((t[12] = n[12]), (t[13] = n[13]), (t[14] = n[14]), this);
    }
    setFromMatrix3(e) {
      let t = e.elements;
      return (
        this.set(
          t[0],
          t[3],
          t[6],
          0,
          t[1],
          t[4],
          t[7],
          0,
          t[2],
          t[5],
          t[8],
          0,
          0,
          0,
          0,
          1,
        ),
        this
      );
    }
    extractBasis(e, t, n) {
      return this.determinant() === 0
        ? (e.set(1, 0, 0), t.set(0, 1, 0), n.set(0, 0, 1), this)
        : (e.setFromMatrixColumn(this, 0),
          t.setFromMatrixColumn(this, 1),
          n.setFromMatrixColumn(this, 2),
          this);
    }
    makeBasis(e, t, n) {
      return (
        this.set(
          e.x,
          t.x,
          n.x,
          0,
          e.y,
          t.y,
          n.y,
          0,
          e.z,
          t.z,
          n.z,
          0,
          0,
          0,
          0,
          1,
        ),
        this
      );
    }
    extractRotation(e) {
      if (e.determinant() === 0) return this.identity();
      let t = this.elements,
        n = e.elements,
        s = 1 / xi.setFromMatrixColumn(e, 0).length(),
        r = 1 / xi.setFromMatrixColumn(e, 1).length(),
        a = 1 / xi.setFromMatrixColumn(e, 2).length();
      return (
        (t[0] = n[0] * s),
        (t[1] = n[1] * s),
        (t[2] = n[2] * s),
        (t[3] = 0),
        (t[4] = n[4] * r),
        (t[5] = n[5] * r),
        (t[6] = n[6] * r),
        (t[7] = 0),
        (t[8] = n[8] * a),
        (t[9] = n[9] * a),
        (t[10] = n[10] * a),
        (t[11] = 0),
        (t[12] = 0),
        (t[13] = 0),
        (t[14] = 0),
        (t[15] = 1),
        this
      );
    }
    makeRotationFromEuler(e) {
      let t = this.elements,
        n = e.x,
        s = e.y,
        r = e.z,
        a = Math.cos(n),
        o = Math.sin(n),
        c = Math.cos(s),
        l = Math.sin(s),
        u = Math.cos(r),
        d = Math.sin(r);
      if (e.order === "XYZ") {
        let h = a * u,
          p = a * d,
          g = o * u,
          y = o * d;
        ((t[0] = c * u),
          (t[4] = -c * d),
          (t[8] = l),
          (t[1] = p + g * l),
          (t[5] = h - y * l),
          (t[9] = -o * c),
          (t[2] = y - h * l),
          (t[6] = g + p * l),
          (t[10] = a * c));
      } else if (e.order === "YXZ") {
        let h = c * u,
          p = c * d,
          g = l * u,
          y = l * d;
        ((t[0] = h + y * o),
          (t[4] = g * o - p),
          (t[8] = a * l),
          (t[1] = a * d),
          (t[5] = a * u),
          (t[9] = -o),
          (t[2] = p * o - g),
          (t[6] = y + h * o),
          (t[10] = a * c));
      } else if (e.order === "ZXY") {
        let h = c * u,
          p = c * d,
          g = l * u,
          y = l * d;
        ((t[0] = h - y * o),
          (t[4] = -a * d),
          (t[8] = g + p * o),
          (t[1] = p + g * o),
          (t[5] = a * u),
          (t[9] = y - h * o),
          (t[2] = -a * l),
          (t[6] = o),
          (t[10] = a * c));
      } else if (e.order === "ZYX") {
        let h = a * u,
          p = a * d,
          g = o * u,
          y = o * d;
        ((t[0] = c * u),
          (t[4] = g * l - p),
          (t[8] = h * l + y),
          (t[1] = c * d),
          (t[5] = y * l + h),
          (t[9] = p * l - g),
          (t[2] = -l),
          (t[6] = o * c),
          (t[10] = a * c));
      } else if (e.order === "YZX") {
        let h = a * c,
          p = a * l,
          g = o * c,
          y = o * l;
        ((t[0] = c * u),
          (t[4] = y - h * d),
          (t[8] = g * d + p),
          (t[1] = d),
          (t[5] = a * u),
          (t[9] = -o * u),
          (t[2] = -l * u),
          (t[6] = p * d + g),
          (t[10] = h - y * d));
      } else if (e.order === "XZY") {
        let h = a * c,
          p = a * l,
          g = o * c,
          y = o * l;
        ((t[0] = c * u),
          (t[4] = -d),
          (t[8] = l * u),
          (t[1] = h * d + y),
          (t[5] = a * u),
          (t[9] = p * d - g),
          (t[2] = g * d - p),
          (t[6] = o * u),
          (t[10] = y * d + h));
      }
      return (
        (t[3] = 0),
        (t[7] = 0),
        (t[11] = 0),
        (t[12] = 0),
        (t[13] = 0),
        (t[14] = 0),
        (t[15] = 1),
        this
      );
    }
    makeRotationFromQuaternion(e) {
      return this.compose(Qh, e, eu);
    }
    lookAt(e, t, n) {
      let s = this.elements;
      return (
        Bt.subVectors(e, t),
        Bt.lengthSq() === 0 && (Bt.z = 1),
        Bt.normalize(),
        Un.crossVectors(n, Bt),
        Un.lengthSq() === 0 &&
          (Math.abs(n.z) === 1 ? (Bt.x += 1e-4) : (Bt.z += 1e-4),
          Bt.normalize(),
          Un.crossVectors(n, Bt)),
        Un.normalize(),
        Os.crossVectors(Bt, Un),
        (s[0] = Un.x),
        (s[4] = Os.x),
        (s[8] = Bt.x),
        (s[1] = Un.y),
        (s[5] = Os.y),
        (s[9] = Bt.y),
        (s[2] = Un.z),
        (s[6] = Os.z),
        (s[10] = Bt.z),
        this
      );
    }
    multiply(e) {
      return this.multiplyMatrices(this, e);
    }
    premultiply(e) {
      return this.multiplyMatrices(e, this);
    }
    multiplyMatrices(e, t) {
      let n = e.elements,
        s = t.elements,
        r = this.elements,
        a = n[0],
        o = n[4],
        c = n[8],
        l = n[12],
        u = n[1],
        d = n[5],
        h = n[9],
        p = n[13],
        g = n[2],
        y = n[6],
        m = n[10],
        f = n[14],
        M = n[3],
        T = n[7],
        E = n[11],
        w = n[15],
        b = s[0],
        R = s[4],
        x = s[8],
        A = s[12],
        N = s[1],
        C = s[5],
        O = s[9],
        X = s[13],
        W = s[2],
        D = s[6],
        V = s[10],
        k = s[14],
        j = s[3],
        ee = s[7],
        ce = s[11],
        ye = s[15];
      return (
        (r[0] = a * b + o * N + c * W + l * j),
        (r[4] = a * R + o * C + c * D + l * ee),
        (r[8] = a * x + o * O + c * V + l * ce),
        (r[12] = a * A + o * X + c * k + l * ye),
        (r[1] = u * b + d * N + h * W + p * j),
        (r[5] = u * R + d * C + h * D + p * ee),
        (r[9] = u * x + d * O + h * V + p * ce),
        (r[13] = u * A + d * X + h * k + p * ye),
        (r[2] = g * b + y * N + m * W + f * j),
        (r[6] = g * R + y * C + m * D + f * ee),
        (r[10] = g * x + y * O + m * V + f * ce),
        (r[14] = g * A + y * X + m * k + f * ye),
        (r[3] = M * b + T * N + E * W + w * j),
        (r[7] = M * R + T * C + E * D + w * ee),
        (r[11] = M * x + T * O + E * V + w * ce),
        (r[15] = M * A + T * X + E * k + w * ye),
        this
      );
    }
    multiplyScalar(e) {
      let t = this.elements;
      return (
        (t[0] *= e),
        (t[4] *= e),
        (t[8] *= e),
        (t[12] *= e),
        (t[1] *= e),
        (t[5] *= e),
        (t[9] *= e),
        (t[13] *= e),
        (t[2] *= e),
        (t[6] *= e),
        (t[10] *= e),
        (t[14] *= e),
        (t[3] *= e),
        (t[7] *= e),
        (t[11] *= e),
        (t[15] *= e),
        this
      );
    }
    determinant() {
      let e = this.elements,
        t = e[0],
        n = e[4],
        s = e[8],
        r = e[12],
        a = e[1],
        o = e[5],
        c = e[9],
        l = e[13],
        u = e[2],
        d = e[6],
        h = e[10],
        p = e[14],
        g = e[3],
        y = e[7],
        m = e[11],
        f = e[15],
        M = c * p - l * h,
        T = o * p - l * d,
        E = o * h - c * d,
        w = a * p - l * u,
        b = a * h - c * u,
        R = a * d - o * u;
      return (
        t * (y * M - m * T + f * E) -
        n * (g * M - m * w + f * b) +
        s * (g * T - y * w + f * R) -
        r * (g * E - y * b + m * R)
      );
    }
    transpose() {
      let e = this.elements,
        t;
      return (
        (t = e[1]),
        (e[1] = e[4]),
        (e[4] = t),
        (t = e[2]),
        (e[2] = e[8]),
        (e[8] = t),
        (t = e[6]),
        (e[6] = e[9]),
        (e[9] = t),
        (t = e[3]),
        (e[3] = e[12]),
        (e[12] = t),
        (t = e[7]),
        (e[7] = e[13]),
        (e[13] = t),
        (t = e[11]),
        (e[11] = e[14]),
        (e[14] = t),
        this
      );
    }
    setPosition(e, t, n) {
      let s = this.elements;
      return (
        e.isVector3
          ? ((s[12] = e.x), (s[13] = e.y), (s[14] = e.z))
          : ((s[12] = e), (s[13] = t), (s[14] = n)),
        this
      );
    }
    invert() {
      let e = this.elements,
        t = e[0],
        n = e[1],
        s = e[2],
        r = e[3],
        a = e[4],
        o = e[5],
        c = e[6],
        l = e[7],
        u = e[8],
        d = e[9],
        h = e[10],
        p = e[11],
        g = e[12],
        y = e[13],
        m = e[14],
        f = e[15],
        M = t * o - n * a,
        T = t * c - s * a,
        E = t * l - r * a,
        w = n * c - s * o,
        b = n * l - r * o,
        R = s * l - r * c,
        x = u * y - d * g,
        A = u * m - h * g,
        N = u * f - p * g,
        C = d * m - h * y,
        O = d * f - p * y,
        X = h * f - p * m,
        W = M * X - T * O + E * C + w * N - b * A + R * x;
      if (W === 0)
        return this.set(0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0);
      let D = 1 / W;
      return (
        (e[0] = (o * X - c * O + l * C) * D),
        (e[1] = (s * O - n * X - r * C) * D),
        (e[2] = (y * R - m * b + f * w) * D),
        (e[3] = (h * b - d * R - p * w) * D),
        (e[4] = (c * N - a * X - l * A) * D),
        (e[5] = (t * X - s * N + r * A) * D),
        (e[6] = (m * E - g * R - f * T) * D),
        (e[7] = (u * R - h * E + p * T) * D),
        (e[8] = (a * O - o * N + l * x) * D),
        (e[9] = (n * N - t * O - r * x) * D),
        (e[10] = (g * b - y * E + f * M) * D),
        (e[11] = (d * E - u * b - p * M) * D),
        (e[12] = (o * A - a * C - c * x) * D),
        (e[13] = (t * C - n * A + s * x) * D),
        (e[14] = (y * T - g * w - m * M) * D),
        (e[15] = (u * w - d * T + h * M) * D),
        this
      );
    }
    scale(e) {
      let t = this.elements,
        n = e.x,
        s = e.y,
        r = e.z;
      return (
        (t[0] *= n),
        (t[4] *= s),
        (t[8] *= r),
        (t[1] *= n),
        (t[5] *= s),
        (t[9] *= r),
        (t[2] *= n),
        (t[6] *= s),
        (t[10] *= r),
        (t[3] *= n),
        (t[7] *= s),
        (t[11] *= r),
        this
      );
    }
    getMaxScaleOnAxis() {
      let e = this.elements,
        t = e[0] * e[0] + e[1] * e[1] + e[2] * e[2],
        n = e[4] * e[4] + e[5] * e[5] + e[6] * e[6],
        s = e[8] * e[8] + e[9] * e[9] + e[10] * e[10];
      return Math.sqrt(Math.max(t, n, s));
    }
    makeTranslation(e, t, n) {
      return (
        e.isVector3
          ? this.set(1, 0, 0, e.x, 0, 1, 0, e.y, 0, 0, 1, e.z, 0, 0, 0, 1)
          : this.set(1, 0, 0, e, 0, 1, 0, t, 0, 0, 1, n, 0, 0, 0, 1),
        this
      );
    }
    makeRotationX(e) {
      let t = Math.cos(e),
        n = Math.sin(e);
      return (this.set(1, 0, 0, 0, 0, t, -n, 0, 0, n, t, 0, 0, 0, 0, 1), this);
    }
    makeRotationY(e) {
      let t = Math.cos(e),
        n = Math.sin(e);
      return (this.set(t, 0, n, 0, 0, 1, 0, 0, -n, 0, t, 0, 0, 0, 0, 1), this);
    }
    makeRotationZ(e) {
      let t = Math.cos(e),
        n = Math.sin(e);
      return (this.set(t, -n, 0, 0, n, t, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1), this);
    }
    makeRotationAxis(e, t) {
      let n = Math.cos(t),
        s = Math.sin(t),
        r = 1 - n,
        a = e.x,
        o = e.y,
        c = e.z,
        l = r * a,
        u = r * o;
      return (
        this.set(
          l * a + n,
          l * o - s * c,
          l * c + s * o,
          0,
          l * o + s * c,
          u * o + n,
          u * c - s * a,
          0,
          l * c - s * o,
          u * c + s * a,
          r * c * c + n,
          0,
          0,
          0,
          0,
          1,
        ),
        this
      );
    }
    makeScale(e, t, n) {
      return (this.set(e, 0, 0, 0, 0, t, 0, 0, 0, 0, n, 0, 0, 0, 0, 1), this);
    }
    makeShear(e, t, n, s, r, a) {
      return (this.set(1, n, r, 0, e, 1, a, 0, t, s, 1, 0, 0, 0, 0, 1), this);
    }
    compose(e, t, n) {
      let s = this.elements,
        r = t._x,
        a = t._y,
        o = t._z,
        c = t._w,
        l = r + r,
        u = a + a,
        d = o + o,
        h = r * l,
        p = r * u,
        g = r * d,
        y = a * u,
        m = a * d,
        f = o * d,
        M = c * l,
        T = c * u,
        E = c * d,
        w = n.x,
        b = n.y,
        R = n.z;
      return (
        (s[0] = (1 - (y + f)) * w),
        (s[1] = (p + E) * w),
        (s[2] = (g - T) * w),
        (s[3] = 0),
        (s[4] = (p - E) * b),
        (s[5] = (1 - (h + f)) * b),
        (s[6] = (m + M) * b),
        (s[7] = 0),
        (s[8] = (g + T) * R),
        (s[9] = (m - M) * R),
        (s[10] = (1 - (h + y)) * R),
        (s[11] = 0),
        (s[12] = e.x),
        (s[13] = e.y),
        (s[14] = e.z),
        (s[15] = 1),
        this
      );
    }
    decompose(e, t, n) {
      let s = this.elements;
      ((e.x = s[12]), (e.y = s[13]), (e.z = s[14]));
      let r = this.determinant();
      if (r === 0) return (n.set(1, 1, 1), t.identity(), this);
      let a = xi.set(s[0], s[1], s[2]).length(),
        o = xi.set(s[4], s[5], s[6]).length(),
        c = xi.set(s[8], s[9], s[10]).length();
      (r < 0 && (a = -a), Jt.copy(this));
      let l = 1 / a,
        u = 1 / o,
        d = 1 / c;
      return (
        (Jt.elements[0] *= l),
        (Jt.elements[1] *= l),
        (Jt.elements[2] *= l),
        (Jt.elements[4] *= u),
        (Jt.elements[5] *= u),
        (Jt.elements[6] *= u),
        (Jt.elements[8] *= d),
        (Jt.elements[9] *= d),
        (Jt.elements[10] *= d),
        t.setFromRotationMatrix(Jt),
        (n.x = a),
        (n.y = o),
        (n.z = c),
        this
      );
    }
    makePerspective(e, t, n, s, r, a, o = jt, c = !1) {
      let l = this.elements,
        u = (2 * r) / (t - e),
        d = (2 * r) / (n - s),
        h = (t + e) / (t - e),
        p = (n + s) / (n - s),
        g,
        y;
      if (c) ((g = r / (a - r)), (y = (a * r) / (a - r)));
      else if (o === jt)
        ((g = -(a + r) / (a - r)), (y = (-2 * a * r) / (a - r)));
      else if (o === Pi) ((g = -a / (a - r)), (y = (-a * r) / (a - r)));
      else
        throw new Error(
          "THREE.Matrix4.makePerspective(): Invalid coordinate system: " + o,
        );
      return (
        (l[0] = u),
        (l[4] = 0),
        (l[8] = h),
        (l[12] = 0),
        (l[1] = 0),
        (l[5] = d),
        (l[9] = p),
        (l[13] = 0),
        (l[2] = 0),
        (l[6] = 0),
        (l[10] = g),
        (l[14] = y),
        (l[3] = 0),
        (l[7] = 0),
        (l[11] = -1),
        (l[15] = 0),
        this
      );
    }
    makeOrthographic(e, t, n, s, r, a, o = jt, c = !1) {
      let l = this.elements,
        u = 2 / (t - e),
        d = 2 / (n - s),
        h = -(t + e) / (t - e),
        p = -(n + s) / (n - s),
        g,
        y;
      if (c) ((g = 1 / (a - r)), (y = a / (a - r)));
      else if (o === jt) ((g = -2 / (a - r)), (y = -(a + r) / (a - r)));
      else if (o === Pi) ((g = -1 / (a - r)), (y = -r / (a - r)));
      else
        throw new Error(
          "THREE.Matrix4.makeOrthographic(): Invalid coordinate system: " + o,
        );
      return (
        (l[0] = u),
        (l[4] = 0),
        (l[8] = 0),
        (l[12] = h),
        (l[1] = 0),
        (l[5] = d),
        (l[9] = 0),
        (l[13] = p),
        (l[2] = 0),
        (l[6] = 0),
        (l[10] = g),
        (l[14] = y),
        (l[3] = 0),
        (l[7] = 0),
        (l[11] = 0),
        (l[15] = 1),
        this
      );
    }
    equals(e) {
      let t = this.elements,
        n = e.elements;
      for (let s = 0; s < 16; s++) if (t[s] !== n[s]) return !1;
      return !0;
    }
    fromArray(e, t = 0) {
      for (let n = 0; n < 16; n++) this.elements[n] = e[n + t];
      return this;
    }
    toArray(e = [], t = 0) {
      let n = this.elements;
      return (
        (e[t] = n[0]),
        (e[t + 1] = n[1]),
        (e[t + 2] = n[2]),
        (e[t + 3] = n[3]),
        (e[t + 4] = n[4]),
        (e[t + 5] = n[5]),
        (e[t + 6] = n[6]),
        (e[t + 7] = n[7]),
        (e[t + 8] = n[8]),
        (e[t + 9] = n[9]),
        (e[t + 10] = n[10]),
        (e[t + 11] = n[11]),
        (e[t + 12] = n[12]),
        (e[t + 13] = n[13]),
        (e[t + 14] = n[14]),
        (e[t + 15] = n[15]),
        e
      );
    }
  },
  xi = new U(),
  Jt = new ht(),
  Qh = new U(0, 0, 0),
  eu = new U(1, 1, 1),
  Un = new U(),
  Os = new U(),
  Bt = new U(),
  Dl = new ht(),
  Ul = new un(),
  dn = class i {
    constructor(e = 0, t = 0, n = 0, s = i.DEFAULT_ORDER) {
      ((this.isEuler = !0),
        (this._x = e),
        (this._y = t),
        (this._z = n),
        (this._order = s));
    }
    get x() {
      return this._x;
    }
    set x(e) {
      ((this._x = e), this._onChangeCallback());
    }
    get y() {
      return this._y;
    }
    set y(e) {
      ((this._y = e), this._onChangeCallback());
    }
    get z() {
      return this._z;
    }
    set z(e) {
      ((this._z = e), this._onChangeCallback());
    }
    get order() {
      return this._order;
    }
    set order(e) {
      ((this._order = e), this._onChangeCallback());
    }
    set(e, t, n, s = this._order) {
      return (
        (this._x = e),
        (this._y = t),
        (this._z = n),
        (this._order = s),
        this._onChangeCallback(),
        this
      );
    }
    clone() {
      return new this.constructor(this._x, this._y, this._z, this._order);
    }
    copy(e) {
      return (
        (this._x = e._x),
        (this._y = e._y),
        (this._z = e._z),
        (this._order = e._order),
        this._onChangeCallback(),
        this
      );
    }
    setFromRotationMatrix(e, t = this._order, n = !0) {
      let s = e.elements,
        r = s[0],
        a = s[4],
        o = s[8],
        c = s[1],
        l = s[5],
        u = s[9],
        d = s[2],
        h = s[6],
        p = s[10];
      switch (t) {
        case "XYZ":
          ((this._y = Math.asin(qe(o, -1, 1))),
            Math.abs(o) < 0.9999999
              ? ((this._x = Math.atan2(-u, p)), (this._z = Math.atan2(-a, r)))
              : ((this._x = Math.atan2(h, l)), (this._z = 0)));
          break;
        case "YXZ":
          ((this._x = Math.asin(-qe(u, -1, 1))),
            Math.abs(u) < 0.9999999
              ? ((this._y = Math.atan2(o, p)), (this._z = Math.atan2(c, l)))
              : ((this._y = Math.atan2(-d, r)), (this._z = 0)));
          break;
        case "ZXY":
          ((this._x = Math.asin(qe(h, -1, 1))),
            Math.abs(h) < 0.9999999
              ? ((this._y = Math.atan2(-d, p)), (this._z = Math.atan2(-a, l)))
              : ((this._y = 0), (this._z = Math.atan2(c, r))));
          break;
        case "ZYX":
          ((this._y = Math.asin(-qe(d, -1, 1))),
            Math.abs(d) < 0.9999999
              ? ((this._x = Math.atan2(h, p)), (this._z = Math.atan2(c, r)))
              : ((this._x = 0), (this._z = Math.atan2(-a, l))));
          break;
        case "YZX":
          ((this._z = Math.asin(qe(c, -1, 1))),
            Math.abs(c) < 0.9999999
              ? ((this._x = Math.atan2(-u, l)), (this._y = Math.atan2(-d, r)))
              : ((this._x = 0), (this._y = Math.atan2(o, p))));
          break;
        case "XZY":
          ((this._z = Math.asin(-qe(a, -1, 1))),
            Math.abs(a) < 0.9999999
              ? ((this._x = Math.atan2(h, l)), (this._y = Math.atan2(o, r)))
              : ((this._x = Math.atan2(-u, p)), (this._y = 0)));
          break;
        default:
          Ce(
            "Euler: .setFromRotationMatrix() encountered an unknown order: " +
              t,
          );
      }
      return ((this._order = t), n === !0 && this._onChangeCallback(), this);
    }
    setFromQuaternion(e, t, n) {
      return (
        Dl.makeRotationFromQuaternion(e),
        this.setFromRotationMatrix(Dl, t, n)
      );
    }
    setFromVector3(e, t = this._order) {
      return this.set(e.x, e.y, e.z, t);
    }
    reorder(e) {
      return (Ul.setFromEuler(this), this.setFromQuaternion(Ul, e));
    }
    equals(e) {
      return (
        e._x === this._x &&
        e._y === this._y &&
        e._z === this._z &&
        e._order === this._order
      );
    }
    fromArray(e) {
      return (
        (this._x = e[0]),
        (this._y = e[1]),
        (this._z = e[2]),
        e[3] !== void 0 && (this._order = e[3]),
        this._onChangeCallback(),
        this
      );
    }
    toArray(e = [], t = 0) {
      return (
        (e[t] = this._x),
        (e[t + 1] = this._y),
        (e[t + 2] = this._z),
        (e[t + 3] = this._order),
        e
      );
    }
    _onChange(e) {
      return ((this._onChangeCallback = e), this);
    }
    _onChangeCallback() {}
    *[Symbol.iterator]() {
      (yield this._x, yield this._y, yield this._z, yield this._order);
    }
  };
dn.DEFAULT_ORDER = "XYZ";
var Ni = class {
    constructor() {
      this.mask = 1;
    }
    set(e) {
      this.mask = ((1 << e) | 0) >>> 0;
    }
    enable(e) {
      this.mask |= (1 << e) | 0;
    }
    enableAll() {
      this.mask = -1;
    }
    toggle(e) {
      this.mask ^= (1 << e) | 0;
    }
    disable(e) {
      this.mask &= ~((1 << e) | 0);
    }
    disableAll() {
      this.mask = 0;
    }
    test(e) {
      return (this.mask & e.mask) !== 0;
    }
    isEnabled(e) {
      return (this.mask & ((1 << e) | 0)) !== 0;
    }
  },
  tu = 0,
  Nl = new U(),
  vi = new un(),
  vn = new ht(),
  Bs = new U(),
  $i = new U(),
  nu = new U(),
  iu = new un(),
  Fl = new U(1, 0, 0),
  Ol = new U(0, 1, 0),
  Bl = new U(0, 0, 1),
  zl = { type: "added" },
  su = { type: "removed" },
  yi = { type: "childadded", child: null },
  Za = { type: "childremoved", child: null },
  St = class i extends hn {
    constructor() {
      (super(),
        (this.isObject3D = !0),
        Object.defineProperty(this, "id", { value: tu++ }),
        (this.uuid = qi()),
        (this.name = ""),
        (this.type = "Object3D"),
        (this.parent = null),
        (this.children = []),
        (this.up = i.DEFAULT_UP.clone()));
      let e = new U(),
        t = new dn(),
        n = new un(),
        s = new U(1, 1, 1);
      function r() {
        n.setFromEuler(t, !1);
      }
      function a() {
        t.setFromQuaternion(n, void 0, !1);
      }
      (t._onChange(r),
        n._onChange(a),
        Object.defineProperties(this, {
          position: { configurable: !0, enumerable: !0, value: e },
          rotation: { configurable: !0, enumerable: !0, value: t },
          quaternion: { configurable: !0, enumerable: !0, value: n },
          scale: { configurable: !0, enumerable: !0, value: s },
          modelViewMatrix: { value: new ht() },
          normalMatrix: { value: new Ne() },
        }),
        (this.matrix = new ht()),
        (this.matrixWorld = new ht()),
        (this.matrixAutoUpdate = i.DEFAULT_MATRIX_AUTO_UPDATE),
        (this.matrixWorldAutoUpdate = i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE),
        (this.matrixWorldNeedsUpdate = !1),
        (this.layers = new Ni()),
        (this.visible = !0),
        (this.castShadow = !1),
        (this.receiveShadow = !1),
        (this.frustumCulled = !0),
        (this.renderOrder = 0),
        (this.animations = []),
        (this.customDepthMaterial = void 0),
        (this.customDistanceMaterial = void 0),
        (this.static = !1),
        (this.userData = {}),
        (this.pivot = null));
    }
    onBeforeShadow() {}
    onAfterShadow() {}
    onBeforeRender() {}
    onAfterRender() {}
    applyMatrix4(e) {
      (this.matrixAutoUpdate && this.updateMatrix(),
        this.matrix.premultiply(e),
        this.matrix.decompose(this.position, this.quaternion, this.scale));
    }
    applyQuaternion(e) {
      return (this.quaternion.premultiply(e), this);
    }
    setRotationFromAxisAngle(e, t) {
      this.quaternion.setFromAxisAngle(e, t);
    }
    setRotationFromEuler(e) {
      this.quaternion.setFromEuler(e, !0);
    }
    setRotationFromMatrix(e) {
      this.quaternion.setFromRotationMatrix(e);
    }
    setRotationFromQuaternion(e) {
      this.quaternion.copy(e);
    }
    rotateOnAxis(e, t) {
      return (vi.setFromAxisAngle(e, t), this.quaternion.multiply(vi), this);
    }
    rotateOnWorldAxis(e, t) {
      return (vi.setFromAxisAngle(e, t), this.quaternion.premultiply(vi), this);
    }
    rotateX(e) {
      return this.rotateOnAxis(Fl, e);
    }
    rotateY(e) {
      return this.rotateOnAxis(Ol, e);
    }
    rotateZ(e) {
      return this.rotateOnAxis(Bl, e);
    }
    translateOnAxis(e, t) {
      return (
        Nl.copy(e).applyQuaternion(this.quaternion),
        this.position.add(Nl.multiplyScalar(t)),
        this
      );
    }
    translateX(e) {
      return this.translateOnAxis(Fl, e);
    }
    translateY(e) {
      return this.translateOnAxis(Ol, e);
    }
    translateZ(e) {
      return this.translateOnAxis(Bl, e);
    }
    localToWorld(e) {
      return (this.updateWorldMatrix(!0, !1), e.applyMatrix4(this.matrixWorld));
    }
    worldToLocal(e) {
      return (
        this.updateWorldMatrix(!0, !1),
        e.applyMatrix4(vn.copy(this.matrixWorld).invert())
      );
    }
    lookAt(e, t, n) {
      e.isVector3 ? Bs.copy(e) : Bs.set(e, t, n);
      let s = this.parent;
      (this.updateWorldMatrix(!0, !1),
        $i.setFromMatrixPosition(this.matrixWorld),
        this.isCamera || this.isLight
          ? vn.lookAt($i, Bs, this.up)
          : vn.lookAt(Bs, $i, this.up),
        this.quaternion.setFromRotationMatrix(vn),
        s &&
          (vn.extractRotation(s.matrixWorld),
          vi.setFromRotationMatrix(vn),
          this.quaternion.premultiply(vi.invert())));
    }
    add(e) {
      if (arguments.length > 1) {
        for (let t = 0; t < arguments.length; t++) this.add(arguments[t]);
        return this;
      }
      return e === this
        ? (Ie("Object3D.add: object can't be added as a child of itself.", e),
          this)
        : (e && e.isObject3D
            ? (e.removeFromParent(),
              (e.parent = this),
              this.children.push(e),
              e.dispatchEvent(zl),
              (yi.child = e),
              this.dispatchEvent(yi),
              (yi.child = null))
            : Ie("Object3D.add: object not an instance of THREE.Object3D.", e),
          this);
    }
    remove(e) {
      if (arguments.length > 1) {
        for (let n = 0; n < arguments.length; n++) this.remove(arguments[n]);
        return this;
      }
      let t = this.children.indexOf(e);
      return (
        t !== -1 &&
          ((e.parent = null),
          this.children.splice(t, 1),
          e.dispatchEvent(su),
          (Za.child = e),
          this.dispatchEvent(Za),
          (Za.child = null)),
        this
      );
    }
    removeFromParent() {
      let e = this.parent;
      return (e !== null && e.remove(this), this);
    }
    clear() {
      return this.remove(...this.children);
    }
    attach(e) {
      return (
        this.updateWorldMatrix(!0, !1),
        vn.copy(this.matrixWorld).invert(),
        e.parent !== null &&
          (e.parent.updateWorldMatrix(!0, !1),
          vn.multiply(e.parent.matrixWorld)),
        e.applyMatrix4(vn),
        e.removeFromParent(),
        (e.parent = this),
        this.children.push(e),
        e.updateWorldMatrix(!1, !0),
        e.dispatchEvent(zl),
        (yi.child = e),
        this.dispatchEvent(yi),
        (yi.child = null),
        this
      );
    }
    getObjectById(e) {
      return this.getObjectByProperty("id", e);
    }
    getObjectByName(e) {
      return this.getObjectByProperty("name", e);
    }
    getObjectByProperty(e, t) {
      if (this[e] === t) return this;
      for (let n = 0, s = this.children.length; n < s; n++) {
        let a = this.children[n].getObjectByProperty(e, t);
        if (a !== void 0) return a;
      }
    }
    getObjectsByProperty(e, t, n = []) {
      this[e] === t && n.push(this);
      let s = this.children;
      for (let r = 0, a = s.length; r < a; r++)
        s[r].getObjectsByProperty(e, t, n);
      return n;
    }
    getWorldPosition(e) {
      return (
        this.updateWorldMatrix(!0, !1),
        e.setFromMatrixPosition(this.matrixWorld)
      );
    }
    getWorldQuaternion(e) {
      return (
        this.updateWorldMatrix(!0, !1),
        this.matrixWorld.decompose($i, e, nu),
        e
      );
    }
    getWorldScale(e) {
      return (
        this.updateWorldMatrix(!0, !1),
        this.matrixWorld.decompose($i, iu, e),
        e
      );
    }
    getWorldDirection(e) {
      this.updateWorldMatrix(!0, !1);
      let t = this.matrixWorld.elements;
      return e.set(t[8], t[9], t[10]).normalize();
    }
    raycast() {}
    traverse(e) {
      e(this);
      let t = this.children;
      for (let n = 0, s = t.length; n < s; n++) t[n].traverse(e);
    }
    traverseVisible(e) {
      if (this.visible === !1) return;
      e(this);
      let t = this.children;
      for (let n = 0, s = t.length; n < s; n++) t[n].traverseVisible(e);
    }
    traverseAncestors(e) {
      let t = this.parent;
      t !== null && (e(t), t.traverseAncestors(e));
    }
    updateMatrix() {
      this.matrix.compose(this.position, this.quaternion, this.scale);
      let e = this.pivot;
      if (e !== null) {
        let t = e.x,
          n = e.y,
          s = e.z,
          r = this.matrix.elements;
        ((r[12] += t - r[0] * t - r[4] * n - r[8] * s),
          (r[13] += n - r[1] * t - r[5] * n - r[9] * s),
          (r[14] += s - r[2] * t - r[6] * n - r[10] * s));
      }
      this.matrixWorldNeedsUpdate = !0;
    }
    updateMatrixWorld(e) {
      (this.matrixAutoUpdate && this.updateMatrix(),
        (this.matrixWorldNeedsUpdate || e) &&
          (this.matrixWorldAutoUpdate === !0 &&
            (this.parent === null
              ? this.matrixWorld.copy(this.matrix)
              : this.matrixWorld.multiplyMatrices(
                  this.parent.matrixWorld,
                  this.matrix,
                )),
          (this.matrixWorldNeedsUpdate = !1),
          (e = !0)));
      let t = this.children;
      for (let n = 0, s = t.length; n < s; n++) t[n].updateMatrixWorld(e);
    }
    updateWorldMatrix(e, t) {
      let n = this.parent;
      if (
        (e === !0 && n !== null && n.updateWorldMatrix(!0, !1),
        this.matrixAutoUpdate && this.updateMatrix(),
        this.matrixWorldAutoUpdate === !0 &&
          (this.parent === null
            ? this.matrixWorld.copy(this.matrix)
            : this.matrixWorld.multiplyMatrices(
                this.parent.matrixWorld,
                this.matrix,
              )),
        t === !0)
      ) {
        let s = this.children;
        for (let r = 0, a = s.length; r < a; r++)
          s[r].updateWorldMatrix(!1, !0);
      }
    }
    toJSON(e) {
      let t = e === void 0 || typeof e == "string",
        n = {};
      t &&
        ((e = {
          geometries: {},
          materials: {},
          textures: {},
          images: {},
          shapes: {},
          skeletons: {},
          animations: {},
          nodes: {},
        }),
        (n.metadata = {
          version: 4.7,
          type: "Object",
          generator: "Object3D.toJSON",
        }));
      let s = {};
      ((s.uuid = this.uuid),
        (s.type = this.type),
        this.name !== "" && (s.name = this.name),
        this.castShadow === !0 && (s.castShadow = !0),
        this.receiveShadow === !0 && (s.receiveShadow = !0),
        this.visible === !1 && (s.visible = !1),
        this.frustumCulled === !1 && (s.frustumCulled = !1),
        this.renderOrder !== 0 && (s.renderOrder = this.renderOrder),
        this.static !== !1 && (s.static = this.static),
        Object.keys(this.userData).length > 0 && (s.userData = this.userData),
        (s.layers = this.layers.mask),
        (s.matrix = this.matrix.toArray()),
        (s.up = this.up.toArray()),
        this.pivot !== null && (s.pivot = this.pivot.toArray()),
        this.matrixAutoUpdate === !1 && (s.matrixAutoUpdate = !1),
        this.morphTargetDictionary !== void 0 &&
          (s.morphTargetDictionary = Object.assign(
            {},
            this.morphTargetDictionary,
          )),
        this.morphTargetInfluences !== void 0 &&
          (s.morphTargetInfluences = this.morphTargetInfluences.slice()),
        this.isInstancedMesh &&
          ((s.type = "InstancedMesh"),
          (s.count = this.count),
          (s.instanceMatrix = this.instanceMatrix.toJSON()),
          this.instanceColor !== null &&
            (s.instanceColor = this.instanceColor.toJSON())),
        this.isBatchedMesh &&
          ((s.type = "BatchedMesh"),
          (s.perObjectFrustumCulled = this.perObjectFrustumCulled),
          (s.sortObjects = this.sortObjects),
          (s.drawRanges = this._drawRanges),
          (s.reservedRanges = this._reservedRanges),
          (s.geometryInfo = this._geometryInfo.map((o) => ({
            ...o,
            boundingBox: o.boundingBox ? o.boundingBox.toJSON() : void 0,
            boundingSphere: o.boundingSphere
              ? o.boundingSphere.toJSON()
              : void 0,
          }))),
          (s.instanceInfo = this._instanceInfo.map((o) => ({ ...o }))),
          (s.availableInstanceIds = this._availableInstanceIds.slice()),
          (s.availableGeometryIds = this._availableGeometryIds.slice()),
          (s.nextIndexStart = this._nextIndexStart),
          (s.nextVertexStart = this._nextVertexStart),
          (s.geometryCount = this._geometryCount),
          (s.maxInstanceCount = this._maxInstanceCount),
          (s.maxVertexCount = this._maxVertexCount),
          (s.maxIndexCount = this._maxIndexCount),
          (s.geometryInitialized = this._geometryInitialized),
          (s.matricesTexture = this._matricesTexture.toJSON(e)),
          (s.indirectTexture = this._indirectTexture.toJSON(e)),
          this._colorsTexture !== null &&
            (s.colorsTexture = this._colorsTexture.toJSON(e)),
          this.boundingSphere !== null &&
            (s.boundingSphere = this.boundingSphere.toJSON()),
          this.boundingBox !== null &&
            (s.boundingBox = this.boundingBox.toJSON())));
      function r(o, c) {
        return (o[c.uuid] === void 0 && (o[c.uuid] = c.toJSON(e)), c.uuid);
      }
      if (this.isScene)
        (this.background &&
          (this.background.isColor
            ? (s.background = this.background.toJSON())
            : this.background.isTexture &&
              (s.background = this.background.toJSON(e).uuid)),
          this.environment &&
            this.environment.isTexture &&
            this.environment.isRenderTargetTexture !== !0 &&
            (s.environment = this.environment.toJSON(e).uuid));
      else if (this.isMesh || this.isLine || this.isPoints) {
        s.geometry = r(e.geometries, this.geometry);
        let o = this.geometry.parameters;
        if (o !== void 0 && o.shapes !== void 0) {
          let c = o.shapes;
          if (Array.isArray(c))
            for (let l = 0, u = c.length; l < u; l++) {
              let d = c[l];
              r(e.shapes, d);
            }
          else r(e.shapes, c);
        }
      }
      if (
        (this.isSkinnedMesh &&
          ((s.bindMode = this.bindMode),
          (s.bindMatrix = this.bindMatrix.toArray()),
          this.skeleton !== void 0 &&
            (r(e.skeletons, this.skeleton), (s.skeleton = this.skeleton.uuid))),
        this.material !== void 0)
      )
        if (Array.isArray(this.material)) {
          let o = [];
          for (let c = 0, l = this.material.length; c < l; c++)
            o.push(r(e.materials, this.material[c]));
          s.material = o;
        } else s.material = r(e.materials, this.material);
      if (this.children.length > 0) {
        s.children = [];
        for (let o = 0; o < this.children.length; o++)
          s.children.push(this.children[o].toJSON(e).object);
      }
      if (this.animations.length > 0) {
        s.animations = [];
        for (let o = 0; o < this.animations.length; o++) {
          let c = this.animations[o];
          s.animations.push(r(e.animations, c));
        }
      }
      if (t) {
        let o = a(e.geometries),
          c = a(e.materials),
          l = a(e.textures),
          u = a(e.images),
          d = a(e.shapes),
          h = a(e.skeletons),
          p = a(e.animations),
          g = a(e.nodes);
        (o.length > 0 && (n.geometries = o),
          c.length > 0 && (n.materials = c),
          l.length > 0 && (n.textures = l),
          u.length > 0 && (n.images = u),
          d.length > 0 && (n.shapes = d),
          h.length > 0 && (n.skeletons = h),
          p.length > 0 && (n.animations = p),
          g.length > 0 && (n.nodes = g));
      }
      return ((n.object = s), n);
      function a(o) {
        let c = [];
        for (let l in o) {
          let u = o[l];
          (delete u.metadata, c.push(u));
        }
        return c;
      }
    }
    clone(e) {
      return new this.constructor().copy(this, e);
    }
    copy(e, t = !0) {
      if (
        ((this.name = e.name),
        this.up.copy(e.up),
        this.position.copy(e.position),
        (this.rotation.order = e.rotation.order),
        this.quaternion.copy(e.quaternion),
        this.scale.copy(e.scale),
        (this.pivot = e.pivot !== null ? e.pivot.clone() : null),
        this.matrix.copy(e.matrix),
        this.matrixWorld.copy(e.matrixWorld),
        (this.matrixAutoUpdate = e.matrixAutoUpdate),
        (this.matrixWorldAutoUpdate = e.matrixWorldAutoUpdate),
        (this.matrixWorldNeedsUpdate = e.matrixWorldNeedsUpdate),
        (this.layers.mask = e.layers.mask),
        (this.visible = e.visible),
        (this.castShadow = e.castShadow),
        (this.receiveShadow = e.receiveShadow),
        (this.frustumCulled = e.frustumCulled),
        (this.renderOrder = e.renderOrder),
        (this.static = e.static),
        (this.animations = e.animations.slice()),
        (this.userData = JSON.parse(JSON.stringify(e.userData))),
        t === !0)
      )
        for (let n = 0; n < e.children.length; n++) {
          let s = e.children[n];
          this.add(s.clone());
        }
      return this;
    }
  };
St.DEFAULT_UP = new U(0, 1, 0);
St.DEFAULT_MATRIX_AUTO_UPDATE = !0;
St.DEFAULT_MATRIX_WORLD_AUTO_UPDATE = !0;
var qt = class extends St {
    constructor() {
      (super(), (this.isGroup = !0), (this.type = "Group"));
    }
  },
  ru = { type: "move" },
  Fi = class {
    constructor() {
      ((this._targetRay = null), (this._grip = null), (this._hand = null));
    }
    getHandSpace() {
      return (
        this._hand === null &&
          ((this._hand = new qt()),
          (this._hand.matrixAutoUpdate = !1),
          (this._hand.visible = !1),
          (this._hand.joints = {}),
          (this._hand.inputState = { pinching: !1 })),
        this._hand
      );
    }
    getTargetRaySpace() {
      return (
        this._targetRay === null &&
          ((this._targetRay = new qt()),
          (this._targetRay.matrixAutoUpdate = !1),
          (this._targetRay.visible = !1),
          (this._targetRay.hasLinearVelocity = !1),
          (this._targetRay.linearVelocity = new U()),
          (this._targetRay.hasAngularVelocity = !1),
          (this._targetRay.angularVelocity = new U())),
        this._targetRay
      );
    }
    getGripSpace() {
      return (
        this._grip === null &&
          ((this._grip = new qt()),
          (this._grip.matrixAutoUpdate = !1),
          (this._grip.visible = !1),
          (this._grip.hasLinearVelocity = !1),
          (this._grip.linearVelocity = new U()),
          (this._grip.hasAngularVelocity = !1),
          (this._grip.angularVelocity = new U()),
          (this._grip.eventsEnabled = !1)),
        this._grip
      );
    }
    dispatchEvent(e) {
      return (
        this._targetRay !== null && this._targetRay.dispatchEvent(e),
        this._grip !== null && this._grip.dispatchEvent(e),
        this._hand !== null && this._hand.dispatchEvent(e),
        this
      );
    }
    connect(e) {
      if (e && e.hand) {
        let t = this._hand;
        if (t) for (let n of e.hand.values()) this._getHandJoint(t, n);
      }
      return (this.dispatchEvent({ type: "connected", data: e }), this);
    }
    disconnect(e) {
      return (
        this.dispatchEvent({ type: "disconnected", data: e }),
        this._targetRay !== null && (this._targetRay.visible = !1),
        this._grip !== null && (this._grip.visible = !1),
        this._hand !== null && (this._hand.visible = !1),
        this
      );
    }
    update(e, t, n) {
      let s = null,
        r = null,
        a = null,
        o = this._targetRay,
        c = this._grip,
        l = this._hand;
      if (e && t.session.visibilityState !== "visible-blurred") {
        if (l && e.hand) {
          a = !0;
          for (let y of e.hand.values()) {
            let m = t.getJointPose(y, n),
              f = this._getHandJoint(l, y);
            (m !== null &&
              (f.matrix.fromArray(m.transform.matrix),
              f.matrix.decompose(f.position, f.rotation, f.scale),
              (f.matrixWorldNeedsUpdate = !0),
              (f.jointRadius = m.radius)),
              (f.visible = m !== null));
          }
          let u = l.joints["index-finger-tip"],
            d = l.joints["thumb-tip"],
            h = u.position.distanceTo(d.position),
            p = 0.02,
            g = 0.005;
          l.inputState.pinching && h > p + g
            ? ((l.inputState.pinching = !1),
              this.dispatchEvent({
                type: "pinchend",
                handedness: e.handedness,
                target: this,
              }))
            : !l.inputState.pinching &&
              h <= p - g &&
              ((l.inputState.pinching = !0),
              this.dispatchEvent({
                type: "pinchstart",
                handedness: e.handedness,
                target: this,
              }));
        } else
          c !== null &&
            e.gripSpace &&
            ((r = t.getPose(e.gripSpace, n)),
            r !== null &&
              (c.matrix.fromArray(r.transform.matrix),
              c.matrix.decompose(c.position, c.rotation, c.scale),
              (c.matrixWorldNeedsUpdate = !0),
              r.linearVelocity
                ? ((c.hasLinearVelocity = !0),
                  c.linearVelocity.copy(r.linearVelocity))
                : (c.hasLinearVelocity = !1),
              r.angularVelocity
                ? ((c.hasAngularVelocity = !0),
                  c.angularVelocity.copy(r.angularVelocity))
                : (c.hasAngularVelocity = !1),
              c.eventsEnabled &&
                c.dispatchEvent({
                  type: "gripUpdated",
                  data: e,
                  target: this,
                })));
        o !== null &&
          ((s = t.getPose(e.targetRaySpace, n)),
          s === null && r !== null && (s = r),
          s !== null &&
            (o.matrix.fromArray(s.transform.matrix),
            o.matrix.decompose(o.position, o.rotation, o.scale),
            (o.matrixWorldNeedsUpdate = !0),
            s.linearVelocity
              ? ((o.hasLinearVelocity = !0),
                o.linearVelocity.copy(s.linearVelocity))
              : (o.hasLinearVelocity = !1),
            s.angularVelocity
              ? ((o.hasAngularVelocity = !0),
                o.angularVelocity.copy(s.angularVelocity))
              : (o.hasAngularVelocity = !1),
            this.dispatchEvent(ru)));
      }
      return (
        o !== null && (o.visible = s !== null),
        c !== null && (c.visible = r !== null),
        l !== null && (l.visible = a !== null),
        this
      );
    }
    _getHandJoint(e, t) {
      if (e.joints[t.jointName] === void 0) {
        let n = new qt();
        ((n.matrixAutoUpdate = !1),
          (n.visible = !1),
          (e.joints[t.jointName] = n),
          e.add(n));
      }
      return e.joints[t.jointName];
    }
  },
  zc = {
    aliceblue: 15792383,
    antiquewhite: 16444375,
    aqua: 65535,
    aquamarine: 8388564,
    azure: 15794175,
    beige: 16119260,
    bisque: 16770244,
    black: 0,
    blanchedalmond: 16772045,
    blue: 255,
    blueviolet: 9055202,
    brown: 10824234,
    burlywood: 14596231,
    cadetblue: 6266528,
    chartreuse: 8388352,
    chocolate: 13789470,
    coral: 16744272,
    cornflowerblue: 6591981,
    cornsilk: 16775388,
    crimson: 14423100,
    cyan: 65535,
    darkblue: 139,
    darkcyan: 35723,
    darkgoldenrod: 12092939,
    darkgray: 11119017,
    darkgreen: 25600,
    darkgrey: 11119017,
    darkkhaki: 12433259,
    darkmagenta: 9109643,
    darkolivegreen: 5597999,
    darkorange: 16747520,
    darkorchid: 10040012,
    darkred: 9109504,
    darksalmon: 15308410,
    darkseagreen: 9419919,
    darkslateblue: 4734347,
    darkslategray: 3100495,
    darkslategrey: 3100495,
    darkturquoise: 52945,
    darkviolet: 9699539,
    deeppink: 16716947,
    deepskyblue: 49151,
    dimgray: 6908265,
    dimgrey: 6908265,
    dodgerblue: 2003199,
    firebrick: 11674146,
    floralwhite: 16775920,
    forestgreen: 2263842,
    fuchsia: 16711935,
    gainsboro: 14474460,
    ghostwhite: 16316671,
    gold: 16766720,
    goldenrod: 14329120,
    gray: 8421504,
    green: 32768,
    greenyellow: 11403055,
    grey: 8421504,
    honeydew: 15794160,
    hotpink: 16738740,
    indianred: 13458524,
    indigo: 4915330,
    ivory: 16777200,
    khaki: 15787660,
    lavender: 15132410,
    lavenderblush: 16773365,
    lawngreen: 8190976,
    lemonchiffon: 16775885,
    lightblue: 11393254,
    lightcoral: 15761536,
    lightcyan: 14745599,
    lightgoldenrodyellow: 16448210,
    lightgray: 13882323,
    lightgreen: 9498256,
    lightgrey: 13882323,
    lightpink: 16758465,
    lightsalmon: 16752762,
    lightseagreen: 2142890,
    lightskyblue: 8900346,
    lightslategray: 7833753,
    lightslategrey: 7833753,
    lightsteelblue: 11584734,
    lightyellow: 16777184,
    lime: 65280,
    limegreen: 3329330,
    linen: 16445670,
    magenta: 16711935,
    maroon: 8388608,
    mediumaquamarine: 6737322,
    mediumblue: 205,
    mediumorchid: 12211667,
    mediumpurple: 9662683,
    mediumseagreen: 3978097,
    mediumslateblue: 8087790,
    mediumspringgreen: 64154,
    mediumturquoise: 4772300,
    mediumvioletred: 13047173,
    midnightblue: 1644912,
    mintcream: 16121850,
    mistyrose: 16770273,
    moccasin: 16770229,
    navajowhite: 16768685,
    navy: 128,
    oldlace: 16643558,
    olive: 8421376,
    olivedrab: 7048739,
    orange: 16753920,
    orangered: 16729344,
    orchid: 14315734,
    palegoldenrod: 15657130,
    palegreen: 10025880,
    paleturquoise: 11529966,
    palevioletred: 14381203,
    papayawhip: 16773077,
    peachpuff: 16767673,
    peru: 13468991,
    pink: 16761035,
    plum: 14524637,
    powderblue: 11591910,
    purple: 8388736,
    rebeccapurple: 6697881,
    red: 16711680,
    rosybrown: 12357519,
    royalblue: 4286945,
    saddlebrown: 9127187,
    salmon: 16416882,
    sandybrown: 16032864,
    seagreen: 3050327,
    seashell: 16774638,
    sienna: 10506797,
    silver: 12632256,
    skyblue: 8900331,
    slateblue: 6970061,
    slategray: 7372944,
    slategrey: 7372944,
    snow: 16775930,
    springgreen: 65407,
    steelblue: 4620980,
    tan: 13808780,
    teal: 32896,
    thistle: 14204888,
    tomato: 16737095,
    turquoise: 4251856,
    violet: 15631086,
    wheat: 16113331,
    white: 16777215,
    whitesmoke: 16119285,
    yellow: 16776960,
    yellowgreen: 10145074,
  },
  Nn = { h: 0, s: 0, l: 0 },
  zs = { h: 0, s: 0, l: 0 };
function Ja(i, e, t) {
  return (
    t < 0 && (t += 1),
    t > 1 && (t -= 1),
    t < 1 / 6
      ? i + (e - i) * 6 * t
      : t < 1 / 2
        ? e
        : t < 2 / 3
          ? i + (e - i) * 6 * (2 / 3 - t)
          : i
  );
}
var Pe = class {
    constructor(e, t, n) {
      return (
        (this.isColor = !0),
        (this.r = 1),
        (this.g = 1),
        (this.b = 1),
        this.set(e, t, n)
      );
    }
    set(e, t, n) {
      if (t === void 0 && n === void 0) {
        let s = e;
        s && s.isColor
          ? this.copy(s)
          : typeof s == "number"
            ? this.setHex(s)
            : typeof s == "string" && this.setStyle(s);
      } else this.setRGB(e, t, n);
      return this;
    }
    setScalar(e) {
      return ((this.r = e), (this.g = e), (this.b = e), this);
    }
    setHex(e, t = Et) {
      return (
        (e = Math.floor(e)),
        (this.r = ((e >> 16) & 255) / 255),
        (this.g = ((e >> 8) & 255) / 255),
        (this.b = (e & 255) / 255),
        Xe.colorSpaceToWorking(this, t),
        this
      );
    }
    setRGB(e, t, n, s = Xe.workingColorSpace) {
      return (
        (this.r = e),
        (this.g = t),
        (this.b = n),
        Xe.colorSpaceToWorking(this, s),
        this
      );
    }
    setHSL(e, t, n, s = Xe.workingColorSpace) {
      if (((e = Jo(e, 1)), (t = qe(t, 0, 1)), (n = qe(n, 0, 1)), t === 0))
        this.r = this.g = this.b = n;
      else {
        let r = n <= 0.5 ? n * (1 + t) : n + t - n * t,
          a = 2 * n - r;
        ((this.r = Ja(a, r, e + 1 / 3)),
          (this.g = Ja(a, r, e)),
          (this.b = Ja(a, r, e - 1 / 3)));
      }
      return (Xe.colorSpaceToWorking(this, s), this);
    }
    setStyle(e, t = Et) {
      function n(r) {
        r !== void 0 &&
          parseFloat(r) < 1 &&
          Ce("Color: Alpha component of " + e + " will be ignored.");
      }
      let s;
      if ((s = /^(\w+)\(([^\)]*)\)/.exec(e))) {
        let r,
          a = s[1],
          o = s[2];
        switch (a) {
          case "rgb":
          case "rgba":
            if (
              (r =
                /^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                  o,
                ))
            )
              return (
                n(r[4]),
                this.setRGB(
                  Math.min(255, parseInt(r[1], 10)) / 255,
                  Math.min(255, parseInt(r[2], 10)) / 255,
                  Math.min(255, parseInt(r[3], 10)) / 255,
                  t,
                )
              );
            if (
              (r =
                /^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                  o,
                ))
            )
              return (
                n(r[4]),
                this.setRGB(
                  Math.min(100, parseInt(r[1], 10)) / 100,
                  Math.min(100, parseInt(r[2], 10)) / 100,
                  Math.min(100, parseInt(r[3], 10)) / 100,
                  t,
                )
              );
            break;
          case "hsl":
          case "hsla":
            if (
              (r =
                /^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(
                  o,
                ))
            )
              return (
                n(r[4]),
                this.setHSL(
                  parseFloat(r[1]) / 360,
                  parseFloat(r[2]) / 100,
                  parseFloat(r[3]) / 100,
                  t,
                )
              );
            break;
          default:
            Ce("Color: Unknown color model " + e);
        }
      } else if ((s = /^\#([A-Fa-f\d]+)$/.exec(e))) {
        let r = s[1],
          a = r.length;
        if (a === 3)
          return this.setRGB(
            parseInt(r.charAt(0), 16) / 15,
            parseInt(r.charAt(1), 16) / 15,
            parseInt(r.charAt(2), 16) / 15,
            t,
          );
        if (a === 6) return this.setHex(parseInt(r, 16), t);
        Ce("Color: Invalid hex color " + e);
      } else if (e && e.length > 0) return this.setColorName(e, t);
      return this;
    }
    setColorName(e, t = Et) {
      let n = zc[e.toLowerCase()];
      return (
        n !== void 0 ? this.setHex(n, t) : Ce("Color: Unknown color " + e),
        this
      );
    }
    clone() {
      return new this.constructor(this.r, this.g, this.b);
    }
    copy(e) {
      return ((this.r = e.r), (this.g = e.g), (this.b = e.b), this);
    }
    copySRGBToLinear(e) {
      return ((this.r = Tn(e.r)), (this.g = Tn(e.g)), (this.b = Tn(e.b)), this);
    }
    copyLinearToSRGB(e) {
      return ((this.r = Ii(e.r)), (this.g = Ii(e.g)), (this.b = Ii(e.b)), this);
    }
    convertSRGBToLinear() {
      return (this.copySRGBToLinear(this), this);
    }
    convertLinearToSRGB() {
      return (this.copyLinearToSRGB(this), this);
    }
    getHex(e = Et) {
      return (
        Xe.workingToColorSpace(Rt.copy(this), e),
        Math.round(qe(Rt.r * 255, 0, 255)) * 65536 +
          Math.round(qe(Rt.g * 255, 0, 255)) * 256 +
          Math.round(qe(Rt.b * 255, 0, 255))
      );
    }
    getHexString(e = Et) {
      return ("000000" + this.getHex(e).toString(16)).slice(-6);
    }
    getHSL(e, t = Xe.workingColorSpace) {
      Xe.workingToColorSpace(Rt.copy(this), t);
      let n = Rt.r,
        s = Rt.g,
        r = Rt.b,
        a = Math.max(n, s, r),
        o = Math.min(n, s, r),
        c,
        l,
        u = (o + a) / 2;
      if (o === a) ((c = 0), (l = 0));
      else {
        let d = a - o;
        switch (((l = u <= 0.5 ? d / (a + o) : d / (2 - a - o)), a)) {
          case n:
            c = (s - r) / d + (s < r ? 6 : 0);
            break;
          case s:
            c = (r - n) / d + 2;
            break;
          case r:
            c = (n - s) / d + 4;
            break;
        }
        c /= 6;
      }
      return ((e.h = c), (e.s = l), (e.l = u), e);
    }
    getRGB(e, t = Xe.workingColorSpace) {
      return (
        Xe.workingToColorSpace(Rt.copy(this), t),
        (e.r = Rt.r),
        (e.g = Rt.g),
        (e.b = Rt.b),
        e
      );
    }
    getStyle(e = Et) {
      Xe.workingToColorSpace(Rt.copy(this), e);
      let t = Rt.r,
        n = Rt.g,
        s = Rt.b;
      return e !== Et
        ? `color(${e} ${t.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`
        : `rgb(${Math.round(t * 255)},${Math.round(n * 255)},${Math.round(s * 255)})`;
    }
    offsetHSL(e, t, n) {
      return (this.getHSL(Nn), this.setHSL(Nn.h + e, Nn.s + t, Nn.l + n));
    }
    add(e) {
      return ((this.r += e.r), (this.g += e.g), (this.b += e.b), this);
    }
    addColors(e, t) {
      return (
        (this.r = e.r + t.r),
        (this.g = e.g + t.g),
        (this.b = e.b + t.b),
        this
      );
    }
    addScalar(e) {
      return ((this.r += e), (this.g += e), (this.b += e), this);
    }
    sub(e) {
      return (
        (this.r = Math.max(0, this.r - e.r)),
        (this.g = Math.max(0, this.g - e.g)),
        (this.b = Math.max(0, this.b - e.b)),
        this
      );
    }
    multiply(e) {
      return ((this.r *= e.r), (this.g *= e.g), (this.b *= e.b), this);
    }
    multiplyScalar(e) {
      return ((this.r *= e), (this.g *= e), (this.b *= e), this);
    }
    lerp(e, t) {
      return (
        (this.r += (e.r - this.r) * t),
        (this.g += (e.g - this.g) * t),
        (this.b += (e.b - this.b) * t),
        this
      );
    }
    lerpColors(e, t, n) {
      return (
        (this.r = e.r + (t.r - e.r) * n),
        (this.g = e.g + (t.g - e.g) * n),
        (this.b = e.b + (t.b - e.b) * n),
        this
      );
    }
    lerpHSL(e, t) {
      (this.getHSL(Nn), e.getHSL(zs));
      let n = ns(Nn.h, zs.h, t),
        s = ns(Nn.s, zs.s, t),
        r = ns(Nn.l, zs.l, t);
      return (this.setHSL(n, s, r), this);
    }
    setFromVector3(e) {
      return ((this.r = e.x), (this.g = e.y), (this.b = e.z), this);
    }
    applyMatrix3(e) {
      let t = this.r,
        n = this.g,
        s = this.b,
        r = e.elements;
      return (
        (this.r = r[0] * t + r[3] * n + r[6] * s),
        (this.g = r[1] * t + r[4] * n + r[7] * s),
        (this.b = r[2] * t + r[5] * n + r[8] * s),
        this
      );
    }
    equals(e) {
      return e.r === this.r && e.g === this.g && e.b === this.b;
    }
    fromArray(e, t = 0) {
      return ((this.r = e[t]), (this.g = e[t + 1]), (this.b = e[t + 2]), this);
    }
    toArray(e = [], t = 0) {
      return ((e[t] = this.r), (e[t + 1] = this.g), (e[t + 2] = this.b), e);
    }
    fromBufferAttribute(e, t) {
      return (
        (this.r = e.getX(t)),
        (this.g = e.getY(t)),
        (this.b = e.getZ(t)),
        this
      );
    }
    toJSON() {
      return this.getHex();
    }
    *[Symbol.iterator]() {
      (yield this.r, yield this.g, yield this.b);
    }
  },
  Rt = new Pe();
Pe.NAMES = zc;
var ls = class extends St {
    constructor() {
      (super(),
        (this.isScene = !0),
        (this.type = "Scene"),
        (this.background = null),
        (this.environment = null),
        (this.fog = null),
        (this.backgroundBlurriness = 0),
        (this.backgroundIntensity = 1),
        (this.backgroundRotation = new dn()),
        (this.environmentIntensity = 1),
        (this.environmentRotation = new dn()),
        (this.overrideMaterial = null),
        typeof __THREE_DEVTOOLS__ < "u" &&
          __THREE_DEVTOOLS__.dispatchEvent(
            new CustomEvent("observe", { detail: this }),
          ));
    }
    copy(e, t) {
      return (
        super.copy(e, t),
        e.background !== null && (this.background = e.background.clone()),
        e.environment !== null && (this.environment = e.environment.clone()),
        e.fog !== null && (this.fog = e.fog.clone()),
        (this.backgroundBlurriness = e.backgroundBlurriness),
        (this.backgroundIntensity = e.backgroundIntensity),
        this.backgroundRotation.copy(e.backgroundRotation),
        (this.environmentIntensity = e.environmentIntensity),
        this.environmentRotation.copy(e.environmentRotation),
        e.overrideMaterial !== null &&
          (this.overrideMaterial = e.overrideMaterial.clone()),
        (this.matrixAutoUpdate = e.matrixAutoUpdate),
        this
      );
    }
    toJSON(e) {
      let t = super.toJSON(e);
      return (
        this.fog !== null && (t.object.fog = this.fog.toJSON()),
        this.backgroundBlurriness > 0 &&
          (t.object.backgroundBlurriness = this.backgroundBlurriness),
        this.backgroundIntensity !== 1 &&
          (t.object.backgroundIntensity = this.backgroundIntensity),
        (t.object.backgroundRotation = this.backgroundRotation.toArray()),
        this.environmentIntensity !== 1 &&
          (t.object.environmentIntensity = this.environmentIntensity),
        (t.object.environmentRotation = this.environmentRotation.toArray()),
        t
      );
    }
  },
  $t = new U(),
  yn = new U(),
  $a = new U(),
  Mn = new U(),
  Mi = new U(),
  Si = new U(),
  Vl = new U(),
  Ka = new U(),
  ja = new U(),
  Qa = new U(),
  eo = new ut(),
  to = new ut(),
  no = new ut(),
  Vn = class i {
    constructor(e = new U(), t = new U(), n = new U()) {
      ((this.a = e), (this.b = t), (this.c = n));
    }
    static getNormal(e, t, n, s) {
      (s.subVectors(n, t), $t.subVectors(e, t), s.cross($t));
      let r = s.lengthSq();
      return r > 0 ? s.multiplyScalar(1 / Math.sqrt(r)) : s.set(0, 0, 0);
    }
    static getBarycoord(e, t, n, s, r) {
      ($t.subVectors(s, t), yn.subVectors(n, t), $a.subVectors(e, t));
      let a = $t.dot($t),
        o = $t.dot(yn),
        c = $t.dot($a),
        l = yn.dot(yn),
        u = yn.dot($a),
        d = a * l - o * o;
      if (d === 0) return (r.set(0, 0, 0), null);
      let h = 1 / d,
        p = (l * c - o * u) * h,
        g = (a * u - o * c) * h;
      return r.set(1 - p - g, g, p);
    }
    static containsPoint(e, t, n, s) {
      return this.getBarycoord(e, t, n, s, Mn) === null
        ? !1
        : Mn.x >= 0 && Mn.y >= 0 && Mn.x + Mn.y <= 1;
    }
    static getInterpolation(e, t, n, s, r, a, o, c) {
      return this.getBarycoord(e, t, n, s, Mn) === null
        ? ((c.x = 0),
          (c.y = 0),
          "z" in c && (c.z = 0),
          "w" in c && (c.w = 0),
          null)
        : (c.setScalar(0),
          c.addScaledVector(r, Mn.x),
          c.addScaledVector(a, Mn.y),
          c.addScaledVector(o, Mn.z),
          c);
    }
    static getInterpolatedAttribute(e, t, n, s, r, a) {
      return (
        eo.setScalar(0),
        to.setScalar(0),
        no.setScalar(0),
        eo.fromBufferAttribute(e, t),
        to.fromBufferAttribute(e, n),
        no.fromBufferAttribute(e, s),
        a.setScalar(0),
        a.addScaledVector(eo, r.x),
        a.addScaledVector(to, r.y),
        a.addScaledVector(no, r.z),
        a
      );
    }
    static isFrontFacing(e, t, n, s) {
      return (
        $t.subVectors(n, t),
        yn.subVectors(e, t),
        $t.cross(yn).dot(s) < 0
      );
    }
    set(e, t, n) {
      return (this.a.copy(e), this.b.copy(t), this.c.copy(n), this);
    }
    setFromPointsAndIndices(e, t, n, s) {
      return (this.a.copy(e[t]), this.b.copy(e[n]), this.c.copy(e[s]), this);
    }
    setFromAttributeAndIndices(e, t, n, s) {
      return (
        this.a.fromBufferAttribute(e, t),
        this.b.fromBufferAttribute(e, n),
        this.c.fromBufferAttribute(e, s),
        this
      );
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      return (this.a.copy(e.a), this.b.copy(e.b), this.c.copy(e.c), this);
    }
    getArea() {
      return (
        $t.subVectors(this.c, this.b),
        yn.subVectors(this.a, this.b),
        $t.cross(yn).length() * 0.5
      );
    }
    getMidpoint(e) {
      return e
        .addVectors(this.a, this.b)
        .add(this.c)
        .multiplyScalar(1 / 3);
    }
    getNormal(e) {
      return i.getNormal(this.a, this.b, this.c, e);
    }
    getPlane(e) {
      return e.setFromCoplanarPoints(this.a, this.b, this.c);
    }
    getBarycoord(e, t) {
      return i.getBarycoord(e, this.a, this.b, this.c, t);
    }
    getInterpolation(e, t, n, s, r) {
      return i.getInterpolation(e, this.a, this.b, this.c, t, n, s, r);
    }
    containsPoint(e) {
      return i.containsPoint(e, this.a, this.b, this.c);
    }
    isFrontFacing(e) {
      return i.isFrontFacing(this.a, this.b, this.c, e);
    }
    intersectsBox(e) {
      return e.intersectsTriangle(this);
    }
    closestPointToPoint(e, t) {
      let n = this.a,
        s = this.b,
        r = this.c,
        a,
        o;
      (Mi.subVectors(s, n), Si.subVectors(r, n), Ka.subVectors(e, n));
      let c = Mi.dot(Ka),
        l = Si.dot(Ka);
      if (c <= 0 && l <= 0) return t.copy(n);
      ja.subVectors(e, s);
      let u = Mi.dot(ja),
        d = Si.dot(ja);
      if (u >= 0 && d <= u) return t.copy(s);
      let h = c * d - u * l;
      if (h <= 0 && c >= 0 && u <= 0)
        return ((a = c / (c - u)), t.copy(n).addScaledVector(Mi, a));
      Qa.subVectors(e, r);
      let p = Mi.dot(Qa),
        g = Si.dot(Qa);
      if (g >= 0 && p <= g) return t.copy(r);
      let y = p * l - c * g;
      if (y <= 0 && l >= 0 && g <= 0)
        return ((o = l / (l - g)), t.copy(n).addScaledVector(Si, o));
      let m = u * g - p * d;
      if (m <= 0 && d - u >= 0 && p - g >= 0)
        return (
          Vl.subVectors(r, s),
          (o = (d - u) / (d - u + (p - g))),
          t.copy(s).addScaledVector(Vl, o)
        );
      let f = 1 / (m + y + h);
      return (
        (a = y * f),
        (o = h * f),
        t.copy(n).addScaledVector(Mi, a).addScaledVector(Si, o)
      );
    }
    equals(e) {
      return e.a.equals(this.a) && e.b.equals(this.b) && e.c.equals(this.c);
    }
  },
  Gn = class {
    constructor(
      e = new U(1 / 0, 1 / 0, 1 / 0),
      t = new U(-1 / 0, -1 / 0, -1 / 0),
    ) {
      ((this.isBox3 = !0), (this.min = e), (this.max = t));
    }
    set(e, t) {
      return (this.min.copy(e), this.max.copy(t), this);
    }
    setFromArray(e) {
      this.makeEmpty();
      for (let t = 0, n = e.length; t < n; t += 3)
        this.expandByPoint(Kt.fromArray(e, t));
      return this;
    }
    setFromBufferAttribute(e) {
      this.makeEmpty();
      for (let t = 0, n = e.count; t < n; t++)
        this.expandByPoint(Kt.fromBufferAttribute(e, t));
      return this;
    }
    setFromPoints(e) {
      this.makeEmpty();
      for (let t = 0, n = e.length; t < n; t++) this.expandByPoint(e[t]);
      return this;
    }
    setFromCenterAndSize(e, t) {
      let n = Kt.copy(t).multiplyScalar(0.5);
      return (this.min.copy(e).sub(n), this.max.copy(e).add(n), this);
    }
    setFromObject(e, t = !1) {
      return (this.makeEmpty(), this.expandByObject(e, t));
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      return (this.min.copy(e.min), this.max.copy(e.max), this);
    }
    makeEmpty() {
      return (
        (this.min.x = this.min.y = this.min.z = 1 / 0),
        (this.max.x = this.max.y = this.max.z = -1 / 0),
        this
      );
    }
    isEmpty() {
      return (
        this.max.x < this.min.x ||
        this.max.y < this.min.y ||
        this.max.z < this.min.z
      );
    }
    getCenter(e) {
      return this.isEmpty()
        ? e.set(0, 0, 0)
        : e.addVectors(this.min, this.max).multiplyScalar(0.5);
    }
    getSize(e) {
      return this.isEmpty() ? e.set(0, 0, 0) : e.subVectors(this.max, this.min);
    }
    expandByPoint(e) {
      return (this.min.min(e), this.max.max(e), this);
    }
    expandByVector(e) {
      return (this.min.sub(e), this.max.add(e), this);
    }
    expandByScalar(e) {
      return (this.min.addScalar(-e), this.max.addScalar(e), this);
    }
    expandByObject(e, t = !1) {
      e.updateWorldMatrix(!1, !1);
      let n = e.geometry;
      if (n !== void 0) {
        let r = n.getAttribute("position");
        if (t === !0 && r !== void 0 && e.isInstancedMesh !== !0)
          for (let a = 0, o = r.count; a < o; a++)
            (e.isMesh === !0
              ? e.getVertexPosition(a, Kt)
              : Kt.fromBufferAttribute(r, a),
              Kt.applyMatrix4(e.matrixWorld),
              this.expandByPoint(Kt));
        else
          (e.boundingBox !== void 0
            ? (e.boundingBox === null && e.computeBoundingBox(),
              Vs.copy(e.boundingBox))
            : (n.boundingBox === null && n.computeBoundingBox(),
              Vs.copy(n.boundingBox)),
            Vs.applyMatrix4(e.matrixWorld),
            this.union(Vs));
      }
      let s = e.children;
      for (let r = 0, a = s.length; r < a; r++) this.expandByObject(s[r], t);
      return this;
    }
    containsPoint(e) {
      return (
        e.x >= this.min.x &&
        e.x <= this.max.x &&
        e.y >= this.min.y &&
        e.y <= this.max.y &&
        e.z >= this.min.z &&
        e.z <= this.max.z
      );
    }
    containsBox(e) {
      return (
        this.min.x <= e.min.x &&
        e.max.x <= this.max.x &&
        this.min.y <= e.min.y &&
        e.max.y <= this.max.y &&
        this.min.z <= e.min.z &&
        e.max.z <= this.max.z
      );
    }
    getParameter(e, t) {
      return t.set(
        (e.x - this.min.x) / (this.max.x - this.min.x),
        (e.y - this.min.y) / (this.max.y - this.min.y),
        (e.z - this.min.z) / (this.max.z - this.min.z),
      );
    }
    intersectsBox(e) {
      return (
        e.max.x >= this.min.x &&
        e.min.x <= this.max.x &&
        e.max.y >= this.min.y &&
        e.min.y <= this.max.y &&
        e.max.z >= this.min.z &&
        e.min.z <= this.max.z
      );
    }
    intersectsSphere(e) {
      return (
        this.clampPoint(e.center, Kt),
        Kt.distanceToSquared(e.center) <= e.radius * e.radius
      );
    }
    intersectsPlane(e) {
      let t, n;
      return (
        e.normal.x > 0
          ? ((t = e.normal.x * this.min.x), (n = e.normal.x * this.max.x))
          : ((t = e.normal.x * this.max.x), (n = e.normal.x * this.min.x)),
        e.normal.y > 0
          ? ((t += e.normal.y * this.min.y), (n += e.normal.y * this.max.y))
          : ((t += e.normal.y * this.max.y), (n += e.normal.y * this.min.y)),
        e.normal.z > 0
          ? ((t += e.normal.z * this.min.z), (n += e.normal.z * this.max.z))
          : ((t += e.normal.z * this.max.z), (n += e.normal.z * this.min.z)),
        t <= -e.constant && n >= -e.constant
      );
    }
    intersectsTriangle(e) {
      if (this.isEmpty()) return !1;
      (this.getCenter(Ki),
        ks.subVectors(this.max, Ki),
        bi.subVectors(e.a, Ki),
        Ei.subVectors(e.b, Ki),
        Ti.subVectors(e.c, Ki),
        Fn.subVectors(Ei, bi),
        On.subVectors(Ti, Ei),
        Qn.subVectors(bi, Ti));
      let t = [
        0,
        -Fn.z,
        Fn.y,
        0,
        -On.z,
        On.y,
        0,
        -Qn.z,
        Qn.y,
        Fn.z,
        0,
        -Fn.x,
        On.z,
        0,
        -On.x,
        Qn.z,
        0,
        -Qn.x,
        -Fn.y,
        Fn.x,
        0,
        -On.y,
        On.x,
        0,
        -Qn.y,
        Qn.x,
        0,
      ];
      return !io(t, bi, Ei, Ti, ks) ||
        ((t = [1, 0, 0, 0, 1, 0, 0, 0, 1]), !io(t, bi, Ei, Ti, ks))
        ? !1
        : (Gs.crossVectors(Fn, On),
          (t = [Gs.x, Gs.y, Gs.z]),
          io(t, bi, Ei, Ti, ks));
    }
    clampPoint(e, t) {
      return t.copy(e).clamp(this.min, this.max);
    }
    distanceToPoint(e) {
      return this.clampPoint(e, Kt).distanceTo(e);
    }
    getBoundingSphere(e) {
      return (
        this.isEmpty()
          ? e.makeEmpty()
          : (this.getCenter(e.center),
            (e.radius = this.getSize(Kt).length() * 0.5)),
        e
      );
    }
    intersect(e) {
      return (
        this.min.max(e.min),
        this.max.min(e.max),
        this.isEmpty() && this.makeEmpty(),
        this
      );
    }
    union(e) {
      return (this.min.min(e.min), this.max.max(e.max), this);
    }
    applyMatrix4(e) {
      return this.isEmpty()
        ? this
        : (Sn[0].set(this.min.x, this.min.y, this.min.z).applyMatrix4(e),
          Sn[1].set(this.min.x, this.min.y, this.max.z).applyMatrix4(e),
          Sn[2].set(this.min.x, this.max.y, this.min.z).applyMatrix4(e),
          Sn[3].set(this.min.x, this.max.y, this.max.z).applyMatrix4(e),
          Sn[4].set(this.max.x, this.min.y, this.min.z).applyMatrix4(e),
          Sn[5].set(this.max.x, this.min.y, this.max.z).applyMatrix4(e),
          Sn[6].set(this.max.x, this.max.y, this.min.z).applyMatrix4(e),
          Sn[7].set(this.max.x, this.max.y, this.max.z).applyMatrix4(e),
          this.setFromPoints(Sn),
          this);
    }
    translate(e) {
      return (this.min.add(e), this.max.add(e), this);
    }
    equals(e) {
      return e.min.equals(this.min) && e.max.equals(this.max);
    }
    toJSON() {
      return { min: this.min.toArray(), max: this.max.toArray() };
    }
    fromJSON(e) {
      return (this.min.fromArray(e.min), this.max.fromArray(e.max), this);
    }
  },
  Sn = [new U(), new U(), new U(), new U(), new U(), new U(), new U(), new U()],
  Kt = new U(),
  Vs = new Gn(),
  bi = new U(),
  Ei = new U(),
  Ti = new U(),
  Fn = new U(),
  On = new U(),
  Qn = new U(),
  Ki = new U(),
  ks = new U(),
  Gs = new U(),
  ei = new U();
function io(i, e, t, n, s) {
  for (let r = 0, a = i.length - 3; r <= a; r += 3) {
    ei.fromArray(i, r);
    let o = s.x * Math.abs(ei.x) + s.y * Math.abs(ei.y) + s.z * Math.abs(ei.z),
      c = e.dot(ei),
      l = t.dot(ei),
      u = n.dot(ei);
    if (Math.max(-Math.max(c, l, u), Math.min(c, l, u)) > o) return !1;
  }
  return !0;
}
var _t = new U(),
  Hs = new Ye(),
  au = 0,
  Vt = class extends hn {
    constructor(e, t, n = !1) {
      if ((super(), Array.isArray(e)))
        throw new TypeError(
          "THREE.BufferAttribute: array should be a Typed Array.",
        );
      ((this.isBufferAttribute = !0),
        Object.defineProperty(this, "id", { value: au++ }),
        (this.name = ""),
        (this.array = e),
        (this.itemSize = t),
        (this.count = e !== void 0 ? e.length / t : 0),
        (this.normalized = n),
        (this.usage = vo),
        (this.updateRanges = []),
        (this.gpuType = tn),
        (this.version = 0));
    }
    onUploadCallback() {}
    set needsUpdate(e) {
      e === !0 && this.version++;
    }
    setUsage(e) {
      return ((this.usage = e), this);
    }
    addUpdateRange(e, t) {
      this.updateRanges.push({ start: e, count: t });
    }
    clearUpdateRanges() {
      this.updateRanges.length = 0;
    }
    copy(e) {
      return (
        (this.name = e.name),
        (this.array = new e.array.constructor(e.array)),
        (this.itemSize = e.itemSize),
        (this.count = e.count),
        (this.normalized = e.normalized),
        (this.usage = e.usage),
        (this.gpuType = e.gpuType),
        this
      );
    }
    copyAt(e, t, n) {
      ((e *= this.itemSize), (n *= t.itemSize));
      for (let s = 0, r = this.itemSize; s < r; s++)
        this.array[e + s] = t.array[n + s];
      return this;
    }
    copyArray(e) {
      return (this.array.set(e), this);
    }
    applyMatrix3(e) {
      if (this.itemSize === 2)
        for (let t = 0, n = this.count; t < n; t++)
          (Hs.fromBufferAttribute(this, t),
            Hs.applyMatrix3(e),
            this.setXY(t, Hs.x, Hs.y));
      else if (this.itemSize === 3)
        for (let t = 0, n = this.count; t < n; t++)
          (_t.fromBufferAttribute(this, t),
            _t.applyMatrix3(e),
            this.setXYZ(t, _t.x, _t.y, _t.z));
      return this;
    }
    applyMatrix4(e) {
      for (let t = 0, n = this.count; t < n; t++)
        (_t.fromBufferAttribute(this, t),
          _t.applyMatrix4(e),
          this.setXYZ(t, _t.x, _t.y, _t.z));
      return this;
    }
    applyNormalMatrix(e) {
      for (let t = 0, n = this.count; t < n; t++)
        (_t.fromBufferAttribute(this, t),
          _t.applyNormalMatrix(e),
          this.setXYZ(t, _t.x, _t.y, _t.z));
      return this;
    }
    transformDirection(e) {
      for (let t = 0, n = this.count; t < n; t++)
        (_t.fromBufferAttribute(this, t),
          _t.transformDirection(e),
          this.setXYZ(t, _t.x, _t.y, _t.z));
      return this;
    }
    set(e, t = 0) {
      return (this.array.set(e, t), this);
    }
    getComponent(e, t) {
      let n = this.array[e * this.itemSize + t];
      return (this.normalized && (n = Ri(n, this.array)), n);
    }
    setComponent(e, t, n) {
      return (
        this.normalized && (n = Lt(n, this.array)),
        (this.array[e * this.itemSize + t] = n),
        this
      );
    }
    getX(e) {
      let t = this.array[e * this.itemSize];
      return (this.normalized && (t = Ri(t, this.array)), t);
    }
    setX(e, t) {
      return (
        this.normalized && (t = Lt(t, this.array)),
        (this.array[e * this.itemSize] = t),
        this
      );
    }
    getY(e) {
      let t = this.array[e * this.itemSize + 1];
      return (this.normalized && (t = Ri(t, this.array)), t);
    }
    setY(e, t) {
      return (
        this.normalized && (t = Lt(t, this.array)),
        (this.array[e * this.itemSize + 1] = t),
        this
      );
    }
    getZ(e) {
      let t = this.array[e * this.itemSize + 2];
      return (this.normalized && (t = Ri(t, this.array)), t);
    }
    setZ(e, t) {
      return (
        this.normalized && (t = Lt(t, this.array)),
        (this.array[e * this.itemSize + 2] = t),
        this
      );
    }
    getW(e) {
      let t = this.array[e * this.itemSize + 3];
      return (this.normalized && (t = Ri(t, this.array)), t);
    }
    setW(e, t) {
      return (
        this.normalized && (t = Lt(t, this.array)),
        (this.array[e * this.itemSize + 3] = t),
        this
      );
    }
    setXY(e, t, n) {
      return (
        (e *= this.itemSize),
        this.normalized && ((t = Lt(t, this.array)), (n = Lt(n, this.array))),
        (this.array[e + 0] = t),
        (this.array[e + 1] = n),
        this
      );
    }
    setXYZ(e, t, n, s) {
      return (
        (e *= this.itemSize),
        this.normalized &&
          ((t = Lt(t, this.array)),
          (n = Lt(n, this.array)),
          (s = Lt(s, this.array))),
        (this.array[e + 0] = t),
        (this.array[e + 1] = n),
        (this.array[e + 2] = s),
        this
      );
    }
    setXYZW(e, t, n, s, r) {
      return (
        (e *= this.itemSize),
        this.normalized &&
          ((t = Lt(t, this.array)),
          (n = Lt(n, this.array)),
          (s = Lt(s, this.array)),
          (r = Lt(r, this.array))),
        (this.array[e + 0] = t),
        (this.array[e + 1] = n),
        (this.array[e + 2] = s),
        (this.array[e + 3] = r),
        this
      );
    }
    onUpload(e) {
      return ((this.onUploadCallback = e), this);
    }
    clone() {
      return new this.constructor(this.array, this.itemSize).copy(this);
    }
    toJSON() {
      let e = {
        itemSize: this.itemSize,
        type: this.array.constructor.name,
        array: Array.from(this.array),
        normalized: this.normalized,
      };
      return (
        this.name !== "" && (e.name = this.name),
        this.usage !== vo && (e.usage = this.usage),
        e
      );
    }
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
  };
var cs = class extends Vt {
  constructor(e, t, n) {
    super(new Uint16Array(e), t, n);
  }
};
var hs = class extends Vt {
  constructor(e, t, n) {
    super(new Uint32Array(e), t, n);
  }
};
var ot = class extends Vt {
    constructor(e, t, n) {
      super(new Float32Array(e), t, n);
    }
  },
  ou = new Gn(),
  ji = new U(),
  so = new U(),
  Hn = class {
    constructor(e = new U(), t = -1) {
      ((this.isSphere = !0), (this.center = e), (this.radius = t));
    }
    set(e, t) {
      return (this.center.copy(e), (this.radius = t), this);
    }
    setFromPoints(e, t) {
      let n = this.center;
      t !== void 0 ? n.copy(t) : ou.setFromPoints(e).getCenter(n);
      let s = 0;
      for (let r = 0, a = e.length; r < a; r++)
        s = Math.max(s, n.distanceToSquared(e[r]));
      return ((this.radius = Math.sqrt(s)), this);
    }
    copy(e) {
      return (this.center.copy(e.center), (this.radius = e.radius), this);
    }
    isEmpty() {
      return this.radius < 0;
    }
    makeEmpty() {
      return (this.center.set(0, 0, 0), (this.radius = -1), this);
    }
    containsPoint(e) {
      return e.distanceToSquared(this.center) <= this.radius * this.radius;
    }
    distanceToPoint(e) {
      return e.distanceTo(this.center) - this.radius;
    }
    intersectsSphere(e) {
      let t = this.radius + e.radius;
      return e.center.distanceToSquared(this.center) <= t * t;
    }
    intersectsBox(e) {
      return e.intersectsSphere(this);
    }
    intersectsPlane(e) {
      return Math.abs(e.distanceToPoint(this.center)) <= this.radius;
    }
    clampPoint(e, t) {
      let n = this.center.distanceToSquared(e);
      return (
        t.copy(e),
        n > this.radius * this.radius &&
          (t.sub(this.center).normalize(),
          t.multiplyScalar(this.radius).add(this.center)),
        t
      );
    }
    getBoundingBox(e) {
      return this.isEmpty()
        ? (e.makeEmpty(), e)
        : (e.set(this.center, this.center), e.expandByScalar(this.radius), e);
    }
    applyMatrix4(e) {
      return (
        this.center.applyMatrix4(e),
        (this.radius = this.radius * e.getMaxScaleOnAxis()),
        this
      );
    }
    translate(e) {
      return (this.center.add(e), this);
    }
    expandByPoint(e) {
      if (this.isEmpty()) return (this.center.copy(e), (this.radius = 0), this);
      ji.subVectors(e, this.center);
      let t = ji.lengthSq();
      if (t > this.radius * this.radius) {
        let n = Math.sqrt(t),
          s = (n - this.radius) * 0.5;
        (this.center.addScaledVector(ji, s / n), (this.radius += s));
      }
      return this;
    }
    union(e) {
      return e.isEmpty()
        ? this
        : this.isEmpty()
          ? (this.copy(e), this)
          : (this.center.equals(e.center) === !0
              ? (this.radius = Math.max(this.radius, e.radius))
              : (so.subVectors(e.center, this.center).setLength(e.radius),
                this.expandByPoint(ji.copy(e.center).add(so)),
                this.expandByPoint(ji.copy(e.center).sub(so))),
            this);
    }
    equals(e) {
      return e.center.equals(this.center) && e.radius === this.radius;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    toJSON() {
      return { radius: this.radius, center: this.center.toArray() };
    }
    fromJSON(e) {
      return ((this.radius = e.radius), this.center.fromArray(e.center), this);
    }
  },
  lu = 0,
  Xt = new ht(),
  ro = new St(),
  Ai = new U(),
  zt = new Gn(),
  Qi = new Gn(),
  yt = new U(),
  At = class i extends hn {
    constructor() {
      (super(),
        (this.isBufferGeometry = !0),
        Object.defineProperty(this, "id", { value: lu++ }),
        (this.uuid = qi()),
        (this.name = ""),
        (this.type = "BufferGeometry"),
        (this.index = null),
        (this.indirect = null),
        (this.indirectOffset = 0),
        (this.attributes = {}),
        (this.morphAttributes = {}),
        (this.morphTargetsRelative = !1),
        (this.groups = []),
        (this.boundingBox = null),
        (this.boundingSphere = null),
        (this.drawRange = { start: 0, count: 1 / 0 }),
        (this.userData = {}));
    }
    getIndex() {
      return this.index;
    }
    setIndex(e) {
      return (
        Array.isArray(e)
          ? (this.index = new (Lh(e) ? hs : cs)(e, 1))
          : (this.index = e),
        this
      );
    }
    setIndirect(e, t = 0) {
      return ((this.indirect = e), (this.indirectOffset = t), this);
    }
    getIndirect() {
      return this.indirect;
    }
    getAttribute(e) {
      return this.attributes[e];
    }
    setAttribute(e, t) {
      return ((this.attributes[e] = t), this);
    }
    deleteAttribute(e) {
      return (delete this.attributes[e], this);
    }
    hasAttribute(e) {
      return this.attributes[e] !== void 0;
    }
    addGroup(e, t, n = 0) {
      this.groups.push({ start: e, count: t, materialIndex: n });
    }
    clearGroups() {
      this.groups = [];
    }
    setDrawRange(e, t) {
      ((this.drawRange.start = e), (this.drawRange.count = t));
    }
    applyMatrix4(e) {
      let t = this.attributes.position;
      t !== void 0 && (t.applyMatrix4(e), (t.needsUpdate = !0));
      let n = this.attributes.normal;
      if (n !== void 0) {
        let r = new Ne().getNormalMatrix(e);
        (n.applyNormalMatrix(r), (n.needsUpdate = !0));
      }
      let s = this.attributes.tangent;
      return (
        s !== void 0 && (s.transformDirection(e), (s.needsUpdate = !0)),
        this.boundingBox !== null && this.computeBoundingBox(),
        this.boundingSphere !== null && this.computeBoundingSphere(),
        this
      );
    }
    applyQuaternion(e) {
      return (Xt.makeRotationFromQuaternion(e), this.applyMatrix4(Xt), this);
    }
    rotateX(e) {
      return (Xt.makeRotationX(e), this.applyMatrix4(Xt), this);
    }
    rotateY(e) {
      return (Xt.makeRotationY(e), this.applyMatrix4(Xt), this);
    }
    rotateZ(e) {
      return (Xt.makeRotationZ(e), this.applyMatrix4(Xt), this);
    }
    translate(e, t, n) {
      return (Xt.makeTranslation(e, t, n), this.applyMatrix4(Xt), this);
    }
    scale(e, t, n) {
      return (Xt.makeScale(e, t, n), this.applyMatrix4(Xt), this);
    }
    lookAt(e) {
      return (
        ro.lookAt(e),
        ro.updateMatrix(),
        this.applyMatrix4(ro.matrix),
        this
      );
    }
    center() {
      return (
        this.computeBoundingBox(),
        this.boundingBox.getCenter(Ai).negate(),
        this.translate(Ai.x, Ai.y, Ai.z),
        this
      );
    }
    setFromPoints(e) {
      let t = this.getAttribute("position");
      if (t === void 0) {
        let n = [];
        for (let s = 0, r = e.length; s < r; s++) {
          let a = e[s];
          n.push(a.x, a.y, a.z || 0);
        }
        this.setAttribute("position", new ot(n, 3));
      } else {
        let n = Math.min(e.length, t.count);
        for (let s = 0; s < n; s++) {
          let r = e[s];
          t.setXYZ(s, r.x, r.y, r.z || 0);
        }
        (e.length > t.count &&
          Ce(
            "BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry.",
          ),
          (t.needsUpdate = !0));
      }
      return this;
    }
    computeBoundingBox() {
      this.boundingBox === null && (this.boundingBox = new Gn());
      let e = this.attributes.position,
        t = this.morphAttributes.position;
      if (e && e.isGLBufferAttribute) {
        (Ie(
          "BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",
          this,
        ),
          this.boundingBox.set(
            new U(-1 / 0, -1 / 0, -1 / 0),
            new U(1 / 0, 1 / 0, 1 / 0),
          ));
        return;
      }
      if (e !== void 0) {
        if ((this.boundingBox.setFromBufferAttribute(e), t))
          for (let n = 0, s = t.length; n < s; n++) {
            let r = t[n];
            (zt.setFromBufferAttribute(r),
              this.morphTargetsRelative
                ? (yt.addVectors(this.boundingBox.min, zt.min),
                  this.boundingBox.expandByPoint(yt),
                  yt.addVectors(this.boundingBox.max, zt.max),
                  this.boundingBox.expandByPoint(yt))
                : (this.boundingBox.expandByPoint(zt.min),
                  this.boundingBox.expandByPoint(zt.max)));
          }
      } else this.boundingBox.makeEmpty();
      (isNaN(this.boundingBox.min.x) ||
        isNaN(this.boundingBox.min.y) ||
        isNaN(this.boundingBox.min.z)) &&
        Ie(
          'BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',
          this,
        );
    }
    computeBoundingSphere() {
      this.boundingSphere === null && (this.boundingSphere = new Hn());
      let e = this.attributes.position,
        t = this.morphAttributes.position;
      if (e && e.isGLBufferAttribute) {
        (Ie(
          "BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",
          this,
        ),
          this.boundingSphere.set(new U(), 1 / 0));
        return;
      }
      if (e) {
        let n = this.boundingSphere.center;
        if ((zt.setFromBufferAttribute(e), t))
          for (let r = 0, a = t.length; r < a; r++) {
            let o = t[r];
            (Qi.setFromBufferAttribute(o),
              this.morphTargetsRelative
                ? (yt.addVectors(zt.min, Qi.min),
                  zt.expandByPoint(yt),
                  yt.addVectors(zt.max, Qi.max),
                  zt.expandByPoint(yt))
                : (zt.expandByPoint(Qi.min), zt.expandByPoint(Qi.max)));
          }
        zt.getCenter(n);
        let s = 0;
        for (let r = 0, a = e.count; r < a; r++)
          (yt.fromBufferAttribute(e, r),
            (s = Math.max(s, n.distanceToSquared(yt))));
        if (t)
          for (let r = 0, a = t.length; r < a; r++) {
            let o = t[r],
              c = this.morphTargetsRelative;
            for (let l = 0, u = o.count; l < u; l++)
              (yt.fromBufferAttribute(o, l),
                c && (Ai.fromBufferAttribute(e, l), yt.add(Ai)),
                (s = Math.max(s, n.distanceToSquared(yt))));
          }
        ((this.boundingSphere.radius = Math.sqrt(s)),
          isNaN(this.boundingSphere.radius) &&
            Ie(
              'BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',
              this,
            ));
      }
    }
    computeTangents() {
      let e = this.index,
        t = this.attributes;
      if (
        e === null ||
        t.position === void 0 ||
        t.normal === void 0 ||
        t.uv === void 0
      ) {
        Ie(
          "BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)",
        );
        return;
      }
      let n = t.position,
        s = t.normal,
        r = t.uv;
      this.hasAttribute("tangent") === !1 &&
        this.setAttribute("tangent", new Vt(new Float32Array(4 * n.count), 4));
      let a = this.getAttribute("tangent"),
        o = [],
        c = [];
      for (let x = 0; x < n.count; x++) ((o[x] = new U()), (c[x] = new U()));
      let l = new U(),
        u = new U(),
        d = new U(),
        h = new Ye(),
        p = new Ye(),
        g = new Ye(),
        y = new U(),
        m = new U();
      function f(x, A, N) {
        (l.fromBufferAttribute(n, x),
          u.fromBufferAttribute(n, A),
          d.fromBufferAttribute(n, N),
          h.fromBufferAttribute(r, x),
          p.fromBufferAttribute(r, A),
          g.fromBufferAttribute(r, N),
          u.sub(l),
          d.sub(l),
          p.sub(h),
          g.sub(h));
        let C = 1 / (p.x * g.y - g.x * p.y);
        isFinite(C) &&
          (y
            .copy(u)
            .multiplyScalar(g.y)
            .addScaledVector(d, -p.y)
            .multiplyScalar(C),
          m
            .copy(d)
            .multiplyScalar(p.x)
            .addScaledVector(u, -g.x)
            .multiplyScalar(C),
          o[x].add(y),
          o[A].add(y),
          o[N].add(y),
          c[x].add(m),
          c[A].add(m),
          c[N].add(m));
      }
      let M = this.groups;
      M.length === 0 && (M = [{ start: 0, count: e.count }]);
      for (let x = 0, A = M.length; x < A; ++x) {
        let N = M[x],
          C = N.start,
          O = N.count;
        for (let X = C, W = C + O; X < W; X += 3)
          f(e.getX(X + 0), e.getX(X + 1), e.getX(X + 2));
      }
      let T = new U(),
        E = new U(),
        w = new U(),
        b = new U();
      function R(x) {
        (w.fromBufferAttribute(s, x), b.copy(w));
        let A = o[x];
        (T.copy(A),
          T.sub(w.multiplyScalar(w.dot(A))).normalize(),
          E.crossVectors(b, A));
        let C = E.dot(c[x]) < 0 ? -1 : 1;
        a.setXYZW(x, T.x, T.y, T.z, C);
      }
      for (let x = 0, A = M.length; x < A; ++x) {
        let N = M[x],
          C = N.start,
          O = N.count;
        for (let X = C, W = C + O; X < W; X += 3)
          (R(e.getX(X + 0)), R(e.getX(X + 1)), R(e.getX(X + 2)));
      }
    }
    computeVertexNormals() {
      let e = this.index,
        t = this.getAttribute("position");
      if (t !== void 0) {
        let n = this.getAttribute("normal");
        if (n === void 0)
          ((n = new Vt(new Float32Array(t.count * 3), 3)),
            this.setAttribute("normal", n));
        else for (let h = 0, p = n.count; h < p; h++) n.setXYZ(h, 0, 0, 0);
        let s = new U(),
          r = new U(),
          a = new U(),
          o = new U(),
          c = new U(),
          l = new U(),
          u = new U(),
          d = new U();
        if (e)
          for (let h = 0, p = e.count; h < p; h += 3) {
            let g = e.getX(h + 0),
              y = e.getX(h + 1),
              m = e.getX(h + 2);
            (s.fromBufferAttribute(t, g),
              r.fromBufferAttribute(t, y),
              a.fromBufferAttribute(t, m),
              u.subVectors(a, r),
              d.subVectors(s, r),
              u.cross(d),
              o.fromBufferAttribute(n, g),
              c.fromBufferAttribute(n, y),
              l.fromBufferAttribute(n, m),
              o.add(u),
              c.add(u),
              l.add(u),
              n.setXYZ(g, o.x, o.y, o.z),
              n.setXYZ(y, c.x, c.y, c.z),
              n.setXYZ(m, l.x, l.y, l.z));
          }
        else
          for (let h = 0, p = t.count; h < p; h += 3)
            (s.fromBufferAttribute(t, h + 0),
              r.fromBufferAttribute(t, h + 1),
              a.fromBufferAttribute(t, h + 2),
              u.subVectors(a, r),
              d.subVectors(s, r),
              u.cross(d),
              n.setXYZ(h + 0, u.x, u.y, u.z),
              n.setXYZ(h + 1, u.x, u.y, u.z),
              n.setXYZ(h + 2, u.x, u.y, u.z));
        (this.normalizeNormals(), (n.needsUpdate = !0));
      }
    }
    normalizeNormals() {
      let e = this.attributes.normal;
      for (let t = 0, n = e.count; t < n; t++)
        (yt.fromBufferAttribute(e, t),
          yt.normalize(),
          e.setXYZ(t, yt.x, yt.y, yt.z));
    }
    toNonIndexed() {
      function e(o, c) {
        let l = o.array,
          u = o.itemSize,
          d = o.normalized,
          h = new l.constructor(c.length * u),
          p = 0,
          g = 0;
        for (let y = 0, m = c.length; y < m; y++) {
          o.isInterleavedBufferAttribute
            ? (p = c[y] * o.data.stride + o.offset)
            : (p = c[y] * u);
          for (let f = 0; f < u; f++) h[g++] = l[p++];
        }
        return new Vt(h, u, d);
      }
      if (this.index === null)
        return (
          Ce(
            "BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed.",
          ),
          this
        );
      let t = new i(),
        n = this.index.array,
        s = this.attributes;
      for (let o in s) {
        let c = s[o],
          l = e(c, n);
        t.setAttribute(o, l);
      }
      let r = this.morphAttributes;
      for (let o in r) {
        let c = [],
          l = r[o];
        for (let u = 0, d = l.length; u < d; u++) {
          let h = l[u],
            p = e(h, n);
          c.push(p);
        }
        t.morphAttributes[o] = c;
      }
      t.morphTargetsRelative = this.morphTargetsRelative;
      let a = this.groups;
      for (let o = 0, c = a.length; o < c; o++) {
        let l = a[o];
        t.addGroup(l.start, l.count, l.materialIndex);
      }
      return t;
    }
    toJSON() {
      let e = {
        metadata: {
          version: 4.7,
          type: "BufferGeometry",
          generator: "BufferGeometry.toJSON",
        },
      };
      if (
        ((e.uuid = this.uuid),
        (e.type = this.type),
        this.name !== "" && (e.name = this.name),
        Object.keys(this.userData).length > 0 && (e.userData = this.userData),
        this.parameters !== void 0)
      ) {
        let c = this.parameters;
        for (let l in c) c[l] !== void 0 && (e[l] = c[l]);
        return e;
      }
      e.data = { attributes: {} };
      let t = this.index;
      t !== null &&
        (e.data.index = {
          type: t.array.constructor.name,
          array: Array.prototype.slice.call(t.array),
        });
      let n = this.attributes;
      for (let c in n) {
        let l = n[c];
        e.data.attributes[c] = l.toJSON(e.data);
      }
      let s = {},
        r = !1;
      for (let c in this.morphAttributes) {
        let l = this.morphAttributes[c],
          u = [];
        for (let d = 0, h = l.length; d < h; d++) {
          let p = l[d];
          u.push(p.toJSON(e.data));
        }
        u.length > 0 && ((s[c] = u), (r = !0));
      }
      r &&
        ((e.data.morphAttributes = s),
        (e.data.morphTargetsRelative = this.morphTargetsRelative));
      let a = this.groups;
      a.length > 0 && (e.data.groups = JSON.parse(JSON.stringify(a)));
      let o = this.boundingSphere;
      return (o !== null && (e.data.boundingSphere = o.toJSON()), e);
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      ((this.index = null),
        (this.attributes = {}),
        (this.morphAttributes = {}),
        (this.groups = []),
        (this.boundingBox = null),
        (this.boundingSphere = null));
      let t = {};
      this.name = e.name;
      let n = e.index;
      n !== null && this.setIndex(n.clone());
      let s = e.attributes;
      for (let l in s) {
        let u = s[l];
        this.setAttribute(l, u.clone(t));
      }
      let r = e.morphAttributes;
      for (let l in r) {
        let u = [],
          d = r[l];
        for (let h = 0, p = d.length; h < p; h++) u.push(d[h].clone(t));
        this.morphAttributes[l] = u;
      }
      this.morphTargetsRelative = e.morphTargetsRelative;
      let a = e.groups;
      for (let l = 0, u = a.length; l < u; l++) {
        let d = a[l];
        this.addGroup(d.start, d.count, d.materialIndex);
      }
      let o = e.boundingBox;
      o !== null && (this.boundingBox = o.clone());
      let c = e.boundingSphere;
      return (
        c !== null && (this.boundingSphere = c.clone()),
        (this.drawRange.start = e.drawRange.start),
        (this.drawRange.count = e.drawRange.count),
        (this.userData = e.userData),
        this
      );
    }
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
  };
var cu = 0,
  Nt = class extends hn {
    constructor() {
      (super(),
        (this.isMaterial = !0),
        Object.defineProperty(this, "id", { value: cu++ }),
        (this.uuid = qi()),
        (this.name = ""),
        (this.type = "Material"),
        (this.blending = si),
        (this.side = An),
        (this.vertexColors = !1),
        (this.opacity = 1),
        (this.transparent = !1),
        (this.alphaHash = !1),
        (this.blendSrc = lr),
        (this.blendDst = cr),
        (this.blendEquation = kn),
        (this.blendSrcAlpha = null),
        (this.blendDstAlpha = null),
        (this.blendEquationAlpha = null),
        (this.blendColor = new Pe(0, 0, 0)),
        (this.blendAlpha = 0),
        (this.depthFunc = ri),
        (this.depthTest = !0),
        (this.depthWrite = !0),
        (this.stencilWriteMask = 255),
        (this.stencilFunc = xo),
        (this.stencilRef = 0),
        (this.stencilFuncMask = 255),
        (this.stencilFail = ii),
        (this.stencilZFail = ii),
        (this.stencilZPass = ii),
        (this.stencilWrite = !1),
        (this.clippingPlanes = null),
        (this.clipIntersection = !1),
        (this.clipShadows = !1),
        (this.shadowSide = null),
        (this.colorWrite = !0),
        (this.precision = null),
        (this.polygonOffset = !1),
        (this.polygonOffsetFactor = 0),
        (this.polygonOffsetUnits = 0),
        (this.dithering = !1),
        (this.alphaToCoverage = !1),
        (this.premultipliedAlpha = !1),
        (this.forceSinglePass = !1),
        (this.allowOverride = !0),
        (this.visible = !0),
        (this.toneMapped = !0),
        (this.userData = {}),
        (this.version = 0),
        (this._alphaTest = 0));
    }
    get alphaTest() {
      return this._alphaTest;
    }
    set alphaTest(e) {
      (this._alphaTest > 0 != e > 0 && this.version++, (this._alphaTest = e));
    }
    onBeforeRender() {}
    onBeforeCompile() {}
    customProgramCacheKey() {
      return this.onBeforeCompile.toString();
    }
    setValues(e) {
      if (e !== void 0)
        for (let t in e) {
          let n = e[t];
          if (n === void 0) {
            Ce(`Material: parameter '${t}' has value of undefined.`);
            continue;
          }
          let s = this[t];
          if (s === void 0) {
            Ce(`Material: '${t}' is not a property of THREE.${this.type}.`);
            continue;
          }
          s && s.isColor
            ? s.set(n)
            : s && s.isVector3 && n && n.isVector3
              ? s.copy(n)
              : (this[t] = n);
        }
    }
    toJSON(e) {
      let t = e === void 0 || typeof e == "string";
      t && (e = { textures: {}, images: {} });
      let n = {
        metadata: {
          version: 4.7,
          type: "Material",
          generator: "Material.toJSON",
        },
      };
      ((n.uuid = this.uuid),
        (n.type = this.type),
        this.name !== "" && (n.name = this.name),
        this.color && this.color.isColor && (n.color = this.color.getHex()),
        this.roughness !== void 0 && (n.roughness = this.roughness),
        this.metalness !== void 0 && (n.metalness = this.metalness),
        this.sheen !== void 0 && (n.sheen = this.sheen),
        this.sheenColor &&
          this.sheenColor.isColor &&
          (n.sheenColor = this.sheenColor.getHex()),
        this.sheenRoughness !== void 0 &&
          (n.sheenRoughness = this.sheenRoughness),
        this.emissive &&
          this.emissive.isColor &&
          (n.emissive = this.emissive.getHex()),
        this.emissiveIntensity !== void 0 &&
          this.emissiveIntensity !== 1 &&
          (n.emissiveIntensity = this.emissiveIntensity),
        this.specular &&
          this.specular.isColor &&
          (n.specular = this.specular.getHex()),
        this.specularIntensity !== void 0 &&
          (n.specularIntensity = this.specularIntensity),
        this.specularColor &&
          this.specularColor.isColor &&
          (n.specularColor = this.specularColor.getHex()),
        this.shininess !== void 0 && (n.shininess = this.shininess),
        this.clearcoat !== void 0 && (n.clearcoat = this.clearcoat),
        this.clearcoatRoughness !== void 0 &&
          (n.clearcoatRoughness = this.clearcoatRoughness),
        this.clearcoatMap &&
          this.clearcoatMap.isTexture &&
          (n.clearcoatMap = this.clearcoatMap.toJSON(e).uuid),
        this.clearcoatRoughnessMap &&
          this.clearcoatRoughnessMap.isTexture &&
          (n.clearcoatRoughnessMap = this.clearcoatRoughnessMap.toJSON(e).uuid),
        this.clearcoatNormalMap &&
          this.clearcoatNormalMap.isTexture &&
          ((n.clearcoatNormalMap = this.clearcoatNormalMap.toJSON(e).uuid),
          (n.clearcoatNormalScale = this.clearcoatNormalScale.toArray())),
        this.sheenColorMap &&
          this.sheenColorMap.isTexture &&
          (n.sheenColorMap = this.sheenColorMap.toJSON(e).uuid),
        this.sheenRoughnessMap &&
          this.sheenRoughnessMap.isTexture &&
          (n.sheenRoughnessMap = this.sheenRoughnessMap.toJSON(e).uuid),
        this.dispersion !== void 0 && (n.dispersion = this.dispersion),
        this.iridescence !== void 0 && (n.iridescence = this.iridescence),
        this.iridescenceIOR !== void 0 &&
          (n.iridescenceIOR = this.iridescenceIOR),
        this.iridescenceThicknessRange !== void 0 &&
          (n.iridescenceThicknessRange = this.iridescenceThicknessRange),
        this.iridescenceMap &&
          this.iridescenceMap.isTexture &&
          (n.iridescenceMap = this.iridescenceMap.toJSON(e).uuid),
        this.iridescenceThicknessMap &&
          this.iridescenceThicknessMap.isTexture &&
          (n.iridescenceThicknessMap =
            this.iridescenceThicknessMap.toJSON(e).uuid),
        this.anisotropy !== void 0 && (n.anisotropy = this.anisotropy),
        this.anisotropyRotation !== void 0 &&
          (n.anisotropyRotation = this.anisotropyRotation),
        this.anisotropyMap &&
          this.anisotropyMap.isTexture &&
          (n.anisotropyMap = this.anisotropyMap.toJSON(e).uuid),
        this.map && this.map.isTexture && (n.map = this.map.toJSON(e).uuid),
        this.matcap &&
          this.matcap.isTexture &&
          (n.matcap = this.matcap.toJSON(e).uuid),
        this.alphaMap &&
          this.alphaMap.isTexture &&
          (n.alphaMap = this.alphaMap.toJSON(e).uuid),
        this.lightMap &&
          this.lightMap.isTexture &&
          ((n.lightMap = this.lightMap.toJSON(e).uuid),
          (n.lightMapIntensity = this.lightMapIntensity)),
        this.aoMap &&
          this.aoMap.isTexture &&
          ((n.aoMap = this.aoMap.toJSON(e).uuid),
          (n.aoMapIntensity = this.aoMapIntensity)),
        this.bumpMap &&
          this.bumpMap.isTexture &&
          ((n.bumpMap = this.bumpMap.toJSON(e).uuid),
          (n.bumpScale = this.bumpScale)),
        this.normalMap &&
          this.normalMap.isTexture &&
          ((n.normalMap = this.normalMap.toJSON(e).uuid),
          (n.normalMapType = this.normalMapType),
          (n.normalScale = this.normalScale.toArray())),
        this.displacementMap &&
          this.displacementMap.isTexture &&
          ((n.displacementMap = this.displacementMap.toJSON(e).uuid),
          (n.displacementScale = this.displacementScale),
          (n.displacementBias = this.displacementBias)),
        this.roughnessMap &&
          this.roughnessMap.isTexture &&
          (n.roughnessMap = this.roughnessMap.toJSON(e).uuid),
        this.metalnessMap &&
          this.metalnessMap.isTexture &&
          (n.metalnessMap = this.metalnessMap.toJSON(e).uuid),
        this.emissiveMap &&
          this.emissiveMap.isTexture &&
          (n.emissiveMap = this.emissiveMap.toJSON(e).uuid),
        this.specularMap &&
          this.specularMap.isTexture &&
          (n.specularMap = this.specularMap.toJSON(e).uuid),
        this.specularIntensityMap &&
          this.specularIntensityMap.isTexture &&
          (n.specularIntensityMap = this.specularIntensityMap.toJSON(e).uuid),
        this.specularColorMap &&
          this.specularColorMap.isTexture &&
          (n.specularColorMap = this.specularColorMap.toJSON(e).uuid),
        this.envMap &&
          this.envMap.isTexture &&
          ((n.envMap = this.envMap.toJSON(e).uuid),
          this.combine !== void 0 && (n.combine = this.combine)),
        this.envMapRotation !== void 0 &&
          (n.envMapRotation = this.envMapRotation.toArray()),
        this.envMapIntensity !== void 0 &&
          (n.envMapIntensity = this.envMapIntensity),
        this.reflectivity !== void 0 && (n.reflectivity = this.reflectivity),
        this.refractionRatio !== void 0 &&
          (n.refractionRatio = this.refractionRatio),
        this.gradientMap &&
          this.gradientMap.isTexture &&
          (n.gradientMap = this.gradientMap.toJSON(e).uuid),
        this.transmission !== void 0 && (n.transmission = this.transmission),
        this.transmissionMap &&
          this.transmissionMap.isTexture &&
          (n.transmissionMap = this.transmissionMap.toJSON(e).uuid),
        this.thickness !== void 0 && (n.thickness = this.thickness),
        this.thicknessMap &&
          this.thicknessMap.isTexture &&
          (n.thicknessMap = this.thicknessMap.toJSON(e).uuid),
        this.attenuationDistance !== void 0 &&
          this.attenuationDistance !== 1 / 0 &&
          (n.attenuationDistance = this.attenuationDistance),
        this.attenuationColor !== void 0 &&
          (n.attenuationColor = this.attenuationColor.getHex()),
        this.size !== void 0 && (n.size = this.size),
        this.shadowSide !== null && (n.shadowSide = this.shadowSide),
        this.sizeAttenuation !== void 0 &&
          (n.sizeAttenuation = this.sizeAttenuation),
        this.blending !== si && (n.blending = this.blending),
        this.side !== An && (n.side = this.side),
        this.vertexColors === !0 && (n.vertexColors = !0),
        this.opacity < 1 && (n.opacity = this.opacity),
        this.transparent === !0 && (n.transparent = !0),
        this.blendSrc !== lr && (n.blendSrc = this.blendSrc),
        this.blendDst !== cr && (n.blendDst = this.blendDst),
        this.blendEquation !== kn && (n.blendEquation = this.blendEquation),
        this.blendSrcAlpha !== null && (n.blendSrcAlpha = this.blendSrcAlpha),
        this.blendDstAlpha !== null && (n.blendDstAlpha = this.blendDstAlpha),
        this.blendEquationAlpha !== null &&
          (n.blendEquationAlpha = this.blendEquationAlpha),
        this.blendColor &&
          this.blendColor.isColor &&
          (n.blendColor = this.blendColor.getHex()),
        this.blendAlpha !== 0 && (n.blendAlpha = this.blendAlpha),
        this.depthFunc !== ri && (n.depthFunc = this.depthFunc),
        this.depthTest === !1 && (n.depthTest = this.depthTest),
        this.depthWrite === !1 && (n.depthWrite = this.depthWrite),
        this.colorWrite === !1 && (n.colorWrite = this.colorWrite),
        this.stencilWriteMask !== 255 &&
          (n.stencilWriteMask = this.stencilWriteMask),
        this.stencilFunc !== xo && (n.stencilFunc = this.stencilFunc),
        this.stencilRef !== 0 && (n.stencilRef = this.stencilRef),
        this.stencilFuncMask !== 255 &&
          (n.stencilFuncMask = this.stencilFuncMask),
        this.stencilFail !== ii && (n.stencilFail = this.stencilFail),
        this.stencilZFail !== ii && (n.stencilZFail = this.stencilZFail),
        this.stencilZPass !== ii && (n.stencilZPass = this.stencilZPass),
        this.stencilWrite === !0 && (n.stencilWrite = this.stencilWrite),
        this.rotation !== void 0 &&
          this.rotation !== 0 &&
          (n.rotation = this.rotation),
        this.polygonOffset === !0 && (n.polygonOffset = !0),
        this.polygonOffsetFactor !== 0 &&
          (n.polygonOffsetFactor = this.polygonOffsetFactor),
        this.polygonOffsetUnits !== 0 &&
          (n.polygonOffsetUnits = this.polygonOffsetUnits),
        this.linewidth !== void 0 &&
          this.linewidth !== 1 &&
          (n.linewidth = this.linewidth),
        this.dashSize !== void 0 && (n.dashSize = this.dashSize),
        this.gapSize !== void 0 && (n.gapSize = this.gapSize),
        this.scale !== void 0 && (n.scale = this.scale),
        this.dithering === !0 && (n.dithering = !0),
        this.alphaTest > 0 && (n.alphaTest = this.alphaTest),
        this.alphaHash === !0 && (n.alphaHash = !0),
        this.alphaToCoverage === !0 && (n.alphaToCoverage = !0),
        this.premultipliedAlpha === !0 && (n.premultipliedAlpha = !0),
        this.forceSinglePass === !0 && (n.forceSinglePass = !0),
        this.allowOverride === !1 && (n.allowOverride = !1),
        this.wireframe === !0 && (n.wireframe = !0),
        this.wireframeLinewidth > 1 &&
          (n.wireframeLinewidth = this.wireframeLinewidth),
        this.wireframeLinecap !== "round" &&
          (n.wireframeLinecap = this.wireframeLinecap),
        this.wireframeLinejoin !== "round" &&
          (n.wireframeLinejoin = this.wireframeLinejoin),
        this.flatShading === !0 && (n.flatShading = !0),
        this.visible === !1 && (n.visible = !1),
        this.toneMapped === !1 && (n.toneMapped = !1),
        this.fog === !1 && (n.fog = !1),
        Object.keys(this.userData).length > 0 && (n.userData = this.userData));
      function s(r) {
        let a = [];
        for (let o in r) {
          let c = r[o];
          (delete c.metadata, a.push(c));
        }
        return a;
      }
      if (t) {
        let r = s(e.textures),
          a = s(e.images);
        (r.length > 0 && (n.textures = r), a.length > 0 && (n.images = a));
      }
      return n;
    }
    clone() {
      return new this.constructor().copy(this);
    }
    copy(e) {
      ((this.name = e.name),
        (this.blending = e.blending),
        (this.side = e.side),
        (this.vertexColors = e.vertexColors),
        (this.opacity = e.opacity),
        (this.transparent = e.transparent),
        (this.blendSrc = e.blendSrc),
        (this.blendDst = e.blendDst),
        (this.blendEquation = e.blendEquation),
        (this.blendSrcAlpha = e.blendSrcAlpha),
        (this.blendDstAlpha = e.blendDstAlpha),
        (this.blendEquationAlpha = e.blendEquationAlpha),
        this.blendColor.copy(e.blendColor),
        (this.blendAlpha = e.blendAlpha),
        (this.depthFunc = e.depthFunc),
        (this.depthTest = e.depthTest),
        (this.depthWrite = e.depthWrite),
        (this.stencilWriteMask = e.stencilWriteMask),
        (this.stencilFunc = e.stencilFunc),
        (this.stencilRef = e.stencilRef),
        (this.stencilFuncMask = e.stencilFuncMask),
        (this.stencilFail = e.stencilFail),
        (this.stencilZFail = e.stencilZFail),
        (this.stencilZPass = e.stencilZPass),
        (this.stencilWrite = e.stencilWrite));
      let t = e.clippingPlanes,
        n = null;
      if (t !== null) {
        let s = t.length;
        n = new Array(s);
        for (let r = 0; r !== s; ++r) n[r] = t[r].clone();
      }
      return (
        (this.clippingPlanes = n),
        (this.clipIntersection = e.clipIntersection),
        (this.clipShadows = e.clipShadows),
        (this.shadowSide = e.shadowSide),
        (this.colorWrite = e.colorWrite),
        (this.precision = e.precision),
        (this.polygonOffset = e.polygonOffset),
        (this.polygonOffsetFactor = e.polygonOffsetFactor),
        (this.polygonOffsetUnits = e.polygonOffsetUnits),
        (this.dithering = e.dithering),
        (this.alphaTest = e.alphaTest),
        (this.alphaHash = e.alphaHash),
        (this.alphaToCoverage = e.alphaToCoverage),
        (this.premultipliedAlpha = e.premultipliedAlpha),
        (this.forceSinglePass = e.forceSinglePass),
        (this.allowOverride = e.allowOverride),
        (this.visible = e.visible),
        (this.toneMapped = e.toneMapped),
        (this.userData = JSON.parse(JSON.stringify(e.userData))),
        this
      );
    }
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
    set needsUpdate(e) {
      e === !0 && this.version++;
    }
  };
var bn = new U(),
  ao = new U(),
  Ws = new U(),
  Bn = new U(),
  oo = new U(),
  Xs = new U(),
  lo = new U(),
  ai = class {
    constructor(e = new U(), t = new U(0, 0, -1)) {
      ((this.origin = e), (this.direction = t));
    }
    set(e, t) {
      return (this.origin.copy(e), this.direction.copy(t), this);
    }
    copy(e) {
      return (
        this.origin.copy(e.origin),
        this.direction.copy(e.direction),
        this
      );
    }
    at(e, t) {
      return t.copy(this.origin).addScaledVector(this.direction, e);
    }
    lookAt(e) {
      return (this.direction.copy(e).sub(this.origin).normalize(), this);
    }
    recast(e) {
      return (this.origin.copy(this.at(e, bn)), this);
    }
    closestPointToPoint(e, t) {
      t.subVectors(e, this.origin);
      let n = t.dot(this.direction);
      return n < 0
        ? t.copy(this.origin)
        : t.copy(this.origin).addScaledVector(this.direction, n);
    }
    distanceToPoint(e) {
      return Math.sqrt(this.distanceSqToPoint(e));
    }
    distanceSqToPoint(e) {
      let t = bn.subVectors(e, this.origin).dot(this.direction);
      return t < 0
        ? this.origin.distanceToSquared(e)
        : (bn.copy(this.origin).addScaledVector(this.direction, t),
          bn.distanceToSquared(e));
    }
    distanceSqToSegment(e, t, n, s) {
      (ao.copy(e).add(t).multiplyScalar(0.5),
        Ws.copy(t).sub(e).normalize(),
        Bn.copy(this.origin).sub(ao));
      let r = e.distanceTo(t) * 0.5,
        a = -this.direction.dot(Ws),
        o = Bn.dot(this.direction),
        c = -Bn.dot(Ws),
        l = Bn.lengthSq(),
        u = Math.abs(1 - a * a),
        d,
        h,
        p,
        g;
      if (u > 0)
        if (((d = a * c - o), (h = a * o - c), (g = r * u), d >= 0))
          if (h >= -g)
            if (h <= g) {
              let y = 1 / u;
              ((d *= y),
                (h *= y),
                (p = d * (d + a * h + 2 * o) + h * (a * d + h + 2 * c) + l));
            } else
              ((h = r),
                (d = Math.max(0, -(a * h + o))),
                (p = -d * d + h * (h + 2 * c) + l));
          else
            ((h = -r),
              (d = Math.max(0, -(a * h + o))),
              (p = -d * d + h * (h + 2 * c) + l));
        else
          h <= -g
            ? ((d = Math.max(0, -(-a * r + o))),
              (h = d > 0 ? -r : Math.min(Math.max(-r, -c), r)),
              (p = -d * d + h * (h + 2 * c) + l))
            : h <= g
              ? ((d = 0),
                (h = Math.min(Math.max(-r, -c), r)),
                (p = h * (h + 2 * c) + l))
              : ((d = Math.max(0, -(a * r + o))),
                (h = d > 0 ? r : Math.min(Math.max(-r, -c), r)),
                (p = -d * d + h * (h + 2 * c) + l));
      else
        ((h = a > 0 ? -r : r),
          (d = Math.max(0, -(a * h + o))),
          (p = -d * d + h * (h + 2 * c) + l));
      return (
        n && n.copy(this.origin).addScaledVector(this.direction, d),
        s && s.copy(ao).addScaledVector(Ws, h),
        p
      );
    }
    intersectSphere(e, t) {
      bn.subVectors(e.center, this.origin);
      let n = bn.dot(this.direction),
        s = bn.dot(bn) - n * n,
        r = e.radius * e.radius;
      if (s > r) return null;
      let a = Math.sqrt(r - s),
        o = n - a,
        c = n + a;
      return c < 0 ? null : o < 0 ? this.at(c, t) : this.at(o, t);
    }
    intersectsSphere(e) {
      return e.radius < 0
        ? !1
        : this.distanceSqToPoint(e.center) <= e.radius * e.radius;
    }
    distanceToPlane(e) {
      let t = e.normal.dot(this.direction);
      if (t === 0) return e.distanceToPoint(this.origin) === 0 ? 0 : null;
      let n = -(this.origin.dot(e.normal) + e.constant) / t;
      return n >= 0 ? n : null;
    }
    intersectPlane(e, t) {
      let n = this.distanceToPlane(e);
      return n === null ? null : this.at(n, t);
    }
    intersectsPlane(e) {
      let t = e.distanceToPoint(this.origin);
      return t === 0 || e.normal.dot(this.direction) * t < 0;
    }
    intersectBox(e, t) {
      let n,
        s,
        r,
        a,
        o,
        c,
        l = 1 / this.direction.x,
        u = 1 / this.direction.y,
        d = 1 / this.direction.z,
        h = this.origin;
      return (
        l >= 0
          ? ((n = (e.min.x - h.x) * l), (s = (e.max.x - h.x) * l))
          : ((n = (e.max.x - h.x) * l), (s = (e.min.x - h.x) * l)),
        u >= 0
          ? ((r = (e.min.y - h.y) * u), (a = (e.max.y - h.y) * u))
          : ((r = (e.max.y - h.y) * u), (a = (e.min.y - h.y) * u)),
        n > a ||
        r > s ||
        ((r > n || isNaN(n)) && (n = r),
        (a < s || isNaN(s)) && (s = a),
        d >= 0
          ? ((o = (e.min.z - h.z) * d), (c = (e.max.z - h.z) * d))
          : ((o = (e.max.z - h.z) * d), (c = (e.min.z - h.z) * d)),
        n > c || o > s) ||
        ((o > n || n !== n) && (n = o), (c < s || s !== s) && (s = c), s < 0)
          ? null
          : this.at(n >= 0 ? n : s, t)
      );
    }
    intersectsBox(e) {
      return this.intersectBox(e, bn) !== null;
    }
    intersectTriangle(e, t, n, s, r) {
      (oo.subVectors(t, e), Xs.subVectors(n, e), lo.crossVectors(oo, Xs));
      let a = this.direction.dot(lo),
        o;
      if (a > 0) {
        if (s) return null;
        o = 1;
      } else if (a < 0) ((o = -1), (a = -a));
      else return null;
      Bn.subVectors(this.origin, e);
      let c = o * this.direction.dot(Xs.crossVectors(Bn, Xs));
      if (c < 0) return null;
      let l = o * this.direction.dot(oo.cross(Bn));
      if (l < 0 || c + l > a) return null;
      let u = -o * Bn.dot(lo);
      return u < 0 ? null : this.at(u / a, r);
    }
    applyMatrix4(e) {
      return (
        this.origin.applyMatrix4(e),
        this.direction.transformDirection(e),
        this
      );
    }
    equals(e) {
      return e.origin.equals(this.origin) && e.direction.equals(this.direction);
    }
    clone() {
      return new this.constructor().copy(this);
    }
  },
  oi = class extends Nt {
    constructor(e) {
      (super(),
        (this.isMeshBasicMaterial = !0),
        (this.type = "MeshBasicMaterial"),
        (this.color = new Pe(16777215)),
        (this.map = null),
        (this.lightMap = null),
        (this.lightMapIntensity = 1),
        (this.aoMap = null),
        (this.aoMapIntensity = 1),
        (this.specularMap = null),
        (this.alphaMap = null),
        (this.envMap = null),
        (this.envMapRotation = new dn()),
        (this.combine = Hr),
        (this.reflectivity = 1),
        (this.refractionRatio = 0.98),
        (this.wireframe = !1),
        (this.wireframeLinewidth = 1),
        (this.wireframeLinecap = "round"),
        (this.wireframeLinejoin = "round"),
        (this.fog = !0),
        this.setValues(e));
    }
    copy(e) {
      return (
        super.copy(e),
        this.color.copy(e.color),
        (this.map = e.map),
        (this.lightMap = e.lightMap),
        (this.lightMapIntensity = e.lightMapIntensity),
        (this.aoMap = e.aoMap),
        (this.aoMapIntensity = e.aoMapIntensity),
        (this.specularMap = e.specularMap),
        (this.alphaMap = e.alphaMap),
        (this.envMap = e.envMap),
        this.envMapRotation.copy(e.envMapRotation),
        (this.combine = e.combine),
        (this.reflectivity = e.reflectivity),
        (this.refractionRatio = e.refractionRatio),
        (this.wireframe = e.wireframe),
        (this.wireframeLinewidth = e.wireframeLinewidth),
        (this.wireframeLinecap = e.wireframeLinecap),
        (this.wireframeLinejoin = e.wireframeLinejoin),
        (this.fog = e.fog),
        this
      );
    }
  },
  kl = new ht(),
  ti = new ai(),
  qs = new Hn(),
  Gl = new U(),
  Ys = new U(),
  Zs = new U(),
  Js = new U(),
  co = new U(),
  $s = new U(),
  Hl = new U(),
  Ks = new U(),
  bt = class extends St {
    constructor(e = new At(), t = new oi()) {
      (super(),
        (this.isMesh = !0),
        (this.type = "Mesh"),
        (this.geometry = e),
        (this.material = t),
        (this.morphTargetDictionary = void 0),
        (this.morphTargetInfluences = void 0),
        (this.count = 1),
        this.updateMorphTargets());
    }
    copy(e, t) {
      return (
        super.copy(e, t),
        e.morphTargetInfluences !== void 0 &&
          (this.morphTargetInfluences = e.morphTargetInfluences.slice()),
        e.morphTargetDictionary !== void 0 &&
          (this.morphTargetDictionary = Object.assign(
            {},
            e.morphTargetDictionary,
          )),
        (this.material = Array.isArray(e.material)
          ? e.material.slice()
          : e.material),
        (this.geometry = e.geometry),
        this
      );
    }
    updateMorphTargets() {
      let t = this.geometry.morphAttributes,
        n = Object.keys(t);
      if (n.length > 0) {
        let s = t[n[0]];
        if (s !== void 0) {
          ((this.morphTargetInfluences = []),
            (this.morphTargetDictionary = {}));
          for (let r = 0, a = s.length; r < a; r++) {
            let o = s[r].name || String(r);
            (this.morphTargetInfluences.push(0),
              (this.morphTargetDictionary[o] = r));
          }
        }
      }
    }
    getVertexPosition(e, t) {
      let n = this.geometry,
        s = n.attributes.position,
        r = n.morphAttributes.position,
        a = n.morphTargetsRelative;
      t.fromBufferAttribute(s, e);
      let o = this.morphTargetInfluences;
      if (r && o) {
        $s.set(0, 0, 0);
        for (let c = 0, l = r.length; c < l; c++) {
          let u = o[c],
            d = r[c];
          u !== 0 &&
            (co.fromBufferAttribute(d, e),
            a ? $s.addScaledVector(co, u) : $s.addScaledVector(co.sub(t), u));
        }
        t.add($s);
      }
      return t;
    }
    raycast(e, t) {
      let n = this.geometry,
        s = this.material,
        r = this.matrixWorld;
      s !== void 0 &&
        (n.boundingSphere === null && n.computeBoundingSphere(),
        qs.copy(n.boundingSphere),
        qs.applyMatrix4(r),
        ti.copy(e.ray).recast(e.near),
        !(
          qs.containsPoint(ti.origin) === !1 &&
          (ti.intersectSphere(qs, Gl) === null ||
            ti.origin.distanceToSquared(Gl) > (e.far - e.near) ** 2)
        ) &&
          (kl.copy(r).invert(),
          ti.copy(e.ray).applyMatrix4(kl),
          !(n.boundingBox !== null && ti.intersectsBox(n.boundingBox) === !1) &&
            this._computeIntersections(e, t, ti)));
    }
    _computeIntersections(e, t, n) {
      let s,
        r = this.geometry,
        a = this.material,
        o = r.index,
        c = r.attributes.position,
        l = r.attributes.uv,
        u = r.attributes.uv1,
        d = r.attributes.normal,
        h = r.groups,
        p = r.drawRange;
      if (o !== null)
        if (Array.isArray(a))
          for (let g = 0, y = h.length; g < y; g++) {
            let m = h[g],
              f = a[m.materialIndex],
              M = Math.max(m.start, p.start),
              T = Math.min(
                o.count,
                Math.min(m.start + m.count, p.start + p.count),
              );
            for (let E = M, w = T; E < w; E += 3) {
              let b = o.getX(E),
                R = o.getX(E + 1),
                x = o.getX(E + 2);
              ((s = js(this, f, e, n, l, u, d, b, R, x)),
                s &&
                  ((s.faceIndex = Math.floor(E / 3)),
                  (s.face.materialIndex = m.materialIndex),
                  t.push(s)));
            }
          }
        else {
          let g = Math.max(0, p.start),
            y = Math.min(o.count, p.start + p.count);
          for (let m = g, f = y; m < f; m += 3) {
            let M = o.getX(m),
              T = o.getX(m + 1),
              E = o.getX(m + 2);
            ((s = js(this, a, e, n, l, u, d, M, T, E)),
              s && ((s.faceIndex = Math.floor(m / 3)), t.push(s)));
          }
        }
      else if (c !== void 0)
        if (Array.isArray(a))
          for (let g = 0, y = h.length; g < y; g++) {
            let m = h[g],
              f = a[m.materialIndex],
              M = Math.max(m.start, p.start),
              T = Math.min(
                c.count,
                Math.min(m.start + m.count, p.start + p.count),
              );
            for (let E = M, w = T; E < w; E += 3) {
              let b = E,
                R = E + 1,
                x = E + 2;
              ((s = js(this, f, e, n, l, u, d, b, R, x)),
                s &&
                  ((s.faceIndex = Math.floor(E / 3)),
                  (s.face.materialIndex = m.materialIndex),
                  t.push(s)));
            }
          }
        else {
          let g = Math.max(0, p.start),
            y = Math.min(c.count, p.start + p.count);
          for (let m = g, f = y; m < f; m += 3) {
            let M = m,
              T = m + 1,
              E = m + 2;
            ((s = js(this, a, e, n, l, u, d, M, T, E)),
              s && ((s.faceIndex = Math.floor(m / 3)), t.push(s)));
          }
        }
    }
  };
function hu(i, e, t, n, s, r, a, o) {
  let c;
  if (
    (e.side === Dt
      ? (c = n.intersectTriangle(a, r, s, !0, o))
      : (c = n.intersectTriangle(s, r, a, e.side === An, o)),
    c === null)
  )
    return null;
  (Ks.copy(o), Ks.applyMatrix4(i.matrixWorld));
  let l = t.ray.origin.distanceTo(Ks);
  return l < t.near || l > t.far
    ? null
    : { distance: l, point: Ks.clone(), object: i };
}
function js(i, e, t, n, s, r, a, o, c, l) {
  (i.getVertexPosition(o, Ys),
    i.getVertexPosition(c, Zs),
    i.getVertexPosition(l, Js));
  let u = hu(i, e, t, n, Ys, Zs, Js, Hl);
  if (u) {
    let d = new U();
    (Vn.getBarycoord(Hl, Ys, Zs, Js, d),
      s && (u.uv = Vn.getInterpolatedAttribute(s, o, c, l, d, new Ye())),
      r && (u.uv1 = Vn.getInterpolatedAttribute(r, o, c, l, d, new Ye())),
      a &&
        ((u.normal = Vn.getInterpolatedAttribute(a, o, c, l, d, new U())),
        u.normal.dot(n.direction) > 0 && u.normal.multiplyScalar(-1)));
    let h = { a: o, b: c, c: l, normal: new U(), materialIndex: 0 };
    (Vn.getNormal(Ys, Zs, Js, h.normal), (u.face = h), (u.barycoord = d));
  }
  return u;
}
var Er = class extends Ut {
  constructor(e = null, t = 1, n = 1, s, r, a, o, c, l = Mt, u = Mt, d, h) {
    (super(null, a, o, c, l, u, s, r, d, h),
      (this.isDataTexture = !0),
      (this.image = { data: e, width: t, height: n }),
      (this.generateMipmaps = !1),
      (this.flipY = !1),
      (this.unpackAlignment = 1));
  }
};
var ho = new U(),
  uu = new U(),
  du = new Ne(),
  on = class {
    constructor(e = new U(1, 0, 0), t = 0) {
      ((this.isPlane = !0), (this.normal = e), (this.constant = t));
    }
    set(e, t) {
      return (this.normal.copy(e), (this.constant = t), this);
    }
    setComponents(e, t, n, s) {
      return (this.normal.set(e, t, n), (this.constant = s), this);
    }
    setFromNormalAndCoplanarPoint(e, t) {
      return (this.normal.copy(e), (this.constant = -t.dot(this.normal)), this);
    }
    setFromCoplanarPoints(e, t, n) {
      let s = ho.subVectors(n, t).cross(uu.subVectors(e, t)).normalize();
      return (this.setFromNormalAndCoplanarPoint(s, e), this);
    }
    copy(e) {
      return (this.normal.copy(e.normal), (this.constant = e.constant), this);
    }
    normalize() {
      let e = 1 / this.normal.length();
      return (this.normal.multiplyScalar(e), (this.constant *= e), this);
    }
    negate() {
      return ((this.constant *= -1), this.normal.negate(), this);
    }
    distanceToPoint(e) {
      return this.normal.dot(e) + this.constant;
    }
    distanceToSphere(e) {
      return this.distanceToPoint(e.center) - e.radius;
    }
    projectPoint(e, t) {
      return t.copy(e).addScaledVector(this.normal, -this.distanceToPoint(e));
    }
    intersectLine(e, t, n = !0) {
      let s = e.delta(ho),
        r = this.normal.dot(s);
      if (r === 0)
        return this.distanceToPoint(e.start) === 0 ? t.copy(e.start) : null;
      let a = -(e.start.dot(this.normal) + this.constant) / r;
      return n === !0 && (a < 0 || a > 1)
        ? null
        : t.copy(e.start).addScaledVector(s, a);
    }
    intersectsLine(e) {
      let t = this.distanceToPoint(e.start),
        n = this.distanceToPoint(e.end);
      return (t < 0 && n > 0) || (n < 0 && t > 0);
    }
    intersectsBox(e) {
      return e.intersectsPlane(this);
    }
    intersectsSphere(e) {
      return e.intersectsPlane(this);
    }
    coplanarPoint(e) {
      return e.copy(this.normal).multiplyScalar(-this.constant);
    }
    applyMatrix4(e, t) {
      let n = t || du.getNormalMatrix(e),
        s = this.coplanarPoint(ho).applyMatrix4(e),
        r = this.normal.applyMatrix3(n).normalize();
      return ((this.constant = -s.dot(r)), this);
    }
    translate(e) {
      return ((this.constant -= e.dot(this.normal)), this);
    }
    equals(e) {
      return e.normal.equals(this.normal) && e.constant === this.constant;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  },
  ni = new Hn(),
  fu = new Ye(0.5, 0.5),
  Qs = new U(),
  Oi = class {
    constructor(
      e = new on(),
      t = new on(),
      n = new on(),
      s = new on(),
      r = new on(),
      a = new on(),
    ) {
      this.planes = [e, t, n, s, r, a];
    }
    set(e, t, n, s, r, a) {
      let o = this.planes;
      return (
        o[0].copy(e),
        o[1].copy(t),
        o[2].copy(n),
        o[3].copy(s),
        o[4].copy(r),
        o[5].copy(a),
        this
      );
    }
    copy(e) {
      let t = this.planes;
      for (let n = 0; n < 6; n++) t[n].copy(e.planes[n]);
      return this;
    }
    setFromProjectionMatrix(e, t = jt, n = !1) {
      let s = this.planes,
        r = e.elements,
        a = r[0],
        o = r[1],
        c = r[2],
        l = r[3],
        u = r[4],
        d = r[5],
        h = r[6],
        p = r[7],
        g = r[8],
        y = r[9],
        m = r[10],
        f = r[11],
        M = r[12],
        T = r[13],
        E = r[14],
        w = r[15];
      if (
        (s[0].setComponents(l - a, p - u, f - g, w - M).normalize(),
        s[1].setComponents(l + a, p + u, f + g, w + M).normalize(),
        s[2].setComponents(l + o, p + d, f + y, w + T).normalize(),
        s[3].setComponents(l - o, p - d, f - y, w - T).normalize(),
        n)
      )
        (s[4].setComponents(c, h, m, E).normalize(),
          s[5].setComponents(l - c, p - h, f - m, w - E).normalize());
      else if (
        (s[4].setComponents(l - c, p - h, f - m, w - E).normalize(), t === jt)
      )
        s[5].setComponents(l + c, p + h, f + m, w + E).normalize();
      else if (t === Pi) s[5].setComponents(c, h, m, E).normalize();
      else
        throw new Error(
          "THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: " +
            t,
        );
      return this;
    }
    intersectsObject(e) {
      if (e.boundingSphere !== void 0)
        (e.boundingSphere === null && e.computeBoundingSphere(),
          ni.copy(e.boundingSphere).applyMatrix4(e.matrixWorld));
      else {
        let t = e.geometry;
        (t.boundingSphere === null && t.computeBoundingSphere(),
          ni.copy(t.boundingSphere).applyMatrix4(e.matrixWorld));
      }
      return this.intersectsSphere(ni);
    }
    intersectsSprite(e) {
      ni.center.set(0, 0, 0);
      let t = fu.distanceTo(e.center);
      return (
        (ni.radius = 0.7071067811865476 + t),
        ni.applyMatrix4(e.matrixWorld),
        this.intersectsSphere(ni)
      );
    }
    intersectsSphere(e) {
      let t = this.planes,
        n = e.center,
        s = -e.radius;
      for (let r = 0; r < 6; r++) if (t[r].distanceToPoint(n) < s) return !1;
      return !0;
    }
    intersectsBox(e) {
      let t = this.planes;
      for (let n = 0; n < 6; n++) {
        let s = t[n];
        if (
          ((Qs.x = s.normal.x > 0 ? e.max.x : e.min.x),
          (Qs.y = s.normal.y > 0 ? e.max.y : e.min.y),
          (Qs.z = s.normal.z > 0 ? e.max.z : e.min.z),
          s.distanceToPoint(Qs) < 0)
        )
          return !1;
      }
      return !0;
    }
    containsPoint(e) {
      let t = this.planes;
      for (let n = 0; n < 6; n++) if (t[n].distanceToPoint(e) < 0) return !1;
      return !0;
    }
    clone() {
      return new this.constructor().copy(this);
    }
  };
var wn = class extends Nt {
    constructor(e) {
      (super(),
        (this.isLineBasicMaterial = !0),
        (this.type = "LineBasicMaterial"),
        (this.color = new Pe(16777215)),
        (this.map = null),
        (this.linewidth = 1),
        (this.linecap = "round"),
        (this.linejoin = "round"),
        (this.fog = !0),
        this.setValues(e));
    }
    copy(e) {
      return (
        super.copy(e),
        this.color.copy(e.color),
        (this.map = e.map),
        (this.linewidth = e.linewidth),
        (this.linecap = e.linecap),
        (this.linejoin = e.linejoin),
        (this.fog = e.fog),
        this
      );
    }
  },
  Tr = new U(),
  Ar = new U(),
  Wl = new ht(),
  es = new ai(),
  er = new Hn(),
  uo = new U(),
  Xl = new U(),
  wr = class extends St {
    constructor(e = new At(), t = new wn()) {
      (super(),
        (this.isLine = !0),
        (this.type = "Line"),
        (this.geometry = e),
        (this.material = t),
        (this.morphTargetDictionary = void 0),
        (this.morphTargetInfluences = void 0),
        this.updateMorphTargets());
    }
    copy(e, t) {
      return (
        super.copy(e, t),
        (this.material = Array.isArray(e.material)
          ? e.material.slice()
          : e.material),
        (this.geometry = e.geometry),
        this
      );
    }
    computeLineDistances() {
      let e = this.geometry;
      if (e.index === null) {
        let t = e.attributes.position,
          n = [0];
        for (let s = 1, r = t.count; s < r; s++)
          (Tr.fromBufferAttribute(t, s - 1),
            Ar.fromBufferAttribute(t, s),
            (n[s] = n[s - 1]),
            (n[s] += Tr.distanceTo(Ar)));
        e.setAttribute("lineDistance", new ot(n, 1));
      } else
        Ce(
          "Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.",
        );
      return this;
    }
    raycast(e, t) {
      let n = this.geometry,
        s = this.matrixWorld,
        r = e.params.Line.threshold,
        a = n.drawRange;
      if (
        (n.boundingSphere === null && n.computeBoundingSphere(),
        er.copy(n.boundingSphere),
        er.applyMatrix4(s),
        (er.radius += r),
        e.ray.intersectsSphere(er) === !1)
      )
        return;
      (Wl.copy(s).invert(), es.copy(e.ray).applyMatrix4(Wl));
      let o = r / ((this.scale.x + this.scale.y + this.scale.z) / 3),
        c = o * o,
        l = this.isLineSegments ? 2 : 1,
        u = n.index,
        h = n.attributes.position;
      if (u !== null) {
        let p = Math.max(0, a.start),
          g = Math.min(u.count, a.start + a.count);
        for (let y = p, m = g - 1; y < m; y += l) {
          let f = u.getX(y),
            M = u.getX(y + 1),
            T = tr(this, e, es, c, f, M, y);
          T && t.push(T);
        }
        if (this.isLineLoop) {
          let y = u.getX(g - 1),
            m = u.getX(p),
            f = tr(this, e, es, c, y, m, g - 1);
          f && t.push(f);
        }
      } else {
        let p = Math.max(0, a.start),
          g = Math.min(h.count, a.start + a.count);
        for (let y = p, m = g - 1; y < m; y += l) {
          let f = tr(this, e, es, c, y, y + 1, y);
          f && t.push(f);
        }
        if (this.isLineLoop) {
          let y = tr(this, e, es, c, g - 1, p, g - 1);
          y && t.push(y);
        }
      }
    }
    updateMorphTargets() {
      let t = this.geometry.morphAttributes,
        n = Object.keys(t);
      if (n.length > 0) {
        let s = t[n[0]];
        if (s !== void 0) {
          ((this.morphTargetInfluences = []),
            (this.morphTargetDictionary = {}));
          for (let r = 0, a = s.length; r < a; r++) {
            let o = s[r].name || String(r);
            (this.morphTargetInfluences.push(0),
              (this.morphTargetDictionary[o] = r));
          }
        }
      }
    }
  };
function tr(i, e, t, n, s, r, a) {
  let o = i.geometry.attributes.position;
  if (
    (Tr.fromBufferAttribute(o, s),
    Ar.fromBufferAttribute(o, r),
    t.distanceSqToSegment(Tr, Ar, uo, Xl) > n)
  )
    return;
  uo.applyMatrix4(i.matrixWorld);
  let l = e.ray.origin.distanceTo(uo);
  if (!(l < e.near || l > e.far))
    return {
      distance: l,
      point: Xl.clone().applyMatrix4(i.matrixWorld),
      index: a,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: i,
    };
}
var ql = new U(),
  Yl = new U(),
  li = class extends wr {
    constructor(e, t) {
      (super(e, t), (this.isLineSegments = !0), (this.type = "LineSegments"));
    }
    computeLineDistances() {
      let e = this.geometry;
      if (e.index === null) {
        let t = e.attributes.position,
          n = [];
        for (let s = 0, r = t.count; s < r; s += 2)
          (ql.fromBufferAttribute(t, s),
            Yl.fromBufferAttribute(t, s + 1),
            (n[s] = s === 0 ? 0 : n[s - 1]),
            (n[s + 1] = n[s] + ql.distanceTo(Yl)));
        e.setAttribute("lineDistance", new ot(n, 1));
      } else
        Ce(
          "LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.",
        );
      return this;
    }
  };
var Cn = class extends Nt {
    constructor(e) {
      (super(),
        (this.isPointsMaterial = !0),
        (this.type = "PointsMaterial"),
        (this.color = new Pe(16777215)),
        (this.map = null),
        (this.alphaMap = null),
        (this.size = 1),
        (this.sizeAttenuation = !0),
        (this.fog = !0),
        this.setValues(e));
    }
    copy(e) {
      return (
        super.copy(e),
        this.color.copy(e.color),
        (this.map = e.map),
        (this.alphaMap = e.alphaMap),
        (this.size = e.size),
        (this.sizeAttenuation = e.sizeAttenuation),
        (this.fog = e.fog),
        this
      );
    }
  },
  Zl = new ht(),
  yo = new ai(),
  nr = new Hn(),
  ir = new U(),
  ci = class extends St {
    constructor(e = new At(), t = new Cn()) {
      (super(),
        (this.isPoints = !0),
        (this.type = "Points"),
        (this.geometry = e),
        (this.material = t),
        (this.morphTargetDictionary = void 0),
        (this.morphTargetInfluences = void 0),
        this.updateMorphTargets());
    }
    copy(e, t) {
      return (
        super.copy(e, t),
        (this.material = Array.isArray(e.material)
          ? e.material.slice()
          : e.material),
        (this.geometry = e.geometry),
        this
      );
    }
    raycast(e, t) {
      let n = this.geometry,
        s = this.matrixWorld,
        r = e.params.Points.threshold,
        a = n.drawRange;
      if (
        (n.boundingSphere === null && n.computeBoundingSphere(),
        nr.copy(n.boundingSphere),
        nr.applyMatrix4(s),
        (nr.radius += r),
        e.ray.intersectsSphere(nr) === !1)
      )
        return;
      (Zl.copy(s).invert(), yo.copy(e.ray).applyMatrix4(Zl));
      let o = r / ((this.scale.x + this.scale.y + this.scale.z) / 3),
        c = o * o,
        l = n.index,
        d = n.attributes.position;
      if (l !== null) {
        let h = Math.max(0, a.start),
          p = Math.min(l.count, a.start + a.count);
        for (let g = h, y = p; g < y; g++) {
          let m = l.getX(g);
          (ir.fromBufferAttribute(d, m), Jl(ir, m, c, s, e, t, this));
        }
      } else {
        let h = Math.max(0, a.start),
          p = Math.min(d.count, a.start + a.count);
        for (let g = h, y = p; g < y; g++)
          (ir.fromBufferAttribute(d, g), Jl(ir, g, c, s, e, t, this));
      }
    }
    updateMorphTargets() {
      let t = this.geometry.morphAttributes,
        n = Object.keys(t);
      if (n.length > 0) {
        let s = t[n[0]];
        if (s !== void 0) {
          ((this.morphTargetInfluences = []),
            (this.morphTargetDictionary = {}));
          for (let r = 0, a = s.length; r < a; r++) {
            let o = s[r].name || String(r);
            (this.morphTargetInfluences.push(0),
              (this.morphTargetDictionary[o] = r));
          }
        }
      }
    }
  };
function Jl(i, e, t, n, s, r, a) {
  let o = yo.distanceSqToPoint(i);
  if (o < t) {
    let c = new U();
    (yo.closestPointToPoint(i, c), c.applyMatrix4(n));
    let l = s.ray.origin.distanceTo(c);
    if (l < s.near || l > s.far) return;
    r.push({
      distance: l,
      distanceToRay: Math.sqrt(o),
      point: c,
      index: e,
      face: null,
      faceIndex: null,
      barycoord: null,
      object: a,
    });
  }
}
var us = class extends Ut {
  constructor(e = [], t = Yn, n, s, r, a, o, c, l, u) {
    (super(e, t, n, s, r, a, o, c, l, u),
      (this.isCubeTexture = !0),
      (this.flipY = !1));
  }
  get images() {
    return this.image;
  }
  set images(e) {
    this.image = e;
  }
};
var Rn = class extends Ut {
    constructor(e, t, n = en, s, r, a, o = Mt, c = Mt, l, u = cn, d = 1) {
      if (u !== cn && u !== Jn)
        throw new Error(
          "DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat",
        );
      let h = { width: e, height: t, depth: d };
      (super(h, s, r, a, o, c, u, n, l),
        (this.isDepthTexture = !0),
        (this.flipY = !1),
        (this.generateMipmaps = !1),
        (this.compareFunction = null));
    }
    copy(e) {
      return (
        super.copy(e),
        (this.source = new Ui(Object.assign({}, e.image))),
        (this.compareFunction = e.compareFunction),
        this
      );
    }
    toJSON(e) {
      let t = super.toJSON(e);
      return (
        this.compareFunction !== null &&
          (t.compareFunction = this.compareFunction),
        t
      );
    }
  },
  Cr = class extends Rn {
    constructor(e, t = en, n = Yn, s, r, a = Mt, o = Mt, c, l = cn) {
      let u = { width: e, height: e, depth: 1 },
        d = [u, u, u, u, u, u];
      (super(e, e, t, n, s, r, a, o, c, l),
        (this.image = d),
        (this.isCubeDepthTexture = !0),
        (this.isCubeTexture = !0));
    }
    get images() {
      return this.image;
    }
    set images(e) {
      this.image = e;
    }
  },
  ds = class extends Ut {
    constructor(e = null) {
      (super(), (this.sourceTexture = e), (this.isExternalTexture = !0));
    }
    copy(e) {
      return (super.copy(e), (this.sourceTexture = e.sourceTexture), this);
    }
  },
  Bi = class i extends At {
    constructor(e = 1, t = 1, n = 1, s = 1, r = 1, a = 1) {
      (super(),
        (this.type = "BoxGeometry"),
        (this.parameters = {
          width: e,
          height: t,
          depth: n,
          widthSegments: s,
          heightSegments: r,
          depthSegments: a,
        }));
      let o = this;
      ((s = Math.floor(s)), (r = Math.floor(r)), (a = Math.floor(a)));
      let c = [],
        l = [],
        u = [],
        d = [],
        h = 0,
        p = 0;
      (g("z", "y", "x", -1, -1, n, t, e, a, r, 0),
        g("z", "y", "x", 1, -1, n, t, -e, a, r, 1),
        g("x", "z", "y", 1, 1, e, n, t, s, a, 2),
        g("x", "z", "y", 1, -1, e, n, -t, s, a, 3),
        g("x", "y", "z", 1, -1, e, t, n, s, r, 4),
        g("x", "y", "z", -1, -1, e, t, -n, s, r, 5),
        this.setIndex(c),
        this.setAttribute("position", new ot(l, 3)),
        this.setAttribute("normal", new ot(u, 3)),
        this.setAttribute("uv", new ot(d, 2)));
      function g(y, m, f, M, T, E, w, b, R, x, A) {
        let N = E / R,
          C = w / x,
          O = E / 2,
          X = w / 2,
          W = b / 2,
          D = R + 1,
          V = x + 1,
          k = 0,
          j = 0,
          ee = new U();
        for (let ce = 0; ce < V; ce++) {
          let ye = ce * C - X;
          for (let Me = 0; Me < D; Me++) {
            let We = Me * N - O;
            ((ee[y] = We * M),
              (ee[m] = ye * T),
              (ee[f] = W),
              l.push(ee.x, ee.y, ee.z),
              (ee[y] = 0),
              (ee[m] = 0),
              (ee[f] = b > 0 ? 1 : -1),
              u.push(ee.x, ee.y, ee.z),
              d.push(Me / R),
              d.push(1 - ce / x),
              (k += 1));
          }
        }
        for (let ce = 0; ce < x; ce++)
          for (let ye = 0; ye < R; ye++) {
            let Me = h + ye + D * ce,
              We = h + ye + D * (ce + 1),
              $e = h + (ye + 1) + D * (ce + 1),
              De = h + (ye + 1) + D * ce;
            (c.push(Me, We, De), c.push(We, $e, De), (j += 6));
          }
        (o.addGroup(p, j, A), (p += j), (h += k));
      }
    }
    copy(e) {
      return (
        super.copy(e),
        (this.parameters = Object.assign({}, e.parameters)),
        this
      );
    }
    static fromJSON(e) {
      return new i(
        e.width,
        e.height,
        e.depth,
        e.widthSegments,
        e.heightSegments,
        e.depthSegments,
      );
    }
  };
var hi = class i extends At {
  constructor(e = 1, t = 1, n = 1, s = 1) {
    (super(),
      (this.type = "PlaneGeometry"),
      (this.parameters = {
        width: e,
        height: t,
        widthSegments: n,
        heightSegments: s,
      }));
    let r = e / 2,
      a = t / 2,
      o = Math.floor(n),
      c = Math.floor(s),
      l = o + 1,
      u = c + 1,
      d = e / o,
      h = t / c,
      p = [],
      g = [],
      y = [],
      m = [];
    for (let f = 0; f < u; f++) {
      let M = f * h - a;
      for (let T = 0; T < l; T++) {
        let E = T * d - r;
        (g.push(E, -M, 0), y.push(0, 0, 1), m.push(T / o), m.push(1 - f / c));
      }
    }
    for (let f = 0; f < c; f++)
      for (let M = 0; M < o; M++) {
        let T = M + l * f,
          E = M + l * (f + 1),
          w = M + 1 + l * (f + 1),
          b = M + 1 + l * f;
        (p.push(T, E, b), p.push(E, w, b));
      }
    (this.setIndex(p),
      this.setAttribute("position", new ot(g, 3)),
      this.setAttribute("normal", new ot(y, 3)),
      this.setAttribute("uv", new ot(m, 2)));
  }
  copy(e) {
    return (
      super.copy(e),
      (this.parameters = Object.assign({}, e.parameters)),
      this
    );
  }
  static fromJSON(e) {
    return new i(e.width, e.height, e.widthSegments, e.heightSegments);
  }
};
var fs = class i extends At {
  constructor(
    e = 1,
    t = 32,
    n = 16,
    s = 0,
    r = Math.PI * 2,
    a = 0,
    o = Math.PI,
  ) {
    (super(),
      (this.type = "SphereGeometry"),
      (this.parameters = {
        radius: e,
        widthSegments: t,
        heightSegments: n,
        phiStart: s,
        phiLength: r,
        thetaStart: a,
        thetaLength: o,
      }),
      (t = Math.max(3, Math.floor(t))),
      (n = Math.max(2, Math.floor(n))));
    let c = Math.min(a + o, Math.PI),
      l = 0,
      u = [],
      d = new U(),
      h = new U(),
      p = [],
      g = [],
      y = [],
      m = [];
    for (let f = 0; f <= n; f++) {
      let M = [],
        T = f / n,
        E = 0;
      f === 0 && a === 0
        ? (E = 0.5 / t)
        : f === n && c === Math.PI && (E = -0.5 / t);
      for (let w = 0; w <= t; w++) {
        let b = w / t;
        ((d.x = -e * Math.cos(s + b * r) * Math.sin(a + T * o)),
          (d.y = e * Math.cos(a + T * o)),
          (d.z = e * Math.sin(s + b * r) * Math.sin(a + T * o)),
          g.push(d.x, d.y, d.z),
          h.copy(d).normalize(),
          y.push(h.x, h.y, h.z),
          m.push(b + E, 1 - T),
          M.push(l++));
      }
      u.push(M);
    }
    for (let f = 0; f < n; f++)
      for (let M = 0; M < t; M++) {
        let T = u[f][M + 1],
          E = u[f][M],
          w = u[f + 1][M],
          b = u[f + 1][M + 1];
        ((f !== 0 || a > 0) && p.push(T, E, b),
          (f !== n - 1 || c < Math.PI) && p.push(E, w, b));
      }
    (this.setIndex(p),
      this.setAttribute("position", new ot(g, 3)),
      this.setAttribute("normal", new ot(y, 3)),
      this.setAttribute("uv", new ot(m, 2)));
  }
  copy(e) {
    return (
      super.copy(e),
      (this.parameters = Object.assign({}, e.parameters)),
      this
    );
  }
  static fromJSON(e) {
    return new i(
      e.radius,
      e.widthSegments,
      e.heightSegments,
      e.phiStart,
      e.phiLength,
      e.thetaStart,
      e.thetaLength,
    );
  }
};
function fi(i) {
  let e = {};
  for (let t in i) {
    e[t] = {};
    for (let n in i[t]) {
      let s = i[t][n];
      if ($l(s))
        s.isRenderTargetTexture
          ? (Ce(
              "UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms().",
            ),
            (e[t][n] = null))
          : (e[t][n] = s.clone());
      else if (Array.isArray(s))
        if ($l(s[0])) {
          let r = [];
          for (let a = 0, o = s.length; a < o; a++) r[a] = s[a].clone();
          e[t][n] = r;
        } else e[t][n] = s.slice();
      else e[t][n] = s;
    }
  }
  return e;
}
function Pt(i) {
  let e = {};
  for (let t = 0; t < i.length; t++) {
    let n = fi(i[t]);
    for (let s in n) e[s] = n[s];
  }
  return e;
}
function $l(i) {
  return (
    i &&
    (i.isColor ||
      i.isMatrix3 ||
      i.isMatrix4 ||
      i.isVector2 ||
      i.isVector3 ||
      i.isVector4 ||
      i.isTexture ||
      i.isQuaternion)
  );
}
function pu(i) {
  let e = [];
  for (let t = 0; t < i.length; t++) e.push(i[t].clone());
  return e;
}
function $o(i) {
  let e = i.getRenderTarget();
  return e === null
    ? i.outputColorSpace
    : e.isXRRenderTarget === !0
      ? e.texture.colorSpace
      : Xe.workingColorSpace;
}
var Vc = { clone: fi, merge: Pt },
  mu = `void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,
  gu = `void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,
  Gt = class extends Nt {
    constructor(e) {
      (super(),
        (this.isShaderMaterial = !0),
        (this.type = "ShaderMaterial"),
        (this.defines = {}),
        (this.uniforms = {}),
        (this.uniformsGroups = []),
        (this.vertexShader = mu),
        (this.fragmentShader = gu),
        (this.linewidth = 1),
        (this.wireframe = !1),
        (this.wireframeLinewidth = 1),
        (this.fog = !1),
        (this.lights = !1),
        (this.clipping = !1),
        (this.forceSinglePass = !0),
        (this.extensions = { clipCullDistance: !1, multiDraw: !1 }),
        (this.defaultAttributeValues = {
          color: [1, 1, 1],
          uv: [0, 0],
          uv1: [0, 0],
        }),
        (this.index0AttributeName = void 0),
        (this.uniformsNeedUpdate = !1),
        (this.glslVersion = null),
        e !== void 0 && this.setValues(e));
    }
    copy(e) {
      return (
        super.copy(e),
        (this.fragmentShader = e.fragmentShader),
        (this.vertexShader = e.vertexShader),
        (this.uniforms = fi(e.uniforms)),
        (this.uniformsGroups = pu(e.uniformsGroups)),
        (this.defines = Object.assign({}, e.defines)),
        (this.wireframe = e.wireframe),
        (this.wireframeLinewidth = e.wireframeLinewidth),
        (this.fog = e.fog),
        (this.lights = e.lights),
        (this.clipping = e.clipping),
        (this.extensions = Object.assign({}, e.extensions)),
        (this.glslVersion = e.glslVersion),
        (this.defaultAttributeValues = Object.assign(
          {},
          e.defaultAttributeValues,
        )),
        (this.index0AttributeName = e.index0AttributeName),
        (this.uniformsNeedUpdate = e.uniformsNeedUpdate),
        this
      );
    }
    toJSON(e) {
      let t = super.toJSON(e);
      ((t.glslVersion = this.glslVersion), (t.uniforms = {}));
      for (let s in this.uniforms) {
        let a = this.uniforms[s].value;
        a && a.isTexture
          ? (t.uniforms[s] = { type: "t", value: a.toJSON(e).uuid })
          : a && a.isColor
            ? (t.uniforms[s] = { type: "c", value: a.getHex() })
            : a && a.isVector2
              ? (t.uniforms[s] = { type: "v2", value: a.toArray() })
              : a && a.isVector3
                ? (t.uniforms[s] = { type: "v3", value: a.toArray() })
                : a && a.isVector4
                  ? (t.uniforms[s] = { type: "v4", value: a.toArray() })
                  : a && a.isMatrix3
                    ? (t.uniforms[s] = { type: "m3", value: a.toArray() })
                    : a && a.isMatrix4
                      ? (t.uniforms[s] = { type: "m4", value: a.toArray() })
                      : (t.uniforms[s] = { value: a });
      }
      (Object.keys(this.defines).length > 0 && (t.defines = this.defines),
        (t.vertexShader = this.vertexShader),
        (t.fragmentShader = this.fragmentShader),
        (t.lights = this.lights),
        (t.clipping = this.clipping));
      let n = {};
      for (let s in this.extensions) this.extensions[s] === !0 && (n[s] = !0);
      return (Object.keys(n).length > 0 && (t.extensions = n), t);
    }
  },
  Rr = class extends Gt {
    constructor(e) {
      (super(e),
        (this.isRawShaderMaterial = !0),
        (this.type = "RawShaderMaterial"));
    }
  },
  zi = class extends Nt {
    constructor(e) {
      (super(),
        (this.isMeshStandardMaterial = !0),
        (this.type = "MeshStandardMaterial"),
        (this.defines = { STANDARD: "" }),
        (this.color = new Pe(16777215)),
        (this.roughness = 1),
        (this.metalness = 0),
        (this.map = null),
        (this.lightMap = null),
        (this.lightMapIntensity = 1),
        (this.aoMap = null),
        (this.aoMapIntensity = 1),
        (this.emissive = new Pe(0)),
        (this.emissiveIntensity = 1),
        (this.emissiveMap = null),
        (this.bumpMap = null),
        (this.bumpScale = 1),
        (this.normalMap = null),
        (this.normalMapType = Ps),
        (this.normalScale = new Ye(1, 1)),
        (this.displacementMap = null),
        (this.displacementScale = 1),
        (this.displacementBias = 0),
        (this.roughnessMap = null),
        (this.metalnessMap = null),
        (this.alphaMap = null),
        (this.envMap = null),
        (this.envMapRotation = new dn()),
        (this.envMapIntensity = 1),
        (this.wireframe = !1),
        (this.wireframeLinewidth = 1),
        (this.wireframeLinecap = "round"),
        (this.wireframeLinejoin = "round"),
        (this.flatShading = !1),
        (this.fog = !0),
        this.setValues(e));
    }
    copy(e) {
      return (
        super.copy(e),
        (this.defines = { STANDARD: "" }),
        this.color.copy(e.color),
        (this.roughness = e.roughness),
        (this.metalness = e.metalness),
        (this.map = e.map),
        (this.lightMap = e.lightMap),
        (this.lightMapIntensity = e.lightMapIntensity),
        (this.aoMap = e.aoMap),
        (this.aoMapIntensity = e.aoMapIntensity),
        this.emissive.copy(e.emissive),
        (this.emissiveMap = e.emissiveMap),
        (this.emissiveIntensity = e.emissiveIntensity),
        (this.bumpMap = e.bumpMap),
        (this.bumpScale = e.bumpScale),
        (this.normalMap = e.normalMap),
        (this.normalMapType = e.normalMapType),
        this.normalScale.copy(e.normalScale),
        (this.displacementMap = e.displacementMap),
        (this.displacementScale = e.displacementScale),
        (this.displacementBias = e.displacementBias),
        (this.roughnessMap = e.roughnessMap),
        (this.metalnessMap = e.metalnessMap),
        (this.alphaMap = e.alphaMap),
        (this.envMap = e.envMap),
        this.envMapRotation.copy(e.envMapRotation),
        (this.envMapIntensity = e.envMapIntensity),
        (this.wireframe = e.wireframe),
        (this.wireframeLinewidth = e.wireframeLinewidth),
        (this.wireframeLinecap = e.wireframeLinecap),
        (this.wireframeLinejoin = e.wireframeLinejoin),
        (this.flatShading = e.flatShading),
        (this.fog = e.fog),
        this
      );
    }
  };
var ps = class extends Nt {
  constructor(e) {
    (super(),
      (this.isMeshPhongMaterial = !0),
      (this.type = "MeshPhongMaterial"),
      (this.color = new Pe(16777215)),
      (this.specular = new Pe(1118481)),
      (this.shininess = 30),
      (this.map = null),
      (this.lightMap = null),
      (this.lightMapIntensity = 1),
      (this.aoMap = null),
      (this.aoMapIntensity = 1),
      (this.emissive = new Pe(0)),
      (this.emissiveIntensity = 1),
      (this.emissiveMap = null),
      (this.bumpMap = null),
      (this.bumpScale = 1),
      (this.normalMap = null),
      (this.normalMapType = Ps),
      (this.normalScale = new Ye(1, 1)),
      (this.displacementMap = null),
      (this.displacementScale = 1),
      (this.displacementBias = 0),
      (this.specularMap = null),
      (this.alphaMap = null),
      (this.envMap = null),
      (this.envMapRotation = new dn()),
      (this.combine = Hr),
      (this.reflectivity = 1),
      (this.envMapIntensity = 1),
      (this.refractionRatio = 0.98),
      (this.wireframe = !1),
      (this.wireframeLinewidth = 1),
      (this.wireframeLinecap = "round"),
      (this.wireframeLinejoin = "round"),
      (this.flatShading = !1),
      (this.fog = !0),
      this.setValues(e));
  }
  copy(e) {
    return (
      super.copy(e),
      this.color.copy(e.color),
      this.specular.copy(e.specular),
      (this.shininess = e.shininess),
      (this.map = e.map),
      (this.lightMap = e.lightMap),
      (this.lightMapIntensity = e.lightMapIntensity),
      (this.aoMap = e.aoMap),
      (this.aoMapIntensity = e.aoMapIntensity),
      this.emissive.copy(e.emissive),
      (this.emissiveMap = e.emissiveMap),
      (this.emissiveIntensity = e.emissiveIntensity),
      (this.bumpMap = e.bumpMap),
      (this.bumpScale = e.bumpScale),
      (this.normalMap = e.normalMap),
      (this.normalMapType = e.normalMapType),
      this.normalScale.copy(e.normalScale),
      (this.displacementMap = e.displacementMap),
      (this.displacementScale = e.displacementScale),
      (this.displacementBias = e.displacementBias),
      (this.specularMap = e.specularMap),
      (this.alphaMap = e.alphaMap),
      (this.envMap = e.envMap),
      this.envMapRotation.copy(e.envMapRotation),
      (this.combine = e.combine),
      (this.reflectivity = e.reflectivity),
      (this.envMapIntensity = e.envMapIntensity),
      (this.refractionRatio = e.refractionRatio),
      (this.wireframe = e.wireframe),
      (this.wireframeLinewidth = e.wireframeLinewidth),
      (this.wireframeLinecap = e.wireframeLinecap),
      (this.wireframeLinejoin = e.wireframeLinejoin),
      (this.flatShading = e.flatShading),
      (this.fog = e.fog),
      this
    );
  }
};
var Vi = class extends Nt {
    constructor(e) {
      (super(),
        (this.isMeshDepthMaterial = !0),
        (this.type = "MeshDepthMaterial"),
        (this.depthPacking = Ra),
        (this.map = null),
        (this.alphaMap = null),
        (this.displacementMap = null),
        (this.displacementScale = 1),
        (this.displacementBias = 0),
        (this.wireframe = !1),
        (this.wireframeLinewidth = 1),
        this.setValues(e));
    }
    copy(e) {
      return (
        super.copy(e),
        (this.depthPacking = e.depthPacking),
        (this.map = e.map),
        (this.alphaMap = e.alphaMap),
        (this.displacementMap = e.displacementMap),
        (this.displacementScale = e.displacementScale),
        (this.displacementBias = e.displacementBias),
        (this.wireframe = e.wireframe),
        (this.wireframeLinewidth = e.wireframeLinewidth),
        this
      );
    }
  },
  Ir = class extends Nt {
    constructor(e) {
      (super(),
        (this.isMeshDistanceMaterial = !0),
        (this.type = "MeshDistanceMaterial"),
        (this.map = null),
        (this.alphaMap = null),
        (this.displacementMap = null),
        (this.displacementScale = 1),
        (this.displacementBias = 0),
        this.setValues(e));
    }
    copy(e) {
      return (
        super.copy(e),
        (this.map = e.map),
        (this.alphaMap = e.alphaMap),
        (this.displacementMap = e.displacementMap),
        (this.displacementScale = e.displacementScale),
        (this.displacementBias = e.displacementBias),
        this
      );
    }
  };
function sr(i, e) {
  return !i || i.constructor === e
    ? i
    : typeof e.BYTES_PER_ELEMENT == "number"
      ? new e(i)
      : Array.prototype.slice.call(i);
}
var Wn = class {
    constructor(e, t, n, s) {
      ((this.parameterPositions = e),
        (this._cachedIndex = 0),
        (this.resultBuffer = s !== void 0 ? s : new t.constructor(n)),
        (this.sampleValues = t),
        (this.valueSize = n),
        (this.settings = null),
        (this.DefaultSettings_ = {}));
    }
    evaluate(e) {
      let t = this.parameterPositions,
        n = this._cachedIndex,
        s = t[n],
        r = t[n - 1];
      n: {
        e: {
          let a;
          t: {
            i: if (!(e < s)) {
              for (let o = n + 2; ; ) {
                if (s === void 0) {
                  if (e < r) break i;
                  return (
                    (n = t.length),
                    (this._cachedIndex = n),
                    this.copySampleValue_(n - 1)
                  );
                }
                if (n === o) break;
                if (((r = s), (s = t[++n]), e < s)) break e;
              }
              a = t.length;
              break t;
            }
            if (!(e >= r)) {
              let o = t[1];
              e < o && ((n = 2), (r = o));
              for (let c = n - 2; ; ) {
                if (r === void 0)
                  return ((this._cachedIndex = 0), this.copySampleValue_(0));
                if (n === c) break;
                if (((s = r), (r = t[--n - 1]), e >= r)) break e;
              }
              ((a = n), (n = 0));
              break t;
            }
            break n;
          }
          for (; n < a; ) {
            let o = (n + a) >>> 1;
            e < t[o] ? (a = o) : (n = o + 1);
          }
          if (((s = t[n]), (r = t[n - 1]), r === void 0))
            return ((this._cachedIndex = 0), this.copySampleValue_(0));
          if (s === void 0)
            return (
              (n = t.length),
              (this._cachedIndex = n),
              this.copySampleValue_(n - 1)
            );
        }
        ((this._cachedIndex = n), this.intervalChanged_(n, r, s));
      }
      return this.interpolate_(n, r, e, s);
    }
    getSettings_() {
      return this.settings || this.DefaultSettings_;
    }
    copySampleValue_(e) {
      let t = this.resultBuffer,
        n = this.sampleValues,
        s = this.valueSize,
        r = e * s;
      for (let a = 0; a !== s; ++a) t[a] = n[r + a];
      return t;
    }
    interpolate_() {
      throw new Error("call to abstract method");
    }
    intervalChanged_() {}
  },
  Pr = class extends Wn {
    constructor(e, t, n, s) {
      (super(e, t, n, s),
        (this._weightPrev = -0),
        (this._offsetPrev = -0),
        (this._weightNext = -0),
        (this._offsetNext = -0),
        (this.DefaultSettings_ = { endingStart: mo, endingEnd: mo }));
    }
    intervalChanged_(e, t, n) {
      let s = this.parameterPositions,
        r = e - 2,
        a = e + 1,
        o = s[r],
        c = s[a];
      if (o === void 0)
        switch (this.getSettings_().endingStart) {
          case go:
            ((r = e), (o = 2 * t - n));
            break;
          case _o:
            ((r = s.length - 2), (o = t + s[r] - s[r + 1]));
            break;
          default:
            ((r = e), (o = n));
        }
      if (c === void 0)
        switch (this.getSettings_().endingEnd) {
          case go:
            ((a = e), (c = 2 * n - t));
            break;
          case _o:
            ((a = 1), (c = n + s[1] - s[0]));
            break;
          default:
            ((a = e - 1), (c = t));
        }
      let l = (n - t) * 0.5,
        u = this.valueSize;
      ((this._weightPrev = l / (t - o)),
        (this._weightNext = l / (c - n)),
        (this._offsetPrev = r * u),
        (this._offsetNext = a * u));
    }
    interpolate_(e, t, n, s) {
      let r = this.resultBuffer,
        a = this.sampleValues,
        o = this.valueSize,
        c = e * o,
        l = c - o,
        u = this._offsetPrev,
        d = this._offsetNext,
        h = this._weightPrev,
        p = this._weightNext,
        g = (n - t) / (s - t),
        y = g * g,
        m = y * g,
        f = -h * m + 2 * h * y - h * g,
        M = (1 + h) * m + (-1.5 - 2 * h) * y + (-0.5 + h) * g + 1,
        T = (-1 - p) * m + (1.5 + p) * y + 0.5 * g,
        E = p * m - p * y;
      for (let w = 0; w !== o; ++w)
        r[w] = f * a[u + w] + M * a[l + w] + T * a[c + w] + E * a[d + w];
      return r;
    }
  },
  Lr = class extends Wn {
    constructor(e, t, n, s) {
      super(e, t, n, s);
    }
    interpolate_(e, t, n, s) {
      let r = this.resultBuffer,
        a = this.sampleValues,
        o = this.valueSize,
        c = e * o,
        l = c - o,
        u = (n - t) / (s - t),
        d = 1 - u;
      for (let h = 0; h !== o; ++h) r[h] = a[l + h] * d + a[c + h] * u;
      return r;
    }
  },
  Dr = class extends Wn {
    constructor(e, t, n, s) {
      super(e, t, n, s);
    }
    interpolate_(e) {
      return this.copySampleValue_(e - 1);
    }
  },
  Ur = class extends Wn {
    interpolate_(e, t, n, s) {
      let r = this.resultBuffer,
        a = this.sampleValues,
        o = this.valueSize,
        c = e * o,
        l = c - o,
        u = this.settings || this.DefaultSettings_,
        d = u.inTangents,
        h = u.outTangents;
      if (!d || !h) {
        let y = (n - t) / (s - t),
          m = 1 - y;
        for (let f = 0; f !== o; ++f) r[f] = a[l + f] * m + a[c + f] * y;
        return r;
      }
      let p = o * 2,
        g = e - 1;
      for (let y = 0; y !== o; ++y) {
        let m = a[l + y],
          f = a[c + y],
          M = g * p + y * 2,
          T = h[M],
          E = h[M + 1],
          w = e * p + y * 2,
          b = d[w],
          R = d[w + 1],
          x = (n - t) / (s - t),
          A,
          N,
          C,
          O,
          X;
        for (let W = 0; W < 8; W++) {
          ((A = x * x), (N = A * x), (C = 1 - x), (O = C * C), (X = O * C));
          let V = X * t + 3 * O * x * T + 3 * C * A * b + N * s - n;
          if (Math.abs(V) < 1e-10) break;
          let k = 3 * O * (T - t) + 6 * C * x * (b - T) + 3 * A * (s - b);
          if (Math.abs(k) < 1e-10) break;
          ((x = x - V / k), (x = Math.max(0, Math.min(1, x))));
        }
        r[y] = X * m + 3 * O * x * E + 3 * C * A * R + N * f;
      }
      return r;
    }
  },
  Ht = class {
    constructor(e, t, n, s) {
      if (e === void 0)
        throw new Error("THREE.KeyframeTrack: track name is undefined");
      if (t === void 0 || t.length === 0)
        throw new Error(
          "THREE.KeyframeTrack: no keyframes in track named " + e,
        );
      ((this.name = e),
        (this.times = sr(t, this.TimeBufferType)),
        (this.values = sr(n, this.ValueBufferType)),
        this.setInterpolation(s || this.DefaultInterpolation));
    }
    static toJSON(e) {
      let t = e.constructor,
        n;
      if (t.toJSON !== this.toJSON) n = t.toJSON(e);
      else {
        n = {
          name: e.name,
          times: sr(e.times, Array),
          values: sr(e.values, Array),
        };
        let s = e.getInterpolation();
        s !== e.DefaultInterpolation && (n.interpolation = s);
      }
      return ((n.type = e.ValueTypeName), n);
    }
    InterpolantFactoryMethodDiscrete(e) {
      return new Dr(this.times, this.values, this.getValueSize(), e);
    }
    InterpolantFactoryMethodLinear(e) {
      return new Lr(this.times, this.values, this.getValueSize(), e);
    }
    InterpolantFactoryMethodSmooth(e) {
      return new Pr(this.times, this.values, this.getValueSize(), e);
    }
    InterpolantFactoryMethodBezier(e) {
      let t = new Ur(this.times, this.values, this.getValueSize(), e);
      return (this.settings && (t.settings = this.settings), t);
    }
    setInterpolation(e) {
      let t;
      switch (e) {
        case is:
          t = this.InterpolantFactoryMethodDiscrete;
          break;
        case vr:
          t = this.InterpolantFactoryMethodLinear;
          break;
        case or:
          t = this.InterpolantFactoryMethodSmooth;
          break;
        case po:
          t = this.InterpolantFactoryMethodBezier;
          break;
      }
      if (t === void 0) {
        let n =
          "unsupported interpolation for " +
          this.ValueTypeName +
          " keyframe track named " +
          this.name;
        if (this.createInterpolant === void 0)
          if (e !== this.DefaultInterpolation)
            this.setInterpolation(this.DefaultInterpolation);
          else throw new Error(n);
        return (Ce("KeyframeTrack:", n), this);
      }
      return ((this.createInterpolant = t), this);
    }
    getInterpolation() {
      switch (this.createInterpolant) {
        case this.InterpolantFactoryMethodDiscrete:
          return is;
        case this.InterpolantFactoryMethodLinear:
          return vr;
        case this.InterpolantFactoryMethodSmooth:
          return or;
        case this.InterpolantFactoryMethodBezier:
          return po;
      }
    }
    getValueSize() {
      return this.values.length / this.times.length;
    }
    shift(e) {
      if (e !== 0) {
        let t = this.times;
        for (let n = 0, s = t.length; n !== s; ++n) t[n] += e;
      }
      return this;
    }
    scale(e) {
      if (e !== 1) {
        let t = this.times;
        for (let n = 0, s = t.length; n !== s; ++n) t[n] *= e;
      }
      return this;
    }
    trim(e, t) {
      let n = this.times,
        s = n.length,
        r = 0,
        a = s - 1;
      for (; r !== s && n[r] < e; ) ++r;
      for (; a !== -1 && n[a] > t; ) --a;
      if ((++a, r !== 0 || a !== s)) {
        r >= a && ((a = Math.max(a, 1)), (r = a - 1));
        let o = this.getValueSize();
        ((this.times = n.slice(r, a)),
          (this.values = this.values.slice(r * o, a * o)));
      }
      return this;
    }
    validate() {
      let e = !0,
        t = this.getValueSize();
      t - Math.floor(t) !== 0 &&
        (Ie("KeyframeTrack: Invalid value size in track.", this), (e = !1));
      let n = this.times,
        s = this.values,
        r = n.length;
      r === 0 && (Ie("KeyframeTrack: Track is empty.", this), (e = !1));
      let a = null;
      for (let o = 0; o !== r; o++) {
        let c = n[o];
        if (typeof c == "number" && isNaN(c)) {
          (Ie("KeyframeTrack: Time is not a valid number.", this, o, c),
            (e = !1));
          break;
        }
        if (a !== null && a > c) {
          (Ie("KeyframeTrack: Out of order keys.", this, o, c, a), (e = !1));
          break;
        }
        a = c;
      }
      if (s !== void 0 && Dh(s))
        for (let o = 0, c = s.length; o !== c; ++o) {
          let l = s[o];
          if (isNaN(l)) {
            (Ie("KeyframeTrack: Value is not a valid number.", this, o, l),
              (e = !1));
            break;
          }
        }
      return e;
    }
    optimize() {
      let e = this.times.slice(),
        t = this.values.slice(),
        n = this.getValueSize(),
        s = this.getInterpolation() === or,
        r = e.length - 1,
        a = 1;
      for (let o = 1; o < r; ++o) {
        let c = !1,
          l = e[o],
          u = e[o + 1];
        if (l !== u && (o !== 1 || l !== e[0]))
          if (s) c = !0;
          else {
            let d = o * n,
              h = d - n,
              p = d + n;
            for (let g = 0; g !== n; ++g) {
              let y = t[d + g];
              if (y !== t[h + g] || y !== t[p + g]) {
                c = !0;
                break;
              }
            }
          }
        if (c) {
          if (o !== a) {
            e[a] = e[o];
            let d = o * n,
              h = a * n;
            for (let p = 0; p !== n; ++p) t[h + p] = t[d + p];
          }
          ++a;
        }
      }
      if (r > 0) {
        e[a] = e[r];
        for (let o = r * n, c = a * n, l = 0; l !== n; ++l) t[c + l] = t[o + l];
        ++a;
      }
      return (
        a !== e.length
          ? ((this.times = e.slice(0, a)), (this.values = t.slice(0, a * n)))
          : ((this.times = e), (this.values = t)),
        this
      );
    }
    clone() {
      let e = this.times.slice(),
        t = this.values.slice(),
        n = this.constructor,
        s = new n(this.name, e, t);
      return ((s.createInterpolant = this.createInterpolant), s);
    }
  };
Ht.prototype.ValueTypeName = "";
Ht.prototype.TimeBufferType = Float32Array;
Ht.prototype.ValueBufferType = Float32Array;
Ht.prototype.DefaultInterpolation = vr;
var Xn = class extends Ht {
  constructor(e, t, n) {
    super(e, t, n);
  }
};
Xn.prototype.ValueTypeName = "bool";
Xn.prototype.ValueBufferType = Array;
Xn.prototype.DefaultInterpolation = is;
Xn.prototype.InterpolantFactoryMethodLinear = void 0;
Xn.prototype.InterpolantFactoryMethodSmooth = void 0;
var Nr = class extends Ht {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
};
Nr.prototype.ValueTypeName = "color";
var Fr = class extends Ht {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
};
Fr.prototype.ValueTypeName = "number";
var Or = class extends Wn {
    constructor(e, t, n, s) {
      super(e, t, n, s);
    }
    interpolate_(e, t, n, s) {
      let r = this.resultBuffer,
        a = this.sampleValues,
        o = this.valueSize,
        c = (n - t) / (s - t),
        l = e * o;
      for (let u = l + o; l !== u; l += 4)
        un.slerpFlat(r, 0, a, l - o, a, l, c);
      return r;
    }
  },
  ms = class extends Ht {
    constructor(e, t, n, s) {
      super(e, t, n, s);
    }
    InterpolantFactoryMethodLinear(e) {
      return new Or(this.times, this.values, this.getValueSize(), e);
    }
  };
ms.prototype.ValueTypeName = "quaternion";
ms.prototype.InterpolantFactoryMethodSmooth = void 0;
var qn = class extends Ht {
  constructor(e, t, n) {
    super(e, t, n);
  }
};
qn.prototype.ValueTypeName = "string";
qn.prototype.ValueBufferType = Array;
qn.prototype.DefaultInterpolation = is;
qn.prototype.InterpolantFactoryMethodLinear = void 0;
qn.prototype.InterpolantFactoryMethodSmooth = void 0;
var Br = class extends Ht {
  constructor(e, t, n, s) {
    super(e, t, n, s);
  }
};
Br.prototype.ValueTypeName = "vector";
var Mo = {
  enabled: !1,
  files: {},
  add: function (i, e) {
    this.enabled !== !1 && (Kl(i) || (this.files[i] = e));
  },
  get: function (i) {
    if (this.enabled !== !1 && !Kl(i)) return this.files[i];
  },
  remove: function (i) {
    delete this.files[i];
  },
  clear: function () {
    this.files = {};
  },
};
function Kl(i) {
  try {
    let e = i.slice(i.indexOf(":") + 1);
    return new URL(e).protocol === "blob:";
  } catch {
    return !1;
  }
}
var zr = class {
    constructor(e, t, n) {
      let s = this,
        r = !1,
        a = 0,
        o = 0,
        c,
        l = [];
      ((this.onStart = void 0),
        (this.onLoad = e),
        (this.onProgress = t),
        (this.onError = n),
        (this._abortController = null),
        (this.itemStart = function (u) {
          (o++,
            r === !1 && s.onStart !== void 0 && s.onStart(u, a, o),
            (r = !0));
        }),
        (this.itemEnd = function (u) {
          (a++,
            s.onProgress !== void 0 && s.onProgress(u, a, o),
            a === o && ((r = !1), s.onLoad !== void 0 && s.onLoad()));
        }),
        (this.itemError = function (u) {
          s.onError !== void 0 && s.onError(u);
        }),
        (this.resolveURL = function (u) {
          return c ? c(u) : u;
        }),
        (this.setURLModifier = function (u) {
          return ((c = u), this);
        }),
        (this.addHandler = function (u, d) {
          return (l.push(u, d), this);
        }),
        (this.removeHandler = function (u) {
          let d = l.indexOf(u);
          return (d !== -1 && l.splice(d, 2), this);
        }),
        (this.getHandler = function (u) {
          for (let d = 0, h = l.length; d < h; d += 2) {
            let p = l[d],
              g = l[d + 1];
            if ((p.global && (p.lastIndex = 0), p.test(u))) return g;
          }
          return null;
        }),
        (this.abort = function () {
          return (
            this.abortController.abort(),
            (this._abortController = null),
            this
          );
        }));
    }
    get abortController() {
      return (
        this._abortController ||
          (this._abortController = new AbortController()),
        this._abortController
      );
    }
  },
  kc = new zr(),
  ui = class {
    constructor(e) {
      ((this.manager = e !== void 0 ? e : kc),
        (this.crossOrigin = "anonymous"),
        (this.withCredentials = !1),
        (this.path = ""),
        (this.resourcePath = ""),
        (this.requestHeader = {}),
        typeof __THREE_DEVTOOLS__ < "u" &&
          __THREE_DEVTOOLS__.dispatchEvent(
            new CustomEvent("observe", { detail: this }),
          ));
    }
    load() {}
    loadAsync(e, t) {
      let n = this;
      return new Promise(function (s, r) {
        n.load(e, s, t, r);
      });
    }
    parse() {}
    setCrossOrigin(e) {
      return ((this.crossOrigin = e), this);
    }
    setWithCredentials(e) {
      return ((this.withCredentials = e), this);
    }
    setPath(e) {
      return ((this.path = e), this);
    }
    setResourcePath(e) {
      return ((this.resourcePath = e), this);
    }
    setRequestHeader(e) {
      return ((this.requestHeader = e), this);
    }
    abort() {
      return this;
    }
  };
ui.DEFAULT_MATERIAL_NAME = "__DEFAULT";
var En = {},
  So = class extends Error {
    constructor(e, t) {
      (super(e), (this.response = t));
    }
  },
  gs = class extends ui {
    constructor(e) {
      (super(e),
        (this.mimeType = ""),
        (this.responseType = ""),
        (this._abortController = new AbortController()));
    }
    load(e, t, n, s) {
      (e === void 0 && (e = ""),
        this.path !== void 0 && (e = this.path + e),
        (e = this.manager.resolveURL(e)));
      let r = Mo.get(`file:${e}`);
      if (r !== void 0) {
        (this.manager.itemStart(e),
          setTimeout(() => {
            (t && t(r), this.manager.itemEnd(e));
          }, 0));
        return;
      }
      if (En[e] !== void 0) {
        En[e].push({ onLoad: t, onProgress: n, onError: s });
        return;
      }
      ((En[e] = []), En[e].push({ onLoad: t, onProgress: n, onError: s }));
      let a = new Request(e, {
          headers: new Headers(this.requestHeader),
          credentials: this.withCredentials ? "include" : "same-origin",
          signal:
            typeof AbortSignal.any == "function"
              ? AbortSignal.any([
                  this._abortController.signal,
                  this.manager.abortController.signal,
                ])
              : this._abortController.signal,
        }),
        o = this.mimeType,
        c = this.responseType;
      (fetch(a)
        .then((l) => {
          if (l.status === 200 || l.status === 0) {
            if (
              (l.status === 0 && Ce("FileLoader: HTTP Status 0 received."),
              typeof ReadableStream > "u" ||
                l.body === void 0 ||
                l.body.getReader === void 0)
            )
              return l;
            let u = En[e],
              d = l.body.getReader(),
              h =
                l.headers.get("X-File-Size") || l.headers.get("Content-Length"),
              p = h ? parseInt(h) : 0,
              g = p !== 0,
              y = 0,
              m = new ReadableStream({
                start(f) {
                  M();
                  function M() {
                    d.read().then(
                      ({ done: T, value: E }) => {
                        if (T) f.close();
                        else {
                          y += E.byteLength;
                          let w = new ProgressEvent("progress", {
                            lengthComputable: g,
                            loaded: y,
                            total: p,
                          });
                          for (let b = 0, R = u.length; b < R; b++) {
                            let x = u[b];
                            x.onProgress && x.onProgress(w);
                          }
                          (f.enqueue(E), M());
                        }
                      },
                      (T) => {
                        f.error(T);
                      },
                    );
                  }
                },
              });
            return new Response(m);
          } else
            throw new So(
              `fetch for "${l.url}" responded with ${l.status}: ${l.statusText}`,
              l,
            );
        })
        .then((l) => {
          switch (c) {
            case "arraybuffer":
              return l.arrayBuffer();
            case "blob":
              return l.blob();
            case "document":
              return l
                .text()
                .then((u) => new DOMParser().parseFromString(u, o));
            case "json":
              return l.json();
            default:
              if (o === "") return l.text();
              {
                let d = /charset="?([^;"\s]*)"?/i.exec(o),
                  h = d && d[1] ? d[1].toLowerCase() : void 0,
                  p = new TextDecoder(h);
                return l.arrayBuffer().then((g) => p.decode(g));
              }
          }
        })
        .then((l) => {
          Mo.add(`file:${e}`, l);
          let u = En[e];
          delete En[e];
          for (let d = 0, h = u.length; d < h; d++) {
            let p = u[d];
            p.onLoad && p.onLoad(l);
          }
        })
        .catch((l) => {
          let u = En[e];
          if (u === void 0) throw (this.manager.itemError(e), l);
          delete En[e];
          for (let d = 0, h = u.length; d < h; d++) {
            let p = u[d];
            p.onError && p.onError(l);
          }
          this.manager.itemError(e);
        })
        .finally(() => {
          this.manager.itemEnd(e);
        }),
        this.manager.itemStart(e));
    }
    setResponseType(e) {
      return ((this.responseType = e), this);
    }
    setMimeType(e) {
      return ((this.mimeType = e), this);
    }
    abort() {
      return (
        this._abortController.abort(),
        (this._abortController = new AbortController()),
        this
      );
    }
  };
var _s = class extends St {
    constructor(e, t = 1) {
      (super(),
        (this.isLight = !0),
        (this.type = "Light"),
        (this.color = new Pe(e)),
        (this.intensity = t));
    }
    dispose() {
      this.dispatchEvent({ type: "dispose" });
    }
    copy(e, t) {
      return (
        super.copy(e, t),
        this.color.copy(e.color),
        (this.intensity = e.intensity),
        this
      );
    }
    toJSON(e) {
      let t = super.toJSON(e);
      return (
        (t.object.color = this.color.getHex()),
        (t.object.intensity = this.intensity),
        t
      );
    }
  },
  xs = class extends _s {
    constructor(e, t, n) {
      (super(e, n),
        (this.isHemisphereLight = !0),
        (this.type = "HemisphereLight"),
        this.position.copy(St.DEFAULT_UP),
        this.updateMatrix(),
        (this.groundColor = new Pe(t)));
    }
    copy(e, t) {
      return (super.copy(e, t), this.groundColor.copy(e.groundColor), this);
    }
    toJSON(e) {
      let t = super.toJSON(e);
      return ((t.object.groundColor = this.groundColor.getHex()), t);
    }
  },
  fo = new ht(),
  jl = new U(),
  Ql = new U(),
  bo = class {
    constructor(e) {
      ((this.camera = e),
        (this.intensity = 1),
        (this.bias = 0),
        (this.biasNode = null),
        (this.normalBias = 0),
        (this.radius = 1),
        (this.blurSamples = 8),
        (this.mapSize = new Ye(512, 512)),
        (this.mapType = Ft),
        (this.map = null),
        (this.mapPass = null),
        (this.matrix = new ht()),
        (this.autoUpdate = !0),
        (this.needsUpdate = !1),
        (this._frustum = new Oi()),
        (this._frameExtents = new Ye(1, 1)),
        (this._viewportCount = 1),
        (this._viewports = [new ut(0, 0, 1, 1)]));
    }
    getViewportCount() {
      return this._viewportCount;
    }
    getFrustum() {
      return this._frustum;
    }
    updateMatrices(e) {
      let t = this.camera,
        n = this.matrix;
      (jl.setFromMatrixPosition(e.matrixWorld),
        t.position.copy(jl),
        Ql.setFromMatrixPosition(e.target.matrixWorld),
        t.lookAt(Ql),
        t.updateMatrixWorld(),
        fo.multiplyMatrices(t.projectionMatrix, t.matrixWorldInverse),
        this._frustum.setFromProjectionMatrix(
          fo,
          t.coordinateSystem,
          t.reversedDepth,
        ),
        t.coordinateSystem === Pi || t.reversedDepth
          ? n.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 1, 0, 0, 0, 0, 1)
          : n.set(0.5, 0, 0, 0.5, 0, 0.5, 0, 0.5, 0, 0, 0.5, 0.5, 0, 0, 0, 1),
        n.multiply(fo));
    }
    getViewport(e) {
      return this._viewports[e];
    }
    getFrameExtents() {
      return this._frameExtents;
    }
    dispose() {
      (this.map && this.map.dispose(), this.mapPass && this.mapPass.dispose());
    }
    copy(e) {
      return (
        (this.camera = e.camera.clone()),
        (this.intensity = e.intensity),
        (this.bias = e.bias),
        (this.radius = e.radius),
        (this.autoUpdate = e.autoUpdate),
        (this.needsUpdate = e.needsUpdate),
        (this.normalBias = e.normalBias),
        (this.blurSamples = e.blurSamples),
        this.mapSize.copy(e.mapSize),
        (this.biasNode = e.biasNode),
        this
      );
    }
    clone() {
      return new this.constructor().copy(this);
    }
    toJSON() {
      let e = {};
      return (
        this.intensity !== 1 && (e.intensity = this.intensity),
        this.bias !== 0 && (e.bias = this.bias),
        this.normalBias !== 0 && (e.normalBias = this.normalBias),
        this.radius !== 1 && (e.radius = this.radius),
        (this.mapSize.x !== 512 || this.mapSize.y !== 512) &&
          (e.mapSize = this.mapSize.toArray()),
        (e.camera = this.camera.toJSON(!1).object),
        delete e.camera.matrix,
        e
      );
    }
  },
  rr = new U(),
  ar = new un(),
  an = new U(),
  vs = class extends St {
    constructor() {
      (super(),
        (this.isCamera = !0),
        (this.type = "Camera"),
        (this.matrixWorldInverse = new ht()),
        (this.projectionMatrix = new ht()),
        (this.projectionMatrixInverse = new ht()),
        (this.coordinateSystem = jt),
        (this._reversedDepth = !1));
    }
    get reversedDepth() {
      return this._reversedDepth;
    }
    copy(e, t) {
      return (
        super.copy(e, t),
        this.matrixWorldInverse.copy(e.matrixWorldInverse),
        this.projectionMatrix.copy(e.projectionMatrix),
        this.projectionMatrixInverse.copy(e.projectionMatrixInverse),
        (this.coordinateSystem = e.coordinateSystem),
        this
      );
    }
    getWorldDirection(e) {
      return super.getWorldDirection(e).negate();
    }
    updateMatrixWorld(e) {
      (super.updateMatrixWorld(e),
        this.matrixWorld.decompose(rr, ar, an),
        an.x === 1 && an.y === 1 && an.z === 1
          ? this.matrixWorldInverse.copy(this.matrixWorld).invert()
          : this.matrixWorldInverse.compose(rr, ar, an.set(1, 1, 1)).invert());
    }
    updateWorldMatrix(e, t) {
      (super.updateWorldMatrix(e, t),
        this.matrixWorld.decompose(rr, ar, an),
        an.x === 1 && an.y === 1 && an.z === 1
          ? this.matrixWorldInverse.copy(this.matrixWorld).invert()
          : this.matrixWorldInverse.compose(rr, ar, an.set(1, 1, 1)).invert());
    }
    clone() {
      return new this.constructor().copy(this);
    }
  },
  zn = new U(),
  ec = new Ye(),
  tc = new Ye(),
  It = class extends vs {
    constructor(e = 50, t = 1, n = 0.1, s = 2e3) {
      (super(),
        (this.isPerspectiveCamera = !0),
        (this.type = "PerspectiveCamera"),
        (this.fov = e),
        (this.zoom = 1),
        (this.near = n),
        (this.far = s),
        (this.focus = 10),
        (this.aspect = t),
        (this.view = null),
        (this.filmGauge = 35),
        (this.filmOffset = 0),
        this.updateProjectionMatrix());
    }
    copy(e, t) {
      return (
        super.copy(e, t),
        (this.fov = e.fov),
        (this.zoom = e.zoom),
        (this.near = e.near),
        (this.far = e.far),
        (this.focus = e.focus),
        (this.aspect = e.aspect),
        (this.view = e.view === null ? null : Object.assign({}, e.view)),
        (this.filmGauge = e.filmGauge),
        (this.filmOffset = e.filmOffset),
        this
      );
    }
    setFocalLength(e) {
      let t = (0.5 * this.getFilmHeight()) / e;
      ((this.fov = Di * 2 * Math.atan(t)), this.updateProjectionMatrix());
    }
    getFocalLength() {
      let e = Math.tan(ts * 0.5 * this.fov);
      return (0.5 * this.getFilmHeight()) / e;
    }
    getEffectiveFOV() {
      return Di * 2 * Math.atan(Math.tan(ts * 0.5 * this.fov) / this.zoom);
    }
    getFilmWidth() {
      return this.filmGauge * Math.min(this.aspect, 1);
    }
    getFilmHeight() {
      return this.filmGauge / Math.max(this.aspect, 1);
    }
    getViewBounds(e, t, n) {
      (zn.set(-1, -1, 0.5).applyMatrix4(this.projectionMatrixInverse),
        t.set(zn.x, zn.y).multiplyScalar(-e / zn.z),
        zn.set(1, 1, 0.5).applyMatrix4(this.projectionMatrixInverse),
        n.set(zn.x, zn.y).multiplyScalar(-e / zn.z));
    }
    getViewSize(e, t) {
      return (this.getViewBounds(e, ec, tc), t.subVectors(tc, ec));
    }
    setViewOffset(e, t, n, s, r, a) {
      ((this.aspect = e / t),
        this.view === null &&
          (this.view = {
            enabled: !0,
            fullWidth: 1,
            fullHeight: 1,
            offsetX: 0,
            offsetY: 0,
            width: 1,
            height: 1,
          }),
        (this.view.enabled = !0),
        (this.view.fullWidth = e),
        (this.view.fullHeight = t),
        (this.view.offsetX = n),
        (this.view.offsetY = s),
        (this.view.width = r),
        (this.view.height = a),
        this.updateProjectionMatrix());
    }
    clearViewOffset() {
      (this.view !== null && (this.view.enabled = !1),
        this.updateProjectionMatrix());
    }
    updateProjectionMatrix() {
      let e = this.near,
        t = (e * Math.tan(ts * 0.5 * this.fov)) / this.zoom,
        n = 2 * t,
        s = this.aspect * n,
        r = -0.5 * s,
        a = this.view;
      if (this.view !== null && this.view.enabled) {
        let c = a.fullWidth,
          l = a.fullHeight;
        ((r += (a.offsetX * s) / c),
          (t -= (a.offsetY * n) / l),
          (s *= a.width / c),
          (n *= a.height / l));
      }
      let o = this.filmOffset;
      (o !== 0 && (r += (e * o) / this.getFilmWidth()),
        this.projectionMatrix.makePerspective(
          r,
          r + s,
          t,
          t - n,
          e,
          this.far,
          this.coordinateSystem,
          this.reversedDepth,
        ),
        this.projectionMatrixInverse.copy(this.projectionMatrix).invert());
    }
    toJSON(e) {
      let t = super.toJSON(e);
      return (
        (t.object.fov = this.fov),
        (t.object.zoom = this.zoom),
        (t.object.near = this.near),
        (t.object.far = this.far),
        (t.object.focus = this.focus),
        (t.object.aspect = this.aspect),
        this.view !== null && (t.object.view = Object.assign({}, this.view)),
        (t.object.filmGauge = this.filmGauge),
        (t.object.filmOffset = this.filmOffset),
        t
      );
    }
  };
var ki = class extends vs {
    constructor(e = -1, t = 1, n = 1, s = -1, r = 0.1, a = 2e3) {
      (super(),
        (this.isOrthographicCamera = !0),
        (this.type = "OrthographicCamera"),
        (this.zoom = 1),
        (this.view = null),
        (this.left = e),
        (this.right = t),
        (this.top = n),
        (this.bottom = s),
        (this.near = r),
        (this.far = a),
        this.updateProjectionMatrix());
    }
    copy(e, t) {
      return (
        super.copy(e, t),
        (this.left = e.left),
        (this.right = e.right),
        (this.top = e.top),
        (this.bottom = e.bottom),
        (this.near = e.near),
        (this.far = e.far),
        (this.zoom = e.zoom),
        (this.view = e.view === null ? null : Object.assign({}, e.view)),
        this
      );
    }
    setViewOffset(e, t, n, s, r, a) {
      (this.view === null &&
        (this.view = {
          enabled: !0,
          fullWidth: 1,
          fullHeight: 1,
          offsetX: 0,
          offsetY: 0,
          width: 1,
          height: 1,
        }),
        (this.view.enabled = !0),
        (this.view.fullWidth = e),
        (this.view.fullHeight = t),
        (this.view.offsetX = n),
        (this.view.offsetY = s),
        (this.view.width = r),
        (this.view.height = a),
        this.updateProjectionMatrix());
    }
    clearViewOffset() {
      (this.view !== null && (this.view.enabled = !1),
        this.updateProjectionMatrix());
    }
    updateProjectionMatrix() {
      let e = (this.right - this.left) / (2 * this.zoom),
        t = (this.top - this.bottom) / (2 * this.zoom),
        n = (this.right + this.left) / 2,
        s = (this.top + this.bottom) / 2,
        r = n - e,
        a = n + e,
        o = s + t,
        c = s - t;
      if (this.view !== null && this.view.enabled) {
        let l = (this.right - this.left) / this.view.fullWidth / this.zoom,
          u = (this.top - this.bottom) / this.view.fullHeight / this.zoom;
        ((r += l * this.view.offsetX),
          (a = r + l * this.view.width),
          (o -= u * this.view.offsetY),
          (c = o - u * this.view.height));
      }
      (this.projectionMatrix.makeOrthographic(
        r,
        a,
        o,
        c,
        this.near,
        this.far,
        this.coordinateSystem,
        this.reversedDepth,
      ),
        this.projectionMatrixInverse.copy(this.projectionMatrix).invert());
    }
    toJSON(e) {
      let t = super.toJSON(e);
      return (
        (t.object.zoom = this.zoom),
        (t.object.left = this.left),
        (t.object.right = this.right),
        (t.object.top = this.top),
        (t.object.bottom = this.bottom),
        (t.object.near = this.near),
        (t.object.far = this.far),
        this.view !== null && (t.object.view = Object.assign({}, this.view)),
        t
      );
    }
  },
  Eo = class extends bo {
    constructor() {
      (super(new ki(-5, 5, 5, -5, 0.5, 500)),
        (this.isDirectionalLightShadow = !0));
    }
  },
  Gi = class extends _s {
    constructor(e, t) {
      (super(e, t),
        (this.isDirectionalLight = !0),
        (this.type = "DirectionalLight"),
        this.position.copy(St.DEFAULT_UP),
        this.updateMatrix(),
        (this.target = new St()),
        (this.shadow = new Eo()));
    }
    dispose() {
      (super.dispose(), this.shadow.dispose());
    }
    copy(e) {
      return (
        super.copy(e),
        (this.target = e.target.clone()),
        (this.shadow = e.shadow.clone()),
        this
      );
    }
    toJSON(e) {
      let t = super.toJSON(e);
      return (
        (t.object.shadow = this.shadow.toJSON()),
        (t.object.target = this.target.uuid),
        t
      );
    }
  };
var wi = -90,
  Ci = 1,
  Vr = class extends St {
    constructor(e, t, n) {
      (super(),
        (this.type = "CubeCamera"),
        (this.renderTarget = n),
        (this.coordinateSystem = null),
        (this.activeMipmapLevel = 0));
      let s = new It(wi, Ci, e, t);
      ((s.layers = this.layers), this.add(s));
      let r = new It(wi, Ci, e, t);
      ((r.layers = this.layers), this.add(r));
      let a = new It(wi, Ci, e, t);
      ((a.layers = this.layers), this.add(a));
      let o = new It(wi, Ci, e, t);
      ((o.layers = this.layers), this.add(o));
      let c = new It(wi, Ci, e, t);
      ((c.layers = this.layers), this.add(c));
      let l = new It(wi, Ci, e, t);
      ((l.layers = this.layers), this.add(l));
    }
    updateCoordinateSystem() {
      let e = this.coordinateSystem,
        t = this.children.concat(),
        [n, s, r, a, o, c] = t;
      for (let l of t) this.remove(l);
      if (e === jt)
        (n.up.set(0, 1, 0),
          n.lookAt(1, 0, 0),
          s.up.set(0, 1, 0),
          s.lookAt(-1, 0, 0),
          r.up.set(0, 0, -1),
          r.lookAt(0, 1, 0),
          a.up.set(0, 0, 1),
          a.lookAt(0, -1, 0),
          o.up.set(0, 1, 0),
          o.lookAt(0, 0, 1),
          c.up.set(0, 1, 0),
          c.lookAt(0, 0, -1));
      else if (e === Pi)
        (n.up.set(0, -1, 0),
          n.lookAt(-1, 0, 0),
          s.up.set(0, -1, 0),
          s.lookAt(1, 0, 0),
          r.up.set(0, 0, 1),
          r.lookAt(0, 1, 0),
          a.up.set(0, 0, -1),
          a.lookAt(0, -1, 0),
          o.up.set(0, -1, 0),
          o.lookAt(0, 0, 1),
          c.up.set(0, -1, 0),
          c.lookAt(0, 0, -1));
      else
        throw new Error(
          "THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: " +
            e,
        );
      for (let l of t) (this.add(l), l.updateMatrixWorld());
    }
    update(e, t) {
      this.parent === null && this.updateMatrixWorld();
      let { renderTarget: n, activeMipmapLevel: s } = this;
      this.coordinateSystem !== e.coordinateSystem &&
        ((this.coordinateSystem = e.coordinateSystem),
        this.updateCoordinateSystem());
      let [r, a, o, c, l, u] = this.children,
        d = e.getRenderTarget(),
        h = e.getActiveCubeFace(),
        p = e.getActiveMipmapLevel(),
        g = e.xr.enabled;
      e.xr.enabled = !1;
      let y = n.texture.generateMipmaps;
      n.texture.generateMipmaps = !1;
      let m = !1;
      (e.isWebGLRenderer === !0
        ? (m = e.state.buffers.depth.getReversed())
        : (m = e.reversedDepthBuffer),
        e.setRenderTarget(n, 0, s),
        m && e.autoClear === !1 && e.clearDepth(),
        e.render(t, r),
        e.setRenderTarget(n, 1, s),
        m && e.autoClear === !1 && e.clearDepth(),
        e.render(t, a),
        e.setRenderTarget(n, 2, s),
        m && e.autoClear === !1 && e.clearDepth(),
        e.render(t, o),
        e.setRenderTarget(n, 3, s),
        m && e.autoClear === !1 && e.clearDepth(),
        e.render(t, c),
        e.setRenderTarget(n, 4, s),
        m && e.autoClear === !1 && e.clearDepth(),
        e.render(t, l),
        (n.texture.generateMipmaps = y),
        e.setRenderTarget(n, 5, s),
        m && e.autoClear === !1 && e.clearDepth(),
        e.render(t, u),
        e.setRenderTarget(d, h, p),
        (e.xr.enabled = g),
        (n.texture.needsPMREMUpdate = !0));
    }
  },
  kr = class extends It {
    constructor(e = []) {
      (super(),
        (this.isArrayCamera = !0),
        (this.isMultiViewCamera = !1),
        (this.cameras = e));
    }
  };
var Ko = "\\[\\]\\.:\\/",
  _u = new RegExp("[" + Ko + "]", "g"),
  jo = "[^" + Ko + "]",
  xu = "[^" + Ko.replace("\\.", "") + "]",
  vu = /((?:WC+[\/:])*)/.source.replace("WC", jo),
  yu = /(WCOD+)?/.source.replace("WCOD", xu),
  Mu = /(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC", jo),
  Su = /\.(WC+)(?:\[(.+)\])?/.source.replace("WC", jo),
  bu = new RegExp("^" + vu + yu + Mu + Su + "$"),
  Eu = ["material", "materials", "bones", "map"],
  To = class {
    constructor(e, t, n) {
      let s = n || ct.parseTrackName(t);
      ((this._targetGroup = e), (this._bindings = e.subscribe_(t, s)));
    }
    getValue(e, t) {
      this.bind();
      let n = this._targetGroup.nCachedObjects_,
        s = this._bindings[n];
      s !== void 0 && s.getValue(e, t);
    }
    setValue(e, t) {
      let n = this._bindings;
      for (
        let s = this._targetGroup.nCachedObjects_, r = n.length;
        s !== r;
        ++s
      )
        n[s].setValue(e, t);
    }
    bind() {
      let e = this._bindings;
      for (
        let t = this._targetGroup.nCachedObjects_, n = e.length;
        t !== n;
        ++t
      )
        e[t].bind();
    }
    unbind() {
      let e = this._bindings;
      for (
        let t = this._targetGroup.nCachedObjects_, n = e.length;
        t !== n;
        ++t
      )
        e[t].unbind();
    }
  },
  ct = class i {
    constructor(e, t, n) {
      ((this.path = t),
        (this.parsedPath = n || i.parseTrackName(t)),
        (this.node = i.findNode(e, this.parsedPath.nodeName)),
        (this.rootNode = e),
        (this.getValue = this._getValue_unbound),
        (this.setValue = this._setValue_unbound));
    }
    static create(e, t, n) {
      return e && e.isAnimationObjectGroup
        ? new i.Composite(e, t, n)
        : new i(e, t, n);
    }
    static sanitizeNodeName(e) {
      return e.replace(/\s/g, "_").replace(_u, "");
    }
    static parseTrackName(e) {
      let t = bu.exec(e);
      if (t === null)
        throw new Error("PropertyBinding: Cannot parse trackName: " + e);
      let n = {
          nodeName: t[2],
          objectName: t[3],
          objectIndex: t[4],
          propertyName: t[5],
          propertyIndex: t[6],
        },
        s = n.nodeName && n.nodeName.lastIndexOf(".");
      if (s !== void 0 && s !== -1) {
        let r = n.nodeName.substring(s + 1);
        Eu.indexOf(r) !== -1 &&
          ((n.nodeName = n.nodeName.substring(0, s)), (n.objectName = r));
      }
      if (n.propertyName === null || n.propertyName.length === 0)
        throw new Error(
          "PropertyBinding: can not parse propertyName from trackName: " + e,
        );
      return n;
    }
    static findNode(e, t) {
      if (
        t === void 0 ||
        t === "" ||
        t === "." ||
        t === -1 ||
        t === e.name ||
        t === e.uuid
      )
        return e;
      if (e.skeleton) {
        let n = e.skeleton.getBoneByName(t);
        if (n !== void 0) return n;
      }
      if (e.children) {
        let n = function (r) {
            for (let a = 0; a < r.length; a++) {
              let o = r[a];
              if (o.name === t || o.uuid === t) return o;
              let c = n(o.children);
              if (c) return c;
            }
            return null;
          },
          s = n(e.children);
        if (s) return s;
      }
      return null;
    }
    _getValue_unavailable() {}
    _setValue_unavailable() {}
    _getValue_direct(e, t) {
      e[t] = this.targetObject[this.propertyName];
    }
    _getValue_array(e, t) {
      let n = this.resolvedProperty;
      for (let s = 0, r = n.length; s !== r; ++s) e[t++] = n[s];
    }
    _getValue_arrayElement(e, t) {
      e[t] = this.resolvedProperty[this.propertyIndex];
    }
    _getValue_toArray(e, t) {
      this.resolvedProperty.toArray(e, t);
    }
    _setValue_direct(e, t) {
      this.targetObject[this.propertyName] = e[t];
    }
    _setValue_direct_setNeedsUpdate(e, t) {
      ((this.targetObject[this.propertyName] = e[t]),
        (this.targetObject.needsUpdate = !0));
    }
    _setValue_direct_setMatrixWorldNeedsUpdate(e, t) {
      ((this.targetObject[this.propertyName] = e[t]),
        (this.targetObject.matrixWorldNeedsUpdate = !0));
    }
    _setValue_array(e, t) {
      let n = this.resolvedProperty;
      for (let s = 0, r = n.length; s !== r; ++s) n[s] = e[t++];
    }
    _setValue_array_setNeedsUpdate(e, t) {
      let n = this.resolvedProperty;
      for (let s = 0, r = n.length; s !== r; ++s) n[s] = e[t++];
      this.targetObject.needsUpdate = !0;
    }
    _setValue_array_setMatrixWorldNeedsUpdate(e, t) {
      let n = this.resolvedProperty;
      for (let s = 0, r = n.length; s !== r; ++s) n[s] = e[t++];
      this.targetObject.matrixWorldNeedsUpdate = !0;
    }
    _setValue_arrayElement(e, t) {
      this.resolvedProperty[this.propertyIndex] = e[t];
    }
    _setValue_arrayElement_setNeedsUpdate(e, t) {
      ((this.resolvedProperty[this.propertyIndex] = e[t]),
        (this.targetObject.needsUpdate = !0));
    }
    _setValue_arrayElement_setMatrixWorldNeedsUpdate(e, t) {
      ((this.resolvedProperty[this.propertyIndex] = e[t]),
        (this.targetObject.matrixWorldNeedsUpdate = !0));
    }
    _setValue_fromArray(e, t) {
      this.resolvedProperty.fromArray(e, t);
    }
    _setValue_fromArray_setNeedsUpdate(e, t) {
      (this.resolvedProperty.fromArray(e, t),
        (this.targetObject.needsUpdate = !0));
    }
    _setValue_fromArray_setMatrixWorldNeedsUpdate(e, t) {
      (this.resolvedProperty.fromArray(e, t),
        (this.targetObject.matrixWorldNeedsUpdate = !0));
    }
    _getValue_unbound(e, t) {
      (this.bind(), this.getValue(e, t));
    }
    _setValue_unbound(e, t) {
      (this.bind(), this.setValue(e, t));
    }
    bind() {
      let e = this.node,
        t = this.parsedPath,
        n = t.objectName,
        s = t.propertyName,
        r = t.propertyIndex;
      if (
        (e || ((e = i.findNode(this.rootNode, t.nodeName)), (this.node = e)),
        (this.getValue = this._getValue_unavailable),
        (this.setValue = this._setValue_unavailable),
        !e)
      ) {
        Ce(
          "PropertyBinding: No target node found for track: " + this.path + ".",
        );
        return;
      }
      if (n) {
        let l = t.objectIndex;
        switch (n) {
          case "materials":
            if (!e.material) {
              Ie(
                "PropertyBinding: Can not bind to material as node does not have a material.",
                this,
              );
              return;
            }
            if (!e.material.materials) {
              Ie(
                "PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",
                this,
              );
              return;
            }
            e = e.material.materials;
            break;
          case "bones":
            if (!e.skeleton) {
              Ie(
                "PropertyBinding: Can not bind to bones as node does not have a skeleton.",
                this,
              );
              return;
            }
            e = e.skeleton.bones;
            for (let u = 0; u < e.length; u++)
              if (e[u].name === l) {
                l = u;
                break;
              }
            break;
          case "map":
            if ("map" in e) {
              e = e.map;
              break;
            }
            if (!e.material) {
              Ie(
                "PropertyBinding: Can not bind to material as node does not have a material.",
                this,
              );
              return;
            }
            if (!e.material.map) {
              Ie(
                "PropertyBinding: Can not bind to material.map as node.material does not have a map.",
                this,
              );
              return;
            }
            e = e.material.map;
            break;
          default:
            if (e[n] === void 0) {
              Ie(
                "PropertyBinding: Can not bind to objectName of node undefined.",
                this,
              );
              return;
            }
            e = e[n];
        }
        if (l !== void 0) {
          if (e[l] === void 0) {
            Ie(
              "PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",
              this,
              e,
            );
            return;
          }
          e = e[l];
        }
      }
      let a = e[s];
      if (a === void 0) {
        let l = t.nodeName;
        Ie(
          "PropertyBinding: Trying to update property for track: " +
            l +
            "." +
            s +
            " but it wasn't found.",
          e,
        );
        return;
      }
      let o = this.Versioning.None;
      ((this.targetObject = e),
        e.isMaterial === !0
          ? (o = this.Versioning.NeedsUpdate)
          : e.isObject3D === !0 &&
            (o = this.Versioning.MatrixWorldNeedsUpdate));
      let c = this.BindingType.Direct;
      if (r !== void 0) {
        if (s === "morphTargetInfluences") {
          if (!e.geometry) {
            Ie(
              "PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",
              this,
            );
            return;
          }
          if (!e.geometry.morphAttributes) {
            Ie(
              "PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",
              this,
            );
            return;
          }
          e.morphTargetDictionary[r] !== void 0 &&
            (r = e.morphTargetDictionary[r]);
        }
        ((c = this.BindingType.ArrayElement),
          (this.resolvedProperty = a),
          (this.propertyIndex = r));
      } else
        a.fromArray !== void 0 && a.toArray !== void 0
          ? ((c = this.BindingType.HasFromToArray), (this.resolvedProperty = a))
          : Array.isArray(a)
            ? ((c = this.BindingType.EntireArray), (this.resolvedProperty = a))
            : (this.propertyName = s);
      ((this.getValue = this.GetterByBindingType[c]),
        (this.setValue = this.SetterByBindingTypeAndVersioning[c][o]));
    }
    unbind() {
      ((this.node = null),
        (this.getValue = this._getValue_unbound),
        (this.setValue = this._setValue_unbound));
    }
  };
ct.Composite = To;
ct.prototype.BindingType = {
  Direct: 0,
  EntireArray: 1,
  ArrayElement: 2,
  HasFromToArray: 3,
};
ct.prototype.Versioning = {
  None: 0,
  NeedsUpdate: 1,
  MatrixWorldNeedsUpdate: 2,
};
ct.prototype.GetterByBindingType = [
  ct.prototype._getValue_direct,
  ct.prototype._getValue_array,
  ct.prototype._getValue_arrayElement,
  ct.prototype._getValue_toArray,
];
ct.prototype.SetterByBindingTypeAndVersioning = [
  [
    ct.prototype._setValue_direct,
    ct.prototype._setValue_direct_setNeedsUpdate,
    ct.prototype._setValue_direct_setMatrixWorldNeedsUpdate,
  ],
  [
    ct.prototype._setValue_array,
    ct.prototype._setValue_array_setNeedsUpdate,
    ct.prototype._setValue_array_setMatrixWorldNeedsUpdate,
  ],
  [
    ct.prototype._setValue_arrayElement,
    ct.prototype._setValue_arrayElement_setNeedsUpdate,
    ct.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate,
  ],
  [
    ct.prototype._setValue_fromArray,
    ct.prototype._setValue_fromArray_setNeedsUpdate,
    ct.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate,
  ],
];
var Rg = new Float32Array(1);
var nc = new ht(),
  ys = class {
    constructor(e, t, n = 0, s = 1 / 0) {
      ((this.ray = new ai(e, t)),
        (this.near = n),
        (this.far = s),
        (this.camera = null),
        (this.layers = new Ni()),
        (this.params = {
          Mesh: {},
          Line: { threshold: 1 },
          LOD: {},
          Points: { threshold: 1 },
          Sprite: {},
        }));
    }
    set(e, t) {
      this.ray.set(e, t);
    }
    setFromCamera(e, t) {
      t.isPerspectiveCamera
        ? (this.ray.origin.setFromMatrixPosition(t.matrixWorld),
          this.ray.direction
            .set(e.x, e.y, 0.5)
            .unproject(t)
            .sub(this.ray.origin)
            .normalize(),
          (this.camera = t))
        : t.isOrthographicCamera
          ? (this.ray.origin
              .set(e.x, e.y, (t.near + t.far) / (t.near - t.far))
              .unproject(t),
            this.ray.direction.set(0, 0, -1).transformDirection(t.matrixWorld),
            (this.camera = t))
          : Ie("Raycaster: Unsupported camera type: " + t.type);
    }
    setFromXRController(e) {
      return (
        nc.identity().extractRotation(e.matrixWorld),
        this.ray.origin.setFromMatrixPosition(e.matrixWorld),
        this.ray.direction.set(0, 0, -1).applyMatrix4(nc),
        this
      );
    }
    intersectObject(e, t = !0, n = []) {
      return (Ao(e, this, n, t), n.sort(ic), n);
    }
    intersectObjects(e, t = !0, n = []) {
      for (let s = 0, r = e.length; s < r; s++) Ao(e[s], this, n, t);
      return (n.sort(ic), n);
    }
  };
function ic(i, e) {
  return i.distance - e.distance;
}
function Ao(i, e, t, n) {
  let s = !0;
  if (
    (i.layers.test(e.layers) && i.raycast(e, t) === !1 && (s = !1),
    s === !0 && n === !0)
  ) {
    let r = i.children;
    for (let a = 0, o = r.length; a < o; a++) Ao(r[a], e, t, !0);
  }
}
var wo = class i {
  static {
    i.prototype.isMatrix2 = !0;
  }
  constructor(e, t, n, s) {
    ((this.elements = [1, 0, 0, 1]), e !== void 0 && this.set(e, t, n, s));
  }
  identity() {
    return (this.set(1, 0, 0, 1), this);
  }
  fromArray(e, t = 0) {
    for (let n = 0; n < 4; n++) this.elements[n] = e[n + t];
    return this;
  }
  set(e, t, n, s) {
    let r = this.elements;
    return ((r[0] = e), (r[2] = t), (r[1] = n), (r[3] = s), this);
  }
};
var Ms = class extends li {
  constructor(e = 10, t = 10, n = 4473924, s = 8947848) {
    ((n = new Pe(n)), (s = new Pe(s)));
    let r = t / 2,
      a = e / t,
      o = e / 2,
      c = [],
      l = [];
    for (let h = 0, p = 0, g = -o; h <= t; h++, g += a) {
      (c.push(-o, 0, g, o, 0, g), c.push(g, 0, -o, g, 0, o));
      let y = h === r ? n : s;
      (y.toArray(l, p),
        (p += 3),
        y.toArray(l, p),
        (p += 3),
        y.toArray(l, p),
        (p += 3),
        y.toArray(l, p),
        (p += 3));
    }
    let u = new At();
    (u.setAttribute("position", new ot(c, 3)),
      u.setAttribute("color", new ot(l, 3)));
    let d = new wn({ vertexColors: !0, toneMapped: !1 });
    (super(u, d), (this.type = "GridHelper"));
  }
  dispose() {
    (this.geometry.dispose(), this.material.dispose());
  }
};
function Qo(i, e, t, n) {
  let s = Tu(n);
  switch (t) {
    case Wo:
      return i * e;
    case qo:
      return ((i * e) / s.components) * s.byteLength;
    case $r:
      return ((i * e) / s.components) * s.byteLength;
    case $n:
      return ((i * e * 2) / s.components) * s.byteLength;
    case Kr:
      return ((i * e * 2) / s.components) * s.byteLength;
    case Xo:
      return ((i * e * 3) / s.components) * s.byteLength;
    case Yt:
      return ((i * e * 4) / s.components) * s.byteLength;
    case jr:
      return ((i * e * 4) / s.components) * s.byteLength;
    case Ts:
    case As:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 8;
    case ws:
    case Cs:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    case ea:
    case na:
      return (Math.max(i, 16) * Math.max(e, 8)) / 4;
    case Qr:
    case ta:
      return (Math.max(i, 8) * Math.max(e, 8)) / 2;
    case ia:
    case sa:
    case aa:
    case oa:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 8;
    case ra:
    case Rs:
    case la:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    case ca:
      return Math.floor((i + 3) / 4) * Math.floor((e + 3) / 4) * 16;
    case ha:
      return Math.floor((i + 4) / 5) * Math.floor((e + 3) / 4) * 16;
    case ua:
      return Math.floor((i + 4) / 5) * Math.floor((e + 4) / 5) * 16;
    case da:
      return Math.floor((i + 5) / 6) * Math.floor((e + 4) / 5) * 16;
    case fa:
      return Math.floor((i + 5) / 6) * Math.floor((e + 5) / 6) * 16;
    case pa:
      return Math.floor((i + 7) / 8) * Math.floor((e + 4) / 5) * 16;
    case ma:
      return Math.floor((i + 7) / 8) * Math.floor((e + 5) / 6) * 16;
    case ga:
      return Math.floor((i + 7) / 8) * Math.floor((e + 7) / 8) * 16;
    case _a:
      return Math.floor((i + 9) / 10) * Math.floor((e + 4) / 5) * 16;
    case xa:
      return Math.floor((i + 9) / 10) * Math.floor((e + 5) / 6) * 16;
    case va:
      return Math.floor((i + 9) / 10) * Math.floor((e + 7) / 8) * 16;
    case ya:
      return Math.floor((i + 9) / 10) * Math.floor((e + 9) / 10) * 16;
    case Ma:
      return Math.floor((i + 11) / 12) * Math.floor((e + 9) / 10) * 16;
    case Sa:
      return Math.floor((i + 11) / 12) * Math.floor((e + 11) / 12) * 16;
    case ba:
    case Ea:
    case Ta:
      return Math.ceil(i / 4) * Math.ceil(e / 4) * 16;
    case Aa:
    case wa:
      return Math.ceil(i / 4) * Math.ceil(e / 4) * 8;
    case Is:
    case Ca:
      return Math.ceil(i / 4) * Math.ceil(e / 4) * 16;
  }
  throw new Error(`Unable to determine texture byte length for ${t} format.`);
}
function Tu(i) {
  switch (i) {
    case Ft:
    case Vo:
      return { byteLength: 1, components: 1 };
    case Wi:
    case ko:
    case mn:
      return { byteLength: 2, components: 1 };
    case Zr:
    case Jr:
      return { byteLength: 2, components: 4 };
    case en:
    case Yr:
    case tn:
      return { byteLength: 4, components: 1 };
    case Go:
    case Ho:
      return { byteLength: 4, components: 3 };
  }
  throw new Error(`Unknown texture type ${i}.`);
}
typeof __THREE_DEVTOOLS__ < "u" &&
  __THREE_DEVTOOLS__.dispatchEvent(
    new CustomEvent("register", { detail: { revision: Gr } }),
  );
typeof window < "u" &&
  (window.__THREE__
    ? Ce("WARNING: Multiple instances of Three.js being imported.")
    : (window.__THREE__ = Gr));
function hh() {
  let i = null,
    e = !1,
    t = null,
    n = null;
  function s(r, a) {
    (t(r, a), (n = i.requestAnimationFrame(s)));
  }
  return {
    start: function () {
      e !== !0 &&
        t !== null &&
        i !== null &&
        ((n = i.requestAnimationFrame(s)), (e = !0));
    },
    stop: function () {
      (i !== null && i.cancelAnimationFrame(n), (e = !1));
    },
    setAnimationLoop: function (r) {
      t = r;
    },
    setContext: function (r) {
      i = r;
    },
  };
}
function Au(i) {
  let e = new WeakMap();
  function t(o, c) {
    let l = o.array,
      u = o.usage,
      d = l.byteLength,
      h = i.createBuffer();
    (i.bindBuffer(c, h), i.bufferData(c, l, u), o.onUploadCallback());
    let p;
    if (l instanceof Float32Array) p = i.FLOAT;
    else if (typeof Float16Array < "u" && l instanceof Float16Array)
      p = i.HALF_FLOAT;
    else if (l instanceof Uint16Array)
      o.isFloat16BufferAttribute ? (p = i.HALF_FLOAT) : (p = i.UNSIGNED_SHORT);
    else if (l instanceof Int16Array) p = i.SHORT;
    else if (l instanceof Uint32Array) p = i.UNSIGNED_INT;
    else if (l instanceof Int32Array) p = i.INT;
    else if (l instanceof Int8Array) p = i.BYTE;
    else if (l instanceof Uint8Array) p = i.UNSIGNED_BYTE;
    else if (l instanceof Uint8ClampedArray) p = i.UNSIGNED_BYTE;
    else
      throw new Error(
        "THREE.WebGLAttributes: Unsupported buffer data format: " + l,
      );
    return {
      buffer: h,
      type: p,
      bytesPerElement: l.BYTES_PER_ELEMENT,
      version: o.version,
      size: d,
    };
  }
  function n(o, c, l) {
    let u = c.array,
      d = c.updateRanges;
    if ((i.bindBuffer(l, o), d.length === 0)) i.bufferSubData(l, 0, u);
    else {
      d.sort((p, g) => p.start - g.start);
      let h = 0;
      for (let p = 1; p < d.length; p++) {
        let g = d[h],
          y = d[p];
        y.start <= g.start + g.count + 1
          ? (g.count = Math.max(g.count, y.start + y.count - g.start))
          : (++h, (d[h] = y));
      }
      d.length = h + 1;
      for (let p = 0, g = d.length; p < g; p++) {
        let y = d[p];
        i.bufferSubData(l, y.start * u.BYTES_PER_ELEMENT, u, y.start, y.count);
      }
      c.clearUpdateRanges();
    }
    c.onUploadCallback();
  }
  function s(o) {
    return (o.isInterleavedBufferAttribute && (o = o.data), e.get(o));
  }
  function r(o) {
    o.isInterleavedBufferAttribute && (o = o.data);
    let c = e.get(o);
    c && (i.deleteBuffer(c.buffer), e.delete(o));
  }
  function a(o, c) {
    if (
      (o.isInterleavedBufferAttribute && (o = o.data), o.isGLBufferAttribute)
    ) {
      let u = e.get(o);
      (!u || u.version < o.version) &&
        e.set(o, {
          buffer: o.buffer,
          type: o.type,
          bytesPerElement: o.elementSize,
          version: o.version,
        });
      return;
    }
    let l = e.get(o);
    if (l === void 0) e.set(o, t(o, c));
    else if (l.version < o.version) {
      if (l.size !== o.array.byteLength)
        throw new Error(
          "THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.",
        );
      (n(l.buffer, o, c), (l.version = o.version));
    }
  }
  return { get: s, remove: r, update: a };
}
var wu = `#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,
  Cu = `#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,
  Ru = `#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,
  Iu = `#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,
  Pu = `#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,
  Lu = `#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,
  Du = `#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,
  Uu = `#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,
  Nu = `#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,
  Fu = `#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,
  Ou = `vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,
  Bu = `vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,
  zu = `float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,
  Vu = `#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,
  ku = `#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,
  Gu = `#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,
  Hu = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,
  Wu = `#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,
  Xu = `#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,
  qu = `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,
  Yu = `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,
  Zu = `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,
  Ju = `#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,
  $u = `#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,
  Ku = `#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,
  ju = `vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,
  Qu = `#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,
  ed = `#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,
  td = `#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,
  nd = `#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,
  id = "gl_FragColor = linearToOutputTexel( gl_FragColor );",
  sd = `vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,
  rd = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,
  ad = `#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,
  od = `#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,
  ld = `#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,
  cd = `#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,
  hd = `#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,
  ud = `#ifdef USE_FOG
	varying float vFogDepth;
#endif`,
  dd = `#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,
  fd = `#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,
  pd = `#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,
  md = `#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,
  gd = `LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,
  _d = `varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,
  xd = `uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,
  vd = `#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,
  yd = `ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,
  Md = `varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,
  Sd = `BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,
  bd = `varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,
  Ed = `PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,
  Td = `uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,
  Ad = `
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,
  wd = `#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,
  Cd = `#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,
  Rd = `#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,
  Id = `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,
  Pd = `#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,
  Ld = `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,
  Dd = `#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,
  Ud = `#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,
  Nd = `#ifdef USE_MAP
	uniform sampler2D map;
#endif`,
  Fd = `#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,
  Od = `#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,
  Bd = `float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,
  zd = `#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,
  Vd = `#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,
  kd = `#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,
  Gd = `#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,
  Hd = `#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,
  Wd = `#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,
  Xd = `float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,
  qd = `#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,
  Yd = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,
  Zd = `#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,
  Jd = `#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,
  $d = `#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,
  Kd = `#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,
  jd = `#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,
  Qd = `#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,
  ef = `#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,
  tf = `#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,
  nf = `vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,
  sf = `#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,
  rf = `vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,
  af = `#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,
  of = `#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,
  lf = `float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,
  cf = `#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,
  hf = `#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,
  uf = `#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,
  df = `#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,
  ff = `float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,
  pf = `#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,
  mf = `#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,
  gf = `#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,
  _f = `#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,
  xf = `float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,
  vf = `#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,
  yf = `#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,
  Mf = `#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,
  Sf = `#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,
  bf = `#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,
  Ef = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,
  Tf = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,
  Af = `#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,
  wf = `#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,
  Cf = `varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,
  Rf = `uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  If = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,
  Pf = `#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  Lf = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,
  Df = `uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  Uf = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,
  Nf = `#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,
  Ff = `#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,
  Of = `#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,
  Bf = `varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,
  zf = `uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,
  Vf = `uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,
  kf = `uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
  Gf = `#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,
  Hf = `uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  Wf = `#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  Xf = `#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  qf = `#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,
  Yf = `#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  Zf = `#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,
  Jf = `#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,
  $f = `#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  Kf = `#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  jf = `#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,
  Qf = `#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  ep = `#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  tp = `#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,
  np = `uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,
  ip = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
  sp = `#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,
  rp = `uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,
  ap = `uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,
  op = `uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,
  Ve = {
    alphahash_fragment: wu,
    alphahash_pars_fragment: Cu,
    alphamap_fragment: Ru,
    alphamap_pars_fragment: Iu,
    alphatest_fragment: Pu,
    alphatest_pars_fragment: Lu,
    aomap_fragment: Du,
    aomap_pars_fragment: Uu,
    batching_pars_vertex: Nu,
    batching_vertex: Fu,
    begin_vertex: Ou,
    beginnormal_vertex: Bu,
    bsdfs: zu,
    iridescence_fragment: Vu,
    bumpmap_pars_fragment: ku,
    clipping_planes_fragment: Gu,
    clipping_planes_pars_fragment: Hu,
    clipping_planes_pars_vertex: Wu,
    clipping_planes_vertex: Xu,
    color_fragment: qu,
    color_pars_fragment: Yu,
    color_pars_vertex: Zu,
    color_vertex: Ju,
    common: $u,
    cube_uv_reflection_fragment: Ku,
    defaultnormal_vertex: ju,
    displacementmap_pars_vertex: Qu,
    displacementmap_vertex: ed,
    emissivemap_fragment: td,
    emissivemap_pars_fragment: nd,
    colorspace_fragment: id,
    colorspace_pars_fragment: sd,
    envmap_fragment: rd,
    envmap_common_pars_fragment: ad,
    envmap_pars_fragment: od,
    envmap_pars_vertex: ld,
    envmap_physical_pars_fragment: vd,
    envmap_vertex: cd,
    fog_vertex: hd,
    fog_pars_vertex: ud,
    fog_fragment: dd,
    fog_pars_fragment: fd,
    gradientmap_pars_fragment: pd,
    lightmap_pars_fragment: md,
    lights_lambert_fragment: gd,
    lights_lambert_pars_fragment: _d,
    lights_pars_begin: xd,
    lights_toon_fragment: yd,
    lights_toon_pars_fragment: Md,
    lights_phong_fragment: Sd,
    lights_phong_pars_fragment: bd,
    lights_physical_fragment: Ed,
    lights_physical_pars_fragment: Td,
    lights_fragment_begin: Ad,
    lights_fragment_maps: wd,
    lights_fragment_end: Cd,
    lightprobes_pars_fragment: Rd,
    logdepthbuf_fragment: Id,
    logdepthbuf_pars_fragment: Pd,
    logdepthbuf_pars_vertex: Ld,
    logdepthbuf_vertex: Dd,
    map_fragment: Ud,
    map_pars_fragment: Nd,
    map_particle_fragment: Fd,
    map_particle_pars_fragment: Od,
    metalnessmap_fragment: Bd,
    metalnessmap_pars_fragment: zd,
    morphinstance_vertex: Vd,
    morphcolor_vertex: kd,
    morphnormal_vertex: Gd,
    morphtarget_pars_vertex: Hd,
    morphtarget_vertex: Wd,
    normal_fragment_begin: Xd,
    normal_fragment_maps: qd,
    normal_pars_fragment: Yd,
    normal_pars_vertex: Zd,
    normal_vertex: Jd,
    normalmap_pars_fragment: $d,
    clearcoat_normal_fragment_begin: Kd,
    clearcoat_normal_fragment_maps: jd,
    clearcoat_pars_fragment: Qd,
    iridescence_pars_fragment: ef,
    opaque_fragment: tf,
    packing: nf,
    premultiplied_alpha_fragment: sf,
    project_vertex: rf,
    dithering_fragment: af,
    dithering_pars_fragment: of,
    roughnessmap_fragment: lf,
    roughnessmap_pars_fragment: cf,
    shadowmap_pars_fragment: hf,
    shadowmap_pars_vertex: uf,
    shadowmap_vertex: df,
    shadowmask_pars_fragment: ff,
    skinbase_vertex: pf,
    skinning_pars_vertex: mf,
    skinning_vertex: gf,
    skinnormal_vertex: _f,
    specularmap_fragment: xf,
    specularmap_pars_fragment: vf,
    tonemapping_fragment: yf,
    tonemapping_pars_fragment: Mf,
    transmission_fragment: Sf,
    transmission_pars_fragment: bf,
    uv_pars_fragment: Ef,
    uv_pars_vertex: Tf,
    uv_vertex: Af,
    worldpos_vertex: wf,
    background_vert: Cf,
    background_frag: Rf,
    backgroundCube_vert: If,
    backgroundCube_frag: Pf,
    cube_vert: Lf,
    cube_frag: Df,
    depth_vert: Uf,
    depth_frag: Nf,
    distance_vert: Ff,
    distance_frag: Of,
    equirect_vert: Bf,
    equirect_frag: zf,
    linedashed_vert: Vf,
    linedashed_frag: kf,
    meshbasic_vert: Gf,
    meshbasic_frag: Hf,
    meshlambert_vert: Wf,
    meshlambert_frag: Xf,
    meshmatcap_vert: qf,
    meshmatcap_frag: Yf,
    meshnormal_vert: Zf,
    meshnormal_frag: Jf,
    meshphong_vert: $f,
    meshphong_frag: Kf,
    meshphysical_vert: jf,
    meshphysical_frag: Qf,
    meshtoon_vert: ep,
    meshtoon_frag: tp,
    points_vert: np,
    points_frag: ip,
    shadow_vert: sp,
    shadow_frag: rp,
    sprite_vert: ap,
    sprite_frag: op,
  },
  ue = {
    common: {
      diffuse: { value: new Pe(16777215) },
      opacity: { value: 1 },
      map: { value: null },
      mapTransform: { value: new Ne() },
      alphaMap: { value: null },
      alphaMapTransform: { value: new Ne() },
      alphaTest: { value: 0 },
    },
    specularmap: {
      specularMap: { value: null },
      specularMapTransform: { value: new Ne() },
    },
    envmap: {
      envMap: { value: null },
      envMapRotation: { value: new Ne() },
      reflectivity: { value: 1 },
      ior: { value: 1.5 },
      refractionRatio: { value: 0.98 },
      dfgLUT: { value: null },
    },
    aomap: {
      aoMap: { value: null },
      aoMapIntensity: { value: 1 },
      aoMapTransform: { value: new Ne() },
    },
    lightmap: {
      lightMap: { value: null },
      lightMapIntensity: { value: 1 },
      lightMapTransform: { value: new Ne() },
    },
    bumpmap: {
      bumpMap: { value: null },
      bumpMapTransform: { value: new Ne() },
      bumpScale: { value: 1 },
    },
    normalmap: {
      normalMap: { value: null },
      normalMapTransform: { value: new Ne() },
      normalScale: { value: new Ye(1, 1) },
    },
    displacementmap: {
      displacementMap: { value: null },
      displacementMapTransform: { value: new Ne() },
      displacementScale: { value: 1 },
      displacementBias: { value: 0 },
    },
    emissivemap: {
      emissiveMap: { value: null },
      emissiveMapTransform: { value: new Ne() },
    },
    metalnessmap: {
      metalnessMap: { value: null },
      metalnessMapTransform: { value: new Ne() },
    },
    roughnessmap: {
      roughnessMap: { value: null },
      roughnessMapTransform: { value: new Ne() },
    },
    gradientmap: { gradientMap: { value: null } },
    fog: {
      fogDensity: { value: 25e-5 },
      fogNear: { value: 1 },
      fogFar: { value: 2e3 },
      fogColor: { value: new Pe(16777215) },
    },
    lights: {
      ambientLightColor: { value: [] },
      lightProbe: { value: [] },
      directionalLights: {
        value: [],
        properties: { direction: {}, color: {} },
      },
      directionalLightShadows: {
        value: [],
        properties: {
          shadowIntensity: 1,
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {},
        },
      },
      directionalShadowMatrix: { value: [] },
      spotLights: {
        value: [],
        properties: {
          color: {},
          position: {},
          direction: {},
          distance: {},
          coneCos: {},
          penumbraCos: {},
          decay: {},
        },
      },
      spotLightShadows: {
        value: [],
        properties: {
          shadowIntensity: 1,
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {},
        },
      },
      spotLightMap: { value: [] },
      spotLightMatrix: { value: [] },
      pointLights: {
        value: [],
        properties: { color: {}, position: {}, decay: {}, distance: {} },
      },
      pointLightShadows: {
        value: [],
        properties: {
          shadowIntensity: 1,
          shadowBias: {},
          shadowNormalBias: {},
          shadowRadius: {},
          shadowMapSize: {},
          shadowCameraNear: {},
          shadowCameraFar: {},
        },
      },
      pointShadowMatrix: { value: [] },
      hemisphereLights: {
        value: [],
        properties: { direction: {}, skyColor: {}, groundColor: {} },
      },
      rectAreaLights: {
        value: [],
        properties: { color: {}, position: {}, width: {}, height: {} },
      },
      ltc_1: { value: null },
      ltc_2: { value: null },
      probesSH: { value: null },
      probesMin: { value: new U() },
      probesMax: { value: new U() },
      probesResolution: { value: new U() },
    },
    points: {
      diffuse: { value: new Pe(16777215) },
      opacity: { value: 1 },
      size: { value: 1 },
      scale: { value: 1 },
      map: { value: null },
      alphaMap: { value: null },
      alphaMapTransform: { value: new Ne() },
      alphaTest: { value: 0 },
      uvTransform: { value: new Ne() },
    },
    sprite: {
      diffuse: { value: new Pe(16777215) },
      opacity: { value: 1 },
      center: { value: new Ye(0.5, 0.5) },
      rotation: { value: 0 },
      map: { value: null },
      mapTransform: { value: new Ne() },
      alphaMap: { value: null },
      alphaMapTransform: { value: new Ne() },
      alphaTest: { value: 0 },
    },
  },
  _n = {
    basic: {
      uniforms: Pt([
        ue.common,
        ue.specularmap,
        ue.envmap,
        ue.aomap,
        ue.lightmap,
        ue.fog,
      ]),
      vertexShader: Ve.meshbasic_vert,
      fragmentShader: Ve.meshbasic_frag,
    },
    lambert: {
      uniforms: Pt([
        ue.common,
        ue.specularmap,
        ue.envmap,
        ue.aomap,
        ue.lightmap,
        ue.emissivemap,
        ue.bumpmap,
        ue.normalmap,
        ue.displacementmap,
        ue.fog,
        ue.lights,
        { emissive: { value: new Pe(0) }, envMapIntensity: { value: 1 } },
      ]),
      vertexShader: Ve.meshlambert_vert,
      fragmentShader: Ve.meshlambert_frag,
    },
    phong: {
      uniforms: Pt([
        ue.common,
        ue.specularmap,
        ue.envmap,
        ue.aomap,
        ue.lightmap,
        ue.emissivemap,
        ue.bumpmap,
        ue.normalmap,
        ue.displacementmap,
        ue.fog,
        ue.lights,
        {
          emissive: { value: new Pe(0) },
          specular: { value: new Pe(1118481) },
          shininess: { value: 30 },
          envMapIntensity: { value: 1 },
        },
      ]),
      vertexShader: Ve.meshphong_vert,
      fragmentShader: Ve.meshphong_frag,
    },
    standard: {
      uniforms: Pt([
        ue.common,
        ue.envmap,
        ue.aomap,
        ue.lightmap,
        ue.emissivemap,
        ue.bumpmap,
        ue.normalmap,
        ue.displacementmap,
        ue.roughnessmap,
        ue.metalnessmap,
        ue.fog,
        ue.lights,
        {
          emissive: { value: new Pe(0) },
          roughness: { value: 1 },
          metalness: { value: 0 },
          envMapIntensity: { value: 1 },
        },
      ]),
      vertexShader: Ve.meshphysical_vert,
      fragmentShader: Ve.meshphysical_frag,
    },
    toon: {
      uniforms: Pt([
        ue.common,
        ue.aomap,
        ue.lightmap,
        ue.emissivemap,
        ue.bumpmap,
        ue.normalmap,
        ue.displacementmap,
        ue.gradientmap,
        ue.fog,
        ue.lights,
        { emissive: { value: new Pe(0) } },
      ]),
      vertexShader: Ve.meshtoon_vert,
      fragmentShader: Ve.meshtoon_frag,
    },
    matcap: {
      uniforms: Pt([
        ue.common,
        ue.bumpmap,
        ue.normalmap,
        ue.displacementmap,
        ue.fog,
        { matcap: { value: null } },
      ]),
      vertexShader: Ve.meshmatcap_vert,
      fragmentShader: Ve.meshmatcap_frag,
    },
    points: {
      uniforms: Pt([ue.points, ue.fog]),
      vertexShader: Ve.points_vert,
      fragmentShader: Ve.points_frag,
    },
    dashed: {
      uniforms: Pt([
        ue.common,
        ue.fog,
        {
          scale: { value: 1 },
          dashSize: { value: 1 },
          totalSize: { value: 2 },
        },
      ]),
      vertexShader: Ve.linedashed_vert,
      fragmentShader: Ve.linedashed_frag,
    },
    depth: {
      uniforms: Pt([ue.common, ue.displacementmap]),
      vertexShader: Ve.depth_vert,
      fragmentShader: Ve.depth_frag,
    },
    normal: {
      uniforms: Pt([
        ue.common,
        ue.bumpmap,
        ue.normalmap,
        ue.displacementmap,
        { opacity: { value: 1 } },
      ]),
      vertexShader: Ve.meshnormal_vert,
      fragmentShader: Ve.meshnormal_frag,
    },
    sprite: {
      uniforms: Pt([ue.sprite, ue.fog]),
      vertexShader: Ve.sprite_vert,
      fragmentShader: Ve.sprite_frag,
    },
    background: {
      uniforms: {
        uvTransform: { value: new Ne() },
        t2D: { value: null },
        backgroundIntensity: { value: 1 },
      },
      vertexShader: Ve.background_vert,
      fragmentShader: Ve.background_frag,
    },
    backgroundCube: {
      uniforms: {
        envMap: { value: null },
        backgroundBlurriness: { value: 0 },
        backgroundIntensity: { value: 1 },
        backgroundRotation: { value: new Ne() },
      },
      vertexShader: Ve.backgroundCube_vert,
      fragmentShader: Ve.backgroundCube_frag,
    },
    cube: {
      uniforms: {
        tCube: { value: null },
        tFlip: { value: -1 },
        opacity: { value: 1 },
      },
      vertexShader: Ve.cube_vert,
      fragmentShader: Ve.cube_frag,
    },
    equirect: {
      uniforms: { tEquirect: { value: null } },
      vertexShader: Ve.equirect_vert,
      fragmentShader: Ve.equirect_frag,
    },
    distance: {
      uniforms: Pt([
        ue.common,
        ue.displacementmap,
        {
          referencePosition: { value: new U() },
          nearDistance: { value: 1 },
          farDistance: { value: 1e3 },
        },
      ]),
      vertexShader: Ve.distance_vert,
      fragmentShader: Ve.distance_frag,
    },
    shadow: {
      uniforms: Pt([
        ue.lights,
        ue.fog,
        { color: { value: new Pe(0) }, opacity: { value: 1 } },
      ]),
      vertexShader: Ve.shadow_vert,
      fragmentShader: Ve.shadow_frag,
    },
  };
_n.physical = {
  uniforms: Pt([
    _n.standard.uniforms,
    {
      clearcoat: { value: 0 },
      clearcoatMap: { value: null },
      clearcoatMapTransform: { value: new Ne() },
      clearcoatNormalMap: { value: null },
      clearcoatNormalMapTransform: { value: new Ne() },
      clearcoatNormalScale: { value: new Ye(1, 1) },
      clearcoatRoughness: { value: 0 },
      clearcoatRoughnessMap: { value: null },
      clearcoatRoughnessMapTransform: { value: new Ne() },
      dispersion: { value: 0 },
      iridescence: { value: 0 },
      iridescenceMap: { value: null },
      iridescenceMapTransform: { value: new Ne() },
      iridescenceIOR: { value: 1.3 },
      iridescenceThicknessMinimum: { value: 100 },
      iridescenceThicknessMaximum: { value: 400 },
      iridescenceThicknessMap: { value: null },
      iridescenceThicknessMapTransform: { value: new Ne() },
      sheen: { value: 0 },
      sheenColor: { value: new Pe(0) },
      sheenColorMap: { value: null },
      sheenColorMapTransform: { value: new Ne() },
      sheenRoughness: { value: 1 },
      sheenRoughnessMap: { value: null },
      sheenRoughnessMapTransform: { value: new Ne() },
      transmission: { value: 0 },
      transmissionMap: { value: null },
      transmissionMapTransform: { value: new Ne() },
      transmissionSamplerSize: { value: new Ye() },
      transmissionSamplerMap: { value: null },
      thickness: { value: 0 },
      thicknessMap: { value: null },
      thicknessMapTransform: { value: new Ne() },
      attenuationDistance: { value: 0 },
      attenuationColor: { value: new Pe(0) },
      specularColor: { value: new Pe(1, 1, 1) },
      specularColorMap: { value: null },
      specularColorMapTransform: { value: new Ne() },
      specularIntensity: { value: 1 },
      specularIntensityMap: { value: null },
      specularIntensityMapTransform: { value: new Ne() },
      anisotropyVector: { value: new Ye() },
      anisotropyMap: { value: null },
      anisotropyMapTransform: { value: new Ne() },
    },
  ]),
  vertexShader: Ve.meshphysical_vert,
  fragmentShader: Ve.meshphysical_frag,
};
var La = { r: 0, b: 0, g: 0 },
  lp = new ht(),
  uh = new Ne();
uh.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function cp(i, e, t, n, s, r) {
  let a = new Pe(0),
    o = s === !0 ? 0 : 1,
    c,
    l,
    u = null,
    d = 0,
    h = null;
  function p(M) {
    let T = M.isScene === !0 ? M.background : null;
    if (T && T.isTexture) {
      let E = M.backgroundBlurriness > 0;
      T = e.get(T, E);
    }
    return T;
  }
  function g(M) {
    let T = !1,
      E = p(M);
    E === null ? m(a, o) : E && E.isColor && (m(E, 1), (T = !0));
    let w = i.xr.getEnvironmentBlendMode();
    (w === "additive"
      ? t.buffers.color.setClear(0, 0, 0, 1, r)
      : w === "alpha-blend" && t.buffers.color.setClear(0, 0, 0, 0, r),
      (i.autoClear || T) &&
        (t.buffers.depth.setTest(!0),
        t.buffers.depth.setMask(!0),
        t.buffers.color.setMask(!0),
        i.clear(i.autoClearColor, i.autoClearDepth, i.autoClearStencil)));
  }
  function y(M, T) {
    let E = p(T);
    E && (E.isCubeTexture || E.mapping === bs)
      ? (l === void 0 &&
          ((l = new bt(
            new Bi(1, 1, 1),
            new Gt({
              name: "BackgroundCubeMaterial",
              uniforms: fi(_n.backgroundCube.uniforms),
              vertexShader: _n.backgroundCube.vertexShader,
              fragmentShader: _n.backgroundCube.fragmentShader,
              side: Dt,
              depthTest: !1,
              depthWrite: !1,
              fog: !1,
              allowOverride: !1,
            }),
          )),
          l.geometry.deleteAttribute("normal"),
          l.geometry.deleteAttribute("uv"),
          (l.onBeforeRender = function (w, b, R) {
            this.matrixWorld.copyPosition(R.matrixWorld);
          }),
          Object.defineProperty(l.material, "envMap", {
            get: function () {
              return this.uniforms.envMap.value;
            },
          }),
          n.update(l)),
        (l.material.uniforms.envMap.value = E),
        (l.material.uniforms.backgroundBlurriness.value =
          T.backgroundBlurriness),
        (l.material.uniforms.backgroundIntensity.value = T.backgroundIntensity),
        l.material.uniforms.backgroundRotation.value
          .setFromMatrix4(lp.makeRotationFromEuler(T.backgroundRotation))
          .transpose(),
        E.isCubeTexture &&
          E.isRenderTargetTexture === !1 &&
          l.material.uniforms.backgroundRotation.value.premultiply(uh),
        (l.material.toneMapped = Xe.getTransfer(E.colorSpace) !== Qe),
        (u !== E || d !== E.version || h !== i.toneMapping) &&
          ((l.material.needsUpdate = !0),
          (u = E),
          (d = E.version),
          (h = i.toneMapping)),
        l.layers.enableAll(),
        M.unshift(l, l.geometry, l.material, 0, 0, null))
      : E &&
        E.isTexture &&
        (c === void 0 &&
          ((c = new bt(
            new hi(2, 2),
            new Gt({
              name: "BackgroundMaterial",
              uniforms: fi(_n.background.uniforms),
              vertexShader: _n.background.vertexShader,
              fragmentShader: _n.background.fragmentShader,
              side: An,
              depthTest: !1,
              depthWrite: !1,
              fog: !1,
              allowOverride: !1,
            }),
          )),
          c.geometry.deleteAttribute("normal"),
          Object.defineProperty(c.material, "map", {
            get: function () {
              return this.uniforms.t2D.value;
            },
          }),
          n.update(c)),
        (c.material.uniforms.t2D.value = E),
        (c.material.uniforms.backgroundIntensity.value = T.backgroundIntensity),
        (c.material.toneMapped = Xe.getTransfer(E.colorSpace) !== Qe),
        E.matrixAutoUpdate === !0 && E.updateMatrix(),
        c.material.uniforms.uvTransform.value.copy(E.matrix),
        (u !== E || d !== E.version || h !== i.toneMapping) &&
          ((c.material.needsUpdate = !0),
          (u = E),
          (d = E.version),
          (h = i.toneMapping)),
        c.layers.enableAll(),
        M.unshift(c, c.geometry, c.material, 0, 0, null));
  }
  function m(M, T) {
    (M.getRGB(La, $o(i)), t.buffers.color.setClear(La.r, La.g, La.b, T, r));
  }
  function f() {
    (l !== void 0 && (l.geometry.dispose(), l.material.dispose(), (l = void 0)),
      c !== void 0 &&
        (c.geometry.dispose(), c.material.dispose(), (c = void 0)));
  }
  return {
    getClearColor: function () {
      return a;
    },
    setClearColor: function (M, T = 1) {
      (a.set(M), (o = T), m(a, o));
    },
    getClearAlpha: function () {
      return o;
    },
    setClearAlpha: function (M) {
      ((o = M), m(a, o));
    },
    render: g,
    addToRenderList: y,
    dispose: f,
  };
}
function hp(i, e) {
  let t = i.getParameter(i.MAX_VERTEX_ATTRIBS),
    n = {},
    s = h(null),
    r = s,
    a = !1;
  function o(C, O, X, W, D) {
    let V = !1,
      k = d(C, W, X, O);
    (r !== k && ((r = k), l(r.object)),
      (V = p(C, W, X, D)),
      V && g(C, W, X, D),
      D !== null && e.update(D, i.ELEMENT_ARRAY_BUFFER),
      (V || a) &&
        ((a = !1),
        E(C, O, X, W),
        D !== null && i.bindBuffer(i.ELEMENT_ARRAY_BUFFER, e.get(D).buffer)));
  }
  function c() {
    return i.createVertexArray();
  }
  function l(C) {
    return i.bindVertexArray(C);
  }
  function u(C) {
    return i.deleteVertexArray(C);
  }
  function d(C, O, X, W) {
    let D = W.wireframe === !0,
      V = n[O.id];
    V === void 0 && ((V = {}), (n[O.id] = V));
    let k = C.isInstancedMesh === !0 ? C.id : 0,
      j = V[k];
    j === void 0 && ((j = {}), (V[k] = j));
    let ee = j[X.id];
    ee === void 0 && ((ee = {}), (j[X.id] = ee));
    let ce = ee[D];
    return (ce === void 0 && ((ce = h(c())), (ee[D] = ce)), ce);
  }
  function h(C) {
    let O = [],
      X = [],
      W = [];
    for (let D = 0; D < t; D++) ((O[D] = 0), (X[D] = 0), (W[D] = 0));
    return {
      geometry: null,
      program: null,
      wireframe: !1,
      newAttributes: O,
      enabledAttributes: X,
      attributeDivisors: W,
      object: C,
      attributes: {},
      index: null,
    };
  }
  function p(C, O, X, W) {
    let D = r.attributes,
      V = O.attributes,
      k = 0,
      j = X.getAttributes();
    for (let ee in j)
      if (j[ee].location >= 0) {
        let ye = D[ee],
          Me = V[ee];
        if (
          (Me === void 0 &&
            (ee === "instanceMatrix" &&
              C.instanceMatrix &&
              (Me = C.instanceMatrix),
            ee === "instanceColor" &&
              C.instanceColor &&
              (Me = C.instanceColor)),
          ye === void 0 || ye.attribute !== Me || (Me && ye.data !== Me.data))
        )
          return !0;
        k++;
      }
    return r.attributesNum !== k || r.index !== W;
  }
  function g(C, O, X, W) {
    let D = {},
      V = O.attributes,
      k = 0,
      j = X.getAttributes();
    for (let ee in j)
      if (j[ee].location >= 0) {
        let ye = V[ee];
        ye === void 0 &&
          (ee === "instanceMatrix" &&
            C.instanceMatrix &&
            (ye = C.instanceMatrix),
          ee === "instanceColor" && C.instanceColor && (ye = C.instanceColor));
        let Me = {};
        ((Me.attribute = ye),
          ye && ye.data && (Me.data = ye.data),
          (D[ee] = Me),
          k++);
      }
    ((r.attributes = D), (r.attributesNum = k), (r.index = W));
  }
  function y() {
    let C = r.newAttributes;
    for (let O = 0, X = C.length; O < X; O++) C[O] = 0;
  }
  function m(C) {
    f(C, 0);
  }
  function f(C, O) {
    let X = r.newAttributes,
      W = r.enabledAttributes,
      D = r.attributeDivisors;
    ((X[C] = 1),
      W[C] === 0 && (i.enableVertexAttribArray(C), (W[C] = 1)),
      D[C] !== O && (i.vertexAttribDivisor(C, O), (D[C] = O)));
  }
  function M() {
    let C = r.newAttributes,
      O = r.enabledAttributes;
    for (let X = 0, W = O.length; X < W; X++)
      O[X] !== C[X] && (i.disableVertexAttribArray(X), (O[X] = 0));
  }
  function T(C, O, X, W, D, V, k) {
    k === !0
      ? i.vertexAttribIPointer(C, O, X, D, V)
      : i.vertexAttribPointer(C, O, X, W, D, V);
  }
  function E(C, O, X, W) {
    y();
    let D = W.attributes,
      V = X.getAttributes(),
      k = O.defaultAttributeValues;
    for (let j in V) {
      let ee = V[j];
      if (ee.location >= 0) {
        let ce = D[j];
        if (
          (ce === void 0 &&
            (j === "instanceMatrix" &&
              C.instanceMatrix &&
              (ce = C.instanceMatrix),
            j === "instanceColor" && C.instanceColor && (ce = C.instanceColor)),
          ce !== void 0)
        ) {
          let ye = ce.normalized,
            Me = ce.itemSize,
            We = e.get(ce);
          if (We === void 0) continue;
          let $e = We.buffer,
            De = We.type,
            $ = We.bytesPerElement,
            de = De === i.INT || De === i.UNSIGNED_INT || ce.gpuType === Yr;
          if (ce.isInterleavedBufferAttribute) {
            let te = ce.data,
              Ae = te.stride,
              Le = ce.offset;
            if (te.isInstancedInterleavedBuffer) {
              for (let Re = 0; Re < ee.locationSize; Re++)
                f(ee.location + Re, te.meshPerAttribute);
              C.isInstancedMesh !== !0 &&
                W._maxInstanceCount === void 0 &&
                (W._maxInstanceCount = te.meshPerAttribute * te.count);
            } else
              for (let Re = 0; Re < ee.locationSize; Re++) m(ee.location + Re);
            i.bindBuffer(i.ARRAY_BUFFER, $e);
            for (let Re = 0; Re < ee.locationSize; Re++)
              T(
                ee.location + Re,
                Me / ee.locationSize,
                De,
                ye,
                Ae * $,
                (Le + (Me / ee.locationSize) * Re) * $,
                de,
              );
          } else {
            if (ce.isInstancedBufferAttribute) {
              for (let te = 0; te < ee.locationSize; te++)
                f(ee.location + te, ce.meshPerAttribute);
              C.isInstancedMesh !== !0 &&
                W._maxInstanceCount === void 0 &&
                (W._maxInstanceCount = ce.meshPerAttribute * ce.count);
            } else
              for (let te = 0; te < ee.locationSize; te++) m(ee.location + te);
            i.bindBuffer(i.ARRAY_BUFFER, $e);
            for (let te = 0; te < ee.locationSize; te++)
              T(
                ee.location + te,
                Me / ee.locationSize,
                De,
                ye,
                Me * $,
                (Me / ee.locationSize) * te * $,
                de,
              );
          }
        } else if (k !== void 0) {
          let ye = k[j];
          if (ye !== void 0)
            switch (ye.length) {
              case 2:
                i.vertexAttrib2fv(ee.location, ye);
                break;
              case 3:
                i.vertexAttrib3fv(ee.location, ye);
                break;
              case 4:
                i.vertexAttrib4fv(ee.location, ye);
                break;
              default:
                i.vertexAttrib1fv(ee.location, ye);
            }
        }
      }
    }
    M();
  }
  function w() {
    A();
    for (let C in n) {
      let O = n[C];
      for (let X in O) {
        let W = O[X];
        for (let D in W) {
          let V = W[D];
          for (let k in V) (u(V[k].object), delete V[k]);
          delete W[D];
        }
      }
      delete n[C];
    }
  }
  function b(C) {
    if (n[C.id] === void 0) return;
    let O = n[C.id];
    for (let X in O) {
      let W = O[X];
      for (let D in W) {
        let V = W[D];
        for (let k in V) (u(V[k].object), delete V[k]);
        delete W[D];
      }
    }
    delete n[C.id];
  }
  function R(C) {
    for (let O in n) {
      let X = n[O];
      for (let W in X) {
        let D = X[W];
        if (D[C.id] === void 0) continue;
        let V = D[C.id];
        for (let k in V) (u(V[k].object), delete V[k]);
        delete D[C.id];
      }
    }
  }
  function x(C) {
    for (let O in n) {
      let X = n[O],
        W = C.isInstancedMesh === !0 ? C.id : 0,
        D = X[W];
      if (D !== void 0) {
        for (let V in D) {
          let k = D[V];
          for (let j in k) (u(k[j].object), delete k[j]);
          delete D[V];
        }
        (delete X[W], Object.keys(X).length === 0 && delete n[O]);
      }
    }
  }
  function A() {
    (N(), (a = !0), r !== s && ((r = s), l(r.object)));
  }
  function N() {
    ((s.geometry = null), (s.program = null), (s.wireframe = !1));
  }
  return {
    setup: o,
    reset: A,
    resetDefaultState: N,
    dispose: w,
    releaseStatesOfGeometry: b,
    releaseStatesOfObject: x,
    releaseStatesOfProgram: R,
    initAttributes: y,
    enableAttribute: m,
    disableUnusedAttributes: M,
  };
}
function up(i, e, t) {
  let n;
  function s(c) {
    n = c;
  }
  function r(c, l) {
    (i.drawArrays(n, c, l), t.update(l, n, 1));
  }
  function a(c, l, u) {
    u !== 0 && (i.drawArraysInstanced(n, c, l, u), t.update(l, n, u));
  }
  function o(c, l, u) {
    if (u === 0) return;
    e.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n, c, 0, l, 0, u);
    let h = 0;
    for (let p = 0; p < u; p++) h += l[p];
    t.update(h, n, 1);
  }
  ((this.setMode = s),
    (this.render = r),
    (this.renderInstances = a),
    (this.renderMultiDraw = o));
}
function dp(i, e, t, n) {
  let s;
  function r() {
    if (s !== void 0) return s;
    if (e.has("EXT_texture_filter_anisotropic") === !0) {
      let R = e.get("EXT_texture_filter_anisotropic");
      s = i.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT);
    } else s = 0;
    return s;
  }
  function a(R) {
    return !(
      R !== Yt &&
      n.convert(R) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_FORMAT)
    );
  }
  function o(R) {
    let x =
      R === mn &&
      (e.has("EXT_color_buffer_half_float") || e.has("EXT_color_buffer_float"));
    return !(
      R !== Ft &&
      n.convert(R) !== i.getParameter(i.IMPLEMENTATION_COLOR_READ_TYPE) &&
      R !== tn &&
      !x
    );
  }
  function c(R) {
    if (R === "highp") {
      if (
        i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.HIGH_FLOAT).precision >
          0 &&
        i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.HIGH_FLOAT).precision >
          0
      )
        return "highp";
      R = "mediump";
    }
    return R === "mediump" &&
      i.getShaderPrecisionFormat(i.VERTEX_SHADER, i.MEDIUM_FLOAT).precision >
        0 &&
      i.getShaderPrecisionFormat(i.FRAGMENT_SHADER, i.MEDIUM_FLOAT).precision >
        0
      ? "mediump"
      : "lowp";
  }
  let l = t.precision !== void 0 ? t.precision : "highp",
    u = c(l);
  u !== l &&
    (Ce("WebGLRenderer:", l, "not supported, using", u, "instead."), (l = u));
  let d = t.logarithmicDepthBuffer === !0,
    h = t.reversedDepthBuffer === !0 && e.has("EXT_clip_control");
  t.reversedDepthBuffer === !0 &&
    h === !1 &&
    Ce(
      "WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.",
    );
  let p = i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),
    g = i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),
    y = i.getParameter(i.MAX_TEXTURE_SIZE),
    m = i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),
    f = i.getParameter(i.MAX_VERTEX_ATTRIBS),
    M = i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),
    T = i.getParameter(i.MAX_VARYING_VECTORS),
    E = i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),
    w = i.getParameter(i.MAX_SAMPLES),
    b = i.getParameter(i.SAMPLES);
  return {
    isWebGL2: !0,
    getMaxAnisotropy: r,
    getMaxPrecision: c,
    textureFormatReadable: a,
    textureTypeReadable: o,
    precision: l,
    logarithmicDepthBuffer: d,
    reversedDepthBuffer: h,
    maxTextures: p,
    maxVertexTextures: g,
    maxTextureSize: y,
    maxCubemapSize: m,
    maxAttributes: f,
    maxVertexUniforms: M,
    maxVaryings: T,
    maxFragmentUniforms: E,
    maxSamples: w,
    samples: b,
  };
}
function fp(i) {
  let e = this,
    t = null,
    n = 0,
    s = !1,
    r = !1,
    a = new on(),
    o = new Ne(),
    c = { value: null, needsUpdate: !1 };
  ((this.uniform = c),
    (this.numPlanes = 0),
    (this.numIntersection = 0),
    (this.init = function (d, h) {
      let p = d.length !== 0 || h || n !== 0 || s;
      return ((s = h), (n = d.length), p);
    }),
    (this.beginShadows = function () {
      ((r = !0), u(null));
    }),
    (this.endShadows = function () {
      r = !1;
    }),
    (this.setGlobalState = function (d, h) {
      t = u(d, h, 0);
    }),
    (this.setState = function (d, h, p) {
      let g = d.clippingPlanes,
        y = d.clipIntersection,
        m = d.clipShadows,
        f = i.get(d);
      if (!s || g === null || g.length === 0 || (r && !m)) r ? u(null) : l();
      else {
        let M = r ? 0 : n,
          T = M * 4,
          E = f.clippingState || null;
        ((c.value = E), (E = u(g, h, T, p)));
        for (let w = 0; w !== T; ++w) E[w] = t[w];
        ((f.clippingState = E),
          (this.numIntersection = y ? this.numPlanes : 0),
          (this.numPlanes += M));
      }
    }));
  function l() {
    (c.value !== t && ((c.value = t), (c.needsUpdate = n > 0)),
      (e.numPlanes = n),
      (e.numIntersection = 0));
  }
  function u(d, h, p, g) {
    let y = d !== null ? d.length : 0,
      m = null;
    if (y !== 0) {
      if (((m = c.value), g !== !0 || m === null)) {
        let f = p + y * 4,
          M = h.matrixWorldInverse;
        (o.getNormalMatrix(M),
          (m === null || m.length < f) && (m = new Float32Array(f)));
        for (let T = 0, E = p; T !== y; ++T, E += 4)
          (a.copy(d[T]).applyMatrix4(M, o),
            a.normal.toArray(m, E),
            (m[E + 3] = a.constant));
      }
      ((c.value = m), (c.needsUpdate = !0));
    }
    return ((e.numPlanes = y), (e.numIntersection = 0), m);
  }
}
var Kn = 4,
  Gc = [0.125, 0.215, 0.35, 0.446, 0.526, 0.582],
  pi = 20,
  pp = 256,
  Ls = new ki(),
  Hc = new Pe(),
  el = null,
  tl = 0,
  nl = 0,
  il = !1,
  mp = new U(),
  Ua = class {
    constructor(e) {
      ((this._renderer = e),
        (this._pingPongRenderTarget = null),
        (this._lodMax = 0),
        (this._cubeSize = 0),
        (this._sizeLods = []),
        (this._sigmas = []),
        (this._lodMeshes = []),
        (this._backgroundBox = null),
        (this._cubemapMaterial = null),
        (this._equirectMaterial = null),
        (this._blurMaterial = null),
        (this._ggxMaterial = null));
    }
    fromScene(e, t = 0, n = 0.1, s = 100, r = {}) {
      let { size: a = 256, position: o = mp } = r;
      ((el = this._renderer.getRenderTarget()),
        (tl = this._renderer.getActiveCubeFace()),
        (nl = this._renderer.getActiveMipmapLevel()),
        (il = this._renderer.xr.enabled),
        (this._renderer.xr.enabled = !1),
        this._setSize(a));
      let c = this._allocateTargets();
      return (
        (c.depthBuffer = !0),
        this._sceneToCubeUV(e, n, s, c, o),
        t > 0 && this._blur(c, 0, 0, t),
        this._applyPMREM(c),
        this._cleanup(c),
        c
      );
    }
    fromEquirectangular(e, t = null) {
      return this._fromTexture(e, t);
    }
    fromCubemap(e, t = null) {
      return this._fromTexture(e, t);
    }
    compileCubemapShader() {
      this._cubemapMaterial === null &&
        ((this._cubemapMaterial = qc()),
        this._compileMaterial(this._cubemapMaterial));
    }
    compileEquirectangularShader() {
      this._equirectMaterial === null &&
        ((this._equirectMaterial = Xc()),
        this._compileMaterial(this._equirectMaterial));
    }
    dispose() {
      (this._dispose(),
        this._cubemapMaterial !== null && this._cubemapMaterial.dispose(),
        this._equirectMaterial !== null && this._equirectMaterial.dispose(),
        this._backgroundBox !== null &&
          (this._backgroundBox.geometry.dispose(),
          this._backgroundBox.material.dispose()));
    }
    _setSize(e) {
      ((this._lodMax = Math.floor(Math.log2(e))),
        (this._cubeSize = Math.pow(2, this._lodMax)));
    }
    _dispose() {
      (this._blurMaterial !== null && this._blurMaterial.dispose(),
        this._ggxMaterial !== null && this._ggxMaterial.dispose(),
        this._pingPongRenderTarget !== null &&
          this._pingPongRenderTarget.dispose());
      for (let e = 0; e < this._lodMeshes.length; e++)
        this._lodMeshes[e].geometry.dispose();
    }
    _cleanup(e) {
      (this._renderer.setRenderTarget(el, tl, nl),
        (this._renderer.xr.enabled = il),
        (e.scissorTest = !1),
        Yi(e, 0, 0, e.width, e.height));
    }
    _fromTexture(e, t) {
      (e.mapping === Yn || e.mapping === di
        ? this._setSize(
            e.image.length === 0
              ? 16
              : e.image[0].width || e.image[0].image.width,
          )
        : this._setSize(e.image.width / 4),
        (el = this._renderer.getRenderTarget()),
        (tl = this._renderer.getActiveCubeFace()),
        (nl = this._renderer.getActiveMipmapLevel()),
        (il = this._renderer.xr.enabled),
        (this._renderer.xr.enabled = !1));
      let n = t || this._allocateTargets();
      return (
        this._textureToCubeUV(e, n),
        this._applyPMREM(n),
        this._cleanup(n),
        n
      );
    }
    _allocateTargets() {
      let e = 3 * Math.max(this._cubeSize, 112),
        t = 4 * this._cubeSize,
        n = {
          magFilter: Tt,
          minFilter: Tt,
          generateMipmaps: !1,
          type: mn,
          format: Yt,
          colorSpace: ss,
          depthBuffer: !1,
        },
        s = Wc(e, t, n);
      if (
        this._pingPongRenderTarget === null ||
        this._pingPongRenderTarget.width !== e ||
        this._pingPongRenderTarget.height !== t
      ) {
        (this._pingPongRenderTarget !== null && this._dispose(),
          (this._pingPongRenderTarget = Wc(e, t, n)));
        let { _lodMax: r } = this;
        (({
          lodMeshes: this._lodMeshes,
          sizeLods: this._sizeLods,
          sigmas: this._sigmas,
        } = gp(r)),
          (this._blurMaterial = xp(r, e, t)),
          (this._ggxMaterial = _p(r, e, t)));
      }
      return s;
    }
    _compileMaterial(e) {
      let t = new bt(new At(), e);
      this._renderer.compile(t, Ls);
    }
    _sceneToCubeUV(e, t, n, s, r) {
      let c = new It(90, 1, t, n),
        l = [1, -1, 1, 1, 1, 1],
        u = [1, 1, 1, -1, -1, -1],
        d = this._renderer,
        h = d.autoClear,
        p = d.toneMapping;
      (d.getClearColor(Hc),
        (d.toneMapping = Qt),
        (d.autoClear = !1),
        d.state.buffers.depth.getReversed() &&
          (d.setRenderTarget(s), d.clearDepth(), d.setRenderTarget(null)),
        this._backgroundBox === null &&
          (this._backgroundBox = new bt(
            new Bi(),
            new oi({
              name: "PMREM.Background",
              side: Dt,
              depthWrite: !1,
              depthTest: !1,
            }),
          )));
      let y = this._backgroundBox,
        m = y.material,
        f = !1,
        M = e.background;
      M
        ? M.isColor && (m.color.copy(M), (e.background = null), (f = !0))
        : (m.color.copy(Hc), (f = !0));
      for (let T = 0; T < 6; T++) {
        let E = T % 3;
        E === 0
          ? (c.up.set(0, l[T], 0),
            c.position.set(r.x, r.y, r.z),
            c.lookAt(r.x + u[T], r.y, r.z))
          : E === 1
            ? (c.up.set(0, 0, l[T]),
              c.position.set(r.x, r.y, r.z),
              c.lookAt(r.x, r.y + u[T], r.z))
            : (c.up.set(0, l[T], 0),
              c.position.set(r.x, r.y, r.z),
              c.lookAt(r.x, r.y, r.z + u[T]));
        let w = this._cubeSize;
        (Yi(s, E * w, T > 2 ? w : 0, w, w),
          d.setRenderTarget(s),
          f && d.render(y, c),
          d.render(e, c));
      }
      ((d.toneMapping = p), (d.autoClear = h), (e.background = M));
    }
    _textureToCubeUV(e, t) {
      let n = this._renderer,
        s = e.mapping === Yn || e.mapping === di;
      s
        ? (this._cubemapMaterial === null && (this._cubemapMaterial = qc()),
          (this._cubemapMaterial.uniforms.flipEnvMap.value =
            e.isRenderTargetTexture === !1 ? -1 : 1))
        : this._equirectMaterial === null && (this._equirectMaterial = Xc());
      let r = s ? this._cubemapMaterial : this._equirectMaterial,
        a = this._lodMeshes[0];
      a.material = r;
      let o = r.uniforms;
      o.envMap.value = e;
      let c = this._cubeSize;
      (Yi(t, 0, 0, 3 * c, 2 * c), n.setRenderTarget(t), n.render(a, Ls));
    }
    _applyPMREM(e) {
      let t = this._renderer,
        n = t.autoClear;
      t.autoClear = !1;
      let s = this._lodMeshes.length;
      for (let r = 1; r < s; r++) this._applyGGXFilter(e, r - 1, r);
      t.autoClear = n;
    }
    _applyGGXFilter(e, t, n) {
      let s = this._renderer,
        r = this._pingPongRenderTarget,
        a = this._ggxMaterial,
        o = this._lodMeshes[n];
      o.material = a;
      let c = a.uniforms,
        l = n / (this._lodMeshes.length - 1),
        u = t / (this._lodMeshes.length - 1),
        d = Math.sqrt(l * l - u * u),
        h = 0 + l * 1.25,
        p = d * h,
        { _lodMax: g } = this,
        y = this._sizeLods[n],
        m = 3 * y * (n > g - Kn ? n - g + Kn : 0),
        f = 4 * (this._cubeSize - y);
      ((c.envMap.value = e.texture),
        (c.roughness.value = p),
        (c.mipInt.value = g - t),
        Yi(r, m, f, 3 * y, 2 * y),
        s.setRenderTarget(r),
        s.render(o, Ls),
        (c.envMap.value = r.texture),
        (c.roughness.value = 0),
        (c.mipInt.value = g - n),
        Yi(e, m, f, 3 * y, 2 * y),
        s.setRenderTarget(e),
        s.render(o, Ls));
    }
    _blur(e, t, n, s, r) {
      let a = this._pingPongRenderTarget;
      (this._halfBlur(e, a, t, n, s, "latitudinal", r),
        this._halfBlur(a, e, n, n, s, "longitudinal", r));
    }
    _halfBlur(e, t, n, s, r, a, o) {
      let c = this._renderer,
        l = this._blurMaterial;
      a !== "latitudinal" &&
        a !== "longitudinal" &&
        Ie("blur direction must be either latitudinal or longitudinal!");
      let u = 3,
        d = this._lodMeshes[s];
      d.material = l;
      let h = l.uniforms,
        p = this._sizeLods[n] - 1,
        g = isFinite(r) ? Math.PI / (2 * p) : (2 * Math.PI) / (2 * pi - 1),
        y = r / g,
        m = isFinite(r) ? 1 + Math.floor(u * y) : pi;
      m > pi &&
        Ce(
          `sigmaRadians, ${r}, is too large and will clip, as it requested ${m} samples when the maximum is set to ${pi}`,
        );
      let f = [],
        M = 0;
      for (let R = 0; R < pi; ++R) {
        let x = R / y,
          A = Math.exp((-x * x) / 2);
        (f.push(A), R === 0 ? (M += A) : R < m && (M += 2 * A));
      }
      for (let R = 0; R < f.length; R++) f[R] = f[R] / M;
      ((h.envMap.value = e.texture),
        (h.samples.value = m),
        (h.weights.value = f),
        (h.latitudinal.value = a === "latitudinal"),
        o && (h.poleAxis.value = o));
      let { _lodMax: T } = this;
      ((h.dTheta.value = g), (h.mipInt.value = T - n));
      let E = this._sizeLods[s],
        w = 3 * E * (s > T - Kn ? s - T + Kn : 0),
        b = 4 * (this._cubeSize - E);
      (Yi(t, w, b, 3 * E, 2 * E), c.setRenderTarget(t), c.render(d, Ls));
    }
  };
function gp(i) {
  let e = [],
    t = [],
    n = [],
    s = i,
    r = i - Kn + 1 + Gc.length;
  for (let a = 0; a < r; a++) {
    let o = Math.pow(2, s);
    e.push(o);
    let c = 1 / o;
    (a > i - Kn ? (c = Gc[a - i + Kn - 1]) : a === 0 && (c = 0), t.push(c));
    let l = 1 / (o - 2),
      u = -l,
      d = 1 + l,
      h = [u, u, d, u, d, d, u, u, d, d, u, d],
      p = 6,
      g = 6,
      y = 3,
      m = 2,
      f = 1,
      M = new Float32Array(y * g * p),
      T = new Float32Array(m * g * p),
      E = new Float32Array(f * g * p);
    for (let b = 0; b < p; b++) {
      let R = ((b % 3) * 2) / 3 - 1,
        x = b > 2 ? 0 : -1,
        A = [
          R,
          x,
          0,
          R + 2 / 3,
          x,
          0,
          R + 2 / 3,
          x + 1,
          0,
          R,
          x,
          0,
          R + 2 / 3,
          x + 1,
          0,
          R,
          x + 1,
          0,
        ];
      (M.set(A, y * g * b), T.set(h, m * g * b));
      let N = [b, b, b, b, b, b];
      E.set(N, f * g * b);
    }
    let w = new At();
    (w.setAttribute("position", new Vt(M, y)),
      w.setAttribute("uv", new Vt(T, m)),
      w.setAttribute("faceIndex", new Vt(E, f)),
      n.push(new bt(w, null)),
      s > Kn && s--);
  }
  return { lodMeshes: n, sizeLods: e, sigmas: t };
}
function Wc(i, e, t) {
  let n = new kt(i, e, t);
  return (
    (n.texture.mapping = bs),
    (n.texture.name = "PMREM.cubeUv"),
    (n.scissorTest = !0),
    n
  );
}
function Yi(i, e, t, n, s) {
  (i.viewport.set(e, t, n, s), i.scissor.set(e, t, n, s));
}
function _p(i, e, t) {
  return new Gt({
    name: "PMREMGGXConvolution",
    defines: {
      GGX_SAMPLES: pp,
      CUBEUV_TEXEL_WIDTH: 1 / e,
      CUBEUV_TEXEL_HEIGHT: 1 / t,
      CUBEUV_MAX_MIP: `${i}.0`,
    },
    uniforms: {
      envMap: { value: null },
      roughness: { value: 0 },
      mipInt: { value: 0 },
    },
    vertexShader: Oa(),
    fragmentShader: `

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,
    blending: pn,
    depthTest: !1,
    depthWrite: !1,
  });
}
function xp(i, e, t) {
  let n = new Float32Array(pi),
    s = new U(0, 1, 0);
  return new Gt({
    name: "SphericalGaussianBlur",
    defines: {
      n: pi,
      CUBEUV_TEXEL_WIDTH: 1 / e,
      CUBEUV_TEXEL_HEIGHT: 1 / t,
      CUBEUV_MAX_MIP: `${i}.0`,
    },
    uniforms: {
      envMap: { value: null },
      samples: { value: 1 },
      weights: { value: n },
      latitudinal: { value: !1 },
      dTheta: { value: 0 },
      mipInt: { value: 0 },
      poleAxis: { value: s },
    },
    vertexShader: Oa(),
    fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,
    blending: pn,
    depthTest: !1,
    depthWrite: !1,
  });
}
function Xc() {
  return new Gt({
    name: "EquirectangularToCubeUV",
    uniforms: { envMap: { value: null } },
    vertexShader: Oa(),
    fragmentShader: `

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,
    blending: pn,
    depthTest: !1,
    depthWrite: !1,
  });
}
function qc() {
  return new Gt({
    name: "CubemapToCubeUV",
    uniforms: { envMap: { value: null }, flipEnvMap: { value: -1 } },
    vertexShader: Oa(),
    fragmentShader: `

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,
    blending: pn,
    depthTest: !1,
    depthWrite: !1,
  });
}
function Oa() {
  return `

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`;
}
var Na = class extends kt {
  constructor(e = 1, t = {}) {
    (super(e, e, t), (this.isWebGLCubeRenderTarget = !0));
    let n = { width: e, height: e, depth: 1 },
      s = [n, n, n, n, n, n];
    ((this.texture = new us(s)),
      this._setTextureOptions(t),
      (this.texture.isRenderTargetTexture = !0));
  }
  fromEquirectangularTexture(e, t) {
    ((this.texture.type = t.type),
      (this.texture.colorSpace = t.colorSpace),
      (this.texture.generateMipmaps = t.generateMipmaps),
      (this.texture.minFilter = t.minFilter),
      (this.texture.magFilter = t.magFilter));
    let n = {
        uniforms: { tEquirect: { value: null } },
        vertexShader: `

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,
        fragmentShader: `

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`,
      },
      s = new Bi(5, 5, 5),
      r = new Gt({
        name: "CubemapFromEquirect",
        uniforms: fi(n.uniforms),
        vertexShader: n.vertexShader,
        fragmentShader: n.fragmentShader,
        side: Dt,
        blending: pn,
      });
    r.uniforms.tEquirect.value = t;
    let a = new bt(s, r),
      o = t.minFilter;
    return (
      t.minFilter === Zn && (t.minFilter = Tt),
      new Vr(1, 10, this).update(e, a),
      (t.minFilter = o),
      a.geometry.dispose(),
      a.material.dispose(),
      this
    );
  }
  clear(e, t = !0, n = !0, s = !0) {
    let r = e.getRenderTarget();
    for (let a = 0; a < 6; a++) (e.setRenderTarget(this, a), e.clear(t, n, s));
    e.setRenderTarget(r);
  }
};
function vp(i) {
  let e = new WeakMap(),
    t = new WeakMap(),
    n = null;
  function s(h, p = !1) {
    return h == null ? null : p ? a(h) : r(h);
  }
  function r(h) {
    if (h && h.isTexture) {
      let p = h.mapping;
      if (p === Wr || p === Xr)
        if (e.has(h)) {
          let g = e.get(h).texture;
          return o(g, h.mapping);
        } else {
          let g = h.image;
          if (g && g.height > 0) {
            let y = new Na(g.height);
            return (
              y.fromEquirectangularTexture(i, h),
              e.set(h, y),
              h.addEventListener("dispose", l),
              o(y.texture, h.mapping)
            );
          } else return null;
        }
    }
    return h;
  }
  function a(h) {
    if (h && h.isTexture) {
      let p = h.mapping,
        g = p === Wr || p === Xr,
        y = p === Yn || p === di;
      if (g || y) {
        let m = t.get(h),
          f = m !== void 0 ? m.texture.pmremVersion : 0;
        if (h.isRenderTargetTexture && h.pmremVersion !== f)
          return (
            n === null && (n = new Ua(i)),
            (m = g ? n.fromEquirectangular(h, m) : n.fromCubemap(h, m)),
            (m.texture.pmremVersion = h.pmremVersion),
            t.set(h, m),
            m.texture
          );
        if (m !== void 0) return m.texture;
        {
          let M = h.image;
          return (g && M && M.height > 0) || (y && M && c(M))
            ? (n === null && (n = new Ua(i)),
              (m = g ? n.fromEquirectangular(h) : n.fromCubemap(h)),
              (m.texture.pmremVersion = h.pmremVersion),
              t.set(h, m),
              h.addEventListener("dispose", u),
              m.texture)
            : null;
        }
      }
    }
    return h;
  }
  function o(h, p) {
    return (p === Wr ? (h.mapping = Yn) : p === Xr && (h.mapping = di), h);
  }
  function c(h) {
    let p = 0,
      g = 6;
    for (let y = 0; y < g; y++) h[y] !== void 0 && p++;
    return p === g;
  }
  function l(h) {
    let p = h.target;
    p.removeEventListener("dispose", l);
    let g = e.get(p);
    g !== void 0 && (e.delete(p), g.dispose());
  }
  function u(h) {
    let p = h.target;
    p.removeEventListener("dispose", u);
    let g = t.get(p);
    g !== void 0 && (t.delete(p), g.dispose());
  }
  function d() {
    ((e = new WeakMap()),
      (t = new WeakMap()),
      n !== null && (n.dispose(), (n = null)));
  }
  return { get: s, dispose: d };
}
function yp(i) {
  let e = {};
  function t(n) {
    if (e[n] !== void 0) return e[n];
    let s = i.getExtension(n);
    return ((e[n] = s), s);
  }
  return {
    has: function (n) {
      return t(n) !== null;
    },
    init: function () {
      (t("EXT_color_buffer_float"),
        t("WEBGL_clip_cull_distance"),
        t("OES_texture_float_linear"),
        t("EXT_color_buffer_half_float"),
        t("WEBGL_multisampled_render_to_texture"),
        t("WEBGL_render_shared_exponent"));
    },
    get: function (n) {
      let s = t(n);
      return (
        s === null && yr("WebGLRenderer: " + n + " extension not supported."),
        s
      );
    },
  };
}
function Mp(i, e, t, n) {
  let s = {},
    r = new WeakMap();
  function a(d) {
    let h = d.target;
    h.index !== null && e.remove(h.index);
    for (let g in h.attributes) e.remove(h.attributes[g]);
    (h.removeEventListener("dispose", a), delete s[h.id]);
    let p = r.get(h);
    (p && (e.remove(p), r.delete(h)),
      n.releaseStatesOfGeometry(h),
      h.isInstancedBufferGeometry === !0 && delete h._maxInstanceCount,
      t.memory.geometries--);
  }
  function o(d, h) {
    return (
      s[h.id] === !0 ||
        (h.addEventListener("dispose", a),
        (s[h.id] = !0),
        t.memory.geometries++),
      h
    );
  }
  function c(d) {
    let h = d.attributes;
    for (let p in h) e.update(h[p], i.ARRAY_BUFFER);
  }
  function l(d) {
    let h = [],
      p = d.index,
      g = d.attributes.position,
      y = 0;
    if (g === void 0) return;
    if (p !== null) {
      let M = p.array;
      y = p.version;
      for (let T = 0, E = M.length; T < E; T += 3) {
        let w = M[T + 0],
          b = M[T + 1],
          R = M[T + 2];
        h.push(w, b, b, R, R, w);
      }
    } else {
      let M = g.array;
      y = g.version;
      for (let T = 0, E = M.length / 3 - 1; T < E; T += 3) {
        let w = T + 0,
          b = T + 1,
          R = T + 2;
        h.push(w, b, b, R, R, w);
      }
    }
    let m = new (g.count >= 65535 ? hs : cs)(h, 1);
    m.version = y;
    let f = r.get(d);
    (f && e.remove(f), r.set(d, m));
  }
  function u(d) {
    let h = r.get(d);
    if (h) {
      let p = d.index;
      p !== null && h.version < p.version && l(d);
    } else l(d);
    return r.get(d);
  }
  return { get: o, update: c, getWireframeAttribute: u };
}
function Sp(i, e, t) {
  let n;
  function s(d) {
    n = d;
  }
  let r, a;
  function o(d) {
    ((r = d.type), (a = d.bytesPerElement));
  }
  function c(d, h) {
    (i.drawElements(n, h, r, d * a), t.update(h, n, 1));
  }
  function l(d, h, p) {
    p !== 0 && (i.drawElementsInstanced(n, h, r, d * a, p), t.update(h, n, p));
  }
  function u(d, h, p) {
    if (p === 0) return;
    e.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n, h, 0, r, d, 0, p);
    let y = 0;
    for (let m = 0; m < p; m++) y += h[m];
    t.update(y, n, 1);
  }
  ((this.setMode = s),
    (this.setIndex = o),
    (this.render = c),
    (this.renderInstances = l),
    (this.renderMultiDraw = u));
}
function bp(i) {
  let e = { geometries: 0, textures: 0 },
    t = { frame: 0, calls: 0, triangles: 0, points: 0, lines: 0 };
  function n(r, a, o) {
    switch ((t.calls++, a)) {
      case i.TRIANGLES:
        t.triangles += o * (r / 3);
        break;
      case i.LINES:
        t.lines += o * (r / 2);
        break;
      case i.LINE_STRIP:
        t.lines += o * (r - 1);
        break;
      case i.LINE_LOOP:
        t.lines += o * r;
        break;
      case i.POINTS:
        t.points += o * r;
        break;
      default:
        Ie("WebGLInfo: Unknown draw mode:", a);
        break;
    }
  }
  function s() {
    ((t.calls = 0), (t.triangles = 0), (t.points = 0), (t.lines = 0));
  }
  return {
    memory: e,
    render: t,
    programs: null,
    autoReset: !0,
    reset: s,
    update: n,
  };
}
function Ep(i, e, t) {
  let n = new WeakMap(),
    s = new ut();
  function r(a, o, c) {
    let l = a.morphTargetInfluences,
      u =
        o.morphAttributes.position ||
        o.morphAttributes.normal ||
        o.morphAttributes.color,
      d = u !== void 0 ? u.length : 0,
      h = n.get(o);
    if (h === void 0 || h.count !== d) {
      let A = function () {
        (R.dispose(), n.delete(o), o.removeEventListener("dispose", A));
      };
      h !== void 0 && h.texture.dispose();
      let p = o.morphAttributes.position !== void 0,
        g = o.morphAttributes.normal !== void 0,
        y = o.morphAttributes.color !== void 0,
        m = o.morphAttributes.position || [],
        f = o.morphAttributes.normal || [],
        M = o.morphAttributes.color || [],
        T = 0;
      (p === !0 && (T = 1), g === !0 && (T = 2), y === !0 && (T = 3));
      let E = o.attributes.position.count * T,
        w = 1;
      E > e.maxTextureSize &&
        ((w = Math.ceil(E / e.maxTextureSize)), (E = e.maxTextureSize));
      let b = new Float32Array(E * w * 4 * d),
        R = new os(b, E, w, d);
      ((R.type = tn), (R.needsUpdate = !0));
      let x = T * 4;
      for (let N = 0; N < d; N++) {
        let C = m[N],
          O = f[N],
          X = M[N],
          W = E * w * 4 * N;
        for (let D = 0; D < C.count; D++) {
          let V = D * x;
          (p === !0 &&
            (s.fromBufferAttribute(C, D),
            (b[W + V + 0] = s.x),
            (b[W + V + 1] = s.y),
            (b[W + V + 2] = s.z),
            (b[W + V + 3] = 0)),
            g === !0 &&
              (s.fromBufferAttribute(O, D),
              (b[W + V + 4] = s.x),
              (b[W + V + 5] = s.y),
              (b[W + V + 6] = s.z),
              (b[W + V + 7] = 0)),
            y === !0 &&
              (s.fromBufferAttribute(X, D),
              (b[W + V + 8] = s.x),
              (b[W + V + 9] = s.y),
              (b[W + V + 10] = s.z),
              (b[W + V + 11] = X.itemSize === 4 ? s.w : 1)));
        }
      }
      ((h = { count: d, texture: R, size: new Ye(E, w) }),
        n.set(o, h),
        o.addEventListener("dispose", A));
    }
    if (a.isInstancedMesh === !0 && a.morphTexture !== null)
      c.getUniforms().setValue(i, "morphTexture", a.morphTexture, t);
    else {
      let p = 0;
      for (let y = 0; y < l.length; y++) p += l[y];
      let g = o.morphTargetsRelative ? 1 : 1 - p;
      (c.getUniforms().setValue(i, "morphTargetBaseInfluence", g),
        c.getUniforms().setValue(i, "morphTargetInfluences", l));
    }
    (c.getUniforms().setValue(i, "morphTargetsTexture", h.texture, t),
      c.getUniforms().setValue(i, "morphTargetsTextureSize", h.size));
  }
  return { update: r };
}
function Tp(i, e, t, n, s) {
  let r = new WeakMap();
  function a(l) {
    let u = s.render.frame,
      d = l.geometry,
      h = e.get(l, d);
    if (
      (r.get(h) !== u && (e.update(h), r.set(h, u)),
      l.isInstancedMesh &&
        (l.hasEventListener("dispose", c) === !1 &&
          l.addEventListener("dispose", c),
        r.get(l) !== u &&
          (t.update(l.instanceMatrix, i.ARRAY_BUFFER),
          l.instanceColor !== null && t.update(l.instanceColor, i.ARRAY_BUFFER),
          r.set(l, u))),
      l.isSkinnedMesh)
    ) {
      let p = l.skeleton;
      r.get(p) !== u && (p.update(), r.set(p, u));
    }
    return h;
  }
  function o() {
    r = new WeakMap();
  }
  function c(l) {
    let u = l.target;
    (u.removeEventListener("dispose", c),
      n.releaseStatesOfObject(u),
      t.remove(u.instanceMatrix),
      u.instanceColor !== null && t.remove(u.instanceColor));
  }
  return { update: a, dispose: o };
}
var Ap = {
  [Lo]: "LINEAR_TONE_MAPPING",
  [Do]: "REINHARD_TONE_MAPPING",
  [Uo]: "CINEON_TONE_MAPPING",
  [No]: "ACES_FILMIC_TONE_MAPPING",
  [Oo]: "AGX_TONE_MAPPING",
  [Bo]: "NEUTRAL_TONE_MAPPING",
  [Fo]: "CUSTOM_TONE_MAPPING",
};
function wp(i, e, t, n, s) {
  let r = new kt(e, t, {
      type: i,
      depthBuffer: n,
      stencilBuffer: s,
      depthTexture: n ? new Rn(e, t) : void 0,
    }),
    a = new kt(e, t, { type: mn, depthBuffer: !1, stencilBuffer: !1 }),
    o = new At();
  (o.setAttribute("position", new ot([-1, 3, 0, -1, -1, 0, 3, -1, 0], 3)),
    o.setAttribute("uv", new ot([0, 2, 0, 0, 2, 0], 2)));
  let c = new Rr({
      uniforms: { tDiffuse: { value: null } },
      vertexShader: `
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,
      fragmentShader: `
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,
      depthTest: !1,
      depthWrite: !1,
    }),
    l = new bt(o, c),
    u = new ki(-1, 1, 1, -1, 0, 1),
    d = null,
    h = null,
    p = !1,
    g,
    y = null,
    m = [],
    f = !1;
  ((this.setSize = function (M, T) {
    (r.setSize(M, T), a.setSize(M, T));
    for (let E = 0; E < m.length; E++) {
      let w = m[E];
      w.setSize && w.setSize(M, T);
    }
  }),
    (this.setEffects = function (M) {
      ((m = M), (f = m.length > 0 && m[0].isRenderPass === !0));
      let T = r.width,
        E = r.height;
      for (let w = 0; w < m.length; w++) {
        let b = m[w];
        b.setSize && b.setSize(T, E);
      }
    }),
    (this.begin = function (M, T) {
      if (p || (M.toneMapping === Qt && m.length === 0)) return !1;
      if (((y = T), T !== null)) {
        let E = T.width,
          w = T.height;
        (r.width !== E || r.height !== w) && this.setSize(E, w);
      }
      return (
        f === !1 && M.setRenderTarget(r),
        (g = M.toneMapping),
        (M.toneMapping = Qt),
        !0
      );
    }),
    (this.hasRenderPass = function () {
      return f;
    }),
    (this.end = function (M, T) {
      ((M.toneMapping = g), (p = !0));
      let E = r,
        w = a;
      for (let b = 0; b < m.length; b++) {
        let R = m[b];
        if (R.enabled !== !1 && (R.render(M, w, E, T), R.needsSwap !== !1)) {
          let x = E;
          ((E = w), (w = x));
        }
      }
      if (d !== M.outputColorSpace || h !== M.toneMapping) {
        ((d = M.outputColorSpace),
          (h = M.toneMapping),
          (c.defines = {}),
          Xe.getTransfer(d) === Qe && (c.defines.SRGB_TRANSFER = ""));
        let b = Ap[h];
        (b && (c.defines[b] = ""), (c.needsUpdate = !0));
      }
      ((c.uniforms.tDiffuse.value = E.texture),
        M.setRenderTarget(y),
        M.render(l, u),
        (y = null),
        (p = !1));
    }),
    (this.isCompositing = function () {
      return p;
    }),
    (this.dispose = function () {
      (r.depthTexture && r.depthTexture.dispose(),
        r.dispose(),
        a.dispose(),
        o.dispose(),
        c.dispose());
    }));
}
var dh = new Ut(),
  al = new Rn(1, 1),
  fh = new os(),
  ph = new br(),
  mh = new us(),
  Yc = [],
  Zc = [],
  Jc = new Float32Array(16),
  $c = new Float32Array(9),
  Kc = new Float32Array(4);
function Ji(i, e, t) {
  let n = i[0];
  if (n <= 0 || n > 0) return i;
  let s = e * t,
    r = Yc[s];
  if ((r === void 0 && ((r = new Float32Array(s)), (Yc[s] = r)), e !== 0)) {
    n.toArray(r, 0);
    for (let a = 1, o = 0; a !== e; ++a) ((o += t), i[a].toArray(r, o));
  }
  return r;
}
function xt(i, e) {
  if (i.length !== e.length) return !1;
  for (let t = 0, n = i.length; t < n; t++) if (i[t] !== e[t]) return !1;
  return !0;
}
function vt(i, e) {
  for (let t = 0, n = e.length; t < n; t++) i[t] = e[t];
}
function Ba(i, e) {
  let t = Zc[e];
  t === void 0 && ((t = new Int32Array(e)), (Zc[e] = t));
  for (let n = 0; n !== e; ++n) t[n] = i.allocateTextureUnit();
  return t;
}
function Cp(i, e) {
  let t = this.cache;
  t[0] !== e && (i.uniform1f(this.addr, e), (t[0] = e));
}
function Rp(i, e) {
  let t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y) &&
      (i.uniform2f(this.addr, e.x, e.y), (t[0] = e.x), (t[1] = e.y));
  else {
    if (xt(t, e)) return;
    (i.uniform2fv(this.addr, e), vt(t, e));
  }
}
function Ip(i, e) {
  let t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) &&
      (i.uniform3f(this.addr, e.x, e.y, e.z),
      (t[0] = e.x),
      (t[1] = e.y),
      (t[2] = e.z));
  else if (e.r !== void 0)
    (t[0] !== e.r || t[1] !== e.g || t[2] !== e.b) &&
      (i.uniform3f(this.addr, e.r, e.g, e.b),
      (t[0] = e.r),
      (t[1] = e.g),
      (t[2] = e.b));
  else {
    if (xt(t, e)) return;
    (i.uniform3fv(this.addr, e), vt(t, e));
  }
}
function Pp(i, e) {
  let t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) &&
      (i.uniform4f(this.addr, e.x, e.y, e.z, e.w),
      (t[0] = e.x),
      (t[1] = e.y),
      (t[2] = e.z),
      (t[3] = e.w));
  else {
    if (xt(t, e)) return;
    (i.uniform4fv(this.addr, e), vt(t, e));
  }
}
function Lp(i, e) {
  let t = this.cache,
    n = e.elements;
  if (n === void 0) {
    if (xt(t, e)) return;
    (i.uniformMatrix2fv(this.addr, !1, e), vt(t, e));
  } else {
    if (xt(t, n)) return;
    (Kc.set(n), i.uniformMatrix2fv(this.addr, !1, Kc), vt(t, n));
  }
}
function Dp(i, e) {
  let t = this.cache,
    n = e.elements;
  if (n === void 0) {
    if (xt(t, e)) return;
    (i.uniformMatrix3fv(this.addr, !1, e), vt(t, e));
  } else {
    if (xt(t, n)) return;
    ($c.set(n), i.uniformMatrix3fv(this.addr, !1, $c), vt(t, n));
  }
}
function Up(i, e) {
  let t = this.cache,
    n = e.elements;
  if (n === void 0) {
    if (xt(t, e)) return;
    (i.uniformMatrix4fv(this.addr, !1, e), vt(t, e));
  } else {
    if (xt(t, n)) return;
    (Jc.set(n), i.uniformMatrix4fv(this.addr, !1, Jc), vt(t, n));
  }
}
function Np(i, e) {
  let t = this.cache;
  t[0] !== e && (i.uniform1i(this.addr, e), (t[0] = e));
}
function Fp(i, e) {
  let t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y) &&
      (i.uniform2i(this.addr, e.x, e.y), (t[0] = e.x), (t[1] = e.y));
  else {
    if (xt(t, e)) return;
    (i.uniform2iv(this.addr, e), vt(t, e));
  }
}
function Op(i, e) {
  let t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) &&
      (i.uniform3i(this.addr, e.x, e.y, e.z),
      (t[0] = e.x),
      (t[1] = e.y),
      (t[2] = e.z));
  else {
    if (xt(t, e)) return;
    (i.uniform3iv(this.addr, e), vt(t, e));
  }
}
function Bp(i, e) {
  let t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) &&
      (i.uniform4i(this.addr, e.x, e.y, e.z, e.w),
      (t[0] = e.x),
      (t[1] = e.y),
      (t[2] = e.z),
      (t[3] = e.w));
  else {
    if (xt(t, e)) return;
    (i.uniform4iv(this.addr, e), vt(t, e));
  }
}
function zp(i, e) {
  let t = this.cache;
  t[0] !== e && (i.uniform1ui(this.addr, e), (t[0] = e));
}
function Vp(i, e) {
  let t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y) &&
      (i.uniform2ui(this.addr, e.x, e.y), (t[0] = e.x), (t[1] = e.y));
  else {
    if (xt(t, e)) return;
    (i.uniform2uiv(this.addr, e), vt(t, e));
  }
}
function kp(i, e) {
  let t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z) &&
      (i.uniform3ui(this.addr, e.x, e.y, e.z),
      (t[0] = e.x),
      (t[1] = e.y),
      (t[2] = e.z));
  else {
    if (xt(t, e)) return;
    (i.uniform3uiv(this.addr, e), vt(t, e));
  }
}
function Gp(i, e) {
  let t = this.cache;
  if (e.x !== void 0)
    (t[0] !== e.x || t[1] !== e.y || t[2] !== e.z || t[3] !== e.w) &&
      (i.uniform4ui(this.addr, e.x, e.y, e.z, e.w),
      (t[0] = e.x),
      (t[1] = e.y),
      (t[2] = e.z),
      (t[3] = e.w));
  else {
    if (xt(t, e)) return;
    (i.uniform4uiv(this.addr, e), vt(t, e));
  }
}
function Hp(i, e, t) {
  let n = this.cache,
    s = t.allocateTextureUnit();
  n[0] !== s && (i.uniform1i(this.addr, s), (n[0] = s));
  let r;
  (this.type === i.SAMPLER_2D_SHADOW
    ? ((al.compareFunction = t.isReversedDepthBuffer() ? Pa : Ia), (r = al))
    : (r = dh),
    t.setTexture2D(e || r, s));
}
function Wp(i, e, t) {
  let n = this.cache,
    s = t.allocateTextureUnit();
  (n[0] !== s && (i.uniform1i(this.addr, s), (n[0] = s)),
    t.setTexture3D(e || ph, s));
}
function Xp(i, e, t) {
  let n = this.cache,
    s = t.allocateTextureUnit();
  (n[0] !== s && (i.uniform1i(this.addr, s), (n[0] = s)),
    t.setTextureCube(e || mh, s));
}
function qp(i, e, t) {
  let n = this.cache,
    s = t.allocateTextureUnit();
  (n[0] !== s && (i.uniform1i(this.addr, s), (n[0] = s)),
    t.setTexture2DArray(e || fh, s));
}
function Yp(i) {
  switch (i) {
    case 5126:
      return Cp;
    case 35664:
      return Rp;
    case 35665:
      return Ip;
    case 35666:
      return Pp;
    case 35674:
      return Lp;
    case 35675:
      return Dp;
    case 35676:
      return Up;
    case 5124:
    case 35670:
      return Np;
    case 35667:
    case 35671:
      return Fp;
    case 35668:
    case 35672:
      return Op;
    case 35669:
    case 35673:
      return Bp;
    case 5125:
      return zp;
    case 36294:
      return Vp;
    case 36295:
      return kp;
    case 36296:
      return Gp;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return Hp;
    case 35679:
    case 36299:
    case 36307:
      return Wp;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return Xp;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return qp;
  }
}
function Zp(i, e) {
  i.uniform1fv(this.addr, e);
}
function Jp(i, e) {
  let t = Ji(e, this.size, 2);
  i.uniform2fv(this.addr, t);
}
function $p(i, e) {
  let t = Ji(e, this.size, 3);
  i.uniform3fv(this.addr, t);
}
function Kp(i, e) {
  let t = Ji(e, this.size, 4);
  i.uniform4fv(this.addr, t);
}
function jp(i, e) {
  let t = Ji(e, this.size, 4);
  i.uniformMatrix2fv(this.addr, !1, t);
}
function Qp(i, e) {
  let t = Ji(e, this.size, 9);
  i.uniformMatrix3fv(this.addr, !1, t);
}
function em(i, e) {
  let t = Ji(e, this.size, 16);
  i.uniformMatrix4fv(this.addr, !1, t);
}
function tm(i, e) {
  i.uniform1iv(this.addr, e);
}
function nm(i, e) {
  i.uniform2iv(this.addr, e);
}
function im(i, e) {
  i.uniform3iv(this.addr, e);
}
function sm(i, e) {
  i.uniform4iv(this.addr, e);
}
function rm(i, e) {
  i.uniform1uiv(this.addr, e);
}
function am(i, e) {
  i.uniform2uiv(this.addr, e);
}
function om(i, e) {
  i.uniform3uiv(this.addr, e);
}
function lm(i, e) {
  i.uniform4uiv(this.addr, e);
}
function cm(i, e, t) {
  let n = this.cache,
    s = e.length,
    r = Ba(t, s);
  xt(n, r) || (i.uniform1iv(this.addr, r), vt(n, r));
  let a;
  this.type === i.SAMPLER_2D_SHADOW ? (a = al) : (a = dh);
  for (let o = 0; o !== s; ++o) t.setTexture2D(e[o] || a, r[o]);
}
function hm(i, e, t) {
  let n = this.cache,
    s = e.length,
    r = Ba(t, s);
  xt(n, r) || (i.uniform1iv(this.addr, r), vt(n, r));
  for (let a = 0; a !== s; ++a) t.setTexture3D(e[a] || ph, r[a]);
}
function um(i, e, t) {
  let n = this.cache,
    s = e.length,
    r = Ba(t, s);
  xt(n, r) || (i.uniform1iv(this.addr, r), vt(n, r));
  for (let a = 0; a !== s; ++a) t.setTextureCube(e[a] || mh, r[a]);
}
function dm(i, e, t) {
  let n = this.cache,
    s = e.length,
    r = Ba(t, s);
  xt(n, r) || (i.uniform1iv(this.addr, r), vt(n, r));
  for (let a = 0; a !== s; ++a) t.setTexture2DArray(e[a] || fh, r[a]);
}
function fm(i) {
  switch (i) {
    case 5126:
      return Zp;
    case 35664:
      return Jp;
    case 35665:
      return $p;
    case 35666:
      return Kp;
    case 35674:
      return jp;
    case 35675:
      return Qp;
    case 35676:
      return em;
    case 5124:
    case 35670:
      return tm;
    case 35667:
    case 35671:
      return nm;
    case 35668:
    case 35672:
      return im;
    case 35669:
    case 35673:
      return sm;
    case 5125:
      return rm;
    case 36294:
      return am;
    case 36295:
      return om;
    case 36296:
      return lm;
    case 35678:
    case 36198:
    case 36298:
    case 36306:
    case 35682:
      return cm;
    case 35679:
    case 36299:
    case 36307:
      return hm;
    case 35680:
    case 36300:
    case 36308:
    case 36293:
      return um;
    case 36289:
    case 36303:
    case 36311:
    case 36292:
      return dm;
  }
}
var ol = class {
    constructor(e, t, n) {
      ((this.id = e),
        (this.addr = n),
        (this.cache = []),
        (this.type = t.type),
        (this.setValue = Yp(t.type)));
    }
  },
  ll = class {
    constructor(e, t, n) {
      ((this.id = e),
        (this.addr = n),
        (this.cache = []),
        (this.type = t.type),
        (this.size = t.size),
        (this.setValue = fm(t.type)));
    }
  },
  cl = class {
    constructor(e) {
      ((this.id = e), (this.seq = []), (this.map = {}));
    }
    setValue(e, t, n) {
      let s = this.seq;
      for (let r = 0, a = s.length; r !== a; ++r) {
        let o = s[r];
        o.setValue(e, t[o.id], n);
      }
    }
  },
  sl = /(\w+)(\])?(\[|\.)?/g;
function jc(i, e) {
  (i.seq.push(e), (i.map[e.id] = e));
}
function pm(i, e, t) {
  let n = i.name,
    s = n.length;
  for (sl.lastIndex = 0; ; ) {
    let r = sl.exec(n),
      a = sl.lastIndex,
      o = r[1],
      c = r[2] === "]",
      l = r[3];
    if ((c && (o = o | 0), l === void 0 || (l === "[" && a + 2 === s))) {
      jc(t, l === void 0 ? new ol(o, i, e) : new ll(o, i, e));
      break;
    } else {
      let d = t.map[o];
      (d === void 0 && ((d = new cl(o)), jc(t, d)), (t = d));
    }
  }
}
var Zi = class {
  constructor(e, t) {
    ((this.seq = []), (this.map = {}));
    let n = e.getProgramParameter(t, e.ACTIVE_UNIFORMS);
    for (let a = 0; a < n; ++a) {
      let o = e.getActiveUniform(t, a),
        c = e.getUniformLocation(t, o.name);
      pm(o, c, this);
    }
    let s = [],
      r = [];
    for (let a of this.seq)
      a.type === e.SAMPLER_2D_SHADOW ||
      a.type === e.SAMPLER_CUBE_SHADOW ||
      a.type === e.SAMPLER_2D_ARRAY_SHADOW
        ? s.push(a)
        : r.push(a);
    s.length > 0 && (this.seq = s.concat(r));
  }
  setValue(e, t, n, s) {
    let r = this.map[t];
    r !== void 0 && r.setValue(e, n, s);
  }
  setOptional(e, t, n) {
    let s = t[n];
    s !== void 0 && this.setValue(e, n, s);
  }
  static upload(e, t, n, s) {
    for (let r = 0, a = t.length; r !== a; ++r) {
      let o = t[r],
        c = n[o.id];
      c.needsUpdate !== !1 && o.setValue(e, c.value, s);
    }
  }
  static seqWithValue(e, t) {
    let n = [];
    for (let s = 0, r = e.length; s !== r; ++s) {
      let a = e[s];
      a.id in t && n.push(a);
    }
    return n;
  }
};
function Qc(i, e, t) {
  let n = i.createShader(e);
  return (i.shaderSource(n, t), i.compileShader(n), n);
}
var mm = 37297,
  gm = 0;
function _m(i, e) {
  let t = i.split(`
`),
    n = [],
    s = Math.max(e - 6, 0),
    r = Math.min(e + 6, t.length);
  for (let a = s; a < r; a++) {
    let o = a + 1;
    n.push(`${o === e ? ">" : " "} ${o}: ${t[a]}`);
  }
  return n.join(`
`);
}
var eh = new Ne();
function xm(i) {
  Xe._getMatrix(eh, Xe.workingColorSpace, i);
  let e = `mat3( ${eh.elements.map((t) => t.toFixed(4))} )`;
  switch (Xe.getTransfer(i)) {
    case rs:
      return [e, "LinearTransferOETF"];
    case Qe:
      return [e, "sRGBTransferOETF"];
    default:
      return (
        Ce("WebGLProgram: Unsupported color space: ", i),
        [e, "LinearTransferOETF"]
      );
  }
}
function th(i, e, t) {
  let n = i.getShaderParameter(e, i.COMPILE_STATUS),
    r = (i.getShaderInfoLog(e) || "").trim();
  if (n && r === "") return "";
  let a = /ERROR: 0:(\d+)/.exec(r);
  if (a) {
    let o = parseInt(a[1]);
    return (
      t.toUpperCase() +
      `

` +
      r +
      `

` +
      _m(i.getShaderSource(e), o)
    );
  } else return r;
}
function vm(i, e) {
  let t = xm(e);
  return [
    `vec4 ${i}( vec4 value ) {`,
    `	return ${t[1]}( vec4( value.rgb * ${t[0]}, value.a ) );`,
    "}",
  ].join(`
`);
}
var ym = {
  [Lo]: "Linear",
  [Do]: "Reinhard",
  [Uo]: "Cineon",
  [No]: "ACESFilmic",
  [Oo]: "AgX",
  [Bo]: "Neutral",
  [Fo]: "Custom",
};
function Mm(i, e) {
  let t = ym[e];
  return t === void 0
    ? (Ce("WebGLProgram: Unsupported toneMapping:", e),
      "vec3 " + i + "( vec3 color ) { return LinearToneMapping( color ); }")
    : "vec3 " + i + "( vec3 color ) { return " + t + "ToneMapping( color ); }";
}
var Da = new U();
function Sm() {
  Xe.getLuminanceCoefficients(Da);
  let i = Da.x.toFixed(4),
    e = Da.y.toFixed(4),
    t = Da.z.toFixed(4);
  return [
    "float luminance( const in vec3 rgb ) {",
    `	const vec3 weights = vec3( ${i}, ${e}, ${t} );`,
    "	return dot( weights, rgb );",
    "}",
  ].join(`
`);
}
function bm(i) {
  return [
    i.extensionClipCullDistance
      ? "#extension GL_ANGLE_clip_cull_distance : require"
      : "",
    i.extensionMultiDraw ? "#extension GL_ANGLE_multi_draw : require" : "",
  ].filter(Us).join(`
`);
}
function Em(i) {
  let e = [];
  for (let t in i) {
    let n = i[t];
    n !== !1 && e.push("#define " + t + " " + n);
  }
  return e.join(`
`);
}
function Tm(i, e) {
  let t = {},
    n = i.getProgramParameter(e, i.ACTIVE_ATTRIBUTES);
  for (let s = 0; s < n; s++) {
    let r = i.getActiveAttrib(e, s),
      a = r.name,
      o = 1;
    (r.type === i.FLOAT_MAT2 && (o = 2),
      r.type === i.FLOAT_MAT3 && (o = 3),
      r.type === i.FLOAT_MAT4 && (o = 4),
      (t[a] = {
        type: r.type,
        location: i.getAttribLocation(e, a),
        locationSize: o,
      }));
  }
  return t;
}
function Us(i) {
  return i !== "";
}
function nh(i, e) {
  let t =
    e.numSpotLightShadows + e.numSpotLightMaps - e.numSpotLightShadowsWithMaps;
  return i
    .replace(/NUM_DIR_LIGHTS/g, e.numDirLights)
    .replace(/NUM_SPOT_LIGHTS/g, e.numSpotLights)
    .replace(/NUM_SPOT_LIGHT_MAPS/g, e.numSpotLightMaps)
    .replace(/NUM_SPOT_LIGHT_COORDS/g, t)
    .replace(/NUM_RECT_AREA_LIGHTS/g, e.numRectAreaLights)
    .replace(/NUM_POINT_LIGHTS/g, e.numPointLights)
    .replace(/NUM_HEMI_LIGHTS/g, e.numHemiLights)
    .replace(/NUM_DIR_LIGHT_SHADOWS/g, e.numDirLightShadows)
    .replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g, e.numSpotLightShadowsWithMaps)
    .replace(/NUM_SPOT_LIGHT_SHADOWS/g, e.numSpotLightShadows)
    .replace(/NUM_POINT_LIGHT_SHADOWS/g, e.numPointLightShadows);
}
function ih(i, e) {
  return i
    .replace(/NUM_CLIPPING_PLANES/g, e.numClippingPlanes)
    .replace(
      /UNION_CLIPPING_PLANES/g,
      e.numClippingPlanes - e.numClipIntersection,
    );
}
var Am = /^[ \t]*#include +<([\w\d./]+)>/gm;
function hl(i) {
  return i.replace(Am, Cm);
}
var wm = new Map();
function Cm(i, e) {
  let t = Ve[e];
  if (t === void 0) {
    let n = wm.get(e);
    if (n !== void 0)
      ((t = Ve[n]),
        Ce(
          'WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',
          e,
          n,
        ));
    else throw new Error("Can not resolve #include <" + e + ">");
  }
  return hl(t);
}
var Rm =
  /#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;
function sh(i) {
  return i.replace(Rm, Im);
}
function Im(i, e, t, n) {
  let s = "";
  for (let r = parseInt(e); r < parseInt(t); r++)
    s += n
      .replace(/\[\s*i\s*\]/g, "[ " + r + " ]")
      .replace(/UNROLLED_LOOP_INDEX/g, r);
  return s;
}
function rh(i) {
  let e = `precision ${i.precision} float;
	precision ${i.precision} int;
	precision ${i.precision} sampler2D;
	precision ${i.precision} samplerCube;
	precision ${i.precision} sampler3D;
	precision ${i.precision} sampler2DArray;
	precision ${i.precision} sampler2DShadow;
	precision ${i.precision} samplerCubeShadow;
	precision ${i.precision} sampler2DArrayShadow;
	precision ${i.precision} isampler2D;
	precision ${i.precision} isampler3D;
	precision ${i.precision} isamplerCube;
	precision ${i.precision} isampler2DArray;
	precision ${i.precision} usampler2D;
	precision ${i.precision} usampler3D;
	precision ${i.precision} usamplerCube;
	precision ${i.precision} usampler2DArray;
	`;
  return (
    i.precision === "highp"
      ? (e += `
#define HIGH_PRECISION`)
      : i.precision === "mediump"
        ? (e += `
#define MEDIUM_PRECISION`)
        : i.precision === "lowp" &&
          (e += `
#define LOW_PRECISION`),
    e
  );
}
var Pm = { [Ss]: "SHADOWMAP_TYPE_PCF", [Hi]: "SHADOWMAP_TYPE_VSM" };
function Lm(i) {
  return Pm[i.shadowMapType] || "SHADOWMAP_TYPE_BASIC";
}
var Dm = {
  [Yn]: "ENVMAP_TYPE_CUBE",
  [di]: "ENVMAP_TYPE_CUBE",
  [bs]: "ENVMAP_TYPE_CUBE_UV",
};
function Um(i) {
  return i.envMap === !1
    ? "ENVMAP_TYPE_CUBE"
    : Dm[i.envMapMode] || "ENVMAP_TYPE_CUBE";
}
var Nm = { [di]: "ENVMAP_MODE_REFRACTION" };
function Fm(i) {
  return i.envMap === !1
    ? "ENVMAP_MODE_REFLECTION"
    : Nm[i.envMapMode] || "ENVMAP_MODE_REFLECTION";
}
var Om = {
  [Hr]: "ENVMAP_BLENDING_MULTIPLY",
  [Tc]: "ENVMAP_BLENDING_MIX",
  [Ac]: "ENVMAP_BLENDING_ADD",
};
function Bm(i) {
  return i.envMap === !1
    ? "ENVMAP_BLENDING_NONE"
    : Om[i.combine] || "ENVMAP_BLENDING_NONE";
}
function zm(i) {
  let e = i.envMapCubeUVHeight;
  if (e === null) return null;
  let t = Math.log2(e) - 2,
    n = 1 / e;
  return {
    texelWidth: 1 / (3 * Math.max(Math.pow(2, t), 7 * 16)),
    texelHeight: n,
    maxMip: t,
  };
}
function Vm(i, e, t, n) {
  let s = i.getContext(),
    r = t.defines,
    a = t.vertexShader,
    o = t.fragmentShader,
    c = Lm(t),
    l = Um(t),
    u = Fm(t),
    d = Bm(t),
    h = zm(t),
    p = bm(t),
    g = Em(r),
    y = s.createProgram(),
    m,
    f,
    M = t.glslVersion
      ? "#version " +
        t.glslVersion +
        `
`
      : "";
  (t.isRawShaderMaterial
    ? ((m = [
        "#define SHADER_TYPE " + t.shaderType,
        "#define SHADER_NAME " + t.shaderName,
        g,
      ].filter(Us).join(`
`)),
      m.length > 0 &&
        (m += `
`),
      (f = [
        "#define SHADER_TYPE " + t.shaderType,
        "#define SHADER_NAME " + t.shaderName,
        g,
      ].filter(Us).join(`
`)),
      f.length > 0 &&
        (f += `
`))
    : ((m = [
        rh(t),
        "#define SHADER_TYPE " + t.shaderType,
        "#define SHADER_NAME " + t.shaderName,
        g,
        t.extensionClipCullDistance ? "#define USE_CLIP_DISTANCE" : "",
        t.batching ? "#define USE_BATCHING" : "",
        t.batchingColor ? "#define USE_BATCHING_COLOR" : "",
        t.instancing ? "#define USE_INSTANCING" : "",
        t.instancingColor ? "#define USE_INSTANCING_COLOR" : "",
        t.instancingMorph ? "#define USE_INSTANCING_MORPH" : "",
        t.useFog && t.fog ? "#define USE_FOG" : "",
        t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "",
        t.map ? "#define USE_MAP" : "",
        t.envMap ? "#define USE_ENVMAP" : "",
        t.envMap ? "#define " + u : "",
        t.lightMap ? "#define USE_LIGHTMAP" : "",
        t.aoMap ? "#define USE_AOMAP" : "",
        t.bumpMap ? "#define USE_BUMPMAP" : "",
        t.normalMap ? "#define USE_NORMALMAP" : "",
        t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
        t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
        t.displacementMap ? "#define USE_DISPLACEMENTMAP" : "",
        t.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
        t.anisotropy ? "#define USE_ANISOTROPY" : "",
        t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
        t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
        t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
        t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
        t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
        t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
        t.specularMap ? "#define USE_SPECULARMAP" : "",
        t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
        t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
        t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
        t.metalnessMap ? "#define USE_METALNESSMAP" : "",
        t.alphaMap ? "#define USE_ALPHAMAP" : "",
        t.alphaHash ? "#define USE_ALPHAHASH" : "",
        t.transmission ? "#define USE_TRANSMISSION" : "",
        t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
        t.thicknessMap ? "#define USE_THICKNESSMAP" : "",
        t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
        t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
        t.mapUv ? "#define MAP_UV " + t.mapUv : "",
        t.alphaMapUv ? "#define ALPHAMAP_UV " + t.alphaMapUv : "",
        t.lightMapUv ? "#define LIGHTMAP_UV " + t.lightMapUv : "",
        t.aoMapUv ? "#define AOMAP_UV " + t.aoMapUv : "",
        t.emissiveMapUv ? "#define EMISSIVEMAP_UV " + t.emissiveMapUv : "",
        t.bumpMapUv ? "#define BUMPMAP_UV " + t.bumpMapUv : "",
        t.normalMapUv ? "#define NORMALMAP_UV " + t.normalMapUv : "",
        t.displacementMapUv
          ? "#define DISPLACEMENTMAP_UV " + t.displacementMapUv
          : "",
        t.metalnessMapUv ? "#define METALNESSMAP_UV " + t.metalnessMapUv : "",
        t.roughnessMapUv ? "#define ROUGHNESSMAP_UV " + t.roughnessMapUv : "",
        t.anisotropyMapUv
          ? "#define ANISOTROPYMAP_UV " + t.anisotropyMapUv
          : "",
        t.clearcoatMapUv ? "#define CLEARCOATMAP_UV " + t.clearcoatMapUv : "",
        t.clearcoatNormalMapUv
          ? "#define CLEARCOAT_NORMALMAP_UV " + t.clearcoatNormalMapUv
          : "",
        t.clearcoatRoughnessMapUv
          ? "#define CLEARCOAT_ROUGHNESSMAP_UV " + t.clearcoatRoughnessMapUv
          : "",
        t.iridescenceMapUv
          ? "#define IRIDESCENCEMAP_UV " + t.iridescenceMapUv
          : "",
        t.iridescenceThicknessMapUv
          ? "#define IRIDESCENCE_THICKNESSMAP_UV " + t.iridescenceThicknessMapUv
          : "",
        t.sheenColorMapUv
          ? "#define SHEEN_COLORMAP_UV " + t.sheenColorMapUv
          : "",
        t.sheenRoughnessMapUv
          ? "#define SHEEN_ROUGHNESSMAP_UV " + t.sheenRoughnessMapUv
          : "",
        t.specularMapUv ? "#define SPECULARMAP_UV " + t.specularMapUv : "",
        t.specularColorMapUv
          ? "#define SPECULAR_COLORMAP_UV " + t.specularColorMapUv
          : "",
        t.specularIntensityMapUv
          ? "#define SPECULAR_INTENSITYMAP_UV " + t.specularIntensityMapUv
          : "",
        t.transmissionMapUv
          ? "#define TRANSMISSIONMAP_UV " + t.transmissionMapUv
          : "",
        t.thicknessMapUv ? "#define THICKNESSMAP_UV " + t.thicknessMapUv : "",
        t.vertexTangents && t.flatShading === !1 ? "#define USE_TANGENT" : "",
        t.vertexNormals ? "#define HAS_NORMAL" : "",
        t.vertexColors ? "#define USE_COLOR" : "",
        t.vertexAlphas ? "#define USE_COLOR_ALPHA" : "",
        t.vertexUv1s ? "#define USE_UV1" : "",
        t.vertexUv2s ? "#define USE_UV2" : "",
        t.vertexUv3s ? "#define USE_UV3" : "",
        t.pointsUvs ? "#define USE_POINTS_UV" : "",
        t.flatShading ? "#define FLAT_SHADED" : "",
        t.skinning ? "#define USE_SKINNING" : "",
        t.morphTargets ? "#define USE_MORPHTARGETS" : "",
        t.morphNormals && t.flatShading === !1
          ? "#define USE_MORPHNORMALS"
          : "",
        t.morphColors ? "#define USE_MORPHCOLORS" : "",
        t.morphTargetsCount > 0
          ? "#define MORPHTARGETS_TEXTURE_STRIDE " + t.morphTextureStride
          : "",
        t.morphTargetsCount > 0
          ? "#define MORPHTARGETS_COUNT " + t.morphTargetsCount
          : "",
        t.doubleSided ? "#define DOUBLE_SIDED" : "",
        t.flipSided ? "#define FLIP_SIDED" : "",
        t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
        t.shadowMapEnabled ? "#define " + c : "",
        t.sizeAttenuation ? "#define USE_SIZEATTENUATION" : "",
        t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
        t.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
        t.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
        "uniform mat4 modelMatrix;",
        "uniform mat4 modelViewMatrix;",
        "uniform mat4 projectionMatrix;",
        "uniform mat4 viewMatrix;",
        "uniform mat3 normalMatrix;",
        "uniform vec3 cameraPosition;",
        "uniform bool isOrthographic;",
        "#ifdef USE_INSTANCING",
        "	attribute mat4 instanceMatrix;",
        "#endif",
        "#ifdef USE_INSTANCING_COLOR",
        "	attribute vec3 instanceColor;",
        "#endif",
        "#ifdef USE_INSTANCING_MORPH",
        "	uniform sampler2D morphTexture;",
        "#endif",
        "attribute vec3 position;",
        "attribute vec3 normal;",
        "attribute vec2 uv;",
        "#ifdef USE_UV1",
        "	attribute vec2 uv1;",
        "#endif",
        "#ifdef USE_UV2",
        "	attribute vec2 uv2;",
        "#endif",
        "#ifdef USE_UV3",
        "	attribute vec2 uv3;",
        "#endif",
        "#ifdef USE_TANGENT",
        "	attribute vec4 tangent;",
        "#endif",
        "#if defined( USE_COLOR_ALPHA )",
        "	attribute vec4 color;",
        "#elif defined( USE_COLOR )",
        "	attribute vec3 color;",
        "#endif",
        "#ifdef USE_SKINNING",
        "	attribute vec4 skinIndex;",
        "	attribute vec4 skinWeight;",
        "#endif",
        `
`,
      ].filter(Us).join(`
`)),
      (f = [
        rh(t),
        "#define SHADER_TYPE " + t.shaderType,
        "#define SHADER_NAME " + t.shaderName,
        g,
        t.useFog && t.fog ? "#define USE_FOG" : "",
        t.useFog && t.fogExp2 ? "#define FOG_EXP2" : "",
        t.alphaToCoverage ? "#define ALPHA_TO_COVERAGE" : "",
        t.map ? "#define USE_MAP" : "",
        t.matcap ? "#define USE_MATCAP" : "",
        t.envMap ? "#define USE_ENVMAP" : "",
        t.envMap ? "#define " + l : "",
        t.envMap ? "#define " + u : "",
        t.envMap ? "#define " + d : "",
        h ? "#define CUBEUV_TEXEL_WIDTH " + h.texelWidth : "",
        h ? "#define CUBEUV_TEXEL_HEIGHT " + h.texelHeight : "",
        h ? "#define CUBEUV_MAX_MIP " + h.maxMip + ".0" : "",
        t.lightMap ? "#define USE_LIGHTMAP" : "",
        t.aoMap ? "#define USE_AOMAP" : "",
        t.bumpMap ? "#define USE_BUMPMAP" : "",
        t.normalMap ? "#define USE_NORMALMAP" : "",
        t.normalMapObjectSpace ? "#define USE_NORMALMAP_OBJECTSPACE" : "",
        t.normalMapTangentSpace ? "#define USE_NORMALMAP_TANGENTSPACE" : "",
        t.packedNormalMap ? "#define USE_PACKED_NORMALMAP" : "",
        t.emissiveMap ? "#define USE_EMISSIVEMAP" : "",
        t.anisotropy ? "#define USE_ANISOTROPY" : "",
        t.anisotropyMap ? "#define USE_ANISOTROPYMAP" : "",
        t.clearcoat ? "#define USE_CLEARCOAT" : "",
        t.clearcoatMap ? "#define USE_CLEARCOATMAP" : "",
        t.clearcoatRoughnessMap ? "#define USE_CLEARCOAT_ROUGHNESSMAP" : "",
        t.clearcoatNormalMap ? "#define USE_CLEARCOAT_NORMALMAP" : "",
        t.dispersion ? "#define USE_DISPERSION" : "",
        t.iridescence ? "#define USE_IRIDESCENCE" : "",
        t.iridescenceMap ? "#define USE_IRIDESCENCEMAP" : "",
        t.iridescenceThicknessMap ? "#define USE_IRIDESCENCE_THICKNESSMAP" : "",
        t.specularMap ? "#define USE_SPECULARMAP" : "",
        t.specularColorMap ? "#define USE_SPECULAR_COLORMAP" : "",
        t.specularIntensityMap ? "#define USE_SPECULAR_INTENSITYMAP" : "",
        t.roughnessMap ? "#define USE_ROUGHNESSMAP" : "",
        t.metalnessMap ? "#define USE_METALNESSMAP" : "",
        t.alphaMap ? "#define USE_ALPHAMAP" : "",
        t.alphaTest ? "#define USE_ALPHATEST" : "",
        t.alphaHash ? "#define USE_ALPHAHASH" : "",
        t.sheen ? "#define USE_SHEEN" : "",
        t.sheenColorMap ? "#define USE_SHEEN_COLORMAP" : "",
        t.sheenRoughnessMap ? "#define USE_SHEEN_ROUGHNESSMAP" : "",
        t.transmission ? "#define USE_TRANSMISSION" : "",
        t.transmissionMap ? "#define USE_TRANSMISSIONMAP" : "",
        t.thicknessMap ? "#define USE_THICKNESSMAP" : "",
        t.vertexTangents && t.flatShading === !1 ? "#define USE_TANGENT" : "",
        t.vertexColors || t.instancingColor ? "#define USE_COLOR" : "",
        t.vertexAlphas || t.batchingColor ? "#define USE_COLOR_ALPHA" : "",
        t.vertexUv1s ? "#define USE_UV1" : "",
        t.vertexUv2s ? "#define USE_UV2" : "",
        t.vertexUv3s ? "#define USE_UV3" : "",
        t.pointsUvs ? "#define USE_POINTS_UV" : "",
        t.gradientMap ? "#define USE_GRADIENTMAP" : "",
        t.flatShading ? "#define FLAT_SHADED" : "",
        t.doubleSided ? "#define DOUBLE_SIDED" : "",
        t.flipSided ? "#define FLIP_SIDED" : "",
        t.shadowMapEnabled ? "#define USE_SHADOWMAP" : "",
        t.shadowMapEnabled ? "#define " + c : "",
        t.premultipliedAlpha ? "#define PREMULTIPLIED_ALPHA" : "",
        t.numLightProbes > 0 ? "#define USE_LIGHT_PROBES" : "",
        t.numLightProbeGrids > 0 ? "#define USE_LIGHT_PROBES_GRID" : "",
        t.decodeVideoTexture ? "#define DECODE_VIDEO_TEXTURE" : "",
        t.decodeVideoTextureEmissive
          ? "#define DECODE_VIDEO_TEXTURE_EMISSIVE"
          : "",
        t.logarithmicDepthBuffer ? "#define USE_LOGARITHMIC_DEPTH_BUFFER" : "",
        t.reversedDepthBuffer ? "#define USE_REVERSED_DEPTH_BUFFER" : "",
        "uniform mat4 viewMatrix;",
        "uniform vec3 cameraPosition;",
        "uniform bool isOrthographic;",
        t.toneMapping !== Qt ? "#define TONE_MAPPING" : "",
        t.toneMapping !== Qt ? Ve.tonemapping_pars_fragment : "",
        t.toneMapping !== Qt ? Mm("toneMapping", t.toneMapping) : "",
        t.dithering ? "#define DITHERING" : "",
        t.opaque ? "#define OPAQUE" : "",
        Ve.colorspace_pars_fragment,
        vm("linearToOutputTexel", t.outputColorSpace),
        Sm(),
        t.useDepthPacking ? "#define DEPTH_PACKING " + t.depthPacking : "",
        `
`,
      ].filter(Us).join(`
`))),
    (a = hl(a)),
    (a = nh(a, t)),
    (a = ih(a, t)),
    (o = hl(o)),
    (o = nh(o, t)),
    (o = ih(o, t)),
    (a = sh(a)),
    (o = sh(o)),
    t.isRawShaderMaterial !== !0 &&
      ((M = `#version 300 es
`),
      (m =
        [
          p,
          "#define attribute in",
          "#define varying out",
          "#define texture2D texture",
        ].join(`
`) +
        `
` +
        m),
      (f =
        [
          "#define varying in",
          t.glslVersion === Yo
            ? ""
            : "layout(location = 0) out highp vec4 pc_fragColor;",
          t.glslVersion === Yo ? "" : "#define gl_FragColor pc_fragColor",
          "#define gl_FragDepthEXT gl_FragDepth",
          "#define texture2D texture",
          "#define textureCube texture",
          "#define texture2DProj textureProj",
          "#define texture2DLodEXT textureLod",
          "#define texture2DProjLodEXT textureProjLod",
          "#define textureCubeLodEXT textureLod",
          "#define texture2DGradEXT textureGrad",
          "#define texture2DProjGradEXT textureProjGrad",
          "#define textureCubeGradEXT textureGrad",
        ].join(`
`) +
        `
` +
        f)));
  let T = M + m + a,
    E = M + f + o,
    w = Qc(s, s.VERTEX_SHADER, T),
    b = Qc(s, s.FRAGMENT_SHADER, E);
  (s.attachShader(y, w),
    s.attachShader(y, b),
    t.index0AttributeName !== void 0
      ? s.bindAttribLocation(y, 0, t.index0AttributeName)
      : t.morphTargets === !0 && s.bindAttribLocation(y, 0, "position"),
    s.linkProgram(y));
  function R(C) {
    if (i.debug.checkShaderErrors) {
      let O = s.getProgramInfoLog(y) || "",
        X = s.getShaderInfoLog(w) || "",
        W = s.getShaderInfoLog(b) || "",
        D = O.trim(),
        V = X.trim(),
        k = W.trim(),
        j = !0,
        ee = !0;
      if (s.getProgramParameter(y, s.LINK_STATUS) === !1)
        if (((j = !1), typeof i.debug.onShaderError == "function"))
          i.debug.onShaderError(s, y, w, b);
        else {
          let ce = th(s, w, "vertex"),
            ye = th(s, b, "fragment");
          Ie(
            "THREE.WebGLProgram: Shader Error " +
              s.getError() +
              " - VALIDATE_STATUS " +
              s.getProgramParameter(y, s.VALIDATE_STATUS) +
              `

Material Name: ` +
              C.name +
              `
Material Type: ` +
              C.type +
              `

Program Info Log: ` +
              D +
              `
` +
              ce +
              `
` +
              ye,
          );
        }
      else
        D !== ""
          ? Ce("WebGLProgram: Program Info Log:", D)
          : (V === "" || k === "") && (ee = !1);
      ee &&
        (C.diagnostics = {
          runnable: j,
          programLog: D,
          vertexShader: { log: V, prefix: m },
          fragmentShader: { log: k, prefix: f },
        });
    }
    (s.deleteShader(w), s.deleteShader(b), (x = new Zi(s, y)), (A = Tm(s, y)));
  }
  let x;
  this.getUniforms = function () {
    return (x === void 0 && R(this), x);
  };
  let A;
  this.getAttributes = function () {
    return (A === void 0 && R(this), A);
  };
  let N = t.rendererExtensionParallelShaderCompile === !1;
  return (
    (this.isReady = function () {
      return (N === !1 && (N = s.getProgramParameter(y, mm)), N);
    }),
    (this.destroy = function () {
      (n.releaseStatesOfProgram(this),
        s.deleteProgram(y),
        (this.program = void 0));
    }),
    (this.type = t.shaderType),
    (this.name = t.shaderName),
    (this.id = gm++),
    (this.cacheKey = e),
    (this.usedTimes = 1),
    (this.program = y),
    (this.vertexShader = w),
    (this.fragmentShader = b),
    this
  );
}
var km = 0,
  ul = class {
    constructor() {
      ((this.shaderCache = new Map()), (this.materialCache = new Map()));
    }
    update(e) {
      let t = e.vertexShader,
        n = e.fragmentShader,
        s = this._getShaderStage(t),
        r = this._getShaderStage(n),
        a = this._getShaderCacheForMaterial(e);
      return (
        a.has(s) === !1 && (a.add(s), s.usedTimes++),
        a.has(r) === !1 && (a.add(r), r.usedTimes++),
        this
      );
    }
    remove(e) {
      let t = this.materialCache.get(e);
      for (let n of t)
        (n.usedTimes--, n.usedTimes === 0 && this.shaderCache.delete(n.code));
      return (this.materialCache.delete(e), this);
    }
    getVertexShaderID(e) {
      return this._getShaderStage(e.vertexShader).id;
    }
    getFragmentShaderID(e) {
      return this._getShaderStage(e.fragmentShader).id;
    }
    dispose() {
      (this.shaderCache.clear(), this.materialCache.clear());
    }
    _getShaderCacheForMaterial(e) {
      let t = this.materialCache,
        n = t.get(e);
      return (n === void 0 && ((n = new Set()), t.set(e, n)), n);
    }
    _getShaderStage(e) {
      let t = this.shaderCache,
        n = t.get(e);
      return (n === void 0 && ((n = new dl(e)), t.set(e, n)), n);
    }
  },
  dl = class {
    constructor(e) {
      ((this.id = km++), (this.code = e), (this.usedTimes = 0));
    }
  };
function Gm(i) {
  return i === $n || i === Rs || i === Is;
}
function Hm(i, e, t, n, s, r) {
  let a = new Ni(),
    o = new ul(),
    c = new Set(),
    l = [],
    u = new Map(),
    d = n.logarithmicDepthBuffer,
    h = n.precision,
    p = {
      MeshDepthMaterial: "depth",
      MeshDistanceMaterial: "distance",
      MeshNormalMaterial: "normal",
      MeshBasicMaterial: "basic",
      MeshLambertMaterial: "lambert",
      MeshPhongMaterial: "phong",
      MeshToonMaterial: "toon",
      MeshStandardMaterial: "physical",
      MeshPhysicalMaterial: "physical",
      MeshMatcapMaterial: "matcap",
      LineBasicMaterial: "basic",
      LineDashedMaterial: "dashed",
      PointsMaterial: "points",
      ShadowMaterial: "shadow",
      SpriteMaterial: "sprite",
    };
  function g(x) {
    return (c.add(x), x === 0 ? "uv" : `uv${x}`);
  }
  function y(x, A, N, C, O, X) {
    let W = C.fog,
      D = O.geometry,
      V =
        x.isMeshStandardMaterial ||
        x.isMeshLambertMaterial ||
        x.isMeshPhongMaterial
          ? C.environment
          : null,
      k =
        x.isMeshStandardMaterial ||
        (x.isMeshLambertMaterial && !x.envMap) ||
        (x.isMeshPhongMaterial && !x.envMap),
      j = e.get(x.envMap || V, k),
      ee = j && j.mapping === bs ? j.image.height : null,
      ce = p[x.type];
    x.precision !== null &&
      ((h = n.getMaxPrecision(x.precision)),
      h !== x.precision &&
        Ce(
          "WebGLProgram.getParameters:",
          x.precision,
          "not supported, using",
          h,
          "instead.",
        ));
    let ye =
        D.morphAttributes.position ||
        D.morphAttributes.normal ||
        D.morphAttributes.color,
      Me = ye !== void 0 ? ye.length : 0,
      We = 0;
    (D.morphAttributes.position !== void 0 && (We = 1),
      D.morphAttributes.normal !== void 0 && (We = 2),
      D.morphAttributes.color !== void 0 && (We = 3));
    let $e, De, $, de;
    if (ce) {
      let Oe = _n[ce];
      (($e = Oe.vertexShader), (De = Oe.fragmentShader));
    } else
      (($e = x.vertexShader),
        (De = x.fragmentShader),
        o.update(x),
        ($ = o.getVertexShaderID(x)),
        (de = o.getFragmentShaderID(x)));
    let te = i.getRenderTarget(),
      Ae = i.state.buffers.depth.getReversed(),
      Le = O.isInstancedMesh === !0,
      Re = O.isBatchedMesh === !0,
      lt = !!x.map,
      He = !!x.matcap,
      Ke = !!j,
      nt = !!x.aoMap,
      H = !!x.lightMap,
      le = !!x.bumpMap,
      we = !!x.normalMap,
      ke = !!x.displacementMap,
      P = !!x.emissiveMap,
      it = !!x.metalnessMap,
      Fe = !!x.roughnessMap,
      je = x.anisotropy > 0,
      he = x.clearcoat > 0,
      dt = x.dispersion > 0,
      S = x.iridescence > 0,
      _ = x.sheen > 0,
      F = x.transmission > 0,
      Z = je && !!x.anisotropyMap,
      Q = he && !!x.clearcoatMap,
      ne = he && !!x.clearcoatNormalMap,
      oe = he && !!x.clearcoatRoughnessMap,
      q = S && !!x.iridescenceMap,
      J = S && !!x.iridescenceThicknessMap,
      me = _ && !!x.sheenColorMap,
      xe = _ && !!x.sheenRoughnessMap,
      re = !!x.specularMap,
      ie = !!x.specularColorMap,
      Ue = !!x.specularIntensityMap,
      ze = F && !!x.transmissionMap,
      Je = F && !!x.thicknessMap,
      I = !!x.gradientMap,
      se = !!x.alphaMap,
      Y = x.alphaTest > 0,
      ge = !!x.alphaHash,
      ae = !!x.extensions,
      K = Qt;
    x.toneMapped &&
      (te === null || te.isXRRenderTarget === !0) &&
      (K = i.toneMapping);
    let be = {
      shaderID: ce,
      shaderType: x.type,
      shaderName: x.name,
      vertexShader: $e,
      fragmentShader: De,
      defines: x.defines,
      customVertexShaderID: $,
      customFragmentShaderID: de,
      isRawShaderMaterial: x.isRawShaderMaterial === !0,
      glslVersion: x.glslVersion,
      precision: h,
      batching: Re,
      batchingColor: Re && O._colorsTexture !== null,
      instancing: Le,
      instancingColor: Le && O.instanceColor !== null,
      instancingMorph: Le && O.morphTexture !== null,
      outputColorSpace:
        te === null
          ? i.outputColorSpace
          : te.isXRRenderTarget === !0
            ? te.texture.colorSpace
            : Xe.workingColorSpace,
      alphaToCoverage: !!x.alphaToCoverage,
      map: lt,
      matcap: He,
      envMap: Ke,
      envMapMode: Ke && j.mapping,
      envMapCubeUVHeight: ee,
      aoMap: nt,
      lightMap: H,
      bumpMap: le,
      normalMap: we,
      displacementMap: ke,
      emissiveMap: P,
      normalMapObjectSpace: we && x.normalMapType === Cc,
      normalMapTangentSpace: we && x.normalMapType === Ps,
      packedNormalMap: we && x.normalMapType === Ps && Gm(x.normalMap.format),
      metalnessMap: it,
      roughnessMap: Fe,
      anisotropy: je,
      anisotropyMap: Z,
      clearcoat: he,
      clearcoatMap: Q,
      clearcoatNormalMap: ne,
      clearcoatRoughnessMap: oe,
      dispersion: dt,
      iridescence: S,
      iridescenceMap: q,
      iridescenceThicknessMap: J,
      sheen: _,
      sheenColorMap: me,
      sheenRoughnessMap: xe,
      specularMap: re,
      specularColorMap: ie,
      specularIntensityMap: Ue,
      transmission: F,
      transmissionMap: ze,
      thicknessMap: Je,
      gradientMap: I,
      opaque:
        x.transparent === !1 && x.blending === si && x.alphaToCoverage === !1,
      alphaMap: se,
      alphaTest: Y,
      alphaHash: ge,
      combine: x.combine,
      mapUv: lt && g(x.map.channel),
      aoMapUv: nt && g(x.aoMap.channel),
      lightMapUv: H && g(x.lightMap.channel),
      bumpMapUv: le && g(x.bumpMap.channel),
      normalMapUv: we && g(x.normalMap.channel),
      displacementMapUv: ke && g(x.displacementMap.channel),
      emissiveMapUv: P && g(x.emissiveMap.channel),
      metalnessMapUv: it && g(x.metalnessMap.channel),
      roughnessMapUv: Fe && g(x.roughnessMap.channel),
      anisotropyMapUv: Z && g(x.anisotropyMap.channel),
      clearcoatMapUv: Q && g(x.clearcoatMap.channel),
      clearcoatNormalMapUv: ne && g(x.clearcoatNormalMap.channel),
      clearcoatRoughnessMapUv: oe && g(x.clearcoatRoughnessMap.channel),
      iridescenceMapUv: q && g(x.iridescenceMap.channel),
      iridescenceThicknessMapUv: J && g(x.iridescenceThicknessMap.channel),
      sheenColorMapUv: me && g(x.sheenColorMap.channel),
      sheenRoughnessMapUv: xe && g(x.sheenRoughnessMap.channel),
      specularMapUv: re && g(x.specularMap.channel),
      specularColorMapUv: ie && g(x.specularColorMap.channel),
      specularIntensityMapUv: Ue && g(x.specularIntensityMap.channel),
      transmissionMapUv: ze && g(x.transmissionMap.channel),
      thicknessMapUv: Je && g(x.thicknessMap.channel),
      alphaMapUv: se && g(x.alphaMap.channel),
      vertexTangents: !!D.attributes.tangent && (we || je),
      vertexNormals: !!D.attributes.normal,
      vertexColors: x.vertexColors,
      vertexAlphas:
        x.vertexColors === !0 &&
        !!D.attributes.color &&
        D.attributes.color.itemSize === 4,
      pointsUvs: O.isPoints === !0 && !!D.attributes.uv && (lt || se),
      fog: !!W,
      useFog: x.fog === !0,
      fogExp2: !!W && W.isFogExp2,
      flatShading:
        x.wireframe === !1 &&
        (x.flatShading === !0 ||
          (D.attributes.normal === void 0 &&
            we === !1 &&
            (x.isMeshLambertMaterial ||
              x.isMeshPhongMaterial ||
              x.isMeshStandardMaterial ||
              x.isMeshPhysicalMaterial))),
      sizeAttenuation: x.sizeAttenuation === !0,
      logarithmicDepthBuffer: d,
      reversedDepthBuffer: Ae,
      skinning: O.isSkinnedMesh === !0,
      morphTargets: D.morphAttributes.position !== void 0,
      morphNormals: D.morphAttributes.normal !== void 0,
      morphColors: D.morphAttributes.color !== void 0,
      morphTargetsCount: Me,
      morphTextureStride: We,
      numDirLights: A.directional.length,
      numPointLights: A.point.length,
      numSpotLights: A.spot.length,
      numSpotLightMaps: A.spotLightMap.length,
      numRectAreaLights: A.rectArea.length,
      numHemiLights: A.hemi.length,
      numDirLightShadows: A.directionalShadowMap.length,
      numPointLightShadows: A.pointShadowMap.length,
      numSpotLightShadows: A.spotShadowMap.length,
      numSpotLightShadowsWithMaps: A.numSpotLightShadowsWithMaps,
      numLightProbes: A.numLightProbes,
      numLightProbeGrids: X.length,
      numClippingPlanes: r.numPlanes,
      numClipIntersection: r.numIntersection,
      dithering: x.dithering,
      shadowMapEnabled: i.shadowMap.enabled && N.length > 0,
      shadowMapType: i.shadowMap.type,
      toneMapping: K,
      decodeVideoTexture:
        lt &&
        x.map.isVideoTexture === !0 &&
        Xe.getTransfer(x.map.colorSpace) === Qe,
      decodeVideoTextureEmissive:
        P &&
        x.emissiveMap.isVideoTexture === !0 &&
        Xe.getTransfer(x.emissiveMap.colorSpace) === Qe,
      premultipliedAlpha: x.premultipliedAlpha,
      doubleSided: x.side === fn,
      flipSided: x.side === Dt,
      useDepthPacking: x.depthPacking >= 0,
      depthPacking: x.depthPacking || 0,
      index0AttributeName: x.index0AttributeName,
      extensionClipCullDistance:
        ae &&
        x.extensions.clipCullDistance === !0 &&
        t.has("WEBGL_clip_cull_distance"),
      extensionMultiDraw:
        ((ae && x.extensions.multiDraw === !0) || Re) &&
        t.has("WEBGL_multi_draw"),
      rendererExtensionParallelShaderCompile: t.has(
        "KHR_parallel_shader_compile",
      ),
      customProgramCacheKey: x.customProgramCacheKey(),
    };
    return (
      (be.vertexUv1s = c.has(1)),
      (be.vertexUv2s = c.has(2)),
      (be.vertexUv3s = c.has(3)),
      c.clear(),
      be
    );
  }
  function m(x) {
    let A = [];
    if (
      (x.shaderID
        ? A.push(x.shaderID)
        : (A.push(x.customVertexShaderID), A.push(x.customFragmentShaderID)),
      x.defines !== void 0)
    )
      for (let N in x.defines) (A.push(N), A.push(x.defines[N]));
    return (
      x.isRawShaderMaterial === !1 &&
        (f(A, x), M(A, x), A.push(i.outputColorSpace)),
      A.push(x.customProgramCacheKey),
      A.join()
    );
  }
  function f(x, A) {
    (x.push(A.precision),
      x.push(A.outputColorSpace),
      x.push(A.envMapMode),
      x.push(A.envMapCubeUVHeight),
      x.push(A.mapUv),
      x.push(A.alphaMapUv),
      x.push(A.lightMapUv),
      x.push(A.aoMapUv),
      x.push(A.bumpMapUv),
      x.push(A.normalMapUv),
      x.push(A.displacementMapUv),
      x.push(A.emissiveMapUv),
      x.push(A.metalnessMapUv),
      x.push(A.roughnessMapUv),
      x.push(A.anisotropyMapUv),
      x.push(A.clearcoatMapUv),
      x.push(A.clearcoatNormalMapUv),
      x.push(A.clearcoatRoughnessMapUv),
      x.push(A.iridescenceMapUv),
      x.push(A.iridescenceThicknessMapUv),
      x.push(A.sheenColorMapUv),
      x.push(A.sheenRoughnessMapUv),
      x.push(A.specularMapUv),
      x.push(A.specularColorMapUv),
      x.push(A.specularIntensityMapUv),
      x.push(A.transmissionMapUv),
      x.push(A.thicknessMapUv),
      x.push(A.combine),
      x.push(A.fogExp2),
      x.push(A.sizeAttenuation),
      x.push(A.morphTargetsCount),
      x.push(A.morphAttributeCount),
      x.push(A.numDirLights),
      x.push(A.numPointLights),
      x.push(A.numSpotLights),
      x.push(A.numSpotLightMaps),
      x.push(A.numHemiLights),
      x.push(A.numRectAreaLights),
      x.push(A.numDirLightShadows),
      x.push(A.numPointLightShadows),
      x.push(A.numSpotLightShadows),
      x.push(A.numSpotLightShadowsWithMaps),
      x.push(A.numLightProbes),
      x.push(A.shadowMapType),
      x.push(A.toneMapping),
      x.push(A.numClippingPlanes),
      x.push(A.numClipIntersection),
      x.push(A.depthPacking));
  }
  function M(x, A) {
    (a.disableAll(),
      A.instancing && a.enable(0),
      A.instancingColor && a.enable(1),
      A.instancingMorph && a.enable(2),
      A.matcap && a.enable(3),
      A.envMap && a.enable(4),
      A.normalMapObjectSpace && a.enable(5),
      A.normalMapTangentSpace && a.enable(6),
      A.clearcoat && a.enable(7),
      A.iridescence && a.enable(8),
      A.alphaTest && a.enable(9),
      A.vertexColors && a.enable(10),
      A.vertexAlphas && a.enable(11),
      A.vertexUv1s && a.enable(12),
      A.vertexUv2s && a.enable(13),
      A.vertexUv3s && a.enable(14),
      A.vertexTangents && a.enable(15),
      A.anisotropy && a.enable(16),
      A.alphaHash && a.enable(17),
      A.batching && a.enable(18),
      A.dispersion && a.enable(19),
      A.batchingColor && a.enable(20),
      A.gradientMap && a.enable(21),
      A.packedNormalMap && a.enable(22),
      A.vertexNormals && a.enable(23),
      x.push(a.mask),
      a.disableAll(),
      A.fog && a.enable(0),
      A.useFog && a.enable(1),
      A.flatShading && a.enable(2),
      A.logarithmicDepthBuffer && a.enable(3),
      A.reversedDepthBuffer && a.enable(4),
      A.skinning && a.enable(5),
      A.morphTargets && a.enable(6),
      A.morphNormals && a.enable(7),
      A.morphColors && a.enable(8),
      A.premultipliedAlpha && a.enable(9),
      A.shadowMapEnabled && a.enable(10),
      A.doubleSided && a.enable(11),
      A.flipSided && a.enable(12),
      A.useDepthPacking && a.enable(13),
      A.dithering && a.enable(14),
      A.transmission && a.enable(15),
      A.sheen && a.enable(16),
      A.opaque && a.enable(17),
      A.pointsUvs && a.enable(18),
      A.decodeVideoTexture && a.enable(19),
      A.decodeVideoTextureEmissive && a.enable(20),
      A.alphaToCoverage && a.enable(21),
      A.numLightProbeGrids > 0 && a.enable(22),
      x.push(a.mask));
  }
  function T(x) {
    let A = p[x.type],
      N;
    if (A) {
      let C = _n[A];
      N = Vc.clone(C.uniforms);
    } else N = x.uniforms;
    return N;
  }
  function E(x, A) {
    let N = u.get(A);
    return (
      N !== void 0
        ? ++N.usedTimes
        : ((N = new Vm(i, A, x, s)), l.push(N), u.set(A, N)),
      N
    );
  }
  function w(x) {
    if (--x.usedTimes === 0) {
      let A = l.indexOf(x);
      ((l[A] = l[l.length - 1]), l.pop(), u.delete(x.cacheKey), x.destroy());
    }
  }
  function b(x) {
    o.remove(x);
  }
  function R() {
    o.dispose();
  }
  return {
    getParameters: y,
    getProgramCacheKey: m,
    getUniforms: T,
    acquireProgram: E,
    releaseProgram: w,
    releaseShaderCache: b,
    programs: l,
    dispose: R,
  };
}
function Wm() {
  let i = new WeakMap();
  function e(a) {
    return i.has(a);
  }
  function t(a) {
    let o = i.get(a);
    return (o === void 0 && ((o = {}), i.set(a, o)), o);
  }
  function n(a) {
    i.delete(a);
  }
  function s(a, o, c) {
    i.get(a)[o] = c;
  }
  function r() {
    i = new WeakMap();
  }
  return { has: e, get: t, remove: n, update: s, dispose: r };
}
function Xm(i, e) {
  return i.groupOrder !== e.groupOrder
    ? i.groupOrder - e.groupOrder
    : i.renderOrder !== e.renderOrder
      ? i.renderOrder - e.renderOrder
      : i.material.id !== e.material.id
        ? i.material.id - e.material.id
        : i.materialVariant !== e.materialVariant
          ? i.materialVariant - e.materialVariant
          : i.z !== e.z
            ? i.z - e.z
            : i.id - e.id;
}
function ah(i, e) {
  return i.groupOrder !== e.groupOrder
    ? i.groupOrder - e.groupOrder
    : i.renderOrder !== e.renderOrder
      ? i.renderOrder - e.renderOrder
      : i.z !== e.z
        ? e.z - i.z
        : i.id - e.id;
}
function oh() {
  let i = [],
    e = 0,
    t = [],
    n = [],
    s = [];
  function r() {
    ((e = 0), (t.length = 0), (n.length = 0), (s.length = 0));
  }
  function a(h) {
    let p = 0;
    return (h.isInstancedMesh && (p += 2), h.isSkinnedMesh && (p += 1), p);
  }
  function o(h, p, g, y, m, f) {
    let M = i[e];
    return (
      M === void 0
        ? ((M = {
            id: h.id,
            object: h,
            geometry: p,
            material: g,
            materialVariant: a(h),
            groupOrder: y,
            renderOrder: h.renderOrder,
            z: m,
            group: f,
          }),
          (i[e] = M))
        : ((M.id = h.id),
          (M.object = h),
          (M.geometry = p),
          (M.material = g),
          (M.materialVariant = a(h)),
          (M.groupOrder = y),
          (M.renderOrder = h.renderOrder),
          (M.z = m),
          (M.group = f)),
      e++,
      M
    );
  }
  function c(h, p, g, y, m, f) {
    let M = o(h, p, g, y, m, f);
    g.transmission > 0
      ? n.push(M)
      : g.transparent === !0
        ? s.push(M)
        : t.push(M);
  }
  function l(h, p, g, y, m, f) {
    let M = o(h, p, g, y, m, f);
    g.transmission > 0
      ? n.unshift(M)
      : g.transparent === !0
        ? s.unshift(M)
        : t.unshift(M);
  }
  function u(h, p) {
    (t.length > 1 && t.sort(h || Xm),
      n.length > 1 && n.sort(p || ah),
      s.length > 1 && s.sort(p || ah));
  }
  function d() {
    for (let h = e, p = i.length; h < p; h++) {
      let g = i[h];
      if (g.id === null) break;
      ((g.id = null),
        (g.object = null),
        (g.geometry = null),
        (g.material = null),
        (g.group = null));
    }
  }
  return {
    opaque: t,
    transmissive: n,
    transparent: s,
    init: r,
    push: c,
    unshift: l,
    finish: d,
    sort: u,
  };
}
function qm() {
  let i = new WeakMap();
  function e(n, s) {
    let r = i.get(n),
      a;
    return (
      r === void 0
        ? ((a = new oh()), i.set(n, [a]))
        : s >= r.length
          ? ((a = new oh()), r.push(a))
          : (a = r[s]),
      a
    );
  }
  function t() {
    i = new WeakMap();
  }
  return { get: e, dispose: t };
}
function Ym() {
  let i = {};
  return {
    get: function (e) {
      if (i[e.id] !== void 0) return i[e.id];
      let t;
      switch (e.type) {
        case "DirectionalLight":
          t = { direction: new U(), color: new Pe() };
          break;
        case "SpotLight":
          t = {
            position: new U(),
            direction: new U(),
            color: new Pe(),
            distance: 0,
            coneCos: 0,
            penumbraCos: 0,
            decay: 0,
          };
          break;
        case "PointLight":
          t = { position: new U(), color: new Pe(), distance: 0, decay: 0 };
          break;
        case "HemisphereLight":
          t = { direction: new U(), skyColor: new Pe(), groundColor: new Pe() };
          break;
        case "RectAreaLight":
          t = {
            color: new Pe(),
            position: new U(),
            halfWidth: new U(),
            halfHeight: new U(),
          };
          break;
      }
      return ((i[e.id] = t), t);
    },
  };
}
function Zm() {
  let i = {};
  return {
    get: function (e) {
      if (i[e.id] !== void 0) return i[e.id];
      let t;
      switch (e.type) {
        case "DirectionalLight":
          t = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Ye(),
          };
          break;
        case "SpotLight":
          t = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Ye(),
          };
          break;
        case "PointLight":
          t = {
            shadowIntensity: 1,
            shadowBias: 0,
            shadowNormalBias: 0,
            shadowRadius: 1,
            shadowMapSize: new Ye(),
            shadowCameraNear: 1,
            shadowCameraFar: 1e3,
          };
          break;
      }
      return ((i[e.id] = t), t);
    },
  };
}
var Jm = 0;
function $m(i, e) {
  return (
    (e.castShadow ? 2 : 0) -
    (i.castShadow ? 2 : 0) +
    (e.map ? 1 : 0) -
    (i.map ? 1 : 0)
  );
}
function Km(i) {
  let e = new Ym(),
    t = Zm(),
    n = {
      version: 0,
      hash: {
        directionalLength: -1,
        pointLength: -1,
        spotLength: -1,
        rectAreaLength: -1,
        hemiLength: -1,
        numDirectionalShadows: -1,
        numPointShadows: -1,
        numSpotShadows: -1,
        numSpotMaps: -1,
        numLightProbes: -1,
      },
      ambient: [0, 0, 0],
      probe: [],
      directional: [],
      directionalShadow: [],
      directionalShadowMap: [],
      directionalShadowMatrix: [],
      spot: [],
      spotLightMap: [],
      spotShadow: [],
      spotShadowMap: [],
      spotLightMatrix: [],
      rectArea: [],
      rectAreaLTC1: null,
      rectAreaLTC2: null,
      point: [],
      pointShadow: [],
      pointShadowMap: [],
      pointShadowMatrix: [],
      hemi: [],
      numSpotLightShadowsWithMaps: 0,
      numLightProbes: 0,
    };
  for (let l = 0; l < 9; l++) n.probe.push(new U());
  let s = new U(),
    r = new ht(),
    a = new ht();
  function o(l) {
    let u = 0,
      d = 0,
      h = 0;
    for (let A = 0; A < 9; A++) n.probe[A].set(0, 0, 0);
    let p = 0,
      g = 0,
      y = 0,
      m = 0,
      f = 0,
      M = 0,
      T = 0,
      E = 0,
      w = 0,
      b = 0,
      R = 0;
    l.sort($m);
    for (let A = 0, N = l.length; A < N; A++) {
      let C = l[A],
        O = C.color,
        X = C.intensity,
        W = C.distance,
        D = null;
      if (
        (C.shadow &&
          C.shadow.map &&
          (C.shadow.map.texture.format === $n
            ? (D = C.shadow.map.texture)
            : (D = C.shadow.map.depthTexture || C.shadow.map.texture)),
        C.isAmbientLight)
      )
        ((u += O.r * X), (d += O.g * X), (h += O.b * X));
      else if (C.isLightProbe) {
        for (let V = 0; V < 9; V++)
          n.probe[V].addScaledVector(C.sh.coefficients[V], X);
        R++;
      } else if (C.isDirectionalLight) {
        let V = e.get(C);
        if ((V.color.copy(C.color).multiplyScalar(C.intensity), C.castShadow)) {
          let k = C.shadow,
            j = t.get(C);
          ((j.shadowIntensity = k.intensity),
            (j.shadowBias = k.bias),
            (j.shadowNormalBias = k.normalBias),
            (j.shadowRadius = k.radius),
            (j.shadowMapSize = k.mapSize),
            (n.directionalShadow[p] = j),
            (n.directionalShadowMap[p] = D),
            (n.directionalShadowMatrix[p] = C.shadow.matrix),
            M++);
        }
        ((n.directional[p] = V), p++);
      } else if (C.isSpotLight) {
        let V = e.get(C);
        (V.position.setFromMatrixPosition(C.matrixWorld),
          V.color.copy(O).multiplyScalar(X),
          (V.distance = W),
          (V.coneCos = Math.cos(C.angle)),
          (V.penumbraCos = Math.cos(C.angle * (1 - C.penumbra))),
          (V.decay = C.decay),
          (n.spot[y] = V));
        let k = C.shadow;
        if (
          (C.map &&
            ((n.spotLightMap[w] = C.map),
            w++,
            k.updateMatrices(C),
            C.castShadow && b++),
          (n.spotLightMatrix[y] = k.matrix),
          C.castShadow)
        ) {
          let j = t.get(C);
          ((j.shadowIntensity = k.intensity),
            (j.shadowBias = k.bias),
            (j.shadowNormalBias = k.normalBias),
            (j.shadowRadius = k.radius),
            (j.shadowMapSize = k.mapSize),
            (n.spotShadow[y] = j),
            (n.spotShadowMap[y] = D),
            E++);
        }
        y++;
      } else if (C.isRectAreaLight) {
        let V = e.get(C);
        (V.color.copy(O).multiplyScalar(X),
          V.halfWidth.set(C.width * 0.5, 0, 0),
          V.halfHeight.set(0, C.height * 0.5, 0),
          (n.rectArea[m] = V),
          m++);
      } else if (C.isPointLight) {
        let V = e.get(C);
        if (
          (V.color.copy(C.color).multiplyScalar(C.intensity),
          (V.distance = C.distance),
          (V.decay = C.decay),
          C.castShadow)
        ) {
          let k = C.shadow,
            j = t.get(C);
          ((j.shadowIntensity = k.intensity),
            (j.shadowBias = k.bias),
            (j.shadowNormalBias = k.normalBias),
            (j.shadowRadius = k.radius),
            (j.shadowMapSize = k.mapSize),
            (j.shadowCameraNear = k.camera.near),
            (j.shadowCameraFar = k.camera.far),
            (n.pointShadow[g] = j),
            (n.pointShadowMap[g] = D),
            (n.pointShadowMatrix[g] = C.shadow.matrix),
            T++);
        }
        ((n.point[g] = V), g++);
      } else if (C.isHemisphereLight) {
        let V = e.get(C);
        (V.skyColor.copy(C.color).multiplyScalar(X),
          V.groundColor.copy(C.groundColor).multiplyScalar(X),
          (n.hemi[f] = V),
          f++);
      }
    }
    (m > 0 &&
      (i.has("OES_texture_float_linear") === !0
        ? ((n.rectAreaLTC1 = ue.LTC_FLOAT_1), (n.rectAreaLTC2 = ue.LTC_FLOAT_2))
        : ((n.rectAreaLTC1 = ue.LTC_HALF_1), (n.rectAreaLTC2 = ue.LTC_HALF_2))),
      (n.ambient[0] = u),
      (n.ambient[1] = d),
      (n.ambient[2] = h));
    let x = n.hash;
    (x.directionalLength !== p ||
      x.pointLength !== g ||
      x.spotLength !== y ||
      x.rectAreaLength !== m ||
      x.hemiLength !== f ||
      x.numDirectionalShadows !== M ||
      x.numPointShadows !== T ||
      x.numSpotShadows !== E ||
      x.numSpotMaps !== w ||
      x.numLightProbes !== R) &&
      ((n.directional.length = p),
      (n.spot.length = y),
      (n.rectArea.length = m),
      (n.point.length = g),
      (n.hemi.length = f),
      (n.directionalShadow.length = M),
      (n.directionalShadowMap.length = M),
      (n.pointShadow.length = T),
      (n.pointShadowMap.length = T),
      (n.spotShadow.length = E),
      (n.spotShadowMap.length = E),
      (n.directionalShadowMatrix.length = M),
      (n.pointShadowMatrix.length = T),
      (n.spotLightMatrix.length = E + w - b),
      (n.spotLightMap.length = w),
      (n.numSpotLightShadowsWithMaps = b),
      (n.numLightProbes = R),
      (x.directionalLength = p),
      (x.pointLength = g),
      (x.spotLength = y),
      (x.rectAreaLength = m),
      (x.hemiLength = f),
      (x.numDirectionalShadows = M),
      (x.numPointShadows = T),
      (x.numSpotShadows = E),
      (x.numSpotMaps = w),
      (x.numLightProbes = R),
      (n.version = Jm++));
  }
  function c(l, u) {
    let d = 0,
      h = 0,
      p = 0,
      g = 0,
      y = 0,
      m = u.matrixWorldInverse;
    for (let f = 0, M = l.length; f < M; f++) {
      let T = l[f];
      if (T.isDirectionalLight) {
        let E = n.directional[d];
        (E.direction.setFromMatrixPosition(T.matrixWorld),
          s.setFromMatrixPosition(T.target.matrixWorld),
          E.direction.sub(s),
          E.direction.transformDirection(m),
          d++);
      } else if (T.isSpotLight) {
        let E = n.spot[p];
        (E.position.setFromMatrixPosition(T.matrixWorld),
          E.position.applyMatrix4(m),
          E.direction.setFromMatrixPosition(T.matrixWorld),
          s.setFromMatrixPosition(T.target.matrixWorld),
          E.direction.sub(s),
          E.direction.transformDirection(m),
          p++);
      } else if (T.isRectAreaLight) {
        let E = n.rectArea[g];
        (E.position.setFromMatrixPosition(T.matrixWorld),
          E.position.applyMatrix4(m),
          a.identity(),
          r.copy(T.matrixWorld),
          r.premultiply(m),
          a.extractRotation(r),
          E.halfWidth.set(T.width * 0.5, 0, 0),
          E.halfHeight.set(0, T.height * 0.5, 0),
          E.halfWidth.applyMatrix4(a),
          E.halfHeight.applyMatrix4(a),
          g++);
      } else if (T.isPointLight) {
        let E = n.point[h];
        (E.position.setFromMatrixPosition(T.matrixWorld),
          E.position.applyMatrix4(m),
          h++);
      } else if (T.isHemisphereLight) {
        let E = n.hemi[y];
        (E.direction.setFromMatrixPosition(T.matrixWorld),
          E.direction.transformDirection(m),
          y++);
      }
    }
  }
  return { setup: o, setupView: c, state: n };
}
function lh(i) {
  let e = new Km(i),
    t = [],
    n = [],
    s = [];
  function r(h) {
    ((d.camera = h), (t.length = 0), (n.length = 0), (s.length = 0));
  }
  function a(h) {
    t.push(h);
  }
  function o(h) {
    n.push(h);
  }
  function c(h) {
    s.push(h);
  }
  function l() {
    e.setup(t);
  }
  function u(h) {
    e.setupView(t, h);
  }
  let d = {
    lightsArray: t,
    shadowsArray: n,
    lightProbeGridArray: s,
    camera: null,
    lights: e,
    transmissionRenderTarget: {},
    textureUnits: 0,
  };
  return {
    init: r,
    state: d,
    setupLights: l,
    setupLightsView: u,
    pushLight: a,
    pushShadow: o,
    pushLightProbeGrid: c,
  };
}
function jm(i) {
  let e = new WeakMap();
  function t(s, r = 0) {
    let a = e.get(s),
      o;
    return (
      a === void 0
        ? ((o = new lh(i)), e.set(s, [o]))
        : r >= a.length
          ? ((o = new lh(i)), a.push(o))
          : (o = a[r]),
      o
    );
  }
  function n() {
    e = new WeakMap();
  }
  return { get: t, dispose: n };
}
var Qm = `void main() {
	gl_Position = vec4( position, 1.0 );
}`,
  eg = `uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,
  tg = [
    new U(1, 0, 0),
    new U(-1, 0, 0),
    new U(0, 1, 0),
    new U(0, -1, 0),
    new U(0, 0, 1),
    new U(0, 0, -1),
  ],
  ng = [
    new U(0, -1, 0),
    new U(0, -1, 0),
    new U(0, 0, 1),
    new U(0, 0, -1),
    new U(0, -1, 0),
    new U(0, -1, 0),
  ],
  ch = new ht(),
  Ds = new U(),
  rl = new U();
function ig(i, e, t) {
  let n = new Oi(),
    s = new Ye(),
    r = new Ye(),
    a = new ut(),
    o = new Vi(),
    c = new Ir(),
    l = {},
    u = t.maxTextureSize,
    d = { [An]: Dt, [Dt]: An, [fn]: fn },
    h = new Gt({
      defines: { VSM_SAMPLES: 8 },
      uniforms: {
        shadow_pass: { value: null },
        resolution: { value: new Ye() },
        radius: { value: 4 },
      },
      vertexShader: Qm,
      fragmentShader: eg,
    }),
    p = h.clone();
  p.defines.HORIZONTAL_PASS = 1;
  let g = new At();
  g.setAttribute(
    "position",
    new Vt(new Float32Array([-1, -1, 0.5, 3, -1, 0.5, -1, 3, 0.5]), 3),
  );
  let y = new bt(g, h),
    m = this;
  ((this.enabled = !1),
    (this.autoUpdate = !0),
    (this.needsUpdate = !1),
    (this.type = Ss));
  let f = this.type;
  this.render = function (b, R, x) {
    if (
      m.enabled === !1 ||
      (m.autoUpdate === !1 && m.needsUpdate === !1) ||
      b.length === 0
    )
      return;
    this.type === ac &&
      (Ce(
        "WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead.",
      ),
      (this.type = Ss));
    let A = i.getRenderTarget(),
      N = i.getActiveCubeFace(),
      C = i.getActiveMipmapLevel(),
      O = i.state;
    (O.setBlending(pn),
      O.buffers.depth.getReversed() === !0
        ? O.buffers.color.setClear(0, 0, 0, 0)
        : O.buffers.color.setClear(1, 1, 1, 1),
      O.buffers.depth.setTest(!0),
      O.setScissorTest(!1));
    let X = f !== this.type;
    X &&
      R.traverse(function (W) {
        W.material &&
          (Array.isArray(W.material)
            ? W.material.forEach((D) => (D.needsUpdate = !0))
            : (W.material.needsUpdate = !0));
      });
    for (let W = 0, D = b.length; W < D; W++) {
      let V = b[W],
        k = V.shadow;
      if (k === void 0) {
        Ce("WebGLShadowMap:", V, "has no shadow.");
        continue;
      }
      if (k.autoUpdate === !1 && k.needsUpdate === !1) continue;
      s.copy(k.mapSize);
      let j = k.getFrameExtents();
      (s.multiply(j),
        r.copy(k.mapSize),
        (s.x > u || s.y > u) &&
          (s.x > u &&
            ((r.x = Math.floor(u / j.x)),
            (s.x = r.x * j.x),
            (k.mapSize.x = r.x)),
          s.y > u &&
            ((r.y = Math.floor(u / j.y)),
            (s.y = r.y * j.y),
            (k.mapSize.y = r.y))));
      let ee = i.state.buffers.depth.getReversed();
      if (((k.camera._reversedDepth = ee), k.map === null || X === !0)) {
        if (
          (k.map !== null &&
            (k.map.depthTexture !== null &&
              (k.map.depthTexture.dispose(), (k.map.depthTexture = null)),
            k.map.dispose()),
          this.type === Hi)
        ) {
          if (V.isPointLight) {
            Ce(
              "WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.",
            );
            continue;
          }
          ((k.map = new kt(s.x, s.y, {
            format: $n,
            type: mn,
            minFilter: Tt,
            magFilter: Tt,
            generateMipmaps: !1,
          })),
            (k.map.texture.name = V.name + ".shadowMap"),
            (k.map.depthTexture = new Rn(s.x, s.y, tn)),
            (k.map.depthTexture.name = V.name + ".shadowMapDepth"),
            (k.map.depthTexture.format = cn),
            (k.map.depthTexture.compareFunction = null),
            (k.map.depthTexture.minFilter = Mt),
            (k.map.depthTexture.magFilter = Mt));
        } else
          (V.isPointLight
            ? ((k.map = new Na(s.x)), (k.map.depthTexture = new Cr(s.x, en)))
            : ((k.map = new kt(s.x, s.y)),
              (k.map.depthTexture = new Rn(s.x, s.y, en))),
            (k.map.depthTexture.name = V.name + ".shadowMap"),
            (k.map.depthTexture.format = cn),
            this.type === Ss
              ? ((k.map.depthTexture.compareFunction = ee ? Pa : Ia),
                (k.map.depthTexture.minFilter = Tt),
                (k.map.depthTexture.magFilter = Tt))
              : ((k.map.depthTexture.compareFunction = null),
                (k.map.depthTexture.minFilter = Mt),
                (k.map.depthTexture.magFilter = Mt)));
        k.camera.updateProjectionMatrix();
      }
      let ce = k.map.isWebGLCubeRenderTarget ? 6 : 1;
      for (let ye = 0; ye < ce; ye++) {
        if (k.map.isWebGLCubeRenderTarget)
          (i.setRenderTarget(k.map, ye), i.clear());
        else {
          ye === 0 && (i.setRenderTarget(k.map), i.clear());
          let Me = k.getViewport(ye);
          (a.set(r.x * Me.x, r.y * Me.y, r.x * Me.z, r.y * Me.w),
            O.viewport(a));
        }
        if (V.isPointLight) {
          let Me = k.camera,
            We = k.matrix,
            $e = V.distance || Me.far;
          ($e !== Me.far && ((Me.far = $e), Me.updateProjectionMatrix()),
            Ds.setFromMatrixPosition(V.matrixWorld),
            Me.position.copy(Ds),
            rl.copy(Me.position),
            rl.add(tg[ye]),
            Me.up.copy(ng[ye]),
            Me.lookAt(rl),
            Me.updateMatrixWorld(),
            We.makeTranslation(-Ds.x, -Ds.y, -Ds.z),
            ch.multiplyMatrices(Me.projectionMatrix, Me.matrixWorldInverse),
            k._frustum.setFromProjectionMatrix(
              ch,
              Me.coordinateSystem,
              Me.reversedDepth,
            ));
        } else k.updateMatrices(V);
        ((n = k.getFrustum()), E(R, x, k.camera, V, this.type));
      }
      (k.isPointLightShadow !== !0 && this.type === Hi && M(k, x),
        (k.needsUpdate = !1));
    }
    ((f = this.type), (m.needsUpdate = !1), i.setRenderTarget(A, N, C));
  };
  function M(b, R) {
    let x = e.update(y);
    (h.defines.VSM_SAMPLES !== b.blurSamples &&
      ((h.defines.VSM_SAMPLES = b.blurSamples),
      (p.defines.VSM_SAMPLES = b.blurSamples),
      (h.needsUpdate = !0),
      (p.needsUpdate = !0)),
      b.mapPass === null &&
        (b.mapPass = new kt(s.x, s.y, { format: $n, type: mn })),
      (h.uniforms.shadow_pass.value = b.map.depthTexture),
      (h.uniforms.resolution.value = b.mapSize),
      (h.uniforms.radius.value = b.radius),
      i.setRenderTarget(b.mapPass),
      i.clear(),
      i.renderBufferDirect(R, null, x, h, y, null),
      (p.uniforms.shadow_pass.value = b.mapPass.texture),
      (p.uniforms.resolution.value = b.mapSize),
      (p.uniforms.radius.value = b.radius),
      i.setRenderTarget(b.map),
      i.clear(),
      i.renderBufferDirect(R, null, x, p, y, null));
  }
  function T(b, R, x, A) {
    let N = null,
      C =
        x.isPointLight === !0
          ? b.customDistanceMaterial
          : b.customDepthMaterial;
    if (C !== void 0) N = C;
    else if (
      ((N = x.isPointLight === !0 ? c : o),
      (i.localClippingEnabled &&
        R.clipShadows === !0 &&
        Array.isArray(R.clippingPlanes) &&
        R.clippingPlanes.length !== 0) ||
        (R.displacementMap && R.displacementScale !== 0) ||
        (R.alphaMap && R.alphaTest > 0) ||
        (R.map && R.alphaTest > 0) ||
        R.alphaToCoverage === !0)
    ) {
      let O = N.uuid,
        X = R.uuid,
        W = l[O];
      W === void 0 && ((W = {}), (l[O] = W));
      let D = W[X];
      (D === void 0 &&
        ((D = N.clone()), (W[X] = D), R.addEventListener("dispose", w)),
        (N = D));
    }
    if (
      ((N.visible = R.visible),
      (N.wireframe = R.wireframe),
      A === Hi
        ? (N.side = R.shadowSide !== null ? R.shadowSide : R.side)
        : (N.side = R.shadowSide !== null ? R.shadowSide : d[R.side]),
      (N.alphaMap = R.alphaMap),
      (N.alphaTest = R.alphaToCoverage === !0 ? 0.5 : R.alphaTest),
      (N.map = R.map),
      (N.clipShadows = R.clipShadows),
      (N.clippingPlanes = R.clippingPlanes),
      (N.clipIntersection = R.clipIntersection),
      (N.displacementMap = R.displacementMap),
      (N.displacementScale = R.displacementScale),
      (N.displacementBias = R.displacementBias),
      (N.wireframeLinewidth = R.wireframeLinewidth),
      (N.linewidth = R.linewidth),
      x.isPointLight === !0 && N.isMeshDistanceMaterial === !0)
    ) {
      let O = i.properties.get(N);
      O.light = x;
    }
    return N;
  }
  function E(b, R, x, A, N) {
    if (b.visible === !1) return;
    if (
      b.layers.test(R.layers) &&
      (b.isMesh || b.isLine || b.isPoints) &&
      (b.castShadow || (b.receiveShadow && N === Hi)) &&
      (!b.frustumCulled || n.intersectsObject(b))
    ) {
      b.modelViewMatrix.multiplyMatrices(x.matrixWorldInverse, b.matrixWorld);
      let X = e.update(b),
        W = b.material;
      if (Array.isArray(W)) {
        let D = X.groups;
        for (let V = 0, k = D.length; V < k; V++) {
          let j = D[V],
            ee = W[j.materialIndex];
          if (ee && ee.visible) {
            let ce = T(b, ee, A, N);
            (b.onBeforeShadow(i, b, R, x, X, ce, j),
              i.renderBufferDirect(x, null, X, ce, b, j),
              b.onAfterShadow(i, b, R, x, X, ce, j));
          }
        }
      } else if (W.visible) {
        let D = T(b, W, A, N);
        (b.onBeforeShadow(i, b, R, x, X, D, null),
          i.renderBufferDirect(x, null, X, D, b, null),
          b.onAfterShadow(i, b, R, x, X, D, null));
      }
    }
    let O = b.children;
    for (let X = 0, W = O.length; X < W; X++) E(O[X], R, x, A, N);
  }
  function w(b) {
    b.target.removeEventListener("dispose", w);
    for (let x in l) {
      let A = l[x],
        N = b.target.uuid;
      N in A && (A[N].dispose(), delete A[N]);
    }
  }
}
function sg(i, e) {
  function t() {
    let I = !1,
      se = new ut(),
      Y = null,
      ge = new ut(0, 0, 0, 0);
    return {
      setMask: function (ae) {
        Y !== ae && !I && (i.colorMask(ae, ae, ae, ae), (Y = ae));
      },
      setLocked: function (ae) {
        I = ae;
      },
      setClear: function (ae, K, be, Oe, pt) {
        (pt === !0 && ((ae *= Oe), (K *= Oe), (be *= Oe)),
          se.set(ae, K, be, Oe),
          ge.equals(se) === !1 && (i.clearColor(ae, K, be, Oe), ge.copy(se)));
      },
      reset: function () {
        ((I = !1), (Y = null), ge.set(-1, 0, 0, 0));
      },
    };
  }
  function n() {
    let I = !1,
      se = !1,
      Y = null,
      ge = null,
      ae = null;
    return {
      setReversed: function (K) {
        if (se !== K) {
          let be = e.get("EXT_clip_control");
          (K
            ? be.clipControlEXT(be.LOWER_LEFT_EXT, be.ZERO_TO_ONE_EXT)
            : be.clipControlEXT(be.LOWER_LEFT_EXT, be.NEGATIVE_ONE_TO_ONE_EXT),
            (se = K));
          let Oe = ae;
          ((ae = null), this.setClear(Oe));
        }
      },
      getReversed: function () {
        return se;
      },
      setTest: function (K) {
        K ? te(i.DEPTH_TEST) : Ae(i.DEPTH_TEST);
      },
      setMask: function (K) {
        Y !== K && !I && (i.depthMask(K), (Y = K));
      },
      setFunc: function (K) {
        if ((se && (K = Bc[K]), ge !== K)) {
          switch (K) {
            case hr:
              i.depthFunc(i.NEVER);
              break;
            case ur:
              i.depthFunc(i.ALWAYS);
              break;
            case dr:
              i.depthFunc(i.LESS);
              break;
            case ri:
              i.depthFunc(i.LEQUAL);
              break;
            case fr:
              i.depthFunc(i.EQUAL);
              break;
            case pr:
              i.depthFunc(i.GEQUAL);
              break;
            case mr:
              i.depthFunc(i.GREATER);
              break;
            case gr:
              i.depthFunc(i.NOTEQUAL);
              break;
            default:
              i.depthFunc(i.LEQUAL);
          }
          ge = K;
        }
      },
      setLocked: function (K) {
        I = K;
      },
      setClear: function (K) {
        ae !== K && ((ae = K), se && (K = 1 - K), i.clearDepth(K));
      },
      reset: function () {
        ((I = !1), (Y = null), (ge = null), (ae = null), (se = !1));
      },
    };
  }
  function s() {
    let I = !1,
      se = null,
      Y = null,
      ge = null,
      ae = null,
      K = null,
      be = null,
      Oe = null,
      pt = null;
    return {
      setTest: function (et) {
        I || (et ? te(i.STENCIL_TEST) : Ae(i.STENCIL_TEST));
      },
      setMask: function (et) {
        se !== et && !I && (i.stencilMask(et), (se = et));
      },
      setFunc: function (et, xn, sn) {
        (Y !== et || ge !== xn || ae !== sn) &&
          (i.stencilFunc(et, xn, sn), (Y = et), (ge = xn), (ae = sn));
      },
      setOp: function (et, xn, sn) {
        (K !== et || be !== xn || Oe !== sn) &&
          (i.stencilOp(et, xn, sn), (K = et), (be = xn), (Oe = sn));
      },
      setLocked: function (et) {
        I = et;
      },
      setClear: function (et) {
        pt !== et && (i.clearStencil(et), (pt = et));
      },
      reset: function () {
        ((I = !1),
          (se = null),
          (Y = null),
          (ge = null),
          (ae = null),
          (K = null),
          (be = null),
          (Oe = null),
          (pt = null));
      },
    };
  }
  let r = new t(),
    a = new n(),
    o = new s(),
    c = new WeakMap(),
    l = new WeakMap(),
    u = {},
    d = {},
    h = {},
    p = new WeakMap(),
    g = [],
    y = null,
    m = !1,
    f = null,
    M = null,
    T = null,
    E = null,
    w = null,
    b = null,
    R = null,
    x = new Pe(0, 0, 0),
    A = 0,
    N = !1,
    C = null,
    O = null,
    X = null,
    W = null,
    D = null,
    V = i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),
    k = !1,
    j = 0,
    ee = i.getParameter(i.VERSION);
  ee.indexOf("WebGL") !== -1
    ? ((j = parseFloat(/^WebGL (\d)/.exec(ee)[1])), (k = j >= 1))
    : ee.indexOf("OpenGL ES") !== -1 &&
      ((j = parseFloat(/^OpenGL ES (\d)/.exec(ee)[1])), (k = j >= 2));
  let ce = null,
    ye = {},
    Me = i.getParameter(i.SCISSOR_BOX),
    We = i.getParameter(i.VIEWPORT),
    $e = new ut().fromArray(Me),
    De = new ut().fromArray(We);
  function $(I, se, Y, ge) {
    let ae = new Uint8Array(4),
      K = i.createTexture();
    (i.bindTexture(I, K),
      i.texParameteri(I, i.TEXTURE_MIN_FILTER, i.NEAREST),
      i.texParameteri(I, i.TEXTURE_MAG_FILTER, i.NEAREST));
    for (let be = 0; be < Y; be++)
      I === i.TEXTURE_3D || I === i.TEXTURE_2D_ARRAY
        ? i.texImage3D(se, 0, i.RGBA, 1, 1, ge, 0, i.RGBA, i.UNSIGNED_BYTE, ae)
        : i.texImage2D(
            se + be,
            0,
            i.RGBA,
            1,
            1,
            0,
            i.RGBA,
            i.UNSIGNED_BYTE,
            ae,
          );
    return K;
  }
  let de = {};
  ((de[i.TEXTURE_2D] = $(i.TEXTURE_2D, i.TEXTURE_2D, 1)),
    (de[i.TEXTURE_CUBE_MAP] = $(
      i.TEXTURE_CUBE_MAP,
      i.TEXTURE_CUBE_MAP_POSITIVE_X,
      6,
    )),
    (de[i.TEXTURE_2D_ARRAY] = $(i.TEXTURE_2D_ARRAY, i.TEXTURE_2D_ARRAY, 1, 1)),
    (de[i.TEXTURE_3D] = $(i.TEXTURE_3D, i.TEXTURE_3D, 1, 1)),
    r.setClear(0, 0, 0, 1),
    a.setClear(1),
    o.setClear(0),
    te(i.DEPTH_TEST),
    a.setFunc(ri),
    le(!1),
    we(Co),
    te(i.CULL_FACE),
    nt(pn));
  function te(I) {
    u[I] !== !0 && (i.enable(I), (u[I] = !0));
  }
  function Ae(I) {
    u[I] !== !1 && (i.disable(I), (u[I] = !1));
  }
  function Le(I, se) {
    return h[I] !== se
      ? (i.bindFramebuffer(I, se),
        (h[I] = se),
        I === i.DRAW_FRAMEBUFFER && (h[i.FRAMEBUFFER] = se),
        I === i.FRAMEBUFFER && (h[i.DRAW_FRAMEBUFFER] = se),
        !0)
      : !1;
  }
  function Re(I, se) {
    let Y = g,
      ge = !1;
    if (I) {
      ((Y = p.get(se)), Y === void 0 && ((Y = []), p.set(se, Y)));
      let ae = I.textures;
      if (Y.length !== ae.length || Y[0] !== i.COLOR_ATTACHMENT0) {
        for (let K = 0, be = ae.length; K < be; K++)
          Y[K] = i.COLOR_ATTACHMENT0 + K;
        ((Y.length = ae.length), (ge = !0));
      }
    } else Y[0] !== i.BACK && ((Y[0] = i.BACK), (ge = !0));
    ge && i.drawBuffers(Y);
  }
  function lt(I) {
    return y !== I ? (i.useProgram(I), (y = I), !0) : !1;
  }
  let He = {
    [kn]: i.FUNC_ADD,
    [lc]: i.FUNC_SUBTRACT,
    [cc]: i.FUNC_REVERSE_SUBTRACT,
  };
  ((He[hc] = i.MIN), (He[uc] = i.MAX));
  let Ke = {
    [dc]: i.ZERO,
    [fc]: i.ONE,
    [pc]: i.SRC_COLOR,
    [lr]: i.SRC_ALPHA,
    [yc]: i.SRC_ALPHA_SATURATE,
    [xc]: i.DST_COLOR,
    [gc]: i.DST_ALPHA,
    [mc]: i.ONE_MINUS_SRC_COLOR,
    [cr]: i.ONE_MINUS_SRC_ALPHA,
    [vc]: i.ONE_MINUS_DST_COLOR,
    [_c]: i.ONE_MINUS_DST_ALPHA,
    [Mc]: i.CONSTANT_COLOR,
    [Sc]: i.ONE_MINUS_CONSTANT_COLOR,
    [bc]: i.CONSTANT_ALPHA,
    [Ec]: i.ONE_MINUS_CONSTANT_ALPHA,
  };
  function nt(I, se, Y, ge, ae, K, be, Oe, pt, et) {
    if (I === pn) {
      m === !0 && (Ae(i.BLEND), (m = !1));
      return;
    }
    if ((m === !1 && (te(i.BLEND), (m = !0)), I !== oc)) {
      if (I !== f || et !== N) {
        if (
          ((M !== kn || w !== kn) &&
            (i.blendEquation(i.FUNC_ADD), (M = kn), (w = kn)),
          et)
        )
          switch (I) {
            case si:
              i.blendFuncSeparate(
                i.ONE,
                i.ONE_MINUS_SRC_ALPHA,
                i.ONE,
                i.ONE_MINUS_SRC_ALPHA,
              );
              break;
            case Ro:
              i.blendFunc(i.ONE, i.ONE);
              break;
            case Io:
              i.blendFuncSeparate(i.ZERO, i.ONE_MINUS_SRC_COLOR, i.ZERO, i.ONE);
              break;
            case Po:
              i.blendFuncSeparate(
                i.DST_COLOR,
                i.ONE_MINUS_SRC_ALPHA,
                i.ZERO,
                i.ONE,
              );
              break;
            default:
              Ie("WebGLState: Invalid blending: ", I);
              break;
          }
        else
          switch (I) {
            case si:
              i.blendFuncSeparate(
                i.SRC_ALPHA,
                i.ONE_MINUS_SRC_ALPHA,
                i.ONE,
                i.ONE_MINUS_SRC_ALPHA,
              );
              break;
            case Ro:
              i.blendFuncSeparate(i.SRC_ALPHA, i.ONE, i.ONE, i.ONE);
              break;
            case Io:
              Ie(
                "WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true",
              );
              break;
            case Po:
              Ie(
                "WebGLState: MultiplyBlending requires material.premultipliedAlpha = true",
              );
              break;
            default:
              Ie("WebGLState: Invalid blending: ", I);
              break;
          }
        ((T = null),
          (E = null),
          (b = null),
          (R = null),
          x.set(0, 0, 0),
          (A = 0),
          (f = I),
          (N = et));
      }
      return;
    }
    ((ae = ae || se),
      (K = K || Y),
      (be = be || ge),
      (se !== M || ae !== w) &&
        (i.blendEquationSeparate(He[se], He[ae]), (M = se), (w = ae)),
      (Y !== T || ge !== E || K !== b || be !== R) &&
        (i.blendFuncSeparate(Ke[Y], Ke[ge], Ke[K], Ke[be]),
        (T = Y),
        (E = ge),
        (b = K),
        (R = be)),
      (Oe.equals(x) === !1 || pt !== A) &&
        (i.blendColor(Oe.r, Oe.g, Oe.b, pt), x.copy(Oe), (A = pt)),
      (f = I),
      (N = !1));
  }
  function H(I, se) {
    I.side === fn ? Ae(i.CULL_FACE) : te(i.CULL_FACE);
    let Y = I.side === Dt;
    (se && (Y = !Y),
      le(Y),
      I.blending === si && I.transparent === !1
        ? nt(pn)
        : nt(
            I.blending,
            I.blendEquation,
            I.blendSrc,
            I.blendDst,
            I.blendEquationAlpha,
            I.blendSrcAlpha,
            I.blendDstAlpha,
            I.blendColor,
            I.blendAlpha,
            I.premultipliedAlpha,
          ),
      a.setFunc(I.depthFunc),
      a.setTest(I.depthTest),
      a.setMask(I.depthWrite),
      r.setMask(I.colorWrite));
    let ge = I.stencilWrite;
    (o.setTest(ge),
      ge &&
        (o.setMask(I.stencilWriteMask),
        o.setFunc(I.stencilFunc, I.stencilRef, I.stencilFuncMask),
        o.setOp(I.stencilFail, I.stencilZFail, I.stencilZPass)),
      P(I.polygonOffset, I.polygonOffsetFactor, I.polygonOffsetUnits),
      I.alphaToCoverage === !0
        ? te(i.SAMPLE_ALPHA_TO_COVERAGE)
        : Ae(i.SAMPLE_ALPHA_TO_COVERAGE));
  }
  function le(I) {
    C !== I && (I ? i.frontFace(i.CW) : i.frontFace(i.CCW), (C = I));
  }
  function we(I) {
    (I !== sc
      ? (te(i.CULL_FACE),
        I !== O &&
          (I === Co
            ? i.cullFace(i.BACK)
            : I === rc
              ? i.cullFace(i.FRONT)
              : i.cullFace(i.FRONT_AND_BACK)))
      : Ae(i.CULL_FACE),
      (O = I));
  }
  function ke(I) {
    I !== X && (k && i.lineWidth(I), (X = I));
  }
  function P(I, se, Y) {
    I
      ? (te(i.POLYGON_OFFSET_FILL),
        (W !== se || D !== Y) &&
          ((W = se),
          (D = Y),
          a.getReversed() && (se = -se),
          i.polygonOffset(se, Y)))
      : Ae(i.POLYGON_OFFSET_FILL);
  }
  function it(I) {
    I ? te(i.SCISSOR_TEST) : Ae(i.SCISSOR_TEST);
  }
  function Fe(I) {
    (I === void 0 && (I = i.TEXTURE0 + V - 1),
      ce !== I && (i.activeTexture(I), (ce = I)));
  }
  function je(I, se, Y) {
    Y === void 0 && (ce === null ? (Y = i.TEXTURE0 + V - 1) : (Y = ce));
    let ge = ye[Y];
    (ge === void 0 && ((ge = { type: void 0, texture: void 0 }), (ye[Y] = ge)),
      (ge.type !== I || ge.texture !== se) &&
        (ce !== Y && (i.activeTexture(Y), (ce = Y)),
        i.bindTexture(I, se || de[I]),
        (ge.type = I),
        (ge.texture = se)));
  }
  function he() {
    let I = ye[ce];
    I !== void 0 &&
      I.type !== void 0 &&
      (i.bindTexture(I.type, null), (I.type = void 0), (I.texture = void 0));
  }
  function dt() {
    try {
      i.compressedTexImage2D(...arguments);
    } catch (I) {
      Ie("WebGLState:", I);
    }
  }
  function S() {
    try {
      i.compressedTexImage3D(...arguments);
    } catch (I) {
      Ie("WebGLState:", I);
    }
  }
  function _() {
    try {
      i.texSubImage2D(...arguments);
    } catch (I) {
      Ie("WebGLState:", I);
    }
  }
  function F() {
    try {
      i.texSubImage3D(...arguments);
    } catch (I) {
      Ie("WebGLState:", I);
    }
  }
  function Z() {
    try {
      i.compressedTexSubImage2D(...arguments);
    } catch (I) {
      Ie("WebGLState:", I);
    }
  }
  function Q() {
    try {
      i.compressedTexSubImage3D(...arguments);
    } catch (I) {
      Ie("WebGLState:", I);
    }
  }
  function ne() {
    try {
      i.texStorage2D(...arguments);
    } catch (I) {
      Ie("WebGLState:", I);
    }
  }
  function oe() {
    try {
      i.texStorage3D(...arguments);
    } catch (I) {
      Ie("WebGLState:", I);
    }
  }
  function q() {
    try {
      i.texImage2D(...arguments);
    } catch (I) {
      Ie("WebGLState:", I);
    }
  }
  function J() {
    try {
      i.texImage3D(...arguments);
    } catch (I) {
      Ie("WebGLState:", I);
    }
  }
  function me(I) {
    return d[I] !== void 0 ? d[I] : i.getParameter(I);
  }
  function xe(I, se) {
    d[I] !== se && (i.pixelStorei(I, se), (d[I] = se));
  }
  function re(I) {
    $e.equals(I) === !1 && (i.scissor(I.x, I.y, I.z, I.w), $e.copy(I));
  }
  function ie(I) {
    De.equals(I) === !1 && (i.viewport(I.x, I.y, I.z, I.w), De.copy(I));
  }
  function Ue(I, se) {
    let Y = l.get(se);
    Y === void 0 && ((Y = new WeakMap()), l.set(se, Y));
    let ge = Y.get(I);
    ge === void 0 && ((ge = i.getUniformBlockIndex(se, I.name)), Y.set(I, ge));
  }
  function ze(I, se) {
    let ge = l.get(se).get(I);
    c.get(se) !== ge &&
      (i.uniformBlockBinding(se, ge, I.__bindingPointIndex), c.set(se, ge));
  }
  function Je() {
    (i.disable(i.BLEND),
      i.disable(i.CULL_FACE),
      i.disable(i.DEPTH_TEST),
      i.disable(i.POLYGON_OFFSET_FILL),
      i.disable(i.SCISSOR_TEST),
      i.disable(i.STENCIL_TEST),
      i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),
      i.blendEquation(i.FUNC_ADD),
      i.blendFunc(i.ONE, i.ZERO),
      i.blendFuncSeparate(i.ONE, i.ZERO, i.ONE, i.ZERO),
      i.blendColor(0, 0, 0, 0),
      i.colorMask(!0, !0, !0, !0),
      i.clearColor(0, 0, 0, 0),
      i.depthMask(!0),
      i.depthFunc(i.LESS),
      a.setReversed(!1),
      i.clearDepth(1),
      i.stencilMask(4294967295),
      i.stencilFunc(i.ALWAYS, 0, 4294967295),
      i.stencilOp(i.KEEP, i.KEEP, i.KEEP),
      i.clearStencil(0),
      i.cullFace(i.BACK),
      i.frontFace(i.CCW),
      i.polygonOffset(0, 0),
      i.activeTexture(i.TEXTURE0),
      i.bindFramebuffer(i.FRAMEBUFFER, null),
      i.bindFramebuffer(i.DRAW_FRAMEBUFFER, null),
      i.bindFramebuffer(i.READ_FRAMEBUFFER, null),
      i.useProgram(null),
      i.lineWidth(1),
      i.scissor(0, 0, i.canvas.width, i.canvas.height),
      i.viewport(0, 0, i.canvas.width, i.canvas.height),
      i.pixelStorei(i.PACK_ALIGNMENT, 4),
      i.pixelStorei(i.UNPACK_ALIGNMENT, 4),
      i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, !1),
      i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, !1),
      i.pixelStorei(
        i.UNPACK_COLORSPACE_CONVERSION_WEBGL,
        i.BROWSER_DEFAULT_WEBGL,
      ),
      i.pixelStorei(i.PACK_ROW_LENGTH, 0),
      i.pixelStorei(i.PACK_SKIP_PIXELS, 0),
      i.pixelStorei(i.PACK_SKIP_ROWS, 0),
      i.pixelStorei(i.UNPACK_ROW_LENGTH, 0),
      i.pixelStorei(i.UNPACK_IMAGE_HEIGHT, 0),
      i.pixelStorei(i.UNPACK_SKIP_PIXELS, 0),
      i.pixelStorei(i.UNPACK_SKIP_ROWS, 0),
      i.pixelStorei(i.UNPACK_SKIP_IMAGES, 0),
      (u = {}),
      (d = {}),
      (ce = null),
      (ye = {}),
      (h = {}),
      (p = new WeakMap()),
      (g = []),
      (y = null),
      (m = !1),
      (f = null),
      (M = null),
      (T = null),
      (E = null),
      (w = null),
      (b = null),
      (R = null),
      (x = new Pe(0, 0, 0)),
      (A = 0),
      (N = !1),
      (C = null),
      (O = null),
      (X = null),
      (W = null),
      (D = null),
      $e.set(0, 0, i.canvas.width, i.canvas.height),
      De.set(0, 0, i.canvas.width, i.canvas.height),
      r.reset(),
      a.reset(),
      o.reset());
  }
  return {
    buffers: { color: r, depth: a, stencil: o },
    enable: te,
    disable: Ae,
    bindFramebuffer: Le,
    drawBuffers: Re,
    useProgram: lt,
    setBlending: nt,
    setMaterial: H,
    setFlipSided: le,
    setCullFace: we,
    setLineWidth: ke,
    setPolygonOffset: P,
    setScissorTest: it,
    activeTexture: Fe,
    bindTexture: je,
    unbindTexture: he,
    compressedTexImage2D: dt,
    compressedTexImage3D: S,
    texImage2D: q,
    texImage3D: J,
    pixelStorei: xe,
    getParameter: me,
    updateUBOMapping: Ue,
    uniformBlockBinding: ze,
    texStorage2D: ne,
    texStorage3D: oe,
    texSubImage2D: _,
    texSubImage3D: F,
    compressedTexSubImage2D: Z,
    compressedTexSubImage3D: Q,
    scissor: re,
    viewport: ie,
    reset: Je,
  };
}
function rg(i, e, t, n, s, r, a) {
  let o = e.has("WEBGL_multisampled_render_to_texture")
      ? e.get("WEBGL_multisampled_render_to_texture")
      : null,
    c =
      typeof navigator > "u" ? !1 : /OculusBrowser/g.test(navigator.userAgent),
    l = new Ye(),
    u = new WeakMap(),
    d = new Set(),
    h,
    p = new WeakMap(),
    g = !1;
  try {
    g =
      typeof OffscreenCanvas < "u" &&
      new OffscreenCanvas(1, 1).getContext("2d") !== null;
  } catch {}
  function y(S, _) {
    return g ? new OffscreenCanvas(S, _) : as("canvas");
  }
  function m(S, _, F) {
    let Z = 1,
      Q = dt(S);
    if (
      ((Q.width > F || Q.height > F) && (Z = F / Math.max(Q.width, Q.height)),
      Z < 1)
    )
      if (
        (typeof HTMLImageElement < "u" && S instanceof HTMLImageElement) ||
        (typeof HTMLCanvasElement < "u" && S instanceof HTMLCanvasElement) ||
        (typeof ImageBitmap < "u" && S instanceof ImageBitmap) ||
        (typeof VideoFrame < "u" && S instanceof VideoFrame)
      ) {
        let ne = Math.floor(Z * Q.width),
          oe = Math.floor(Z * Q.height);
        h === void 0 && (h = y(ne, oe));
        let q = _ ? y(ne, oe) : h;
        return (
          (q.width = ne),
          (q.height = oe),
          q.getContext("2d").drawImage(S, 0, 0, ne, oe),
          Ce(
            "WebGLRenderer: Texture has been resized from (" +
              Q.width +
              "x" +
              Q.height +
              ") to (" +
              ne +
              "x" +
              oe +
              ").",
          ),
          q
        );
      } else
        return (
          "data" in S &&
            Ce(
              "WebGLRenderer: Image in DataTexture is too big (" +
                Q.width +
                "x" +
                Q.height +
                ").",
            ),
          S
        );
    return S;
  }
  function f(S) {
    return S.generateMipmaps;
  }
  function M(S) {
    i.generateMipmap(S);
  }
  function T(S) {
    return S.isWebGLCubeRenderTarget
      ? i.TEXTURE_CUBE_MAP
      : S.isWebGL3DRenderTarget
        ? i.TEXTURE_3D
        : S.isWebGLArrayRenderTarget || S.isCompressedArrayTexture
          ? i.TEXTURE_2D_ARRAY
          : i.TEXTURE_2D;
  }
  function E(S, _, F, Z, Q, ne = !1) {
    if (S !== null) {
      if (i[S] !== void 0) return i[S];
      Ce(
        "WebGLRenderer: Attempt to use non-existing WebGL internal format '" +
          S +
          "'",
      );
    }
    let oe;
    Z &&
      ((oe = e.get("EXT_texture_norm16")),
      oe ||
        Ce(
          "WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension",
        ));
    let q = _;
    if (
      (_ === i.RED &&
        (F === i.FLOAT && (q = i.R32F),
        F === i.HALF_FLOAT && (q = i.R16F),
        F === i.UNSIGNED_BYTE && (q = i.R8),
        F === i.UNSIGNED_SHORT && oe && (q = oe.R16_EXT),
        F === i.SHORT && oe && (q = oe.R16_SNORM_EXT)),
      _ === i.RED_INTEGER &&
        (F === i.UNSIGNED_BYTE && (q = i.R8UI),
        F === i.UNSIGNED_SHORT && (q = i.R16UI),
        F === i.UNSIGNED_INT && (q = i.R32UI),
        F === i.BYTE && (q = i.R8I),
        F === i.SHORT && (q = i.R16I),
        F === i.INT && (q = i.R32I)),
      _ === i.RG &&
        (F === i.FLOAT && (q = i.RG32F),
        F === i.HALF_FLOAT && (q = i.RG16F),
        F === i.UNSIGNED_BYTE && (q = i.RG8),
        F === i.UNSIGNED_SHORT && oe && (q = oe.RG16_EXT),
        F === i.SHORT && oe && (q = oe.RG16_SNORM_EXT)),
      _ === i.RG_INTEGER &&
        (F === i.UNSIGNED_BYTE && (q = i.RG8UI),
        F === i.UNSIGNED_SHORT && (q = i.RG16UI),
        F === i.UNSIGNED_INT && (q = i.RG32UI),
        F === i.BYTE && (q = i.RG8I),
        F === i.SHORT && (q = i.RG16I),
        F === i.INT && (q = i.RG32I)),
      _ === i.RGB_INTEGER &&
        (F === i.UNSIGNED_BYTE && (q = i.RGB8UI),
        F === i.UNSIGNED_SHORT && (q = i.RGB16UI),
        F === i.UNSIGNED_INT && (q = i.RGB32UI),
        F === i.BYTE && (q = i.RGB8I),
        F === i.SHORT && (q = i.RGB16I),
        F === i.INT && (q = i.RGB32I)),
      _ === i.RGBA_INTEGER &&
        (F === i.UNSIGNED_BYTE && (q = i.RGBA8UI),
        F === i.UNSIGNED_SHORT && (q = i.RGBA16UI),
        F === i.UNSIGNED_INT && (q = i.RGBA32UI),
        F === i.BYTE && (q = i.RGBA8I),
        F === i.SHORT && (q = i.RGBA16I),
        F === i.INT && (q = i.RGBA32I)),
      _ === i.RGB &&
        (F === i.UNSIGNED_SHORT && oe && (q = oe.RGB16_EXT),
        F === i.SHORT && oe && (q = oe.RGB16_SNORM_EXT),
        F === i.UNSIGNED_INT_5_9_9_9_REV && (q = i.RGB9_E5),
        F === i.UNSIGNED_INT_10F_11F_11F_REV && (q = i.R11F_G11F_B10F)),
      _ === i.RGBA)
    ) {
      let J = ne ? rs : Xe.getTransfer(Q);
      (F === i.FLOAT && (q = i.RGBA32F),
        F === i.HALF_FLOAT && (q = i.RGBA16F),
        F === i.UNSIGNED_BYTE && (q = J === Qe ? i.SRGB8_ALPHA8 : i.RGBA8),
        F === i.UNSIGNED_SHORT && oe && (q = oe.RGBA16_EXT),
        F === i.SHORT && oe && (q = oe.RGBA16_SNORM_EXT),
        F === i.UNSIGNED_SHORT_4_4_4_4 && (q = i.RGBA4),
        F === i.UNSIGNED_SHORT_5_5_5_1 && (q = i.RGB5_A1));
    }
    return (
      (q === i.R16F ||
        q === i.R32F ||
        q === i.RG16F ||
        q === i.RG32F ||
        q === i.RGBA16F ||
        q === i.RGBA32F) &&
        e.get("EXT_color_buffer_float"),
      q
    );
  }
  function w(S, _) {
    let F;
    return (
      S
        ? _ === null || _ === en || _ === Xi
          ? (F = i.DEPTH24_STENCIL8)
          : _ === tn
            ? (F = i.DEPTH32F_STENCIL8)
            : _ === Wi &&
              ((F = i.DEPTH24_STENCIL8),
              Ce(
                "DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.",
              ))
        : _ === null || _ === en || _ === Xi
          ? (F = i.DEPTH_COMPONENT24)
          : _ === tn
            ? (F = i.DEPTH_COMPONENT32F)
            : _ === Wi && (F = i.DEPTH_COMPONENT16),
      F
    );
  }
  function b(S, _) {
    return f(S) === !0 ||
      (S.isFramebufferTexture && S.minFilter !== Mt && S.minFilter !== Tt)
      ? Math.log2(Math.max(_.width, _.height)) + 1
      : S.mipmaps !== void 0 && S.mipmaps.length > 0
        ? S.mipmaps.length
        : S.isCompressedTexture && Array.isArray(S.image)
          ? _.mipmaps.length
          : 1;
  }
  function R(S) {
    let _ = S.target;
    (_.removeEventListener("dispose", R),
      A(_),
      _.isVideoTexture && u.delete(_),
      _.isHTMLTexture && d.delete(_));
  }
  function x(S) {
    let _ = S.target;
    (_.removeEventListener("dispose", x), C(_));
  }
  function A(S) {
    let _ = n.get(S);
    if (_.__webglInit === void 0) return;
    let F = S.source,
      Z = p.get(F);
    if (Z) {
      let Q = Z[_.__cacheKey];
      (Q.usedTimes--,
        Q.usedTimes === 0 && N(S),
        Object.keys(Z).length === 0 && p.delete(F));
    }
    n.remove(S);
  }
  function N(S) {
    let _ = n.get(S);
    i.deleteTexture(_.__webglTexture);
    let F = S.source,
      Z = p.get(F);
    (delete Z[_.__cacheKey], a.memory.textures--);
  }
  function C(S) {
    let _ = n.get(S);
    if (
      (S.depthTexture && (S.depthTexture.dispose(), n.remove(S.depthTexture)),
      S.isWebGLCubeRenderTarget)
    )
      for (let Z = 0; Z < 6; Z++) {
        if (Array.isArray(_.__webglFramebuffer[Z]))
          for (let Q = 0; Q < _.__webglFramebuffer[Z].length; Q++)
            i.deleteFramebuffer(_.__webglFramebuffer[Z][Q]);
        else i.deleteFramebuffer(_.__webglFramebuffer[Z]);
        _.__webglDepthbuffer && i.deleteRenderbuffer(_.__webglDepthbuffer[Z]);
      }
    else {
      if (Array.isArray(_.__webglFramebuffer))
        for (let Z = 0; Z < _.__webglFramebuffer.length; Z++)
          i.deleteFramebuffer(_.__webglFramebuffer[Z]);
      else i.deleteFramebuffer(_.__webglFramebuffer);
      if (
        (_.__webglDepthbuffer && i.deleteRenderbuffer(_.__webglDepthbuffer),
        _.__webglMultisampledFramebuffer &&
          i.deleteFramebuffer(_.__webglMultisampledFramebuffer),
        _.__webglColorRenderbuffer)
      )
        for (let Z = 0; Z < _.__webglColorRenderbuffer.length; Z++)
          _.__webglColorRenderbuffer[Z] &&
            i.deleteRenderbuffer(_.__webglColorRenderbuffer[Z]);
      _.__webglDepthRenderbuffer &&
        i.deleteRenderbuffer(_.__webglDepthRenderbuffer);
    }
    let F = S.textures;
    for (let Z = 0, Q = F.length; Z < Q; Z++) {
      let ne = n.get(F[Z]);
      (ne.__webglTexture &&
        (i.deleteTexture(ne.__webglTexture), a.memory.textures--),
        n.remove(F[Z]));
    }
    n.remove(S);
  }
  let O = 0;
  function X() {
    O = 0;
  }
  function W() {
    return O;
  }
  function D(S) {
    O = S;
  }
  function V() {
    let S = O;
    return (
      S >= s.maxTextures &&
        Ce(
          "WebGLTextures: Trying to use " +
            S +
            " texture units while this GPU supports only " +
            s.maxTextures,
        ),
      (O += 1),
      S
    );
  }
  function k(S) {
    let _ = [];
    return (
      _.push(S.wrapS),
      _.push(S.wrapT),
      _.push(S.wrapR || 0),
      _.push(S.magFilter),
      _.push(S.minFilter),
      _.push(S.anisotropy),
      _.push(S.internalFormat),
      _.push(S.format),
      _.push(S.type),
      _.push(S.generateMipmaps),
      _.push(S.premultiplyAlpha),
      _.push(S.flipY),
      _.push(S.unpackAlignment),
      _.push(S.colorSpace),
      _.join()
    );
  }
  function j(S, _) {
    let F = n.get(S);
    if (
      (S.isVideoTexture && je(S),
      S.isRenderTargetTexture === !1 &&
        S.isExternalTexture !== !0 &&
        S.version > 0 &&
        F.__version !== S.version)
    ) {
      let Z = S.image;
      if (Z === null)
        Ce("WebGLRenderer: Texture marked for update but no image data found.");
      else if (Z.complete === !1)
        Ce("WebGLRenderer: Texture marked for update but image is incomplete");
      else {
        Ae(F, S, _);
        return;
      }
    } else
      S.isExternalTexture &&
        (F.__webglTexture = S.sourceTexture ? S.sourceTexture : null);
    t.bindTexture(i.TEXTURE_2D, F.__webglTexture, i.TEXTURE0 + _);
  }
  function ee(S, _) {
    let F = n.get(S);
    if (
      S.isRenderTargetTexture === !1 &&
      S.version > 0 &&
      F.__version !== S.version
    ) {
      Ae(F, S, _);
      return;
    } else
      S.isExternalTexture &&
        (F.__webglTexture = S.sourceTexture ? S.sourceTexture : null);
    t.bindTexture(i.TEXTURE_2D_ARRAY, F.__webglTexture, i.TEXTURE0 + _);
  }
  function ce(S, _) {
    let F = n.get(S);
    if (
      S.isRenderTargetTexture === !1 &&
      S.version > 0 &&
      F.__version !== S.version
    ) {
      Ae(F, S, _);
      return;
    }
    t.bindTexture(i.TEXTURE_3D, F.__webglTexture, i.TEXTURE0 + _);
  }
  function ye(S, _) {
    let F = n.get(S);
    if (
      S.isCubeDepthTexture !== !0 &&
      S.version > 0 &&
      F.__version !== S.version
    ) {
      Le(F, S, _);
      return;
    }
    t.bindTexture(i.TEXTURE_CUBE_MAP, F.__webglTexture, i.TEXTURE0 + _);
  }
  let Me = { [_r]: i.REPEAT, [ln]: i.CLAMP_TO_EDGE, [xr]: i.MIRRORED_REPEAT },
    We = {
      [Mt]: i.NEAREST,
      [wc]: i.NEAREST_MIPMAP_NEAREST,
      [Es]: i.NEAREST_MIPMAP_LINEAR,
      [Tt]: i.LINEAR,
      [qr]: i.LINEAR_MIPMAP_NEAREST,
      [Zn]: i.LINEAR_MIPMAP_LINEAR,
    },
    $e = {
      [Rc]: i.NEVER,
      [Uc]: i.ALWAYS,
      [Ic]: i.LESS,
      [Ia]: i.LEQUAL,
      [Pc]: i.EQUAL,
      [Pa]: i.GEQUAL,
      [Lc]: i.GREATER,
      [Dc]: i.NOTEQUAL,
    };
  function De(S, _) {
    if (
      (_.type === tn &&
        e.has("OES_texture_float_linear") === !1 &&
        (_.magFilter === Tt ||
          _.magFilter === qr ||
          _.magFilter === Es ||
          _.magFilter === Zn ||
          _.minFilter === Tt ||
          _.minFilter === qr ||
          _.minFilter === Es ||
          _.minFilter === Zn) &&
        Ce(
          "WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device.",
        ),
      i.texParameteri(S, i.TEXTURE_WRAP_S, Me[_.wrapS]),
      i.texParameteri(S, i.TEXTURE_WRAP_T, Me[_.wrapT]),
      (S === i.TEXTURE_3D || S === i.TEXTURE_2D_ARRAY) &&
        i.texParameteri(S, i.TEXTURE_WRAP_R, Me[_.wrapR]),
      i.texParameteri(S, i.TEXTURE_MAG_FILTER, We[_.magFilter]),
      i.texParameteri(S, i.TEXTURE_MIN_FILTER, We[_.minFilter]),
      _.compareFunction &&
        (i.texParameteri(S, i.TEXTURE_COMPARE_MODE, i.COMPARE_REF_TO_TEXTURE),
        i.texParameteri(S, i.TEXTURE_COMPARE_FUNC, $e[_.compareFunction])),
      e.has("EXT_texture_filter_anisotropic") === !0)
    ) {
      if (
        _.magFilter === Mt ||
        (_.minFilter !== Es && _.minFilter !== Zn) ||
        (_.type === tn && e.has("OES_texture_float_linear") === !1)
      )
        return;
      if (_.anisotropy > 1 || n.get(_).__currentAnisotropy) {
        let F = e.get("EXT_texture_filter_anisotropic");
        (i.texParameterf(
          S,
          F.TEXTURE_MAX_ANISOTROPY_EXT,
          Math.min(_.anisotropy, s.getMaxAnisotropy()),
        ),
          (n.get(_).__currentAnisotropy = _.anisotropy));
      }
    }
  }
  function $(S, _) {
    let F = !1;
    S.__webglInit === void 0 &&
      ((S.__webglInit = !0), _.addEventListener("dispose", R));
    let Z = _.source,
      Q = p.get(Z);
    Q === void 0 && ((Q = {}), p.set(Z, Q));
    let ne = k(_);
    if (ne !== S.__cacheKey) {
      (Q[ne] === void 0 &&
        ((Q[ne] = { texture: i.createTexture(), usedTimes: 0 }),
        a.memory.textures++,
        (F = !0)),
        Q[ne].usedTimes++);
      let oe = Q[S.__cacheKey];
      (oe !== void 0 &&
        (Q[S.__cacheKey].usedTimes--, oe.usedTimes === 0 && N(_)),
        (S.__cacheKey = ne),
        (S.__webglTexture = Q[ne].texture));
    }
    return F;
  }
  function de(S, _, F) {
    return Math.floor(Math.floor(S / F) / _);
  }
  function te(S, _, F, Z) {
    let ne = S.updateRanges;
    if (ne.length === 0)
      t.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, _.width, _.height, F, Z, _.data);
    else {
      ne.sort((xe, re) => xe.start - re.start);
      let oe = 0;
      for (let xe = 1; xe < ne.length; xe++) {
        let re = ne[oe],
          ie = ne[xe],
          Ue = re.start + re.count,
          ze = de(ie.start, _.width, 4),
          Je = de(re.start, _.width, 4);
        ie.start <= Ue + 1 &&
        ze === Je &&
        de(ie.start + ie.count - 1, _.width, 4) === ze
          ? (re.count = Math.max(re.count, ie.start + ie.count - re.start))
          : (++oe, (ne[oe] = ie));
      }
      ne.length = oe + 1;
      let q = t.getParameter(i.UNPACK_ROW_LENGTH),
        J = t.getParameter(i.UNPACK_SKIP_PIXELS),
        me = t.getParameter(i.UNPACK_SKIP_ROWS);
      t.pixelStorei(i.UNPACK_ROW_LENGTH, _.width);
      for (let xe = 0, re = ne.length; xe < re; xe++) {
        let ie = ne[xe],
          Ue = Math.floor(ie.start / 4),
          ze = Math.ceil(ie.count / 4),
          Je = Ue % _.width,
          I = Math.floor(Ue / _.width),
          se = ze,
          Y = 1;
        (t.pixelStorei(i.UNPACK_SKIP_PIXELS, Je),
          t.pixelStorei(i.UNPACK_SKIP_ROWS, I),
          t.texSubImage2D(i.TEXTURE_2D, 0, Je, I, se, Y, F, Z, _.data));
      }
      (S.clearUpdateRanges(),
        t.pixelStorei(i.UNPACK_ROW_LENGTH, q),
        t.pixelStorei(i.UNPACK_SKIP_PIXELS, J),
        t.pixelStorei(i.UNPACK_SKIP_ROWS, me));
    }
  }
  function Ae(S, _, F) {
    let Z = i.TEXTURE_2D;
    ((_.isDataArrayTexture || _.isCompressedArrayTexture) &&
      (Z = i.TEXTURE_2D_ARRAY),
      _.isData3DTexture && (Z = i.TEXTURE_3D));
    let Q = $(S, _),
      ne = _.source;
    t.bindTexture(Z, S.__webglTexture, i.TEXTURE0 + F);
    let oe = n.get(ne);
    if (ne.version !== oe.__version || Q === !0) {
      if (
        (t.activeTexture(i.TEXTURE0 + F),
        (typeof ImageBitmap < "u" && _.image instanceof ImageBitmap) === !1)
      ) {
        let Y = Xe.getPrimaries(Xe.workingColorSpace),
          ge = _.colorSpace === In ? null : Xe.getPrimaries(_.colorSpace),
          ae =
            _.colorSpace === In || Y === ge ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
        (t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, _.flipY),
          t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, _.premultiplyAlpha),
          t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, ae));
      }
      t.pixelStorei(i.UNPACK_ALIGNMENT, _.unpackAlignment);
      let J = m(_.image, !1, s.maxTextureSize);
      J = he(_, J);
      let me = r.convert(_.format, _.colorSpace),
        xe = r.convert(_.type),
        re = E(
          _.internalFormat,
          me,
          xe,
          _.normalized,
          _.colorSpace,
          _.isVideoTexture,
        );
      De(Z, _);
      let ie,
        Ue = _.mipmaps,
        ze = _.isVideoTexture !== !0,
        Je = oe.__version === void 0 || Q === !0,
        I = ne.dataReady,
        se = b(_, J);
      if (_.isDepthTexture)
        ((re = w(_.format === Jn, _.type)),
          Je &&
            (ze
              ? t.texStorage2D(i.TEXTURE_2D, 1, re, J.width, J.height)
              : t.texImage2D(
                  i.TEXTURE_2D,
                  0,
                  re,
                  J.width,
                  J.height,
                  0,
                  me,
                  xe,
                  null,
                )));
      else if (_.isDataTexture)
        if (Ue.length > 0) {
          ze &&
            Je &&
            t.texStorage2D(i.TEXTURE_2D, se, re, Ue[0].width, Ue[0].height);
          for (let Y = 0, ge = Ue.length; Y < ge; Y++)
            ((ie = Ue[Y]),
              ze
                ? I &&
                  t.texSubImage2D(
                    i.TEXTURE_2D,
                    Y,
                    0,
                    0,
                    ie.width,
                    ie.height,
                    me,
                    xe,
                    ie.data,
                  )
                : t.texImage2D(
                    i.TEXTURE_2D,
                    Y,
                    re,
                    ie.width,
                    ie.height,
                    0,
                    me,
                    xe,
                    ie.data,
                  ));
          _.generateMipmaps = !1;
        } else
          ze
            ? (Je && t.texStorage2D(i.TEXTURE_2D, se, re, J.width, J.height),
              I && te(_, J, me, xe))
            : t.texImage2D(
                i.TEXTURE_2D,
                0,
                re,
                J.width,
                J.height,
                0,
                me,
                xe,
                J.data,
              );
      else if (_.isCompressedTexture)
        if (_.isCompressedArrayTexture) {
          ze &&
            Je &&
            t.texStorage3D(
              i.TEXTURE_2D_ARRAY,
              se,
              re,
              Ue[0].width,
              Ue[0].height,
              J.depth,
            );
          for (let Y = 0, ge = Ue.length; Y < ge; Y++)
            if (((ie = Ue[Y]), _.format !== Yt))
              if (me !== null)
                if (ze) {
                  if (I)
                    if (_.layerUpdates.size > 0) {
                      let ae = Qo(ie.width, ie.height, _.format, _.type);
                      for (let K of _.layerUpdates) {
                        let be = ie.data.subarray(
                          (K * ae) / ie.data.BYTES_PER_ELEMENT,
                          ((K + 1) * ae) / ie.data.BYTES_PER_ELEMENT,
                        );
                        t.compressedTexSubImage3D(
                          i.TEXTURE_2D_ARRAY,
                          Y,
                          0,
                          0,
                          K,
                          ie.width,
                          ie.height,
                          1,
                          me,
                          be,
                        );
                      }
                      _.clearLayerUpdates();
                    } else
                      t.compressedTexSubImage3D(
                        i.TEXTURE_2D_ARRAY,
                        Y,
                        0,
                        0,
                        0,
                        ie.width,
                        ie.height,
                        J.depth,
                        me,
                        ie.data,
                      );
                } else
                  t.compressedTexImage3D(
                    i.TEXTURE_2D_ARRAY,
                    Y,
                    re,
                    ie.width,
                    ie.height,
                    J.depth,
                    0,
                    ie.data,
                    0,
                    0,
                  );
              else
                Ce(
                  "WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()",
                );
            else
              ze
                ? I &&
                  t.texSubImage3D(
                    i.TEXTURE_2D_ARRAY,
                    Y,
                    0,
                    0,
                    0,
                    ie.width,
                    ie.height,
                    J.depth,
                    me,
                    xe,
                    ie.data,
                  )
                : t.texImage3D(
                    i.TEXTURE_2D_ARRAY,
                    Y,
                    re,
                    ie.width,
                    ie.height,
                    J.depth,
                    0,
                    me,
                    xe,
                    ie.data,
                  );
        } else {
          ze &&
            Je &&
            t.texStorage2D(i.TEXTURE_2D, se, re, Ue[0].width, Ue[0].height);
          for (let Y = 0, ge = Ue.length; Y < ge; Y++)
            ((ie = Ue[Y]),
              _.format !== Yt
                ? me !== null
                  ? ze
                    ? I &&
                      t.compressedTexSubImage2D(
                        i.TEXTURE_2D,
                        Y,
                        0,
                        0,
                        ie.width,
                        ie.height,
                        me,
                        ie.data,
                      )
                    : t.compressedTexImage2D(
                        i.TEXTURE_2D,
                        Y,
                        re,
                        ie.width,
                        ie.height,
                        0,
                        ie.data,
                      )
                  : Ce(
                      "WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()",
                    )
                : ze
                  ? I &&
                    t.texSubImage2D(
                      i.TEXTURE_2D,
                      Y,
                      0,
                      0,
                      ie.width,
                      ie.height,
                      me,
                      xe,
                      ie.data,
                    )
                  : t.texImage2D(
                      i.TEXTURE_2D,
                      Y,
                      re,
                      ie.width,
                      ie.height,
                      0,
                      me,
                      xe,
                      ie.data,
                    ));
        }
      else if (_.isDataArrayTexture)
        if (ze) {
          if (
            (Je &&
              t.texStorage3D(
                i.TEXTURE_2D_ARRAY,
                se,
                re,
                J.width,
                J.height,
                J.depth,
              ),
            I)
          )
            if (_.layerUpdates.size > 0) {
              let Y = Qo(J.width, J.height, _.format, _.type);
              for (let ge of _.layerUpdates) {
                let ae = J.data.subarray(
                  (ge * Y) / J.data.BYTES_PER_ELEMENT,
                  ((ge + 1) * Y) / J.data.BYTES_PER_ELEMENT,
                );
                t.texSubImage3D(
                  i.TEXTURE_2D_ARRAY,
                  0,
                  0,
                  0,
                  ge,
                  J.width,
                  J.height,
                  1,
                  me,
                  xe,
                  ae,
                );
              }
              _.clearLayerUpdates();
            } else
              t.texSubImage3D(
                i.TEXTURE_2D_ARRAY,
                0,
                0,
                0,
                0,
                J.width,
                J.height,
                J.depth,
                me,
                xe,
                J.data,
              );
        } else
          t.texImage3D(
            i.TEXTURE_2D_ARRAY,
            0,
            re,
            J.width,
            J.height,
            J.depth,
            0,
            me,
            xe,
            J.data,
          );
      else if (_.isData3DTexture)
        ze
          ? (Je &&
              t.texStorage3D(i.TEXTURE_3D, se, re, J.width, J.height, J.depth),
            I &&
              t.texSubImage3D(
                i.TEXTURE_3D,
                0,
                0,
                0,
                0,
                J.width,
                J.height,
                J.depth,
                me,
                xe,
                J.data,
              ))
          : t.texImage3D(
              i.TEXTURE_3D,
              0,
              re,
              J.width,
              J.height,
              J.depth,
              0,
              me,
              xe,
              J.data,
            );
      else if (_.isFramebufferTexture) {
        if (Je)
          if (ze) t.texStorage2D(i.TEXTURE_2D, se, re, J.width, J.height);
          else {
            let Y = J.width,
              ge = J.height;
            for (let ae = 0; ae < se; ae++)
              (t.texImage2D(i.TEXTURE_2D, ae, re, Y, ge, 0, me, xe, null),
                (Y >>= 1),
                (ge >>= 1));
          }
      } else if (_.isHTMLTexture) {
        if ("texElementImage2D" in i) {
          let Y = i.canvas;
          if (
            (Y.hasAttribute("layoutsubtree") ||
              Y.setAttribute("layoutsubtree", "true"),
            J.parentNode !== Y)
          ) {
            (Y.appendChild(J),
              d.add(_),
              (Y.onpaint = (Oe) => {
                let pt = Oe.changedElements;
                for (let et of d)
                  pt.includes(et.image) && (et.needsUpdate = !0);
              }),
              Y.requestPaint());
            return;
          }
          let ge = 0,
            ae = i.RGBA,
            K = i.RGBA,
            be = i.UNSIGNED_BYTE;
          (i.texElementImage2D(i.TEXTURE_2D, ge, ae, K, be, J),
            i.texParameteri(i.TEXTURE_2D, i.TEXTURE_MIN_FILTER, i.LINEAR),
            i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_S, i.CLAMP_TO_EDGE),
            i.texParameteri(i.TEXTURE_2D, i.TEXTURE_WRAP_T, i.CLAMP_TO_EDGE));
        }
      } else if (Ue.length > 0) {
        if (ze && Je) {
          let Y = dt(Ue[0]);
          t.texStorage2D(i.TEXTURE_2D, se, re, Y.width, Y.height);
        }
        for (let Y = 0, ge = Ue.length; Y < ge; Y++)
          ((ie = Ue[Y]),
            ze
              ? I && t.texSubImage2D(i.TEXTURE_2D, Y, 0, 0, me, xe, ie)
              : t.texImage2D(i.TEXTURE_2D, Y, re, me, xe, ie));
        _.generateMipmaps = !1;
      } else if (ze) {
        if (Je) {
          let Y = dt(J);
          t.texStorage2D(i.TEXTURE_2D, se, re, Y.width, Y.height);
        }
        I && t.texSubImage2D(i.TEXTURE_2D, 0, 0, 0, me, xe, J);
      } else t.texImage2D(i.TEXTURE_2D, 0, re, me, xe, J);
      (f(_) && M(Z), (oe.__version = ne.version), _.onUpdate && _.onUpdate(_));
    }
    S.__version = _.version;
  }
  function Le(S, _, F) {
    if (_.image.length !== 6) return;
    let Z = $(S, _),
      Q = _.source;
    t.bindTexture(i.TEXTURE_CUBE_MAP, S.__webglTexture, i.TEXTURE0 + F);
    let ne = n.get(Q);
    if (Q.version !== ne.__version || Z === !0) {
      t.activeTexture(i.TEXTURE0 + F);
      let oe = Xe.getPrimaries(Xe.workingColorSpace),
        q = _.colorSpace === In ? null : Xe.getPrimaries(_.colorSpace),
        J = _.colorSpace === In || oe === q ? i.NONE : i.BROWSER_DEFAULT_WEBGL;
      (t.pixelStorei(i.UNPACK_FLIP_Y_WEBGL, _.flipY),
        t.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL, _.premultiplyAlpha),
        t.pixelStorei(i.UNPACK_ALIGNMENT, _.unpackAlignment),
        t.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL, J));
      let me = _.isCompressedTexture || _.image[0].isCompressedTexture,
        xe = _.image[0] && _.image[0].isDataTexture,
        re = [];
      for (let K = 0; K < 6; K++)
        (!me && !xe
          ? (re[K] = m(_.image[K], !0, s.maxCubemapSize))
          : (re[K] = xe ? _.image[K].image : _.image[K]),
          (re[K] = he(_, re[K])));
      let ie = re[0],
        Ue = r.convert(_.format, _.colorSpace),
        ze = r.convert(_.type),
        Je = E(_.internalFormat, Ue, ze, _.normalized, _.colorSpace),
        I = _.isVideoTexture !== !0,
        se = ne.__version === void 0 || Z === !0,
        Y = Q.dataReady,
        ge = b(_, ie);
      De(i.TEXTURE_CUBE_MAP, _);
      let ae;
      if (me) {
        I &&
          se &&
          t.texStorage2D(i.TEXTURE_CUBE_MAP, ge, Je, ie.width, ie.height);
        for (let K = 0; K < 6; K++) {
          ae = re[K].mipmaps;
          for (let be = 0; be < ae.length; be++) {
            let Oe = ae[be];
            _.format !== Yt
              ? Ue !== null
                ? I
                  ? Y &&
                    t.compressedTexSubImage2D(
                      i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
                      be,
                      0,
                      0,
                      Oe.width,
                      Oe.height,
                      Ue,
                      Oe.data,
                    )
                  : t.compressedTexImage2D(
                      i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
                      be,
                      Je,
                      Oe.width,
                      Oe.height,
                      0,
                      Oe.data,
                    )
                : Ce(
                    "WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()",
                  )
              : I
                ? Y &&
                  t.texSubImage2D(
                    i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
                    be,
                    0,
                    0,
                    Oe.width,
                    Oe.height,
                    Ue,
                    ze,
                    Oe.data,
                  )
                : t.texImage2D(
                    i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
                    be,
                    Je,
                    Oe.width,
                    Oe.height,
                    0,
                    Ue,
                    ze,
                    Oe.data,
                  );
          }
        }
      } else {
        if (((ae = _.mipmaps), I && se)) {
          ae.length > 0 && ge++;
          let K = dt(re[0]);
          t.texStorage2D(i.TEXTURE_CUBE_MAP, ge, Je, K.width, K.height);
        }
        for (let K = 0; K < 6; K++)
          if (xe) {
            I
              ? Y &&
                t.texSubImage2D(
                  i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
                  0,
                  0,
                  0,
                  re[K].width,
                  re[K].height,
                  Ue,
                  ze,
                  re[K].data,
                )
              : t.texImage2D(
                  i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
                  0,
                  Je,
                  re[K].width,
                  re[K].height,
                  0,
                  Ue,
                  ze,
                  re[K].data,
                );
            for (let be = 0; be < ae.length; be++) {
              let pt = ae[be].image[K].image;
              I
                ? Y &&
                  t.texSubImage2D(
                    i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
                    be + 1,
                    0,
                    0,
                    pt.width,
                    pt.height,
                    Ue,
                    ze,
                    pt.data,
                  )
                : t.texImage2D(
                    i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
                    be + 1,
                    Je,
                    pt.width,
                    pt.height,
                    0,
                    Ue,
                    ze,
                    pt.data,
                  );
            }
          } else {
            I
              ? Y &&
                t.texSubImage2D(
                  i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
                  0,
                  0,
                  0,
                  Ue,
                  ze,
                  re[K],
                )
              : t.texImage2D(
                  i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
                  0,
                  Je,
                  Ue,
                  ze,
                  re[K],
                );
            for (let be = 0; be < ae.length; be++) {
              let Oe = ae[be];
              I
                ? Y &&
                  t.texSubImage2D(
                    i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
                    be + 1,
                    0,
                    0,
                    Ue,
                    ze,
                    Oe.image[K],
                  )
                : t.texImage2D(
                    i.TEXTURE_CUBE_MAP_POSITIVE_X + K,
                    be + 1,
                    Je,
                    Ue,
                    ze,
                    Oe.image[K],
                  );
            }
          }
      }
      (f(_) && M(i.TEXTURE_CUBE_MAP),
        (ne.__version = Q.version),
        _.onUpdate && _.onUpdate(_));
    }
    S.__version = _.version;
  }
  function Re(S, _, F, Z, Q, ne) {
    let oe = r.convert(F.format, F.colorSpace),
      q = r.convert(F.type),
      J = E(F.internalFormat, oe, q, F.normalized, F.colorSpace),
      me = n.get(_),
      xe = n.get(F);
    if (((xe.__renderTarget = _), !me.__hasExternalTextures)) {
      let re = Math.max(1, _.width >> ne),
        ie = Math.max(1, _.height >> ne);
      Q === i.TEXTURE_3D || Q === i.TEXTURE_2D_ARRAY
        ? t.texImage3D(Q, ne, J, re, ie, _.depth, 0, oe, q, null)
        : t.texImage2D(Q, ne, J, re, ie, 0, oe, q, null);
    }
    (t.bindFramebuffer(i.FRAMEBUFFER, S),
      Fe(_)
        ? o.framebufferTexture2DMultisampleEXT(
            i.FRAMEBUFFER,
            Z,
            Q,
            xe.__webglTexture,
            0,
            it(_),
          )
        : (Q === i.TEXTURE_2D ||
            (Q >= i.TEXTURE_CUBE_MAP_POSITIVE_X &&
              Q <= i.TEXTURE_CUBE_MAP_NEGATIVE_Z)) &&
          i.framebufferTexture2D(i.FRAMEBUFFER, Z, Q, xe.__webglTexture, ne),
      t.bindFramebuffer(i.FRAMEBUFFER, null));
  }
  function lt(S, _, F) {
    if ((i.bindRenderbuffer(i.RENDERBUFFER, S), _.depthBuffer)) {
      let Z = _.depthTexture,
        Q = Z && Z.isDepthTexture ? Z.type : null,
        ne = w(_.stencilBuffer, Q),
        oe = _.stencilBuffer ? i.DEPTH_STENCIL_ATTACHMENT : i.DEPTH_ATTACHMENT;
      (Fe(_)
        ? o.renderbufferStorageMultisampleEXT(
            i.RENDERBUFFER,
            it(_),
            ne,
            _.width,
            _.height,
          )
        : F
          ? i.renderbufferStorageMultisample(
              i.RENDERBUFFER,
              it(_),
              ne,
              _.width,
              _.height,
            )
          : i.renderbufferStorage(i.RENDERBUFFER, ne, _.width, _.height),
        i.framebufferRenderbuffer(i.FRAMEBUFFER, oe, i.RENDERBUFFER, S));
    } else {
      let Z = _.textures;
      for (let Q = 0; Q < Z.length; Q++) {
        let ne = Z[Q],
          oe = r.convert(ne.format, ne.colorSpace),
          q = r.convert(ne.type),
          J = E(ne.internalFormat, oe, q, ne.normalized, ne.colorSpace);
        Fe(_)
          ? o.renderbufferStorageMultisampleEXT(
              i.RENDERBUFFER,
              it(_),
              J,
              _.width,
              _.height,
            )
          : F
            ? i.renderbufferStorageMultisample(
                i.RENDERBUFFER,
                it(_),
                J,
                _.width,
                _.height,
              )
            : i.renderbufferStorage(i.RENDERBUFFER, J, _.width, _.height);
      }
    }
    i.bindRenderbuffer(i.RENDERBUFFER, null);
  }
  function He(S, _, F) {
    let Z = _.isWebGLCubeRenderTarget === !0;
    if (
      (t.bindFramebuffer(i.FRAMEBUFFER, S),
      !(_.depthTexture && _.depthTexture.isDepthTexture))
    )
      throw new Error(
        "renderTarget.depthTexture must be an instance of THREE.DepthTexture",
      );
    let Q = n.get(_.depthTexture);
    if (
      ((Q.__renderTarget = _),
      (!Q.__webglTexture ||
        _.depthTexture.image.width !== _.width ||
        _.depthTexture.image.height !== _.height) &&
        ((_.depthTexture.image.width = _.width),
        (_.depthTexture.image.height = _.height),
        (_.depthTexture.needsUpdate = !0)),
      Z)
    ) {
      if (
        (Q.__webglInit === void 0 &&
          ((Q.__webglInit = !0), _.depthTexture.addEventListener("dispose", R)),
        Q.__webglTexture === void 0)
      ) {
        ((Q.__webglTexture = i.createTexture()),
          t.bindTexture(i.TEXTURE_CUBE_MAP, Q.__webglTexture),
          De(i.TEXTURE_CUBE_MAP, _.depthTexture));
        let me = r.convert(_.depthTexture.format),
          xe = r.convert(_.depthTexture.type),
          re;
        _.depthTexture.format === cn
          ? (re = i.DEPTH_COMPONENT24)
          : _.depthTexture.format === Jn && (re = i.DEPTH24_STENCIL8);
        for (let ie = 0; ie < 6; ie++)
          i.texImage2D(
            i.TEXTURE_CUBE_MAP_POSITIVE_X + ie,
            0,
            re,
            _.width,
            _.height,
            0,
            me,
            xe,
            null,
          );
      }
    } else j(_.depthTexture, 0);
    let ne = Q.__webglTexture,
      oe = it(_),
      q = Z ? i.TEXTURE_CUBE_MAP_POSITIVE_X + F : i.TEXTURE_2D,
      J =
        _.depthTexture.format === Jn
          ? i.DEPTH_STENCIL_ATTACHMENT
          : i.DEPTH_ATTACHMENT;
    if (_.depthTexture.format === cn)
      Fe(_)
        ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, J, q, ne, 0, oe)
        : i.framebufferTexture2D(i.FRAMEBUFFER, J, q, ne, 0);
    else if (_.depthTexture.format === Jn)
      Fe(_)
        ? o.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER, J, q, ne, 0, oe)
        : i.framebufferTexture2D(i.FRAMEBUFFER, J, q, ne, 0);
    else throw new Error("Unknown depthTexture format");
  }
  function Ke(S) {
    let _ = n.get(S),
      F = S.isWebGLCubeRenderTarget === !0;
    if (_.__boundDepthTexture !== S.depthTexture) {
      let Z = S.depthTexture;
      if ((_.__depthDisposeCallback && _.__depthDisposeCallback(), Z)) {
        let Q = () => {
          (delete _.__boundDepthTexture,
            delete _.__depthDisposeCallback,
            Z.removeEventListener("dispose", Q));
        };
        (Z.addEventListener("dispose", Q), (_.__depthDisposeCallback = Q));
      }
      _.__boundDepthTexture = Z;
    }
    if (S.depthTexture && !_.__autoAllocateDepthBuffer)
      if (F) for (let Z = 0; Z < 6; Z++) He(_.__webglFramebuffer[Z], S, Z);
      else {
        let Z = S.texture.mipmaps;
        Z && Z.length > 0
          ? He(_.__webglFramebuffer[0], S, 0)
          : He(_.__webglFramebuffer, S, 0);
      }
    else if (F) {
      _.__webglDepthbuffer = [];
      for (let Z = 0; Z < 6; Z++)
        if (
          (t.bindFramebuffer(i.FRAMEBUFFER, _.__webglFramebuffer[Z]),
          _.__webglDepthbuffer[Z] === void 0)
        )
          ((_.__webglDepthbuffer[Z] = i.createRenderbuffer()),
            lt(_.__webglDepthbuffer[Z], S, !1));
        else {
          let Q = S.stencilBuffer
              ? i.DEPTH_STENCIL_ATTACHMENT
              : i.DEPTH_ATTACHMENT,
            ne = _.__webglDepthbuffer[Z];
          (i.bindRenderbuffer(i.RENDERBUFFER, ne),
            i.framebufferRenderbuffer(i.FRAMEBUFFER, Q, i.RENDERBUFFER, ne));
        }
    } else {
      let Z = S.texture.mipmaps;
      if (
        (Z && Z.length > 0
          ? t.bindFramebuffer(i.FRAMEBUFFER, _.__webglFramebuffer[0])
          : t.bindFramebuffer(i.FRAMEBUFFER, _.__webglFramebuffer),
        _.__webglDepthbuffer === void 0)
      )
        ((_.__webglDepthbuffer = i.createRenderbuffer()),
          lt(_.__webglDepthbuffer, S, !1));
      else {
        let Q = S.stencilBuffer
            ? i.DEPTH_STENCIL_ATTACHMENT
            : i.DEPTH_ATTACHMENT,
          ne = _.__webglDepthbuffer;
        (i.bindRenderbuffer(i.RENDERBUFFER, ne),
          i.framebufferRenderbuffer(i.FRAMEBUFFER, Q, i.RENDERBUFFER, ne));
      }
    }
    t.bindFramebuffer(i.FRAMEBUFFER, null);
  }
  function nt(S, _, F) {
    let Z = n.get(S);
    (_ !== void 0 &&
      Re(
        Z.__webglFramebuffer,
        S,
        S.texture,
        i.COLOR_ATTACHMENT0,
        i.TEXTURE_2D,
        0,
      ),
      F !== void 0 && Ke(S));
  }
  function H(S) {
    let _ = S.texture,
      F = n.get(S),
      Z = n.get(_);
    S.addEventListener("dispose", x);
    let Q = S.textures,
      ne = S.isWebGLCubeRenderTarget === !0,
      oe = Q.length > 1;
    if (
      (oe ||
        (Z.__webglTexture === void 0 && (Z.__webglTexture = i.createTexture()),
        (Z.__version = _.version),
        a.memory.textures++),
      ne)
    ) {
      F.__webglFramebuffer = [];
      for (let q = 0; q < 6; q++)
        if (_.mipmaps && _.mipmaps.length > 0) {
          F.__webglFramebuffer[q] = [];
          for (let J = 0; J < _.mipmaps.length; J++)
            F.__webglFramebuffer[q][J] = i.createFramebuffer();
        } else F.__webglFramebuffer[q] = i.createFramebuffer();
    } else {
      if (_.mipmaps && _.mipmaps.length > 0) {
        F.__webglFramebuffer = [];
        for (let q = 0; q < _.mipmaps.length; q++)
          F.__webglFramebuffer[q] = i.createFramebuffer();
      } else F.__webglFramebuffer = i.createFramebuffer();
      if (oe)
        for (let q = 0, J = Q.length; q < J; q++) {
          let me = n.get(Q[q]);
          me.__webglTexture === void 0 &&
            ((me.__webglTexture = i.createTexture()), a.memory.textures++);
        }
      if (S.samples > 0 && Fe(S) === !1) {
        ((F.__webglMultisampledFramebuffer = i.createFramebuffer()),
          (F.__webglColorRenderbuffer = []),
          t.bindFramebuffer(i.FRAMEBUFFER, F.__webglMultisampledFramebuffer));
        for (let q = 0; q < Q.length; q++) {
          let J = Q[q];
          ((F.__webglColorRenderbuffer[q] = i.createRenderbuffer()),
            i.bindRenderbuffer(i.RENDERBUFFER, F.__webglColorRenderbuffer[q]));
          let me = r.convert(J.format, J.colorSpace),
            xe = r.convert(J.type),
            re = E(
              J.internalFormat,
              me,
              xe,
              J.normalized,
              J.colorSpace,
              S.isXRRenderTarget === !0,
            ),
            ie = it(S);
          (i.renderbufferStorageMultisample(
            i.RENDERBUFFER,
            ie,
            re,
            S.width,
            S.height,
          ),
            i.framebufferRenderbuffer(
              i.FRAMEBUFFER,
              i.COLOR_ATTACHMENT0 + q,
              i.RENDERBUFFER,
              F.__webglColorRenderbuffer[q],
            ));
        }
        (i.bindRenderbuffer(i.RENDERBUFFER, null),
          S.depthBuffer &&
            ((F.__webglDepthRenderbuffer = i.createRenderbuffer()),
            lt(F.__webglDepthRenderbuffer, S, !0)),
          t.bindFramebuffer(i.FRAMEBUFFER, null));
      }
    }
    if (ne) {
      (t.bindTexture(i.TEXTURE_CUBE_MAP, Z.__webglTexture),
        De(i.TEXTURE_CUBE_MAP, _));
      for (let q = 0; q < 6; q++)
        if (_.mipmaps && _.mipmaps.length > 0)
          for (let J = 0; J < _.mipmaps.length; J++)
            Re(
              F.__webglFramebuffer[q][J],
              S,
              _,
              i.COLOR_ATTACHMENT0,
              i.TEXTURE_CUBE_MAP_POSITIVE_X + q,
              J,
            );
        else
          Re(
            F.__webglFramebuffer[q],
            S,
            _,
            i.COLOR_ATTACHMENT0,
            i.TEXTURE_CUBE_MAP_POSITIVE_X + q,
            0,
          );
      (f(_) && M(i.TEXTURE_CUBE_MAP), t.unbindTexture());
    } else if (oe) {
      for (let q = 0, J = Q.length; q < J; q++) {
        let me = Q[q],
          xe = n.get(me),
          re = i.TEXTURE_2D;
        ((S.isWebGL3DRenderTarget || S.isWebGLArrayRenderTarget) &&
          (re = S.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY),
          t.bindTexture(re, xe.__webglTexture),
          De(re, me),
          Re(F.__webglFramebuffer, S, me, i.COLOR_ATTACHMENT0 + q, re, 0),
          f(me) && M(re));
      }
      t.unbindTexture();
    } else {
      let q = i.TEXTURE_2D;
      if (
        ((S.isWebGL3DRenderTarget || S.isWebGLArrayRenderTarget) &&
          (q = S.isWebGL3DRenderTarget ? i.TEXTURE_3D : i.TEXTURE_2D_ARRAY),
        t.bindTexture(q, Z.__webglTexture),
        De(q, _),
        _.mipmaps && _.mipmaps.length > 0)
      )
        for (let J = 0; J < _.mipmaps.length; J++)
          Re(F.__webglFramebuffer[J], S, _, i.COLOR_ATTACHMENT0, q, J);
      else Re(F.__webglFramebuffer, S, _, i.COLOR_ATTACHMENT0, q, 0);
      (f(_) && M(q), t.unbindTexture());
    }
    S.depthBuffer && Ke(S);
  }
  function le(S) {
    let _ = S.textures;
    for (let F = 0, Z = _.length; F < Z; F++) {
      let Q = _[F];
      if (f(Q)) {
        let ne = T(S),
          oe = n.get(Q).__webglTexture;
        (t.bindTexture(ne, oe), M(ne), t.unbindTexture());
      }
    }
  }
  let we = [],
    ke = [];
  function P(S) {
    if (S.samples > 0) {
      if (Fe(S) === !1) {
        let _ = S.textures,
          F = S.width,
          Z = S.height,
          Q = i.COLOR_BUFFER_BIT,
          ne = S.stencilBuffer
            ? i.DEPTH_STENCIL_ATTACHMENT
            : i.DEPTH_ATTACHMENT,
          oe = n.get(S),
          q = _.length > 1;
        if (q)
          for (let me = 0; me < _.length; me++)
            (t.bindFramebuffer(
              i.FRAMEBUFFER,
              oe.__webglMultisampledFramebuffer,
            ),
              i.framebufferRenderbuffer(
                i.FRAMEBUFFER,
                i.COLOR_ATTACHMENT0 + me,
                i.RENDERBUFFER,
                null,
              ),
              t.bindFramebuffer(i.FRAMEBUFFER, oe.__webglFramebuffer),
              i.framebufferTexture2D(
                i.DRAW_FRAMEBUFFER,
                i.COLOR_ATTACHMENT0 + me,
                i.TEXTURE_2D,
                null,
                0,
              ));
        t.bindFramebuffer(
          i.READ_FRAMEBUFFER,
          oe.__webglMultisampledFramebuffer,
        );
        let J = S.texture.mipmaps;
        J && J.length > 0
          ? t.bindFramebuffer(i.DRAW_FRAMEBUFFER, oe.__webglFramebuffer[0])
          : t.bindFramebuffer(i.DRAW_FRAMEBUFFER, oe.__webglFramebuffer);
        for (let me = 0; me < _.length; me++) {
          if (
            (S.resolveDepthBuffer &&
              (S.depthBuffer && (Q |= i.DEPTH_BUFFER_BIT),
              S.stencilBuffer &&
                S.resolveStencilBuffer &&
                (Q |= i.STENCIL_BUFFER_BIT)),
            q)
          ) {
            i.framebufferRenderbuffer(
              i.READ_FRAMEBUFFER,
              i.COLOR_ATTACHMENT0,
              i.RENDERBUFFER,
              oe.__webglColorRenderbuffer[me],
            );
            let xe = n.get(_[me]).__webglTexture;
            i.framebufferTexture2D(
              i.DRAW_FRAMEBUFFER,
              i.COLOR_ATTACHMENT0,
              i.TEXTURE_2D,
              xe,
              0,
            );
          }
          (i.blitFramebuffer(0, 0, F, Z, 0, 0, F, Z, Q, i.NEAREST),
            c === !0 &&
              ((we.length = 0),
              (ke.length = 0),
              we.push(i.COLOR_ATTACHMENT0 + me),
              S.depthBuffer &&
                S.resolveDepthBuffer === !1 &&
                (we.push(ne),
                ke.push(ne),
                i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, ke)),
              i.invalidateFramebuffer(i.READ_FRAMEBUFFER, we)));
        }
        if (
          (t.bindFramebuffer(i.READ_FRAMEBUFFER, null),
          t.bindFramebuffer(i.DRAW_FRAMEBUFFER, null),
          q)
        )
          for (let me = 0; me < _.length; me++) {
            (t.bindFramebuffer(
              i.FRAMEBUFFER,
              oe.__webglMultisampledFramebuffer,
            ),
              i.framebufferRenderbuffer(
                i.FRAMEBUFFER,
                i.COLOR_ATTACHMENT0 + me,
                i.RENDERBUFFER,
                oe.__webglColorRenderbuffer[me],
              ));
            let xe = n.get(_[me]).__webglTexture;
            (t.bindFramebuffer(i.FRAMEBUFFER, oe.__webglFramebuffer),
              i.framebufferTexture2D(
                i.DRAW_FRAMEBUFFER,
                i.COLOR_ATTACHMENT0 + me,
                i.TEXTURE_2D,
                xe,
                0,
              ));
          }
        t.bindFramebuffer(
          i.DRAW_FRAMEBUFFER,
          oe.__webglMultisampledFramebuffer,
        );
      } else if (S.depthBuffer && S.resolveDepthBuffer === !1 && c) {
        let _ = S.stencilBuffer
          ? i.DEPTH_STENCIL_ATTACHMENT
          : i.DEPTH_ATTACHMENT;
        i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER, [_]);
      }
    }
  }
  function it(S) {
    return Math.min(s.maxSamples, S.samples);
  }
  function Fe(S) {
    let _ = n.get(S);
    return (
      S.samples > 0 &&
      e.has("WEBGL_multisampled_render_to_texture") === !0 &&
      _.__useRenderToTexture !== !1
    );
  }
  function je(S) {
    let _ = a.render.frame;
    u.get(S) !== _ && (u.set(S, _), S.update());
  }
  function he(S, _) {
    let F = S.colorSpace,
      Z = S.format,
      Q = S.type;
    return (
      S.isCompressedTexture === !0 ||
        S.isVideoTexture === !0 ||
        (F !== ss &&
          F !== In &&
          (Xe.getTransfer(F) === Qe
            ? (Z !== Yt || Q !== Ft) &&
              Ce(
                "WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType.",
              )
            : Ie("WebGLTextures: Unsupported texture color space:", F))),
      _
    );
  }
  function dt(S) {
    return (
      typeof HTMLImageElement < "u" && S instanceof HTMLImageElement
        ? ((l.width = S.naturalWidth || S.width),
          (l.height = S.naturalHeight || S.height))
        : typeof VideoFrame < "u" && S instanceof VideoFrame
          ? ((l.width = S.displayWidth), (l.height = S.displayHeight))
          : ((l.width = S.width), (l.height = S.height)),
      l
    );
  }
  ((this.allocateTextureUnit = V),
    (this.resetTextureUnits = X),
    (this.getTextureUnits = W),
    (this.setTextureUnits = D),
    (this.setTexture2D = j),
    (this.setTexture2DArray = ee),
    (this.setTexture3D = ce),
    (this.setTextureCube = ye),
    (this.rebindTextures = nt),
    (this.setupRenderTarget = H),
    (this.updateRenderTargetMipmap = le),
    (this.updateMultisampleRenderTarget = P),
    (this.setupDepthRenderbuffer = Ke),
    (this.setupFrameBufferTexture = Re),
    (this.useMultisampledRTT = Fe),
    (this.isReversedDepthBuffer = function () {
      return t.buffers.depth.getReversed();
    }));
}
function ag(i, e) {
  function t(n, s = In) {
    let r,
      a = Xe.getTransfer(s);
    if (n === Ft) return i.UNSIGNED_BYTE;
    if (n === Zr) return i.UNSIGNED_SHORT_4_4_4_4;
    if (n === Jr) return i.UNSIGNED_SHORT_5_5_5_1;
    if (n === Go) return i.UNSIGNED_INT_5_9_9_9_REV;
    if (n === Ho) return i.UNSIGNED_INT_10F_11F_11F_REV;
    if (n === Vo) return i.BYTE;
    if (n === ko) return i.SHORT;
    if (n === Wi) return i.UNSIGNED_SHORT;
    if (n === Yr) return i.INT;
    if (n === en) return i.UNSIGNED_INT;
    if (n === tn) return i.FLOAT;
    if (n === mn) return i.HALF_FLOAT;
    if (n === Wo) return i.ALPHA;
    if (n === Xo) return i.RGB;
    if (n === Yt) return i.RGBA;
    if (n === cn) return i.DEPTH_COMPONENT;
    if (n === Jn) return i.DEPTH_STENCIL;
    if (n === qo) return i.RED;
    if (n === $r) return i.RED_INTEGER;
    if (n === $n) return i.RG;
    if (n === Kr) return i.RG_INTEGER;
    if (n === jr) return i.RGBA_INTEGER;
    if (n === Ts || n === As || n === ws || n === Cs)
      if (a === Qe)
        if (((r = e.get("WEBGL_compressed_texture_s3tc_srgb")), r !== null)) {
          if (n === Ts) return r.COMPRESSED_SRGB_S3TC_DXT1_EXT;
          if (n === As) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;
          if (n === ws) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;
          if (n === Cs) return r.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT;
        } else return null;
      else if (((r = e.get("WEBGL_compressed_texture_s3tc")), r !== null)) {
        if (n === Ts) return r.COMPRESSED_RGB_S3TC_DXT1_EXT;
        if (n === As) return r.COMPRESSED_RGBA_S3TC_DXT1_EXT;
        if (n === ws) return r.COMPRESSED_RGBA_S3TC_DXT3_EXT;
        if (n === Cs) return r.COMPRESSED_RGBA_S3TC_DXT5_EXT;
      } else return null;
    if (n === Qr || n === ea || n === ta || n === na)
      if (((r = e.get("WEBGL_compressed_texture_pvrtc")), r !== null)) {
        if (n === Qr) return r.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;
        if (n === ea) return r.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;
        if (n === ta) return r.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;
        if (n === na) return r.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG;
      } else return null;
    if (
      n === ia ||
      n === sa ||
      n === ra ||
      n === aa ||
      n === oa ||
      n === Rs ||
      n === la
    )
      if (((r = e.get("WEBGL_compressed_texture_etc")), r !== null)) {
        if (n === ia || n === sa)
          return a === Qe ? r.COMPRESSED_SRGB8_ETC2 : r.COMPRESSED_RGB8_ETC2;
        if (n === ra)
          return a === Qe
            ? r.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC
            : r.COMPRESSED_RGBA8_ETC2_EAC;
        if (n === aa) return r.COMPRESSED_R11_EAC;
        if (n === oa) return r.COMPRESSED_SIGNED_R11_EAC;
        if (n === Rs) return r.COMPRESSED_RG11_EAC;
        if (n === la) return r.COMPRESSED_SIGNED_RG11_EAC;
      } else return null;
    if (
      n === ca ||
      n === ha ||
      n === ua ||
      n === da ||
      n === fa ||
      n === pa ||
      n === ma ||
      n === ga ||
      n === _a ||
      n === xa ||
      n === va ||
      n === ya ||
      n === Ma ||
      n === Sa
    )
      if (((r = e.get("WEBGL_compressed_texture_astc")), r !== null)) {
        if (n === ca)
          return a === Qe
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR
            : r.COMPRESSED_RGBA_ASTC_4x4_KHR;
        if (n === ha)
          return a === Qe
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR
            : r.COMPRESSED_RGBA_ASTC_5x4_KHR;
        if (n === ua)
          return a === Qe
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR
            : r.COMPRESSED_RGBA_ASTC_5x5_KHR;
        if (n === da)
          return a === Qe
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR
            : r.COMPRESSED_RGBA_ASTC_6x5_KHR;
        if (n === fa)
          return a === Qe
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR
            : r.COMPRESSED_RGBA_ASTC_6x6_KHR;
        if (n === pa)
          return a === Qe
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR
            : r.COMPRESSED_RGBA_ASTC_8x5_KHR;
        if (n === ma)
          return a === Qe
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR
            : r.COMPRESSED_RGBA_ASTC_8x6_KHR;
        if (n === ga)
          return a === Qe
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR
            : r.COMPRESSED_RGBA_ASTC_8x8_KHR;
        if (n === _a)
          return a === Qe
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR
            : r.COMPRESSED_RGBA_ASTC_10x5_KHR;
        if (n === xa)
          return a === Qe
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR
            : r.COMPRESSED_RGBA_ASTC_10x6_KHR;
        if (n === va)
          return a === Qe
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR
            : r.COMPRESSED_RGBA_ASTC_10x8_KHR;
        if (n === ya)
          return a === Qe
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR
            : r.COMPRESSED_RGBA_ASTC_10x10_KHR;
        if (n === Ma)
          return a === Qe
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR
            : r.COMPRESSED_RGBA_ASTC_12x10_KHR;
        if (n === Sa)
          return a === Qe
            ? r.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR
            : r.COMPRESSED_RGBA_ASTC_12x12_KHR;
      } else return null;
    if (n === ba || n === Ea || n === Ta)
      if (((r = e.get("EXT_texture_compression_bptc")), r !== null)) {
        if (n === ba)
          return a === Qe
            ? r.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT
            : r.COMPRESSED_RGBA_BPTC_UNORM_EXT;
        if (n === Ea) return r.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;
        if (n === Ta) return r.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT;
      } else return null;
    if (n === Aa || n === wa || n === Is || n === Ca)
      if (((r = e.get("EXT_texture_compression_rgtc")), r !== null)) {
        if (n === Aa) return r.COMPRESSED_RED_RGTC1_EXT;
        if (n === wa) return r.COMPRESSED_SIGNED_RED_RGTC1_EXT;
        if (n === Is) return r.COMPRESSED_RED_GREEN_RGTC2_EXT;
        if (n === Ca) return r.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT;
      } else return null;
    return n === Xi ? i.UNSIGNED_INT_24_8 : i[n] !== void 0 ? i[n] : null;
  }
  return { convert: t };
}
var og = `
void main() {

	gl_Position = vec4( position, 1.0 );

}`,
  lg = `
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`,
  fl = class {
    constructor() {
      ((this.texture = null),
        (this.mesh = null),
        (this.depthNear = 0),
        (this.depthFar = 0));
    }
    init(e, t) {
      if (this.texture === null) {
        let n = new ds(e.texture);
        ((e.depthNear !== t.depthNear || e.depthFar !== t.depthFar) &&
          ((this.depthNear = e.depthNear), (this.depthFar = e.depthFar)),
          (this.texture = n));
      }
    }
    getMesh(e) {
      if (this.texture !== null && this.mesh === null) {
        let t = e.cameras[0].viewport,
          n = new Gt({
            vertexShader: og,
            fragmentShader: lg,
            uniforms: {
              depthColor: { value: this.texture },
              depthWidth: { value: t.z },
              depthHeight: { value: t.w },
            },
          });
        this.mesh = new bt(new hi(20, 20), n);
      }
      return this.mesh;
    }
    reset() {
      ((this.texture = null), (this.mesh = null));
    }
    getDepthTexture() {
      return this.texture;
    }
  },
  pl = class extends hn {
    constructor(e, t) {
      super();
      let n = this,
        s = null,
        r = 1,
        a = null,
        o = "local-floor",
        c = 1,
        l = null,
        u = null,
        d = null,
        h = null,
        p = null,
        g = null,
        y = typeof XRWebGLBinding < "u",
        m = new fl(),
        f = {},
        M = t.getContextAttributes(),
        T = null,
        E = null,
        w = [],
        b = [],
        R = new Ye(),
        x = null,
        A = new It();
      A.viewport = new ut();
      let N = new It();
      N.viewport = new ut();
      let C = [A, N],
        O = new kr(),
        X = null,
        W = null;
      ((this.cameraAutoUpdate = !0),
        (this.enabled = !1),
        (this.isPresenting = !1),
        (this.getController = function ($) {
          let de = w[$];
          return (
            de === void 0 && ((de = new Fi()), (w[$] = de)),
            de.getTargetRaySpace()
          );
        }),
        (this.getControllerGrip = function ($) {
          let de = w[$];
          return (
            de === void 0 && ((de = new Fi()), (w[$] = de)),
            de.getGripSpace()
          );
        }),
        (this.getHand = function ($) {
          let de = w[$];
          return (
            de === void 0 && ((de = new Fi()), (w[$] = de)),
            de.getHandSpace()
          );
        }));
      function D($) {
        let de = b.indexOf($.inputSource);
        if (de === -1) return;
        let te = w[de];
        te !== void 0 &&
          (te.update($.inputSource, $.frame, l || a),
          te.dispatchEvent({ type: $.type, data: $.inputSource }));
      }
      function V() {
        (s.removeEventListener("select", D),
          s.removeEventListener("selectstart", D),
          s.removeEventListener("selectend", D),
          s.removeEventListener("squeeze", D),
          s.removeEventListener("squeezestart", D),
          s.removeEventListener("squeezeend", D),
          s.removeEventListener("end", V),
          s.removeEventListener("inputsourceschange", k));
        for (let $ = 0; $ < w.length; $++) {
          let de = b[$];
          de !== null && ((b[$] = null), w[$].disconnect(de));
        }
        ((X = null), (W = null), m.reset());
        for (let $ in f) delete f[$];
        (e.setRenderTarget(T),
          (p = null),
          (h = null),
          (d = null),
          (s = null),
          (E = null),
          De.stop(),
          (n.isPresenting = !1),
          e.setPixelRatio(x),
          e.setSize(R.width, R.height, !1),
          n.dispatchEvent({ type: "sessionend" }));
      }
      ((this.setFramebufferScaleFactor = function ($) {
        ((r = $),
          n.isPresenting === !0 &&
            Ce(
              "WebXRManager: Cannot change framebuffer scale while presenting.",
            ));
      }),
        (this.setReferenceSpaceType = function ($) {
          ((o = $),
            n.isPresenting === !0 &&
              Ce(
                "WebXRManager: Cannot change reference space type while presenting.",
              ));
        }),
        (this.getReferenceSpace = function () {
          return l || a;
        }),
        (this.setReferenceSpace = function ($) {
          l = $;
        }),
        (this.getBaseLayer = function () {
          return h !== null ? h : p;
        }),
        (this.getBinding = function () {
          return (d === null && y && (d = new XRWebGLBinding(s, t)), d);
        }),
        (this.getFrame = function () {
          return g;
        }),
        (this.getSession = function () {
          return s;
        }),
        (this.setSession = async function ($) {
          if (((s = $), s !== null)) {
            if (
              ((T = e.getRenderTarget()),
              s.addEventListener("select", D),
              s.addEventListener("selectstart", D),
              s.addEventListener("selectend", D),
              s.addEventListener("squeeze", D),
              s.addEventListener("squeezestart", D),
              s.addEventListener("squeezeend", D),
              s.addEventListener("end", V),
              s.addEventListener("inputsourceschange", k),
              M.xrCompatible !== !0 && (await t.makeXRCompatible()),
              (x = e.getPixelRatio()),
              e.getSize(R),
              y && "createProjectionLayer" in XRWebGLBinding.prototype)
            ) {
              let te = null,
                Ae = null,
                Le = null;
              M.depth &&
                ((Le = M.stencil ? t.DEPTH24_STENCIL8 : t.DEPTH_COMPONENT24),
                (te = M.stencil ? Jn : cn),
                (Ae = M.stencil ? Xi : en));
              let Re = {
                colorFormat: t.RGBA8,
                depthFormat: Le,
                scaleFactor: r,
              };
              ((d = this.getBinding()),
                (h = d.createProjectionLayer(Re)),
                s.updateRenderState({ layers: [h] }),
                e.setPixelRatio(1),
                e.setSize(h.textureWidth, h.textureHeight, !1),
                (E = new kt(h.textureWidth, h.textureHeight, {
                  format: Yt,
                  type: Ft,
                  depthTexture: new Rn(
                    h.textureWidth,
                    h.textureHeight,
                    Ae,
                    void 0,
                    void 0,
                    void 0,
                    void 0,
                    void 0,
                    void 0,
                    te,
                  ),
                  stencilBuffer: M.stencil,
                  colorSpace: e.outputColorSpace,
                  samples: M.antialias ? 4 : 0,
                  resolveDepthBuffer: h.ignoreDepthValues === !1,
                  resolveStencilBuffer: h.ignoreDepthValues === !1,
                })));
            } else {
              let te = {
                antialias: M.antialias,
                alpha: !0,
                depth: M.depth,
                stencil: M.stencil,
                framebufferScaleFactor: r,
              };
              ((p = new XRWebGLLayer(s, t, te)),
                s.updateRenderState({ baseLayer: p }),
                e.setPixelRatio(1),
                e.setSize(p.framebufferWidth, p.framebufferHeight, !1),
                (E = new kt(p.framebufferWidth, p.framebufferHeight, {
                  format: Yt,
                  type: Ft,
                  colorSpace: e.outputColorSpace,
                  stencilBuffer: M.stencil,
                  resolveDepthBuffer: p.ignoreDepthValues === !1,
                  resolveStencilBuffer: p.ignoreDepthValues === !1,
                })));
            }
            ((E.isXRRenderTarget = !0),
              this.setFoveation(c),
              (l = null),
              (a = await s.requestReferenceSpace(o)),
              De.setContext(s),
              De.start(),
              (n.isPresenting = !0),
              n.dispatchEvent({ type: "sessionstart" }));
          }
        }),
        (this.getEnvironmentBlendMode = function () {
          if (s !== null) return s.environmentBlendMode;
        }),
        (this.getDepthTexture = function () {
          return m.getDepthTexture();
        }));
      function k($) {
        for (let de = 0; de < $.removed.length; de++) {
          let te = $.removed[de],
            Ae = b.indexOf(te);
          Ae >= 0 && ((b[Ae] = null), w[Ae].disconnect(te));
        }
        for (let de = 0; de < $.added.length; de++) {
          let te = $.added[de],
            Ae = b.indexOf(te);
          if (Ae === -1) {
            for (let Re = 0; Re < w.length; Re++)
              if (Re >= b.length) {
                (b.push(te), (Ae = Re));
                break;
              } else if (b[Re] === null) {
                ((b[Re] = te), (Ae = Re));
                break;
              }
            if (Ae === -1) break;
          }
          let Le = w[Ae];
          Le && Le.connect(te);
        }
      }
      let j = new U(),
        ee = new U();
      function ce($, de, te) {
        (j.setFromMatrixPosition(de.matrixWorld),
          ee.setFromMatrixPosition(te.matrixWorld));
        let Ae = j.distanceTo(ee),
          Le = de.projectionMatrix.elements,
          Re = te.projectionMatrix.elements,
          lt = Le[14] / (Le[10] - 1),
          He = Le[14] / (Le[10] + 1),
          Ke = (Le[9] + 1) / Le[5],
          nt = (Le[9] - 1) / Le[5],
          H = (Le[8] - 1) / Le[0],
          le = (Re[8] + 1) / Re[0],
          we = lt * H,
          ke = lt * le,
          P = Ae / (-H + le),
          it = P * -H;
        if (
          (de.matrixWorld.decompose($.position, $.quaternion, $.scale),
          $.translateX(it),
          $.translateZ(P),
          $.matrixWorld.compose($.position, $.quaternion, $.scale),
          $.matrixWorldInverse.copy($.matrixWorld).invert(),
          Le[10] === -1)
        )
          ($.projectionMatrix.copy(de.projectionMatrix),
            $.projectionMatrixInverse.copy(de.projectionMatrixInverse));
        else {
          let Fe = lt + P,
            je = He + P,
            he = we - it,
            dt = ke + (Ae - it),
            S = ((Ke * He) / je) * Fe,
            _ = ((nt * He) / je) * Fe;
          ($.projectionMatrix.makePerspective(he, dt, S, _, Fe, je),
            $.projectionMatrixInverse.copy($.projectionMatrix).invert());
        }
      }
      function ye($, de) {
        (de === null
          ? $.matrixWorld.copy($.matrix)
          : $.matrixWorld.multiplyMatrices(de.matrixWorld, $.matrix),
          $.matrixWorldInverse.copy($.matrixWorld).invert());
      }
      this.updateCamera = function ($) {
        if (s === null) return;
        let de = $.near,
          te = $.far;
        (m.texture !== null &&
          (m.depthNear > 0 && (de = m.depthNear),
          m.depthFar > 0 && (te = m.depthFar)),
          (O.near = N.near = A.near = de),
          (O.far = N.far = A.far = te),
          (X !== O.near || W !== O.far) &&
            (s.updateRenderState({ depthNear: O.near, depthFar: O.far }),
            (X = O.near),
            (W = O.far)),
          (O.layers.mask = $.layers.mask | 6),
          (A.layers.mask = O.layers.mask & -5),
          (N.layers.mask = O.layers.mask & -3));
        let Ae = $.parent,
          Le = O.cameras;
        ye(O, Ae);
        for (let Re = 0; Re < Le.length; Re++) ye(Le[Re], Ae);
        (Le.length === 2
          ? ce(O, A, N)
          : O.projectionMatrix.copy(A.projectionMatrix),
          Me($, O, Ae));
      };
      function Me($, de, te) {
        (te === null
          ? $.matrix.copy(de.matrixWorld)
          : ($.matrix.copy(te.matrixWorld),
            $.matrix.invert(),
            $.matrix.multiply(de.matrixWorld)),
          $.matrix.decompose($.position, $.quaternion, $.scale),
          $.updateMatrixWorld(!0),
          $.projectionMatrix.copy(de.projectionMatrix),
          $.projectionMatrixInverse.copy(de.projectionMatrixInverse),
          $.isPerspectiveCamera &&
            (($.fov = Di * 2 * Math.atan(1 / $.projectionMatrix.elements[5])),
            ($.zoom = 1)));
      }
      ((this.getCamera = function () {
        return O;
      }),
        (this.getFoveation = function () {
          if (!(h === null && p === null)) return c;
        }),
        (this.setFoveation = function ($) {
          ((c = $),
            h !== null && (h.fixedFoveation = $),
            p !== null &&
              p.fixedFoveation !== void 0 &&
              (p.fixedFoveation = $));
        }),
        (this.hasDepthSensing = function () {
          return m.texture !== null;
        }),
        (this.getDepthSensingMesh = function () {
          return m.getMesh(O);
        }),
        (this.getCameraTexture = function ($) {
          return f[$];
        }));
      let We = null;
      function $e($, de) {
        if (((u = de.getViewerPose(l || a)), (g = de), u !== null)) {
          let te = u.views;
          p !== null &&
            (e.setRenderTargetFramebuffer(E, p.framebuffer),
            e.setRenderTarget(E));
          let Ae = !1;
          te.length !== O.cameras.length && ((O.cameras.length = 0), (Ae = !0));
          for (let He = 0; He < te.length; He++) {
            let Ke = te[He],
              nt = null;
            if (p !== null) nt = p.getViewport(Ke);
            else {
              let le = d.getViewSubImage(h, Ke);
              ((nt = le.viewport),
                He === 0 &&
                  (e.setRenderTargetTextures(
                    E,
                    le.colorTexture,
                    le.depthStencilTexture,
                  ),
                  e.setRenderTarget(E)));
            }
            let H = C[He];
            (H === void 0 &&
              ((H = new It()),
              H.layers.enable(He),
              (H.viewport = new ut()),
              (C[He] = H)),
              H.matrix.fromArray(Ke.transform.matrix),
              H.matrix.decompose(H.position, H.quaternion, H.scale),
              H.projectionMatrix.fromArray(Ke.projectionMatrix),
              H.projectionMatrixInverse.copy(H.projectionMatrix).invert(),
              H.viewport.set(nt.x, nt.y, nt.width, nt.height),
              He === 0 &&
                (O.matrix.copy(H.matrix),
                O.matrix.decompose(O.position, O.quaternion, O.scale)),
              Ae === !0 && O.cameras.push(H));
          }
          let Le = s.enabledFeatures;
          if (
            Le &&
            Le.includes("depth-sensing") &&
            s.depthUsage == "gpu-optimized" &&
            y
          ) {
            d = n.getBinding();
            let He = d.getDepthInformation(te[0]);
            He && He.isValid && He.texture && m.init(He, s.renderState);
          }
          if (Le && Le.includes("camera-access") && y) {
            (e.state.unbindTexture(), (d = n.getBinding()));
            for (let He = 0; He < te.length; He++) {
              let Ke = te[He].camera;
              if (Ke) {
                let nt = f[Ke];
                nt || ((nt = new ds()), (f[Ke] = nt));
                let H = d.getCameraImage(Ke);
                nt.sourceTexture = H;
              }
            }
          }
        }
        for (let te = 0; te < w.length; te++) {
          let Ae = b[te],
            Le = w[te];
          Ae !== null && Le !== void 0 && Le.update(Ae, de, l || a);
        }
        (We && We($, de),
          de.detectedPlanes &&
            n.dispatchEvent({ type: "planesdetected", data: de }),
          (g = null));
      }
      let De = new hh();
      (De.setAnimationLoop($e),
        (this.setAnimationLoop = function ($) {
          We = $;
        }),
        (this.dispose = function () {}));
    }
  },
  cg = new ht(),
  gh = new Ne();
gh.set(-1, 0, 0, 0, 1, 0, 0, 0, 1);
function hg(i, e) {
  function t(m, f) {
    (m.matrixAutoUpdate === !0 && m.updateMatrix(), f.value.copy(m.matrix));
  }
  function n(m, f) {
    (f.color.getRGB(m.fogColor.value, $o(i)),
      f.isFog
        ? ((m.fogNear.value = f.near), (m.fogFar.value = f.far))
        : f.isFogExp2 && (m.fogDensity.value = f.density));
  }
  function s(m, f, M, T, E) {
    f.isNodeMaterial
      ? (f.uniformsNeedUpdate = !1)
      : f.isMeshBasicMaterial
        ? r(m, f)
        : f.isMeshLambertMaterial
          ? (r(m, f), f.envMap && (m.envMapIntensity.value = f.envMapIntensity))
          : f.isMeshToonMaterial
            ? (r(m, f), d(m, f))
            : f.isMeshPhongMaterial
              ? (r(m, f),
                u(m, f),
                f.envMap && (m.envMapIntensity.value = f.envMapIntensity))
              : f.isMeshStandardMaterial
                ? (r(m, f), h(m, f), f.isMeshPhysicalMaterial && p(m, f, E))
                : f.isMeshMatcapMaterial
                  ? (r(m, f), g(m, f))
                  : f.isMeshDepthMaterial
                    ? r(m, f)
                    : f.isMeshDistanceMaterial
                      ? (r(m, f), y(m, f))
                      : f.isMeshNormalMaterial
                        ? r(m, f)
                        : f.isLineBasicMaterial
                          ? (a(m, f), f.isLineDashedMaterial && o(m, f))
                          : f.isPointsMaterial
                            ? c(m, f, M, T)
                            : f.isSpriteMaterial
                              ? l(m, f)
                              : f.isShadowMaterial
                                ? (m.color.value.copy(f.color),
                                  (m.opacity.value = f.opacity))
                                : f.isShaderMaterial &&
                                  (f.uniformsNeedUpdate = !1);
  }
  function r(m, f) {
    ((m.opacity.value = f.opacity),
      f.color && m.diffuse.value.copy(f.color),
      f.emissive &&
        m.emissive.value.copy(f.emissive).multiplyScalar(f.emissiveIntensity),
      f.map && ((m.map.value = f.map), t(f.map, m.mapTransform)),
      f.alphaMap &&
        ((m.alphaMap.value = f.alphaMap), t(f.alphaMap, m.alphaMapTransform)),
      f.bumpMap &&
        ((m.bumpMap.value = f.bumpMap),
        t(f.bumpMap, m.bumpMapTransform),
        (m.bumpScale.value = f.bumpScale),
        f.side === Dt && (m.bumpScale.value *= -1)),
      f.normalMap &&
        ((m.normalMap.value = f.normalMap),
        t(f.normalMap, m.normalMapTransform),
        m.normalScale.value.copy(f.normalScale),
        f.side === Dt && m.normalScale.value.negate()),
      f.displacementMap &&
        ((m.displacementMap.value = f.displacementMap),
        t(f.displacementMap, m.displacementMapTransform),
        (m.displacementScale.value = f.displacementScale),
        (m.displacementBias.value = f.displacementBias)),
      f.emissiveMap &&
        ((m.emissiveMap.value = f.emissiveMap),
        t(f.emissiveMap, m.emissiveMapTransform)),
      f.specularMap &&
        ((m.specularMap.value = f.specularMap),
        t(f.specularMap, m.specularMapTransform)),
      f.alphaTest > 0 && (m.alphaTest.value = f.alphaTest));
    let M = e.get(f),
      T = M.envMap,
      E = M.envMapRotation;
    (T &&
      ((m.envMap.value = T),
      m.envMapRotation.value
        .setFromMatrix4(cg.makeRotationFromEuler(E))
        .transpose(),
      T.isCubeTexture &&
        T.isRenderTargetTexture === !1 &&
        m.envMapRotation.value.premultiply(gh),
      (m.reflectivity.value = f.reflectivity),
      (m.ior.value = f.ior),
      (m.refractionRatio.value = f.refractionRatio)),
      f.lightMap &&
        ((m.lightMap.value = f.lightMap),
        (m.lightMapIntensity.value = f.lightMapIntensity),
        t(f.lightMap, m.lightMapTransform)),
      f.aoMap &&
        ((m.aoMap.value = f.aoMap),
        (m.aoMapIntensity.value = f.aoMapIntensity),
        t(f.aoMap, m.aoMapTransform)));
  }
  function a(m, f) {
    (m.diffuse.value.copy(f.color),
      (m.opacity.value = f.opacity),
      f.map && ((m.map.value = f.map), t(f.map, m.mapTransform)));
  }
  function o(m, f) {
    ((m.dashSize.value = f.dashSize),
      (m.totalSize.value = f.dashSize + f.gapSize),
      (m.scale.value = f.scale));
  }
  function c(m, f, M, T) {
    (m.diffuse.value.copy(f.color),
      (m.opacity.value = f.opacity),
      (m.size.value = f.size * M),
      (m.scale.value = T * 0.5),
      f.map && ((m.map.value = f.map), t(f.map, m.uvTransform)),
      f.alphaMap &&
        ((m.alphaMap.value = f.alphaMap), t(f.alphaMap, m.alphaMapTransform)),
      f.alphaTest > 0 && (m.alphaTest.value = f.alphaTest));
  }
  function l(m, f) {
    (m.diffuse.value.copy(f.color),
      (m.opacity.value = f.opacity),
      (m.rotation.value = f.rotation),
      f.map && ((m.map.value = f.map), t(f.map, m.mapTransform)),
      f.alphaMap &&
        ((m.alphaMap.value = f.alphaMap), t(f.alphaMap, m.alphaMapTransform)),
      f.alphaTest > 0 && (m.alphaTest.value = f.alphaTest));
  }
  function u(m, f) {
    (m.specular.value.copy(f.specular),
      (m.shininess.value = Math.max(f.shininess, 1e-4)));
  }
  function d(m, f) {
    f.gradientMap && (m.gradientMap.value = f.gradientMap);
  }
  function h(m, f) {
    ((m.metalness.value = f.metalness),
      f.metalnessMap &&
        ((m.metalnessMap.value = f.metalnessMap),
        t(f.metalnessMap, m.metalnessMapTransform)),
      (m.roughness.value = f.roughness),
      f.roughnessMap &&
        ((m.roughnessMap.value = f.roughnessMap),
        t(f.roughnessMap, m.roughnessMapTransform)),
      f.envMap && (m.envMapIntensity.value = f.envMapIntensity));
  }
  function p(m, f, M) {
    ((m.ior.value = f.ior),
      f.sheen > 0 &&
        (m.sheenColor.value.copy(f.sheenColor).multiplyScalar(f.sheen),
        (m.sheenRoughness.value = f.sheenRoughness),
        f.sheenColorMap &&
          ((m.sheenColorMap.value = f.sheenColorMap),
          t(f.sheenColorMap, m.sheenColorMapTransform)),
        f.sheenRoughnessMap &&
          ((m.sheenRoughnessMap.value = f.sheenRoughnessMap),
          t(f.sheenRoughnessMap, m.sheenRoughnessMapTransform))),
      f.clearcoat > 0 &&
        ((m.clearcoat.value = f.clearcoat),
        (m.clearcoatRoughness.value = f.clearcoatRoughness),
        f.clearcoatMap &&
          ((m.clearcoatMap.value = f.clearcoatMap),
          t(f.clearcoatMap, m.clearcoatMapTransform)),
        f.clearcoatRoughnessMap &&
          ((m.clearcoatRoughnessMap.value = f.clearcoatRoughnessMap),
          t(f.clearcoatRoughnessMap, m.clearcoatRoughnessMapTransform)),
        f.clearcoatNormalMap &&
          ((m.clearcoatNormalMap.value = f.clearcoatNormalMap),
          t(f.clearcoatNormalMap, m.clearcoatNormalMapTransform),
          m.clearcoatNormalScale.value.copy(f.clearcoatNormalScale),
          f.side === Dt && m.clearcoatNormalScale.value.negate())),
      f.dispersion > 0 && (m.dispersion.value = f.dispersion),
      f.iridescence > 0 &&
        ((m.iridescence.value = f.iridescence),
        (m.iridescenceIOR.value = f.iridescenceIOR),
        (m.iridescenceThicknessMinimum.value = f.iridescenceThicknessRange[0]),
        (m.iridescenceThicknessMaximum.value = f.iridescenceThicknessRange[1]),
        f.iridescenceMap &&
          ((m.iridescenceMap.value = f.iridescenceMap),
          t(f.iridescenceMap, m.iridescenceMapTransform)),
        f.iridescenceThicknessMap &&
          ((m.iridescenceThicknessMap.value = f.iridescenceThicknessMap),
          t(f.iridescenceThicknessMap, m.iridescenceThicknessMapTransform))),
      f.transmission > 0 &&
        ((m.transmission.value = f.transmission),
        (m.transmissionSamplerMap.value = M.texture),
        m.transmissionSamplerSize.value.set(M.width, M.height),
        f.transmissionMap &&
          ((m.transmissionMap.value = f.transmissionMap),
          t(f.transmissionMap, m.transmissionMapTransform)),
        (m.thickness.value = f.thickness),
        f.thicknessMap &&
          ((m.thicknessMap.value = f.thicknessMap),
          t(f.thicknessMap, m.thicknessMapTransform)),
        (m.attenuationDistance.value = f.attenuationDistance),
        m.attenuationColor.value.copy(f.attenuationColor)),
      f.anisotropy > 0 &&
        (m.anisotropyVector.value.set(
          f.anisotropy * Math.cos(f.anisotropyRotation),
          f.anisotropy * Math.sin(f.anisotropyRotation),
        ),
        f.anisotropyMap &&
          ((m.anisotropyMap.value = f.anisotropyMap),
          t(f.anisotropyMap, m.anisotropyMapTransform))),
      (m.specularIntensity.value = f.specularIntensity),
      m.specularColor.value.copy(f.specularColor),
      f.specularColorMap &&
        ((m.specularColorMap.value = f.specularColorMap),
        t(f.specularColorMap, m.specularColorMapTransform)),
      f.specularIntensityMap &&
        ((m.specularIntensityMap.value = f.specularIntensityMap),
        t(f.specularIntensityMap, m.specularIntensityMapTransform)));
  }
  function g(m, f) {
    f.matcap && (m.matcap.value = f.matcap);
  }
  function y(m, f) {
    let M = e.get(f).light;
    (m.referencePosition.value.setFromMatrixPosition(M.matrixWorld),
      (m.nearDistance.value = M.shadow.camera.near),
      (m.farDistance.value = M.shadow.camera.far));
  }
  return { refreshFogUniforms: n, refreshMaterialUniforms: s };
}
function ug(i, e, t, n) {
  let s = {},
    r = {},
    a = [],
    o = i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS);
  function c(M, T) {
    let E = T.program;
    n.uniformBlockBinding(M, E);
  }
  function l(M, T) {
    let E = s[M.id];
    E === void 0 &&
      (g(M), (E = u(M)), (s[M.id] = E), M.addEventListener("dispose", m));
    let w = T.program;
    n.updateUBOMapping(M, w);
    let b = e.render.frame;
    r[M.id] !== b && (h(M), (r[M.id] = b));
  }
  function u(M) {
    let T = d();
    M.__bindingPointIndex = T;
    let E = i.createBuffer(),
      w = M.__size,
      b = M.usage;
    return (
      i.bindBuffer(i.UNIFORM_BUFFER, E),
      i.bufferData(i.UNIFORM_BUFFER, w, b),
      i.bindBuffer(i.UNIFORM_BUFFER, null),
      i.bindBufferBase(i.UNIFORM_BUFFER, T, E),
      E
    );
  }
  function d() {
    for (let M = 0; M < o; M++) if (a.indexOf(M) === -1) return (a.push(M), M);
    return (
      Ie(
        "WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached.",
      ),
      0
    );
  }
  function h(M) {
    let T = s[M.id],
      E = M.uniforms,
      w = M.__cache;
    i.bindBuffer(i.UNIFORM_BUFFER, T);
    for (let b = 0, R = E.length; b < R; b++) {
      let x = Array.isArray(E[b]) ? E[b] : [E[b]];
      for (let A = 0, N = x.length; A < N; A++) {
        let C = x[A];
        if (p(C, b, A, w) === !0) {
          let O = C.__offset,
            X = Array.isArray(C.value) ? C.value : [C.value],
            W = 0;
          for (let D = 0; D < X.length; D++) {
            let V = X[D],
              k = y(V);
            typeof V == "number" || typeof V == "boolean"
              ? ((C.__data[0] = V),
                i.bufferSubData(i.UNIFORM_BUFFER, O + W, C.__data))
              : V.isMatrix3
                ? ((C.__data[0] = V.elements[0]),
                  (C.__data[1] = V.elements[1]),
                  (C.__data[2] = V.elements[2]),
                  (C.__data[3] = 0),
                  (C.__data[4] = V.elements[3]),
                  (C.__data[5] = V.elements[4]),
                  (C.__data[6] = V.elements[5]),
                  (C.__data[7] = 0),
                  (C.__data[8] = V.elements[6]),
                  (C.__data[9] = V.elements[7]),
                  (C.__data[10] = V.elements[8]),
                  (C.__data[11] = 0))
                : ArrayBuffer.isView(V)
                  ? C.__data.set(
                      new V.constructor(
                        V.buffer,
                        V.byteOffset,
                        C.__data.length,
                      ),
                    )
                  : (V.toArray(C.__data, W),
                    (W += k.storage / Float32Array.BYTES_PER_ELEMENT));
          }
          i.bufferSubData(i.UNIFORM_BUFFER, O, C.__data);
        }
      }
    }
    i.bindBuffer(i.UNIFORM_BUFFER, null);
  }
  function p(M, T, E, w) {
    let b = M.value,
      R = T + "_" + E;
    if (w[R] === void 0)
      return (
        typeof b == "number" || typeof b == "boolean"
          ? (w[R] = b)
          : ArrayBuffer.isView(b)
            ? (w[R] = b.slice())
            : (w[R] = b.clone()),
        !0
      );
    {
      let x = w[R];
      if (typeof b == "number" || typeof b == "boolean") {
        if (x !== b) return ((w[R] = b), !0);
      } else {
        if (ArrayBuffer.isView(b)) return !0;
        if (x.equals(b) === !1) return (x.copy(b), !0);
      }
    }
    return !1;
  }
  function g(M) {
    let T = M.uniforms,
      E = 0,
      w = 16;
    for (let R = 0, x = T.length; R < x; R++) {
      let A = Array.isArray(T[R]) ? T[R] : [T[R]];
      for (let N = 0, C = A.length; N < C; N++) {
        let O = A[N],
          X = Array.isArray(O.value) ? O.value : [O.value];
        for (let W = 0, D = X.length; W < D; W++) {
          let V = X[W],
            k = y(V),
            j = E % w,
            ee = j % k.boundary,
            ce = j + ee;
          ((E += ee),
            ce !== 0 && w - ce < k.storage && (E += w - ce),
            (O.__data = new Float32Array(
              k.storage / Float32Array.BYTES_PER_ELEMENT,
            )),
            (O.__offset = E),
            (E += k.storage));
        }
      }
    }
    let b = E % w;
    return (b > 0 && (E += w - b), (M.__size = E), (M.__cache = {}), this);
  }
  function y(M) {
    let T = { boundary: 0, storage: 0 };
    return (
      typeof M == "number" || typeof M == "boolean"
        ? ((T.boundary = 4), (T.storage = 4))
        : M.isVector2
          ? ((T.boundary = 8), (T.storage = 8))
          : M.isVector3 || M.isColor
            ? ((T.boundary = 16), (T.storage = 12))
            : M.isVector4
              ? ((T.boundary = 16), (T.storage = 16))
              : M.isMatrix3
                ? ((T.boundary = 48), (T.storage = 48))
                : M.isMatrix4
                  ? ((T.boundary = 64), (T.storage = 64))
                  : M.isTexture
                    ? Ce(
                        "WebGLRenderer: Texture samplers can not be part of an uniforms group.",
                      )
                    : ArrayBuffer.isView(M)
                      ? ((T.boundary = 16), (T.storage = M.byteLength))
                      : Ce("WebGLRenderer: Unsupported uniform value type.", M),
      T
    );
  }
  function m(M) {
    let T = M.target;
    T.removeEventListener("dispose", m);
    let E = a.indexOf(T.__bindingPointIndex);
    (a.splice(E, 1), i.deleteBuffer(s[T.id]), delete s[T.id], delete r[T.id]);
  }
  function f() {
    for (let M in s) i.deleteBuffer(s[M]);
    ((a = []), (s = {}), (r = {}));
  }
  return { bind: c, update: l, dispose: f };
}
var dg = new Uint16Array([
    12469, 15057, 12620, 14925, 13266, 14620, 13807, 14376, 14323, 13990, 14545,
    13625, 14713, 13328, 14840, 12882, 14931, 12528, 14996, 12233, 15039, 11829,
    15066, 11525, 15080, 11295, 15085, 10976, 15082, 10705, 15073, 10495, 13880,
    14564, 13898, 14542, 13977, 14430, 14158, 14124, 14393, 13732, 14556, 13410,
    14702, 12996, 14814, 12596, 14891, 12291, 14937, 11834, 14957, 11489, 14958,
    11194, 14943, 10803, 14921, 10506, 14893, 10278, 14858, 9960, 14484, 14039,
    14487, 14025, 14499, 13941, 14524, 13740, 14574, 13468, 14654, 13106, 14743,
    12678, 14818, 12344, 14867, 11893, 14889, 11509, 14893, 11180, 14881, 10751,
    14852, 10428, 14812, 10128, 14765, 9754, 14712, 9466, 14764, 13480, 14764,
    13475, 14766, 13440, 14766, 13347, 14769, 13070, 14786, 12713, 14816, 12387,
    14844, 11957, 14860, 11549, 14868, 11215, 14855, 10751, 14825, 10403, 14782,
    10044, 14729, 9651, 14666, 9352, 14599, 9029, 14967, 12835, 14966, 12831,
    14963, 12804, 14954, 12723, 14936, 12564, 14917, 12347, 14900, 11958, 14886,
    11569, 14878, 11247, 14859, 10765, 14828, 10401, 14784, 10011, 14727, 9600,
    14660, 9289, 14586, 8893, 14508, 8533, 15111, 12234, 15110, 12234, 15104,
    12216, 15092, 12156, 15067, 12010, 15028, 11776, 14981, 11500, 14942, 11205,
    14902, 10752, 14861, 10393, 14812, 9991, 14752, 9570, 14682, 9252, 14603,
    8808, 14519, 8445, 14431, 8145, 15209, 11449, 15208, 11451, 15202, 11451,
    15190, 11438, 15163, 11384, 15117, 11274, 15055, 10979, 14994, 10648, 14932,
    10343, 14871, 9936, 14803, 9532, 14729, 9218, 14645, 8742, 14556, 8381,
    14461, 8020, 14365, 7603, 15273, 10603, 15272, 10607, 15267, 10619, 15256,
    10631, 15231, 10614, 15182, 10535, 15118, 10389, 15042, 10167, 14963, 9787,
    14883, 9447, 14800, 9115, 14710, 8665, 14615, 8318, 14514, 7911, 14411,
    7507, 14279, 7198, 15314, 9675, 15313, 9683, 15309, 9712, 15298, 9759,
    15277, 9797, 15229, 9773, 15166, 9668, 15084, 9487, 14995, 9274, 14898,
    8910, 14800, 8539, 14697, 8234, 14590, 7790, 14479, 7409, 14367, 7067,
    14178, 6621, 15337, 8619, 15337, 8631, 15333, 8677, 15325, 8769, 15305,
    8871, 15264, 8940, 15202, 8909, 15119, 8775, 15022, 8565, 14916, 8328,
    14804, 8009, 14688, 7614, 14569, 7287, 14448, 6888, 14321, 6483, 14088,
    6171, 15350, 7402, 15350, 7419, 15347, 7480, 15340, 7613, 15322, 7804,
    15287, 7973, 15229, 8057, 15148, 8012, 15046, 7846, 14933, 7611, 14810,
    7357, 14682, 7069, 14552, 6656, 14421, 6316, 14251, 5948, 14007, 5528,
    15356, 5942, 15356, 5977, 15353, 6119, 15348, 6294, 15332, 6551, 15302,
    6824, 15249, 7044, 15171, 7122, 15070, 7050, 14949, 6861, 14818, 6611,
    14679, 6349, 14538, 6067, 14398, 5651, 14189, 5311, 13935, 4958, 15359,
    4123, 15359, 4153, 15356, 4296, 15353, 4646, 15338, 5160, 15311, 5508,
    15263, 5829, 15188, 6042, 15088, 6094, 14966, 6001, 14826, 5796, 14678,
    5543, 14527, 5287, 14377, 4985, 14133, 4586, 13869, 4257, 15360, 1563,
    15360, 1642, 15358, 2076, 15354, 2636, 15341, 3350, 15317, 4019, 15273,
    4429, 15203, 4732, 15105, 4911, 14981, 4932, 14836, 4818, 14679, 4621,
    14517, 4386, 14359, 4156, 14083, 3795, 13808, 3437, 15360, 122, 15360, 137,
    15358, 285, 15355, 636, 15344, 1274, 15322, 2177, 15281, 2765, 15215, 3223,
    15120, 3451, 14995, 3569, 14846, 3567, 14681, 3466, 14511, 3305, 14344,
    3121, 14037, 2800, 13753, 2467, 15360, 0, 15360, 1, 15359, 21, 15355, 89,
    15346, 253, 15325, 479, 15287, 796, 15225, 1148, 15133, 1492, 15008, 1749,
    14856, 1882, 14685, 1886, 14506, 1783, 14324, 1608, 13996, 1398, 13702,
    1183,
  ]),
  gn = null;
function fg() {
  return (
    gn === null &&
      ((gn = new Er(dg, 16, 16, $n, mn)),
      (gn.name = "DFG_LUT"),
      (gn.minFilter = Tt),
      (gn.magFilter = Tt),
      (gn.wrapS = ln),
      (gn.wrapT = ln),
      (gn.generateMipmaps = !1),
      (gn.needsUpdate = !0)),
    gn
  );
}
var Fa = class {
  constructor(e = {}) {
    let {
      canvas: t = Nc(),
      context: n = null,
      depth: s = !0,
      stencil: r = !1,
      alpha: a = !1,
      antialias: o = !1,
      premultipliedAlpha: c = !0,
      preserveDrawingBuffer: l = !1,
      powerPreference: u = "default",
      failIfMajorPerformanceCaveat: d = !1,
      reversedDepthBuffer: h = !1,
      outputBufferType: p = Ft,
    } = e;
    this.isWebGLRenderer = !0;
    let g;
    if (n !== null) {
      if (
        typeof WebGLRenderingContext < "u" &&
        n instanceof WebGLRenderingContext
      )
        throw new Error(
          "THREE.WebGLRenderer: WebGL 1 is not supported since r163.",
        );
      g = n.getContextAttributes().alpha;
    } else g = a;
    let y = p,
      m = new Set([jr, Kr, $r]),
      f = new Set([Ft, en, Wi, Xi, Zr, Jr]),
      M = new Uint32Array(4),
      T = new Int32Array(4),
      E = new U(),
      w = null,
      b = null,
      R = [],
      x = [],
      A = null;
    ((this.domElement = t),
      (this.debug = { checkShaderErrors: !0, onShaderError: null }),
      (this.autoClear = !0),
      (this.autoClearColor = !0),
      (this.autoClearDepth = !0),
      (this.autoClearStencil = !0),
      (this.sortObjects = !0),
      (this.clippingPlanes = []),
      (this.localClippingEnabled = !1),
      (this.toneMapping = Qt),
      (this.toneMappingExposure = 1),
      (this.transmissionResolutionScale = 1));
    let N = this,
      C = !1,
      O = null;
    this._outputColorSpace = Et;
    let X = 0,
      W = 0,
      D = null,
      V = -1,
      k = null,
      j = new ut(),
      ee = new ut(),
      ce = null,
      ye = new Pe(0),
      Me = 0,
      We = t.width,
      $e = t.height,
      De = 1,
      $ = null,
      de = null,
      te = new ut(0, 0, We, $e),
      Ae = new ut(0, 0, We, $e),
      Le = !1,
      Re = new Oi(),
      lt = !1,
      He = !1,
      Ke = new ht(),
      nt = new U(),
      H = new ut(),
      le = {
        background: null,
        fog: null,
        environment: null,
        overrideMaterial: null,
        isScene: !0,
      },
      we = !1;
    function ke() {
      return D === null ? De : 1;
    }
    let P = n;
    function it(v, L) {
      return t.getContext(v, L);
    }
    try {
      let v = {
        alpha: !0,
        depth: s,
        stencil: r,
        antialias: o,
        premultipliedAlpha: c,
        preserveDrawingBuffer: l,
        powerPreference: u,
        failIfMajorPerformanceCaveat: d,
      };
      if (
        ("setAttribute" in t &&
          t.setAttribute("data-engine", `three.js r${Gr}`),
        t.addEventListener("webglcontextlost", K, !1),
        t.addEventListener("webglcontextrestored", be, !1),
        t.addEventListener("webglcontextcreationerror", Oe, !1),
        P === null)
      ) {
        let L = "webgl2";
        if (((P = it(L, v)), P === null))
          throw it(L)
            ? new Error(
                "Error creating WebGL context with your selected attributes.",
              )
            : new Error("Error creating WebGL context.");
      }
    } catch (v) {
      throw (Ie("WebGLRenderer: " + v.message), v);
    }
    let Fe,
      je,
      he,
      dt,
      S,
      _,
      F,
      Z,
      Q,
      ne,
      oe,
      q,
      J,
      me,
      xe,
      re,
      ie,
      Ue,
      ze,
      Je,
      I,
      se,
      Y;
    function ge() {
      ((Fe = new yp(P)),
        Fe.init(),
        (I = new ag(P, Fe)),
        (je = new dp(P, Fe, e, I)),
        (he = new sg(P, Fe)),
        je.reversedDepthBuffer && h && he.buffers.depth.setReversed(!0),
        (dt = new bp(P)),
        (S = new Wm()),
        (_ = new rg(P, Fe, he, S, je, I, dt)),
        (F = new vp(N)),
        (Z = new Au(P)),
        (se = new hp(P, Z)),
        (Q = new Mp(P, Z, dt, se)),
        (ne = new Tp(P, Q, Z, se, dt)),
        (Ue = new Ep(P, je, _)),
        (xe = new fp(S)),
        (oe = new Hm(N, F, Fe, je, se, xe)),
        (q = new hg(N, S)),
        (J = new qm()),
        (me = new jm(Fe)),
        (ie = new cp(N, F, he, ne, g, c)),
        (re = new ig(N, ne, je)),
        (Y = new ug(P, dt, je, he)),
        (ze = new up(P, Fe, dt)),
        (Je = new Sp(P, Fe, dt)),
        (dt.programs = oe.programs),
        (N.capabilities = je),
        (N.extensions = Fe),
        (N.properties = S),
        (N.renderLists = J),
        (N.shadowMap = re),
        (N.state = he),
        (N.info = dt));
    }
    (ge(), y !== Ft && (A = new wp(y, t.width, t.height, s, r)));
    let ae = new pl(N, P);
    ((this.xr = ae),
      (this.getContext = function () {
        return P;
      }),
      (this.getContextAttributes = function () {
        return P.getContextAttributes();
      }),
      (this.forceContextLoss = function () {
        let v = Fe.get("WEBGL_lose_context");
        v && v.loseContext();
      }),
      (this.forceContextRestore = function () {
        let v = Fe.get("WEBGL_lose_context");
        v && v.restoreContext();
      }),
      (this.getPixelRatio = function () {
        return De;
      }),
      (this.setPixelRatio = function (v) {
        v !== void 0 && ((De = v), this.setSize(We, $e, !1));
      }),
      (this.getSize = function (v) {
        return v.set(We, $e);
      }),
      (this.setSize = function (v, L, G = !0) {
        if (ae.isPresenting) {
          Ce("WebGLRenderer: Can't change size while VR device is presenting.");
          return;
        }
        ((We = v),
          ($e = L),
          (t.width = Math.floor(v * De)),
          (t.height = Math.floor(L * De)),
          G === !0 && ((t.style.width = v + "px"), (t.style.height = L + "px")),
          A !== null && A.setSize(t.width, t.height),
          this.setViewport(0, 0, v, L));
      }),
      (this.getDrawingBufferSize = function (v) {
        return v.set(We * De, $e * De).floor();
      }),
      (this.setDrawingBufferSize = function (v, L, G) {
        ((We = v),
          ($e = L),
          (De = G),
          (t.width = Math.floor(v * G)),
          (t.height = Math.floor(L * G)),
          this.setViewport(0, 0, v, L));
      }),
      (this.setEffects = function (v) {
        if (y === Ft) {
          Ie(
            "THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.",
          );
          return;
        }
        if (v) {
          for (let L = 0; L < v.length; L++)
            if (v[L].isOutputPass === !0) {
              Ce(
                "THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.",
              );
              break;
            }
        }
        A.setEffects(v || []);
      }),
      (this.getCurrentViewport = function (v) {
        return v.copy(j);
      }),
      (this.getViewport = function (v) {
        return v.copy(te);
      }),
      (this.setViewport = function (v, L, G, B) {
        (v.isVector4 ? te.set(v.x, v.y, v.z, v.w) : te.set(v, L, G, B),
          he.viewport(j.copy(te).multiplyScalar(De).round()));
      }),
      (this.getScissor = function (v) {
        return v.copy(Ae);
      }),
      (this.setScissor = function (v, L, G, B) {
        (v.isVector4 ? Ae.set(v.x, v.y, v.z, v.w) : Ae.set(v, L, G, B),
          he.scissor(ee.copy(Ae).multiplyScalar(De).round()));
      }),
      (this.getScissorTest = function () {
        return Le;
      }),
      (this.setScissorTest = function (v) {
        he.setScissorTest((Le = v));
      }),
      (this.setOpaqueSort = function (v) {
        $ = v;
      }),
      (this.setTransparentSort = function (v) {
        de = v;
      }),
      (this.getClearColor = function (v) {
        return v.copy(ie.getClearColor());
      }),
      (this.setClearColor = function () {
        ie.setClearColor(...arguments);
      }),
      (this.getClearAlpha = function () {
        return ie.getClearAlpha();
      }),
      (this.setClearAlpha = function () {
        ie.setClearAlpha(...arguments);
      }),
      (this.clear = function (v = !0, L = !0, G = !0) {
        let B = 0;
        if (v) {
          let z = !1;
          if (D !== null) {
            let pe = D.texture.format;
            z = m.has(pe);
          }
          if (z) {
            let pe = D.texture.type,
              ve = f.has(pe),
              fe = ie.getClearColor(),
              Se = ie.getClearAlpha(),
              Ee = fe.r,
              Be = fe.g,
              Ge = fe.b;
            ve
              ? ((M[0] = Ee),
                (M[1] = Be),
                (M[2] = Ge),
                (M[3] = Se),
                P.clearBufferuiv(P.COLOR, 0, M))
              : ((T[0] = Ee),
                (T[1] = Be),
                (T[2] = Ge),
                (T[3] = Se),
                P.clearBufferiv(P.COLOR, 0, T));
          } else B |= P.COLOR_BUFFER_BIT;
        }
        (L && ((B |= P.DEPTH_BUFFER_BIT), this.state.buffers.depth.setMask(!0)),
          G &&
            ((B |= P.STENCIL_BUFFER_BIT),
            this.state.buffers.stencil.setMask(4294967295)),
          B !== 0 && P.clear(B));
      }),
      (this.clearColor = function () {
        this.clear(!0, !1, !1);
      }),
      (this.clearDepth = function () {
        this.clear(!1, !0, !1);
      }),
      (this.clearStencil = function () {
        this.clear(!1, !1, !0);
      }),
      (this.setNodesHandler = function (v) {
        (v.setRenderer(this), (O = v));
      }),
      (this.dispose = function () {
        (t.removeEventListener("webglcontextlost", K, !1),
          t.removeEventListener("webglcontextrestored", be, !1),
          t.removeEventListener("webglcontextcreationerror", Oe, !1),
          ie.dispose(),
          J.dispose(),
          me.dispose(),
          S.dispose(),
          F.dispose(),
          ne.dispose(),
          se.dispose(),
          Y.dispose(),
          oe.dispose(),
          ae.dispose(),
          ae.removeEventListener("sessionstart", yl),
          ae.removeEventListener("sessionend", Ml),
          jn.stop());
      }));
    function K(v) {
      (v.preventDefault(), Zo("WebGLRenderer: Context Lost."), (C = !0));
    }
    function be() {
      (Zo("WebGLRenderer: Context Restored."), (C = !1));
      let v = dt.autoReset,
        L = re.enabled,
        G = re.autoUpdate,
        B = re.needsUpdate,
        z = re.type;
      (ge(),
        (dt.autoReset = v),
        (re.enabled = L),
        (re.autoUpdate = G),
        (re.needsUpdate = B),
        (re.type = z));
    }
    function Oe(v) {
      Ie(
        "WebGLRenderer: A WebGL context could not be created. Reason: ",
        v.statusMessage,
      );
    }
    function pt(v) {
      let L = v.target;
      (L.removeEventListener("dispose", pt), et(L));
    }
    function et(v) {
      (xn(v), S.remove(v));
    }
    function xn(v) {
      let L = S.get(v).programs;
      L !== void 0 &&
        (L.forEach(function (G) {
          oe.releaseProgram(G);
        }),
        v.isShaderMaterial && oe.releaseShaderCache(v));
    }
    this.renderBufferDirect = function (v, L, G, B, z, pe) {
      L === null && (L = le);
      let ve = z.isMesh && z.matrixWorld.determinant() < 0,
        fe = Ah(v, L, G, B, z);
      he.setMaterial(B, ve);
      let Se = G.index,
        Ee = 1;
      if (B.wireframe === !0) {
        if (((Se = Q.getWireframeAttribute(G)), Se === void 0)) return;
        Ee = 2;
      }
      let Be = G.drawRange,
        Ge = G.attributes.position,
        Te = Be.start * Ee,
        tt = (Be.start + Be.count) * Ee;
      (pe !== null &&
        ((Te = Math.max(Te, pe.start * Ee)),
        (tt = Math.min(tt, (pe.start + pe.count) * Ee))),
        Se !== null
          ? ((Te = Math.max(Te, 0)), (tt = Math.min(tt, Se.count)))
          : Ge != null &&
            ((Te = Math.max(Te, 0)), (tt = Math.min(tt, Ge.count))));
      let mt = tt - Te;
      if (mt < 0 || mt === 1 / 0) return;
      se.setup(z, B, fe, G, Se);
      let ft,
        st = ze;
      if (
        (Se !== null && ((ft = Z.get(Se)), (st = Je), st.setIndex(ft)),
        z.isMesh)
      )
        B.wireframe === !0
          ? (he.setLineWidth(B.wireframeLinewidth * ke()), st.setMode(P.LINES))
          : st.setMode(P.TRIANGLES);
      else if (z.isLine) {
        let wt = B.linewidth;
        (wt === void 0 && (wt = 1),
          he.setLineWidth(wt * ke()),
          z.isLineSegments
            ? st.setMode(P.LINES)
            : z.isLineLoop
              ? st.setMode(P.LINE_LOOP)
              : st.setMode(P.LINE_STRIP));
      } else
        z.isPoints
          ? st.setMode(P.POINTS)
          : z.isSprite && st.setMode(P.TRIANGLES);
      if (z.isBatchedMesh)
        if (Fe.get("WEBGL_multi_draw"))
          st.renderMultiDraw(
            z._multiDrawStarts,
            z._multiDrawCounts,
            z._multiDrawCount,
          );
        else {
          let wt = z._multiDrawStarts,
            _e = z._multiDrawCounts,
            Ot = z._multiDrawCount,
            Ze = Se ? Z.get(Se).bytesPerElement : 1,
            Wt = S.get(B).currentProgram.getUniforms();
          for (let rn = 0; rn < Ot; rn++)
            (Wt.setValue(P, "_gl_DrawID", rn), st.render(wt[rn] / Ze, _e[rn]));
        }
      else if (z.isInstancedMesh) st.renderInstances(Te, mt, z.count);
      else if (G.isInstancedBufferGeometry) {
        let wt = G._maxInstanceCount !== void 0 ? G._maxInstanceCount : 1 / 0,
          _e = Math.min(G.instanceCount, wt);
        st.renderInstances(Te, mt, _e);
      } else st.render(Te, mt);
    };
    function sn(v, L, G) {
      v.transparent === !0 && v.side === fn && v.forceSinglePass === !1
        ? ((v.side = Dt),
          (v.needsUpdate = !0),
          Fs(v, L, G),
          (v.side = An),
          (v.needsUpdate = !0),
          Fs(v, L, G),
          (v.side = fn))
        : Fs(v, L, G);
    }
    ((this.compile = function (v, L, G = null) {
      (G === null && (G = v),
        (b = me.get(G)),
        b.init(L),
        x.push(b),
        G.traverseVisible(function (z) {
          z.isLight &&
            z.layers.test(L.layers) &&
            (b.pushLight(z), z.castShadow && b.pushShadow(z));
        }),
        v !== G &&
          v.traverseVisible(function (z) {
            z.isLight &&
              z.layers.test(L.layers) &&
              (b.pushLight(z), z.castShadow && b.pushShadow(z));
          }),
        b.setupLights());
      let B = new Set();
      return (
        v.traverse(function (z) {
          if (!(z.isMesh || z.isPoints || z.isLine || z.isSprite)) return;
          let pe = z.material;
          if (pe)
            if (Array.isArray(pe))
              for (let ve = 0; ve < pe.length; ve++) {
                let fe = pe[ve];
                (sn(fe, G, z), B.add(fe));
              }
            else (sn(pe, G, z), B.add(pe));
        }),
        (b = x.pop()),
        B
      );
    }),
      (this.compileAsync = function (v, L, G = null) {
        let B = this.compile(v, L, G);
        return new Promise((z) => {
          function pe() {
            if (
              (B.forEach(function (ve) {
                S.get(ve).currentProgram.isReady() && B.delete(ve);
              }),
              B.size === 0)
            ) {
              z(v);
              return;
            }
            setTimeout(pe, 10);
          }
          Fe.get("KHR_parallel_shader_compile") !== null
            ? pe()
            : setTimeout(pe, 10);
        });
      }));
    let Ga = null;
    function Eh(v) {
      Ga && Ga(v);
    }
    function yl() {
      jn.stop();
    }
    function Ml() {
      jn.start();
    }
    let jn = new hh();
    (jn.setAnimationLoop(Eh),
      typeof self < "u" && jn.setContext(self),
      (this.setAnimationLoop = function (v) {
        ((Ga = v), ae.setAnimationLoop(v), v === null ? jn.stop() : jn.start());
      }),
      ae.addEventListener("sessionstart", yl),
      ae.addEventListener("sessionend", Ml),
      (this.render = function (v, L) {
        if (L !== void 0 && L.isCamera !== !0) {
          Ie(
            "WebGLRenderer.render: camera is not an instance of THREE.Camera.",
          );
          return;
        }
        if (C === !0) return;
        O !== null && O.renderStart(v, L);
        let G = ae.enabled === !0 && ae.isPresenting === !0,
          B = A !== null && (D === null || G) && A.begin(N, D);
        if (
          (v.matrixWorldAutoUpdate === !0 && v.updateMatrixWorld(),
          L.parent === null &&
            L.matrixWorldAutoUpdate === !0 &&
            L.updateMatrixWorld(),
          ae.enabled === !0 &&
            ae.isPresenting === !0 &&
            (A === null || A.isCompositing() === !1) &&
            (ae.cameraAutoUpdate === !0 && ae.updateCamera(L),
            (L = ae.getCamera())),
          v.isScene === !0 && v.onBeforeRender(N, v, L, D),
          (b = me.get(v, x.length)),
          b.init(L),
          (b.state.textureUnits = _.getTextureUnits()),
          x.push(b),
          Ke.multiplyMatrices(L.projectionMatrix, L.matrixWorldInverse),
          Re.setFromProjectionMatrix(Ke, jt, L.reversedDepth),
          (He = this.localClippingEnabled),
          (lt = xe.init(this.clippingPlanes, He)),
          (w = J.get(v, R.length)),
          w.init(),
          R.push(w),
          ae.enabled === !0 && ae.isPresenting === !0)
        ) {
          let ve = N.xr.getDepthSensingMesh();
          ve !== null && Ha(ve, L, -1 / 0, N.sortObjects);
        }
        (Ha(v, L, 0, N.sortObjects),
          w.finish(),
          N.sortObjects === !0 && w.sort($, de),
          (we =
            ae.enabled === !1 ||
            ae.isPresenting === !1 ||
            ae.hasDepthSensing() === !1),
          we && ie.addToRenderList(w, v),
          this.info.render.frame++,
          lt === !0 && xe.beginShadows());
        let z = b.state.shadowsArray;
        if (
          (re.render(z, v, L),
          lt === !0 && xe.endShadows(),
          this.info.autoReset === !0 && this.info.reset(),
          (B && A.hasRenderPass()) === !1)
        ) {
          let ve = w.opaque,
            fe = w.transmissive;
          if ((b.setupLights(), L.isArrayCamera)) {
            let Se = L.cameras;
            if (fe.length > 0)
              for (let Ee = 0, Be = Se.length; Ee < Be; Ee++) {
                let Ge = Se[Ee];
                bl(ve, fe, v, Ge);
              }
            we && ie.render(v);
            for (let Ee = 0, Be = Se.length; Ee < Be; Ee++) {
              let Ge = Se[Ee];
              Sl(w, v, Ge, Ge.viewport);
            }
          } else
            (fe.length > 0 && bl(ve, fe, v, L),
              we && ie.render(v),
              Sl(w, v, L));
        }
        (D !== null &&
          W === 0 &&
          (_.updateMultisampleRenderTarget(D), _.updateRenderTargetMipmap(D)),
          B && A.end(N),
          v.isScene === !0 && v.onAfterRender(N, v, L),
          se.resetDefaultState(),
          (V = -1),
          (k = null),
          x.pop(),
          x.length > 0
            ? ((b = x[x.length - 1]),
              _.setTextureUnits(b.state.textureUnits),
              lt === !0 && xe.setGlobalState(N.clippingPlanes, b.state.camera))
            : (b = null),
          R.pop(),
          R.length > 0 ? (w = R[R.length - 1]) : (w = null),
          O !== null && O.renderEnd());
      }));
    function Ha(v, L, G, B) {
      if (v.visible === !1) return;
      if (v.layers.test(L.layers)) {
        if (v.isGroup) G = v.renderOrder;
        else if (v.isLOD) v.autoUpdate === !0 && v.update(L);
        else if (v.isLightProbeGrid) b.pushLightProbeGrid(v);
        else if (v.isLight) (b.pushLight(v), v.castShadow && b.pushShadow(v));
        else if (v.isSprite) {
          if (!v.frustumCulled || Re.intersectsSprite(v)) {
            B && H.setFromMatrixPosition(v.matrixWorld).applyMatrix4(Ke);
            let ve = ne.update(v),
              fe = v.material;
            fe.visible && w.push(v, ve, fe, G, H.z, null);
          }
        } else if (
          (v.isMesh || v.isLine || v.isPoints) &&
          (!v.frustumCulled || Re.intersectsObject(v))
        ) {
          let ve = ne.update(v),
            fe = v.material;
          if (
            (B &&
              (v.boundingSphere !== void 0
                ? (v.boundingSphere === null && v.computeBoundingSphere(),
                  H.copy(v.boundingSphere.center))
                : (ve.boundingSphere === null && ve.computeBoundingSphere(),
                  H.copy(ve.boundingSphere.center)),
              H.applyMatrix4(v.matrixWorld).applyMatrix4(Ke)),
            Array.isArray(fe))
          ) {
            let Se = ve.groups;
            for (let Ee = 0, Be = Se.length; Ee < Be; Ee++) {
              let Ge = Se[Ee],
                Te = fe[Ge.materialIndex];
              Te && Te.visible && w.push(v, ve, Te, G, H.z, Ge);
            }
          } else fe.visible && w.push(v, ve, fe, G, H.z, null);
        }
      }
      let pe = v.children;
      for (let ve = 0, fe = pe.length; ve < fe; ve++) Ha(pe[ve], L, G, B);
    }
    function Sl(v, L, G, B) {
      let { opaque: z, transmissive: pe, transparent: ve } = v;
      (b.setupLightsView(G),
        lt === !0 && xe.setGlobalState(N.clippingPlanes, G),
        B && he.viewport(j.copy(B)),
        z.length > 0 && Ns(z, L, G),
        pe.length > 0 && Ns(pe, L, G),
        ve.length > 0 && Ns(ve, L, G),
        he.buffers.depth.setTest(!0),
        he.buffers.depth.setMask(!0),
        he.buffers.color.setMask(!0),
        he.setPolygonOffset(!1));
    }
    function bl(v, L, G, B) {
      if ((G.isScene === !0 ? G.overrideMaterial : null) !== null) return;
      if (b.state.transmissionRenderTarget[B.id] === void 0) {
        let Te =
          Fe.has("EXT_color_buffer_half_float") ||
          Fe.has("EXT_color_buffer_float");
        b.state.transmissionRenderTarget[B.id] = new kt(1, 1, {
          generateMipmaps: !0,
          type: Te ? mn : Ft,
          minFilter: Zn,
          samples: Math.max(4, je.samples),
          stencilBuffer: r,
          resolveDepthBuffer: !1,
          resolveStencilBuffer: !1,
          colorSpace: Xe.workingColorSpace,
        });
      }
      let pe = b.state.transmissionRenderTarget[B.id],
        ve = B.viewport || j;
      pe.setSize(
        ve.z * N.transmissionResolutionScale,
        ve.w * N.transmissionResolutionScale,
      );
      let fe = N.getRenderTarget(),
        Se = N.getActiveCubeFace(),
        Ee = N.getActiveMipmapLevel();
      (N.setRenderTarget(pe),
        N.getClearColor(ye),
        (Me = N.getClearAlpha()),
        Me < 1 && N.setClearColor(16777215, 0.5),
        N.clear(),
        we && ie.render(G));
      let Be = N.toneMapping;
      N.toneMapping = Qt;
      let Ge = B.viewport;
      if (
        (B.viewport !== void 0 && (B.viewport = void 0),
        b.setupLightsView(B),
        lt === !0 && xe.setGlobalState(N.clippingPlanes, B),
        Ns(v, G, B),
        _.updateMultisampleRenderTarget(pe),
        _.updateRenderTargetMipmap(pe),
        Fe.has("WEBGL_multisampled_render_to_texture") === !1)
      ) {
        let Te = !1;
        for (let tt = 0, mt = L.length; tt < mt; tt++) {
          let ft = L[tt],
            { object: st, geometry: wt, material: _e, group: Ot } = ft;
          if (_e.side === fn && st.layers.test(B.layers)) {
            let Ze = _e.side;
            ((_e.side = Dt),
              (_e.needsUpdate = !0),
              El(st, G, B, wt, _e, Ot),
              (_e.side = Ze),
              (_e.needsUpdate = !0),
              (Te = !0));
          }
        }
        Te === !0 &&
          (_.updateMultisampleRenderTarget(pe), _.updateRenderTargetMipmap(pe));
      }
      (N.setRenderTarget(fe, Se, Ee),
        N.setClearColor(ye, Me),
        Ge !== void 0 && (B.viewport = Ge),
        (N.toneMapping = Be));
    }
    function Ns(v, L, G) {
      let B = L.isScene === !0 ? L.overrideMaterial : null;
      for (let z = 0, pe = v.length; z < pe; z++) {
        let ve = v[z],
          { object: fe, geometry: Se, group: Ee } = ve,
          Be = ve.material;
        (Be.allowOverride === !0 && B !== null && (Be = B),
          fe.layers.test(G.layers) && El(fe, L, G, Se, Be, Ee));
      }
    }
    function El(v, L, G, B, z, pe) {
      (v.onBeforeRender(N, L, G, B, z, pe),
        v.modelViewMatrix.multiplyMatrices(G.matrixWorldInverse, v.matrixWorld),
        v.normalMatrix.getNormalMatrix(v.modelViewMatrix),
        z.onBeforeRender(N, L, G, B, v, pe),
        z.transparent === !0 && z.side === fn && z.forceSinglePass === !1
          ? ((z.side = Dt),
            (z.needsUpdate = !0),
            N.renderBufferDirect(G, L, B, z, v, pe),
            (z.side = An),
            (z.needsUpdate = !0),
            N.renderBufferDirect(G, L, B, z, v, pe),
            (z.side = fn))
          : N.renderBufferDirect(G, L, B, z, v, pe),
        v.onAfterRender(N, L, G, B, z, pe));
    }
    function Fs(v, L, G) {
      L.isScene !== !0 && (L = le);
      let B = S.get(v),
        z = b.state.lights,
        pe = b.state.shadowsArray,
        ve = z.state.version,
        fe = oe.getParameters(
          v,
          z.state,
          pe,
          L,
          G,
          b.state.lightProbeGridArray,
        ),
        Se = oe.getProgramCacheKey(fe),
        Ee = B.programs;
      ((B.environment =
        v.isMeshStandardMaterial ||
        v.isMeshLambertMaterial ||
        v.isMeshPhongMaterial
          ? L.environment
          : null),
        (B.fog = L.fog));
      let Be =
        v.isMeshStandardMaterial ||
        (v.isMeshLambertMaterial && !v.envMap) ||
        (v.isMeshPhongMaterial && !v.envMap);
      ((B.envMap = F.get(v.envMap || B.environment, Be)),
        (B.envMapRotation =
          B.environment !== null && v.envMap === null
            ? L.environmentRotation
            : v.envMapRotation),
        Ee === void 0 &&
          (v.addEventListener("dispose", pt),
          (Ee = new Map()),
          (B.programs = Ee)));
      let Ge = Ee.get(Se);
      if (Ge !== void 0) {
        if (B.currentProgram === Ge && B.lightsStateVersion === ve)
          return (Al(v, fe), Ge);
      } else
        ((fe.uniforms = oe.getUniforms(v)),
          O !== null && v.isNodeMaterial && O.build(v, G, fe),
          v.onBeforeCompile(fe, N),
          (Ge = oe.acquireProgram(fe, Se)),
          Ee.set(Se, Ge),
          (B.uniforms = fe.uniforms));
      let Te = B.uniforms;
      return (
        ((!v.isShaderMaterial && !v.isRawShaderMaterial) ||
          v.clipping === !0) &&
          (Te.clippingPlanes = xe.uniform),
        Al(v, fe),
        (B.needsLights = Ch(v)),
        (B.lightsStateVersion = ve),
        B.needsLights &&
          ((Te.ambientLightColor.value = z.state.ambient),
          (Te.lightProbe.value = z.state.probe),
          (Te.directionalLights.value = z.state.directional),
          (Te.directionalLightShadows.value = z.state.directionalShadow),
          (Te.spotLights.value = z.state.spot),
          (Te.spotLightShadows.value = z.state.spotShadow),
          (Te.rectAreaLights.value = z.state.rectArea),
          (Te.ltc_1.value = z.state.rectAreaLTC1),
          (Te.ltc_2.value = z.state.rectAreaLTC2),
          (Te.pointLights.value = z.state.point),
          (Te.pointLightShadows.value = z.state.pointShadow),
          (Te.hemisphereLights.value = z.state.hemi),
          (Te.directionalShadowMatrix.value = z.state.directionalShadowMatrix),
          (Te.spotLightMatrix.value = z.state.spotLightMatrix),
          (Te.spotLightMap.value = z.state.spotLightMap),
          (Te.pointShadowMatrix.value = z.state.pointShadowMatrix)),
        (B.lightProbeGrid = b.state.lightProbeGridArray.length > 0),
        (B.currentProgram = Ge),
        (B.uniformsList = null),
        Ge
      );
    }
    function Tl(v) {
      if (v.uniformsList === null) {
        let L = v.currentProgram.getUniforms();
        v.uniformsList = Zi.seqWithValue(L.seq, v.uniforms);
      }
      return v.uniformsList;
    }
    function Al(v, L) {
      let G = S.get(v);
      ((G.outputColorSpace = L.outputColorSpace),
        (G.batching = L.batching),
        (G.batchingColor = L.batchingColor),
        (G.instancing = L.instancing),
        (G.instancingColor = L.instancingColor),
        (G.instancingMorph = L.instancingMorph),
        (G.skinning = L.skinning),
        (G.morphTargets = L.morphTargets),
        (G.morphNormals = L.morphNormals),
        (G.morphColors = L.morphColors),
        (G.morphTargetsCount = L.morphTargetsCount),
        (G.numClippingPlanes = L.numClippingPlanes),
        (G.numIntersection = L.numClipIntersection),
        (G.vertexAlphas = L.vertexAlphas),
        (G.vertexTangents = L.vertexTangents),
        (G.toneMapping = L.toneMapping));
    }
    function Th(v, L) {
      if (v.length === 0) return null;
      if (v.length === 1) return v[0].texture !== null ? v[0] : null;
      E.setFromMatrixPosition(L.matrixWorld);
      for (let G = 0, B = v.length; G < B; G++) {
        let z = v[G];
        if (z.texture !== null && z.boundingBox.containsPoint(E)) return z;
      }
      return null;
    }
    function Ah(v, L, G, B, z) {
      (L.isScene !== !0 && (L = le), _.resetTextureUnits());
      let pe = L.fog,
        ve =
          B.isMeshStandardMaterial ||
          B.isMeshLambertMaterial ||
          B.isMeshPhongMaterial
            ? L.environment
            : null,
        fe =
          D === null
            ? N.outputColorSpace
            : D.isXRRenderTarget === !0
              ? D.texture.colorSpace
              : Xe.workingColorSpace,
        Se =
          B.isMeshStandardMaterial ||
          (B.isMeshLambertMaterial && !B.envMap) ||
          (B.isMeshPhongMaterial && !B.envMap),
        Ee = F.get(B.envMap || ve, Se),
        Be =
          B.vertexColors === !0 &&
          !!G.attributes.color &&
          G.attributes.color.itemSize === 4,
        Ge = !!G.attributes.tangent && (!!B.normalMap || B.anisotropy > 0),
        Te = !!G.morphAttributes.position,
        tt = !!G.morphAttributes.normal,
        mt = !!G.morphAttributes.color,
        ft = Qt;
      B.toneMapped &&
        (D === null || D.isXRRenderTarget === !0) &&
        (ft = N.toneMapping);
      let st =
          G.morphAttributes.position ||
          G.morphAttributes.normal ||
          G.morphAttributes.color,
        wt = st !== void 0 ? st.length : 0,
        _e = S.get(B),
        Ot = b.state.lights;
      if (lt === !0 && (He === !0 || v !== k)) {
        let at = v === k && B.id === V;
        xe.setState(B, v, at);
      }
      let Ze = !1;
      B.version === _e.__version
        ? ((_e.needsLights && _e.lightsStateVersion !== Ot.state.version) ||
            _e.outputColorSpace !== fe ||
            (z.isBatchedMesh && _e.batching === !1) ||
            (!z.isBatchedMesh && _e.batching === !0) ||
            (z.isBatchedMesh &&
              _e.batchingColor === !0 &&
              z.colorTexture === null) ||
            (z.isBatchedMesh &&
              _e.batchingColor === !1 &&
              z.colorTexture !== null) ||
            (z.isInstancedMesh && _e.instancing === !1) ||
            (!z.isInstancedMesh && _e.instancing === !0) ||
            (z.isSkinnedMesh && _e.skinning === !1) ||
            (!z.isSkinnedMesh && _e.skinning === !0) ||
            (z.isInstancedMesh &&
              _e.instancingColor === !0 &&
              z.instanceColor === null) ||
            (z.isInstancedMesh &&
              _e.instancingColor === !1 &&
              z.instanceColor !== null) ||
            (z.isInstancedMesh &&
              _e.instancingMorph === !0 &&
              z.morphTexture === null) ||
            (z.isInstancedMesh &&
              _e.instancingMorph === !1 &&
              z.morphTexture !== null) ||
            _e.envMap !== Ee ||
            (B.fog === !0 && _e.fog !== pe) ||
            (_e.numClippingPlanes !== void 0 &&
              (_e.numClippingPlanes !== xe.numPlanes ||
                _e.numIntersection !== xe.numIntersection)) ||
            _e.vertexAlphas !== Be ||
            _e.vertexTangents !== Ge ||
            _e.morphTargets !== Te ||
            _e.morphNormals !== tt ||
            _e.morphColors !== mt ||
            _e.toneMapping !== ft ||
            _e.morphTargetsCount !== wt ||
            !!_e.lightProbeGrid != b.state.lightProbeGridArray.length > 0) &&
          (Ze = !0)
        : ((Ze = !0), (_e.__version = B.version));
      let Wt = _e.currentProgram;
      Ze === !0 &&
        ((Wt = Fs(B, L, z)),
        O && B.isNodeMaterial && O.onUpdateProgram(B, Wt, _e));
      let rn = !1,
        Pn = !1,
        mi = !1,
        rt = Wt.getUniforms(),
        gt = _e.uniforms;
      if (
        (he.useProgram(Wt.program) && ((rn = !0), (Pn = !0), (mi = !0)),
        B.id !== V && ((V = B.id), (Pn = !0)),
        _e.needsLights)
      ) {
        let at = Th(b.state.lightProbeGridArray, z);
        _e.lightProbeGrid !== at && ((_e.lightProbeGrid = at), (Pn = !0));
      }
      if (rn || k !== v) {
        (he.buffers.depth.getReversed() &&
          v.reversedDepth !== !0 &&
          ((v._reversedDepth = !0), v.updateProjectionMatrix()),
          rt.setValue(P, "projectionMatrix", v.projectionMatrix),
          rt.setValue(P, "viewMatrix", v.matrixWorldInverse));
        let Dn = rt.map.cameraPosition;
        (Dn !== void 0 &&
          Dn.setValue(P, nt.setFromMatrixPosition(v.matrixWorld)),
          je.logarithmicDepthBuffer &&
            rt.setValue(
              P,
              "logDepthBufFC",
              2 / (Math.log(v.far + 1) / Math.LN2),
            ),
          (B.isMeshPhongMaterial ||
            B.isMeshToonMaterial ||
            B.isMeshLambertMaterial ||
            B.isMeshBasicMaterial ||
            B.isMeshStandardMaterial ||
            B.isShaderMaterial) &&
            rt.setValue(P, "isOrthographic", v.isOrthographicCamera === !0),
          k !== v && ((k = v), (Pn = !0), (mi = !0)));
      }
      if (
        (_e.needsLights &&
          (Ot.state.directionalShadowMap.length > 0 &&
            rt.setValue(
              P,
              "directionalShadowMap",
              Ot.state.directionalShadowMap,
              _,
            ),
          Ot.state.spotShadowMap.length > 0 &&
            rt.setValue(P, "spotShadowMap", Ot.state.spotShadowMap, _),
          Ot.state.pointShadowMap.length > 0 &&
            rt.setValue(P, "pointShadowMap", Ot.state.pointShadowMap, _)),
        z.isSkinnedMesh)
      ) {
        (rt.setOptional(P, z, "bindMatrix"),
          rt.setOptional(P, z, "bindMatrixInverse"));
        let at = z.skeleton;
        at &&
          (at.boneTexture === null && at.computeBoneTexture(),
          rt.setValue(P, "boneTexture", at.boneTexture, _));
      }
      z.isBatchedMesh &&
        (rt.setOptional(P, z, "batchingTexture"),
        rt.setValue(P, "batchingTexture", z._matricesTexture, _),
        rt.setOptional(P, z, "batchingIdTexture"),
        rt.setValue(P, "batchingIdTexture", z._indirectTexture, _),
        rt.setOptional(P, z, "batchingColorTexture"),
        z._colorsTexture !== null &&
          rt.setValue(P, "batchingColorTexture", z._colorsTexture, _));
      let Ln = G.morphAttributes;
      if (
        ((Ln.position !== void 0 ||
          Ln.normal !== void 0 ||
          Ln.color !== void 0) &&
          Ue.update(z, G, Wt),
        (Pn || _e.receiveShadow !== z.receiveShadow) &&
          ((_e.receiveShadow = z.receiveShadow),
          rt.setValue(P, "receiveShadow", z.receiveShadow)),
        (B.isMeshStandardMaterial ||
          B.isMeshLambertMaterial ||
          B.isMeshPhongMaterial) &&
          B.envMap === null &&
          L.environment !== null &&
          (gt.envMapIntensity.value = L.environmentIntensity),
        gt.dfgLUT !== void 0 && (gt.dfgLUT.value = fg()),
        Pn)
      ) {
        if (
          (rt.setValue(P, "toneMappingExposure", N.toneMappingExposure),
          _e.needsLights && wh(gt, mi),
          pe && B.fog === !0 && q.refreshFogUniforms(gt, pe),
          q.refreshMaterialUniforms(
            gt,
            B,
            De,
            $e,
            b.state.transmissionRenderTarget[v.id],
          ),
          _e.needsLights && _e.lightProbeGrid)
        ) {
          let at = _e.lightProbeGrid;
          ((gt.probesSH.value = at.texture),
            gt.probesMin.value.copy(at.boundingBox.min),
            gt.probesMax.value.copy(at.boundingBox.max),
            gt.probesResolution.value.copy(at.resolution));
        }
        Zi.upload(P, Tl(_e), gt, _);
      }
      if (
        (B.isShaderMaterial &&
          B.uniformsNeedUpdate === !0 &&
          (Zi.upload(P, Tl(_e), gt, _), (B.uniformsNeedUpdate = !1)),
        B.isSpriteMaterial && rt.setValue(P, "center", z.center),
        rt.setValue(P, "modelViewMatrix", z.modelViewMatrix),
        rt.setValue(P, "normalMatrix", z.normalMatrix),
        rt.setValue(P, "modelMatrix", z.matrixWorld),
        B.uniformsGroups !== void 0)
      ) {
        let at = B.uniformsGroups;
        for (let Dn = 0, gi = at.length; Dn < gi; Dn++) {
          let wl = at[Dn];
          (Y.update(wl, Wt), Y.bind(wl, Wt));
        }
      }
      return Wt;
    }
    function wh(v, L) {
      ((v.ambientLightColor.needsUpdate = L),
        (v.lightProbe.needsUpdate = L),
        (v.directionalLights.needsUpdate = L),
        (v.directionalLightShadows.needsUpdate = L),
        (v.pointLights.needsUpdate = L),
        (v.pointLightShadows.needsUpdate = L),
        (v.spotLights.needsUpdate = L),
        (v.spotLightShadows.needsUpdate = L),
        (v.rectAreaLights.needsUpdate = L),
        (v.hemisphereLights.needsUpdate = L));
    }
    function Ch(v) {
      return (
        v.isMeshLambertMaterial ||
        v.isMeshToonMaterial ||
        v.isMeshPhongMaterial ||
        v.isMeshStandardMaterial ||
        v.isShadowMaterial ||
        (v.isShaderMaterial && v.lights === !0)
      );
    }
    ((this.getActiveCubeFace = function () {
      return X;
    }),
      (this.getActiveMipmapLevel = function () {
        return W;
      }),
      (this.getRenderTarget = function () {
        return D;
      }),
      (this.setRenderTargetTextures = function (v, L, G) {
        let B = S.get(v);
        ((B.__autoAllocateDepthBuffer = v.resolveDepthBuffer === !1),
          B.__autoAllocateDepthBuffer === !1 && (B.__useRenderToTexture = !1),
          (S.get(v.texture).__webglTexture = L),
          (S.get(v.depthTexture).__webglTexture = B.__autoAllocateDepthBuffer
            ? void 0
            : G),
          (B.__hasExternalTextures = !0));
      }),
      (this.setRenderTargetFramebuffer = function (v, L) {
        let G = S.get(v);
        ((G.__webglFramebuffer = L),
          (G.__useDefaultFramebuffer = L === void 0));
      }));
    let Rh = P.createFramebuffer();
    ((this.setRenderTarget = function (v, L = 0, G = 0) {
      ((D = v), (X = L), (W = G));
      let B = null,
        z = !1,
        pe = !1;
      if (v) {
        let fe = S.get(v);
        if (fe.__useDefaultFramebuffer !== void 0) {
          (he.bindFramebuffer(P.FRAMEBUFFER, fe.__webglFramebuffer),
            j.copy(v.viewport),
            ee.copy(v.scissor),
            (ce = v.scissorTest),
            he.viewport(j),
            he.scissor(ee),
            he.setScissorTest(ce),
            (V = -1));
          return;
        } else if (fe.__webglFramebuffer === void 0) _.setupRenderTarget(v);
        else if (fe.__hasExternalTextures)
          _.rebindTextures(
            v,
            S.get(v.texture).__webglTexture,
            S.get(v.depthTexture).__webglTexture,
          );
        else if (v.depthBuffer) {
          let Be = v.depthTexture;
          if (fe.__boundDepthTexture !== Be) {
            if (
              Be !== null &&
              S.has(Be) &&
              (v.width !== Be.image.width || v.height !== Be.image.height)
            )
              throw new Error(
                "WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.",
              );
            _.setupDepthRenderbuffer(v);
          }
        }
        let Se = v.texture;
        (Se.isData3DTexture ||
          Se.isDataArrayTexture ||
          Se.isCompressedArrayTexture) &&
          (pe = !0);
        let Ee = S.get(v).__webglFramebuffer;
        (v.isWebGLCubeRenderTarget
          ? (Array.isArray(Ee[L]) ? (B = Ee[L][G]) : (B = Ee[L]), (z = !0))
          : v.samples > 0 && _.useMultisampledRTT(v) === !1
            ? (B = S.get(v).__webglMultisampledFramebuffer)
            : Array.isArray(Ee)
              ? (B = Ee[G])
              : (B = Ee),
          j.copy(v.viewport),
          ee.copy(v.scissor),
          (ce = v.scissorTest));
      } else
        (j.copy(te).multiplyScalar(De).floor(),
          ee.copy(Ae).multiplyScalar(De).floor(),
          (ce = Le));
      if (
        (G !== 0 && (B = Rh),
        he.bindFramebuffer(P.FRAMEBUFFER, B) && he.drawBuffers(v, B),
        he.viewport(j),
        he.scissor(ee),
        he.setScissorTest(ce),
        z)
      ) {
        let fe = S.get(v.texture);
        P.framebufferTexture2D(
          P.FRAMEBUFFER,
          P.COLOR_ATTACHMENT0,
          P.TEXTURE_CUBE_MAP_POSITIVE_X + L,
          fe.__webglTexture,
          G,
        );
      } else if (pe) {
        let fe = L;
        for (let Se = 0; Se < v.textures.length; Se++) {
          let Ee = S.get(v.textures[Se]);
          P.framebufferTextureLayer(
            P.FRAMEBUFFER,
            P.COLOR_ATTACHMENT0 + Se,
            Ee.__webglTexture,
            G,
            fe,
          );
        }
      } else if (v !== null && G !== 0) {
        let fe = S.get(v.texture);
        P.framebufferTexture2D(
          P.FRAMEBUFFER,
          P.COLOR_ATTACHMENT0,
          P.TEXTURE_2D,
          fe.__webglTexture,
          G,
        );
      }
      V = -1;
    }),
      (this.readRenderTargetPixels = function (v, L, G, B, z, pe, ve, fe = 0) {
        if (!(v && v.isWebGLRenderTarget)) {
          Ie(
            "WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.",
          );
          return;
        }
        let Se = S.get(v).__webglFramebuffer;
        if ((v.isWebGLCubeRenderTarget && ve !== void 0 && (Se = Se[ve]), Se)) {
          he.bindFramebuffer(P.FRAMEBUFFER, Se);
          try {
            let Ee = v.textures[fe],
              Be = Ee.format,
              Ge = Ee.type;
            if (
              (v.textures.length > 1 && P.readBuffer(P.COLOR_ATTACHMENT0 + fe),
              !je.textureFormatReadable(Be))
            ) {
              Ie(
                "WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.",
              );
              return;
            }
            if (!je.textureTypeReadable(Ge)) {
              Ie(
                "WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.",
              );
              return;
            }
            L >= 0 &&
              L <= v.width - B &&
              G >= 0 &&
              G <= v.height - z &&
              P.readPixels(L, G, B, z, I.convert(Be), I.convert(Ge), pe);
          } finally {
            let Ee = D !== null ? S.get(D).__webglFramebuffer : null;
            he.bindFramebuffer(P.FRAMEBUFFER, Ee);
          }
        }
      }),
      (this.readRenderTargetPixelsAsync = async function (
        v,
        L,
        G,
        B,
        z,
        pe,
        ve,
        fe = 0,
      ) {
        if (!(v && v.isWebGLRenderTarget))
          throw new Error(
            "THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.",
          );
        let Se = S.get(v).__webglFramebuffer;
        if ((v.isWebGLCubeRenderTarget && ve !== void 0 && (Se = Se[ve]), Se))
          if (L >= 0 && L <= v.width - B && G >= 0 && G <= v.height - z) {
            he.bindFramebuffer(P.FRAMEBUFFER, Se);
            let Ee = v.textures[fe],
              Be = Ee.format,
              Ge = Ee.type;
            if (
              (v.textures.length > 1 && P.readBuffer(P.COLOR_ATTACHMENT0 + fe),
              !je.textureFormatReadable(Be))
            )
              throw new Error(
                "THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.",
              );
            if (!je.textureTypeReadable(Ge))
              throw new Error(
                "THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.",
              );
            let Te = P.createBuffer();
            (P.bindBuffer(P.PIXEL_PACK_BUFFER, Te),
              P.bufferData(P.PIXEL_PACK_BUFFER, pe.byteLength, P.STREAM_READ),
              P.readPixels(L, G, B, z, I.convert(Be), I.convert(Ge), 0));
            let tt = D !== null ? S.get(D).__webglFramebuffer : null;
            he.bindFramebuffer(P.FRAMEBUFFER, tt);
            let mt = P.fenceSync(P.SYNC_GPU_COMMANDS_COMPLETE, 0);
            return (
              P.flush(),
              await Oc(P, mt, 4),
              P.bindBuffer(P.PIXEL_PACK_BUFFER, Te),
              P.getBufferSubData(P.PIXEL_PACK_BUFFER, 0, pe),
              P.deleteBuffer(Te),
              P.deleteSync(mt),
              pe
            );
          } else
            throw new Error(
              "THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.",
            );
      }),
      (this.copyFramebufferToTexture = function (v, L = null, G = 0) {
        let B = Math.pow(2, -G),
          z = Math.floor(v.image.width * B),
          pe = Math.floor(v.image.height * B),
          ve = L !== null ? L.x : 0,
          fe = L !== null ? L.y : 0;
        (_.setTexture2D(v, 0),
          P.copyTexSubImage2D(P.TEXTURE_2D, G, 0, 0, ve, fe, z, pe),
          he.unbindTexture());
      }));
    let Ih = P.createFramebuffer(),
      Ph = P.createFramebuffer();
    ((this.copyTextureToTexture = function (
      v,
      L,
      G = null,
      B = null,
      z = 0,
      pe = 0,
    ) {
      let ve,
        fe,
        Se,
        Ee,
        Be,
        Ge,
        Te,
        tt,
        mt,
        ft = v.isCompressedTexture ? v.mipmaps[pe] : v.image;
      if (G !== null)
        ((ve = G.max.x - G.min.x),
          (fe = G.max.y - G.min.y),
          (Se = G.isBox3 ? G.max.z - G.min.z : 1),
          (Ee = G.min.x),
          (Be = G.min.y),
          (Ge = G.isBox3 ? G.min.z : 0));
      else {
        let gt = Math.pow(2, -z);
        ((ve = Math.floor(ft.width * gt)),
          (fe = Math.floor(ft.height * gt)),
          v.isDataArrayTexture
            ? (Se = ft.depth)
            : v.isData3DTexture
              ? (Se = Math.floor(ft.depth * gt))
              : (Se = 1),
          (Ee = 0),
          (Be = 0),
          (Ge = 0));
      }
      B !== null
        ? ((Te = B.x), (tt = B.y), (mt = B.z))
        : ((Te = 0), (tt = 0), (mt = 0));
      let st = I.convert(L.format),
        wt = I.convert(L.type),
        _e;
      (L.isData3DTexture
        ? (_.setTexture3D(L, 0), (_e = P.TEXTURE_3D))
        : L.isDataArrayTexture || L.isCompressedArrayTexture
          ? (_.setTexture2DArray(L, 0), (_e = P.TEXTURE_2D_ARRAY))
          : (_.setTexture2D(L, 0), (_e = P.TEXTURE_2D)),
        he.activeTexture(P.TEXTURE0),
        he.pixelStorei(P.UNPACK_FLIP_Y_WEBGL, L.flipY),
        he.pixelStorei(P.UNPACK_PREMULTIPLY_ALPHA_WEBGL, L.premultiplyAlpha),
        he.pixelStorei(P.UNPACK_ALIGNMENT, L.unpackAlignment));
      let Ot = he.getParameter(P.UNPACK_ROW_LENGTH),
        Ze = he.getParameter(P.UNPACK_IMAGE_HEIGHT),
        Wt = he.getParameter(P.UNPACK_SKIP_PIXELS),
        rn = he.getParameter(P.UNPACK_SKIP_ROWS),
        Pn = he.getParameter(P.UNPACK_SKIP_IMAGES);
      (he.pixelStorei(P.UNPACK_ROW_LENGTH, ft.width),
        he.pixelStorei(P.UNPACK_IMAGE_HEIGHT, ft.height),
        he.pixelStorei(P.UNPACK_SKIP_PIXELS, Ee),
        he.pixelStorei(P.UNPACK_SKIP_ROWS, Be),
        he.pixelStorei(P.UNPACK_SKIP_IMAGES, Ge));
      let mi = v.isDataArrayTexture || v.isData3DTexture,
        rt = L.isDataArrayTexture || L.isData3DTexture;
      if (v.isDepthTexture) {
        let gt = S.get(v),
          Ln = S.get(L),
          at = S.get(gt.__renderTarget),
          Dn = S.get(Ln.__renderTarget);
        (he.bindFramebuffer(P.READ_FRAMEBUFFER, at.__webglFramebuffer),
          he.bindFramebuffer(P.DRAW_FRAMEBUFFER, Dn.__webglFramebuffer));
        for (let gi = 0; gi < Se; gi++)
          (mi &&
            (P.framebufferTextureLayer(
              P.READ_FRAMEBUFFER,
              P.COLOR_ATTACHMENT0,
              S.get(v).__webglTexture,
              z,
              Ge + gi,
            ),
            P.framebufferTextureLayer(
              P.DRAW_FRAMEBUFFER,
              P.COLOR_ATTACHMENT0,
              S.get(L).__webglTexture,
              pe,
              mt + gi,
            )),
            P.blitFramebuffer(
              Ee,
              Be,
              ve,
              fe,
              Te,
              tt,
              ve,
              fe,
              P.DEPTH_BUFFER_BIT,
              P.NEAREST,
            ));
        (he.bindFramebuffer(P.READ_FRAMEBUFFER, null),
          he.bindFramebuffer(P.DRAW_FRAMEBUFFER, null));
      } else if (z !== 0 || v.isRenderTargetTexture || S.has(v)) {
        let gt = S.get(v),
          Ln = S.get(L);
        (he.bindFramebuffer(P.READ_FRAMEBUFFER, Ih),
          he.bindFramebuffer(P.DRAW_FRAMEBUFFER, Ph));
        for (let at = 0; at < Se; at++)
          (mi
            ? P.framebufferTextureLayer(
                P.READ_FRAMEBUFFER,
                P.COLOR_ATTACHMENT0,
                gt.__webglTexture,
                z,
                Ge + at,
              )
            : P.framebufferTexture2D(
                P.READ_FRAMEBUFFER,
                P.COLOR_ATTACHMENT0,
                P.TEXTURE_2D,
                gt.__webglTexture,
                z,
              ),
            rt
              ? P.framebufferTextureLayer(
                  P.DRAW_FRAMEBUFFER,
                  P.COLOR_ATTACHMENT0,
                  Ln.__webglTexture,
                  pe,
                  mt + at,
                )
              : P.framebufferTexture2D(
                  P.DRAW_FRAMEBUFFER,
                  P.COLOR_ATTACHMENT0,
                  P.TEXTURE_2D,
                  Ln.__webglTexture,
                  pe,
                ),
            z !== 0
              ? P.blitFramebuffer(
                  Ee,
                  Be,
                  ve,
                  fe,
                  Te,
                  tt,
                  ve,
                  fe,
                  P.COLOR_BUFFER_BIT,
                  P.NEAREST,
                )
              : rt
                ? P.copyTexSubImage3D(_e, pe, Te, tt, mt + at, Ee, Be, ve, fe)
                : P.copyTexSubImage2D(_e, pe, Te, tt, Ee, Be, ve, fe));
        (he.bindFramebuffer(P.READ_FRAMEBUFFER, null),
          he.bindFramebuffer(P.DRAW_FRAMEBUFFER, null));
      } else
        rt
          ? v.isDataTexture || v.isData3DTexture
            ? P.texSubImage3D(_e, pe, Te, tt, mt, ve, fe, Se, st, wt, ft.data)
            : L.isCompressedArrayTexture
              ? P.compressedTexSubImage3D(
                  _e,
                  pe,
                  Te,
                  tt,
                  mt,
                  ve,
                  fe,
                  Se,
                  st,
                  ft.data,
                )
              : P.texSubImage3D(_e, pe, Te, tt, mt, ve, fe, Se, st, wt, ft)
          : v.isDataTexture
            ? P.texSubImage2D(P.TEXTURE_2D, pe, Te, tt, ve, fe, st, wt, ft.data)
            : v.isCompressedTexture
              ? P.compressedTexSubImage2D(
                  P.TEXTURE_2D,
                  pe,
                  Te,
                  tt,
                  ft.width,
                  ft.height,
                  st,
                  ft.data,
                )
              : P.texSubImage2D(P.TEXTURE_2D, pe, Te, tt, ve, fe, st, wt, ft);
      (he.pixelStorei(P.UNPACK_ROW_LENGTH, Ot),
        he.pixelStorei(P.UNPACK_IMAGE_HEIGHT, Ze),
        he.pixelStorei(P.UNPACK_SKIP_PIXELS, Wt),
        he.pixelStorei(P.UNPACK_SKIP_ROWS, rn),
        he.pixelStorei(P.UNPACK_SKIP_IMAGES, Pn),
        pe === 0 && L.generateMipmaps && P.generateMipmap(_e),
        he.unbindTexture());
    }),
      (this.initRenderTarget = function (v) {
        S.get(v).__webglFramebuffer === void 0 && _.setupRenderTarget(v);
      }),
      (this.initTexture = function (v) {
        (v.isCubeTexture
          ? _.setTextureCube(v, 0)
          : v.isData3DTexture
            ? _.setTexture3D(v, 0)
            : v.isDataArrayTexture || v.isCompressedArrayTexture
              ? _.setTexture2DArray(v, 0)
              : _.setTexture2D(v, 0),
          he.unbindTexture());
      }),
      (this.resetState = function () {
        ((X = 0), (W = 0), (D = null), he.reset(), se.reset());
      }),
      typeof __THREE_DEVTOOLS__ < "u" &&
        __THREE_DEVTOOLS__.dispatchEvent(
          new CustomEvent("observe", { detail: this }),
        ));
  }
  get coordinateSystem() {
    return jt;
  }
  get outputColorSpace() {
    return this._outputColorSpace;
  }
  set outputColorSpace(e) {
    this._outputColorSpace = e;
    let t = this.getContext();
    ((t.drawingBufferColorSpace = Xe._getDrawingBufferColorSpace(e)),
      (t.unpackColorSpace = Xe._getUnpackColorSpace()));
  }
};
var mg = /^[og]\s*(.+)?/,
  gg = /^mtllib /,
  _g = /^usemtl /,
  xg = /^usemap /,
  _h = /\s+/,
  xh = new U(),
  ml = new U(),
  vh = new U(),
  yh = new U(),
  Zt = new U(),
  za = new Pe();
function vg() {
  let i = {
    objects: [],
    object: {},
    vertices: [],
    normals: [],
    colors: [],
    uvs: [],
    materials: {},
    materialLibraries: [],
    startObject: function (e, t) {
      if (this.object && this.object.fromDeclaration === !1) {
        ((this.object.name = e), (this.object.fromDeclaration = t !== !1));
        return;
      }
      let n =
        this.object && typeof this.object.currentMaterial == "function"
          ? this.object.currentMaterial()
          : void 0;
      if (
        (this.object &&
          typeof this.object._finalize == "function" &&
          this.object._finalize(!0),
        (this.object = {
          name: e || "",
          fromDeclaration: t !== !1,
          geometry: {
            vertices: [],
            normals: [],
            colors: [],
            uvs: [],
            hasUVIndices: !1,
          },
          materials: [],
          smooth: !0,
          startMaterial: function (s, r) {
            let a = this._finalize(!1);
            a &&
              (a.inherited || a.groupCount <= 0) &&
              this.materials.splice(a.index, 1);
            let o = {
              index: this.materials.length,
              name: s || "",
              mtllib: Array.isArray(r) && r.length > 0 ? r[r.length - 1] : "",
              smooth: a !== void 0 ? a.smooth : this.smooth,
              groupStart: a !== void 0 ? a.groupEnd : 0,
              groupEnd: -1,
              groupCount: -1,
              inherited: !1,
              clone: function (c) {
                let l = {
                  index: typeof c == "number" ? c : this.index,
                  name: this.name,
                  mtllib: this.mtllib,
                  smooth: this.smooth,
                  groupStart: 0,
                  groupEnd: -1,
                  groupCount: -1,
                  inherited: !1,
                };
                return ((l.clone = this.clone.bind(l)), l);
              },
            };
            return (this.materials.push(o), o);
          },
          currentMaterial: function () {
            if (this.materials.length > 0)
              return this.materials[this.materials.length - 1];
          },
          _finalize: function (s) {
            let r = this.currentMaterial();
            if (
              (r &&
                r.groupEnd === -1 &&
                ((r.groupEnd = this.geometry.vertices.length / 3),
                (r.groupCount = r.groupEnd - r.groupStart),
                (r.inherited = !1)),
              s && this.materials.length > 1)
            )
              for (let a = this.materials.length - 1; a >= 0; a--)
                this.materials[a].groupCount <= 0 &&
                  this.materials.splice(a, 1);
            return (
              s &&
                this.materials.length === 0 &&
                this.materials.push({ name: "", smooth: this.smooth }),
              r
            );
          },
        }),
        n && n.name && typeof n.clone == "function")
      ) {
        let s = n.clone(0);
        ((s.inherited = !0), this.object.materials.push(s));
      }
      this.objects.push(this.object);
    },
    finalize: function () {
      this.object &&
        typeof this.object._finalize == "function" &&
        this.object._finalize(!0);
    },
    parseVertexIndex: function (e, t) {
      let n = parseInt(e, 10);
      return (n >= 0 ? n - 1 : n + t / 3) * 3;
    },
    parseNormalIndex: function (e, t) {
      let n = parseInt(e, 10);
      return (n >= 0 ? n - 1 : n + t / 3) * 3;
    },
    parseUVIndex: function (e, t) {
      let n = parseInt(e, 10);
      return (n >= 0 ? n - 1 : n + t / 2) * 2;
    },
    addVertex: function (e, t, n) {
      let s = this.vertices,
        r = this.object.geometry.vertices;
      (r.push(s[e + 0], s[e + 1], s[e + 2]),
        r.push(s[t + 0], s[t + 1], s[t + 2]),
        r.push(s[n + 0], s[n + 1], s[n + 2]));
    },
    addVertexPoint: function (e) {
      let t = this.vertices;
      this.object.geometry.vertices.push(t[e + 0], t[e + 1], t[e + 2]);
    },
    addVertexLine: function (e) {
      let t = this.vertices;
      this.object.geometry.vertices.push(t[e + 0], t[e + 1], t[e + 2]);
    },
    addNormal: function (e, t, n) {
      let s = this.normals,
        r = this.object.geometry.normals;
      (r.push(s[e + 0], s[e + 1], s[e + 2]),
        r.push(s[t + 0], s[t + 1], s[t + 2]),
        r.push(s[n + 0], s[n + 1], s[n + 2]));
    },
    addFaceNormal: function (e, t, n) {
      let s = this.vertices,
        r = this.object.geometry.normals;
      (xh.fromArray(s, e),
        ml.fromArray(s, t),
        vh.fromArray(s, n),
        Zt.subVectors(vh, ml),
        yh.subVectors(xh, ml),
        Zt.cross(yh),
        Zt.normalize(),
        r.push(Zt.x, Zt.y, Zt.z),
        r.push(Zt.x, Zt.y, Zt.z),
        r.push(Zt.x, Zt.y, Zt.z));
    },
    addColor: function (e, t, n) {
      let s = this.colors,
        r = this.object.geometry.colors;
      (s[e] !== void 0 && r.push(s[e + 0], s[e + 1], s[e + 2]),
        s[t] !== void 0 && r.push(s[t + 0], s[t + 1], s[t + 2]),
        s[n] !== void 0 && r.push(s[n + 0], s[n + 1], s[n + 2]));
    },
    addUV: function (e, t, n) {
      let s = this.uvs,
        r = this.object.geometry.uvs;
      (r.push(s[e + 0], s[e + 1]),
        r.push(s[t + 0], s[t + 1]),
        r.push(s[n + 0], s[n + 1]));
    },
    addDefaultUV: function () {
      let e = this.object.geometry.uvs;
      (e.push(0, 0), e.push(0, 0), e.push(0, 0));
    },
    addUVLine: function (e) {
      let t = this.uvs;
      this.object.geometry.uvs.push(t[e + 0], t[e + 1]);
    },
    addFace: function (e, t, n, s, r, a, o, c, l) {
      let u = this.vertices.length,
        d = this.parseVertexIndex(e, u),
        h = this.parseVertexIndex(t, u),
        p = this.parseVertexIndex(n, u);
      if (
        (this.addVertex(d, h, p),
        this.addColor(d, h, p),
        o !== void 0 && o !== "")
      ) {
        let g = this.normals.length;
        ((d = this.parseNormalIndex(o, g)),
          (h = this.parseNormalIndex(c, g)),
          (p = this.parseNormalIndex(l, g)),
          this.addNormal(d, h, p));
      } else this.addFaceNormal(d, h, p);
      if (s !== void 0 && s !== "") {
        let g = this.uvs.length;
        ((d = this.parseUVIndex(s, g)),
          (h = this.parseUVIndex(r, g)),
          (p = this.parseUVIndex(a, g)),
          this.addUV(d, h, p),
          (this.object.geometry.hasUVIndices = !0));
      } else this.addDefaultUV();
    },
    addPointGeometry: function (e) {
      this.object.geometry.type = "Points";
      let t = this.vertices.length;
      for (let n = 0, s = e.length; n < s; n++) {
        let r = this.parseVertexIndex(e[n], t);
        (this.addVertexPoint(r), this.addColor(r));
      }
    },
    addLineGeometry: function (e, t) {
      this.object.geometry.type = "Line";
      let n = this.vertices.length,
        s = this.uvs.length;
      for (let r = 0, a = e.length; r < a; r++)
        this.addVertexLine(this.parseVertexIndex(e[r], n));
      for (let r = 0, a = t.length; r < a; r++)
        this.addUVLine(this.parseUVIndex(t[r], s));
    },
  };
  return (i.startObject("", !1), i);
}
var Va = class extends ui {
  constructor(e) {
    (super(e), (this.materials = null));
  }
  load(e, t, n, s) {
    let r = this,
      a = new gs(this.manager);
    (a.setPath(this.path),
      a.setRequestHeader(this.requestHeader),
      a.setWithCredentials(this.withCredentials),
      a.load(
        e,
        function (o) {
          try {
            t(r.parse(o));
          } catch (c) {
            (s ? s(c) : console.error(c), r.manager.itemError(e));
          }
        },
        n,
        s,
      ));
  }
  setMaterials(e) {
    return ((this.materials = e), this);
  }
  parse(e) {
    let t = new vg();
    (e.indexOf(`\r
`) !== -1 &&
      (e = e.replace(
        /\r\n/g,
        `
`,
      )),
      e.indexOf(`\\
`) !== -1 && (e = e.replace(/\\\n/g, "")));
    let n = e.split(`
`),
      s = [];
    for (let o = 0, c = n.length; o < c; o++) {
      let l = n[o].trimStart();
      if (l.length === 0) continue;
      let u = l.charAt(0);
      if (u !== "#")
        if (u === "v") {
          let d = l.split(_h);
          switch (d[0]) {
            case "v":
              (t.vertices.push(
                parseFloat(d[1]),
                parseFloat(d[2]),
                parseFloat(d[3]),
              ),
                d.length >= 7
                  ? (za.setRGB(
                      parseFloat(d[4]),
                      parseFloat(d[5]),
                      parseFloat(d[6]),
                      Et,
                    ),
                    t.colors.push(za.r, za.g, za.b))
                  : t.colors.push(void 0, void 0, void 0));
              break;
            case "vn":
              t.normals.push(
                parseFloat(d[1]),
                parseFloat(d[2]),
                parseFloat(d[3]),
              );
              break;
            case "vt":
              t.uvs.push(parseFloat(d[1]), parseFloat(d[2]));
              break;
          }
        } else if (u === "f") {
          let h = l.slice(1).trim().split(_h),
            p = [];
          for (let y = 0, m = h.length; y < m; y++) {
            let f = h[y];
            if (f.length > 0) {
              let M = f.split("/");
              p.push(M);
            }
          }
          let g = p[0];
          for (let y = 1, m = p.length - 1; y < m; y++) {
            let f = p[y],
              M = p[y + 1];
            t.addFace(g[0], f[0], M[0], g[1], f[1], M[1], g[2], f[2], M[2]);
          }
        } else if (u === "l") {
          let d = l.substring(1).trim().split(" "),
            h = [],
            p = [];
          if (l.indexOf("/") === -1) h = d;
          else
            for (let g = 0, y = d.length; g < y; g++) {
              let m = d[g].split("/");
              (m[0] !== "" && h.push(m[0]), m[1] !== "" && p.push(m[1]));
            }
          t.addLineGeometry(h, p);
        } else if (u === "p") {
          let h = l.slice(1).trim().split(" ");
          t.addPointGeometry(h);
        } else if ((s = mg.exec(l)) !== null) {
          let d = (" " + s[0].slice(1).trim()).slice(1);
          t.startObject(d);
        } else if (_g.test(l))
          t.object.startMaterial(l.substring(7).trim(), t.materialLibraries);
        else if (gg.test(l)) t.materialLibraries.push(l.substring(7).trim());
        else if (xg.test(l))
          console.warn(
            'THREE.OBJLoader: Rendering identifier "usemap" not supported. Textures must be defined in MTL files.',
          );
        else if (u === "s") {
          if (((s = l.split(" ")), s.length > 1)) {
            let h = s[1].trim().toLowerCase();
            t.object.smooth = h !== "0" && h !== "off";
          } else t.object.smooth = !0;
          let d = t.object.currentMaterial();
          d && (d.smooth = t.object.smooth);
        } else {
          if (l === "\0") continue;
          console.warn('THREE.OBJLoader: Unexpected line: "' + l + '"');
        }
    }
    t.finalize();
    let r = new qt();
    if (
      ((r.materialLibraries = [].concat(t.materialLibraries)),
      !(
        t.objects.length === 1 && t.objects[0].geometry.vertices.length === 0
      ) === !0)
    )
      for (let o = 0, c = t.objects.length; o < c; o++) {
        let l = t.objects[o],
          u = l.geometry,
          d = l.materials,
          h = u.type === "Line",
          p = u.type === "Points",
          g = !1;
        if (u.vertices.length === 0) continue;
        let y = new At();
        (y.setAttribute("position", new ot(u.vertices, 3)),
          u.normals.length > 0 &&
            y.setAttribute("normal", new ot(u.normals, 3)),
          u.colors.length > 0 &&
            ((g = !0), y.setAttribute("color", new ot(u.colors, 3))),
          u.hasUVIndices === !0 && y.setAttribute("uv", new ot(u.uvs, 2)));
        let m = [];
        for (let M = 0, T = d.length; M < T; M++) {
          let E = d[M],
            w = E.name + "_" + E.smooth + "_" + g,
            b = t.materials[w];
          if (this.materials !== null) {
            if (
              ((b = this.materials.create(E.name)),
              h && b && !(b instanceof wn))
            ) {
              let R = new wn();
              (Nt.prototype.copy.call(R, b), R.color.copy(b.color), (b = R));
            } else if (p && b && !(b instanceof Cn)) {
              let R = new Cn({ size: 10, sizeAttenuation: !1 });
              (Nt.prototype.copy.call(R, b),
                R.color.copy(b.color),
                (R.map = b.map),
                (b = R));
            }
          }
          (b === void 0 &&
            (h
              ? (b = new wn())
              : p
                ? (b = new Cn({ size: 1, sizeAttenuation: !1 }))
                : (b = new ps()),
            (b.name = E.name),
            (b.flatShading = !E.smooth),
            (b.vertexColors = g),
            (t.materials[w] = b)),
            m.push(b));
        }
        let f;
        if (m.length > 1) {
          for (let M = 0, T = d.length; M < T; M++) {
            let E = d[M];
            y.addGroup(E.groupStart, E.groupCount, M);
          }
          h ? (f = new li(y, m)) : p ? (f = new ci(y, m)) : (f = new bt(y, m));
        } else
          h
            ? (f = new li(y, m[0]))
            : p
              ? (f = new ci(y, m[0]))
              : (f = new bt(y, m[0]));
        ((f.name = l.name), r.add(f));
      }
    else if (t.vertices.length > 0) {
      let o = new Cn({ size: 1, sizeAttenuation: !1 }),
        c = new At();
      (c.setAttribute("position", new ot(t.vertices, 3)),
        t.colors.length > 0 &&
          t.colors[0] !== void 0 &&
          (c.setAttribute("color", new ot(t.colors, 3)),
          (o.vertexColors = !0)));
      let l = new ci(c, o);
      r.add(l);
    }
    return r;
  }
};
var yg = new URL("./Jarde-Dummy-Standing.obj.gz", import.meta.url).href,
  _l = "jiaren:pose-studio-v3",
  xl = 768,
  vl = 1024,
  ka = {
    chest: { label: "\u8EAF\u5E72", position: [0, 2.32, 0] },
    head: { label: "\u5934\u90E8", position: [0, 3.9, -0.02] },
    leftShoulder: { label: "\u5DE6\u80A9", position: [-0.49, 3.62, -0.08] },
    leftElbow: { label: "\u5DE6\u8098", position: [-0.59, 2.82, -0.11] },
    leftWrist: { label: "\u5DE6\u8155", position: [-0.62, 2.14, -0.08] },
    rightShoulder: { label: "\u53F3\u80A9", position: [0.49, 3.62, -0.08] },
    rightElbow: { label: "\u53F3\u8098", position: [0.59, 2.82, -0.11] },
    rightWrist: { label: "\u53F3\u8155", position: [0.62, 2.14, -0.08] },
    leftHip: { label: "\u5DE6\u9ACB", position: [-0.26, 2.38, 0] },
    leftKnee: { label: "\u5DE6\u819D", position: [-0.28, 1.22, -0.03] },
    leftAnkle: { label: "\u5DE6\u8E1D", position: [-0.35, 0.24, 0] },
    rightHip: { label: "\u53F3\u9ACB", position: [0.26, 2.38, 0] },
    rightKnee: { label: "\u53F3\u819D", position: [0.28, 1.22, -0.03] },
    rightAnkle: { label: "\u53F3\u8E1D", position: [0.35, 0.24, 0] },
  },
  Mg = [
    ["head", "chest"],
    ["chest", "leftShoulder"],
    ["leftShoulder", "leftElbow"],
    ["leftElbow", "leftWrist"],
    ["chest", "rightShoulder"],
    ["rightShoulder", "rightElbow"],
    ["rightElbow", "rightWrist"],
    ["chest", "leftHip"],
    ["leftHip", "leftKnee"],
    ["leftKnee", "leftAnkle"],
    ["chest", "rightHip"],
    ["rightHip", "rightKnee"],
    ["rightKnee", "rightAnkle"],
  ],
  Sg = {
    standing: {},
    walk: {
      leftShoulder: [18, 0, -12],
      rightShoulder: [-18, 0, 12],
      leftElbow: [-18, 0, 8],
      rightElbow: [24, 0, -8],
      leftHip: [-20, 0, 2],
      rightHip: [18, 0, -2],
      leftKnee: [28, 0, 0],
      rightKnee: [8, 0, 0],
    },
    action: {
      chest: [2, -8, -8],
      leftShoulder: [-36, -18, -58],
      leftElbow: [-42, 8, -32],
      rightShoulder: [22, 12, 34],
      rightElbow: [-58, 0, 18],
      leftHip: [22, 5, 18],
      leftKnee: [48, 0, -8],
      rightHip: [-18, -4, -12],
      rightKnee: [18, 0, 8],
    },
  },
  gl;
async function bg() {
  let i = await fetch(yg);
  if (!i.ok && i.status !== 0)
    throw new Error(
      `\u6A21\u578B\u8BFB\u53D6\u5931\u8D25\uFF1AHTTP ${i.status}`,
    );
  if (!i.body || typeof DecompressionStream > "u")
    throw new Error(
      "\u5F53\u524D\u8FD0\u884C\u73AF\u5883\u4E0D\u652F\u6301\u89E3\u538B 3D \u6A21\u578B\u8D44\u6E90\u3002",
    );
  return new Response(
    i.body.pipeThrough(new DecompressionStream("gzip")),
  ).text();
}
async function Eg() {
  return (gl || (gl = bg().then((i) => new Va().parse(i))), gl);
}
function Tg(i) {
  Array.isArray(i) ? i.forEach((e) => e.dispose()) : i?.dispose?.();
}
function Ag() {
  try {
    let i = JSON.parse(localStorage.getItem(_l) || "{}");
    return i && typeof i == "object" ? i : {};
  } catch {
    return {};
  }
}
function wg(i) {
  try {
    localStorage.setItem(_l, JSON.stringify(i));
  } catch {}
}
function Sh(i) {
  return new Promise((e, t) => {
    let n = new Image();
    ((n.onload = () => e(n)),
      (n.onerror = () =>
        t(new Error("\u59FF\u52BF\u622A\u56FE\u8BFB\u53D6\u5931\u8D25\u3002"))),
      (n.src = i));
  });
}
function bh(i, e, t, n) {
  let s = Math.min(t / e.naturalWidth, n / e.naturalHeight),
    r = Math.round(e.naturalWidth * s),
    a = Math.round(e.naturalHeight * s),
    o = Math.round((t - r) / 2),
    c = Math.round((n - a) / 2);
  i.drawImage(e, o, c, r, a);
}
async function Mh(i, e = "#f7f8fa") {
  let t = await Sh(i),
    n = document.createElement("canvas");
  ((n.width = xl), (n.height = vl));
  let s = n.getContext("2d");
  return (
    (s.fillStyle = e),
    s.fillRect(0, 0, n.width, n.height),
    (s.imageSmoothingEnabled = !0),
    (s.imageSmoothingQuality = "high"),
    bh(s, t, n.width, n.height),
    n.toDataURL("image/png")
  );
}
async function Cg(i) {
  let e = await Sh(i),
    t = xl,
    n = vl,
    s = document.createElement("canvas");
  ((s.width = t), (s.height = n));
  let r = s.getContext("2d", { willReadFrequently: !0 });
  ((r.fillStyle = "#ffffff"), r.fillRect(0, 0, t, n), bh(r, e, t, n));
  let a = r.getImageData(0, 0, t, n),
    o = new Uint8ClampedArray(t * n);
  for (let l = 0; l < o.length; l += 1) {
    let u = l * 4;
    o[l] = a.data[u] * 0.299 + a.data[u + 1] * 0.587 + a.data[u + 2] * 0.114;
  }
  let c = r.createImageData(t, n);
  for (let l = 1; l < n - 1; l += 1)
    for (let u = 1; u < t - 1; u += 1) {
      let d = l * t + u,
        h =
          -o[d - t - 1] +
          o[d - t + 1] -
          2 * o[d - 1] +
          2 * o[d + 1] -
          o[d + t - 1] +
          o[d + t + 1],
        p =
          -o[d - t - 1] -
          2 * o[d - t] -
          o[d - t + 1] +
          o[d + t - 1] +
          2 * o[d + t] +
          o[d + t + 1],
        g = Math.hypot(h, p) > 72 ? 18 : 255,
        y = d * 4;
      ((c.data[y] = g),
        (c.data[y + 1] = g),
        (c.data[y + 2] = g),
        (c.data[y + 3] = 255));
    }
  return (r.putImageData(c, 0, 0), s.toDataURL("image/png"));
}
async function sv(i, e = {}) {
  let t = Ag(),
    n = new ls();
  n.background = new Pe(16251130);
  let s = new It(t.fov || 42, 1, 0.05, 100),
    r = new Fa({ antialias: !0, preserveDrawingBuffer: !0 });
  ((r.outputColorSpace = Et),
    r.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35)),
    (r.shadowMap.enabled = !0),
    i.replaceChildren(r.domElement),
    n.add(new xs(16777215, 13160925, 2.2)));
  let a = new Gi(16777215, 3.1);
  (a.position.set(4.5, 7, 5.5), (a.castShadow = !0), n.add(a));
  let o = new Gi(12573183, 1.5);
  (o.position.set(-4, 3, -4), n.add(o));
  let c = new Ms(9, 18, 12174805, 14541803);
  ((c.position.y = -0.01), n.add(c));
  let l = new bt(
    new hi(9, 9),
    new zi({ color: 15856888, roughness: 0.95, metalness: 0 }),
  );
  ((l.rotation.x = -Math.PI / 2),
    (l.position.y = -0.018),
    (l.receiveShadow = !0),
    n.add(l),
    e.onStatus?.(
      "\u6B63\u5728\u52A0\u8F7D\u7AD9\u7ACB\u4EBA\u7269\u6A21\u578B...",
    ));
  let d = (await Eg()).clone(!0),
    h = new zi({ color: 10135738, roughness: 0.58, metalness: 0.04 }),
    p = new Map();
  d.traverse((H) => {
    H.isMesh &&
      ((H.material = h),
      (H.castShadow = !0),
      (H.receiveShadow = !0),
      p.set(H.name, H));
  });
  let g = new qt();
  (n.add(g), g.add(d), g.updateMatrixWorld(!0));
  for (let H of p.values()) g.attach(H);
  g.remove(d);
  let y = new Map(),
    m = [];
  for (let [H, le] of Object.entries(ka)) {
    let we = new qt();
    ((we.name = `joint-${H}`), we.position.fromArray(le.position), g.add(we));
    let ke = new bt(
      new fs(H === "chest" ? 0.105 : 0.082, 20, 14),
      new oi({
        color: H === "chest" ? 1472511 : 3323814,
        transparent: !0,
        opacity: 0.88,
        depthTest: !1,
      }),
    );
    ((ke.userData.joint = H),
      (ke.renderOrder = 100),
      we.add(ke),
      m.push(ke),
      y.set(H, we));
  }
  g.updateMatrixWorld(!0);
  let f = (H, le) => {
    let we = p.get(le),
      ke = y.get(H);
    we && ke && ke.attach(we);
  };
  (f("chest", "torso"),
    f("chest", "pelvis"),
    f("head", "head"),
    f("leftShoulder", "leftUpperArm"),
    f("leftElbow", "leftForearm"),
    f("leftWrist", "leftHand"),
    f("rightShoulder", "rightUpperArm"),
    f("rightElbow", "rightForearm"),
    f("rightWrist", "rightHand"),
    f("leftHip", "leftUpperLeg"),
    f("leftKnee", "leftLowerLeg"),
    f("leftAnkle", "leftFoot"),
    f("rightHip", "rightUpperLeg"),
    f("rightKnee", "rightLowerLeg"),
    f("rightAnkle", "rightFoot"));
  let M = (H, le) => y.get(H)?.attach(y.get(le));
  (M("chest", "head"),
    M("chest", "leftShoulder"),
    M("leftShoulder", "leftElbow"),
    M("leftElbow", "leftWrist"),
    M("chest", "rightShoulder"),
    M("rightShoulder", "rightElbow"),
    M("rightElbow", "rightWrist"),
    M("chest", "leftHip"),
    M("leftHip", "leftKnee"),
    M("leftKnee", "leftAnkle"),
    M("chest", "rightHip"),
    M("rightHip", "rightKnee"),
    M("rightKnee", "rightAnkle"));
  let T = t.selectedJoint && y.has(t.selectedJoint) ? t.selectedJoint : "chest",
    E = Number.isFinite(t.orbitYaw) ? t.orbitYaw : 0.36,
    w = Number.isFinite(t.orbitPitch) ? t.orbitPitch : 0.08,
    b = Number.isFinite(t.orbitDistance) ? t.orbitDistance : 7.4,
    R = null,
    x = !1,
    renderFrameId = 0,
    selectionFrameId = 0,
    A = new U(0, 2.05, 0),
    N = new ys(),
    C = new Ye(),
    O = () =>
      Object.fromEntries(
        [...y].map(([H, le]) => [
          H,
          [
            nn.radToDeg(le.rotation.x),
            nn.radToDeg(le.rotation.y),
            nn.radToDeg(le.rotation.z),
          ].map((we) => Number(we.toFixed(2))),
        ]),
      ),
    X = () => {
      for (let H of m)
        (H.material.color.setHex(H.userData.joint === T ? 16747069 : 3323814),
          H.scale.setScalar(H.userData.joint === T ? 1.28 : 1));
    },
    W = () => {
      selectionFrameId ||
        (selectionFrameId = requestAnimationFrame(() => {
          selectionFrameId = 0;
          let H = O()[T] || [0, 0, 0];
          e.onSelectionChange?.({ name: T, label: ka[T].label, rotation: H });
        }));
    },
    D = () =>
      wg({
        selectedJoint: T,
        rotations: O(),
        orbitYaw: E,
        orbitPitch: w,
        orbitDistance: b,
        fov: s.fov,
      });
  if (t.rotations && typeof t.rotations == "object")
    for (let [H, le] of Object.entries(t.rotations))
      !y.has(H) ||
        !Array.isArray(le) ||
        y.get(H).rotation.set(...le.slice(0, 3).map(nn.degToRad));
  let V = () => {
      let H = Math.cos(w) * b;
      (s.position.set(
        A.x + Math.sin(E) * H,
        A.y + Math.sin(w) * b,
        A.z + Math.cos(E) * H,
      ),
        s.lookAt(A));
    },
    k = () => {
      let H = Math.max(320, i.clientWidth),
        le = Math.max(320, i.clientHeight);
      (r.setSize(H, le, !1),
        (s.aspect = H / le),
        s.updateProjectionMatrix(),
        j());
    },
    j = () => {
      x ||
        renderFrameId ||
        (renderFrameId = requestAnimationFrame(() => {
          ((renderFrameId = 0), x || r.render(n, s));
        }));
    },
    ee = (H) => {
      let le = r.domElement.getBoundingClientRect();
      return (
        (C.x = ((H.clientX - le.left) / le.width) * 2 - 1),
        (C.y = -((H.clientY - le.top) / le.height) * 2 + 1),
        N.setFromCamera(C, s),
        N.intersectObjects(m, !1)[0]?.object?.userData?.joint
      );
    },
    ce = (H) => {
      let le = ee(H);
      (le
        ? ((T = le),
          X(),
          W(),
          j(),
          (R = { type: "joint", x: H.clientX, y: H.clientY }))
        : (R = { type: "orbit", x: H.clientX, y: H.clientY }),
        r.domElement.setPointerCapture?.(H.pointerId));
    },
    ye = (H) => {
      if (!R) return;
      let le = H.clientX - R.x,
        we = H.clientY - R.y;
      if (((R.x = H.clientX), (R.y = H.clientY), R.type === "joint")) {
        let ke = y.get(T);
        ((ke.rotation.z += le * 0.008),
          (ke.rotation.x += we * 0.008),
          W(),
          j());
      } else
        ((E -= le * 0.007),
          (w = nn.clamp(w + we * 0.005, -1.2, 1.2)),
          V(),
          j());
    },
    Me = () => {
      (R && D(), (R = null));
    },
    We = (H) => {
      (H.preventDefault(),
        (b = nn.clamp(b + H.deltaY * 0.006, 4.2, 12)),
        V(),
        D(),
        j());
    };
  (r.domElement.addEventListener("pointerdown", ce),
    r.domElement.addEventListener("pointermove", ye),
    r.domElement.addEventListener("pointerup", Me),
    r.domElement.addEventListener("pointercancel", Me),
    r.domElement.addEventListener("wheel", We, { passive: !1 }));
  let $e = new ResizeObserver(k);
  $e.observe(i);
  let De = (H) => {
      for (let le of y.values()) le.rotation.set(0, 0, 0);
      for (let [le, we] of Object.entries(Sg[H] || {}))
        y.get(le)?.rotation.set(...we.map(nn.degToRad));
      (D(), W(), j());
    },
    $ = (H) => {
      (H === "front"
        ? ((E = 0), (w = 0.04))
        : H === "left"
          ? ((E = -Math.PI / 2), (w = 0.04))
          : H === "right"
            ? ((E = Math.PI / 2), (w = 0.04))
            : H === "top"
              ? ((E = 0), (w = 1.08))
              : ((E = 0.58), (w = 0.12)),
        V(),
        D(),
        j());
    },
    de = (H, le) => {
      let we = y.get(T);
      !we ||
        !["x", "y", "z"].includes(H) ||
        ((we.rotation[H] = nn.degToRad(Number(le) || 0)), W(), D(), j());
    },
    te = (H) => {
      ((s.fov = nn.clamp(Number(H) || 42, 20, 90)),
        s.updateProjectionMatrix(),
        D(),
        j());
    },
    Ae = (H) => {
      (m.forEach((le) => {
        le.visible = H;
      }),
        (c.visible = H));
    },
    Le = () => {
      (Ae(!1), r.render(n, s));
      let H = r.domElement.toDataURL("image/png");
      return (Ae(!0), j(), H);
    },
    Re = () => {
      Ae(!1);
      let H = new Vi({ depthPacking: Ra }),
        le = n.overrideMaterial;
      ((n.overrideMaterial = H), r.render(n, s));
      let we = r.domElement.toDataURL("image/png");
      return ((n.overrideMaterial = le), H.dispose(), Ae(!0), j(), we);
    },
    lt = () => {
      let H = document.createElement("canvas");
      ((H.width = xl), (H.height = vl));
      let le = H.getContext("2d");
      ((le.fillStyle = "#080a0f"), le.fillRect(0, 0, H.width, H.height));
      let we = s.clone();
      ((we.aspect = H.width / H.height), we.updateProjectionMatrix());
      let ke = {};
      for (let [it, Fe] of y) {
        let je = Fe.getWorldPosition(new U()).project(we);
        ke[it] = {
          x: (je.x * 0.5 + 0.5) * H.width,
          y: (-je.y * 0.5 + 0.5) * H.height,
        };
      }
      let P = [
        "#ff5d5d",
        "#f7c948",
        "#34d399",
        "#22d3ee",
        "#60a5fa",
        "#c084fc",
      ];
      return (
        (le.lineCap = "round"),
        Mg.forEach(([it, Fe], je) => {
          ((le.strokeStyle = P[je % P.length]),
            (le.lineWidth = 10),
            le.beginPath(),
            le.moveTo(ke[it].x, ke[it].y),
            le.lineTo(ke[Fe].x, ke[Fe].y),
            le.stroke());
        }),
        Object.values(ke).forEach((it, Fe) => {
          ((le.fillStyle = P[Fe % P.length]),
            le.beginPath(),
            le.arc(it.x, it.y, 12, 0, Math.PI * 2),
            le.fill());
        }),
        H.toDataURL("image/png")
      );
    },
    He = async (H = "pose") => {
      if (H === "openpose") return lt();
      if (H === "depth") return Mh(Re());
      let le = Le();
      return H === "canny" ? Cg(le) : Mh(le);
    },
    Ke = () => {
      let H = O(),
        le = Object.entries(H)
          .filter(([, we]) => we.some((ke) => Math.abs(ke) >= 5))
          .map(
            ([we, ke]) =>
              `${ka[we].label}(${ke.map((P) => Math.round(P)).join("/")}\xB0)`,
          );
      return [
        "\u5168\u8EAB\u4EBA\u7269\u59FF\u52BF\u53C2\u8003\uFF0C\u4E25\u683C\u9075\u5FAA\u5173\u8282\u65B9\u5411\u3001\u8EAB\u4F53\u91CD\u5FC3\u548C\u56DB\u80A2\u906E\u6321\u5173\u7CFB",
        le.length
          ? `\u5173\u8282\u52A8\u4F5C\uFF1A${le.join("\uFF0C")}`
          : "\u81EA\u7136\u7AD9\u7ACB\uFF0C\u8EAB\u4F53\u91CD\u5FC3\u7A33\u5B9A",
        `\u673A\u4F4D FOV ${Math.round(s.fov)}\xB0\uFF0C\u4FDD\u6301\u4EBA\u7269\u8EAB\u4EFD\u3001\u670D\u88C5\u548C\u573A\u666F\u4E0D\u53D8`,
      ].join("\uFF1B");
    },
    nt = () => {
      let H = {};
      for (let [le, we] of y) {
        let ke = we.getWorldPosition(new U());
        H[le] = { x: ke.x, y: ke.y, z: ke.z };
      }
      return {
        format: "jiaren-pose-3d-v2",
        points: H,
        rotations: O(),
        prompt: Ke(),
        fov: s.fov,
      };
    };
  return (
    V(),
    k(),
    X(),
    W(),
    j(),
    e.onStatus?.(
      "\u7AD9\u7ACB\u4EBA\u7269\u5DF2\u52A0\u8F7D\u3002\u70B9\u51FB\u5173\u8282\u70B9\u540E\u62D6\u52A8\uFF0C\u6216\u7528\u53F3\u4FA7 X/Y/Z \u7CBE\u786E\u8C03\u6574\u3002",
    ),
    {
      applyPreset: De,
      capture: He,
      getJointNames: () =>
        Object.entries(ka).map(([H, le]) => ({ name: H, label: le.label })),
      getPoseData: nt,
      getPrompt: Ke,
      resetSavedState: () => {
        (localStorage.removeItem(_l),
          De("standing"),
          $("three-quarter"),
          te(42));
      },
      selectJoint: (H) => {
        y.has(H) && ((T = H), X(), W(), D(), j());
      },
      setFov: te,
      setRotation: de,
      setView: $,
      dispose: () => {
        ((x = !0),
          renderFrameId && cancelAnimationFrame(renderFrameId),
          selectionFrameId && cancelAnimationFrame(selectionFrameId),
          (renderFrameId = 0),
          (selectionFrameId = 0),
          $e.disconnect(),
          r.domElement.removeEventListener("pointerdown", ce),
          r.domElement.removeEventListener("pointermove", ye),
          r.domElement.removeEventListener("pointerup", Me),
          r.domElement.removeEventListener("pointercancel", Me),
          r.domElement.removeEventListener("wheel", We),
          n.traverse((H) => {
            (H.geometry?.dispose?.(),
              H.material && H.material !== h && Tg(H.material));
          }),
          h.dispose(),
          r.dispose(),
          i.replaceChildren());
      },
    }
  );
}
export { sv as createPoseStudioRuntime };
/*! Bundled license information:

three/build/three.core.js:
three/build/three.module.js:
  (**
   * @license
   * Copyright 2010-2026 Three.js Authors
   * SPDX-License-Identifier: MIT
   *)
*/
