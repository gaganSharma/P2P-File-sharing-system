# 🧠 HOW TO USE THIS APP (Even If You’re Totally Clueless)

Hi! You probably downloaded this app and now you're confused why nothing works.

Don’t worry. This guide is made *just for you*. Just follow these steps **without skipping** anything, and you won’t need to bug me again.

---

## ✅ STEP 1: Install Node.js

If you don’t already have Node.js:

* Go to 👉 [https://nodejs.org/](https://nodejs.org/)
* Download the **LTS version**
* Install it (just click Next → Next → Install)

To check if it worked:

1. Press `Win + R`, type `cmd`, press Enter.
2. In the black box, type:

   ```bash
   node -v
   ```

   If you see something like `v18.XX.X`, it’s working. 👍

---

## ✅ STEP 2: Run the Setup Script

Inside your project folder, you’ll see a file called `setup.bat`.
**Double-click it.** That’s all. It will:

* Check if Node is installed
* Install the stuff the app needs
* Start the app in a new window

> 🔁 If the script shows an error or closes immediately, you did something wrong. Try again *slowly*.

---

## ✅ STEP 3: See the App

When the setup is done, a new window will open and the app will start running.

If it says something like:

```
Local:   http://localhost:5173/
```

then open that link in your browser. That’s your app running!

---

## 🚫 FAQ – Problems You Might Cause Yourself

**❓ I double-clicked but nothing happened.**
→ You didn’t install Node.js properly. Go back to Step 1.

**❓ It says `package.json` not found.**
→ You’re in the wrong folder. Open the folder where the app files are.

**❓ App opened but I closed the window.**
→ Just double-click `setup.bat` again, or open `cmd`, go to the folder, and type:

```bash
npm run dev
```

**❓ Still stuck?**
→ Ask someone who reads instructions better than you. 🤫

---

Made by: **\[Your Name Here]**
Be smart. Read things. Life gets easier. 😄
