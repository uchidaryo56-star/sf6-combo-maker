# スト6コンボメーカー

ストリートファイター6用の練習支援Webアプリ。コンボ・フレームデータ・セットプレイ・マッチアップメモ・用語集を1つにまとめたツールです。

- フレームデータはJP（公式サイト準拠）を収録
- コンボ／セットプレイに動画（YouTubeリンク or ローカル動画ファイル）を埋め込み可能
- 確反逆引き（硬直差を入れると確定反撃できる技を自動判定）
- 各ユーザーの追加データ（コンボ・動画・メモ・お気に入り）はブラウザ内に保存（サーバー送信なし）

---

## ファイル構成

### 配信に必要（これだけで動く）
| ファイル | 役割 |
|---|---|
| `index.html` | 画面 |
| `app.js` | アプリ本体のロジック |
| `data.js` | キャラのフレーム／コンボ等のデータ |
| `glossary.js` | 用語集データ |

### 自分用ツール（配信しても害はないが無くても動く）
| ファイル | 役割 |
|---|---|
| `parse_frames.js` | 公式フレームページHTML → JSON 抽出 |
| `gen_data.js` | `jp_parsed.json` 等から `data.js` を生成 |

---

## 公開（GitHub Pages）手順

1. GitHubで新しいリポジトリを作成（例: `sf6-combo-maker`、Public）
2. このフォルダで以下を実行（`<URL>` は作成したリポジトリのURL）:
   ```bash
   git remote add origin <URL>
   git branch -M main
   git push -u origin main
   ```
3. GitHubのリポジトリ → **Settings → Pages** → Build and deployment の Source を **Deploy from a branch**、Branch を **main / (root)** にして Save
4. 数十秒後 `https://<ユーザー名>.github.io/sf6-combo-maker/` で公開される
5. このURLを配布する

> もっと手軽にやるなら [Netlify Drop](https://app.netlify.com/drop) にこのフォルダをドラッグ&ドロップでも即公開できます（独自更新はサイト管理画面から再アップ）。

---

## 更新を全員に反映する方法

公開後は「URLを配る」だけ。あなたが修正して再デプロイすれば、各ユーザーが次に開いたとき最新になります。

```bash
# 例: 用語やフレームを直したあと
git add -A
git commit -m "用語集を更新"
git push
```

ユーザーが追加したコンボ・動画・メモは各自のブラウザに残るため、更新で消えることはありません。

### キャッシュで古いまま表示される場合
`index.html` 末尾の `?v=1.0.0` と、ヘッダーの `v1.0.0` 表示を更新ごとに上げてください（例: `1.0.1`）。これで確実に最新ファイルが配信されます。画面右上のバージョン表示で、ユーザーがどの版を見ているか分かります。

---

## データの編集

- **用語集**: `glossary.js` の配列を編集
  ```js
  { term:"用語名", read:"よみ 英語 別名(検索用)", cat:"カテゴリ", def:"意味" },
  ```
- **コンボ／セットプレイ／キャラ**: `data.js` を編集
- **フレームデータの再取得**（公式サイト更新時など）:
  ```bash
  # 1. 公式フレームページのHTMLを保存して jp_frame.html とする
  node parse_frames.js jp_frame.html jp_parsed.json
  node gen_data.js
  ```
