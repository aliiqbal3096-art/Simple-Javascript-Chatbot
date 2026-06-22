document.addEventListener("DOMContentLoaded", () => {
  const messageInput = document.getElementById("messageInput");
  const sendMessageBtn = document.getElementById("sendMessageBtn");
  const chatDisplay = document.getElementById("chatDisplay");
  const themeButtons = document.querySelectorAll(".theme-button");
  const gradientBackground = document.getElementById("gradient-background");
  const hackerEffectOverlay = document.querySelector(".hacker-effect-overlay");

  // --- Theme Switching Functionality ---
  const applyTheme = (theme) => {
    document.body.classList.remove("dark-theme", "light-theme", "moon-theme");
    document.body.classList.add(`${theme}-theme`);
    localStorage.setItem("nova-theme", theme); // Save theme preference

    // Update active button state
    themeButtons.forEach((button) => {
      button.classList.remove("active");
      if (button.dataset.theme === theme) {
        button.classList.add("active");
      }
    });
  };

  // Load saved theme or set default (Dark)
  const savedTheme = localStorage.getItem("nova-theme") || "dark";
  applyTheme(savedTheme);

  themeButtons.forEach((button) => {
    button.addEventListener("click", () => {
      applyTheme(button.dataset.theme);
    });
  });

  // --- Dynamic Background Color Movement (Refined from CSS) ---
  let hue = 0;
  let saturation = 50; // Initial saturation
  let lightness = 10; // Initial lightness

  function animateBackground() {
    hue = (hue + 0.1) % 360; // Rotate hue
    // Subtle pulsation for saturation and lightness
    saturation = 50 + Math.sin(Date.now() * 0.0001) * 10;
    lightness = 10 + Math.cos(Date.now() * 0.0001) * 5;

    // Using HSL for dynamic color generation (example for a single color base)
    // For the two-tone yellowish/brown, we'll shift CSS variables
    const currentPrimaryHue = (hue + 30) % 360; // Yellowish hue offset
    const currentSecondaryHue = (hue + 60) % 360; // Brownish hue offset

    // We'll update the CSS variables directly for the gradient
    document.body.style.setProperty(
      "--background-start",
      `hsl(${currentPrimaryHue}, ${saturation + 10}%, ${lightness + 5}%)`,
    );
    document.body.style.setProperty(
      "--background-end",
      `hsl(${currentSecondaryHue}, ${saturation}%, ${lightness}%)`,
    );

    requestAnimationFrame(animateBackground);
  }
  animateBackground(); // Start background animation

  // --- Hacker-Type Moving Objects (Binary Rain & Glowing Lines) ---
  const createHackerEffect = () => {
    const char =
      Math.random() < 0.5
        ? String.fromCharCode(48 + Math.floor(Math.random() * 2))
        : String.fromCharCode(0x2500 + Math.random() * 99); // Binary or Box Drawing chars
    const span = document.createElement("span");
    span.innerText = char;
    span.style.position = "absolute";
    span.style.left = `${Math.random() * 100}vw`;
    span.style.top = `-50px`; // Start above screen
    span.style.color = `var(--hacker-effect-color)`;
    span.style.opacity = Math.random() * 0.7 + 0.3;
    span.style.fontSize = `${Math.random() * 1.5 + 0.8}em`;
    span.style.transition = `transform ${Math.random() * 10 + 5}s linear, opacity ${Math.random() * 3 + 2}s linear`;

    hackerEffectOverlay.appendChild(span);

    // Animate falling and fading
    setTimeout(() => {
      span.style.transform = `translateY(${window.innerHeight + 100}px)`;
      span.style.opacity = 0;
    }, 10); // Small delay to apply initial styles before transition

    // Remove after animation to prevent DOM clutter
    span.addEventListener("transitionend", () => {
      span.remove();
    });
  };

  // Generate a new character/line every X milliseconds
  setInterval(createHackerEffect, 50); // Adjust frequency

  // --- Message Input Box Behavior (Enter vs Shift+Enter) ---
  messageInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevent default new line
      sendMessage();
    }
    // If Shift+Enter, allow default new line
  });

  sendMessageBtn.addEventListener("click", sendMessage);

  function sendMessage() {
    const userMessageText = messageInput.value.trim();
    if (userMessageText) {
      appendMessage(userMessageText, "user");
      messageInput.value = ""; // Clear input
      adjustInputHeight(); // Reset height
      // Simulate AI response (replace with actual backend call later)
      setTimeout(() => {
        simulateAIResponse(userMessageText);
      }, 1000); // Simulate network delay
    }
  }

  function appendMessage(text, sender) {
    const messageDiv = document.createElement("div");
    messageDiv.classList.add("message", `${sender}-message`);

    const avatarImg = document.createElement("img");
    avatarImg.classList.add("avatar", `${sender}-avatar`);
    avatarImg.src = sender === "user" ? "assets/affan.jpg" : "assets/ai.jpg";
    avatarImg.alt = sender === "user" ? "Your Avatar" : "NOVA Avatar";

    const messageText = document.createElement("p");
    messageText.classList.add("message-text");
    messageText.style.fontSize = "12px"; // Ensure font size 12
    messageText.style.fontFamily = "Calibri, sans-serif"; // Ensure Calibri font

    // Handle code blocks (simple markdown-like detection)
    if (text.includes("```")) {
      const parts = text.split("```");
      parts.forEach((part, index) => {
        if (index % 2 === 1) {
          // This is a code block
          const codeBlock = document.createElement("div");
          codeBlock.classList.add("code-block");
          const pre = document.createElement("pre");
          // Simple "syntax highlighting" - will need a proper library for real highlighting
          pre.innerHTML = highlightCode(part);
          codeBlock.appendChild(pre);
          messageText.appendChild(codeBlock);
        } else {
          // Regular text
          messageText.appendChild(document.createTextNode(part));
        }
      });
    } else {
      messageText.innerText = text;
    }

    // Add emojis if present (simple replacement for now)
    messageText.innerHTML = addEmojis(messageText.innerHTML);

    if (sender === "user") {
      messageDiv.appendChild(messageText);
      messageDiv.appendChild(avatarImg);
    } else {
      messageDiv.appendChild(avatarImg);
      messageDiv.appendChild(messageText);
    }

    chatDisplay.appendChild(messageDiv);
    chatDisplay.scrollTop = chatDisplay.scrollHeight; // Auto-scroll to bottom
  }

  function simulateAIResponse(userPrompt) {
    let aiResponse =
      "Hi, I am NOVA, Your personal AI coding assistant. I am still under development. ";
    let emojis = ["✨", "💡", "🤖", "🚀", "💻", "🧠", "🌟", "🛠️", "✅", "🎉"];
    let randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];

    if (
      userPrompt.toLowerCase().includes("hello") ||
      userPrompt.toLowerCase().includes("hi")
    ) {
      aiResponse = `Hello there! ${randomEmoji} How can I assist you with your coding journey today?`;
    } else if (userPrompt.toLowerCase().includes("code")) {
      aiResponse = `Okay, I can help with that. 
            <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>My Complete Webpage</title>
  <style>
    body {
      background-color: #e0f7fa;
      font-family: Verdana, sans-serif;
      padding: 20px;
    }
    h1 {
      color: #00796b;
      text-align: center;
    }
    p {
      color: #444;
      line-height: 1.6;
    }
    ul {
      list-style-type: square;
      margin: 20px 0;
    }
    a {
      color: #0288d1;
      text-decoration: none;
    }
    table {
      width: 50%;
      border-collapse: collapse;
      margin: 20px 0;
    }
    th, td {
      border: 1px solid #bbb;
      padding: 8px;
      text-align: center;
    }
    th {
      background-color: #b2dfdb;
    }
  </style>
</head>
<body>

  <h1>Welcome to My Complete Webpage</h1>

  <p>This webpage includes several common HTML elements and some CSS styling to make it look nice.</p>

  <h2>My Favorite Hobbies</h2>
  <ul>
    <li>Coding</li>
    <li>Reading</li>
    <li>Exploring nature</li>
  </ul>

  <h2>Useful Link</h2>
  <p>Check out <a href="https://www.w3schools.com" target="_blank">W3Schools</a> for more HTML and CSS tutorials!</p>

  <h2>Here’s an Image</h2>
  <img src="https://via.placeholder.com/300x200" alt="Sample Image" width="300" height="200">

  <h2>Sample Table</h2>
  <table>
    <tr>
      <th>Item</th>
      <th>Quantity</th>
      <th>Price</th>
    </tr>
    <tr>
      <td>Apples</td>
      <td>5</td>
      <td>$3</td>
    </tr>
    <tr>
      <td>Oranges</td>
      <td>8</td>
      <td>$4</td>
    </tr>
  </table>

</body>
</html>
 ${randomEmoji}`;
    } else if (userPrompt.toLowerCase().includes("css")) {
      aiResponse = `CSS stands for Cascading Style Sheets. It's a style sheet language used to describe the look and formatting of a document written in HTML.

✅ Key points about CSS:

Purpose: Controls the layout and appearance of web pages.

Separation of content and style: HTML handles the content, CSS handles the styling.

Flexibility: You can change fonts, colors, margins, spacing, and more!

Responsive design: CSS makes it easier to create websites that look good on different devices (like phones and tablets).

✅ Example CSS code:

css
Copy
Edit
body {
  background-color: lightblue;
  font-family: Arial, sans-serif;
}

h1 {
  color: darkblue;
  text-align: center;
}
This would give a light blue background, center-align the <h1> heading, and use the Arial font for the text. ${randomEmoji}`;
    } else if (userPrompt.toLowerCase().includes("html")) {
      aiResponse = `HTML, or HyperText Markup Language, is the standard markup language for documents designed to be displayed in a web browser. It can be assisted by technologies such as Cascading Style Sheets (CSS) and scripting languages such as JavaScript. ${randomEmoji}`;
    } else if (
      userPrompt.toLowerCase().includes("teach") ||
      userPrompt.toLowerCase().includes("myself")
    ) {
      aiResponse = `🏁 Module 1: Introduction to HTML
✅ What is HTML?
✅ Basic structure of an HTML document
✅ Tags, Elements, and Attributes
✅ Common tags:

<html>, <head>, <body>

<h1> to <h6>

<p>, <a>, <img>, <br>, <hr>

<strong>, <em>, <b>, <i>

🔍 Let’s start with a basic example:

html
Copy
Edit
<!DOCTYPE html>
<html>
<head>
  <title>My First Page</title>
</head>
<body>
  <h1>Hello World!</h1>
  <p>This is my first HTML page.</p>
</body>
</html>
📦 Module 2: Working with Text and Formatting
✅ Headings
✅ Paragraphs
✅ Line breaks and horizontal rules
✅ Lists: ordered (<ol>) and unordered (<ul>)
✅ Text formatting:

<strong>, <em>, <mark>, <small>, <del>, <ins>, <sub>, <sup>

🖼️ Module 3: Images and Links
✅ Image tag <img>
✅ Anchor tag <a>
✅ Adding links (internal, external, email)
✅ Image attributes (src, alt, width, height)

🎨 Module 4: Tables and Lists
✅ Creating tables with <table>, <tr>, <td>, <th>
✅ Table attributes: border, cellpadding, cellspacing
✅ Nested tables
✅ Lists (review and nesting)

📝 Module 5: Forms and Input
✅ Form tag <form>
✅ Input types:

Text, password, radio, checkbox, submit, reset
✅ Labels, fieldsets, and legends
✅ Select dropdown and textarea
✅ Form attributes (action, method)

🏗️ Module 6: Semantic HTML
✅ Why semantic tags are important
✅ Tags:

<header>, <footer>, <nav>, <main>, <section>, <article>, <aside>, <figure>, <figcaption>

🎨 Module 7: Multimedia in HTML
✅ Audio and video tags (<audio>, <video>)
✅ Attributes: controls, autoplay, loop
✅ Embedding YouTube videos

🧩 Module 8: Inline Frames and Embeds
✅ <iframe> for embedding content
✅ Attributes of <iframe>: src, height, width
✅ Embedding Google Maps

⚙️ Module 9: Meta and Head Elements
✅ <meta> for SEO and character encoding
✅ Favicon
✅ Linking external stylesheets (<link>)

📄 Module 10: Best Practices & Advanced Topics
✅ Accessibility (alt text, ARIA roles)
✅ SEO basics (meta tags, headings)
✅ HTML entities (e.g., &nbsp;, &copy;)
✅ HTML5 vs. HTML4
✅ Responsive design basics (viewport meta tag)
✅ How to validate your HTML (W3C Validator)

🎓 Module 11: Building a Project
✅ Put it all together:

Build a personal portfolio page

Use headings, lists, images, links, tables, forms

Add semantic HTML tags

Test on different screen sizes.

CSS:

🏁 Module 1: Introduction to CSS
✅ What is CSS?
✅ CSS syntax (selectors, properties, values)
✅ How to include CSS:

Inline (style attribute in HTML tag)

Internal (<style> in <head>)

External (<link rel="stylesheet">)

🔍 Example:

html
Copy
Edit
<!DOCTYPE html>
<html>
<head>
  <title>CSS Example</title>
  <style>
    body {
      background-color: lightblue;
      color: navy;
    }
    h1 {
      text-align: center;
    }
  </style>
</head>
<body>
  <h1>Hello CSS!</h1>
  <p>This is a basic CSS example.</p>
</body>
</html>
🎨 Module 2: Selectors and Properties
✅ Selectors:

Element (e.g., h1)

Class (.my-class)

ID (#my-id)

Grouping (h1, p)

Universal (*)

✅ Properties:

color, background-color, font-size, font-family

text-align, text-decoration, line-height

border, margin, padding

width, height

🧩 Module 3: The Box Model
✅ Content → Padding → Border → Margin
✅ Setting box size (width, height)
✅ Visualizing spacing
✅ Using box-sizing: border-box;

🌈 Module 4: Colors and Backgrounds
✅ Color formats:

Names (red, blue)

Hex (#ff0000)

RGB (rgb(255, 0, 0))

RGBA for transparency (rgba(255, 0, 0, 0.5))

✅ Backgrounds:

background-color

background-image

background-size, background-repeat, background-position

✏️ Module 5: Fonts and Text
✅ Font families (serif, sans-serif)
✅ Google Fonts integration
✅ Font size and units (px, em, rem)
✅ Text alignment, line height, letter spacing
✅ Text shadows

🎯 Module 6: Display and Positioning
✅ display property:

block, inline, inline-block, none, flex, grid
✅ Positioning:

static, relative, absolute, fixed, sticky
✅ z-index for layering

🎛️ Module 7: Advanced Selectors
✅ Pseudo-classes:

:hover, :active, :focus
✅ Pseudo-elements:

::before, ::after
✅ Attribute selectors (e.g., a[target="_blank"])

📐 Module 8: Flexbox Layout
✅ display: flex; basics
✅ Main axis & cross axis
✅ Flex properties: flex-direction, justify-content, align-items, flex-wrap
✅ Practical layouts with Flexbox

🔳 Module 9: CSS Grid Layout
✅ display: grid; basics
✅ grid-template-columns, grid-template-rows
✅ gap, grid-area
✅ Nesting grids

🎢 Module 10: Transitions and Animations
✅ Smooth transitions (transition property)
✅ Keyframe animations (@keyframes)
✅ Transform (rotate, scale, translate)
✅ Animating hover effects

🌐 Module 11: Responsive Design
✅ Viewport meta tag
✅ Media queries (@media)
✅ Breakpoints and mobile-first design
✅ Using percentages, em, rem units

⚙️ Module 12: Best Practices & Advanced Topics
✅ CSS variables (--my-color: red;)
✅ BEM naming convention (block__element--modifier)
✅ CSS frameworks: Bootstrap, Tailwind
✅ How to debug CSS
✅ CSS optimization: minimizing and combining files

🎓 Module 13: Project Practice
✅ Build a responsive personal portfolio website:

Navbar, hero section, about, projects, contact

Use Flexbox, Grid, transitions, and animations

Responsive and mobile-friendly

JAVASCRIPT:

🏁 Module 1: Introduction to JavaScript
✅ What is JavaScript?
✅ Where to put JavaScript:

Inline (<script>...</script>)

External file (<script src="script.js"></script>)

🔍 Example:

html
Copy
Edit
<!DOCTYPE html>
<html>
<head>
  <title>JavaScript Example</title>
</head>
<body>
  <h1>My Page</h1>
  <button onclick="alert('Hello!')">Click Me!</button>
</body>
</html>
🧠 Module 2: Variables and Data Types
✅ var, let, and const
✅ Data types:

String

Number

Boolean

Null

Undefined

Object
✅ Type conversion (casting)

✏️ Module 3: Operators and Expressions
✅ Arithmetic operators: +, -, *, /, %
✅ Assignment operators: =, +=, -=
✅ Comparison operators: ==, ===, !=, !==, <, >
✅ Logical operators: &&, ||, !
✅ Ternary operator (condition ? trueValue : falseValue)

🔁 Module 4: Conditional Statements
✅ if, else if, else
✅ switch statement
✅ Truthy and falsy values

🔄 Module 5: Loops
✅ for loop
✅ while loop
✅ do...while loop
✅ break and continue

🏗️ Module 6: Functions
✅ Declaring functions (function myFunc() {})
✅ Parameters and arguments
✅ Return values
✅ Arrow functions (const add = (a, b) => a + b;)

📦 Module 7: Arrays
✅ Creating arrays (let fruits = ['apple', 'banana', 'mango'];)
✅ Accessing elements (fruits[0])
✅ Array methods:

push(), pop(), shift(), unshift(), splice(), slice(), concat(), join()

🗂️ Module 8: Objects
✅ Creating objects (let person = {name: 'John', age: 30};)
✅ Accessing properties (person.name or person['name'])
✅ Methods inside objects
✅ this keyword

🎯 Module 9: DOM Manipulation
✅ The DOM (Document Object Model)
✅ Selecting elements:

getElementById

getElementsByClassName

querySelector / querySelectorAll
✅ Changing content:

innerHTML, innerText
✅ Changing styles:

element.style
✅ Event listeners:

addEventListener('click', () => {})

🎨 Module 10: Events
✅ Mouse events: click, dblclick, mouseover, mouseout
✅ Keyboard events: keydown, keyup
✅ Form events: submit, change, input

📦 Module 11: ES6+ Features
✅ Let and const (block scope)
✅ Arrow functions
✅ Template literals (Hello, ${name})
✅ Destructuring (const {name, age} = person;)
✅ Spread and rest operators
✅ Default parameters
✅ Modules (export and import)

⚙️ Module 12: JSON and APIs
✅ What is JSON?
✅ JSON.stringify() and JSON.parse()
✅ Fetching data from APIs (fetch API)
✅ Handling responses (.then(), .catch())

🏗️ Module 13: Error Handling
✅ try...catch blocks
✅ Throwing errors
✅ Finally block

🚀 Module 14: Asynchronous JavaScript
✅ Synchronous vs. asynchronous
✅ Callbacks
✅ Promises (.then(), .catch())
✅ async and await

💻 Module 15: Local Storage and Session Storage
✅ Using localStorage
✅ Using sessionStorage
✅ Storing and retrieving data

🎓 Module 16: Final Project
✅ Build a to-do list web app with:

Add/delete tasks

Mark tasks as complete

Save to localStorage
✅ Use DOM manipulation, events, and localStorage


IF YOU WANT TO LEARN MORE ABOUT ANY PARTICULAR TOPIC PLEASE GO TO CHATGPT OR GEMINI. LEARNER AFFAN.
${randomEmoji}`;
    } else if (
      userPrompt.toLowerCase().includes("made") ||
      userPrompt.toLowerCase().includes("myself")
    ) {
      aiResponse = `You are a Learner. Your name is Affan Adil. And you are my creator. I am here to help you Every Time. ${randomEmoji}`;
    } else if (
      userPrompt.toLowerCase().includes("JavaScript") ||
      userPrompt.toLowerCase().includes("js")
    ) {
      aiResponse = `JavaScript is a programming language that is one of the core technologies of the World Wide Web. It is used to make web pages interactive and provides dynamic interactivity. Here's a quick example:\n\`\`\`javascript\nfunction greet(name) {\n  console.log(\`Hello, \${name}!\`);\n}\n\ngreet('World');\n\`\`\`\n${randomEmoji}`;
    } else if (userPrompt.toLowerCase().includes("python")) {
      aiResponse = `Python is a high-level, general-purpose programming language. It’s known for its readability, flexibility, and ease of use. Here’s a concise overview:

✅ Features of Python:

Easy to learn – Clean, simple syntax similar to English.

Versatile – Used for web development, data analysis, AI/ML, automation, game development, and more.

Extensive libraries – Huge collection of modules and libraries for various tasks.

Interpreted language – Runs line by line, making debugging easier.

Open-source – Free to use and supported by a large community.

✅ Example code (Hello World!):

python
Copy
Edit
print("Hello, world!")
If you’re curious about Python’s origins:

Creator: Guido van Rossum

First released: 1991 ${randomEmoji}`;
    } else if (userPrompt.toLowerCase().includes("story1")) {
      aiResponse = `How Small Habits Can Create a Big Impact on Society
Many people adopting small habits can have a significant positive impact on society. Children can contribute to cleaner, healthier, and happier societies with even small activities. 
Daily tooth brushing, for instance, may seem insignificant, yet it keeps individuals healthy and helps them avoid sickness. Turning off faucets can help preserve this valuable resource. Children who adopt these behaviors enhance their health and safeguard the environment.
A tranquil community where everyone feels safe and appreciated is produced by virtues like kindness, deference to elders, and maintaining clean public areas. Children who model these behaviors at home and at school encourage others to follow suit.
These behaviors are also disseminated by technology. People can learn how to develop healthy behaviors and why they are important through social media and videos. Children who create awareness-raising posters or movies encourage more people to support the cause. 
To sum up, little habits have a big impact. Society grows stronger and healthier when both adults and children adopt positive habits on a regular basis. Little actions now can have a significant effect later.
 ${randomEmoji}`;
    } else if (userPrompt.toLowerCase().includes("thank you")) {
      aiResponse = `You're most welcome! I'm here to help anytime. ${randomEmoji}`;
    } else {
      aiResponse = `Sorry for that Learner, I'm still learning, but I'm ready to assist with basic of your coding queries. If your question is very important you can go to ChatGPT or Gemini like models for it. What specific problem are you trying to solve? ${randomEmoji}`;
    }

    appendMessage(aiResponse, "ai");
  }

  // Adjust message input height dynamically
  function adjustInputHeight() {
    messageInput.style.height = "auto"; // Reset height
    messageInput.style.height = messageInput.scrollHeight + "px";
    if (messageInput.scrollHeight > 100) {
      // Max height before showing scrollbar
      messageInput.style.overflowY = "auto";
    } else {
      messageInput.style.overflowY = "hidden";
    }
  }
  messageInput.addEventListener("input", adjustInputHeight);
  adjustInputHeight(); // Initial adjustment

  // --- Simple Code Highlighting (Placeholder) ---
  function highlightCode(code) {
    // This is a very basic, regex-based "highlighting" for demonstration.
    // For a real application, you'd use a library like highlight.js or Prism.js.
    let highlightedCode = code;

    // Keywords
    highlightedCode = highlightedCode.replace(
      /\b(function|var|let|const|if|else|for|while|return|new|import|export|def|print)\b/g,
      '<span class="keyword">$&</span>',
    );
    // Strings
    highlightedCode = highlightedCode.replace(
      /("|')(\\?.)*?\1/g,
      '<span class="string">$&</span>',
    );
    // Comments
    highlightedCode = highlightedCode.replace(
      /(\/\/.*|\/\*[\s\S]*?\*\/|#.*)/g,
      '<span class="comment">$&</span>',
    );
    // Numbers
    highlightedCode = highlightedCode.replace(
      /\b(\d+)\b/g,
      '<span class="number">$&</span>',
    );
    // Operators (simple example)
    highlightedCode = highlightedCode.replace(
      /(=|\+|-|\*|\/|%|<|>|&|\||\!)/g,
      '<span class="operator">$&</span>',
    );

    return highlightedCode;
  }

  // --- Emoji Insertion (Simple) ---
  function addEmojis(text) {
    // You can expand this map with many more emojis!
    const emojiMap = {
      code: "💻",
      coding: "💻",
      program: "👨‍💻",
      project: "📁",
      idea: "💡",
      think: "🧠",
      error: "🐞",
      bug: "🐛",
      fix: "🛠️",
      success: "✅",
      done: "✔️",
      happy: "😊",
      awesome: "🤩",
      great: "👍",
      star: "🌟",
      rocket: "🚀",
      hello: "👋",
      hi: "👋",
      bye: "👋",
      welcome: "🤝",
      question: "❓",
      answer: "💡",
      explain: "🤔",
      learn: "📚",
      data: "📊",
      security: "🔒",
      web: "🌐",
      mobile: "📱",
      database: "🗄️",
      server: "🖥️",
      cloud: "☁️",
      api: "🔗",
      test: "🧪",
      debug: "🔍",
      solution: "✔️",
      warning: "⚠️",
      info: "ℹ️",
      danger: "⛔",
      love: "❤️",
      sparkles: "✨",
      smile: "😄",
      party: "🥳",
      celebrate: "🎉",
      robot: "🤖",
      ai: "🧠",
      neural: "🧠",
      algorithm: "⚙️",
      flow: "🌊",
      logic: "🧠",
      design: "🎨",
      frontend: "🖥️",
      backend: "⚙️",
      database: "🗄️",
      deploy: "🚀",
      git: "🌳",
      github: "🐙",
    };

    let result = text;
    for (const keyword in emojiMap) {
      // Use regex with global flag to replace all occurrences
      const regex = new RegExp(`\\b(${keyword})\\b`, "gi"); // Case-insensitive, global
      result = result.replace(regex, `$1 ${emojiMap[keyword]}`);
    }
    return result;
  }

  // --- Other Button Placeholders (for future functionality) ---
  document.getElementById("savedChatsBtn").addEventListener("click", () => {
    alert("Saved Chats feature coming soon, My Hacker!");
  });

  document.getElementById("newChatBtn").addEventListener("click", () => {
    if (confirm("Start a new chat? Current chat will be cleared Hacker.")) {
      chatDisplay.innerHTML = `
                <div class="message ai-message">
                    <img src="ai.jpg" alt="AI Avatar" class="avatar ai-avatar">
                    <p class="message-text">Hello! I am NOVA, your personal AI coding assistant. How can I help you today?</p>
                </div>
            `;
      chatDisplay.scrollTop = chatDisplay.scrollHeight;
    }
  });

  document.getElementById("tempChatBtn").addEventListener("click", () => {
    alert(
      "Starting a temporary chat. This conversation will not be saved Hacker.",
    );
    // Implement temporary chat logic (e.g., clear chat, mark as temporary)
    chatDisplay.innerHTML = `
            <div class="message ai-message">
                <img src="ai.jpg" alt="AI Avatar" class="avatar ai-avatar">
                <p class="message-text">Welcome to your temporary chat, Hacker AFFAN. This conversation will not be saved. How can I assist?</p>
            </div>
        `;
    chatDisplay.scrollTop = chatDisplay.scrollHeight;
  });

  document.getElementById("fileAccessBtn").addEventListener("click", () => {
    alert(
      "File access feature coming soon! This will allow me to help with your local code files.",
    );
    // Note: Direct file system access from a browser is limited for security.
    // This would typically involve a backend upload mechanism or a very specific browser API like File System Access API
    // which requires user permission for each folder/file and might not be widely supported for 'full PC access'.
  });
});
