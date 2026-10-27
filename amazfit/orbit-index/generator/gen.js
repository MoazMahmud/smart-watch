// Generates every PNG for the Amazfit GTR Mini (416x416) monochrome watch face.
// Returns { files: {path: dataURL}, layout: {...} }
async function generate() {
  await document.fonts.ready;
  const FD = '"RHD"', FM = '"RHM"';
  const DEG = Math.PI / 180;
  const M = {
    hi: "#ffffff", text: "#c9ccd2", mid: "#8e939b", dim: "#61666e",
    tick: "#3a3d43", tickMajor: "#555a61", dial: "#050506", rail: "#17181b",
  };
  const files = {};
  const layout = {};
  const cv = (w, h) => { const c = document.createElement("canvas"); c.width = w; c.height = h; return c; };
  const save = (path, c) => { files[path] = c.toDataURL("image/png"); };
  const rr = (x, X, Y, w, h, r) => {
    x.beginPath(); x.moveTo(X + r, Y); x.arcTo(X + w, Y, X + w, Y + h, r); x.arcTo(X + w, Y + h, X, Y + h, r);
    x.arcTo(X, Y + h, X, Y, r); x.arcTo(X, Y, X + w, Y, r); x.closePath();
  };
  const disc = (x, r, fill) => { x.beginPath(); x.arc(0, 0, r, 0, Math.PI * 2); x.fillStyle = fill; x.fill(); };

  // ---------- background: dial to the edge, rail, fixed minute dial ----------
  const bg = cv(416, 416); {
    const x = bg.getContext("2d");
    x.fillStyle = "#000"; x.fillRect(0, 0, 416, 416);
    x.translate(208, 208);
    disc(x, 208, "#000"); // pure black: no glow on the AMOLED screen
    x.lineWidth = 1; x.strokeStyle = M.rail;
    x.beginPath(); x.arc(0, 0, 200, 0, Math.PI * 2); x.stroke();
    // minute ticks between the hour positions
    const R = 186;
    x.strokeStyle = M.tick; x.lineWidth = 1.2;
    for (let i = 0; i < 60; i++) {
      if (i % 5 === 0) continue;
      const a = (i * 6 - 90) * DEG, ca = Math.cos(a), sa = Math.sin(a);
      x.beginPath(); x.moveTo(ca * (R - 4), sa * (R - 4)); x.lineTo(ca * (R + 4), sa * (R + 4)); x.stroke();
    }
    x.textAlign = "center"; x.textBaseline = "middle";
    // Roman hour numerals, small minute numbers just inside (15 left out: the seconds readout sits there)
    const ROM = ["XII", "I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI"];
    x.font = `600 19px ${FD}`; x.fillStyle = M.text;
    for (let i = 0; i < 12; i++) {
      const a = (i * 30 - 90) * DEG;
      x.fillText(ROM[i], Math.cos(a) * 187, Math.sin(a) * 187 + 1);
    }
    x.font = `600 12px ${FD}`; x.fillStyle = M.mid;
    for (let i = 0; i < 12; i++) {
      if (i === 3) continue;
      const a = (i * 30 - 90) * DEG;
      x.fillText(String(i * 5).padStart(2, "0"), Math.cos(a) * 163, Math.sin(a) * 163 + 1);
    }
  }
  save("background/background.png", bg);

  // ---------- seconds ring (uploaded as the second hand) ----------
  function ring(withLabels) {
    const c = cv(416, 416), x = c.getContext("2d");
    x.translate(208, 208);
    for (let i = 0; i < 60; i++) {
      const a = -i * 6 * DEG, ca = Math.cos(a), sa = Math.sin(a), major = i % 5 === 0;
      x.beginPath();
      x.moveTo(ca * (major ? 139 : 142), sa * (major ? 139 : 142)); x.lineTo(ca * (major ? 151 : 149), sa * (major ? 151 : 149));
      x.lineWidth = major ? 1.6 : 1; x.strokeStyle = major ? M.tickMajor : M.tick; x.stroke();
    }
    if (withLabels) {
      x.font = `500 15px ${FD}`; x.fillStyle = M.dim; x.textAlign = "center"; x.textBaseline = "middle";
      for (let v = 0; v < 60; v += 5) {
        const a = -v * 6 * DEG;
        x.save(); x.translate(Math.cos(a) * 146, Math.sin(a) * 146); x.rotate(a + Math.PI / 2);
        x.fillText(String(v).padStart(2, "0"), 0, 1); x.restore();
      }
    }
    return c;
  }
  save("pointers/seconds_ring.png", ring(false));

  // ---------- window cover: hides the ring beside the minute pill, draws the pill ----------
  const CV = { x: 248, y: 163, w: 116, h: 90 };
  const cover = cv(CV.w, CV.h); {
    const x = cover.getContext("2d");
    x.drawImage(bg, -CV.x, -CV.y);
    x.globalCompositeOperation = "destination-in";
    x.translate(208 - CV.x, 208 - CV.y);
    // one combined mask (sector + pill) filled once; two separate destination-in fills would intersect
    const mask = new Path2D();
    mask.arc(0, 0, 156, -16 * DEG, 16 * DEG); mask.arc(0, 0, 134, 16 * DEG, -16 * DEG, true); mask.closePath();
    mask.moveTo(44 + 25, -25); mask.arcTo(120, -25, 120, 25, 25); mask.arcTo(120, 25, 44, 25, 25);
    mask.arcTo(44, 25, 44, -25, 25); mask.arcTo(44, -25, 120, -25, 25); mask.closePath();
    x.fillStyle = "#000"; x.fill(mask, "nonzero");
    x.globalCompositeOperation = "source-over";
    rr(x, 46, -23, 72, 46, 23); x.lineWidth = 2; x.strokeStyle = M.hi; x.stroke();
  }
  save("background/window_cover.png", cover);
  const coverFull = cv(416, 416); coverFull.getContext("2d").drawImage(cover, CV.x, CV.y);
  save("background/window_cover_full_416.png", coverFull);
  layout.cover = { x: CV.x, y: CV.y };

  // ---------- hands ----------
  const hour = cv(18, 228); {
    const x = hour.getContext("2d"); x.translate(9, 208);
    x.lineCap = "round"; x.globalAlpha = 0.24; x.strokeStyle = M.hi; x.lineWidth = 10;
    x.beginPath(); x.moveTo(0, 14); x.lineTo(0, -108); x.stroke();
    x.globalAlpha = 1;
    x.beginPath(); x.moveTo(-8, -207); x.lineTo(8, -207); x.lineTo(3, -194); x.lineTo(-3, -194); x.closePath();
    x.fillStyle = M.mid; x.fill();
  }
  save("pointers/hour_hand.png", hour);
  const minute = cv(10, 229); {
    const x = minute.getContext("2d"); x.translate(5, 208);
    x.lineCap = "round"; x.globalAlpha = 0.16; x.strokeStyle = M.hi; x.lineWidth = 5;
    x.beginPath(); x.moveTo(0, 18); x.lineTo(0, -158); x.stroke();
    x.globalAlpha = 1;
    rr(x, -2, -207, 4, 13, 2); x.fillStyle = M.hi; x.fill();
  }
  save("pointers/minute_hand.png", minute);
  layout.hourHand = { w: 18, h: 228, cx: 9, cy: 208 };
  layout.minuteHand = { w: 10, h: 229, cx: 5, cy: 208 };

  // ---------- image fonts ----------
  function glyphSet(dir, font, color, items, spacing = "0px") {
    const m = cv(4, 4).getContext("2d"); m.font = font; if ("letterSpacing" in m) m.letterSpacing = spacing;
    let w = 0, asc = 0, desc = 0;
    for (const it of items) {
      const mt = m.measureText(it.text);
      w = Math.max(w, mt.actualBoundingBoxLeft + mt.actualBoundingBoxRight);
      asc = Math.max(asc, mt.actualBoundingBoxAscent); desc = Math.max(desc, mt.actualBoundingBoxDescent);
    }
    const W = Math.ceil(w) + 2, H = Math.ceil(asc + desc) + 2, base = Math.ceil(asc) + 1;
    for (const it of items) {
      const c = cv(W, H), x = c.getContext("2d");
      x.font = font; if ("letterSpacing" in x) x.letterSpacing = spacing;
      const mt = x.measureText(it.text);
      const gw = mt.actualBoundingBoxLeft + mt.actualBoundingBoxRight;
      x.fillStyle = color; x.textBaseline = "alphabetic"; x.textAlign = "left";
      x.fillText(it.text, (W - gw) / 2 + mt.actualBoundingBoxLeft, base);
      save(`${dir}/${it.file}.png`, c);
    }
    return { w: W, h: H };
  }
  const digits = [...Array(10).keys()].map((d) => ({ text: String(d), file: String(d) }));
  const sz = {};
  sz.hour = glyphSet("digits_hour", `700 78px ${FD}`, M.hi, digits);
  sz.minute = glyphSet("digits_minute", `700 30px ${FD}`, M.hi, digits);
  sz.second = glyphSet("digits_second", `700 26px ${FD}`, M.hi, digits);
  sz.date = glyphSet("digits_date", `600 17px ${FM}`, M.mid, digits);
  sz.data = glyphSet("digits_data", `600 18px ${FM}`, M.hi, [...digits, { text: "%", file: "percent" }]);
  const WEEK = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];
  sz.week = glyphSet("weekday", `700 24px ${FD}`, M.hi,
    WEEK.map((t, i) => ({ text: t, file: `${i + 1}_${t.toLowerCase()}` })), "1px");
  const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  sz.month = glyphSet("month", `600 17px ${FM}`, M.mid,
    MON.map((t, i) => ({ text: t, file: `${String(i + 1).padStart(2, "0")}_${t.toLowerCase()}` })));
  glyphSet("no_data", `600 17px ${FM}`, M.mid, [{ text: "--", file: "date_no_data" }]);
  glyphSet("no_data", `600 18px ${FM}`, M.hi, [{ text: "--", file: "steps_battery_no_data" }]);
  glyphSet("no_data", `700 24px ${FD}`, M.hi, [{ text: "--", file: "week_no_data" }]);
  sz.ampm = glyphSet("ampm", `600 15px ${FM}`, M.mid, [{ text: "AM", file: "am" }, { text: "PM", file: "pm" }], "1px");

  // ---------- icons ----------
  const foot = cv(16, 16); {
    const x = foot.getContext("2d"); x.fillStyle = M.text;
    x.beginPath(); x.ellipse(4.5, 10, 3, 5, -0.2, 0, Math.PI * 2); x.fill();
    x.beginPath(); x.ellipse(11.5, 6, 3, 5, 0.2, 0, Math.PI * 2); x.fill();
  }
  save("icons/steps.png", foot);
  for (let i = 0; i < 10; i++) {
    const c = cv(27, 16), x = c.getContext("2d");
    x.lineWidth = 1.6; x.strokeStyle = M.mid;
    rr(x, 1, 1, 22, 14, 3); x.stroke();
    x.fillStyle = M.mid; x.fillRect(23.5, 5, 2.5, 6);
    x.fillStyle = M.hi; rr(x, 3, 3, Math.max(1.5, 18 * (i + 1) / 10), 10, 1.5); x.fill();
    save(`icons/battery_${i}.png`, c);
  }

  // ---------- positions (screen pixels, top-left of each image) ----------
  const r = Math.round;
  layout.hour = { x: 193 - sz.hour.w, y: r(212 - sz.hour.h / 2), cell: sz.hour };
  layout.ampm = { x: r(208 - sz.ampm.w / 2), y: r(251 - sz.ampm.h / 2), cell: sz.ampm };
  layout.minute = { x: 290 - sz.minute.w, y: r(209 - sz.minute.h / 2), cell: sz.minute };
  layout.second = { x: 354 - sz.second.w, y: r(209 - sz.second.h / 2), cell: sz.second };
  const gap = 9, total = 2 * sz.date.w + gap + sz.month.w, left = r(100 - total / 2);
  layout.day = { x: left, y: r(183 - sz.date.h / 2), cell: sz.date };
  layout.month = { x: left + 2 * sz.date.w + gap, y: r(183 - sz.date.h / 2), cell: sz.month };
  layout.week = { x: r(100 - sz.week.w / 2), y: r(209 - sz.week.h / 2), cell: sz.week };
  layout.year = { x: r(100 - 2 * sz.date.w), y: r(235 - sz.date.h / 2), cell: sz.date };
  // steps + battery row, sized for 5-digit steps and "100%", centred on the screen
  const cw = sz.data.w, rowW = 16 + 5 + 5 * cw + 12 + 27 + 6 + 4 * cw;
  let rx = r(208 - rowW / 2); const ry = 288;
  layout.stepsIcon = { x: rx, y: ry - 8 }; rx += 16 + 5;
  layout.steps = { x: rx, y: r(ry - sz.data.h / 2), cell: sz.data }; rx += 5 * cw + 12;
  layout.batteryIcon = { x: rx, y: ry - 8 }; rx += 27 + 6;
  layout.battery = { x: rx, y: r(ry - sz.data.h / 2), cell: sz.data };

  // ---------- assembled mock using only the exported images ----------
  const load = (src) => new Promise((res) => { const im = new Image(); im.onload = () => res(im); im.src = src; });
  const img = {};
  for (const [k, v] of Object.entries(files)) img[k] = await load(v);
  function compose(hh, mm, ss, wd, day, mon, year, steps, batt, pm) {
    const c = cv(416, 416), x = c.getContext("2d");
    x.drawImage(img["background/background.png"], 0, 0);
    const rot = (im, deg, cx, cy) => { x.save(); x.translate(208, 208); x.rotate(deg * DEG); x.drawImage(im, -cx, -cy); x.restore(); };
    const m = mm + ss / 60, h = (hh % 12) + m / 60;
    rot(img["pointers/hour_hand.png"], h * 30, 9, 208);
    rot(img["pointers/minute_hand.png"], m * 6, 5, 208);
    rot(img["pointers/seconds_ring.png"], ss * 6, 208, 208);
    x.drawImage(img["background/window_cover.png"], layout.cover.x, layout.cover.y);
    const num = (dir, s, L) => { [...s].forEach((ch, i) => x.drawImage(img[`${dir}/${ch === "%" ? "percent" : ch}.png`], L.x + i * L.cell.w, L.y)); };
    num("digits_hour", String(hh).padStart(2, "0"), layout.hour);
    if (pm !== undefined) x.drawImage(img[`ampm/${pm ? "pm" : "am"}.png`], layout.ampm.x, layout.ampm.y);
    num("digits_minute", String(mm).padStart(2, "0"), layout.minute);
    num("digits_second", String(ss).padStart(2, "0"), layout.second);
    num("digits_date", String(day).padStart(2, "0"), layout.day);
    x.drawImage(img[`month/${String(mon).padStart(2, "0")}_${MON[mon - 1].toLowerCase()}.png`], layout.month.x, layout.month.y);
    x.drawImage(img[`weekday/${wd}_${WEEK[wd - 1].toLowerCase()}.png`], layout.week.x, layout.week.y);
    num("digits_date", String(year), layout.year);
    x.drawImage(img["icons/steps.png"], layout.stepsIcon.x, layout.stepsIcon.y);
    num("digits_data", String(steps), layout.steps);
    x.drawImage(img[`icons/battery_${Math.min(9, Math.floor(batt / 10))}.png`], layout.batteryIcon.x, layout.batteryIcon.y);
    num("digits_data", `${batt}%`, layout.battery);
    x.globalCompositeOperation = "destination-in";
    x.beginPath(); x.arc(208, 208, 208, 0, Math.PI * 2); x.fill();
    return c;
  }
  const mock = compose(10, 8, 36, 2, 27, 10, 2026, 8432, 78, false);
  const pv = cv(280, 280); {
    const x = pv.getContext("2d"); x.imageSmoothingQuality = "high"; x.drawImage(mock, 0, 0, 280, 280);
  }
  const extra = { "preview/preview_280.png": pv.toDataURL("image/png"), "_mock_416.png": mock.toDataURL("image/png"),
    "_mock_416_b.png": compose(9, 47, 5, 1, 1, 3, 2027, 15230, 100, true).toDataURL("image/png") };
  return { files: { ...files, ...extra }, layout };
}
