"use client";

import React, { useState, useEffect } from "react";
import { AxiomIcon } from "@/components/BrandIcons";
import { CERTIFICATIONS, LABS_DB, Certification } from "@/lib/axiom-data";

const TOTAL_QUESTIONS = 15000;

interface ExamQuestion {
  id: string;
  cert: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

export default function AxiomDashboard() {
  const [activeView, setActiveView] = useState<"syllabus" | "simulator" | "labs" | "pricing">("syllabus");
  
  // Syllabus State
  const [activeCertId, setActiveCertId] = useState<string>("comptia-secplus");
  const [expandedDomain, setExpandedDomain] = useState<string | null>(null);

  // Simulator State
  const [examActive, setExamActive] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [examAnswers, setExamAnswers] = useState<number[]>([]);

  // Simulator Configuration & Checkpoints
  const [sessionQuestionCount, setSessionQuestionCount] = useState<number>(90);
  const [checkpointInterval, setCheckpointInterval] = useState<number>(10);
  const [activeExamQs, setActiveExamQs] = useState<ExamQuestion[]>([]);
  const [showCheckpoint, setShowCheckpoint] = useState<boolean>(false);
  
  // Instant Validation
  const [instantValidation, setInstantValidation] = useState<boolean>(false);
  const [validationVisible, setValidationVisible] = useState<boolean>(false);

  // Timer State
  const [examDurationMinutes, setExamDurationMinutes] = useState<number>(90);
  const [timeRemainingSeconds, setTimeRemainingSeconds] = useState<number | null>(null);

  // Labs State
  const [activeLabId, setActiveLabId] = useState<string | null>(null);
  const [terminalInput, setTerminalInput] = useState("");
  const [terminalOutput, setTerminalOutput] = useState<string[]>([]);

  const certsList = Object.values(CERTIFICATIONS);
  const activeCert = CERTIFICATIONS[activeCertId];

  // --- EXAM SIMULATOR LOGIC ---
  const handleStartExam = async () => {
    try {
      const res = await fetch(`/api/axiom/exam?count=${sessionQuestionCount}`);
      const data = await res.json();
      setActiveExamQs(data);

      setExamActive(true);
      setCurrentQuestionIdx(0);
      setScore(null);
      setSelectedAnswer(null);
      setExamAnswers([]);
      setShowCheckpoint(false);
      setValidationVisible(false);
      setTimeRemainingSeconds(examDurationMinutes * 60);
    } catch (e) {
      console.error(e);
      alert("Failed to load exam data.");
    }
  };

  const proceedToNextQuestion = (answersToUse: number[], forceSubmit: boolean = false) => {
    setShowCheckpoint(false);
    if (currentQuestionIdx < activeExamQs.length - 1 && !forceSubmit) {
      setCurrentQuestionIdx(currentQuestionIdx + 1);
      setSelectedAnswer(null);
      setValidationVisible(false);
    } else {
      let calculatedScore = 0;
      answersToUse.forEach((ans, idx) => {
        if (ans === activeExamQs[idx].correctAnswer) calculatedScore++;
      });
      setScore(calculatedScore);
      setExamActive(false);
      setTimeRemainingSeconds(null);
    }
  };

  useEffect(() => {
    if (!examActive || timeRemainingSeconds === null) return;
    
    if (timeRemainingSeconds <= 0) {
      proceedToNextQuestion(examAnswers, true);
      return;
    }

    const interval = setInterval(() => {
      setTimeRemainingSeconds(prev => (prev !== null && prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [examActive, timeRemainingSeconds]);

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    if (h > 0) {
      return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    }
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleNextQuestion = () => {
    if (instantValidation && !validationVisible) {
      setValidationVisible(true);
      return;
    }

    const newAnswers = [...examAnswers, selectedAnswer ?? -1];
    setExamAnswers(newAnswers);
    
    // Check if we hit a checkpoint
    if (checkpointInterval > 0 && newAnswers.length % checkpointInterval === 0 && newAnswers.length < activeExamQs.length) {
      setShowCheckpoint(true);
      return;
    }

    proceedToNextQuestion(newAnswers);
  };

  const getCheckpointScore = () => {
    if (!checkpointInterval) return 0;
    const recentAnswers = examAnswers.slice(-checkpointInterval);
    const recentQuestions = activeExamQs.slice(examAnswers.length - checkpointInterval, examAnswers.length);
    
    let checkpointScore = 0;
    recentAnswers.forEach((ans, idx) => {
      if (ans === recentQuestions[idx].correctAnswer) checkpointScore++;
    });
    return checkpointScore;
  };

  // --- TERMINAL LAB LOGIC ---
  const handleTerminalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!terminalInput.trim()) return;

    const newOutput = [...terminalOutput, `root@axiom-lab:~# ${terminalInput}`];
    const cmd = terminalInput.trim().toLowerCase();
    
    // NMAP LAB
    if (cmd === "nmap 10.0.4.15") {
      newOutput.push("Starting Nmap 7.93 ( https://nmap.org )");
      newOutput.push("Nmap scan report for 10.0.4.15");
      newOutput.push("Host is up (0.012s latency).");
      newOutput.push("PORT    STATE SERVICE");
      newOutput.push("22/tcp  open  ssh");
      newOutput.push("80/tcp  open  http");
      newOutput.push("443/tcp open  https");
    } else if (cmd === "nmap -sv -p 80,443 10.0.4.15" || cmd === "nmap -sv -p 80,443 10.0.4.15".toLowerCase()) {
      newOutput.push("Starting Nmap 7.93...");
      newOutput.push("PORT    STATE SERVICE VERSION");
      newOutput.push("80/tcp  open  http    nginx 1.18.0 (Ubuntu)");
      newOutput.push("443/tcp open  ssl/http nginx 1.18.0 (Ubuntu)");
      newOutput.push("");
      newOutput.push("[+] LAB OBJECTIVE COMPLETE: Web server is nginx 1.18.0");
    } 
    // PRIVILEGE ESCALATION LAB
    else if (cmd === "whoami") {
      newOutput.push("user");
    } else if (cmd === "sudo -l") {
      newOutput.push("Matching Defaults entries for user on axiom-lab:");
      newOutput.push("    env_reset, mail_badpass, secure_path=/usr/local/sbin\\:/usr/local/bin\\:/usr/sbin\\:/usr/bin\\:/sbin\\:/bin");
      newOutput.push("User user may run the following commands on axiom-lab:");
      newOutput.push("    (root) NOPASSWD: /usr/bin/vim");
    } else if (cmd.startsWith("sudo vim -c") && cmd.includes("!/bin/sh")) {
      newOutput.push("Spawning root shell...");
      newOutput.push("");
      newOutput.push("[+] LAB OBJECTIVE COMPLETE: Privilege Escalation Successful!");
      newOutput.push("root@axiom-lab:~#");
    }
    // WEB EXPLOIT LAB
    else if (cmd === "curl http://localhost:3000/api/users") {
      newOutput.push('{"error":"Forbidden","message":"Access restricted to internal network (127.0.0.1)"}');
    } else if (cmd === 'curl -h "x-forwarded-for: 127.0.0.1" http://localhost:3000/api/users' || cmd === "curl -h 'x-forwarded-for: 127.0.0.1' http://localhost:3000/api/users") {
      newOutput.push('{"status":"success","data":[{"id":1,"role":"admin","token":"Axiom_Flag{cUrL_m4st3r_99}"}]}');
      newOutput.push("");
      newOutput.push("[+] LAB OBJECTIVE COMPLETE: Extracted admin token.");
    }
    // CRYPTO LAB
    else if (cmd === "ls -la" || cmd === "ls -l") {
      newOutput.push("total 12");
      newOutput.push("-rw-r--r-- 1 user user  64 Oct 02 10:45 secret.enc");
    } else if (cmd.includes("openssl enc -aes-256-cbc -d -in secret.enc") && cmd.includes("-out secret.txt") && cmd.includes("-k axiom")) {
      newOutput.push("Decrypting payload...");
      newOutput.push("secret.txt created successfully.");
    } else if (cmd === "cat secret.txt") {
      newOutput.push("Axiom_Flag{AES_CBC_D3CRYPT3D_YAY}");
      newOutput.push("");
      newOutput.push("[+] LAB OBJECTIVE COMPLETE: Cryptography lab solved.");
    }
    // LOG ANALYSIS LAB
    else if (cmd === 'grep "failed password" /var/log/auth.log') {
      newOutput.push("Oct  2 03:14:01 axiom sshd[4193]: Failed password for root from 192.168.1.104 port 43292 ssh2");
      newOutput.push("Oct  2 03:14:03 axiom sshd[4197]: Failed password for root from 192.168.1.104 port 43294 ssh2");
      newOutput.push("Oct  2 03:14:05 axiom sshd[4201]: Failed password for root from 192.168.1.104 port 43296 ssh2");
    } else if (cmd === 'grep "failed password" /var/log/auth.log | wc -l') {
      newOutput.push("3");
      newOutput.push("");
      newOutput.push("[+] LAB OBJECTIVE COMPLETE: Found attacker IP 192.168.1.104");
    }
    // CASP ARCHITECTURE LAB
    else if (cmd === "iptables -l") {
      newOutput.push("Chain INPUT (policy ACCEPT)");
      newOutput.push("target     prot opt source               destination");
      newOutput.push("");
      newOutput.push("Chain FORWARD (policy ACCEPT)");
      newOutput.push("target     prot opt source               destination");
      newOutput.push("");
      newOutput.push("Chain OUTPUT (policy ACCEPT)");
      newOutput.push("target     prot opt source               destination");
    } else if (cmd === "iptables -a input -p tcp -j drop") {
      newOutput.push(""); // no output for iptables add
    } else if (cmd === "iptables -i input 1 -p tcp --dport 443 -j accept") {
      newOutput.push(""); // no output for iptables insert
    } else if (cmd === "iptables -s") {
      newOutput.push("-P INPUT ACCEPT");
      newOutput.push("-P FORWARD ACCEPT");
      newOutput.push("-P OUTPUT ACCEPT");
      newOutput.push("-A INPUT -p tcp -m tcp --dport 443 -j ACCEPT");
      newOutput.push("-A INPUT -p tcp -j DROP");
      newOutput.push("");
      newOutput.push("[+] LAB OBJECTIVE COMPLETE: Zero-trust micro-segmentation established.");
    }
    // UTILS
    else if (cmd === "clear") {
      setTerminalOutput([]);
      setTerminalInput("");
      return;
    } else {
      newOutput.push(`bash: ${cmd.split(" ")[0]}: command not found (or not implemented in mock)`);
    }

    setTerminalOutput(newOutput);
    setTerminalInput("");
  };

  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto", padding: "2rem" }}>
      {/* Header */}
      <header style={{ marginBottom: "2rem", borderBottom: "1px solid rgba(244, 63, 94, 0.2)", paddingBottom: "2rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1rem" }}>
          <AxiomIcon size={48} glow={true} />
          <div>
            <h1 style={{ margin: 0, fontSize: "2.5rem", color: "#FFFFFF", letterSpacing: "-0.02em" }}>
              Exultia <span style={{ color: "#F43F5E" }}>Axiom</span>
            </h1>
            <p style={{ margin: "0.25rem 0 0 0", color: "#94A3B8", fontSize: "1.1rem" }}>
              The Open-Source Security Education Framework
            </p>
          </div>
        </div>
      </header>

      {/* Main App Nav */}
      <div style={{ display: "flex", gap: "1rem", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>
        {["syllabus", "pricing"].map(view => (
          <button 
            key={view}
            onClick={() => setActiveView(view as any)}
            style={{ 
              padding: "0.75rem 1.5rem", 
              background: activeView === view ? "rgba(244, 63, 94, 0.15)" : "transparent", 
              border: activeView === view ? "1px solid rgba(244, 63, 94, 0.5)" : "1px solid transparent",
              color: activeView === view ? "#FFFFFF" : "#94A3B8",
              borderRadius: "8px", cursor: "pointer", fontWeight: 600, fontSize: "1rem", textTransform: "capitalize",
              transition: "all 0.2s ease"
            }}>
            {view === "syllabus" ? "Exam Prep" : view === "pricing" ? "Pricing & API" : view}
          </button>
        ))}
      </div>

      {/* --- VIEW: SYLLABUS --- */}
      {activeView === "syllabus" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 3fr", gap: "2rem" }}>
          
          {/* Sidebar: Cert List */}
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            <h3 style={{ color: "#FDA4AF", fontSize: "0.9rem", textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: "0.5rem" }}>Certifications</h3>
            {certsList.map(cert => (
              <button 
                key={cert.id}
                onClick={() => { setActiveCertId(cert.id); setExpandedDomain(null); }}
                style={{ 
                  textAlign: "left", padding: "1rem", borderRadius: "8px", cursor: "pointer", transition: "all 0.2s ease",
                  background: activeCertId === cert.id ? "rgba(244, 63, 94, 0.1)" : "rgba(255,255,255,0.02)",
                  border: activeCertId === cert.id ? "1px solid rgba(244, 63, 94, 0.4)" : "1px solid rgba(255,255,255,0.05)",
                  color: activeCertId === cert.id ? "#FFFFFF" : "#94A3B8"
                }}>
                <div style={{ fontWeight: 600, fontSize: "1.05rem", marginBottom: "0.25rem" }}>{cert.title}</div>
                <div style={{ fontSize: "0.8rem", color: activeCertId === cert.id ? "#FDA4AF" : "#64748B" }}>{cert.vendor} • {cert.level}</div>
              </button>
            ))}
          </div>

          {/* Main Content: Domains & Resources */}
          <div>
            <div style={{ background: "rgba(25, 5, 10, 0.4)", border: "1px solid rgba(244, 63, 94, 0.2)", borderRadius: "12px", padding: "2rem", marginBottom: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
                <h2 style={{ margin: 0, color: "#FFFFFF", fontSize: "2rem" }}>{activeCert.title}</h2>
                <span style={{ background: "rgba(244, 63, 94, 0.1)", color: "#F43F5E", padding: "0.4rem 0.8rem", borderRadius: "6px", fontWeight: 700, fontSize: "0.85rem" }}>{activeCert.vendor}</span>
              </div>
              <p style={{ color: "#94A3B8", lineHeight: 1.6, margin: "0 0 2rem 0", fontSize: "1.05rem" }}>{activeCert.description}</p>
              
              <h3 style={{ borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "0.5rem", marginBottom: "1.5rem", color: "#FDA4AF" }}>Official Exam Domains</h3>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {activeCert.domains.map(domain => {
                  const isExpanded = expandedDomain === domain.id;
                  return (
                    <div key={domain.id} style={{ border: "1px solid rgba(255,255,255,0.1)", borderRadius: "8px", background: "rgba(255,255,255,0.02)", overflow: "hidden" }}>
                      <button 
                        onClick={() => setExpandedDomain(isExpanded ? null : domain.id)}
                        style={{ width: "100%", padding: "1.25rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", border: "none", color: "#E2E8F0", cursor: "pointer", textAlign: "left", fontSize: "1.05rem", fontWeight: 600 }}>
                        <span>{domain.title}</span>
                        <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                          <span style={{ fontSize: "0.85rem", color: "#F43F5E", background: "rgba(244, 63, 94, 0.1)", padding: "0.2rem 0.5rem", borderRadius: "4px" }}>Weight: {domain.weight}</span>
                          <span style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }}>▼</span>
                        </div>
                      </button>
                      
                      {isExpanded && (
                        <div style={{ padding: "0 1.25rem 1.25rem 1.25rem", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
                          <ul style={{ color: "#94A3B8", lineHeight: 1.6, paddingLeft: "1.5rem", margin: "1rem 0 0 0" }}>
                            {domain.topics.map((topic, idx) => (
                              <li key={idx} style={{ marginBottom: "0.5rem" }}>{topic}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <h3 style={{ marginBottom: "1rem", color: "#FFFFFF" }}>Free Study Resources</h3>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "1rem" }}>
              {activeCert.resources.map((res, idx) => (
                <a key={idx} href={res.url} style={{ display: "flex", flexDirection: "column", gap: "0.25rem", padding: "1.25rem", background: "rgba(255,255,255,0.02)", borderRadius: "8px", textDecoration: "none", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <span style={{ fontSize: "0.75rem", color: "#F43F5E", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.05em" }}>{res.type}</span>
                  <span style={{ color: "#E2E8F0", fontWeight: 500, fontSize: "1rem" }}>{res.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* --- VIEW: SIMULATOR --- */}
      {activeView === "simulator" && (
        <div style={{ maxWidth: "800px", margin: "0 auto" }}>
          {!examActive && score === null && (
            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "rgba(25, 5, 10, 0.4)", borderRadius: "12px", border: "1px solid rgba(244, 63, 94, 0.2)" }}>
              <AxiomIcon size={64} glow={true} className="mx-auto" />
              <h2 style={{ color: "#FFFFFF", fontSize: "2rem", marginTop: "1.5rem" }}>Global Exam Simulator</h2>
              <p style={{ color: "#94A3B8", fontSize: "1.1rem", marginBottom: "1.5rem", maxWidth: "500px", margin: "0 auto 1.5rem auto" }}>
                Test your knowledge across {TOTAL_QUESTIONS} mixed questions from CompTIA, ISC2, and OffSec domains.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px", margin: "0 auto 2rem auto", textAlign: "left" }}>
                <div>
                  <label style={{ display: "block", color: "#E2E8F0", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: 600 }}>Questions per Session (Max: {TOTAL_QUESTIONS})</label>
                  <input 
                    type="number" 
                    value={sessionQuestionCount} 
                    onChange={(e) => setSessionQuestionCount(Number(e.target.value))} 
                    max={TOTAL_QUESTIONS}
                    min={1}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#FFFFFF" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "#E2E8F0", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: 600 }}>Exam Duration (Minutes)</label>
                  <input 
                    type="number" 
                    value={examDurationMinutes} 
                    onChange={(e) => setExamDurationMinutes(Number(e.target.value))} 
                    min={1}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#FFFFFF" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", color: "#E2E8F0", marginBottom: "0.5rem", fontSize: "0.9rem", fontWeight: 600 }}>Checkpoint Interval (Show score every X questions)</label>
                  <input 
                    type="number" 
                    value={checkpointInterval} 
                    onChange={(e) => setCheckpointInterval(Number(e.target.value))} 
                    min={0}
                    style={{ width: "100%", padding: "0.75rem", borderRadius: "6px", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.1)", color: "#FFFFFF" }}
                  />
                  <small style={{ color: "#64748B", display: "block", marginTop: "0.25rem" }}>Set to 0 to disable checkpoints.</small>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", background: "rgba(0,0,0,0.3)", padding: "1rem", borderRadius: "6px", border: "1px solid rgba(255,255,255,0.1)" }}>
                  <input 
                    type="checkbox" 
                    id="instantValidation"
                    checked={instantValidation}
                    onChange={(e) => setInstantValidation(e.target.checked)}
                    style={{ width: "1.25rem", height: "1.25rem", accentColor: "#F43F5E", cursor: "pointer" }}
                  />
                  <label htmlFor="instantValidation" style={{ color: "#E2E8F0", fontSize: "0.95rem", fontWeight: 600, cursor: "pointer", userSelect: "none" }}>
                    Enable Instant Validation
                    <span style={{ display: "block", fontSize: "0.8rem", color: "#64748B", fontWeight: 400, marginTop: "0.2rem" }}>See explanations immediately after answering.</span>
                  </label>
                </div>
              </div>

              <button 
                onClick={handleStartExam}
                style={{ padding: "1rem 2.5rem", background: "#F43F5E", color: "white", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer" }}>
                Start Practice Exam
              </button>
            </div>
          )}

          {examActive && showCheckpoint && (
            <div style={{ textAlign: "center", background: "rgba(25, 5, 10, 0.4)", borderRadius: "12px", border: "1px solid rgba(244, 63, 94, 0.2)", padding: "4rem 2rem" }}>
              <h2 style={{ color: "#FFFFFF", fontSize: "2.5rem", marginBottom: "1rem" }}>Checkpoint Reached!</h2>
              <p style={{ color: "#94A3B8", fontSize: "1.2rem", marginBottom: "2rem" }}>
                You scored <strong style={{ color: "#F43F5E", fontSize: "1.5rem" }}>{getCheckpointScore()}</strong> out of the last {checkpointInterval} questions.
              </p>
              <button 
                onClick={() => proceedToNextQuestion(examAnswers)}
                style={{ padding: "1rem 2.5rem", background: "#F43F5E", color: "white", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer" }}>
                Continue Exam
              </button>
            </div>
          )}

          {examActive && !showCheckpoint && (
            <div style={{ background: "rgba(25, 5, 10, 0.4)", borderRadius: "12px", border: "1px solid rgba(244, 63, 94, 0.2)", padding: "2rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "2rem", borderBottom: "1px solid rgba(255,255,255,0.1)", paddingBottom: "1rem" }}>
                <span style={{ color: "#FDA4AF", fontWeight: 600 }}>Question {currentQuestionIdx + 1} of {activeExamQs.length}</span>
                <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
                  {timeRemainingSeconds !== null && (
                    <span style={{ color: timeRemainingSeconds < 300 ? "#EF4444" : "#E2E8F0", fontWeight: 700, fontSize: "1.1rem", padding: "0.25rem 0.75rem", background: "rgba(0,0,0,0.3)", borderRadius: "6px", border: `1px solid ${timeRemainingSeconds < 300 ? "#EF4444" : "rgba(255,255,255,0.1)"}` }}>
                      {formatTime(timeRemainingSeconds)}
                    </span>
                  )}
                  <span style={{ color: "#94A3B8", fontSize: "0.9rem" }}>Tag: {activeExamQs[currentQuestionIdx].cert}</span>
                </div>
              </div>

              <div 
                style={{ userSelect: "none", WebkitUserSelect: "none" }} 
                onCopy={(e) => e.preventDefault()} 
                onCut={(e) => e.preventDefault()}
                onContextMenu={(e) => e.preventDefault()}
              >
                <h3 style={{ color: "#FFFFFF", fontSize: "1.3rem", lineHeight: 1.5, marginBottom: "2rem" }}>
                  {activeExamQs[currentQuestionIdx].question}
                </h3>

                <div style={{ display: "flex", flexDirection: "column", gap: "1rem", marginBottom: "2rem" }}>
                  {activeExamQs[currentQuestionIdx].options.map((opt, idx) => {
                    const isCorrect = idx === activeExamQs[currentQuestionIdx].correctAnswer;
                    let bg = selectedAnswer === idx ? "rgba(244, 63, 94, 0.2)" : "rgba(255,255,255,0.03)";
                    let border = selectedAnswer === idx ? "1px solid #F43F5E" : "1px solid rgba(255,255,255,0.1)";
                    let color = selectedAnswer === idx ? "#FFFFFF" : "#E2E8F0";
                    
                    if (validationVisible) {
                      if (isCorrect) {
                        bg = "rgba(52, 211, 153, 0.2)";
                        border = "1px solid #34D399";
                        color = "#34D399";
                      } else if (selectedAnswer === idx && !isCorrect) {
                        bg = "rgba(239, 68, 68, 0.2)";
                        border = "1px solid #EF4444";
                        color = "#EF4444";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        disabled={validationVisible}
                        onClick={() => setSelectedAnswer(idx)}
                        style={{
                          textAlign: "left", padding: "1.25rem", borderRadius: "8px", cursor: validationVisible ? "default" : "pointer", fontSize: "1rem",
                          background: bg, border: border, color: color,
                          transition: "all 0.2s"
                        }}>
                        <span style={{ fontWeight: 600, marginRight: "1rem", color: validationVisible ? color : (selectedAnswer === idx ? "#FDA4AF" : "#64748B") }}>
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>

                {validationVisible && (
                  <div style={{ padding: "1.5rem", background: "rgba(255,255,255,0.05)", borderRadius: "8px", marginBottom: "2rem", borderLeft: "4px solid #F43F5E" }}>
                    <h4 style={{ margin: "0 0 0.5rem 0", color: "#FDA4AF" }}>Explanation</h4>
                    <p style={{ margin: 0, color: "#E2E8F0", lineHeight: 1.6 }}>{activeExamQs[currentQuestionIdx].explanation}</p>
                  </div>
                )}
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button
                  disabled={selectedAnswer === null}
                  onClick={handleNextQuestion}
                  style={{ 
                    padding: "0.75rem 2rem", background: selectedAnswer !== null ? "#F43F5E" : "rgba(255,255,255,0.1)", 
                    color: selectedAnswer !== null ? "white" : "#64748B", border: "none", borderRadius: "8px", fontWeight: 600, cursor: selectedAnswer !== null ? "pointer" : "not-allowed" 
                  }}>
                  {instantValidation && !validationVisible ? "Submit Answer" : (currentQuestionIdx === activeExamQs.length - 1 ? "Submit Exam" : "Next Question")}
                </button>
              </div>
            </div>
          )}

          {score !== null && (
            <div style={{ textAlign: "center", padding: "4rem 2rem", background: "rgba(25, 5, 10, 0.4)", borderRadius: "12px", border: "1px solid rgba(244, 63, 94, 0.2)" }}>
              <div style={{ fontSize: "5rem", fontWeight: 900, color: "#F43F5E", marginBottom: "1rem" }}>
                {Math.round((score / activeExamQs.length) * 100)}%
              </div>
              <h2 style={{ color: "#FFFFFF", fontSize: "2rem", marginBottom: "1rem" }}>
                You scored {score} out of {activeExamQs.length}
              </h2>
              <div style={{ textAlign: "left", background: "rgba(255,255,255,0.02)", padding: "2rem", borderRadius: "8px", marginTop: "2rem" }}>
                <h3 style={{ color: "#FDA4AF", marginBottom: "1rem" }}>Review Answers</h3>
                {activeExamQs.map((q, idx) => {
                  const userAns = examAnswers[idx];
                  const isCorrect = userAns === q.correctAnswer;
                  return (
                    <div key={q.id} style={{ marginBottom: "1.5rem", paddingBottom: "1.5rem", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
                      <div style={{ color: "#E2E8F0", fontWeight: 600, marginBottom: "0.5rem" }}>Q: {q.question}</div>
                      <div style={{ color: isCorrect ? "#34D399" : "#EF4444", fontWeight: 600, marginBottom: "0.5rem" }}>
                        Your Answer: {q.options[userAns]} {isCorrect ? "✓" : "✗"}
                      </div>
                      {!isCorrect && (
                        <div style={{ color: "#34D399", fontWeight: 600, marginBottom: "0.5rem" }}>
                          Correct Answer: {q.options[q.correctAnswer]}
                        </div>
                      )}
                      <div style={{ color: "#94A3B8", fontSize: "0.9rem", fontStyle: "italic" }}>Explanation: {q.explanation}</div>
                    </div>
                  );
                })}
              </div>
              <button onClick={() => setScore(null)} style={{ marginTop: "2rem", padding: "1rem 2.5rem", background: "#F43F5E", color: "white", border: "none", borderRadius: "8px", fontSize: "1.1rem", fontWeight: 700, cursor: "pointer" }}>
                Try Again
              </button>
            </div>
          )}
        </div>
      )}

      {/* --- VIEW: LABS --- */}
      {activeView === "labs" && (
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "2rem" }}>
          <div>
            <h3 style={{ color: "#FDA4AF", marginBottom: "1rem" }}>Available Labs</h3>
            {LABS_DB.map(lab => (
              <div 
                key={lab.id} 
                onClick={() => { setActiveLabId(lab.id); setTerminalOutput([]); setTerminalInput(""); }}
                style={{ 
                  background: activeLabId === lab.id ? "rgba(244, 63, 94, 0.15)" : "rgba(255,255,255,0.02)", 
                  border: activeLabId === lab.id ? "1px solid #F43F5E" : "1px solid rgba(255,255,255,0.1)",
                  padding: "1.5rem", borderRadius: "8px", cursor: "pointer", marginBottom: "1rem", transition: "all 0.2s"
                }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                  <span style={{ fontSize: "0.75rem", color: "#F43F5E", fontWeight: 700, padding: "0.2rem 0.5rem", background: "rgba(244, 63, 94, 0.1)", borderRadius: "4px" }}>{lab.type}</span>
                  <span style={{ fontSize: "0.75rem", color: "#94A3B8" }}>{lab.difficulty}</span>
                </div>
                <h4 style={{ color: "#FFFFFF", fontSize: "1.1rem", margin: "0 0 0.5rem 0" }}>{lab.title}</h4>
                <p style={{ color: "#94A3B8", fontSize: "0.85rem", margin: 0, lineHeight: 1.5 }}>{lab.objective}</p>
              </div>
            ))}
          </div>

          <div>
            {activeLabId ? (
              <div style={{ background: "#0a0a0a", borderRadius: "8px", border: "1px solid rgba(244, 63, 94, 0.3)", overflow: "hidden" }}>
                <div style={{ background: "rgba(20, 10, 15, 1)", padding: "1rem 1.5rem", borderBottom: "1px solid rgba(244, 63, 94, 0.2)", display: "flex", alignItems: "center", gap: "1rem" }}>
                  <span style={{ width: "12px", height: "12px", borderRadius: "50%", background: "#F43F5E" }}></span>
                  <span style={{ color: "#FDA4AF", fontFamily: "monospace", fontWeight: 600 }}>axiom-lab-terminal</span>
                </div>
                <div style={{ padding: "1.5rem", color: "#A3A3A3", fontFamily: "monospace", minHeight: "400px" }}>
                  <div style={{ color: "#F43F5E", marginBottom: "1.5rem" }}>
                    Welcome to Axiom Labs.<br/>
                    Currently running: {LABS_DB.find(l => l.id === activeLabId)?.title}
                  </div>
                  
                  <div style={{ marginBottom: "2rem", background: "rgba(255,255,255,0.05)", padding: "1rem", borderRadius: "4px" }}>
                    <div style={{ color: "#E2E8F0", marginBottom: "0.5rem" }}>Instructions:</div>
                    {LABS_DB.find(l => l.id === activeLabId)?.instructions.map((inst, i) => (
                      <div key={i} style={{ color: "#94A3B8", marginBottom: "0.25rem" }}>{inst}</div>
                    ))}
                  </div>

                  {terminalOutput.map((out, idx) => (
                    <div key={idx} style={{ marginBottom: "0.25rem", color: out.includes("root@") ? "#34D399" : out.includes("COMPLETE") ? "#FBBF24" : "#A3A3A3" }}>
                      {out}
                    </div>
                  ))}

                  <form onSubmit={handleTerminalSubmit} style={{ display: "flex", marginTop: "1rem", alignItems: "center" }}>
                    <span style={{ color: "#34D399", marginRight: "0.5rem" }}>root@axiom-lab:~#</span>
                    <input 
                      type="text" 
                      value={terminalInput}
                      onChange={e => setTerminalInput(e.target.value)}
                      style={{ background: "transparent", border: "none", color: "#FFFFFF", fontFamily: "monospace", fontSize: "1rem", outline: "none", width: "100%" }}
                      autoFocus
                      autoComplete="off"
                    />
                  </form>
                </div>
              </div>
            ) : (
              <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%", background: "rgba(25, 5, 10, 0.2)", borderRadius: "12px", border: "1px dashed rgba(255,255,255,0.1)" }}>
                <span style={{ color: "#64748B" }}>Select a lab to begin the simulation.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- VIEW: PRICING --- */}
      {activeView === "pricing" && (
        <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
          <h2 style={{ color: "white", fontSize: "2rem", marginBottom: "1rem" }}>Axiom Pricing & LMS API</h2>
          <p style={{ color: "#94A3B8", fontSize: "1.1rem", marginBottom: "3rem", lineHeight: 1.6 }}>
            Our web-based exam simulator is free for individual students. For organizations, universities, and enterprise training programs, we offer a dedicated API to publish our certified content directly into your internal Learning Management Systems (LMS).
          </p>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem", textAlign: "left" }}>
            
            {/* Free Tier */}
            <div style={{ background: "rgba(15, 23, 42, 0.6)", border: "1px solid rgba(255, 255, 255, 0.1)", borderRadius: "16px", padding: "2.5rem" }}>
              <h3 style={{ color: "white", fontSize: "1.5rem", margin: "0 0 0.5rem 0" }}>Student / Individual</h3>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "1.5rem" }}>Free</div>
              <ul style={{ color: "#94A3B8", margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <li>✓ Full access to 15,000+ certification questions</li>
                <li>✓ Interactive exam simulator with timers</li>
                <li>✓ Instant explanations & feedback</li>
                <li>✓ Checkpoints & progress tracking</li>
                <li style={{ color: "#F43F5E" }}>✗ No API access</li>
                <li style={{ color: "#F43F5E" }}>✗ No SCORM/LMS exports</li>
              </ul>
            </div>

            {/* Enterprise Tier */}
            <div style={{ background: "rgba(244, 63, 94, 0.05)", border: "1px solid rgba(244, 63, 94, 0.5)", borderRadius: "16px", padding: "2.5rem", position: "relative" }}>
              <div style={{ position: "absolute", top: "-12px", right: "2rem", background: "#F43F5E", color: "white", padding: "4px 12px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 800 }}>ENTERPRISE</div>
              <h3 style={{ color: "white", fontSize: "1.5rem", margin: "0 0 0.5rem 0" }}>LMS API Integration</h3>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "#FFFFFF", marginBottom: "1.5rem" }}>$499<span style={{ fontSize: "1rem", color: "#94A3B8", fontWeight: 400 }}>/mo</span></div>
              <p style={{ color: "#94A3B8", fontSize: "0.9rem", marginBottom: "1.5rem" }}>Or one-time fee of $2,500 per 250 questions.</p>
              <ul style={{ color: "#94A3B8", margin: 0, padding: 0, listStyle: "none", display: "flex", flexDirection: "column", gap: "1rem" }}>
                <li>✓ <strong>Everything in Free</strong></li>
                <li>✓ <strong>Enterprise API Endpoint Access</strong></li>
                <li>✓ Synchronize to internal LMS</li>
                <li>✓ SCORM compatible JSON exports</li>
                <li>✓ Private content publishing rights</li>
              </ul>
              <button style={{ width: "100%", padding: "1rem", background: "#F43F5E", color: "white", border: "none", borderRadius: "8px", fontWeight: 700, marginTop: "2rem", cursor: "pointer" }}>
                Upgrade in Dashboard
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
