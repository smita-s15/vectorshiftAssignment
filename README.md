# 💼 Vectorshift Assignment

This is a full-stack project built as part of the **Vectorshift assignment** by **Smita Shinde**.

The repository contains two branches:

- 🔷 `frontend` – Developed using **React**, **TypeScript**, **Tailwind CSS**, and **React Flow**
- 🔶 `backend` – Built with **Python** and **FastAPI**

---

## 🧭 Branch Overview

| Branch     | Purpose                       | Tech Stack                             |
| ---------- | ----------------------------- | -------------------------------------- |
| `frontend` | UI for interactive node flows | React, JavaScript, Zustand, React Flow |
| `backend`  | API and server logic          | Python, FastAPI, Uvicorn, Pydantic     |

---

## 🚀 Quick Start Guide

### 1️⃣ Clone the Repository

git clone https://github.com/smita-s15/vectorshiftAssignment.git
cd vectorshiftAssignment

### Frontend SetUp--

git checkout frontend
npm install
npm run dev
Frontend Project Structure
src/
├── components/
├── hooks/ #custom hooks for ReactFlow
├── nodes/ # Custom node types for React Flow
├── ReactFlowUI/ # UI regarding React Flow
├── store/ # Zustand state store
├── App.js # App logic


### Backend SetUp

git checkout backend
python -m venv env
source env/bin/activate # or `env\Scripts\activate` on Windows
pip install -r requirements.txt
uvicorn main:app --reload

backend Project Structure

├── main.py # FastAPI
