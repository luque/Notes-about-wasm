/* tslint:disable */
import * as wasm from './rogue_bg';
import { stats_updated } from './index';

const lTextDecoder = typeof TextDecoder === 'undefined' ? require('util').TextDecoder : TextDecoder;

let cachedTextDecoder = new lTextDecoder('utf-8');

let cachegetUint8Memory = null;
function getUint8Memory() {
    if (cachegetUint8Memory === null || cachegetUint8Memory.buffer !== wasm.memory.buffer) {
        cachegetUint8Memory = new Uint8Array(wasm.memory.buffer);
    }
    return cachegetUint8Memory;
}

function getStringFromWasm(ptr, len) {
    return cachedTextDecoder.decode(getUint8Memory().subarray(ptr, ptr + len));
}

export function __wbg_alert_1db9ba8b7b109584(arg0, arg1) {
    let varg0 = getStringFromWasm(arg0, arg1);
    alert(varg0);
}

const stack = [];

const slab = [{ obj: undefined }, { obj: null }, { obj: true }, { obj: false }];

function getObject(idx) {
    if ((idx & 1) === 1) {
        return stack[idx >> 1];
    } else {
        const val = slab[idx >> 1];

        return val.obj;

    }
}

let slab_next = slab.length;

function dropRef(idx) {

    idx = idx >> 1;
    if (idx < 4) return;
    let obj = slab[idx];

    obj.cnt -= 1;
    if (obj.cnt > 0) return;

    // If we hit 0 then free up our space in the slab
    slab[idx] = slab_next;
    slab_next = idx;
}

function takeObject(idx) {
    const ret = getObject(idx);
    dropRef(idx);
    return ret;
}

export function __wbg_statsupdated_4c12d080eb0b1602(arg0) {
    stats_updated(takeObject(arg0));
}

export function __wbg_draw_38e98c1d45c9fd57(arg0, arg1, arg2, arg3, arg4) {
    let varg3 = getStringFromWasm(arg3, arg4);
    getObject(arg0).draw(arg1, arg2, varg3);
}

export function __wbg_draw_f86b9d977aff1eb2(arg0, arg1, arg2, arg3, arg4, arg5, arg6) {
    let varg3 = getStringFromWasm(arg3, arg4);
    let varg5 = getStringFromWasm(arg5, arg6);
    getObject(arg0).draw(arg1, arg2, varg3, varg5);
}

const lTextEncoder = typeof TextEncoder === 'undefined' ? require('util').TextEncoder : TextEncoder;

let cachedTextEncoder = new lTextEncoder('utf-8');

function passStringToWasm(arg) {

    const buf = cachedTextEncoder.encode(arg);
    const ptr = wasm.__wbindgen_malloc(buf.length);
    getUint8Memory().set(buf, ptr);
    return [ptr, buf.length];
}

function addHeapObject(obj) {
    if (slab_next === slab.length) slab.push(slab.length + 1);
    const idx = slab_next;
    const next = slab[idx];

    slab_next = next;

    slab[idx] = { obj, cnt: 1 };
    return idx << 1;
}

function freeEngine(ptr) {

    wasm.__wbg_engine_free(ptr);
}
/**
*/
export class Engine {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freeEngine(ptr);
    }

    /**
    * @param {any} arg0
    * @returns {}
    */
    constructor(arg0) {
        this.ptr = wasm.engine_new(addHeapObject(arg0));
    }
    /**
    * @param {number} arg0
    * @param {number} arg1
    * @param {number} arg2
    * @returns {void}
    */
    on_dig(arg0, arg1, arg2) {
        return wasm.engine_on_dig(this.ptr, arg0, arg1, arg2);
    }
    /**
    * @returns {void}
    */
    draw_map() {
        return wasm.engine_draw_map(this.ptr);
    }
    /**
    * @param {number} arg0
    * @param {number} arg1
    * @returns {void}
    */
    redraw_at(arg0, arg1) {
        return wasm.engine_redraw_at(this.ptr, arg0, arg1);
    }
    /**
    * @param {number} arg0
    * @param {number} arg1
    * @returns {void}
    */
    place_box(arg0, arg1) {
        return wasm.engine_place_box(this.ptr, arg0, arg1);
    }
    /**
    * @param {PlayerCore} arg0
    * @param {number} arg1
    * @param {number} arg2
    * @returns {void}
    */
    open_box(arg0, arg1, arg2) {
        return wasm.engine_open_box(this.ptr, arg0.ptr, arg1, arg2);
    }
    /**
    * @param {number} arg0
    * @param {number} arg1
    * @returns {void}
    */
    mark_wasmprize(arg0, arg1) {
        return wasm.engine_mark_wasmprize(this.ptr, arg0, arg1);
    }
    /**
    * @param {PlayerCore} arg0
    * @param {number} arg1
    * @param {number} arg2
    * @returns {void}
    */
    move_player(arg0, arg1, arg2) {
        return wasm.engine_move_player(this.ptr, arg0.ptr, arg1, arg2);
    }
    /**
    * @param {number} arg0
    * @param {number} arg1
    * @returns {boolean}
    */
    free_cell(arg0, arg1) {
        return (wasm.engine_free_cell(this.ptr, arg0, arg1)) !== 0;
    }
}

function freePlayerCore(ptr) {

    wasm.__wbg_playercore_free(ptr);
}
/**
*/
export class PlayerCore {

    free() {
        const ptr = this.ptr;
        this.ptr = 0;
        freePlayerCore(ptr);
    }

    /**
    * @param {number} arg0
    * @param {number} arg1
    * @param {string} arg2
    * @param {string} arg3
    * @param {any} arg4
    * @returns {}
    */
    constructor(arg0, arg1, arg2, arg3, arg4) {
        const [ptr2, len2] = passStringToWasm(arg2);
        const [ptr3, len3] = passStringToWasm(arg3);
        try {
            this.ptr = wasm.playercore_new(arg0, arg1, ptr2, len2, ptr3, len3, addHeapObject(arg4));

        } finally {
            wasm.__wbindgen_free(ptr2, len2 * 1);
            wasm.__wbindgen_free(ptr3, len3 * 1);

        }

    }
    /**
    * @returns {number}
    */
    x() {
        return wasm.playercore_x(this.ptr);
    }
    /**
    * @returns {number}
    */
    y() {
        return wasm.playercore_y(this.ptr);
    }
    /**
    * @returns {void}
    */
    draw() {
        return wasm.playercore_draw(this.ptr);
    }
    /**
    * @param {number} arg0
    * @param {number} arg1
    * @returns {void}
    */
    move_to(arg0, arg1) {
        return wasm.playercore_move_to(this.ptr, arg0, arg1);
    }
    /**
    * @returns {void}
    */
    emit_stats() {
        return wasm.playercore_emit_stats(this.ptr);
    }
    /**
    * @param {number} arg0
    * @returns {number}
    */
    take_damage(arg0) {
        return wasm.playercore_take_damage(this.ptr, arg0);
    }
}

export function __wbindgen_object_drop_ref(i) {
    dropRef(i);
}

export function __wbindgen_json_parse(ptr, len) {
    return addHeapObject(JSON.parse(getStringFromWasm(ptr, len)));
}

export function __wbindgen_throw(ptr, len) {
    throw new Error(getStringFromWasm(ptr, len));
}

