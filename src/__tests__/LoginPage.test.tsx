import React from "react";
import { render, screen } from "@testing-library/react";
import LoginPage from "../app/login/page";

describe("LoginPage", () => {
  it("renders the login form", () => {
    render(<LoginPage />);
    expect(screen.getByRole("heading", { name: "Login" })).toBeInTheDocument();
  });
});
