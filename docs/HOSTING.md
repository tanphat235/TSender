# Hướng dẫn host — ts-tsender-ui-cu

Lệnh cần dùng để chạy **backend** (blockchain local) và **frontend** (Next.js).

> Dự án này không có API server riêng. "Backend" ở đây = **Anvil** (RPC local) + contract đã deploy.

---

## Yêu cầu

- Node.js >= 20
- pnpm (`npm.cmd install -g pnpm`)
- MetaMask (kết nối Anvil khi test local)

PowerShell lỗi execution policy → dùng `pnpm.cmd`, `npx.cmd` thay cho `pnpm`, `npx`.

---

## 1. Host backend (Anvil — blockchain local)

**Terminal 1:**

```cmd
cd C:\Users\phat.phamt\Documents\ts-tsender-ui-cu
pnpm install
pnpm anvil
```

Hoặc:

```cmd
npx @foundry-rs/anvil-win32-amd64 --chain-id 31337
```

| | |
|---|---|
| RPC | `http://127.0.0.1:8545` |
| Chain ID | `31337` |

**MetaMask — add network Anvil:**

| Field | Value |
|-------|-------|
| RPC URL | `http://127.0.0.1:8545` |
| Chain ID | `31337` |
| Symbol | `ETH` |

**Deploy contract (Remix + MetaMask trên Anvil):**

1. Deploy **MockUSD** → Token Address trên UI
2. Deploy **TSender** → cập nhật `src/constants.ts` chain `31337`
3. Value khi deploy: **0**

**Port 8545 bị chiếm:**

```cmd
netstat -ano | findstr :8545
taskkill /PID <PID> /F
```

---

## 2. Host frontend (Next.js — local dev)

**Terminal 2** (Anvil vẫn chạy ở terminal 1):

```cmd
cd C:\Users\phat.phamt\Documents\ts-tsender-ui-cu
pnpm install
pnpm dev
```

Hoặc:

```cmd
npx next dev
```

PowerShell lỗi execution policy → dùng `npx.cmd next dev`.

Mở: **http://localhost:3000**

**Port 3000 bị chiếm:**

```cmd
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## Tóm tắt — chạy full stack local

```cmd
REM Terminal 1 — backend
pnpm anvil

REM Terminal 2 — frontend
pnpm dev
REM hoặc: npx next dev
```

- Backend: `http://127.0.0.1:8545`
- Frontend: `http://localhost:3000`

**Lưu ý:** Anvil chỉ dùng local dev. Production frontend kết nối chain thật (mainnet, Sepolia...) — không host Anvil lên cloud.
