import MarkdownEditor from './components/custom/MarkdownEditor';
import { ThemeProvider } from './context/ThemeProvider';
import { ModeToggle } from '@/components/custom/MoonToggle';

const App: React.FC = () => {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <div className="min-h-screen bg-background text-foreground">
        <div className="w-full h-screen flex flex-col p-2 sm:p-4 lg:p-6">
          <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6 px-2 sm:px-0">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">
              Markdown Editor
            </h1>
            <ModeToggle />
          </header>
          <div className="flex-1 rounded-lg bg-card text-card-foreground shadow-sm">
            <MarkdownEditor />
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default App;
