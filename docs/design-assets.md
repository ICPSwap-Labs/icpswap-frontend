# Design asset palette

First-party illustrations and icons use the graphite, copper, sage, and warm gold palette defined by the daisyUI themes in `apps/swap/src/styles.css`. SVG recoloring preserves paths, dimensions, and text. Inline icons use semantic CSS color variables.

These recolored assets belong to the **New design**, which is the default. Original artwork stays unchanged at its existing paths, and the **Original design** uses those files directly. New artwork lives in `public/images/design-modern` (including mirrored `source/` paths for imported illustrations) and `src/assets/design-modern` (imported logos). `src/styles/modern-assets.css` selects the new artwork only for the new design. The header selector stores `classic` or `modern` under the local-storage key `icswap.design.version`; it does not store or reset wallet, token, or transaction state.

Animated mascots, guide screenshots, and legacy raster artwork use the scoped display filter `apps/swap/public/images/design-modern/legacy-palette.svg`. It remaps blue/violet accents while preserving source frames, timing, alpha, text, and other hues. Only the first-party image paths listed in `styles.css` receive the filter. Third-party wallet providers, chain logos, token metadata, SNS badges, and user content retain their identities.

The PNG favicon and wallet brand images are exports of the updated native SVG marks. Their original output dimensions are preserved.

The ICS token logo is an exception to app recoloring. Both the local token PNG (`public/images/tokens/ca6gz-lqaaa-aaaaq-aacwa-cai.png`) and token SVG (`src/assets/images/icons/tokens/ics.svg`) retain their original blue/violet gradient and white mark. Token images are excluded from the legacy artwork display filter.

## Social preview

- Final asset: `apps/swap/public/images/design-modern/og_image.png` (2400 × 1260).
- Tool: built-in imagegen, edit mode, using the original social preview as the reference.
- Original wording is retained; the result was visually checked before being saved in the workspace.

Final edit prompt:

> Use case: style-transfer. Asset type: ICSWAP website social preview, current source 2400 x 1260 pixels. Edit target: the supplied image. Recolor ONLY the existing blue/violet/purple brand accents and glows into a premium copper (#e5ae78), darker copper (#a86430), pale warm gold (#e8cf9e), and sage (#a6bba3) palette, with the black background staying black or very dark graphite (#171a19). Preserve absolutely every shape, composition, logo mark, all geometry, layout, original font, all word spacing and every word of text unchanged. Preserve the exact wide 2400:1260 aspect ratio and full uncropped canvas. This is a palette replacement, not a redesign. Keep white and gray text white and gray. Text must remain exactly: 'A Better Swap for Web3'; 'Swap, NFT, Earn and More on ICPSwap'; bottom brand 'ICPSwap'; bottom subtitle 'The Hub of Future Decentralized Finance on Internet Computer'. Keep the original authentic chain-link infinity-like ICSWAP logo shapes unchanged. Recolor the purple 3D channel paths and small hexagonal end caps copper with subtle sage shadows. No new text, no added or removed content, no watermark. Export as PNG.
