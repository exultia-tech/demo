import os

file_path = os.path.join('src', 'components', 'Navbar.tsx')
with open(file_path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Update import
old_import = 'import { ExultiaLogo, PureIdeIcon, VantageIcon, InquestIcon, PraxisIcon, PureOsIcon, AxiomIcon } from "@/components/BrandIcons";'
new_import = 'import { ExultiaLogo, PureIdeIcon, VantageIcon, InquestIcon, PraxisIcon, PureOsIcon, AxiomIcon, KineticIcon } from "@/components/BrandIcons";'

if old_import in content:
    content = content.replace(old_import, new_import)

# 2. Add product dropdown link after Praxis
praxis_block_end = '                    </Link>\n\n                    {/* PRODUCT 5: PureOS */}'
kinetic_block = '''                    </Link>

                    {/* PRODUCT CONCEPT: Kinetic (Rapid Patch Feed) */}
                    <Link 
                      href="/app/patches" 
                      onClick={() => setIsProductsOpen(false)}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "12px",
                        padding: "10px 12px",
                        borderRadius: "10px",
                        textDecoration: "none",
                        transition: "background 0.15s ease",
                        background: pathname.startsWith("/app/patches") ? "rgba(6, 182, 212, 0.15)" : "transparent"
                      }}
                      className="dropdown-item"
                    >
                      <div style={{ flexShrink: 0 }}>
                        <KineticIcon size={32} />
                      </div>
                      <div>
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#FFFFFF" }}>Kinetic</span>
                          <span style={{ fontSize: "0.65rem", background: "rgba(6, 182, 212, 0.2)", color: "#22D3EE", border: "1px solid rgba(6, 182, 212, 0.4)", padding: "1px 5px", borderRadius: "4px", fontWeight: 700 }}>NEW CONCEPT</span>
                        </div>
                        <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "2px" }}>Rapid zero-downtime patch management feed</div>
                      </div>
                    </Link>

                    {/* PRODUCT 5: PureOS */}'''

if praxis_block_end in content and 'href="/app/patches"' not in content:
    content = content.replace(praxis_block_end, kinetic_block)
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("SUCCESS: Navbar updated with Kinetic")
elif 'href="/app/patches"' in content:
    print("INFO: Navbar already has Kinetic")
else:
    print("WARNING: Could not find exact replacement target in Navbar.tsx")
