# Tổng quan kỹ thuật — ts-tsender-ui-cu

Tài liệu này mô tả dự án hiện tại cho người mới làm quen với React và TypeScript. Nội dung dựa trên mã nguồn trong repo tại thời điểm viết.

---

## 1. Dự án làm gì (chức năng tổng quát)

- **Frontend** cho ứng dụng **tsender**: giao diện web (Next.js) để người dùng **kết nối ví**, **chọn mạng**, và điền form **airdrop** (địa chỉ token ERC-20, danh sách người nhận, số lượng).
- **Chưa hoàn thiện toàn bộ luồng on-chain**: `AirdropForm` hiện chủ yếu đọc **allowance** (số token đã cho phép contract TSender tiêu thụ) và so sánh với tổng số nhập vào form; chưa có bước **approve** và **gọi hàm airdrop** trên contract trong code (phần đó được ghi chú trong comment).

---

## 2. Công nghệ chính (stack)

| Công nghệ | Vai trò trong dự án |
|-----------|---------------------|
| **Next.js** (App Router, `src/app/`) | Framework web: routing, layout, build. File `page.tsx` là trang chủ. |
| **React** | UI component, state, hooks. |
| **TypeScript** (`.ts` / `.tsx`) | Thêm kiểu dữ liệu cho biến, props, giảm lỗi khi refactor. |
| **Tailwind CSS** | Styling qua class trong JSX (ví dụ `className="flex gap-2"`). |
| **wagmi** | Hooks React để đọc chain, account, config ví (`useChainId`, `useAccount`, `useConfig`). |
| **@wagmi/core** | API không phụ thuộc React, ví dụ `readContract` để gọi contract. |
| **viem** | Thư viện Ethereum cấp thấp (types, encoding); wagmi dùng bên dưới. |
| **@rainbow-me/rainbowkit** | UI kết nối ví, modal chọn chain/account (`ConnectButton`, `RainbowKitProvider`). |
| **@tanstack/react-query** | Cache và quản lý trạng thái bất đồng bộ; RainbowKit/wagmi thường dùng cùng `QueryClientProvider`. |
| **react-icons** | Icon (GitHub, chevron) trong `Header`. |
| **Vitest** | Chạy unit test (ví dụ `calculateTotal.test.ts`). |

---

## 3. Cấu trúc thư mục quan trọng

```
src/
  app/                 # Next.js App Router: layout, page, global CSS
  components/          # Component UI: Header, Providers, AirdropForm, ui/InputField
  lib/wagmi.ts         # Cấu hình wagmi + RainbowKit (chains, projectId)
  constants.ts         # ABI + map chainId → địa chỉ contract TSender
  utils/               # Hàm tiện ích (calculateTotal) + barrel export index.ts
```

- **`tsender-deployed.json`**: file snapshot state Anvil (dùng với `--load-state` nếu format tương thích phiên bản Anvil). Không phải code TypeScript.
- **`vitest.config.mts`**: cấu hình chạy test Vitest.

---

## 4. Luồng chạy ứng dụng (rất ngắn gọn)

1. `layout.tsx` bọc toàn app bằng **`Providers`** (wagmi + React Query + RainbowKit).
2. **`Header`**: nút connect ví + đổi chain (custom `ConnectButton.Custom`).
3. **`page.tsx`**: render **`AirdropForm`** (form nhập token, recipients, amounts).

---

## 5. Chức năng từng file / module chính

### `src/lib/wagmi.ts`

- **`getDefaultConfig`** (RainbowKit): tạo config wagmi gồm chains, `projectId` (WalletConnect), `appName`, `ssr`.
- **`anvilWithEth`**: copy chain `anvil` từ `wagmi/chains` và chỉnh `nativeCurrency` hiển thị ETH.
- **`wagmiConfig`**: export object dùng cho `WagmiProvider`.

### `src/components/Providers.tsx`

- **`WagmiProvider`**: cung cấp context wagmi cho mọi component con.
- **`QueryClientProvider`**: cung cấp React Query.
- **`RainbowKitProvider`**: UI RainbowKit (modal ví).
- **`useState(() => new QueryClient())`**: tạo một `QueryClient` ổn định qua vòng đời component (tránh tạo mới mỗi lần render).

### `src/components/Header.tsx`

- **`ConnectButton.Custom`**: render tự tay UI connect / network / account bằng callback (`openChainModal`, `openAccountModal`, …).

### `src/components/AirdropForm.tsx`

- **`useState`**: lưu chuỗi nhập cho token, recipients, amounts.
- **`useChainId`**: chain hiện tại (số, ví dụ `31337` cho Anvil).
- **`useAccount`**: địa chỉ ví đang kết nối.
- **`useConfig`**: config wagmi để truyền vào `readContract`.
- **`useMemo`**: tính `total` từ `amounts` qua **`calculateTotal`** (chỉ tính lại khi `amounts` đổi).
- **`useEffect`**: log `total` khi đổi (debug).
- **`getApprovedAmount`**: gọi **`readContract`** với ABI ERC-20, hàm **`allowance(owner, spender)`** — kiểm tra số token user đã approve cho địa chỉ TSender.
- **`handleSubmit`**: lấy `tSenderAddress` từ **`chainsToTSender[chainId]`**, so sánh allowance với `total`; nếu thiếu thì `alert`.

### `src/constants.ts`

- **`chainsToTSender`**: object `chainId → { tsender, no_check }` — địa chỉ contract TSender theo mạng.
- **`erc20Abi` / `tsenderAbi`**: ABI để wagmi biết tên hàm và kiểu tham số khi gọi contract.

### `src/utils/calculateTotal/calculateTotal.ts`

- **`calculateTotal(amounts: string): number`**: tách chuỗi theo dòng hoặc dấu phẩy, parse số (hỗ trợ số thập phân), cộng tổng; bỏ token không phải số hợp lệ.

### `src/utils/index.ts`

- **Barrel file**: re-export `calculateTotal` để import gọn: `import { calculateTotal } from "@/utils"`.

### `src/components/ui/InputField.tsx`

- Input hoặc textarea (`large`) có label, controlled qua `value` + `onChange`.

---

## 6. Syntax / khái niệm TypeScript & React hay gặp trong repo

| Cú pháp / khái niệm | Ý nghĩa ngắn |
|---------------------|--------------|
| `"use client"` | Đánh dấu module chạy trên **client** (browser), được phép dùng hooks như `useState`, `useEffect`. |
| `export default function X()` | Export **mặc định** một component/hàm; file khác import: `import X from "..."`. |
| `export function foo()` | **Named export**; import: `import { foo } from "..."`. |
| `type Props = { children: React.ReactNode }` | Kiểu props: `children` là nội dung bọc bên trong component. |
| `address as \`0x${string}\`` | **Type assertion**: báo cho TypeScript biết chuỗi là địa chỉ Ethereum (template literal type của viem/wagmi). |
| `Promise<number>` | Hàm async trả về Promise chứa số. |
| `useMemo(() => expr, [deps])` | Ghi nhớ kết quả `expr` chỉ khi `deps` thay đổi (tối ưu, tránh tính lại không cần thiết). |
| `useEffect(() => { ... }, [deps])` | Chạy side effect (ví dụ `console.log`) sau render khi `deps` đổi. |
| `onChange={(e) => setX(e.target.value)}` | **Controlled input**: state là nguồn sự thật, mỗi lần gõ cập nhật state. |
| `className="..."` | Tailwind: class CSS dạng utility. |

---

## 7. Lệnh npm/pnpm thường dùng

- **`npm run dev` / `pnpm dev`**: chạy server phát triển Next.js.
- **`npm run build`**: build production.
- **`npm run test`**: chạy Vitest (theo `vitest.config.mts`).
- **`npm run anvil`**: chạy node Anvil local (chain id 31337 trong script hiện tại).

---

## 8. Ghi chú cho người mới

- **Balance token ≠ allowance**: có token trong ví vẫn cần **approve** cho TSender nếu contract dùng pattern ERC-20 chuẩn; code hiện mới kiểm tra allowance, chưa gửi tx approve/airdrop.
- **`projectId` trong `wagmi.ts`**: dùng cho WalletConnect; nếu là placeholder, console có thể báo lỗi 403/401 từ API WalletConnect — không nhất thiết chặn test local với ví injected, nhưng nên thay bằng project id hợp lệ khi triển khai thật.

---

*Tài liệu này mô tả trạng thái codebase; hành vi chi tiết contract và gas nên đối chiếu thêm với ABI và mạng thực tế khi bạn hoàn thiện luồng giao dịch.*
