import { useState, useEffect } from "react";

const TOTAL_SEATS = 30;

const DEMO_TAKEN = { demo1: 3, demo2: 7, demo3: 12, demo4: 15, demo5: 21, demo6: 28 };

export default function App() {
  const [screen, setScreen] = useState("login"); // login | main
  const [tab, setTab] = useState("login");
  const [users, setUsers] = useState([
    { name: "田中 れん", phone: "090-1234-5678", school: "韮崎高校", age: "18" },
  ]);
  const [taken, setTaken] = useState(DEMO_TAKEN); // { phone: seatNum }
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedSeat, setSelectedSeat] = useState(null);

  const [loginPhone, setLoginPhone] = useState("");
  const [regName, setRegName] = useState("");
  const [regPhone, setRegPhone] = useState("");
  const [regSchool, setRegSchool] = useState("");
  const [regAge, setRegAge] = useState("");
  const [regStatus, setRegStatus] = useState("");
  const [error, setError] = useState("");

  const usedCount = Object.keys(taken).length;
  const freeCount = TOTAL_SEATS - usedCount;
  const pct = Math.round((usedCount / TOTAL_SEATS) * 100);
  const mySeat = currentUser ? taken[currentUser.phone] : null;

  function doLogin() {
    const u = users.find((u) => u.phone === loginPhone.trim());
    if (!u) { setError("登録されていない電話番号です"); return; }
    setCurrentUser(u);
    setError("");
    setLoginPhone("");
    setScreen("main");
  }

  function doRegister() {
    if (!regName || !regPhone || !regSchool || !regAge || !regStatus) { setError("すべて入力してください"); return; }
    if (users.find((u) => u.phone === regPhone.trim())) { setError("この電話番号はすでに登録されています"); return; }
    const u = { name: regName.trim(), phone: regPhone.trim(), school: regSchool.trim(), age: regAge, status: regStatus };
    setUsers((prev) => [...prev, u]);
    setCurrentUser(u);
    setError("");
    setRegName(""); setRegPhone(""); setRegSchool(""); setRegAge(""); setRegStatus("");
    setScreen("main");
  }

  function doLogout() {
    if (mySeat) {
      setTaken((prev) => { const n = { ...prev }; delete n[currentUser.phone]; return n; });
    }
    setCurrentUser(null);
    setSelectedSeat(null);
    setScreen("login");
  }

  function doCheckin() {
    if (!selectedSeat || mySeat) return;
    setTaken((prev) => ({ ...prev, [currentUser.phone]: selectedSeat }));
    setSelectedSeat(null);
  }

  function doCheckout() {
    setTaken((prev) => { const n = { ...prev }; delete n[currentUser.phone]; return n; });
    setSelectedSeat(null);
  }

  function seatStatus(i) {
    const owner = Object.keys(taken).find((p) => taken[p] === i);
    if (!owner) return "empty";
    if (currentUser && owner === currentUser.phone) return "mine";
    return "taken";
  }

  const fillColor = pct >= 90 ? "#E24B4A" : pct >= 70 ? "#EF9F27" : "#1D9E75";

  const initials = currentUser
    ? currentUser.name.split(/\s/).map((s) => s[0]).join("").slice(0, 2)
    : "";

  // ── styles ──────────────────────────────────────────────────────────────
  const S = {
    app: { fontFamily: "system-ui, sans-serif", fontSize: 14, color: "#1a1a18", maxWidth: 420, margin: "0 auto", padding: "16px 16px 32px" },
    header: { marginBottom: 20 },
    h1: { fontSize: 18, fontWeight: 500, margin: 0, display: "flex", alignItems: "center", gap: 8 },
    sub: { fontSize: 12, color: "#888780", marginTop: 3 },
    card: { background: "#fff", border: "0.5px solid #e0ddd5", borderRadius: 12, padding: "16px 20px" },
    tabBar: { display: "flex", gap: 4, background: "#f1efe8", borderRadius: 8, padding: 4, marginBottom: 16 },
    tab: (active) => ({ flex: 1, padding: "7px 0", textAlign: "center", fontSize: 13, borderRadius: 6, cursor: "pointer", border: active ? "0.5px solid #e0ddd5" : "none", background: active ? "#fff" : "transparent", fontWeight: active ? 500 : 400, color: active ? "#1a1a18" : "#888780" }),
    label: { fontSize: 12, fontWeight: 500, color: "#5f5e5a", display: "block", marginBottom: 5 },
    input: { width: "100%", padding: "8px 10px", borderRadius: 8, border: "0.5px solid #d3d1c7", fontSize: 14, outline: "none", boxSizing: "border-box", background: "#fafaf8" },
    select: { width: "100%", padding: "8px 10px", borderRadius: 8, border: "0.5px solid #d3d1c7", fontSize: 14, background: "#fafaf8", boxSizing: "border-box" },
    formGroup: { marginBottom: 12 },
    btnPrimary: (disabled) => ({ width: "100%", padding: "10px", borderRadius: 8, border: "none", background: disabled ? "#d3d1c7" : "#378ADD", color: disabled ? "#888" : "#fff", fontSize: 14, fontWeight: 500, cursor: disabled ? "not-allowed" : "pointer", marginTop: 4 }),
    btnDanger: { width: "100%", padding: "10px", borderRadius: 8, border: "none", background: "#E24B4A", color: "#fff", fontSize: 14, fontWeight: 500, cursor: "pointer" },
    btnGhost: { padding: "6px 12px", borderRadius: 8, border: "0.5px solid #d3d1c7", background: "transparent", fontSize: 12, cursor: "pointer", color: "#1a1a18" },
    error: { background: "#fcebeb", border: "0.5px solid #f09595", borderRadius: 8, padding: "8px 12px", fontSize: 12, color: "#A32D2D", marginBottom: 12 },
    link: { fontSize: 13, color: "#378ADD", cursor: "pointer", textAlign: "center", marginTop: 12 },
    statsRow: { display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 10, marginBottom: 14 },
    statCard: { background: "#f1efe8", borderRadius: 8, padding: "10px 8px", textAlign: "center" },
    statNum: (color) => ({ fontSize: 22, fontWeight: 500, color }),
    statLabel: { fontSize: 11, color: "#888780", marginTop: 2 },
    userBadge: { display: "flex", alignItems: "center", gap: 10, paddingBottom: 14, borderBottom: "0.5px solid #e0ddd5", marginBottom: 16 },
    avatar: { width: 36, height: 36, borderRadius: "50%", background: "#E6F1FB", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 500, color: "#185FA5", flexShrink: 0 },
    sectionTitle: { fontSize: 12, fontWeight: 500, color: "#888780", marginBottom: 10 },
    seatGrid: { display: "grid", gridTemplateColumns: "repeat(6, 1fr)", gap: 7, marginBottom: 14 },
    seat: (status, selected) => {
      const base = { aspectRatio: "1", borderRadius: 8, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 2, fontSize: 11, fontWeight: 500, cursor: status === "taken" ? "not-allowed" : "pointer", transition: "all 0.12s", border: "0.5px solid" };
      if (status === "mine") return { ...base, background: "#EAF3DE", borderColor: "#3B6D11", color: "#3B6D11" };
      if (status === "taken") return { ...base, background: "#FCEBEB", borderColor: "#F09595", color: "#A32D2D" };
      if (selected) return { ...base, background: "#E6F1FB", borderColor: "#378ADD", color: "#185FA5", border: "2px solid #378ADD" };
      return { ...base, background: "#fff", borderColor: "#e0ddd5", color: "#5f5e5a" };
    },
    legend: { display: "flex", gap: 14, marginBottom: 14, flexWrap: "wrap" },
    legendItem: { display: "flex", alignItems: "center", gap: 5, fontSize: 11, color: "#888780" },
    legendDot: (color, border) => ({ width: 11, height: 11, borderRadius: 3, background: color, border: `0.5px solid ${border}` }),
    checkinBox: { background: "#EAF3DE", border: "0.5px solid #3B6D11", borderRadius: 12, padding: "16px", textAlign: "center", marginBottom: 14 },
    checkinBig: { fontSize: 28, fontWeight: 500, color: "#27500A" },
    checkinLabel: { fontSize: 12, color: "#3B6D11", marginTop: 4 },
    noticeFull: { background: "#FAEEDA", border: "0.5px solid #EF9F27", borderRadius: 8, padding: "9px 12px", fontSize: 12, color: "#633806", marginBottom: 12 },
    barWrap: { height: 7, borderRadius: 4, background: "#e0ddd5", overflow: "hidden", marginBottom: 16 },
    barFill: { height: "100%", borderRadius: 4, background: fillColor, width: pct + "%", transition: "width 0.4s ease" },
  };

  // ── render ───────────────────────────────────────────────────────────────
  if (screen === "login") return (
    <div style={S.app}>
      <div style={S.header}>
        <h1 style={S.h1}>📖 ニコリ自習室</h1>
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
              <input style={S.input} type="tel" placeholder="090-1234-5678" value={loginPhone} onChange={e => setLoginPhone(e.target.value)} onKeyDown={e => e.key === "Enter" && doLogin()} />
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
      <p style={{ ...S.sub, textAlign: "center", marginTop: 20 }}>
        テスト: 電話番号 090-1234-5678 でログイン
      </p>
    </div>
  );

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
          <div style={S.checkinBig}>{mySeat}番</div>
          <div style={S.checkinLabel}>を利用中</div>
        </div>
      )}

      {freeCount === 0 && !mySeat && (
        <div style={S.noticeFull}>⚠ 満席です。今日は来るのを控えてください。</div>
      )}

      <div style={S.sectionTitle}>{mySeat ? "座席の利用状況" : "座席を選んでチェックイン"}</div>

      <div style={S.seatGrid}>
        {Array.from({ length: TOTAL_SEATS }, (_, i) => i + 1).map((i) => {
          const st = seatStatus(i);
          const sel = selectedSeat === i;
          return (
            <button
              key={i}
              style={S.seat(st, sel)}
              onClick={() => {
                if (st === "taken" || mySeat) return;
                setSelectedSeat(sel ? null : i);
              }}
              aria-label={`${i}番席`}
            >
              <span style={{ fontSize: 16 }}>{st === "mine" ? "🟢" : st === "taken" ? "🔴" : "🪑"}</span>
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
      {mySeat && (
        <button style={S.btnDanger} onClick={doCheckout}>退室する</button>
      )}
    </div>
  );
}
