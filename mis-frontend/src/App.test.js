import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders login page when unauthenticated", () => {
  localStorage.clear();
  render(<App />);
  expect(screen.getByText(/University MIS/i)).toBeInTheDocument();
  expect(screen.getByRole("button", { name: /Sign in/i })).toBeInTheDocument();
});
