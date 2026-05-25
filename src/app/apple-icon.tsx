import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 180,
          height: 180,
          borderRadius: 40,
          background: "linear-gradient(135deg, #B52030 0%, #8B1525 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "#C5A028",
            fontSize: 110,
            fontWeight: 900,
            fontFamily: "serif",
            lineHeight: 1,
          }}
        >
          L
        </div>
      </div>
    ),
    { ...size }
  );
}
