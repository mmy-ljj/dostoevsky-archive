# 把「跟作家对话」后端部署到云端

前端（这个仓库的静态页面）已经托管在 GitHub Pages 上：
**https://mmy-ljj.github.io/dostoevsky-archive/**

但 GitHub Pages 只能放静态文件，跑不了 `persona-server.mjs`。这个文件是 Node 服务，
负责三件事：

| 接口 | 作用 |
|---|---|
| `POST /api/character-chat` | 调 DeepSeek 生成某一人物口吻的回复（支持流式） |
| `POST /api/tts` | 调 Azure 语音合成朗读（可选） |
| `/api/admin/config` | 由网页「API 配置」把密钥写进服务端内存 |

所以要让它在线可用，需要把它单独部署到一个能跑 Node 的地方。下面用 **Render 免费层**，全程不花钱。

---

## 一、部署（约 5 分钟，只需点鼠标）

1. 打开 https://dashboard.render.com/ ，点 **Sign in with GitHub**，授权登录。
2. 右上 **New +** → 选 **Blueprint**。
3. 在仓库列表里选 **mmy-ljj/dostoevsky-archive**，点 **Connect**。
   （仓库根目录已经有 `render.yaml`，Render 会自动识别。）
4. 它会让你填两个环境变量，**只填第一个也行**：

   | 变量 | 填什么 |
   |---|---|
   | `CONFIG_ADMIN_TOKEN` | **你自己设一个口令**，例如 `dostoevsky-2026`。记住它，网页里要用同一个 |
   | `AI_API_KEY` | 你的 DeepSeek 密钥，`sk-...`。**不填也能部署**，之后在网页「API 配置」里填 |

5. 点 **Apply / Create**，等 1~2 分钟构建完成。
6. 顶部会出现你的服务域名，形如：
   ```
   https://dostoevsky-persona.onrender.com
   ```
   把它复制下来。

> 免费层说明：服务闲置 15 分钟会休眠，第一次访问要等 30~60 秒唤醒，属正常现象。
> 想要不休眠需付费（$7/月），对你的用途没必要。

---

## 二、让网页连上它

1. 打开 https://mmy-ljj.github.io/dostoevsky-archive/
2. 点右上角 **API 配置**
3. 填：
   - **后端服务地址**：`https://dostoevsky-persona.onrender.com`（你刚才复制的）
   - **后端管理口令**：第一步设的 `CONFIG_ADMIN_TOKEN`
   - **DeepSeek API Key**：如果部署时没填，就在这里填
4. 点 **保存并连接** → 提示「保存成功。对话：已配置」即可。
5. 关掉弹窗、刷新页面，随便点进一个作家，就能真的对话了。

---

## 三、在本地先试一下（可选）

```powershell
cd D:\Dostoevsky-archive-20261104
$env:CONFIG_ADMIN_TOKEN = "dostoevsky-2026"
$env:ALLOWED_ORIGINS = "http://localhost:8089,http://127.0.0.1:8089"
& "C:\Users\10287\.cache\codex-runtimes\codex-primary-runtime\dependencies\node\bin\node.exe" persona-server.mjs
```
然后浏览器打开 http://localhost:8089/ ，在「API 配置」里把后端地址填
`http://localhost:8787`（本地允许 http）。

---

## 四、排错

| 现象 | 原因 | 处理 |
|---|---|---|
| 网页报「来源不被允许」 | 后端 `ALLOWED_ORIGINS` 没包含 `https://mmy-ljj.github.io` | Render → Environment 补上，保存后自动重启 |
| 提示「尚未填写服务端 AI_API_KEY」 | 没填 key 且网页也没提交 | 网页「API 配置」里填 Key，或 Render 环境变量补 `AI_API_KEY` |
| 502 / AI 服务请求失败 | Key 无效、额度用尽、或模型名不对 | 检查 DeepSeek 余额；`AI_MODEL` 用 `deepseek-chat` 或 `deepseek-flash` |
| 401 管理口令不正确 | 网页填的口令与 `CONFIG_ADMIN_TOKEN` 不一致 | 重新填，注意大小写和空格 |
| 首次请求等很久 | 免费层冷启动 | 等 30~60 秒，之后会快 |
| 语音没声音 | 没配 `AZURE_SPEECH_KEY` | 不配就只用文字回答，不影响对话 |

---

## 五、安全须知

- `.env` **永远不要提交**（`.gitignore` 已挡住）。
- `CONFIG_ADMIN_TOKEN` 相当于这个后端的管理密码，别用太简单的。
- 通过网页写入的密钥只存在**服务端内存**里，服务重启（含免费层休眠后重启）会丢失，需要重新填；
  想长期保留就写进 Render 的 Environment 变量。
- 这个后端做了限流：对话 10 次/分钟/IP，语音 10 次/分钟/IP，正文最大 32 KB。
