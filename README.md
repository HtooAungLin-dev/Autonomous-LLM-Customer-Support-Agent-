# Autonomous LLM Customer Support Agent 🤖💼

> Building an autonomous customer support agent worth shipping. An intelligent agent that can read support tickets, query databases securely, look up company policies, draft context-aware customer emails, or escalate to human staff when necessary.

The core challenge of production-grade LLM agents isn't the language model itself—it's the robust engineering scaffolding surrounding it that determines what the agent is allowed to do, when, and under whose authority.

---

## 🏗️ Architecture & Core Components

This agent is built with a strong focus on **safety, predictability, and boundary enforcement**:

1. **The Orchestration Loop:** Manages multi-step reasoning where the agent dynamically calls tools sequentially (e.g., lookup customer -> check rental/billing history -> query company policy -> draft response) until it reaches a conclusion.
2. **Deterministic Security Scaffolding (Guardrails):**
   - **SQL Safeguards:** Regex-based query analysis that automatically rejects destructive keywords (`INSERT`, `UPDATE`, `DELETE`, `DROP`, `ALTER`, `CREATE`). Automatic query limiting (`LIMIT` injection) to prevent massive PII data leaks into context windows.
   - **Approval Gates:** Intercepts sensitive tool calls or external actions (like sending emails or executing account modifications) for human-in-the-loop review before execution.
3. **Tool Ecosystem:**
   - `get_db_schema`: Exposes database metadata dynamically so the model writes accurate, syntax-valid queries without guesswork.
   - `run_sql_query`: Safely executes read-only queries against operational databases (e.g., Sakila or custom CRM schemas).
   - `get_policy`: Queries internal markdown/vector-based policy docs to accurately quote terms, refund rules, and late-fee guidelines.
4. **Skill Documentation / Prompt Strategy:** Provides structured role constraints rather than hardcoded brittle rules, ensuring tone consistency and empathetic problem resolution.

---

## 🗂️ Project Structure

```text
├── agent/
│   ├── core.py             # Main agent orchestration loop & reasoning engine
│   ├── prompts.py          # System prompts, skill guidelines, and behavior definitions
│   └── state.py            # Conversation and execution state management
├── tools/
│   ├── database.py         # Secure SQL execution layer + schema inspection tools
│   ├── policy.py           # Policy retrieval and documentation lookup tools
│   └── communications.py   # Email drafting and ticket management integration
├── guardrails/
│   ├── sql_validator.py    # Regex verification and automatic LIMIT appender
│   └── human_approval.py   # HITL gatekeeper logic for production safety
├── data/                   # Sample operational databases (e.g., SQLite/PostgreSQL setup)
├── tests/                  # Unit and integration test suites for agent tools
├── .env.example            # Environment variable template
├── main.py                 # Application entry point
└── README.md
