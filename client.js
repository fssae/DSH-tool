window.__ModuleLoader__.load({
  id: "trae2api-dsh",
  factory(require) {
    const React = require("react"),
      h = React.createElement,
      panel = "trae-relay-console";
    // Placeholder for the interpreter field. Left empty so the runtime's own
    // auto-discovery (python3 -> python -> py -3) applies; once an environment
    // has been prepared, status reports the interpreter actually used and the
    // field shows that concrete path instead.
    const DEFAULT_PYTHON = "";
    const css = `
      .tr-console{height:100%;min-height:0;display:flex;flex-direction:column;color:var(--dsw-alias-label-primary);background:var(--dsw-alias-bg-layer-1)}
      .tr-header{display:flex;gap:10px;align-items:center;flex-wrap:wrap;padding:14px 18px;border-bottom:1px solid var(--dsw-alias-border-l2);flex-shrink:0}
      .tr-heading{flex:1;min-width:180px}.tr-heading h1{margin:0;font-size:16px;line-height:24px;font-weight:600}
      .tr-muted{font-size:12px;line-height:1.7;color:var(--dsw-alias-label-secondary)}
      .tr-button{font:inherit;font-size:12px;line-height:18px;text-decoration:none;color:inherit;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);border-radius:7px;padding:6px 10px;cursor:pointer;white-space:nowrap}
      .tr-button:hover{background:var(--dsw-alias-bg-layer-3,var(--dsw-alias-bg-layer-2))}.tr-button:disabled{opacity:.5;cursor:default}
      .tr-button:focus-visible,.tr-input:focus-visible{outline:2px solid var(--dsw-alias-label-primary);outline-offset:2px}
      .tr-frame{display:block;flex:1;width:100%;min-height:0;border:0}.tr-settings{flex:1;overflow:auto;padding:24px}.tr-wrap{max-width:760px;margin:auto}
      .tr-card{border:1px solid var(--dsw-alias-border-l2);border-radius:10px;padding:18px;margin:16px 0;background:var(--dsw-alias-bg-layer-2)}.tr-card h2{font-size:16px;margin:0 0 12px}
      .tr-row{display:flex;gap:12px;align-items:center;flex-wrap:wrap;margin:12px 0}.tr-field{display:flex;flex-direction:column;gap:7px;flex:1;min-width:180px;font-size:13px}
      .tr-input{font:inherit;font-size:13px;padding:8px;border:1px solid var(--dsw-alias-border-l2);border-radius:7px;background:var(--dsw-alias-bg-layer-1);color:inherit;width:100%;box-sizing:border-box}
      .tr-error{font-size:13px;padding:12px;border:1px solid #ba5151;color:#d97878;border-radius:8px;margin:12px 0;white-space:pre-wrap}.tr-notice{font-size:13px;line-height:1.7;margin:12px 0}.tr-code{font-size:12px;overflow-wrap:anywhere}
      @media(max-width:640px){.tr-heading{flex-basis:100%}.tr-settings{padding:14px}.tr-field{flex-basis:100%}}
      /* ---- visual polish ---- */
      .tr-header{background:linear-gradient(180deg,var(--dsw-alias-bg-layer-2),transparent)}
      .tr-heading h1{letter-spacing:.2px;display:flex;align-items:center;gap:8px}
      .tr-badge{font-size:11px;line-height:16px;font-weight:600;padding:1px 8px;border-radius:999px;border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-secondary);white-space:nowrap}
      .tr-badge[data-state="running"]{border-color:#3f9d63;color:#4fb573;background:rgba(79,181,115,.12)}
      .tr-badge[data-state="starting"],.tr-badge[data-state="preparing"]{border-color:#b8912f;color:#d0a83f;background:rgba(208,168,63,.12)}
      .tr-badge[data-state="error"]{border-color:#ba5151;color:#d97878;background:rgba(217,120,120,.12)}
      .tr-button{transition:background .15s,border-color .15s,transform .05s;display:inline-flex;align-items:center;gap:6px}
      .tr-button:active:not(:disabled){transform:translateY(1px)}
      .tr-button.tr-primary{background:var(--dsw-alias-label-primary);color:var(--dsw-alias-bg-layer-1);border-color:transparent;font-weight:600}
      .tr-button.tr-primary:hover:not(:disabled){opacity:.9}
      .tr-button.tr-ghost{background:transparent}
      .tr-card{box-shadow:0 1px 2px rgba(0,0,0,.12);transition:border-color .15s}
      .tr-card:hover{border-color:var(--dsw-alias-border-l1,var(--dsw-alias-border-l2))}
      .tr-card h2{display:flex;align-items:center;gap:8px}
      .tr-step{display:inline-flex;align-items:center;justify-content:center;width:20px;height:20px;border-radius:999px;font-size:11px;font-weight:700;background:var(--dsw-alias-bg-layer-3,var(--dsw-alias-bg-layer-2));border:1px solid var(--dsw-alias-border-l2);flex-shrink:0}
      .tr-steps{display:grid;gap:10px;margin:12px 0 0;padding:0;list-style:none}
      .tr-steps li{display:flex;gap:10px;align-items:flex-start;font-size:13px;line-height:1.7}
      .tr-hint{font-size:12px;line-height:1.7;color:var(--dsw-alias-label-secondary);margin:10px 0 0;padding:10px 12px;border-left:2px solid var(--dsw-alias-border-l2);background:var(--dsw-alias-bg-layer-1);border-radius:0 6px 6px 0}
      .tr-hint code,.tr-doc code{font-size:11.5px;padding:1px 5px;border-radius:4px;background:var(--dsw-alias-bg-layer-3,var(--dsw-alias-bg-layer-1));border:1px solid var(--dsw-alias-border-l2)}
      /* ---- help document ---- */
      .tr-doc{flex:1;overflow:auto;padding:24px}.tr-doc .tr-wrap{max-width:820px}
      .tr-doc h2{font-size:15px;margin:26px 0 10px;padding-bottom:8px;border-bottom:1px solid var(--dsw-alias-border-l2)}
      .tr-doc h2:first-child{margin-top:0}
      .tr-doc p,.tr-doc li{font-size:13px;line-height:1.8;color:var(--dsw-alias-label-primary)}
      .tr-doc ol,.tr-doc ul{margin:8px 0;padding-left:22px}
      .tr-doc li{margin:4px 0}
      .tr-doc table{width:100%;border-collapse:collapse;margin:10px 0;font-size:12.5px}
      .tr-doc th,.tr-doc td{text-align:left;padding:8px 10px;border-bottom:1px solid var(--dsw-alias-border-l2);vertical-align:top}
      .tr-doc th{color:var(--dsw-alias-label-secondary);font-weight:600;background:var(--dsw-alias-bg-layer-2)}
      .tr-doc pre{margin:10px 0;padding:12px 14px;border-radius:8px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);overflow:auto;font-size:12px;line-height:1.7}
      .tr-faq{border:1px solid var(--dsw-alias-border-l2);border-radius:8px;padding:0;margin:10px 0;background:var(--dsw-alias-bg-layer-1);overflow:hidden}
      .tr-faq summary{cursor:pointer;padding:11px 14px;font-size:13px;font-weight:600;list-style:none;display:flex;align-items:center;gap:8px}
      .tr-faq summary::-webkit-details-marker{display:none}
      .tr-faq summary::before{content:"▸";font-size:10px;color:var(--dsw-alias-label-secondary);transition:transform .15s}
      .tr-faq[open] summary::before{transform:rotate(90deg)}
      .tr-faq>div{padding:0 14px 12px 32px;font-size:13px;line-height:1.8;color:var(--dsw-alias-label-secondary)}
      .tr-faq code{font-size:11.5px;padding:1px 5px;border-radius:4px;background:var(--dsw-alias-bg-layer-2);border:1px solid var(--dsw-alias-border-l2);color:var(--dsw-alias-label-primary)}
    `;
    function Icon({ size = 18 }) {
      return h(
        "svg",
        {
          width: size,
          height: size,
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: "currentColor",
          strokeWidth: 1.7,
          "aria-hidden": true,
        },
        h("rect", { x: 3, y: 3, width: 18, height: 18, rx: 3 }),
        h("path", { d: "M3 8h18 M7 12l3 3-3 3 M13 18h4" }),
      );
    }
    function HelpDoc({ onBack, state }) {
      const faq = [
        [
          '打开控制台时提示 {"error":"Open the console from DSH"}',
          '这是安全设计，并非故障。控制台只接受由 DSH 当场签发的临时入口票据（30 秒有效），直接拿浏览器访问代理端口或刷新旧链接都会被拒绝。请始终通过左侧「TRAE 控制台」→「新窗口打开」进入。',
        ],
        [
          '启动服务失败 / 服务起不来',
          '① 先点「准备环境」完成 Python 虚拟环境与依赖安装；② 检查服务设置里的端口是否被占用；③ 查看数据目录下的 relay.log 末尾报错。',
        ],
        [
          'token 过期',
          '插件会在 token 到期前自动刷新。若刷新失败（refreshToken 也过期），在 Trae 客户端里退出并重新登录，再回到此处点「导入当前桌面账号」。',
        ],
        [
          '模型列表里看不到 TRAE 模型',
          '在控制台「DSH 模型管理」里把要用的模型设为显示；已隐藏的模型不会出现在对话输入框的模型菜单中。',
        ],
        [
          '控制台里出现的 Invalid port / 代理相关报错',
          '通常是系统环境变量 NO_PROXY 中存在 [::1] 这类带方括号的写法，导致 httpx 解析失败。删除方括号（写成 ::1）后重启服务即可。',
        ],
      ];
      return h(
        'div',
        { className: 'tr-doc' },
        h(
          'div',
          { className: 'tr-wrap' },
          h('h2', null, '这个插件做什么'),
          h(
            'p',
            null,
            '把你在 Trae CN / TRAE SOLO CN 账号里的模型额度，接入 DeepSeek Harness。插件在本机回环地址上运行一个代理服务，DSH 通过标准的 OpenAI 兼容接口调用它，消耗的是你 Trae 账号的额度，不需要额外的 API 费用。',
          ),
          h('h2', null, '首次使用（四步）'),
          h(
            'ol',
            null,
            h('li', null, '点「准备环境」：创建独立 Python 虚拟环境并安装依赖，不会改动你的系统 Python。'),
            h('li', null, '点「启动服务」：代理在本机 127.0.0.1 上启动，仅本机可访问。'),
            h('li', null, '选择「Trae CN」后点「导入当前桌面账号」：只读取本机 Trae 客户端的登录信息，不修改它。'),
            h('li', null, '返回控制台 →「DSH 模型管理」→ 接入模型菜单，之后就能在对话输入框直接选 TRAE 的模型。'),
          ),
          h('h2', null, '使用模型'),
          h(
            'p',
            null,
            '接入后，在对话输入框的模型菜单里选择 TRAE 提供的模型（如 DeepSeek、GLM、Kimi、Qwen、Doubao 等），也能调整思考强度。模型与档位以你账号实际返回为准。',
          ),
          h('h2', null, '安全说明'),
          h(
            'table',
            null,
            h('thead', null, h('tr', null, h('th', null, '项目'), h('th', null, '行为'))),
            h(
              'tbody',
              null,
              h('tr', null, h('td', null, '监听地址'), h('td', null, '仅 127.0.0.1，局域网/公网不可访问')),
              h('tr', null, h('td', null, '访问控制'), h('td', null, '模型接口需 API Key；控制台需 DSH 签发的临时票据 + 会话 Cookie')),
              h('tr', null, h('td', null, '凭证'), h('td', null, '从本机 Trae 客户端只读解密，保存在插件数据目录，不经过第三方服务器')),
              h('tr', null, h('td', null, '网络出口'), h('td', null, '只访问 Trae 官方接口')),
            ),
          ),
          h('h2', null, '接入其他客户端（可选）'),
          h('p', null, '这个代理同时兼容 OpenAI 与 Anthropic 协议，可用于 Claude Code、Cursor、Cline 等：'),
          h('pre', null, 'Base URL: http://127.0.0.1:' + (state?.port || '<端口>') + '/v1\nAuthorization: Bearer <你的 API Key>'),
          h('p', { className: 'tr-muted' }, 'OpenAI 端点 /v1/chat/completions，Anthropic 端点 /v1/messages。'),
          h('h2', null, '常见问题'),
          ...faq.map(([q, a]) =>
            h(
              'details',
              { className: 'tr-faq', key: q },
              h('summary', null, q),
              h('div', null, a),
            ),
          ),
          h(
            'p',
            { className: 'tr-hint' },
            '当前数据目录：',
            h('code', null, state?.directory || '（未准备）'),
          ),
        ),
      );
    }
    function ConsolePanel({ ctx }) {
      const [state, setState] = React.useState(null),
        [frameURL, setFrameURL] = React.useState(""),
        [externalURL, setExternalURL] = React.useState("");
      const [settings, setSettings] = React.useState(false),
        [busy, setBusy] = React.useState(false),
        [error, setError] = React.useState(""),
        [notice, setNotice] = React.useState("");
      const [python, setPython] = React.useState(DEFAULT_PYTHON),
        [port, setPort] = React.useState(""),
        [edition, setEdition] = React.useState("solo"),
        [directory, setDirectory] = React.useState("");
      const [docOpen, setDocOpen] = React.useState(false);
      const alive = React.useRef(true),
        frameRef = React.useRef(""),
        sequence = React.useRef(0);
      const call = async (method, payload = {}, signal) => {
        const result = await ctx.connection.rpc.call(
          "/api",
          "trae-relay." + method,
          payload,
          signal,
        );
        if (!result.ok) throw Error(result.error.message);
        return result.value;
      };
      const refresh = async (signal) => {
        const seq = ++sequence.current,
          status = await call("status", {}, signal);
        if (!alive.current || seq !== sequence.current) return;
        setState(status);
        if (status.python) setPython(status.python);
        if (status.state === "running") {
          const [external, frame] = await Promise.all([
            call("console", {}, signal),
            frameRef.current
              ? Promise.resolve(null)
              : call("console", {}, signal),
          ]);
          if (!alive.current || seq !== sequence.current) return;
          setExternalURL(external);
          if (frame) {
            frameRef.current = frame;
            setFrameURL(frame);
          }
        } else {
          frameRef.current = "";
          setFrameURL("");
          setExternalURL("");
        }
      };
      React.useEffect(() => {
        alive.current = true;
        const controller = new AbortController();
        let timer;
        const tick = async () => {
          try {
            await refresh(controller.signal);
          } catch (e) {
            if (alive.current && !controller.signal.aborted)
              setError(e.message);
          } finally {
            if (alive.current) timer = setTimeout(tick, 10000);
          }
        };
        void tick();
        return () => {
          alive.current = false;
          controller.abort();
          clearTimeout(timer);
        };
      }, []);
      const act = async (method, payload, message) => {
        if (busy) return;
        setBusy(true);
        setError("");
        setNotice("");
        try {
          const result = await call(method, payload);
          await refresh();
          if (alive.current)
            setNotice(
              (message || "操作完成。") +
                (result?.modelWarning
                  ? " 模型目录读取失败，旧列表已保留：" + result.modelWarning
                  : ""),
            );
        } catch (e) {
          if (alive.current) setError(e.message);
        } finally {
          if (alive.current) setBusy(false);
        }
      };
      const refreshConsole = async () => {
        setError("");
        try {
          const url = await call("console");
          if (alive.current) {
            frameRef.current = url;
            setFrameURL(url);
          }
        } catch (e) {
          if (alive.current) setError(e.message);
        }
      };
      const openedExternal = () =>
        setTimeout(() => {
          if (!alive.current) return;
          setExternalURL("");
          void call("console")
            .then((url) => {
              if (alive.current) setExternalURL(url);
            })
            .catch((e) => {
              if (alive.current) setError(e.message);
            });
        }, 0);
      const button = (label, onClick, disabled = false, extra = "") =>
        h(
          "button",
          {
            type: "button",
            className: "tr-button" + (extra ? " " + extra : ""),
            disabled: busy || disabled,
            onClick,
          },
          label,
        );
      const running = state?.state === "running",
        showSettings = settings || !running;
      const [help, setHelp] = [docOpen, setDocOpen];
      const labels = {
        unprepared: "未初始化",
        preparing: "准备中",
        starting: "启动中",
        running: "运行中",
        stopped: "已停止",
        error: "启动失败",
      };
      const stateText = labels[state?.state] || "正在连接…";
      return h(
        "section",
        { className: "tr-console", "aria-label": "TRAE 控制台" },
        h(
          "header",
          { className: "tr-header" },
          h(
            "div",
            { className: "tr-heading" },
            h(
              "h1",
              null,
              "TRAE 控制台",
              h(
                "span",
                { className: "tr-badge", "data-state": state?.state || "" },
                stateText,
              ),
            ),
            h(
              "div",
              { className: "tr-muted" },
              showSettings
                ? "服务设置 · " + stateText
                : "TRAE 额度接入、账号与用量管理",
            ),
          ),
          button(help ? "返回控制台" : "使用说明", () => setDocOpen(!help), false, "tr-ghost"),
          button("刷新控制台", refreshConsole, !running || help),
          running && externalURL
            ? h(
                "a",
                {
                  className: "tr-button",
                  href: externalURL,
                  target: "_blank",
                  rel: "noopener noreferrer",
                  onClick: openedExternal,
                },
                "新窗口打开",
              )
            : button("新窗口打开", () => {}, true),
          running && !help
            ? button(showSettings ? "返回控制台" : "服务设置", () =>
                setSettings(!showSettings),
              )
            : null,
        ),
        !showSettings && !help && error
          ? h("div", { className: "tr-error", role: "alert" }, error)
          : null,
        help
          ? h(HelpDoc, { onBack: () => setDocOpen(false), state })
          : running && frameURL
          ? h("iframe", {
              className: "tr-frame",
              style: showSettings ? { display: "none" } : undefined,
              src: frameURL,
              title: "TRAE 代理管理控制台",
              sandbox:
                "allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads",
              referrerPolicy: "no-referrer",
            })
          : null,
        showSettings && !help
          ? h(
              "div",
              { className: "tr-settings" },
              h(
                "div",
                { className: "tr-wrap" },
                h(
                  "p",
                  { className: "tr-muted" },
                  "首次准备后服务随 dsh 启动，完整退出或禁用插件时停止；关闭窗口到托盘继续运行。返回控制台后保留原有概览、账号、用量、设置与模型测试功能。",
                ),
                error || state?.error
                  ? h(
                      "div",
                      { className: "tr-error", role: "alert" },
                      error || state.error,
                    )
                  : null,
                notice
                  ? h("div", { className: "tr-notice", role: "status" }, notice)
                  : null,
                h(
                  "div",
                  { className: "tr-card" },
                  h("h2", null, "准备运行环境"),
                  h(
                    "p",
                    { className: "tr-muted" },
                    "需要 Python 3.10+（含 venv/pip）。只准备独立环境，不自动导入账号。",
                  ),
                  h(
                    "div",
                    { className: "tr-row" },
                    h(
                      "label",
                      { className: "tr-field" },
                      "Python 路径（留空自动查找）",
                      h("input", {
                        className: "tr-input",
                        value: python,
                        onChange: (e) => setPython(e.target.value),
                      }),
                    ),
                    h(
                      "label",
                      { className: "tr-field" },
                      "端口（留空自动分配）",
                      h("input", {
                        className: "tr-input",
                        type: "number",
                        min: 1024,
                        max: 65535,
                        value: port,
                        onChange: (e) => setPort(e.target.value),
                      }),
                    ),
                  ),
                  button(
                    state?.prepared ? "重新准备环境" : "准备环境",
                    () =>
                      act(
                        "prepare",
                        { python, port },
                        "环境就绪，请启动服务。",
                      ),
                    running || state?.connected,
                    "tr-primary",
                  ),
                ),
                h(
                  "div",
                  { className: "tr-card" },
                  h("h2", null, "服务启停"),
                  h(
                    "div",
                    { className: "tr-row" },
                    button(
                      "启动服务",
                      () => act("start"),
                      !state?.prepared || running,
                      "tr-primary",
                    ),
                    button("停止服务", () => act("stop"), !running),
                  ),
                  state?.directory
                    ? h(
                        "p",
                        { className: "tr-muted" },
                        "数据目录：",
                        h("code", { className: "tr-code" }, state.directory),
                      )
                    : null,
                ),
                h(
                  "div",
                  { className: "tr-card" },
                  h("h2", null, "导入当前桌面账号"),
                  h(
                    "p",
                    { className: "tr-muted" },
                    "只读所选客户端的登录信息。其他账号操作仍在原有控制台中管理。",
                  ),
                  h(
                    "div",
                    { className: "tr-row" },
                    h(
                      "label",
                      { className: "tr-field" },
                      "客户端版本",
                      h(
                        "select",
                        {
                          className: "tr-input",
                          value: edition,
                          onChange: (e) => setEdition(e.target.value),
                        },
                        h("option", { value: "solo" }, "TRAE SOLO CN"),
                        h("option", { value: "cn" }, "Trae CN"),
                      ),
                    ),
                    h(
                      "label",
                      { className: "tr-field" },
                      "User 数据目录（可选）",
                      h("input", {
                        className: "tr-input",
                        value: directory,
                        onChange: (e) => setDirectory(e.target.value),
                      }),
                    ),
                  ),
                  button(
                    "导入当前桌面账号",
                    () =>
                      act(
                        "import",
                        { edition, directory },
                        "账号已导入。返回控制台 → DSH 模型管理接入模型。",
                      ),
                    !running,
                  ),
                ),
                h(
                  "p",
                  { className: "tr-muted" },
                  "显示/隐藏模型在原有控制台的“DSH 模型管理”中设置，模型和思考强度仍在对话输入框的原生菜单选择。",
                ),
              ),
            )
          : null,
      );
    }
    function apply(ctx) {
      ctx.effect(() => {
        const style = document.createElement("style");
        style.textContent = css;
        document.head.appendChild(style);
        return () => style.remove();
      });
      ctx.slots.inject("main", () =>
        ctx.slots.register({ name: "main", key: panel }, () =>
          h(ConsolePanel, { ctx }),
        ),
      );
      ctx.slots.inject("sidebar.panellist", () =>
        ctx.slots.register(
          {
            name: "sidebar.panellist",
            id: panel,
            order: 20,
            label: () => "TRAE 控制台",
          },
          Icon,
        ),
      );
    }
    return { apply, inject: ["slots", "layout", "connection"] };
  },
});
