import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: 32,
          height: 32,
          borderRadius: 8,
          background: "linear-gradient(135deg, #B52030 0%, #8B1525 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "#C5A028",
            fontSize: 20,
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
