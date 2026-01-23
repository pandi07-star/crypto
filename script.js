const letters = "abcdefghijklmnopqrstuvwxyz";
const alpha = "abcdefghiklmnopqrstuvwxyz"; // No 'j'
const m2 = [[3, 3], [2, 5]];
const m3 = [[2, 4, 5], [9, 2, 1], [3, 17, 7]];

function show(v) {
    document.getElementById("ex1").style.display = v == "ex1" ? "block" : "none";
    document.getElementById("ex2").style.display = v == "ex2" ? "block" : "none";
}

/* SHIFT CIPHER */
function shiftEncrypt() {
    let t = document.getElementById("sText").value.toLowerCase();
    let k = parseInt(document.getElementById("sKey").value) % 26;
    let r = "";
    for (let i = 0; i < t.length; i++) {
        let p = letters.indexOf(t[i]);
        r += p == -1 ? t[i] : letters[(p + k) % 26];
    }
    document.getElementById("sOut").innerText = r;
}

function shiftDecrypt() {
    let t = document.getElementById("sText").value.toLowerCase();
    let k = parseInt(document.getElementById("sKey").value) % 26;
    let r = "";
    for (let i = 0; i < t.length; i++) {
        let p = letters.indexOf(t[i]);
        r += p == -1 ? t[i] : letters[(p - k + 26) % 26];
    }
    document.getElementById("sOut").innerText = r;
}

/* HILL CIPHER */
function hillEncrypt() {
    let s = parseInt(document.getElementById("hSize").value);
    let t = document.getElementById("hText").value.toLowerCase().replace(/[^a-z]/g, "");
    while (t.length % s != 0) t += "x";
    let m = s == 2 ? m2 : m3;
    let r = "";
    for (let i = 0; i < t.length; i += s) {
        for (let j = 0; j < s; j++) {
            let sum = 0;
            for (let k = 0; k < s; k++) sum += letters.indexOf(t[i + k]) * m[j][k];
            r += letters[sum % 26];
        }
    }
    document.getElementById("hOut").innerText = r;
}

function inv2(m) {
    let d = (m[0][0] * m[1][1] - m[0][1] * m[1][0]) % 26;
    let di = 0;
    for (let i = 0; i < 26; i++) if ((d * i) % 26 == 1 || (d * i) % 26 == -25) di = i;
    return [[(m[1][1] * di) % 26, (-m[0][1] * di % 26 + 26) % 26], [(-m[1][0] * di % 26 + 26) % 26, (m[0][0] * di) % 26]];
}

function hillDecrypt() {
    let s = parseInt(document.getElementById("hSize").value);
    let t = document.getElementById("hText").value.toLowerCase().replace(/[^a-z]/g, "");
    if (s == 3) { document.getElementById("hOut").innerText = "3x3 Decrypt not implemented"; return; }
    let m = inv2(m2);
    let r = "";
    for (let i = 0; i < t.length; i += s) {
        for (let j = 0; j < s; j++) {
            let sum = 0;
            for (let k = 0; k < s; k++) sum += letters.indexOf(t[i + k]) * m[j][k];
            r += letters[(sum % 26 + 26) % 26];
        }
    }
    document.getElementById("hOut").innerText = r.replace(/x+$/, "");
}

/* PLAYFAIR CIPHER */
function makeMatrix(key) {
    let k = "";
    key = key.toLowerCase().replace(/j/g, "i");
    for (let i = 0; i < key.length; i++) {
        if (alpha.includes(key[i]) && !k.includes(key[i])) k += key[i];
    }
    for (let i = 0; i < alpha.length; i++) if (!k.includes(alpha[i])) k += alpha[i];
    let m = [];
    for (let i = 0; i < 5; i++) m.push(k.slice(i * 5, i * 5 + 5));
    return m;
}

function prepare(t) {
    t = t.toLowerCase().replace(/j/g, "i").replace(/[^a-z]/g, "");
    let r = "";
    for (let i = 0; i < t.length; i++) {
        let a = t[i];
        let b = t[i + 1];
        if (!b) { r += a + "x"; }
        else if (a == b) { r += a + "x"; }
        else { r += a + b; i++; }
    }
    return r;
}

function find(m, c) {
    for (let r = 0; r < 5; r++)
        for (let col = 0; col < 5; col++)
            if (m[r][col] == c) return [r, col];
    return null;
}

function playfairEncrypt() {
    let m = makeMatrix(document.getElementById("pKey").value);
    let t = prepare(document.getElementById("pText").value);
    let o = "";
    for (let i = 0; i < t.length; i += 2) {
        let a = find(m, t[i]);
        let b = find(m, t[i + 1]);
        if (a[0] == b[0]) o += m[a[0]][(a[1] + 1) % 5] + m[b[0]][(b[1] + 1) % 5];
        else if (a[1] == b[1]) o += m[(a[0] + 1) % 5][a[1]] + m[(b[0] + 1) % 5][b[1]];
        else o += m[a[0]][b[1]] + m[b[0]][a[1]];
    }
    document.getElementById("pOut").innerText = o;
}

function playfairDecrypt() {
    let m = makeMatrix(document.getElementById("pKey").value);
    let t = document.getElementById("pText").value.toLowerCase().replace(/[^a-z]/g, "");
    let o = "";
    for (let i = 0; i < t.length; i += 2) {
        let a = find(m, t[i]);
        let b = find(m, t[i + 1]);
        if (!a || !b) continue;
        if (a[0] == b[0]) o += m[a[0]][(a[1] + 4) % 5] + m[b[0]][(b[1] + 4) % 5];
        else if (a[1] == b[1]) o += m[(a[0] + 4) % 5][a[1]] + m[(b[0] + 4) % 5][b[1]];
        else o += m[a[0]][b[1]] + m[b[0]][a[1]];
    }
    document.getElementById("pOut").innerText = o.replace(/x+$/, "");
}
