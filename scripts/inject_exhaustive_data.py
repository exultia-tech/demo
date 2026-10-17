import json

def main():
    with open('exhaustive_pdp11_results.json', 'r') as f:
        data = json.load(f)

    results = data['results']

    ts_code = "\nexport interface ExhaustivePdp11TestItem {\n"
    ts_code += "  index: number;\n"
    ts_code += "  binary_or_syscall: string;\n"
    ts_code += "  category: string;\n"
    ts_code += "  cwe: string;\n"
    ts_code += "  vulnerability_description: string;\n"
    ts_code += "  tier1_remediation: string;\n"
    ts_code += "  rollback_command: string;\n"
    ts_code += "  verification_status: string;\n"
    ts_code += "}\n\n"
    ts_code += f"export const EXHAUSTIVE_PDP11_TEST_ITEMS: ExhaustivePdp11TestItem[] = {json.dumps(results, indent=2)};\n"

    with open('src/lib/unix-v1-data.ts', 'r') as f:
        existing = f.read()

    if 'EXHAUSTIVE_PDP11_TEST_ITEMS' not in existing:
        with open('src/lib/unix-v1-data.ts', 'w') as f:
            f.write(existing + ts_code)
        print(f"Successfully appended {len(results)} exhaustive PDP-11 test items to src/lib/unix-v1-data.ts!")
    else:
        print("EXHAUSTIVE_PDP11_TEST_ITEMS already present.")

if __name__ == '__main__':
    main()
