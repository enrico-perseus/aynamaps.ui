function setBackground(e) { reader.onload = function(e) { backGround = new Image; var t, a, r, i;
        backGround.onload = function() { t = this.width, a = this.height, r = $("#view").height(), i = $("#view").width(); var e, c;
            e = (i - t) / 2, c = (r - a) / 2, bginfo.x = 0, bginfo.y = 0, bginfo.w = Math.round(t / step) * step, bginfo.h = Math.round(a / step) * step, operationType = "setbackground", reDrawAll(gStep, !0), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), drawSelectRect(bginfo, 3) }, backGround.src = e.target.result }, reader.readAsDataURL(e.target.files[0]) }

function drawSelectRect(e, t) { ctx.beginPath(), ctx.strokeStyle = "#4d7399", ctx.lineWidth = 2, ctx.rect(e.x, e.y, e.w, e.h), ctx.stroke(), drawCricle(e.x, e.y, t), drawCricle(e.x + e.w, e.y, t), drawCricle(e.x, e.y + e.h, t), drawCricle(e.x + e.w, e.y + e.h, t), drawRect(e.x, e.y + e.h / 2, t), drawRect(e.x + e.w / 2, e.y, t), drawRect(e.x + e.w / 2, e.y + e.h, t), drawRect(e.x + e.w, e.y + e.h / 2, t) }

function drawCricle(e, t, a) { ctx.beginPath(), ctx.arc(e, t, a, 0, 2 * Math.PI, !1), ctx.strokeStyle = "#000000", ctx.fillStyle = "#ffffff", ctx.stroke(), ctx.fill() }



function ToolbarDeactive() { var e, t = document.getElementsByClassName("toolbar_icon"); for (e = 0; e < t.length; e++) t[e].style.backgroundColor = "white" }

function ToolbarAction() { var e, t = document.getElementsByClassName("toolbar_icon"); for (e = 0; e < t.length; e++) t[e].onclick = function() { ToolbarDeactive(), disableIcon(), "lightgray" != this.style.backgroundColor && (this.style.backgroundColor = "darkseagreen") } }

function disableIcon() { 0 > hStep ? $(".undo").css("background-color", "lightgray") : $(".undo").css("background-color", "white"), hStep >= histroys.length - 1 ? $(".redo").css("background-color", "lightgray") : $(".redo").css("background-color", "white"), 0 > gStep ? ($(".export").css("background-color", "lightgray"), $(".copy").css("background-color", "lightgray"), $(".move").css("background-color", "lightgray"), $(".breaker").css("background-color", "lightgray"), $(".delete").css("background-color", "lightgray")) : ($(".copy").css("background-color", "white"), $(".move").css("background-color", "white"), $(".breaker").css("background-color", "white"), $(".delete").css("background-color", "white")) }

function handleContextMenu(e) { e || (e = event || window.event), contextmenu = !0, ctx.putImageData(savePoint, 0, 0); var t = e.clientX,
        a = e.clientY;
    $("#rBreaker").show(), $("#rDisable").show(), $("#rNormal").show(), $("#rDelete").show(), $("#rCopy").show(), $("#rPaste").show(); for (var r = 0; gStep >= r; r++)
        if (isPointInObject(graphs[r], e.offsetX / curScale, e.offsetY / curScale)) return contextinfo = {}, contextinfo.index = r, contextinfo.x = e.offsetX / curScale, contextinfo.y = e.offsetY / curScale, isDraw = !0, _selectCircle(graphs[r], 3), menu(t, a), clipbord || $("#rPaste").hide(), "#0000ff" == graphs[r].color ? $("#rDisable").hide() : $("#rNormal").hide(), void e.preventDefault();
    clipbord && (contextinfo = {}, contextinfo.x = e.offsetX / curScale, contextinfo.y = e.offsetY / curScale, isDraw = !0, $("#rBreaker").hide(), $("#rDisable").hide(), $("#rDelete").hide(), $("#rCopy").hide(), menu(t, a)) }

function MakeBreaker(e, t, a) { if (isDraw && isSelectedGraph && "line" == isSelectedGraph.type) { var r, i, c, n, o, s, l = isSelectedGraph.x,
            p = isSelectedGraph.y,
            h = isSelectedGraph.x1,
            d = isSelectedGraph.y1; if (Math.abs(l - h) > Math.abs(p - d)) { if (h > l && (l > t || t > h)) return !1; if (l > h && (h > t || t > l)) return !1;
            r = (p - d) / (l - h), i = p - r * l, h > l ? (c = r * (t - 2) + i, n = r * (t + 2) + i, gPush({ type: "line", x: l, x1: t - 2, y: p, y1: c, color: isSelectedGraph.color }), gPush({ type: "line", x: h, y: d, x1: t + 2, y1: n, color: isSelectedGraph.color }), hPush({ type: "breaker", sindex: e, sel: graphClone(isSelectedGraph), rindex1: gStep - 1, result1: { type: "line", x: l, x1: t - 2, y: p, y1: c, color: isSelectedGraph.color }, rindex2: gStep, result2: { type: "line", x: h, y: d, x1: t + 2, y1: n, color: isSelectedGraph.color } })) : (n = r * (t - 2) + i, c = r * (t + 2) + i, gPush({ type: "line", x: h, y: d, x1: t - 2, y1: n, color: isSelectedGraph.color }), gPush({ type: "line", x: l, y: p, x1: t + 2, y1: c, color: isSelectedGraph.color }), hPush({ type: "breaker", sindex: e, sel: graphClone(isSelectedGraph), rindex1: gStep - 1, result1: { type: "line", x: h, y: d, x1: t - 2, y1: n, color: isSelectedGraph.color }, rindex2: gStep, result2: { type: "line", x: l, y: p, x1: t + 2, y1: c, color: isSelectedGraph.color } })) } else { if (d > p) { if (p > a || a > d) return !1 } else if (d > a || a > p) return !1;
            r = (l - h) / (p - d), i = l - r * p, d > p ? (o = r * (a - 2) + i, s = r * (a + 2) + i, gPush({ type: "line", x: l, y: p, x1: o, y1: a - 2, color: isSelectedGraph.color }), gPush({ type: "line", x: h, y: d, x1: s, y1: a + 2, color: isSelectedGraph.color }), hPush({ type: "breaker", sindex: e, sel: graphClone(isSelectedGraph), rindex1: gStep - 1, result1: { type: "line", x: l, y: p, x1: o, y1: a - 2, color: isSelectedGraph.color }, rindex2: gStep, result2: { type: "line", x: h, y: d, x1: s, y1: a + 2, color: isSelectedGraph.color } })) : (o = r * (a + 2) + i, s = r * (a - 2) + i, gPush({ type: "line", x: h, y: d, x1: s, y1: a - 2, color: isSelectedGraph.color }), gPush({ type: "line", x: l, y: p, x1: o, y1: a + 2, color: isSelectedGraph.color }), hPush({ type: "breaker", sindex: e, sel: graphClone(isSelectedGraph), rindex1: gStep - 1, result1: { type: "line", x: h, y: d, x1: s, y1: a - 2, color: isSelectedGraph.color }, rindex2: gStep, result2: { type: "line", x: l, y: p, x1: o, y1: a + 2, color: isSelectedGraph.color } })) } reDrawAll(gStep), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), _selectCircle(graphs[gStep - 1], 3), _selectCircle(graphs[gStep], 3) } isDraw = !1, isSelectedGraph = void 0 }

function MakeDisable() { if (isDraw && isSelectedGraph) { var e = graphClone(isSelectedGraph);
        isSelectedGraph.color = "#0000ff", gPush(isSelectedGraph), hPush({ type: "disable", sindex: contextinfo.index, sel: e, rindex1: gStep, result1: graphClone(isSelectedGraph) }), reDrawAll(gStep), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), _selectCircle(graphs[gStep], 3) } isDraw = !1, isSelectedGraph = void 0 }

function MakeNormal() { if (isDraw && isSelectedGraph) { var e = graphClone(isSelectedGraph);
        isSelectedGraph.color = "#000000", gPush(isSelectedGraph), hPush({ type: "normal", sindex: contextinfo.index, sel: e, rindex1: gStep, result1: graphClone(isSelectedGraph) }), reDrawAll(gStep), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), _selectCircle(graphs[gStep], 3) } isDraw = !1, isSelectedGraph = void 0 }

function SelectDelete() { isDraw && isSelectedGraph && (hPush({ type: "delete", sindex: contextinfo.index, sel: graphClone(isSelectedGraph) }), reDrawAll(gStep), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height)), isDraw = !1, isSelectedGraph = void 0 }

function zoomin(e) { ctx.setTransform(1, 0, 0, 1, 0, 0), curScale += e, zoomCanvasSize(), ctx.scale(curScale, curScale);
    console.log(curScale), reDrawAll(gStep), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height) }

function zoomout(e) { if (1 >= curScale) return ctx.setTransform(1, 0, 0, 1, 0, 0), curScale = 1, ctx.scale(1, 1), reDrawAll(gStep), void(savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height));
    ctx.setTransform(1, 0, 0, 1, 0, 0), curScale -= e, zoomCanvasSize(), ctx.scale(curScale, curScale);
    console.log(curScale), reDrawAll(gStep), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height) }

function zoomCanvasSize() { width = initW * curScale, height = initH * curScale, $("#mycanvas").width(width), $("#mycanvas").height(height), ctx.canvas.width = width, ctx.canvas.height = height }

function MouseWheelEvent(e) { e || (e = event || window.event); var t = e.wheelDelta || -1 * e.detail;
    t / 120 > 0 ? (zoomin(.08), console.log("+"), console.log(t / 120)) : (zoomout(.08), console.log("-"), console.log(t)), e.preventDefault && e.preventDefault() }

function drawGrid() { for (var e = $("#mycanvas").width(), t = $("#mycanvas").height(), a = 0; e >= a; a += step)
        for (var r = 0; t >= r; r += step) ctx.beginPath(), ctx.arc(a, r, .5, 0, 2 * Math.PI, !1), ctx.fillStyle = "#000000", ctx.fill() }

function drawRuler() { ctx.beginPath(); for (var e = 0; e < canvas.width; e += 10) { var t = e / 100 == parseInt(e / 100) ? 0 : 10;
        ctx.strokeStyle = "#000000", ctx.moveTo(e, t), ctx.lineTo(e, 15); var a = e / 100 == parseInt(e / 100) ? 0 : 10;
        ctx.strokeStyle = "#000000", ctx.moveTo(a, e), ctx.lineTo(15, e) } ctx.stroke() }

function draw(e) { if (e.type) switch (e.type) {
        case "line":
            _drawLine(e); break;
        case "curve":
            _drawCurve(e) } }

function reDrawAll(e, t) { t = "undefined" != typeof t ? t : !0, ctx.clearRect(0, 0, width, height), backGround && t && ctx.drawImage(backGround, bginfo.x, bginfo.y, bginfo.w, bginfo.h), gridon && drawGrid(), e > graphs.length && (e = graphs.length - 1); for (var a = 0; e >= a; a++) draw(graphs[a]) }

function graphClone(e) { var t = {}; return t.type = e.type, t.x = e.x, t.y = e.y, t.x1 = e.x1, t.y1 = e.y1, t.cx = e.cx, t.cy = e.cy, t.color = e.color, t }

function _drawLine(e) { ctx.beginPath(), ctx.strokeStyle = e.color, ctx.lineWidth = 3, ctx.moveTo(e.x, e.y), ctx.lineTo(e.x1, e.y1), ctx.stroke() }

function _drawCurve(e) { ctx.beginPath(), ctx.moveTo(e.x, e.y), ctx.strokeStyle = e.color, ctx.lineWidth = 3, ctx.quadraticCurveTo(e.cx, e.cy, e.x1, e.y1), ctx.stroke() }

function _selectCircle(e, t) { ctx.beginPath(), ctx.arc(e.x, e.y, t, 0, 2 * Math.PI, !1), ctx.strokeStyle = "#000000", ctx.fillStyle = "#ffffff", ctx.stroke(), ctx.fill(), ctx.closePath(), ctx.beginPath(), ctx.arc(e.x1, e.y1, t, 0, 2 * Math.PI, !1), ctx.strokeStyle = "#000000", ctx.fillStyle = "#ffffff", ctx.stroke(), ctx.fill(), ctx.closePath() }

function detectLeftButton(e) { if (e = e || window.event, "buttons" in e) return 1 == e.buttons; var t = e.which || e.button; return 1 == t }

function eventDown(e) { if (e || (e = event || window.event), detectLeftButton(e)) { isDraw = !0; var t = getGridpos({ x: e.offsetX / curScale, y: e.offsetY / curScale }); switch (prevPos.x = e.offsetX / curScale, prevPos.y = e.offsetY / curScale, savePoint && ctx.putImageData(savePoint, 0, 0), redraw_enable && (redraw_index = isRedraw(prevPos.x, prevPos.y), redraw_index > 0 && (operationType = "redraw", canvas.style.cursor = "pointer", reDrawAll(gStep - 1), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), draw(graphs[gStep]), _selectCircle(graphs[gStep], 3))), startPoint = {}, operationType) {
            case "line":
                savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), startPoint.x = t.x, startPoint.y = t.y; break;
            case "curve":
                makecurve || (savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), startPoint.x = t.x, startPoint.y = t.y); break;
            case "copy":
                savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height); for (var a = 0; gStep >= a; a++)
                    if (isPointInObject(graphs[a], e.offsetX / curScale, e.offsetY / curScale)) { isSelectedGraph = {}, isSelectedGraph.type = graphs[a].type, isSelectedGraph.x = graphs[a].x, isSelectedGraph.y = graphs[a].y, isSelectedGraph.x1 = graphs[a].x1, isSelectedGraph.y1 = graphs[a].y1, isSelectedGraph.cx = graphs[a].cx, isSelectedGraph.cy = graphs[a].cy, isSelectedGraph.color = graphs[a].color, canvas.style.cursor = "move", _selectCircle(isSelectedGraph, 3); break }
                break;
            case "delete":
                for (var a = 0; gStep >= a; a++)
                    if (isPointInObject(graphs[a], e.offsetX / curScale, e.offsetY / curScale)) { isSelectedGraph = graphs.splice(a, 1)[0], selectindex = a, gStep--; break }
                break;
            case "breaker":
                savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height); for (var a = 0; gStep >= a; a++)
                    if (isPointInObject(graphs[a], e.offsetX / curScale, e.offsetY / curScale)) { isSelectedGraph = graphs.splice(a, 1)[0], _selectCircle(isSelectedGraph, 3), selectindex = a, gStep--; break }
                break;
            case "move":
                savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height); for (var a = 0; gStep >= a; a++)
                    if (isPointInObject(graphs[a], e.offsetX / curScale, e.offsetY / curScale)) { isSelectedGraph = graphs.splice(a, 1)[0], selectindex = a, isSelectedGraph2 = graphClone(isSelectedGraph), gStep--, reDrawAll(gStep), canvas.style.cursor = "move", savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), draw(isSelectedGraph), _selectCircle(isSelectedGraph, 3); break }
                break;
            case "setbackground":
                backGround && (t.x - bginfo.x > dr && t.x - bginfo.x < bginfo.w - dr && t.y - bginfo.y > dr && t.y - bginfo.y < bginfo.h - dr ? (reDrawAll(gStep, !1), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), ctx.drawImage(backGround, bginfo.x, bginfo.y, bginfo.w, bginfo.h), drawSelectRect(bginfo, 3), canvas.style.cursor = "move", bginfo.otype = "move") : Math.abs(bginfo.x - prevPos.x) < dr && Math.abs(bginfo.y - prevPos.y) < dr ? (reDrawAll(gStep, !1), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), ctx.drawImage(backGround, bginfo.x, bginfo.y, bginfo.w, bginfo.h), drawSelectRect(bginfo, 3), canvas.style.cursor = "nw-resize", bginfo.otype = "resize", bginfo.rtype = "TL") : Math.abs(bginfo.x + bginfo.w - prevPos.x) < dr && Math.abs(bginfo.y + bginfo.h - prevPos.y) < dr ? (reDrawAll(gStep, !1), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), ctx.drawImage(backGround, bginfo.x, bginfo.y, bginfo.w, bginfo.h), drawSelectRect(bginfo, 3), canvas.style.cursor = "nw-resize", bginfo.otype = "resize", bginfo.rtype = "BR") : Math.abs(bginfo.x - prevPos.x) < dr && Math.abs(bginfo.y + bginfo.h - prevPos.y) < dr ? (reDrawAll(gStep, !1), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), ctx.drawImage(backGround, bginfo.x, bginfo.y, bginfo.w, bginfo.h), drawSelectRect(bginfo, 3), canvas.style.cursor = "ne-resize", bginfo.otype = "resize", bginfo.rtype = "BL") : Math.abs(bginfo.x + bginfo.w - prevPos.x) < dr && Math.abs(bginfo.y - prevPos.y) < dr ? (reDrawAll(gStep, !1), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), ctx.drawImage(backGround, bginfo.x, bginfo.y, bginfo.w, bginfo.h), drawSelectRect(bginfo, 3), canvas.style.cursor = "ne-resize", bginfo.otype = "resize", bginfo.rtype = "TR") : Math.abs(bginfo.x - prevPos.x) < dr && Math.abs(bginfo.y + bginfo.h / 2 - prevPos.y) < dr ? (reDrawAll(gStep, !1), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), ctx.drawImage(backGround, bginfo.x, bginfo.y, bginfo.w, bginfo.h), drawSelectRect(bginfo, 3), canvas.style.cursor = "e-resize", bginfo.otype = "resize", bginfo.rtype = "LM") : Math.abs(bginfo.x + bginfo.w - prevPos.x) < dr && Math.abs(bginfo.y + bginfo.h / 2 - prevPos.y) < dr ? (reDrawAll(gStep, !1), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), ctx.drawImage(backGround, bginfo.x, bginfo.y, bginfo.w, bginfo.h), drawSelectRect(bginfo, 3), canvas.style.cursor = "e-resize", bginfo.otype = "resize", bginfo.rtype = "RM") : Math.abs(bginfo.x + bginfo.w / 2 - prevPos.x) < dr && Math.abs(bginfo.y - prevPos.y) < dr ? (reDrawAll(gStep, !1), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), ctx.drawImage(backGround, bginfo.x, bginfo.y, bginfo.w, bginfo.h), drawSelectRect(bginfo, 3), canvas.style.cursor = "n-resize", bginfo.otype = "resize", bginfo.rtype = "TM") : Math.abs(bginfo.x + bginfo.w / 2 - prevPos.x) < dr && Math.abs(bginfo.y + bginfo.h - prevPos.y) < dr && (reDrawAll(gStep, !1), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), ctx.drawImage(backGround, bginfo.x, bginfo.y, bginfo.w, bginfo.h), drawSelectRect(bginfo, 3), canvas.style.cursor = "n-resize", bginfo.otype = "resize", bginfo.rtype = "BM")) } } }

function getGridpos(e) { var t = Math.round(e.x / step) * step,
        a = Math.round(e.y / step) * step; return { x: t, y: a } }

function isRedraw(e, t) { var a = graphs[gStep]; return Math.abs(a.x - e) < dr && Math.abs(a.y - t) < dr ? 1 : Math.abs(a.x1 - e) < dr && Math.abs(a.y1 - t) < dr ? 2 : 0 }

function eventMove(e) { if (e || (e = event || window.event), showCoordinates(e), resizeImgCursor(e), detectLeftButton(e)) switch (operationType) {
        case "line":
            lineEventMove(e); break;
        case "curve":
            makecurve ? curveEventMove(e) : lineEventMove(e); break;
        case "copy":
            copyEventMove(e); break;
        case "move":
            moveEventMove(e); break;
        case "setbackground":
            moveBackgroud(e); break;
        case "redraw":
            redrawMove(e) } }

function showCoordinates(e) { var t = parseInt(e.offsetX / curScale),
        a = parseInt(e.offsetY / curScale);
    $("#coordinates").children("p").html("X: " + t + " Y: " + a) }

function redrawMove(e) { isDraw && savePoint && (ctx.putImageData(savePoint, 0, 0), 1 == redraw_index ? (graphs[gStep].x = e.offsetX / curScale, graphs[gStep].y = e.offsetY / curScale) : 2 == redraw_index && (graphs[gStep].x1 = e.offsetX / curScale, graphs[gStep].y1 = e.offsetY / curScale), draw(graphs[gStep]), _selectCircle(graphs[gStep], 3)) }

function moveBackgroud(e) { if (isDraw && backGround && savePoint)
        if ("move" == bginfo.otype) { ctx.putImageData(savePoint, 0, 0); var t = e.offsetX / curScale - prevPos.x,
                a = e.offsetY / curScale - prevPos.y;
            bginfo.x += t, bginfo.y += a, ctx.drawImage(backGround, bginfo.x, bginfo.y, bginfo.w, bginfo.h), prevPos.x = e.offsetX / curScale, prevPos.y = e.offsetY / curScale } else if ("resize" == bginfo.otype) { ctx.putImageData(savePoint, 0, 0); var t = e.offsetX / curScale - prevPos.x,
            a = e.offsetY / curScale - prevPos.y; "TL" == bginfo.rtype ? (bginfo.x += t, bginfo.y += a, bginfo.w -= t, bginfo.h -= a) : "BR" == bginfo.rtype ? (bginfo.w += t, bginfo.h += a) : "BL" == bginfo.rtype ? (bginfo.x += t, bginfo.w -= t, bginfo.h += a) : "TR" == bginfo.rtype ? (bginfo.y += a, bginfo.w += t, bginfo.h -= a) : "LM" == bginfo.rtype ? (bginfo.x += t, bginfo.w -= t) : "RM" == bginfo.rtype ? bginfo.w += t : "TM" == bginfo.rtype ? (bginfo.y += a, bginfo.h -= a) : "BM" == bginfo.rtype && (bginfo.h += a), ctx.drawImage(backGround, bginfo.x, bginfo.y, bginfo.w, bginfo.h), drawSelectRect(bginfo, 3), prevPos.x = e.offsetX / curScale, prevPos.y = e.offsetY / curScale } }

function resizeImgCursor(e) { if ("setbackground" == operationType) { var t = e.offsetX / curScale,
            a = e.offsetY / curScale;
        Math.abs(bginfo.x - t) < dr && Math.abs(bginfo.y - a) < dr || Math.abs(bginfo.x + bginfo.w - t) < dr && Math.abs(bginfo.y + bginfo.h - a) < dr ? canvas.style.cursor = "nw-resize" : Math.abs(bginfo.x + bginfo.w - t) < dr && Math.abs(bginfo.y - a) < dr || Math.abs(bginfo.x - t) < dr && Math.abs(bginfo.y + bginfo.h - a) < dr ? canvas.style.cursor = "ne-resize" : Math.abs(bginfo.x + bginfo.w / 2 - t) < dr && Math.abs(bginfo.y - a) < dr || Math.abs(bginfo.x + bginfo.w / 2 - t) < dr && Math.abs(bginfo.y + bginfo.h - a) < dr ? canvas.style.cursor = "n-resize" : Math.abs(bginfo.x - t) < dr && Math.abs(bginfo.y + bginfo.h / 2 - a) < dr || Math.abs(bginfo.x + bginfo.w - t) < dr && Math.abs(bginfo.y + bginfo.h / 2 - a) < dr ? canvas.style.cursor = "e-resize" : detectLeftButton(e) || (canvas.style.cursor = "default") } }

function lineEventMove(e) { isDraw && savePoint && (ctx.putImageData(savePoint, 0, 0), draw({ type: "line", x: startPoint.x, y: startPoint.y, x1: e.offsetX / curScale, y1: e.offsetY / curScale, color: lineColor })) }

function curveEventMove(e) { isDraw && savePoint && (ctx.putImageData(savePoint, 0, 0), draw({ type: "curve", x: curveinfo.x, y: curveinfo.y, x1: curveinfo.x1, y1: curveinfo.y1, cx: e.offsetX / curScale, cy: e.offsetY / curScale, color: lineColor })) }

function copyEventMove(e) { e || window.event; if (isDraw && savePoint && isSelectedGraph)
        if (ctx.putImageData(savePoint, 0, 0), "line" == isSelectedGraph.type) { var t = e.offsetX / curScale - (isSelectedGraph.x + isSelectedGraph.x1) / 2,
                a = e.offsetY / curScale - (isSelectedGraph.y + isSelectedGraph.y1) / 2;
            isSelectedGraph.x += t, isSelectedGraph.y += a, isSelectedGraph.x1 += t, isSelectedGraph.y1 += a, draw(isSelectedGraph) } else if ("curve" == isSelectedGraph.type) { var t = e.offsetX / curScale - (isSelectedGraph.x + isSelectedGraph.x1) / 2,
            a = e.offsetY / curScale - (isSelectedGraph.y + isSelectedGraph.y1) / 2;
        isSelectedGraph.x += t, isSelectedGraph.y += a, isSelectedGraph.x1 += t, isSelectedGraph.y1 += a, isSelectedGraph.cx += t, isSelectedGraph.cy += a, draw(isSelectedGraph) } }

function moveEventMove(e) { e || window.event; if (isDraw && savePoint && isSelectedGraph)
        if (ctx.putImageData(savePoint, 0, 0), "line" == isSelectedGraph.type) { var t = e.offsetX / curScale - (isSelectedGraph.x + isSelectedGraph.x1) / 2,
                a = e.offsetY / curScale - (isSelectedGraph.y + isSelectedGraph.y1) / 2;
            isSelectedGraph.x += t, isSelectedGraph.y += a, isSelectedGraph.x1 += t, isSelectedGraph.y1 += a, draw(isSelectedGraph) } else if ("curve" == isSelectedGraph.type) { var t = e.offsetX / curScale - (isSelectedGraph.x + isSelectedGraph.x1) / 2,
            a = e.offsetY / curScale - (isSelectedGraph.y + isSelectedGraph.y1) / 2;
        isSelectedGraph.x += t, isSelectedGraph.y += a, isSelectedGraph.x1 += t, isSelectedGraph.y1 += a, isSelectedGraph.cx += t, isSelectedGraph.cy += a, draw(isSelectedGraph) } }

function eventUp(e) { switch (e || (e = event || window.event), operationType) {
        case "line":
            lineEventUp(e); break;
        case "curve":
            curveEvenUp(e); break;
        case "copy":
            copyEventUp(e); break;
        case "move":
            moveEventUp(e); break;
        case "delete":
            deleteEventUp(e); break;
        case "breaker":
            breakerEventUp(e); break;
        case "setbackground":
            backGroundUp(e); break;
        case "redraw":
            redrawUp(e) } disableIcon() }

function backGroundUp(e) { if (isDraw && backGround && savePoint && bginfo.otype) { var t = getGridpos({ x: bginfo.x, y: bginfo.y });
        bginfo.x = t.x, bginfo.y = t.y, t = getGridpos({ x: bginfo.w, y: bginfo.h }), bginfo.w = t.x, bginfo.h = t.y, reDrawAll(gStep, !0), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), drawSelectRect(bginfo, 3), canvas.style.cursor = "default" } isDraw = !1, bginfo.otype = void 0, bginfo.rtype = void 0 }

function breakerEventUp(e) { if (isDraw && isSelectedGraph && "line" == isSelectedGraph.type) { var t, a, r, i, c, n, o = isSelectedGraph.x,
            s = isSelectedGraph.y,
            l = isSelectedGraph.x1,
            p = isSelectedGraph.y1,
            h = e.offsetX / curScale,
            d = e.offsetY / curScale; if (Math.abs(o - l) > Math.abs(s - p)) { if (l > o && (o > h || h > l)) return !1; if (o > l && (l > h || h > o)) return !1;
            t = (s - p) / (o - l), a = s - t * o, l > o ? (r = t * (h - 2) + a, i = t * (h + 2) + a, gPush({ type: "line", x: o, x1: h - 2, y: s, y1: r, color: isSelectedGraph.color }), gPush({ type: "line", x: l, y: p, x1: h + 2, y1: i, color: isSelectedGraph.color }), hPush({ type: "breaker", sindex: selectindex, sel: graphClone(isSelectedGraph), rindex1: gStep - 1, result1: { type: "line", x: o, x1: h - 2, y: s, y1: r, color: isSelectedGraph.color }, rindex2: gStep, result2: { type: "line", x: l, y: p, x1: h + 2, y1: i, color: isSelectedGraph.color } })) : (i = t * (h - 2) + a, r = t * (h + 2) + a, gPush({ type: "line", x: l, y: p, x1: h - 2, y1: i, color: isSelectedGraph.color }), gPush({ type: "line", x: o, y: s, x1: h + 2, y1: r, color: isSelectedGraph.color }), hPush({ type: "breaker", sindex: selectindex, sel: graphClone(isSelectedGraph), rindex1: gStep - 1, result1: { type: "line", x: l, y: p, x1: h - 2, y1: i, color: isSelectedGraph.color }, rindex2: gStep, result2: { type: "line", x: o, y: s, x1: h + 2, y1: r, color: isSelectedGraph.color } })) } else { if (p > s) { if (s > d || d > p) return !1 } else if (p > d || d > s) return !1;
            t = (o - l) / (s - p), a = o - t * s, p > s ? (c = t * (d - 2) + a, n = t * (d + 2) + a, gPush({ type: "line", x: o, y: s, x1: c, y1: d - 2, color: isSelectedGraph.color }), gPush({ type: "line", x: l, y: p, x1: n, y1: d + 2, color: isSelectedGraph.color }), hPush({ type: "breaker", sindex: selectindex, sel: graphClone(isSelectedGraph), rindex1: gStep - 1, result1: { type: "line", x: o, y: s, x1: c, y1: d - 2, color: isSelectedGraph.color }, rindex2: gStep, result2: { type: "line", x: l, y: p, x1: n, y1: d + 2, color: isSelectedGraph.color } })) : (c = t * (d + 2) + a, n = t * (d - 2) + a, gPush({ type: "line", x: l, y: p, x1: n, y1: d - 2, color: isSelectedGraph.color }), gPush({ type: "line", x: o, y: s, x1: c, y1: d + 2, color: isSelectedGraph.color }), hPush({ type: "breaker", sindex: selectindex, sel: graphClone(isSelectedGraph), rindex1: gStep - 1, result1: { type: "line", x: l, y: p, x1: n, y1: d - 2, color: isSelectedGraph.color }, rindex2: gStep, result2: { type: "line", x: o, y: s, x1: c, y1: d + 2, color: isSelectedGraph.color } })) } reDrawAll(gStep), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), _selectCircle(graphs[gStep - 1], 3), _selectCircle(graphs[gStep], 3) } isDraw = !1, isSelectedGraph = void 0 }

function deleteEventUp() { isDraw && isSelectedGraph && (reDrawAll(gStep), isDraw = !1, hPush({ type: "delete", sindex: selectindex, sel: graphClone(isSelectedGraph) }), isSelectedGraph = void 0, savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height)) }

function copyEventUp(e) { if (isDraw) { if (isSelectedGraph) { ctx.putImageData(savePoint, 0, 0); var t = getGridpos({ x: isSelectedGraph.x, y: isSelectedGraph.y }),
                a = t.x - isSelectedGraph.x,
                r = t.y - isSelectedGraph.y; "line" == isSelectedGraph.type ? (isSelectedGraph.x += a, isSelectedGraph.y += r, isSelectedGraph.x1 += a, isSelectedGraph.y1 += r) : "curve" == isSelectedGraph.type && (isSelectedGraph.x += a, isSelectedGraph.y += r, isSelectedGraph.x1 += a, isSelectedGraph.y1 += r, isSelectedGraph.cx += a, isSelectedGraph.cy += r), draw(isSelectedGraph), gPush(isSelectedGraph), hPush({ type: "copy" }), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), _selectCircle(isSelectedGraph, 3) } isDraw = !1, isSelectedGraph = void 0, canvas.style.cursor = "pointer" } }

function moveEventUp(e) { if (isDraw) { if (isSelectedGraph) { ctx.putImageData(savePoint, 0, 0); var t = getGridpos({ x: isSelectedGraph.x, y: isSelectedGraph.y }),
                a = t.x - isSelectedGraph.x,
                r = t.y - isSelectedGraph.y; "line" == isSelectedGraph.type ? (isSelectedGraph.x += a, isSelectedGraph.y += r, isSelectedGraph.x1 += a, isSelectedGraph.y1 += r) : "curve" == isSelectedGraph.type && (isSelectedGraph.x += a, isSelectedGraph.y += r, isSelectedGraph.x1 += a, isSelectedGraph.y1 += r, isSelectedGraph.cx += a, isSelectedGraph.cy += r), draw(isSelectedGraph), gPush(isSelectedGraph), hPush({ type: "move", sindex: selectindex, sel: graphClone(isSelectedGraph2), rindex1: gStep, result1: graphClone(isSelectedGraph) }), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), _selectCircle(isSelectedGraph, 3) } isDraw = !1, isSelectedGraph = void 0, canvas.style.cursor = "pointer" } }

function lineEventUp(e) { if (isDraw && startPoint) { ctx.putImageData(savePoint, 0, 0); var t = getGridpos({ x: e.offsetX / curScale, y: e.offsetY / curScale });
        t.x != startPoint.x || t.y != startPoint.y ? (_drawLine({ x: startPoint.x, y: startPoint.y, x1: t.x, y1: t.y, color: lineColor }), gPush({ type: "line", x: startPoint.x, y: startPoint.y, x1: t.x, y1: t.y, color: lineColor }), hPush({ type: "line" }), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), _selectCircle({ type: "line", x: startPoint.x, y: startPoint.y, x1: t.x, y1: t.y }, 3), setStartPointEmpty(), redraw_enable = !0) : redraw_enable = !1, isDraw = !1 } }

function redrawUp(e) { if (isDraw) { ctx.putImageData(savePoint, 0, 0); var t = getGridpos({ x: e.offsetX / curScale, y: e.offsetY / curScale });
        1 == redraw_index ? (graphs[gStep].x = t.x, graphs[gStep].y = t.y) : 2 == redraw_index && (graphs[gStep].x1 = t.x, graphs[gStep].y1 = t.y), draw(graphs[gStep]), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), _selectCircle(graphs[gStep], 3), operationType = histroys[hStep].type, canvas.style.cursor = "crosshair", isDraw = !1, redraw_index = 0 } }

function curveEvenUp(e) { if (isDraw) { if (!makecurve && startPoint) { ctx.putImageData(savePoint, 0, 0); var t = getGridpos({ x: e.offsetX / curScale, y: e.offsetY / curScale });
            t.x == startPoint.x && t.y == startPoint.y ? (makecurve = !1, redraw_enable = !1) : (makecurve = !0, curveinfo = { x: startPoint.x, y: startPoint.y, x1: t.x, y1: t.y }, _drawLine({ x: startPoint.x, y: startPoint.y, x1: t.x, y1: t.y, color: lineColor }), _selectCircle({ type: "line", x: startPoint.x, y: startPoint.y, x1: t.x, y1: t.y }, 3)) } else curveinfo.cx = e.offsetX / curScale, curveinfo.cy = e.offsetY / curScale, makecurve = !1, gPush({ type: "curve", x: curveinfo.x, y: curveinfo.y, x1: curveinfo.x1, y1: curveinfo.y1, cx: curveinfo.cx, cy: curveinfo.cy, color: lineColor }), hPush({ type: "curve" }), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), _selectCircle({ type: "curve", x: curveinfo.x, y: curveinfo.y, x1: curveinfo.x1, y1: curveinfo.y1, cx: curveinfo.cx, cy: curveinfo.cy }, 3), redraw_enable = !0;
        isDraw = !1, setStartPointEmpty() } }

function leaveEvent(e) { if (e || (e = event || window.event), detectLeftButton(e) && !contextmenu) switch (operationType) {
        case "line":
            lineEventUp(e); break;
        case "curve":
            curveEvenUp(e); break;
        case "copy":
            copyEventUp(e) } }

function dblEvent(e) { e || (e = event || window.event) }

function setStartPointEmpty() { startPoint = null }

function isPointInObject(e, t, a) { if ("curve" == e.type) { savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), draw(e); var r = ctx.isPointInPath(t * curScale, a * curScale); return ctx.putImageData(savePoint, 0, 0), r } return "line" == e.type ? isNearLine(e, t, a) : void 0 }

function isNearLine(e, t, a) { var r, i, c, n, o = e.x,
        s = e.x1,
        l = e.y,
        p = e.y1,
        h = 15; if (o !== s) { if (s > o && (o > t || t > s)) return !1; if (o > s && (s > t || t > o)) return !1; if (r = (l - p) / (o - s), i = l - r * o, c = r * t + i, Math.abs(c - a) < h) return !0; if (p > l && (l > a || a > p)) return !1; if (l > p && (p > a || a > l)) return !1; if (r = (o - s) / (l - p), i = o - r * l, n = r * a + i, Math.abs(n - t) < h) return !0 } else if (o == s) { if (p > l && (l > a || a > p)) return !1; if (l > p && (p > a || a > l)) return !1; if (Math.abs(t - o) < h) return !0 } return !1 }

function gPush(e) { gStep++, gStep < graphs.length && (graphs.length = gStep), graphs.push(e) }

function gUndo() { gStep >= 0 && (gStep--, reDrawAll(gStep), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height)) }

function gRedo() { gStep < graphs.length - 1 && (gStep++, reDrawAll(gStep), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height)) }

function hPush(e) { hStep++, hStep < histroys.length && (histroys.length = hStep), histroys.push(e) }

function hUndo() { if (hStep >= 0) { var e = histroys[hStep]; switch (hStep--, e.type) {
            case "line":
            case "curve":
            case "copy":
                gUndo(); break;
            case "delete":
                graphs.splice(e.sindex, 0, e.sel), gStep++, reDrawAll(gStep); break;
            case "move":
                graphs.splice(gStep, 1), graphs.splice(e.sindex, 0, e.sel), reDrawAll(gStep); break;
            case "breaker":
                graphs.splice(gStep - 1, 2), graphs.splice(e.sindex, 0, e.sel), gStep--, reDrawAll(gStep); break;
            case "disable":
                graphs.splice(gStep, 1), graphs.splice(e.sindex, 0, e.sel), reDrawAll(gStep); break;
            case "normal":
                graphs.splice(gStep, 1), graphs.splice(e.sindex, 0, e.sel), reDrawAll(gStep) } savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), gStep >= 0 && _selectCircle(graphs[gStep], 3) } }

function hRedo() { if (hStep >= -1 && histroys.length > hStep + 1) { hStep++; var e = histroys[hStep]; if (!e.type) return; switch (e.type) {
            case "line":
            case "curve":
            case "copy":
                gRedo(); break;
            case "delete":
                graphs.splice(e.sindex, 1), gStep--, reDrawAll(gStep); break;
            case "move":
                graphs.splice(e.sindex, 1), graphs.splice(e.rindex1, 0, e.result1), reDrawAll(gStep); break;
            case "breaker":
                graphs.splice(e.sindex, 1), graphs.splice(e.rindex1, 0, e.result1, e.result2), gStep++, reDrawAll(gStep); break;
            case "disable":
                graphs.splice(e.sindex, 1), graphs.splice(e.rindex1, 0, e.result1), reDrawAll(gStep); break;
            case "normal":
                graphs.splice(e.sindex, 1), graphs.splice(e.rindex1, 0, e.result1), reDrawAll(gStep) } savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height), _selectCircle(graphs[gStep], 3) } }

function menu(e, t) { i.top = t + "px", i.left = e + "px", i.visibility = "visible", i.opacity = "1", $("#menu").show() }


    
    $(".export").click(function() { 
        var e; 
        if (graphs.length > 0) { 
            e = JSON.stringify(graphs.slice(0, gStep + 1)); 
            var t = new Blob([e], { type: "application/json" });
            a = document.createElement("a");
            a.href = URL.createObjectURL(t);
            a.download = "data.json";
            document.body.appendChild(a), a.click(), document.body.removeChild(a) 
        } 
    });
    $(".import").click(function() { 
        $("#load").click() 
    });
    var reader = new FileReader;
    document.getElementById("load").addEventListener("change", function() { 
        this.files[0] && reader.readAsText(this.files[0]) 
    });
    reader.onload = function() { 
        graphs = JSON.parse(reader.result);
        reDrawAll(graphs.length - 1);
        gStep = graphs.length - 1 
    };
    $(".setBackground").click(function() { 
        $("#background").click() 
    });
    $("#background").click(function() { 
        this.value = null 
    });
    $(".straight").click(function() { 
        canvas.style.cursor = "crosshair";
        operationType = "line";
        lineColor = "#000000" 
    });
    $(".curve").click(function() { 
        canvas.style.cursor = "crosshair";
        operationType = "curve";
        lineColor = "#000000";
        makecurve && (makecurve = !1) 
    });
    $(".undo").click(function() { hUndo() });
    $(".redo").click(function() { hRedo() });
    $(".copy").click(function() { 0 > gStep || (canvas.style.cursor = "pointer", operationType = "copy") });
    $(".delete").click(function() { 0 > gStep || (canvas.style.cursor = "pointer", operationType = "delete") });
    $(".grid").click(function() { gridon = !gridon, reDrawAll(gStep) });
    $(".breaker").click(function() { 0 > gStep || (operationType = "breaker", canvas.style.cursor = "col-resize") });
    $(".move").click(function() { 0 > gStep || (operationType = "move", canvas.style.cursor = "pointer") });
    $(".zoomin").click(function() { zoomin(.1) });
    $(".zoomout").click(function() { zoomout(.1) });
    $(".disabled_line").click(function() { canvas.style.cursor = "crosshair", lineColor = "#0000ff", operationType = "line" });
    $(".disabled_curve").click(function() { canvas.style.cursor = "crosshair", lineColor = "#0000ff", operationType = "curve" });
    $("#rBreaker").click(function() {
        isSelectedGraph = graphs.splice(contextinfo.index, 1)[0],
        gStep--, MakeBreaker(contextinfo.index, contextinfo.x, contextinfo.y), contextmenu = !1, contextinfo = null
    });
    $("#rDisable").click(function() { 
            isSelectedGraph = graphs.splice(contextinfo.index, 1)[0], gStep--, MakeDisable(), contextmenu = !1, contextinfo = null });
    $("#rNormal").click(function() { isSelectedGraph = graphs.splice(contextinfo.index, 1)[0], gStep--, MakeNormal(), contextmenu = !1, contextinfo = null });
    $("#rDelete").click(function() { isSelectedGraph = graphs.splice(contextinfo.index, 1)[0], gStep--, SelectDelete(), contextmenu = !1, contextinfo = null });
    $("#rCopy").click(function() { clipbord = graphClone(graphs[contextinfo.index]), contextmenu = !1, contextinfo = null });
    $("#rPaste").click(function() { if (isDraw) { var e = getGridpos({ x: contextinfo.x, y: contextinfo.y });
    t = e.x - clipbord.x,
    a = e.y - clipbord.y;
    clipbord.x += t, clipbord.y += a, clipbord.x1 += t, clipbord.y1 += a, "curve" == clipbord.type && (clipbord.cx += t, clipbord.cy += a);
    draw(clipbord), gPush(clipbord), hPush({ type: "copy" }), savePoint = ctx.getImageData(0, 0, canvas.width, canvas.height);
    _selectCircle(clipbord, 3) } isDraw = !1 
});
var i = document.getElementById("menu").style;
$("#menu").hide();
document.addEventListener ? document.addEventListener("click", function(e) { i.opacity = "0", i.visibility = "hidden", $("#menu").hide() }, !1) : document.attachEvent("onclick", function(e) { i.opacity = "0", i.visibility = "hidden", $("#menu").hide() });