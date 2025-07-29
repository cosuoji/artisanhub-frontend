import { useThemeStore } from '../store/useThemeStore';
import { FaMoon, FaSun } from 'react-icons/fa';


function ThemeToggle() {
  const { dark, toggle } = useThemeStore();
  return (
    <button
      onClick={toggle}
      className="btn btn-circle btn-sm btn-ghost"
    >
      {dark ? <FaSun /> : <FaMoon />}
    </button>
  );
}

export default ThemeToggle