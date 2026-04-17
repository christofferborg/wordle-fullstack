import { render, screen, fireEvent } from "@testing-library/react";
import StartView from "./StartView";
import { vi } from "vitest";

describe("StartView", () => {
  it("should call onStart with length and duplicates when start button is clicked", () => {
    
    const mockStart = vi.fn();
    render(<StartView onStart={mockStart} />);

    const dropdown = screen.getByRole("combobox");
    const checkbox = screen.getByRole("checkbox");
    const button = screen.getByRole("button", { name: /Start/i });

    // Ändra värden
    fireEvent.change(dropdown, { target: { value: "6" } });
    fireEvent.click(checkbox);
    fireEvent.click(button);

    
    expect(mockStart).toHaveBeenCalledWith(6, true);
  });
});
