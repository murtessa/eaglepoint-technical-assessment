# Full-stack Developer Technical Assessment

This repository contains solutions for three coding tasks as part of a technical assessment.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Python 3.6+** (for Task 1)
  - Check your version: `python --version` or `python3 --version`
- **Node.js 18+** (for Tasks 2 and 3)
  - Check your version: `node --version`
  - Node.js 18+ includes built-in `fetch()` API (no additional packages needed)

## Cloning the Repository

To get started, clone this repository to your local machine:

```bash
git clone https://github.com/murtessa/eaglepoint-technical-assessment
cd eaglepoint-technical-assessment
```

## Setup

No additional setup or installation is required! This project uses only standard libraries:

- **Task 1 (Python)**: Uses only Python standard library (no pip packages needed)
- **Task 2 (JavaScript)**: Uses built-in `fetch()` API (Node.js 18+) and standard JavaScript
- **Task 3 (JavaScript)**: Uses standard JavaScript with no external dependencies

Simply clone the repository and you're ready to run the code.

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

### Task 1: Smart Text Analyzer (Python)

Run the main program:
```bash
cd task1-smart-text-analyzer
python text_analyzer.py
```

Run the test suite:
```bash
python test_text_analyzer.py
```

**Note:** On some systems, you may need to use `python3` instead of `python`.

### Task 2: Async Data Fetcher (JavaScript)

Run the test suite:
```bash
cd task2-async-data-fetcher
node test_dataFetcher.js
```

The test suite includes both mock API tests (no internet required) and optional real API tests.

### Task 3: Rate Limiter (JavaScript)

Run the test suite with working examples:
```bash
cd task3-rate-limiter
node test_rateLimiter.js
```

This will demonstrate various rate limiting scenarios including basic usage, blocking, auto-reset, and multiple users.

## Documentation

Each task includes comprehensive documentation in its respective `DOCUMENTATION.md` file, covering:
- Search history and research
- Thought process and design decisions
- Step-by-step implementation process
- Why the solution is optimal

For detailed information about each implementation, please refer to:
- `task1-smart-text-analyzer/DOCUMENTATION.md`
- `task2-async-data-fetcher/DOCUMENTATION.md`
- `task3-rate-limiter/DOCUMENTATION.md`

## Quick Start

1. **Clone the repository** (see [Cloning the Repository](#cloning-the-repository) above)
2. **Verify prerequisites** are installed (Python 3.6+ and Node.js 18+)
3. **Navigate to any task directory** and run the code
4. **Read the documentation** in each task's `DOCUMENTATION.md` for implementation details

## Features

- ✅ **Task 1**: Text analysis with word count, average length, longest words, and frequency
- ✅ **Task 2**: Async data fetching with automatic retry logic (1 second delay between retries)
- ✅ **Task 3**: Sliding window rate limiter (5 requests per 60 seconds per user)

All tasks include:
- Complete implementation
- Comprehensive test suites
- Detailed documentation
- Error handling
- Edge case coverage
