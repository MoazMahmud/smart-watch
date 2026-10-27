# Orbit Index — Watchface Maker Guide

How to rebuild the Orbit Index watch face in Zepp's Watchface Maker for the **Amazfit GTR Mini** (Zepp OS 2.0, round 416 × 416 screen). Every image is already in [`assets/`](assets/); the work is uploading each one and typing in its coordinates.

All coordinates are screen pixels from the top-left corner of the 416 × 416 screen. The centre is (208, 208).

## Before you start

- A computer with Chrome.
- A Zepp developer account, registered and logged in at [watchface.zepp.com](https://watchface.zepp.com).
- The Zepp App on your phone, version 6.6.0 or later, logged in to the **same account** as the Watchface Maker.

| Folder in `assets/` | What's inside |
| --- | --- |
| background | background.png (416 × 416, pure black, Roman hours and small minutes built in), window_cover.png (116 × 90), window_cover_full_416.png |
| pointers | hour_hand.png, minute_hand.png, seconds_ring.png (ticks only) |
| digits_hour | 0–9 for the big hour, white, 51 × 59 each |
| digits_minute | 0–9 for the minute pill, white, 22 × 25 each |
| digits_second | 0–9 for the seconds readout, white, 19 × 22 each |
| digits_date | 0–9 for day and year, grey, 12 × 16 each |
| digits_data | 0–9 and percent.png for steps and battery, white, 13 × 16 each |
| weekday | 1_mon … 7_sun, white, 61 × 21 each |
| month | 01_jan … 12_dec, grey, 33 × 19 each |
| ampm | am.png and pm.png, grey, 22 × 13 each |
| no_data | dash images for any "No data" slot |
| icons | steps.png, battery_0 … battery_9 |
| preview | preview_280.png (Watchface Maker preview), preview_360.png (store listing) |
| reference | two mock-ups (24h and 12h) and layout.json with every coordinate |

## 1. Create the project

1. Go to [watchface.zepp.com](https://watchface.zepp.com) and click **Create**.
2. Fill in the form:
    - **Watchface name:** Orbit Index
    - **Watchface type:** Zepp OS
    - **Resolution:** 416 × 416 (Amazfit GTR Mini)
    - **Supported languages:** English
    - **Preview image:** `preview/preview_280.png`
3. Click **Create**.

## 2. Layer order

Bottom to top. Add components in this order so the layer list matches; you can also drag layers to reorder them.

1. Background
2. Pointer Time: hour hand, minute hand, seconds ring (with the window cover as the second hand's Center View)
3. Digital Time: hour, minute, second, AM/PM
4. Date: day, month, year
5. Week
6. Steps
7. Battery Level

## 3. Components and coordinates

Pick the component from the top bar, select its part in the left list, then upload images and type coordinates in the right panel. For digit sets, upload 0 to 9 in order.

| Component (top bar) | Part | Images to upload | Position (x, y) | Other settings |
| --- | --- | --- | --- | --- |
| Background – Background | Background | background/background.png | (0, 0) | Background Type: Image background |
| Time – Pointer Time | Hour Hand | pointers/hour_hand.png | Watch face centre (208, 208); pointer centre (9, 208) | |
| Time – Pointer Time | Minute Hand | pointers/minute_hand.png | Watch face centre (208, 208); pointer centre (5, 208) | |
| Time – Pointer Time | Second Hand | pointers/seconds_ring.png | Watch face centre (208, 208); pointer centre (208, 208) | Center View: background/window_cover_full_416.png, Center View coordinates (0, 0) |
| Time – Digital Time | Hr | digits_hour/0–9 | (142, 183) | Left align, spacing 0, zero-padded on |
| Time – Digital Time | Min | digits_minute/0–9 | (268, 197) | Do not follow Hr. Left align, spacing 0, zero-padded |
| Time – Digital Time | Sec | digits_second/0–9 | (335, 198) | Do not follow Min. Left align, spacing 0, zero-padded |
| Time – Digital Time | AM/PM | ampm/am.png, ampm/pm.png | (197, 245) | Upload the same two images for every language slot it asks for |
| Date – Date | Day | digits_date/0–9 | (67, 175) | Relationship: Independent. Display Method: Number. Left align, spacing 0, zero-padded |
| Date – Date | Month | month/01_jan … 12_dec | (100, 175) | Display Method: Image |
| Date – Date | Year | digits_date/0–9 | (76, 227) | Left align, spacing 0 |
| Date – Week | Image | weekday/1_mon … 7_sun (Monday first) | (70, 199) | |
| Steps | Number | digits_data/0–9 | (138, 280) | Left align, spacing 0. Icon / data type image: icons/steps.png at (117, 280) |
| Battery Level | Number | digits_data/0–9 | (248, 280) | Left align, spacing 0. Unit image: digits_data/percent.png |
| Battery Level | Level / progress image | icons/battery_0 … battery_9 | (215, 280) | 10 levels, lowest first |

Notes:

- **Seconds ring.** Uploaded as the second hand. The 416 × 416 image rotates around its own centre once a minute, and its ticks run on the same circle as the seconds readout, passing behind the window beside the minute pill.
- **Window cover.** The second hand's **Center View** is drawn above all three hands, which hides the ring beside the minute pill and draws the pill outline. If you use the smaller window_cover.png instead, set the Center View coordinates to (248, 163).
- **12h or 24h.** The hour follows the watch's own time format setting. AM/PM appears under the hour only in 12-hour mode.
- **No data slots.** If a component asks for a "No data" image, use the matching file from `no_data/`.
- **Battery level images.** If Battery Level has no level option, upload icons/battery_7.png as its icon image at (215, 280) instead. The icon then stays at one fill level.

## 4. Always-on display (optional)

In the **Always-on** tab, use a black background, the hour and minute digits at the same positions, and the hour and minute hands. Leave out the seconds ring, seconds, steps and battery to save power on the AMOLED screen.

## 5. Install on your watch

1. Turn on Developer Mode once: Zepp App → **Profile → Settings → About**, tap the Zepp icon 7 times until a pop-up appears.
2. In the Watchface Maker, click **Install** (top right) and wait for the QR code.
3. Zepp App → **Profile** → your GTR Mini → scroll to the bottom → **Developer Mode** (on some app versions it is under Profile → Settings).
4. Tap the scan icon, scan the QR code, then tap **Install**.

Check: the seconds ring turns and the seconds update, the hands point to the right hour and minute, and the date, weekday, steps and battery are correct.

## 6. Troubleshooting

| What you see | Fix |
| --- | --- |
| Hands or ring spin around the wrong point | Watch face centre is always (208, 208); pointer centre is (9, 208) hour, (5, 208) minute, (208, 208) ring |
| Pill outline missing, or ring ticks show beside the minute | The window cover isn't set. Put window_cover_full_416.png in the Second Hand's Center View at (0, 0) |
| Pill shows in the top-left corner | The small window_cover.png is at (0, 0). Set it to (248, 163) or use the full-size file |
| Minute or seconds digits jump next to the hour | Turn off Follow on Min and Sec |
| Weekday shows the wrong day | Re-upload the 7 images Monday first |
| "Action in progress" never finishes | Reload the page; fill any empty "No data" slots; try without an ad blocker or VPN |
| No Developer Mode in the Zepp App | Profile → Settings → About, tap the Zepp icon 7 times; update the app to 6.6.0 or later |
| QR install fails | The Watchface Maker and Zepp App must use the same account, and the project must target the GTR Mini |

## 7. Publish to the store

1. In the Watchface Maker, click **Save**, then **Upload for Approval**. This builds the `.zab` package and creates the entry in the Zepp Console.
2. Zepp Console → **My Service → Watchface → Watch Face Release**. Fill in the fields from [`store/listing.md`](store/listing.md) and upload `assets/preview/preview_360.png` as the round-screen preview.
3. Accept the work statement and click **Submit**. Review usually takes 1–5 working days. Each developer gets 6 submissions per week (resubmissions count), reset every Monday.
4. Check status in the Watch Face List. If rejected, the reason is shown there; use **Edit** to fix and resubmit. After approval, use **Update** to release new versions.

## Sources

- [Device basic information (GTR Mini: API level 2.0, 416 × 416)](https://docs.zepp.com/docs/reference/related-resources/device-list/)
- [Watchface Maker: create a watchface](https://docs.zepp.com/docs/guides/tools/watchface/guides/create/)
- [Watchface Maker: time](https://docs.zepp.com/docs/v2/guides/tools/watchface/guides/time/)
- [Watchface Maker: date and week](https://docs.zepp.com/docs/v2/guides/tools/watchface/guides/date/)
- [Install through scanning QR code](https://docs.zepp.com/docs/guides/tools/watchface/guides/scanCode/)
- [Zepp App developer mode](https://docs.zepp.com/docs/guides/tools/zepp-app/)
- [How to submit a watchface](https://docs.zepp.com/docs/distribute/watchface/)
