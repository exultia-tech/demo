"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { ShieldAlert, RotateCcw, ChevronDown, Check, UserCheck, Sparkles, ExternalLink } from "lucide-react";
import { PureIdeIcon, VantageIcon, InquestIcon } from "@/components/BrandIcons";

interface PersonaOption {
  email: string;
  name: string;
  badge: string;
  pureide: string;
  uvi: string;
  inquest: string;
  color: string;
}

const PERSONA_OPTIONS: PersonaOption[] = [
  {
    email: "admin@exultia.tech",
    name: "Exultia Administrator",
    badge: "Root Admin",
    pureide: "enterprise",
    uvi: "enterprise",
    inquest: "enterprise",
    color: "#F59E0B"
  }
];

export default function AdminImpersonationBanner() {
  const { user, isImpersonating, revertImpersonation, impersonate, getUserTier } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isSwitching, setIsSwitching] = useState(false);

  if (!isImpersonating || !user) return null;

  const currentPureIde = getUserTier("pureide");
  const currentUvi = getUserTier("uvi");
  const currentInquest = getUserTier("inquest");

  const handleSelectPersona = async (email: string) => {
    setIsSwitching(true);
    setIsOpen(false);
    if (email === "admin@exultia.tech") {
      await revertImpersonation();
    } else {
      await impersonate(email);
    }
    setIsSwitching(false);
  };

  return (
    <div style={{
      background: "linear-gradient(90deg, rgba(245, 158, 11, 0.95) 0%, rgba(217, 119, 6, 0.95) 50%, rgba(180, 83, 9, 0.95) 100%)",
      color: "#0F172A",
      padding: "6px 16px",
      fontSize: "0.82rem",
      fontWeight: 600,
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      gap: "12px",
      boxShadow: "0 4px 20px rgba(245, 158, 11, 0.35)",
      position: "relative",
      zIndex: 1001
    }}>
      {/* Left info badge */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <div style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "5px",
          background: "rgba(0, 0, 0, 0.25)",
          color: "#FEF3C7",
          padding: "2px 8px",
          borderRadius: "6px",
          fontSize: "0.72rem",
          fontWeight: 800,
          textTransform: "uppercase",
          letterSpacing: "0.04em"
        }}>
          <ShieldAlert size={13} color="#FDE68A" />
          Admin Impersonation Active
        </div>

        <span style={{ color: "#FFFFFF", fontWeight: 700 }}>
          Viewing as: <span style={{ textDecoration: "underline", textUnderlineOffset: "3px" }}>{user.name || user.email}</span> ({user.email})
        </span>

        {/* Entitlement Badges */}
        <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", marginLeft: "4px" }}>
          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "3px",
            background: "rgba(15, 23, 42, 0.8)",
            color: "#93C5FD",
            padding: "1px 6px",
            borderRadius: "4px",
            fontSize: "0.68rem",
            fontWeight: 700,
            textTransform: "uppercase"
          }}>
            <PureIdeIcon size={11} glow={false} />
            PureIDE: {currentPureIde}
          </span>

          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "3px",
            background: "rgba(15, 23, 42, 0.8)",
            color: "#C084FC",
            padding: "1px 6px",
            borderRadius: "4px",
            fontSize: "0.68rem",
            fontWeight: 700,
            textTransform: "uppercase"
          }}>
            <VantageIcon size={11} glow={false} />
            Vantage: {currentUvi}
          </span>

          <span style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "3px",
            background: "rgba(15, 23, 42, 0.8)",
            color: "#67E8F9",
            padding: "1px 6px",
            borderRadius: "4px",
            fontSize: "0.68rem",
            fontWeight: 700,
            textTransform: "uppercase"
          }}>
            <InquestIcon size={11} glow={false} />
            Inquest: {currentInquest}
          </span>
        </div>
      </div>

      {/* Right controls */}
      <div style={{ display: "flex", alignItems: "center", gap: "8px", flexShrink: 0 }}>
        
        {/* Quick Persona Selector Dropdown */}
        <div style={{ position: "relative" }}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={isSwitching}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              background: "rgba(0, 0, 0, 0.2)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
              color: "#FFFFFF",
              padding: "4px 10px",
              borderRadius: "6px",
              fontSize: "0.78rem",
              fontWeight: 700,
              cursor: "pointer"
            }}
          >
            <span>Switch Test Persona</span>
            <ChevronDown size={13} />
          </button>

          {isOpen && (
            <div 
              style={{
                position: "absolute",
                top: "120%",
                right: 0,
                background: "rgba(15, 23, 42, 0.98)",
                backdropFilter: "blur(16px)",
                border: "1px solid rgba(255, 255, 255, 0.15)",
                borderRadius: "12px",
                padding: "6px",
                minWidth: "280px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.85)",
                zIndex: 1002
              }}
              onMouseLeave={() => setIsOpen(false)}
            >
              <div style={{ padding: "6px 10px", fontSize: "0.72rem", color: "#94A3B8", borderBottom: "1px solid rgba(255,255,255,0.08)", marginBottom: "4px", fontWeight: 700, textTransform: "uppercase" }}>
                Select Entitlement Level
              </div>
              {PERSONA_OPTIONS.map((p) => {
                const isCurrent = user.email.toLowerCase() === p.email.toLowerCase();
                return (
                  <button
                    key={p.email}
                    onClick={() => handleSelectPersona(p.email)}
                    style={{
                      width: "100%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      padding: "8px 10px",
                      background: isCurrent ? "rgba(255, 255, 255, 0.08)" : "transparent",
                      border: "none",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      textAlign: "left"
                    }}
                    className="dropdown-item"
                  >
                    <div>
                      <div style={{ fontWeight: 700, display: "flex", alignItems: "center", gap: "6px" }}>
                        <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color }} />
                        {p.name}
                      </div>
                      <div style={{ fontSize: "0.68rem", color: "#94A3B8", marginTop: "2px" }}>
                        PureIDE: {p.pureide} • Vantage: {p.uvi} • Inquest: {p.inquest}
                      </div>
                    </div>
                    {isCurrent && <Check size={14} color="#34D399" />}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Revert Button */}
        <button
          onClick={() => handleSelectPersona("admin@exultia.tech")}
          disabled={isSwitching}
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "#0F172A",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            color: "#FDE68A",
            padding: "4px 12px",
            borderRadius: "6px",
            fontSize: "0.78rem",
            fontWeight: 800,
            cursor: "pointer",
            boxShadow: "0 2px 8px rgba(0,0,0,0.3)"
          }}
        >
          <RotateCcw size={12} />
          <span>Exit / Revert to Admin</span>
        </button>
      </div>
    </div>
  );
}
