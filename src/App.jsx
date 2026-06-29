import { useState } from "react";

const TOTAL_SEATS = 30;
const ADMIN_PASSWORD = "nicori2024"; // 施設側だけが知るパスワード

const DEMO_TAKEN = { demo1: 3, demo2: 7, demo3: 12, demo4: 15, demo5: 21, demo6: 28 };
const DEMO_USERS = [
  { name: "田中 れん", phone: "090-1234-5678", school: "韮崎高校", age: "18", status: "高校生", checkinTime: "13:42" },
  { name: "佐藤 花子", phone: "090-0000-0001", school: "北杜高校", age: "17", status: "高校生", checkinTime: "14:05" },
  { name: "山田 太郎", phone: "090-0000-0002", school: "韮崎高校", age: "16", status: "高校生", checkinTime: "14:20" },
  { name: "鈴木 あい", phone: "090-0000-0003", school: "韮崎市立中学校", age: "15", status: "中学生", checkinTime: "14:33" },
  { name: "高橋 健", phone: "090-0000-0004", school: "名古屋大学", age: "18", status: "大学生", checkinTime: "15:01" },
  { name: "伊藤 さくら", phone: "090-0000-0005", school: "北杜高校", age: "17", status: "高校生", checkinTime: "15:10" },
];

export default function App() {
  const [screen, setScreen] = useState("login"); // login | main | adminLogin | admin
  const [tab, setTab] = useState("login");
  const [users, setUsers] = useState([DEMO_USERS[0]]);
  const [taken, setTaken] = useState(DEMO_TAKEN);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);
  const [loginPhone, setLoginPhone] = useState("");
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regSchool, setRegSchool] = useState("");
  const [regAge, setRegAge] = useState("");
  const [regStatus, setRegStatus] = useState("");
  const [error, setError] = useState("");
  const [adminPass, setAdminPass] = useState("");
  const [adminError, setAdminError] = useState("");

  // デモ用：全利用者データ（本番はFirebaseから取得）
  const allUsers = DEMO_USERS;
  const currentlyIn = allUsers.filter((u, i) => Object.values(DEMO_TAKEN).includes(i + 1) || taken[u.phone]);

  const usedCount = Object.keys(taken).length;
  const freeCount = TOTAL_SEATS - usedCount;
  const pct = Math.round((usedCount / TOTAL_SEATS) * 100);
  const mySeat = currentUser ? taken[currentUser.phone] : null;
  const fillColor = pct >= 90 ? "#E24B4A" : pct >= 70 ? "#EF9F27" : "#1D9E75";
  const initials = currentUser ? currentUser.name.split(/\s/).map(s => s[0]).join("").slice(0, 2) : "";

  function doLogin() {
    const u = users.find(u => u.phone === loginPhone.trim());
    if (!u) { setError("登録されていない電話番号です"); return; }
    setCurrentUser(u); setError(""); setLoginPhone(""); setScreen("main");
  }
  function doRegister() {
    if (!regName || !regPhone || !regSchool || !regAge || !regStatus) { setError("すべて入力してください"); return; }
    if (users.find(u => u.phone === regPhone.trim())) { setError("この電話番号はすでに登録されています"); return; }
    const u = { name: regName.trim(), phone: regPhone.trim(), school: regSchool.trim(), age: regAge, status: regStatus };
    setUsers(prev => [...prev, u]); setCurrentUser(u); setError("");
    setRegName(""); setRegPhone(""); setRegSchool(""); setRegAge(""); setRegStatus("");
    setScreen("main");
  }
  function doLogout() {
    if (mySeat) setTaken(prev => { const n = { ...prev }; delete n[currentUser.phone]; return n; });
    setCurrentUser(null); setSelectedSeat(null); setScreen("login");
  }
  function doCheckin() {
    if (!selectedSeat || mySeat) return;
    setTaken(prev => ({ ...prev, [currentUser.phone]: selectedSeat }));
    setSelectedSeat(null);
  }
  function doCheckout() {
    setTaken(prev => { const n = { ...prev }; delete n[currentUser.phone]; return n; });
    setSelectedSeat(null);
  }
  function seatStatus(i) {
    const owner = Object.keys(taken).find(p => taken[p] === i);
    if (!owner) return "empty";
    if (currentUser && owner === currentUser.phone) return "mine";
    return "taken";
  }
  function doAdminLogin() {
    if (adminPass === ADMIN_PASSWORD) { setAdminError(""); setAdminPass(""); setScreen("admin"); }
    else { setAdminError("パスワードが違います"); }
  }

  const S = {
    app: { fontFamily: "system-ui, sans-serif", fontSize: 14, color: "#1a1a18", maxWidth: 480, margin: "0 auto", padding: "16px 16px 32px" },
    sub: { fontSize: 12, color: "#888780", marginTop: 3 },
    card: { background: "#fff", border: "0.5px solid #e0ddd5", borderRadius: 12, padding: "16px 20px" },
    tabBar: { display: "flex", gap: 4, background: "#f1efe8", borderRadius: 8, padding: 4, marginBottom: 16 },
    tab: (a) => ({ flex: 1, padding: "7px 0", textAlign: "center", fontSize: 13, borderRadius: 6, cursor: "pointer", border: a ? "0.5px solid #e0ddd5" : "none", background: a ? "#fff" : "transparent", fontWeight: a ? 500 : 400, color: a ? "#1a1a18" : "#888780" }),
    label: { fontSize: 12, fontWeight: 500, color: "#5f5e5a", display: "block", marginBottom: 5 },
    input: { width: "100%", padding: "8px 10px", borderRadius: 8, border: "0.5px solid #d3d1c7", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fafaf8" },
    select: { width: "100%", padding: "8px 10px", borderRadius: 8, border: "0.5px solid #d3d1c7", fontSize: 14, background: "#fafaf8", boxSizing: "border-box" },
    formGroup: { marginBottom: 12 },
    btnPrimary: (d) => ({ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: d ? "#d3d1c7" : "#378ADD", color: d ? "#888" : "#fff", fontSize: 14, fontWeight: 500, cursor: d ? "not-allowed" : "pointer", marginTop: 4 }),
    btnDanger: { width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "#E24B4A", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" },
    btnGhost: { padding: "6px 12px", borderRadius: 8, border: "0.5px solid #d3d1c7", background: "transparent", fontSize: 12, cursor: "pointer", color: "#1a1a18" },
    error: { background: "#fcebeb", border: "0.5px solid #f09595", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#A32D2D", marginBottom: 12 },
    link: { fontSize: 13, color: "#378ADD", cursor: "pointer", textAlign: "center", marginTop: 12 },
    statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 },
    statCard: { background: "#f1efe8", borderRadius: 8, padding: "10px 8px", textAlign: "center" },
    statNum: (c) => ({ fontSize: 22, fontWeight: 500, color: c }),
    statLabel: { fontSize: 11, color: "#888780", marginTop: 2 },
    userBadge: { display: "flex", alignItems: "center", gap: 10, paddingBottom: 14, borderBottom: "0.5px solid #e0ddd5", marginBottom: 16 },
    avatar: { width: 36, height: 36, borderRadius: "50%", background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, color: "#185FA5", flexShrink: 0 },
    sectionTitle: { fontSize: 12, fontWeight: 500, color: "#888780", marginBottom: 10 },
    seatGrid: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 7, marginBottom: 14 },
    seat: (st, sel) => {
      const base = { aspectRatio: "1", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, fontSize: 11, fontWeight: 500, cursor: st === "taken" ? "not-allowed" : "pointer", transition: "all 0.12s", border: "0.5px solid" };
      if (st === "mine") return { ...base, background: "#EAF3DE", borderColor: "#3B6D11", color: "#3B6D11" };
      if (st === "taken") return { ...base, background: "#FCEBEB", borderColor: "#F09595", color: "#A32D2D" };
      if (sel) return { ...base, background: "#E6F1FB", borderColor: "#378ADD", color: "#185FA5", border: "2px solid #378ADD" };
      return { ...base, background: "#fff", borderColor: "#e0ddd5", color: "#5f5e5a" };
    },
    legend: { display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" },
    legendItem: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#888780" },
    legendDot: (c, b) => ({ width: 11, height: 11, borderRadius: 3, background: c, border: `0.5px solid ${b}` }),
    checkinBox: { background: "#EAF3DE", border: "0.5px solid #3B6D11", borderRadius: 12, padding: "16px", textAlign: "center", marginBottom: 14 },
    noticeFull: { background: "#FAEEDA", border: "0.5px solid #EF9F27", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#633806", marginBottom: 12 },
    barWrap: { height: 7, borderRadius: 4, background: "#e0ddd5", overflow: "hidden", marginBottom: 16 },
    barFill: { height: "100%", borderRadius: 4, background: fillColor, width: pct + "%", transition: "width 0.4s ease" },
  };

  // ── 管理者ログイン画面 ──────────────────────────────────────────────────
  if (screen === "adminLogin") return (
    <div style={S.app}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 500 }}>🔐 管理者ログイン</div>
        <p style={S.sub}>施設スタッフ専用画面</p>
      </div>
      <div style={{ ...S.card, borderColor: "#028090" }}>
        <div style={{ background: "#f0fdfa", border: "0.5px solid #028090", borderRadius: 8, padding: "10px 12px", fontSize: 12, color: "#028090", marginBottom: 16 }}>
          この画面は施設スタッフ専用です。<br />利用者は通常のログイン画面をご利用ください。
        </div>
        {adminError && <div style={S.error}>{adminError}</div>}
        <div style={S.formGroup}>
          <label style={S.label}>管理者パスワード</label>
          <input style={S.input} type="password" placeholder="••••••••" value={adminPass}
            onChange={e => setAdminPass(e.target.value)}
            onKeyDown={e => e.key === "Enter" && doAdminLogin()} />
        </div>
        <button style={{ ...S.btnPrimary(false), background: "#028090" }} onClick={doAdminLogin}>管理者としてログイン</button>
        <p style={S.link} onClick={() => { setAdminError(""); setAdminPass(""); setScreen("login"); }}>← 利用者ログインに戻る</p>
      </div>
      <p style={{ ...S.sub, textAlign: "center", marginTop: 16 }}>テスト用パスワード: nicori2024</p>
    </div>
  );

  // ── 管理者画面 ─────────────────────────────────────────────────────────
  if (screen === "admin") return (
    <div style={S.app}>
      <div style={S.userBadge}>
        <div style={{ ...S.avatar, background: "#f0fdfa", color: "#028090" }}>管</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500 }}>管理者画面</div>
          <div style={S.sub}>ニコリ自習室 スタッフ専用</div>
        </div>
        <button style={S.btnGhost} onClick={() => setScreen("login")}>ログアウト</button>
      </div>

      {/* 統計 */}
      <div style={S.statsRow}>
        <div style={S.statCard}><div style={S.statNum("#1a1a18")}>{TOTAL_SEATS}</div><div style={S.statLabel}>総座席数</div></div>
        <div style={S.statCard}><div style={S.statNum("#E24B4A")}>{usedCount}</div><div style={S.statLabel}>使用中</div></div>
        <div style={S.statCard}><div style={S.statNum("#1D9E75")}>{freeCount}</div><div style={S.statLabel}>空き</div></div>
      </div>
      <div style={S.barWrap}><div style={S.barFill} /></div>

      {/* 現在の利用者一覧 */}
      <div style={{ ...S.sectionTitle, marginBottom: 8 }}>現在の利用者一覧（{allUsers.length}名）</div>
      <div style={{ border: "0.5px solid #e0ddd5", borderRadius: 10, overflow: "hidden", marginBottom: 16 }}>
        {/* ヘッダー */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 0.8fr 0.6fr 0.5fr", background: "#f1efe8", padding: "8px 12px", fontSize: 11, fontWeight: 500, color: "#5f5e5a" }}>
          <span>名前</span><span>電話番号</span><span>学校</span><span>身分</span><span>座席</span>
        </div>
        {allUsers.map((u, i) => (
          <div key={i} style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 0.8fr 0.6fr 0.5fr", padding: "9px 12px", fontSize: 12, borderTop: "0.5px solid #f1efe8", background: i % 2 === 0 ? "#fff" : "#fafaf8", alignItems: "center" }}>
            <span style={{ fontWeight: 500 }}>{u.name}</span>
            <span style={{ color: "#5f5e5a" }}>{u.phone}</span>
            <span style={{ color: "#5f5e5a" }}>{u.school}</span>
            <span><span style={{ background: "#f1efe8", borderRadius: 4, padding: "1px 6px", fontSize: 10 }}>{u.status}</span></span>
            <span style={{ color: "#028090", fontWeight: 500 }}>{i + 1}番</span>
          </div>
        ))}
      </div>

      {/* 座席マップ */}
      <div style={S.sectionTitle}>座席マップ（管理者視点）</div>
      <div style={S.seatGrid}>
        {Array.from({ length: TOTAL_SEATS }, (_, i) => i + 1).map((i) => {
          const st = seatStatus(i);
          const isAdminView = Object.values(DEMO_TAKEN).includes(i) || st === "taken";
          return (
            <div key={i} style={{ ...S.seat(isAdminView ? "taken" : "empty", false), cursor: "default" }}>
              <span style={{ fontSize: 14 }}>{isAdminView ? "🔴" : "🪑"}</span>
              <span>{i}</span>
            </div>
          );
        })}
      </div>
      <div style={S.legend}>
        <div style={S.legendItem}><div style={S.legendDot("#fff", "#d3d1c7")} />空き</div>
        <div style={S.legendItem}><div style={S.legendDot("#FCEBEB", "#F09595")} />使用中</div>
      </div>

      {/* 強制退室ボタン（管理者のみ） */}
      <div style={{ ...S.sectionTitle, marginTop: 4 }}>利用者管理</div>
      <div style={{ border: "0.5px solid #e0ddd5", borderRadius: 10, overflow: "hidden" }}>
        {allUsers.map((u, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "9px 12px", fontSize: 12, borderTop: i > 0 ? "0.5px solid #f1efe8" : "none", background: i % 2 === 0 ? "#fff" : "#fafaf8" }}>
            <span>{u.name}（{i + 1}番席）</span>
            <button style={{ padding: "3px 10px", borderRadius: 6, border: "0.5px solid #f09595", background: "#fcebeb", color: "#A32D2D", fontSize: 11, cursor: "pointer" }}
              onClick={() => alert(`${u.name}さんを強制退室しました（デモ）`)}>
              強制退室
            </button>
          </div>
        ))}
      </div>
    </div>
  );

  // ── 利用者ログイン画面 ─────────────────────────────────────────────────
  if (screen === "login") return (
    <div style={S.app}>
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 18, fontWeight: 500 }}>📖 ニコリ自習室</div>
        <p style={S.sub}>韮崎市民交流センター</p>
      </div>
      <div style={S.card}>
        <div style={S.tabBar}>
          <button style={S.tab(tab === "login")} onClick={() => { setTab("login"); setError(""); }}>ログイン</button>
          <button style={S.tab(tab === "register")} onClick={() => { setTab("register"); setError(""); }}>新規登録</button>
        </div>
        {error && <div style={S.error}>{error}</div>}
        {tab === "login" ? (
          <>
            <div style={S.formGroup}>
              <label style={S.label}>電話番号</label>
              <input style={S.input} type="tel" placeholder="090-1234-5678" value={loginPhone}
                onChange={e => setLoginPhone(e.target.value)} onKeyDown={e => e.key === "Enter" && doLogin()} />
            </div>
            <button style={S.btnPrimary(false)} onClick={doLogin}>ログイン</button>
            <p style={S.link} onClick={() => { setTab("register"); setError(""); }}>アカウントを作成する</p>
          </>
        ) : (
          <>
            <div style={S.formGroup}><label style={S.label}>名前</label><input style={S.input} placeholder="山田 太郎" value={regName} onChange={e => setRegName(e.target.value)} /></div>
            <div style={S.formGroup}><label style={S.label}>電話番号</label><input style={S.input} type="tel" placeholder="090-0000-0000" value={regPhone} onChange={e => setRegPhone(e.target.value)} /></div>
            <div style={S.formGroup}><label style={S.label}>学校名</label><input style={S.input} placeholder="韮崎高校" value={regSchool} onChange={e => setRegSchool(e.target.value)} /></div>
            <div style={S.formGroup}>
              <label style={S.label}>身分</label>
              <select style={S.select} value={regStatus} onChange={e => setRegStatus(e.target.value)}>
                <option value="">選択してください</option>
                {["小学生","中学生","高校生","大学生","その他"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div style={S.formGroup}>
              <label style={S.label}>年齢</label>
              <select style={S.select} value={regAge} onChange={e => setRegAge(e.target.value)}>
                <option value="">選択してください</option>
                {[10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25].map(n => <option key={n}>{n}</option>)}
              </select>
            </div>
            <button style={S.btnPrimary(false)} onClick={doRegister}>登録する</button>
          </>
        )}
      </div>
      <p style={{ ...S.sub, textAlign: "center", marginTop: 16 }}>テスト: 電話番号 090-1234-5678 でログイン</p>
      <p style={{ textAlign: "center", marginTop: 8 }}>
        <span style={{ fontSize: 12, color: "#028090", cursor: "pointer" }} onClick={() => { setAdminError(""); setAdminPass(""); setScreen("adminLogin"); }}>
          🔐 施設スタッフの方はこちら
        </span>
      </p>
    </div>
  );

  // ── 利用者メイン画面 ────────────────────────────────────────────────────
  return (
    <div style={S.app}>
      <div style={S.userBadge}>
        <div style={S.avatar}>{initials}</div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 500 }}>{currentUser.name}</div>
          <div style={S.sub}>{currentUser.status} · {currentUser.school} · {currentUser.age}歳</div>
        </div>
        <button style={S.btnGhost} onClick={doLogout}>ログアウト</button>
      </div>

      <div style={S.statsRow}>
        <div style={S.statCard}><div style={S.statNum("#1a1a18")}>{TOTAL_SEATS}</div><div style={S.statLabel}>総座席数</div></div>
        <div style={S.statCard}><div style={S.statNum("#E24B4A")}>{usedCount}</div><div style={S.statLabel}>使用中</div></div>
        <div style={S.statCard}><div style={S.statNum("#1D9E75")}>{freeCount}</div><div style={S.statLabel}>空き</div></div>
      </div>
      <div style={S.barWrap}><div style={S.barFill} /></div>

      {mySeat && (
        <div style={S.checkinBox}>
          <div style={{ fontSize: 28, fontWeight: 500, color: "#27500A" }}>{mySeat}番</div>
          <div style={{ fontSize: 12, color: "#3B6D11", marginTop: 4 }}>を利用中</div>
        </div>
      )}
      {freeCount === 0 && !mySeat && <div style={S.noticeFull}>⚠ 満席です。今日は来るのを控えてください。</div>}

      <div style={S.sectionTitle}>{mySeat ? "座席の利用状況" : "座席を選んでチェックイン"}</div>
      <div style={S.seatGrid}>
        {Array.from({ length: TOTAL_SEATS }, (_, i) => i + 1).map((i) => {
          const st = seatStatus(i);
          const sel = selectedSeat === i;
          return (
            <button key={i} style={S.seat(st, sel)}
              onClick={() => { if (st === "taken" || mySeat) return; setSelectedSeat(sel ? null : i); }}
              aria-label={`${i}番席`}>
              <span style={{ fontSize: 14 }}>{st === "mine" ? "🟢" : st === "taken" ? "🔴" : "🪑"}</span>
              <span>{i}</span>
            </button>
          );
        })}
      </div>

      <div style={S.legend}>
        <div style={S.legendItem}><div style={S.legendDot("#fff", "#d3d1c7")} />空き</div>
        <div style={S.legendItem}><div style={S.legendDot("#FCEBEB", "#F09595")} />使用中</div>
        <div style={S.legendItem}><div style={S.legendDot("#EAF3DE", "#3B6D11")} />自分の席</div>
      </div>

      {!mySeat && (
        <button style={S.btnPrimary(!selectedSeat)} onClick={doCheckin} disabled={!selectedSeat}>
          {selectedSeat ? `${selectedSeat}番席にチェックイン` : "座席を選んでください"}
        </button>
      )}
      {mySeat && <button style={S.btnDanger} onClick={doCheckout}>退室する</button>}
    </div>
  );
}
