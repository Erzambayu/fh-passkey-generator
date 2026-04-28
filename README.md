# FH Passkey Generator

Generate WiFi passwords from FH router SSIDs.

🌐 **Live Demo**: [erzambayu.github.io/fh-passkey-generator](https://erzambayu.github.io/fh-passkey-generator)

## How It Works

The password is generated using a **Hex Complement** algorithm:

1. Extract the 6-character hex code from the SSID (e.g., `fh_ABC123` → `ABC123`)
2. If SSID has `_5G` suffix, it's stripped (same password for 2.4G and 5G)
3. Each hex digit is complemented against `0xF` (15 - digit_value)
4. Prefix `wlan` is added

### Example

```
SSID:     fh_ABC123
Digits:    A  B  C  1  2  3
Hex:      10 11 12  1  2  3
15 - x:    5  4  3 14 13 12
Result:    5  4  3  e  d  c

Password: wlan543edc
```

Mathematically: `0xABC123 XOR 0xFFFFFF = 0x543EDC`

## Tech Stack

- **Framework**: Next.js 15 (App Router, Static Export)
- **Styling**: Tailwind CSS v4
- **UI**: Lucide React icons, Glassmorphism design
- **Animation**: Framer Motion
- **Deployment**: GitHub Pages

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Static output will be generated in the `out/` directory.

## Author

- GitHub: [@erzambayu](https://github.com/erzambayu)
- Instagram: [@erzam.bayu](https://instagram.com/erzam.bayu)

## License

MIT
