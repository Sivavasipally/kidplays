# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a new Python project repository named "kidplays". The repository is currently in its initial state with only git configuration files present.

## Development Setup

Since this is a new Python project, the typical development workflow will likely involve:

1. **Virtual Environment**: Create and activate a Python virtual environment
   ```bash
   python -m venv venv
   # Windows
   venv\Scripts\activate
   # Unix/MacOS
   source venv/bin/activate
   ```

2. **Dependencies**: Install dependencies when a requirements.txt or pyproject.toml is added
   ```bash
   pip install -r requirements.txt
   # or for modern Python projects
   pip install -e .
   ```

## Common Commands

Since no specific build tools or package managers are configured yet, standard Python commands will apply:

- **Run Python scripts**: `python <script_name>.py`
- **Install packages**: `pip install <package_name>`
- **Run tests**: `python -m pytest` (when pytest is configured)
- **Format code**: `python -m black .` (when black is configured)
- **Lint code**: `python -m flake8` or `ruff check .` (when configured)

## Project Structure

The project is currently empty. As the project develops, typical Python project structure should include:

- Source code in a main package directory
- Tests in a separate tests/ directory
- Configuration files (requirements.txt, pyproject.toml, setup.py)
- Documentation and README files

## Git Configuration

- `.gitignore` is configured for Python projects with comprehensive exclusions for common Python build artifacts, virtual environments, and IDE files
- `.gitattributes` is set for automatic text file handling

## Notes for Future Development

- This appears to be a fresh repository, so establish the project structure and dependencies as development begins
- Consider using modern Python packaging with pyproject.toml instead of setup.py
- The project name "kidplays" suggests content related to children's activities or games
- Add proper documentation and tests as the codebase grows