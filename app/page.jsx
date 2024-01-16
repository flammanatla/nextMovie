"use client";

import Image from "next/image";

import { useEffect, useRef, useState } from "react";

import { useKey } from "./components/useKey.js";

export default function Home() {
  const [query, setQuery] = useState("");
  return (
    <>
      <NavBar>
        <Logo />
        <Search query={query} setQuery={setQuery} />
      </NavBar>
    </>
  );
}

function Logo() {
  return (
    <a href="/" id="logo-link">
      <img src="img/nextMovie_logo.svg" alt="Logo" class="header__logo" />
    </a>
  );
}

function NavBar({ children }) {
  return <nav className="nav-bar">{children}</nav>;
}

function Search({ query, setQuery }) {
  const inputEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === inputEl.current) {
      return;
    }

    inputEl.current.focus();
    setQuery("");
  });

  return (
    <input
      className="search"
      type="text"
      placeholder="Search over 300 000 movies..."
      value={query}
      onChange={(e) => setQuery(e.target.value)}
      ref={inputEl}
    />
  );
}
