function Sdk(s = '') {
    let f = Array(); //y*9+x - координаты x,y = 0..8
    let zx = Array();
    let zy = Array();
    let zs = Array();
    function clear() {
        f = Array(); //y*9+x - координаты x,y = 0..8
        for (let i = 0; i < 81; i++) f[i] = 0;
        zx = Array();
        zy = Array();
        zs = Array();
    }
    // установка полей
    function testV(v) {
        if (v !== v>>0) return false;
        if (v > 9) return false;
        if (v < 0) return false;
        return true;
    }
    function testXY(v) {
        if (v !== v>>0) return false;
        if (v > 8) return false;
        if (v < 0) return false;
        return true;
    }
    
    function clearBox(x, y) {
        let t = (f[y*9+x]) ^ 511;
        zx[x] &= t;
        zy[y] &= t;
        zs[(y-y%3)+x/3>>0] &= t;
        f[y*9+x] = 0;
        return true;
    }

    function setBox(x, y, v) {
        if (!testV(v)) return false;
        if (!testXY(x)) return false;
        if (!testXY(y)) return false;
        if (v == 0) return clearBox(x, y);
        let t = 1 << (v-1);
        if (getExist(x, y) & t) return false;
        clearBox(x, y);
        f[y*9+x] = t;
        zx[x] |= t;
        zy[y] |= t;
        zs[(y-y%3)+x/3>>0] |= t;
        return true;
    }
    function getBox(x, y) {
        if (!testXY(x)) return false;
        if (!testXY(y)) return false;
        return f[y*9+x];
    }
    function getExist(x, y) {
        let c = getBox(x, y);
        if (c > 0) return 511;
        if (c === false) return false;
        return zx[x] | zy[y] | zs[(y-y%3)+x/3>>0];
    }
    
    let cc = [0,1,2,3,4,5,6,7,8,9];
    cc['_'] = 0;
    function setup(s = '') {
        clear();
        let c = 0;
        for (let i = 0; i < s.length; i++) {
            let m = +cc[s[i]];
            if (m == undefined) continue;
            setBox(c%9, (c/9)>>0, m);
            c++;
        }
    }

    let b2d = [];
    b2d[1] = 1;
    b2d[2] = 2;
    b2d[4] = 3;
    b2d[8] = 4;
    b2d[16] = 5;
    b2d[32] = 6;
    b2d[64] = 7;
    b2d[128] = 8;
    b2d[256] = 9;
    
    function toString() {
        let s = '';
        for (let y = 0; y < 9; y++) {
            for (let x = 0; x < 9; x++) {
                let t = b2d[f[y*9+x]];
                t = ((t == undefined)||(t == 0))? '_': t;
                s+=t;
            }
            s += '\n';
        }
        return s;
    }

    function solve2() {
        let undo = toString();
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (f[y*9+x] != 0) continue;
                let t = getExist(x, y) ^ 511;
                if (t == 0) return false;
                for (let i = 1; i <= 9; i++) {
                    if (t & 1) {
                        setBox(x, y, i);
                        if(solve2()) return true;
                        setup(undo);
                    }
                    t >>= 1;
                }
                return false;
            }
        }
        return true;
    }
    function solve2b() {
        let undo = toString();
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (f[y*9+x] != 0) continue;
                let t = getExist(x, y) ^ 511;
                if (t == 0) return false;
                for (let i = 9; i >= 1; i--) {
                    if (t & 256) {
                        setBox(x, y, i);
                        if(solve2b()) return true;
                        setup(undo);
                    }
                    t <<= 1;
                }
                return false;
            }
        }
        return true;
    }
    function set2n(x) {
        x &= 511;
        let r = 0;
        for (; x!=0; r += (x&1), x>>=1);
        return r;
    }
    function sortXY() {
        let sxy = Array(9);
        for (let i = 0; i < 9; i++) sxy[i] = Array();
        for (let x = 0; x < 9; x++) {
            for (let y = 0; y < 9; y++) {
                if (f[y*9 + x] != 0) continue;
                let t = getExist(x, y) ^ 511;
                let m = set2n(t);
                sxy[m][sxy[m].length] = [x, y];
            }
        }
        return sxy;
    }
    function copyArray(a) {
        let r = [];
        for (let i of a) r[r.length] = i;
        return r;        
    }
    function save_f() {
        return [copyArray(f), copyArray(zx), copyArray(zy), copyArray(zs)];
    }
    function restore_f(r) {
        f = copyArray(r[0]);
        zx = copyArray(r[1]);
        zy = copyArray(r[2]);
        zs = copyArray(r[3]);
    }
    function solve3() {
        let undo = save_f();
        let sxy = sortXY();
        let x, y;
        for (let m of sxy) {
            for (let xy of m) {
                x = xy[0];
                y = xy[1];
                let t = getExist(x, y) ^ 511;
                if (t == 0) return false;
                for (let i = 1; i <= 9; i++) {
                    if (t & 1) {
                        setBox(x, y, i);
                        if(solve3()) return true;
                        restore_f(undo);
                    }
                    t >>= 1;
                }
                return false;
            }
        }
        return true;
    }

    function solve3b() {
         let undo = save_f();
        let sxy = sortXY();
        let x, y;
        for (let m of sxy) {
            for (let xy of m) {
                x = xy[0];
                y = xy[1];
                let t = getExist(x, y) ^ 511;
                if (t == 0) return false;
                for (let i = 9; i >= 1; i--) {
                    if (t & 256) {
                        setBox(x, y, i);
                        if(solve3b()) return true;
                        restore_f(undo);
                    }
                    t <<= 1;
                }
                return false;
            }
        }
        return true;
    }

    function isUnique() {
         let undo = save_f();
         solve3();
         let s = toString();
         restore_f(undo);
         solve3b();
         let v = (s == toString());
         restore_f(undo);
         return v;         
    }
    setup(s);
    return Object.assign(this, {
        setBox, getBox, setup, toString, solve2, solve2b, solve3, solve3b, isUnique
    });
}


function test() {
    let s = new Sdk();
    s.setup('_______4_54____8_7____8___19___6__7__634__1_5____78_____41_____3_6__5_181____2_9_');
    s.solve3();
    console.log(s.toString());
    s.setup('_______4_54____8_7____8___19___6__7__634__1_5____78_____41_____3_6__5_181____2_9_');
    s.solve3b();
    console.log(s.toString());
    //  831 257 649
    //  549 613 827
    //  672 984 531
    //  928 561 374
    
    //  763 429 185
    //  415 378 962
    //  284 196 753
    //  396 745 218
    //  157 832 496
}
