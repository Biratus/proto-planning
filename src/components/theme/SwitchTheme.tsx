import { Moon, Sun } from "react-feather";

export default function SwitchTheme({}) {
  return (
    <div className="flex gap-2">
      <Sun />
      <input
        type="checkbox"
        className="toggle"
        data-toggle-theme="light,dark"
      />
      <Moon />
    </div>
  );
}
