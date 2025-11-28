# Full-stack Developer Technical Assessment

This repository contains solutions for three coding tasks as part of a technical assessment.

## Project Structure

```
eaglepoint-technical-assessment/
├── README.md (this file)
├── task1-smart-text-analyzer/
│   ├── text_analyzer.py
│   ├── test_text_analyzer.py
│   └── DOCUMENTATION.md
├── task2-async-data-fetcher/
│   ├── dataFetcher.js
│   ├── test_dataFetcher.js
│   └── DOCUMENTATION.md
└── task3-rate-limiter/
    ├── rateLimiter.js
    ├── test_rateLimiter.js
    └── DOCUMENTATION.md
```

## Tasks Overview

### Task 1: Smart Text Analyzer (Python)
A function that analyzes text and returns word count, average word length, longest words, and word frequency.

**Location:** `task1-smart-text-analyzer/`

### Task 2: Async Data Fetcher with Retry (JavaScript)
A JavaScript function that fetches data from a URL with automatic retry logic on failure.

**Location:** `task2-async-data-fetcher/`

### Task 3: Rate Limiter (JavaScript)
A rate limiter implementation that limits requests to 5 per 60 seconds per user.

**Location:** `task3-rate-limiter/`

## Running the Code

### Task 1 (Python)
```bash
cd task1-smart-text-analyzer
python text_analyzer.py
python test_text_analyzer.py
```

### Task 2 (JavaScript)
```bash
cd task2-async-data-fetcher
node test_dataFetcher.js
```

### Task 3 (JavaScript)
```bash
cd task3-rate-limiter
node test_rateLimiter.js
```

## Documentation

Each task includes comprehensive documentation in its respective `DOCUMENTATION.md` file, covering:
- Search history and research
- Thought process and design decisions
- Step-by-step implementation process
- Why the solution is optimal

