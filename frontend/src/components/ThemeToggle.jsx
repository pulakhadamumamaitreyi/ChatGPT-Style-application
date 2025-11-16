export default function ThemeToggle({ theme, setTheme }){
  return (
    <button onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} className="px-3 py-1 rounded bg-gray-200 dark:bg-gray-700">
      {theme === 'dark' ? 'Light' : 'Dark'}
    </button>
  )
}
