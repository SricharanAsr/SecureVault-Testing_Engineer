import { Route, Switch, useLocation, Redirect } from 'wouter';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Unlock from './pages/Unlock';
import Dashboard from './pages/Dashboard';
import Settings from './pages/Settings';
import Transparency from './pages/Transparency';
import ExtensionMockup from './pages/ExtensionMockup';
import Insights from './pages/Insights';

import ErrorBoundary from '@/app/components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import { AutoLockProvider } from './contexts/AutoLockContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { VaultProvider } from './contexts/VaultContext';
import './index.css';

/**
 * Component to protect routes that require authentication.
 * Redirects to Landon page if user is not authenticated.
 */
function ProtectedRoute({ component: Component, ...rest }: { component: React.ComponentType, path: string }) {
    const { isAuthenticated, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full"
                />
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Redirect to="/" />;
    }

    return (
        <Route {...rest}>
            <PageTransition>
                <Component />
            </PageTransition>
        </Route>
    );
}

/**
 * Wrapper component for page transitions using framer-motion.
 * Provides a standard entry/exit animation for all views.
 * 
 * @param props - React children.
 */
function PageTransition({ children }: { children: React.ReactNode }) {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
        >
            {children}
        </motion.div>
    );
}

/**
 * Main application entry point for routing and global providers.
 * Sets up the routing table, global context providers, and global keyboard shortcuts.
 * 
 * @returns React application root.
 */
function App() {
    const [location, setLocation] = useLocation();

    // Global keyboard shortcuts
    useEffect(() => {
        const handleGlobalShortcuts = (e: KeyboardEvent) => {
            // Ctrl+L to Lock (navigate to /unlock)
            if ((e.ctrlKey || e.metaKey) && (e.key === 'l' || e.key === 'L')) {
                e.preventDefault();
                setLocation('/unlock');
            }

            // Ctrl+, for settings
            if ((e.ctrlKey || e.metaKey) && e.key === ',') {
                e.preventDefault();
                setLocation('/settings');
            }
        };

        window.addEventListener('keydown', handleGlobalShortcuts);
        return () => window.removeEventListener('keydown', handleGlobalShortcuts);
    }, [setLocation]);

    return (
        <ErrorBoundary>
            <ToastProvider>
                <ThemeProvider>
                    <AuthProvider>
                        <VaultProvider>
                            <AutoLockProvider>
                                <AnimatePresence mode="wait">
                                    <Switch location={location} key={location}>
                                        <Route path="/" component={Landing} />
                                        <Route path="/register" component={Register} />
                                        <Route path="/unlock" component={Unlock} />

                                        <ProtectedRoute path="/dashboard" component={Dashboard} />
                                        <ProtectedRoute path="/settings" component={Settings} />
                                        <ProtectedRoute path="/insights" component={Insights} />
                                        <ProtectedRoute path="/extension" component={ExtensionMockup} />

                                        <Route path="/transparency">
                                            <PageTransition>
                                                <Transparency />
                                            </PageTransition>
                                        </Route>

                                        <Route>
                                            <div className="min-h-screen flex items-center justify-center bg-background">
                                                <div className="text-center">
                                                    <h1 className="text-4xl font-bold mb-4">404</h1>
                                                    <p className="text-muted-foreground">Page not found</p>
                                                </div>
                                            </div>
                                        </Route>
                                    </Switch>
                                </AnimatePresence>
                            </AutoLockProvider>
                        </VaultProvider>
                    </AuthProvider>
                </ThemeProvider>
            </ToastProvider>
        </ErrorBoundary>
    );
}

export default App;
