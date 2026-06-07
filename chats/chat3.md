# 月經週期飲食運動指南

_Started 2026-06-05 15:03 UTC_

---

## User

修正飲食與運動建議策略

1. 生理期｜策略：補血修復，溫和舒緩身體狀態：身體處於代謝低谷、容易疲倦，黃體素與雌激素分泌下降，常伴隨水腫。飲食策略：補鐵與補血：多攝取紅肉（牛肉、豬肝）、深綠色蔬菜（菠菜）以補充流失的鐵質。溫暖子宮：避免生冷食物、冰品及過多甜食，以防加重經痛。消水腫：可補充富含鉀離子的食物（如香蕉、黑豆水）。運動策略：以休息為主，停止高強度訓練。建議進行 15-20 分鐘的溫和伸展、瑜珈或散步，幫助骨盆腔血液循環、舒緩經期不適。

2. 超速期｜策略：黃金減脂，高強度燃燒身體狀態：雌激素分泌旺盛，新陳代謝與消化功能達到巔峰，精神愉快、食慾好控制，是減重的黃金期。飲食策略：控制總熱量：執行較嚴格的低 GI（升糖指數）飲食，嚴格避開精緻糖與零食。補充雌激素：可適量攝取山藥、黃豆製品（如豆漿、豆腐）幫助代謝。優質蛋白：確保攝取足夠的瘦肉、魚類與蛋類，維持肌肉量。運動策略：火力全開：這是燃脂的最佳時機！安排一週 3-4 次的 有氧運動（如跑步、飛輪、游泳）。搭配 重量訓練 效果更佳，能加速全身代謝。

3. 平快期｜策略：維持代謝，燃脂高原期身體狀態：濾泡期結束，雌激素下降，黃體素開始上升。代謝速度從極速降為平穩，體重下降幅度會變小，但仍可持續減脂。飲食策略：穩定血糖：多攝取高纖維蔬果及全穀雜糧（如燕麥、地瓜）增加飽足感，避免暴飲暴食。熱量控制：維持清淡飲食，三餐定時定量。運動策略：有氧與重訓交替：維持規律運動習慣，可採取間歇性訓練（HIIT），幫助突破減肥停滯期。

4. 休息期｜策略：控制食慾，消解水腫身體狀態：黃體素分泌達顛峰，開始出現經前症候群（PMS），情緒易波動、腸胃蠕動變慢、容易水腫與嘴饞。飲食策略：抗水腫與控口慾：飲食要「低油、低鹽、低糖」，以防水分滯留；多吃高鉀食物（如芹菜、冬瓜）。對抗甜食渴望：想吃甜食時，改以低糖水果（如芭樂、蘋果）、原味堅果代替。運動策略：緩和伸展：隨著身體逐漸疲憊，運動強度應逐漸調降。建議多做 皮拉提斯、瑜珈或核心訓練，以放鬆緊繃肌肉、穩定情緒為主。

## Assistant

_[tool: list_files]_

I'll start by exploring the existing project files to understand the context.

_[tool: read_file]_

_[tool: read_file]_

Let me look at the existing app structure and design.

_[tool: grep]_

_[tool: grep]_

The user has given me refined strategy content for the 4 phases. Let me check how the data fields are consumed before I update them.

_[tool: read_file]_

_[tool: read_file]_

The content maps onto the existing phase data. The new material adds a distinct **運動策略 (exercise strategy)** for each phase that the current UI folds into prose. Let me read the relevant rendering sections of app.jsx and mobile-app.jsx to surface it cleanly.

_[tool: update_todos]_

_[tool: read_file]_

_[tool: read_file]_

I have a clear picture. The refined content introduces a distinct **運動策略 (exercise strategy)** per phase that the current data model folds into prose. I'll add `exercise` as a first-class field, update all the content, and surface it in the desktop hero, the reference table, and mobile.

Let me set up my plan and read the mobile rendering spots.Now I'll update the data. First, the PHASES content in data.js:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now the desktop hero — add the exercise block and include it in the AskAi prompt:

_[tool: str_replace_edit]_

Now the reference table row:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Now add CSS for the desktop exercise block:Now mobile — add exercise to the today explain card and the reference cards:

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

Let me find the mobile CSS to style the new exercise blocks:

_[tool: read_file]_

_[tool: read_file]_

_[tool: str_replace_edit]_

_[tool: update_todos]_

_[tool: show_html]_

_[tool: show_html]_

_[tool: grep]_

The hero is collapsed and the advice still shows old steady text — possibly the service worker cached `data.js`. Let me verify the data actually updated and expand the hero.

_[tool: read_file]_

Data is correct. The preview showed stale advice — likely the service worker (`sw.js`) is serving a cached `data.js`. Let me check its caching strategy since that would affect the user too.

_[tool: str_replace_edit]_

The service worker uses stale-while-revalidate, so it served the old `data.js`. I'll bump the cache version so the stale cache is purged on next load.Now let me expand the hero to verify the new exercise block renders. Let me force fresh data and expand:

_[tool: eval_js]_

_[tool: show_html]_

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: eval_js]_

Fresh data is loading now ("維持代謝、穩定血糖..."). Let me scroll to see the new exercise block in the strategy area:

_[tool: save_screenshot]_

_[tool: show_html]_

The 運動策略 block renders correctly with its accent border, label, and text. Let me verify mobile quickly, then finalize.

_[tool: eval_js]_

Mobile exercise block renders too. Everything's wired. Let me finalize.

_[tool: done]_

_[tool: fork_verifier_agent]_

I've updated the dashboard with your refined diet + exercise strategy. Key changes:

- **New 運動策略 (exercise strategy)** is now a first-class field per phase — surfaced as an accented block in the desktop hero, a new row in the reference comparison table, and its own card section on mobile.
- **Rewrote all four phases'** content (策略 headline, 身體狀態, 飲食策略, advice) to match your revised text, including renaming the diet column to 飲食策略.
- The AI advisor now factors in each phase's exercise strategy too.
- Bumped the service-worker cache so users get the new content on next load.

One thing to confirm: I kept phase 4's name as **經前休息期** (your text shortened it to "休息期") — say the word if you'd like it renamed.

