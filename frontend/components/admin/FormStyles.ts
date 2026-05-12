import type React from "react";

export const inputStyle: React.CSSProperties = {
  width: "100%",
  background: "#0A0A0A",
  border: "1px solid #1F1F1F",
  borderRadius: 4,
  padding: "12px 14px",
  fontFamily: "var(--font-body)",
  fontWeight: 300,
  fontSize: 14,
  color: "#F5F5F0",
  outline: "none",
  transition: "border-color 160ms ease",
};

export const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-body)",
  fontWeight: 500,
  fontSize: 10,
  letterSpacing: "0.2em",
  textTransform: "uppercase",
  color: "#6B6B6B",
  marginBottom: 8,
};
